import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Active Home visual contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const refine=read('prepare-821-active-home-visual-convergence.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const v87=read('v87-runtime.js');
const doc=read('docs/ACTIVE_HOME_VISUAL_CONVERGENCE.md');

for(const token of [
 'function axis821ActiveStageRefineStyle()',
 "st.id='axis821ActiveStageRefineStyle'",
 'background:transparent!important',
 'box-shadow:none!important',
 'border-top:1px solid var(--line2)!important',
 'border-bottom:1px solid var(--line2)!important',
 'text-align:center!important',
 'grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important',
 '#v87AdjustBtn{position:static!important',
 'grid-row:2!important',
 "surface:'flat-integrated-home'",
 "clock:'centered'",
 "controls:'balanced-two-column'",
 "adjust:'separate-tertiary-row'",
 "stateOwner:'v87'",
 'newStorage:false',
 'newWriter:false',
 'newActionOwner:false'
])if(!refine.includes(token))fail(`refinement missing ${token}`);

for(const forbidden of [
 'localStorage.setItem',
 'indexedDB.open',
 'fetch(',
 'XMLHttpRequest',
 'state.active.events.push',
 'writeMeta(',
 'writeCore(',
 'completedSets=',
 'restStartedAt='
])if(refine.includes(forbidden))fail(`presentation refinement introduced forbidden owner/write token ${forbidden}`);

for(const token of [
 'function toggle(id)',
 'function completeSet(id,fromShake=false)',
 'function addSet(id)',
 'function beginHold(id,e)'
])if(!v87.includes(token))fail(`certified v87 action owner missing ${token}`);

const stage="await import('./prepare-821-active-home-stage.mjs');";
const compat="await import('./prepare-821-active-home-stage-compat.mjs');";
const visual="await import('./prepare-821-active-home-visual-convergence.mjs');";
const profile="await import('./prepare-821-profile-session-truth.mjs');";
const a=chain.indexOf(stage),b=chain.indexOf(compat),c=chain.indexOf(visual),d=chain.indexOf(profile);
if(!(a>=0&&b>a&&c>b&&d>c))fail('visual convergence must run after Active Home compatibility and before downstream Profile truth');
if((chain.match(/prepare-821-active-home-visual-convergence\.mjs/g)||[]).length!==1)fail('visual convergence import duplicated');

for(const token of [
 'exact base `main` SHA: `9eaf90d0f94023218feb452b085da48c9f027276`',
 'bounded delivery branch: `feat/821-active-home-visual-convergence`',
 'flat Home section',
 '`调整` is a separate tertiary row',
 'new storage / writer / recorder / Active owner / Flow owner: **none**'
])if(!doc.includes(token))fail(`bounded contract document missing ${token}`);

console.log('[AXIS 8.21 Active Home visual contract] PASS · flat section · strict center axis · balanced execution row · isolated Adjust · existing v87 ownership sealed');
