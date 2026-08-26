import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-flow-runtime.mjs');
const chain=read('prepare-819-postcommit-lifecycle.mjs');
const flow=read('lib/axis-flow.mjs');

for(const token of ["flows:state.flows","flowRun:state.flowRun","storage:'axis_v60_state'",'newStorage:false','newRecorder:false','newActiveOwner:false','newEncounterWriter:false','axis821AttachFlowProvenance(e,eq)','axis821SchemaForRecording(eq)','axis821ExecutionForRecording(eq)','window.__AXIS_FLOW_RUNTIME__'])assert.equal(prepare.includes(token),true,`Flow runtime prepare missing ${token}`);
for(const forbidden of ['axis_flow_state','axis_flow_run','indexedDB.open(',"localStorage.setItem('axis_flow",'localStorage.setItem("axis_flow'])assert.equal(prepare.includes(forbidden),false,`Flow runtime introduced forbidden persistence ${forbidden}`);
assert.equal(chain.includes("await import('./prepare-821-flow-runtime.mjs');"),true,'8.21 Flow runtime is not sequenced after the 8.20.1 release preparation');
assert.equal(chain.indexOf('prepare-821-flow-runtime.mjs')>chain.indexOf('prepare-8201-release.mjs'),true,'8.21 Flow runtime is sequenced before the 8.20.1 seal');
for(const forbidden of ['localStorage','indexedDB','document.querySelector','window.','fetch(','XMLHttpRequest'])assert.equal(flow.includes(forbidden),false,`portable Flow module gained browser/storage side effect ${forbidden}`);

console.log('[AXIS 8.21 Flow runtime contract] PASS · existing axis_v60_state only · app-owned Encounter handoff · temporary schema/execution projection · portable resolver remains pure');
