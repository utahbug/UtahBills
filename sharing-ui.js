import {titleLinks,titlesOnly,copyPrepared} from './sharing.js';

export function sharingActions(host,menu,readTitles){
 const primary=host.querySelector('.copy-results'),summary=menu.querySelector('summary'),panel=menu.querySelector('.export-panel'),status=host.querySelector('.copy-status');
 primary.setAttribute('aria-label','Copy titles with links');primary.title='Copy titles with links';
 summary.setAttribute('aria-label','More results options');summary.title='More results options';
 const titles=document.createElement('button');titles.type='button';titles.className='copy-titles';titles.textContent='Copy titles only';panel.prepend(titles);
 const copy=async(withLinks)=>{
  const trigger=withLinks?primary:titles;let manual=false,failed=false;
  primary.disabled=titles.disabled=true;status.textContent='Loading all matching titles…';host.querySelector('.copy-fallback')?.remove();
  try{
   const rows=readTitles(),progress=(n,total)=>status.textContent=`Preparing ${n} of ${total} titles…`;
   const prepared=Promise.resolve(rows).then(all=>withLinks?titleLinks(all,location.href,progress):titlesOnly(all,progress));
   const {result,copied}=await copyPrepared(prepared,{rich:withLinks});
   if(!result.count){status.textContent='No matching titles to copy.';failed=true;return}
   menu.open=false;
   if(copied){status.textContent=`Copied ${result.count} titles${withLinks?' with links':''}.`}
   else{
    status.textContent='Clipboard unavailable. Select and copy the complete text below.';
    const box=document.createElement('textarea');box.className='copy-fallback';box.setAttribute('aria-label',withLinks?'Titles and links to copy':'Titles to copy');box.value=result.plain;host.append(box);box.focus();box.select();manual=true;
   }
  }catch{status.textContent='Could not load all matching titles. Please retry.';failed=true}
  finally{primary.disabled=titles.disabled=false;if(host.isConnected&&!manual)(failed?trigger:withLinks?primary:summary).focus({preventScroll:true})}
 };
 primary.onclick=()=>copy(true);titles.onclick=()=>copy(false);
}

// Reserve only the open menu's space below the toolbar. This keeps a compact
// dropdown from partly covering result links, without moving closed controls.
export function moreMenuLayout(host,menu){
 const panel=menu.querySelector('.export-panel'),trigger=menu.querySelector('summary'),lifecycle=new AbortController();
 let reserved=0,originalPadding='',basePadding=0,opened=false;
 const restore=()=>{if(opened)host.style.paddingBottom=originalPadding;reserved=0;opened=false};
 const place=(initial=false)=>{
  if(!host.isConnected){restore();lifecycle.abort();return}if(!menu.open){restore();return}
  if(!opened){originalPadding=host.style.paddingBottom;basePadding=parseFloat(getComputedStyle(host).paddingBottom)||0;opened=true}
  const r=trigger.getBoundingClientRect(),m=menu.getBoundingClientRect(),v=window.visualViewport,left=v?.offsetLeft||0,top=v?.offsetTop||0,width=v?.width||innerWidth,height=v?.height||innerHeight,scale=r.width/trigger.offsetWidth||1;
  const headerBottom=Math.max(top,document.querySelector('header').getBoundingClientRect().bottom);
  panel.style.right='auto';panel.style.minWidth=Math.min(200,(width-16)/scale)+'px';panel.style.maxWidth=(width-16)/scale+'px';panel.style.maxHeight=Math.max(44,(top+height-headerBottom-24)/scale)+'px';
  const box=panel.getBoundingClientRect(),bottom=host.getBoundingClientRect().bottom-reserved*scale,x=Math.max(left+8,Math.min(r.right-box.width,left+width-box.width-8)),above=r.top-box.height-4;
  const intersects=e=>{if(menu.contains(e)||!e.getClientRects().length)return false;const q=e.getBoundingClientRect();return q.right>x&&q.left<x+box.width&&q.bottom>above&&q.top<above+box.height};
  const useAbove=bottom+4+box.height>top+height-8&&above>=headerBottom+8&&![...document.querySelectorAll('a,button,input,select,summary')].some(intersects);
  const next=useAbove?0:box.height/scale+4;
  if(next!==reserved){reserved=next;host.style.paddingBottom=(basePadding+reserved)+'px'}
  panel.style.left=(x-m.left)/scale+'px';const y=useAbove?above:bottom+4;
  panel.style.top=(Math.max(headerBottom+8,Math.min(y,top+height-box.height-8))-m.top)/scale+'px';
  if(initial&&!useAbove&&y+box.height>top+height-8){window.scrollBy(0,(y+box.height-(top+height-8))/scale);requestAnimationFrame(()=>place())}
 };
 menu.addEventListener('toggle',()=>place(true));menu.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();menu.open=false;trigger.focus()}});
 for(const target of [window,window.visualViewport].filter(Boolean))for(const event of ['resize','scroll'])target.addEventListener(event,()=>place(),{passive:true,signal:lifecycle.signal});
 const dismiss=e=>{if(!host.isConnected){restore();lifecycle.abort();return}if(menu.open&&!menu.contains(e.target))menu.open=false};
 document.addEventListener('pointerdown',dismiss,{signal:lifecycle.signal});document.addEventListener('focusin',dismiss,{signal:lifecycle.signal});
}
