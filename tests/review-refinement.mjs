import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
await mkdir('test-results/review-refinement',{recursive:true});
for(const engine of [chromium,webkit]){
 const browser=await engine.launch();
 try{
  const reference=await browser.newPage(),icons={};await reference.goto(base);await reference.locator('header .header-contact svg').waitFor();
  for(const theme of ['light','dark']){await reference.emulateMedia({colorScheme:theme});await reference.waitForFunction(t=>document.documentElement.dataset.theme===t,theme);icons[theme]=await reference.locator('header .header-contact svg').evaluate(e=>{const s=getComputedStyle(e);return {markup:e.outerHTML,width:s.width,height:s.height,padding:s.padding,border:s.border,borderRadius:s.borderRadius,strokeWidth:s.strokeWidth,color:s.color}})}await reference.close();
  for(const viewport of [{width:320,height:700},{width:390,height:844},{width:844,height:390},{width:1280,height:900}])for(const theme of ['light','dark']){
   const phone=viewport.width<700||viewport.height<500;
   const p=await browser.newPage({viewport,hasTouch:phone,isMobile:phone,colorScheme:theme});
   for(const [route,ready] of [['requests','.bill-row'],['activity','#activity-results'],['calendar','.calendar-controls'],['legislators','.legislator-row']]){
    await p.goto(base+'review/#'+route);await p.locator(ready).first().waitFor();
    if(route==='activity')await p.locator('#activity-period').selectOption('thirty');
    const expected=theme==='dark'?'rgb(24, 33, 43)':phone&&['activity','calendar'].includes(route)?'rgb(255, 255, 255)':'rgb(238, 243, 247)';
    assert.equal(await p.locator('html').evaluate(e=>getComputedStyle(e).backgroundColor),expected,route+' '+viewport.width+' '+theme);
    assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
    const link=p.locator('header nav a[href="#activity"]');assert.equal((await link.innerText()).trim(),phone?'Recent':'Recent Activity');
    assert.equal(await link.locator('svg').count(),1);assert.equal(await p.locator('header nav a').count(),4);
    await p.evaluate(axe);assert.deepEqual((await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
    if(viewport.width===390)await p.screenshot({path:`test-results/review-refinement/${engine.name()}-${route}-${theme}.png`});
   }
   const trigger=p.getByRole('button',{name:'Settings',exact:true});await trigger.focus();await p.keyboard.press('Enter');await p.waitForFunction(()=>document.querySelector('#review-settings-trigger').getAttribute('aria-expanded')==='true');
   assert.equal(await p.locator('#review-settings h2,#review-settings details').count(),0);
   const icon=p.locator('#review-settings a[href="#contact"] svg');assert.equal(await icon.count(),1);assert.equal(await p.locator('header .header-contact svg').count(),0);assert.equal(await p.locator('header .header-contact').isVisible(),false);
   assert.deepEqual(await icon.evaluate(e=>{const s=getComputedStyle(e);return {markup:e.outerHTML,width:s.width,height:s.height,padding:s.padding,border:s.border,borderRadius:s.borderRadius,strokeWidth:s.strokeWidth,color:s.color}}),icons[theme]);
   const starts=await p.locator('#review-settings label,#review-settings>a').evaluateAll(es=>es.map(e=>{const text=[...e.childNodes].find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());const range=document.createRange();range.selectNodeContents(text);return range.getBoundingClientRect().x}));assert.ok(Math.max(...starts)-Math.min(...starts)<1,'Aligned labels');
   if(viewport.width===390)await p.screenshot({path:`test-results/review-refinement/${engine.name()}-contact-menu-${theme}.png`});
   const label=await p.locator('#review-settings label').boundingBox(),select=await p.locator('#review-appearance').boundingBox();assert.ok(label.x+label.width<=select.x);assert.ok(Math.abs(label.y+label.height/2-select.y-select.height/2)<2);
   assert.equal(await p.locator('#review-appearance option[value=device]').innerText(),'System');
   for(const href of ['#contact','#about','#faq']){await p.keyboard.press('Tab');assert.equal(await p.evaluate(()=>document.activeElement.getAttribute('href')),href)}
   await p.keyboard.press('Escape');await p.waitForFunction(()=>document.activeElement.id==='review-settings-trigger');
   await trigger.click();await p.locator('main h1').click();await p.waitForFunction(()=>!document.querySelector('#review-settings').matches(':popover-open'));
   await p.locator('header nav a[href="#activity"]').click();await p.locator('#activity-results').waitFor();assert.equal(await p.locator('header nav [aria-current]').getAttribute('href'),'#activity');
   await p.goBack();await p.locator('.legislator-row').first().waitFor();await p.close();
  }
  const p=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
  await p.addInitScript(()=>{Storage.prototype.setItem=function(){throw Error('blocked storage')}});
  await p.goto(base+'review/');await p.locator('.bill-row').first().waitFor();await p.getByRole('button',{name:'Settings',exact:true}).click();await p.locator('#review-appearance').selectOption('dark');assert.equal(await p.locator('html').getAttribute('data-theme'),'dark');assert.match(await p.locator('#review-settings [role=status]').innerText(),/could not save/);await p.close();
 }finally{await browser.close()}
}
console.log('Review refinement: phone/desktop route-specific backgrounds, unchanged dark palette, Recent destination/icon/history, aligned compact Settings, keyboard order/Escape/light dismissal, blocked storage, screenshots and axe passed in Chromium/WebKit.');
