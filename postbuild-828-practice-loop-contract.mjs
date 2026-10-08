import fs from 'node:fs';

const fail=m=>{throw new Error('[AXIS 8.28 Practice Loop contract] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js'),css=read('axis-style.css'),core=read('lib/axis-practice-loop.mjs');

if(info.version!=='8.28'||info.baseVersion!=='8.28')fail('release identity '+info.version+'/'+info.baseVersion);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['realityRoute827','realityRoutePureProjection827','realityRouteExistingOwnersPreserved827'])if(info.gates?.[gate]!==true)fail('inherited Reality Route gate missing '+gate);
for(const marker of ['__AXIS_828_PRACTICE_LOOP__',"schema:'axis.practice-loop.v1'",'axis828Core.projectPracticeLoop','axis828PracticeLoopProjection','practiceLoop=function','data-axis-practice-loop-status','pageshow','visibilitychange'])if(!runtime.includes(marker))fail('runtime marker missing '+marker);
for(const marker of ['AXIS 8.28 — Practice Loop Convergence','.axis828LoopStatus'])if(!css.includes(marker))fail('Practice Loop CSS missing '+marker);
for(const forbidden of ['window.','document.','localStorage','indexedDB','fetch(','XMLHttpRequest','WebSocket','navigator.'])if(core.includes(forbidden))fail('pure core contains platform dependency '+forbidden);
if((runtime.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership changed');
for(const forbidden of ['axis_practice_loop_','axis_loop_'])if(runtime.includes(forbidden))fail('new persistence namespace detected '+forbidden);

info.gates=info.gates||{};
Object.assign(info.gates,{practiceLoop828:true,practiceLoopPureProjection828:true,practiceLoopReloadContinuity828:true,practiceLoopPromptFreeRestore828:true,practiceLoopRealityRouteInherited828:true,practiceLoopExistingOwnersPreserved828:true,practiceLoopNoNewStorage828:true});
info.axis828={release:true,scope:'practice-loop-convergence',projection:{schema:'axis.practice-loop.v1',pureOwner:'lib/axis-practice-loop.mjs',phases:['idle','ready','between-items','executing','paused','recovering','settling','complete']},continuity:{reloadSafe:true,promptOnRestore:false,pageshowRefresh:true,visibilityRefresh:true},ownership:{flowDefinitionMutation:false,historicalEncounterRewrite:false,newStorage:false,newSessionWriter:false,newEncounterWriter:false,newRecorder:false,newActiveOwner:false,network:false,ai:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
await import('./scripts/axis-828-practice-loop-contract.mjs');
await import('./scripts/axis-828-governance-compat.mjs');
console.log('[AXIS 8.28 Practice Loop contract] PASS · one derived loop projection · reload continuity · existing factual owners preserved · canonical single runtime unchanged');
