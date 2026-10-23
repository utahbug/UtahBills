import {createElement,ExternalLink} from 'lucide';
// Apply to asynchronous routes as well as static and subsequently filtered links.
export function watchExternalLinks(){
 const seen=new WeakSet();
 function decorate(root){for(const a of root.querySelectorAll('a[href]')){
  if(seen.has(a))continue;const u=new URL(a.href,location.href);if(!/^https?:$/.test(u.protocol)||u.origin===location.origin)continue;seen.add(a);
  a.target='_blank';a.rel='noopener';a.setAttribute('aria-description','External website; opens in a new tab');
  if(a.closest('footer'))continue; // The approved shared footer uses plain text links.
  const walker=document.createTreeWalker(a,NodeFilter.SHOW_TEXT);let n,last;while(n=walker.nextNode()){if(!n.parentElement.closest('.sr-only')&&n.textContent.trim())last=n}
  const tail=document.createElement('span');tail.className='external-tail';
  if(last){last.textContent=last.textContent.replace(/\s*↗\s*$/,'');const m=last.textContent.match(/[^\s\-/]+\s*$/);if(m){tail.append(document.createTextNode(m[0]));last.textContent=last.textContent.slice(0,m.index);last.after(tail)}else a.append(tail)}else a.append(tail);
  const icon=createElement(ExternalLink);icon.setAttribute('aria-hidden','true');icon.setAttribute('class','external-icon');icon.setAttribute('focusable','false');tail.append(document.createTextNode('\u00a0'),icon);
 }}
 decorate(document);new MutationObserver(ms=>{if(ms.some(m=>m.addedNodes.length))decorate(document)}).observe(document.body,{childList:true,subtree:true});
}
