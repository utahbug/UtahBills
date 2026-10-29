import copy, hashlib, json, pathlib, sys, unittest, tempfile
from unittest.mock import patch
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'scripts'))
from refresh_calendar import normalize, guard, TARGET, AgendaLinks, collect
import refresh_calendar
class CalendarTests(unittest.TestCase):
    def setUp(self):
        self.data=json.loads(TARGET.read_text(encoding='utf-8'))
        self.baseline=copy.deepcopy(self.data)
        h=next((h for h in self.data.get('historicalAgendas',[]) if h['eventID']=='meeting-20656'),None)
        if h:  # Keep the transition fixture reproducible after a successful scheduled refresh.
            source=h['calendarSource'];raw=json.loads(source['body'])
            old=next(e for e in normalize(raw,raw['year'],raw['month'],source['url']) if e['id']==h['eventID'])
            old['bills']=h['agendaSource']['bills']
            self.baseline['events']=[old if e['id']==old['id'] else e for e in self.baseline['events']]
            self.baseline['sources']=[source if x['url']==source['url'] else x for x in self.baseline['sources']]
            self.baseline['agendas'].append(h['agendaSource'])
            self.baseline['historicalAgendas']=[x for x in self.baseline['historicalAgendas'] if x['eventID']!=h['eventID']]

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
    def transition(self):
        candidate=copy.deepcopy(self.baseline)
        event=next(e for e in candidate['events'] if e['id']=='meeting-20656')
        event.update(documentType='MINUTES',agenda='https://le.utah.gov/interim/2026/html/00003920.htm',bills=[])
        candidate['checkedAt']='2026-10-29T20:00:00+00:00'
        candidate['historicalAgendas']=refresh_calendar.agenda_history(self.baseline,candidate)
        return candidate
    def test_agenda_to_minutes_preserves_exact_historical_evidence(self):
        candidate=self.transition();guard(self.baseline,candidate)
        h=next(h for h in candidate['historicalAgendas'] if h['eventID']=='meeting-20656')
        old=next(a for a in self.baseline['agendas'] if a['url'].endswith('00003587.htm'))
        self.assertEqual(h['agendaSource'],old)
        self.assertEqual(h['agendaSource']['bills'][0]['label'],'2026 SB 197')
        self.assertEqual(next(e for e in candidate['events'] if e['id']==h['eventID'])['bills'],[])
        self.assertEqual(refresh_calendar.agenda_history(candidate,candidate),candidate['historicalAgendas'])
        guard(candidate,candidate)
    def test_history_tampering_and_unexplained_loss_fail(self):
        for mutation in ('missing','checksum','bill','identity','logistics'):
            bad=self.transition()
            evidence=next(h for h in bad['historicalAgendas'] if h['eventID']=='meeting-20656')
            if mutation=='missing':bad.pop('historicalAgendas')
            elif mutation=='checksum':evidence['agendaSource']['sha256']='0'*64
            elif mutation=='bill':evidence['agendaSource']['bills']=[]
            elif mutation=='identity':evidence['eventID']='meeting-99999'
            else:next(e for e in bad['events'] if e['id']=='meeting-20656')['location']=''
            with self.assertRaises((AssertionError,StopIteration)):guard(self.baseline,bad)
        bad=copy.deepcopy(self.baseline)
        next(e for e in bad['events'] if e['id']=='meeting-20656')['bills']=[]
        with self.assertRaisesRegex(AssertionError,'Lost numbered'):guard(self.baseline,bad)
        bad=self.transition();bad['historicalAgendas']=[]
        with self.assertRaises(AssertionError):guard(self.transition(),bad)
    def test_future_or_changed_identity_minutes_fail(self):
        for field,value in [('name','Different committee'),('date','2026-10-22'),('officialUrl','https://le.utah.gov/other')]:
            bad=self.transition();next(e for e in bad['events'] if e['id']=='meeting-20656')[field]=value
            with self.assertRaises(AssertionError):guard(self.baseline,bad)
        bad=self.transition();bad['checkedAt']='2026-10-20T20:00:00+00:00'
        with self.assertRaisesRegex(AssertionError,'Future minutes'):guard(self.baseline,bad)
    def test_timezone_and_dates(self):
        morning=next(e for e in self.data['events'] if e['date']=='2026-10-21' and 'Transportation Interim' in e['name'])
        self.assertIn('T08:30:00-06:00',morning['start'])
        november=next(e for e in self.data['events'] if e['date']=='2026-11-18' and 'Transportation Interim' in e['name'])
        self.assertIn('T08:30:00-07:00',november['start'])
if __name__=='__main__':unittest.main()
