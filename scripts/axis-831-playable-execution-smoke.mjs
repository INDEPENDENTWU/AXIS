import assert from 'node:assert/strict';
import {compilePlayableSpec} from '../lib/axis-playable.mjs';
import {projectPlayableExecution,planPlayableCommand,dispatchPlayableCommand} from '../lib/axis-playable-execution.mjs';
const objects=[{id:'chest-row',baseId:'row',name:'划船',metricSchema:{metrics:['weight','reps']}},{id:'custom-identity-proof',name:'划船',metricSchema:{metrics:['duration']}}];
const flow={schema:'axis.flow.v1',id:'flow-831',steps:[{id:'step-a',objectRef:'chest-row'},{id:'step-b',objectRef:'custom-identity-proof'}]};
const spec=compilePlayableSpec({playableId:'playable-831',source:{kind:'flow',flow},objects});
const object=compilePlayableSpec({playableId:'object-831',source:{kind:'object',objectId:'chest-row'},objects});
const attemptId='attempt-831';
const current={flowRef:'flow-831',stepRef:'step-a',objectRef:'chest-row'};
let state={flowRun:null,flowCurrent:null,encounters:[],selectedObjectId:null};
const owner={snapshot:()=>JSON.parse(JSON.stringify(state)),dispatch:(cmd)=>{
 if(cmd.action==='launch'){if(state.flowRun)return false;state.flowRun={flowRef:'flow-831',cursor:0,status:'active',steps:flow.steps.map(s=>({id:s.id,objectRef:s.objectRef})),consumedStepRefs:[],lastEncounterId:null};state.flowCurrent={...current};return true}
 if(cmd.action==='select-current')return state.flowCurrent?.stepRef===cmd.stepRef;
 if(cmd.action==='advance'){const ev=state.encounters.find(x=>x.id===cmd.evidenceId);if(!ev||state.flowRun.lastEncounterId!==ev.id||ev.flowProvenance?.flowStepRef!==cmd.stepRef)return false;state.flowRun.consumedStepRefs.push(cmd.stepRef);state.flowRun.cursor++;state.flowRun.lastEncounterId=null;state.flowRun.status=state.flowRun.cursor===2?'complete':'active';state.flowCurrent=state.flowRun.status==='active'?{flowRef:'flow-831',stepRef:'step-b',objectRef:'custom-identity-proof'}:null;return true}
 return false
}};
let phase=projectPlayableExecution({spec,owner:owner.snapshot(),attemptId});assert.equal(phase.phase,'ready');
let cmd=planPlayableCommand({projection:phase,action:'launch',requestId:'click-1'});assert.equal(cmd.ok,true);
assert.equal(dispatchPlayableCommand({spec,attemptId,command:cmd,owner}).status,'accepted');
assert.equal(dispatchPlayableCommand({spec,attemptId,command:cmd,owner}).status,'stale','repeated launch cannot run twice');
phase=projectPlayableExecution({spec,owner:owner.snapshot(),attemptId});assert.equal(phase.phase,'awaiting-fact');
assert.equal(planPlayableCommand({projection:phase,action:'advance',requestId:'cheat'}).ok,false,'no fake completion');
const ev1={id:'ev-1',equipmentId:'chest-row',flowProvenance:{schema:'axis.flow-provenance.v1',flowRef:'flow-831',flowStepRef:'step-a',objectRef:'chest-row'}};
state.flowRun.lastEncounterId='ev-1';
assert.equal(projectPlayableExecution({spec,owner:owner.snapshot(),attemptId}).phase,'awaiting-evidence','lastEncounterId alone is insufficient');
state.encounters=[{...ev1,equipmentId:'row'}];assert.equal(projectPlayableExecution({spec,owner:owner.snapshot(),attemptId}).phase,'awaiting-evidence','legacy base ID cannot confirm exact object');
state.encounters=[ev1];phase=projectPlayableExecution({spec,owner:owner.snapshot(),attemptId});assert.equal(phase.phase,'ready-to-advance');
const advance=planPlayableCommand({projection:phase,action:'advance',requestId:'click-2'});
assert.equal(dispatchPlayableCommand({spec,attemptId,command:advance,owner}).status,'accepted');
assert.equal(dispatchPlayableCommand({spec,attemptId,command:advance,owner}).status,'stale','replay/double-tap never advances twice');
phase=projectPlayableExecution({spec,owner:owner.snapshot(),attemptId});assert.equal(phase.stepRef,'step-b');assert.equal(phase.objectRef,'custom-identity-proof');
state.flowRun.lastEncounterId='ev-2';state.encounters.push({id:'ev-2',equipmentId:'custom-identity-proof',flowProvenance:{schema:'axis.flow-provenance.v1',flowRef:'flow-831',flowStepRef:'step-b',objectRef:'custom-identity-proof'}});
phase=projectPlayableExecution({spec,owner:owner.snapshot(),attemptId});const advance2=planPlayableCommand({projection:phase,action:'advance',requestId:'click-3'});assert.equal(dispatchPlayableCommand({spec,attemptId,command:advance2,owner}).status,'accepted');
phase=projectPlayableExecution({spec,owner:owner.snapshot(),attemptId});assert.equal(phase.phase,'complete');assert.equal(phase.canRequest,'none');
assert.equal(state.encounters.length,2,'no Encounter writer in Playable bridge');
const objectReady=projectPlayableExecution({spec:object,owner:{selectedObjectId:'row'},attemptId});assert.equal(objectReady.phase,'ready');
assert.equal(projectPlayableExecution({spec:object,owner:{selectedObjectId:'chest-row'},attemptId}).phase,'selected');
assert.equal(projectPlayableExecution({spec:object,owner:{selectedObjectId:'chest-row',encounters:[ev1]},attemptId}).phase,'selected','historical fact cannot complete a new attempt');
const fake={...spec,source:{kind:'flow',ref:'different'}};assert.equal(projectPlayableExecution({spec:fake,owner:owner.snapshot(),attemptId}).phase,'blocked');
assert.throws(()=>projectPlayableExecution({spec,owner:owner.snapshot(),attemptId:'bad\u0000id'}));
console.log('[AXIS 8.31b Execution Core] PASS · pure projected lifecycle · canonical Flow/Encounter provenance required · two distinct native/custom IDs · duplicate and stale command rejection · no second fact writer');
