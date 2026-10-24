import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),matching=[...saved.requests2027,...saved.sourceObservedRequests2027].filter(r=>!r.introducedBill&&r.currentlyListed!==false),sample=matching.find(r=>r.verificationState==='source-observed')||matching[0];
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.setDefaultTimeout(15000);
await page.clock.setFixedTime(new Date('2026-10-24T18:00:00Z'));
await page.addInitScript(()=>{localStorage.setItem('utahbills-results-per-page','25');Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{if(window.denyCopy)throw Error('denied');window.copied=text}}})});
const ready=()=>page.waitForFunction(()=>document.querySelector('#activity-count')&&!document.querySelector('#activity-count').textContent.includes('Loading'));
const copy=async()=>{await page.locator('.copy-results').click();await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled)};
const csv=async()=>{await page.locator('.export-menu summary').click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export CSV',exact:true}).click();const d=await download;assert.match(d.suggestedFilename(),/^utahbills-.*-\d{4}-\d{2}-\d{2}\.csv$/);return readFile(await d.path(),'utf8')};
await mkdir('test-results/phase4u',{recursive:true});
try{
 await page.goto(base+'#requests/all');await page.locator('.bill-row').first().waitFor();
 assert.deepEqual(await page.locator('#session option').allTextContents(),['2027 Bills and resolutions','2027 Public bill requests','2026 Legislative Archive']);
 assert.equal(await page.locator('.support').count(),0);
 const total=await page.locator('.bill-row').count();assert.equal(total,25);
 assert.equal(await page.locator('#previous-page').isVisible(),false);assert.equal(await page.locator('#next-page').isVisible(),true);
 await copy();const all=await page.evaluate(()=>window.copied);assert.equal(all.split('\n\n').length,matching.length);
 await page.locator('#sort').selectOption('number');await copy();assert.deepEqual((await page.evaluate(()=>window.copied)).split('\n\n').map(s=>s.match(/Tracking ID: ([A-Z]+)/)[1]),matching.map(r=>r.trackingID).sort((a,b)=>a.localeCompare(b)));
 const exported=await csv();assert.ok(exported.startsWith('\uFEFF'));assert.equal(exported.split('\r\n').length,matching.length+2);assert.ok(exported.includes('Tracking ID'));
 await page.locator('.page-preference select').selectOption('100');for(let n=1;n<Math.ceil(matching.length/100);n++){await page.locator('#next-page').click();assert.equal(await page.locator('#previous-page').isVisible(),true)}assert.equal(await page.locator('#next-page').isVisible(),false);assert.ok((await page.locator('.pagination').innerText()).includes('Page '+Math.ceil(matching.length/100)+' of '+Math.ceil(matching.length/100)));
 await page.locator('#search').fill(sample.trackingID);assert.equal(await page.locator('.pagination').isVisible(),false);await copy();assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,1);assert.ok((await page.evaluate(()=>window.copied)).includes(sample.trackingID));
 await page.getByRole('button',{name:'Info about result counts',exact:true}).click();assert.ok((await page.locator('#count-info').innerText()).includes(saved.requestPublication.verifiedTotal+' statuses verified'));await page.keyboard.press('Escape');
 await page.evaluate(()=>window.denyCopy=true);await copy();assert.ok((await page.locator('.copy-fallback').inputValue()).includes(sample.trackingID));await page.evaluate(()=>window.denyCopy=false);
 if(sample.verificationState==='source-observed'){await page.locator('.bill-row h2 a').click();await page.locator('.source-discrepancy-details summary').click();assert.ok(await page.locator('.source-discrepancy-details').evaluate(e=>{const r=document.createRange();r.selectNodeContents(e.querySelector('summary'));return Math.abs(r.getBoundingClientRect().x-e.querySelector('p').getBoundingClientRect().x)<1}));assert.equal((await page.getByRole('img',{name:'Source discrepancy'}).boundingBox()).width,15);await page.goBack();await page.locator('#search').waitFor()}await page.locator('#search').fill('');await page.locator('#session').selectOption('2026');await page.locator('.historical-row').first().waitFor();assert.match(await page.locator('.historical-row').first().innerText(),/Historical · 2026/);
 await page.locator('.historical-row h2 a').first().click();await page.locator('main.historical-view h1').waitFor();await page.goBack();await page.locator('#session').waitFor();assert.equal(await page.locator('#session').inputValue(),'2026');
 // Synthetic isolated saved-event pages exercise complete copy without eager browsing.
 const events=Array.from({length:155},(_,i)=>({id:'u-'+i,session:'2027',bill:'REQUEST'+i,trackingID:'FIXTURE'+i,title:i===0?'=formula, "quoted"':'Fixture '+i,category:i%2?'documents':'requests',kind:'Request first observed',text:'Saved observation '+i,body:'',date:i<65?'2026-10-24':i<90?'2026-10-23':i<120?'2026-09-25':i<150?'2026-09-24':null,dateLabel:'Observed date; official submission date unknown',retrievedAt:'2026-10-24T12:17:00Z',history:'#request/XKUCMCIIHJ',url:'https://le.utah.gov/asp/billtrack/ComBillReq.asp?year=2027'}));
 const pages=[];for(let i=0;i<events.length;i+=20){const rows=events.slice(i,i+20);pages.push({file:'phase4u-'+i+'.json',count:rows.length,first:rows[0].date,last:rows.at(-1).date,groups:Object.values(rows.reduce((a,e)=>{const k=e.date+'|'+e.category;a[k]??={date:e.date,category:e.category,count:0};a[k].count++;return a},{}))})}
 let fetched=[],fail=false;await page.route('**/data/activity/index.json',r=>r.fulfill({json:{sessions:{'2027':{count:155,undated:5,checkedAt:'2026-10-24T12:17:00Z',pages}}}}));
 await page.route('**/data/activity/phase4u-*.json',r=>{const n=Number(r.request().url().match(/phase4u-(\d+)/)[1]);fetched.push(n);return fail&&n===80?r.fulfill({status:503,body:'Unavailable'}):r.fulfill({json:events.slice(n,n+20)})});
 await page.evaluate(()=>localStorage.setItem('utahbills-results-per-page','25'));await page.goto(base+'#activity');await page.reload();await ready();
 assert.equal(await page.locator('#activity-period').inputValue(),'five');assert.equal(await page.locator('#activity-category option').first().innerText(),'All categories');assert.equal(await page.locator('#activity-count').innerText(),'90 recorded events');
 // A fresh page at 25/page loads only two source chunks (25 rows plus lookahead).
 fetched=[];await page.reload();await ready();assert.deepEqual(fetched,[0,20]);
 await copy();assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,90);assert.equal(await page.locator('.activity-row').count(),25);assert.deepEqual(fetched,[0,20,40,60,80]);
 const activityCsv=await csv();assert.ok(activityCsv.includes("\"'=formula, \"\"quoted\"\"\""));assert.equal(activityCsv.split('\r\n').length,92);
 await page.locator('#activity-next').click();await ready();assert.match(await page.locator('#activity-page').innerText(),/2 of 4/);await page.locator('#activity-next').click();await ready();await page.locator('#activity-next').click();await ready();assert.equal(await page.locator('#activity-next').isVisible(),false);assert.equal(await page.locator('.activity-row').count(),15);
 await page.locator('#activity-category').selectOption('requests');await ready();assert.equal(await page.locator('#activity-count').innerText(),'45 recorded events');assert.equal(await page.locator('#activity-prev').isVisible(),false);await copy();assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,45);
 await page.locator('#activity-category').selectOption('all');await page.locator('#activity-period').selectOption('thirty');await ready();assert.equal(await page.locator('#activity-count').innerText(),'120 recorded events');await page.locator('#activity-period').selectOption('prior');await ready();assert.equal(await page.locator('#activity-count').innerText(),'30 recorded events');
 await page.locator('.activity-info summary').click();await page.locator('#activity-undated').click();await ready();assert.equal(await page.locator('#activity-count').innerText(),'5 recorded events');assert.equal(await page.locator('.page-preference').isVisible(),false);assert.equal(await page.locator('.pagination').isVisible(),false);assert.match(await page.locator('.activity-row').first().innerText(),/Date unavailable/);
 await page.locator('#activity-period').selectOption('five');await ready();fail=true;await page.reload();await ready();await copy();assert.match(await page.locator('.copy-status').innerText(),/Could not load all matching/);assert.equal(await page.evaluate(()=>window.copied),undefined);fail=false;await copy();assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,90);
 const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
 for(const width of [320,375,390,430,768,1024,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await page.reload();await ready();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,width+' '+mode);
  for(const s of await page.locator('.activity-controls select').all())assert.ok((await s.boundingBox()).height>=44);
  await page.evaluate(()=>scrollTo(0,0));await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[],width+' '+mode);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:'test-results/phase4u/activity-'+width+'.png'});
 }
 assert.deepEqual(errors,[]);console.log('Phase 4U: pagination, complete Copy/CSV, privacy-safe fixtures, export failure/recovery, undated/Mountain windows, archive routes, seven widths/text/zoom and axe passed.');
}finally{await browser.close()}
