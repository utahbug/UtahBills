import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/',key='utahbills-review-toolbar-position';
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');await mkdir('test-results/review-toolbar-position',{recursive:true});
for(const engine of [chromium,webkit]){const browser=await engine.launch();try{
 for(const [device,viewport,expected] of [['iPhone 13',{width:390,height:844},'top'],['iPhone 13',{width:844,height:390},'top'],['iPad Mini',{width:600,height:900},'bottom'],['iPad Mini',{width:900,height:500},'bottom']])for(const theme of ['light','dark'])for(const saved of [null,'top','bottom']){
 const p=await browser.newPage({...devices[device],viewport,colorScheme:theme});if(saved)await p.addInitScript(([k,v])=>{if(localStorage.getItem(k)===null)localStorage.setItem(k,v)},[key,saved]);
 await p.goto(base+'review/');await p.locator('.bill-row').first().waitFor();assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),saved||expected,engine.name()+' '+device+' '+JSON.stringify(viewport)+' saved='+saved);
 await p.evaluate(()=>{window.originalNav=document.querySelector('header nav');window.originalLinks=[...originalNav.children]});
 for(const route of ['requests','activity','calendar','legislators']){
 await p.goto(base+'review/#'+route);await p.locator('main h1').waitFor();await p.waitForFunction(()=>document.querySelector('#review-settings-trigger'));
 await p.locator('#review-settings-trigger').click();await p.waitForFunction(()=>document.activeElement.id==='review-theme-toggle');
 const button=p.locator('#review-toolbar-position'),before=await p.locator('html').getAttribute('data-review-toolbar');assert.ok(await button.isVisible());assert.equal(await button.getAttribute('aria-label'),'Move toolbar to '+(before==='top'?'Bottom':'Top'));
 const target=await button.boundingBox();assert.ok(target.width>=44&&target.height>=44);await button.focus();await p.keyboard.press('Space');assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),before==='top'?'bottom':'top');await p.keyboard.press('Escape');
 // Force both positions using the real action and verify scrolled banner/bar geometry.
 for(const position of ['bottom','top']){
 await p.evaluate(()=>scrollTo(0,0));if(await p.locator('html').getAttribute('data-review-toolbar')!==position){await p.locator('#review-settings-trigger').click();await button.click();await p.keyboard.press('Escape')}
 await p.evaluate(()=>scrollTo(0,600));await p.waitForTimeout(80);const nav=await p.locator('header nav').boundingBox(),banner=await p.locator('.header-inner').boundingBox();
 assert.equal(await p.locator('header nav').count(),1);assert.equal(await p.locator('header nav a').count(),4);
 if(await p.evaluate(()=>scrollY)>100)assert.ok(banner.y+banner.height<=1,'Banner scrolls away');
 if(position==='top')assert.ok(nav.y>=-1&&nav.y<2,'Top toolbar remains at viewport top');else assert.ok(nav.y>=viewport.height-160);
 }
 await p.evaluate(()=>scrollTo(0,0));
 }
 if(saved===null&&viewport.width===390){
 await p.evaluate(()=>{window.keptNav=document.querySelector('header nav');window.keptLinks=[...keptNav.children]});
 await p.locator('#review-settings-trigger').click();await p.waitForFunction(()=>document.activeElement.id==='review-theme-toggle');await p.evaluate(()=>scrollTo(0,500));await p.waitForTimeout(60);
 const before=await p.locator('main').boundingBox();await p.locator('#review-toolbar-position').click();const after=await p.locator('main').boundingBox();assert.ok(Math.abs(before.y-after.y)<=2,'Switch while scrolled preserves content location');
 assert.ok(await p.evaluate(()=>keptNav===document.querySelector('header nav')&&keptLinks.every((a,i)=>a===keptNav.children[i])));await p.locator('#review-toolbar-position').click();await p.keyboard.press('Escape');await p.evaluate(()=>scrollTo(0,0));
 }
 await p.reload();await p.locator('main h1').waitFor();assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),'top');
 await p.setViewportSize({width:1024,height:768});await p.waitForFunction(()=>!document.documentElement.classList.contains('phone-navigation'));await p.locator('#review-settings-trigger').click();assert.equal(await p.locator('#review-toolbar-position').isVisible(),false);assert.equal(await p.locator('header>.header-inner>nav').count(),1);await p.keyboard.press('Escape');
 await p.setViewportSize(viewport);await p.waitForFunction(()=>document.documentElement.classList.contains('phone-navigation'));assert.equal(await p.locator('header>nav').count(),1);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),'top');
 if(saved===null&&viewport.width===390){await p.evaluate(axe);assert.deepEqual((await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);await p.screenshot({path:`test-results/review-toolbar-position/${engine.name()}-top-${theme}.png`})}
 await p.close();
 }
 const blocked=await browser.newPage({...devices['iPhone 13']});await blocked.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')}});await blocked.goto(base+'review/');await blocked.locator('.bill-row').first().waitFor();assert.equal(await blocked.locator('html').getAttribute('data-review-toolbar'),'top');await blocked.locator('#review-settings-trigger').click();await blocked.locator('#review-toolbar-position').click();assert.equal(await blocked.locator('html').getAttribute('data-review-toolbar'),'bottom');assert.match(await blocked.locator('#review-toolbar-status').textContent(),/could not save/);await blocked.setViewportSize({width:400,height:844});await blocked.waitForTimeout(100);assert.match(await blocked.locator('#review-toolbar-status').textContent(),/could not save/);await blocked.close();
 for(const width of [390,1280]){const p=await browser.newPage({viewport:{width,height:900},hasTouch:false});await p.goto(base+'review/');await p.locator('.bill-row').first().waitFor();await p.locator('#review-settings-trigger').click();assert.equal(await p.locator('#review-toolbar-position').isVisible(),false);await p.close()}
 const main=await browser.newPage({...devices['iPhone 13']});await main.goto(base);await main.locator('.bill-row').first().waitFor();assert.equal(await main.locator('#review-toolbar-position').count(),0);assert.equal(await main.locator('header').evaluate(e=>getComputedStyle(e).position),'static');await main.close();
}finally{await browser.close()}}
console.log('Review toolbar: iPhone Top/iPad Bottom defaults, saved overrides, all four routes/positions, banner scroll, persistence, blocked storage, tablet/desktop/Main isolation, keyboard, themes and axe passed.');
process.env.UTAHBILLS_REVIEW_TOOLBAR='top';await import('./review-navigation.mjs');
