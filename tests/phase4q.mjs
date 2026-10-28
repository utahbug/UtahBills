import {copyResults} from './fixtures/copy-results.mjs';
import {showSavedActivity} from './fixtures/activity-navigation.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const fixture=JSON.parse(await readFile('test-results/phase4q-independent.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const data=fixture.catalog,events=fixture.events,coverage=data.requestObservationCoverage;
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
try{for(const width of [320,1280]){
 const page=await browser.newPage({viewport:{width,height:900}});
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied=text}}}));
 await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:data}));
 const session={count:events.length,undated:0,pages:[{file:'2027-0.json',count:events.length,first:'2026-10-23',last:'2026-10-01'}],checkedAt:data.requestCheckedAt};
 await page.route('**/data/activity/index.json',r=>r.fulfill({json:{schemaVersion:2,requestPublication:coverage,sessions:{2027:session,2026:{...session,count:0,pages:[]}}}}));
 await page.route('**/data/activity/2027-0.json',r=>r.fulfill({json:events}));
 await page.goto(base+'#requests');await page.locator('.bill-row').first().waitFor();
 assert.match(await page.locator('#count-info').textContent(),/273 source requests · 270 statuses verified · 3 awaiting status verification/);
 assert.match(await page.locator('#count-info').textContent(),/Source observed/);
 for(const record of data.sourceObservedRequests2027){
  await page.locator('#search').fill(record.trackingID);assert.equal(await page.locator('.bill-row').count(),1);
  await copyResults(page);await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled);const copied=await page.evaluate(()=>window.copied);
  assert.ok(copied.includes('#request/'+record.trackingID)&&copied.includes(record.shortTitle));
  // Detailed status/source qualifications remain in CSV, not title-only sharing.
  await page.locator('.export-menu>summary').click();const download=page.waitForEvent('download',{timeout:15000});await page.getByRole('button',{name:'Export CSV',exact:true}).click();const csv=await readFile(await(await download).path(),'utf8');assert.ok(csv.includes(record.trackingID)&&csv.includes('Official status not confirmed')&&csv.includes(data.requestSource));
  await page.locator('.bill-row h2 a').click();await page.locator('.request-heading').waitFor();assert.equal(await page.getByRole('img',{name:'Source discrepancy'}).count(),1);
  await page.locator('.source-discrepancy-details summary').focus();await page.keyboard.press('Enter');assert.match(await page.locator('main').innerText(),/reason has not been independently established/);
  await page.getByRole('button',{name:'Source details',exact:true}).click();assert.ok((await page.locator('dialog').textContent()).includes(record.history[0].source.sha256));await page.keyboard.press('Escape');
  await page.goto(base+'#requests');await page.locator('#search').waitFor();
 }
 await page.goto(base+'#activity');await showSavedActivity(page);await page.locator('#activity-category').selectOption('requests');
 for(const record of data.sourceObservedRequests2027){const row=page.locator('.activity-row').filter({has:page.locator(`a[href="#request/${record.trackingID}"]`)});await row.waitFor();assert.match(await row.innerText(),/Official status not confirmed/);assert.match(await row.innerText(),/Retrieval observation date/)}
 for(const mode of ['normal','text','zoom']){if(mode==='text')await page.evaluate(()=>document.documentElement.style.fontSize='200%');if(mode==='zoom')await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.zoom='2'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[])}
 if(width===320){
  const pending=structuredClone(data);pending.sourceObservedRequests2027[0].pendingCatalogReconciliation=true;
  await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:pending}));
  await page.goto(base+'?pending#request/'+pending.sourceObservedRequests2027[0].trackingID);await page.locator('.request-heading').waitFor();
  await page.locator('.source-discrepancy-details summary').click();assert.match(await page.locator('main').innerText(),/later matching status row is present, but the record is still awaiting catalog reconciliation/);
 }
 await page.close();
}console.log('Phase 4Q preserved 273/270 independent catalog fixture: counts, three observed request links, Copy, flags, provenance, Activity, keyboard, narrow/desktop/text/zoom and axe passed.');}finally{await browser.close()}
