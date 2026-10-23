import json,re,pathlib,xml.etree.ElementTree as ET
R=pathlib.Path(__file__).resolve().parents[1]
from xml_text import text
summaries={
'HB0011':('Transportation','The proposal limits when government officials may inspect a vehicle’s fuel tank for dyed diesel. It allows inspections based on probable cause, consent, or specified port-of-entry checks. Driving a diesel vehicle alone would not establish probable cause.','The bill addresses inspection authority; the existing fuel-use prohibitions and penalties remain in the section.'),
'HB0154':('Water','The proposal directs the Division of Water Resources, with the Division of Drinking Water, to study water losses using public water system data from 2015 through 2024 and recommend improvements. It requires a report by October 31, 2026.','The proposed study provision would be repealed July 1, 2027. This bill did not pass, so its proposed deadlines did not become requirements through this bill.'),
'HB0155':('Water','The proposal changes water-rate requirements. For residential customers receiving culinary water for outdoor use, it requires at least three increasing usage tiers by July 1, 2027. Higher tiers would provide a clear financial incentive to reduce water use.','It also requires suppliers to consider urban farming that improves food security, reduces pollution, and creates green spaces when setting rates. This bill did not pass.'),
'SB0069':('Education','The second substitute expands the default student device-use restriction from classroom hours to the full school day. It retains emergency, disability-accommodation, and medical exceptions and allows additional exceptions in local policies.','The second substitute adds a written parental opt-out for use outside instructional time, subject to limits. Read the enrolled version for the final enacted text.')}
pins=json.loads((R/'data/summary-evidence.json').read_text(encoding='utf-8'))
import hashlib
for ident,pin in pins.items():
 if hashlib.sha256((R/pin['path']).read_bytes()).hexdigest()!=pin['sha256']: raise RuntimeError('Source changed: review summary and evidence for '+ident+' before rebuilding')
def structured(e):
 return dict(tag=e.tag, attrs={k:v for k,v in e.attrib.items() if k in ['ea','level','number','num','sn','lineno','display']}, text=e.text or '', tail=e.tail or '', children=[structured(c) for c in e])

out=[]
sources=json.loads((R/'data/sources.json').read_text(encoding='utf-8'))
for ident,summary in summaries.items():
 b=json.loads((R/'data/raw'/f'{ident}.json').read_text(encoding='utf-8')); versions=[]
 for v in b['billVersionList']:
  for d in v['billDocs']:
   if d['fileType'] not in ['Introduced','PubSub','Enrolled']: continue
   name=d['fileType']+'-'+d['fileName']; raw=(R/'data/raw'/name).read_text(encoding='utf-8-sig')
   root=ET.fromstring(re.sub(r'<\?xml[^>]+\?>','',raw)); sections=[]
   for sec in root.findall('./bdy/bsec'):
    s=sec.find('section')
    sections.append({'number':sec.get('num') or 'Effective date','type':sec.get('type'),'line':sec.get('lineno'),'uid':sec.get('uid'),'before':re.sub(r'[^\S\n]+',' ',text(s,'before')).strip(),'after':re.sub(r'[^\S\n]+',' ',text(s,'after')).strip()})
   versions.append(dict(id=v['billNumber']+('-enrolled' if d['fileType']=='Enrolled' else ''),label=d['shortDesc'],date=d['fileDate'],url='https://le.utah.gov'+d['url'] if d['url'].startswith('/') else d['url'],sections=sections,source='data/raw/'+name,formatted=[structured(root.find(tag)) for tag in ['tbox','lt','enact','bdy'] if root.find(tag) is not None]))
 versions.sort(key=lambda v:v['date'])
 b['versions']=versions; b['topic'],b['summary'],b['extra']=summary
 b['summaryVersion']='SB0069S02' if ident=='SB0069' else b['billNumberLong']
 b['status']='Signed' if b['lastAction']=='Governor Signed' else 'Did not pass'
 b['committees']=sorted(set(a['owner'] for a in b['actionHistoryList'] if 'Committee' in a['owner'] and 'Rules' not in a['owner']))
 b['sourceUrl']='https://le.utah.gov/data/2026GS/'+ident+'.json'
 b['retrievedAt']=next(s['retrievedAt'] for s in sources if s['path']=='data/raw/'+ident+'.json')
 out.append(b)
payload=json.dumps(out,ensure_ascii=False,indent=2)
import sys
if '--check' in sys.argv:
 assert (R/'data/bills.json').read_text(encoding='utf-8') == payload, 'Generated data is stale; rerun analysis'
else:
 (R/'data/bills.json').write_text(payload,encoding='utf-8')
print('Analyzed',len(out),'bills,',sum(len(b['versions']) for b in out),'versions')
