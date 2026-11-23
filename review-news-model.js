// News is optional, external reporting. No title/sponsor matching creates associations.
export const outlets = Object.freeze({dispatch:{name:'Utah News Dispatch',host:'utahnewsdispatch.com'},ksl:{name:'KSL',host:'www.ksl.com'},deseret:{name:'Deseret News',host:'www.deseret.com'},tribune:{name:'The Salt Lake Tribune',host:'www.sltrib.com'},fox13:{name:'FOX 13 Utah',host:'www.fox13now.com'},kuer:{name:'KUER',host:'www.kuer.org'}});
export function articleURL(value,source){
 const url=new URL(value),outlet=outlets[source];
 if(!outlet||url.protocol!=='https:'||url.hostname!==outlet.host||url.port||url.username||url.password)throw Error('Unapproved article destination');
 for(const key of [...url.searchParams.keys()])if(/^utm_/i.test(key)||['fbclid','gclid'].includes(key))url.searchParams.delete(key);
 url.hash='';return url.href;
}
function date(value){return typeof value==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(value)&&new Date(value+'T12:00:00Z').toISOString().slice(0,10)===value}
export function newsItems(snapshot){
 if(snapshot?.schemaVersion!==1||snapshot.mode!=='curated-prototype'||!date(snapshot.reviewedOn)||!Array.isArray(snapshot.articles)||snapshot.articles.length>50)throw Error('Invalid news snapshot');
 const seen=new Set(),ids=new Set(),items=[];
 for(const raw of snapshot.articles){
  if(!raw||typeof raw.id!=='string'||!/^[a-z0-9-]{1,80}$/.test(raw.id)||ids.has(raw.id)||!date(raw.publishedDate)||raw.publishedDate>snapshot.reviewedOn||typeof raw.headline!=='string'||!raw.headline.trim()||raw.headline.length>300||typeof raw.author!=='string'||!raw.author.trim()||raw.author.length>100)throw Error('Invalid news item');
  ids.add(raw.id);const url=articleURL(raw.url,raw.outlet),key=raw.outlet+'|'+url;
  if(seen.has(key))continue;seen.add(key);
  // Explicit projection: raw HTML, excerpts and candidate associations cannot leak into the listing.
  items.push({id:raw.id,url,outlet:raw.outlet,headline:raw.headline,author:raw.author,publishedDate:raw.publishedDate});
 }
 return items.sort((a,b)=>b.publishedDate.localeCompare(a.publishedDate)||a.id.localeCompare(b.id));
}
// Editorial triage only: returns mentions, never bill/request identities or links.
export function reportedMentions(text,{titles=[],sponsors=[]}={}){
 const folded=String(text).normalize('NFKC').toLowerCase();
 return {billMentions:[...new Set(folded.match(/\b(?:h\.?\s*b\.?|s\.?\s*b\.?)\s*\d{1,4}\b/g)||[])],titles:titles.filter(t=>folded.includes(t.normalize('NFKC').toLowerCase())),sponsors:sponsors.filter(t=>folded.includes(t.normalize('NFKC').toLowerCase())),associationStatus:'unverified'};
}
