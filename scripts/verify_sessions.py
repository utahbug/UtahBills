"""Refresh independent historical listing evidence only when it matches saved metadata."""
import json,os
from refresh_catalog import ROOT,get,read,now
from foundation_model import official_listing

def run():
 target=ROOT/'data/session-verification.json';manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));sources={}
 try:
  sources['index2026']=get('https://le.utah.gov/data/2026GS/billlist.json');sources['listing2026']=get('https://le.utah.gov/bills/billSearch.jsp?sess=2026GS&disp=all&sub=all')
  index=json.loads(read(sources['index2026']));rows,conflicts=official_listing(sources['listing2026']);ids={r['number'] for r in index};saved={k.split('/')[1] for k in manifest['records'] if k.startswith('2026/')}
  assert ids and len(ids)==len(index) and ids==saved==set(rows) and not conflicts,'Historical index/listing coverage changed; review required'
  assert all(manifest['records']['2026/'+r['number']].get('updatetime')==r.get('updatetime') for r in index),'Historical source markers changed; review and retrieve affected records before replacing evidence'
  result=dict(checkedAt=now(),sources=sources);temp=target.with_suffix('.candidate');temp.write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8');os.replace(temp,target);print('2026 metadata cross-check:',len(ids),'records')
 except Exception as error:
  (ROOT/'test-results').mkdir(exist_ok=True);(ROOT/'test-results/session-verification-attempt.json').write_text(json.dumps(dict(attemptedAt=now(),sources=sources,error=str(error)),indent=2),encoding='utf-8');raise
if __name__=='__main__':run()
