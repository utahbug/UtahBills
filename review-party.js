// Review-only enhancement. Never supplies affiliation from current contacts or 2027 activity.
const key='utahbills-review-party-column';
let enabled=false;try{enabled=localStorage.getItem(key)==='true'}catch{}
let evidence=null;
export function affiliation(record,session,id,name){
 const p=record?.records?.[id];
 return session==='2026'&&record?.session==='2026GS'&&p?.session==='2026GS'&&p.name===name?p.party:'Unavailable';
}
export function installParty(){
 const main=document.querySelector('main');
 // WebKit's rect/offset ratio omits CSS zoom for this native top-layer panel.
 // Scope the explicit zoom correction to this Review Columns menu.
 function placePanel(){
  const menu=main.querySelector('.directory-columns-menu'),panel=menu?.querySelector('.floating-panel');
  if(!panel?.matches(':popover-open'))return;
  const trigger=menu.querySelector('summary'),r=trigger.getBoundingClientRect(),v=window.visualViewport;
  const left=v?.offsetLeft||0,top=v?.offsetTop||0,width=v?.width||innerWidth,height=v?.height||innerHeight;
  const scale=Math.max(parseFloat(getComputedStyle(document.documentElement).zoom)||1,r.width/trigger.offsetWidth||1);
  panel.style.maxWidth=(width-16)/scale+'px';panel.style.minWidth=Math.min(200,(width-16)/scale)+'px';
  const header=Math.max(top,document.querySelector('header').getBoundingClientRect().bottom);
  panel.style.maxHeight=Math.max(44,(height-(header-top)-24)/scale)+'px';
  const box=panel.getBoundingClientRect(),below=r.bottom+4,above=r.top-box.height-4;
  const y=below+box.height<=top+height-8?below:above>=header+8?above:Math.max(header+8,top+height-box.height-8);
  panel.style.setProperty('left',Math.max(left+8,Math.min(r.right-box.width,left+width-box.width-8))/scale+'px','important');
  panel.style.setProperty('top',y/scale+'px','important');
 }
 const schedulePlacement=()=>requestAnimationFrame(placePanel);
 for(const target of [window,window.visualViewport].filter(Boolean))for(const event of ['resize','scroll'])target.addEventListener(event,schedulePlacement,{passive:true});
 let queued=false;
 const observer=new MutationObserver(()=>{if(!queued){queued=true;queueMicrotask(()=>{queued=false;render()})}});
 const watch=()=>observer.observe(main,{childList:true,subtree:true});
 function render(){
  observer.disconnect();
  try{
   const fields=main.querySelector('.directory-column-options'),layout=main.querySelector('.directory-layout');
   if(!fields||!layout)return;
   let input=fields.querySelector('[data-review-party]');
   if(!input){
    main.querySelector('.directory-columns-menu .floating-panel').addEventListener('toggle',placePanel);
    main.querySelector('.directory-columns-menu .floating-panel').addEventListener('change',schedulePlacement);
    const label=document.createElement('label');input=document.createElement('input');input.type='checkbox';input.dataset.reviewParty='';label.append(input,'Party (2026)');fields.querySelector('p').before(label);
    const note=document.createElement('p');note.className='review-party-note';note.textContent='Party uses the saved 2026 roster, not 2027 membership. Missing exact identities are unavailable. ';const source=document.createElement('a');source.href='https://le.utah.gov/asp/roster/roster.asp?year=2026';source.textContent='Official 2026 roster';note.append(source);fields.append(note);
    input.onchange=()=>{enabled=input.checked;save();render()};
    main.querySelector('.restore-columns').addEventListener('click',()=>{enabled=false;save();render()});
   }
   input.checked=enabled;
   const session=main.querySelector('#directory-session').value;
   const headings=main.querySelector('.directory-columns');
   let heading=headings.querySelector('.review-party-heading');
   const showParty=enabled&&session==='2026';
   if(showParty&&!heading){heading=document.createElement('span');heading.className='review-party-heading';heading.textContent='Party (2026)';headings.append(heading)}
   if(!showParty)heading?.remove();
   const selected=[...fields.querySelectorAll('[data-column]')].filter(i=>i.checked).map(i=>i.dataset.column);
   // Recompute from native checkboxes after every native draw, never append tracks repeatedly.
   const tracks=['minmax(0,1fr)',...selected.map(k=>k==='bills'?'minmax(0,11rem)':'minmax(0,16rem)'),...(enabled?['minmax(0,9rem)']:[])];
   layout.style.setProperty('--directory-columns',tracks.join(' '));
   layout.style.setProperty('--directory-width',`max(30rem,calc(${15+selected.reduce((n,k)=>n+(k==='bills'?11:16),0)+(enabled?9:0)}rem + ${(tracks.length-1)*16+24}px))`);
   for(const row of main.querySelectorAll('.legislator-row')){
    let cell=row.querySelector('.review-party');
    if(!showParty){cell?.remove();continue}
    if(!cell){cell=document.createElement('span');cell.className='review-party';row.querySelector('.directory-counts').append(cell)}
    const link=row.querySelector('h2 a'),id=link.getAttribute('href').split('/')[1];
    const value=affiliation(evidence,session,id,link.textContent.trim());
    if(cell.textContent!=='Party (2026): '+value){cell.replaceChildren();const label=document.createElement('span');label.className='directory-mobile-label';label.textContent='Party (2026): ';cell.append(label,value);}
    cell.title=value==='Unavailable'?'No verified exact-ID historical affiliation available.':'Recorded in the saved official 2026 roster; not evidence of 2027 affiliation.';
   }
  }finally{watch()}
 }
 function save(){let saved=true;try{localStorage.setItem(key,String(enabled))}catch{saved=false}const status=main.querySelector('.column-status');if(status)status.textContent=saved?'Columns updated.':'Columns updated for this visit; this browser could not save them.'}
 watch();render();
 fetch(new URL('./review-party.json',import.meta.url)).then(r=>{if(!r.ok)throw Error('Party evidence unavailable');return r.json()}).then(data=>{evidence=data;render()}).catch(()=>{evidence=null;render()});
}
