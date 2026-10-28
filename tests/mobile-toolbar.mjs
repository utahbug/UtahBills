import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {sessionFixture} from './fixtures/session-transition.mjs';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),fixture=sessionFixture(saved,40,60),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.copied=text}}));
const more=()=>page.locator('.bill-toolbar .export-menu summary'),info=()=>page.locator('#search-info .catalog-info>summary'),sort=()=>page.locator('.bill-toolbar .sort-menu>summary'),copy=()=>page.locator('.bill-toolbar .copy-results');
async function visit(route){await page.goto(base+'#'+route);await page.reload();await page.locator('.bill-row').first().waitFor()}
async function order(){const [s,m,c,t]=await Promise.all([sort().boundingBox(),more().boundingBox(),copy().boundingBox(),page.locator('.bill-toolbar').boundingBox()]);assert.ok(s.x+s.width<=m.x+1&&m.x+m.width<=c.x+1,'Non-overlapping targets');assert.ok(Math.abs(s.y+s.height/2-m.y-m.height/2)<2&&Math.abs(m.y+m.height/2-c.y-c.height/2)<2,'One controls row');assert.ok(Math.abs(s.x-t.x)<2,'Sort at left');assert.ok(Math.abs(c.x+c.width-t.x-t.width)<2,'Copy at far right '+JSON.stringify({s,m,c,t}));assert.ok(c.x-m.x-m.width<=8,'More immediately before Copy');for(const r of [s,m,c])assert.ok(r.width>=44&&r.height>=44);assert.equal(await page.locator('.bill-toolbar .toolbar-info').count(),0);assert.equal(await info().count(),1);assert.equal(await page.locator('#search-info').evaluate(e=>!!e.closest('.search-tools')),true)}
async function bounds(){await page.waitForTimeout(60);const r=await page.locator('.bill-toolbar details[open] .export-panel').boundingBox(),v=page.viewportSize();assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=v.width+1&&r.y+r.height<=v.height+1,JSON.stringify({r,v}));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false)}
try{
 for(const route of ['requests','archive/2026','bills/2027']){
  if(route==='bills/2027')await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:fixture}));
  for(const width of [320,375,390,430,700])for(const mode of ['normal','text','zoom']){
   await page.setViewportSize({width,height:844});await visit(route);
   if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
   if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
   await order();await sort().click();await bounds();assert.equal(await page.getByLabel('Sort results by',{exact:true}).isVisible(),true);assert.equal(await page.getByLabel('Results per page',{exact:true}).isVisible(),true);
   await page.getByLabel('Sort results by',{exact:true}).focus();await page.keyboard.press('Escape');assert.equal(await sort().evaluate(e=>e===document.activeElement),true);await more().click();await bounds();assert.equal(await page.locator('.more-menu select').count(),0);await page.keyboard.press('Escape');
   await info().click();await page.locator('.catalog-info[open] .floating-panel:popover-open').waitFor();await page.keyboard.press('Escape');assert.equal(await info().evaluate(e=>e===document.activeElement),true);
  }
  await page.setViewportSize({width:390,height:844});await visit(route);await sort().focus();await page.keyboard.press('Enter');await page.getByLabel('Sort results by',{exact:true}).selectOption('number');await page.getByLabel('Results per page',{exact:true}).selectOption('25');await page.keyboard.press('Escape');assert.equal(await page.locator('.bill-row').count(),25);
  await sort().focus();await page.keyboard.press('Tab');assert.equal(await more().evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Tab');assert.equal(await copy().evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled);assert.ok((await page.evaluate(()=>window.copied)).split('\n\n').length>25);
  await more().click();const download=page.waitForEvent('download');await page.getByRole('button',{name:'Export CSV',exact:true}).click();assert.match((await download).suggestedFilename(),/\.csv$/);assert.equal(await more().evaluate(e=>e===document.activeElement),true);
  // Filtered count retains the same row; empty results still expose count Info.
  const query=route==='bills/2027'?'SYNTHETIC':(await page.locator('.bill-row h2 a').first().getAttribute('href')).split('/').at(-1);await page.locator('#search').fill(query);await order();await page.locator('#search').fill('NO_MATCH_FOR_TOOLBAR');assert.equal(await info().isVisible(),true);assert.equal(await more().isVisible(),false);await info().click();await page.locator('.catalog-info[open] .floating-panel:popover-open').waitFor();await page.keyboard.press('Escape');
  await page.locator('#clear-search').click();await more().click();await page.evaluate(()=>{const r=document.querySelector('.export-menu summary').getBoundingClientRect();scrollBy(0,r.top-740)});await bounds();await page.keyboard.press('Escape');
  // Reparent the same controls on resize, restoring desktop locations and focus.
  await more().focus();await page.setViewportSize({width:1280,height:844});await page.locator('.copy-control>.export-menu').waitFor({state:'attached'});assert.equal(await page.locator('.copy-control>.export-menu').count(),1);assert.equal(await page.locator('.bill-toolbar .toolbar-info').count(),0);assert.equal(await more().evaluate(e=>e===document.activeElement),true);
  await page.setViewportSize({width:375,height:844});await page.locator('.sort-menu').waitFor({state:'visible'});await order();for(const trigger of [sort(),more()]){await trigger.click();await bounds();await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);await page.keyboard.press('Escape')}
 }
 assert.deepEqual(errors,[]);console.log('Mobile Bills toolbar: request/introduced fixtures, five widths/text/zoom, order/targets/focus, consolidated Info, separate Sort/More, Copy/CSV, resize and viewport-contained More menu passed.');
}finally{await browser.close()}
