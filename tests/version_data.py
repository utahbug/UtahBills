import unittest,json,sys,copy
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
import version_model as v
import activity_model as a
from catalog_model import ROOT,read
class Versions(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));cls.source=cls.manifest['records']['2026/HB0117'];cls.bill=json.loads(read(cls.source));cls.texts=json.loads((ROOT/'data/version-text.json').read_text(encoding='utf-8'))['sources'];cls.available={s['url']:s for s in cls.texts}
 def test_real_versions_and_amendments(self):
  p=v.project(self.bill,self.source,self.available);groups=p['groups'];self.assertEqual(sum(bool(g['text']) for g in groups),4)
  amended=next(g for g in groups if g['fileType']=='Amended');self.assertEqual(len(amended['documents']),2);self.assertEqual(amended['version'],'HB0117')
  amendment=next(g for g in groups if g['fileType']=='PubAmend');self.assertIsNone(amendment['text']);self.assertEqual(amendment['version'],'HB0117')
  self.assertTrue(all(s['number'] and s['uid'] for g in groups if g['text'] for s in g['text']['sections']))
  texts={g['fileType']:[s['text'] for s in g['text']['sections']] for g in groups if g['text']};self.assertNotEqual(texts['Introduced'],texts['PubSub']);self.assertNotEqual(texts['Introduced'],texts['Amended']);self.assertEqual(texts['PubSub'],texts['Enrolled'])
 def test_representation_dates_not_new_versions(self):
  groups=v.document_groups(self.bill);amended=next(g for g in groups if g['fileType']=='Amended');self.assertNotEqual(amended['documents'][0]['date'],amended['documents'][1]['date']);self.assertEqual(len({g['version'] for g in groups}),2)
 def test_successive_amended_documents_keep_distinct_identity(self):
  b=copy.deepcopy(self.bill);version=b['billVersionList'][0];original=next(d for d in version['billDocs'] if d['fileType']=='Amended' and d['url'].endswith('.xml'));next_doc={**original,'url':original['url'].replace('2026-02-02','2026-02-03'),'fileName':original['fileName'].replace('2026-02-02','2026-02-03')};version['billDocs'].append(next_doc)
  groups=[g for g in v.document_groups(b) if g['fileType']=='Amended'];self.assertEqual(len(groups),2);self.assertEqual(len({g['id'] for g in groups}),2);self.assertEqual({g['version'] for g in groups},{'HB0117'})
 def test_missing_text_and_unknown_dates(self):
  b=copy.deepcopy(self.bill)
  for x in b['billVersionList']:
   for d in x['billDocs']:d['fileDate']=''
  p=v.project(b,self.source,{});self.assertTrue(all(g['text'] is None for g in p['groups']));self.assertTrue(all(d['date']=='' for g in p['groups'] for d in g['documents']))
 def test_identity_hash_and_url_mismatches(self):
  group=next(g for g in v.document_groups(self.bill) if g['fileType']=='PubSub');source=self.available[next(d['url'] for d in group['documents'] if d['url'].endswith('.xml'))]
  for changed in [{**source,'sha256':'0'*64},{**source,'url':'https://le.utah.gov/wrong.xml'}]:
   with self.assertRaises((AssertionError,ValueError)):v.extract(changed,self.bill,group)
  body=read(source)
  for altered in [body.replace(b'sess="2026GS"',b'sess="2027GS"'),body.replace(b'billnum="HB0117"',b'billnum="HB0118"'),body.replace(b'subVer="1"',b'subVer="2"')]:
   with patch.object(v,'read',return_value=altered),self.assertRaises(AssertionError):v.extract(source,self.bill,group)
 def test_formatting_does_not_change_proposed_text(self):
  group=next(g for g in v.document_groups(self.bill) if g['fileType']=='Introduced');source=self.available[group['documents'][0]['url']];original=v.extract(source,self.bill,group)
  body=read(source).replace(b'<ln ',b'\n <ln ')
  with patch.object(v,'read',return_value=body):again=v.extract(source,self.bill,group)
  self.assertEqual([s['text'] for s in original['sections']],[s['text'] for s in again['sections']])
 def test_2027_successive_document_observations(self):
  def src(n):return dict(path=str(n),sha256=str(n),url='https://le.utah.gov/data/2027GS/HB0001.json',retrievedAt=f'2027-01-{20+n:02}T12:00:00+00:00')
  def doc(kind,name,date=''):return dict(fileType=kind,fileName=name,url='/Session/2027/bills/introduced/'+name,fileDate=date,shortDesc=kind)
  def bill(docs):return dict(sessionID='2027GS',billNumber='HB0001',trackingID='EXACT',shortTitle='Fixture',actionHistoryList=[],billVersionList=[dict(billNumber=vid,billDocs=items) for vid,items in docs])
  intro=doc('Introduced','HB0001.xml','2027-01-01');sub=doc('PubSub','HB0001S01.xml','2027-01-19');amend=doc('PubAmend','HB0001S01.Hamd.1.pdf');base=bill([('HB0001',[intro])]);later=bill([('HB0001',[intro]),('HB0001S01',[sub,amend])]);pdf={**sub,'fileName':'HB0001S01.pdf','url':sub['url'].replace('.xml','.pdf'),'fileDate':'2027-01-19 00:00:01'};third=copy.deepcopy(later);third['billVersionList'][1]['billDocs'].append(pdf)
  bodies={'0':base,'1':later,'2':third,'3':third};m=dict(records={'2027/HB0001':src(3)},measureHistory={'2027/HB0001':[src(0),src(1),src(2),src(3)]})
  with patch.object(a,'read',side_effect=lambda s:json.dumps(bodies[s['path']]).encode()),patch.object(a,'derive',return_value={'requestArchive2027':[]}):
   rows,_=a.events(m);observed=[e for e in rows if e['kind']=='New document record observed'];self.assertEqual(len(observed),2);self.assertTrue(all(e['date']=='2027-01-21' and e['sourcePath']=='1' for e in observed));self.assertTrue(all(e['history']=='#bill/2027/HB0001/history' for e in observed));self.assertTrue(all(e['previousSource']['path']=='0' for e in observed));self.assertEqual(len([e for e in rows if e['kind']=='Substitute document']),1)
   self.assertTrue(any(e['documentDates']==[''] for e in observed));self.assertTrue(all('Retrieval observation' in e['dateLabel'] for e in observed));before={e['id'] for e in observed}
   m['measureHistory']['2027/HB0001'].append(src(3));again,_=a.events(m);self.assertEqual(before,{e['id'] for e in again if e['kind']=='New document record observed'})
   m['measureHistory']['2027/HB0001'][1]={**src(1),'retrievedAt':'2027-01-21T12:00:00'};undated,_=a.events(m);self.assertTrue(all(e['date'] is None for e in undated if e['kind']=='New document record observed'))
   bodies['1']={**later,'trackingID':'WRONG'}
   with self.assertRaisesRegex(AssertionError,'identity'):a.events(m)
 def test_initial_snapshot_not_new_document(self):
  b=copy.deepcopy(self.bill);b.update(sessionID='2027GS');source={**self.source,'sha256':'fixture'}
  m=dict(records={'2027/HB0117':source})
  with patch.object(a,'read',return_value=json.dumps(b).encode()),patch.object(a,'derive',return_value={'requestArchive2027':[]}):rows,_=a.events(m)
  self.assertFalse(any(e['kind']=='New document record observed' for e in rows))
if __name__=='__main__':unittest.main()
