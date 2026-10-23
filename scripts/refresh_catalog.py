"""Guarded 2027 refresh. Historical 2026 sources are frozen; publication is atomic."""
import pathlib, json, urllib.request, datetime as dt, hashlib, time, os, re
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'data/catalog-raw'; TARGET=ROOT/'data/catalog.json'; CACHE=ROOT/'test-results/catalog-cache.json'
REPORT=ROOT/'test-results/catalog-refresh.json'
# Conservative daily growth guard. Change only after reviewing official evidence.
MAX_NEW_RECORDS=250
from request_status import STATUS_URL

def now():return dt.datetime.now(dt.timezone.utc).isoformat()
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'UtahBills official-source research prototype'}),timeout=40) as r:body=r.read()
    assert b'Request Rejected' not in body and b'404 Page Not Found' not in body,'Invalid source response'
    sha=hashlib.sha256(body).hexdigest();RAW.mkdir(exist_ok=True)
    path=RAW/(sha+('.json' if url.endswith('.json') else '.txt'))
    if not path.exists():path.write_bytes(body)
    time.sleep(.25)
    return dict(url=url,path=path.relative_to(ROOT).as_posix(),sha256=sha,retrievedAt=now())
def read(s):
    body=(ROOT/s['path']).read_bytes();assert hashlib.sha256(body).hexdigest()==s['sha256'],'Checksum mismatch';return body

def requests(source):
    rows=json.loads(read(source));assert isinstance(rows,list),'Request list must be an array'
    for r in rows:
        assert all(isinstance(r.get(k),str) for k in ('trackingID','shortTitle','sponsor')),'Invalid request schema'
        assert re.fullmatch('[A-Z0-9]+',r['trackingID']) and r['shortTitle'].strip(),'Invalid request identity/title'
    assert len({r['trackingID'] for r in rows})==len(rows),'Duplicate request identity'
    return rows

def append_source(history,source):
    from request_publication import source_identity
    if not history or source_identity(history[-1])!=source_identity(source):history.append(dict(source))

def refresh():
    old=json.loads(TARGET.read_text(encoding='utf-8'))
    cache=json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
    cache={**cache,**old['records']}; sources=dict(old['sources'])
    for key,file in [('index2027','billlist.json'),('requests2027','filelist.json')]:
        sources[key]=get('https://le.utah.gov/data/2027GS/'+file)
    sources['requestStatuses2027']=get(STATUS_URL)
    # Validate the previous published catalog before using its identities as the trust baseline.
    from catalog_model import derive
    from request_publication import reconcile
    previous_data=derive(old)
    previously_verified={r['trackingID'] for r in previous_data['requestArchive2027']}
    raw_requests=requests(sources['requests2027'])
    index=json.loads(read(sources['index2027']));assert isinstance(index,list),'Index must be an array'
    for item in index:
        assert isinstance(item,dict) and re.fullmatch(r'[HS](?:B|R|JR|CR)\d{3,4}',item.get('number','')),'Invalid base measure'
        assert isinstance(item.get('updatetime'),str) and re.fullmatch('[A-Z0-9]+',item.get('trackingID','')),'Missing index change marker/identity'
        dt.datetime.fromisoformat(item['updatetime'])
    ids={x['number'] for x in index};assert len(ids)==len(index),'Duplicate base measures'
    previous_ids={k.split('/')[1] for k in old['records'] if k.startswith('2027/')}
    assert previous_ids<=ids,'Index lost existing measures; review required'
    assert len(ids-previous_ids)<=MAX_NEW_RECORDS,'Major increase in measure count; review required'
    records=dict(old['records']);measure_history=json.loads(json.dumps(old.get('measureHistory',{})))
    for item in index:
        key='2027/'+item['number'];entry=cache.get(key)
        if not entry or entry.get('updatetime')!=item['updatetime'] or entry.get('lastActionTime')!=item.get('lastActionTime') or dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(entry['retrievedAt'])>dt.timedelta(days=7):
            entry=get('https://le.utah.gov/data/2027GS/'+item['number']+'.json');entry['updatetime']=item['updatetime'];entry['lastActionTime']=item.get('lastActionTime')
        b=json.loads(read(entry))
        assert b['billNumber']==item['number'] and b['sessionID']=='2027GS' and b['trackingID']==item['trackingID'],'Index/record identity mismatch'
        assert isinstance(b['shortTitle'],str) and b['shortTitle'].strip() and isinstance(b['billVersionList'],list) and isinstance(b['actionHistoryList'],list),'Invalid measure schema'
        if key in old['records']:
            prior=json.loads(read(old['records'][key]));assert prior['trackingID']==b['trackingID'],'Tracking identity changed'
            assert {v['billNumber'] for v in prior['billVersionList']}<={v['billNumber'] for v in b['billVersionList']},'Published versions disappeared'
            assert len(b['actionHistoryList'])>=len(prior['actionHistoryList']),'Recorded actions disappeared'
        history=measure_history.setdefault(key,[])
        if key in old['records']:append_source(history,old['records'][key])
        append_source(history,entry);records[key]=entry;cache[key]=entry
        CACHE.parent.mkdir(exist_ok=True);CACHE.write_text(json.dumps(cache),encoding='utf-8')
    previous={r['trackingID'] for r in requests(old['sources']['requests2027'])}
    current={r['trackingID'] for r in requests(sources['requests2027'])}
    introduced=[json.loads(read(r))['trackingID'] for k,r in records.items() if k.startswith('2027/')]
    assert len(introduced)==len(set(introduced)),'Ambiguous request-to-bill identity'
    reconciliation=reconcile(read(sources['requestStatuses2027']),raw_requests,previously_verified,introduced)
    if reconciliation['withheld'] or old['sources']['requests2027'].get('requestVerification'):
        sources['requests2027']['requestVerification']={**reconciliation,'statusSource':sources['requestStatuses2027'],'previouslyVerifiedIDs':sorted(previously_verified),'introducedIDs':sorted(introduced),'verifiedAt':now()}
    assert previous<=current|set(introduced),'Public requests disappeared without introduced records; review required'
    assert len(current-previous)<=MAX_NEW_RECORDS,'Major increase in request count; review required'
    history=list(old.get('requestHistory',[]));append_source(history,old['sources']['requests2027']);append_source(history,sources['requests2027'])
    status_history=list(old.get('requestStatusHistory',[]))
    if 'requestStatuses2027' in old['sources']:append_source(status_history,old['sources']['requestStatuses2027'])
    append_source(status_history,sources['requestStatuses2027'])
    candidate={**old,'schemaVersion':2,'checkedAt':now(),'sources':sources,'records':records,'requestHistory':history,'measureHistory':measure_history,'requestStatusHistory':status_history}
    from catalog_model import derive
    data=derive(candidate)
    assert data['coverage']['2027']['imported']==len(index),'Incomplete projection'
    temp=TARGET.with_suffix('.candidate');temp.write_text(json.dumps(candidate,indent=2)+'\n',encoding='utf-8');os.replace(temp,TARGET)
    return {'reconciliation':{k:v for k,v in reconciliation.items() if k!='acceptedIDs'},'introduced2027':len(index),'publicRequests':len(data['requests2027']),'requestStatusesVerified':sum(bool(r.get('officialStatus')) for r in data['requests2027']),'linkedRequests':sum(bool(r['introducedBill']) for r in data['requestArchive2027'])}

def run():
    report={'attemptedAt':now(),'status':'failed'}
    try:
        report.update(refresh());report['status']=report['reconciliation']['status']
        if report['status']=='partial':print('::warning::Partial request reconciliation; independently verified records published, withheld identities remain unresolved. See catalog-refresh.json.',flush=True)
    except Exception as error:
        report['error']=str(error);raise
    finally:
        report['finishedAt']=now();REPORT.parent.mkdir(exist_ok=True);REPORT.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report),flush=True)
if __name__=='__main__':run()
