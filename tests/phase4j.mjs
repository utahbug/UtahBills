import {copyResults,copyControl} from './fixtures/copy-results.mjs';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage({reducedMotion:'reduce'}),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async t=>window.copied=t}}));
await mkdir('test-results/phase4j',{recursive:true});
try{
 for(const width of [320,375,390,430,600,768,1024,1280])for(const mode of ['normal','text','zoom'])for(const route of ['activity','legislators','calendar']){
  await page.setViewportSize({width,height:1000});await page.goto(base+'?polish='+width+mode+route+'#'+route);await copyControl(page).waitFor();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${route} ${width} ${mode}`);
  if(route==='activity'){
   assert.equal(await page.locator('#activity-period').getAttribute('aria-label'),'Activity date range');assert.equal(await page.locator('#activity-category').getAttribute('aria-label'),'Activity category');assert.match(await page.locator('label:has(#activity-category)').innerText(),/^Category:/);
   const heading=await page.locator('h1').boundingBox(),period=await page.locator('#activity-period').boundingBox();assert.ok(Math.abs(heading.x-period.x)<2);assert.equal(await page.locator('#activity-period').evaluate(e=>getComputedStyle(e).paddingLeft),'0px');
  }else if(route==='legislators'){
   assert.equal(await page.locator('#directory-count').innerText(),'104 legislators');assert.equal(await page.locator('details.find-legislators').count(),0);assert.equal(await page.locator('a.find-legislators').getAttribute('href'),'https://le.utah.gov/GIS/findDistrict.jsp');
   await page.locator('#directory-chamber').selectOption('S');assert.equal(await page.locator('#directory-count').innerText(),(await page.locator('.legislator-row').count())+' legislators');await page.locator('#directory-chamber').selectOption('');
  }else{
   assert.equal(await page.locator('#calendar-month').getAttribute('aria-label'),'Calendar month');assert.match(await page.locator('label:has(#calendar-type)').innerText(),/^Event:/);
   const copy=await copyControl(page).boundingBox(),legend=await page.getByRole('button',{name:'Calendar Legend',exact:true}).boundingBox();assert.ok(Math.abs(copy.y-legend.y)<2);assert.ok(Math.abs(legend.x+legend.width-copy.x)<2);
  }
  if(route!=='activity'){
   const trigger=page.locator(route==='calendar'?'.agenda-heading .toolbar-info':'.directory-search-tools .toolbar-info'),panel=page.locator(route==='calendar'?'#calendar-category-legend':'#directory-info');
   await trigger.focus();await page.keyboard.press('Enter');await panel.waitFor({state:'visible'});const rect=await panel.boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=width+1&&rect.y>=0);
   if(route==='calendar'){assert.deepEqual(await panel.locator('.calendar-key').allTextContents(),['M','F','S','D','C','O']);assert.match(await panel.innerText(),/Committee \/ commission/)}else{assert.match(await panel.innerText(),/Introduced bills: Saved 2027 General Session House\/Senate bills/);assert.match(await panel.innerText(),/not requests, resolutions or additional versions/);assert.match(await panel.innerText(),/sponsorship does not establish membership/);assert.match(await panel.innerText(),/Verified 2026 records/)}
   await page.keyboard.press('Escape');await panel.waitFor({state:'hidden'});assert.equal(await trigger.evaluate(e=>e===document.activeElement),true);
   await trigger.click();await panel.locator('.popover-close').click();await panel.waitFor({state:'hidden'});
   await copyResults(page);await page.waitForFunction(()=>!document.querySelector('.copy-results')?.disabled);assert.ok(await page.evaluate(()=>window.copied?.length>0));
  }
  await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>scrollY===0&&!document.querySelector('header.navigation-compact'));
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[],`${route} ${width} ${mode}`);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:`test-results/phase4j/${route}-${width}.png`});
 }
 const touch=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 await touch.route('**/data/calendar-ui.json',async r=>{const data=JSON.parse(await readFile('dist/data/calendar-ui.json','utf8'));data.events=[];await r.fulfill({json:data})});
 const phone=await touch.newPage();await phone.goto(base+'#calendar');const legend=phone.getByRole('button',{name:'Calendar Legend',exact:true});await legend.tap();await phone.locator('#calendar-category-legend').waitFor({state:'visible'});assert.equal(await phone.locator('.copy-results').isVisible(),false);await phone.screenshot({path:'test-results/phase4j/legend-375.png'});await phone.locator('h1').tap();await phone.locator('#calendar-category-legend').waitFor({state:'hidden'});await touch.close();
 console.log('Phase 4J: compact filters, directory count/finder, Calendar Legend, keyboard dismissal, Copy, 8 widths, doubled text, 200% CSS zoom and axe passed.');
}finally{await browser.close()}
