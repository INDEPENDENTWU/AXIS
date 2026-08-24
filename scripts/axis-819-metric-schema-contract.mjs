import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  METRIC_SCHEMA_ID,
  ENCOUNTER_METRICS_ID,
  METRIC_TYPES,
  normalizeMetricSchema,
  resolveMetricSchema,
  resolveRecordingSurface,
  createEncounterMetricEnvelope
} from '../lib/axis-metric-schema.mjs';

const readJson=(f)=>JSON.parse(fs.readFileSync(f,'utf8'));
const moduleSource=fs.readFileSync('lib/axis-metric-schema.mjs','utf8');

assert.equal(new Set(METRIC_TYPES).size,9,'metric primitive set drift');
for(const forbidden of ['localStorage','indexedDB','document.querySelector','fetch(','XMLHttpRequest'])assert.equal(moduleSource.includes(forbidden),false,`pure metric module gained side effect ${forbidden}`);

const metricSchema=readJson('shared/contracts/axis-metric-schema-v1.schema.json');
const encounterSchema=readJson('shared/contracts/axis-encounter-metrics-v1.schema.json');
const manifest=readJson('shared/contracts/axis-contract-manifest.json');
assert.equal(metricSchema.$id,METRIC_SCHEMA_ID);
assert.equal(encounterSchema.$id,ENCOUNTER_METRICS_ID);
assert.equal(manifest.metricSchema,METRIC_SCHEMA_ID);
assert.equal(manifest.encounterMetrics,ENCOUNTER_METRICS_ID);

const strength=resolveMetricSchema({id:'chest',type:'strength'});
assert.deepEqual(strength.metrics.map(x=>x.id),['weight','reps']);
assert.equal(strength.source,'legacy:weight_reps');
assert.deepEqual(resolveRecordingSurface(strength),{
  kind:'repeatable',objectId:'chest',metricIds:['weight','reps'],primaryMetricIds:['weight','reps'],entryMetricIds:['weight','reps'],singleMetricIds:[],legacyOwner:'v61'
});

const cardio=resolveMetricSchema({id:'treadmill',type:'cardio'});
assert.deepEqual(cardio.metrics.map(x=>x.id),['duration','intensity']);
assert.equal(resolveRecordingSurface(cardio).kind,'continuous');

const level=resolveMetricSchema({id:'stair-custom',type:'strength',axisCustomProfile:'time_level'});
assert.deepEqual(level.metrics.map(x=>x.id),['duration','level']);

const explicitObject={
  id:'rower-custom',type:'cardio',metricSchema:{metrics:[
    'duration',
    {id:'distance',type:'distance',label:'距离',unit:'m',priority:'primary',repeatability:'single',aggregation:'sum',presentation:'distance',min:0,step:100},
    {id:'resistance',type:'number',label:'阻力',unit:'',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'stepper',min:1,max:10,step:1}
  ]}
};
const explicit=resolveMetricSchema(explicitObject);
assert.deepEqual(explicit.metrics.map(x=>x.id),['duration','distance','resistance']);
assert.equal(explicit.source,'explicit');
assert.equal(resolveRecordingSurface(explicit).legacyOwner,null);

const strengthEvent={id:'E-STRENGTH',equipmentId:'chest',kind:'strength',time:1000,weight:40,reps:10,sets:2};
const meta={sets:[{weight:40,reps:10,state:'done',doneAt:1100},{weight:42.5,reps:8,state:'done',doneAt:1200}]};
const metaBefore=JSON.stringify(meta);
const strengthEnvelope=createEncounterMetricEnvelope({object:{id:'chest',type:'strength'},event:strengthEvent,metaRecord:meta});
assert.equal(strengthEnvelope.schema,ENCOUNTER_METRICS_ID);
assert.equal(strengthEnvelope.factSource,'axis_v8_meta');
assert.equal(strengthEnvelope.entries.length,2);
assert.deepEqual(strengthEnvelope.entries.map(x=>x.values),[{weight:40,reps:10},{weight:42.5,reps:8}]);
assert.equal(JSON.stringify(meta),metaBefore,'resolver mutated authoritative v61 metadata');

const cardioEvent={id:'E-CARDIO',equipmentId:'treadmill',kind:'cardio',time:2000,duration:25,intensity:6};
const cardioEnvelope=createEncounterMetricEnvelope({object:{id:'treadmill',type:'cardio'},event:cardioEvent});
assert.equal(cardioEnvelope.factSource,'axis_v60_state');
assert.deepEqual(cardioEnvelope.values,{duration:25,intensity:6});
assert.deepEqual(cardioEnvelope.entries,[]);

const mutable={id:'custom-proof',metricSchema:{metrics:['duration','distance']}};
const historical=createEncounterMetricEnvelope({object:mutable,event:{id:'E-SNAPSHOT',equipmentId:'custom-proof',kind:'cardio',time:3000,duration:12,distance:2.4}});
mutable.metricSchema.metrics.push({id:'rating',type:'rating',label:'感受',unit:'/10',priority:'context',repeatability:'single',aggregation:'average',presentation:'rating',min:1,max:10,step:1});
assert.deepEqual(historical.metricSchema.metrics.map(x=>x.id),['duration','distance'],'historical schema snapshot changed with current object');
assert.equal(historical.metricSchema.capturedAt,3000);

assert.throws(()=>normalizeMetricSchema({objectId:'bad',metrics:['weight','weight']}),/duplicate metric id/);
assert.throws(()=>normalizeMetricSchema({objectId:'bad',metrics:['not-a-known-primitive']}),/known metric id/);
assert.throws(()=>normalizeMetricSchema({objectId:'bad',metrics:[{id:'x',type:'choice',label:'X',options:[]}]}),/requires options/);

const deterministicA=createEncounterMetricEnvelope({object:{id:'chest',type:'strength'},event:strengthEvent,metaRecord:meta,recordedAt:4000});
const deterministicB=createEncounterMetricEnvelope({object:{id:'chest',type:'strength'},event:strengthEvent,metaRecord:meta,recordedAt:4000});
assert.deepEqual(deterministicA,deterministicB,'metric resolver is not deterministic');

console.log('[AXIS 8.19 Metric Schema foundation] PASS · 9 primitives · legacy strength/cardio/custom profiles · v61 authority preserved · Encounter schema snapshot immutable');
