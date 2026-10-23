"""Build compact, paged event projections from checksum-verified saved sources."""
import json,hashlib,re,datetime as dt,collections
from catalog_model import ROOT,read,derive
from version_model import document_groups

def calendar_date(value):
 match=re.match(r"^(\d{4}-\d{2}-\d{2})(?:$|[ T])",value or '')
 if not match:return None
 try:return dt.date.fromisoformat(match[1]).isoformat()
 except ValueError:return None

def source_order(value):
 if not calendar_date(value):return ''
 if len(value)==10:return value
 try:return dt.datetime.fromisoformat(value).isoformat()
 except ValueError:return calendar_date(value)

def observation(value):
 # A missing/naive timestamp cannot establish a Mountain calendar day.
 from zoneinfo import ZoneInfo
 try:
  stamp=dt.datetime.fromisoformat(value)
  if stamp.tzinfo is None:return None,''
  stamp=stamp.astimezone(ZoneInfo('America/Denver'))
  return stamp.date().isoformat(),stamp.isoformat()
 except (ValueError,TypeError):return None,''

def events(manifest):
 result=[];seen=set();raw_actions=0
 def add(event,identity):
  ident=hashlib.sha256(json.dumps(identity,sort_keys=True).encode()).hexdigest()
  if ident in seen:return
  seen.add(ident);event.setdefault('category','documents' if 'document' in event['kind'] else 'actions');result.append(dict(id=ident,**event))
 for key,source in manifest['records'].items():
  b=json.loads(read(source));base=dict(session=b['sessionID'][:4],bill=b['billNumber'],trackingID=b.get('trackingID') or '',title=b['shortTitle'],retrievedAt=source['retrievedAt'],sourceUrl=source['url'],sourcePath=source['path'],sourceSha256=source['sha256'],history='#bill/'+key+'/history')
  for a in b['actionHistoryList']:
   raw_actions+=1
   add(dict(**base,date=calendar_date(a.get('actionDate')),sourceOrder=source_order(a.get('actionDate')),kind='Recorded legislative action',text=a['description'],body=a.get('owner',''),dateLabel='Official action date',url='https://le.utah.gov/Session/'+base['session']+'/bills/static/'+base['bill']+'.html'),[key,'action',a])
  for group in document_groups(b):
   d=group['documents'][0];file_type=group['fileType']
   kind={'PubSub':'Substitute document','PubAmend':'Amendment document','AmdPages':'Amendment document','Amended':'Amended version document','Enrolled':'Enrolled version document','Introduced':'Introduced version document'}[file_type]
   # Keep the first existing representation's event ID; PDF/XML pairs share one record.
   add(dict(**base,date=calendar_date(d['date']),sourceOrder=source_order(d['date']),kind=kind,text=group['version']+' · '+d['label'],body='',dateLabel='Document record date; publication time unverified',url=d['url']),[key,'document',group['version'],file_type,d['date'],d['fileName'].rsplit('.',1)[0]])
 # Retained baseline membership, not acquisition date alone, distinguishes new IDs.
 archive=derive(manifest)['requestArchive2027'];requests={r['trackingID']:r for r in archive}
 snapshots=manifest.get('requestHistory',[]) or [manifest.get('sources',{}).get('requests2027')]
 baseline={r['trackingID'] for r in json.loads(read(snapshots[0]))} if snapshots[0] else set()
 def observed(source,**fields):
  date,order=observation(source.get('retrievedAt'))
  return dict(session='2027',date=date,sourceOrder=order,retrievedAt=source.get('retrievedAt') or '',sourceUrl=source['url'],sourcePath=source['path'],sourceSha256=source['sha256'],dateLabel='Retrieval observation date; official change/publication date unknown',body='',**fields)
 for r in archive:
  ident=r['trackingID'];history=r.get('history',[])
  def request_event(h,kind,text,identity,previous=None):
   source={**h['source'],'retrievedAt':h.get('observedAt')}
   event=observed(source,bill='Public request · '+ident,trackingID=ident,introducedBill=r.get('introducedBill'),title=h.get('shortTitle',r['shortTitle']),category='requests',kind=kind,text=text,url=r.get('officialRequestUrl') or source['url'],history='#request/'+ident)
   event['retrievedAt']=h['source'].get('retrievedAt') or ''
   if h.get('observedAt')!=h['source'].get('retrievedAt'):
    event.update(observedAt=h.get('observedAt'),dateLabel='Verified observation date; official change/publication date unknown')
   if previous:event['previousSource']=previous['source']
   add(event,['request',ident,*identity])
  if history and snapshots[0] and ident not in baseline:
   h=history[0];request_event(h,'New public request observed','',['new',h.get('observedAt')])
  for previous,h in zip(history,history[1:]):
   for field,label in [('shortTitle','Title'),('sponsor','Sponsor ID')]:
    if previous.get(field)!=h.get(field):
     text=label+': '+(previous.get(field) or 'Not identified')+' → '+(h.get(field) or 'Not identified')
     request_event(h,'Request '+('title' if field=='shortTitle' else 'sponsor')+' change observed',text,[field,h.get('observedAt'),previous.get(field),h.get(field)],previous)
  statuses=r.get('statusHistory',[])
  for previous,h in zip(statuses,statuses[1:]):
   if previous['officialStatus']==h['officialStatus']:continue
   # Keep the pre-existing status event identity stable.
   request_event(h,'Request status change observed',previous['officialStatus']+' → '+h['officialStatus'],[h.get('observedAt'),h['officialStatus']],previous)
 for key,current in manifest['records'].items():
  if not key.startswith('2027/'):continue
  source=(manifest.get('measureHistory',{}).get(key) or [current])[0]
  b=json.loads(read(source));assert key=='2027/'+b['billNumber'] and b['sessionID']=='2027GS','Measure history identity mismatch'
  latest=json.loads(read(current));assert latest['trackingID']==b['trackingID'],'Measure history tracking identity mismatch'
  ident=b['trackingID'];event=observed(source,bill=b['billNumber'],trackingID=ident,title=b['shortTitle'],category='introduced',kind='Introduced legislation first observed',text='',url='https://le.utah.gov/Session/2027/bills/static/'+b['billNumber']+'.html',history='#bill/'+key)
  if ident in requests:
   event.update(relatedHistory='#request/'+ident,relatedLabel='Original public request · '+ident)
  add(event,[key,'first-observed',source.get('retrievedAt')])
  history=manifest.get('measureHistory',{}).get(key) or [current]
  if history[-1]['sha256']!=current['sha256']:history=[*history,current]
  known=set();previous=None
  for position,snapshot in enumerate(history):
   revision=json.loads(read(snapshot))
   assert revision['billNumber']==b['billNumber'] and revision['sessionID']==b['sessionID'] and revision['trackingID']==ident,'Document history identity mismatch'
   for group in document_groups(revision):
    if position and group['id'] not in known:
     doc=group['documents'][0]
     item=observed(snapshot,bill=b['billNumber'],trackingID=ident,title=revision['shortTitle'],category='documents',kind='New document record observed',text=group['version']+' · '+group['label']+' · Official document date: '+(doc['date'] or 'unavailable')+' (publication time unverified)',url=doc['url'],history='#bill/'+key+'/history')
     item['previousSource']=previous;item['documentDates']=[d['date'] for d in group['documents']];item['documentType']=group['fileType'];item['version']=group['version']
     add(item,[key,'document-observed',group['id']])
    known.add(group['id'])
   previous=snapshot

 return sorted(result,key=lambda e:(e['date'] or '',e['sourceOrder'],e['id']),reverse=True),raw_actions

def build():
 manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));rows,raw=events(manifest);out=ROOT/'dist/data/activity';out.mkdir(exist_ok=True)
 index=dict(schemaVersion=2,rawActions=raw,sessions={})
 baseline=(manifest.get('requestHistory') or [manifest['sources']['requests2027']])[0]
 index['requestPublication']=derive(manifest)['requestPublication']
 index['requestCoverage']=dict(baselineCount=len(json.loads(read(baseline))),baselineObservedAt=baseline['retrievedAt'],checkedAt=manifest['sources']['requests2027']['retrievedAt'])
 for year in ('2026','2027'):
  selected=[e for e in rows if e['session']==year];pages=[]
  for start in range(0,len(selected),100):
   chunk=selected[start:start+100];name=year+'-'+str(start//100)+'.json';(out/name).write_text(json.dumps(chunk,ensure_ascii=False),encoding='utf-8');dates=[e['date'] for e in chunk if e['date']]
   pages.append(dict(file=name,count=len(chunk),first=max(dates) if dates else None,last=min(dates) if dates else None))
  index['sessions'][year]=dict(count=len(selected),undated=sum(not e['date'] for e in selected),types=dict(collections.Counter(e['kind'] for e in selected)),categories=dict(collections.Counter(e['category'] for e in selected)),checkedAt=manifest['sources']['index'+year]['retrievedAt'],pages=pages)
 (out/'index.json').write_text(json.dumps(index,ensure_ascii=False),encoding='utf-8');print('Activity:',{y:s['count'] for y,s in index['sessions'].items()},'from',raw,'official actions')
if __name__=='__main__':build()
