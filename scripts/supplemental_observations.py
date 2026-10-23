"""Independent, fail-closed request existence evidence; never a catalog substitute."""
import json,hashlib,os,re
from datetime import datetime
from pathlib import Path
import refresh_catalog as catalog
from request_status import parse_statuses,validate_statuses,normalized,STATUS_URL
ROOT=Path(__file__).resolve().parents[1]
TARGET=ROOT/'data/request-observations.json'
BASELINES=ROOT/'data/observation-baselines'
ATTEMPT=ROOT/'test-results/catalog-sources.json'
REPORT=ROOT/'test-results/observation-refresh.json'
MAX_MISSING=10
MAX_PERCENT=5
URLS={'requests':'https://le.utah.gov/data/2027GS/filelist.json','statuses':STATUS_URL,'index':'https://le.utah.gov/data/2027GS/billlist.json'}

def identity(sources):return tuple(sources[k]['sha256'] for k in URLS)
def load():return json.loads(TARGET.read_text(encoding='utf-8')) if TARGET.exists() else dict(schemaVersion=1,snapshots=[])
def stamp(source):
    value=datetime.fromisoformat(source['retrievedAt'])
    assert value.tzinfo is not None,'Observation timestamp must have a time zone'
    return value

def validate(sources,baseline,previous=None):
    from catalog_model import derive,read
    base=derive(baseline) # No supplemental input: the verified trust baseline cannot promote observations.
    for key,url in URLS.items():
        assert sources[key]['url']==url,'Unexpected official observation URL'
        stamp(sources[key]);read(sources[key])
    assert stamp(sources['requests'])>=stamp(baseline['sources']['requests2027']),'Observation predates baseline'
    rows=catalog.requests(sources['requests']);byid={r['trackingID']:r for r in rows}
    statuses=parse_statuses(read(sources['statuses']))
    # An unvalidated introduced index is not independently bypassed by this limited channel.
    assert json.loads(read(sources['index']))==json.loads(read(baseline['sources']['index2027'])),'Introduced index needs successful catalog validation first'
    introduced={b['trackingID']:b for b in base['measures'] if b['sessionID']=='2027GS'}
    verified={r['trackingID'] for r in base['requestArchive2027']}
    prior={r['trackingID'] for r in catalog.requests(baseline['sources']['requests2027'])}
    if previous:
        assert stamp(sources['requests'])>=stamp(previous['requests']),'Observation history out of order'
        prior|={r['trackingID'] for r in catalog.requests(previous['requests'])}
    assert prior<=byid.keys()|introduced.keys(),'Observed or verified request disappeared'
    assert len(byid.keys()-prior)<=catalog.MAX_NEW_RECORDS,'Suspicious request growth'
    missing=byid.keys()-statuses.keys()
    assert not missing&verified,'Previously verified status disappeared'
    assert not missing&introduced.keys(),'Unverified request-to-bill relationship'
    assert len(missing)<=MAX_MISSING and len(missing)*100<=len(rows)*MAX_PERCENT,'Supplemental observation bound exceeded'
    assert not statuses.keys()-byid.keys()-introduced.keys(),'Unexpected status identity'
    validate_statuses(read(sources['statuses']),[r for r in rows if r['trackingID'] not in missing])
    for ident,row in statuses.items():
        if row['officialNumber']=='Not Numbered':
            assert ident not in introduced,'Introduced status number disappeared'
            continue
        number=re.sub(r'S\d+$','',re.sub(r'[.\s]','',row['officialNumber']))
        bill=introduced.get(ident)
        assert bill and bill['billNumber']==number and normalized(bill['shortTitle'])==normalized(row['shortTitle']),'Contradictory introduced listing relationship'
    for ident in introduced:assert ident in statuses,'Introduced listing identity missing'
    return dict(officialTotal=len(rows),matchedStatuses=len(byid.keys()&statuses.keys()),missingIDs=sorted(missing))

def validated_snapshots(manifest):
    from catalog_model import read
    assert manifest['schemaVersion']==1,'Unsupported observation manifest'
    previous=None;result=[]
    for item in manifest['snapshots']:
        key=identity(item['sources']);assert previous is None or key!=identity(previous),'Duplicate adjacent observation snapshot'
        baseline=json.loads(read(item['baseline']))
        facts=validate(item['sources'],baseline,previous)
        assert facts==item['facts'],'Supplemental observation evidence mismatch'
        result.append(item);previous=item['sources']
    return result

def preserve(sources,baseline):
    old=load();items=validated_snapshots(old)
    facts=validate(sources,baseline,items[-1]['sources'] if items else None)
    # Same source content creates neither another history checkpoint nor new events.
    if items and identity(items[-1]['sources'])==identity(sources):return facts
    if facts['missingIDs'] or items:
        body=json.dumps(baseline,ensure_ascii=False,sort_keys=True).encode('utf-8');sha=hashlib.sha256(body).hexdigest()
        folder=BASELINES;folder.mkdir(parents=True,exist_ok=True);path=folder/(sha+'.json')
        if not path.exists():path.write_bytes(body)
        item=dict(sources=sources,baseline=dict(path=path.relative_to(ROOT).as_posix() if path.is_relative_to(ROOT) else str(path),sha256=sha),facts=facts)
        candidate=dict(schemaVersion=1,snapshots=[*items,item]);validated_snapshots(candidate)
        temp=TARGET.with_suffix('.candidate');temp.write_text(json.dumps(candidate,indent=2)+'\n',encoding='utf-8');os.replace(temp,TARGET)
    return facts

def run():
    report=dict(attemptedAt=catalog.now(),status='failed')
    try:
        attempt=json.loads(ATTEMPT.read_text(encoding='utf-8'))
        # Use the accepted current catalog if it already advanced; otherwise retain the captured baseline.
        current=json.loads(catalog.TARGET.read_text(encoding='utf-8'))
        baseline=current if stamp(current['sources']['requests2027'])<=stamp(attempt['sources']['requests']) else attempt['baseline']
        report.update(preserve(attempt['sources'],baseline));report['status']='success'
        report['scope']='Source observations only; not full catalog reconciliation'
    except Exception as error:report['error']=str(error);raise
    finally:
        report['finishedAt']=catalog.now();REPORT.parent.mkdir(exist_ok=True);REPORT.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print(json.dumps(report),flush=True)
if __name__=='__main__':run()
