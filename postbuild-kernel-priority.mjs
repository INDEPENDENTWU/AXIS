import fs from 'node:fs';
import crypto from 'node:crypto';

const coreFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json',featureRuntime='v8712-runtime.js',recordingChunk='axis-enhance-recording.js';
const fail=m=>{throw new Error(`AXIS interaction-priority gate: ${m}`)};
for(const f of [coreFile,indexFile,infoFile,featureRuntime,recordingChunk])if(!fs.existsSync(f))fail(`missing ${f}`);

/*
 * Normalize the 8.7.12 group-plan row contract before feature hashing. The
 * convergence build may retarget the canonical set container, so rowValues must
 * accept either an Array or a NodeList without changing ownership.
 */
let feature=fs.readFileSync(featureRuntime,'utf8');
const legacyRowValues="function rowValues(){return rows().map(row=>{";
const safeRowValues="function rowValues(){return Array.from(rows()).map(row=>{";
if(!feature.includes(legacyRowValues))fail('group-plan rowValues contract changed');
feature=feature.replace(legacyRowValues,safeRowValues);
try{new Function(feature)}catch(e){fail(`patched ${featureRuntime} syntax ${e.message}`)}
fs.writeFileSync(featureRuntime,feature);

let core=fs.readFileSync(coreFile,'utf8');
let html=fs.readFileSync(indexFile,'utf8');
const oldCoreHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldCoreHash)fail('axis-core hash missing from index');

/*
 * v874 originally forced every newly opened strength record back to one set.
 * That made sense before the canonical planner existed, but its review-stage
 * observer can now fire while v8712 applies a multi-set plan and collapse the
 * draft mid-transaction. Retire only that automatic seeding side effect; the
 * normal recording count controls and default one-set creation remain owned by
 * v61. Patch the already-built recording chunk and update the core manifest hash
 * in the same gate so cache identity stays correct.
 */
let recording=fs.readFileSync(recordingChunk,'utf8');
const legacyAutoSeed='if(!seedDone)seedSingleSet()';
const autoSeedCount=recording.split(legacyAutoSeed).length-1;
if(autoSeedCount!==1)fail(`legacy plan auto-seed expected once, found ${autoSeedCount}`);
recording=recording.replace(legacyAutoSeed,'');
try{new Function(recording)}catch(e){fail(`patched ${recordingChunk} syntax ${e.message}`)}
const oldRecordingHash=(core.match(/\/axis-enhance-recording\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldRecordingHash)fail('recording chunk hash missing from core manifest');
const newRecordingHash=crypto.createHash('sha256').update(recording).digest('hex').slice(0,12);
fs.writeFileSync(recordingChunk,recording);
core=core.replace(`/axis-enhance-recording.js?v=${oldRecordingHash}`,`/axis-enhance-recording.js?v=${newRecordingHash}`);

const oldSelectors="const sels=['#scanSheet','#reviewStage','#settingsSheet','#finishSheet','#todayView','#activeHome','#idleHome','#eqSheet','#reportSheet','#watermarkSheet','#detailSheet'];";
const newSelectors="const sels=['#scanSheet','#reviewStage','#finishSheet','#todayView','#activeHome','#idleHome','#eqSheet','#detailSheet'];";
if(!core.includes(oldSelectors))fail('safe observer selector contract changed');
core=core.replace(oldSelectors,newSelectors);

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

const redundant=[
  "if(e.target.closest('#settingsBtn'))setTimeout(()=>{injectAudio();syncCaptureSetting();installVersion()},120);",
  "if(e.target.closest('#settingsBtn'))setTimeout(()=>{version();installControl()},70);",
  "if(e.target.closest('#settingsBtn'))setTimeout(()=>{ensureSettings();version()},100);"
];
for(const s of redundant)core=core.split(s).join('');

const shellDockOwner=`\n(()=>{'use strict';
let queued=false;
const sync=()=>{
  queued=false;
  const d=document.querySelector('#dock');if(!d)return;
  const today=!!document.querySelector('#todayView')?.classList.contains('active');
  const sheet=[...document.querySelectorAll('.sheetWrap.show')].some(x=>x.id!=='finishSheet');
  const show=today&&!sheet;
  d.classList.toggle('show',show);d.classList.toggle('v8-force',show);
};
const queue=()=>{if(queued)return;queued=true;setTimeout(sync,0)};
document.addEventListener('click',queue,{capture:false,passive:true});
window.addEventListener('pageshow',queue,{passive:true});
window.__AXIS_SYNC_SHELL_DOCK__=sync;
setTimeout(sync,0);
})();\n`;
core+=shellDockOwner;

try{new Function(core)}catch(e){fail(`patched core syntax ${e.message}`)}
const newHash=crypto.createHash('sha256').update(core).digest('hex').slice(0,12);
fs.writeFileSync(coreFile,core);
html=html.replace(`/axis-core.js?v=${oldCoreHash}`,`/axis-core.js?v=${newHash}`);
fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newHash;
if(Array.isArray(info.assets.chunks)){
  const rec=info.assets.chunks.find(x=>x.id==='recording');
  if(!rec)fail('recording chunk metadata missing');
  rec.hash=newRecordingHash;
}
info.performanceContract={...(info.performanceContract||{}),shellOwnsTopLevelInteraction:true,shellOwnsDockVisibility:true,hydrationStartsAfterQuietMs:850,initialHydrationDelayMs:900,topLevelSheetsExcludedFromLegacyBodyObservers:['settingsSheet','reportSheet','watermarkSheet'],redundantSettingsHooksRemoved:true};
info.gates={...(info.gates||{}),interactionPriorityKernel:true,shellObserverIsolation:true,shellDockOwnership:true,groupPlanRowContract:true,legacyPlanAutoSeedRetired:true};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS] interaction-priority kernel passed · core ${oldCoreHash} -> ${newHash}`);
console.log(`[AXIS] recording chunk ${oldRecordingHash} -> ${newRecordingHash} · legacy plan auto-seed retired.`);
console.log('[AXIS] group-plan row contract normalized before feature hashing.');
console.log('[AXIS] shell actions preempt hydration; core exclusively owns dock visibility after navigation/sheet interactions.');