import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {chromium} from 'playwright';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const catalog=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
try {
 const page=await browser.newPage({viewport:{width:375,height:850}});
 await page.goto(base+'#requests');await page.locator('.bill-row').first().waitFor();
 const publication=catalog.requestPublication;
 assert.match(await page.locator('#count').innerText(),new RegExp(`${publication.officialTotal} source requests.*${publication.verifiedTotal} statuses verified`));
 for(const id of ['DFTEVYMLXT','VYQQDPXGUY']) {
  const record=[...catalog.requests2027,...catalog.sourceObservedRequests2027].find(r=>r.trackingID===id);assert.ok(record);
  await page.goto(base+'#request/'+id);await page.getByRole('heading',{name:record.shortTitle,exact:true,level:1}).waitFor();
  assert.ok((await page.locator('.note').innerText()).includes(record.verificationState==='source-observed'?'Official status not confirmed':record.officialStatus));
  await page.getByRole('button',{name:'Source details',exact:true}).click();
  assert.ok((await page.locator('.request-sources').innerText()).includes('Source observed'));
  await page.keyboard.press('Escape');
 }
 await page.goto(base+'#about');await page.getByRole('heading',{name:'About',exact:true,level:1}).waitFor();
 const text=await page.locator('#main').innerText();assert.match(text,/Analyzed examples retrieved/);assert.match(text,/scheduled daily at 12:17 UTC/);assert.match(text,/successful deployment does not mean every source refreshed successfully/);assert.match(text,/Independent human editorial review is pending/);
 assert.equal(await page.getByRole('link',{name:'Refresh attempts and component reports',exact:true}).getAttribute('href'),'https://github.com/utahbug/UtahBills/actions/workflows/pages.yml');
 for(const href of ['./data/text-2027.json','./data/archive.json']){assert.equal(await page.locator(`a[href="${href}"]`).count(),1);assert.ok((await page.request.get(new URL(href,base).href)).ok())}
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await page.goto(base+'#calendar');await page.locator('.calendar-info > summary').click();assert.match(await page.locator('.calendar-info').innerText(),/Deployment success alone does not establish a successful Calendar check/);
 assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
 console.log('Phase 4R: current request counts, recovered/unconfirmed details and history, freshness qualification/source links, phone overflow and noindex passed.');
} finally {await browser.close()}
