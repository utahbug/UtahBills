import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage(),base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
try {
 for(const width of [320,390,768,1280])for(const mode of ['normal','text','zoom'])for(const route of ['bills','calendar','legislators','activity','bill/HB0117','bill/HB0011','sources']) {
  await page.setViewportSize({width,height:900});await page.goto(base+'?phase4a='+width+mode+encodeURIComponent(route)+'#'+route);await page.locator('h1').waitFor();
  assert.equal(await page.locator('.notice').count(),0);
  assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
  assert.equal(await page.locator('footer .environment').count(),0);assert.match(await page.locator('footer').innerText(),/© 2026 UtahBug/);
  assert.doesNotMatch(await page.locator('body').innerText(),/research prototype/i);
  assert.equal(await page.locator('header').evaluate(e=>e.nextElementSibling.id),'main');
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  await page.evaluate(()=>scrollTo(0,0));
  const geometry=await page.evaluate(()=>{const header=document.querySelector('header').getBoundingClientRect(),main=document.querySelector('main'),first=main.firstElementChild.getBoundingClientRect();return {gap:first.top-header.bottom,padding:parseFloat(getComputedStyle(main).paddingTop),overflow:document.documentElement.scrollWidth>innerWidth}});
  assert.equal(geometry.padding,16);assert.ok(geometry.gap>=0&&geometry.gap<=44,JSON.stringify({route,width,mode,geometry}));assert.equal(geometry.overflow,false,route+' '+width+' '+mode);
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  if(mode==='normal'&&['bills','calendar','legislators','activity'].includes(route)&&[390,1280].includes(width))await page.screenshot({path:'test-results/phase4a-'+route+'-'+width+'.png'});
 }
 await page.setViewportSize({width:768,height:900});await page.goto(base+'?phase4a-font#bill/HB0011');await page.locator('.stages').waitFor();await page.addStyleTag({content:':root{font-family:Verdana,sans-serif}'});await page.evaluate(()=>document.documentElement.style.zoom=2);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Detail stages with wide font metrics at 200% zoom');
 await page.goto(base+'?phase4a-keyboard#bills');await page.locator('h1').waitFor();await page.keyboard.press('Tab');assert.equal(await page.locator('.skip').evaluate(e=>e===document.activeElement),true);await page.keyboard.press('Enter');assert.equal(await page.locator('#main').evaluate(e=>e===document.activeElement),true);
 console.log('Phase 4A: banner absent, compact heading geometry, compact footer, static noindex, keyboard, reflow, doubled text, 200% CSS zoom and axe passed.');
} finally {await browser.close()}
