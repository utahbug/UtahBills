import {createElement,Bookmark} from 'lucide';
// Receives actual matching counts and in-memory bookmark totals from the shared
// application. Actions delegate to its existing filters, never a second store.
export function installReviewBills(){
 globalThis.utahBillsReview={render(state,actions){
  const main=document.querySelector('main'),toolbar=main.querySelector('.list-top');if(!toolbar)return;
  const type=main.querySelector('#session');type?.closest('.session')?.classList.add('review-record-type');
  main.querySelector('#review-saved-notice')?.remove();
  const button=(text,action)=>{const b=document.createElement('button');b.type='button';b.className='text-control';b.textContent=text;b.onclick=action;return b};
  if(state.saved){
   const notice=document.createElement('div');notice.id='review-saved-notice';notice.className='review-filter-notice';notice.setAttribute('role','status');
   const icon=createElement(Bookmark);icon.setAttribute('aria-hidden','true');icon.setAttribute('fill','currentColor');
   notice.append(icon,document.createTextNode('Showing bookmarked records only — '),button('Show all',actions.showAll));toolbar.after(notice);
   for(const count of main.querySelectorAll('#count>span'))count.textContent=count.textContent.replace(' · Saved only','');
  }
  // Preserve the native no-records panel/link unless saved-only filtering needs recovery.
  if(state.count||!state.saved)return;
  const results=main.querySelector('#results');if(!results)return;
  const hint=main.querySelector('#search-guidance'),broaden=hint.querySelector('button');
  if(state.savedCount&&state.total&&broaden){const message=hint.querySelector('[role=status]');hint.replaceChildren(...[message,broaden].filter(Boolean));hint.hidden=false}else hint.hidden=true;
  const empty=document.createElement('section');empty.className='review-empty-results';empty.setAttribute('aria-label','No matching records');
  const explanation=document.createElement('p');
  if(!state.total){
   explanation.textContent=state.session==='2027'?'No introduced 2027 bills or resolutions appear in the latest saved official records.':state.session==='2027-requests'?'No public requests are available in the latest saved records.':'No records are available for the selected record type.';
   empty.append(explanation);if(state.session==='2027')empty.append(button('View 2027 public requests',actions.showRequests));
  }else if(!state.savedCount){explanation.textContent='No records have been bookmarked on this browser/device. Use the bookmark beside a record to save it.';empty.append(explanation,button('Show all records',actions.showAll))}
  else{explanation.textContent='No bookmarked records match the current search, record type or other filters.';empty.append(explanation,button('Clear search and other filters',actions.clearRestrictions));if(type?.value==='2027')empty.append(button('View 2027 public requests',actions.showRequests));}
  results.replaceChildren(empty);
 }};
 dispatchEvent(new Event('utahbills-review-ready'));
}
