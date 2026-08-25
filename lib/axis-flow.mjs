import {normalizeMetricSchema,resolveMetricSchema} from './axis-metric-schema.mjs';

export const FLOW_SCHEMA_ID='axis.flow.v1';
export const FLOW_PROVENANCE_ID='axis.flow-provenance.v1';
export const FLOW_RESOLVER_VERSION='8.21';
export const EXECUTION_MODES=Object.freeze(['single','sets','rounds','timed','hold','complete']);

const MODE_SET=new Set(EXECUTION_MODES);
const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const fail=message=>{throw new Error(`[AXIS flow] ${message}`)};
const text=value=>String(value??'').trim();

function explicitMetricInput(object){
  if(!object||typeof object!=='object')return null;
  for(const candidate of [object.metricSchema,object.recording?.metricSchema,object.metrics]){
    if(Array.isArray(candidate)&&candidate.length)return {metrics:candidate};
    if(candidate&&typeof candidate==='object'&&Array.isArray(candidate.metrics)&&candidate.metrics.length)return candidate;
  }
  return null;
}

function normalizeMetricOverride(raw,objectRef,stepRef){
  if(raw==null)return null;
  const input=Array.isArray(raw)?{metrics:raw}:clone(raw);
  if(!input||typeof input!=='object'||!Array.isArray(input.metrics)||!input.metrics.length)fail(`step ${stepRef} metricOverride requires metrics`);
  if(input.objectId!=null&&text(input.objectId)!==objectRef)fail(`step ${stepRef} metricOverride objectId must match ${objectRef}`);
  return normalizeMetricSchema({...input,objectId:objectRef,source:`flow:${stepRef}`},{objectId:objectRef,source:`flow:${stepRef}`});
}

function normalizeExecutionMode(value,label){
  if(value==null||value==='')return null;
  const mode=text(value);
  if(!MODE_SET.has(mode))fail(`${label} has invalid execution mode ${mode}`);
  return mode;
}

function normalizeStep(raw,index){
  if(!raw||typeof raw!=='object'||Array.isArray(raw))fail(`step ${index} must be an object`);
  const id=text(raw.id);
  const objectRef=text(raw.objectRef);
  if(!id)fail(`step ${index} id is required`);
  if(!objectRef)fail(`step ${id} objectRef is required`);
  const out={id,objectRef};
  const metricOverride=normalizeMetricOverride(raw.metricOverride,objectRef,id);
  if(metricOverride)out.metricOverride=metricOverride;
  const executionOverride=normalizeExecutionMode(raw.executionOverride,`step ${id}`);
  if(executionOverride)out.executionOverride=executionOverride;
  if(raw.repeat!=null){
    const repeat=Number(raw.repeat);
    if(!Number.isInteger(repeat)||repeat<1||repeat>99)fail(`step ${id} repeat must be an integer from 1 to 99`);
    out.repeat=repeat;
  }
  if(raw.note!=null)out.note=String(raw.note);
  return out;
}

export function normalizeFlow(input={}){
  if(!input||typeof input!=='object'||Array.isArray(input))fail('Flow must be an object');
  if(input.schema!=null&&input.schema!==FLOW_SCHEMA_ID)fail(`unsupported Flow schema ${input.schema}`);
  const id=text(input.id);
  if(!id)fail('Flow id is required');
  if(!Array.isArray(input.steps)||!input.steps.length)fail('Flow requires at least one step');
  const steps=input.steps.map(normalizeStep);
  const seen=new Set();
  for(const step of steps){
    if(seen.has(step.id))fail(`duplicate Flow step id ${step.id}`);
    seen.add(step.id);
  }
  const out={schema:FLOW_SCHEMA_ID,id,steps};
  if(input.title!=null)out.title=String(input.title);
  if(input.metadata&&typeof input.metadata==='object'&&!Array.isArray(input.metadata))out.metadata=clone(input.metadata);
  return out;
}

function objectFromCollection(objects,objectRef){
  if(objects instanceof Map)return objects.get(objectRef)||null;
  if(Array.isArray(objects))return objects.find(object=>text(object?.id??object?.equipmentId)===objectRef)||null;
  if(objects&&typeof objects==='object')return objects[objectRef]||null;
  return null;
}

function objectExecutionMode(object){
  const candidate=object?.executionMode??object?.recording?.executionMode;
  return normalizeExecutionMode(candidate,`Object ${text(object?.id??object?.equipmentId)||'(unknown)'}`);
}

export function deriveExecutionMode(metricSchema){
  const metrics=Array.isArray(metricSchema?.metrics)?metricSchema.metrics:[];
  const ids=new Set(metrics.map(metric=>text(metric?.id)).filter(Boolean));
  if(ids.has('hold'))return 'hold';
  if(ids.has('weight')&&ids.has('reps'))return 'sets';
  if(ids.has('rounds'))return 'rounds';
  if(ids.has('duration'))return 'timed';
  if(ids.has('completed')&&ids.size===1)return 'complete';
  return 'single';
}

function resolveMetricForStep(step,object,globalDefaults){
  if(step.metricOverride)return {schema:clone(step.metricOverride),source:'flow-step-override'};
  if(explicitMetricInput(object))return {schema:resolveMetricSchema(object),source:'object'};
  if(globalDefaults?.metricSchema){
    const raw=Array.isArray(globalDefaults.metricSchema)?{metrics:globalDefaults.metricSchema}:clone(globalDefaults.metricSchema);
    if(raw?.objectId!=null&&text(raw.objectId)!==step.objectRef)fail(`global metric default objectId must match ${step.objectRef}`);
    return {schema:normalizeMetricSchema({...raw,objectId:step.objectRef,source:'global-default'},{objectId:step.objectRef,source:'global-default'}),source:'global-default'};
  }
  return {schema:resolveMetricSchema(object),source:'legacy-compatibility'};
}

function resolveExecutionForStep(step,object,effectiveMetric,globalDefaults){
  if(step.executionOverride)return {mode:step.executionOverride,source:'flow-step-override'};
  const explicitObjectMode=objectExecutionMode(object);
  if(explicitObjectMode)return {mode:explicitObjectMode,source:'object'};
  if(explicitMetricInput(object))return {mode:deriveExecutionMode(resolveMetricSchema(object)),source:'object'};
  if(step.metricOverride)return {mode:deriveExecutionMode(effectiveMetric),source:'flow-step-override'};
  const globalMode=normalizeExecutionMode(globalDefaults?.executionMode,'global execution default');
  if(globalMode)return {mode:globalMode,source:'global-default'};
  return {mode:deriveExecutionMode(effectiveMetric),source:'legacy-compatibility'};
}

function findStep(flow,stepRef,stepIndex){
  if(stepRef!=null){
    const id=text(stepRef),index=flow.steps.findIndex(step=>step.id===id);
    if(index<0)fail(`Flow step ${id} not found`);
    return {step:flow.steps[index],index};
  }
  const index=stepIndex==null?0:Number(stepIndex);
  if(!Number.isInteger(index)||index<0||index>=flow.steps.length)fail(`Flow step index ${stepIndex} is invalid`);
  return {step:flow.steps[index],index};
}

export function resolveFlowStep({flow,stepRef=null,stepIndex=null,objects=[],globalDefaults={}}={}){
  const normalizedFlow=normalizeFlow(flow);
  const {step,index}=findStep(normalizedFlow,stepRef,stepIndex);
  const object=objectFromCollection(objects,step.objectRef);
  if(!object)fail(`Object ${step.objectRef} referenced by step ${step.id} was not found`);
  const objectIdentity=text(object.id??object.equipmentId);
  if(objectIdentity!==step.objectRef)fail(`Object identity ${objectIdentity||'(missing)'} does not match ${step.objectRef}`);

  const metric=resolveMetricForStep(step,object,globalDefaults);
  const execution=resolveExecutionForStep(step,object,metric.schema,globalDefaults);
  const next=normalizedFlow.steps[index+1]||null;

  return {
    schema:'axis.resolved-flow-step.v1',
    resolverVersion:FLOW_RESOLVER_VERSION,
    flowRef:normalizedFlow.id,
    stepRef:step.id,
    objectRef:step.objectRef,
    effectiveMetricSchema:clone(metric.schema),
    effectiveExecutionMode:execution.mode,
    repeat:step.repeat??1,
    overrideProvenance:{
      metricSchema:metric.source,
      executionMode:execution.source,
      temporary:metric.source==='flow-step-override'||execution.source==='flow-step-override'
    },
    nextIntent:next?{stepRef:next.id,objectRef:next.objectRef}:null
  };
}

export function createFlowEncounterProvenance(resolvedStep){
  if(!resolvedStep||typeof resolvedStep!=='object'||Array.isArray(resolvedStep))fail('resolved Flow step is required');
  if(resolvedStep.schema!=='axis.resolved-flow-step.v1')fail(`unsupported resolved step schema ${resolvedStep.schema}`);
  const flowRef=text(resolvedStep.flowRef),flowStepRef=text(resolvedStep.stepRef),objectRef=text(resolvedStep.objectRef);
  if(!flowRef||!flowStepRef||!objectRef)fail('resolved Flow identity is incomplete');
  const executionMode=normalizeExecutionMode(resolvedStep.effectiveExecutionMode,'resolved Flow step');
  const metrics=Array.isArray(resolvedStep.effectiveMetricSchema?.metrics)?resolvedStep.effectiveMetricSchema.metrics:[];
  const effectiveMetricIds=metrics.map(metric=>text(metric?.id)).filter(Boolean);
  if(!effectiveMetricIds.length)fail('resolved Flow step has no effective metrics');
  const repeat=Number(resolvedStep.repeat??1);
  if(!Number.isInteger(repeat)||repeat<1)fail('resolved Flow step repeat is invalid');
  const provenance=resolvedStep.overrideProvenance&&typeof resolvedStep.overrideProvenance==='object'?clone(resolvedStep.overrideProvenance):{};
  if(!text(provenance.metricSchema)||!text(provenance.executionMode))fail('resolved Flow step provenance is incomplete');
  provenance.temporary=provenance.temporary===true;
  return {
    schema:FLOW_PROVENANCE_ID,
    flowRef,
    flowStepRef,
    objectRef,
    stepSnapshot:{
      repeat,
      effectiveMetricIds:[...effectiveMetricIds],
      effectiveExecutionMode:executionMode,
      overrideProvenance:provenance
    }
  };
}
