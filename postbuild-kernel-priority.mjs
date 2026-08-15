import fs from 'node:fs';
import crypto from 'node:crypto';

const coreFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json',featureRuntime='v8712-runtime.js',recordingChunk='axis-enhance-recording.js';
const fail=m=>{throw new Error(`AXIS interaction-priority gate: ${m}`)};
for(const f of [coreFile,indexFile,infoFile,featureRuntime,recordingChunk])if(!fs.existsSync(f))fail(`missing ${f}`);

/* Normalize the planner row contract and commit a plan through one canonical v61 transaction. */
let feature=fs.readFileSync(featureRuntime,'utf8');
const legacyRowValues="function rowValues(){return rows().map(row=>{";
const safeRowValues="function rowValues(){return Array.from(rows()).map(row=>{";
if(!feature.includes(legacyRowValues))fail('group-plan rowValues contract changed');
feature=feature.replace(legacyRowValues,safeRowValues);
const legacyApply="async function applyPlan(){\n if(!plan)return;const values=planRows();await setCount(plan.count);for(let i=0;i<values.length;i++)await setRow(i,values[i].w,values[i].r);\n $('#v875PlanSheet')?.classList.remove('show');try{navigator.vibrate?.(12)}catch{}\n}";
const atomicApply="async function applyPlan(){\n if(!plan)return;const values=planRows(),api=window.__AXIS_RECORDING__;\n if(api?.applyPlan)api.applyPlan(values);else{await setCount(plan.count);for(let i=0;i<values.length;i++)await setRow(i,values[i].w,values[i].r)}\n $('#v875PlanSheet')?.classList.remove('show');try{navigator.vibrate?.(12)}catch{}\n}";
if(!feature.includes(legacyApply))fail('group-plan apply contract changed');
feature=feature.replace(legacyApply,atomicApply);
try{new Function(feature)}catch(e){fail(`patched ${featureRuntime} syntax ${e.message}`)}
fs.writeFileSync(featureRuntime,feature);

let core=fs.readFileSync(coreFile,'utf8');
let html=fs.readFileSync(indexFile,'utf8');
const oldCoreHash=(html.match(/\/axis-core\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldCoreHash)fail('axis-core hash missing from index');

/*
 * v61 remains the only recording owner. Give it a single low-frequency batch
 * transaction for planner commits; high-frequency +/- and direct input retain
 * their existing in-place mutation path.
 */
const legacyApi="window.__AXIS_RECORDING__={snapshot:recordingSnapshot,adjust:adjustRecordingValue,set:patchActiveSetValue,select:selectRecordingSet};";
const atomicApi=`function applyRecordingPlan(values){
 if(!Array.isArray(values)||!values.length)return false;
 const next=values.slice(0,10).map((v,i)=>{const old=draft[i]||{},w=Number(v?.w),r=Number(v?.r);return{weight:Number.isFinite(w)?Math.max(0,Math.min(1000,Math.round(w*100)/100)):(old.weight??null),reps:Number.isFinite(r)?Math.max(1,Math.min(300,Math.round(r))):(old.reps??null),state:old.state==='done'?'done':'assumed',doneAt:old.state==='done'?(old.doneAt||null):null,inferred:true}});
 draft=next;sel=Math.max(0,Math.min(sel,draft.length-1));statusTouched=false;renderSets();emitRecording('axis:recording-plan');return true
}
window.__AXIS_RECORDING__={snapshot:recordingSnapshot,adjust:adjustRecordingValue,set:patchActiveSetValue,select:selectRecordingSet,applyPlan:applyRecordingPlan};`;
if(!core.includes(legacyApi))fail('recording API contract changed');
core=core.replace(legacyApi,atomicApi);

/* Retire both pre-canonical one-set seeders; v61 already owns the one-set default. */
let recording=fs.readFileSync(recordingChunk,'utf8');
for(const [needle,label] of [['if(!seedDone)seedSingleSet()','professional auto-seed'],['if(!seedDone)seedOne()','set-bridge auto-seed']]){
 const count=recording.split(needle).length-1;if(count!==1)fail(`${label} expected once, found ${count}`);recording=recording.replace(needle,'');
}
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
  const rec=info.assets.chunks.find(x=>x.id==='recording');if(!rec)fail('recording chunk metadata missing');rec.hash=newRecordingHash;
}
info.performanceContract={...(info.performanceContract||{}),shellOwnsTopLevelInteraction:true,shellOwnsDockVisibility:true,hydrationStartsAfterQuietMs:850,initialHydrationDelayMs:900,topLevelSheetsExcludedFromLegacyBodyObservers:['settingsSheet','reportSheet','watermarkSheet'],redundantSettingsHooksRemoved:true,plannerCommitsAtomically:true};
info.gates={...(info.gates||{}),interactionPriorityKernel:true,shellObserverIsolation:true,shellDockOwnership:true,groupPlanRowContract:true,legacyPlanAutoSeedRetired:true,legacySetBridgeAutoSeedRetired:true,canonicalPlanTransaction:true};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS] interaction-priority kernel passed · core ${oldCoreHash} -> ${newHash}`);
console.log(`[AXIS] recording chunk ${oldRecordingHash} -> ${newRecordingHash} · legacy one-set seeders retired.`);
console.log('[AXIS] group-plan row contract normalized; planner commits atomically through the v61 recording owner.');
console.log('[AXIS] shell actions preempt hydration; core exclusively owns dock visibility after navigation/sheet interactions.');