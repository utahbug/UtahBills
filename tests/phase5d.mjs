import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {highlightedProvisions,keyActions,statusSummary} from '../bill-presentation.js';
import {sessionFixture,interceptSession} from './fixtures/session-transition.mjs';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const bills=JSON.parse(await readFile('data/bills.json','utf8')),saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const hb=bills.find(b=>b.billNumber==='HB0154');
assert.deepEqual(keyActions(hb.actionHistoryList).map(a=>a.actionCode),['HCAFAV','HPASS3','SREAD1','SECS','HFILED']);
assert.match(statusSummary({status:'Introduced'},[{actionCode:'HREAD1',description:'House first reading',owner:'House Rules Committee',actionDate:'2027-01-19'}]),/Last recorded location: House Rules Committee/);
assert.doesNotMatch(statusSummary({status:'Introduced'},[{actionCode:'HREAD1',owner:'Unclear metadata'}]),/Last recorded location:/);
assert.match(statusSummary({status:'Vetoed'},[{actionCode:'HPASS3'},{actionCode:'GVETO',description:'Governor Vetoed'}]),/Governor Vetoed/);
assert.match(statusSummary({},[{actionCode:'GSIGN'},{description:'Governor Line Item Veto'}]),/Governor Line Item Veto/);
assert.match(highlightedProvisions('<ltbullet><script>alert(1)</script>'),/&lt;script&gt;/);
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('test-results/phase5d',{recursive:true});
try {
 for(const b of bills){
  await page.goto(base+'?phase5d='+b.billNumber+'#bill/'+b.billNumber);await page.locator('#law-text').waitFor();await page.locator('.votes-section small').waitFor();
  assert.equal(await page.locator('.pinned-summary').textContent(),b.summary);assert.equal(await page.locator('.pinned-extra').textContent(),b.extra);
  assert.equal(await page.locator('#law-version').inputValue(),b.summaryVersion);
  assert.equal(await page.locator('[data-law="diff"]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.tabs').evaluate(e=>e.nextElementSibling.id),'law-text');
  assert.equal(await page.locator('.highlighted-provisions').evaluate(e=>e.textContent.replace(/Highlighted provisions|Official metadata wording.|\s/g,'')),b.highlightedProvisions.replace(/^This bill:/,'').replace(/<[^>]+>|\s/g,''));
  assert.equal(await page.locator('.history-target>summary').textContent(),'View all '+b.actionHistoryList.length+' actions');
  assert.equal(await page.locator('.history-target').getAttribute('open'),null);
  assert.equal(await page.locator('.full-history .timeline>li').count(),b.actionHistoryList.length);
  assert.equal(await page.locator('.committee-details a').count(),b.agendaList.reduce((n,a)=>n+!!a.agendaURL+!!a.minutesURL,0));
  assert.match(await page.locator('.bill-current-status .tag').textContent(),b.status==='Signed'?/Signed/:/Did not pass/);
  assert.equal(await page.getByRole('heading',{name:'Keep the distinctions clear'}).count(),0);
  if(b.billNumber==='HB0011')assert.equal(await page.locator('.highlighted-provisions>ul>li>ul>li').count(),3);
  if(b.billNumber==='HB0154'){
   const primary=page.locator('.votes-section>.vote-record');assert.equal(await primary.count(),2);
   assert.match(await primary.nth(0).locator('h3').textContent(),/House committee recommendation.*February 5, 2026/);
   assert.match(await primary.nth(0).locator('.vote-tally').textContent(),/Yes: 12 · No: 0 · Absent: 2/);
   assert.match(await primary.nth(1).locator('h3').textContent(),/House — Third reading.*February 17, 2026/);
   assert.match(await primary.nth(1).locator('.vote-tally').textContent(),/Yes: 48 · No: 22 · Absent or not voting: 5/);
   assert.doesNotMatch(await primary.nth(1).innerText(),/HNAE|12-0-2/);
   await primary.nth(1).locator('.vote-source>summary').click();assert.match(await primary.nth(1).innerText(),/HNAE Passed 12-0-2/);
   await page.locator('.open-reader').first().click();await page.locator('#reader-version').selectOption('1');
   const affected=page.locator('#reader-body .bill-label').filter({hasText:'Utah Code Sections Affected:'});const text=await affected.innerText();assert.match(text,/Affected:\s+AMENDS:/);assert.match(text,/63I-2-273\s+Effective 05\/06\/26\s+Superseded 07\/01\/26/);assert.match(text,/63I-2-273\s+Effective 07\/01\/26/);
   assert.equal(await page.locator('#formatted-reader').getAttribute('open'),'');
  }
  if(b.billNumber==='HB0155')assert.match(await page.locator('.votes-section').innerText(),/No verified final-passage/);
  for(const view of ['before','diff','after']){await page.locator('[data-law="'+view+'"]').click();assert.equal(await page.locator('[data-law="'+view+'"]').getAttribute('aria-pressed'),'true');assert.ok((await page.locator('#law-text').textContent()).length)}
 }
 for(const width of [320,375,390,430,768,1024,1280]){
  await page.setViewportSize({width,height:900});await page.goto(base+'?width='+width+'#bill/HB0154');await page.locator('.votes-section>.vote-record').first().waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,width+' normal overflow');
  if([390,1280].includes(width)){await page.screenshot({path:'test-results/phase5d/detail-'+width+'.png',fullPage:true});await page.locator('.votes-section').scrollIntoViewIfNeeded();await page.screenshot({path:'test-results/phase5d/votes-'+width+'.png'})}
  await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>scrollY===0&&!document.querySelector("header.navigation-compact"));await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],String(width));
 }
 for(const mode of ['text','zoom']){
  await page.setViewportSize({width:390,height:900});await page.goto(base+'?mode='+mode+'#bill/SB0069');await page.locator('#law-text').waitFor();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});else await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,mode+' overflow');
  const info=page.getByRole('button',{name:'Info about the statutory comparison',exact:true});await info.focus();await page.keyboard.press('Enter');await page.locator('#comparison-info:popover-open').waitFor();await page.keyboard.press('Escape');assert.equal(await info.evaluate(e=>e===document.activeElement),true);
 }
 const future=sessionFixture(saved,1);await interceptSession(page,future);await page.goto(base+'?future#bill/2027/HB0001');await page.locator('.basic-detail').waitFor();assert.match(await page.locator('.bill-current-status').innerText(),/Introduced/);assert.equal(await page.locator('.historical-view').count(),0);assert.match(await page.locator('main').innerText(),/Original drafting request/);
 assert.deepEqual(errors,[]);console.log('Phase 5D: exact explanations/provisions, separate votes, reader dates, action history, future fixture, 7 widths, doubled text/CSS zoom, keyboard and axe passed.');
}finally{await browser.close()}
