// Browser-only projections. Never written to data/ or used by the build.
export function sessionFixture(saved, count=0, requestCount=240) {
 const data=structuredClone(saved), template=data.measures.find(b=>b.sessionID==='2026GS'&&!b.detailed);
 const requests=Array.from({length:requestCount},(_,i)=>({
  ...structuredClone(saved.requestArchive2027[0]),trackingID:'ZZZZZZZZ'+String.fromCharCode(65+Math.floor(i/26))+String.fromCharCode(65+i%26),
  shortTitle:'SYNTHETIC REQUEST '+String(i).padStart(4,'0'),introducedBill:null,currentlyListed:true,
  officialStatus:'In Process',history:[],statusHistory:[]
 }));
 const introduced=Array.from({length:count},(_,i)=>{
  const chamber=i%2?'S':'H',number=chamber+'B'+String(i+1).padStart(4,'0');
  return {...template,sessionID:'2027GS',billNumber:number,billNumberShort:chamber+'.B. '+(i+1),
   trackingID:i===0?requests[0].trackingID:'TESTMEASURE'+i,shortTitle:'SYNTHETIC MEASURE '+String(i).padStart(4,'0'),
   generalProvisions:'Isolated transition fixture only.',status:'Introduced',lastAction:'Introduced',
   lastActionDate:'2027-01-'+String(i%20+1).padStart(2,'0'),committees:['Synthetic committee'],
   detailed:false,versionCount:1,sourceUrl:'https://le.utah.gov/data/2027GS/'+number+'.json',
   officialUrl:'https://le.utah.gov/~2027/bills/static/'+number+'.html'};
 });
 if(count) requests[0].introducedBill=introduced[0].billNumber;
 data.measures=[...data.measures.filter(b=>b.sessionID!=='2027GS'),...introduced];
 data.sourceObservedRequests2027=[];data.requestObservations2027=[];data.requestArchive2027=requests;data.requests2027=requests.filter(r=>!r.introducedBill);
 data.coverage['2027']={...data.coverage['2027'],expected:count,imported:count,emptyIndex:!count,complete:!!count};
 return data;
}
export async function interceptSession(page,data) {
 await page.route('**/data/catalog-ui.json',r=>r.fulfill({json:data}));
 await page.route('**/data/measures/2027GS/*.json',r=>{
  const number=new URL(r.request().url()).pathname.split('/').at(-1).replace('.json','');
  const bill=data.measures.find(b=>b.sessionID==='2027GS'&&b.billNumber===number);
  return r.fulfill({json:{...bill,versions:[],actionHistoryList:[],cosponsors:{},request:data.requestArchive2027.find(x=>x.trackingID===bill?.trackingID)}});
 });
 await page.route('**/data/archive-votes/2027GS/*.json',r=>r.fulfill({json:{records:[],coverage:{verified:0,expected:0,missing:0}}}));
}
