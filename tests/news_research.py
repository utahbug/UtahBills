import copy, hashlib, json, sys, tempfile, unittest
from pathlib import Path
from datetime import datetime, timezone, timedelta
from xml.sax.saxutils import escape
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import news_research as n
NOW=datetime(2026,11,23,23,tzinfo=timezone.utc)
SOURCE={'name':'Example News','feed':'https://news.example/feed/','enabled':True,'reason':'fixture permission','reviewedOn':'2026-11-23'}
def rss(items):
    return ('<rss xmlns:dc="http://purl.org/dc/elements/1.1/"><channel>'+''.join('<item><title>'+escape(x.get('title','Utah lawmakers discuss nuclear regulation'))+'</title><link>'+escape(x.get('url','https://news.example/story'))+'</link><guid>'+escape(x.get('guid','story-1'))+'</guid><pubDate>'+escape(x.get('date','Mon, 23 Nov 2026 10:00:00 -0700'))+'</pubDate><dc:creator>Example Author</dc:creator><description>BODY MUST NOT BE STORED</description></item>' for x in items)+'</channel></rss>').encode()
class Fetch:
    def __init__(self,body=None,code=200,robots=b'User-agent: *\nAllow: /',error=False):self.body=body if body is not None else rss([{}]);self.code=code;self.robots=robots;self.error=error;self.calls=[]
    def __call__(self,url,headers):
        self.calls.append((url,headers))
        if url.endswith('robots.txt'):return 200,self.robots,{}
        if self.error:raise TimeoutError('fixture timeout')
        return self.code,self.body,{'ETag':'"fixture"','Last-Modified':'Mon, 23 Nov 2026 17:00:00 GMT'}
class NewsResearch(unittest.TestCase):
    def initial(self):return n.refresh(None,{'example':SOURCE},NOW,Fetch())
    def test_metadata_only(self):
        state=self.initial();self.assertEqual(len(state['articles']),1);self.assertNotIn('BODY MUST',json.dumps(state));self.assertFalse(state['publicationEnabled']);self.assertEqual(state['sources']['example']['status'],'success')
        value=next(iter(state['articles'].values()))['revisions'][0]['metadata'];self.assertEqual(value['publication']['instant'],'2026-11-23T17:00:00+00:00')
    def test_disabled_sources_never_contacted(self):
        f=Fetch();s=n.refresh(None,{'example':{**SOURCE,'enabled':False}},NOW,f);self.assertEqual(f.calls,[]);self.assertEqual(s['sources']['example']['status'],'disabled')
        configured=json.loads((n.ROOT/'scripts/news_sources.json').read_text());self.assertEqual([k for k,v in configured.items() if v['enabled']],['dispatch'])
    def test_failure_preserves_accepted_metadata(self):
        old=self.initial()
        for f in [Fetch(error=True),Fetch(rss([])),Fetch(b'<html>denied</html>'),Fetch(b'<rss'),Fetch(code=429),Fetch(rss([{'url':'https://evil.example/x'}]))]:
            result=n.refresh(old,{'example':SOURCE},NOW+timedelta(days=1),f);self.assertEqual(result['articles'],old['articles']);self.assertEqual(result['sources']['example']['lastSuccess'],old['sources']['example']['lastSuccess']);self.assertEqual(result['sources']['example']['status'],'failed');self.assertEqual(old,self.initial())
    def test_failure_is_independent(self):
        result=n.refresh(None,{'disabled':{**SOURCE,'enabled':False},'good':SOURCE},NOW,Fetch());self.assertEqual(result['sources']['disabled']['status'],'disabled');self.assertEqual(result['sources']['good']['status'],'success')
    def test_robots_and_expired_permission(self):
        for source,f in [(SOURCE,Fetch(robots=b'User-agent: *\nDisallow: /')),(SOURCE,Fetch(robots=b'<html>Access denied</html>')),(dict(SOURCE,reviewedOn='2026-01-01'),Fetch())]:
            result=n.refresh(None,{'example':source},NOW,f);self.assertEqual(result['sources']['example']['status'],'failed');self.assertFalse(any(not u.endswith('robots.txt') for u,h in f.calls))
    def test_conditional_and_missing_baseline(self):
        old=self.initial();f=Fetch(code=304);result=n.refresh(old,{'example':SOURCE},NOW+timedelta(hours=1),f);self.assertEqual(result['articles'],old['articles']);self.assertEqual(f.calls[-1][1]['If-None-Match'],'"fixture"');self.assertEqual(result['sources']['example']['status'],'not-modified');self.assertEqual(n.refresh(None,{'example':SOURCE},NOW,Fetch(code=304))['sources']['example']['status'],'failed')
    def test_duplicate_correction_disappearance(self):
        f=Fetch(rss([{},dict(url='https://news.example/story?utm_source=x#section',guid='duplicate')]));state=n.refresh(None,{'example':SOURCE},NOW,f);self.assertEqual(len(state['articles']),1)
        new=n.refresh(state,{'example':SOURCE},NOW+timedelta(hours=1),Fetch(rss([dict(title='Utah lawmakers correct nuclear proposal details')])));self.assertEqual(len(next(iter(new['articles'].values()))['revisions']),2)
        newer=n.refresh(new,{'example':SOURCE},NOW+timedelta(hours=2),Fetch(rss([dict(url='https://news.example/new',guid='new')])));self.assertEqual(len(newer['articles']),2)
    def test_canonical_change_preserves_identity_and_conflict_retains_snapshot(self):
        old=self.initial();ident=next(iter(old['articles']))
        changed=n.refresh(old,{'example':SOURCE},NOW,Fetch(rss([dict(url='https://news.example/new-canonical')])));self.assertEqual(list(changed['articles']),[ident]);self.assertEqual(len(changed['articles'][ident]['revisions']),2)
        two=n.refresh(old,{'example':SOURCE},NOW,Fetch(rss([dict(url='https://news.example/second',guid='second')])));conflict=n.refresh(two,{'example':SOURCE},NOW,Fetch(rss([dict(url='https://news.example/second',guid='story-1')])));self.assertEqual(conflict['sources']['example']['status'],'failed');self.assertEqual(conflict['articles'],two['articles'])
    def test_conflicting_guids_and_duplicates(self):
        for rows in [[{},dict(url='https://news.example/different')],[{},dict(guid='different',title='Conflicting headline')]]:self.assertRaises(ValueError,n.metadata,rss(rows),SOURCE,NOW)
    def test_xml_and_urls(self):
        for body in [b'<!DOCTYPE rss [<!ENTITY boom "x">]><rss/>',b'\x00<rss/>',b'x'*(n.MAX_BYTES+1)]:self.assertRaises(ValueError,n.metadata,body,SOURCE,NOW)
        for url in ['http://news.example/x','https://news.example.evil/x','https://user@news.example/x','javascript:alert(1)']:self.assertRaises(ValueError,n.canonical,url,'news.example')
        self.assertRaises(ValueError,n.Redirect('news.example').redirect_request,None,None,302,'',{},'https://evil.example/x')
        self.assertNotEqual(n.canonical('https://news.example/x?id=1','news.example'),n.canonical('https://news.example/x?id=2','news.example'))
    def test_date_precision(self):
        self.assertFalse(n.stamp('Mon, 23 Nov 2026 10:00:00',NOW)['timezoneKnown']);self.assertIsNone(n.stamp('2026-11-23',NOW)['instant']);self.assertRaises(ValueError,n.stamp,'2027-11-23',NOW)
    def test_candidates_never_verified_or_collapsed(self):
        state=self.initial();official=[{'key':'2027GS/request/A','sessionID':'2027GS','title':'Nuclear Regulation Amendments'},{'key':'2027GS/request/B','sessionID':'2027GS','title':'Nuclear Regulation Modifications'}];q=n.research_queue(state,official);self.assertEqual(len(q[0]['candidates']),2);self.assertTrue(all(c['verification']=='unverified' for c in q[0]['candidates']));self.assertFalse(q[0]['publishable'])
        cases=json.loads((n.ROOT/'docs/evidence/NEWS_002_CASES.json').read_text());self.assertEqual(len(cases['proposals']),5);self.assertEqual(len(set(c['topic'] for c in cases['proposals'])),4);self.assertEqual(cases['approvedAssociations'],[])
    def test_named_lawmaker_is_not_inferred_sponsor(self):
        opposed=n.refresh(None,{'example':SOURCE},NOW,Fetch(rss([dict(title='Sen. Karen Kwan opposes nuclear regulation')])));q=n.research_queue(opposed,[])[0];self.assertEqual(q['reportedPeople'],['Karen Kwan']);self.assertEqual(q['reportedSponsors'],[])
        introduced=n.refresh(None,{'example':SOURCE},NOW,Fetch(rss([dict(title='Sen. Karen Kwan introduces nuclear regulation proposal')])));q=n.research_queue(introduced,[])[0];self.assertEqual(q['reportedSponsors'],['Karen Kwan']);self.assertEqual(q['verification'],'unverified')
    def test_editorial_decisions_revision_gate(self):
        state=self.initial();ident=next(iter(state['articles']));revision=state['articles'][ident]['revisions'][-1]['hash']
        self.assertRaises(ValueError,n.decide,state,ident,revision,'proposal','accept','Reviewer','rationale',[])
        for decision in ['accept','reject','defer']:n.decide(state,ident,revision,'separate proposal '+decision,decision,'Reviewer','Fixture rationale',['https://le.utah.gov/interim/2026/pdf/example.pdf'])
        self.assertEqual(len(state['decisions']),3);self.assertTrue(all(not d['publishable'] and d['verification']=='unverified' for d in state['decisions']))
        corrected=n.refresh(state,{'example':SOURCE},NOW,Fetch(rss([dict(title='Utah lawmakers revise nuclear regulation')])));self.assertRaises(ValueError,n.decide,corrected,ident,revision,'proposal','accept','Reviewer','why',['https://le.utah.gov/x']);self.assertEqual(n.research_queue(corrected,[])[0]['editorialDecisions'],[]);self.assertEqual(len(corrected['decisions']),3)
        self.assertRaises(ValueError,n.decide,state,ident,revision,'proposal','accept','Reviewer','why',['https://le.utah.gov/x'],'description')
    def test_saved_introduced_identity_and_checksums(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);(root/'data').mkdir();sources={}
            for key,raw in [('requests2027',json.dumps([{'trackingID':'ABC','shortTitle':'Digital Plates','sponsor':'KWANK'}])),('index2027',json.dumps([{'number':'HB0001'}])),('roster2026','<table><tr><td>Karen Kwan</td><td>Senator</td><td><a href="?Listbox3=KWANK">source</a></td><td>12</td></tr></table>')]:
                file='data/'+key+'.txt';body=raw.encode();(root/file).write_bytes(body);sources[key]={'path':file,'sha256':hashlib.sha256(body).hexdigest(),'url':'https://le.utah.gov/example','retrievedAt':'2026-11-15T00:00:00Z'}
            body=json.dumps({'sessionID':'2027GS','billNumber':'HB0001','shortTitle':'Digital Plates','primeSponsorName':'Karen Kwan'}).encode();(root/'data/bill.json').write_bytes(body);record={'path':'data/bill.json','sha256':hashlib.sha256(body).hexdigest()};manifest={'sources':sources,'checkedAt':'2026-11-15T00:00:00Z','records':{'2027/HB0001':record}};(root/'data/catalog.json').write_text(json.dumps(manifest))
            records,checked=n.official_records(root);self.assertEqual(records[0]['sponsorNames'],['Karen Kwan']);self.assertEqual(records[0]['nameEvidenceSession'],'2026GS');self.assertEqual(records[1]['key'],'2027GS/bill/HB0001')
            (root/'data/bill.json').write_text('{}');self.assertRaises(ValueError,n.official_records,root)
    def test_source_failure_does_not_block_another_enabled_source(self):
        def transport(url,headers):
            if url.endswith('robots.txt'):return 200,b'User-agent: *'+bytes([10])+b'Allow: /',{}
            if 'bad.example' in url:raise TimeoutError('fixture unavailable')
            return 200,rss([{}]),{}
        sources={'bad':dict(SOURCE,feed='https://bad.example/feed/'),'good':SOURCE};state=n.refresh(None,sources,NOW,transport);self.assertEqual(state['sources']['bad']['status'],'failed');self.assertEqual(state['sources']['good']['status'],'success');self.assertEqual(len(state['articles']),1)
    def test_atomic_and_no_publication_wiring(self):
        with tempfile.TemporaryDirectory() as tmp:
            path=Path(tmp)/'state.json';n.atomic(path,{'a':1});n.atomic(path,{'a':2});self.assertEqual(json.loads(path.read_text()),{'a':2});self.assertEqual(len(list(Path(tmp).iterdir())),1)
        workflow=(n.ROOT/'.github/workflows/pages.yml').read_text();self.assertNotIn('news_research.py',workflow)
        for name in ['scripts/build.mjs','scripts/package-review.mjs']:
            content=(n.ROOT/name).read_text();self.assertNotIn('news-research',content);self.assertNotIn('news_research',content)
if __name__=='__main__':unittest.main()
