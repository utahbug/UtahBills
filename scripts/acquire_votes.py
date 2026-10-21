"""Bounded 2026 vote import. Original bytes and action references retained; fail closed."""
import json,re,html,hashlib,time,urllib.request,pathlib,sys
from datetime import datetime,timezone
from catalog_model import derive,read,ROOT
SAMPLE=['HB0002','HB0011','HB0154','HB0155','SB0069']
def text(s):return ' '.join(html.unescape(re.sub('<[^>]*>',' ',s)).split())
def identity(name,house,district,people):
    # Require surname AND given-name initial, chamber and district when supplied.
    surname,given=name.split(',',1) if ',' in name else ('','')
    candidates=[]
    for p in people:
        last,first=p['name'].split(',',1) if ',' in p['name'] else ('','')
        if last.strip().casefold()==surname.strip().casefold() and first.strip() and given.strip() and first.strip()[0].casefold()==given.strip()[0].casefold() and p['house']==house and (not district or p['district']==int(district)):candidates.append(p['id'])
    return candidates[0] if len(candidates)==1 else None

def parse(body,bill,a,people):
    s=body.decode('utf-8-sig');committee=a['actionClass']=='A';voice=a['voiceVote']=='1'
    if committee:s=s.split('<main id="main-content">',1)[1].split('</main>',1)[0]
    assert bill in text(s),'Wrong bill on vote record'
    votes=[];tally={};sourceTime='';version=None
    if committee:
        motion=text(re.search(r'<b>((?:House|Senate) Comm\s*-.*?)</b>',s,re.S).group(1))
        result=motion.rsplit(' - ',1)[-1]
        versionMatch=re.search(r'#([HS]B\d+(?:S\d+)?)',motion);version=versionMatch[1] if versionMatch else None
        cells=re.findall(r'<td valign="top">(.*?)</td>',s,re.S);assert len(cells)==3
        counts=re.search(r'<b>Yeas</b> - (\d+).*?<b>Nays</b> - (\d+).*?<b>Absent</b> - (\d+)',s,re.S);assert counts
        house='S' if a['owner'].startswith('Senate') else 'H'
        for label,n,cell in zip(['Yes','No','Absent'],counts.groups(),cells):
            names=[text(x) for x in re.split(r'<br\s*/?>',cell) if text(x)]
            assert len(names)==int(n),'Committee tally mismatch';tally[label]=int(n)
            votes.extend(dict(name=name,vote=label,legislatorId=identity(name,house,None,people)) for name in names)
        meeting=re.search(r'(\d+/\d+/\d+[^<]+)<br',s);sourceTime=meeting[1].strip() if meeting else ''
    else:
        header=re.search(r'<center><b>(.*?)</b>',s,re.S);assert header
        h=text(header[1]);result='Passed' if ' - Passed' in h else 'Failed' if ' - Failed' in h else 'Result not identified'
        v=re.search(r'Substitute (\d+)',h);version=bill+'S'+v[1].zfill(2) if v else None
        sourceTime=h.split(', ',1)[-1] if ', ' in h else ''
        centers=[text(x) for x in re.findall(r'<center>([^<]*)</center>',s)]
        motion=' · '.join(x for x in centers[4:] if x and not re.match(r'Yeas \d+',x))
        assert motion,'Missing floor question'
        if voice:assert 'on voice vote' in h
        else:
            groups=re.findall(r'<font face="Arial" size="5">(Yeas|Nays|Absent or not voting) - (\d+)</font>.*?<table>(.*?)</table>',s,re.S);assert len(groups)==3
            for raw,n,table in groups:
                label={'Yeas':'Yes','Nays':'No','Absent or not voting':'Absent or not voting'}[raw]
                cells=re.findall(r'<td>(.*?)</td>',table,re.S);assert len(cells)==int(n),'Floor tally mismatch';tally[label]=int(n)
                for cell in cells:
                    name=text(cell);d=re.search(r'dist=(\d+)',cell)
                    votes.append(dict(name=name,vote=label,legislatorId=identity(name,a['voteHouse'],d[1] if d else None,people)))
    assert len({v['name'] for v in votes})==len(votes),'Duplicate voter'
    if not voice:assert list(tally.values())==list(map(int,a['voteStr'].split('-'))),'Action and roll-call tally disagree'
    classification='Concurrence' if 'Concurrence' in motion else 'Passage on second and third readings' if 'Passage on 2nd & 3rd' in motion else 'Passage on second reading' if 'Passage on Second' in motion else 'Final passage' if not committee and 'Final Passage' in motion else 'Committee substitute recommendation' if committee and 'Substitute Recommendation' in motion else 'Committee recommendation' if committee and 'Favorable Recommendation' in motion else 'Concurrence' if 'concur' in motion.lower() else 'Amendment' if 'amend' in motion.lower() else 'Procedural' if any(x in motion for x in ['Motion to Circle','Motion to Uncircle']) else 'Other recorded question'
    return dict(bill=bill,session='2026GS',actionDate=a['actionDate'],action=a['description'],body=a['owner'] if committee else {'H':'House','S':'Senate'}[a['voteHouse']],committee=committee,motion=motion,classification=classification,version=version,sourceTime=sourceTime,sourceTimeKind='Meeting notice time' if committee else 'Vote record time',result=result,voice=voice,tally=tally,individuals=votes)

def main():
    manifest=json.loads((ROOT/'data/catalog.json').read_text(encoding='utf-8-sig'));people=derive(manifest)['legislators'];items=[]
    old=json.loads((ROOT/'data/votes.json').read_text(encoding='utf-8-sig')) if (ROOT/'data/votes.json').exists() else {'records':[]}
    cache={v['source']['url']:v['source'] for v in old['records']}
    for bill in SAMPLE:
        ref=manifest['records']['2026/'+bill];b=json.loads(read(ref))
        for a in b['actionHistoryList']:
            if not a.get('voteID'):continue
            url='https://le.utah.gov/mtgvotes.jsp?voteid='+a['voteID'] if a['actionClass']=='A' else 'https://le.utah.gov/DynaBill/svotes.jsp?sessionid=2026GS&voteid='+a['voteID']+'&house='+a['voteHouse']
            if url in cache:source=cache[url];body=read(source)
            else:
                body=urllib.request.urlopen(url,timeout=40).read();sha=hashlib.sha256(body).hexdigest();path='data/vote-raw/'+sha+'.txt';(ROOT/path).parent.mkdir(exist_ok=True);(ROOT/path).write_bytes(body)
                source=dict(url=url,path=path,sha256=sha,retrievedAt=datetime.now(timezone.utc).isoformat());time.sleep(.25)
            v=parse(body,bill,a,people);v.update(id=bill+'-'+a['voteHouse']+'-'+a['voteID'],source=source,actionSource=ref);items.append(v)
    result=dict(schemaVersion=1,scope='Selected 2026 General Session records; not a complete voting history.',bills=SAMPLE,records=sorted(items,key=lambda x:x['actionDate']))
    (ROOT/'data/votes.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(len(items),'votes;',sum(len(v['individuals']) for v in items),'individual entries')
if __name__=='__main__':main()
