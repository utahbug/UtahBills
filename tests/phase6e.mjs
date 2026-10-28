import {copyResults,copyControl} from './fixtures/copy-results.mjs';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile} from 'node:fs/promises';
import {copyPrepared,titleLinks,titlesOnly} from '../sharing.js';
import {sessionFixture,interceptSession} from './fixtures/session-transition.mjs';
// Model Safari's gesture boundary: write must begin before asynchronous rows finish.
let resolve,active=true,started=false,written;
const prepared=new Promise(r=>resolve=r),Item=class{constructor(data){this.data=data}};
const clipboard={write:async items=>{assert.equal(active,true);started=true;const values=await Promise.all(Object.entries(items[0].data).map(async([k,v])=>[k,await(await v).text()]));written=Object.fromEntries(values)},writeText:async()=>{throw Error('activation lost')}};
const copying=copyPrepared(prepared,{clipboard,Item});assert.equal(started,true);active=false;
const rows=[{title:'Duplicate “Water” & land',route:'#request/XKUCMCIIHJ'},{title:'Duplicate “Water” & land',route:'#bill/2027/HB0001/history'}];
const expected=await titleLinks(rows,'https://bills.example.test/application/#requests');resolve(expected);assert.equal((await copying).copied,true);assert.equal(written['text/plain'],expected.plain);assert.ok(written['text/plain'].includes('https://bills.example.test/application/#request/XKUCMCIIHJ'));assert.equal(written['text/html'],expected.html);
const only=await titlesOnly(rows);assert.equal(only.plain,rows.map(r=>r.title).join('\n'));
let plain;assert.equal((await copyPrepared(Promise.resolve(expected),{Item,clipboard:{write:async()=>{throw Error('rich denied')},writeText:async text=>plain=text}})).copied,true);assert.equal(plain,expected.plain);
assert.deepEqual(await copyPrepared(Promise.resolve(only),{rich:false,Item,clipboard:{write:async()=>{throw Error('denied')},writeText:async()=>{throw Error('denied')}}}),{result:only,copied:false});
let writes=0;const preserving={write:async items=>{await Promise.all(Object.values(items[0].data));writes++},writeText:async()=>writes++};
await assert.rejects(copyPrepared(Promise.reject(Error('missing page')),{Item,clipboard:preserving}),/missing page/);assert.equal(writes,0);
assert.equal((await copyPrepared(Promise.resolve(await titlesOnly([])),{rich:false,Item,clipboard:preserving})).copied,false);await new Promise(r=>setTimeout(r,0));assert.equal(writes,0);
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/',saved=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8')),fixture=sessionFixture(saved,0,60);
fixture.requestArchive2027.forEach((r,i)=>r.shortTitle=i<9?'Nine matching “Water” '+i:'Other request '+i);
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true}),page=await browser.newPage({viewport:{width:390,height:844}});
await page.addInitScript(()=>Object.defineProperty(navigator,'clipboard',{value:{writeText:async text=>{if(window.deny)throw Error('denied');window.copied=text}}}));
const copy=async()=>{await copyResults(page);await page.waitForFunction(()=>!document.querySelector('.copy-results').disabled)};
const titles=async()=>{await page.locator('.export-menu>summary').click();await page.getByRole('button',{name:'Copy titles only',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.copy-titles').disabled)};
try{
 await interceptSession(page,fixture);await page.goto(base+'#requests');await page.locator('.bill-row').first().waitFor();await page.locator('#search').fill('Nine matching');assert.equal(await page.locator('.bill-row').count(),9);
 await copy();const nine=fixture.requests2027.slice(0,9);assert.equal(await page.evaluate(()=>window.copied),(await titleLinks(nine.map(r=>({title:r.shortTitle,route:'#request/'+r.trackingID})),base)).plain);assert.equal(await page.locator('.copy-status').innerText(),'Copied 9 titles with links.');assert.equal(await copyControl(page).getAttribute('title'),'Copy and export results');
 await titles();assert.equal(await page.evaluate(()=>window.copied),nine.map(r=>r.shortTitle).join('\n'));assert.equal(await page.locator('.copy-status').innerText(),'Copied 9 titles.');assert.equal(await page.locator('.export-menu>summary').evaluate(e=>e===document.activeElement),true);
 await page.evaluate(()=>window.deny=true);await titles();assert.equal(await page.locator('.copy-fallback').inputValue(),nine.map(r=>r.shortTitle).join('\n'));assert.equal(await page.locator('.copy-fallback').getAttribute('aria-label'),'Titles to copy');assert.equal(await page.locator('.copy-fallback').evaluate(e=>e===document.activeElement&&e.selectionEnd===e.value.length),true);assert.match(await page.locator('.copy-status').innerText(),/Clipboard unavailable/);
 await page.locator('.export-menu>summary').click();const download=page.waitForEvent('download',{timeout:15000});await page.getByRole('button',{name:'Export CSV',exact:true}).click();const csv=await readFile(await(await download).path(),'utf8');assert.equal(csv.split('\r\n').length,11);assert.equal(csv.split('\r\n')[0],'\uFEFF"Record type","Session","Tracking ID","Bill number","Title","Sponsor","Status","Latest action date","Latest action","Official URL"');for(const record of nine)assert.ok(csv.includes(record.trackingID)&&csv.includes(record.shortTitle));
 await page.evaluate(()=>window.deny=false);await page.locator('#clear-search').click();await copy();assert.equal((await page.evaluate(()=>window.copied)).split('\n\n').length,60);await titles();assert.equal((await page.evaluate(()=>window.copied)).split('\n').length,60);
 console.log('Phase 6E: gesture-start promised clipboard, alternate HTTPS application base, atomic failures, exact nine-result Copy/titles/CSV, full collection, denied titles fallback and focus passed.');
}finally{await browser.close()}
