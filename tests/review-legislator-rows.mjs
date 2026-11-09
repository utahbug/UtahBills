import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
await mkdir('test-results/review-legislator-rows',{recursive:true});
for(const engine of [chromium,webkit].filter(e=>!process.env.ENGINE||e.name()===process.env.ENGINE)){const browser=await engine.launch();try{
 for(const [width,height,touch] of [[390,844,true],[844,390,true],[820,1180,true],[1180,820,true],[1280,900,false]].filter(v=>!process.env.WIDTH||v[0]===Number(process.env.WIDTH))){
  for(const theme of ['light','dark'].filter(t=>!process.env.THEME||t===process.env.THEME)){
  const page=await browser.newPage({viewport:{width,height},hasTouch:touch,isMobile:touch,...([390,844].includes(width)?{userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'}:{})});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')console.error('BROWSER CONSOLE',m.text())});
   await page.emulateMedia({colorScheme:theme});await page.goto(base+'review/#legislators');
   await page.evaluate(()=>{window.tapEvents=[];for(const k of ['pointerdown','pointerup','click','touchcancel'])document.addEventListener(k,e=>{tapEvents.push([k,e.target.outerHTML.slice(0,220)]);if(tapEvents.length>18)tapEvents.shift();if(k==='click')queueMicrotask(()=>tapEvents.push(['after-click',e.defaultPrevented,e.target.isConnected,e.target.closest('a')?.getAttribute('href'),location.hash]))},true)});
   const row=page.locator('.legislator-row').first(),name=row.locator('h2 a');await row.waitFor();
   assert.equal(await row.locator('a a,[tabindex]').count(),0);
   assert.equal(await name.evaluate(e=>getComputedStyle(e,'::after').position),'absolute');
   const target=await name.getAttribute('href');
   // Separate touch gestures and completed history transitions (avoid native double-tap cadence).
   const settled=async()=>{await page.waitForFunction(()=>location.hash==='#legislators'&&document.querySelector('main h1')?.textContent==='Legislators');await row.waitFor();await page.waitForTimeout(350)};
   const arrived=async href=>{try{await page.waitForFunction(h=>location.hash===h&&!document.querySelector('.legislator-row'),href);await page.locator('main h1').waitFor();await page.waitForTimeout(350)}catch(error){await page.screenshot({path:'test-results/review-legislator-rows/failure.png'});console.error({engine:engine.name(),width,theme,expected:href,actual:page.url(),heading:await page.locator('main h1').textContent(),events:await page.evaluate(()=>tapEvents)});throw error}};
   for(let attempt=0;attempt<3;attempt++){
    await row.scrollIntoViewIfNeeded();const r=await row.boundingBox();assert.ok(r.height>=44);
    const point={x:r.x+r.width-3,y:r.y+3};
    assert.equal(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.closest('a')?.getAttribute('href'),point),target);
    if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
    await arrived(target);
    await page.goBack();await settled();await page.goForward();await arrived(target);await page.goBack();await settled();
   }
   for(let mask=0;mask<8;mask++){
    await page.locator('.directory-columns-menu>summary').click();
    for(const [i,key] of ['bills','requests','district'].entries())await page.locator('[data-column="'+key+'"]').setChecked(Boolean(mask&(1<<i)));
    await page.keyboard.press('Escape');await page.waitForTimeout(350);await row.scrollIntoViewIfNeeded();assert.ok((await row.boundingBox()).height>=44);
    for(const link of await row.locator('.directory-counts>a:visible').all()){
     const href=await link.getAttribute('href');if(touch)await link.tap();else await link.click();await arrived(href);await page.goBack();await settled();
    }
   }
   await page.keyboard.press('Tab');await name.focus();assert.notEqual(await row.evaluate(e=>getComputedStyle(e).boxShadow),'none');assert.equal(await name.evaluate(e=>getComputedStyle(e).outlineWidth),'3px');
   await page.keyboard.press('Enter');await arrived(target);await page.goBack();await settled();
   await page.locator('#directory-chamber').selectOption('S');await page.locator('#directory-sort').selectOption('name:descending');
   const sorted=await name.textContent();const sortedTarget=await name.getAttribute('href');await name.click();await arrived(sortedTarget);await page.goBack();await settled();assert.equal(await name.textContent(),sorted);assert.equal(await page.locator('#directory-chamber').inputValue(),'S');
   await page.evaluate(()=>document.documentElement.style.fontSize='200%');assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
   await page.screenshot({path:`test-results/review-legislator-rows/${engine.name()}-${width}-${theme}.png`});
  await page.goto(base+'#legislators');await page.locator('.legislator-row').first().waitFor();assert.equal(await page.locator('.legislator-row h2 a').first().evaluate(e=>getComputedStyle(e,'::after').content),'none');assert.deepEqual(errors,[]);await page.close();
  }
 }
}finally{await browser.close()}}
console.log('Review row navigation, independent count links, all column combinations, repeated touch/Back/Forward, keyboard, themes, enlargement, axe and Main isolation passed.');
