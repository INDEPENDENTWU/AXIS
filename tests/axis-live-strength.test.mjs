import test from 'node:test';
import assert from 'node:assert/strict';
import {axisStrengthCreate,axisStrengthValidate,axisStrengthElapsed,axisStrengthRestLeft,axisStrengthUpdate,axisStrengthOutcome} from '../lib/axis-live-strength.mjs';
const start=()=>axisStrengthCreate({attemptId:'a-1',objectId:'chest-row',at:1000,targetSets:2,restSeconds:90});

test('strength: no prior or synthetic performed facts',()=>{
 const p=start();
 assert.equal(p.sets.length,0);
 assert.equal(p.phase,'running');
 assert.equal(axisStrengthElapsed(p,1800),800);
 assert.throws(()=>axisStrengthOutcome(p,2000),/actual performance|required/);
});
test('strength: confirms actual results, rests, advances to review',()=>{
 let p=start();
 p=axisStrengthUpdate(p,'confirm-set',1800,{weight:40,reps:12,expectedIndex:1});
 assert.equal(p.phase,'rest');
 assert.equal(p.sets[0].weight,40);
 assert.equal(axisStrengthRestLeft(p,1800),90);
 assert.equal(axisStrengthRestLeft(p,10800),81);
 assert.throws(()=>axisStrengthUpdate(p,'confirm-set',1900,{weight:40,reps:12,expectedIndex:1}),/not admitted/);
 p=axisStrengthUpdate(p,'rest-done',2000);
 assert.equal(p.phase,'running');
 assert.equal(axisStrengthElapsed(p,2200),1200);
 p=axisStrengthUpdate(p,'confirm-set',2500,{weight:42.5,reps:10,expectedIndex:2});
 assert.equal(p.phase,'review');
 assert.equal(p.sets.length,2);
 const out=axisStrengthOutcome(p,2700);
 assert.equal(out.summary.sets,2);
 assert.equal(out.summary.weight,42.5);
 assert.equal(out.summary.reps,10);
 assert.deepEqual(out.actualSets.map(x=>[x.weight,x.reps]),[[40,12],[42.5,10]]);
 assert.equal(out.facts,'explicitly-confirmed-user-actions');
});
test('strength: pause/reload never advances running clock or creates actuals',()=>{
 const p=start(),paused=axisStrengthUpdate(p,'pause',4000);
 const copy=axisStrengthValidate(JSON.parse(JSON.stringify(paused)));
 assert.equal(axisStrengthElapsed(copy,9000),3000);
 assert.equal(copy.sets.length,0);
 const resumed=axisStrengthUpdate(copy,'resume',9000);
 assert.equal(axisStrengthElapsed(resumed,10000),4000);
 assert.throws(()=>axisStrengthUpdate(resumed,'confirm-set',10000,{weight:5,reps:10,expectedIndex:2}),/stale set/);
});
test('strength: manual goal and actual corrections require valid input',()=>{
 let p=start();
 p=axisStrengthUpdate(p,'plan',1100,{targetSets:3,restSeconds:0});
 assert.equal(p.restSeconds,0);
 p=axisStrengthUpdate(p,'confirm-set',1200,{weight:0,reps:8,expectedIndex:1});
 assert.equal(p.phase,'running');
 assert.equal(p.sets.length,1);
 assert.throws(()=>axisStrengthUpdate(p,'plan',1300,{targetSets:4,restSeconds:90}),/not admitted/);
 p=axisStrengthUpdate(p,'finish',1500);
 assert.equal(p.phase,'review');
 p=axisStrengthUpdate(p,'edit-set',1600,{index:1,weight:15.5,reps:6});
 assert.equal(axisStrengthOutcome(p,1700).actualSets[0].weight,15.5);
 assert.equal(axisStrengthUpdate(p,'back',1700).phase,'paused');
});
test('strength: rejects nonfinite or forged user actuals',()=>{
 const p=start();
 for(const payload of [{weight:'',reps:12},{weight:-1,reps:4},{weight:40,reps:0},{weight:Infinity,reps:12},{weight:40,reps:7.5}])
  if(payload.weight!=='')assert.throws(()=>axisStrengthUpdate(p,'confirm-set',1200,{...payload,expectedIndex:1}));
 assert.throws(()=>axisStrengthValidate({...p,sets:[{index:1,weight:NaN,reps:10,at:1200}]}),/invalid actual sets/);
});
