import {execFileSync} from 'node:child_process';
import {readFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {packageMain,verifyRelease,digest} from './release-package.mjs';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
if(process.argv[2]==='--verify'){const report=await verifyRelease(process.argv[3]);console.log(JSON.stringify({commit:report.commit,contentSha256:report.contentSha256,files:report.fileCount}));process.exit(0)}
if(git('status','--porcelain','--untracked-files=normal'))throw Error('Prepare from a clean committed checkout');
const commit=git('rev-parse','HEAD'),root=path.resolve('release-candidates');await mkdir(root,{recursive:true});
const label=process.argv[2]||commit;if(!/^[a-zA-Z0-9_-]+$/.test(label))throw Error('Use a simple candidate label');const output=path.join(root,label);
execFileSync(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
if(git('rev-parse','HEAD')!==commit||git('status','--porcelain','--untracked-files=normal'))throw Error('Source changed during build');
const report=await packageMain('dist',output,{commit,commitTime:git('show','-s','--format=%cI','HEAD'),dataTree:git('rev-parse','HEAD:data'),tools:{node:process.version,python:execFileSync(process.env.PYTHON||(process.platform==='win32'?'python':'python3'),['--version'],{encoding:'utf8'}).trim(),lockSha256:digest(await readFile('package-lock.json'))},signing:'unsigned; no configured signing mechanism asserted'});
await verifyRelease(output);console.log(JSON.stringify({output,commit:report.commit,files:report.fileCount,maxAssetBytes:report.maxAssetBytes,contentSha256:report.contentSha256,cloudflareUploaded:false},null,2));
