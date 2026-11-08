// UI-030: installed only by Review. Move the existing nav, never duplicate its links.
export function installToolbarPosition(panel,place){
 const root=document.documentElement,nav=document.querySelector('header nav'),header=nav.closest('header');
 const original=document.createComment('Review phone navigation original position');nav.before(original);
 const key='utahbills-review-toolbar-position';let position='bottom';try{if(localStorage.getItem(key)==='top')position='top'}catch{}
 const row=document.createElement('div');row.id='review-toolbar-position';row.setAttribute('role','group');row.setAttribute('aria-label','Toolbar position');
 row.innerHTML='<span>Toolbar:</span><span class="review-toolbar-options"><button type="button" data-position="bottom" aria-pressed="true">Bottom</button><button type="button" data-position="top" aria-pressed="false">Top</button></span>';
 panel.append(row);const status=document.createElement('p');status.className='sr-only';status.setAttribute('role','status');panel.append(status);
 function apply(){
  root.dataset.reviewToolbar=position;
  const top=root.classList.contains('phone-navigation')&&position==='top';
  if(top&&nav.parentElement!==header)header.append(nav);
  else if(!top&&nav.parentNode!==original.parentNode)original.after(nav);
  for(const button of row.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.position===position));
  requestAnimationFrame(place);
 }
 for(const button of row.querySelectorAll('button'))button.addEventListener('click',()=>{
  position=button.dataset.position;let saved=false;try{localStorage.setItem(key,position);saved=true}catch{}
  apply();status.textContent=`Toolbar at ${position}. ${saved?'Saved for this browser.':'This browser could not save it; the setting applies for this visit.'}`;
 });
 new MutationObserver(apply).observe(root,{attributes:true,attributeFilter:['class']});
 addEventListener('storage',event=>{if(event.key===key||event.key===null){position=event.newValue==='top'?'top':'bottom';apply()}});
 apply();
}
