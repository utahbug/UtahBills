// Isolated Review presentation; shared routes, data and metadata remain unchanged.
export function installReviewContent(){
 const main=document.querySelector('main'),nav=document.querySelector('header nav');
 function update(){
  const heading=main.querySelector('.bills-heading h1');
  if(heading&&main.querySelector('#session')&&heading.textContent!=='2027 Utah Bill Tracking')heading.textContent='2027 Utah Bill Tracking';
  for(const label of nav.querySelectorAll('.phone-activity-label>span'))if(label.textContent!=='Recent')label.textContent='Recent';
  const period=main.querySelector('#activity-period');if(period&&!period.closest('label').classList.contains('review-selected-range')){period.closest('label').classList.add('review-selected-range');const mark=document.createElement('span');mark.textContent='✓';mark.className='review-range-check';mark.setAttribute('aria-hidden','true');period.closest('label').prepend(mark)}
  const month=main.querySelector('#calendar-month'),toggle=main.querySelector('#calendar-toggle');
  if(month&&toggle&&!main.querySelector('.review-month-controls')){
   const row=document.createElement('div');row.className='review-month-controls';const label=month.closest('label');label.before(row);row.append(label,toggle);
  }
  const event=main.querySelector('#calendar-type');
  if(event&&!main.querySelector('#review-key-dates')){
   const group=document.createElement('div');group.className='review-event-controls';const label=event.closest('label');label.before(group);group.append(label);
   const button=document.createElement('button');button.type='button';button.id='review-key-dates';button.className='text-control';button.textContent='Key Dates';button.setAttribute('aria-haspopup','dialog');group.append(button);
   const dialog=document.createElement('dialog');dialog.id='review-key-dates-dialog';dialog.setAttribute('aria-labelledby','review-key-dates-title');dialog.innerHTML=`<h2 id="review-key-dates-title">Key Dates · 2027 Utah Legislature</h2><ul>
    <li><time datetime="2027-01-01">January 1</time> — Terms begin for legislators elected in November 2026.</li>
    <li><time datetime="2027-01-19">January 19</time> — General Session begins.</li>
    <li><time datetime="2027-01-29">January 29, noon</time> — Deadline to request bills without floor approval.</li>
    <li><time datetime="2027-03-05">March 5</time> — General Session ends.</li>
    <li><time datetime="2027-03-25">March 25</time> — Governor’s signing/veto deadline for bills after adjournment.</li></ul>
    <p>Checked November 8, 2026. The Legislature cautions that schedule dates may be estimates; the Constitution, Code and legislative rules control.</p>
    <p><a href="https://le.utah.gov/sessionSchedule/sessdates.jsp">Official session dates</a> · <a href="https://le.utah.gov/xcode/ArticleVI/UC_AVI_S3_1800010118000101.pdf">House terms</a> · <a href="https://le.utah.gov/xcode/ArticleVI/UC_AVI_S4_1800010118000101.pdf">Senate terms</a></p><button type="button" autofocus>Close</button>`;
   main.append(dialog);button.onclick=()=>dialog.showModal();dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>button.isConnected&&button.focus({preventScroll:true}));
  }
 }
 new MutationObserver(update).observe(main,{childList:true,subtree:true});new MutationObserver(update).observe(nav,{childList:true,subtree:true});update();
 function attribution(){const dialog=document.querySelector('.ownership-dialog');if(!dialog)return;const title=dialog.querySelector('h2');if(title.textContent!=='Created by Kenneth Roberts')title.textContent='Created by Kenneth Roberts';dialog.querySelector('p')?.remove()}
 new MutationObserver(attribution).observe(document.body,{childList:true});attribution();
 const header=document.querySelector('.header-inner'),tag=header.querySelector('.independent'),brand=header.querySelector('.brand'),canvas=document.createElement('canvas'),context=canvas.getContext('2d');
 function measure(){
  const hs=getComputedStyle(header),ts=getComputedStyle(tag);context.font=ts.font;const tagWidth=context.measureText(tag.textContent).width;
  const links=[...nav.querySelectorAll('a')],ns=getComputedStyle(nav);let navWidth=(parseFloat(ns.columnGap)||0)*3;
  for(const a of links){const s=getComputedStyle(a);context.font=s.font;navWidth+=Math.max(72,context.measureText(a.textContent).width+23+parseFloat(s.paddingLeft)+parseFloat(s.paddingRight))}
  const available=header.clientWidth-parseFloat(hs.paddingLeft)-parseFloat(hs.paddingRight);
  header.classList.toggle('review-hide-tagline',document.documentElement.classList.contains('phone-navigation')||brand.getBoundingClientRect().width+navWidth+tagWidth+3*(parseFloat(hs.columnGap)||16)>available);
 }
 new ResizeObserver(measure).observe(header);addEventListener('resize',measure);document.fonts.ready.then(measure);measure();
}
