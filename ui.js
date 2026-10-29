import {floatingDisclosure} from './floating-disclosure.js';
import {sharingActions,moreMenuLayout} from './sharing-ui.js';
import {decorateExternalLinks} from './links.js';
import {createElement,Copy,ArrowUpToLine,Info,List,ArrowLeft,ArrowRight,Ellipsis} from 'lucide';
const key='utahbills-results-per-page';
export function resultsPerPage(){try{const n=Number(localStorage.getItem(key));if([25,50,100,200].includes(n))return n}catch{}return matchMedia('(min-width:900px)').matches?100:50}
function resultControls(host){let controls=host.querySelector(':scope > .result-controls');if(controls)return controls;host.classList.add('results-toolbar');const summary=document.createElement('div');summary.className='result-summary';controls=document.createElement('div');controls.className='result-controls';for(const child of [...host.children]){(child.matches('label,button')?controls:summary).append(child)}host.append(controls,summary);return controls}
export function pagePreference(host,onChange){const label=document.createElement('label');label.className='page-preference';label.innerHTML='Per page <select aria-label="Results per page">'+[25,50,100,200].map(n=>`<option value="${n}">${n}</option>`).join('')+'</select>';const select=label.querySelector('select');select.value=resultsPerPage();select.onchange=()=>{try{localStorage.setItem(key,select.value)}catch{}onChange(Number(select.value))};resultControls(host).append(label);return label}
export const copyText=rows=>rows.map(fields=>fields.filter(Boolean).join('\n')).join('\n\n');
export function copyResults(host,read){
 const button=document.createElement('button');button.type='button';button.className='copy-results';button.setAttribute('aria-label','Copy results.');button.title='Copy all matching results';button.append(createElement(Copy,{'aria-hidden':'true'}));
 const status=document.createElement('span');status.className='copy-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');let timer;
 button.onclick=async()=>{clearTimeout(timer);button.disabled=true;status.textContent='Preparing results…';try{
  const value=await read();if(!value){status.textContent='No matching results to copy.';return}
  try{await navigator.clipboard.writeText(value);status.textContent='Copied';timer=setTimeout(()=>status.textContent='',2500)}catch{status.textContent='Select and copy the results below.';let box=host.querySelector('.copy-fallback');if(!box){box=document.createElement('textarea');box.className='copy-fallback';box.setAttribute('aria-label','Results to copy');host.append(box)}box.value=value;box.focus();box.select()}
 }catch{status.textContent='Could not load all matching results. Please retry.'}finally{button.disabled=false}};
 const group=document.createElement('div');group.className='copy-control';group.append(button,status);resultControls(host);host.append(group);return button;
}
export async function copyRows(rows){const chunks=[];for(let i=0;i<rows.length;i+=500){chunks.push(copyText(rows.slice(i,i+500)));if(i+500<rows.length)await new Promise(r=>setTimeout(r,0))}return chunks.join('\n\n')}
export function paginationIcon(button,direction){button.replaceChildren();const icon=createElement(direction==='previous'?ArrowLeft:ArrowRight,{'aria-hidden':'true',width:16,height:16});const label=document.createTextNode(direction==='previous'?'Previous':'Next');button.append(...(direction==='previous'?[icon,label]:[label,icon]));button.classList.add('page-direction')}
export function exportResults(host,read,filename,readTitles){
 const menu=document.createElement('details');menu.className='export-menu';const summary=document.createElement('summary');summary.setAttribute('aria-label','Export matching results');summary.title='Export matching results';summary.append(createElement(Ellipsis,{'aria-hidden':'true'}));const button=document.createElement('button');button.type='button';button.textContent='Export CSV';const panel=document.createElement('div');panel.className='export-panel';panel.append(button);menu.append(summary,panel);host.querySelector('.copy-control').prepend(menu);
 if(readTitles)sharingActions(host,menu,readTitles);
 moreMenuLayout(host,menu);
 button.onclick=async()=>{const name=filename();const status=host.querySelector('.copy-status');button.disabled=true;status.textContent='Preparing CSV…';try{const {headers,rows}=await read();const {csvText}=await import('./csv.js');const text=await csvText(headers,rows);const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name+'-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='CSV downloaded';menu.open=false;summary.focus()}catch{status.textContent='Could not export all matching results. Please retry.'}finally{button.disabled=false}};return menu;
}
export function navigationTools(){const header=document.querySelector('header'),button=document.createElement('button');button.id='back-to-top';button.type='button';button.hidden=true;button.setAttribute('aria-label','Back to top.');button.title='Back to top';button.append(createElement(ArrowUpToLine,{'aria-hidden':'true'}));document.body.append(button);const root=document.documentElement;
 const measure=()=>{header.classList.add('sticky-navigation');const box=header.getBoundingClientRect(),nav=header.querySelector('nav').getBoundingClientRect(),brand=header.querySelector('.brand').getBoundingClientRect(),scale=box.height/header.offsetHeight||1;const wrapped=matchMedia('(max-width:700px)').matches&&nav.top>=brand.bottom-1;header.classList.toggle('navigation-wrapped',wrapped);header.style.setProperty('--brand-collapse',wrapped?Math.floor((nav.top-box.top)/scale)+'px':'0px');root.style.setProperty('--sticky-height',Math.max(0,header.getBoundingClientRect().bottom/scale)+'px')};new ResizeObserver(measure).observe(header);addEventListener('resize',measure);measure();
 let pointerActive=false;document.addEventListener('pointerdown',()=>{pointerActive=true},{capture:true});for(const event of ['pointerup','pointercancel'])document.addEventListener(event,()=>requestAnimationFrame(()=>{pointerActive=false;update()}),{capture:true});
 let queued=false;const update=()=>{queued=false;const scrollPosition=scrollY;/* Keep pointer-down/up on the same target; separate scroll thresholds avoid oscillation. */if(!pointerActive)header.classList.toggle('navigation-compact',scrollY>48||(header.classList.contains('navigation-compact')&&scrollY>4));measure();/* Header resizing must not change an explicitly restored list position. */if(scrollY!==scrollPosition)scrollTo(0,scrollPosition);button.hidden=scrollY<innerHeight*.9;if(button.hidden)return;const r=button.getBoundingClientRect();for(const el of document.querySelectorAll('.pagination,.result-actions,.list-top,.event-links,footer,:focus-visible')){const b=el.getBoundingClientRect();if(el!==button&&b.left<r.right&&b.right>r.left&&b.top<r.bottom&&b.bottom>r.top){button.hidden=true;break}}};addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);document.addEventListener('focusin',e=>{if(e.target.closest?.('.brand')&&header.classList.contains('navigation-wrapped')&&e.target.getBoundingClientRect().top<0)scrollTo(0,0);if(header.classList.contains('sticky-navigation')&&!header.contains(e.target)){const r=e.target.getBoundingClientRect(),bottom=header.getBoundingClientRect().bottom;if(r.top<bottom&&r.bottom>0)scrollBy(0,(r.top-bottom-8)/(header.getBoundingClientRect().height/header.offsetHeight))}update()});button.onclick=()=>{const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;document.querySelector('.brand').focus({preventScroll:true});window.scrollTo({top:0,behavior:reduced?'instant':'smooth'})};update();return update}

// Keep immediately preceding section navigation visible when opening its first section.
export function scrollSectionIntoView(target){
 const previous=target.previousElementSibling;
 (previous?.matches('nav')?previous:target).scrollIntoView({block:'start'});
}

// Native auto popovers provide Escape and outside-click dismissal without route listeners.
export function toolbarInfo(host,{id,label,html,legend=false}){
 const button=document.createElement('button');button.type='button';button.className='toolbar-info';button.setAttribute('aria-label',label);button.title=label;button.append(createElement(legend?List:Info,{'aria-hidden':'true'}));
 const panel=document.createElement('div');panel.id=id;panel.className='toolbar-popover';panel.popover='auto';panel.setAttribute('role','region');panel.setAttribute('aria-label',label);panel.innerHTML=html;
 const close=document.createElement('button');close.type='button';close.className='popover-close';close.textContent='Close';close.autofocus=true;close.onclick=()=>panel.hidePopover();panel.append(close);button.popoverTargetElement=panel;
 panel.addEventListener('toggle',e=>{if(e.newState==='closed'&&panel.contains(document.activeElement))button.focus({preventScroll:true})});host.append(button,panel);
 if(legend){
  const place=()=>{if(!panel.isConnected||!panel.matches(':popover-open'))return;const r=button.getBoundingClientRect(),v=window.visualViewport,left=v?.offsetLeft||0,top=v?.offsetTop||0,width=v?.width||innerWidth,height=v?.height||innerHeight,scale=r.width/button.offsetWidth||1;panel.style.margin='0';panel.style.inset='auto';panel.style.maxWidth=((width-16)/scale)+'px';panel.style.maxHeight=((height-16)/scale)+'px';const box=panel.getBoundingClientRect();panel.style.left=(Math.max(left+8,Math.min(r.right-box.width,left+width-box.width-8))/scale)+'px';panel.style.top=(Math.max(top+8,Math.min(r.bottom+4,top+height-box.height-8))/scale)+'px'};
  let controller;panel.addEventListener('toggle',e=>{controller?.abort();if(e.newState==='open'){place();controller=new AbortController();for(const target of [window,window.visualViewport].filter(Boolean))for(const event of ['resize','scroll'])target.addEventListener(event,place,{passive:true,signal:controller.signal})}});
 }
 return button;
}

// Reuse the native stretched-link pattern, lifting only selectable text and
// independent controls above it. Blank-space modified clicks keep browser semantics.
export function stretchActivityRows(root){
 for(const row of root.querySelectorAll('.activity-row')){
  const walker=document.createTreeWalker(row,NodeFilter.SHOW_TEXT),nodes=[];while(walker.nextNode())if(walker.currentNode.textContent.trim())nodes.push(walker.currentNode);
  for(const node of nodes){const span=document.createElement('span');span.className='row-text';node.replaceWith(span);span.append(node)}
 }
}

// One responsive layout moves the existing controls, preserving state and focus.
let disposeBillLayout=()=>{};
export function billToolbarLayout(host,{source,searchHeading,records,requestTotal,measureTotal}){
 disposeBillLayout();const media=matchMedia('(max-width:700px)'),controls=host.querySelector('.result-controls'),sort=host.querySelector('#sort'),size=host.querySelector('.page-preference'),status=document.querySelector('#status');
 host.classList.add('bill-toolbar');sort.closest('label').hidden=true;
 const menu=document.createElement('details');menu.className='sort-menu';menu.innerHTML='<summary aria-label="Sort and filter bills">Sort</summary><div class="export-panel bill-sort-panel"><div class="sort-choices"><details class="status-submenu"><summary aria-label="Filter records by status">Status ▸</summary><div class="status-options" role="group" aria-label="Filter by status"></div></details></div></div>';host.prepend(menu);
 const panel=menu.querySelector('.export-panel'),choices=menu.querySelector('.sort-choices'),statusMenu=menu.querySelector('.status-submenu'),statusChoices=menu.querySelector('.status-options'),trigger=menu.querySelector(':scope>summary');
 const close=()=>{menu.open=false;if(panel.matches(':popover-open'))panel.hidePopover();trigger.focus({preventScroll:true})};
 for(const value of ['number','title','sponsor']){const button=document.createElement('button');button.type='button';button.dataset.sort=value;button.textContent=value==='number'?sort.querySelector('[value="number"]').textContent:value==='title'?'Title':'Sponsor';button.setAttribute('aria-label','Sort by '+button.textContent+(value==='number'?'':' alphabetically'));button.onclick=()=>{sort.value=value;sort.dispatchEvent(new Event('change',{bubbles:true}));close()};choices.append(button)}
 for(const option of status.options){const button=document.createElement('button');button.type='button';button.dataset.status=option.value;button.textContent=option.value||'All statuses';button.onclick=()=>{status.value=option.value;status.dispatchEvent(new Event('change',{bubbles:true}));close()};statusChoices.append(button)}
 const sync=()=>{for(const b of choices.querySelectorAll('[data-sort]'))b.setAttribute('aria-pressed',String(b.dataset.sort===sort.value));for(const b of statusChoices.children)b.setAttribute('aria-pressed',String(b.dataset.status===status.value));statusMenu.querySelector('summary').textContent=status.value?'Status ▸ •':'Status ▸';trigger.setAttribute('aria-label','Sort and filter bills'+(status.value?'. Status filter: '+status.value:''));};sort.addEventListener('change',sync);status.addEventListener('change',sync);sync();
 floatingDisclosure(menu,panel,{avoidTrigger:true,align:'start'});
 statusMenu.addEventListener('toggle',()=>panel.dispatchEvent(new Event('change')));
 statusMenu.addEventListener('keydown',e=>{if(e.key==='Escape'&&statusMenu.open){e.preventDefault();e.stopPropagation();statusMenu.open=false;statusMenu.querySelector('summary').focus()}});
 menu.addEventListener('toggle',()=>{if(!menu.open)statusMenu.open=false});
 let heading;if(records){heading=document.createElement('div');heading.className='records-heading search-heading';records.prepend(heading);heading.append(records.querySelector('label'))}
 let last;const update=()=>{if(!host.isConnected||last===media.matches)return;last=media.matches;const active=document.activeElement,moving=size.contains(active);
  if(last){panel.append(size);size.firstChild.textContent='Results per page ';(heading||searchHeading).append(source)}else{controls.append(size);size.firstChild.textContent='Per page ';searchHeading.append(source)}
  const fullSourceLabel='Official '+(records?'2027':'2026')+' Bill Search';source.setAttribute('aria-label',fullSourceLabel);const tail=source.querySelector('.external-tail');if(tail){source.firstChild.textContent=last?'Official ':fullSourceLabel.slice(0,-6);tail.firstChild.textContent=last?'search':'Search'}else source.textContent=last?'Official search':fullSourceLabel;
  if(records){records.querySelector('option[value="2027-requests"]').textContent=last?`2027 Public Bill Requests (${requestTotal})`:'2027 Public bill requests';records.querySelector('option[value="2027"]').textContent=last?`2027 Bills and resolutions (${measureTotal})`:'2027 Bills and resolutions'}
  decorateExternalLinks(source.parentElement);if(active===source)source.focus({preventScroll:true});if(moving){if(last)menu.open=true;active.focus({preventScroll:true})}
 };media.addEventListener('change',update);disposeBillLayout=()=>media.removeEventListener('change',update);update();
}

// Keep the native select for interaction; its selected caption can reflow at large text sizes.
let disposeCompactSelects=()=>{};
export function compactSelects(root){
 disposeCompactSelects();const pairs=[...root.querySelectorAll('select')].map(select=>{const display=document.createElement('span'),value=document.createElement('span');display.className='select-display';value.className='selected-value';value.setAttribute('aria-hidden','true');select.before(display);select.classList.add('compact-select');display.append(value,select);return {select,value}});
 // Compact Sort captions remain available on hover/focus, fit the viewport and dismiss with Escape.
 for(const {select,value} of pairs){const label=select.closest('label');if(!label||!['sort','directory-sort'].includes(select.id))continue;const show=()=>{delete label.dataset.captionDismissed;requestAnimationFrame(()=>{if(!label.matches('.direct-sort,.directory-compact-sort'))return;const r=label.getBoundingClientRect(),scale=r.width/label.offsetWidth||1;value.style.maxWidth=(innerWidth-24)/scale+'px';const width=value.getBoundingClientRect().width;label.style.setProperty('--sort-tip-left',(Math.max(12,Math.min(r.left,innerWidth-width-12))-r.left)/scale+'px')})};label.addEventListener('mouseenter',show);select.addEventListener('focus',show);select.addEventListener('change',show);label.addEventListener('keydown',e=>{if(e.key==='Escape')label.dataset.captionDismissed=''})}
 const update=()=>{for(const {select,value} of pairs){value.textContent=select.selectedOptions[0]?.textContent||'';if(['sort','directory-sort'].includes(select.id))select.title='Current selection: '+value.textContent}};
 const observer=new MutationObserver(update);for(const {select} of pairs)observer.observe(select,{childList:true,subtree:true});root.addEventListener('change',update);update();disposeCompactSelects=()=>{observer.disconnect();root.removeEventListener('change',update)};
}
