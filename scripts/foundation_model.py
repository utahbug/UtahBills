"""Reproducible archive audit and on-demand projections. No inferred legal analysis."""
import json,re,collections,pathlib
from catalog_model import ROOT,read,Roster,derive
from supplemental_observations import load as observation_manifest
from acquire_votes import parse
from refresh_archive import expected

def official_listing(source):
 text=read(source).decode('utf-8-sig');assert 'Browse Bills' in text and '(2026GS)' in text,'Wrong session listing'
 p=Roster();p.feed(text);records={};conflicts=[]
 for row in p.rows:
  if len(row)!=5:continue
  number=row[0]['text'].strip();match=re.fullmatch(r'([HS](?:B|R|JR|CR)\d{3,4})(?:S\d+)?',number)
  if not match:continue
  ident=match[1];value=dict(number=number,title=row[1]['text'].strip(),sponsor=row[2]['text'].strip(),floorSponsor=row[3]['text'].strip(),status=row[4]['text'].strip(),links=row[0]['links'])
  if ident in records and records[ident]!=value:conflicts.append(dict(bill=ident,first=records[ident],other=value))
  records[ident]=value
 assert records,'No numbered records on official session listing'
 return records,conflicts

def project_vote(item,people):
 a=item['action'];base=dict(id=item['id'],bill=item['bill'],session=item['session'],actionDate=a['actionDate'],action=a['description'],body=a['owner'],committee=a['actionClass']=='A',motion=a['description'],classification='Official action — detailed question unavailable',version=None,sourceTime='',sourceTimeKind='Unavailable',result='See official record',voice=a['voiceVote']=='1',tally={},individuals=[],actionSource=item['actionSource'])
 if not base['voice'] and re.fullmatch(r'\d+-\d+-\d+',a.get('voteStr','')):
  base['tally']=dict(zip(['Yes','No','Absent / not voting'],map(int,a['voteStr'].split('-'))))
 if item.get('source'):
  try:
   v=parse(read(item['source']),item['bill'],a,people if item['session']=='2026GS' else [])
   assert re.search(r'\b'+re.escape(item['session'][:4])+r'\b',v['sourceTime']),'Vote source date does not establish the expected session year'
   identities=[p['legislatorId'] for p in v['individuals'] if p['legislatorId']];assert len(identities)==len(set(identities)),'Multiple names resolve to the same legislator in one vote'
   if not v['version'] and v['committee']:
    version=re.search(r'<br\s*/?>\s*('+re.escape(item['bill'])+r'(?:S\d+)?)\s*-',read(item['source']).decode('utf-8-sig'))
    if version:v['version']=version[1]
   v.update(id=item['id'],source=item['source'],actionSource=item['actionSource'],session=item['session'],detailState='verified');return v,None
  except Exception as e:error=type(e).__name__+': '+str(e)
 else:error=item.get('error','Official vote response not retrieved')
 base.update(source=item.get('source',{'url':item['url'],'retrievedAt':'','path':''}),detailState='unavailable',detailError=error)
 return base,dict(id=item['id'],url=item['url'],reason=error,state=item['state'])

def build(write=False):
 manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));verification=json.loads((ROOT/'data/session-verification.json').read_text(encoding='utf-8'));archive=json.loads((ROOT/'data/archive.json').read_text(encoding='utf-8'));data=derive(manifest,observation_manifest())
 listing,conflicts=official_listing(verification['sources']['listing2026']);index=json.loads(read(verification['sources']['index2026']));index_ids={r['number'] for r in index};records={};versions=actions=documents=refs=0
 for key,source in manifest['records'].items():
  b=json.loads(read(source));records[key]=b
  if key.startswith('2026/'):
   versions+=len(b['billVersionList']);actions+=len(b['actionHistoryList']);documents+=sum(len(v['billDocs']) for v in b['billVersionList']);refs+=sum(len(v.get('sectionAffectedList',[])) for v in b['billVersionList'])
 actual={k.split('/')[1] for k in records if k.startswith('2026/')};want=expected(manifest);votes=collections.defaultdict(list);missing=[]
 for key,item in want.items():
  saved=archive['votes'].get(key)
  if not saved:item={**item,'state':'not-retrieved','error':'New official vote awaiting retrieval'}
  elif saved.get('marker')!=item['marker']:item={**item,'state':'changed','error':'Official action changed; previous source retained in archive'}
  else:item=saved
  v,error=project_vote(item,data['legislators']);votes[item['session']+'/'+item['bill']].append(v)
  if error:missing.append(error)
 missing_index=sorted(index_ids-actual);missing_listing=sorted(set(listing)-actual);extra_listing=sorted(actual-set(listing))
 report=dict(schemaVersion=1,scope='Indexed 2026 General Session metadata and referenced official votes; document links are not an offline full-text archive.',sources=verification['sources'],catalogCheckedAt=manifest['checkedAt'],voteAcquisitionCheckedAt=archive['checkedAt'],sessions={'2026':dict(expected=len(index_ids),retrieved=len(actual),humanListingCount=len(listing),metadataComplete=bool(index_ids) and actual==index_ids and not missing_listing and not extra_listing and not conflicts,missingIndexRecords=missing_index,missingListingRecords=missing_listing,absentFromSubjectListing=extra_listing,versionRecords=versions,actionRecords=actions,documentReferences=documents,statutoryReferences=refs)},voteReferences=len(want),retrievedVoteSources=sum(bool(i.get('source')) for i in archive['votes'].values()),verifiedVoteDetails=sum(v['detailState']=='verified' for vs in votes.values() for v in vs),individualEntries=sum(len(v['individuals']) for vs in votes.values() for v in vs),missingVoteDetails=missing,officialListingConflicts=conflicts)
 # Changed/missing source metadata must be visible, not silently treated as a complete archive.
 report['unresolvedIndividualEntries']=sum(not p['legislatorId'] for vs in votes.values() for v in vs for p in v['individuals'])
 report['unresolvedVoterNames']=sorted({p['name'] for vs in votes.values() for v in vs for p in v['individuals'] if not p['legislatorId']})
 report['refreshIssues']=[dict(id=k,error=v['refreshError'],attemptedAt=v.get('failedAttemptAt')) for k,v in archive['votes'].items() if v.get('refreshError')]
 report['missingVersionDocuments']=[dict(bill=b['billNumber'],session=b['sessionID'],version=v['billNumber']) for b in records.values() for v in b['billVersionList'] if not any(d['fileType'] in ('Introduced','PubSub','Enrolled','Amended','PubAmend','AmdPages') for d in v['billDocs'])]
 report['versionDocumentReferences']=sum(d['fileType'] in ('Introduced','PubSub','Enrolled','Amended','PubAmend','AmdPages') for b in records.values() for v in b['billVersionList'] for d in v['billDocs'])
 report['officialTitleDifferences']=[dict(bill=k,listingTitle=v['title'],recordTitle=records['2026/'+k]['shortTitle']) for k,v in listing.items() if '2026/'+k in records and ' '.join(v['title'].split())!=' '.join(records['2026/'+k]['shortTitle'].split())]
 report['officialStatusDifferences']=[dict(bill=k,listingStatus=v['status'],recordAction=records['2026/'+k]['lastAction']) for k,v in listing.items() if '2026/'+k in records and v['status']!=records['2026/'+k]['lastAction']]
 report['indexMarkerDifferences']=[r['number'] for r in index if manifest['records'].get('2026/'+r['number'],{}).get('updatetime')!=r.get('updatetime')]
 report['sessions']['2026']['metadataComplete'] &= not bool(report['indexMarkerDifferences'])
 from request_status import parse_statuses
 rows2027=parse_statuses(read(manifest['sources']['requestStatuses2027']))
 listed2027={m[1] for r in rows2027.values() if (m:=re.fullmatch(r'([HS](?:B|R|JR|CR)\d{3,4})(?:S\d+)?',re.sub(r'[.\s]','',r['officialNumber'])))}
 indexed2027={b['billNumber'] for b in data['measures'] if b['sessionID']=='2027GS'}
 report['sessions']['2027']={**data['coverage']['2027'],'publicRequests':len(data['requests2027']),'verifiedPublicRequests':len(data['requests2027']),'sourceObservedRequests':len(data['sourceObservedRequests2027']),'visiblePublicRequests':len(data['requests2027'])+len(data['sourceObservedRequests2027']),'requestObservationCoverage':data['requestObservationCoverage'],'requestPublication':data['requestPublication'],'requestsCheckedAt':data['requestCheckedAt'],'humanListingIntroducedCount':len(listed2027),'listingMissingFromIndex':sorted(listed2027-indexed2027),'indexMissingFromListing':sorted(indexed2027-listed2027)}
 report['measures']=[dict(session=b['sessionID'],bill=b['billNumber'],versions=[dict(id=v['billNumber'],minorVersion=v['minorVersion'],documentReferences=len(v['billDocs'])) for v in b['billVersionList']],actions=len(b['actionHistoryList']),voteReferences=len(votes.get(b['sessionID']+'/'+b['billNumber'],[])),missingVoteDetails=sum(v['detailState']!='verified' for v in votes.get(b['sessionID']+'/'+b['billNumber'],[])),source=manifest['records'][key]) for key,b in records.items()]
 if write:
  out=ROOT/'dist/data';(out/'archive-votes').mkdir(exist_ok=True);histories=collections.defaultdict(list)
  for key,b in records.items():
   session=b['sessionID'];bill=b['billNumber'];items=sorted(votes.get(session+'/'+bill,[]),key=lambda v:v['actionDate']);folder=out/'archive-votes'/session;folder.mkdir(exist_ok=True)
   summary=dict(expected=len(items),verified=sum(v['detailState']=='verified' for v in items),missing=sum(v['detailState']!='verified' for v in items))
   (folder/(bill+'.json')).write_text(json.dumps(dict(scope='Official action-history vote references; coverage does not establish every vote that occurred.',coverage=summary,records=items),ensure_ascii=False),encoding='utf-8')
   for v in items:
    for person in v['individuals']:
     if person['legislatorId']:histories[person['legislatorId']].append(dict(bill=bill,session=session,title=b['shortTitle'],actionDate=v['actionDate'],body=v['body'],motion=v['motion'],vote=person['vote'],sourceUrl=v['source']['url']))
   target=out/'measures'/session/(bill+'.json');detail=json.loads(target.read_text(encoding='utf-8'))
   detail['versionRecords']=b['billVersionList'];detail['committeeAgendas']=b['agendaList'];detail['committeeRecommendations']=b['recommendingCommitteeList'];detail['officialDescription']=b.get('highlightedProvisions','');detail['archiveCoverage']=summary
   target.write_text(json.dumps(detail,ensure_ascii=False),encoding='utf-8')
  folder=out/'voting-history';folder.mkdir(exist_ok=True)
  for ident in sorted({p['id'] for p in data['legislators']+data.get('contactPeople',[])}):
   rows=sorted(histories[ident],key=lambda v:v['actionDate'],reverse=True)
   (folder/(ident+'.json')).write_text(json.dumps(dict(scope='Retrieved 2026 session action-history vote references, not a complete account of every vote.',records=rows),ensure_ascii=False),encoding='utf-8')
  (out/'verification-summary.json').write_text(json.dumps({k:v for k,v in report.items() if k!='measures'},ensure_ascii=False),encoding='utf-8')
  (out/'verification-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 return report
if __name__=='__main__':
 import sys
 report=build('--build' in sys.argv)
 if '--report' in sys.argv:(ROOT/'data/verification-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
 print({k:v for k,v in report.items() if k in ('sessions','voteReferences','retrievedVoteSources','verifiedVoteDetails','individualEntries')});print('Missing vote details',len(report['missingVoteDetails']))
