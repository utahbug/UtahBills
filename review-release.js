import {installParty} from './review-party.js';
installParty();
import {installReviewContent} from './review-content.js';
import {installToolbarPosition} from './review-toolbar-position.js';
import {createElement,SlidersHorizontal,Info,CircleHelp} from 'lucide';
// Loaded only by the complete artifact's Review index. Main's app is unchanged.
const host=document.querySelector('.header-inner');
const trigger=document.createElement('button');trigger.id='review-settings-trigger';trigger.type='button';trigger.setAttribute('aria-label','Settings');trigger.setAttribute('aria-controls','review-settings');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('popovertarget','review-settings');trigger.append(createElement(SlidersHorizontal));host.append(trigger);
const panel=document.createElement('section');panel.id='review-settings';panel.setAttribute('popover','auto');panel.setAttribute('aria-label','Settings');panel.innerHTML='<button type="button" class="review-menu-item" id="review-theme-toggle" aria-pressed="false" aria-describedby="review-theme-status"><span class="review-menu-icon review-theme-icon" aria-hidden="true"></span>Dark/Light</button><a class="review-menu-item" href="#contact">Contact</a><a class="review-menu-item" href="#about"><span class="review-menu-icon review-info-icon" aria-hidden="true"></span>About</a><a class="review-menu-item" href="#faq"><span class="review-menu-icon review-faq-icon" aria-hidden="true"></span>FAQ</a><p id="review-theme-status" class="sr-only" role="status"></p>';document.body.append(panel);
const status=panel.querySelector('[role=status]');
function sync(){const dark=document.documentElement.dataset.theme==='dark';themeToggle.setAttribute('aria-pressed',String(dark));status.textContent=dark?'Current mode: Dark.':'Current mode: Light.'}
const themeToggle=panel.querySelector('#review-theme-toggle');
panel.querySelector('.review-theme-icon').append(document.querySelector('#appearance-trigger svg').cloneNode(true));
panel.querySelector('.review-info-icon').append(createElement(Info));
panel.querySelector('.review-faq-icon').append(createElement(CircleHelp));
function place(){if(!panel.matches(':popover-open'))return;const r=trigger.getBoundingClientRect(),v=window.visualViewport,left=v?.offsetLeft||0,top=v?.offsetTop||0,width=v?.width||innerWidth,height=v?.height||innerHeight,scale=parseFloat(getComputedStyle(document.documentElement).zoom)||r.width/trigger.offsetWidth||1;panel.style.maxWidth=(width-24)/scale+'px';panel.style.maxHeight=Math.max(44,(height-24)/scale)+'px';const box=panel.getBoundingClientRect();panel.style.left=Math.max(left+12,Math.min(r.right-box.width,left+width-box.width-12))/scale+'px';panel.style.top=Math.max(top+12,Math.min(r.bottom+6,top+height-box.height-12))/scale+'px'}
panel.addEventListener('toggle',()=>{const open=panel.matches(':popover-open');trigger.setAttribute('aria-expanded',String(open));if(open){sync();place();themeToggle.focus()}});
themeToggle.addEventListener('click',()=>{const value=document.documentElement.dataset.theme==='dark'?'light':'dark';window.utahAppearance.set(value);sync();let saved=false;try{saved=localStorage.getItem('utahbills-appearance')===value}catch{}status.textContent+=' '+(saved?'Saved for this browser.':'This browser could not save it; the setting applies for this visit.');place()});
panel.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();panel.hidePopover();trigger.focus()}});
panel.querySelectorAll('a').forEach(a=>{a.tabIndex=0;a.addEventListener('click',()=>panel.hidePopover())});
addEventListener('hashchange',()=>{if(panel.matches(':popover-open'))panel.hidePopover()});addEventListener('resize',place);window.visualViewport?.addEventListener('resize',place);window.visualViewport?.addEventListener('scroll',place);
new MutationObserver(()=>{if(themeToggle.getAttribute('aria-pressed')!==String(document.documentElement.dataset.theme==='dark'))sync()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});sync();

// Change only the phone label, retaining the original anchor, icon and router handlers.
const nav=document.querySelector('header nav');
function recentLabel(){const label=nav.querySelector('.phone-activity-label>span:last-child');if(!label)return false;label.textContent='Recent';return true}
if(!recentLabel()){const observer=new MutationObserver(()=>{if(recentLabel())observer.disconnect()});observer.observe(nav,{childList:true,subtree:true})}

// Hide duplicates only after replacement setup succeeds; Main never loads this module.
document.documentElement.classList.add('review-settings-ready');

// Reuse the original rendered envelope node and its existing circular icon styling.
const headerContact=document.querySelector('header .header-contact');
const contactIcon=document.createElement('span');contactIcon.className='header-contact review-contact-icon review-menu-icon';contactIcon.setAttribute('aria-hidden','true');panel.querySelector('a[href="#contact"]').prepend(contactIcon);
function moveContactIcon(){const svg=headerContact.querySelector('svg');if(!svg)return false;contactIcon.append(svg);return true}
if(!moveContactIcon()){const observer=new MutationObserver(()=>{if(moveContactIcon())observer.disconnect()});observer.observe(headerContact,{childList:true,subtree:true})}

installToolbarPosition(panel,place);

installReviewContent();
