import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-flow-step-execution-intent.mjs');
const active=read('prepare-821-flow-active-convergence.mjs');
const historicalBoot=read('prepare-821-flow-active-boot-scope.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const schema=read('shared/contracts/axis-flow-v1.schema.json');
const current=read('docs/CURRENT_WORK.md');
const smoke=read('scripts/axis-821-item-unit-flow-smoke.mjs');

for(const token of [
 '__AXIS_821_FLOW_STEP_EXECUTION_INTENT__',
 "owner:'axis.flow.v1.step.executionOverride'",
 "const AXIS821_FLOW_EXECUTION_OPTIONS=['single','complete','timed','hold','sets','rounds']",
 'step.executionOverride=mode',
 'delete step.executionOverride',
 'axis821FlowHasExecutionOverrideForRecording',
 'sourceMode=axis821ExecutionForRecording(eq)',
 "axis821FlowOpenRecorder('current',eq)",
 "axis821FlowHasExecutionOverrideForRecording(e.equipmentId||e.eq)&&!axis821FlowOngoingMode(execution)",
 "axis821FlowAdvanceCompletedCurrent(e,'one-shot-commit')",
 'newStorage:false',
 'newRecorder:false',
 'newEncounterWriter:false',
 'newActiveOwner:false'
])assert.equal(prepare.includes(token),true,`Flow step execution intent missing ${token}`);

for(const mode of ['single','sets','rounds','timed','hold','complete'])assert.equal(schema.includes(`\"${mode}\"`),true,`axis.flow.v1 executionOverride no longer accepts ${mode}`);
for(const forbidden of ['localStorage.setItem(','indexedDB.open(','fetch(','XMLHttpRequest','state.active.events.push(','navigator.sendBeacon','new EventSource'])assert.equal(prepare.includes(forbidden),false,`Flow step execution intent introduced forbidden owner/side effect ${forbidden}`);
assert.equal(chain.includes("await import('./prepare-821-flow-step-execution-intent.mjs');"),true,'Flow step execution intent is not in canonical build chain');
assert.equal(chain.indexOf('prepare-821-flow-step-execution-intent.mjs')>chain.indexOf('prepare-821-flow-step-recording-intent.mjs'),true,'execution intent must compose after recording intent');
assert.equal(chain.indexOf('prepare-821-flow-step-execution-intent.mjs')<chain.indexOf('prepare-821-profile-session-truth.mjs'),true,'execution intent escaped bounded 8.21 Flow stage');
assert.equal(current.includes('feat/821-flow-step-execution-intent'),true,'CURRENT_WORK missing bounded Flow step execution intent branch');
assert.equal(current.includes('396241c41b2f8eea80d45ca582352ea593c47036'),true,'CURRENT_WORK missing exact certified historical Flow execution base');

// The Flow Active behavior owner must now emit its private lifecycle listeners in
// the correct lexical scope on first pass. The old corrective prepare remains
// provenance-only and must never regain canonical build authority.
for(const token of [
 "D.addEventListener('click',e=>{const sheet=$('#scanSheet')",
 "window.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished",
 'bootScopedListeners:true',
 "activeOwner:'existing-v82/v87'",
 'newStorage:false',
 'newRecorder:false',
 'newActiveOwner:false',
 'newEncounterWriter:false'
])assert.equal(active.includes(token),true,`Flow Active source owner missing ${token}`);
assert.equal(chain.includes("await import('./prepare-821-flow-active-convergence.mjs');"),true,'Flow Active convergence left canonical lifecycle');
assert.equal(chain.includes("await import('./prepare-821-flow-active-boot-scope.mjs');"),false,'retired Flow Active boot-scope prepare regained canonical build reachability');
assert.equal(historicalBoot.includes('Flow Active boot scope'),true,'historical Flow Active boot-scope provenance missing');

const helperAt=active.indexOf('const helpers=String.raw`');
const finishAt=active.indexOf('function axis821FlowOnActiveFinished(id)');
const closeAt=active.indexOf("D.addEventListener('click',e=>{const sheet=$('#scanSheet')");
const activeAt=active.indexOf("window.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished");
const helperCloseAt=active.indexOf('`;\n s=s.replace(completeAnchor,helpers+completeAnchor);');
assert.ok(helperAt>=0&&finishAt>helperAt&&closeAt>finishAt&&activeAt>closeAt&&helperCloseAt>activeAt,'Flow Active listeners are not source-emitted inside the private helper block');
for(const privateName of ['axis821FlowRecorderContextClear','axis821FlowOnActiveFinished','axis821FlowRecordingIntent']){
 assert.equal(active.includes(`window.${privateName}=`),false,`Flow private helper exported: ${privateName}`);
}
for(const token of [
 "#axis821FlowHome [data-axis-flow-active-toggle]",
 "#axis821FlowHome [data-axis-flow-active-finish]",
 "[data-axis-flow-active-set]').count(),0",
 "current Flow start opened Quick configuration",
 "first.flowItemUnit,'item'",
 "activity?.status==='paused'",
 "activity?.status==='active'",
 "suggestedGapMs>=45000&&c.flowRun.suggestedGapMs<=120000"
])assert.equal(smoke.includes(token),true,`canonical whole-item Flow physical proof missing ${token}`);
assert.equal(smoke.includes("await tap(page.locator('#v87Primary'))"),false,'Flow proof regressed to hidden duplicate v87 primary control');
assert.equal(smoke.includes("await tap(page.locator('#v87Toggle'))"),false,'Flow proof regressed to hidden duplicate v87 toggle control');

console.log('[AXIS 8.21 Flow step execution intent contract] PASS · existing executionOverride only · Flow Active boot listeners source-owned in private app scope · retired corrective prepare unreachable · canonical whole-item proof retained · no new owner');
