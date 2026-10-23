"""Bounded publication policy; raw feeds are never edited or treated as subsets."""
from request_status import parse_statuses, validate_statuses
MAX_WITHHELD = 3

def reconcile(body, requests, previously_verified=(), introduced=()):
    rows = parse_statuses(body)
    identities = {r['trackingID'] for r in requests}
    assert len(identities) == len(requests), 'Duplicate request identity'
    missing = identities - rows.keys()
    assert not missing.intersection(previously_verified), 'Previously verified request status disappeared: ' + ', '.join(sorted(missing.intersection(previously_verified)))
    assert not missing.intersection(introduced), 'Introduced relationship lacks request status'
    if missing:
        assert previously_verified, 'Partial publication requires a verified baseline'
        assert len(missing) <= MAX_WITHHELD and len(missing) * 100 <= len(requests), 'Missing statuses exceed bounded partial-publication limit'
        assert not (rows.keys() - identities - set(introduced)), 'Unexplained extra status identities during partial reconciliation'
    accepted = [r for r in requests if r['trackingID'] not in missing]
    validate_statuses(body, accepted)  # All titles/statuses still require exact authoritative agreement.
    return dict(status='partial' if missing else 'success', officialTotal=len(requests), verifiedTotal=len(accepted),
                acceptedIDs=sorted(r['trackingID'] for r in accepted),
                withheld=[dict(trackingID=i, reason='New request awaiting first matching official status') for i in sorted(missing)])

def source_identity(source):
    verification = source.get('requestVerification', {})
    return source['sha256'], verification.get('statusSource', {}).get('sha256'), tuple(verification.get('acceptedIDs', []))

def published_requests(source):
    from refresh_catalog import requests, read
    raw = requests(source)
    verification = source.get('requestVerification')
    if not verification:
        return raw  # Historical fully verified snapshots retain their original evidence and dates.
    # Reproduce the subset from complete preserved bytes; never trust a stored exclusion list alone.
    result = reconcile(read(verification['statusSource']), raw, verification['previouslyVerifiedIDs'], verification['introducedIDs'])
    for key in ('status', 'officialTotal', 'verifiedTotal', 'acceptedIDs', 'withheld'):
        assert verification[key] == result[key], 'Request publication evidence mismatch: ' + key
    accepted = set(result['acceptedIDs'])
    return [r for r in raw if r['trackingID'] in accepted]
