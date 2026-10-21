"""Incremental official bill catalog. Raw bytes are content-addressed; publish one manifest atomically.
Manual refresh only; the independent scheduled calendar process is unchanged.
"""
import pathlib, json, urllib.request, datetime as dt, hashlib, time, os, re
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'data/catalog-raw'; TARGET=ROOT/'data/catalog.json'; CACHE=ROOT/'test-results/catalog-cache.json'
def now():return dt.datetime.now(dt.timezone.utc).isoformat()
def get(url):
    with urllib.request.urlopen(urllib.request.Request(url,headers={'User-Agent':'UtahBills official-source research prototype'}),timeout=40) as r:body=r.read()
    assert b'Request Rejected' not in body and b'404 Page Not Found' not in body,'Invalid source response'
    sha=hashlib.sha256(body).hexdigest();RAW.mkdir(exist_ok=True)
    path=RAW/(sha+('.json' if url.endswith('.json') else '.txt'))
    if not path.exists():path.write_bytes(body)
    time.sleep(.15)
    return {'url':url,'path':path.relative_to(ROOT).as_posix(),'sha256':sha,'retrievedAt':now()}
def read(s):
    body=(ROOT/s['path']).read_bytes();assert hashlib.sha256(body).hexdigest()==s['sha256'];return body

def refresh():
    old=json.loads(TARGET.read_text(encoding='utf-8')) if TARGET.exists() else {}
    cache=json.loads(CACHE.read_text(encoding='utf-8')) if CACHE.exists() else {}
    cache={**old.get('records',{}),**cache}; sources={}
    for key,url in [('index2026','https://le.utah.gov/data/2026GS/billlist.json'),('index2027','https://le.utah.gov/data/2027GS/billlist.json'),('requests2027','https://le.utah.gov/data/2027GS/filelist.json'),('roster2026','https://le.utah.gov/asp/roster/roster.asp?year=2026'),('contacts','https://le.utah.gov/data/legislators.json'),('houseMaps','https://www2.census.gov/geo/maps/DC2020/SLD_RefMap/SLD2022/lower/st49_ut/'),('senateMaps','https://www2.census.gov/geo/maps/DC2020/SLD_RefMap/SLD2022/upper/st49_ut/')]:
        sources[key]=get(url)
    records={}
    for year in (2026,2027):
        index=json.loads(read(sources['index'+str(year)]));assert isinstance(index,list)
        assert len({x['number'] for x in index})==len(index),'Duplicate base measures'
        assert {k.split('/')[1] for k in old.get('records',{}) if k.startswith(str(year)+'/')} <= {x['number'] for x in index},'Index lost existing measures; review required'
        for n,item in enumerate(index):
            ident=item['number'];assert re.fullmatch(r'[HS](?:B|R|JR|CR)\d{3,4}',ident),ident
            key=f'{year}/{ident}';entry=cache.get(key)
            if not entry or entry.get('updatetime')!=item['updatetime']:
                entry=get(f'https://le.utah.gov/data/{year}GS/{ident}.json');entry['updatetime']=item['updatetime']
                b=json.loads(read(entry));assert b['billNumber']==ident and b['sessionID']==f'{year}GS'
                assert b['shortTitle'] and isinstance(b['billVersionList'],list)
                cache[key]=entry;CACHE.parent.mkdir(exist_ok=True);CACHE.write_text(json.dumps(cache),encoding='utf-8')
            records[key]=entry
            if n%100==0:print(f'{year}: {n+1}/{len(index)} verified',flush=True)
    if old.get('sources',{}).get('requests2027'):
        previous={r['trackingID'] for r in json.loads(read(old['sources']['requests2027']))}
        current={r['trackingID'] for r in json.loads(read(sources['requests2027']))}
        introduced={json.loads(read(r))['trackingID'] for k,r in records.items() if k.startswith('2027/')}
        assert previous<=current|introduced,'Public requests disappeared without introduced records; review required'
    candidate={'schemaVersion':1,'checkedAt':now(),'sources':sources,'records':records}
    # Derivation validates all records and roster associations before manifest publication.
    from catalog_model import derive
    derive(candidate)
    temp=TARGET.with_suffix('.candidate');temp.write_text(json.dumps(candidate,indent=2)+'\n',encoding='utf-8');os.replace(temp,TARGET)
    print(f'Published manifest for {len(records)} verified measures',flush=True)
if __name__=='__main__':refresh()

