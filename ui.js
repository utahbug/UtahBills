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
export function exportResults(host,read,filename){
 const menu=document.createElement('details');menu.className='export-menu';const summary=document.createElement('summary');summary.setAttribute('aria-label','Export matching results');summary.title='Export matching results';summary.append(createElement(Ellipsis,{'aria-hidden':'true'}));const button=document.createElement('button');button.type='button';button.textContent='Export CSV';menu.append(summary,button);host.querySelector('.copy-control').prepend(menu);
 button.onclick=async()=>{const name=filename();const status=host.querySelector('.copy-status');button.disabled=true;status.textContent='Preparing CSV…';try{const {headers,rows}=await read();const {csvText}=await import('./csv.js');const text=await csvText(headers,rows);const url=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name+'-'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='CSV downloaded';menu.open=false;summary.focus()}catch{status.textContent='Could not export all matching results. Please retry.'}finally{button.disabled=false}};return menu;
}
export function navigationTools(){const header=document.querySelector('header'),button=document.createElement('button');button.id='back-to-top';button.type='button';button.hidden=true;button.setAttribute('aria-label','Back to top.');button.title='Back to top';button.append(createElement(ArrowUpToLine,{'aria-hidden':'true'}));document.body.append(button);const root=document.documentElement;
 const measure=()=>{header.classList.add('sticky-navigation');const box=header.getBoundingClientRect(),nav=header.querySelector('nav').getBoundingClientRect(),brand=header.querySelector('.brand').getBoundingClientRect(),scale=box.height/header.offsetHeight||1;const wrapped=matchMedia('(max-width:700px)').matches&&nav.top>=brand.bottom-1;header.classList.toggle('navigation-wrapped',wrapped);header.style.setProperty('--brand-collapse',wrapped?(nav.top-box.top)/scale+'px':'0px');root.style.setProperty('--sticky-height',Math.max(0,header.getBoundingClientRect().bottom/scale)+'px')};new ResizeObserver(measure).observe(header);addEventListener('resize',measure);measure();
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

// Reuse the existing export disclosure; move the same controls, never duplicate state.
let disposeBillLayout=()=>{};
export function billToolbarLayout(host,{source,searchHeading,records,requestTotal,measureTotal}){
 disposeBillLayout();const media=matchMedia('(max-width:700px)'),menu=host.querySelector('.export-menu'),summary=menu.querySelector('summary'),panel=document.createElement('div'),controls=host.querySelector('.result-controls'),sort=host.querySelector('#sort').closest('label'),size=host.querySelector('.page-preference');
 panel.className='export-panel';panel.append(menu.querySelector('button'));menu.append(panel);host.classList.add('bill-toolbar');summary.setAttribute('aria-label','More results options');summary.title='More results options';sort.querySelector('select').setAttribute('aria-label','Sort results by');
 let heading;if(records){heading=document.createElement('div');heading.className='records-heading search-heading';records.prepend(heading);heading.append(records.querySelector('label'))}
 let last;const update=()=>{if(!host.isConnected||last===media.matches)return;last=media.matches;const active=document.activeElement;const focusMoved=sort.contains(active)||size.contains(active)||active===source;
  if(last){panel.prepend(sort,size);sort.firstChild.textContent='Sort results by ';size.firstChild.textContent='Results per page ';if(heading)heading.append(source)}else{controls.append(sort,size);sort.firstChild.textContent='Sort ';size.firstChild.textContent='Per page ';searchHeading.append(source)}
  if(records){records.querySelector('option[value="2027-requests"]').textContent=last?`2027 Public Bill Requests (${requestTotal})`:'2027 Public bill requests';records.querySelector('option[value="2027"]').textContent=last?`2027 Bills and resolutions (${measureTotal})`:'2027 Bills and resolutions'}
  if(focusMoved){if(last&&(sort.contains(active)||size.contains(active)))menu.open=true;active.focus({preventScroll:true})}
 };media.addEventListener('change',update);const dismiss=e=>{if(menu.open&&!menu.contains(e.target))menu.open=false};document.addEventListener('pointerdown',dismiss);document.addEventListener('focusin',dismiss);disposeBillLayout=()=>{media.removeEventListener('change',update);document.removeEventListener('pointerdown',dismiss);document.removeEventListener('focusin',dismiss)};update();
 menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();menu.open=false;summary.focus()}});
}
