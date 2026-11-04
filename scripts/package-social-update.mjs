// A narrow overlay on an immutable, previously deployed production package.
// It never rebuilds the application or substitutes data from moving Main.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {verifyRelease,digest} from './release-package.mjs';
import {applySocialPreview,socialImagePath,verifySocialImage} from './social-preview.mjs';
export async function packageSocialUpdate(base,output,{expectedContentSha256,changeCommit}){
 if(!/^[a-f0-9]{40}$/.test(changeCommit))throw Error('Exact change commit required');
 const previous=await verifyRelease(base);if(previous.contentSha256!==expectedContentSha256)throw Error('Production baseline checksum mismatch');
 const source=path.resolve(base),target=path.resolve(output);if(target===source||target.startsWith(source+path.sep))throw Error('Separate candidate directory required');
 const image=await readFile(new URL('../'+socialImagePath,import.meta.url));verifySocialImage(image);
 const originalRelease=JSON.parse(await readFile(path.join(source,'site/release.json'),'utf8'));
 const html=applySocialPreview(await readFile(path.join(source,'site/index.html'),'utf8'));
 await mkdir(target,{recursive:false});const site=path.join(target,'site');await mkdir(site);
 const files={},code={};let totalBytes=0,maxAssetBytes=0;
 const save=async(name,bytes)=>{if(name.split('/').some(p=>p==='..')||name.includes('\\')||path.isAbsolute(name))throw Error('Unsafe asset path');await mkdir(path.dirname(path.join(site,name)),{recursive:true});await writeFile(path.join(site,name),bytes);files[name]=digest(bytes);totalBytes+=bytes.length;maxAssetBytes=Math.max(maxAssetBytes,bytes.length);if(!name.startsWith('data/')&&name!=='release.json')code[name]=files[name]};
 for(const name of Object.keys(previous.files)){if(name==='release.json'||name===socialImagePath)continue;const bytes=await readFile(path.join(source,'site',name));if(digest(bytes)!==previous.files[name])throw Error('Baseline changed during packaging');await save(name,name==='index.html'?Buffer.from(html):bytes)}
 await save(socialImagePath,image);
 const socialPreviewUpdate={changeCommit,baseContentSha256:previous.contentSha256,baseRuntimeCodeSha256:originalRelease.runtimeCodeSha256,scope:'Root social metadata and branded PNG only; original application/data commit retained'};
 const metadata={...originalRelease,socialPreviewUpdate,runtimeCodeSha256:digest(JSON.stringify(code))};
 await save('release.json',Buffer.from(JSON.stringify(metadata,null,2)+'\n'));
 const report={...metadata,uploadMethod:'Wrangler Direct Upload (owner approval required)',fileCount:Object.keys(files).length,totalBytes,maxAssetBytes,files,contentSha256:digest(JSON.stringify(files))};
 const reportBytes=Buffer.from(JSON.stringify(report,null,2)+'\n');await writeFile(path.join(target,'release-manifest.json'),reportBytes);await writeFile(path.join(target,'SHA256SUMS'),digest(reportBytes)+'  release-manifest.json\n');await verifyRelease(target);
 for(const [name,sha]of Object.entries(previous.files))if(!['index.html','release.json',socialImagePath].includes(name)&&files[name]!==sha)throw Error('Unapproved production change: '+name);
 return report;
}
