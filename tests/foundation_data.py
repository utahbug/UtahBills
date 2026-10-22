import unittest,json,sys,tempfile,copy,pathlib,hashlib
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
import foundation_model as model
import refresh_archive as refresh
from catalog_model import ROOT,read,derive
class Foundation(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.catalog=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8'));cls.archive=json.loads((ROOT/'data/archive.json').read_text(encoding='utf-8'));cls.report=model.build();cls.people=derive(cls.catalog)['legislators']
 def test_complete_metadata_cross_checks(self):
  c=self.report['sessions']['2026'];self.assertTrue(c['metadataComplete']);self.assertEqual(c['expected'],1016);self.assertEqual(c['retrieved'],c['humanListingCount']);self.assertEqual(c['versionRecords'],2180);self.assertEqual(c['actionRecords'],37214);self.assertEqual(self.report['indexMarkerDifferences'],[])
 def test_no_unattempted_references_in_release(self):
  self.assertFalse([k for k,v in self.archive['votes'].items() if v['state']=='not-retrieved'],'Acquisition checkpoint is not ready for publication')
 def test_every_vote_reference_accounted_for(self):
  expected=refresh.expected(self.catalog);self.assertEqual(set(expected),set(self.archive['votes']));self.assertEqual(len(expected),self.report['verifiedVoteDetails']+len(self.report['missingVoteDetails']))
  for key,item in self.archive['votes'].items():
   self.assertEqual(item['marker'],expected[key]['marker'])
   if item.get('source'):read(item['source'])
   for source in item.get('sourceHistory',[]):read(source)
 def test_explicit_missing_data_and_corrupt_source(self):
  item=next(v for v in self.archive['votes'].values() if v.get('source'))
  missing={**item,'state':'unavailable','error':'Synthetic network failure'};missing.pop('source')
  v,error=model.project_vote(missing,self.people);self.assertEqual(v['individuals'],[]);self.assertEqual(v['detailState'],'unavailable');self.assertIn('Synthetic',error['reason'])
  wrong_session={**item,'session':'2027GS'};v,error=model.project_vote(wrong_session,self.people);self.assertIsNotNone(error);self.assertEqual(v['individuals'],[])
  corrupt={**item,'source':{**item['source'],'sha256':'0'*64}}
  v,error=model.project_vote(corrupt,self.people);self.assertIn('checksum',error['reason'].lower());self.assertEqual(v['individuals'],[])
 def test_retrieval_failure_does_not_replace_source(self):
  # An unchanged archive requires no official HTTP requests. Test mutations stay temporary.
  with tempfile.TemporaryDirectory() as d:
   target=pathlib.Path(d)/'archive.json';target.write_text(json.dumps(self.archive),encoding='utf-8')
   stale={k:{**v,'state':'unavailable','source':None} for k,v in self.archive['votes'].items()};(pathlib.Path(d)/'cache.json').write_text(json.dumps(stale),encoding='utf-8')
   before=copy.deepcopy(self.archive);want=refresh.expected(self.catalog);chosen=next(k for k,v in before['votes'].items() if v.get('source'));want[chosen]={**want[chosen],'marker':'synthetic-change'}
   with patch.object(refresh,'REPORT',pathlib.Path(d)/'report.json'),patch.object(refresh,'expected',return_value=want),patch.object(refresh,'TARGET',target),patch.object(refresh,'CACHE',pathlib.Path(d)/'cache.json'),patch.object(refresh,'fetch',side_effect=lambda i:(i['id'],{**i,'state':'unavailable','error':'Synthetic failure','attemptedAt':refresh.now()})),patch.object(refresh,'save',wraps=refresh.save) as saver:
    refresh.run(1)
   after=json.loads(target.read_text(encoding='utf-8'))
   self.assertEqual(after['votes'][chosen]['refreshError'],'Synthetic failure')
   for key,item in before['votes'].items():
    if item.get('source'):self.assertEqual(after['votes'][key]['source'],item['source'])
 def test_reference_and_document_identity(self):
  from urllib.parse import urljoin,urlparse
  for key,source in self.catalog['records'].items():
   b=json.loads(read(source));self.assertEqual(key,b['sessionID'][:4]+'/'+b['billNumber'])
   ids=[v['billNumber'] for v in b['billVersionList']];self.assertEqual(len(ids),len(set(ids)))
   for v in b['billVersionList']:
    self.assertTrue(v['billNumber'].startswith(b['billNumber']))
    for section in v['sectionAffectedList']:self.assertTrue(section.get('secNo'));self.assertTrue(section.get('uid'))
    for doc in v['billDocs']:
     u=urlparse(urljoin('https://le.utah.gov',doc['url']));self.assertIn(u.scheme,['http','https']);self.assertTrue(u.hostname.endswith(('.utah.gov','.utleg.gov')));self.assertTrue(doc['fileName']);self.assertTrue(doc['fileType'])
 def test_phase4a_preserved_conflicts_and_minutes(self):
  from html.parser import HTMLParser
  # Independent cell extraction verifies counts without altering production tallies.
  class Names(HTMLParser):
   def __init__(self):super().__init__();self.groups=[];self.active=False;self.parts=[]
   def flush(self):
    name=' '.join(''.join(self.parts).split());self.parts=[]
    if name:self.groups[-1].append(name)
   def handle_starttag(self,tag,attrs):
    if tag=='td' and dict(attrs).get('valign')=='top':self.active=True;self.groups.append([])
    if tag=='br' and self.active:self.flush()
   def handle_endtag(self,tag):
    if tag=='td' and self.active:self.flush();self.active=False
   def handle_data(self,data):
    if self.active:self.parts.append(data)
  evidence=json.loads((ROOT/'data/phase4a-evidence.json').read_text(encoding='utf-8'))
  self.assertEqual(len(evidence['sources']),4);self.assertEqual(len(evidence['conflicts']),5)
  for source in evidence['sources']:self.assertIn(b'MINUTES OF THE',read(source));self.assertTrue(source['retrievedAt'])
  for finding in evidence['conflicts']:
   item=self.archive['votes'][finding['id']];self.assertEqual(item['action'],finding['action']);self.assertEqual(item['source'],finding['voteSource']);self.assertEqual(item['actionSource'],finding['actionSource']);read(finding['actionSource']);read(finding['minutesSource'])
   parser=Names();parser.feed(read(finding['voteSource']).decode('utf-8-sig'))
   self.assertEqual(parser.groups,list(finding['recordedNames'].values()));self.assertEqual(list(map(len,parser.groups)),finding['rollCallTally'])
   self.assertNotEqual(finding['rollCallTally'],list(map(int,item['action']['voteStr'].split('-'))))
   vote,error=model.project_vote(item,self.people);self.assertIn('Action and roll-call tally disagree',error['reason']);self.assertEqual(vote['individuals'],[])
 def test_phase4a_identity_not_guessed(self):
  from acquire_votes import identity
  self.assertIsNone(identity('Walter, N.','H',74,self.people))
  self.assertIsNone(identity('Walter, N.','H',None,self.people))
  evidence=json.loads((ROOT/'data/phase4a-evidence.json').read_text(encoding='utf-8'))
  self.assertIn(b'Walter, N.',read(evidence['identityFinding']['exampleSource']))
  self.assertEqual(self.report['unresolvedVoterNames'],['Walter, N.'])
if __name__=='__main__':unittest.main()
