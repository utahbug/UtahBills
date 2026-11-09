import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
import {cp,readdir,readFile,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
const root=path.resolve('dist'),review=path.join(root,'review');
const digest=b=>createHash('sha256').update(b).digest('hex');
async function files(dir,prefix=''){const result=[];for(const item of await readdir(dir,{withFileTypes:true})){const name=prefix+item.name;if(item.isDirectory())result.push(...await files(path.join(dir,item.name),name+'/'));else if(item.isFile())result.push(name);else throw Error('Unsupported artifact entry: '+name)}return result.sort()}
// Called once after the normal build. Never recursively copy an existing Review.
try{await stat(review);throw Error('Review already exists; rebuild the complete artifact first')}catch(e){if(e.code!=='ENOENT')throw e}
const names=await files(root),before={};for(const name of names)before[name]=digest(await readFile(path.join(root,name)));
for(const item of await readdir(root))await cp(path.join(root,item),path.join(review,item),{recursive:true});
const html=await readFile(path.join(review,'index.html'),'utf8');
if(!html.includes('<meta name="robots" content="noindex, nofollow">'))throw Error('Missing noindex');
await writeFile(path.join(review,'index.html'),html.replace('</head>','<link rel="stylesheet" href="./review-typography.css"><link rel="stylesheet" href="./review-release.css"><script type="module" src="./review-release.js"></script></head>'));
await cp('review-typography.css',path.join(review,'review-typography.css'));
await cp('review-release.css',path.join(review,'review-release.css'));
execFileSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['scripts/review_party.py',path.join(review,'review-party.json')],{stdio:'inherit'});
await build({entryPoints:['review-release.js'],bundle:true,format:'esm',outfile:path.join(review,'review-release.js'),minify:true});
for(const name of names){if(digest(await readFile(path.join(root,name)))!==before[name])throw Error('Main changed: '+name);if(name!=='index.html'&&digest(await readFile(path.join(review,name)))!==before[name])throw Error('Review snapshot mismatch: '+name)}
const bytes=(await Promise.all(names.map(async n=>(await stat(path.join(root,n))).size))).reduce((a,b)=>a+b,0);
if(bytes*2>=950_000_000)throw Error('Combined artifact approaches Pages size limit; review packaging before publishing');
await writeFile(path.join(root,'deployment-manifest.json'),JSON.stringify({environments:['Main','Review'],reviewExperiment:'listing-font-weight; November 13 color and Settings review',sharedFiles:names.length,mainBytes:bytes,main:before},null,2));
console.log(`Packaged Main and Review: ${names.length} identical snapshot files; Main unchanged; approximately ${bytes*2} combined bytes.`);
