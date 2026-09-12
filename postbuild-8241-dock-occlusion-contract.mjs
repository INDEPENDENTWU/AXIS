import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.24.1 Dock Occlusion contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js');
const css=read('styles/axis-8241-dock-occlusion.css');

if(info.version!=='8.24.1'||info.baseVersion!=='8.24.1')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['activeStageTactile824','activeStageSingleSetProgress824','activeStageReducedMotion824','activeStageExistingV87Actions824'])if(info.gates?.[gate]!==true)fail(`inherited 8.24 gate missing ${gate}`);
for(const marker of ['axis8241DockOcclusionStyle','contain:layout style!important','top:-16px!important','background-image:none!important'])if(!runtime.includes(marker)&&!css.includes(marker))fail(`8.24.1 occlusion marker missing ${marker}`);
if(/contain:[^;}]*paint/.test(css))fail('paint containment survived 8.24.1 patch');
if(/linear-gradient/.test(css))fail('translucent dock curtain survived 8.24.1 patch');
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','state.active.events.push(','writeCore(','writeMeta(','fetch(','XMLHttpRequest','WebSocket('])if(css.includes(forbidden))fail(`dock presentation acquired forbidden authority ${forbidden}`);
for(const action of ['function toggle(id)','function completeSet(id,fromShake=false)','function addSet(id)','function beginHold(id,e)'])if(!runtime.includes(action))fail(`existing v87 action owner missing ${action}`);

info.gates=info.gates||{};
Object.assign(info.gates,{
 activeStageDockOcclusion8241:true,
 activeStageDockOpaqueBackground8241:true,
 activeStageDockOverscan8241:true,
 activeStageDockNoPaintContainment8241:true,
 activeStageExistingV87Actions8241:true
});
info.axis8241={release:true,scope:'active-dock-occlusion-hotfix',presentation:{opaqueDock:true,opaqueOverscan:true,paintContainment:false,translucentCurtain:false},ownership:{trainingState:false,sessionWriter:false,encounterWriter:false,activeOwner:false,recorder:false,persistence:false,network:false,ai:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.24.1 Dock Occlusion contract] PASS · opaque fixed dock + overscan · no paint clipping · inherited v87 authority preserved');
