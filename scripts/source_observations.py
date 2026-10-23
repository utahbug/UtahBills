"""Source-supported request existence, separate from the verified publication subset."""
from request_publication import published_requests, source_identity
from refresh_catalog import requests

def project(manifest, verified, supplemental=None):
    sources=list(manifest.get('requestHistory', []))
    current=manifest['sources']['requests2027']
    if not sources or source_identity(sources[-1])!=source_identity(current):sources.append(current)
    from supplemental_observations import validated_snapshots,stamp
    extra=validated_snapshots(supplemental) if supplemental else []
    sources=[{**s,'_stateAt':s.get('requestVerification',{}).get('verifiedAt') or (manifest['checkedAt'] if source_identity(s)==source_identity(current) else s['retrievedAt'])} for s in sources]
    for item in extra:
        sources.append({**item['sources']['requests'],'supplemental':item,'_stateAt':max(item['sources'].values(),key=stamp)['retrievedAt']})
    sources.sort(key=lambda s:stamp({'retrievedAt':s['_stateAt']}))
    eligible={ident for item in extra for ident in item['facts']['missingIDs']}
    eligible|={item['trackingID'] for s in sources for item in s.get('requestVerification', {}).get('withheld', [])}
    observed={}
    for source in sources:
        supplement=source.get('supplemental')
        accepted=set() if supplement else {r['trackingID'] for r in published_requests(source)} # Revalidates the bounded policy and pinned source hashes.
        verification=source.get('requestVerification', {})
        missing=set(supplement['facts']['missingIDs']) if supplement else {x['trackingID'] for x in verification.get('withheld', [])}
        provenance={k:v for k,v in source.items() if k not in ('requestVerification','supplemental','_stateAt')}
        for row in requests(source):
            ident=row['trackingID']
            if ident not in eligible or supplement and ident not in missing and ident in verified:continue
            assert supplement or ident in accepted or ident in missing, 'Unclassified source observation'
            state='status-verified' if ident in accepted else 'source-observed'
            entry=observed.setdefault(ident, dict(row,history=[],verificationHistory=[],firstSeenAt=source['retrievedAt']))
            if not entry['history'] or any(entry[k]!=row[k] for k in ('shortTitle','sponsor')):
                entry['history'].append(dict(shortTitle=row['shortTitle'],sponsor=row['sponsor'],observedAt=source['retrievedAt'],source=provenance,verificationState=state))
            if not entry['verificationHistory'] or entry['verificationHistory'][-1]['state']!=state:
                entry['verificationHistory'].append(dict(state=state,observedAt=source['_stateAt'],source=provenance,statusSource=supplement['sources']['statuses'] if supplement else verification.get('statusSource')))
            entry.update(row,verificationState=state,lastSeenAt=source['retrievedAt'],pendingCatalogReconciliation=bool(supplement and ident not in missing))
    current_missing={x['trackingID'] for x in current.get('requestVerification',{}).get('withheld',[])}
    freshest=extra[-1] if extra and stamp(extra[-1]['sources']['requests'])>stamp(current) else None
    if freshest:
        present={r['trackingID'] for r in requests(freshest['sources']['requests'])}
        current_missing|=(eligible&present)-verified.keys()
    archive=[]
    for ident,entry in observed.items():
        if ident in current_missing:
            assert ident not in verified, 'Previously verified request cannot become source-observed'
            latest=sources[-1]
            status_source=latest['supplemental']['sources']['statuses'] if latest.get('supplemental') else manifest['sources']['requestStatuses2027']
            entry.update(currentlyListed=True,introducedBill=None,officialRequestUrl=current['url'],statusListingUrl=status_source['url'],statusSource=status_source,statusHistory=[])
            archive.append(entry)
    coverage=None
    if freshest:
        raw={r['trackingID'] for r in requests(freshest['sources']['requests'])}
        matched=len(raw&verified.keys());pending=len(raw)-matched-len(current_missing)
        coverage=dict(status='partial',officialTotal=len(raw),verifiedTotal=matched,withheld=[dict(trackingID=i,reason='Supplemental source observation; official status not confirmed') for i in sorted(current_missing)],pendingCatalogTotal=pending,observedAt=freshest['sources']['requests']['retrievedAt'])
    return archive,list(observed.values()),coverage
