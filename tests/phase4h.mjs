import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const catalog=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),manifest=JSON.parse(await readFile('data/catalog.json','utf8'));
const baseline=new Set(JSON.parse(await readFile(manifest.requestHistory[0].path,'utf8')).map(r=>r.trackingID));
const stale={...catalog,requests2027:catalog.requests2027.filter(r=>baseline.has(r.trackingID)),requestArchive2027:catalog.requestArchive2027.filter(r=>baseline.has(r.trackingID))};
const id='XKUCMCIIHJ',record=catalog.requestArchive2027.find(r=>r.trackingID===id);assert.ok(record);assert.ok(!baseline.has(id));
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
async function detail(page,request){await page.getByRole('heading',{name:request.shortTitle,exact:true,level:1}).waitFor();await page.getByRole('button',{name:'Source details',exact:true}).click();assert.equal(await page.locator('.tracking-id').innerText(),request.trackingID);await page.keyboard.press('Escape');assert.equal(await page.getByRole('heading',{name:/Request unavailable/}).count(),0)}
async function activity(page){await page.goto(base+'#activity');await page.locator('#activity-period').selectOption('all');await page.locator('.activity-row').first().waitFor()}
try{
 const fresh=await browser.newPage({viewport:{width:390,height:844}});await activity(fresh);
 const hrefs=[...new Set(await fresh.locator('.activity-row h2 a[href^="#request/"]').evaluateAll(es=>es.map(e=>e.getAttribute('href'))))];assert.ok(hrefs.includes('#request/'+id));
 for(const href of hrefs){await fresh.locator(`.activity-row h2 a[href="${href}"]`).first().click();await detail(fresh,[...catalog.requestArchive2027,...(catalog.sourceObservedRequests2027||[])].find(r=>r.trackingID===href.split('/')[1]));await fresh.goBack();await fresh.locator('.activity-row').first().waitFor()}
 await fresh.goto(base+'#request/'+id);await detail(fresh,record);await fresh.close();
 const page=await browser.newPage({viewport:{width:390,height:844}});let calls=0;
 await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:++calls===1?stale:catalog}));await activity(page);
 const old=catalog.requestArchive2027.find(r=>baseline.has(r.trackingID));await page.goto(base+'#request/'+old.trackingID);await detail(page,old);assert.equal(calls,1,'Older requests resolve from the loaded catalog');
 await activity(page);await page.locator(`.activity-row h2 a[href="#request/${id}"]`).click();await detail(page,record);assert.equal(calls,2,'Missing newer request refreshes catalog once');
 await page.goBack();await page.locator('.activity-row').first().waitFor();await page.locator(`.activity-row h2 a[href="#request/${id}"]`).click();await detail(page,record);assert.equal(calls,2);await page.close();
 // Failed refresh is retryable, not a false declaration that the request is absent.
 const failure=await browser.newPage();let attempts=0;await failure.route('**/data/catalog-ui.json',r=>{attempts++;return attempts===1?r.fulfill({json:stale}):attempts===2?r.fulfill({status:503,body:'Unavailable'}):r.fulfill({json:catalog})});await activity(failure);await failure.locator(`.activity-row h2 a[href="#request/${id}"]`).click();await failure.getByRole('heading',{name:'Unable to refresh saved request'}).waitFor();await failure.getByRole('button',{name:'Retry',exact:true}).click();await detail(failure,record);await failure.close();
 // Late recovery cannot replace another route; an unknown ID gets no guessed result.
 const delayed=await browser.newPage();let n=0,release;await delayed.route('**/data/catalog-ui.json',async r=>{if(++n===1)return r.fulfill({json:stale});await new Promise(resolve=>release=resolve);await r.fulfill({json:catalog})});await activity(delayed);await delayed.locator(`.activity-row h2 a[href="#request/${id}"]`).click();await delayed.getByRole('heading',{name:'Checking saved request…'}).waitFor();while(!release)await delayed.waitForTimeout(10);await delayed.getByRole('link',{name:'Legislators',exact:true}).click();await delayed.getByRole('heading',{name:'Legislators',exact:true}).waitFor();release();await delayed.waitForTimeout(100);assert.equal(await delayed.locator('h1').innerText(),'Legislators');await delayed.close();
 const unknown=await browser.newPage();await unknown.route('**/data/catalog-ui.json',r=>r.fulfill({json:catalog}));await unknown.goto(base+'#request/UNKNOWNFIXTURE');await unknown.getByRole('heading',{name:'Request unavailable in the latest saved catalog'}).waitFor();assert.equal(await unknown.locator('.request-source-trigger').count(),0);await unknown.close();
 console.log('Phase 4H navigation: all real activity request links, XKUCMCIIHJ detail/provenance, baseline/new mixed snapshots, refresh reuse, retry, unknown IDs and delayed navigation passed.');
}finally{await browser.close()}
