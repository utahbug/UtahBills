"""Manually invoked, metadata-only news research. Never imports from or writes to a publication pipeline."""
import argparse, copy, hashlib, json, os, re, tempfile
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit, parse_qsl, urlencode
from urllib.request import Request, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
from urllib.robotparser import RobotFileParser
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
OUTPUT=ROOT/'test-results'/'news-research'
AGENT='UtahBillsResearch/0.1 (+https://legislation.utahbug.com/; metadata-only research)'
MAX_BYTES=4*1024*1024
STOP=set('the a an and or of to for in on with by utah amendments amendment modifications modification revisions revision bill legislation proposed proposal lawmakers would'.split())
TOPICS={'municipalities':['municipal','municipality','municipalities','incorporation'], 'nuclear':['nuclear','radioactive'], 'data-centers':['data center','data centers','mida'], 'digital-plates':['digital license plate','digital plates'], 'legislature':['legislature','legislative','lawmakers','senator','senate','bill','rep.','sen.']}

def digest(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=False).encode()).hexdigest()

def canonical(url,host):
    u=urlsplit(url)
    if u.scheme!='https' or u.hostname!=host or u.username or u.password or u.port not in (None,443):
        raise ValueError('Unapproved URL or redirect host')
    query=urlencode([(k,v) for k,v in parse_qsl(u.query,keep_blank_values=True) if not k.lower().startswith('utm_') and k.lower() not in ('fbclid','gclid')])
    return urlunsplit(('https',host,u.path,query,''))

class Redirect(HTTPRedirectHandler):
    max_redirections=3
    max_repeats=1
    def __init__(self,host): self.host=host
    def redirect_request(self,req,fp,code,msg,headers,newurl):
        canonical(newurl,self.host)
        return super().redirect_request(req,fp,code,msg,headers,newurl)

def fetch(url,headers=None):
    host=urlsplit(url).hostname
    canonical(url,host)
    req=Request(url,headers={'User-Agent':AGENT,'Accept':'application/rss+xml, application/xml, text/plain;q=0.8',**(headers or {})})
    try:
        with build_opener(Redirect(host)).open(req,timeout=15) as response:
            body=response.read(MAX_BYTES+1)
            if len(body)>MAX_BYTES: raise ValueError('Response exceeds size limit')
            return response.status,body,dict(response.headers.items())
    except HTTPError as error:
        if error.code==304:return 304,b'',dict(error.headers.items())
        # Do not retry 403/429 or expose response bodies. A later manual run may try again.
        raise ValueError('HTTP '+str(error.code)) from error

def stamp(raw,now):
    try: value=parsedate_to_datetime(raw)
    except (ValueError,TypeError): value=datetime.fromisoformat(raw.replace('Z','+00:00'))
    if value.date()>now.date()+timedelta(days=1) or (value.tzinfo is not None and value>now+timedelta(minutes=10)):raise ValueError('Future publication date')
    return {'raw':raw,'date':value.date().isoformat(),'timezoneKnown':value.tzinfo is not None,
            'instant':value.astimezone(timezone.utc).isoformat() if value.tzinfo else None}

def metadata(body,source,now):
    if len(body)>MAX_BYTES or re.search(br'<!\s*(DOCTYPE|ENTITY)',body,re.I) or b'\x00' in body:
        raise ValueError('Oversized or unsafe XML')
    root=ET.fromstring(body)
    if root.tag!='rss' or root.find('channel') is None:raise ValueError('Expected RSS channel')
    nodes=root.findall('./channel/item')
    if not nodes or len(nodes)>200:raise ValueError('Empty or excessive feed; retain prior metadata')
    records={};guids={};host=urlsplit(source['feed']).hostname
    for item in nodes:
        title=' '.join((item.findtext('title') or '').split())
        author=' '.join((item.findtext('{http://purl.org/dc/elements/1.1/}creator') or item.findtext('author') or '').split())
        url=canonical((item.findtext('link') or '').strip(),host)
        guid=(item.findtext('guid') or url).strip()
        if not title or len(title)>500 or len(author)>200 or len(guid)>2048:raise ValueError('Invalid item metadata')
        published=stamp((item.findtext('pubDate') or '').strip(),now)
        record={'url':url,'headline':title,'author':author or None,'publication':published,'guid':guid}
        if guid in guids and guids[guid]!=url:raise ValueError('GUID points to conflicting article URLs')
        guids[guid]=url
        if url in records:
            # Tracking/GUID duplicates with identical metadata coalesce; conflicting revisions need review.
            prior=records[url]
            if any(prior[k]!=record[k] for k in ('headline','author','publication')):raise ValueError('Conflicting duplicate article')
            continue
        records[url]=record
    return list(records.values())

def refresh(previous,sources,now,transport=fetch):
    state=copy.deepcopy(previous or {'schemaVersion':1,'articles':{},'sources':{},'decisions':[]})
    if state.get('schemaVersion')!=1:raise ValueError('Unknown research state schema')
    for key,source in sources.items():
        old=state['sources'].get(key,{})
        report={**old,'lastAttempt':now.isoformat(),'status':'disabled','reason':source['reason']}
        state['sources'][key]=report
        if not source['enabled']:continue
        try:
            reviewed=datetime.fromisoformat(source['reviewedOn']).date()
            if not timedelta(0)<=now.date()-reviewed<=timedelta(days=30):raise ValueError('Source permission review expired')
            host=urlsplit(source['feed']).hostname;robots='https://'+host+'/robots.txt'
            code,body,_=transport(robots,{})
            if code!=200 or len(body)>128*1024:raise ValueError('Robots guidance unavailable')
            robots_text=body.decode('utf-8')
            if not re.search(r'^User-agent:\s*\S',robots_text,re.I|re.M):raise ValueError('Unrecognized robots response')
            rp=RobotFileParser();rp.parse(robots_text.splitlines())
            if not rp.can_fetch(AGENT,source['feed']):raise ValueError('Robots disallows research feed access')
            headers={}
            if old.get('etag'):headers['If-None-Match']=old['etag']
            if old.get('lastModified'):headers['If-Modified-Since']=old['lastModified']
            code,body,h=transport(source['feed'],headers)
            if code==304:
                if not old.get('lastSuccess'):raise ValueError('304 without accepted baseline')
                report.update(status='not-modified',lastSuccess=now.isoformat());continue
            if code!=200:raise ValueError('Unexpected feed status')
            rows=metadata(body,source,now)  # Validate whole source before modifying its retained records.
            by_url={};by_guid={}
            for ident,entry in state['articles'].items():
                if entry['source']!=key:continue
                for revision in entry['revisions']:
                    saved=revision['metadata'];by_url.setdefault(saved['url'],set()).add(ident);by_guid.setdefault(saved['guid'],set()).add(ident)
            planned=[];targets=set()
            for row in rows:
                candidates=by_url.get(row['url'],set())|by_guid.get(row['guid'],set())
                if len(candidates)>1:raise ValueError('Conflicting retained GUID/URL identities')
                ident=next(iter(candidates)) if candidates else key+':'+hashlib.sha256(row['url'].encode()).hexdigest()[:24]
                if ident in targets:raise ValueError('Multiple current revisions for one retained identity')
                targets.add(ident);planned.append((ident,row))
            for ident,row in planned:
                revision=digest(row);entry=state['articles'].setdefault(ident,{'source':key,'outlet':source['name'],'firstSeen':now.isoformat(),'revisions':[]})
                if not entry['revisions'] or entry['revisions'][-1]['hash']!=revision:
                    entry['revisions'].append({'hash':revision,'observedAt':now.isoformat(),'metadata':row})
                entry['lastSeen']=now.isoformat()
            lower={k.lower():v for k,v in h.items()}
            report.update(status='success',lastSuccess=now.isoformat(),items=len(rows),etag=lower.get('etag'),lastModified=lower.get('last-modified'))
        except (ValueError,ET.ParseError,OSError,UnicodeError) as error:
            report.update(status='failed',reason=str(error)[:200])
    state['lastRun']=now.isoformat();state['publicationEnabled']=False
    return state

def tokens(text):return set(re.findall(r'[a-z0-9]+',text.lower()))-STOP

def research_queue(state,official):
    result=[]
    for article_id,article in state['articles'].items():
        revision=article['revisions'][-1];title=revision['metadata']['headline'];folded=title.lower()
        topics=[key for key,words in TOPICS.items() if any(word in folded for word in words)]
        # Names come only from literal headline mentions; no inferred sponsors or roster membership.
        name_pattern=r'\b(?:Sen\.|Rep\.|Senator|Representative)\s+([A-Z][a-z]+(?:\s+[A-Z]\.)?\s+[A-Z][a-z]+)'
        people=re.findall(name_pattern,title)
        sponsors=re.findall(name_pattern+r'\s+(?i:sponsors?|sponsored|introduces?|introduced)\b',title)
        matches=[]
        for record in official:
            overlap=sorted(tokens(title)&tokens(record['title']))
            exact=bool(record['title'].strip()) and record['title'].strip().casefold() in folded
            sponsor=any(name.casefold() in folded for name in record.get('sponsorNames',[]) if name)
            if exact or len(overlap)>=2 or sponsor:
                matches.append({'recordKey':record['key'],'sessionID':record['sessionID'],'recordEvidence':record.get('recordEvidence','Saved official metadata; current status not rechecked'),'officialSource':record.get('source'),'nameEvidenceSession':record.get('nameEvidenceSession'),'reasons':{'titleMention':exact,'sharedWords':overlap,'nameMentionOnly':sponsor},'verification':'unverified'})
        if not topics and not matches:continue
        decisions=[d for d in state['decisions'] if d['articleId']==article_id and d['revisionHash']==revision['hash']]
        result.append({'articleId':article_id,'revisionHash':revision['hash'],'headline':title,'url':revision['metadata']['url'],'reportedPeople':people,'reportedSponsors':sponsors,'topics':topics,'candidates':matches,'editorialDecisions':decisions,'verification':'unverified','publishable':False})
    return result

def decide(state,article_id,revision_hash,proposal,decision,reviewer,reason,evidence,kind="association",proposed_text=None):
    if kind not in ("association","description","background"):raise ValueError("Unknown review kind")
    if kind=="description" and (not proposed_text or len(proposed_text)>2000):raise ValueError("Manually supplied proposed description required; max 2000 characters")
    if decision not in ('accept','reject','defer') or not all(x.strip() for x in (proposal,reviewer,reason)):raise ValueError('Decision, proposal, reviewer and rationale required')
    article=state['articles'][article_id]
    if article['revisions'][-1]['hash']!=revision_hash:raise ValueError('Stale article revision; re-review required')
    for url in evidence:canonical(url,'le.utah.gov')
    if decision=='accept' and not evidence:raise ValueError('Acceptance requires official evidence links; remains research-only')
    state['decisions'].append({'articleId':article_id,'revisionHash':revision_hash,'proposal':proposal,'decision':decision,'reviewer':reviewer,'reason':reason,'officialEvidence':evidence,'at':datetime.now(timezone.utc).isoformat(),'verification':'unverified','publishable':False,'kind':kind,'proposedText':proposed_text})

def official_records(root=ROOT):
    manifest=json.loads((root/'data/catalog.json').read_text(encoding='utf-8'))
    def read_source(key):
        source=manifest['sources'][key];body=(root/source['path']).read_bytes()
        if hashlib.sha256(body).hexdigest()!=source['sha256']:raise ValueError('Saved official source checksum mismatch')
        return json.loads(body)
    requests=read_source('requests2027');introduced=read_source('index2027')
    # Only direct historical stable-ID links supply name cues; not evidence of 2027 membership.
    from catalog_model import Roster
    roster=manifest['sources']['roster2026'];body=(root/roster['path']).read_bytes()
    if hashlib.sha256(body).hexdigest()!=roster['sha256']:raise ValueError('Roster checksum mismatch')
    parser=Roster();parser.feed(body.decode('utf-8-sig'));names={}
    for row in parser.rows:
        if len(row)<4 or row[1]['text'] not in ('Representative','Senator'):continue
        ids={m[1] for cell in row for link in cell['links'] if (m:=re.search(r'Listbox[23]=([A-Z]+)',link))}
        if len(ids)==1:names.setdefault(next(iter(ids)),set()).add(row[0]['text'].strip())
    records=[{'key':'2027GS/request/'+r['trackingID'],'sessionID':'2027GS','title':r['shortTitle'],'sponsorCode':r.get('sponsor',''),'sponsorNames':sorted(names.get(r.get('sponsor'),set())),'nameEvidenceSession':'2026GS','recordEvidence':'Official request feed only; status qualification not revalidated by research tool','source':manifest['sources']['requests2027']} for r in requests]
    for r in introduced:
        number=r.get('number','')
        if not re.fullmatch(r'[HS](?:B|R|JR|CR)\d{4}',number):raise ValueError('Unrecognized introduced index identity')
        source=manifest['records'].get('2027/'+number)
        if not source:raise ValueError('Introduced record metadata not saved; do not infer title')
        body=(root/source['path']).read_bytes()
        if hashlib.sha256(body).hexdigest()!=source['sha256']:raise ValueError('Introduced metadata checksum mismatch')
        record=json.loads(body)
        if record['sessionID']!='2027GS' or record['billNumber']!=number:raise ValueError('Introduced identity mismatch')
        records.append({'key':'2027GS/bill/'+number,'sessionID':'2027GS','title':record['shortTitle'],'sponsorNames':[record.get('primeSponsorName','')],'source':source})
    return records,manifest['checkedAt']

def atomic(path,value):
    path.parent.mkdir(parents=True,exist_ok=True)
    fd,name=tempfile.mkstemp(dir=path.parent,prefix='.news-',suffix='.tmp')
    try:
        with os.fdopen(fd,'w',encoding='utf-8') as stream:json.dump(value,stream,indent=2,ensure_ascii=False);stream.write('\n');stream.flush();os.fsync(stream.fileno())
        os.replace(name,path)
    finally:
        if os.path.exists(name):os.unlink(name)

def main():
    parser=argparse.ArgumentParser(description=__doc__);sub=parser.add_subparsers(dest='command',required=True)
    sub.add_parser('collect',help='One bounded manual collection; no publishing')
    sub.add_parser('queue',help='Compare retained metadata with saved official sources; no network')
    review=sub.add_parser('review',help='Append research-only editorial decision; no publishing')
    for arg in ('article-id','revision-hash','proposal','decision','reviewer','reason'):review.add_argument('--'+arg,required=True)
    review.add_argument('--official-evidence',action='append',default=[])
    review.add_argument('--kind',choices=['association','description','background'],default='association')
    review.add_argument('--proposed-text')
    args=parser.parse_args();path=OUTPUT/'state.json'
    state=json.loads(path.read_text(encoding='utf-8')) if path.exists() else {'schemaVersion':1,'articles':{},'sources':{},'decisions':[]}
    if args.command=='collect':
        sources=json.loads((ROOT/'scripts/news_sources.json').read_text());state=refresh(state,sources,datetime.now(timezone.utc));atomic(path,state)
        print(json.dumps({'publicationEnabled':False,'sources':{k:{'status':v['status'],'reason':v['reason'],'lastSuccess':v.get('lastSuccess')} for k,v in state['sources'].items()},'retainedArticles':len(state['articles'])},indent=2))
        return 2 if any(report['status']=='failed' for report in state['sources'].values()) else 0
    elif args.command=='queue':
        records,checked=official_records();queue=research_queue(state,records)
        cases=json.loads((ROOT/'docs/evidence/NEWS_002_CASES.json').read_text(encoding='utf-8'))
        atomic(OUTPUT/'queue.json',{'officialSnapshotCheckedAt':checked,'researchOnly':True,'articles':queue,'manualCasePackets':cases['proposals'],'caseEvidenceCheckedOn':cases['checkedOn'],'limitations':['Headline-only triage is incomplete and may produce false positives.','No match does not prove a proposal or internal drafting file is absent.','Historical name cues do not establish 2027 roster membership.','Manual case packets are separate research evidence, not verified record associations.']})
        print(json.dumps({'researchArticles':len(queue),'candidatePairs':sum(len(x['candidates']) for x in queue),'verifiedAssociations':0,'officialSnapshotCheckedAt':checked}))
    else:
        decide(state,args.article_id,args.revision_hash,args.proposal,args.decision,args.reviewer,args.reason,args.official_evidence,args.kind,args.proposed_text);atomic(path,state);print('Research decision recorded; no association verified or published.')

if __name__=='__main__':raise SystemExit(main() or 0)
