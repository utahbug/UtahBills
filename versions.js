import {diffWords} from 'diff';
import {escapeHTML as esc} from './discovery.js';
// Shared deterministic presentation: proposed sections, not legal-effect interpretation.
const comparisonLabel=g=>g.version+' · '+g.label+(g.fileType==='Amended'?' · '+g.text.source.url.split('/').pop():'');
const flatten=v=>v.sections.map(s=>s.number+'\n'+s.text).join('\n\n');
export function comparisonHTML(a,b){const left=flatten(a),right=flatten(b),changes=diffWords(left,right);return !changes.some(p=>p.added||p.removed)?'<p>No differences in the extracted proposed section text for these versions.</p>':changes.map(p=>p.added?`<ins><span class="sr-only">Addition: </span>${esc(p.value)}</ins>`:p.removed?`<del><span class="sr-only">Deletion: </span>${esc(p.value)}</del>`:esc(p.value)).join('')}
export function versionSection(detail){
 const data=detail.versionTransparency;
 if(!data)return '<section class="panel"><h2>Versions and amendments</h2><p>Verified version details are unavailable in this saved record. Consult the official measure page.</p></section>';
 const available=data.groups.filter(g=>g.text),options=available.map((g,i)=>`<option value="${i}">${esc(comparisonLabel(g))}</option>`).join('');
 return `<section class="panel version-transparency"><h2>Versions and amendments</h2><p><small>Grouped by official version ID, then document type—not a verified publication sequence. Amendment documents are associated records, not separate substitute versions. PDF/XML representations are grouped together. Document dates and time zones do not establish first publication or adoption.</small></p>${data.groups.map(g=>`<details><summary>${esc(g.version)} · ${esc(g.label)}</summary><p>${esc(g.availability)}</p><ul>${g.documents.map(d=>`<li><a href="${esc(d.url)}">${esc(d.fileName)}</a><br><small>Document record date: ${esc(d.date||'Unavailable')} · publication time unverified</small></li>`).join('')}</ul>${g.text?`<p><small>Text retrieved ${esc(g.text.source.retrievedAt)} · <a href="./${esc(g.text.source.path)}">Preserved XML</a></small></p>`:''}</details>`).join('')||'<p>No version documents supplied.</p>'}<details class="version-comparison"><summary>Compare verified text</summary>${available.length>=2?`<p>Proposed statutory and effective-date sections only; titles, sponsors and layout whitespace are excluded. This comparison does not establish legal effect or which amendment caused a change.</p><div class="compare-controls"><label>From version<select class="version-from">${options}</select></label><label>To version<select class="version-to">${options}</select></label></div><p class="version-sources"></p><p><small>Change key: <del>deleted text</del> · <ins>added text</ins>.</small></p><div class="version-diff law" tabindex="0" role="region" aria-label="Verified version text comparison"></div>`:'<p>Comparison unavailable: fewer than two exact documents have locally retrieved, validated text. Official links above remain available; link presence alone does not verify retrievability.</p>'}</details></section>`;
}
export function attachVersionComparison(main,detail){
 const host=main.querySelector('.version-transparency'),data=detail.versionTransparency;if(!host||!data)return;
 const available=data.groups.filter(g=>g.text),from=host.querySelector('.version-from'),to=host.querySelector('.version-to');if(!from)return;
 to.value=available.length-1;
 const draw=()=>{const a=available[Number(from.value)],b=available[Number(to.value)];host.querySelector('.version-sources').innerHTML=[a,b].map(g=>`<a href="${esc(g.text.source.url)}">${esc(comparisonLabel(g))} · official XML</a>`).join(' → ');host.querySelector('.version-diff').innerHTML=comparisonHTML(a.text,b.text)};
 from.onchange=to.onchange=draw;draw();
}
