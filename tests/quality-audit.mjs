import {billOptions} from './fixtures/bill-options.mjs';
import {openCalendar} from './fixtures/calendar-navigation.mjs';
import {openArchive} from './fixtures/archive-navigation.mjs';
import {chromium} from 'playwright';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const evidence=JSON.parse(await readFile('docs/QUALITY_AUDIT_EVIDENCE.json','utf8'));
for(const source of evidence.sources.filter(s=>s.auditPath))assert.equal(createHash('sha256').update(await readFile(source.auditPath)).digest('hex'),source.sha256,'Preserved audit response bytes');
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>requests.push(r.url()));
const output={environment:'Headless Chromium/Edge; local loopback, no CPU/network throttling; elapsed times are diagnostic, not field performance',routes:[],searchMs:[]};
try{
 const start=performance.now();await page.goto(base+'#bills');await page.locator('.bill-row').first().waitFor();output.initialReadyMs=performance.now()-start;
 output.initialResources=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,transferSize:r.transferSize,decodedBodySize:r.decodedBodySize,duration:r.duration})));
 assert.ok(!requests.some(u=>/data\/(archive-votes|voting-history|examples)\//.test(u)),'Initial listing does not fetch detail/history payloads');
 const payloads=await Promise.all(['app.js','styles.css','data/catalog-ui.json','data/examples-ui.json'].map(p=>readFile('dist/'+p)));output.initialPayload={rawBytes:payloads.reduce((n,b)=>n+b.length,0),gzipEquivalentBytes:payloads.reduce((n,b)=>n+gzipSync(b).length,0)};
 await openArchive(page);await billOptions(page);await page.getByLabel('Results per page').selectOption('200');
 for(const q of ['water','tax','school','HB0011','']){output.searchMs.push(await page.locator('#search').evaluate((el,q)=>{const t=performance.now();el.value=q;el.dispatchEvent(new Event('input',{bubbles:true}));return {query:q,ms:performance.now()-t,rows:document.querySelectorAll('.bill-row').length}},q));}
 assert.equal(await page.locator('.bill-row').count(),200);
 await page.locator('#search').fill('HB0011');await page.locator('.bill-row h2 a').click();await page.locator('#formatted-reader').waitFor();await page.goBack();await page.locator('#search').waitFor();assert.equal(await page.locator('#search').inputValue(),'HB0011');await page.goForward();await page.locator('#formatted-reader').waitFor();assert.ok(page.url().endsWith('#bill/HB0011'));
 const routes=[['requests','.bill-row'],['request/DXYQRODBBU','.request-source-trigger'],['legislators','.legislator-row'],['legislator/WALTER/2026','.history-search'],['activity','.activity-empty, .activity-row'],['calendar','.calendar-day'],['about','.verification details'],['guide','#about-process'],['sources','#about-data'],['bill/HB0001','.archive-metadata'],['bill/2026/HB0011/history','.history-target[open]']];
 for(const [route,selector] of routes){const t=performance.now();await page.goto(base+'?quality#'+route);if(route==='calendar')await openCalendar(page);await page.locator(selector).first().waitFor();output.routes.push({route,readyMs:performance.now()-t,title:await page.title(),h1:await page.locator('h1').count()});assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 // A delayed request must never replace the route selected while it was loading.
 let release,started;const gate=new Promise(r=>release=r),begun=new Promise(r=>started=r);
 await page.route('**/data/measures/2026GS/HB0001.json',async r=>{started();await gate;await r.continue()});
 await page.goto(base+'?slow#bill/HB0001');await begun;await page.evaluate(()=>location.hash='about');await page.locator('.about-page').waitFor();release();await page.waitForLoadState('networkidle');assert.equal(await page.locator('h1').innerText(),'About');await page.unroute('**/data/measures/2026GS/HB0001.json');
 // Failure stays explicit and a fresh navigation can recover.
 await page.route('**/data/measures/2026GS/HB0001.json',r=>r.fulfill({status:503,body:'Synthetic test failure'}));await page.goto(base+'?failed#bill/HB0001');await page.getByRole('heading',{name:'Saved details unavailable'}).waitFor();await page.unroute('**/data/measures/2026GS/HB0001.json');await page.reload();await page.locator('.archive-metadata').waitFor();
 const cdp=await page.context().newCDPSession(page);await cdp.send('Performance.enable');
 async function memory(){await cdp.send('HeapProfiler.collectGarbage');return {dom:await cdp.send('Memory.getDOMCounters'),metrics:(await cdp.send('Performance.getMetrics')).metrics.filter(x=>['JSHeapUsedSize','JSHeapTotalSize','Nodes','JSEventListeners','Documents'].includes(x.name))}}
 await page.evaluate(()=>location.hash='about');await page.locator('.about-page').waitFor();output.memoryBefore=await memory();
 for(let i=0;i<12;i++){await page.evaluate(()=>location.hash='legislators');await page.locator('.legislator-row').first().waitFor();await page.evaluate(()=>location.hash='about');await page.locator('.verification details').waitFor();}
 output.memoryAfter=await memory();assert.deepEqual(errors,[]);await mkdir('test-results/phase4c',{recursive:true});await writeFile('test-results/phase4c/browser-audit.json',JSON.stringify(output,null,2));console.log('Independent quality checks passed: direct routes, Back/Forward, lazy loading, 200-row search, delayed navigation and failed-detail recovery. Diagnostic timing/memory saved.');
}finally{await browser.close()}
