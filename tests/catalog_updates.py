"""Synthetic exceptional updates are temporary; production fixtures remain official."""
import sys,pathlib,json,copy,tempfile,hashlib,unittest
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import refresh_catalog as r,catalog_model as m
class Updates(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.tmp.name);self.manifest=json.loads(r.TARGET.read_text(encoding='utf-8'));self.feeds={};self.n=0
  self.realBill=json.loads(m.read(self.manifest['records']['2026/HB0001']))
  self.manifest['records']={k:v for k,v in self.manifest['records'].items() if k.startswith('2026/')};self.manifest.pop('requestHistory',None);self.manifest.pop('measureHistory',None);self.manifest.pop('requestStatusHistory',None);self.manifest['sources'].pop('requestStatuses2027',None)
  for key in ('index2027','requests2027'):self.manifest['sources'][key]=self.source([],self.manifest['sources'][key]['url'])
  self.requests([])
  self.target=self.root/'catalog.json';self.target.write_text(json.dumps(self.manifest),encoding='utf-8')
  self.patches=[patch.object(r,'TARGET',self.target),patch.object(r,'CACHE',self.root/'cache.json'),patch.object(r,'REPORT',self.root/'report.json'),patch.object(r,'get',side_effect=lambda url:self.feeds[url])]
  for p in self.patches:p.start()
 def tearDown(self):
  for p in reversed(self.patches):p.stop()
  self.tmp.cleanup()
 def source(self,body,url):
  encoded=body if isinstance(body,bytes) else json.dumps(body).encode();sha=hashlib.sha256(encoded).hexdigest();path=self.root/(sha+'.json');path.write_bytes(encoded)
  source=dict(path=str(path),url=url,sha256=sha,retrievedAt=r.now());self.feeds[url]=source;return source
 def statuses(self,rows):
  from html import escape
  cells=''.join('<tr><td><input data-trackingid="'+escape(x.get('trackingID','MISSING'))+'"></td><td>Not Numbered</td><td>'+escape(x.get('shortTitle','Test'))+'</td><td>Test sponsor</td><td></td><td>'+escape(x.get('officialStatus','In Process'))+'</td></tr>' for x in (rows or [dict(trackingID='UNRELATED',shortTitle='Synthetic unrelated row')]))
  body=('<h1>2027GS</h1><table id="resultTbl"><tr><th>Tracking</th><th>Bill#</th><th>ShortTitle</th><th>Sponsor</th><th>FloorSponsor</th><th>Status</th></tr>'+cells+'</table>').encode()
  self.source(body,r.STATUS_URL)
 def requests(self,rows):
  self.source(rows,'https://le.utah.gov/data/2027GS/filelist.json');self.statuses(rows)
 def bill(self,tracking='TESTREQUEST',number='HB0001',marker='2027-01-01 12:00:00'):
  bill=copy.deepcopy(self.realBill);bill.update(sessionID='2027GS',year=2027,billNumber=number,trackingID=tracking,shortTitle='SYNTHETIC TEST ONLY')
  self.source(bill,'https://le.utah.gov/data/2027GS/'+number+'.json');self.source([dict(number=number,trackingID=tracking,updatetime=marker,lastActionTime=marker)],'https://le.utah.gov/data/2027GS/billlist.json');return bill
 def current(self):return json.loads(self.target.read_text(encoding='utf-8'))
 def test_new_changed_reconciled_history_and_recovery(self):
  request=dict(trackingID='TESTREQUEST',shortTitle='SYNTHETIC TEST ONLY',sponsor='GRICIS');self.requests([request]);r.run()
  original=self.current();self.requests([{**request,'shortTitle':'CHANGED TEST TITLE'}]);r.run();d=m.derive(self.current());self.assertEqual(len(d['requestArchive2027'][0]['history']),2)
  # Same title and sponsor with a different ID must remain separate.
  self.requests([{**request,'trackingID':'OTHERTEST'}]);self.bill();r.run();data=m.derive(self.current())
  linked=next(x for x in data['requestArchive2027'] if x['trackingID']=='TESTREQUEST');self.assertEqual(linked['introducedBill'],'HB0001');self.assertEqual(linked['history'][0]['shortTitle'],request['shortTitle']);self.assertEqual(len(data['requests2027']),1)
  self.assertEqual(data['coverage']['2027']['imported'],1)
  for k,v in self.manifest['records'].items():self.assertEqual(self.current()['records'][k],v)
  for key in ('index2026','roster2026','contacts','houseMaps','senateMaps'):self.assertEqual(self.current()['sources'][key],self.manifest['sources'][key])
  before=self.target.read_bytes();self.source([],self.manifest['sources']['index2027']['url'])
  with self.assertRaisesRegex(AssertionError,'lost existing'):r.run()
  self.assertEqual(self.target.read_bytes(),before);self.assertEqual(json.loads(r.REPORT.read_text())['status'],'failed')
  self.bill(marker='2027-01-02 12:00:00');r.run();self.assertEqual(json.loads(r.REPORT.read_text())['status'],'success')
 def test_empty_index_is_uncertain_and_retrieval_date_is_updated(self):
  r.run();d=m.derive(self.current());self.assertFalse(d['coverage']['2027']['complete']);self.assertTrue(d['coverage']['2027']['emptyIndex']);self.assertEqual(d['coverage']['2027']['checkedAt'],self.feeds[self.manifest['sources']['index2027']['url']]['retrievedAt'])
 def test_changed_measure_versions_votes_and_reuse(self):
  b=self.bill();r.run();old=self.current();self.assertEqual(len(old['measureHistory']['2027/HB0001']),1)
  marker='2027-01-02 12:00:00';b=self.bill(marker=marker);b['lastAction']='Updated official action';b['billVersionList'].append({**b['billVersionList'][0],'billNumber':'HB0001S01'})
  self.source(b,'https://le.utah.gov/data/2027GS/HB0001.json');r.run();new=self.current();self.assertEqual(len(new['measureHistory']['2027/HB0001']),2)
  projected=next(b for b in m.derive(new)['measures'] if b['sessionID']=='2027GS');self.assertEqual(projected['lastAction'],'Updated official action');self.assertTrue(any(a['voteID'] for a in projected['actionHistoryList']));self.assertTrue(any(v['id']=='HB0001S01' for v in projected['versions']))
  # Subsequent unchanged run fetches two JSON lists and the status listing only.
  del self.feeds['https://le.utah.gov/data/2027GS/HB0001.json'];r.run()
 def test_rejects_corruption_duplicates_and_major_growth(self):
  before=self.target.read_bytes()
  for rows in ([{}],[dict(trackingID='A',shortTitle='Test',sponsor='')]*2,[dict(trackingID='T'+str(i),shortTitle='Test',sponsor='') for i in range(251)]):
   self.requests(rows)
   with self.assertRaises(AssertionError):r.run()
   self.assertEqual(self.target.read_bytes(),before)
 def test_rejects_inconsistent_tracking_and_disappearing_actions(self):
  b=self.bill();b['trackingID']='WRONG';self.source(b,'https://le.utah.gov/data/2027GS/HB0001.json')
  with self.assertRaisesRegex(AssertionError,'identity mismatch'):r.run()
  b=self.bill();r.run();before=self.target.read_bytes();b=self.bill(marker='2027-01-02 12:00:00');b['actionHistoryList']=[];self.source(b,'https://le.utah.gov/data/2027GS/HB0001.json')
  with self.assertRaisesRegex(AssertionError,'actions disappeared'):r.run()
  self.assertEqual(before,self.target.read_bytes())
 def test_status_only_changes_and_failed_listing_preserves_snapshot(self):
  request=dict(trackingID='TESTREQUEST',shortTitle='SYNTHETIC TEST ONLY',sponsor='GRICIS');self.requests([request]);r.run();old=self.current();original=old['sources']['requests2027']
  self.statuses([{**request,'officialStatus':'Bill Abandoned per Sponsor'}]);r.run();d=m.derive(self.current());entry=d['requests2027'][0]
  self.assertEqual(self.current()['sources']['requests2027'],original);self.assertEqual(entry['officialStatus'],'Bill Abandoned per Sponsor');self.assertEqual(len(entry['statusHistory']),2)
  self.assertEqual(len(entry['history']),1);self.assertEqual(entry['statusCheckedAt'],self.current()['sources']['requestStatuses2027']['retrievedAt'])
  before=self.target.read_bytes()
  for rows in ([],[{**request,'officialStatus':''}],[request,{**request,'officialStatus':'Different'}],[{**request,'shortTitle':'Wrong title'}]):
   self.statuses(rows)
   with self.assertRaises(AssertionError):r.run()
   self.assertEqual(self.target.read_bytes(),before)
  self.source(b'<html>Unavailable</html>',r.STATUS_URL)
  with self.assertRaises(AssertionError):r.run()
  self.assertEqual(self.target.read_bytes(),before)
if __name__=='__main__':unittest.main()
