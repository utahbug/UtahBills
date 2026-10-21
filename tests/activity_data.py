import unittest,json,sys,copy
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import activity_model as model
from catalog_model import ROOT,read
class Activity(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));cls.rows,cls.raw=model.events(cls.manifest)
 def test_every_official_action_and_unique_identity(self):
  self.assertEqual(self.raw,sum(len(json.loads(read(s))['actionHistoryList']) for s in self.manifest['records'].values()))
  self.assertEqual(len({e['id'] for e in self.rows}),len(self.rows));self.assertEqual(sum(e['kind']=='Recorded legislative action' for e in self.rows),len({json.dumps([k,'action',a],sort_keys=True) for k,s in self.manifest['records'].items() for a in json.loads(read(s))['actionHistoryList']}))
  self.assertEqual([e['date'] or '' for e in self.rows],sorted([e['date'] or '' for e in self.rows],reverse=True))
 def test_source_traceability_and_date_labels(self):
  sources={s['sha256']:s for s in self.manifest['records'].values()}
  for e in self.rows:
   self.assertTrue(e['retrievedAt']);self.assertTrue(e['history'].startswith(('#bill/','#request/')))
   if e['kind']!='Request status change observed':self.assertEqual(e['sourcePath'],sources[e['sourceSha256']]['path'])
   if 'document' in e['kind']:self.assertIn('publication time unverified',e['dateLabel'])
 def test_invalid_and_partial_dates(self):
  for value in ['',None,'2026-02','2026-02-30','not a date']:self.assertIsNone(model.calendar_date(value))
  self.assertEqual(model.calendar_date('2026-03-01 00:01:00'),'2026-03-01');self.assertGreater(model.source_order('2026-03-01 15:00:00'),model.source_order('2026-03-01 09:00:00'));self.assertEqual(model.source_order('2026-03-01'),'2026-03-01')
 def test_synthetic_duplicates_missing_dates_and_status_observations(self):
  source=next(iter(self.manifest['records'].values()));b=json.loads(read(source));b=copy.deepcopy(b);b['billVersionList']=[];a=copy.deepcopy(b['actionHistoryList'][0]);b['actionHistoryList']=[a,a,{**a,'actionDate':'','description':'SYNTHETIC undated test'}]
  r=dict(trackingID='SYNTHETIC',shortTitle='SYNTHETIC',statusHistory=[dict(observedAt='2026-03-01T06:30:00+00:00',officialStatus='First observation',source=source),dict(observedAt='2026-03-01T06:45:00+00:00',officialStatus='Changed',source=source)])
  with patch.object(model,'read',return_value=json.dumps(b).encode()),patch.object(model,'derive',return_value={'requestArchive2027':[r]}):rows,raw=model.events({'records':{'2026/'+b['billNumber']:source}})
  self.assertEqual(raw,3);self.assertEqual(len(rows),3);self.assertEqual(sum(e['date'] is None for e in rows),1);observed=next(e for e in rows if e['kind']=='Request status change observed');self.assertEqual(observed['date'],'2026-02-28');self.assertEqual(observed['text'],'Changed')
if __name__=='__main__':unittest.main()
