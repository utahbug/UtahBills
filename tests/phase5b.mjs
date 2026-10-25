import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {contactEmail,contactDisplayEmail,contactSubject} from '../contact-config.js';
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
  assert.equal(await footer().count(),1);assert.equal(await page.locator('header a[href="#contact"]').count(),1);
  await footer().click();await contact();assert.equal(await footer().getAttribute('aria-current'),'page');
  assert.equal(await page.locator('main').evaluate(e=>e===document.activeElement),true);
 }
 await page.goto(base+'#contact');await page.reload();await contact();assert.equal(await page.title(),'Contact · UtahBug');
 const email=page.locator('.contact-email');assert.equal(await email.innerText(),contactDisplayEmail);
 const url=new URL(await email.getAttribute('href'));assert.equal(url.protocol,'mailto:');assert.equal(url.pathname,contactEmail);assert.equal(url.searchParams.get('subject'),'Utah Legislation - Comments, questions or corrections');
 assert.ok((await email.getAttribute('href')).endsWith(encodeURIComponent(contactSubject)));assert.equal(contactDisplayEmail,'contact@utahbug.com');assert.equal(contactEmail,'kenroberts@live.com');assert.equal(await email.getAttribute('target'),null);
 assert.equal(await page.locator('main input,main textarea,main form').count(),0);
 assert.equal((await page.locator('main').innerText()).includes('If no email application opens'),false);
 assert.deepEqual(await page.locator('.contact-page li').allTextContents(),['Page URL','Bill number or tracking ID','Description of the problem','Official source or supporting information, if available']);
 assert.ok((await page.locator('.contact-page > :last-child').innerText()).includes('independent, nonpartisan'));
 assert.deepEqual(await page.locator('footer nav a').allTextContents(),['About','FAQ','2026 Legislative Archive','Contact']);
 assert.equal(await page.locator('footer nav > :not(a)').count(),0,'No orphanable separator nodes');
 assert.ok((await page.locator('footer p').innerText()).startsWith('© 2026 UtahBug. Unofficial, independent site.'));
 await email.evaluate(e=>{const r=document.createRange();r.selectNodeContents(e);getSelection().removeAllRanges();getSelection().addRange(r)});
 assert.equal(await page.evaluate(()=>getSelection().toString()),contactDisplayEmail); // Visible selection works without opening a mail client.
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

 // Shared envelope: no extra row/height, 44px target, no overlapping nav and sticky visibility.
 const headerContact=page.getByRole('link',{name:'Contact UtahBug',exact:true});
 for(const width of [320,375,390,430,768,1024,1280])for(const mode of ['normal','text',...(width===375?['arial','verdana']:[])]){
  await page.setViewportSize({width,height:844});await page.goto(base+'#requests');await page.reload();await page.locator('.bill-row').first().waitFor();
  if(mode==='text')await page.evaluate(()=>{const es=[...document.querySelectorAll('body *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  if(mode==='arial'||mode==='verdana')await page.evaluate(f=>document.documentElement.style.fontFamily=f,mode);
  await page.evaluate(()=>{window.contactLink=document.querySelector('.header-contact');contactLink.remove()});await page.waitForTimeout(80);
  const baseline=await page.locator('header').evaluate(e=>e.getBoundingClientRect().height);
  await page.evaluate(()=>document.querySelector('.header-inner').append(contactLink));await page.waitForTimeout(80);
  if(mode!=='text'){
   const geometry=await page.locator('header').evaluate(e=>({height:e.getBoundingClientRect().height,scrollY,classes:e.className,children:[...e.querySelectorAll('.header-inner,.brand,nav,nav a,.header-contact')].map(a=>{const r=a.getBoundingClientRect(),s=getComputedStyle(a);return {text:a.textContent,x:r.x,y:r.y,width:r.width,height:r.height,font:s.font,padding:s.padding,gap:s.gap,margin:s.margin}})}));
   assert.ok(geometry.height<=baseline+1,`No added header height ${width} ${mode}: ${JSON.stringify({baseline,...geometry})}`);
  }
  assert.equal(await headerContact.getAttribute('title'),'Contact UtahBug');assert.equal(await headerContact.getAttribute('href'),'#contact');assert.equal(await headerContact.locator('svg.lucide-mail[aria-hidden="true"]').count(),1);
  for(const position of [0,500,1200]){
   await page.evaluate(y=>scrollTo(0,y),position);await page.waitForTimeout(80);
   const r=await headerContact.boundingBox();assert.ok(r.width>=44&&r.height>=44);assert.ok(r.x>=0&&r.x+r.width<=width+1&&r.y>=0&&r.y+r.height<=844,`Visible envelope ${width} ${mode}`);
   assert.equal(await headerContact.evaluate(e=>{const r=e.getBoundingClientRect();return [...document.querySelectorAll('header nav a,header .brand,header .independent')].some(a=>{const s=getComputedStyle(a),b=a.getBoundingClientRect();return s.visibility!=='hidden'&&b.width&&r.left<b.right&&r.right>b.left&&r.top<b.bottom&&r.bottom>b.top})}),false,`No envelope overlap ${width} ${mode}`);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
  await headerContact.focus();await page.keyboard.press('Tab');await page.keyboard.press('Shift+Tab');assert.equal(await headerContact.evaluate(e=>e.matches(':focus-visible')),true);
  await page.keyboard.press('Enter');await contact();assert.equal(await page.locator('main').evaluate(e=>e===document.activeElement),true);await page.waitForFunction(()=>scrollY===0);
 }
 const touch=await browser.newContext({viewport:{width:375,height:812},isMobile:true,hasTouch:true});
 const phone=await touch.newPage();await phone.goto(base+'#requests');await phone.locator('.bill-row').first().waitFor();await phone.evaluate(()=>scrollTo(0,600));await phone.waitForTimeout(80);
 await phone.getByRole('link',{name:'Contact UtahBug',exact:true}).tap();await phone.getByRole('heading',{name:'Contact UtahBug',exact:true}).waitFor();assert.equal(await phone.locator('footer a[href="#contact"]').count(),1);await touch.close();
 assert.deepEqual(errors,[]);console.log('Phase 5B: Contact route families, history, email URL/selection, keyboard focus, 21 responsive combinations, 16 header cases, touch activation and accessibility passed. No email sent.');
}finally{await browser.close()}
