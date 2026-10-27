import assert from 'node:assert/strict';
import {titleLinks,sharingBase,shareUrl} from '../sharing.js';
const title='A & B <script> “water” — ½';
const rows=[{title,route:'#request/XKUCMCIIHJ'},{title,route:'#bill/2027/HB0001/history'}];
const result=await titleLinks(rows,'http://127.0.0.1:4173/UtahBills/?debug=1#requests');
assert.equal(result.plain,title+'\nhttps://utahbug.github.io/UtahBills/#request/XKUCMCIIHJ\n\n'+title+'\nhttps://utahbug.github.io/UtahBills/#bill/2027/HB0001/history');
assert.ok(result.html.includes('A &amp; B &lt;script&gt;'));assert.ok(!result.html.includes('<script>'));assert.equal(result.count,2);
assert.equal(sharingBase('https://bills.example.test/?temporary=1#activity').href,'https://bills.example.test/');
for(const input of ['https://localhost:4173/','https://127.0.0.1/','https://preview.pages.dev/','https://utahbug.github.io/UtahBills/review/'])assert.equal(sharingBase(input).href,'https://utahbug.github.io/UtahBills/');
for(const route of ['javascript:alert(1)','https://evil.example/','#request/WRONG','#bill/HB0011?test=1','#bill/2027/HB0001/../../x'])assert.throws(()=>shareUrl(route,sharingBase('https://example.test/')));
const progress=[];const big=await titleLinks(Array.from({length:5000},()=>rows[0]),'https://bills.example.test/',n=>progress.push(n));assert.equal(big.count,5000);assert.equal(progress.length,20);assert.equal(big.plain.split('\n\n').length,5000);assert.equal((await titleLinks([],'https://example.test/')).plain,'');
console.log('Sharing: safe exact routes, deployed/local/preview bases, Unicode and escaping, duplicate titles, empty sets and 5,000 asynchronously formatted records passed.');

assert.equal(shareUrl('#bill/HJR001',sharingBase('https://example.test/')),'https://example.test/#bill/HJR001');

for(const id of ['HB0011','SB0069','HR0001','SR0001','HJR001','SJR001','HCR001','SCR001'])assert.equal(shareUrl('#bill/'+id,sharingBase('https://example.test/')),'https://example.test/#bill/'+id);
