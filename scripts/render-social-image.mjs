import {chromium} from 'playwright';
import Landmark from '../node_modules/lucide/dist/esm/icons/landmark.js';
const attrs=a=>Object.entries(a).map(([k,v])=>`${k}="${v}"`).join(' ');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" fill="#16374a"/><svg x="64" y="64" ${attrs({...Landmark[1],width:384,height:384,stroke:'#ffffff'})}>${Landmark[2].map(([tag,a])=>`<${tag} ${attrs(a)}/>`).join('')}</svg></svg>`;
const b=await chromium.launch();try{const p=await b.newPage({viewport:{width:512,height:512},deviceScaleFactor:1});await p.setContent(`<style>html,body{margin:0;width:512px;height:512px}</style>${svg}`);await p.screenshot({path:'assets/social-capitol-512.png'});}finally{await b.close()}
console.log('Rendered the existing Lucide Landmark geometry in white on brand navy.');
