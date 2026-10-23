"""Bounded official 2027 XML acquisition. Projection remains network-free."""
import copy,datetime as dt,hashlib,json,os,pathlib,re,time,urllib.request,urllib.error
from urllib.parse import urlsplit
import version_model as v
ROOT=pathlib.Path(__file__).resolve().parents[1]
TARGET=ROOT/'data/text-2027.json'
REPORT=ROOT/'test-results/text-refresh.json'
LIMIT=12
MAX_BYTES=4*1024*1024
TIMEOUT=15
RUN_SECONDS=240
RECHECK_DAYS=7

def now():return dt.datetime.now(dt.timezone.utc).isoformat()
def load():return json.loads(TARGET.read_text(encoding='utf-8'))
def read(s):
 body=(ROOT/s['path']).read_bytes()
 assert hashlib.sha256(body).hexdigest()==s['sha256'],'Text checksum mismatch'
 return body

def allowed(url,b,g):
 u=urlsplit(url)
 assert u.scheme=='https' and u.netloc=='le.utah.gov' and not u.query and not u.fragment,'Unsupported official text URL'
 assert b['sessionID']=='2027GS' and re.fullmatch(r'[HS](?:B|R|JR|CR)\d{3,4}',b['billNumber']),'Invalid 2027 measure identity'
 name={'Introduced':g['version'],'PubSub':g['version'],'Enrolled':b['billNumber']}.get(g['fileType'])
 if g['fileType']=='Amended':pattern=r'/Session/2027/bills/amended/AV_'+re.escape(g['version'])+r'_\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}\.xml'
 else:
  folder='enrolled' if g['fileType']=='Enrolled' else 'introduced'
  assert name is not None,'Unsupported document type'
  pattern='/Session/2027/bills/'+folder+'/'+re.escape(name)+r'\.xml'
 assert re.fullmatch(pattern,u.path),'Text URL/session/version/type mismatch'
 assert (g['fileType']!='Introduced' or g['version']==b['billNumber']) and (g['fileType']!='PubSub' or g['version']!=b['billNumber']),'Document type/version mismatch'
 assert any(d['url']==url and d['fileName']==u.path.rsplit('/',1)[-1] for d in g['documents']),'Unlinked or mismatched document filename'

class NoRedirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,*args,**kwargs):raise ValueError('Text redirects require review')

def fetch(url,headers):
 opener=urllib.request.build_opener(NoRedirect)
 for attempt in range(2):
  try:
   with opener.open(urllib.request.Request(url,headers={'User-Agent':'UtahBills verified legislative text',**headers}),timeout=TIMEOUT) as response:
    body=response.read(MAX_BYTES+1)
    assert len(body)<=MAX_BYTES,'Text exceeds byte limit'
    return body,dict(response.headers.items())
  except urllib.error.HTTPError as error:
   if error.code==304:return None,{}
   if attempt or (error.code!=429 and error.code<500):raise
  except (urllib.error.URLError,TimeoutError):
   if attempt:raise
  time.sleep(1)

def preserve(body,url,stamp):
 sha=hashlib.sha256(body).hexdigest();path=ROOT/'data/text-2027-raw'/(sha+'.xml');path.parent.mkdir(exist_ok=True)
 if not path.exists():path.write_bytes(body)
 return dict(path=path.relative_to(ROOT).as_posix(),sha256=sha,url=url,retrievedAt=stamp)

def candidates(catalog):
 result=[]
 for key,metadata in sorted(catalog['records'].items()):
  if not key.startswith('2027/'):continue
  b=json.loads(v.read(metadata))
  assert key=='2027/'+b['billNumber'] and b['sessionID']=='2027GS','Catalog text identity mismatch'
  for g in v.document_groups(b):
   if g['fileType'] not in v.TEXT_TYPES:continue
   urls=[d['url'] for d in g['documents'] if urlsplit(d['url']).path.endswith('.xml')]
   result.append((key+'/'+g['id'],b,g,metadata,urls[0] if urls else None))
 return result

def validate_entry(entry):
 if entry.get('lastResponse'):read(entry['lastResponse'])
 for s in entry.get('revisions',[]):
  b=json.loads(v.read(s['metadataSource']))
  assert b['sessionID']==s['session']=='2027GS' and b['billNumber']==s['bill'],'Pinned text identity mismatch'
  groups=[g for g in v.document_groups(b) if g['id']==entry['groupID'] and g['version']==s['version'] and g['fileType']==s['fileType']]
  assert len(groups)==1,'Pinned text relationship mismatch'
  allowed(s['url'],b,groups[0]);v.extract(s,b,groups[0])
 if entry.get('verified'):
  assert entry['verified'] in entry['revisions'],'Verified source absent from revision history'

def acquire(catalog,old,fetcher=fetch,stamp=None,limit=LIMIT,clock=time.monotonic):
 stamp=stamp or now();date=dt.datetime.fromisoformat(stamp);started=clock()
 state=copy.deepcopy(old);entries=state.setdefault('entries',{})
 for e in entries.values():validate_entry(e)
 work=candidates(catalog);active={x[0] for x in work}
 # Unattempted new records first, then oldest failed/deferred work, then due rechecks.
 work.sort(key=lambda x:(bool(entries.get(x[0],{}).get('verified')),entries.get(x[0],{}).get('lastAttempt',''),x[0]))
 count=0;rows=[]
 for key,b,g,metadata,url in work:
  e=entries.setdefault(key,dict(groupID=g['id'],bill=b['billNumber'],version=g['version'],fileType=g['fileType'],revisions=[]))
  fingerprint=hashlib.sha256(json.dumps(g['documents'],sort_keys=True).encode()).hexdigest()
  e['metadataSource']=metadata;e['url']=url;e['active']=True
  verified=e.get('verified');e['availability']='verified' if verified else 'not_retrieved'
  due=not verified or fingerprint!=e.get('verifiedMetadata') or date-dt.datetime.fromisoformat(e['lastChecked'])>=dt.timedelta(days=RECHECK_DAYS)
  if not url:e['status']='not_retrieved';e['reason']='No supported complete XML representation linked'
  elif not due:e['status']='verified'
  elif count>=limit or clock()-started>=RUN_SECONDS:e['status']='deferred';e['reason']='Per-run acquisition budget reached'
  else:
   count+=1;e['lastAttempt']=stamp;e.pop('reason',None)
   try:allowed(url,b,g)
   except (AssertionError,ValueError) as error:e['status']='rejected';e['reason']=str(error)
   else:
    headers={}
    if verified:
     if e.get('etag'):headers['If-None-Match']=e['etag']
     if e.get('lastModified'):headers['If-Modified-Since']=e['lastModified']
    try:body,response=fetcher(url,headers)
    except (AssertionError,ValueError) as error:e['status']='rejected';e['reason']=str(error)
    except Exception as error:e['status']='failed';e['reason']=str(error)
    else:
     try:
      if body is None:
       assert verified,'304 without verified local text'
       source=verified
      else:
       assert len(body)<=MAX_BYTES,'Text exceeds byte limit'
       source=preserve(body,url,stamp)
       source.update(session='2027GS',bill=b['billNumber'],version=g['version'],fileType=g['fileType'],metadataSource=metadata)
       e['lastResponse']=source
       v.extract(source,b,g)
       if g['fileType']=='Enrolled':
        # Enrolled substitute association must be explicit in the XML, not inferred.
        import xml.etree.ElementTree as ET
        root=ET.fromstring(re.sub(r'<\?xml[^>]+\?>','',body.decode('utf-8-sig')))
        assert root.get('subNumber') is not None,'Enrolled XML lacks explicit version identity'
       if verified and source['sha256']==verified['sha256']:source=verified
       elif not e['revisions'] or e['revisions'][-1]['sha256']!=source['sha256']:e['revisions'].append(source)
      e.update(verified=source,status='verified',availability='verified',lastChecked=stamp,verifiedMetadata=fingerprint)
      response={k.lower():val for k,val in response.items()}
      if body is not None:
       e['etag']=response.get('etag');e['lastModified']=response.get('last-modified')
     except Exception as error:e['status']='rejected';e['reason']=str(error)
   e['lastOutcome']=e['status'];e['lastError']=e.get('reason')
  rows.append(dict(lastOutcome=e.get('lastOutcome'),lastError=e.get('lastError'),key=key,status=e['status'],availability=e['availability'],reason=e.get('reason'),source=e.get('verified'),lastResponse=e.get('lastResponse')))
 for key,e in entries.items():
  if key not in active:e['active']=False
 counts={s:sum(r['status']==s for r in rows) for s in ('verified','not_retrieved','failed','rejected','deferred')}
 report=dict(attemptedAt=stamp,status='partial' if any(r['status']!='verified' for r in rows) else 'success',attemptedDocuments=count,limits=dict(documents=limit,seconds=RUN_SECONDS,bytesPerDocument=MAX_BYTES,timeoutSeconds=TIMEOUT,attemptsPerDocument=2,recheckDays=RECHECK_DAYS),counts=counts,documents=rows)
 state.update(schemaVersion=1,lastRun=report)
 return state,report

def run():
 report=dict(attemptedAt=now(),status='failed')
 try:
  catalog=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
  from catalog_model import derive
  derive(catalog) # Only a fully validated catalog can authorize document retrieval.
  state,report=acquire(catalog,load())
  for e in state['entries'].values():validate_entry(e)
  temp=TARGET.with_suffix('.candidate');temp.write_text(json.dumps(state,indent=2)+'\n',encoding='utf-8');os.replace(temp,TARGET)
  if report['status']=='partial':print('::warning::2027 text acquisition is partial; verified text retained. See text-refresh.json.')
 except Exception as error:report['status']='failed';report['error']=str(error);raise
 finally:
  REPORT.parent.mkdir(exist_ok=True);REPORT.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report))
if __name__=='__main__':run()
