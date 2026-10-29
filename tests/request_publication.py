"""Phase 4O: isolated publication/recovery against preserved official source shapes."""
import sys,pathlib,json,copy,tempfile,unittest,hashlib
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
  observed=self.events();new=[e for e in observed if e['trackingID']=='ISOLATEDNEW']
  self.assertEqual(len(new),1);self.assertTrue(new[0]['sourceObserved'])
  self.assertEqual([e for e in observed if e['trackingID']!='ISOLATEDNEW'],before)
  self.assertEqual(len(m.derive(current)['sourceObservedRequests2027']),1)
  r.run();self.assertEqual(self.events(),observed)
  self.statuses(self.base+[self.added]);r.run()
  recovery=self.events();new=[e for e in recovery if e['trackingID']=='ISOLATEDNEW']
  self.assertEqual(len(new),1);self.assertEqual(new[0]['kind'],'New public request observed')
  self.assertEqual(new[0]['id'],next(e['id'] for e in observed if e['trackingID']=='ISOLATEDNEW'))
  self.assertEqual(len(m.derive(self.current())['sourceObservedRequests2027']),0)
  entry=next(x for x in m.derive(self.current())['requests2027'] if x['trackingID']=='ISOLATEDNEW')
  history=m.derive(self.current())['requestObservations2027'][0]
  self.assertEqual([h['state'] for h in history['verificationHistory']],['source-observed','status-verified'])
  self.assertEqual(new[0]['retrievedAt'],history['history'][0]['source']['retrievedAt'])
  self.assertIn('Retrieval observation date',new[0]['dateLabel'])
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
  before=self.target.read_bytes();self.bill(tracking='ISOLATEDNEW',number='HB0002',listing=False)
  # Preserve first bill in the index so the targeted missing-status relationship is reached.
  self.source([dict(number=n,trackingID=t,updatetime='2027-01-01 12:00:00') for n,t in [('HB0001',self.base[0]['trackingID']),('HB0002','ISOLATEDNEW')]],'https://le.utah.gov/data/2027GS/billlist.json')
  with self.assertRaisesRegex(AssertionError,'Introduced relationship'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_partial_requires_matching_introduced_listing(self):
  self.partial();self.bill(tracking=self.base[0]['trackingID'],listing=False);before=self.target.read_bytes()
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
 def test_matching_changes_publish_with_qualified_observation(self):
  self.partial();changed=[{**self.base[0],'shortTitle':'Isolated verified title change'},*self.base[1:]]
  self.requests(changed+[self.added]);self.statuses(changed);r.run()
  self.assertEqual(m.derive(self.current())['requestPublication']['verifiedTotal'],200)
  self.assertTrue(all(e.get('sourceObserved') for e in self.events() if e['trackingID']=='ISOLATEDNEW'))
  self.assertTrue(any(e['kind']=='Request title change observed' for e in self.events()))
 def test_subset_tampering_and_source_checksum_fail(self):
  self.partial();r.run();manifest=self.current();s=manifest['sources']['requests2027']
  s['requestVerification']['acceptedIDs'].pop()
  with self.assertRaisesRegex(AssertionError,'evidence mismatch'):m.derive(manifest)
  manifest=self.current();manifest['requestHistory'][-1]['requestVerification']['previouslyVerifiedIDs'].pop()
  with self.assertRaisesRegex(AssertionError,'baseline'):m.derive(manifest)
  manifest=self.current();manifest['sources']['requests2027']['requestVerification']['statusSource']['sha256']='0'*64
  with self.assertRaisesRegex(AssertionError,'Checksum'):m.derive(manifest)
 def test_malformed_duplicate_and_changed_source_observation(self):
  self.partial();r.run();before=self.target.read_bytes()
  for bad in [[*self.base,self.added,self.added],[*self.base,{**self.added,'trackingID':'bad-id'}],[*self.base,{**self.added,'shortTitle':''}]]:
   self.requests(bad);self.statuses(self.base)
   with self.assertRaises(AssertionError):r.run()
   self.assertEqual(before,self.target.read_bytes())
  self.requests([*self.base,{**self.added,'shortTitle':'Revised source title'}]);self.statuses(self.base);r.run()
  events=[e for e in self.events() if e['trackingID']=='ISOLATEDNEW']
  self.assertEqual(len(events),2);self.assertTrue(all(e['sourceObserved'] for e in events))
  self.assertEqual(sum(e['kind']=='New public request observed' for e in events),1)
  r.run();self.assertEqual(events,[e for e in self.events() if e['trackingID']=='ISOLATEDNEW'])
 def test_real_phase4n_evidence(self):
  report=json.loads((r.ROOT/'docs/evidence/phase4n/manifest.json').read_text())
  raw=json.loads((r.ROOT/report['sources']['requests']['path']).read_bytes());body=(r.ROOT/report['sources']['statuses']['path']).read_bytes()
  result=reconcile(body,raw,{x['trackingID'] for x in self.base})
  self.assertEqual((result['officialTotal'],result['verifiedTotal']),(271,270))
  self.assertEqual([x['trackingID'] for x in result['withheld']],['DYVEPWTRCQ'])

 def test_real_phase7h_conflicting_titles_remain_blocked(self):
  evidence=json.loads((r.ROOT/'docs/evidence/phase7h/verification.json').read_text())
  body=(r.ROOT/evidence['preservedStatusPath']).read_bytes()
  self.assertEqual(hashlib.sha256(body).hexdigest(),next(s['sha256'] for s in evidence['sources'] if s['name']=='statuses'))
  requests=json.loads((r.ROOT/evidence['preservedRequestPath']).read_bytes())
  baseline=parse_statuses((r.ROOT/evidence['baselineStatusSource']).read_bytes())
  self.assertEqual(baseline['JNAUIKTYPJ']['shortTitle'],next(x['shortTitle'] for x in requests if x['trackingID']=='JNAUIKTYPJ'))
  with self.assertRaisesRegex(AssertionError,'Request/status title mismatch for JNAUIKTYPJ'):
   reconcile(body,requests,set(baseline))

def load_tests(loader, tests, pattern):
 return unittest.TestSuite(PartialPublication(name) for name in PartialPublication.__dict__ if name.startswith('test_'))

if __name__=='__main__':unittest.main()
