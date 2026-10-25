"""Reproduce the Phase 5A saved-evidence audit; no network or catalog writes."""
import collections, hashlib, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT/'scripts'))
from catalog_model import derive, read
from request_status import parse_statuses, normalized
from supplemental_observations import load
from activity_model import events
from refresh_calendar import normalize

def run():
    manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
    data=derive(manifest,load())
    evidence=json.loads((ROOT/'docs/PHASE5A_SOURCES.json').read_text(encoding='utf-8'))
    raw=json.loads(read(manifest['sources']['requests2027']))
    original={r['trackingID']:r for r in raw}
    saved_status=parse_statuses(read(manifest['sources']['requestStatuses2027']))
    latest=json.loads(read(evidence['sources']['requests']))
    latest_byid={r['trackingID']:r for r in latest}
    latest_status=parse_statuses(read(evidence['sources']['statuses']))
    assert len(original)==len(raw) and len(latest_byid)==len(latest)
    visible=data['requests2027']+data['sourceObservedRequests2027']
    assert len({r['trackingID'] for r in visible})==len(visible)
    assert {r['trackingID'] for r in visible}==set(original)
    sponsors={p['id'] for p in data['legislators']}|{p['id'] for p in data['contactPeople']}
    changes=[];unknown=[];abandoned=[];history_count=status_history_count=0
    for row in visible:
        ident=row['trackingID'];source=original[ident]
        assert row['shortTitle']==source['shortTitle'] and row['sponsor']==source['sponsor'],ident
        assert row['introducedBill'] is None,ident
        if row['sponsor'] and row['sponsor'] not in sponsors:unknown.append(ident)
        if row['verificationState']=='status-verified':
            status=saved_status[ident]
            assert normalized(status['shortTitle'])==normalized(row['shortTitle'])
            assert row['officialStatus']==status['officialStatus']
            assert row['officialRequestUrl']==manifest['sources']['requestStatuses2027']['url']+'#trk'+ident
            if row['officialStatus']=='Bill Abandoned per Sponsor':abandoned.append({'trackingID':ident,'title':row['shortTitle'],'sponsorID':row['sponsor']})
        else:
            assert ident not in saved_status and not row.get('officialStatus')
            assert row['officialRequestUrl']==manifest['sources']['requests2027']['url']
        for h in row['history']:
            record=next(r for r in json.loads(read(h['source'])) if r['trackingID']==ident)
            assert h['shortTitle']==record['shortTitle'] and h['sponsor']==record['sponsor']
            history_count+=1
        for h in row.get('statusHistory',[]):
            assert parse_statuses(read(h['source']))[ident]['officialStatus']==h['officialStatus']
            status_history_count+=1
        if ident in latest_byid:
            for field in ('shortTitle','sponsor'):
                if source[field]!=latest_byid[ident][field]:changes.append({'trackingID':ident,'field':field,'saved':source[field],'observed':latest_byid[ident][field]})
            new=latest_status.get(ident,{}).get('officialStatus')
            if row.get('officialStatus')!=new:changes.append({'trackingID':ident,'field':'officialStatus','saved':row.get('officialStatus'),'observed':new})
    calendar=json.loads((ROOT/'data/calendar.json').read_text(encoding='utf-8'))
    normalized_events=[]
    for s in calendar['sources']:
        assert hashlib.sha256(s['body'].encode()).hexdigest()==s['sha256']
        b=json.loads(s['body']);normalized_events+=normalize(b,b['year'],b['month'],s['url'])
    assert len(normalized_events)==len(calendar['events'])
    for a,b in zip(sorted(normalized_events,key=lambda e:(e['date'],e['start'],e['name'])),calendar['events']):
        assert all(a[k]==b[k] for k in a)
    activity,_=events(manifest,load());current=[e for e in activity if e['session']=='2027']
    assert len({e['id'] for e in current})==len(current)
    for e in current:
        assert e['trackingID'] in original
        assert e['history'].startswith('#request/')
        assert e['dateLabel'].lower().find('observ')>=0
    archived=ROOT/'docs/evidence/phase4u-scheduled-40109485828'
    preservation=json.loads((archived/'evidence-manifest.json').read_text(encoding='utf-8'))
    for path,sha in preservation['files'].items():assert hashlib.sha256((archived/path).read_bytes()).hexdigest()==sha,path
    report={'baselineCommit':'68b48797548f86dd58d0b7293d6ef34b09d5af2e','sourceComparison':'PHASE5A_SOURCES.json','publishedSnapshot':{'checkedAt':data['checkedAt'],'requestSource':manifest['sources']['requests2027']['retrievedAt'],'statusSource':manifest['sources']['requestStatuses2027']['retrievedAt'],'visibleRequests':len(visible),'verifiedStatuses':len(data['requests2027']),'sourceObserved':len(data['sourceObservedRequests2027']),'statusCounts':dict(collections.Counter(r.get('officialStatus','Official status not confirmed') for r in visible)),'introducedMeasures':data['coverage']['2027']['imported'],'roster2026':len(data['legislators']),'unknownSponsorIDs':unknown},'requestAudit':{'checkedTrackingIDs':sorted(original),'titleSponsorHistoryEntriesChecked':history_count,'statusHistoryEntriesChecked':status_history_count,'abandonedRequests':abandoned,'missingFromLatest':sorted(original.keys()-latest_byid.keys()),'newInLatest':sorted(latest_byid.keys()-original.keys()),'changesSincePublished':changes},'activity2027':{'events':len(current),'types':dict(collections.Counter(e['kind'] for e in current)),'undated':sum(not e['date'] for e in current)},'calendar':{'events':len(calendar['events']),'coverageStart':calendar['coverageStart'],'coverageEnd':calendar['coverageEnd'],'checkedAt':calendar['checkedAt'],'feedDates':[s['retrievedAt'] for s in calendar['sources']],'categories':dict(collections.Counter(e['category'] for e in calendar['events'])),'statuses':dict(collections.Counter(e['status'] or 'No special status' for e in calendar['events']))},'scheduledEvidenceFilesVerified':len(preservation['files']),'result':'All saved-record assertions passed; new official evidence is not automatically published.'}
    return report
if __name__=='__main__':
    report=run();text=json.dumps(report,indent=2,ensure_ascii=False)+'\n'
    if '--report' in sys.argv:(ROOT/'docs/PHASE5A_AUDIT.json').write_text(text,encoding='utf-8')
    print(json.dumps({k:v for k,v in report.items() if k!='requestAudit'},indent=2))
