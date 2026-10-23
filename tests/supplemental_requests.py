"""Independent observations: isolated failure/recovery and preserved official evidence."""
import sys,json,pathlib,unittest,copy
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import supplemental_observations as o,refresh_catalog as r,catalog_model as m,activity_model as a
from catalog_updates import Updates
class Supplemental(Updates):
 def setUp(self):
  super().setUp()
  self.base=r.requests(json.loads((r.ROOT/'data/catalog.json').read_text(encoding='utf-8'))['requestHistory'][0])[:200]
  self.requests(self.base);r.run()
  baseline=self.current();baseline['requestHistory']=[baseline['sources']['requests2027']];self.target.write_text(json.dumps(baseline),encoding='utf-8')
  for name,value in [('TARGET',self.root/'observations.json'),('REPORT',self.root/'observation-report.json'),('ATTEMPT',r.REPORT.with_name('catalog-sources.json')),('BASELINES',self.root/'baselines')]:
   p=patch.object(o,name,value);p.start();self.patches.append(p)
  self.new=[dict(trackingID='ISOLATED'+str(i),shortTitle='Isolated request '+str(i),sponsor='') for i in range(3)]
 def sources(self):return {k:self.feeds[url] for k,url in o.URLS.items()}
 def pending(self):self.requests(self.base+self.new);self.statuses(self.base)
 def projection(self):return m.derive(self.current(),o.load())
 def events(self):return [e for e in a.events(self.current(),o.load())[0] if e['session']=='2027']
 def test_failed_catalog_independent_observations_and_recovery(self):
  self.pending();before=self.target.read_bytes()
  with self.assertRaisesRegex(AssertionError,'bounded'):r.run()
  self.assertEqual(self.target.read_bytes(),before);o.run()
  self.assertEqual(json.loads(r.REPORT.read_text())['status'],'failed')
  self.assertEqual(json.loads(o.REPORT.read_text())['status'],'success')
  data=self.projection();self.assertEqual(len(data['requestArchive2027']),200);self.assertEqual(len(data['sourceObservedRequests2027']),3)
  self.assertEqual(data['requestObservationCoverage']['officialTotal'],203)
  events=self.events();self.assertEqual(len(events),3);self.assertTrue(all(e['sourceObserved'] for e in events))
  saved=o.TARGET.read_bytes();o.run();self.assertEqual(o.TARGET.read_bytes(),saved);self.assertEqual(self.events(),events)
  self.statuses(self.base+self.new);r.run();o.run()
  data=self.projection();self.assertEqual(len(data['sourceObservedRequests2027']),0);self.assertEqual(len(data['requestArchive2027']),203)
  self.assertEqual([e['id'] for e in self.events()],[e['id'] for e in events])
  self.assertTrue(all([h['state'] for h in x['verificationHistory']]==['source-observed','status-verified'] for x in data['requestObservations2027']))
 def test_observed_title_revision_and_reversion(self):
  self.pending();o.preserve(self.sources(),self.current())
  changed=[{**self.new[0],'shortTitle':'Revised observed title'},*self.new[1:]]
  self.requests(self.base+changed);self.statuses(self.base);o.preserve(self.sources(),self.current())
  self.pending();o.preserve(self.sources(),self.current())
  events=[e for e in self.events() if e['trackingID']==self.new[0]['trackingID']]
  self.assertEqual(len(events),3);self.assertEqual(sum(e['kind']=='New public request observed' for e in events),1)
  self.assertEqual(len(o.load()['snapshots']),3)
 def test_status_arrival_without_catalog_acceptance_keeps_observation(self):
  self.pending();o.preserve(self.sources(),self.current());events=self.events()
  self.statuses(self.base+self.new);o.preserve(self.sources(),self.current())
  data=self.projection();self.assertEqual(len(data['sourceObservedRequests2027']),3)
  self.assertTrue(all(x['pendingCatalogReconciliation'] for x in data['sourceObservedRequests2027']))
  self.assertEqual(self.events(),events)
 def test_agreement_and_one_missing(self):
  facts=o.preserve(self.sources(),self.current());self.assertEqual(facts['missingIDs'],[]);self.assertFalse(o.TARGET.exists())
  self.requests(self.base+self.new[:1]);self.statuses(self.base);o.preserve(self.sources(),self.current())
  self.assertEqual(len(self.projection()['sourceObservedRequests2027']),1)
 def test_unsafe_sources_retain_prior_observation_manifest(self):
  self.pending();o.preserve(self.sources(),self.current());saved=o.TARGET.read_bytes()
  cases=[self.base[1:]+self.new,self.base+[self.new[0],self.new[0]],self.base+[dict(trackingID='bad-id',shortTitle='Invalid',sponsor='')]]
  for rows in cases:
   self.requests(rows);self.statuses(self.base)
   with self.assertRaises(AssertionError):o.preserve(self.sources(),self.current())
   self.assertEqual(o.TARGET.read_bytes(),saved)
  self.pending();self.statuses(self.base[1:])
  with self.assertRaisesRegex(AssertionError,'Previously verified'):o.preserve(self.sources(),self.current())
  self.pending();self.statuses([{**self.base[0],'shortTitle':'Conflicting title'},*self.base[1:]])
  with self.assertRaisesRegex(AssertionError,'title mismatch'):o.preserve(self.sources(),self.current())
  self.pending();self.bill(tracking=self.new[0]['trackingID'])
  with self.assertRaisesRegex(AssertionError,'index'):o.preserve(self.sources(),self.current())
  self.assertEqual(o.TARGET.read_bytes(),saved)
 def test_bounds_checksum_chronology_and_tampering(self):
  self.pending();o.preserve(self.sources(),self.current());saved=o.TARGET.read_bytes()
  self.requests(self.base+[dict(trackingID='LIMIT'+str(i),shortTitle='Limit test',sponsor='') for i in range(11)]);self.statuses(self.base)
  with self.assertRaises(AssertionError):o.preserve(self.sources(),self.current())
  self.pending();sources=self.sources();sources['requests']={**sources['requests'],'sha256':'0'*64}
  with self.assertRaisesRegex(AssertionError,'checksum'):o.preserve(sources,self.current())
  sources=self.sources();sources['requests']={**sources['requests'],'retrievedAt':'2000-01-01T00:00:00+00:00'}
  with self.assertRaisesRegex(AssertionError,'predates'):o.preserve(sources,self.current())
  bad=o.load();bad['snapshots'][0]['facts']['missingIDs']=[]
  with self.assertRaisesRegex(AssertionError,'evidence mismatch'):o.validated_snapshots(bad)
  self.assertEqual(o.TARGET.read_bytes(),saved)
 def test_source_failure_does_not_reuse_attempt(self):
  self.pending()
  with self.assertRaises(AssertionError):r.run()
  self.assertTrue(o.ATTEMPT.exists())
  with patch.object(r,'get',side_effect=OSError('Unavailable')):
   with self.assertRaises(OSError):r.run()
  self.assertFalse(o.ATTEMPT.exists())
  with self.assertRaises(FileNotFoundError):o.run()
  self.assertEqual(json.loads(o.REPORT.read_text())['status'],'failed')
 def test_actual_273_270_evidence(self):
  manifest=json.loads((r.ROOT/'data/request-observations.json').read_text(encoding='utf-8'))
  item=manifest['snapshots'][0];baseline=json.loads(m.read(item['baseline']))
  facts=o.validate(item['sources'],baseline)
  self.assertEqual((facts['officialTotal'],facts['matchedStatuses'],len(facts['missingIDs'])),(273,270,3))
  from request_publication import reconcile
  with self.assertRaisesRegex(AssertionError,'bounded'):reconcile(m.read(item['sources']['statuses']),r.requests(item['sources']['requests']),{x['trackingID'] for x in m.derive(baseline)['requestArchive2027']})
  data=m.derive(baseline,dict(schemaVersion=1,snapshots=[item]))
  self.assertEqual(len(data['requestArchive2027']),270);self.assertEqual(len(data['sourceObservedRequests2027']),3)
  self.assertEqual(data['requestObservationCoverage']['officialTotal'],273)
  events=[e for e in a.events(baseline,dict(schemaVersion=1,snapshots=[item]))[0] if e['session']=='2027']
  data['measures']=[{k:v for k,v in b.items() if k not in ('actionHistoryList','versions')}|{'versionCount':len({v['id'] for v in b['versions']})} for b in data['measures']]
  output=r.ROOT/'test-results/phase4q-independent.json';output.parent.mkdir(exist_ok=True)
  output.write_text(json.dumps(dict(catalog=data,events=events),ensure_ascii=False),encoding='utf-8')

def load_tests(loader,tests,pattern):return unittest.TestSuite(Supplemental(name) for name in Supplemental.__dict__ if name.startswith('test_'))
if __name__=='__main__':unittest.main()
