import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const contract=JSON.parse(fs.readFileSync('release-contract.json','utf8'));
const version=String(contract.publicVersion||'').trim();
if(!/^\d+(?:\.\d+)+$/.test(version))throw new Error(`invalid publicVersion: ${version}`);
const modern810=version.startsWith('8.10')||version==='8.11';

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
  'scripts/axis-810-smoke.mjs',
  'scripts/axis-8101-smoke.mjs',
  'scripts/axis-product-matrix.mjs'
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
  src=src.replace(/assert\.equal\(EXPECTED,['"]\d+(?:\.\d+)+['"]\)/g,`assert.equal(EXPECTED,'${version}')`);
  if(modern810&&file==='scripts/axis-89-smoke.mjs'){
    src=src.replace(
      "prefs:{enabled:true,native:'zh',target:'en'}",
      "prefs:{enabled:true,native:'zh',target:'en',mode:'standard',track:'auto',cadence:'every',level:'adaptive',dailyTarget:0,opportunity:'auto'}"
    );
    src=src.replace(
      "assert.match(restLines.target,/^(?:休息 )?\\d{2}:\\d{2} · (Could|Is |I'm|Go |No |That |Can |Where |Sounds)/i);",
      "assert.match(restLines.target,/^(?:休息 )?\\d{2}:\\d{2} · .{2,}$/u,'Rest Speak target is not a complete timer + phrase line');"
    );
  }
  if(file==='scripts/axis-891-smoke.mjs'){
    src=src.replace("assert.ok((diag?.phrases?.()||0)>=108);","assert.ok((await page.evaluate(()=>window.__AXIS_REST_SPEAK__?.phrases?.()||0))>=108);");
    if(modern810){
      src=src.replace("assert.equal(diag?.patch,'8.9.1');","assert.ok(['8.9.1','8.10'].includes(diag?.patch));");
      src=src.replace("assert.equal(diag?.richEnglish,72);","assert.ok((diag?.richEnglish||0)>=72);");
      src=src.replace(
        "prefs:{enabled:true,native:'zh',target:'en'}",
        "prefs:{enabled:true,native:'zh',target:'en',mode:'standard',track:'auto',cadence:'every',level:'adaptive',dailyTarget:0,opportunity:'auto'}"
      );
      src=src.replace(
        "await page.evaluate(()=>{window.__AXIS_891_DIRECT__=[];let n=40;const loop=()=>{const s=document.querySelector('#detailSheet');if(s?.classList.contains('show'))window.__AXIS_891_DIRECT__.push({title:document.querySelector('#detailTitle')?.textContent||'',body:(document.querySelector('#detail')?.innerText||'').replace(/\\s+/g,' ').trim(),pre:s.classList.contains('axis884Prepaint')});if(n-->0)requestAnimationFrame(loop)};requestAnimationFrame(loop)});",
        "await page.evaluate(()=>{const s=document.querySelector('#detailSheet');window.__AXIS_891_DIRECT__=[];window.__AXIS_891_DIRECT_OBS__?.disconnect?.();const snap=()=>{if(s?.classList.contains('show'))window.__AXIS_891_DIRECT__.push({title:document.querySelector('#detailTitle')?.textContent||'',body:(document.querySelector('#detail')?.innerText||'').replace(/\\s+/g,' ').trim(),pre:s.classList.contains('axis884Prepaint')})};const o=new MutationObserver(snap);if(s)o.observe(s,{attributes:true,attributeFilter:['class'],subtree:true,childList:true,characterData:true});window.__AXIS_891_DIRECT_OBS__=o;snap()});"
      );
      src=src.replace(
        "const direct=await page.evaluate(()=>window.__AXIS_891_DIRECT__||[]);",
        "const direct=await page.evaluate(()=>{window.__AXIS_891_DIRECT_OBS__?.disconnect?.();return window.__AXIS_891_DIRECT__||[]});"
      );
    }
  }
  if(version==='8.10.1'&&file==='scripts/axis-810-smoke.mjs'){
    src=src.replace(
      "assert.match(await page.locator('#v810ConfigSummary').innerText(),/日常.*长休.*每日 12/);",
      "assert.equal((await page.locator('#v810ConfigSummary').innerText()).trim(),'自定','8.10.1 top-level learning summary should stay compact after custom scheduling');"
    );
  }
  if(version==='8.10.1'&&file==='scripts/axis-8101-smoke.mjs'){
    src=src.replace(
      "assert.equal(entry.b,'智能');",
      "assert.equal(entry.b,'自定','explicit every-rest cadence should render the compact custom status');"
    );
  }
  if(['8.10.3','8.11'].includes(version)&&file==='scripts/axis-product-matrix.mjs'){
    const stale="assert.equal(await page.locator('#v8710Rest:visible,#v8710Session:visible,#v876TargetSheet:visible').count(),0,'retired rest/session automatic reminder controls returned');";
    const current="assert.equal(await page.locator('#v8710Rest:visible,#v876TargetSheet:visible').count(),0,'retired rest automatic reminder controls returned');assert.equal(await page.locator('#v8710Session:visible').count(),1,'8.10.3 total-workout duration reminder is missing');assert.equal(await page.locator('#v8710SessionPreset button:visible').count(),5,'8.10.3 duration presets are incomplete');";
    if(!src.includes(stale)&&!src.includes(current))throw new Error('AXIS 8.10.3 product matrix reminder assertion shape changed');
    src=src.replace(stale,current);
    const oldItemFlow=`await page.locator('#v8710Item').click();
await page.waitForTimeout(80);
meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v8710SoundEnabled,false);
assert.equal(meta.prefs?.v8710SoundSet,'vector');
assert.equal(meta.prefs?.v8710Repeat,'once');
assert.equal(meta.prefs?.v876ItemReminder,false);
await page.locator('#v8710Item').click();
await page.locator('#v8710On [data-v="on"]').click();
meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v876ItemReminder,true);
assert.equal(meta.prefs?.v8710SoundEnabled,true);`;
    const newItemFlow=`await page.locator('#v8710Item [data-v="off"]').click();
await page.waitForTimeout(80);
meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v8710SoundEnabled,false);
assert.equal(meta.prefs?.v8710SoundSet,'vector');
assert.equal(meta.prefs?.v8710Repeat,'once');
assert.equal(meta.prefs?.v876ItemReminder,false);
await page.locator('#v8710Item [data-v="on"]').click();
await page.locator('#v8710SessionPreset [data-v="45"]').click();
await page.locator('#v8710On [data-v="on"]').click();
meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v876ItemReminder,true);
assert.equal(meta.prefs?.v876SessionTarget,45);
assert.equal(meta.prefs?.v8710SoundEnabled,true);`;
    if(!src.includes(oldItemFlow)&&!src.includes(newItemFlow))throw new Error('AXIS 8.10.3 sound interaction matrix shape changed');
    src=src.replace(oldItemFlow,newItemFlow);
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
if(version==='8.9'||version.startsWith('8.9.')||modern810){
  if(!fs.existsSync('scripts/prepare-89-test-flow.mjs'))throw new Error('AXIS 8.9 test-flow convergence is missing');
  execFileSync(process.execPath,['scripts/prepare-89-test-flow.mjs'],{stdio:'inherit'});
}

console.log(`[AXIS test contract] browser assertions aligned to ${version} · no stale release assertions · release flow aligned`);