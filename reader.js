export function renderLegislativeNode(node, inherited = '') {
  const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const {tag, attrs={}, children=[], text=''} = node;
  if (['ln','tab'].includes(tag)) return ' ';
  if (['amendoutstart','amendoutend','sinfo'].includes(tag)) return '';
  const change = attrs.ea === 'amend' ? 'addition' : attrs.ea === 'erase' ? 'deletion' : inherited;
  let content = escape(text) + children.map(c => renderLegislativeNode(c, change) + escape(c.tail)).join('');
  // Mark only a new change boundary, so inherited subsection markings are not repeated.
  if (change && change !== inherited) {
    const mark = change === 'addition' ? 'ins' : 'del';
    content = `<${mark}><span class="sr-only" data-reader-label>[${change}: </span>${content}<span class="sr-only" data-reader-label> end ${change}]</span></${mark}>`;
  }
  if(tag === 'display') return `<span class="clause-number">${content}</span> `;
  if(tag === 'bsec') return `<section class="bill-section">${content}</section>`;
  if(tag === 'secline') return `<h3>${content}</h3>`;
  if(tag === 'catline') return `<h4>${content}</h4>`;
  if(tag === 'subsection') return `<div class="bill-subsection">${content}</div>`;
  if(tag === 'sectionText') return `<div class="bill-paragraph">${content}</div>`;
  if(['st','lthead','gdhead','hphead','moni','oc','sa'].includes(tag)) return `<div class="bill-label">${content}</div>`;
  if(['sessionhead','statehead','sponsorhead','otherSponsorhead','gd','hl','moniNone','ocl','sn','cn','enact','comrec','legvote'].includes(tag)) return `<div class="bill-paragraph">${content}</div>`;
  if(tag === 'bold') return `<strong>${content}</strong>`;
  return content;
}
export function formattedReader(bill, escape) {
  return `<section class="panel"><details id="formatted-reader"><summary>Read formatted bill</summary><p>Official wording and change markings from the selected XML, presented for reading. This is separate from the plain-English explanation.</p><label class="reader-version-label" for="reader-version">Bill version</label><select id="reader-version">${bill.versions.map((v,i)=>`<option value="${i}">${escape(v.id)} · ${escape(v.label)}</option>`).join('')}</select><p id="reader-source"></p><p class="note">Layout and line breaks are adapted. Source section numbers, wording, additions, and deletions are retained, including markings carried in enrolled XML. This is not an independently verified current-law snapshot. Cover metadata and long title are included; printing footers and internal XML metadata are omitted.</p><p><small>Change key: <ins>added</ins> · <del>deleted</del>. Screen readers receive change-boundary labels.</small></p><div id="reader-body" class="formatted-bill" aria-label="Formatted official bill text" role="region" tabindex="0"></div></details></section>`;
}
