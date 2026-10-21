import {chromium} from 'playwright';import assert from 'node:assert/strict';
const base=process.env.UTAHBILLS_BASE_URL||'http://127.0.0.1:4173/UtahBills/';
const browser=await chromium.launch(process.env.CI?{headless:true}:{channel:'msedge',headless:true});try{const page=await browser.newPage({viewport:{width:768,height:900}});for(const route of ['bills','bill/SB0069','guide','sources']){await page.goto(base+'?text-test='+encodeURIComponent(route)+'#'+route);await page.locator('h1').waitFor();await page.waitForTimeout(150);await page.evaluate(()=>{const items=[...document.querySelectorAll('body,body *')].map(el=>[el,parseFloat(getComputedStyle(el).fontSize)]);for(const [el,size]of items)el.style.fontSize=size*2+'px'});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route)}console.log('200% enlargement of all computed text sizes: four routes pass reflow at 768px')}finally{await browser.close()}


