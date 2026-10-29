import sys,json,hashlib,tempfile,copy
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from catalog_model import derive,ROOT
m=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));key=next(iter(m['records']));record=json.loads((ROOT/m['records'][key]['path']).read_text(encoding='utf-8'))
(ROOT/'test-results').mkdir(exist_ok=True)
with tempfile.TemporaryDirectory(dir=ROOT/'test-results') as directory:
 p=Path(directory)/'historical.json';record['shortTitle']='Isolated previous title fixture';body=json.dumps(record).encode();p.write_bytes(body)
 source=dict(m['records'][key],path=p.relative_to(ROOT).as_posix(),sha256=hashlib.sha256(body).hexdigest())
 candidate=copy.deepcopy(m);candidate.setdefault('measureHistory',{})[key]=[source]
 projected=derive(candidate);found=next(x for x in projected['measures'] if x['sessionID']==record['sessionID'] and x['billNumber']==record['billNumber'])
 assert found['titleHistory'][0]['shortTitle']=='Isolated previous title fixture'
 assert found['titleHistory'][0]['source']==source
 record['sessionID']=record['sessionID'][:4]+'S1';body=json.dumps(record).encode();p.write_bytes(body);source['sha256']=hashlib.sha256(body).hexdigest()
 try:derive(candidate)
 except AssertionError as e:assert 'archived measure identity' in str(e)
 else:raise AssertionError('Mismatched historical session accepted')
print('Historical measure title projection retains verified source and rejects mismatched session identity.')
