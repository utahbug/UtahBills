import copy,json,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from review_party import project
class Evidence(unittest.TestCase):
 def test_exact_historical_sources(self):
  source=json.loads(Path('data/catalog.json').read_text())['sources']['roster2026']
  people=json.loads(Path('dist/data/catalog-ui.json').read_text(encoding='utf-8'))['legislators']
  result=project(source,people)
  self.assertEqual(len(result['records']),100);self.assertEqual(len(result['unavailable']),4)
  self.assertEqual(set(p['party'] for p in result['records'].values()),{'Republican','Democrat','Forward'})
  ident=next(iter(result['records']))
  for field,value in [('session','2027GS'),('district',999),('name','Wrong person'),('house','X')]:
   changed=copy.deepcopy(people);next(p for p in changed if p['id']==ident)[field]=value
   with self.assertRaises(AssertionError):project(source,changed)
  with self.assertRaises(AssertionError):project(dict(source,url='https://le.utah.gov/asp/roster/roster.asp?year=2027'),people)
  corrupted=dict(source,sha256='0'*64)
  with self.assertRaises(AssertionError):project(corrupted,people)
if __name__=='__main__':unittest.main()
