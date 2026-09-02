import assert from 'node:assert/strict';
import fs from 'node:fs';
import {metricCapability,metricDefinitionForRuntime,normalizeMetricValue,customMetricDefinition} from '../lib/axis-object-capabilities.mjs';
import {builtinMetric,resolveMetricSchema,createMetricSchemaSnapshot} from '../lib/axis-metric-schema.mjs';

const capability=metricCapability('intensity');
assert.equal(capability.type,'rating');
assert.equal(capability.unit,'');
assert.equal(capability.min,1);
assert.equal(capability.max,20);
assert.equal(capability.step,1);
assert.deepEqual(capability.presets,[4,8,12,16,20]);
assert.equal(capability.executionHint,'timed');

const runtime=metricDefinitionForRuntime('intensity');
assert.equal(runtime.type,'rating');
assert.equal(runtime.unit,'');
assert.equal(runtime.min,1);
assert.equal(runtime.max,20);
assert.equal(runtime.step,1);
assert.deepEqual(runtime.presets,[4,8,12,16,20]);
assert.equal(normalizeMetricValue(runtime,20),20);
assert.equal(normalizeMetricValue(runtime,21),20,'current stable intensity did not clamp to 20');

const builtin=builtinMetric('intensity');
assert.equal(builtin.unit,'');
assert.equal(builtin.min,1);
assert.equal(builtin.max,20);
assert.equal(builtin.step,1);
const cardio=resolveMetricSchema({id:'metric-optics-cardio',type:'cardio'});
const current=cardio.metrics.find(x=>x.id==='intensity');
assert.ok(current,'current cardio intensity missing');
assert.equal(current.unit,'');
assert.equal(current.max,20);

const historical=createMetricSchemaSnapshot({
  schema:'axis.metric-schema.v1',objectId:'legacy-intensity-session',source:'historical-snapshot',metrics:[
    {id:'intensity',type:'rating',label:'强度',unit:'/10',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'rating',min:1,max:10,step:1}
  ]
},123456);
assert.equal(historical.capturedAt,123456);
assert.equal(historical.metrics[0].unit,'/10','historical intensity unit was migrated');
assert.equal(historical.metrics[0].max,10,'historical intensity range was migrated');

const customRating=customMetricDefinition({id:'custom_effort',label:'主观感受',type:'rating'});
assert.equal(customRating.max,10,'generic custom rating semantics were changed with stable intensity');
assert.equal(customRating.type,'rating');

const projection=fs.readFileSync('prepare-821-metric-optical-system.mjs','utf8');
for(const token of ['axis821MetricOpticalBaseSchemaForEq','axis821OrdinalMetric','[4,8,12,16,20]','historyMigration:false','headerUnitDuplicate:false'])assert.ok(projection.includes(token),`projection contract missing ${token}`);
for(const forbidden of ['localStorage','indexedDB','fetch(','XMLHttpRequest','Math.random','*2'])assert.equal(projection.includes(forbidden),false,`metric optical projection gained forbidden behavior ${forbidden}`);

const lifecycle=fs.readFileSync('prepare-819-postcommit-lifecycle.mjs','utf8');
assert.equal(lifecycle.split("await import('./prepare-821-metric-optical-system.mjs');").length-1,1,'metric optical final projection missing or duplicated');
assert.ok(lifecycle.indexOf("prepare-821-metric-optical-system.mjs")>lifecycle.indexOf("prepare-821-profile-session-truth.mjs"),'metric optical projection is not final after existing 8.21 product projections');

console.log('[AXIS 8.21 Metric Optical System contract] PASS · stable intensity = ordinal 1–20/no unit · 4/8/12/16/20 presets · legacy /10 snapshot unchanged · generic custom rating remains 1–10 · no persistence/Encounter/history migration');