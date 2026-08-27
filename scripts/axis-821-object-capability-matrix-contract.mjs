import assert from 'node:assert/strict';
import {
  AXIS_OBJECT_CAPABILITIES_ID,EXECUTION_MODES,METRIC_CAPABILITIES,METRIC_GROUPS,CUSTOM_METRIC_TYPES,
  metricCapability,metricDefinitionForRuntime,customMetricDefinition,resolveExecutionMode,
  normalizeMetricValue,formatMetricValue,capabilityMatrix
} from '../lib/axis-object-capabilities.mjs';
import {
  builtinMetric,normalizeMetricSchema,resolveMetricSchema,resolveRecordingSurface,createEncounterMetricEnvelope
} from '../lib/axis-metric-schema.mjs';

const BUILTINS=['weight','reps','sets','duration','hold','distance','pace','speed','intensity','resistance','level','incline','rating','completed'];
const VALID_MODES=new Set(EXECUTION_MODES.filter(x=>x!=='auto'));
const VALID_TYPES=new Set(['number','count','duration','distance','pace','percentage','rating','boolean','choice']);
const VALID_PRESENTATIONS=new Set(['auto','stepper','timer','distance','pace','percentage','rating','toggle','choice']);

const matrix=capabilityMatrix();
assert.equal(matrix.schema,AXIS_OBJECT_CAPABILITIES_ID);
assert.equal(matrix.metricCount,14);
assert.deepEqual(matrix.metricIds,BUILTINS);
assert.equal(new Set(METRIC_GROUPS.flatMap(g=>g.metricIds)).size,14,'metric groups must cover every built-in exactly once');
assert.deepEqual(new Set(METRIC_GROUPS.flatMap(g=>g.metricIds)),new Set(BUILTINS));
assert.deepEqual(Object.keys(CUSTOM_METRIC_TYPES),['number','count','duration','distance','pace','percentage','rating','boolean','choice']);

for(const id of BUILTINS){
  const cap=metricCapability(id),runtime=metricDefinitionForRuntime(id),portable=builtinMetric(id);
  assert.ok(cap,`missing capability ${id}`);assert.ok(runtime,`missing runtime definition ${id}`);assert.ok(portable,`missing portable built-in ${id}`);
  assert.equal(cap.id,id);assert.equal(runtime.key,id);assert.equal(portable.id,id);
  assert.ok(cap.label);assert.ok(VALID_TYPES.has(cap.type),`${id} invalid type ${cap.type}`);assert.ok(VALID_PRESENTATIONS.has(cap.presentation),`${id} invalid presentation ${cap.presentation}`);
  assert.equal(portable.type,cap.type,`${id} portable type drift`);assert.equal(portable.presentation,cap.presentation,`${id} portable presentation drift`);
  assert.equal(portable.unit,cap.unit,`${id} portable unit drift`);
  assert.equal(portable.repeatability,cap.repeatability,`${id} repeatability drift`);assert.equal(portable.aggregation,cap.aggregation,`${id} aggregation drift`);
  if(cap.step!=null)assert.equal(portable.step,cap.step,`${id} step drift`);
  if(cap.min!=null)assert.equal(portable.min,cap.min,`${id} min drift`);
  if(cap.max!=null)assert.equal(portable.max,cap.max,`${id} max drift`);
}

const allSchema=normalizeMetricSchema({objectId:'all-builtins',metrics:BUILTINS});
assert.equal(allSchema.metrics.length,14);assert.deepEqual(allSchema.metrics.map(x=>x.id),BUILTINS);
const empty=resolveMetricSchema({id:'empty',metricSchema:[]});assert.deepEqual(empty.metrics,[]);assert.equal(resolveExecutionMode(empty.metrics),'single');

const inferredCases=[
  [[], 'single'],
  [['weight'],'single'],[['reps'],'sets'],[['sets'],'sets'],[['weight','reps'],'sets'],
  [['duration'],'timed'],[['distance'],'timed'],[['pace'],'timed'],[['speed'],'timed'],
  [['intensity'],'timed'],[['resistance'],'timed'],[['level'],'timed'],[['incline'],'timed'],
  [['hold'],'hold'],[['rating'],'single'],[['completed'],'complete'],
  [['completed','speed'],'timed'],[['rating','speed'],'timed'],[['hold','speed'],'hold'],
  [['hold','sets'],'sets'],[['hold','reps'],'sets'],[['sets','speed'],'sets']
];
for(const [ids,expected] of inferredCases){
  const metrics=ids.map(metricCapability);assert.equal(resolveExecutionMode(metrics),expected,`${ids.join('+')||'empty'} inference`);
}
for(const mode of EXECUTION_MODES.filter(x=>x!=='auto'))for(const ids of [[],['speed'],['sets'],['hold'],['completed']])assert.equal(resolveExecutionMode(ids.map(metricCapability),mode),mode,`manual ${mode} override`);

/* Exhaustive built-in property-selection coverage: 2^14 = 16,384 schemas. */
let subsets=0;
for(let mask=0;mask<(1<<BUILTINS.length);mask++){
  const ids=[];for(let i=0;i<BUILTINS.length;i++)if(mask&(1<<i))ids.push(BUILTINS[i]);
  const metrics=ids.map(metricCapability),a=resolveExecutionMode(metrics),b=resolveExecutionMode(metrics);
  assert.ok(VALID_MODES.has(a),`unknown execution mode ${a} for ${ids.join('+')}`);assert.equal(a,b,`non-deterministic execution mode for ${ids.join('+')}`);
  const normalized=normalizeMetricSchema({objectId:`combo-${mask}`,metrics:ids});assert.equal(normalized.metrics.length,ids.length);
  resolveRecordingSurface(normalized);subsets++;
}
assert.equal(subsets,16384);

const customSamples={
  number:{value:12.5,expected:12.5,mode:'single'},count:{value:4,expected:4,mode:'single'},duration:{value:18,expected:18,mode:'timed'},
  distance:{value:3.2,expected:3.2,mode:'timed'},pace:{value:'5:40',expected:'5:40',mode:'timed'},percentage:{value:8.5,expected:8.5,mode:'single'},
  rating:{value:7,expected:7,mode:'single'},boolean:{value:true,expected:true,mode:'complete'},choice:{value:'medium',expected:'medium',mode:'single'}
};
let customIndex=0;
for(const [type,sample] of Object.entries(customSamples)){
  const metric=customMetricDefinition({id:`custom_${type}_${customIndex++}`,label:`自定义${type}`,type,unit:type==='number'?'kg':'',options:type==='choice'?['low','medium','high']:null});
  assert.equal(metric.type,type);assert.equal(resolveExecutionMode([metric]),sample.mode,`custom ${type} execution`);
  assert.deepEqual(normalizeMetricValue(metric,sample.value),sample.expected,`custom ${type} value normalization`);
  const shown=formatMetricValue(metric,sample.value);assert.ok(shown&&!/undefined|NaN/i.test(shown),`custom ${type} visible formatting`);
  const schema=normalizeMetricSchema({objectId:`custom-object-${type}`,metrics:[metric]});assert.equal(schema.metrics[0].type,type);
}

assert.equal(normalizeMetricValue(metricCapability('rating'),99),10);assert.equal(normalizeMetricValue(metricCapability('incline'),-3),0);
assert.equal(normalizeMetricValue(metricCapability('completed'),'false'),false);assert.equal(formatMetricValue(metricCapability('completed'),true),'是');
assert.equal(normalizeMetricValue(metricCapability('pace'),'5:40 / km'),'5:40');assert.equal(formatMetricValue(metricCapability('pace'),'5:40 / km'),'5:40 min/km');

const paceEnvelope=createEncounterMetricEnvelope({object:{id:'pace-object',metricSchema:['pace']},event:{id:'E-pace',equipmentId:'pace-object',time:1,metrics:{pace:'5:40'}}});
assert.equal(paceEnvelope.values.pace,'5:40','pace fact must survive portable Encounter envelope');
const emptyEnvelope=createEncounterMetricEnvelope({object:{id:'zero-object',metricSchema:[]},event:{id:'E-zero',equipmentId:'zero-object',time:1}});
assert.deepEqual(emptyEnvelope.values,{});assert.deepEqual(emptyEnvelope.entries,[]);assert.deepEqual(emptyEnvelope.metricSchema.metrics,[]);

const choiceMetric=customMetricDefinition({id:'surface',label:'地面',type:'choice',options:[{value:'road',label:'公路'},{value:'trail',label:'越野'}]});
const choiceEnvelope=createEncounterMetricEnvelope({object:{id:'choice-object',metricSchema:[choiceMetric]},event:{id:'E-choice',equipmentId:'choice-object',time:1,metrics:{surface:'trail'}}});
assert.equal(choiceEnvelope.values.surface,'trail');assert.equal(formatMetricValue(choiceMetric,choiceEnvelope.values.surface),'越野');
assert.equal(normalizeMetricValue(choiceMetric,'unknown'),null,'invalid choice must not become fact');

for(const bad of [undefined,NaN,'NaN']){
  const text=formatMetricValue(metricCapability('speed'),bad);assert.equal(text,'');
}

console.log(`[AXIS 8.21 Object capability matrix] PASS · ${BUILTINS.length} built-ins · ${Object.keys(CUSTOM_METRIC_TYPES).length} custom types · ${subsets.toLocaleString('en-US')} built-in property combinations · deterministic execution · portable pace/choice/empty facts`);
