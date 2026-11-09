"""Review-only affiliation projection from the immutable historical roster; no network."""
import json, re, sys
from pathlib import Path
from catalog_model import Roster, read

def project(source, people):
    assert source['url']=='https://le.utah.gov/asp/roster/roster.asp?year=2026', 'Wrong session source'
    parser=Roster(); parser.feed(read(source).decode('utf-8-sig'))
    rows=[r for r in parser.rows if len(r)>=4 and r[1]['text'] in ('Representative','Senator')]
    assert len(rows)==104, 'Unexpected historical roster coverage'
    by_id={p['id']:p for p in people}; result={}; unavailable=[]
    for row in rows:
        name=row[0]['text'].strip(); house='H' if row[1]['text']=='Representative' else 'S'
        district=int(row[3]['text']); party=row[2]['text'].strip()
        ids={m[1] for c in row for u in c['links'] if (m:=re.search(r'Listbox[23]=([A-Z]+)(?:&|$)',u))}
        if len(ids)!=1:
            unavailable.append(dict(name=name,house=house,district=district,reason='No unique direct member ID in historical roster')); continue
        ident=next(iter(ids)); p=by_id.get(ident)
        assert p and (p['name'],p['house'],p['district'],p['session'])==(name,house,district,'2026GS'), 'Historical identity mismatch: '+ident
        assert ident not in result, 'Duplicate member ID'
        assert party in ('Republican','Democrat','Forward'), 'Unreviewed affiliation label'
        result[ident]=dict(name=name,house=house,district=district,session='2026GS',party=party)
    return dict(session='2026GS',source=source,records=result,unavailable=unavailable)

if __name__=='__main__':
    m=json.loads(Path('data/catalog.json').read_text(encoding='utf-8'))
    data=json.loads(Path('dist/data/catalog-ui.json').read_text(encoding='utf-8'))
    result=project(m['sources']['roster2026'],data['legislators'])
    Path(sys.argv[1]).write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
    print('Review Party: '+str(len(result['records']))+' exact historical IDs; '+str(len(result['unavailable']))+' unavailable; no 2027 affiliation')
