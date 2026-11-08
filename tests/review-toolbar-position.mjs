import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/',key='utahbills-review-toolbar-position';
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');await mkdir('test-results/review-toolbar-position',{recursive:true});
for(const engine of [chromium,webkit]){const b=await engine.launch();try{
 for(const viewport of [{width:320,height:700},{width:375,height:812},{width:390,height:844},{width:430,height:932},{width:844,height:390}])for(const theme of ['light','dark']){
  const p=await b.newPage({viewport,hasTouch:true,isMobile:true,colorScheme:theme});await p.goto(base+'review/#requests');await p.locator('.bill-row').first().waitFor();
  await p.evaluate(()=>{window.originalPhoneNav=document.querySelector('header nav');window.originalPhoneLinks=[...originalPhoneNav.children]});
  assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),'bottom');
  for(const position of ['top','bottom','top']){
   await p.getByRole('button',{name:'Settings',exact:true}).tap();const row=p.getByRole('group',{name:'Toolbar position'});assert.ok(await row.isVisible());
   await row.getByRole('button',{name:position==='top'?'Top':'Bottom',exact:true}).tap();await p.waitForFunction(pos=>document.documentElement.dataset.reviewToolbar===pos,position);
   assert.equal(await row.getByRole('button',{name:position==='top'?'Top':'Bottom',exact:true}).getAttribute('aria-pressed'),'true');
   assert.equal(await p.locator('header nav').count(),1);assert.equal(await p.locator('header nav a').count(),4);assert.ok(await p.evaluate(()=>originalPhoneNav===document.querySelector('header nav')&&originalPhoneLinks.every((a,i)=>a===originalPhoneNav.children[i])));
   const buttons=await row.locator('button').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {width:r.width,height:r.height,y:r.y}}));assert.ok(buttons.every(r=>r.width>=44&&r.height>=44));assert.equal(buttons[0].y,buttons[1].y);
   await p.keyboard.press('Escape');await p.waitForFunction(()=>!document.querySelector('#review-settings').matches(':popover-open'));
   if(position==='top'){const nav=await p.locator('header nav').boundingBox(),head=await p.locator('.header-inner').boundingBox(),main=await p.locator('main').boundingBox();assert.ok(Math.abs(nav.y-head.y-head.height)<2);assert.ok(main.y>=nav.y+nav.height-1);await p.evaluate(()=>scrollTo(0,600));await p.waitForTimeout(100);assert.ok((await p.locator('header nav').boundingBox()).y>=0)}
   else assert.ok((await p.locator('header nav').boundingBox()).y>=viewport.height-150);
   await p.evaluate(()=>scrollTo(0,0));
  }
  await p.reload();await p.locator('.bill-row').first().waitFor();assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),'top');assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),'top');
  await p.evaluate(axe);assert.deepEqual((await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  if(viewport.width===390){await p.screenshot({path:`test-results/review-toolbar-position/${engine.name()}-top-${theme}.png`});await p.getByRole('button',{name:'Settings',exact:true}).tap();await p.waitForFunction(()=>document.activeElement.id==='review-theme-toggle');await p.screenshot({path:`test-results/review-toolbar-position/${engine.name()}-settings-${theme}.png`});await p.keyboard.press('Escape')}
  if(viewport.width===390){await p.getByRole('button',{name:'Settings',exact:true}).click();await p.waitForFunction(()=>document.activeElement.id==='review-theme-toggle');const group=p.getByRole('group',{name:'Toolbar position'});await group.getByRole('button',{name:'Bottom',exact:true}).focus();await p.keyboard.press('Space');assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),'bottom');await group.getByRole('button',{name:'Top',exact:true}).focus();await p.keyboard.press('Enter');assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),'top');await p.keyboard.press('Escape')}
  await p.setViewportSize({width:768,height:1024});await p.waitForFunction(()=>!document.documentElement.classList.contains('phone-navigation'));assert.equal(await p.locator('#review-toolbar-position').isVisible(),false);assert.equal(await p.locator('header>.header-inner>nav').count(),1);
  await p.setViewportSize({width:390,height:844});await p.waitForFunction(()=>document.documentElement.classList.contains('phone-navigation'));assert.equal(await p.locator('header>nav').count(),1);assert.equal(await p.locator('html').getAttribute('data-review-toolbar'),'top');await p.close();
 }
 const blocked=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await blocked.addInitScript(()=>{Storage.prototype.getItem=function(){throw Error('blocked')};Storage.prototype.setItem=function(){throw Error('blocked')}});await blocked.goto(base+'review/');await blocked.locator('.bill-row').first().waitFor();await blocked.getByRole('button',{name:'Settings',exact:true}).tap();await blocked.getByRole('button',{name:'Top',exact:true}).tap();assert.equal(await blocked.locator('html').getAttribute('data-review-toolbar'),'top');assert.match(await blocked.locator('#review-settings').innerText(),/Dark\/Light/);assert.ok(await blocked.locator('#review-settings [role=status]').last().textContent().then(s=>s.includes('could not save')));await blocked.close();
 const main=await b.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await main.addInitScript(k=>localStorage.setItem(k,'top'),key);await main.goto(base);await main.locator('.bill-row').first().waitFor();assert.equal(await main.locator('#review-toolbar-position').count(),0);assert.equal(await main.locator('html').getAttribute('data-review-toolbar'),null);assert.equal(await main.locator('header').evaluate(e=>getComputedStyle(e).position),'static');await main.close();
}finally{await b.close()}}
console.log('Review toolbar preference: both engines/themes, portrait/landscape, immediate switching, one original nav, persistence, blocked storage, tablet/Main isolation and axe passed.');
// Reuse the established phone regression in Top mode; its normal invocation retains Bottom coverage.
process.env.UTAHBILLS_REVIEW_TOOLBAR='top';await import('./review-navigation.mjs');
