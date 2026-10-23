import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));
const partial=saved.requestPublication;
assert.ok(partial);assert.equal(partial.officialTotal,partial.verifiedTotal+partial.withheld.length);
for(const item of partial.withheld)assert.ok(!saved.requestArchive2027.some(r=>r.trackingID===item.trackingID));
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
try {
 for(const width of [320,1280])for(const mode of ['normal','text','zoom']){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto(base+'#requests');await page.locator('.bill-row').first().waitFor();
  if(partial.status==='partial')assert.ok((await page.locator('#count').innerText()).includes(`${partial.verifiedTotal} verified of ${partial.officialTotal} source requests`));
  for(const item of partial.withheld){await page.locator('#search').fill(item.trackingID);assert.equal(await page.locator('.bill-row').count(),0)}
  await page.locator('#search').fill('');
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom='2');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  await page.goto(base+'#activity');await page.locator('#activity-period').selectOption('all');await page.locator('#activity-category').selectOption('requests');await page.waitForFunction(()=>document.querySelector('#activity-count')&&!document.querySelector('#activity-count').textContent.includes('Loading'));await page.locator('.activity-row').first().waitFor();
  await page.locator('.activity-info > summary').click();
  if(partial.status==='partial')assert.ok((await page.locator('#activity-scope').innerText()).includes(`${partial.withheld.length} withheld awaiting status`));
  for(const item of partial.withheld)assert.ok(!(await page.locator('#activity-results').innerText()).includes(item.trackingID));
  const recent=await page.locator('.activity-row h2 a').first().getAttribute('href');await page.locator('.activity-row h2 a').first().focus();await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('.request-heading'));
  assert.equal(new URL(page.url()).hash,recent);assert.equal(await page.getByRole('heading',{name:'Request unavailable',exact:true}).count(),0);
  await page.close();
 }
 console.log('Partial publication: counts, withheld exclusion, Activity/detail navigation, keyboard, 320/1280px, enlarged text, 200% zoom and axe passed.');
} finally {await browser.close()}
