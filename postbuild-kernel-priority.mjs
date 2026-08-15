import fs from 'node:fs';
import crypto from 'node:crypto';

const coreFile='axis-core.js',indexFile='index.html',infoFile='axis-build.json',featureRuntime='v8712-runtime.js';
const recordingChunk='axis-enhance-recording.js',foundationChunk='axis-enhance-foundation.js',interactionChunk='axis-enhance-interaction.js';
const fail=m=>{throw new Error(`AXIS interaction-priority gate: ${m}`)};
for(const f of [coreFile,indexFile,infoFile,featureRuntime,recordingChunk,foundationChunk,interactionChunk])if(!fs.existsSync(f))fail(`missing ${f}`);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);

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

/* v61 remains the only recording owner; planner application is one low-frequency batch transaction. */
const legacyApi="window.__AXIS_RECORDING__={snapshot:recordingSnapshot,adjust:adjustRecordingValue,set:patchActiveSetValue,select:selectRecordingSet};";
const atomicApi=`function applyRecordingPlan(values){
 if(!Array.isArray(values)||!values.length)return false;
 const next=values.slice(0,10).map((v,i)=>{const old=draft[i]||{},w=Number(v?.w),r=Number(v?.r);return{weight:Number.isFinite(w)?Math.max(0,Math.min(1000,Math.round(w*100)/100)):(old.weight??null),reps:Number.isFinite(r)?Math.max(1,Math.min(300,Math.round(r))):(old.reps??null),state:old.state==='done'?'done':'assumed',doneAt:old.state==='done'?(old.doneAt||null):null,inferred:true}});
 draft=next;sel=Math.max(0,Math.min(sel,draft.length-1));statusTouched=false;renderSets();emitRecording('axis:recording-plan');return true
}
window.__AXIS_RECORDING__={snapshot:recordingSnapshot,adjust:adjustRecordingValue,set:patchActiveSetValue,select:selectRecordingSet,applyPlan:applyRecordingPlan};`;
if(!core.includes(legacyApi))fail('recording API contract changed');
core=core.replace(legacyApi,atomicApi);

/* Retire both pre-canonical one-set seeders; v61 already owns the default one-set draft. */
let recording=fs.readFileSync(recordingChunk,'utf8');
for(const [needle,label] of [['if(!seedDone)seedSingleSet()','professional auto-seed'],['if(!seedDone)seedOne()','set-bridge auto-seed']]){
 const count=recording.split(needle).length-1;if(count!==1)fail(`${label} expected once, found ${count}`);recording=recording.replace(needle,'');
}
try{new Function(recording)}catch(e){fail(`patched ${recordingChunk} syntax ${e.message}`)}
const oldRecordingHash=(core.match(/\/axis-enhance-recording\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldRecordingHash)fail('recording chunk hash missing from core manifest');
const newRecordingHash=hash(recording);fs.writeFileSync(recordingChunk,recording);
core=core.replace(`/axis-enhance-recording.js?v=${oldRecordingHash}`,`/axis-enhance-recording.js?v=${newRecordingHash}`);

/*
 * Active-session adjustment has one owner and one visible action. v879 keeps the
 * proven one-time edit transaction while v87 synchronizes it after active-card
 * rendering. Any earlier adjustment painter is deterministically retired at the
 * same boundary, including a one-frame late insertion, without an observer.
 */
let interaction=fs.readFileSync(interactionChunk,'utf8');
const oldInteractionHash=(core.match(/\/axis-enhance-interaction\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldInteractionHash)fail('interaction chunk hash missing from core manifest');
const oldEditIds=(interaction.match(/v879EditBtn/g)||[]).length;if(oldEditIds<3)fail(`legacy active-adjust identity unexpectedly sparse: ${oldEditIds}`);
interaction=interaction.replaceAll('v879EditBtn','v87AdjustBtn');
const oldLabel="b.textContent='调整一次'";if(!interaction.includes(oldLabel))fail('active-adjust label contract changed');interaction=interaction.replace(oldLabel,"b.textContent='调整'");
const editHead="function editEntry(){const id=activeId(),host=$('#v87Now .v87Actions');if(!id||!host)return;";
const editHeadSafe="function editEntry(){const id=activeId(),host=$('#v87Now .v87Actions');if(!id||!host)return;const prune=()=>{let kept=false;for(const x of Array.from(host.querySelectorAll('button'))){if(!String(x.textContent||'').trim().startsWith('调整'))continue;if(x.id==='v87AdjustBtn'&&!kept){kept=true;continue}x.remove()}};prune();";
if(!interaction.includes(editHead))fail('active-adjust entry contract changed');interaction=interaction.replace(editHead,editHeadSafe);
const appendAdjust="b.onclick=()=>openEdit(id);host.appendChild(b)}}";
const appendAdjustSafe="b.onclick=()=>openEdit(id);host.appendChild(b);queueMicrotask(prune);setTimeout(prune,120)}}";
if(!interaction.includes(appendAdjust))fail('active-adjust append contract changed');interaction=interaction.replace(appendAdjust,appendAdjustSafe);
const exposeNeedle='function openEdit(id){';if(!interaction.includes(exposeNeedle))fail('active-adjust opener contract changed');interaction=interaction.replace(exposeNeedle,'window.__AXIS_ACTIVE_ADJUST_SYNC__=editEntry;\nfunction openEdit(id){');
try{new Function(interaction)}catch(e){fail(`patched ${interactionChunk} syntax ${e.message}`)}
const newInteractionHash=hash(interaction);fs.writeFileSync(interactionChunk,interaction);
core=core.replace(`/axis-enhance-interaction.js?v=${oldInteractionHash}`,`/axis-enhance-interaction.js?v=${newInteractionHash}`);

let foundation=fs.readFileSync(foundationChunk,'utf8');
const oldFoundationHash=(core.match(/\/axis-enhance-foundation\.js\?v=([a-f0-9]+)/)||[])[1];
if(!oldFoundationHash)fail('foundation chunk hash missing from core manifest');
const renderTail="host.classList.add('show');D.body.classList.add('v87-now')}";
const renderTailCount=foundation.split(renderTail).length-1;if(renderTailCount!==1)fail(`active-card render contract expected once, found ${renderTailCount}`);
foundation=foundation.replace(renderTail,"host.classList.add('show');D.body.classList.add('v87-now');window.__AXIS_ACTIVE_ADJUST_SYNC__?.()}");
try{new Function(foundation)}catch(e){fail(`patched ${foundationChunk} syntax ${e.message}`)}
const newFoundationHash=hash(foundation);fs.writeFileSync(foundationChunk,foundation);
core=core.replace(`/axis-enhance-foundation.js?v=${oldFoundationHash}`,`/axis-enhance-foundation.js?v=${newFoundationHash}`);

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
const newHash=hash(core);fs.writeFileSync(coreFile,core);
html=html.replace(`/axis-core.js?v=${oldCoreHash}`,`/axis-core.js?v=${newHash}`);fs.writeFileSync(indexFile,html);
const info=JSON.parse(fs.readFileSync(infoFile,'utf8'));
info.assets=info.assets||{};info.assets.core=newHash;
if(Array.isArray(info.assets.chunks)){
 const set=(id,h)=>{const x=info.assets.chunks.find(v=>v.id===id);if(!x)fail(`${id} chunk metadata missing`);x.hash=h};
 set('foundation',newFoundationHash);set('recording',newRecordingHash);set('interaction',newInteractionHash);
}
info.performanceContract={...(info.performanceContract||{}),shellOwnsTopLevelInteraction:true,shellOwnsDockVisibility:true,hydrationStartsAfterQuietMs:850,initialHydrationDelayMs:900,topLevelSheetsExcludedFromLegacyBodyObservers:['settingsSheet','reportSheet','watermarkSheet'],redundantSettingsHooksRemoved:true,plannerCommitsAtomically:true,activeAdjustUsesRenderSync:true};
info.gates={...(info.gates||{}),interactionPriorityKernel:true,shellObserverIsolation:true,shellDockOwnership:true,groupPlanRowContract:true,legacyPlanAutoSeedRetired:true,legacySetBridgeAutoSeedRetired:true,canonicalPlanTransaction:true,singleActiveAdjustmentOwner:true,activeAdjustDeterministicDedupe:true};
fs.writeFileSync(infoFile,JSON.stringify(info,null,2));
console.log(`[AXIS] interaction-priority kernel passed · core ${oldCoreHash} -> ${newHash}`);
console.log(`[AXIS] chunks · foundation ${oldFoundationHash}->${newFoundationHash} · recording ${oldRecordingHash}->${newRecordingHash} · interaction ${oldInteractionHash}->${newInteractionHash}`);
console.log('[AXIS] group-plan row contract normalized; planner commits atomically through the v61 recording owner.');
console.log('[AXIS] active-session adjustment converged to one deterministic, render-synchronized, one-time action.');
console.log('[AXIS] shell actions preempt hydration; core exclusively owns dock visibility after navigation/sheet interactions.');