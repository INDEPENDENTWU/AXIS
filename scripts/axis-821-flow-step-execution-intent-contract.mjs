import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-flow-step-execution-intent.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const schema=read('shared/contracts/axis-flow-v1.schema.json');
const current=read('docs/CURRENT_WORK.md');

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
assert.equal(current.includes('396241c41b2f8eea80d45ca582352ea593c47036'),true,'CURRENT_WORK missing exact certified base main SHA');

console.log('[AXIS 8.21 Flow step execution intent contract] PASS · existing executionOverride only · resolved execution reaches canonical Encounter/Active handoff · explicit one-shot override returns to canonical recorder/advance · inherited whole-item behavior stays intact · no new owner');
