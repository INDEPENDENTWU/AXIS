import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const prep=read('prepare-821-active-home-stage.mjs');
const compat=read('prepare-821-active-home-stage-compat.mjs');
const v87=read('v87-runtime.js');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const flow=read('prepare-821-flow-session-coordination.mjs');
const postbuild=read('postbuild-kernel-priority.mjs');
const work=read('docs/CURRENT_WORK.md');

for(const token of [
 "presentation:'integrated-home-stage'",
 "actionOwner:'v87'",
 'largePauseResume:true',
 'largeCompleteSet:true',
 'holdFinish:true',
 'reducedMotion:true',
 'newStorage:false',
 'newRecorder:false',
 'newEncounterWriter:false',
 'newActiveOwner:false',
 'axis821StageClock',
 'axis821StageToggleLabel',
 'axis821StageProgressText',
 'axis821StageRest',
 'axis821-set-bump',
 'axis821-state-shift',
 '@media(prefers-reduced-motion:reduce)',
 "activeHome.insertBefore(host,activeHome.firstChild)",
 'axis821StageControls v87Actions',
 "host.classList.add('show');D.body.classList.add('v87-now')}"
])if(!prep.includes(token))fail(`prepare missing ${token}`);

for(const token of [
 'Rest Speak viewport-safe placement',
 "panel.style.top=pad+'px'",
 "panel.style.bottom='auto'",
 "panel.style.maxHeight=Math.max(180,vh-pad*2)+'px'"
])if(!compat.includes(token))fail(`compat missing ${token}`);

for(const token of [
 'function toggle(id)',
 'function completeSet(id,fromShake=false)',
 'function addSet(id)',
 'function beginHold(id,e)',
 "e.target.closest('#v87Toggle')",
 "e.target.closest('#v87Primary')",
 "e.target.closest('#v87Add')",
 "e.target.closest('#v87Finish')"
])if(!v87.includes(token))fail(`existing v87 action boundary missing ${token}`);

for(const forbidden of [
 'localStorage.setItem',
 'indexedDB.open',
 'fetch(',
 'XMLHttpRequest',
 'state.active.events.push',
 'writeCore(',
 'writeMeta('
])if(prep.includes(forbidden))fail(`presentation prepare introduced forbidden owner/write token ${forbidden}`);

const executionImport="await import('./prepare-821-flow-step-execution-intent.mjs');";
const stageImport="await import('./prepare-821-active-home-stage.mjs');";
const profileImport="await import('./prepare-821-profile-session-truth.mjs');";
const e=chain.indexOf(executionImport),s=chain.indexOf(stageImport),p=chain.indexOf(profileImport);
if(!(e>=0&&s>e&&p>s))fail('Active Home stage build order must follow execution intent and precede Profile truth');
if((chain.match(/prepare-821-active-home-stage\.mjs/g)||[]).length!==1)fail('Active Home stage import duplicated');

if(!flow.includes('body.axis821-flow-integrated-active #v87Now{display:none!important}'))fail('Flow integrated Active must continue suppressing ordinary v87 stage');
if(!prep.includes("D.body.classList.remove('v87-now')"))fail('stage hide path must clear inherited Active body state');

const inheritedTail="host.classList.add('show');D.body.classList.add('v87-now')}";
if(!postbuild.includes(`const renderTail="${inheritedTail}"`))fail('postbuild canonical Active-adjust render hook changed');
if((prep.match(/axis821StageControls v87Actions/g)||[]).length!==1)fail('Active-adjust host must remain exactly one stage control rail');
if(!prep.includes('#v87Now.axis821ActiveStage #v87AdjustBtn'))fail('postbuild one-time Adjust action has no integrated-stage presentation');

for(const token of [
 'bounded delivery branch: `feat/821-active-home-stage`',
 'exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`'
])if(!work.includes(token))fail(`CURRENT_WORK missing ${token}`);

console.log('[AXIS 8.21 Active Home stage contract] PASS · one integrated ordinary-Active Home stage · existing v87 actions + postbuild Adjust hook retained · viewport-safe inherited Rest Speak · Flow integrated surface isolated · no new storage/Encounter/Active owner');
