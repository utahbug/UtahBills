import unittest,json,sys,copy
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import activity_model as model
from catalog_model import ROOT,read
def source_inventory(manifest):
 return {s['sha256']:s for s in [*manifest['records'].values(),*manifest.get('requestHistory',[]),*manifest.get('requestStatusHistory',[]),*(source for history in manifest.get('measureHistory',{}).values() for source in history)]}

class Activity(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));cls.rows,cls.raw=model.events(cls.manifest)
 def test_every_official_action_and_unique_identity(self):
  self.assertEqual(self.raw,sum(len(json.loads(read(s))['actionHistoryList']) for s in self.manifest['records'].values()))
  self.assertEqual(len({e['id'] for e in self.rows}),len(self.rows));self.assertEqual(sum(e['kind']=='Recorded legislative action' for e in self.rows),len({json.dumps([k,'action',a],sort_keys=True) for k,s in self.manifest['records'].items() for a in json.loads(read(s))['actionHistoryList']}))
  self.assertEqual([e['date'] or '' for e in self.rows],sorted([e['date'] or '' for e in self.rows],reverse=True))
 def test_source_traceability_and_date_labels(self):
  sources=source_inventory(self.manifest)
  for e in self.rows:
   self.assertTrue(e['retrievedAt']);self.assertTrue(e['history'].startswith(('#bill/','#request/')))
   self.assertEqual(e['sourcePath'],sources[e['sourceSha256']]['path'])
   if 'document' in e['kind']:self.assertIn('publication time unverified',e['dateLabel'])
 def test_invalid_and_partial_dates(self):
  for value in ['',None,'2026-02','2026-02-30','not a date']:self.assertIsNone(model.calendar_date(value))
  self.assertEqual(model.calendar_date('2026-03-01 00:01:00'),'2026-03-01');self.assertGreater(model.source_order('2026-03-01 15:00:00'),model.source_order('2026-03-01 09:00:00'));self.assertEqual(model.source_order('2026-03-01'),'2026-03-01')
 def test_synthetic_duplicates_missing_dates_and_status_observations(self):
  source=next(iter(self.manifest['records'].values()));b=json.loads(read(source));b=copy.deepcopy(b);b['billVersionList']=[];a=copy.deepcopy(b['actionHistoryList'][0]);b['actionHistoryList']=[a,a,{**a,'actionDate':'','description':'SYNTHETIC undated test'}]
  r=dict(trackingID='SYNTHETIC',shortTitle='SYNTHETIC',statusHistory=[dict(observedAt='2026-03-01T06:30:00+00:00',officialStatus='First observation',source=source),dict(observedAt='2026-03-01T06:45:00+00:00',officialStatus='Changed',source=source)])
  with patch.object(model,'read',return_value=json.dumps(b).encode()),patch.object(model,'derive',return_value={'requestArchive2027':[r]}):rows,raw=model.events({'records':{'2026/'+b['billNumber']:source}})
  self.assertEqual(raw,3);self.assertEqual(len(rows),3);self.assertEqual(sum(e['date'] is None for e in rows),1);observed=next(e for e in rows if e['kind']=='Request status change observed');self.assertEqual(observed['date'],'2026-02-28');self.assertEqual(observed['text'],'First observation → Changed')
 def test_request_and_introduction_history(self):
  def source(name,date):return dict(path=name,url='https://le.utah.gov/'+name,sha256=name,retrievedAt=date)
  first=source('baseline','2026-10-20T12:00:00+00:00');new=source('new','2026-10-21T05:30:00+00:00');changed=source('changed','2026-10-22T12:00:00+00:00');measure=source('measure','2026-10-23T12:00:00+00:00')
  h=lambda title,sponsor,src:dict(shortTitle=title,sponsor=sponsor,observedAt=src['retrievedAt'],source=src)
  history=[h('Original','A',new),h('Revised','B',changed)]
  request=dict(trackingID='NEW',shortTitle='Revised',history=history,statusHistory=[dict(officialStatus=status,observedAt=src['retrievedAt'],source=src) for status,src in [('Pending',new),('Pending',new),('Drafting',changed)]])
  base=dict(trackingID='BASE',shortTitle='Baseline',history=[h('Baseline','A',first)],statusHistory=[])
  bill=dict(sessionID='2027GS',billNumber='HJR0001',trackingID='NEW',shortTitle='Resolution',actionHistoryList=[],billVersionList=[])
  manifest=dict(records={'2027/HJR0001':measure},sources={'requests2027':changed},requestHistory=[first,new,changed],measureHistory={'2027/HJR0001':[measure]})
  bodies={'baseline':[{'trackingID':'BASE'}],'measure':bill}
  with patch.object(model,'read',side_effect=lambda s:json.dumps(bodies[s['path']]).encode()),patch.object(model,'derive',return_value={'requestArchive2027':[base,request]}):
   rows,_=model.events(manifest)
   self.assertEqual(len(rows),5);self.assertEqual(len({e['id'] for e in rows}),5)
   self.assertFalse(any('BASE' in e['bill'] for e in rows))
   fresh=next(e for e in rows if e['kind']=='New public request observed');self.assertEqual(fresh['date'],'2026-10-20');self.assertEqual(fresh['title'],'Original')
   self.assertIn('Original → Revised',[e['text'].removeprefix('Title: ') for e in rows]);self.assertIn('Sponsor ID: A → B',[e['text'] for e in rows])
   intro=next(e for e in rows if e['category']=='introduced');self.assertEqual(intro['relatedHistory'],'#request/NEW');self.assertEqual(intro['history'],'#bill/2027/HJR0001')
   before=[e['id'] for e in rows];later=source('later','2026-10-24T12:00:00+00:00');bodies['later']={**bill,'shortTitle':'Revised resolution'};manifest['records']['2027/HJR0001']=later;manifest['measureHistory']['2027/HJR0001'].append(later)
   again,_=model.events(manifest);self.assertEqual(before,[e['id'] for e in again]);first=next(e for e in again if e['category']=='introduced');self.assertEqual(first['title'],'Resolution');self.assertEqual(first['sourcePath'],source_inventory(manifest)[first['sourceSha256']]['path'])
   request['history'][0]['observedAt']=None
   missing,_=model.events(manifest);self.assertIsNone(next(e for e in missing if e['kind']=='New public request observed')['date'])
   self.assertEqual(model.observation('2026-10-20T12:00:00'),(None,''))
   # Exact identifiers only: a different request cannot acquire the relation.
   request['trackingID']='OTHER';different,_=model.events(manifest);self.assertNotIn('relatedHistory',next(e for e in different if e['category']=='introduced'))

if __name__=='__main__':unittest.main()
