import {openCalendar} from './fixtures/calendar-navigation.mjs';
import {openArchive} from './fixtures/archive-navigation.mjs';
import {chromium} from 'playwright';import {readFile} from 'node:fs/promises';import assert from 'node:assert/strict';import {monthDays} from '../calendar.js';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});const page=await browser.newPage();
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>localStorage.setItem('utahbills-results-per-page','25'));
try{
 assert.deepEqual(monthDays('2026-10'),{offset:4,count:31});assert.deepEqual(monthDays('2027-02'),{offset:1,count:28});assert.deepEqual(monthDays('2028-02'),{offset:2,count:29});
 await page.goto(base+'#calendar');await openCalendar(page);await openCalendar(page);await page.locator('#calendar-month').selectOption('2026-10');
 assert.equal(await page.locator('.calendar-day').count(),31);await page.locator('[data-date="2026-10-21"]').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#day-events').innerText(),/Transportation Interim/);assert.match(await page.locator('#day-events').innerText(),/8:30 AM MDT/);
 await page.locator('#all-month').click();assert.equal(await page.locator('.calendar-day').count(),31);assert.equal(await page.locator('[data-date][aria-pressed=true]').count(),0);const dates=await page.locator('.calendar-event time').evaluateAll(es=>es.map(e=>e.dateTime));assert.deepEqual(dates,[...dates].sort());
 const snapshot=JSON.parse(await readFile('data/calendar.json','utf8'));
 const ids=()=>page.locator('.calendar-event').evaluateAll(es=>es.map(e=>e.dataset.event));
 const expected=(month,start='',type='')=>snapshot.events.filter(e=>e.date.startsWith(month)&&e.date>=start&&(!type||e.category===type)).map(e=>e.id);
 assert.deepEqual(await ids(),expected('2026-10'));
 await page.locator('[data-date="2026-10-21"]').click();assert.deepEqual(await ids(),expected('2026-10','2026-10-21'));
 assert.equal(await page.locator('[data-date="2026-10-21"]').getAttribute('aria-pressed'),'true');
 await page.locator('[data-date="2026-10-23"]').click();assert.deepEqual(await ids(),expected('2026-10','2026-10-23'));
 await page.locator('[data-date="2026-10-31"]').click();assert.deepEqual(await ids(),expected('2026-10','2026-10-31'));
 await page.locator('#all-month').click();assert.deepEqual(await ids(),expected('2026-10'));
 await page.locator('#calendar-month').selectOption('2027-04');assert.deepEqual(await ids(),expected('2027-04'));
 await openCalendar(page);await page.locator('#calendar-month').selectOption('2026-10');assert.deepEqual(await ids(),expected('2026-10'));
 assert.equal(await page.locator('#month-view,#list-view').count(),0);
 await page.locator('#calendar-type').selectOption('floor');assert.match(await page.locator('#calendar-content').innerText(),/Extraordinary Session/);await page.locator('#calendar-type').selectOption('');
 await page.locator('#calendar-month').selectOption('2026-12');assert.match(await page.locator('#calendar-content').innerText(),/Executive Appropriations/);
 await page.locator('#calendar-month').selectOption('2027-01');assert.match(await page.locator('#calendar-content').innerText(),/First day of the annual General Session/);
 for(const width of [320,375,390,430,1280])for(const mode of ['all','selected'])for(const enlarged of [false,true,'zoom']){
  await page.setViewportSize({width,height:850});await page.goto(base+'?calendar-test='+width+mode+enlarged+'#calendar');await openCalendar(page);await openCalendar(page);await page.locator('#calendar-month').selectOption('2026-10');if(mode==='selected')await page.locator('[data-date="2026-10-21"]').click();await page.locator('.calendar-info summary').click();
  if(enlarged==='zoom')await page.evaluate(()=>document.documentElement.style.zoom='2');
  if(enlarged===true)await page.evaluate(()=>{const els=[...document.querySelectorAll('body *')];const sizes=els.map(e=>parseFloat(getComputedStyle(e).fontSize));els.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Calendar overflow ${width} ${mode} enlarged=${enlarged}`);
  assert.equal(await page.locator('.calendar-day').evaluateAll(es=>es.some(e=>e.scrollWidth>e.clientWidth+1)),false,`Date cell overflow ${width} ${enlarged}`);
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 }
 // Calendar occupancy changes legitimately. Exercise empty and newly occupied dates with isolated fixtures.
 const calendarFixture=JSON.parse(await readFile('dist/data/calendar-ui.json','utf8'));
 calendarFixture.events=calendarFixture.events.filter(e=>!e.date.startsWith('2026-10')&&!e.date.startsWith('2027-04'));
 const event={...snapshot.events.find(e=>e.date.startsWith('2026-10')),id:'audit-calendar-fixture',date:'2026-10-25',name:'Synthetic calendar regression event'};
 calendarFixture.events.push(event);
 await page.route('**/data/calendar-ui.json',r=>r.fulfill({json:calendarFixture}));
 await page.goto(base+'?calendar-empty-fixture#calendar');await openCalendar(page);await page.locator('#calendar-month').selectOption('2026-10');
 await page.locator('[data-date="2026-10-23"]').click();assert.match(await page.locator('.calendar-empty').innerText(),/Next scheduled/);
 await page.locator('[data-date="2026-10-31"]').click();assert.equal(await page.locator('.calendar-event').count(),0);assert.match(await page.locator('.calendar-empty').innerText(),/No more matching events/);
 await page.locator('#calendar-month').selectOption('2027-04');assert.equal(await page.locator('.calendar-event').count(),0);assert.match(await page.locator('.calendar-empty').innerText(),/No events are listed for this month/);
 calendarFixture.events.push({...event,id:'audit-new-calendar-event',date:'2026-10-23'});calendarFixture.events.sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start)||a.name.localeCompare(b.name));
 await page.goto(base+'?calendar-added-event#calendar');await openCalendar(page);await page.locator('#calendar-month').selectOption('2026-10');await page.locator('[data-date="2026-10-23"]').click();
 assert.equal(await page.locator('.calendar-event').count(),2);assert.equal(await page.locator('.calendar-empty').count(),0);await page.unroute('**/data/calendar-ui.json');
 // Synthetic collection stays in this intercepted test response, never in production data.
 const originals=JSON.parse(await readFile('data/bills.json','utf8'));const generated=Array.from({length:1200},(_,i)=>({...originals[i%4],versions:[{...originals[i%4].versions[0],formatted:[],sections:[{...originals[i%4].versions[0].sections[0],before:'Test text',after:'Test text'}]}],billVersionList:[],agendaList:[],actionHistoryList:originals[i%4].actionHistoryList.slice(-1),billNumber:'HB'+String(i+1).padStart(4,'0'),billNumberShort:'H.B. '+(i+1),shortTitle:'Generated test bill '+String(i+1).padStart(4,'0')}));
 await page.route('**/data/examples-ui.json',r=>r.fulfill({json:generated}));const catalogFixture=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:{...catalogFixture,measures:generated.map(b=>({...b,kind:'Bill',sessionID:'2026GS'}))}}));await page.setViewportSize({width:390,height:800});await page.goto(base+'?large-test#bills');await openArchive(page);await page.locator('.bill-row').first().waitFor();assert.equal(await page.locator('.bill-row').count(),25);assert.equal(await page.locator('.bill-row h2 a').count(),25);
 await page.locator('.advanced-search>summary').click();await page.locator('#sort').selectOption('number');await page.locator('#next-page').click();assert.match(await page.locator('.bill-row').first().innerText(),/H.B. 26/);
 await page.locator('#search').fill('Generated test');await page.locator('#topic').selectOption(originals[0].topic);await page.locator('#next-page').click();
 const row=page.locator('.bill-row').nth(4);await row.scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>scrollY);const href=await row.locator('h2 a').getAttribute('href');
 // Click padding, not the link text: stretched link must activate.
 await row.click({position:{x:5,y:5}});await page.locator('.back').waitFor();assert.ok(page.url().endsWith(href));await page.locator('.back').click();await page.locator('#search').waitFor();assert.equal(await page.locator('#search').inputValue(),'Generated test');assert.equal(await page.locator('#topic').inputValue(),originals[0].topic);assert.equal(await page.locator('#sort').inputValue(),'number');assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scroll)<5);
 await page.locator('.brand').click();assert.equal(await page.evaluate(()=>scrollY),0);await page.locator('.bill-row h2 a').first().focus();await page.keyboard.press('Enter');await page.locator('.back').waitFor();await page.goBack();await page.locator('#search').waitFor();assert.equal(await page.locator('#search').inputValue(),'Generated test');
 await page.locator('.bill-row').first().evaluate(e=>e.insertAdjacentHTML('beforeend','<a class="row-resource" href="#sources">Test secondary resource</a>'));await page.getByRole('link',{name:'Test secondary resource'}).click();await page.getByRole('heading',{name:'Built on the official record'}).waitFor();
 assert.deepEqual(errors,[]);console.log('Batch 2A: calendar dates/views/filters, enlarged mobile layout, axe, 1,200-bill pagination, whole-row keyboard/tap and return state passed.');
}finally{await browser.close()}

