import './validate.mjs';
import {build} from 'esbuild';
import {mkdir,copyFile,cp,rm,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
const project=process.cwd(),output=path.resolve(project,'dist');
if(output!==path.join(project,'dist')||path.dirname(output)!==project)throw Error('Unsafe output directory');
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
await build({entryPoints:['app.js'],bundle:true,format:'esm',outfile:'dist/app.js',minify:true});
for(const f of ['index.html','styles.css']) await copyFile(f,'dist/'+f);
await cp('data','dist/data',{recursive:true});
const calendar=JSON.parse(await readFile('data/calendar.json','utf8'));
const {agendas,...calendarView}=calendar;
calendarView.sources=calendar.sources.map(({body,...source})=>source);
await writeFile('dist/data/calendar-ui.json',JSON.stringify(calendarView));
await cp('assets','dist/assets',{recursive:true});
await copyFile('node_modules/lucide/LICENSE','dist/LUCIDE-LICENSE.txt');
console.log('Built static site in dist; all assets use relative URLs.');


