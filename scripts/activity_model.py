"""Build compact, paged event projections from checksum-verified saved sources."""
import json,hashlib,re,datetime as dt,collections
from catalog_model import ROOT,read,derive

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

def events(manifest):
 result=[];seen=set();raw_actions=0
 def add(event,identity):
  ident=hashlib.sha256(json.dumps(identity,sort_keys=True).encode()).hexdigest()
  if ident in seen:return
  seen.add(ident);result.append(dict(id=ident,**event))
 for key,source in manifest['records'].items():
  b=json.loads(read(source));base=dict(session=b['sessionID'][:4],bill=b['billNumber'],title=b['shortTitle'],retrievedAt=source['retrievedAt'],sourceUrl=source['url'],sourcePath=source['path'],sourceSha256=source['sha256'],history='#bill/'+key+'/history')
  for a in b['actionHistoryList']:
   raw_actions+=1
   add(dict(**base,date=calendar_date(a.get('actionDate')),sourceOrder=source_order(a.get('actionDate')),kind='Recorded legislative action',text=a['description'],body=a.get('owner',''),dateLabel='Official action date',url='https://le.utah.gov/Session/'+base['session']+'/bills/static/'+base['bill']+'.html'),[key,'action',a])
  for v in b['billVersionList']:
   for d in v['billDocs']:
    if d['fileType'] not in ('Introduced','PubSub','PubAmend','Amended','Enrolled','AmdPages'):continue
    kind={'PubSub':'Substitute document','PubAmend':'Amendment document','AmdPages':'Amendment document','Amended':'Amended version document','Enrolled':'Enrolled version document','Introduced':'Introduced version document'}[d['fileType']]
    from urllib.parse import urljoin
    add(dict(**base,date=calendar_date(d.get('fileDate')),sourceOrder=source_order(d.get('fileDate')),kind=kind,text=v['billNumber']+' · '+(d.get('shortDesc') or d['fileType']),body='',dateLabel='Document record date; publication time unverified',url=urljoin('https://le.utah.gov',d['url'])),[key,'document',v['billNumber'],d['fileType'],d.get('fileDate'),d['fileName'].rsplit('.',1)[0]])
 # The first observation is not evidence of a status change. Later observations are
 # retrieval dates, never asserted to be the official date the status changed.
 from zoneinfo import ZoneInfo
 for r in derive(manifest)['requestArchive2027']:
  for h in r.get('statusHistory',[])[1:]:
   date=dt.datetime.fromisoformat(h['observedAt']).astimezone(ZoneInfo('America/Denver')).date().isoformat()
   source=h['source'];add(dict(session='2027',bill='Public request',title=r['shortTitle'],date=date,sourceOrder=dt.datetime.fromisoformat(h['observedAt']).astimezone(ZoneInfo('America/Denver')).isoformat(),kind='Request status change observed',text=h['officialStatus'],body='',dateLabel='Retrieval observation date; official change date unknown',retrievedAt=h['observedAt'],sourceUrl=source['url'],sourcePath=source['path'],sourceSha256=source['sha256'],url=r.get('officialRequestUrl') or source['url'],history='#request/'+r['trackingID']),['request',r['trackingID'],h['observedAt'],h['officialStatus']])
 return sorted(result,key=lambda e:(e['date'] or '',e['sourceOrder'],e['id']),reverse=True),raw_actions

def build():
 manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));rows,raw=events(manifest);out=ROOT/'dist/data/activity';out.mkdir(exist_ok=True)
 index=dict(schemaVersion=1,rawActions=raw,sessions={})
 for year in ('2026','2027'):
  selected=[e for e in rows if e['session']==year];pages=[]
  for start in range(0,len(selected),100):
   chunk=selected[start:start+100];name=year+'-'+str(start//100)+'.json';(out/name).write_text(json.dumps(chunk,ensure_ascii=False),encoding='utf-8');dates=[e['date'] for e in chunk if e['date']]
   pages.append(dict(file=name,count=len(chunk),first=max(dates) if dates else None,last=min(dates) if dates else None))
  index['sessions'][year]=dict(count=len(selected),undated=sum(not e['date'] for e in selected),types=dict(collections.Counter(e['kind'] for e in selected)),checkedAt=manifest['sources']['index'+year]['retrievedAt'],pages=pages)
 (out/'index.json').write_text(json.dumps(index,ensure_ascii=False),encoding='utf-8');print('Activity:',{y:s['count'] for y,s in index['sessions'].items()},'from',raw,'official actions')
if __name__=='__main__':build()
