import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {sessionFixture} from './fixtures/session-transition.mjs';
import {billOptions} from './fixtures/bill-options.mjs';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage();
await mkdir('test-results/phase6c',{recursive:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
async function visit(route){await page.goto(base+'#'+route);await page.reload();await page.locator(route==='legislators'?'.legislator-row':'.catalog-info>summary').first().waitFor()}
async function bounds(selector){await page.waitForTimeout(80);const r=await page.locator(selector).boundingBox();assert.ok(r&&r.x>=-1&&r.x+r.width<=page.viewportSize().width+1,JSON.stringify({selector,r}));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
try{
 for(const route of ['requests','bills/2027','archive/2026','legislators'])for(const width of [320,390,700,701,768,1024,1280,1920])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:1000});await visit(route);
  if(mode==='text')await page.evaluate(()=>{const els=[...document.querySelectorAll('body *')],sizes=els.map(e=>parseFloat(getComputedStyle(e).fontSize));els.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  const directory=route==='legislators',trigger=page.locator(directory?'.directory-search-tools .toolbar-info':'.catalog-info>summary');
  await trigger.focus();await page.keyboard.press('Enter');const panel=directory?'#directory-info':'.catalog-info-content';await page.locator(panel).waitFor({state:'visible'});await bounds(panel);
  assert.deepEqual(await page.locator(panel).evaluate(e=>{const s=getComputedStyle(e);return [s.borderTopWidth,s.borderTopColor,s.backgroundColor,s.paddingTop]}),['1px','rgb(130, 149, 162)','rgb(255, 255, 255)','12px']);
  if(!directory){const input=await page.locator('#search').boundingBox(),r=await page.locator(panel).boundingBox();assert.ok(r.y>=input.y+input.height,'Flow content follows input');assert.ok(await page.locator(panel+' a').count()>=3);if(await page.locator('#session').count()){const a=await page.locator('#session').boundingBox();assert.ok(a.height<=input.height+2,'Records retains field height when Info expands')}}
  await page.keyboard.press('Escape');assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
  if(route==='requests'||route==='archive/2026'){
   assert.equal(await page.locator('#sort').isVisible(),false);assert.equal(await page.locator('.sort-menu>summary').innerText(),'Sort');
   assert.equal(await page.locator('.page-preference select').isVisible(),width>700);
   await billOptions(page);await bounds('.sort-menu .export-panel');assert.equal(await page.locator('#sort').isVisible(),true);
   assert.equal(await page.locator('.sort-menu .page-preference').count(),width<=700?1:0);
   await page.locator('#sort').focus();await page.keyboard.press('Escape');assert.equal(await page.locator('.sort-menu>summary').evaluate(e=>e===document.activeElement),true);
  }
  if(mode==='normal'&&[390,1280].includes(width)){await trigger.click();await page.screenshot({path:`test-results/phase6c/${route.replace('/','-')}-${width}.png`});await page.keyboard.press('Escape')}
 }
 // Fixture stays isolated: the production introduced index remains empty.
 await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:sessionFixture(saved,40,60)}));
 for(const route of ['requests','archive/2026','bills/2027']){
  await page.setViewportSize({width:1280,height:1000});await visit(route);await billOptions(page);
  const options=await page.locator('#sort option').evaluateAll(es=>es.map(e=>e.value));
  for(const value of options){await page.locator('#sort').selectOption(value);assert.equal(await page.locator('#sort option:checked').getAttribute('value'),value);assert.ok(await page.locator('.bill-row').count()>0)}
  await page.locator('#sort').selectOption('number');await page.locator('#sort').focus();await page.setViewportSize({width:700,height:1000});await page.waitForFunction(()=>!!document.querySelector('.sort-menu .page-preference'));
  assert.equal(await page.locator('#sort').evaluate(e=>e===document.activeElement),true);assert.equal(await page.locator('#sort').inputValue(),'number');
  await page.setViewportSize({width:701,height:1000});await page.waitForFunction(()=>!document.querySelector('.sort-menu .page-preference'));assert.equal(await page.locator('#sort').evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');await page.locator('.page-preference select').selectOption('25');assert.equal(await page.locator('.bill-row').count(),25);assert.equal(await page.locator('.sort-menu').getAttribute('open'),null);
  await billOptions(page);await page.locator('#search').click();assert.equal(await page.locator('.sort-menu').getAttribute('open'),null);
  await billOptions(page);await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
 }
 await page.unroute('**/data/catalog-ui.json');await visit('legislators');await page.locator('.directory-search-tools .toolbar-info').click();await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
 assert.deepEqual(errors,[]);console.log('Phase 6C: 96 Info layout cases, native desktop/mobile sorting and focus, independent page size, source links and automated A/AA checks passed.');
}finally{await browser.close()}

