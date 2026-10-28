import {publishedBaseUrl} from './site-config.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sharingBase(href){
 const url=new URL(href),host=url.hostname;
 const temporary=url.protocol!=='https:'||host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||host.includes(':')||/^\d+(?:\.\d+){3}$/.test(host)||/\.(pages\.dev|vercel\.app|netlify\.app)$/.test(host);
 url.pathname=url.pathname.replace(/\/(review|preview)(\/.*)?$/i,'/');const base=temporary?new URL(publishedBaseUrl):new URL('.',url);base.search='';base.hash='';return base;
}
export function shareUrl(route,base){
 // Only existing request and session-qualified/legacy bill detail/history routes.
 if(!/^#(?:request\/[A-Z]{10}|bill\/(?:20\d{2}\/)?[HS](?:[BR]\d{4}|[JC]R\d{3}))(?:\/history)?$/.test(route))throw Error('Unsupported saved record destination');
 const url=new URL(route,base);if(url.protocol!=='https:')throw Error('Unsafe share destination');return url.href;
}
export function titleLinks(rows,href,onProgress=()=>{}){
 const base=sharingBase(href),plain=[],html=[];
 for(let i=0;i<rows.length;i++){
  const {title,route}=rows[i];if(typeof title!=='string'||!title.trim())throw Error('Missing saved title');
  const url=shareUrl(route,base);plain.push(title+'\n'+url);html.push('<p><a href="'+escape(url)+'">'+escape(title)+'</a><br>'+escape(url)+'</p>');
  if((i+1)%250===0){onProgress(i+1,rows.length)}
 }
 return {count:rows.length,plain:plain.join('\n\n'),html:html.join('')};
}
export function titlesOnly(rows,onProgress=()=>{}){
 const titles=[];
 for(let i=0;i<rows.length;i++){
  if(typeof rows[i].title!=='string'||!rows[i].title.trim())throw Error('Missing saved title');
  titles.push(rows[i].title);
  if((i+1)%250===0){onProgress(i+1,rows.length)}
 }
 return {count:rows.length,plain:titles.join('\n')};
}

// Start the browser write during the click, before fetching/formatting finishes.
// Promised ClipboardItem data preserves the user-activation opportunity in Safari.
export async function copyPrepared(prepared,{rich=true,clipboard=globalThis.navigator?.clipboard,Item=globalThis.ClipboardItem}={}){
 const ready=prepared&&typeof prepared.then!=='function';
 if(ready&&!prepared.count)return {result:prepared,copied:false};
 let writing;
 // Ready plain text uses writeText immediately, without a promise boundary.
 if(ready&&(!rich||!clipboard?.write||!Item)&&clipboard?.writeText){
  try{writing=Promise.resolve(clipboard.writeText(prepared.plain)).then(()=>true,()=>false)}catch{}
 }else if(clipboard?.write&&Item){
  const data={};for(const type of ['text/plain',...(rich?['text/html']:[])]){
   const blob=result=>{if(!result.count)throw Error('No matching records');return new Blob([type==='text/html'?result.html:result.plain],{type})};
   data[type]=ready?blob(prepared):Promise.resolve(prepared).then(blob);data[type].catch?.(()=>{});
  }
  try{writing=Promise.resolve(clipboard.write([new Item(data)])).then(()=>true,()=>false)}catch{}
 }
 const result=await prepared;
 // Never start a second write after async preparation or permission rejection.
 // The caller offers the complete prepared text with a fresh-action copy button.
 return {result,copied:!!result.count&&!!writing&&await writing};
}

// Compact clipboard entries preserve words while removing source line wrapping.
const oneLine=value=>String(value||'').replace(/\s+/gu,' ').trim();
export function titlesSponsors(rows,href,onProgress=()=>{}){
 const base=sharingBase(href),plain=[],html=[];
 for(let i=0;i<rows.length;i++){
  const row=rows[i],title=oneLine(row.title);if(!title)throw Error('Missing saved title');
  const url=shareUrl(row.route,base),name=oneLine(row.sponsorName)||'Unavailable',prefix=row.number?oneLine(row.number)+' — ':'';
  let sponsor=escape(name);
  if(row.sponsorRoute){if(!/^#legislator\/[A-Z0-9]+\/20\d{2}$/.test(row.sponsorRoute))throw Error('Unsupported sponsor destination');sponsor='<a href="'+escape(new URL(row.sponsorRoute,base).href)+'">'+sponsor+'</a>'}
  plain.push(prefix+title+' — Sponsor: '+name);html.push(escape(prefix)+'<a href="'+escape(url)+'">'+escape(title)+'</a> — Sponsor: '+sponsor);
  if((i+1)%250===0){onProgress(i+1,rows.length)}
 }
 return {count:rows.length,plain:plain.join('\n'),html:html.join('<br>')};
}
