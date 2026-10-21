import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {renderLegislativeNode} from '../reader.js';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const bills=JSON.parse(await readFile('data/bills.json','utf8'));
assert.match(bills.find(b=>b.billNumber==='HB0011').summary,/vehicle\u2019s/);
for(const file of ['scripts/analyze.py','data/bills.json','app.js','guide.js','reader.js'])assert.doesNotMatch(await readFile(file,'utf8'),/\uFFFD|\u00e2\u20ac|\u00c2\u00a7/,'Encoding corruption in '+file);
const punctuation='“Quoted” vehicle’s — § 22 – café';
assert.equal(renderLegislativeNode({tag:'sectionText',text:punctuation}),`<div class="bill-paragraph">${punctuation}</div>`);
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage();const notes=[];let visitId=0;
async function visit(route,width=390){await page.setViewportSize({width,height:900});await page.goto(base+'?batch1='+ (++visitId) +'-'+encodeURIComponent(route)+'#'+route);await page.locator('h1').waitFor();await page.waitForFunction(()=>!document.querySelector('main [role="status"]')?.textContent.includes('Loading legislative'));}
// Check actual text rectangles, not just document width or parent boxes.
async function checkRows(){return page.evaluate(()=>{
 const overlaps=[];
 for(const [index,row] of [...document.querySelectorAll('.bill-row')].entries()){
  const walker=document.createTreeWalker(row,NodeFilter.SHOW_TEXT);const rects=[];let node;
  while(node=walker.nextNode()){if(!node.textContent.trim())continue;const range=document.createRange();range.selectNodeContents(node);for(const r of range.getClientRects())if(r.width>1&&r.height>1)rects.push({left:r.left,right:r.right,top:r.top,bottom:r.bottom,text:node.textContent.trim()})}
  for(let i=0;i<rects.length;i++)for(let j=i+1;j<rects.length;j++){const a=rects[i],b=rects[j];if(Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1)overlaps.push({index,a:a.text,b:b.text})}
  const bounds=row.getBoundingClientRect();for(const r of rects)if(r.left<bounds.left-1||r.right>bounds.right+1)overlaps.push({index,outside:r.text});
 }
 return overlaps;
})}
try{
 for(const width of [320,375,390,430]){
  for(const mode of ['normal','enlarged','zoom']){
   await visit('bills',width);
   if(mode==='enlarged')await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);for(const [e,n]of sizes)e.style.fontSize=n*2+'px'});
   // CSS zoom exercises layout at 200%, unlike pinch magnification which does not reflow.
   if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom='2');
   assert.deepEqual(await checkRows(),[],`${width}px ${mode} text overlap`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`${width}px ${mode} overflow`);
  }
  notes.push(`Listing text rectangles: no overlap at ${width}px, normal / doubled text / 200% CSS zoom`);
 }
 for(const b of bills){
  await visit('bill/'+b.billNumber);await page.locator('#formatted-reader > summary').click();
  for(let i=0;i<b.versions.length;i++){
   const version=b.versions[i];await page.locator('#reader-version').selectOption(String(i));
   assert.equal(await page.locator('#reader-source a').getAttribute('href'),version.url);
   const raw=await readFile(version.source,'utf8');
   const result=await page.evaluate(({raw})=>{
    const xml=new DOMParser().parseFromString(raw,'application/xml');if(xml.querySelector('parsererror'))throw Error('XML parse failure');
    // Independently walk the source XML and rendered DOM. Compare each non-whitespace
    // character with its effective addition/deletion state, retaining punctuation.
    function source(node,state=''){
     if(node.nodeType===3)return [...node.textContent].filter(c=>! /\s/.test(c)).map(c=>[c,state]);
     if(['sinfo','ln','tab','amendoutstart','amendoutend'].includes(node.nodeName))return [];
     const ea=node.getAttribute?.('ea');const next=ea==='amend'?'addition':ea==='erase'?'deletion':state;
     return [...node.childNodes].flatMap(n=>source(n,next));
    }
    function rendered(node,state=''){
     if(node.nodeType===3)return [...node.textContent].filter(c=>! /\s/.test(c)).map(c=>[c,state]);
     if(node.hasAttribute?.('data-reader-label'))return [];
     const next=node.nodeName==='INS'?'addition':node.nodeName==='DEL'?'deletion':state;
     return [...node.childNodes].flatMap(n=>rendered(n,next));
    }
    const expected=['tbox','lt','enact','bdy'].flatMap(tag=>{const n=xml.documentElement.querySelector(':scope > '+tag);return n?source(n):[]});
    const actual=rendered(document.querySelector('#reader-body'));
    const difference=expected.findIndex((x,i)=>JSON.stringify(x)!==JSON.stringify(actual[i]));
    return {expected:expected.length,actual:actual.length,difference,sections:xml.querySelectorAll('bdy > bsec').length,renderedSections:document.querySelectorAll('#reader-body .bill-section').length};
   },{raw});
   assert.equal(result.difference,-1,version.id+' source text/change mismatch');assert.equal(result.actual,result.expected,version.id+' text length');assert.equal(result.sections,result.renderedSections);
  }
 }
 notes.push('All nine versions: every non-whitespace source character, change state, section count, and official version link preserved');
 await visit('bill/HB0011');assert.match(await page.locator('main').innerText(),/vehicle’s/);assert.doesNotMatch(await page.locator('main').innerText(),/vehicleâ/);
 for(const width of [320,375,390,430]){
  await visit('bill/SB0069',width);await page.locator('#formatted-reader > summary').click();await page.locator('#reader-version').selectOption({label:'SB0069S02 · Substitute #2'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await page.evaluate(axe);
  const a=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}}));
  assert.deepEqual(a.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[],`Expanded reader accessibility at ${width}`);
  await page.screenshot({path:`test-results/reader-${width}.png`,fullPage:true});
  await page.evaluate(()=>{const sizes=[...document.querySelectorAll('body,body *')].map(e=>[e,parseFloat(getComputedStyle(e).fontSize)]);for(const [e,n]of sizes)e.style.fontSize=n*2+'px'});
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false,`Expanded reader doubled-text overflow at ${width}`);
 }
 await visit('bills');assert.equal(await page.locator('header nav a').count(),3);await page.locator('footer a[href="#guide"]').click();await page.getByRole('heading',{name:'How Utah legislation works'}).waitFor();assert.match(await page.locator('main').innerText(),/may vote to advance a bill and later vote against final passage/);await page.locator('footer a[href="#sources"]').click();await page.getByRole('heading',{name:'Built on the official record'}).waitFor();
 assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');assert.match(await page.locator('.notice').innerText(),/Research prototype/);
 await visit('bills',390);await page.screenshot({path:'test-results/batch1-mobile-bills.png',fullPage:true});
 await mkdir('test-results',{recursive:true});await writeFile('test-results/batch1.json',JSON.stringify({testedAt:new Date().toISOString(),base,notes},null,2));console.log(notes.join('\n'));
}finally{await browser.close()}

