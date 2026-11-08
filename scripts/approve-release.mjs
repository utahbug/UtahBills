import {pathToFileURL} from 'node:url';
/** Make an immutable approved copy; never relabel an existing checksum-locked candidate. */
import {readFile,writeFile,mkdir,cp,stat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {verifyRelease,digest} from './release-package.mjs';
export async function approveRelease(source,target,{expectedContentSha256,authorization,ci}){
 const r=await verifyRelease(source);
 if(r.contentSha256!==expectedContentSha256)throw Error('Candidate checksum mismatch');
 if(r.approved!==false||r.phase!=='indexable-release-candidate')throw Error('Expected unapproved indexable candidate');
 if(!authorization?.trim()||ci?.conclusion!=='success'||ci?.headSha!==r.commit||!ci.jobs?.some(j=>j.name==='build'&&j.conclusion==='success')||!ci.jobs?.some(j=>j.name==='deploy'&&j.conclusion==='success'))throw Error('Owner authorization and exact-commit mandatory CI/deployment required');
 if(r.acceptedInterface?.baseline!=='e7d17e382cfc01c241164d54e70bfc869570d1cf')throw Error('Wrong accepted interface');
 if(Object.keys(r.files).some(n=>/review/i.test(n)))throw Error('Review files cannot be approved');
 await mkdir(target);await cp(path.join(source,'site'),path.join(target,'site'),{recursive:true});
 const file=path.join(target,'site/release.json'),release=JSON.parse(await readFile(file,'utf8'));
 Object.assign(release,{phase:'public-search-release',approved:true,approval:{authorization,baselineContentSha256:r.contentSha256,ciRun:ci.databaseId,ciUrl:ci.url}});
 const bytes=Buffer.from(JSON.stringify(release,null,2)+'\n');await writeFile(file,bytes);
 const files={...r.files,'release.json':digest(bytes)},sizes=await Promise.all(Object.keys(files).map(async n=>(await stat(path.join(target,'site',n))).size));
 const report={...r,...release,files,totalBytes:sizes.reduce((a,b)=>a+b,0),maxAssetBytes:Math.max(...sizes),contentSha256:digest(JSON.stringify(files))};
 const manifest=Buffer.from(JSON.stringify(report,null,2)+'\n');await writeFile(path.join(target,'release-manifest.json'),manifest);await writeFile(path.join(target,'SHA256SUMS'),digest(manifest)+'  release-manifest.json\n');
 await verifyRelease(target);return report;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){
 const [source,target,expectedContentSha256,run,authorization]=process.argv.slice(2);
 if(!source||!target||!expectedContentSha256||!run||!authorization)throw Error('Usage: approve-release.mjs SOURCE NEW_OUTPUT SHA256 CI_RUN AUTHORIZATION');
 const ci=JSON.parse(execFileSync('gh',['run','view',run,'--repo','utahbug/UtahBills','--json','databaseId,url,headSha,conclusion,jobs'],{encoding:'utf8'}));
 const result=await approveRelease(source,target,{expectedContentSha256,authorization,ci});console.log(JSON.stringify({commit:result.commit,approved:result.approved,contentSha256:result.contentSha256,output:target}));
}
