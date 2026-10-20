import json, urllib.request, pathlib, datetime, hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
RAW=ROOT/'data'/'raw'
IDS=['HB0011','HB0154','HB0155','SB0069']
manifest=[]
def get(url,name):
    req=urllib.request.Request(url,headers={'User-Agent':'UtahBills research prototype; official-source snapshot'})
    with urllib.request.urlopen(req,timeout=45) as r: data=r.read()
    if b'Request Rejected' in data: raise RuntimeError('Source rejected request: '+url)
    (RAW/name).write_bytes(data)
    manifest.append(dict(url=url,path='data/raw/'+name,retrievedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),sha256=hashlib.sha256(data).hexdigest()))
    return data
for ident in IDS:
    b=json.loads(get('https://le.utah.gov/data/2026GS/'+ident+'.json',ident+'.json'))
    assert b['billNumber']==ident and b['sessionID']=='2026GS'
    for v in b['billVersionList']:
        for d in v['billDocs']:
            if d['fileType'] in ['Introduced','PubSub','Enrolled']:
                get(urllib.request.urljoin('https://le.utah.gov',d['url']),d['fileType']+'-'+d['fileName'])
(ROOT/'data'/'sources.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Saved',len(manifest),'source records; run analyze.py then review changes before publishing.')
