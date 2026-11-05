import {copyResults} from './fixtures/copy-results.mjs';
import assert from 'node:assert/strict';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {requestSponsorship} from '../request-sponsors.js';
import {sortLegislators} from '../discovery.js';
const data=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),source=[...data.requests2027,...data.sourceObservedRequests2027].filter(r=>!r.introducedBill&&r.currentlyListed!==false),expected=new Map();
for(const r of source){if(!expected.has(r.sponsor))expected.set(r.sponsor,new Map());expected.get(r.sponsor).set(r.trackingID,r)}
const audit=requestSponsorship(data);assert.equal(audit.records.length,new Set(source.map(r=>r.trackingID)).size);assert.equal(audit.unmatched.length,source.filter(r=>!data.legislators.some(p=>p.id===r.sponsor)).length);
const [a,b,c]=data.legislators,make=(trackingID,sponsor,extra={})=>({trackingID,sponsor,shortTitle:'Same saved title',currentlyListed:true,...extra});
const fixture={legislators:[{...a,name:'Alpha'},{...b,name:'Beta'},{...c,name:'Gamma'}],measures:[],requests2027:[make('AAAAAAAAAA',a.id),make('AAAAAAAAAA',a.id),make('BBBBBBBBBB',a.id,{introducedBill:'HB0001'}),make('CCCCCCCCCC',a.id,{currentlyListed:false}),make('DDDDDDDDDD',b.id),make('EEEEEEEEEE','UNKNOWN'),make('FFFFFFFFFF',''),make('GGGGGGGGGG',a.id),make('GGGGGGGGGG',b.id)],sourceObservedRequests2027:[make('HHHHHHHHHH',b.id,{verificationState:'source-observed'})]};
assert.deepEqual(requestSponsorship({}),{records:[],bySponsor:new Map(),unmatched:[]});const noRoster=requestSponsorship({requests2027:[make('AAAAAAAAAA',a.id)]});assert.equal(noRoster.unmatched.length,1);assert.equal(noRoster.bySponsor.get(a.id).length,1);
const projection=requestSponsorship(fixture);assert.equal(projection.records.length,6);assert.equal(projection.bySponsor.get(a.id).length,1);assert.equal(projection.bySponsor.get(b.id).length,2);assert.equal(projection.unmatched.length,3);assert.ok(projection.unmatched.some(x=>x.reason==='Conflicting saved sponsor IDs'));assert.deepEqual(sortLegislators(fixture.legislators,fixture,'requests','descending').map(p=>p.id),[b.id,a.id,c.id]);assert.deepEqual(sortLegislators(fixture.legislators,fixture,'requests','ascending').map(p=>p.id),[c.id,a.id,b.id]);fixture.sourceObservedRequests2027=[];assert.deepEqual(sortLegislators(fixture.legislators,fixture,'requests','descending').map(p=>p.id),[a.id,b.id,c.id]);
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/',axe=await readFile('node_modules/axe-core/axe.min.js','utf8'),browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.setDefaultTimeout(15000);page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>window.copied=text}}));await mkdir('test-results/phase6f',{recursive:true});
const visit=async()=>{await page.goto(base+'?6f#legislators');await page.reload();await page.locator('.legislator-row').first().waitFor()};
const ids=()=>page.locator('.legislator-row h2 a').evaluateAll(es=>es.map(e=>e.hash.split('/')[1]));
try{
 await visit();assert.deepEqual(await page.locator('.directory-columns button:visible').allTextContents(),['Name ','Introduced bills ','Public requests ']);
 const rows=await page.locator('.legislator-row').evaluateAll(es=>es.map(e=>({id:e.querySelector('h2 a').hash.split('/')[1],count:Number(e.querySelector('.request-count').textContent.replace('Requests: ','')),href:e.querySelector('.request-count').hash})));
 for(const row of rows){assert.equal(row.count,expected.get(row.id)?.size||0);assert.equal(row.href,'#legislator/'+row.id+'/2027')}
 // Every real sponsor count opens the same exact unique saved request identities.
 for (const row of rows) {
  await page.goto(base + row.href);
  await page.locator('#profile-request-heading').waitFor();
  const records = page.locator('.profile-request-record');
  const saved = expected.get(row.id) ?? new Map();
  assert.equal(await records.count(), row.count);
  assert.deepEqual(await records.locator('.tracking-id').allTextContents(), [...saved.keys()]);
  for (const record of await records.all()) {
   const id = await record.locator('.tracking-id').innerText();
   assert.equal(await record.locator('a').getAttribute('href'), '#request/' + id);
   const {verificationState, officialStatus} = saved.get(id);
   const label = verificationState === 'source-observed' ? 'Official status not confirmed' : officialStatus;
   assert.ok((await record.innerText()).endsWith(' · ' + label), 'Saved status qualification: ' + id);
  }
 }
 for(const {record} of audit.unmatched.filter(x=>data.contactPeople?.some(p=>p.id===x.record.sponsor))){await page.goto(base+'#legislator/'+record.sponsor+'/2027');await page.locator('#profile-request-heading').waitFor();assert.match(await page.locator('main').innerText(),/Current contact snapshot; historical membership unavailable/);assert.ok((await page.locator('.profile-request-record .tracking-id').allTextContents()).includes(record.trackingID))}
 // A successful reconciliation can leave no source-observed requests. Exercise
 // both profile states independently of the records present on the test date.
 for (const includeObserved of [false, true]) {
  const fixturePage = await browser.newPage();
  try {
   const sponsor = {id: 'TESTSPONSOR', name: 'Fixture Sponsor', house: 'H', district: '1'};
   const verified = make('AAAAAAAAAA', sponsor.id, {
    shortTitle: 'Verified fixture request', verificationState: 'status-verified', officialStatus: 'In Process'
   });
   const observed = make('BBBBBBBBBB', sponsor.id, {
    shortTitle: 'Observed fixture request', verificationState: 'source-observed'
   });
   const catalog = {...data, legislators: [sponsor], contactPeople: [], measures: [],
    requests2027: [verified], requestArchive2027: [verified], requestObservations2027: [],
    sourceObservedRequests2027: includeObserved ? [observed] : []};
   await fixturePage.route('**/data/catalog-ui.json', route => route.fulfill({json: catalog}));
   await fixturePage.goto(base + '#legislators');
   const countLink = fixturePage.locator('.legislator-row .request-count');
   assert.equal(await countLink.getAttribute('href'), '#legislator/' + sponsor.id + '/2027');
   assert.equal(Number((await countLink.innerText()).replace('Requests: ','')), includeObserved ? 2 : 1);
   await countLink.click();
   await fixturePage.locator('#profile-request-heading').waitFor();
   const rows = fixturePage.locator('.profile-request-record');
   const expectedIDs = includeObserved ? [verified.trackingID, observed.trackingID] : [verified.trackingID];
   assert.deepEqual((await rows.locator('.tracking-id').allTextContents()).sort(), expectedIDs);
   assert.match(await rows.filter({hasText: verified.shortTitle}).innerText(), /In Process/);
   assert.equal(await rows.filter({hasText: 'Official status not confirmed'}).count(), includeObserved ? 1 : 0);
   const record = includeObserved ? observed : verified;
   const recordRow = rows.filter({hasText: record.shortTitle});
   if (includeObserved) assert.match(await recordRow.innerText(), /Official status not confirmed/);
   await recordRow.locator('a').click();
   await fixturePage.locator('.request-heading').waitFor();
   assert.equal(new URL(fixturePage.url()).hash, '#request/' + record.trackingID);
   assert.equal(await fixturePage.locator('main h1').innerText(), record.shortTitle);
   await fixturePage.goBack();
   await fixturePage.locator('#profile-request-heading').waitFor();
  } finally {
   await fixturePage.close();
  }
 }
 await visit();await page.locator('.directory-search-tools .toolbar-info').click();await page.locator('.unmatched-requests>summary').click();assert.equal(await page.locator('.unmatched-requests li').count(),audit.unmatched.length);for(const {record,reason} of audit.unmatched)assert.match(await page.locator('.unmatched-requests li').filter({has:page.locator(`a[href="#request/${record.trackingID}"]`)}).innerText(),new RegExp(reason));await page.keyboard.press('Escape');
 for(const chamber of ['','H','S']){await page.locator('#directory-chamber').selectOption(chamber);const pool=data.legislators.filter(p=>!chamber||p.house===chamber);assert.equal(await page.locator('.directory-chamber').count(),0);for(const key of ['name','district','bills','requests'])for(const direction of ['ascending','descending']){await page.locator('#directory-sort').selectOption(key+':'+direction);assert.deepEqual(await ids(),sortLegislators(pool,data,key,direction).map(p=>p.id))}}
 await page.locator('#directory-chamber').selectOption('');await page.locator('#directory-sort').selectOption('name:ascending');await page.locator('[data-directory-sort="requests"]').click();const dir=await page.locator('#directory-sort').inputValue();assert.equal(dir,'requests:descending');await page.locator('[data-directory-sort="requests"]').click();assert.equal(await page.locator('#directory-sort').inputValue(),'requests:ascending');
 await page.locator('#directory-search').fill(a.name.split(',')[0]);await copyResults(page);await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled);assert.ok((await page.evaluate(()=>window.copied)).includes('Public requests (2027):'));await page.locator('.request-count').first().click();await page.locator('#profile-request-heading').waitFor();await page.goBack();await page.locator('#directory-search').waitFor();assert.equal(await page.locator('#directory-search').inputValue(),a.name.split(',')[0]);assert.equal(await page.locator('#directory-sort').inputValue(),'requests:ascending');
 for(const width of [320,375,390,430,768,1024,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await visit();if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,width+mode);const scale=mode==='zoom'?2:1;for(const link of await page.locator('.legislator-row').first().locator('.introduced-count,.request-count').all()){const box=await link.boundingBox();assert.ok(box.height/scale>=44);if(width<=430)assert.ok(box.width/scale>=44);assert.match(await link.getAttribute('aria-label'),/2027/)}
  const requests=page.locator('.request-count').first();await requests.focus();assert.ok(await requests.evaluate(e=>e.matches(':focus-visible')));await page.evaluate(()=>scrollTo(0,0));await page.waitForTimeout(80);await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],width+mode);if(mode==='normal'&&[390,1280].includes(width))await page.screenshot({path:`test-results/phase6f/directory-${width}.png`});if(width===320){await page.locator('.directory-search-tools .toolbar-info').click();await page.locator('.unmatched-requests>summary').click();const rect=await page.locator('#directory-info').boundingBox();assert.ok(rect.x>=0&&rect.x+rect.width<=width+1&&rect.y>=0&&rect.y+rect.height<=901);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);await page.keyboard.press('Escape');assert.equal(await page.locator('.directory-search-tools .toolbar-info').evaluate(e=>e===document.activeElement),true)}
 }
 await writeFile('test-results/phase6f/sponsorship.json',JSON.stringify({total:audit.records.length,rosterMatched:audit.records.length-audit.unmatched.length,unmatched:audit.unmatched.map(({record:r,reason})=>({trackingID:r.trackingID,sponsor:r.sponsor,reason}))},null,2));assert.deepEqual(errors,[]);console.log('Phase 6F: all saved sponsor counts/profiles, exact IDs, deduplication/conversions/conflicts, unmatched disclosure, unconfirmed status, eight sorts/chambers, Copy/history and seven widths/text/zoom/axe passed.');
}finally{await browser.close()}
