import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  FLOW_SCHEMA_ID,
  FLOW_RESOLVER_VERSION,
  EXECUTION_MODES,
  normalizeFlow,
  deriveExecutionMode,
  resolveFlowStep
} from '../lib/axis-flow.mjs';

const readJson=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const ROOT=process.cwd();
const source=fs.readFileSync(path.join(ROOT,'lib/axis-flow.mjs'),'utf8');

for(const forbidden of ['localStorage','indexedDB','document.','window.','fetch(','XMLHttpRequest','sessionStorage']){
  assert.equal(source.includes(forbidden),false,`pure Flow resolver gained side effect ${forbidden}`);
}
assert.equal(source.includes("from './axis-metric-schema.mjs'"),true,'Flow resolver must reuse canonical Metric Schema semantics');
assert.equal(new Set(EXECUTION_MODES).size,6,'execution mode set drift');
assert.equal(FLOW_RESOLVER_VERSION,'8.21');

const flowSchema=readJson(path.join(ROOT,'shared/contracts/axis-flow-v1.schema.json'));
const manifest=readJson(path.join(ROOT,'shared/contracts/axis-contract-manifest.json'));
assert.equal(flowSchema.$id,FLOW_SCHEMA_ID);
assert.equal(flowSchema.properties?.schema?.const,FLOW_SCHEMA_ID);
assert.deepEqual(flowSchema.$defs?.step?.properties?.executionOverride?.enum,EXECUTION_MODES);
assert.equal(flowSchema.$defs?.step?.properties?.metricOverride?.properties?.metrics?.items?.oneOf?.[1]?.$ref,'./axis-metric-schema-v1.schema.json#/$defs/metric');
assert.equal(manifest.flow,FLOW_SCHEMA_ID);
for(const key of ['flowIntentNotHistory','flowOverrideNoObjectMutation','flowResolverPure','flowNoSecondTrainingStore'])assert.equal(manifest.invariants?.[key],true,`manifest Flow invariant ${key}`);

const fixtureDir=path.join(ROOT,'shared/fixtures/flow');
const files=fs.readdirSync(fixtureDir).filter(file=>file.endsWith('.json')).sort();
assert.ok(files.length>=2,'Flow fixture coverage missing');
let resolvedCount=0;
for(const file of files){
  const fixture=readJson(path.join(fixtureDir,file));
  assert.equal(fixture.schema,'axis.flow-fixture.v1',`${file} fixture schema`);
  assert.equal(fixture.contract,FLOW_SCHEMA_ID,`${file} Flow contract`);
  const flowBefore=JSON.stringify(fixture.flow),objectsBefore=JSON.stringify(fixture.objects);
  const normalized=normalizeFlow(fixture.flow);
  assert.equal(normalized.schema,FLOW_SCHEMA_ID,`${file} normalized Flow schema`);
  assert.equal(new Set(normalized.steps.map(step=>step.id)).size,normalized.steps.length,`${file} duplicate normalized step id`);

  for(const expected of fixture.expected||[]){
    const resolved=resolveFlowStep({flow:fixture.flow,stepRef:expected.stepRef,objects:fixture.objects});
    assert.equal(resolved.schema,'axis.resolved-flow-step.v1',`${file}/${expected.stepRef} resolved schema`);
    assert.equal(resolved.flowRef,fixture.flow.id,`${file}/${expected.stepRef} flowRef`);
    assert.equal(resolved.stepRef,expected.stepRef,`${file}/${expected.stepRef} stepRef`);
    assert.deepEqual(resolved.effectiveMetricSchema.metrics.map(metric=>metric.id),expected.metricIds,`${file}/${expected.stepRef} metric ids`);
    assert.equal(resolved.effectiveMetricSchema.objectId,resolved.objectRef,`${file}/${expected.stepRef} metric object identity`);
    assert.equal(resolved.effectiveExecutionMode,expected.executionMode,`${file}/${expected.stepRef} execution mode`);
    assert.equal(resolved.overrideProvenance.metricSchema,expected.metricSource,`${file}/${expected.stepRef} metric provenance`);
    assert.equal(resolved.overrideProvenance.executionMode,expected.executionSource,`${file}/${expected.stepRef} execution provenance`);
    assert.equal(resolved.nextIntent?.stepRef??null,expected.nextStepRef,`${file}/${expected.stepRef} next intent`);
    resolvedCount++;
  }
  assert.equal(JSON.stringify(fixture.flow),flowBefore,`${file} resolver mutated Flow input`);
  assert.equal(JSON.stringify(fixture.objects),objectsBefore,`${file} resolver mutated Object input`);
}
assert.ok(resolvedCount>=4,'Flow fixtures did not resolve enough heterogeneous steps');

// Object-specific executable truth must beat global fallbacks.
{
  const flow={schema:FLOW_SCHEMA_ID,id:'precedence-object',steps:[{id:'a',objectRef:'duration-object'}]};
  const objects=[{id:'duration-object',metricSchema:{metrics:['duration','intensity']}}];
  const resolved=resolveFlowStep({flow,objects,globalDefaults:{metricSchema:{metrics:['pace']},executionMode:'complete'}});
  assert.deepEqual(resolved.effectiveMetricSchema.metrics.map(metric=>metric.id),['duration','intensity']);
  assert.equal(resolved.effectiveExecutionMode,'timed');
  assert.deepEqual(resolved.overrideProvenance,{metricSchema:'object',executionMode:'object',temporary:false});
}

// A temporary Flow override beats Object defaults but remains detached from the Object.
{
  const flow={schema:FLOW_SCHEMA_ID,id:'precedence-flow',steps:[{id:'a',objectRef:'duration-object',metricOverride:{metrics:['completed']},executionOverride:'complete'}]};
  const object={id:'duration-object',executionMode:'timed',metricSchema:{metrics:['duration','intensity']}};
  const before=JSON.stringify(object);
  const resolved=resolveFlowStep({flow,objects:[object],globalDefaults:{executionMode:'sets'}});
  assert.deepEqual(resolved.effectiveMetricSchema.metrics.map(metric=>metric.id),['completed']);
  assert.equal(resolved.effectiveExecutionMode,'complete');
  assert.equal(resolved.overrideProvenance.temporary,true);
  resolved.effectiveMetricSchema.metrics[0].label='mutated resolved copy';
  assert.equal(JSON.stringify(object),before,'mutating resolved output leaked into Object defaults');
}

// Metric-only Flow override may derive execution when the Object has no current executable truth.
{
  const holdMetric={id:'hold',type:'duration',label:'保持',unit:'s',priority:'primary',repeatability:'single',aggregation:'sum',presentation:'timer',required:false,min:0,step:1};
  const flow={schema:FLOW_SCHEMA_ID,id:'metric-only-flow',steps:[{id:'a',objectRef:'legacy-object',metricOverride:{metrics:[holdMetric]}}]};
  const resolved=resolveFlowStep({flow,objects:[{id:'legacy-object'}],globalDefaults:{executionMode:'complete'}});
  assert.equal(resolved.effectiveExecutionMode,'hold');
  assert.equal(resolved.overrideProvenance.metricSchema,'flow-step-override');
  assert.equal(resolved.overrideProvenance.executionMode,'flow-step-override');
}

// Global defaults apply only when neither the Flow step nor Object supplies current truth.
{
  const flow={schema:FLOW_SCHEMA_ID,id:'global-fallback',steps:[{id:'a',objectRef:'legacy-object'}]};
  const resolved=resolveFlowStep({flow,objects:[{id:'legacy-object'}],globalDefaults:{metricSchema:{metrics:['pace']},executionMode:'single'}});
  assert.deepEqual(resolved.effectiveMetricSchema.metrics.map(metric=>metric.id),['pace']);
  assert.equal(resolved.effectiveExecutionMode,'single');
  assert.deepEqual(resolved.overrideProvenance,{metricSchema:'global-default',executionMode:'global-default',temporary:false});
}

assert.equal(deriveExecutionMode({metrics:[{id:'weight'},{id:'reps'}]}),'sets');
assert.equal(deriveExecutionMode({metrics:[{id:'duration'}]}),'timed');
assert.equal(deriveExecutionMode({metrics:[{id:'hold'}]}),'hold');
assert.equal(deriveExecutionMode({metrics:[{id:'completed'}]}),'complete');
assert.equal(deriveExecutionMode({metrics:[{id:'pace'}]}),'single');

assert.throws(()=>normalizeFlow({schema:FLOW_SCHEMA_ID,id:'bad',steps:[{id:'a',objectRef:'x'},{id:'a',objectRef:'y'}]}),/duplicate Flow step id/);
assert.throws(()=>normalizeFlow({schema:FLOW_SCHEMA_ID,id:'bad',steps:[{id:'a',objectRef:'x',executionOverride:'loop'}]}),/invalid execution mode/);
assert.throws(()=>resolveFlowStep({flow:{schema:FLOW_SCHEMA_ID,id:'bad',steps:[{id:'a',objectRef:'missing'}]},objects:[]}),/was not found/);
assert.throws(()=>normalizeFlow({schema:'axis.flow.v2',id:'bad',steps:[{id:'a',objectRef:'x'}]}),/unsupported Flow schema/);

console.log(`[AXIS 8.21 Flow contract] PASS · ${files.length} portable fixtures · ${resolvedCount} resolved steps · Flow override > Object truth > global fallback > legacy compatibility · pure/no-store resolver`);
