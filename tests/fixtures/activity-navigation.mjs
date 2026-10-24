// Choose the approved dated window containing the latest saved event.
// Undated records are exercised separately through Info, never assigned dates.
export async function showSavedActivity(page){
 const period=await page.evaluate(async()=>{const index=await (await fetch('./data/activity/index.json')).json(),latest=index.sessions['2027'].pages.map(p=>p.first).filter(Boolean).sort().at(-1);const parts=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/Denver',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));const cutoff=new Date(Date.parse(parts.year+'-'+parts.month+'-'+parts.day+'T12:00:00Z')-29*86400000).toISOString().slice(0,10);return latest&&latest<cutoff?'prior':'thirty'});
 await page.locator('#activity-period').selectOption(period);
 await page.waitForFunction(()=>document.querySelector('#activity-count')&&!document.querySelector('#activity-count').textContent.includes('Loading'));
}
