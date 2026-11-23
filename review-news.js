import {newsItems,outlets} from './review-news-model.js';
export function installNews(){
 const nav=document.querySelector('footer nav');if(!nav||document.querySelector('#review-news'))return;
 const style=document.createElement('link');style.rel='stylesheet';style.href='./review-news.css';document.head.append(style);
 const trigger=document.createElement('button');trigger.type='button';trigger.className='review-news-trigger';trigger.textContent='Legislative News';trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-controls','review-news');nav.append(trigger);
 const dialog=document.createElement('dialog');dialog.id='review-news';dialog.setAttribute('aria-labelledby','review-news-title');
 dialog.innerHTML='<div class="news-heading"><h2 id="review-news-title" tabindex="-1">Legislative News</h2><button type="button" class="news-close">Close</button></div><p>Reporting from Utah news outlets. Official legislative records remain the authority.</p><p class="news-coverage"></p><p class="news-status" role="status"></p><ul class="news-list"></ul><button type="button" class="news-retry" hidden>Retry news</button>';
 document.body.append(dialog);const list=dialog.querySelector('ul'),status=dialog.querySelector('.news-status'),retry=dialog.querySelector('.news-retry');let loaded=false,pending=false;
 async function load(){if(pending||loaded)return;pending=true;retry.hidden=true;status.textContent='Loading news…';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),8000);
  try{const response=await fetch('./review-news.json',{signal:controller.signal,credentials:'omit'});if(!response.ok)throw Error('Unavailable');const snapshot=await response.json(),items=newsItems(snapshot);
   const rows=items.map(item=>{const li=document.createElement('li'),meta=document.createElement('p'),time=document.createElement('time'),a=document.createElement('a');time.dateTime=item.publishedDate;time.textContent=new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'}).format(new Date(item.publishedDate+'T12:00:00Z'));meta.append(time,document.createTextNode(' · '+outlets[item.outlet].name+' · '+item.author));a.href=item.url;a.rel='noopener noreferrer';a.textContent=item.headline;li.append(meta,a);return li});
   list.replaceChildren(...rows);dialog.querySelector('.news-coverage').textContent='Review sample · selected November 18–22, 2026 reporting · checked '+snapshot.reviewedOn+'. Daily updates are not enabled.';status.textContent=items.length?items.length+' articles. No verified bill associations in this sample.':'No articles in this sample.';loaded=true;
  }catch{status.textContent='News is unavailable. Legislative records are unaffected.';retry.hidden=false}finally{clearTimeout(timer);pending=false}
 }
 trigger.addEventListener('click',()=>{dialog.showModal();dialog.querySelector('h2').focus();load()});dialog.querySelector('.news-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>trigger.focus());retry.addEventListener('click',load);
 dialog.addEventListener('keydown',event=>{if(event.key!=='Tab')return;const stops=[...dialog.querySelectorAll('button:not([hidden]),a[href]')].filter(e=>e.getClientRects().length),first=stops[0],last=stops.at(-1);if(event.shiftKey&&(document.activeElement===first||!stops.includes(document.activeElement))){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}});
 addEventListener('hashchange',()=>{if(dialog.open)dialog.close()});
}
