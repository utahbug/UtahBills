import {build} from 'esbuild';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const source=async name=>Buffer.from((await readFile('production-ui/'+name,'utf8')).replaceAll('\r\n','\n'));
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function acceptedInterface(){
 const identity=JSON.parse(await readFile('production-ui/acceptance.json','utf8'));
 if(identity.baseline!=='e7d17e382cfc01c241164d54e70bfc869570d1cf')throw Error('Unapproved interface baseline');
 const names=['content.js','index.js','styles.css','toolbar-position.js'];
 if(JSON.stringify(Object.keys(identity.files).sort())!==JSON.stringify(names))throw Error('Unexpected accepted UI sources');
 for(const name of names)if(hash(await source(name))!==identity.files[name].promotedSha256)throw Error('Accepted interface changed: '+name);
 const result=await build({entryPoints:['production-ui/index.js'],bundle:true,format:'esm',write:false,minify:true});
 return {identity,assets:{'assets/accepted-ui.js':result.outputFiles[0].contents,'assets/accepted-ui.css':await source('styles.css')}};
}
