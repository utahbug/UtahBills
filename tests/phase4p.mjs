import {copyResults} from './fixtures/copy-results.mjs';
import {showSavedActivity} from './fixtures/activity-navigation.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
try {for(const record of saved.sourceObservedRequests2027)for(const width of [320,390,768,1280]){
 const page=await browser.newPage({viewport:{width,height:900}});let copied='';
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{window.copied=text}}}));
 await page.goto(base+'#requests');await page.locator('#search').fill(record.trackingID);
 await page.locator('.bill-row').waitFor();assert.equal(await page.locator('.bill-row').count(),1);
 assert.ok((await page.locator('#count').innerText()).includes(`1 of ${saved.requests2027.length+saved.sourceObservedRequests2027.length} ${width<=700?'requests':'public requests'}`));
 assert.ok((await page.locator('#count-info').textContent()).includes(`${saved.requestPublication.officialTotal} source requests · ${saved.requestPublication.verifiedTotal} statuses verified · ${saved.sourceObservedRequests2027.length} awaiting status verification`));
 assert.match(await page.locator('.bill-row').innerText(),/Official status not confirmed/);
 assert.equal(await page.getByRole('img',{name:'Source discrepancy'}).count(),1);
 await copyResults(page);await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled);copied=await page.evaluate(()=>window.copied);
 assert.ok(copied.includes('#request/'+record.trackingID)&&copied.includes(record.shortTitle));
  // Detailed status/source qualifications remain in CSV, not title-only sharing.
  await page.locator('.export-menu>summary').click();const download=page.waitForEvent('download',{timeout:15000});await page.getByRole('button',{name:'Export CSV',exact:true}).click();const csv=await readFile(await(await download).path(),'utf8');assert.ok(csv.includes(record.trackingID)&&csv.includes('Official status not confirmed')&&csv.includes(saved.requestSource));
 await page.locator('.bill-row h2 a').focus();await page.keyboard.press('Enter');await page.locator('.request-heading').waitFor();
 await page.locator('.source-discrepancy-details summary').click();assert.match(await page.locator('main').innerText(),/reason has not been independently established/);
 assert.ok(await page.locator(`a[href="${saved.requestSource}"]`).count());
 await page.getByRole('button',{name:'Source details',exact:true}).click();assert.equal(await page.locator('.tracking-id').innerText(),record.trackingID);
 assert.ok((await page.getByRole('dialog',{name:'Source details'}).textContent()).includes(record.history[0].source.sha256));await page.keyboard.press('Escape');
 for(const mode of ['normal','text','zoom']){
 if(mode==='text')await page.evaluate(()=>document.documentElement.style.fontSize='200%');
 if(mode==='zoom')await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.zoom='2'});
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
 }
 await page.goto(base+'?activity#activity');await showSavedActivity(page);await page.locator('#activity-category').selectOption('requests');
 const event=page.locator('.activity-row').filter({has:page.locator(`a[href="#request/${record.trackingID}"]`)});await event.waitFor();assert.match(await event.innerText(),/Retrieval observation date/);assert.match(await event.innerText(),/Official status not confirmed/);
 await event.locator('h2 a').click();await page.locator('.request-heading').waitFor();
 if(width===390)await page.screenshot({path:'test-results/phase4p-phone.png',fullPage:true});
 if(width===1280)await page.screenshot({path:'test-results/phase4p-desktop.png',fullPage:true});
 await page.close();
}console.log('Phase 4P source-observed search, details, Copy, links, flag, Activity navigation, 320/390/768/1280, text/zoom and axe passed.');}finally{await browser.close()}
