import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {contactEmail} from '../contact-config.js';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const catalog=JSON.parse(await readFile('dist/data/catalog-ui.json','utf8'));
const axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});
const page=await browser.newPage(),errors=[];
page.on('pageerror',e=>errors.push(e.message));
const contact=()=>page.locator('h1').filter({hasText:/^Contact UtahBug$/}).waitFor();
const footer=()=>page.locator('footer a[href="#contact"]');
try{
 // Every route family uses the same footer, including real saved detail identities.
 const routes=['bills','requests','bills/2027','archive/2026','activity','calendar','legislators','about','faq','guide','sources','faq/process','about/data',
 'bill/HB0011','bill/HB0117','request/'+catalog.requestArchive2027[0].trackingID,'legislator/'+catalog.legislators[0].id];
 for(const route of routes){
  await page.goto(base+'#'+route);await page.locator('main h1').waitFor();
  assert.equal(await footer().count(),1);assert.equal(await page.locator('header a[href="#contact"]').count(),0);
  await footer().click();await contact();assert.equal(await footer().getAttribute('aria-current'),'page');
  assert.equal(await page.locator('main').evaluate(e=>e===document.activeElement),true);
 }
 await page.goto(base+'#contact');await page.reload();await contact();assert.equal(await page.title(),'Contact · UtahBug');
 const email=page.locator('.contact-email');assert.equal(await email.innerText(),contactEmail);
 const url=new URL(await email.getAttribute('href'));assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,'kenroberts@live.com');assert.equal(url.searchParams.get('subject'),'UtahBills — Question or Correction');
 assert.ok((await email.getAttribute('href')).includes('%E2%80%94'));assert.equal(await email.getAttribute('target'),null);
 assert.equal(await page.locator('main input,main textarea,main form').count(),0);
 assert.ok((await page.locator('main').innerText()).includes('copy this address into your email service'));
 await email.evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);getSelection().removeAllRanges();getSelection().addRange(r)});
 assert.equal(await page.evaluate(()=>getSelection().toString()),contactEmail); // Visible selection works without opening a mail client.
 await page.locator('footer a[href="#faq"]').click();await page.locator('h1').filter({hasText:/^FAQ$/}).waitFor();
 await page.goBack();await contact();await page.goForward();await page.locator('h1').filter({hasText:/^FAQ$/}).waitFor();
 await footer().focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');
 assert.equal(await footer().evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')),true);
 await page.keyboard.press('Enter');await contact();assert.equal(await page.locator('main').evaluate(e=>e===document.activeElement),true);
 await page.keyboard.press('Tab');assert.equal(await email.evaluate(e=>e===document.activeElement&&e.matches(':focus-visible')),true);
 assert.notEqual(await email.evaluate(e=>getComputedStyle(e).outlineStyle),'none');
 for(const width of [320,375,390,430,768,1024,1280])for(const mode of ['normal','text','zoom']){
  await page.setViewportSize({width,height:900});await page.goto(base+'#contact');await page.reload();await contact();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='zoom')await page.evaluate(()=>document.documentElement.style.zoom=2);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`${width} ${mode}`);
  assert.ok((await email.boundingBox()).height>=44);assert.ok((await footer().boundingBox()).height>=44);
  assert.equal(await page.locator('footer nav a').evaluateAll(es=>es.every(e=>getComputedStyle(e).textDecorationLine.includes('underline'))),true);
  if(mode==='normal'&&[320,1280].includes(width)){
   await page.evaluate(axe);assert.deepEqual((await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>v.id),[]);
  }
 }
 assert.deepEqual(errors,[]);console.log('Phase 5B: Contact route families, history, email URL/selection, keyboard focus, 21 responsive combinations and accessibility passed. No email sent.');
}finally{await browser.close()}
