import {openArchive} from './fixtures/archive-navigation.mjs';
import {chromium,webkit} from 'playwright';import {readFile,mkdir,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('test-results',{recursive:true});const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');const checks=[];
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
await page.addInitScript(()=>localStorage.setItem('utahbills-results-per-page','25'));
try{
await page.goto(base);await page.getByRole('heading',{name:'Find a bill. Understand its impact.'}).waitFor();
await openArchive(page);await page.locator('#search').fill('HB 154');assert.equal(await page.locator('.bill-row').count(),1);await page.locator('#clear-search').click();
await page.locator('.advanced-search>summary').click();await page.locator('#status').selectOption('Signed');assert.equal(await page.locator('.bill-row').count(),25);await page.locator('#chamber').selectOption('Senate');assert.equal(await page.locator('.bill-row').count(),25);await page.locator('#clear').click();
await page.locator('#search').fill('no-such-bill');await page.getByRole('heading',{name:'No matching measures'}).waitFor();await page.locator('#empty-clear').click();
await page.locator('#session').selectOption('2027');const current=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));assert.match(await page.locator('#count').innerText(),current.coverage['2027'].imported?new RegExp('^'+current.coverage['2027'].imported+' of'):/2027 · Checked/);await openArchive(page);
checks.push('Search normalization, combined filters, empty state, and 2027 non-live state passed');
await page.goto(base+'#bill/HB0011');await page.locator('#law-text').waitFor();assert.match(await page.locator('#law-text').innerText(),/probable cause/);await page.getByRole('button',{name:'Law before proposal',exact:true}).click();assert.doesNotMatch(await page.locator('#law-text').innerText(),/probable cause/);await page.getByRole('button',{name:'Resulting text',exact:true}).click();assert.match(await page.locator('#law-text').innerText(),/probable cause/);
await page.goto(base+'#bill/SB0069');await page.locator('#law-text').waitFor();await page.getByRole('button',{name:'Resulting text',exact:true}).click();assert.match(await page.locator('#law-text').innerText(),/written opt-out request/);assert.doesNotMatch(await page.locator('#law-text').innerText(),/"Classroom hours" means/);await page.locator('#from-version').selectOption('0');await page.locator('#to-version').selectOption('0');assert.match(await page.locator('#version-diff').innerText(),/No differences/);
checks.push('Historical baseline excludes new inspection language; proposed text includes it; school-device text removes old definition and includes opt-out; identical-version comparison passed');
for(const width of [320,375,390,430,768,1280]){
 await page.setViewportSize({width,height:900});
 for(const route of ['bills','bill/HB0011','bill/HB0154','bill/HB0155','bill/SB0069','guide','sources','calendar']){
  await page.goto(base+'#'+route);await page.locator('h1').waitFor();await page.waitForTimeout(80);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow at ${width} ${route}`);
  await page.evaluate(axe);const a=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
  assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`Accessibility at ${width} ${route}`);
 }
 checks.push(`No horizontal overflow or automated WCAG A/AA violations across seven routes at ${width}px`);
 if(width===390){await page.goto(base+'#bill/SB0069');await page.screenshot({path:'test-results/mobile-detail.png',fullPage:true})}
}
await page.setViewportSize({width:1280,height:900});await page.goto(base+'#bills');await page.screenshot({path:'test-results/desktop-bills.png',fullPage:true});await page.goto(base+'#bill/HB0154');await page.screenshot({path:'test-results/desktop-detail.png',fullPage:true});
await page.goto(base);await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Skip to content');await page.keyboard.press('Enter');assert.equal(await page.evaluate(()=>document.activeElement.id),'main');
await page.goto(base+'#bill/HB0154');await page.reload();await page.getByRole('heading',{name:'Water Loss Study Amendments',exact:true}).waitFor();
assert.deepEqual(errors,[]);checks.push('Keyboard skip link, direct bill reload under /UtahBills/, and no browser runtime errors passed');
await writeFile('test-results/report.json',JSON.stringify({testedAt:new Date().toISOString(),checks,limitations:['Automated checks do not prove WCAG conformance. Screen-reader and real-device testing pending.']},null,2));console.log(checks.join('\n'));
}finally{await browser.close()}

