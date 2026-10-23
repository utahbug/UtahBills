"""Phase 4O: isolated publication/recovery against preserved official source shapes."""
import sys,pathlib,json,copy,tempfile,unittest
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import refresh_catalog as r, catalog_model as m, activity_model as a
from request_publication import reconcile,published_requests
from request_status import parse_statuses
from catalog_updates import Updates

class PartialPublication(Updates):
 def setUp(self):
  super().setUp()
  # Official saved baseline, kept in a temporary target; production bytes never modified.
  original=json.loads((r.ROOT/'data/catalog.json').read_text(encoding='utf-8'))
  self.base=r.requests(original['requestHistory'][0])[:200]
  self.requests(self.base);r.run()
  self.added=dict(trackingID='ISOLATEDNEW',shortTitle='Isolated new request',sponsor='')
 def partial(self, extra=None):
  rows=self.base+[self.added]+(extra or [])
  self.requests(rows);self.statuses(self.base)
 def events(self):return [e for e in a.events(self.current())[0] if e['session']=='2027']
 def test_partial_recovery_and_idempotence(self):
  before=self.events();self.partial();r.run();current=self.current()
  self.assertEqual(json.loads(r.REPORT.read_text())['status'],'partial')
  self.assertEqual(len(r.requests(current['sources']['requests2027'])),len(self.base)+1)
  self.assertEqual(len(m.derive(current)['requests2027']),len(self.base))
  self.assertEqual(self.events(),before)
  r.run();self.assertEqual(self.events(),before)
  self.statuses(self.base+[self.added]);r.run()
  recovery=self.events();new=[e for e in recovery if e['trackingID']=='ISOLATEDNEW']
  self.assertEqual(len(new),1);self.assertEqual(new[0]['kind'],'New public request observed')
  self.assertEqual(new[0]['retrievedAt'],self.current()['sources']['requests2027']['retrievedAt'])
  entry=next(x for x in m.derive(self.current())['requests2027'] if x['trackingID']=='ISOLATEDNEW')
  self.assertEqual(new[0]['observedAt'],entry['history'][0]['observedAt'])
  self.assertIn('Verified observation date',new[0]['dateLabel'])
  self.assertEqual(json.loads(r.REPORT.read_text())['status'],'success')
  r.run();self.assertEqual(self.events(),recovery)
  self.assertEqual(len(m.derive(self.current())['requests2027']),len(self.base)+1)
 def test_two_missing_allowed_but_broad_loss_rejected(self):
  self.partial([{**self.added,'trackingID':'SECONDNEW'}]);r.run()
  self.assertEqual(len(m.derive(self.current())['requestPublication']['withheld']),2)
  before=self.target.read_bytes();self.partial([{**self.added,'trackingID':x} for x in ['SECONDNEW','THIRDNEW','FOURTHNEW']])
  with self.assertRaisesRegex(AssertionError,'limit'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_previously_verified_missing_and_conflict_block(self):
  before=self.target.read_bytes()
  for rows in [self.base[1:],[{**self.base[0],'shortTitle':'Contradictory title'}]+self.base[1:],[*self.base,{**self.base[0],'officialStatus':'Contradiction'}]]:
   self.statuses(rows)
   with self.assertRaises(AssertionError):r.run()
   self.assertEqual(before,self.target.read_bytes())
 def test_withheld_disappearance_is_not_silently_accepted(self):
  self.partial();r.run();before=self.target.read_bytes();self.requests(self.base)
  with self.assertRaisesRegex(AssertionError,'Public requests disappeared'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_independent_introduction_and_withheld_conversion(self):
  self.partial();b=self.bill(tracking=self.base[0]['trackingID']);b['shortTitle']=self.base[0]['shortTitle'];self.source(b,'https://le.utah.gov/data/2027GS/HB0001.json');self.statuses([{**self.base[0],'officialNumber':'HB0001'}]+self.base[1:]);r.run()
  result=m.derive(self.current());self.assertEqual(result['coverage']['2027']['imported'],1)
  self.assertEqual(next(x for x in result['requestArchive2027'] if x['trackingID']==self.base[0]['trackingID'])['introducedBill'],'HB0001')
  before=self.target.read_bytes();self.bill(tracking='ISOLATEDNEW',number='HB0002')
  # Preserve first bill in the index so the targeted missing-status relationship is reached.
  self.source([dict(number=n,trackingID=t,updatetime='2027-01-01 12:00:00') for n,t in [('HB0001',self.base[0]['trackingID']),('HB0002','ISOLATEDNEW')]],'https://le.utah.gov/data/2027GS/billlist.json')
  with self.assertRaisesRegex(AssertionError,'Introduced relationship'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_partial_requires_matching_introduced_listing(self):
  self.partial();self.bill(tracking=self.base[0]['trackingID']);before=self.target.read_bytes()
  with self.assertRaisesRegex(AssertionError,'introduced listing identity'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_unexplained_listing_identity_or_number_blocks(self):
  self.partial();before=self.target.read_bytes()
  self.statuses([*self.base,dict(trackingID='EXTRALISTING',shortTitle='Unexpected extra')])
  with self.assertRaisesRegex(AssertionError,'extra status identities'):r.run()
  self.assertEqual(before,self.target.read_bytes())
  self.statuses([{**self.base[0],'officialNumber':'HB0999'}]+self.base[1:])
  with self.assertRaisesRegex(AssertionError,'Unreconciled numbered listing'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_matching_changes_publish_without_withheld_activity(self):
  self.partial();changed=[{**self.base[0],'shortTitle':'Isolated verified title change'},*self.base[1:]]
  self.requests(changed+[self.added]);self.statuses(changed);r.run()
  self.assertEqual(m.derive(self.current())['requestPublication']['verifiedTotal'],200)
  self.assertFalse(any(e['trackingID']=='ISOLATEDNEW' for e in self.events()))
  self.assertTrue(any(e['kind']=='Request title change observed' for e in self.events()))
 def test_subset_tampering_and_source_checksum_fail(self):
  self.partial();r.run();manifest=self.current();s=manifest['sources']['requests2027']
  s['requestVerification']['acceptedIDs'].pop()
  with self.assertRaisesRegex(AssertionError,'evidence mismatch'):m.derive(manifest)
  manifest=self.current();manifest['requestHistory'][-1]['requestVerification']['previouslyVerifiedIDs'].pop()
  with self.assertRaisesRegex(AssertionError,'baseline'):m.derive(manifest)
  manifest=self.current();manifest['sources']['requests2027']['requestVerification']['statusSource']['sha256']='0'*64
  with self.assertRaisesRegex(AssertionError,'Checksum'):m.derive(manifest)
 def test_real_phase4n_evidence(self):
  report=json.loads((r.ROOT/'docs/evidence/phase4n/manifest.json').read_text())
  raw=json.loads((r.ROOT/report['sources']['requests']['path']).read_bytes());body=(r.ROOT/report['sources']['statuses']['path']).read_bytes()
  result=reconcile(body,raw,{x['trackingID'] for x in self.base})
  self.assertEqual((result['officialTotal'],result['verifiedTotal']),(271,270))
  self.assertEqual([x['trackingID'] for x in result['withheld']],['DYVEPWTRCQ'])

def load_tests(loader, tests, pattern):
 return unittest.TestSuite(PartialPublication(name) for name in PartialPublication.__dict__ if name.startswith('test_'))

if __name__=='__main__':unittest.main()
