import fs from 'node:fs';
import crypto from 'node:crypto';

const coreFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json';
const fail=m=>{throw new Error(`AXIS interaction-priority gate: ${m}`)};
for(const f of [coreFile,indexFile,infoFile])if(!fs.existsSync(f))fail(`missing ${f}`);
let core=fs.readFileSync(coreFile,'utf8');
let html=fs.readFileSync(indexFile,'utf8');
const oldCoreHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldCoreHash)fail('axis-core hash missing from index');

// Shell ownership: legacy whole-page observers are never notified merely because
// a top-level settings/report/watermark sheet changed visibility. Those features
// already have explicit click/open hooks and pre-hydration paths.
const oldSelectors="const sels=['#scanSheet','#reviewStage','#settingsSheet','#finishSheet','#todayView','#activeHome','#idleHome','#eqSheet','#reportSheet','#watermarkSheet','#detailSheet'];";
const newSelectors="const sels=['#scanSheet','#reviewStage','#finishSheet','#todayView','#activeHome','#idleHome','#eqSheet','#detailSheet'];";
if(!core.includes(oldSelectors))fail('safe observer selector contract changed');
core=core.replace(oldSelectors,newSelectors);

// User interaction has absolute priority over historical hydration. Never begin
// a stable chunk while the shell is open or the user has interacted recently.
const oldLoop="for(let i=0;i<manifest.length;i++){\n    const entry=manifest[i];diag.currentChunk=entry.id;diag.currentModule=null;\n    const r=await loadChunk(entry);if(!r.ok)console.warn('[AXIS chunk]',entry.id,r.reason);\n    await delay(24);\n  }";
const newLoop="for(let i=0;i<manifest.length;i++){\n    const entry=manifest[i];diag.currentChunk=entry.id;diag.currentModule=null;\n    await window.__AXIS_WAIT_FOR_SHELL_IDLE__();\n    const r=await loadChunk(entry);if(!r.ok)console.warn('[AXIS chunk]',entry.id,r.reason);\n    await delay(40);\n  }";
if(!core.includes(oldLoop))fail('stable chunk loop contract changed');
core=core.replace(oldLoop,newLoop);

const oldSchedule="const schedule=()=>setTimeout(run,220);\nif(document.readyState==='complete')schedule();else window.addEventListener('load',schedule,{once:true});";
const newSchedule=`let __axisLastInput=performance.now();
const __axisMarkInput=()=>{__axisLastInput=performance.now()};
for(const type of ['pointerdown','touchstart','keydown','click'])document.addEventListener(type,__axisMarkInput,{capture:true,passive:true});
window.__AXIS_WAIT_FOR_SHELL_IDLE__=()=>new Promise(resolve=>{
  const probe=()=>{
    const shellOpen=!!document.querySelector('.sheetWrap.show');
    const quiet=performance.now()-__axisLastInput>=850;
    if(!shellOpen&&quiet){resolve();return}
    setTimeout(probe,100);
  };
  probe();
});
const schedule=()=>setTimeout(async()=>{await window.__AXIS_WAIT_FOR_SHELL_IDLE__();run()},900);
if(document.readyState==='complete')schedule();else window.addEventListener('load',schedule,{once:true});`;
if(!core.includes(oldSchedule))fail('stable scheduler contract changed');
core=core.replace(oldSchedule,newSchedule);

// Keep interaction-path work out of the shell click. These late-version hooks
// are redundant because their boot paths already create settings content.
const redundant=[
  "if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();syncCaptureSetting();installVersion()},120);",
  "if(e.target.closest('#settingsBtn'))setTimeout(()=>{version();installControl()},70);",
  "if(e.target.closest('#settingsBtn'))setTimeout(()=>{ensureSettings();version()},100);"
];
for(const s of redundant)core=core.split(s).join('');

try{new Function(core)}catch(e){fail(`patched core syntax ${e.message}`)}
const newHash=crypto.createHash('sha256').update(core).digest('hex').slice(0,12);
fs.writeFileSync(coreFile,core);
html=html.replace(`/axis-core.js?v=${oldCoreHash}`,`/axis-core.js?v=${newHash}`);
fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newHash;
info.performanceContract={...(info.performanceContract||{}),shellOwnsTopLevelInteraction:true,hydrationStartsAfterQuietMs:850,initialHydrationDelayMs:900,topLevelSheetsExcludedFromLegacyBodyObservers:['settingsSheet','reportSheet','watermarkSheet'],redundantSettingsHooksRemoved:true};
info.gates={...(info.gates||{}),interactionPriorityKernel:true,shellObserverIsolation:true};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS] interaction-priority kernel passed · core ${oldCoreHash} -> ${newHash}`);
console.log('[AXIS] shell actions preempt hydration; settings/report/watermark visibility no longer broadcasts to legacy body observers.');