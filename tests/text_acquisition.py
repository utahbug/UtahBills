"""Isolated 2027 fixtures; never write synthetic production records."""
import sys,pathlib,tempfile,json,hashlib,copy,unittest,datetime as dt
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import refresh_text as r,version_model as v
class Acquisition(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.tmp.name);(self.root/'data').mkdir();self.n=0
  self.patches=[patch.object(r,'ROOT',self.root),patch.object(v,'read',side_effect=r.read)]
  for p in self.patches:p.start()
  self.old=dict(schemaVersion=1,entries={});self.stamp='2027-01-20T12:00:00+00:00';self.calls=[]
 def tearDown(self):
  for p in reversed(self.patches):p.stop()
  self.tmp.cleanup()
 def xml(self,sub=0,word='Verified fixture text',session='2027GS',bill='HB0001'):
  return f'<leg sess="{session}" billnum="{bill}" subVer="{sub}" subNumber="{sub:02}"><bdy><bsec num="1-1-1" uid="1"><section><sectionText>{word}</sectionText></section></bsec></bdy></leg>'.encode()
 def catalog(self,types=('Introduced',),number='HB0001',urls=None):
  versions={};body=dict(sessionID='2027GS',billNumber=number,trackingID='FIXTURE',billVersionList=[])
  for i,kind in enumerate(types):
   ver=number+('S01' if kind in ('PubSub','Enrolled') else '')
   name=('AV_'+ver+'_2027-01-20_12-00-00' if kind=='Amended' else number if kind=='Enrolled' else ver)
   folder='amended' if kind=='Amended' else 'enrolled' if kind=='Enrolled' else 'introduced'
   url=urls[i] if urls else f'https://le.utah.gov/Session/2027/bills/{folder}/{name}.xml'
   versions.setdefault(ver,[]).append(dict(fileType=kind,fileName=name+'.xml',url=url,fileDate='',shortDesc=kind))
  body['billVersionList']=[dict(billNumber=k,billDocs=d) for k,d in versions.items()]
  return self.save_catalog(body)
 def save_catalog(self,body):
  raw=json.dumps(body).encode();sha=hashlib.sha256(raw).hexdigest();path=self.root/(sha+'.json');path.write_bytes(raw)
  source=dict(path=str(path),sha256=sha,url='https://le.utah.gov/data/2027GS/'+body['billNumber']+'.json',retrievedAt=self.stamp)
  return dict(records={'2027/'+body['billNumber']:source})
 def fetch(self,url,headers):
  self.calls.append((url,headers));return self.xml(sub=1 if 'S01' in url or 'enrolled' in url else 0),{'ETag':'"one"'}
 def acquire(self,catalog,old=None,**kw):return r.acquire(catalog,old or self.old,stamp=self.stamp,fetcher=kw.pop('fetcher',self.fetch),**kw)
 def test_first_substitute_amended_and_comparison(self):
  c=self.catalog(('Introduced','PubSub','Amended','Enrolled','PubAmend','AmdPages'));state,report=self.acquire(c)
  self.assertEqual(report['counts']['verified'],4);self.assertEqual(len(self.calls),4)
  b=json.loads(r.read(next(iter(c['records'].values()))));available={e['verified']['url']:e['verified'] for e in state['entries'].values()}
  p=v.project(b,next(iter(c['records'].values())),available,state['entries'])
  self.assertEqual(sum(bool(g['text']) for g in p['groups']),4)
  self.assertTrue(all(not g['text'] for g in p['groups'] if g['fileType'] in ('PubAmend','AmdPages')))
  for e in state['entries'].values():r.validate_entry(e)
 def test_unchanged_skips_and_conditional_recheck(self):
  c=self.catalog();state,_=self.acquire(c);again,_=self.acquire(c,state);self.assertEqual(len(self.calls),1)
  self.stamp='2027-01-28T12:00:00+00:00'
  def unchanged(url,headers):self.assertEqual(headers,{'If-None-Match':'"one"'});return None,{}
  again,report=self.acquire(c,again,fetcher=unchanged);e=next(iter(again['entries'].values()));self.assertEqual(len(e['revisions']),1);self.assertEqual(report['status'],'success')
 def test_same_url_revision_and_rejected_retains_prior(self):
  c=self.catalog();state,_=self.acquire(c);first=copy.deepcopy(next(iter(state['entries'].values()))['verified']);self.stamp='2027-01-28T12:00:00+00:00'
  state,_=self.acquire(c,state,fetcher=lambda *args:(self.xml(word='Changed source wording'),{}));e=next(iter(state['entries'].values()));self.assertEqual(len(e['revisions']),2);self.assertNotEqual(first['sha256'],e['verified']['sha256']);r.read(first)
  verified=copy.deepcopy(e['verified']);self.stamp='2027-02-05T12:00:00+00:00'
  state,report=self.acquire(c,state,fetcher=lambda *args:(b'<malformed',{}));e=next(iter(state['entries'].values()));self.assertEqual(e['status'],'rejected');self.assertEqual(e['availability'],'verified');self.assertEqual(e['verified'],verified);self.assertEqual(report['status'],'partial');r.read(e['lastResponse'])
  state,report=self.acquire(c,state,fetcher=self.fetch);self.assertEqual(report['status'],'success');self.assertEqual(len(next(iter(state['entries'].values()))['revisions']),3)
 def test_identical_recheck_no_duplicate_revision(self):
  c=self.catalog();state,_=self.acquire(c);self.stamp='2027-01-28T12:00:00+00:00';state,_=self.acquire(c,state)
  self.assertEqual(len(next(iter(state['entries'].values()))['revisions']),1)
 def test_partial_limit_failure_and_recovery(self):
  c=self.catalog(('Introduced','PubSub'));state,report=self.acquire(c,limit=1);self.assertEqual(report['counts']['deferred'],1);self.assertEqual(report['status'],'partial')
  def fail(*args):raise TimeoutError('fixture unavailable')
  state,report=self.acquire(c,state,fetcher=fail);self.assertEqual(report['counts']['failed'],1);self.assertEqual(report['counts']['verified'],1)
  state,report=self.acquire(c,state);self.assertEqual(report['counts']['verified'],2);self.assertEqual(report['status'],'success')
 def test_session_version_url_type_and_invalid_xml(self):
  for xml in (self.xml(session='2026GS'),self.xml(bill='HB0002'),self.xml(sub=1),b'<!DOCTYPE leg><leg/>',b'<leg/>',b''):
   state,report=self.acquire(self.catalog(),fetcher=lambda *args:(xml,{}));self.assertEqual(report['counts']['rejected'],1);self.assertFalse(next(iter(state['entries'].values())).get('verified'))
  for url in ('https://le.utah.gov/Session/2026/bills/introduced/HB0001.xml','https://le.utah.gov/Session/2027/bills/introduced/HB0002.xml','https://le.utah.gov/Session/2027/bills/introduced/HB0001.xml?x=1'):
   self.calls=[];state,report=self.acquire(self.catalog(urls=[url]));self.assertEqual(report['counts']['rejected'],1);self.assertEqual(self.calls,[])
 def test_missing_xml_and_no_historical_crawl(self):
  c=self.catalog(urls=['https://le.utah.gov/Session/2027/bills/introduced/HB0001.pdf']);c['records']['2026/HB0001']={'invalid':'must not read'}
  state,report=self.acquire(c);self.assertEqual(report['counts']['not_retrieved'],1);self.assertEqual(self.calls,[])
 def test_budget_and_fair_continuation(self):
  c=self.catalog(('Introduced','PubSub'));state,report=self.acquire(c,clock=iter([0,241,242]).__next__);self.assertEqual(report['counts']['deferred'],2)
  state,report=self.acquire(c,state,limit=1);self.assertEqual(report['counts']['verified'],1)
  state,report=self.acquire(c,state,limit=1);self.assertEqual(report['counts']['verified'],2)
 def test_checksum_and_pinned_relationship_rejected(self):
  c=self.catalog();state,_=self.acquire(c);e=next(iter(state['entries'].values()));path=self.root/e['verified']['path'];path.write_bytes(b'corrupt')
  with self.assertRaisesRegex(AssertionError,'checksum|Checksum'):self.acquire(c,state)
 def test_atomic_failure_preserves_manifest(self):
  target=self.root/'data/text-2027.json';target.write_text(json.dumps(self.old));before=target.read_bytes();(self.root/'data/catalog.json').write_text(json.dumps({'records':{}}))
  with patch.object(r,'TARGET',target),patch.object(r,'REPORT',self.root/'report.json'),patch('catalog_model.derive',side_effect=ValueError('invalid catalog')):
   with self.assertRaises(ValueError):r.run()
  self.assertEqual(target.read_bytes(),before)
 def test_duplicate_pdf_and_unknown_dates(self):
  c=self.catalog();b=json.loads(r.read(next(iter(c['records'].values()))));d=b['billVersionList'][0]['billDocs'][0];b['billVersionList'][0]['billDocs'].append({**d,'url':d['url'].replace('.xml','.pdf'),'fileName':'HB0001.pdf'})
  state,report=self.acquire(self.save_catalog(b));self.assertEqual(report['counts']['verified'],1);self.assertEqual(len(self.calls),1)
 def test_retry_bound_and_304_without_prior(self):
  state,report=self.acquire(self.catalog(),fetcher=lambda *args:(None,{}));self.assertEqual(report['counts']['rejected'],1)
  with patch.object(r.urllib.request,'build_opener') as opener,patch.object(r.time,'sleep'):
   opener.return_value.open.side_effect=TimeoutError('timeout')
   with self.assertRaises(TimeoutError):r.fetch('https://le.utah.gov/test',{})
   self.assertEqual(opener.return_value.open.call_count,2)
 def test_changed_metadata_rechecks_same_url_immediately(self):
  c=self.catalog();state,_=self.acquire(c);b=json.loads(r.read(next(iter(c['records'].values()))));b['billVersionList'][0]['billDocs'][0]['fileDate']='2027-01-20'
  state,report=self.acquire(self.save_catalog(b),state);self.assertEqual(len(self.calls),2);self.assertEqual(len(next(iter(state['entries'].values()))['revisions']),1)
 def test_build_projection_coverage_and_reproducibility(self):
  c=self.catalog(('Introduced','PubSub'));state,_=self.acquire(c)
  for name,value in [('catalog.json',c),('sources.json',[]),('version-text.json',{'sources':[]}),('text-2027.json',state)]:
   (self.root/'data'/name).write_text(json.dumps(value),encoding='utf-8')
  detail=self.root/'dist/data/measures/2027GS/HB0001.json';detail.parent.mkdir(parents=True);detail.write_text('{}')
  with patch.object(v,'ROOT',self.root),patch.object(r,'TARGET',self.root/'data/text-2027.json'):
   report=v.build();first=detail.read_bytes();report2=v.build();self.assertEqual(first,detail.read_bytes());self.assertEqual(report,report2)
  self.assertEqual(report['sessions']['2027']['bills']['comparableMeasures'],1);self.assertEqual(report['sessions']['2027']['bills']['textDocuments']['verified'],2)
  self.assertEqual(sum(bool(g['text']) for g in json.loads(first)['versionTransparency']['groups']),2)
 def test_resolution_and_rejected_failure_reporting(self):
  c=self.catalog(number='SJR0001');state,report=self.acquire(c,fetcher=lambda *args:(self.xml(bill='SJR0001'),{}));self.assertEqual(report['counts']['verified'],1)
  self.stamp='2027-01-28T12:00:00+00:00';state,report=self.acquire(c,state,fetcher=lambda *args:(b'bad',{}));state,report=self.acquire(c,state,limit=0)
  row=report['documents'][0];self.assertEqual(row['status'],'deferred');self.assertEqual(row['lastOutcome'],'rejected');self.assertEqual(row['availability'],'verified')
 def test_failed_atomic_replace_reports_failure(self):
  target=self.root/'data/text-2027.json';target.write_text(json.dumps(self.old));before=target.read_bytes();(self.root/'data/catalog.json').write_text(json.dumps({'records':{}}))
  with patch.object(r,'TARGET',target),patch.object(r,'REPORT',self.root/'report.json'),patch('catalog_model.derive'),patch.object(r.os,'replace',side_effect=OSError('fixture write failure')):
   with self.assertRaises(OSError):r.run()
  self.assertEqual(target.read_bytes(),before);self.assertEqual(json.loads((self.root/'report.json').read_text())['status'],'failed')
 def test_pre_session_amended_filename_year_not_session_identity(self):
  c=self.catalog(('Amended',));b=json.loads(r.read(next(iter(c['records'].values()))));d=b['billVersionList'][0]['billDocs'][0]
  d['url']=d['url'].replace('_2027-01-20','_2026-12-20');d['fileName']=d['fileName'].replace('_2027-01-20','_2026-12-20')
  state,report=self.acquire(self.save_catalog(b));self.assertEqual(report['counts']['verified'],1)
if __name__=='__main__':unittest.main()
