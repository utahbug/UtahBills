// Prepare a scoped UI overlay; never upload or edit the immutable baseline.
import {build,transform} from 'esbuild';import {readFile,writeFile,mkdir} from 'node:fs/promises';import path from 'node:path';import {execFileSync} from 'node:child_process';import {pathToFileURL} from 'node:url';
import {verifyRelease,digest} from './release-package.mjs';import {acceptedInterface} from './accepted-interface.mjs';
export async function packageInterfaceFixes(base,output,{expectedContentSha256,changeCommit,commitTime,ci}){
 if(!/^[a-f0-9]{40}$/.test(changeCommit)||ci?.headSha!==changeCommit||ci?.conclusion!=='success'||!['build','deploy'].every(name=>ci.jobs?.some(j=>j.name===name&&j.conclusion==='success')))throw Error('Exact verified commit and successful CI/Pages required');
 const previous=await verifyRelease(base);if(previous.contentSha256!==expectedContentSha256)throw Error('Production baseline checksum mismatch');
 const original=JSON.parse(await readFile(path.join(base,'site/release.json'),'utf8'));
 if(original.approved!==true||original.phase!=='public-search-release'||original.productionOrigin!=='https://legislation.utahbug.com')throw Error('Expected approved production baseline');
 const target=path.resolve(output),source=path.resolve(base);if(target===source||target.startsWith(source+path.sep))throw Error('Separate immutable output required');
 const accepted=await acceptedInterface();for(const [name,bytes]of Object.entries(accepted.assets))if(digest(bytes)!==previous.files[name])throw Error('Frozen interface does not match production: '+name);
 const app=await build({entryPoints:['app.js'],bundle:true,format:'esm',write:false,minify:true});
 const ui=await build({stdin:{contents:"import './production-ui/index.js';",resolveDir:process.cwd(),sourcefile:'interface-followup.js'},bundle:true,format:'esm',write:false,minify:true,plugins:[{name:'approved-heading-correction',setup(b){b.onLoad({filter:/production-ui[\\/]content\.js$/},async args=>{const contents=await readFile(args.path,'utf8'),old='2027 Legislature Bills';if(contents.split(old).length!==3)throw Error('Unexpected frozen heading source');return {contents:contents.replaceAll(old,'2027 Utah Bill Tracking'),loader:'js'}})}}]});
 const styles=await transform((await readFile('styles.css','utf8'))+'\n'+(await readFile('phone-navigation.css','utf8')),{loader:'css',minifyWhitespace:true});
 const assets={'app.js':app.outputFiles[0].contents,'assets/accepted-ui.js':ui.outputFiles[0].contents,'styles.css':Buffer.from(styles.code)};
 await mkdir(target,{recursive:false});await mkdir(path.join(target,'site'));const files={},code={};let totalBytes=0,maxAssetBytes=0;
 const save=async(name,bytes)=>{if(path.isAbsolute(name)||name.includes('\\')||name.split('/').some(p=>p==='..'||p.startsWith('.')))throw Error('Unsafe package path');if(bytes.length>25*1024*1024)throw Error('Asset limit');if(/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\bgh[pousr]_[A-Za-z0-9]{30,}|\bgithub_pat_[A-Za-z0-9_]{30,}/.test(Buffer.from(bytes).toString('utf8')))throw Error('Secret-like content rejected');await mkdir(path.dirname(path.join(target,'site',name)),{recursive:true});await writeFile(path.join(target,'site',name),bytes);files[name]=digest(bytes);totalBytes+=bytes.length;maxAssetBytes=Math.max(maxAssetBytes,bytes.length);if(!name.startsWith('data/')&&name!=='release.json')code[name]=files[name]};
 for(const [name,sha]of Object.entries(previous.files)){if(name==='release.json')continue;const bytes=await readFile(path.join(source,'site',name));if(digest(bytes)!==sha)throw Error('Baseline changed during preparation');await save(name,assets[name]||bytes)}
 const {approval,...unchanged}=original;
 const metadata={...unchanged,phase:'indexable-release-candidate',approved:false,commit:changeCommit,commitTime,runtimeCodeSha256:digest(JSON.stringify(code)),interfaceFixes:{changeCommit,baseRuntimeCommit:original.commit,baseContentSha256:previous.contentSha256,baselineApproval:approval,scope:'Approved navigation/filter fixes; compact detail bookmarks and tooltips; 2027 Utah Bill Tracking heading; desktop notice alignment; weekly Calendar separators. Original data, static pages, indexing and all other files unchanged.',ciRun:ci.databaseId,ciUrl:ci.url,uploadAuthorization:'Owner authorized the November 9 six-correction release; upload requires successful exact-commit validation and a separate approved copy.'}};
 await save('release.json',Buffer.from(JSON.stringify(metadata,null,2)+'\n'));
 const report={...metadata,uploadMethod:'Wrangler Direct Upload after exact-commit verification and immutable approval copy',fileCount:Object.keys(files).length,totalBytes,maxAssetBytes,files,contentSha256:digest(JSON.stringify(files))};
 const bytes=Buffer.from(JSON.stringify(report,null,2)+'\n');await writeFile(path.join(target,'release-manifest.json'),bytes);await writeFile(path.join(target,'SHA256SUMS'),digest(bytes)+'  release-manifest.json\n');await verifyRelease(target);
 if(Object.keys(files).length>20000)throw Error('File-count limit');
 if(Object.keys(files).length!==Object.keys(previous.files).length)throw Error('Unexpected file count');
 for(const [name,sha]of Object.entries(previous.files))if(![...Object.keys(assets),'release.json'].includes(name)&&files[name]!==sha)throw Error('Unapproved file changed: '+name);
 return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const [base,output,expectedContentSha256,changeCommit,run]=process.argv.slice(2);if(!run)throw Error('Usage: package-interface-fixes.mjs BASE NEW_OUTPUT BASE_SHA COMMIT CI_RUN');
 const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();if(git('rev-parse','HEAD')!==changeCommit||git('status','--porcelain'))throw Error('Clean exact-commit checkout required');
 const ci=JSON.parse(execFileSync('gh',['run','view',run,'--repo','utahbug/UtahBills','--json','databaseId,url,headSha,conclusion,jobs'],{encoding:'utf8'}));
 const r=await packageInterfaceFixes(base,output,{expectedContentSha256,changeCommit,commitTime:git('show','-s','--format=%cI',changeCommit),ci});console.log(JSON.stringify({output,commit:r.commit,approved:r.approved,contentSha256:r.contentSha256,fileCount:r.fileCount}));
}
