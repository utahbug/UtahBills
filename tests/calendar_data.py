import copy, hashlib, json, pathlib, sys, unittest, tempfile
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
from refresh_calendar import normalize, guard, TARGET, AgendaLinks, collect
import refresh_calendar
class CalendarTests(unittest.TestCase):
    def setUp(self): self.data=json.loads(TARGET.read_text(encoding='utf-8'))
    def test_preserved_sources_and_reproduction(self):
        actual=[]
        for s in self.data['sources']:
            self.assertEqual(hashlib.sha256(s['body'].encode('utf-8')).hexdigest(),s['sha256'])
            raw=json.loads(s['body']);actual+=normalize(raw,raw['year'],raw['month'],s['url'])
        for a in self.data['agendas']:
            self.assertEqual(hashlib.sha256(a['body'].encode(a['encoding'])).hexdigest(),a['sha256'])
            parser=AgendaLinks(a['url']);parser.feed(a['body']);self.assertEqual(list(parser.bills.values()),a['bills'])
        for e in actual:
            e['bills']=next((a['bills'] for a in self.data['agendas'] if a['url']==e['agenda']),[])
        self.assertEqual(sorted(actual,key=lambda e:(e['date'],e['start'],e['name'])),self.data['events'])
        guard(self.data,self.data)
    def test_fail_closed(self):
        for mutation in ['missing','duplicate','room']:
            bad=copy.deepcopy(self.data)
            if mutation=='missing':bad['events'].pop()
            elif mutation=='duplicate':bad['events'].append(bad['events'][0])
            else:next(e for e in bad['events'] if e['location'] and e['status']!='Canceled')['location']=''
            with self.assertRaises(AssertionError):guard(self.data,bad)
        s=self.data['sources'][0];raw=json.loads(s['body']);raw['days'].pop()
        with self.assertRaises(AssertionError):normalize(raw,2026,10,s['url'])
    def test_cancel_and_revision(self):
        changed=copy.deepcopy(self.data);e=next(e for e in changed['events'] if e['category']=='meeting');e['status']='Canceled';e['location']='';e['agenda']='';guard(self.data,changed)
        changed=copy.deepcopy(self.data);changed['events'][0]['status']='Revised';guard(self.data,changed)
    def test_network_failure_preserves_snapshot(self):
        with tempfile.TemporaryDirectory() as directory:
            target=pathlib.Path(directory)/'calendar.json'
            original=TARGET.read_bytes(); target.write_bytes(original)
            with patch.object(refresh_calendar,'TARGET',target), patch('urllib.request.urlopen',side_effect=OSError('simulated failed request')):
                with self.assertRaises(OSError):collect()
            self.assertEqual(target.read_bytes(),original)
            self.assertFalse(target.with_suffix('.candidate').exists())
    def test_timezone_and_dates(self):
        morning=next(e for e in self.data['events'] if e['date']=='2026-10-21' and 'Transportation Interim' in e['name'])
        self.assertIn('T08:30:00-06:00',morning['start'])
        november=next(e for e in self.data['events'] if e['date']=='2026-11-18' and 'Transportation Interim' in e['name'])
        self.assertIn('T08:30:00-07:00',november['start'])
if __name__=='__main__':unittest.main()
