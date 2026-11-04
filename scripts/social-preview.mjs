export const socialImagePath='assets/social-capitol-512.png';
export const socialTitle='UtahBug · Utah Legislation';
export const socialDescription='2027 Utah bill tracking';
export const socialOrigin='https://legislation.utahbug.com/';
export const socialAlt='UtahBug Capitol symbol in white on a navy-blue square';
export function applySocialPreview(html){
 const end=html.indexOf('</head>');if(end<0)throw Error('Missing static HTML head');
 const head=html.slice(0,end),body=html.slice(end);
 if(!head.includes('<meta name="robots" content="noindex, nofollow">')||!head.includes('<link rel="canonical" href="'+socialOrigin+'">'))throw Error('Expected unindexed production root with preserved canonical');
 const cleaned=head.replace(/<meta (?:name="twitter:[^"]+"|property="og:(?:title|description|image(?::[^"]+)?|url)") content="[^"]*">/g,'');
 const tags=[['name','twitter:card','summary'],['name','twitter:title',socialTitle],['name','twitter:description',socialDescription],['name','twitter:image',socialOrigin+socialImagePath],['name','twitter:image:alt',socialAlt],['property','og:title',socialTitle],['property','og:description',socialDescription],['property','og:image',socialOrigin+socialImagePath],['property','og:image:alt',socialAlt],['property','og:image:type','image/png'],['property','og:image:width','512'],['property','og:image:height','512'],['property','og:url',socialOrigin]];
 return cleaned+tags.map(([attribute,key,value])=>`<meta ${attribute}="${key}" content="${value}">`).join('')+body;
}
export function verifySocialImage(bytes){
 if(bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a'||bytes.readUInt32BE(16)!==512||bytes.readUInt32BE(20)!==512||bytes.length>5*1024*1024)throw Error('Expected a 512×512 PNG under 5 MB');
}
