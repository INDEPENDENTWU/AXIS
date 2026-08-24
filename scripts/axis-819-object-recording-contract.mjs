import assert from 'node:assert/strict';
import {adapt818ObjectMetricSchema,AXIS_819_METRIC_CONTRACT} from '../lib/axis-818-metric-adapter.mjs';

const wall=adapt818ObjectMetricSchema({
 id:'wall-hold',metricSchemaVersion:'8.18',
 metricSchema:[{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1}]
});
assert.equal(wall.schema.schema,AXIS_819_METRIC_CONTRACT);
assert.deepEqual(wall.schema.metrics.map(x=>x.id),['duration']);
assert.equal(wall.schema.metrics[0].type,'duration');
assert.equal(wall.surface.kind,'continuous');
assert.equal(wall.surface.legacyOwner,null);
assert.equal(wall.compatibility.readOnly,true);

const classic=adapt818ObjectMetricSchema({
 id:'custom-strength',metricSchemaVersion:'8.18',
 metricSchema:[
  {key:'weight',label:'重量',type:'number',unit:'kg',step:2.5},
  {key:'reps',label:'次数',type:'number',unit:'次',step:1},
  {key:'sets',label:'组数',type:'number',unit:'组',step:1}
 ]
});
assert.deepEqual(classic.schema.metrics.map(x=>x.id),['weight','reps']);
assert.equal(classic.schema.metrics.find(x=>x.id==='reps').type,'count');
assert.deepEqual(classic.compatibility.structuralMetricIds,['sets']);
assert.equal(classic.surface.kind,'repeatable');
assert.equal(classic.surface.legacyOwner,'v61');

const run=adapt818ObjectMetricSchema({
 id:'custom-run',metricSchemaVersion:'8.18',
 metricSchema:[
  {key:'distance',label:'距离',type:'number',unit:'km',step:.1},
  {key:'pace',label:'速度 / 配速',type:'text',unit:'',step:1}
 ]
});
assert.deepEqual(run.schema.metrics.map(x=>[x.id,x.type]),[['distance','distance'],['pace','pace']]);
assert.equal(run.surface.kind,'continuous');

const rpe=adapt818ObjectMetricSchema({
 id:'custom-rpe',metricSchemaVersion:'8.18',
 metricSchema:[{key:'custom_rpe',label:'RPE',type:'number',unit:'',step:1,custom:true}]
});
assert.equal(rpe.schema.metrics[0].id,'custom_rpe');
assert.equal(rpe.schema.metrics[0].type,'number');
assert.equal(rpe.schema.metrics[0].extensions.legacy818.custom,true);
assert.equal(rpe.surface.kind,'fields');

assert.equal(adapt818ObjectMetricSchema({id:'legacy-no-explicit'}),null);
assert.throws(()=>adapt818ObjectMetricSchema({id:'bad',metricSchema:[{key:'custom_note',type:'text'}]}),/unsupported 8.18 type/);

console.log('[AXIS Universal Practice Object contract] PASS · 8.18 schema compatibility → axis.metric-schema.v1 · structural sets remain v61-owned · pace semantics normalized · no storage rewrite');
