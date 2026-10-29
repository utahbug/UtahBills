import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createServer} from 'node:http';
import {chromium} from 'playwright';
import {generateSearchPages} from '../scripts/search-pages.mjs';
const catalog=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));
const files=new Map();const coverage=await generateSearchPages(catalog,async(n,b)=>files.set(n,b));
const records=[...catalog.requests2027,...catalog.sourceObservedRequests2027].filter(r=>r.currentlyListed!==false&&!r.introducedBill);
assert.equal(coverage.requests,records.length);assert.equal(coverage.bills,catalog.measures.filter(b=>b.sessionID==='2027GS').length);
const server=createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1),body=files.get(pathname.endsWith('/')?pathname+'index.html':pathname);res.writeHead(body?200:404,{'Content-Type':pathname.endsWith('.xml')?'application/xml':'text/html'});res.end(body||'Missing')});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true}),context=await browser.newContext({javaScriptEnabled:false}),page=await context.newPage();
try{
 for(const r of records){await page.goto(base+'/requests/2027/'+r.trackingID+'/');assert.equal(await page.locator('h1').textContent(),r.shortTitle);assert.equal(await page.locator('meta[name=robots]').getAttribute('content'),'noindex, nofollow');assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://legislation.utahbug.com/requests/2027/'+r.trackingID+'/');assert.equal(await page.locator('a[href="/#request/'+r.trackingID+'"]').count(),1);const text=await page.locator('main').innerText();assert.ok(text.includes(r.history.at(-1).source.retrievedAt));assert.ok(text.includes(r.verificationState==='status-verified'?r.officialStatus:'Official status not confirmed'));assert.ok(text.includes('does not establish membership'));assert.ok(text.includes(r.sponsor));}
 await page.reload();assert.equal(await page.locator('h1').textContent(),records.at(-1).shortTitle);
 for(const width of [320,390,1280]){await page.setViewportSize({width,height:900});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 const sitemap=files.get('sitemap.xml').toString();assert.equal((sitemap.match(/<loc>/g)||[]).length,coverage.urls.length);assert.ok(!sitemap.includes('#'));for(const url of coverage.urls){assert.ok(sitemap.includes('<loc>'+url+'</loc>'));assert.ok(files.has(new URL(url).pathname.slice(1)+'index.html'));}
 const twice=new Map();await generateSearchPages(catalog,async(n,b)=>twice.set(n,b));assert.deepEqual(twice,files);
 // Synthetic fixtures never enter saved legislative data or release artifacts.
 const fixture=structuredClone(catalog);fixture.requests2027=[{...records[0],shortTitle:'A <script> & "title"',sponsor:'UNKNOWN',sponsorName:undefined}];fixture.sourceObservedRequests2027=[];fixture.legislators=[];fixture.contactPeople=[];fixture.measures=[];const isolated=new Map();await generateSearchPages(fixture,async(n,b)=>isolated.set(n,b));const html=[...isolated.values()][0].toString();assert.ok(html.includes('A &lt;script&gt; &amp; &quot;title&quot;'));assert.ok(html.includes('Not published'));assert.ok(!html.includes('<script>'));
 fixture.requests2027.push(fixture.requests2027[0]);await assert.rejects(generateSearchPages(fixture,async()=>{}),/Duplicate/);fixture.requests2027.pop();fixture.requests2027[0].history=[{source:{url:'https://evil.example/',sha256:'test',retrievedAt:'2026-10-29'}}];await assert.rejects(generateSearchPages(fixture,async()=>{}),/Unexpected official/);
 fixture.requests2027=[];fixture.measures=[{sessionID:'2027GS',billNumber:'HB0010',shortTitle:'Synthetic fixture',lastAction:'Introduced',sourceUrl:'https://le.utah.gov/data/2027GS/HB0010.json',retrievedAt:'2026-10-29',officialUrl:'https://le.utah.gov/~2027/bills/static/HB0010.html'}];assert.equal((await generateSearchPages(fixture,async()=>{})).bills,1);fixture.measures[0].billNumber='../../bad';await assert.rejects(generateSearchPages(fixture,async()=>{}),/Incomplete/);
 console.log(JSON.stringify({coverage:{requests:coverage.requests,bills:coverage.bills},checks:'Every saved request without JavaScript; exact titles/canonicals/identities/qualifications/dates; reload; narrow layouts; sitemap; deterministic output; unsafe URLs, duplicate IDs, escaping and future-bill fixtures'}));
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}

