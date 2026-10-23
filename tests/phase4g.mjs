import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const index=JSON.parse(await readFile('dist/data/activity/index.json','utf8')),saved=[];
for(const p of index.sessions['2027'].pages)saved.push(...JSON.parse(await readFile('dist/data/activity/'+p.file,'utf8')));
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const ready=()=>page.waitForFunction(()=>document.querySelector('#activity-count')&&!document.querySelector('#activity-count').textContent.includes('Loading'));
await mkdir('test-results/phase4g',{recursive:true});
try{
 await page.addInitScript(()=>{localStorage.setItem('utahbills-results-per-page','25');Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.copied=text}})});
 await page.goto(base+'#activity');await page.locator('#activity-period').selectOption('all');await ready();
 assert.equal(await page.locator('.activity-row').count(),Math.min(25,saved.length));
 if(saved.length){assert.equal(await page.locator('.activity-row h2 a').first().getAttribute('href'),saved[0].history);await page.locator('.copy-results').click();assert.ok((await page.evaluate(()=>window.copied)).includes(saved[0].dateLabel));await page.locator('.activity-row h2 a').first().click();await page.locator('h1').waitFor();assert.equal(new URL(page.url()).hash,saved[0].history);await page.goBack();await ready()}
 // Isolated browser fixtures are never written to production data.
 const events=Array.from({length:130},(_,i)=>({id:'fixture-'+i,session:'2027',bill:'TEST '+i,title:'Fixture activity',category:i<100?'requests':i<128?'documents':i===128?'introduced':'actions',kind:i<100?'Request title change observed':i<128?'Substitute document':i===128?'Introduced legislation first observed':'Recorded legislative action',text:'Fixture previous → revised '+i,body:'',date:i<100?'2027-01-03':i<128?'2026-12-30':i===128?'2026-12-29':null,dateLabel:'Retrieval observation date; official change/publication date unknown',retrievedAt:'2027-01-03T18:00:00Z',history:'#request/DXYQRODBBU',url:'https://le.utah.gov/Session/2027/bills/static/HB0001.html'}));
 const fixture={sessions:{'2027':{count:130,undated:1,checkedAt:'2027-01-03T18:00:00Z',pages:[{file:'fixture-0.json',first:'2027-01-03',last:'2027-01-03'},{file:'fixture-1.json',first:'2026-12-30',last:'2026-12-29'}]}},requestCoverage:index.requestCoverage};
 await page.route('**/data/activity/index.json',r=>r.fulfill({json:fixture}));await page.route('**/data/activity/fixture-*.json',r=>r.fulfill({json:r.request().url().includes('fixture-0')?events.slice(0,100):events.slice(100)}));
 await page.clock.setFixedTime(new Date('2027-01-03T18:00:00Z'));await page.reload();await page.locator('#activity-period').selectOption('all');await ready();
 await page.locator('#activity-category').selectOption('documents');await ready();assert.equal(await page.locator('.activity-row').count(),25);assert.match(await page.locator('#activity-count').innerText(),/1–25 of 28/);
 await page.locator('#activity-next').click();await ready();assert.equal(await page.locator('.activity-row').count(),3);assert.match(await page.locator('#activity-count').innerText(),/26–28/);await page.locator('.copy-results').click();assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,3);
 await page.locator('#activity-period').selectOption('five');await ready();assert.equal(await page.locator('.activity-row').count(),25);await page.locator('#activity-category').selectOption('introduced');await ready();assert.equal(await page.locator('.activity-row').count(),0);assert.match(await page.locator('.activity-empty').innerText(),/does not mean no legislative work/);
 await page.locator('#activity-period').selectOption('all');await ready();assert.equal(await page.locator('.activity-row').count(),1);await page.locator('#activity-category').selectOption('actions');await ready();assert.equal(await page.locator('.activity-row').count(),1);assert.match(await page.locator('.activity-row').last().innerText(),/Date unavailable/);
 await page.locator('#activity-category').selectOption('requests');await page.locator('#activity-period').selectOption('today');await ready();assert.equal(await page.locator('.activity-row').count(),25);await page.locator('#activity-period').selectOption('yesterday');await ready();assert.equal(await page.locator('.activity-row').count(),0);
 await page.locator('#activity-period').selectOption('all');await ready();await page.locator('#activity-category').focus();await page.keyboard.press('Home');await page.keyboard.press('Enter');await ready();assert.equal(await page.locator('#activity-category').inputValue(),'all');
 for(const width of [320,390,768,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await page.reload();await page.locator('#activity-period').selectOption('all');await ready();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width} ${mode}`);
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:`test-results/phase4g/activity-${width}.png`});
 }
 // Empty index remains usable, with no invented events.
 fixture.sessions['2027']={count:0,undated:0,checkedAt:'2027-01-03',pages:[]};await page.reload();await ready();assert.equal(await page.locator('.activity-row').count(),0);assert.equal(await page.locator('.activity-empty a[href="#requests"]').count(),1);
 assert.deepEqual(errors,[]);console.log('Phase 4G: real observations, category/date/page boundaries, undated/empty states, source/detail links, Copy, keyboard, four widths, doubled text, CSS zoom and axe passed.');
}finally{await browser.close()}
