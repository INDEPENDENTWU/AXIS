import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Active Home visual contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const stage=read('prepare-821-active-home-stage.mjs');
const css=read('styles/axis-821-active-home.css');
const legacyRefine=read('prepare-821-active-home-visual-convergence.mjs');
const compat=read('prepare-821-active-home-stage-compat.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const v87=read('v87-runtime.js');
const doc=read('docs/ACTIVE_HOME_SOURCE_CONVERGENCE.md');

for(const token of [
 "read('styles/axis-821-active-home.css')",
 'function axis821ActiveStageRefineStyle()',
 "st.id='axis821ActiveStageRefineStyle'",
 "surface:'flat-integrated-home'",
 "clock:'centered'",
 "controls:'balanced-two-column'",
 "adjust:'separate-tertiary-row'",
 "rest:'single-visible-clock'",
 "finish:'tactile-brand-hold'",
 "stateOwner:'v87'",
 'newStorage:false',
 'newWriter:false',
 'newActionOwner:false',
 "$('#axis821StageRest').textContent=rest?'':"
])if(!stage.includes(token))fail(`stage source missing ${token}`);

for(const token of [
 'background:transparent!important',
 'box-shadow:none!important',
 'border-top:1px solid var(--line2)!important',
 'border-bottom:1px solid var(--line2)!important',
 'text-align:center!important',
 'grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important',
 '#v87AdjustBtn{position:static!important',
 'grid-row:2!important',
 '.axis821StageFinish:active'
])if(!css.includes(token))fail(`stage-owned visual CSS missing ${token}`);

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
])if(stage.includes(forbidden)||css.includes(forbidden))fail(`stage visual owner introduced forbidden write token ${forbidden}`);

for(const token of [
 'function toggle(id)',
 'function completeSet(id,fromShake=false)',
 'function addSet(id)',
 'function beginHold(id,e)'
])if(!v87.includes(token))fail(`certified v87 action owner missing ${token}`);

const stageImport="await import('./prepare-821-active-home-stage.mjs');";
const compatImport="await import('./prepare-821-active-home-stage-compat.mjs');";
const visualImport="await import('./prepare-821-active-home-visual-convergence.mjs');";
const profileImport="await import('./prepare-821-profile-session-truth.mjs');";
const a=chain.indexOf(stageImport),b=chain.indexOf(compatImport),d=chain.indexOf(profileImport);
if(!(a>=0&&b>a&&d>b))fail('source-owned Active Home stage/compat order must precede downstream Profile truth');
if(chain.includes(visualImport))fail('retired late visual-convergence prepare remains reachable');
if((chain.match(/prepare-821-active-home-stage\.mjs/g)||[]).length!==1)fail('Active Home stage import duplicated');
if((chain.match(/prepare-821-active-home-stage-compat\.mjs/g)||[]).length!==1)fail('Active Home compatibility import duplicated');

for(const token of [
 'function axis821ActiveStageRefineStyle()',
 "surface:'flat-integrated-home'",
 "'single visible rest clock'"
])if(!legacyRefine.includes(token))fail(`historical visual provenance unexpectedly lost ${token}`);

for(const forbidden of [
 '#v87AdjustBtn{position:absolute!important',
 'min-height:294px!important',
 'right:12px!important;bottom:12px!important'
])if(compat.includes(forbidden))fail(`compatibility pass still owns retired final geometry ${forbidden}`);

for(const token of [
 'exact base `main` SHA: `c434a4a78530669d5a47be9799d40f5049b57a2d`',
 'bounded delivery branch: `arch/821-active-home-source-convergence`',
 'styles/axis-821-active-home.css',
 'not imported by the canonical release chain',
 'intended user-visible behavior change: **none**',
 'v87` remains the only ordinary Active pause/resume'
])if(!doc.includes(token))fail(`source convergence document missing ${token}`);

console.log('[AXIS 8.21 Active Home visual contract] PASS · final visual system is stage-source-owned · historical late visual prepare unreachable · semantic compat preserved · v87 ownership sealed');
