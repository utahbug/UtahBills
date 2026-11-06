import assert from 'node:assert/strict';import {readFile,access} from 'node:fs/promises';import {createHash} from 'node:crypto';
const digest=b=>createHash('sha256').update(b).digest('hex'),manifest=JSON.parse(await readFile('dist/deployment-manifest.json','utf8')),tag='<link rel="stylesheet" href="./review-typography.css">';assert.deepEqual(manifest.environments,['Main','Review']);
for(const [name,expected] of Object.entries(manifest.main)){assert.equal(digest(await readFile('dist/'+name)),expected,'Main artifact changed: '+name);if(name!=='index.html')assert.equal(digest(await readFile('dist/review/'+name)),expected,'Review mismatch: '+name)}
const main=await readFile('dist/index.html','utf8'),review=await readFile('dist/review/index.html','utf8');assert.equal(review.replace(tag,'').replace('<link rel="stylesheet" href="./review-release.css">','').replace('<script type="module" src="./review-release.js"></script>',''),main);assert.equal(main.includes('review-typography.css'),false);for(const html of [main,review])assert.ok(html.includes('<meta name="robots" content="noindex, nofollow">'));
const css=await readFile('dist/review/review-typography.css','utf8');assert.equal(css,await readFile('review-typography.css','utf8'));const declarations=[...css.matchAll(/\{([^}]+)\}/g)].flatMap(m=>m[1].split(';').filter(Boolean));assert.deepEqual(declarations,['font-weight:600','font-weight:500']);console.log(`Combined Pages artifact verified: ${manifest.sharedFiles} Main files unchanged, identical Review assets/data, isolated weight-only CSS and noindex in both.`);

assert.ok(main.includes('viewport-fit=cover'));

for(const file of ['review-navigation.js','review-navigation.css'])await assert.rejects(access('dist/review/'+file),{code:'ENOENT'});

for(const file of ['review-release.js','review-release.css']){await access('dist/review/'+file);await assert.rejects(access('dist/'+file),{code:'ENOENT'});assert.ok(!main.includes(file))}
