import assert from 'node:assert/strict';
import test from 'node:test';
import {
 axisContinuityPlan,axisContinuityCreate,axisContinuityValidate,
 axisContinuityRecorded,axisContinuitySkip,axisContinuityNext,axisContinuityDone
} from '../lib/axis-continuity-run.mjs';

const session={id:'s1',start:1000,end:2000,events:[
 {id:'a',equipmentId:'row',kind:'strength'},
 {id:'b',equipmentId:'press',kind:'strength'},
 {id:'c',equipmentId:'row',kind:'strength'},
 {id:'d',equipmentId:'run',kind:'cardio'},
 {id:'e',equipmentId:'shoulders',kind:'strength'}
]};
const resolver=id=>['row','press','shoulders'].includes(id)?{type:'strength',id}:null;
const event=(p,id,sets=2)=>({
 id,kind:'strength',equipmentId:p.steps[p.index],
 playThis:{continuity:{runId:p.id,stepIndex:p.index},actualSets:Array.from({length:sets},(_,i)=>({index:i+1}))}
});

test("Today's reusable plan is grounded in a completed session, never synthetic",()=>{
 assert.equal(axisContinuityPlan([],resolver),null);
 assert.equal(axisContinuityPlan([{events:[{id:'x',kind:'cardio',equipmentId:'run'}]}],resolver),null);
 assert.deepEqual(axisContinuityPlan([session],resolver),{
 sourceId:'s1',sourceAt:2000,objectIds:['row','press','shoulders']});
});
test('Full/short are alternate temporary execution intents, no changes to history',()=>{
 const plan=axisContinuityPlan([session],resolver);
 const full=axisContinuityCreate({id:'r1',objectIds:plan.objectIds,mode:'full',sourceId:plan.sourceId,now:3000});
 const short=axisContinuityCreate({id:'r2',objectIds:plan.objectIds,mode:'short',sourceId:plan.sourceId,now:3000});
 assert.deepEqual(full.steps,['row','press','shoulders']);
 assert.deepEqual(short.steps,['row','press']);
 assert.equal(session.events.length,5);
 assert.deepEqual(JSON.parse(JSON.stringify(full)).steps,full.steps);
 assert.equal(full.facts.length,0);
});
test('Two performed Objects advance only after factual, matching canonical Encounters',()=>{
 let p=axisContinuityCreate({id:'run',objectIds:['row','press'],mode:'full',now:1000});
 assert.equal(p.stage,'running');
 assert.throws(()=>axisContinuityRecorded(p,{equipmentId:'row',id:'ghost'}),/nonmatching/);
 assert.throws(()=>axisContinuityRecorded(p,{...event(p,'bad'),equipmentId:'wrong'}),/nonmatching/);
 p=axisContinuityRecorded(p,event(p,'saved-1',3));
 assert.equal(p.stage,'between');assert.equal(p.index,1);
 assert.deepEqual(p.facts,[{index:0,objectId:'row',eventId:'saved-1',sets:3}]);
 assert.throws(()=>axisContinuityRecorded(p,event(p,'saved-1')),/nonmatching/);
 p=axisContinuityNext(p);
 assert.equal(p.stage,'running');
 assert.throws(()=>axisContinuityRecorded(p,{...event(p,'saved-2'),playThis:{continuity:{runId:'other',stepIndex:1},actualSets:[{}]}}),/nonmatching/);
 p=axisContinuityRecorded(p,event(p,'saved-2',1));
 assert.equal(p.stage,'complete');assert.equal(p.index,2);assert.equal(p.facts.length,2);
 const done=axisContinuityDone(p,'session-committed');
 assert.equal(done.stage,'done');assert.equal(done.sessionId,'session-committed');
 assert.throws(()=>axisContinuityNext(done),/not between/);
});
test('Skipped is not performed or saved and never increases confirmed facts',()=>{
 let p=axisContinuityCreate({id:'r1',objectIds:['row','press'],mode:'short',now:1000});
 p=axisContinuitySkip(p);
 assert.equal(p.stage,'between');assert.equal(p.facts.length,0);
 assert.deepEqual(p.skipped,[0]);
 p=axisContinuityNext(p);p=axisContinuitySkip(p);
 assert.equal(p.stage,'complete');assert.equal(p.facts.length,0);
 assert.equal(axisContinuityDone(p,null).sessionId,null);
});
test('Corrupt data, duplicate positions and phantom evidence are rejected',()=>{
 const p=axisContinuityCreate({id:'r1',objectIds:['row','press'],now:1000});
 assert.throws(()=>axisContinuityCreate({id:'bad',objectIds:['row','row'],now:1000}),/source plan/);
 assert.throws(()=>axisContinuityValidate({...p,stage:'done'}),/completed index/);
 assert.throws(()=>axisContinuityValidate({...p,index:4}),/invalid/);
 assert.throws(()=>axisContinuityValidate({...p,skipped:[0],facts:[{index:0,objectId:'row',eventId:'real',sets:1}]}),/invalid continuity facts/);
});
