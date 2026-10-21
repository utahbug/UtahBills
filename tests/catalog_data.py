import pathlib,sys,json,copy,unittest,tempfile
from datetime import datetime
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import catalog_model as model,refresh_catalog as refresh
ROOT=model.ROOT
class CatalogTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));cls.data=model.derive(cls.manifest)
 def test_full_index_and_unique_base_measures(self):
  for year,c in self.data['coverage'].items():
   expected={r['number'] for r in json.loads(model.read(self.manifest['sources']['index'+year]))}
   got=[b['billNumber'] for b in self.data['measures'] if b['sessionID']==year+'GS']
   self.assertEqual(set(got),expected);self.assertEqual(len(got),len(set(got)));self.assertTrue(c['complete'])
  self.assertEqual(len(self.data['measures']),1016)
  self.assertEqual(sum(b['kind']=='Bill' for b in self.data['measures']),931)
 def test_action_dates_match_source_without_inventing_timezone(self):
  for b in self.data['measures']:
   self.assertEqual(b['lastActionDate'],datetime.strptime(b['sourceLastActionDate'],'%m/%d/%Y').date().isoformat())
  self.assertEqual(next(b for b in self.data['measures'] if b['billNumber']=='HB0001')['lastActionDate'],'2026-01-31')
 def test_partial_coverage_is_explicit(self):
  partial=copy.deepcopy(self.manifest);partial['records'].pop(next(iter(partial['records'])))
  result=model.derive(partial);self.assertFalse(result['coverage']['2026']['complete']);self.assertEqual(len(result['coverage']['2026']['missing']),1)
 def test_identity_counts_and_maps(self):
  self.assertEqual(self.data['unmatchedSponsors'],[])
  people={p['id']:p for p in self.data['legislators']};self.assertEqual(len(people),104)
  self.assertEqual((people['GRICIS']['house'],people['GRICIS']['district']),('H',50))
  for p in people.values():
   self.assertTrue(p['mapUrl'].endswith(f"49{p['district']:03}.pdf"));self.assertIn('/lower/' if p['house']=='H' else '/upper/',p['mapUrl'])
   if not p['currentContact']:self.assertEqual(p['email'],'');self.assertEqual(p['phone'],'')
  # Independent totals directly from raw official records, not renderer output.
  expected={p:0 for p in people}
  for key,source in self.manifest['records'].items():
   b=json.loads(model.read(source))
   if b['billNumber'].startswith(('HB','SB')):expected[b['primeSponsor']]+=1
  actual={p:sum(b['kind']=='Bill' and b['primeSponsor']==p for b in self.data['measures']) for p in people}
  self.assertEqual(expected,actual)
  b=next(b for b in self.data['measures'] if b['billNumber']=='HB0034');self.assertIn('IVORYK',b['cosponsors'])
 def test_requests_are_not_introduced_and_no_final_2027_roster(self):
  self.assertEqual(self.data['coverage']['2027']['imported'],0);self.assertEqual(len(self.data['requests2027']),253)
  self.assertTrue(all(p['session']=='2026GS' for p in self.data['legislators']))
  self.assertTrue(all('billNumber' not in r for r in self.data['requests2027']))
 def test_failure_preserves_published_manifest(self):
  with tempfile.TemporaryDirectory() as d:
   target=pathlib.Path(d)/'catalog.json';before=(ROOT/'data/catalog.json').read_bytes();target.write_bytes(before)
   with patch.object(refresh,'TARGET',target),patch('urllib.request.urlopen',side_effect=OSError('Failed retrieval')):
    with self.assertRaises(OSError):refresh.refresh()
   self.assertEqual(target.read_bytes(),before)
 def test_disappearing_requests_preserve_manifest(self):
  byurl={s['url']:s for s in self.manifest['sources'].values()}
  original=refresh.read
  with tempfile.TemporaryDirectory() as d:
   target=pathlib.Path(d)/'catalog.json';before=json.dumps(self.manifest);target.write_text(before,encoding='utf-8')
   changed={**self.manifest['sources']['requests2027'],'testEmpty':True}
   byurl[changed['url']]=changed
   with patch.object(refresh,'TARGET',target),patch.object(refresh,'CACHE',pathlib.Path(d)/'cache.json'),patch.object(refresh,'get',side_effect=lambda u:byurl[u]),patch.object(refresh,'read',side_effect=lambda x:b'[]' if x.get('testEmpty') else original(x)):
    with self.assertRaisesRegex(AssertionError,'Public requests disappeared'):refresh.refresh()
   self.assertEqual(target.read_text(encoding='utf-8'),before)
 def test_unchanged_records_reused(self):
  # No per-bill requests permitted during an unchanged-index refresh.
  byurl={s['url']:s for s in self.manifest['sources'].values()}
  with tempfile.TemporaryDirectory() as d:
   target=pathlib.Path(d)/'catalog.json';target.write_text(json.dumps(self.manifest),encoding='utf-8')
   with patch.object(refresh,'TARGET',target),patch.object(refresh,'CACHE',pathlib.Path(d)/'cache.json'),patch.object(refresh,'get',side_effect=lambda u:byurl[u]) as getter:
    refresh.refresh();self.assertEqual(getter.call_count,len(byurl))
if __name__=='__main__':unittest.main()
