// Commas separate alternatives; words within each alternative all match.
export const normalizeSearch=value=>String(value??'').normalize('NFKC').toLocaleLowerCase('en').replace(/[’']/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function parseSearch(query){
 const groups=[[]];for(const token of String(query).matchAll(/"([^"]*)"|([^\s,"]+)|([,])/g)){
  if(token[3]){if(groups.at(-1).length)groups.push([]);continue}
  const phrase=token[1]!==undefined,text=normalizeSearch(phrase?token[1]:token[2]);if(text)groups.at(-1).push(...(phrase?[{text,phrase}]:text.split(' ').map(text=>({text,phrase:false}))));
 }
 return groups.filter(g=>g.length);
}
export function matchesSearch(groups,fields,{any=false}={}){
 if(!groups.length)return true;const hay=fields.map(normalizeSearch);
 const match=term=>hay.some(field=>field.includes(term.text));return any?groups.flat().some(match):groups.some(group=>group.every(match));
}
export const canBroaden=groups=>groups.length===1&&groups[0].length>1;
