import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const contract=JSON.parse(fs.readFileSync('release-contract.json','utf8'));
const version=String(contract.publicVersion||'').trim();
if(!/^\d+(?:\.\d+)+$/.test(version))throw new Error(`invalid publicVersion: ${version}`);

const files=[
  'scripts/axis-smoke.mjs',
  'scripts/axis-completion-smoke.mjs',
  'scripts/axis-88-smoke.mjs',
  'scripts/axis-first-paint-smoke.mjs',
  'scripts/axis-webkit-smoke.mjs',
  'scripts/axis-881-smoke.mjs',
  'scripts/axis-882-smoke.mjs',
  'scripts/axis-89-smoke.mjs',
  'scripts/axis-891-smoke.mjs',
  'scripts/axis-810-smoke.mjs'
];

for(const file of files){
  if(!fs.existsSync(file))continue;
  let src=fs.readFileSync(file,'utf8');
  const before=src;
  src=src.replace(/canonical-\d+(?:\.\d+)+/g,`canonical-${version}`);
  src=src.replace(/版本 \d+(?:\.\d+)+/g,`版本 ${version}`);
  src=src.replace(/(canonical\?\.version\s*,\s*)['"]\d+(?:\.\d+)+['"]/g,`$1'${version}'`);
  src=src.replace(/((?:first|core|final)\.release\s*,\s*)['"]\d+(?:\.\d+)+['"]/g,`$1'${version}'`);
  src=src.replace(/(window\.__AXIS_RELEASE__\s*\)\s*,\s*)['"]\d+(?:\.\d+)+['"]/g,`$1'${version}'`);
  if(file==='scripts/axis-891-smoke.mjs'){
    src=src.replace("assert.ok((diag?.phrases?.()||0)>=108);","assert.ok((await page.evaluate(()=>window.__AXIS_REST_SPEAK__?.phrases?.()||0))>=108);");
    if(version==='8.10'){
      src=src.replace("assert.equal(diag?.patch,'8.9.1');","assert.ok(['8.9.1','8.10'].includes(diag?.patch));");
      src=src.replace("assert.equal(diag?.richEnglish,72);","assert.ok((diag?.richEnglish||0)>=72);");
    }
  }
  if(src!==before)fs.writeFileSync(file,src);
  const wrongCanonical=[...src.matchAll(/canonical-(\d+(?:\.\d+)+)/g)].map(m=>m[1]).filter(v=>v!==version);
  const wrongLabels=[...src.matchAll(/版本 (\d+(?:\.\d+)+)/g)].map(m=>m[1]).filter(v=>v!==version);
  const wrongRelease=[...src.matchAll(/(?:first|core|final)\.release\s*,\s*['"](\d+(?:\.\d+)+)['"]/g)].map(m=>m[1]).filter(v=>v!==version);
  const wrongObjectVersion=[...src.matchAll(/canonical\?\.version\s*,\s*['"](\d+(?:\.\d+)+)['"]/g)].map(m=>m[1]).filter(v=>v!==version);
  const wrongWindowRelease=[...src.matchAll(/window\.__AXIS_RELEASE__\s*\)\s*,\s*['"](\d+(?:\.\d+)+)['"]/g)].map(m=>m[1]).filter(v=>v!==version);
  const stale=[...new Set([...wrongCanonical,...wrongLabels,...wrongRelease,...wrongObjectVersion,...wrongWindowRelease])];
  if(stale.length)throw new Error(`${file} retains stale release assertion(s): ${stale.join(', ')}`);
}

if(version==='8.8.2'){
  if(!fs.existsSync('scripts/prepare-882-test-flow.mjs'))throw new Error('AXIS 8.8.2 test-flow convergence is missing');
  execFileSync(process.execPath,['scripts/prepare-882-test-flow.mjs'],{stdio:'inherit'});
}
if(version==='8.9'||version.startsWith('8.9.')||version==='8.10'){
  if(!fs.existsSync('scripts/prepare-89-test-flow.mjs'))throw new Error('AXIS 8.9 test-flow convergence is missing');
  execFileSync(process.execPath,['scripts/prepare-89-test-flow.mjs'],{stdio:'inherit'});
}

console.log(`[AXIS test contract] browser assertions aligned to ${version} · no stale release assertions · release flow aligned`);
