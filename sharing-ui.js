import {createElement,Copy,ChevronDown} from 'lucide';
import {floatingDisclosure} from './floating-disclosure.js';
import {titleLinks,titlesOnly,titlesSponsors,copyPrepared} from './sharing.js';

export function sharingActions(host,menu,readTitles){
 const primary=host.querySelector('.copy-results'),summary=menu.querySelector('summary'),panel=menu.querySelector('.export-panel'),status=host.querySelector('.copy-status');
 status.classList.add('sharing-status');host.append(status);
 primary.setAttribute('aria-label','Copy');primary.title='Copy all matching titles with links';primary.textContent='Copy';
 menu.classList.add('unified-copy');summary.setAttribute('aria-label','Copy and export results');summary.title='Copy and export results';summary.replaceChildren(createElement(Copy,{'aria-hidden':'true'}),createElement(ChevronDown,{'aria-hidden':'true',class:'copy-chevron'}));
 const titles=document.createElement('button');titles.type='button';titles.className='copy-titles';titles.textContent='Copy titles only';const sponsors=document.createElement('button');sponsors.type='button';sponsors.className='copy-sponsors';sponsors.textContent='Copy titles + sponsors';panel.prepend(sponsors);panel.prepend(titles);panel.prepend(primary);
 const copy=async(mode)=>{
  const withLinks=mode==='links',withSponsors=mode==='sponsors';
  const trigger=withSponsors?sponsors:withLinks?primary:titles;let manual=false,failed=false;
  status.textContent='Loading all matching titles…';host.querySelector('.copy-fallback')?.remove();host.querySelector('.copy-recovery')?.remove();
  try{
   const rows=readTitles(),progress=(n,total)=>status.textContent=`Preparing ${n} of ${total} titles…`;
   const format=all=>withSponsors?titlesSponsors(all,location.href,progress):withLinks?titleLinks(all,location.href,progress):titlesOnly(all,progress);
   const prepared=rows&&typeof rows.then==='function'?Promise.resolve(rows).then(format):format(rows);
   const writing=copyPrepared(prepared,{rich:withLinks||withSponsors});primary.disabled=titles.disabled=sponsors.disabled=true;const {result,copied}=await writing;
   if(!result.count){status.textContent='No matching titles to copy.';failed=true;return}
   menu.open=false;
   if(copied){status.textContent=`Copied ${result.count} titles${withSponsors?' with sponsors':withLinks?' with links':''}.`}
   else{
    status.textContent='Clipboard unavailable. Nothing new was copied. Use Copy prepared text, or select the text below and choose Copy.';
    const box=document.createElement('textarea');box.className='copy-fallback';box.setAttribute('aria-label',withSponsors?'Titles and sponsors to copy':withLinks?'Titles and links to copy':'Titles to copy');box.value=result.plain;box.readOnly=true;host.append(box);
    const recovery=document.createElement('div');recovery.className='copy-recovery';const retry=document.createElement('button'),select=document.createElement('button');retry.type=select.type='button';retry.className='copy-prepared';retry.textContent='Copy prepared text';select.textContent='Select all text';recovery.append(retry,select);host.append(recovery);
    const selectAll=()=>{box.focus();box.select();box.setSelectionRange(0,box.value.length)};select.onclick=selectAll;
    retry.onclick=async()=>{const writing=copyPrepared(result,{rich:false});retry.disabled=true;try{const {copied}=await writing;if(copied){status.textContent=`Copied ${result.count} titles${withSponsors?' with sponsors':withLinks?' with links':''}.`;box.remove();recovery.remove();summary.focus({preventScroll:true})}else{status.textContent='Clipboard unavailable. Nothing new was copied. Select all text, then use your device’s Copy command.';selectAll()}}finally{retry.disabled=false}};
    selectAll();manual=true;
   }
  }catch{status.textContent='Could not load all matching titles. Please retry.';failed=true}
  finally{primary.disabled=titles.disabled=sponsors.disabled=false;if(host.isConnected&&!manual)(failed?trigger:summary).focus({preventScroll:true})}
 };
 primary.onclick=()=>copy('links');titles.onclick=()=>copy('titles');sponsors.onclick=()=>copy('sponsors');
}

// Opening More never reserves space in the results layout.
export function moreMenuLayout(host,menu){floatingDisclosure(menu,menu.querySelector('.export-panel'))}
