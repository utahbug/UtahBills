import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const catalog=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
await mkdir('test-results/header',{recursive:true});
async function ready(route){
 await page.locator('main h1').waitFor();
 if(route==='#requests')await page.locator('.bill-row').first().waitFor();
 if(route==='#activity'){await page.locator('#activity-period').selectOption('all');await page.locator('.activity-row').first().waitFor()}
 if(route==='#calendar')await page.locator('.calendar-day').first().waitFor();
 if(route==='#legislators')await page.locator('.legislator-row').first().waitFor();
}
async function check(){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'page overflow');
 const result=await page.locator('header').evaluate(header=>{
  const box=header.getBoundingClientRect(),links=[...header.querySelectorAll('nav a')],brand=header.querySelector('.brand').getBoundingClientRect();
  return {top:box.top,position:getComputedStyle(header).position,links:links.map(a=>{const r=a.getBoundingClientRect();return {href:a.hash,height:r.height,inside:r.left>=box.left&&r.right<=box.right+1&&r.top>=box.top&&r.bottom<=box.bottom+1,overlap:r.left<brand.right&&r.right>brand.left&&r.top<brand.bottom&&r.bottom>brand.top}})};
 });
 assert.ok(Math.abs(result.top)<1,'header stays at viewport top');assert.equal(result.position,'sticky');
 assert.deepEqual(result.links.map(l=>l.href),['#bills','#activity','#calendar','#legislators']);
 for(const link of result.links){assert.ok(link.inside,'navigation contained');assert.ok(!link.overlap,'wordmark/navigation do not overlap');assert.ok(link.height>=44,'touch target')}
}
async function scroll(position){await page.evaluate(p=>window.scrollTo(0,p==='top'?0:p==='mid'?(document.documentElement.scrollHeight-innerHeight)/2:document.documentElement.scrollHeight),position);await page.waitForTimeout(100);await check()}
try{
 // Every shared route: top, middle, bottom and return; includes short pages.
 const routes=['#requests','#activity','#calendar','#legislators','#about','#faq','#request/XKUCMCIIHJ','#bill/HB0117','#legislator/'+catalog.legislators[0].id+'/2026'];
 for(const width of [390,1280]){
  await page.setViewportSize({width,height:720});
  for(const route of routes){
   await page.goto(base+route);await ready(route);await scroll('top');assert.equal(await page.locator('header.navigation-compact').count(),0);
   const normal=(await page.locator('header').boundingBox()).height;
   await scroll('mid');await scroll('bottom');
   if(await page.evaluate(()=>scrollY>48)){assert.equal(await page.locator('header.navigation-compact').count(),1);assert.ok((await page.locator('header').boundingBox()).height<normal,'compact header is shorter')}
   await scroll('top');assert.equal(await page.locator('header.navigation-compact').count(),0);
  }
 }
 // Width/text/zoom changes, then actual navigation while scrolled.
 for(const width of [320,375,390,430,600,768,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await page.goto(base+'#requests');await page.reload();await ready('#requests');
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  await scroll('top');await scroll('mid');assert.equal(await page.locator('header.navigation-compact').count(),1);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:`test-results/header/scrolled-${width}.png`});
  await page.locator('header a[href="#activity"]').click();await ready('#activity');await page.waitForFunction(()=>scrollY===0);await check();assert.equal(await page.locator('header.navigation-compact').count(),0);
  await scroll('bottom');await page.locator('header a[href="#activity"]').focus();await page.keyboard.press('Tab');assert.equal(await page.locator('header a[href="#calendar"]').evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
  await page.keyboard.press('Enter');await ready('#calendar');await page.waitForFunction(()=>scrollY===0);await check();
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
 }
 await page.goto(base+'#faq/questions');await page.locator('#about-faq').waitFor();await page.waitForTimeout(100);
 assert.ok(await page.locator('#about-faq h2').evaluate(e=>e.getBoundingClientRect().top>=document.querySelector('header').getBoundingClientRect().bottom),'section heading clear of header');
 await page.locator('.skip').focus();assert.ok(await page.locator('.skip').evaluate(e=>e.getBoundingClientRect().top>=0));
 assert.deepEqual(errors,[]);console.log('Shared header: nine routes at top/middle/bottom, seven widths, doubled text, 200% CSS zoom, scrolled navigation, visible keyboard focus, anchor offsets and axe passed.');
}finally{await browser.close()}
