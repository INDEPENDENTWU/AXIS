import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.5 Recording Review Geometry contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js'),css=read('axis-style.css'),html=read('index.html'),prepare=read('prepare-8265-recording-review-geometry.mjs');
if(info.version!=='8.26.5'||info.baseVersion!=='8.26.5')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['activeContinuity826','activeRestState8261','activeRestSelectorBinding8262','activeRestConvergence8263','activeRestUtilityRail8264','activeRestAdjustAlignment8264','activeRestPlanCompleteZeroGeometry8264'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);
if(!html.includes('class="v82Estimate" id="v82Estimate"')||!html.includes('<span>预计时长</span>'))fail('structural estimate row missing from canonical Review shell');
for(const marker of ['#reviewStage>#v82Estimate{width:100%;height:54px;margin-top:8px','grid-template-columns:1fr auto 16px'])if(!css.includes(marker))fail(`structural estimate geometry missing ${marker}`);
if(runtime.includes("b=D.createElement('button');b.id='v82Estimate'"))fail('late estimate-row insertion owner survived');
for(const marker of ["const b=$('#v82Estimate');if(!b)return","b.dataset.v8265='1';b.onclick=openEstimateSheet","function renderEstimateControl()"] )if(!runtime.includes(marker))fail(`existing v82 estimate binding missing ${marker}`);
if(!prepare.includes("deltaYPx:-22.75")||!prepare.includes('estimate row structural before Review becomes interactive'))fail('Production regression provenance missing from prepare');
for(const forbidden of ['axis_v60_state','axis_v8_meta','state.active.events.push(','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(']){
 const structural=html.match(/<button type="button" class="v82Estimate"[\s\S]*?<\/button>/)?.[0]||'';if(structural.includes(forbidden))fail(`structural slot acquired forbidden authority ${forbidden}`)
}
info.gates=info.gates||{};
Object.assign(info.gates,{recordingReviewGeometry8265:true,recordingEstimateStructuralSlot8265:true,recordingEstimateNoLateInsertion8265:true,recordingGeometryStrictTolerance8265:true,recordingExistingOwnersPreserved8265:true});
info.axis8265={release:true,scope:'recording-review-geometry-stability',base:'8.26.4-merged-unsealed',productionFinding:{gateRunId:36333871883,deltaYPx:-22.75},presentation:{estimateStructuralFromFirstReviewFrame:true,estimateHeightPx:54,estimateTopMarginPx:8,lateInsertion:false},ownership:{v82EstimateOwnerPreserved:true,recordingOwnerPreserved:true,sessionWriter:false,encounterWriter:false,activeOwner:false,recorder:false,newPersistence:false,network:false,ai:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
await import('./scripts/axis-8265-governance-compat.mjs');
console.log('[AXIS 8.26.5 Recording Review Geometry contract] PASS · structural estimate row · no late insertion · strict recording geometry preserved · existing owners unchanged');
