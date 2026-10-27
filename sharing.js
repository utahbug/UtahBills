import {publishedBaseUrl} from './site-config.js';
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sharingBase(href){
 const url=new URL(href),host=url.hostname;
 const temporary=url.protocol!=='https:'||host==='localhost'||host.endsWith('.localhost')||host.endsWith('.local')||host.includes(':')||/^\d+(?:\.\d+){3}$/.test(host)||/\.(pages\.dev|vercel\.app|netlify\.app)$/.test(host)||/\/(review|preview)(\/|$)/i.test(url.pathname);
 const base=temporary?new URL(publishedBaseUrl):new URL('.',url);base.search='';base.hash='';return base;
}
export function shareUrl(route,base){
 // Only existing request and session-qualified/legacy bill detail/history routes.
 if(!/^#(?:request\/[A-Z]{10}|bill\/(?:20\d{2}\/)?[HS](?:[BR]\d{4}|[JC]R\d{3}))(?:\/history)?$/.test(route))throw Error('Unsupported saved record destination');
 const url=new URL(route,base);if(url.protocol!=='https:')throw Error('Unsafe share destination');return url.href;
}
export async function titleLinks(rows,href,onProgress=()=>{}){
 const base=sharingBase(href),plain=[],html=[];
 for(let i=0;i<rows.length;i++){
  const {title,route}=rows[i];if(typeof title!=='string'||!title.trim())throw Error('Missing saved title');
  const url=shareUrl(route,base);plain.push(title+'\n'+url);html.push('<p><a href="'+escape(url)+'">'+escape(title)+'</a><br>'+escape(url)+'</p>');
  if((i+1)%250===0){onProgress(i+1,rows.length);await new Promise(r=>setTimeout(r,0))}
 }
 return {count:rows.length,plain:plain.join('\n\n'),html:html.join('')};
}
