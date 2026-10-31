import {createElement, FileText, Clock, Calendar, Users} from 'lucide';
// Owner-approved phone navigation: retain the actual header anchors and all existing router handlers.
const root=document.documentElement,nav=document.querySelector('header nav');
const phone=matchMedia('(pointer:coarse) and (max-width:700px), (pointer:coarse) and (orientation:landscape) and (max-width:1000px) and (max-height:500px)');
for(const [i,icon] of [FileText,Clock,Calendar,Users].entries()){
 const a=nav.children[i],label=document.createElement('span');label.textContent=a.textContent;
 if(i===1){label.className='phone-activity-label';label.innerHTML='<span>Recent Activity</span><span>Activity</span>'}
 const svg=createElement(icon);svg.setAttribute('aria-hidden','true');svg.classList.add('phone-nav-icon');a.replaceChildren(svg,label);
}
function update(){
 root.classList.toggle('phone-navigation',phone.matches);
 root.classList.toggle('phone-navigation-wrap',phone.matches&&innerWidth<parseFloat(getComputedStyle(root).fontSize)*18);
 const editing=document.activeElement?.matches('input,textarea,[contenteditable="true"]');
 const keyboard=phone.matches&&editing&&window.visualViewport&&visualViewport.height<innerHeight*.75;
 root.classList.toggle('phone-keyboard',Boolean(keyboard));
 root.style.setProperty('--phone-nav-height',phone.matches?nav.getBoundingClientRect().height+'px':'0px');
}
phone.addEventListener('change',update);addEventListener('resize',update);
visualViewport?.addEventListener('resize',update);
document.addEventListener('focusin',update);document.addEventListener('focusout',()=>requestAnimationFrame(update));
let queued=false;new ResizeObserver(()=>{if(!queued){queued=true;requestAnimationFrame(()=>{queued=false;update()})}}).observe(nav);update();

