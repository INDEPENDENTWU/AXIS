import assert from 'node:assert/strict';
import fs from 'node:fs';
import {projectRealityRoute,deferRealityRouteCurrent,REALITY_ROUTE_SCHEMA_ID,EXECUTION_CONSTRAINT_SCHEMA_ID} from '../lib/axis-reality-route.mjs';

const steps=[
  {id:'chest',objectRef:'chest-press'},
  {id:'lat',objectRef:'lat-pulldown'},
  {id:'row',objectRef:'row'},
  {id:'shoulder',objectRef:'shoulder-press'}
];
const flowRef='flow-a';
const encounter=(step,id)=>({id,flowProvenance:{schema:'axis.flow-provenance.v1',flowRef,flowStepRef:step,objectRef:steps.find(x=>x.id===step)?.objectRef}});

const originalSteps=JSON.stringify(steps);
const baseRun={
  schema:'axis.flow-run.v1',
  flowRef,
  status:'active',
  steps,
  consumedStepRefs:['chest'],
  skippedStepRefs:[],
  currentEncounterId:null,
  currentStepRef:null,
  temporaryConstraints:{schema:EXECUTION_CONSTRAINT_SCHEMA_ID,deferredStepRefs:[]}
};
const encounters=[encounter('chest','E1')];

const first=projectRealityRoute({flowRef,steps,run:baseRun,encounters});
assert.equal(first.schema,REALITY_ROUTE_SCHEMA_ID);
assert.equal(first.current.id,'lat');
assert.equal(first.next.id,'row');
assert.deepEqual(first.remaining.map(x=>x.id),['lat','row','shoulder']);
assert.deepEqual(first.deferred,[]);
assert.deepEqual(first.completedWithoutEncounter,[]);

const deferred=deferRealityRouteCurrent({run:baseRun,projection:first});
assert.equal(deferred.changed,true);
assert.equal(deferred.stepRef,'lat');
assert.deepEqual(baseRun.temporaryConstraints.deferredStepRefs,[],'pure defer helper mutated input run');

const second=projectRealityRoute({flowRef,steps,run:deferred.run,encounters});
assert.equal(second.current.id,'row');
assert.equal(second.next.id,'shoulder');
assert.deepEqual(second.remaining.map(x=>x.id),['row','shoulder','lat']);
assert.deepEqual(second.deferred.map(x=>x.id),['lat']);
assert.equal(second.counts.deferred,1);
assert.ok(second.reasonCodes.includes('temporary-deferred-item'));
assert.equal(JSON.stringify(steps),originalSteps,'Reality Route mutated reusable Flow intent');

const afterRow={...deferred.run,consumedStepRefs:['chest','row']};
const third=projectRealityRoute({flowRef,steps,run:afterRow,encounters:[...encounters,encounter('row','E2')]});
assert.deepEqual(third.remaining.map(x=>x.id),['shoulder','lat']);
assert.equal(third.current.id,'shoulder');

const afterShoulder={...afterRow,consumedStepRefs:['chest','row','shoulder']};
const fourth=projectRealityRoute({flowRef,steps,run:afterShoulder,encounters:[...encounters,encounter('row','E2'),encounter('shoulder','E3')]});
assert.equal(fourth.current.id,'lat');
assert.equal(fourth.currentDeferred,true);
assert.ok(fourth.reasonCodes.includes('resuming-deferred-item'));
const again=deferRealityRouteCurrent({run:afterShoulder,projection:fourth});
assert.equal(again.changed,false);
assert.equal(again.reason,'already-deferred');

const activeRun={...deferred.run,currentEncounterId:'E2',currentStepRef:'row'};
const activeProjection=projectRealityRoute({flowRef,steps,run:activeRun,encounters:[...encounters,encounter('row','E2')]});
assert.equal(activeProjection.current.id,'row');
assert.ok(activeProjection.reasonCodes.includes('active-item-authoritative'));
const activeDefer=deferRealityRouteCurrent({run:activeRun,projection:activeProjection});
assert.equal(activeDefer.changed,false);
assert.equal(activeDefer.reason,'active-item-cannot-defer');

const detour=[...encounters,{id:'D1',flowDetour:{schema:'axis.flow-detour.v1',recordOnly:true,flowRef,returnStepRef:'lat'}}];
const detourProjection=projectRealityRoute({flowRef,steps,run:baseRun,encounters:detour});
assert.equal(detourProjection.current.id,'lat','manual detour fabricated Flow progression');
assert.deepEqual(detourProjection.completedStepRefs,['chest']);

const missingEvidence=projectRealityRoute({flowRef,steps,run:{...baseRun,consumedStepRefs:['chest','lat']},encounters});
assert.deepEqual(missingEvidence.completedWithoutEncounter,['lat']);
assert.ok(missingEvidence.reasonCodes.includes('consumed-step-missing-encounter-evidence'));

const completed=projectRealityRoute({
  flowRef,steps,
  run:{...baseRun,consumedStepRefs:['chest','lat','row','shoulder']},
  encounters:[encounter('chest','E1'),encounter('lat','E2'),encounter('row','E3'),encounter('shoulder','E4')]
});
assert.equal(completed.status,'complete');
assert.equal(completed.current,null);
assert.deepEqual(completed.remaining,[]);
assert.ok(completed.reasonCodes.includes('route-complete'));

const source=fs.readFileSync(new URL('../lib/axis-reality-route.mjs',import.meta.url),'utf8');
for(const forbidden of ['window.','document.','localStorage','indexedDB','fetch(','XMLHttpRequest','WebSocket','navigator.']){
  assert.equal(source.includes(forbidden),false,`pure Reality Route core contains platform side effect: ${forbidden}`);
}

console.log('[AXIS 8.27 Reality Route contract] PASS · pure projection · defer is temporary · Flow intent immutable · Encounter evidence visible · detours do not fabricate progression · active item authoritative');
