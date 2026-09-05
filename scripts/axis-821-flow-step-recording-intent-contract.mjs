import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-flow-step-recording-intent.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const current=read('docs/CURRENT_WORK.md');

for(const token of [
 '__AXIS_821_FLOW_STEP_RECORDING_INTENT__',
 "owner:'axis.flow.v1.step.metricOverride'",
 'axis821FlowStepIntentDecorateEditor',
 'step.metricOverride={metrics:next}',
 'delete step.metricOverride',
 'axis818SchemaForEq(eq)',
 'axis821BaseSchemaForEq(eq)',
 'newStorage:false',
 'newRecorder:false',
 'newEncounterWriter:false',
 'newActiveOwner:false'
])assert.equal(prepare.includes(token),true,`Flow step recording intent missing ${token}`);

for(const forbidden of [
 'localStorage.setItem(',
 'indexedDB.open(',
 'fetch(',
 'XMLHttpRequest',
 'state.active.events.push(',
 'axis_flow_step',
 'new EventSource',
 'navigator.sendBeacon'
])assert.equal(prepare.includes(forbidden),false,`Flow step recording intent introduced forbidden owner/side effect ${forbidden}`);

assert.equal(chain.includes("await import('./prepare-821-flow-step-recording-intent.mjs');"),true,'Flow step recording intent is not in canonical build chain');
assert.equal(chain.indexOf('prepare-821-flow-step-recording-intent.mjs')>chain.indexOf('prepare-821-object-metric-overrides.mjs'),true,'Flow step intent must inherit Object/Profile recording defaults rather than precede them');
assert.equal(chain.indexOf('prepare-821-flow-step-recording-intent.mjs')<chain.indexOf('prepare-821-profile-session-truth.mjs'),true,'Flow step intent escaped its bounded 8.21 presentation stage');
assert.equal(current.includes('feat/821-flow-step-recording-intent'),true,'CURRENT_WORK missing bounded Flow step recording intent branch');
assert.equal(current.includes('b65bce78d48dab162c25c028602e0bbd10ce6d78'),true,'CURRENT_WORK missing exact certified base main SHA');

console.log('[AXIS 8.21 Flow step recording intent contract] PASS · existing axis.flow.v1 step.metricOverride only · Object defaults inherited · no new persistence/recorder/Encounter/Active owner');
