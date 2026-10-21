import unittest,json,sys,hashlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'scripts'))
from acquire_votes import parse,identity
from catalog_model import ROOT,derive,read
class Votes(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8-sig'));cls.people=derive(cls.manifest)['legislators'];cls.data=json.loads((ROOT/'data/votes.json').read_text(encoding='utf-8-sig'))
 def test_reproducible_sources_and_associations(self):
  for v in self.data['records']:
   b=json.loads(read(v['actionSource']));a=next(a for a in b['actionHistoryList'] if v['id']==v['bill']+'-'+a['voteHouse']+'-'+a['voteID'])
   actual=parse(read(v['source']),v['bill'],a,self.people)
   self.assertEqual(actual,{k:v[k] for k in actual})
   for p in v['individuals']:
    if p['legislatorId']:self.assertEqual(len([x for x in self.people if x['id']==p['legislatorId']]),1)
 def test_vote_distinctions(self):
  records=self.data['records'];self.assertEqual(len(records),22)
  self.assertTrue(any(v['committee'] and v['individuals'] for v in records))
  self.assertTrue(any(v['classification']=='Concurrence' for v in records))
  self.assertTrue(any(v['classification']=='Final passage' for v in records))
  for v in records:
   if v['voice']:self.assertEqual(v['individuals'],[]);self.assertEqual(v['tally'],{})
   else:self.assertEqual(sum(v['tally'].values()),len(v['individuals']))
  byperson={}
  for v in records:
   if v['bill']=='SB0069':
    for p in v['individuals']:byperson.setdefault(p['legislatorId'],set()).add(p['vote'])
  self.assertTrue(any({'Yes','No'}<=x for k,x in byperson.items() if k))
  self.assertFalse(any(v['bill']=='HB0155' for v in records))
 def test_fail_closed_and_ambiguous_identity(self):
  v=self.data['records'][0];b=json.loads(read(v['actionSource']));a=next(a for a in b['actionHistoryList'] if a['voteID']=='6')
  with self.assertRaises(AssertionError):parse(read(v['source']).replace(b'Yeas - 74',b'Yeas - 73'),'HB0011',a,self.people)
  with self.assertRaises(AssertionError):parse(read(v['source']),'HB9999',a,self.people)
  p=dict(name='Test, Jane',house='H',district=1,id='A');self.assertIsNone(identity('Test, J.','H',None,[p,{**p,'id':'B'}]));self.assertIsNone(identity('Test','H',None,[p]))
if __name__=='__main__':unittest.main()
