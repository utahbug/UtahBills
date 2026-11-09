import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {affiliation} from '../review-party.js';
execFileSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['tests/review-party-data.py'],{stdio:'inherit'});
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const evidence=JSON.parse(await readFile('dist/review/review-party.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const [id,record]=Object.entries(evidence.records)[0];
assert.equal(affiliation(evidence,'2026',id,record.name),record.party);
for(const args of [[evidence,'2027',id,record.name],[evidence,'2026',id,'wrong'],[evidence,'2026','missing',record.name],[null,'2026',id,record.name]])assert.equal(affiliation(...args),'Unavailable');
await mkdir('test-results/review-party',{recursive:true});
for(const engine of [chromium,webkit].filter(e=>!process.env.ENGINE||e.name()===process.env.ENGINE)){const browser=await engine.launch();try{
 const page=await browser.newPage({viewport:{width:1280,height:1000}});const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error('Party browser error',page.url(),e.message)});
 const open=async()=>{if(!await page.locator('.directory-columns-menu').evaluate(e=>e.open))await page.locator('.directory-columns-menu>summary').click();await page.locator('[data-review-party]').waitFor({state:'visible'})};
 await page.goto(base+'review/#legislators');await page.locator('[data-review-party]').waitFor({state:'attached'});
 assert.equal(await page.locator('[data-review-party]').isChecked(),false);
 const original=await page.locator('.legislator-row h2 a').allTextContents();
 const links=await page.locator('.legislator-row a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent})));
 await open();await page.locator('[data-review-party]').focus();await page.keyboard.press('Space');await page.keyboard.press('Escape');
 await page.waitForFunction(()=>[...document.querySelectorAll('.review-party')].some(e=>e.textContent.includes('Republican')));
 assert.equal(await page.locator('.review-party:visible').count(),104);
 assert.deepEqual(await page.locator('.legislator-row a').evaluateAll(es=>es.map(e=>({href:e.getAttribute('href'),text:e.textContent}))),links);
 const cells=await page.locator('.review-party').allTextContents();assert.equal(cells.filter(s=>s.endsWith('Unavailable')).length,4);
 for(let bits=0;bits<8;bits++){
  await open();for(const [i,k]of ['bills','requests','district'].entries())await page.locator(`[data-column="${k}"]`).setChecked(Boolean(bits&(1<<i)));
  await page.keyboard.press('Escape');assert.deepEqual(await page.locator('.legislator-row h2 a').allTextContents(),original);
  const aligned=await page.evaluate(()=>{const h=document.querySelector('.review-party-heading').getBoundingClientRect(),c=document.querySelector('.review-party').getBoundingClientRect();return Math.abs(h.x+h.width/2-c.x-c.width/2)<2});assert.ok(aligned,'party heading/cell alignment '+bits);
 }
 await page.reload();await page.locator('.review-party').first().waitFor();assert.equal(await page.locator('[data-review-party]').isChecked(),true);
 await page.locator('#directory-session').selectOption('2027');assert.equal(await page.locator('.review-party').count(),0);assert.match(await page.locator('#directory-results').textContent(),/not been imported/);
 await page.locator('#directory-session').selectOption('2026');await open();await page.locator('.restore-columns').click();assert.equal(await page.locator('[data-review-party]').isChecked(),false);await page.keyboard.press('Escape');
 // Upgrade existing native preferences without changing their storage or defaults.
 await page.evaluate(()=>{localStorage.setItem('utahbills-directory-columns',JSON.stringify({bills:false,requests:true,district:true}));localStorage.removeItem('utahbills-review-party-column')});await page.reload();await page.locator('[data-review-party]').waitFor({state:'attached'});assert.equal(await page.locator('[data-column="bills"]').isChecked(),false);assert.equal(await page.locator('[data-column="district"]').isChecked(),true);assert.equal(await page.locator('[data-review-party]').isChecked(),false);
 await open();await page.locator('[data-review-party]').check();await page.keyboard.press('Escape');
 for(const width of [320,390,844,1280])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:1000});await page.emulateMedia({colorScheme:theme});
  for(const mode of ['normal','text','zoom']){
   await page.reload();await page.locator('.review-party').first().waitFor();
   await page.evaluate(mode=>{document.documentElement.style.fontSize=mode==='text'?'200%':'';document.documentElement.style.zoom=mode==='zoom'?'2':''},mode);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${engine.name()} ${width} ${mode}`);
   await open();await page.waitForTimeout(100);const rect=await page.locator('.directory-columns-menu .floating-panel').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=width+1,JSON.stringify({engine:engine.name(),width,theme,mode,rect}));assert.ok((await page.locator('[data-review-party]').locator('..').boundingBox()).height>=44);await page.keyboard.press('Escape');
  }
  await page.evaluate(()=>{document.documentElement.style.fontSize='';document.documentElement.style.zoom='';window.scrollTo(0,0)});await page.waitForTimeout(150);
  if(width===390||width===1280){await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);await page.screenshot({path:`test-results/review-party/${engine.name()}-${width}-${theme}.png`});await open();await page.waitForTimeout(100);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);await page.screenshot({path:`test-results/review-party/${engine.name()}-${width}-${theme}-menu.png`});await page.keyboard.press('Escape')}
 }
 await page.goto(base+'review/#requests');await page.locator('.bill-row').first().waitFor();assert.equal(await page.locator('.bill-row .request-classification').first().textContent(),'Bill request');assert.equal(await page.locator('.bill-row .topic:visible').count(),0);
 // A meaningful secondary suffix is retained, even under Bill request.
 await page.locator('.bill-row .topic').first().evaluate(e=>{e.textContent='Request · Analyzed example'});await page.locator('.bill-row .topic').first().waitFor({state:'visible'});
 await page.goto(base+'#requests');await page.locator('.bill-row').first().waitFor();assert.ok(await page.locator('.bill-row .topic:visible').count()>0);
 await page.goto(base+'#legislators');await page.locator('.legislator-row').first().waitFor();assert.equal(await page.locator('[data-review-party],.review-party').count(),0);
 assert.deepEqual(errors,[]);await page.close();
 const denied=await browser.newPage();await denied.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('blocked')}});await denied.route('**/review-party.json',r=>r.fulfill({status:503,body:'unavailable'}));await denied.goto(base+'review/#legislators');await denied.locator('.directory-columns-menu>summary').click();await denied.locator('[data-review-party]').check();assert.match(await denied.locator('.column-status').textContent(),/for this visit/);await denied.keyboard.press('Escape');assert.equal((await denied.locator('.review-party').allTextContents()).every(x=>x.endsWith('Unavailable')),true);await denied.close();
 const phone=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'});
 await phone.addInitScript(()=>localStorage.setItem('utahbills-review-party-column','true'));await phone.goto(base+'review/#legislators');await phone.locator('.review-party').first().waitFor();
 for(let i=0;i<2;i++){const expected=await phone.locator('.legislator-row h2 a').first().getAttribute('href');await phone.locator('.review-party').first().scrollIntoViewIfNeeded();const point=await phone.locator('.review-party').first().boundingBox();await phone.touchscreen.tap(point.x+point.width/2,point.y+point.height/2);await phone.waitForFunction(h=>location.hash===h,expected);await phone.goBack();await phone.locator('.review-party').first().waitFor();await phone.waitForTimeout(350)}
 const countTarget=await phone.locator('.request-count').first().getAttribute('href');await phone.locator('.request-count').first().tap();await phone.waitForFunction(h=>location.hash===h,countTarget);await phone.close();
 console.log(engine.name()+' Review Party/labels passed');
}finally{await browser.close()}}
