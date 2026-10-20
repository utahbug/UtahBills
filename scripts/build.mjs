import './validate.mjs';
import {build} from 'esbuild';
import {mkdir,copyFile,cp} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await build({entryPoints:['app.js'],bundle:true,format:'esm',outfile:'dist/app.js',minify:true});
for(const f of ['index.html','styles.css']) await copyFile(f,'dist/'+f);
await cp('data','dist/data',{recursive:true});
await copyFile('node_modules/lucide/LICENSE','dist/LUCIDE-LICENSE.txt');
console.log('Built static site in dist; all assets use relative URLs.');

