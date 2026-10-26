import {openEnhancedSections} from './fixtures/enhanced-sections.mjs';
import assert from 'node:assert/strict';
import {readFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {eventDate,statusSummary} from '../bill-presentation.js';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/',bills=JSON.parse(await readFile('data/bills.json','utf8')),links=JSON.parse(await readFile('tests/fixtures/phase5d-detail-links.json','utf8')),axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
assert.doesNotMatch(eventDate('2027-01-20','2027GS'),/historical-date/);assert.doesNotMatch(eventDate('2027-07-01','2026GS'),/historical-date/);assert.match(eventDate('2025-12-02','2026GS'),/historical-date/);
assert.doesNotMatch(statusSummary({sessionID:'2027GS'},[{actionCode:'HFILED',owner:'House file for bills not passed',actionDate:'2027-03-05',description:'House/ filed'}]),/session end/);
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage({reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await mkdir('test-results/phase5e',{recursive:true});
try{
 for(const b of bills){
  await page.goto(base+'?phase5e='+b.billNumber+'#bill/'+b.billNumber);await openEnhancedSections(page);await page.locator('.votes-section small').waitFor();
  assert.equal(await page.locator('.bill-explanation h2').textContent(),'Bill Summary');assert.equal(await page.getByRole('heading',{name:'Highlighted provisions',exact:true}).count(),0);
  assert.equal(await page.locator('.bill-explanation .pinned-summary').textContent(),b.summary);assert.equal(await page.locator('.bill-explanation .pinned-extra').textContent(),b.extra);
  assert.equal(await page.locator('.bill-explanation .highlighted-provisions').textContent(),b.highlightedProvisions.replace(/^This bill:/,'').replace(/<[^>]+>/g,''));
  assert.match(await page.locator('.explanation-version').textContent(),/Independent human editorial review pending.*official Legislature metadata/);
  const current=await page.locator('.bill-detail a[href]').evaluateAll(es=>[...new Set(es.map(e=>e.getAttribute('href')))].sort());for(const href of links.records[b.billNumber])assert.ok(current.includes(href),b.billNumber+' missing source '+href);
  assert.equal(await page.locator('#changes .open-reader').count(),0);await page.locator('.bill-explanation .open-reader').click();assert.equal(await page.locator('#formatted-reader').getAttribute('open'),'');assert.equal(await page.locator('#reader-version option:checked').getAttribute('value'),String(b.versions.findIndex(v=>v.id===b.summaryVersion)));
  await page.locator('#reader-version').selectOption('0');await page.locator('#formatted-reader>summary').click();await page.locator('.bill-explanation .open-reader').click();assert.equal(await page.locator('#reader-version').inputValue(),'0');
  assert.equal(await page.locator('.supporting-records>details').count(),5);await page.locator('.documents-sources>summary').focus();await page.keyboard.press('Enter');
  await page.locator('.documents-sources .open-reader').click();assert.equal(await page.locator('#reader-version').inputValue(),String(b.versions.findIndex(v=>v.id===b.summaryVersion)));assert.equal(await page.locator('.reader-field .selected-value').textContent(),await page.locator('#reader-version option:checked').textContent());
  const urls=await page.locator('.documents-sources a[href$=".pdf"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));assert.equal(urls.length,new Set(urls).size,'No repeated PDF in Documents & sources');
  assert.equal(await page.locator('#reader-body .historical-date').count(),0,'Do not tint legal effective dates');
  if(['HB0154','HB0155'].includes(b.billNumber)){assert.match(await page.locator('.bill-current-status').innerText(),/Did not pass.*Latest recorded action: Filed at session end/s);assert.doesNotMatch(await page.locator('.bill-current-status').innerText(),/did not become law/);assert.match(await page.locator('.full-history').textContent(),/House\/ filed/)}
 }
 for(const width of [320,375,390,430,768,1024,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await page.goto(base+'?layout5e='+width+mode+'#bill/SB0069');await openEnhancedSections(page);await page.locator('.votes-section small').waitFor();await page.locator('#formatted-reader>summary').click();await page.locator('.published-comparison>summary').click();await page.locator('.documents-sources>summary').click();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  const geometry=await page.evaluate(()=>{const box=s=>document.querySelector(s).getBoundingClientRect();const label=box('.reader-version-label'),select=box('#reader-version'),heading=box('#formatted-reader>summary'),controls=box('#changes .compare-controls'),law=box('#law-text');return {aligned:Math.abs(label.left-select.left)<1,indented:select.left>=heading.left-1,ratio:controls.width/law.width,overflow:document.documentElement.scrollWidth>innerWidth+1,targets:[...document.querySelectorAll('.bill-detail summary,.bill-detail select,.bill-detail .open-reader')].filter(e=>e.getClientRects().length).every(e=>e.getBoundingClientRect().height>=44),captions:[...document.querySelectorAll('.bill-detail .selected-value')].every(e=>e.scrollWidth<=e.clientWidth+1&&e.textContent===e.parentElement.querySelector('select').selectedOptions[0].textContent)}});
  assert.equal(geometry.aligned,true,`${width} ${mode} label/select`);assert.equal(geometry.indented,true);assert.equal(geometry.overflow,false,`${width} ${mode}`);assert.equal(geometry.targets,true);assert.equal(geometry.captions,true);
  if(width===1280&&mode==='normal')assert.ok(geometry.ratio>=.5&&geometry.ratio<=.67,'Compact controls preserve wide legal text');
  const dates=page.locator('.historical-date');assert.ok(await dates.count());assert.equal(await dates.first().evaluate(e=>getComputedStyle(e).backgroundColor),'rgb(234, 220, 196)');
  await page.evaluate(()=>scrollTo(0,0));await page.waitForFunction(()=>scrollY===0&&!document.querySelector('header.navigation-compact'));await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`${width} ${mode}`);
  if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:`test-results/phase5e/detail-${width}.png`,fullPage:true});
 }
 assert.deepEqual(errors,[]);console.log('Phase 5E: exact summary/provisions, all baseline source links, pinned reader/retained selection, consolidated documents, five disclosures, label alignment, compact captions, historical dates, filed guard, 21 responsive/text/zoom cases and axe passed.');
}finally{await browser.close()}
