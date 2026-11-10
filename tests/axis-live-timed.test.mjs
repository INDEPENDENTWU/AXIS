import assert from 'node:assert/strict';
import test from 'node:test';
import {axisTimedCreate,axisTimedValidate,axisTimedElapsed,axisTimedUpdate,axisTimedOutcome}
 from '../lib/axis-live-timed.mjs';
import {axisContinuityCreate,axisContinuityRecorded,axisContinuityPlan}
 from '../lib/axis-continuity-run.mjs';

test('prospective timer can pause/reload/resume without inventing an Encounter',()=>{
 let p=axisTimedCreate({attemptId:'a',objectId:'walk',at:1000});
 assert.equal(p.phase,'running');
 assert.equal(axisTimedElapsed(p,61000),60000);
 p=axisTimedUpdate(p,'pause',31000);
 assert.equal(p.elapsedMs,30000);
 assert.equal(axisTimedElapsed(p,100000),30000);
 p=JSON.parse(JSON.stringify(p));
 p=axisTimedUpdate(p,'resume',110000);
 assert.equal(axisTimedElapsed(p,140000),60000);
 p=axisTimedUpdate(p,'finish',140000);
 assert.equal(p.phase,'review');
 assert.equal(p.elapsedMs,60000);
 assert.throws(()=>axisTimedUpdate(p,'resume',141000),/invalid timed action/);
 assert.deepEqual(axisTimedOutcome(p,142000,{minutes:1,intensity:5}).actualDurationMinutes,1);
});
test('actual results must be explicitly confirmed, bounded and cannot follow only from timer',()=>{
 const p=axisTimedCreate({attemptId:'b',objectId:'walk',at:1000});
 assert.throws(()=>axisTimedOutcome(p,60000,{minutes:1,intensity:4}),/not reviewed/);
 const review=axisTimedUpdate(p,'finish',60000);
 for(const result of [{minutes:0,intensity:4},{minutes:6000,intensity:4},
  {minutes:1,intensity:0},{minutes:1,intensity:11},{minutes:1.25,intensity:4},
  {minutes:null,intensity:4}])
  assert.throws(()=>axisTimedOutcome(review,61000,result),/required/);
 const outcome=axisTimedOutcome(review,62000,{minutes:1.4,intensity:7});
 assert.equal(outcome.facts,'explicitly-confirmed-user-results');
 assert.equal(outcome.elapsedMs,59000);
});
test('continuity can reuse truthful cardio history and mix with performed strength',()=>{
 const old={id:'s1',start:5000,end:6000,events:[
  {id:'e1',equipmentId:'row',kind:'strength'},
  {id:'e2',equipmentId:'walk',kind:'cardio'}]};
 const resolve=id=>({row:{type:'strength'},walk:{type:'cardio'}}[id]);
 const source=axisContinuityPlan([old],resolve);
 assert.deepEqual(source.objectIds,['row','walk']);
 let p=axisContinuityCreate({id:'r',now:7000,objectIds:source.objectIds});
 p=axisContinuityRecorded(p,{id:'actual-set',equipmentId:'row',kind:'strength',
  playThis:{continuity:{runId:'r',stepIndex:0},actualSets:[{index:1}]}});
 assert.equal(p.facts[0].sets,1);
 const {axisContinuityNext}=await import('../lib/axis-continuity-run.mjs');
 p=axisContinuityNext(p);
 assert.throws(()=>axisContinuityRecorded(p,{id:'bad',equipmentId:'walk',kind:'cardio',
  playThis:{continuity:{runId:'r',stepIndex:1},actualDurationMinutes:0}}),/nonmatching/);
 p=axisContinuityRecorded(p,{id:'timed',equipmentId:'walk',kind:'cardio',
  playThis:{continuity:{runId:'r',stepIndex:1},actualDurationMinutes:2.5}});
 assert.equal(p.stage,'complete');assert.equal(p.facts[1].sets,0);
});
test('invalid clock state cannot masquerade as a valid running draft',()=>{
 const p=axisTimedCreate({attemptId:'x',objectId:'y',at:200});
 assert.throws(()=>axisTimedValidate({...p,phase:'paused'}),/clock/);
 assert.throws(()=>axisTimedValidate({...p,elapsedMs:-1}),/draft/);
 assert.throws(()=>axisTimedElapsed(p,100),/time/);
});
