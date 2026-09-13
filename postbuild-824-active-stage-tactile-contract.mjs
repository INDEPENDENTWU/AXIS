import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.24 Active Stage Tactile contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js');
const css=read('styles/axis-824-active-stage-tactile.css');

if(info.version!=='8.24'||info.baseVersion!=='8.24')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const marker of ['axis824ActiveStageTactileStyle','axis824ActiveBreath','captureDock.show:before','第 '+"'+Math.min(done+1,total)+'"+' / '+"'+total+'"+' 组'])if(!runtime.includes(marker)&&!css.includes(marker))fail(`8.24 marker missing ${marker}`);
if(runtime.includes("'计划 '+total+' 组'")||runtime.includes("'共 '+total+' 组'"))fail('duplicate set-count presentation survived canonical runtime');
if(!runtime.includes("(actual<est?'剩余 '+clock(Math.max(0,est-actual))+' · ':'')+'预计 '+clock(est)"))fail('time-only Active meta did not reach canonical runtime');
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta('])if(css.includes(forbidden))fail(`tactile presentation acquired forbidden authority ${forbidden}`);
for(const action of ['function toggle(id)','function completeSet(id,fromShake=false)','function addSet(id)','function beginHold(id,e)'])if(!runtime.includes(action))fail(`existing v87 action owner missing ${action}`);
if(!css.includes('@media(prefers-reduced-motion:reduce)'))fail('reduced-motion contract missing');

info.gates=info.gates||{};
Object.assign(info.gates,{
 activeStageTactile824:true,
 activeStageSingleSetProgress824:true,
 activeStageDockLayering824:true,
 activeStageReducedMotion824:true,
 activeStageExistingV87Actions824:true
});
info.axis824={release:true,scope:'active-stage-tactile-convergence',presentation:{singleSetProgress:true,timeMetaSetFree:true,tactilePress:true,activeBreath:true,dockOpaquePlane:true,reducedMotion:true},ownership:{trainingState:false,sessionWriter:false,encounterWriter:false,activeOwner:false,recorder:false,persistence:false,network:false,ai:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.24 Active Stage Tactile contract] PASS · tactile Active feedback · one set-progress truth · dock layer isolated · existing v87 authority preserved');
await import('./postbuild-8241-dock-occlusion-contract.mjs');
