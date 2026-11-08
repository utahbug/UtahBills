import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const top=process.env.UTAHBILLS_REVIEW_TOOLBAR==='top';
for(const [name,engine] of Object.entries({chromium,webkit})){
 const browser=await engine.launch();
 try{
 for(const viewport of [{width:320,height:700},{width:390,height:844},{width:844,height:390},{width:768,height:1024},{width:1280,height:800}]){
 const p=await browser.newPage({viewport,hasTouch:true,isMobile:true});p.setDefaultTimeout(15000);if(top)await p.addInitScript(()=>localStorage.setItem('utahbills-review-toolbar-position','top'));
 const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(base+'review/#requests');await p.locator('.bill-row').first().waitFor();
 const active=viewport.width<=700||viewport.height<=500;
 assert.equal(await p.locator('html').evaluate(e=>e.classList.contains('phone-navigation')),active);
 const nav=p.locator('header nav');assert.equal(await nav.locator('a').count(),4);
 if(active){
 assert.equal(await p.locator('header').evaluate(e=>getComputedStyle(e).position),top?'sticky':'static');
 for(const a of await nav.locator('a').all()){const box=await a.boundingBox();assert.ok(box.width>=44&&box.height>=44)}
 assert.equal(await nav.locator('[aria-current]').getAttribute('href'),'#bills');
 await p.evaluate(()=>scrollTo(0,600));if(top){const bar=await nav.boundingBox(),head=await p.locator('.header-inner').boundingBox();assert.ok(Math.abs(bar.y-head.y-head.height)<2);assert.ok(bar.y+bar.height<viewport.height)}else assert.ok((await nav.boundingBox()).y>=viewport.height-150);
 for(const [href,ready] of [['#activity','#activity-period'],['#calendar','.calendar'],['#legislators','.legislator-row']]){
 await nav.locator(`[href="${href}"]`).tap();await p.waitForFunction(h=>location.hash===h,href).catch(async error=>{console.error({engine:name,viewport,expected:href,actual:await p.evaluate(()=>location.hash),nav:await nav.boundingBox(),header:await p.locator('.header-inner').boundingBox()});throw error});
 await p.waitForFunction(h=>document.querySelector('header nav [aria-current]')?.getAttribute('href')===h,href);assert.equal(await nav.locator('[aria-current]').getAttribute('href'),href);
 }
 await p.locator('.legislator-row h2 a').first().tap();await p.waitForFunction(()=>location.hash.startsWith('#legislator/'));assert.equal(await nav.locator('[aria-current]').getAttribute('href'),'#legislators');
 await nav.locator('[href="#bills"]').tap();await p.locator('.bill-row').first().waitFor();
 await p.locator('#search').fill('At-Home Parent');await p.locator('#search').blur();
 await p.locator('.record-bookmark').tap();await p.locator('.saved-filter').tap();
 for(let i=0;i<8;i++){
 const a=p.locator('.bill-row h2 a').first(),href=await a.getAttribute('href');await a.scrollIntoViewIfNeeded();await p.waitForTimeout(100);await a.tap();await p.waitForFunction(h=>location.hash===h,href).catch(async error=>{console.error({engine:name,viewport,expected:href,actual:await p.evaluate(()=>location.hash),nav:await nav.boundingBox(),header:await p.locator('.header-inner').boundingBox()});throw error});await p.waitForFunction(()=>!document.querySelector('#search'));assert.equal(await nav.locator('[aria-current]').getAttribute('href'),'#bills');await p.goBack();await p.locator('.bill-row').first().waitFor();await p.waitForTimeout(100);
 }
 assert.equal(await p.locator('#search').inputValue(),'At-Home Parent');assert.equal(await p.locator('.saved-filter').getAttribute('aria-pressed'),'true');
 await p.goForward();await p.waitForFunction(()=>location.hash.startsWith('#request/')&&!document.querySelector('#search'));await p.goBack();await p.locator('.bill-row').first().waitFor();
 const copy=p.locator('.unified-copy > summary');assert.equal(await copy.count(),1);{await copy.tap();await p.getByRole('button',{name:'Copy titles only',exact:true}).waitFor();await p.keyboard.press('Escape')}
 if(viewport.width===390){
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{write:async()=>{},writeText:async()=>{}}}));
 for(const mode of ['Copy','Copy titles only','Copy titles + sponsors']){await copy.tap();await p.getByRole('button',{name:mode,exact:true}).tap();await p.waitForFunction(()=>document.querySelector('.sharing-status')?.textContent.startsWith('Copied 1'))}
 await p.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{write:async()=>{throw Error('denied')},writeText:async()=>{throw Error('denied')}}}));
 await copy.tap();await p.getByRole('button',{name:'Copy titles only',exact:true}).tap();await p.locator('.copy-fallback').waitFor();assert.match(await p.locator('.copy-fallback').inputValue(),/At-Home Parent/);await p.locator('.copy-fallback').blur();
 await copy.tap();const download=p.waitForEvent('download');await p.getByRole('button',{name:'Export CSV',exact:true}).tap();assert.match((await download).suggestedFilename(),/csv$/);
 }

 await p.locator('.saved-filter').tap();await p.locator('#clear-search').click();await p.goto(base+'review/#archive/2026');await p.locator('.bill-row').first().waitFor();await p.locator('.bill-row h2 a').first().tap();await p.waitForFunction(()=>location.hash.startsWith('#bill/')&&!document.querySelector('#search'));await nav.locator('[href="#bills"]').tap();await p.waitForFunction(()=>!document.querySelector('main h1')?.textContent.includes('2026 Legislative Archive'));await p.locator('.bill-row').first().waitFor();
 await p.emulateMedia({colorScheme:'dark'});await p.evaluate(()=>document.documentElement.style.fontSize='32px');
 assert.equal(await nav.evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
 await p.waitForTimeout(100);
 await p.evaluate(()=>scrollTo(0,document.body.scrollHeight));
 // Scrolling and ResizeObserver/frame-based reserved padding settle asynchronously in WebKit.
 // Keep the exact clearance requirement; do not sample before the scroll has painted.
 await p.waitForFunction(top=>{const footer=document.querySelector('footer').getBoundingClientRect(),bar=document.querySelector('header nav').getBoundingClientRect();return top?footer.bottom<=innerHeight+2:footer.bottom<=bar.top+2},top,{timeout:5000});
 const footer=await p.locator('footer').boundingBox(),bar=await nav.boundingBox();assert.ok(footer.y+footer.height<=(top?viewport.height:bar.y)+2,`footer clears navigation: ${name} ${JSON.stringify({viewport,footer,bar})}`);
 await p.keyboard.press('Tab');await nav.locator('a').first().focus();assert.notEqual(await nav.locator('a').first().evaluate(e=>getComputedStyle(e).outlineStyle),'none');
 // Controlled visual viewport reduction tests the keyboard branch, not native iOS keyboard behavior.
 await p.evaluate(()=>{document.documentElement.style.fontSize='';const input=document.querySelector('#search');input.focus();Object.defineProperty(visualViewport,'height',{configurable:true,value:innerHeight*.5});visualViewport.dispatchEvent(new Event('resize'))});
 assert.equal(await nav.evaluate(e=>getComputedStyle(e).visibility),'hidden');await p.locator('#search').blur();await p.waitForFunction(()=>getComputedStyle(document.querySelector('header nav')).visibility==='visible');assert.equal(await nav.evaluate(e=>getComputedStyle(e).visibility),'visible');
 }else {assert.equal(await p.locator('header').evaluate(e=>getComputedStyle(e).position),'sticky');for(const icon of await nav.locator('.phone-nav-icon').all())assert.equal(await icon.isVisible(),true)}
 const hash=new URL(p.url()).hash;await p.setViewportSize({width:844,height:390});await p.waitForFunction(()=>document.documentElement.classList.contains('phone-navigation'));assert.equal(new URL(p.url()).hash,hash);assert.equal(await p.locator('html').evaluate(e=>e.classList.contains('phone-navigation')),true);assert.deepEqual(errors,[]);await p.close();
 }
 const main=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,isMobile:true});await main.goto(base+'#requests');await main.locator('.bill-row').first().waitFor();assert.equal(await main.locator('header').evaluate(e=>getComputedStyle(e).position),'static');assert.equal(await main.locator('.phone-nav-icon').count(),4);await main.close();
 console.log(name+': Review '+(top?'Top':'Bottom')+' toolbar; portrait/landscape, tablet/desktop isolation, details, 24 repeated taps, history, saved search, archive return, text/dark/focus/footer/keyboard branch passed');
 }finally{await browser.close()}
}


