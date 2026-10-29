import {billOptions} from './fixtures/bill-options.mjs';
import {openArchive} from './fixtures/archive-navigation.mjs';
import {showSavedActivity} from './fixtures/activity-navigation.mjs';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {compareSponsors,sponsorKey} from '../sponsor-sort.js';
import {sessionFixture,interceptSession} from './fixtures/session-transition.mjs';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
// Deterministic surname/given-name ordering, unknown last, title/ID tie breakers.
const sample=[{primeSponsor:'Z',primeSponsorName:'Sen. Young, Ada',shortTitle:'X',billNumber:'3'},{primeSponsor:'A',primeSponsorName:'Rep. Adams, Zoe',shortTitle:'Z',billNumber:'2'},{primeSponsor:'B',primeSponsorName:'Adams, Ann',shortTitle:'A',billNumber:'1'},{primeSponsor:'UNKNOWN',primeSponsorName:'UNKNOWN',shortTitle:'A',billNumber:'0'},{primeSponsor:'B',primeSponsorName:'Adams, Ann',shortTitle:'A',billNumber:'4'}];
assert.deepEqual(sample.toSorted((a,b)=>compareSponsors(a,b,{})).map(x=>x.billNumber),['1','4','2','3','0']);assert.equal(sponsorKey({primeSponsor:'UNKNOWN',primeSponsorName:'Unstructured Name'},{}),null);
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});await mkdir('test-results/phase4t',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.copied=text}}));
 const visit=async route=>{await page.goto(base+'?phase4t='+encodeURIComponent(route)+'#'+route);await page.locator('h1').waitFor()};
 await visit('requests');await page.locator('.bill-row').first().waitFor();
 assert.deepEqual(await page.locator('#session option').allTextContents(),['2027 Bills and resolutions','2027 Public bill requests']);assert.equal(await page.getByLabel('Records',{exact:true}).inputValue(),'2027-requests');
 assert.equal(await page.getByLabel('Search public requests',{exact:true}).getAttribute('placeholder'),'Tracking ID, title, keyword, or sponsor');
 await billOptions(page);await page.locator('#sort').selectOption('sponsor',{force:true});
 const expected=[...(saved.requestArchive2027||saved.requests2027),...(saved.sourceObservedRequests2027||[])].filter(r=>!r.introducedBill&&r.currentlyListed!==false).map(r=>({...r,primeSponsor:r.sponsor,primeSponsorName:r.sponsorName})).sort((a,b)=>compareSponsors(a,b,saved));
 const hrefs=await page.locator('.bill-row h2 a').evaluateAll(es=>es.map(e=>e.hash));assert.deepEqual(hrefs,expected.slice(0,hrefs.length).map(r=>'#request/'+r.trackingID));
 await openArchive(page);await page.getByRole('heading',{name:'2026 Legislative Archive',exact:true}).waitFor();assert.match(await page.locator('#count').innerText(),/^1016 introduced measures$/);
 await billOptions(page);await page.locator('#sort').selectOption('sponsor',{force:true});const historical=saved.measures.filter(b=>b.sessionID==='2026GS').sort((a,b)=>compareSponsors(a,b,saved));assert.equal(await page.locator('.bill-row h2 a').first().getAttribute('href'),'#bill/'+historical[0].billNumber);
 await page.locator('#search').fill('HB0011');await page.locator('.bill-row h2 a').click();await page.locator('.back').click();assert.equal(await page.locator('#search').inputValue(),'HB0011');assert.equal(await page.locator('h1').innerText(),'2026 Legislative Archive');
 await page.locator('header nav a[href="#bills"]').click();await page.waitForFunction(()=>document.querySelector('#session')?.value!=='2026');assert.equal(await page.locator('#session').inputValue(),saved.measures.some(b=>b.sessionID==='2027GS')?'2027':'2027-requests');
 await page.goBack();await page.getByRole('heading',{name:'2026 Legislative Archive',exact:true}).waitFor();await page.goForward();await page.waitForFunction(()=>document.querySelector('#session')?.value!=='2026');
 // First introduced records reuse the same sort and primary Records layout.
 const fixture=sessionFixture(saved,3);await interceptSession(page,fixture);await visit('bills');assert.equal(await page.locator('#session').inputValue(),'2027');await billOptions(page);await page.locator('#sort').selectOption('sponsor',{force:true});assert.equal(await page.locator('.bill-row').count(),3);assert.match(await page.locator('#search').getAttribute('placeholder'),/^Bill number/);await page.unroute('**/data/catalog-ui.json');
 // Sponsor controls retain role filtering, accessible name and clear action.
 await visit('sponsor/'+saved.legislators[0].id+'/chief/2026/all');await page.getByLabel('Sponsorship role',{exact:true}).waitFor();assert.doesNotMatch(await page.locator('.sponsor-filter').innerText(),/Sponsorship role/);await page.keyboard.press('Tab');await page.locator('#sponsor-role').focus();assert.equal(await page.locator('#sponsor-role').evaluate(e=>e.matches(':focus-visible')&&parseFloat(getComputedStyle(e).outlineWidth)>=2&&e.getBoundingClientRect().height>=44),true);await page.locator('#remove-sponsor').click();assert.equal(await page.locator('.sponsor-filter').count(),0);
 // Activity blank-space target is a native link; independent links and text stay on top.
 await visit('activity');await showSavedActivity(page);await page.locator('.activity-row').first().waitFor();const row=page.locator('.activity-row').first(),target=await row.locator('h2 a').getAttribute('href');assert.equal(await row.evaluate(e=>getComputedStyle(e).borderTopWidth),'1px');
 const point=await row.evaluate(e=>{const r=e.getBoundingClientRect();return {x:r.right-6,y:r.bottom-6}});assert.equal(await page.evaluate(p=>document.elementFromPoint(p.x,p.y).closest('a')?.getAttribute('href'),point),target);
 const official=row.locator('.activity-metadata a').first(),officialHref=await official.getAttribute('href');assert.notEqual(officialHref,target);assert.equal(await official.evaluate(e=>{const r=e.getBoundingClientRect();return document.elementFromPoint(r.x+3,r.y+r.height/2).closest('a')===e}),true);
 await row.locator('.row-text').first().evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);getSelection().removeAllRanges();getSelection().addRange(r)});assert.ok(await page.evaluate(()=>getSelection().toString().length));await page.evaluate(()=>getSelection().removeAllRanges());
 const popupPromise=page.context().waitForEvent('page');await page.mouse.move(point.x,point.y);await page.keyboard.down('Control');await page.mouse.click(point.x,point.y);await page.keyboard.up('Control');const popup=await popupPromise;await popup.waitForURL(url=>url.hash===target);await popup.waitForLoadState();assert.ok(popup.url().endsWith(target));await popup.close();assert.ok(page.url().endsWith('#activity'));
 await page.mouse.click(point.x,point.y);await page.waitForURL(url=>url.hash===target);await page.goBack();await page.locator('.activity-row').first().waitFor();
 await page.locator('.activity-info summary').click();await page.locator('.activity-info .floating-panel:popover-open').waitFor();assert.deepEqual(await page.locator('.activity-info h2').allTextContents(),['Recent Activity']);assert.match(await page.locator('.activity-info').innerText(),/Scheduled daily.*Not live/);
 await page.getByRole('link',{name:'Browse public requests'}).click();await page.locator('#search').waitFor();assert.equal(await page.locator('#search').inputValue(),'');
 // Representative widths, doubled text and CSS zoom/reflow. Physical browser/AT acceptance is separate.
 for(const [width,mode] of [[320,'normal'],[375,'normal'],[390,'normal'],[430,'normal'],[768,'normal'],[1024,'normal'],[1280,'normal'],[390,'text'],[768,'text'],[390,'zoom'],[1280,'zoom']]){
  await page.setViewportSize({width,height:900});await visit('requests');await page.locator('.bill-row').first().waitFor();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  const select=await page.locator('#session').boundingBox(),search=await page.locator('#search').boundingBox();if(width>=768&&mode==='normal'){assert.ok(Math.abs(select.y-search.y)<2);assert.ok(select.x<search.x)}else if(select.x<search.x)assert.ok(Math.abs(select.y+select.height-search.y-search.height)<2,'Enlarged controls align at their lower edge');else assert.ok(select.y<=search.y);
  const before=await page.locator('header nav a').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().x));await page.evaluate(()=>scrollTo(0,400));await page.waitForTimeout(100);const after=await page.locator('header nav a').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().x));before.forEach((x,i)=>assert.ok(Math.abs(x-after[i])<2,'navigation horizontal stability '+width+' '+mode));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(100);await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:'test-results/phase4t/records-'+width+'.png'});
  await visit('calendar');await page.locator('#calendar-month').waitFor();if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('main *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  const legend=page.getByRole('button',{name:'Calendar Legend',exact:true});await legend.scrollIntoViewIfNeeded();await legend.click();const panel=page.locator('.toolbar-popover:popover-open');await panel.waitFor();await page.waitForTimeout(80);const r=await panel.boundingBox(),t=await legend.boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width+1);assert.ok(r.y>=0&&r.y+r.height<=900+1);if(t.y+t.height+r.height+4<900)assert.ok(Math.abs(r.y-t.y-t.height-4)<3,'Legend adjacent');assert.equal(await panel.locator('.calendar-key').count(),6);await page.keyboard.press('Escape');assert.equal(await panel.count(),0);assert.equal(await legend.evaluate(e=>e===document.activeElement),true);
  if(mode==='normal'&&[390,1280].includes(width)){await legend.click();await page.waitForTimeout(80);await page.screenshot({path:'test-results/phase4t/legend-'+width+'.png'});await page.keyboard.press('Escape')}
 }
 assert.deepEqual(errors,[]);await page.close();console.log('Phase 4T: Records/archive, sponsor sort/filters, Activity native row links/modifiers/selection, disclosures, stable header x coordinates, adjacent Legend, responsive/text/zoom and axe passed.');
}finally{await browser.close()}
