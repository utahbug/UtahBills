import {createElement,Copy,ChevronDown} from 'lucide';
import {floatingDisclosure} from './floating-disclosure.js';
import {titleLinks,titlesOnly,titlesSponsors,copyPrepared} from './sharing.js';

export function sharingActions(host,menu,readTitles){
 const primary=host.querySelector('.copy-results'),summary=menu.querySelector('summary'),panel=menu.querySelector('.export-panel'),status=host.querySelector('.copy-status');
 primary.setAttribute('aria-label','Copy');primary.title='Copy all matching titles with links';primary.textContent='Copy';
 menu.classList.add('unified-copy');summary.setAttribute('aria-label','Copy and export results');summary.title='Copy and export results';summary.replaceChildren(createElement(Copy,{'aria-hidden':'true'}),createElement(ChevronDown,{'aria-hidden':'true',class:'copy-chevron'}));
 const titles=document.createElement('button');titles.type='button';titles.className='copy-titles';titles.textContent='Copy titles only';const sponsors=document.createElement('button');sponsors.type='button';sponsors.className='copy-sponsors';sponsors.textContent='Copy titles + sponsors';panel.prepend(sponsors);panel.prepend(titles);panel.prepend(primary);
 const copy=async(mode)=>{
  const withLinks=mode==='links',withSponsors=mode==='sponsors';
  const trigger=withSponsors?sponsors:withLinks?primary:titles;let manual=false,failed=false;
  primary.disabled=titles.disabled=sponsors.disabled=true;status.textContent='Loading all matching titles…';host.querySelector('.copy-fallback')?.remove();
  try{
   const rows=readTitles(),progress=(n,total)=>status.textContent=`Preparing ${n} of ${total} titles…`;
   const prepared=Promise.resolve(rows).then(all=>withSponsors?titlesSponsors(all,location.href,progress):withLinks?titleLinks(all,location.href,progress):titlesOnly(all,progress));
   const {result,copied}=await copyPrepared(prepared,{rich:withLinks||withSponsors});
   if(!result.count){status.textContent='No matching titles to copy.';failed=true;return}
   menu.open=false;
   if(copied){status.textContent=`Copied ${result.count} titles${withSponsors?' with sponsors':withLinks?' with links':''}.`}
   else{
    status.textContent='Clipboard unavailable. Select and copy the complete text below.';
    const box=document.createElement('textarea');box.className='copy-fallback';box.setAttribute('aria-label',withSponsors?'Titles and sponsors to copy':withLinks?'Titles and links to copy':'Titles to copy');box.value=result.plain;host.append(box);box.focus();box.select();manual=true;
   }
  }catch{status.textContent='Could not load all matching titles. Please retry.';failed=true}
  finally{primary.disabled=titles.disabled=sponsors.disabled=false;if(host.isConnected&&!manual)(failed?trigger:summary).focus({preventScroll:true})}
 };
 primary.onclick=()=>copy('links');titles.onclick=()=>copy('titles');sponsors.onclick=()=>copy('sponsors');
}

// Opening More never reserves space in the results layout.
export function moreMenuLayout(host,menu){floatingDisclosure(menu,menu.querySelector('.export-panel'))}
