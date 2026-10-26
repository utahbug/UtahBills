// Presentation only: exact source text is escaped, never executed or overwritten.
export const escapeText=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const esc=escapeText;
export const sourceDay=value=>/^\d{4}-\d{2}-\d{2}/.test(value||'')?value.slice(0,10):'';
export const readableDay=value=>sourceDay(value)?new Date(sourceDay(value)+'T12:00:00Z').toLocaleDateString('en-US',{timeZone:'UTC',month:'long',day:'numeric',year:'numeric'}):'Date unavailable';
const href=(url,label)=>`<a href="${esc(url)}">${esc(label)}</a>`;
// The metadata uses unclosed ltbullet markers; only those known structural tokens are interpreted.
export function highlightedProvisions(raw,{inline=false}={}){
 if(!raw)return '';
 const parts=String(raw).split(/(<hr\s*\/?>|<\/?ltbullet\d*\s*>)/i),roots=[],parents=[];let prefix='',current;
 for(const part of parts){if(/^<hr/i.test(part)||/^<\/ltbullet/i.test(part))continue;const marker=part.match(/^<ltbullet(\d*)\s*>$/i);if(marker){const level=Number(marker[1]||0),item={text:'',children:[]};if(level&&parents[level-1])parents[level-1].children.push(item);else roots.push(item);parents[level]=item;parents.length=level+1;current=item}else if(current)current.text+=part;else prefix+=part}
 const list=items=>`<ul>${items.map(item=>`<li>${esc(item.text)}${item.children.length?list(item.children):''}</li>`).join('')}</ul>`;
 if(inline)return `<div class="highlighted-provisions" role="group" aria-label="Official highlighted provisions">${prefix.trim()&&!/^This bill:\s*$/i.test(prefix)?`<p>${esc(prefix)}</p>`:''}${roots.length?list(roots):''}</div>`;
 return `<section class="highlighted-provisions"><h2>Highlighted provisions</h2>${prefix?`<p>${esc(prefix)}</p>`:''}${roots.length?list(roots):''}<small>Official metadata wording.</small></section>`;
}
export function eventDate(value,session,full=false){const day=sourceDay(value);return `<time${day?` datetime="${esc(day)}"`:''}${session==='2026GS'&&day&&day<='2026-12-31'?' class="historical-date"':''}>${esc(full?value:readableDay(value))}</time>`}
// Verified 2026 General Session end: https://le.utah.gov/~2026/2026.htm. Other dates remain qualified.
const filedLabel=a=>a.actionDate?.startsWith('2026-03-06')?'Filed at session end':'Filed among bills not passed';
const labels={HCAFAV:'House committee recommended passage',SCAFAV:'Senate committee recommended passage',HCASUB:'House committee recommended a substitute',SCASUB:'Senate committee recommended a substitute',HPASS3:'House passed third reading',SPASS3:'Senate passed third reading',HCONCUR:'House concurred with Senate amendments',SCONCUR:'Senate concurred with House amendments',GSIGN:'Governor signed',HREAD1:'House first reading',SREAD1:'Senate first reading',HECS:'House struck the enacting clause',SECS:'Senate struck the enacting clause'};
export function actionLabel(action){if(['HFILED','SFILED'].includes(action.actionCode)&&/file for bills not passed/i.test(action.owner||''))return filedLabel(action);return labels[action.actionCode]||action.description||'Recorded action'}
export function keyActions(actions=[]){
 const candidates=actions.filter(a=>labels[a.actionCode]||['HFILED','SFILED'].includes(a.actionCode));
 const selected=candidates.filter(a=>!['HREAD1','SREAD1'].includes(a.actionCode)||!actions.some(x=>x.actionCode===a.actionCode[0]+'PASS3'));
 const latest=actions.at(-1);if(latest&&!selected.includes(latest)&&!['LFA1','LFA2','LFA3','LFA4'].includes(latest.actionCode))selected.push(latest);
 return selected.slice(-5);
}
export function statusSummary(b,actions=[],{heading=""}={}){
 const last=actions.at(-1),codes=actions.map(a=>a.actionCode),filed=last&&['HFILED','SFILED'].includes(last.actionCode)&&/file for bills not passed/i.test(last.owner||'');
 const terminal=/veto/i.test(last?.description||'')?last.description:b.status==='Vetoed'?'Vetoed':'';
 const status=terminal|| (codes.includes('GSIGN')?'Signed':filed?'Did not pass':codes.includes('HPASS3')&&codes.includes('SPASS3')?'Passed both chambers':codes.includes('HPASS3')?'Passed the House':codes.includes('SPASS3')?'Passed the Senate':b.status||'Status not established');
 const owner=last?.owner||b.lastActionOwner||'',dated=last?.actionDate||b.lastActionDate;
 const location=!filed&&status!=='Signed'&&/^(House|Senate)\b/.test(owner)&&/(Committee|Chamber|Reading Calendar)/.test(owner)?`<span class="recorded-location">Last recorded location: ${esc(owner)} · ${esc(readableDay(dated))}</span>`:'';
 return `<div class="bill-current-status">${heading?`<div class="summary-heading"><h2>${esc(heading)}</h2>`:""}<span class="tag ${status==='Signed'?'':'closed'}">${esc(status)}</span>${heading?"</div>":""}${last?`<p>Latest recorded action: ${esc(filed?filedLabel(last):last.description)} · ${eventDate(dated,b.sessionID)}</p>`:''}${location}${!['Signed','Did not pass'].includes(status)&&/Passed/.test(status)?'<small>Chamber passage alone does not establish enactment.</small>':''}</div>`;
}
export function keyActionsHTML(b,actions=[]){const selected=keyActions(actions);return `<section class="key-actions"><h2>Key actions</h2>${selected.length?`<ol>${selected.map(a=>`<li>${eventDate(a.actionDate,b.sessionID)} — ${esc(actionLabel(a))}</li>`).join('')}</ol>`:'<p>No significant action is established in the saved record.</p>'}<p class="compact-source">${href(b.officialUrl||`https://le.utah.gov/~${b.sessionID.slice(0,4)}/bills/static/${b.billNumber}.html`,'Official action history')}</p></section>`}
export function actionHistoryHTML(b,actions=[]){return `<details class="history-target supporting-record"><summary>View all ${actions.length} actions</summary><div class="full-history" tabindex="0" role="region" aria-label="Complete action history"><ol class="timeline">${actions.map(a=>`<li>${eventDate(a.actionDate,b.sessionID,true)} <small>(source time; zone unspecified)</small><br>${esc(a.description)}<br>${esc(a.owner)}${a.voiceVote==='1'?'<br>Voice vote; no individual attribution':a.voteStr?`<br>Recorded vote: ${esc(a.voteStr)}`:''}${a.voteID?`<br>Vote reference ${esc(a.voteID)} (${esc(a.voteHouse)})`:''}</li>`).join('')}</ol></div><p>${href(b.sourceUrl,'Official action-history source (JSON)')}</p></details>`}
export function committeeHTML(b,agendas=b.agendaList||b.committeeAgendas||[]){return `<details class="committee-details supporting-record"><summary>Committee details</summary>${(b.committees||[]).map(c=>`<p>${esc(c)}</p>`).join('')||'<p>No committee assignment recorded.</p>'}${agendas.map(a=>`<p>${esc(readableDay(a.mtgDate))} · ${esc(a.committeeName)}<br>${a.agendaURL?href(new URL(a.agendaURL,'https://le.utah.gov').href,'Agenda'):''}${a.minutesURL?' · '+href(new URL(a.minutesURL,'https://le.utah.gov').href,'Minutes'):''}</p>`).join('')}</details>`}
