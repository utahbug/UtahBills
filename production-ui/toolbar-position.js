import {createElement,ArrowUp,ArrowDown} from 'lucide';
// Review only: default derives from device characteristics; visibility derives from compact layout.
export function installToolbarPosition(panel,place){
 const root=document.documentElement,nav=document.querySelector('header nav'),header=nav.closest('header'),banner=header.querySelector('.header-inner');
 const original=document.createComment('Review navigation original position');nav.before(original);
 const key='utahbills-review-toolbar-position';
 const defaultPosition=()=>/iPhone|iPod/.test(navigator.userAgent)&&matchMedia('(pointer:coarse)').matches?'top':'bottom';
 let position=defaultPosition();try{const saved=localStorage.getItem(key);if(['top','bottom'].includes(saved))position=saved}catch{}
 const row=document.createElement('button');row.id='review-toolbar-position';row.type='button';row.innerHTML='<span>Toolbar</span><span class="review-toolbar-arrow" aria-hidden="true"></span>';panel.append(row);
 const status=document.createElement('p');status.id='review-toolbar-status';status.className='sr-only';status.setAttribute('role','status');panel.append(status);row.setAttribute('aria-describedby',status.id);
 function measure(){root.style.setProperty('--review-banner-height',banner.offsetHeight+'px')}
 function apply(){
  const compact=root.classList.contains('phone-navigation'),top=compact&&position==='top',wasScrolled=scrollY>0,main=document.querySelector('main'),before=main.getBoundingClientRect().top;
  root.dataset.reviewToolbar=position;
  if(top&&nav.parentElement!==header)header.append(nav);
  else if(!top&&nav.parentNode!==original.parentNode)original.after(nav);
  if(row.dataset.position!==position){
   row.dataset.position=position;
   row.setAttribute('aria-label',`Move toolbar to ${position==='top'?'Bottom':'Top'}`);
   row.querySelector('.review-toolbar-arrow').replaceChildren(createElement(position==='top'?ArrowDown:ArrowUp));
   status.textContent=`Toolbar at ${position}.`;
  }
  measure();
  if(wasScrolled){const delta=main.getBoundingClientRect().top-before;if(Math.abs(delta)>1)scrollBy(0,delta)}
  requestAnimationFrame(place);
 }
 row.addEventListener('click',()=>{position=position==='top'?'bottom':'top';let saved=false;try{localStorage.setItem(key,position);saved=true}catch{}apply();status.textContent+=saved?' Saved for this browser.':' This browser could not save it; the setting applies for this visit.'});
 new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:['class']});
 new ResizeObserver(measure).observe(banner);
 addEventListener('storage',event=>{if(event.key===key||event.key===null){position=['top','bottom'].includes(event.newValue)?event.newValue:defaultPosition();apply()}});
 apply();
}
