"""Deterministic, non-AI catalog projection with explicit session and stable-ID joins."""
import json,re,pathlib,hashlib,html
from datetime import datetime
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
def read(source):
    body=(ROOT/source['path']).read_bytes();assert hashlib.sha256(body).hexdigest()==source['sha256'],'Source checksum mismatch';return body
class Roster(HTMLParser):
    def __init__(self):super().__init__();self.rows=[];self.row=None;self.cell=None
    def handle_starttag(self,tag,attrs):
        if tag=='tr':self.row=[]
        if tag=='td' and self.row is not None:self.cell={'text':'','links':[]}
        if tag=='a' and self.cell is not None:self.cell['links'].append(dict(attrs).get('href',''))
    def handle_data(self,text):
        if self.cell is not None:self.cell['text']+=text
    def handle_endtag(self,tag):
        if tag=='td' and self.cell is not None:self.row.append(self.cell);self.cell=None
        if tag=='tr' and self.row is not None:self.rows.append(self.row);self.row=None

def namekey(s):return re.sub('[^a-z]','',re.sub(r'^(Rep\.|Sen\.)\s*','',s).lower())
def clean(s):return html.unescape(re.sub('<[^>]+>',' ',s or '')).strip()
def derive(manifest,supplemental=None):
    sources=manifest['sources'];measure=[];names={};titles={}
    for key,history in manifest.get('measureHistory',{}).items():
        for source in history:
            old=json.loads(read(source));assert old['sessionID']==key.split('/')[0]+'GS' and old['billNumber']==key.split('/')[1],'Invalid archived measure identity'
            if old.get('shortTitle'):titles.setdefault(key,[]).append(dict(shortTitle=old['shortTitle'],sessionID=old['sessionID'],billNumber=old['billNumber'],observedAt=source['retrievedAt'],source=source))
    for key,source in sorted(manifest['records'].items()):
        b=json.loads(read(source));year,ident=key.split('/');assert b['sessionID']==year+'GS' and b['billNumber']==ident
        for field in ('primeSponsor','floorSponsor'):
            if year=='2026' and b.get(field):names.setdefault(namekey(b[field+'Name']),set()).add(b[field])
        codes={a['actionCode'] for a in b['actionHistoryList']};versions=[];cosponsors={}
        for v in b['billVersionList']:
            for c in v.get('coSponsorList',[]):
                assert c.get('lid') and c.get('house') in ('H','S'),'Unknown cosponsor schema'
                cosponsors.setdefault(c['lid'],[]).append(v['billNumber'])
            for d in v['billDocs']:
                if d['fileType'] in ('Introduced','PubSub','Enrolled','Amended','PubAmend','AmdPages'):
                    from urllib.parse import urljoin, urlparse
                    url=urljoin('https://le.utah.gov',d['url']);parsed=urlparse(url)
                    assert parsed.scheme in ('http','https') and (parsed.hostname or '').endswith(('.utah.gov','.utleg.gov')),'Unexpected document host'
                    versions.append(dict(id=v['billNumber'],label={'PubSub':'Substitute','PubAmend':'Published amendment','AmdPages':'Amendment pages','Amended':'Amended text'}.get(d['fileType'],d['fileType']),url=urljoin('https://le.utah.gov',d['url']),date=d['fileDate']))
        committee=sorted({x['committeeName'] for x in b.get('agendaList',[]) if x.get('committeeName')}|{x['name'] for x in b.get('recommendingCommitteeList',[]) if x.get('name')})
        status='Signed' if 'GSIGN' in codes else 'Vetoed' if 'GVETO' in codes else 'Filed' if codes.intersection({'HFILED','SFILED'}) else 'Other recorded action'
        measure.append(dict(**({'titleHistory':titles[key]} if key in titles else {}),trackingID=b['trackingID'],billNumber=ident,billNumberShort=b['billNumberShort'],shortTitle=b['shortTitle'],sessionID=b['sessionID'],kind='Bill' if re.fullmatch('[HS]B[0-9]+',ident) else 'Joint resolution' if 'JR' in ident else 'Concurrent resolution' if 'CR' in ident else 'Resolution',primeSponsor=b['primeSponsor'],primeSponsorName=b['primeSponsorName'],floorSponsor=b['floorSponsor'],floorSponsorName=b['floorSponsorName'],cosponsors=cosponsors,generalProvisions=clean(b.get('generalProvisions')),committees=committee,topic='Official record',status=status,lastAction=b['lastAction'],lastActionDate=datetime.strptime(b['lastActionDate'],'%m/%d/%Y').date().isoformat() if b['lastActionDate'] else '',sourceLastActionDate=b['lastActionDate'],lastActionOwner=b['lastActionOwner'],versions=versions,actionHistoryList=b['actionHistoryList'],sourceUrl=source['url'],retrievedAt=source['retrievedAt'],officialUrl=f'https://le.utah.gov/~{year}/bills/static/{ident}.html',detailed=False))
    # Historical year roster determines membership/district; current contact feed is an independently dated layer.
    contacts=json.loads(read(sources['contacts']))['legislators'];byid={x['id']:x for x in contacts}
    for c in contacts:names.setdefault(namekey(c['fullName']),set()).add(c['id'])
    maps={}
    for house,key,letter in [('H','houseMaps','L'),('S','senateMaps','U')]:
        text=read(sources[key]).decode('utf-8')
        for filename,district in re.findall(r'href="(SLD22'+letter+r'_49(\d{3})\.pdf)"',text):maps[(house,int(district))]=sources[key]['url']+filename
    assert len(maps)==104,'Incomplete official district-map index'
    parser=Roster();parser.feed(read(sources['roster2026']).decode('utf-8-sig'));people=[]
    for row in parser.rows:
        if len(row)<4 or row[1]['text'] not in ('Representative','Senator'):continue
        full=row[0]['text'].strip();house='H' if row[1]['text']=='Representative' else 'S';district=int(row[3]['text'])
        links=[u for cell in row for u in cell['links']];ids=[m[1] for u in links if (m:=re.search(r'Listbox[23]=([A-Z]+)',u))]
        candidates=set(ids) or names.get(namekey(full),set());assert len(candidates)<=1,'Ambiguous full-name identity'
        ident=next(iter(candidates)) if candidates else f'UNRESOLVED-{house}{district}-{namekey(full)}'
        c=byid.get(ident);c=c if c and namekey(c['fullName'])==namekey(full) else None
        # Contacts are current, not historical; never give a successor's contact details.
        people.append(dict(id=ident,name=full,house=house,district=district,session='2026GS',email=c.get('email','') if c else '',phone=(c.get('workPhone') or c.get('cell') or '') if c else '',address=c.get('address','') if c else '',contactCheckedAt=sources['contacts']['retrievedAt'],currentContact=bool(c),biography=('https://house.utleg.gov/rep/' if house=='H' else 'https://senate.utah.gov/sen/')+ident if c else sources['roster2026']['url'],mapUrl=maps[(house,district)],rosterSource=sources['roster2026']['url']))
    assert len(people)>=104 and len({p['id'] for p in people})==len(people),'Incomplete/duplicate roster'
    ids={p['id'] for p in people};unmatched=sorted({b[k] for b in measure if b['sessionID']=='2026GS' for k in ('primeSponsor','floorSponsor') if b[k] and b[k] not in ids})
    # Preserve every observed request revision; reconcile only an exact official tracking ID.
    from request_publication import published_requests as checked_requests, source_identity
    snapshots=list(manifest.get('requestHistory',[]))
    if not snapshots or source_identity(snapshots[-1])!=source_identity(sources['requests2027']):snapshots.append(sources['requests2027'])
    archive={}
    for source in snapshots:
        verification=source.get('requestVerification')
        if verification:
            assert set(verification['previouslyVerifiedIDs'])==set(archive), 'Request verification baseline does not match preserved history'
            assert not set(archive).intersection(x['trackingID'] for x in verification['withheld']), 'Previously verified request withheld in history'
        observed=verification['verifiedAt'] if verification else source['retrievedAt']
        provenance={k:v for k,v in source.items() if k!='requestVerification'}
        for r in checked_requests(source):
            entry=archive.setdefault(r['trackingID'],dict(r,history=[],firstSeenAt=observed))
            if not entry['history'] or any(entry[k]!=r[k] for k in ('shortTitle','sponsor')):
                entry['history'].append(dict(shortTitle=r['shortTitle'],sponsor=r['sponsor'],observedAt=observed,source=provenance))
            entry.update(r);entry['lastSeenAt']=source['retrievedAt']
    introduced={}
    for b in measure:
        if b['sessionID']=='2027GS':
            assert b['trackingID'] not in introduced,'Ambiguous tracking identifier'
            introduced[b['trackingID']]=b['billNumber']
    current={r['trackingID'] for r in checked_requests(sources['requests2027'])}
    verification=sources['requests2027'].get('requestVerification')
    if verification:
        assert verification['statusSource']==sources['requestStatuses2027'], 'Request verification uses stale status source'
        assert not set(introduced).intersection(x['trackingID'] for x in verification['withheld']), 'Introduced relationship withheld'
    # Numbered listing relationships must agree even when every request has a status.
    if sources.get('requestStatuses2027'):
        from request_status import parse_statuses, normalized
        rows=parse_statuses(read(sources['requestStatuses2027']))
        for ident,row in rows.items():
            if row['officialNumber']=='Not Numbered':continue
            number=re.sub(r'S\d+$','',re.sub(r'[.\s]','',row['officialNumber']))
            assert re.fullmatch(r'[HS](?:B|R|JR|CR)\d{3,4}',number) and introduced.get(ident)==number, 'Unreconciled numbered listing'
        for b in measure:
            if b['sessionID']!='2027GS':continue
            row=rows.get(b['trackingID'])
            assert row and re.sub(r'S\d+$','',re.sub(r'[.\s]','',row['officialNumber']))==b['billNumber'], 'Publication requires verified introduced listing identity'
            assert normalized(row['shortTitle'])==normalized(b['shortTitle']), 'Introduced listing title mismatch'
    publication={k:verification[k] for k in ('status','officialTotal','verifiedTotal','withheld')} if verification else dict(status='success',officialTotal=len(current),verifiedTotal=len(current),withheld=[])
    for ident,r in archive.items():
        r['verificationState']='status-verified';r['introducedBill']=introduced.get(ident);r['currentlyListed']=ident in current
        if r['currentlyListed']:r['lastSeenAt']=sources['requests2027']['retrievedAt']
        r['sponsorName']=byid.get(r['sponsor'],{}).get('fullName') or next((p['name'] for p in people if p['id']==r['sponsor']),r['sponsor'])
    # Status is a separately sourced fact, never inferred from document availability.
    from request_status import parse_statuses,validate_statuses,STATUS_URL
    status_source=sources.get('requestStatuses2027')
    status_history=list(manifest.get('requestStatusHistory',[]))
    if status_source and (not status_history or status_history[-1]['sha256']!=status_source['sha256']):status_history.append(status_source)
    for source in status_history:
        for ident,status in parse_statuses(read(source)).items():
            if ident not in archive:continue
            entry=archive[ident];history=entry.setdefault('statusHistory',[])
            if not history or history[-1]['officialStatus']!=status['officialStatus']:
                history.append(dict(officialStatus=status['officialStatus'],observedAt=source['retrievedAt'],source=source))
            entry.update(officialStatus=status['officialStatus'],statusCheckedAt=source['retrievedAt'],statusSource=source)
    if status_source:
        statuses=validate_statuses(read(status_source),checked_requests(sources['requests2027']))
        for ident in current:
            archive[ident].update(officialRequestUrl=STATUS_URL+'#'+statuses[ident]['anchor'] if statuses[ident].get('anchor') else None,officialStatus=statuses[ident]['officialStatus'],statusCheckedAt=status_source['retrievedAt'],statusSource=status_source)
    from source_observations import project
    source_observed, observation_history, observation_coverage=project(manifest,archive,supplemental)
    request_archive=list(archive.values())
    requests=[r for r in request_archive if r['currentlyListed'] and not r['introducedBill']]
    coverage={}
    for year in (2026,2027):
        expected={x['number'] for x in json.loads(read(sources['index'+str(year)]))};obtained={b['billNumber'] for b in measure if b['sessionID']==str(year)+'GS'}
        assert obtained<=expected
        coverage[str(year)]={'expected':len(expected),'imported':len(obtained),'complete':bool(expected) and expected==obtained,'emptyIndex':not expected,'missing':sorted(expected-obtained),'sourceUrl':sources['index'+str(year)]['url'],'checkedAt':sources['index'+str(year)]['retrievedAt']}
    return dict(requestObservationCoverage=observation_coverage,sourceObservedRequests2027=source_observed,requestObservations2027=observation_history,checkedAt=manifest['checkedAt'],requestPublication=publication,coverage=coverage,measures=measure,legislators=sorted(people,key=lambda p:p['name']),contactPeople=[dict(id=c['id'],name=c['fullName'],house=c.get('house',''),district=c.get('district',''),email=c.get('email',''),phone=c.get('workPhone') or c.get('cell',''),address=c.get('address',''),currentContact=True,contactCheckedAt=sources['contacts']['retrievedAt'],biography=('https://house.utleg.gov/rep/' if c.get('house')=='H' else 'https://senate.utah.gov/sen/')+c['id']) for c in contacts if c.get('house') in ('H','S')],unmatchedSponsors=unmatched,requests2027=requests,requestArchive2027=request_archive,requestListing=STATUS_URL,requestSource=sources['requests2027']['url'],requestCheckedAt=sources['requests2027']['retrievedAt'],rosterSource=sources['roster2026']['url'],contactSource=sources['contacts']['url'])
if __name__=='__main__':
    import sys
    from supplemental_observations import load
    d=derive(json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8')),load())
    if '--build' in sys.argv:
        out=ROOT/'dist/data';(out/'measures').mkdir(exist_ok=True)
        for b in d['measures']:
            target=out/'measures'/b['sessionID'];target.mkdir(exist_ok=True);(target/(b['billNumber']+'.json')).write_text(json.dumps(b,ensure_ascii=False),encoding='utf-8')
        d['measures']=[{k:v for k,v in b.items() if k not in ('actionHistoryList','versions')}|{'versionCount':len({v['id'] for v in b['versions']})} for b in d['measures']]
        (out/'catalog-ui.json').write_text(json.dumps(d,ensure_ascii=False),encoding='utf-8')
    print('Catalog:',{y:v['imported'] for y,v in d['coverage'].items()},'Roster:',len(d['legislators']),'Requests:',len(d['requests2027']),'Unmatched:',d['unmatchedSponsors'])
