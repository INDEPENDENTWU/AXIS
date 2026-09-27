import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.4 Active Rest Utility Rail contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js');
const prepare=read('prepare-8264-active-rest-utility-rail.mjs');
const core=read('prepare-8264-active-rest-utility-rail-core.mjs');
if(info.version!=='8.26.4'||info.baseVersion!=='8.26.4')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['activeContinuity826','activeRestState8261','activeRestSelectorBinding8262','activeRestConvergence8263','activeRestRunningZeroGeometry8263','activeRestPausedRail32px8263'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);
for(const marker of [
  'id="v87Add">＋ 一组</button><span class="v87Rest" id="v87Rest"></span></div><div class="v87Paused"',
  'axis8264ActiveRestUtilityStyle',
  "$('#v87Rest').textContent=planDone?'':rest?"
])if(!runtime.includes(marker))fail(`runtime utility-rail marker missing ${marker}`);
if(!prepare.includes("await import('./prepare-8264-active-rest-utility-rail-core.mjs')"))fail('8.26.4 driver does not delegate to bounded core implementation');
const cssMatch=core.match(/const utilityCss=`([\s\S]*?)`;\n/);if(!cssMatch)fail('utility CSS source boundary missing');
const utilityCss=cssMatch[1];
for(const marker of [
  '.axis821StageControls>.v87Rest{grid-column:1!important;grid-row:2!important',
  '#v87AdjustBtn{grid-column:2!important;grid-row:2!important',
  '[data-status="paused"] .axis821StageControls>.v87Rest{display:flex!important',
  '[data-status="active"] .axis821StageControls>.v87Rest,html body #v87Now.axis821ActiveStage[data-status="plan-complete"] .axis821StageControls>.v87Rest{display:none!important',
  'font-size:12.5px!important;font-weight:680!important',
  'height:32px!important;min-height:32px!important;max-height:32px!important',
  'border-radius:0!important',
  'background:transparent!important',
  'box-shadow:none!important'
])if(!utilityCss.includes(marker))fail(`utility CSS source marker missing ${marker}`);
for(const owner of ['function toggle(id)','function completeSet(id,fromShake=false)','function addSet(id)','function beginHold(id,e)'])if(!runtime.includes(owner))fail(`existing v87 owner missing ${owner}`);
if((runtime.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append owner duplicated');
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta(','fetch(','XMLHttpRequest','WebSocket('])if(utilityCss.includes(forbidden))fail(`presentation CSS acquired forbidden authority ${forbidden}`);
info.gates=info.gates||{};
Object.assign(info.gates,{activeRestUtilityRail8264:true,activeRestAdjustAlignment8264:true,activeRestPlanCompleteZeroGeometry8264:true,activeRestStrongSecondaryStatus8264:true,activeRestExistingOwnersPreserved8264:true});
info.axis8264={release:true,scope:'active-rest-utility-rail',base:'8.26.3-merged-unsealed',presentation:{canonicalSelector:'.v87Rest',restInsideExistingActionGrid:true,pausedRestAndAdjustSameRow:true,pausedRailHeightPx:32,pausedPill:false,pausedTextPresence:'strong-secondary',planCompleteRestGeometry:'zero',restSpeakSharedRail:true,reducedMotion:true},ownership:{v87PauseTimerPreserved:true,activeAdjustExistingActionPreserved:true,restSpeakExistingActionPreserved:true,sessionWriter:false,encounterWriter:false,activeOwner:false,recorder:false,newPersistence:false,network:false,ai:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
await import('./scripts/axis-8264-governance-compat.mjs');
console.log('[AXIS 8.26.4 Active Rest Utility Rail contract] PASS · rest + Adjust share one aligned row · plan-complete rest residue zero · canonical v87 truth/actions preserved');
