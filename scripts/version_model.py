"""Source-bound version inventory and bounded text projection. Never fetches sources."""
import json,re,hashlib,xml.etree.ElementTree as ET
from urllib.parse import urljoin,urlsplit
from catalog_model import ROOT,read
from xml_text import text
TEXT_TYPES={'Introduced','PubSub','Amended','Enrolled'}
DOC_TYPES=TEXT_TYPES|{'PubAmend','AmdPages'}
LABELS={'Introduced':'Introduced text','PubSub':'Substitute text','Amended':'Amended text','Enrolled':'Enrolled text','PubAmend':'Amendment document','AmdPages':'Amendment pages'}

def document_groups(b):
 groups={}
 for v in b['billVersionList']:
  assert re.fullmatch(re.escape(b['billNumber'])+r'(S\d+)?',v['billNumber']),'Version/measure identity mismatch'
  for d in v['billDocs']:
   if d['fileType'] not in DOC_TYPES:continue
   url=urljoin('https://le.utah.gov',d['url']);u=urlsplit(url)
   assert u.scheme=='https' and u.hostname in ('le.utah.gov','www.le.utah.gov'),'Unofficial document URL'
   stem=re.sub(r'\.(xml|pdf)$','',u.path,flags=re.I)
   identity=[v['billNumber'],d['fileType'],stem]
   key=json.dumps(identity)
   if key not in groups:groups[key]=dict(id=hashlib.sha256(key.encode()).hexdigest()[:20],version=v['billNumber'],fileType=d['fileType'],label=LABELS[d['fileType']],documents=[],minorVersion=v.get('minorVersion'),identity=identity)
   doc=dict(url=url,fileName=d['fileName'],date=d.get('fileDate') or '',label=d.get('shortDesc') or d['fileType'])
   if doc not in groups[key]['documents']:groups[key]['documents'].append(doc)
 return list(groups.values())

def extract(source,b,group):
 body=read(source);raw=body.decode('utf-8-sig')
 assert '<!DOCTYPE' not in raw.upper() and '<!ENTITY' not in raw.upper(),'Unsupported XML declarations'
 root=ET.fromstring(re.sub(r'<\?xml[^>]+\?>','',raw))
 assert root.tag=='leg' and root.get('sess')==b['sessionID'] and root.get('billnum') in (b['billNumber'],group['version']),'Text session/measure identity mismatch'
 suffix=group['version'][len(b['billNumber']):];number=int(suffix[1:]) if suffix else 0
 if group['fileType'] in ('Introduced','PubSub','Amended'):
  assert int(root.get('subVer','-999'))==number,'Text substitute identity mismatch'
 elif root.get('subNumber'):
  assert int(root.get('subNumber'))==number,'Enrolled parent identity mismatch'
 assert source['url'] in [d['url'] for d in group['documents']],'Text URL is not linked to this document'
 sections=[]
 for sec in root.findall('./bdy/bsec'):
  node=sec.find('section');assert node is not None,'Unsupported section structure'
  value=' '.join(text(node,'after').split())
  sections.append(dict(number=sec.get('num') or 'Uncodified provision',uid=sec.get('uid'),line=sec.get('lineno'),text=value))
 assert sections and any(s['text'] for s in sections),'No comparable statutory sections'
 return dict(sections=sections,source=source)

def project(b,metadata,available):
 groups=document_groups(b)
 for g in groups:
  g['text']=None;g['availability']='Official links only; text not retrieved and validated for comparison.'
  for d in g['documents']:
   source=available.get(d['url'])
   if source and g['fileType'] in TEXT_TYPES:
    g['text']=extract(source,b,g);g['availability']='Verified local text; proposed sections only.';break
 groups.sort(key=lambda g:(int((re.search(r'S(\d+)$',g['version']) or [None,'0'])[1]),{'Introduced':0,'PubSub':0,'PubAmend':1,'AmdPages':2,'Amended':3,'Enrolled':4}[g['fileType']],g['identity'][2]))
 return dict(session=b['sessionID'],bill=b['billNumber'],metadataSource=metadata,groups=groups)

def build():
 manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'))
 available={s['url']:s for s in json.loads((ROOT/'data/sources.json').read_text(encoding='utf-8')) if s['path'].endswith('.xml')}
 for s in json.loads((ROOT/'data/version-text.json').read_text(encoding='utf-8'))['sources']:
  pinned=json.loads(read(s['metadataSource']));assert pinned['sessionID']==s['session'] and pinned['billNumber']==s['bill'],'Pinned metadata identity mismatch'
  matches=[g for g in document_groups(pinned) if g['version']==s['version'] and g['fileType']==s['fileType'] and s['url'] in [d['url'] for d in g['documents']]]
  assert len(matches)==1,'Pinned document relationship mismatch'
  extract(s,pinned,matches[0]);available[s['url']]=s
 report=dict(definition='Introduced measures only. Official metadata links are not retrieval/validation evidence. Bills and resolutions counted separately; public requests excluded. Known failed retrievals cover only bounded attempted text acquisition, not untested links.',sessions={},textSources=len(available))
 used=set()
 for key,source in manifest['records'].items():
  b=json.loads(read(source));p=project(b,source,available);year=b['sessionID'][:4];kind='bills' if re.fullmatch(r'[HS]B\d+',b['billNumber']) else 'resolutions'
  c=report['sessions'].setdefault(year,{}).setdefault(kind,dict(measures=0,multipleVersionIDs=0,linkedText=0,noLinkedText=0,verifiedLocalText=0,linkedButNotValidated=0,knownFailedTextRetrievals=0,amendmentDocuments=0,comparableMeasures=0))
  c['measures']+=1;c['multipleVersionIDs']+=len({v['billNumber'] for v in b['billVersionList']})>1
  has=any(g['fileType'] in TEXT_TYPES for g in p['groups']);n=sum(bool(g['text']) for g in p['groups']);c['linkedText']+=has;c['noLinkedText']+=not has;c['verifiedLocalText']+=n>0;c['linkedButNotValidated']+=has and not n;c['comparableMeasures']+=n>=2;c['amendmentDocuments']+=any(g['fileType'] in ('PubAmend','AmdPages') for g in p['groups'])
  used.update(g['text']['source']['url'] for g in p['groups'] if g['text'])
  target=ROOT/'dist/data/measures'/b['sessionID']/(b['billNumber']+'.json')
  if target.exists():
   detail=json.loads(target.read_text(encoding='utf-8'));detail['versionTransparency']=p;target.write_text(json.dumps(detail,ensure_ascii=False),encoding='utf-8')
 assert used==set(available),'Text source no longer matches current official catalog; review required'
 report['sessions'].setdefault('2027',{})
 (ROOT/'dist/data/version-coverage.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8');print('Version text coverage:',report)
 return report
if __name__=='__main__':build()
