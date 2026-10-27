import {billOptions} from './fixtures/bill-options.mjs';
import {openArchive} from './fixtures/archive-navigation.mjs';
import {chromium} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {sessionFixture,interceptSession} from './fixtures/session-transition.mjs';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const evidence=JSON.parse(await readFile('docs/PHASE4D_EVIDENCE.json','utf8'));
for(const s of Object.values(evidence.sources))assert.equal(createHash('sha256').update(await readFile(s.path)).digest('hex'),s.sha256);
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
await mkdir('test-results/phase4d',{recursive:true});
try {
 for(const width of [390,1280])for(const count of [0,1,3,240]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[],fixture=sessionFixture(saved,count);
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.copied=text}}));
  await interceptSession(page,fixture);
  await page.goto(base+'#bills');await page.locator('.bill-row').first().waitFor();
  assert.equal(await page.locator('#session').inputValue(),count?'2027':'2027-requests');
  assert.equal(await page.locator('.advanced-search').count(),count?1:0);
  assert.equal(await page.locator('.bill-row').count(),Math.min(count||240,width<900?50:100));
  assert.equal(await page.locator('#sort').inputValue(),'title');
  await page.screenshot({path:'test-results/phase4d/'+width+'-'+count+'.png',fullPage:false});
  // Shared toolbar semantics remain valid even for a one-row introduced index.
  const icon=await page.locator('.copy-results').boundingBox(),bar=await page.locator('.results-toolbar').boundingBox();
  assert.ok(icon.width>=44&&icon.height>=44);assert.ok(Math.abs(icon.x+icon.width-bar.x-bar.width)<2);
  await page.locator('.copy-results').focus();await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled);
  assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,count||240);
  assert.equal(await page.locator('.copy-status').innerText(),`Copied ${count||240} titles with links.`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  for(const size of [25,50,100,200]){
   await billOptions(page);await page.getByLabel('Results per page').selectOption(String(size));
   assert.equal(await page.locator('.bill-row').count(),Math.min(count||240,size));
  }
  await billOptions(page);await page.getByLabel('Results per page').selectOption('25');
  if(count===0){
   await page.locator('#session').selectOption('2027');
   assert.equal(await page.locator('.bill-row').count(),0);
   assert.match(await page.locator('#search-info').textContent(),/This does not confirm that none exist/);
   await page.locator('#show-requests').click();await page.waitForURL(url=>url.hash==='#requests');await page.waitForFunction(()=>document.querySelector('#session')?.value==='2027-requests');assert.equal(await page.locator('#session').inputValue(),'2027-requests');
  }else{
   await page.locator('.advanced-search>summary').click();await page.locator('#chamber').selectOption('House');
   assert.equal(await page.locator('.bill-row').count(),Math.min(25,Math.ceil(count/2)));
   await page.locator('#clear').click();await billOptions(page);await page.locator('#sort').selectOption('number');
   const expected=fixture.measures.filter(b=>b.sessionID==='2027GS').sort((a,b)=>a.billNumber.localeCompare(b.billNumber));
   assert.equal(await page.locator('.bill-row h2 a').first().getAttribute('href'),'#bill/2027/'+expected[0].billNumber);
   if(count>25){await page.locator('#next-page').click();assert.match(await page.locator('.pagination').innerText(),/Page 2/);await page.locator('#previous-page').click();}
   await page.locator('#search').fill('HB0001');assert.equal(await page.locator('.bill-row').count(),1);
   await page.locator('.bill-row h2 a').click();await page.getByRole('heading',{name:'Official general description',exact:true}).waitFor();
   await page.locator('.votes-section').getByText(/No verified final-passage/).waitFor();
   await page.locator('main>.back').click();assert.equal(await page.locator('#session').inputValue(),'2027');assert.equal(await page.locator('#search').inputValue(),'HB0001');
   await page.goto(base+'#request/ZZZZZZZZAA');await page.locator('.request-source-trigger').waitFor();
   assert.match(await page.locator('.note').innerText(),/Introduced as HB0001/);
   await page.getByRole('link',{name:'HB0001',exact:true}).click();await page.getByRole('link',{name:'Original drafting request and observed history'}).click();
   await page.locator('.request-source-trigger').waitFor();assert.ok(page.url().endsWith('#request/ZZZZZZZZAA'));
   await page.goto(base+'#requests');await page.locator('#search').fill('ZZZZZZZZAA');assert.equal(await page.locator('.bill-row').count(),0);
   await page.locator('#clear-search').click();assert.match(await page.locator('#count').innerText(),/^239 public requests/);
  }
  await openArchive(page);await page.locator('#search').fill('');
  assert.match(await page.locator('.historical-label').innerText(),/2026/);assert.equal(await page.locator('.bill-row').count(),25);
  await page.goto(base+'?fresh-default#bills');await page.locator('#session').waitFor();
  assert.equal(await page.locator('#session').inputValue(),count?'2027':'2027-requests');
  assert.equal(await page.getByLabel('Results per page').inputValue(),'25');
  assert.equal(await page.locator('.bill-row').count(),Math.min(count||240,25));
  assert.deepEqual(errors,[]);await page.close();
 }
 console.log('Phase 4D: empty/one/three/240 introduced records, request conversion, history navigation, historical access, preferences, search/filter/sort/paging, mobile/desktop toolbar and axe passed.');
}finally{await browser.close()}
