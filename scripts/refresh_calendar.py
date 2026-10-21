"""Transactional calendar snapshots from the public endpoint used by le.utah.gov/calendar.html.
No browser scraping, credentials, inferred cancellations, or publication timestamps.
"""
import calendar, datetime as dt, hashlib, json, os, pathlib, time, urllib.request
from zoneinfo import ZoneInfo
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import re
ROOT = pathlib.Path(__file__).resolve().parents[1]
TARGET = ROOT / 'data/calendar.json'
MONTHS = [(2026,m) for m in (10,11,12)] + [(2027,m) for m in range(1,6)]
BASE = 'https://le.utah.gov'

def url(value):
    from urllib.parse import urljoin, urlparse
    if not value: return ''
    result = urljoin(BASE, value)
    if urlparse(result).scheme != 'https':
        if result.startswith('http://le.utah.gov/'): result=result.replace('http:', 'https:', 1)
        else: raise ValueError('Unexpected non-HTTPS source link')
    return result

def normalize(raw, year, month, source):
    assert raw['year']==year and raw['month']==month, 'Wrong month response'
    days=raw['days']; assert len(days)==calendar.monthrange(year,month)[1], 'Incomplete month'
    out=[]
    for number,day in enumerate(days,1):
        assert (day['year'],day['month'],day['day'])==(year,month,number), 'Missing or duplicate day'
        date=dt.date(year,month,number).isoformat()
        assert day['dayofweek']==(dt.date(year,month,number).weekday()+1)%7, 'Wrong weekday'
        assert isinstance(day['events'],list), 'Invalid event collection'
        for e in day['events']:
            assert e['description'].strip() and e['type'] in ('meeting','senatefloor','housefloor','event','concom','note'), 'Unknown event schema'
            stamp=dt.datetime.fromisoformat(e['itemtime'])
            assert stamp.tzinfo is not None, 'Timezone missing'
            stamp=stamp.astimezone(ZoneInfo('America/Denver')).isoformat()
            assert stamp.startswith(date), 'Wrong Mountain event date'
            name=e['description'].strip()
            category='deadline' if e['itemType']=='D' else 'floor' if 'floor' in e['type'] else 'caucus' if 'caucus' in name.lower() else 'meeting' if e['type'] in ('meeting','concom') else 'other'
            if name.startswith(('First day of the annual General Session','Last day of the annual General Session')): category='session'
            ident='meeting-'+str(e['mtgID']) if e['mtgID']>0 else hashlib.sha256((date+e['type']+name).encode()).hexdigest()[:20]
            official=url(e.get('itemUrl')) or source
            if 'committee.jsp' in official and e['mtgID']>0: official+='&mtgid='+str(e['mtgID'])
            out.append(dict(id=ident,date=date,start=stamp if e['time'] else '',time=e['time'],name=name,category=category,location=e.get('location',''),status={'R':'Revised','C':'Canceled'}.get(e['status'],''),sourceUrl=source,officialUrl=official,agenda=url(e.get('agenda')),documentType=e.get('docType',''),media=url(e.get('mediaUrl')),participation=url(e.get('elecMtgLink')),map=url(e.get('mapurl')),end=e.get('endTime','')))
    return out

def guard(previous, candidate):
    old={e['id']:e for e in previous.get('events',[])}
    new={e['id']:e for e in candidate['events']}
    assert len(new)==len(candidate['events']), 'Duplicate event IDs'
    assert not old.keys()-new.keys(), 'Events disappeared: manual source review required; prior snapshot retained'
    for key,a in old.items():
        b=new[key]
        # A cancellation can legitimately remove logistics. Otherwise disappearing details require review.
        assert not {x['url'] for x in a.get('bills',[])}-{x['url'] for x in b.get('bills',[])}, 'Lost numbered bill links: manual review required'
        if b['status']!='Canceled':
            for field in ('start','location','agenda','participation'):
                assert not a[field] or b[field], f'Lost {field}: manual review required'
    assert any(e['date']=='2027-01-19' and e['category']=='session' for e in new.values()), 'Missing session opening'
    assert any(e['date']=='2027-03-05' and e['category']=='session' for e in new.values()), 'Missing session closing'

class AgendaLinks(HTMLParser):
    """Only explicit numbered-bill hyperlinks; never infer bills from prose or drafts."""
    def __init__(self, base):
        super().__init__(); self.base=base; self.bills={}
    def handle_starttag(self, tag, attrs):
        if tag!='a': return
        href=dict(attrs).get('href',''); absolute=urljoin(self.base,href)
        match=re.search(r'/~(20\d{2})/bills/(?:static|htmdoc|hbillint|sbillint|hbillenr|sbillenr)/(H[BJRCR]+|S[BJRCR]+)(\d{4})(?:S\d+)?\.(?:html?|pdf)',absolute,re.I)
        if match and urlparse(absolute).hostname=='le.utah.gov':
            self.bills[absolute]=dict(url=absolute,label=f'{match[1]} {match[2].upper()} {int(match[3])}')

def collect():
    sources=[]; events=[]
    for year,month in MONTHS:
        source=f'https://www.utleg.gov/Calendar/month?month={month}&year={year}'
        req=urllib.request.Request(source,headers={'User-Agent':'UtahBills research prototype calendar snapshot'})
        with urllib.request.urlopen(req,timeout=45) as r:
            assert r.status==200
            body=r.read()
        raw=json.loads(body)
        events+=normalize(raw,year,month,source)
        sources.append(dict(url=source,retrievedAt=dt.datetime.now(dt.timezone.utc).isoformat(),sha256=hashlib.sha256(body).hexdigest(),body=body.decode('utf-8')))
        time.sleep(.25)
    # Agenda enrichment is bounded to the URLs actually supplied by these eight months.
    # One request per unique HTML agenda, no per-bill crawling.
    agendas={}
    for e in events:
        agenda=e['agenda']
        if not agenda or e['documentType']!='AGENDA' or not re.search(r'\.html?$',agenda,re.I):
            e['bills']=[]; continue
        if agenda not in agendas:
            with urllib.request.urlopen(urllib.request.Request(agenda,headers={'User-Agent':'UtahBills research prototype calendar snapshot'}),timeout=45) as r:
                body=r.read(); encoding=r.headers.get_content_charset()
            if not encoding:
                match=re.search(br'charset[=\s]+([a-zA-Z0-9-]+)',body[:3000]); encoding=match[1].decode() if match else 'utf-8'
            content=body.decode(encoding)
            assert '<html' in content.lower() and '404 page not found' not in content.lower(), 'Invalid agenda response'
            parser=AgendaLinks(agenda);parser.feed(content)
            agendas[agenda]=dict(url=agenda,retrievedAt=dt.datetime.now(dt.timezone.utc).isoformat(),encoding=encoding,sha256=hashlib.sha256(body).hexdigest(),body=content,bills=list(parser.bills.values()))
            time.sleep(.25)
        e['bills']=agendas[agenda]['bills']
    candidate=dict(schemaVersion=1,agendas=list(agendas.values()),checkedAt=dt.datetime.now(dt.timezone.utc).isoformat(),coverageStart='2026-10-01',coverageEnd='2027-05-31',sources=sources,events=sorted(events,key=lambda e:(e['date'],e['start'],e['name'])))
    previous=json.loads(TARGET.read_text(encoding='utf-8')) if TARGET.exists() else {}
    guard(previous,candidate)
    # All network and validation steps finish before replacing this single snapshot.
    temp=TARGET.with_suffix('.candidate')
    temp.write_text(json.dumps(candidate,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    os.replace(temp,TARGET)
    print(f"Calendar: {len(events)} official events; {len(sources)} complete months checked")

if __name__=='__main__': collect()


