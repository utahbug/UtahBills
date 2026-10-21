"""Resumable, bounded official vote acquisition. Does not alter the published catalog."""
import concurrent.futures,hashlib,json,os,pathlib,threading,time,urllib.request,sys,datetime as dt
from refresh_catalog import now,read,ROOT
TARGET=ROOT/'data/archive.json';CACHE=ROOT/'test-results/archive-cache.json';RAW=ROOT/'data/archive-raw';REPORT=ROOT/'test-results/archive-refresh.json'
_lock=threading.Lock();last=0

def expected(manifest,years=('2026','2027')):
 result={}
 for key,source in manifest['records'].items():
  if key.split('/')[0] not in years:continue
  b=json.loads(read(source))
  for a in b['actionHistoryList']:
   if not a.get('voteID'):continue
   assert (a['actionClass']=='A' or a['voteHouse'] in ('H','S')) and str(a['voteID']).isdigit(),'Invalid official vote identity'
   url='https://le.utah.gov/mtgvotes.jsp?voteid='+a['voteID'] if a['actionClass']=='A' else 'https://le.utah.gov/DynaBill/svotes.jsp?sessionid='+b['sessionID']+'&voteid='+a['voteID']+'&house='+a['voteHouse']
   ident=b['sessionID']+'/'+b['billNumber']+'/'+a['voteHouse']+'/'+a['voteID']
   item=dict(id=ident,bill=b['billNumber'],session=b['sessionID'],action=a,actionSource=source,url=url,marker=hashlib.sha256(json.dumps(a,sort_keys=True).encode()).hexdigest())
   assert ident not in result or result[ident]==item,'Conflicting vote reference';result[ident]=item
 return result

def fetch(item):
 global last
 try:
  with _lock:
   time.sleep(max(0,.3-(time.monotonic()-last)));last=time.monotonic()
  with urllib.request.urlopen(urllib.request.Request(item['url'],headers={'User-Agent':'UtahBills official legislative archive; paced retrieval'}),timeout=35) as r:body=r.read()
  assert body and b'Request Rejected' not in body and b'404 Page Not Found' not in body,'Invalid official response'
  assert item['bill'].encode() in body,'Vote response does not identify the expected measure'
  sha=hashlib.sha256(body).hexdigest();path=RAW/(sha+'.txt');path.write_bytes(body)
  return item['id'],dict(**item,source=dict(url=item['url'],path=path.relative_to(ROOT).as_posix(),sha256=sha,retrievedAt=now()),state='retrieved')
 except Exception as e:return item['id'],dict(**item,state='unavailable',error=str(e),attemptedAt=now())

def save(path,data):
 path.parent.mkdir(exist_ok=True);tmp=path.with_suffix('.candidate');tmp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');os.replace(tmp,path)

def run(limit=None):
 manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));want=expected(manifest);old=json.loads(TARGET.read_text(encoding='utf-8')) if TARGET.exists() else {'votes':{}}
 cache=json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
 # A stale resume cache must never supersede a newer published valid source.
 for key,published in old['votes'].items():
  candidate=cache.get(key)
  if candidate is None or (published.get('source') and (not candidate.get('source') or candidate['source']['retrievedAt']<published['source']['retrievedAt'])):cache[key]=published
 RAW.mkdir(exist_ok=True)
 # Reuse the original verified sample without making duplicate HTTP requests.
 for v in json.loads((ROOT/'data/votes.json').read_text(encoding='utf-8'))['records']:
  ident=v['session']+'/'+v['bill']+'/'+v['id'].split('-',1)[1].replace('-','/')
  if ident in want and ident not in cache:cache[ident]=dict(**want[ident],source=v['source'],state='retrieved')
 todo=[v for k,v in want.items() if k not in cache or cache[k].get('marker')!=v['marker'] or cache[k].get('state')!='retrieved' or (v['session']=='2027GS' and dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(cache[k]['source']['retrievedAt'])>dt.timedelta(days=7))]
 if limit is not None:todo=todo[:limit]
 print('Expected',len(want),'cached',sum(v.get('state')=='retrieved' for v in cache.values()),'retrieving',len(todo),flush=True)
 with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
  for n,(ident,item) in enumerate(pool.map(fetch,todo),1):
   if item['state']=='unavailable' and cache.get(ident,{}).get('state')=='retrieved':item={**cache[ident],'refreshError':item['error'],'failedAttemptAt':item['attemptedAt']}
   previous=cache.get(ident,{})
   history=list(previous.get('sourceHistory',[]))
   for source in [previous.get('source'),item.get('source')]:
    if source and (not history or history[-1]['sha256']!=source['sha256']):history.append(source)
   if history:item['sourceHistory']=history
   cache[ident]=item
   if n%50==0:save(CACHE,cache);print('Retrieved',n,'/',len(todo),'failed',sum(v['state']=='unavailable' for v in cache.values()),flush=True)
 save(CACHE,cache)
 votes={k:cache.get(k,dict(**v,state='not-retrieved',error='Retrieval checkpoint not yet reached')) for k,v in want.items()}
 result=dict(schemaVersion=1,checkedAt=now(),votes=votes)
 # Never replace a previously valid source with a failed retrieval.
 for k,v in old['votes'].items():
  assert k in votes,'Previously recorded vote disappeared'
  if v.get('source'):assert votes[k].get('source'),'Previously valid vote source disappeared'
 issues=[dict(id=k,error=v.get('error') or v.get('refreshError')) for k,v in votes.items() if v.get('state')!='retrieved' or v.get('refreshError')]
 save(REPORT,dict(attemptedAt=result['checkedAt'],status='partial' if issues else 'success',expected=len(want),retrieved=sum(bool(v.get('source')) for v in votes.values()),unavailable=issues));save(TARGET,result)
 if issues:print('::warning::Some vote sources are unavailable; previous valid sources are retained. See archive-refresh.json.',flush=True)
 print('Saved archive checkpoint:',len(votes),'references;',sum(v['state']=='retrieved' for v in votes.values()),'sources',flush=True)
if __name__=='__main__':
 try:run(int(sys.argv[1]) if len(sys.argv)>1 else None)
 except Exception as error:
  save(REPORT,dict(attemptedAt=now(),status='failed',error=str(error)));raise
