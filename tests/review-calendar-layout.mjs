import assert from 'node:assert/strict';
import {chromium,webkit,devices} from 'playwright';
import {readFile,mkdir} from 'node:fs/promises';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/',axe=await readFile('node_modules/axe-core/axe.min.js','utf8');
await mkdir('test-results/review-calendar',{recursive:true});
const layouts=[['phone-small',320,700,'iPhone 13'],['phone',390,844,'iPhone 13'],['phone-landscape',844,390,'iPhone 13'],['ipad',768,1024,'iPad Mini'],['ipad-landscape',1024,768,'iPad Mini'],['desktop',1280,900,null]];
for(const engine of [chromium,webkit]){const b=await engine.launch();try{
 for(const [name,width,height,device] of layouts)for(const theme of ['light','dark'])for(const enlarged of [false,true]){
  const options={...(device?devices[device]:{}),viewport:{width,height},colorScheme:theme},p=await b.newPage(options);
  await p.addInitScript(()=>{Object.defineProperty(navigator,'clipboard',{value:{writeText:async t=>{if(window.copyFails)throw Error('denied');window.copied=t}},configurable:true})});
  await p.goto(base+'review/#calendar');await p.locator('.review-month-controls').waitFor();
  const month=p.locator('#calendar-month'),toggle=p.locator('#calendar-toggle'),type=p.locator('#calendar-type'),key=p.locator('#review-key-dates');
  assert.equal(await p.locator('.review-month-controls #calendar-toggle').count(),1);assert.equal(await p.locator('.review-month-controls #calendar-month').count(),1);
  await p.evaluate(()=>window.originalCalendarToggle=document.querySelector('#calendar-toggle'));
  if(enlarged)await p.evaluate(()=>{const es=[...document.querySelectorAll('main *')],sizes=es.map(e=>parseFloat(getComputedStyle(e).fontSize));es.forEach((e,i)=>e.style.fontSize=sizes[i]*2+'px')});
  const first=await toggle.boundingBox(),second=await key.boundingBox();assert.ok(second.y>=first.y+first.height-1);if(width>360){const a=await month.locator('xpath=ancestor::label').boundingBox(),e=await type.locator('xpath=ancestor::label').boundingBox();assert.ok(Math.abs(a.x-e.x)<1);assert.ok(Math.abs(first.x-second.x)<1,'Shared second-column alignment')}
  if(!enlarged&&width>=390){const a=await month.boundingBox(),t=await toggle.boundingBox();assert.ok(Math.abs(a.y+a.height/2-t.y-t.height/2)<2,'Month/toggle same row')}
  for(const control of [month,toggle,type,key]){const r=await control.boundingBox();assert.ok(r.width>=44&&r.height>=44,JSON.stringify({name,r}));assert.ok(r.x>=0&&r.x+r.width<=width+1)}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  await toggle.focus();await p.keyboard.press('Enter');assert.equal(await toggle.getAttribute('aria-expanded'),'true');assert.ok(await p.locator('#calendar-grid').isVisible());await toggle.click();assert.equal(await toggle.getAttribute('aria-expanded'),'false');
  await type.focus();await p.keyboard.press('Tab');assert.equal(await key.evaluate(e=>e===document.activeElement),true);assert.notEqual(await key.evaluate(e=>getComputedStyle(e).outlineStyle),'none');await p.keyboard.press('Enter');await p.locator('#review-key-dates-dialog[open]').waitFor();await p.keyboard.press('Escape');await p.waitForFunction(()=>document.activeElement.id==='review-key-dates');
  const selected=await month.locator('option').first().getAttribute('value');await month.selectOption(selected);await type.selectOption('meeting');assert.ok(await p.evaluate(()=>originalCalendarToggle===document.querySelector('#calendar-toggle')));await type.selectOption('');
  assert.equal(await p.locator('.calendar-agenda').evaluate(e=>getComputedStyle(e).paddingTop),'0px');assert.equal(await p.locator('.agenda-heading').evaluate(e=>getComputedStyle(e).marginTop),'0px');
  const firstGroup=p.locator('.calendar-date-group').first();if(await firstGroup.count())assert.equal(await firstGroup.evaluate(e=>getComputedStyle(e).marginTop),'4px');
  if(!enlarged){await p.evaluate(axe);assert.deepEqual((await p.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}}))).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[])}
  await p.evaluate(()=>scrollTo(0,0));await p.screenshot({path:`test-results/review-calendar/${engine.name()}-${name}-${theme}-${enlarged?'enlarged':'normal'}.png`});
  if(name==='phone'&&!enlarged){
   const signature=()=>p.locator('.calendar-event').evaluateAll(es=>es.map(e=>({text:e.innerText,links:[...e.querySelectorAll('a')].map(a=>a.getAttribute('href')),padding:getComputedStyle(e).padding,gap:getComputedStyle(e).gap}))),records=await signature();
   await p.locator('.copy-results').click();await p.waitForFunction(()=>window.copied);const copied=await p.evaluate(()=>window.copied);await p.evaluate(()=>window.copyFails=true);await p.locator('.copy-results').click();await p.locator('.copy-fallback').waitFor();assert.equal(await p.locator('.copy-fallback').inputValue(),copied);
   await p.goto(base+'#calendar');await p.locator('#calendar-month').selectOption(selected);assert.equal(await p.locator('.review-month-controls').count(),0);assert.deepEqual(await signature(),records);await p.evaluate(()=>window.copyFails=false);await p.locator('.copy-results').click();await p.waitForFunction(()=>window.copied);assert.equal(await p.evaluate(()=>window.copied),copied);
  }
  await p.close();
 }
}finally{await b.close()}}
console.log('Review Calendar: Chromium/WebKit phone/iPad/desktop orientations, text enlargement, themes, two-row controls, toggles/selectors, Key Dates keyboard, axe, unchanged record details/spacing and complete Copy/fallback passed.');
