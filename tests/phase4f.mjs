import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage(),external=[],errors=[];
page.on('request',r=>{if(!r.url().startsWith(base))external.push(r.url())});page.on('pageerror',e=>errors.push(e.message));
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
await mkdir('test-results/phase4f',{recursive:true});
try{
 await page.goto(base+'#legislators');await page.locator('.legislator-row').first().waitFor();
 const storage=await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage},cookie:document.cookie}));
 const summary=page.locator('.directory-actions .toolbar-info');await summary.focus();await page.keyboard.press('Enter');
 const finder=page.locator('#directory-info'),link=page.locator('a.find-legislators');
 assert.equal(await link.getAttribute('href'),'https://le.utah.gov/GIS/findDistrict.jsp');assert.equal(await link.getAttribute('target'),'_blank');assert.match(await link.getAttribute('rel'),/noreferrer/);
 assert.match(await finder.innerText(),/UtahBug does not receive it/);assert.match(await finder.innerText(),/verified 2027 membership is unavailable/);
 assert.equal(await finder.locator('input,textarea,form,iframe').count(),0);
 await page.keyboard.press('Escape');
 // Intercept the external navigation: no address is sent; remote service results are not simulated.
 await page.context().route('https://le.utah.gov/GIS/findDistrict.jsp',r=>r.fulfill({contentType:'text/html',body:'<title>External navigation test</title>'}));
 const popupPromise=page.waitForEvent('popup');await link.click();const popup=await popupPromise;await popup.waitForLoadState();assert.equal(popup.url(),'https://le.utah.gov/GIS/findDistrict.jsp');await popup.close();
 assert.equal(await page.locator('.legislator-row').count(),104);
 await page.locator('#directory-search').fill('Adams');await page.locator('.legislator-row h2 a').first().click();await page.locator('a.back').click();assert.equal(await page.locator('#directory-search').inputValue(),'Adams');await page.locator('#directory-search').fill('');
 await page.locator('#directory-session').selectOption('2027');assert.match(await page.locator('#directory-results').innerText(),/not been imported/);assert.equal(await page.locator('.legislator-row').count(),0);await page.locator('#directory-session').selectOption('2026');
 assert.deepEqual(await page.evaluate(()=>({local:{...localStorage},session:{...sessionStorage},cookie:document.cookie})),storage);
 for(const width of [320,375,390,430,600,768,900,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await page.goto(base+'#legislators');await page.locator('.find-legislators').waitFor();await page.reload();await page.locator('.directory-actions .toolbar-info').click();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width} ${mode}`);
  for(const selector of ['.directory-actions .toolbar-info','a.find-legislators'])assert.ok((await page.locator(selector).boundingBox()).height>=44);
  await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:`test-results/phase4f/directory-${width}.png`,fullPage:false});
 }
 const touch=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true}),phone=await touch.newPage();await phone.goto(base+'#legislators');await phone.locator('.directory-actions .toolbar-info').tap();assert.equal(await phone.locator('#directory-info').isVisible(),true);await phone.locator('#directory-info .popover-close').tap();assert.equal(await phone.locator('#directory-info').isVisible(),false);await touch.close();
 assert.deepEqual(external,[]);assert.deepEqual(errors,[]);
 console.log('Phase 4F: official-link fallback, privacy, membership limits, directory return, keyboard/touch, 8 widths, doubled text, CSS 200% zoom and axe passed. Address resolution is not implemented or claimed.');
}finally{await browser.close()}
