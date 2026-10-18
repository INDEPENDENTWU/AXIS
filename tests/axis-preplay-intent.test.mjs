import test from 'node:test';
import assert from 'node:assert/strict';
import {axisPreplayCreate,axisPreplayElapsed,axisPreplayTransition,axisPreplayValidate} from '../lib/axis-preplay-intent.mjs';

for(const mode of ['single','sets','rounds','timed','hold','complete']){
 test('pre-Encounter '+mode+' starts without a fact and can pause, reload, review',()=>{
  const started=axisPreplayCreate({attemptId:'test-'+mode,objectId:'chest-row',mode,repeat:4,now:1000});
  assert.deepEqual(Object.keys(started).sort(),['schema','attemptId','objectId','mode','repeat','createdAt','status','elapsedMs','resumedAt','completedSets','handoff'].sort());
  assert.equal(started.status,'running');
  assert.equal(axisPreplayElapsed(started,1600),600);
  const paused=axisPreplayTransition(started,'pause',1600);
  assert.equal(axisPreplayElapsed(paused,4800),600);
  const restored=axisPreplayValidate(JSON.parse(JSON.stringify(paused)));
  const resumed=axisPreplayTransition(restored,'resume',5000);
  assert.equal(axisPreplayElapsed(resumed,5400),1000);
  if(mode==='sets'||mode==='rounds'){
   const counted=axisPreplayTransition(resumed,'complete-set',5500);
   assert.equal(counted.completedSets,1);
   assert.equal(axisPreplayTransition(counted,'complete-set',5600).completedSets,2);
  }else assert.throws(()=>axisPreplayTransition(resumed,'complete-set',5500),/not admitted/);
  const review=axisPreplayTransition(resumed,'review',6000);
  assert.equal(review.status,'review');
  assert.equal(review.elapsedMs,1600);
  assert.equal(review.handoff,false);
  const handoff=axisPreplayTransition(review,'handoff',6100);
  assert.equal(handoff.handoff,true);
  assert.equal(handoff.status,'review');
  assert.throws(()=>axisPreplayTransition(handoff,'resume',6200),/not admitted/);
  assert.equal(axisPreplayTransition(handoff,'back',6200).status,'paused');
 });
}
test('validation rejects corrupted and forged local execution snapshots',()=>{
  assert.throws(()=>axisPreplayCreate({attemptId:'',objectId:'x',mode:'single',now:1}));
  assert.throws(()=>axisPreplayCreate({attemptId:'x',objectId:'x',mode:'unknown',now:1}));
  const p=axisPreplayCreate({attemptId:'x',objectId:'x',mode:'sets',now:100,repeat:2});
  for(const mutation of [{status:'complete'},{completedSets:100},{elapsedMs:-4},{resumedAt:null},{handoff:1}])
    assert.throws(()=>axisPreplayValidate({...p,...mutation}));
  assert.equal(axisPreplayTransition(axisPreplayTransition(p,'complete-set',100),'complete-set',100).completedSets,2);
  assert.equal(axisPreplayTransition(axisPreplayTransition(axisPreplayTransition(p,'complete-set',100),'complete-set',100),'complete-set',100).completedSets,3);
});
