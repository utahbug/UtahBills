"""Source-supported request existence, separate from the verified publication subset."""
from request_publication import published_requests, source_identity
from refresh_catalog import requests

def project(manifest, verified):
    sources=list(manifest.get('requestHistory', []))
    current=manifest['sources']['requests2027']
    if not sources or source_identity(sources[-1])!=source_identity(current):sources.append(current)
    eligible={item['trackingID'] for s in sources for item in s.get('requestVerification', {}).get('withheld', [])}
    observed={}
    for source in sources:
        accepted={r['trackingID'] for r in published_requests(source)} # Revalidates the bounded policy and pinned source hashes.
        verification=source.get('requestVerification', {})
        missing={x['trackingID'] for x in verification.get('withheld', [])}
        provenance={k:v for k,v in source.items() if k!='requestVerification'}
        for row in requests(source):
            ident=row['trackingID']
            if ident not in eligible:continue
            assert ident in accepted or ident in missing, 'Unclassified source observation'
            state='status-verified' if ident in accepted else 'source-observed'
            entry=observed.setdefault(ident, dict(row,history=[],verificationHistory=[],firstSeenAt=source['retrievedAt']))
            if not entry['history'] or any(entry[k]!=row[k] for k in ('shortTitle','sponsor')):
                entry['history'].append(dict(shortTitle=row['shortTitle'],sponsor=row['sponsor'],observedAt=source['retrievedAt'],source=provenance,verificationState=state))
            if not entry['verificationHistory'] or entry['verificationHistory'][-1]['state']!=state:
                entry['verificationHistory'].append(dict(state=state,observedAt=verification.get('verifiedAt',source['retrievedAt']),source=provenance,statusSource=verification.get('statusSource')))
            entry.update(row,verificationState=state,lastSeenAt=source['retrievedAt'])
    current_missing={x['trackingID'] for x in current.get('requestVerification',{}).get('withheld',[])}
    archive=[]
    for ident,entry in observed.items():
        if ident in current_missing:
            assert ident not in verified, 'Previously verified request cannot become source-observed'
            entry.update(currentlyListed=True,introducedBill=None,officialRequestUrl=current['url'],statusListingUrl=manifest['sources']['requestStatuses2027']['url'],statusSource=manifest['sources']['requestStatuses2027'],statusHistory=[])
            archive.append(entry)
    return archive,list(observed.values())
