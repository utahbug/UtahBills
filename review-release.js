import {createElement,SlidersHorizontal} from 'lucide';
// Loaded only by the complete artifact's Review index. Main's app is unchanged.
const host=document.querySelector('.header-inner');
const trigger=document.createElement('button');trigger.id='review-settings-trigger';trigger.type='button';trigger.setAttribute('aria-label','Settings');trigger.setAttribute('aria-controls','review-settings');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('popovertarget','review-settings');trigger.append(createElement(SlidersHorizontal));host.append(trigger);
const panel=document.createElement('section');panel.id='review-settings';panel.setAttribute('popover','auto');panel.setAttribute('aria-label','Settings');panel.innerHTML='<div class="review-appearance-row"><label for="review-appearance">Appearance</label><select id="review-appearance"><option value="light">Light</option><option value="dark">Dark</option><option value="device">System</option></select></div><a href="#contact">Contact</a><a href="#about">About UtahBug</a><a href="#faq">Frequently asked questions</a><p class="sr-only" role="status"></p>';document.body.append(panel);
const select=panel.querySelector('select'),status=panel.querySelector('[role=status]');
function sync(){select.value=window.utahAppearance.get()}
function place(){if(!panel.matches(':popover-open'))return;const r=trigger.getBoundingClientRect(),v=window.visualViewport,left=v?.offsetLeft||0,top=v?.offsetTop||0,width=v?.width||innerWidth,height=v?.height||innerHeight,scale=parseFloat(getComputedStyle(document.documentElement).zoom)||r.width/trigger.offsetWidth||1;panel.style.maxWidth=(width-24)/scale+'px';panel.style.maxHeight=Math.max(44,(height-24)/scale)+'px';const box=panel.getBoundingClientRect();panel.style.left=Math.max(left+12,Math.min(r.right-box.width,left+width-box.width-12))/scale+'px';panel.style.top=Math.max(top+12,Math.min(r.bottom+6,top+height-box.height-12))/scale+'px'}
panel.addEventListener('toggle',()=>{const open=panel.matches(':popover-open');trigger.setAttribute('aria-expanded',String(open));if(open){sync();place();select.focus()}});
select.addEventListener('change',()=>{window.utahAppearance.set(select.value);let saved=false;try{saved=localStorage.getItem('utahbills-appearance')===select.value}catch{}status.textContent=saved?'Appearance saved for this browser.':'Appearance applies for this visit; this browser could not save it.'});
panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();panel.hidePopover();trigger.focus()}});
panel.querySelectorAll('a').forEach(a=>{a.tabIndex=0;a.addEventListener('click',()=>panel.hidePopover())});
addEventListener('hashchange',()=>{if(panel.matches(':popover-open'))panel.hidePopover()});addEventListener('resize',place);window.visualViewport?.addEventListener('resize',place);window.visualViewport?.addEventListener('scroll',place);
new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:['data-appearance']});sync();

// Change only the phone label, retaining the original anchor, icon and router handlers.
const nav=document.querySelector('header nav');
function recentLabel(){const label=nav.querySelector('.phone-activity-label>span:last-child');if(!label)return false;label.textContent='Recent';return true}
if(!recentLabel()){const observer=new MutationObserver(()=>{if(recentLabel())observer.disconnect()});observer.observe(nav,{childList:true,subtree:true})}

// Hide duplicates only after replacement setup succeeds; Main never loads this module.
document.documentElement.classList.add('review-settings-ready');
