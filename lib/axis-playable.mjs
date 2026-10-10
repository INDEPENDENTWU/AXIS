import {normalizeFlow,resolveFlowStep,EXECUTION_MODES} from './axis-flow.mjs';

export const PLAYABLE_SPEC_SCHEMA='axis.playable.v1';
export const PLAYABLE_COMPILER_VERSION='8.31a';
const modes=new Set(EXECUTION_MODES);
const fail=message=>{throw new Error('[AXIS playable] '+message)};
const id=(value,label)=>{if(typeof value!=='string'||!value.trim()||value.length>128||/[\u0000-\u001f\u007f]/.test(value))fail(label+' must be a non-empty bounded stable ID');return value};
const text=(value,label)=>{if(typeof value!=='string'||value.length>120||/[\u0000-\u001f\u007f<>]/.test(value))fail(label+' has unsupported characters or length');return value};
const shape=(value,label)=>{if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)fail(label+' must be a plain object');return value};
const only=(value,keys,label)=>{for(const key of Object.keys(value)){if(!keys.includes(key))fail(label+' has unsupported field '+key)}};
function jsonCopy(input,depth=0){
 if(depth>12)fail('nested input exceeds portable depth');
 if(input===null||typeof input==='string'||typeof input==='boolean')return input;
 if(typeof input==='number'){if(!Number.isFinite(input))fail('non-finite number');return input}
 if(Array.isArray(input)){if(input.length>128)fail('unbounded array');return input.map(value=>jsonCopy(value,depth+1))}
 shape(input,'portable JSON');
 const entries=Object.entries(input);
 if(entries.length>40)fail('unbounded object');
 const out={};
 for(const [key,value] of entries){if(['__proto__','prototype','constructor'].includes(key))fail('prototype mutation key');if(key.length>128)fail('unbounded property key');out[key]=jsonCopy(value,depth+1)}
 return out;
}
function canonicalObjects(collection){
 const map=new Map();
 const add=(key,object)=>{
  shape(object,'Object');
  const stable=id(object.id??object.equipmentId,'canonical Object ID');
  if(stable!==key)fail('Object map key is not exact canonical ID '+stable);
  if(map.has(stable))fail('duplicate canonical Object ID '+stable);
  map.set(stable,object);
 };
 if(collection instanceof Map){for(const [key,value] of collection)add(id(key,'Object map key'),value)}
 else if(Array.isArray(collection)){if(collection.length>256)fail('unbounded Object catalog');for(const object of collection){shape(object,'Object');add(id(object.id??object.equipmentId,'Object ID'),object)}}
 else if(collection&&Object.getPrototypeOf(collection)===Object.prototype){for(const [key,value] of Object.entries(collection))add(id(key,'Object map key'),value)}
 else fail('Objects must be a Map, list, or ID-keyed object');
 return map;
}
function freezeDeep(value){if(value&&typeof value==='object'){for(const entry of Object.values(value))freezeDeep(entry);Object.freeze(value)}return value}

/** Compiles *intent* only: it never starts Active, writes Encounter, or persists an attempt. */
export function compilePlayableSpec({playableId,source,objects,heading}={}){
 const stableId=id(playableId,'playableId');
 shape(source,'source');only(source,['kind','objectId','flow'],'source');
 if(source.kind!=='object'&&source.kind!=='flow')fail('source kind must be object or flow');
 if(heading!==undefined)text(heading,'heading');
 const available=canonicalObjects(objects);
 let flow,sourceRef;
 if(source.kind==='object'){
  if(Object.hasOwn(source,'flow'))fail('Object source cannot carry Flow');
  sourceRef=id(source.objectId,'source.objectId');
  if(!available.has(sourceRef))fail('Object '+sourceRef+' not found');
  flow={schema:'axis.flow.v1',id:'playable:'+stableId,steps:[{id:'object',objectRef:sourceRef}]};
 }else{
  if(Object.hasOwn(source,'objectId'))fail('Flow source cannot carry objectId');
  shape(source.flow,'source.flow');
  if(JSON.stringify(source.flow).length>16384)fail('Flow payload exceeds input budget');
  const raw=jsonCopy(source.flow);
  flow=normalizeFlow(raw);
  sourceRef=id(flow.id,'source Flow id');
 }
 if(!Array.isArray(flow.steps)||flow.steps.length===0||flow.steps.length>32)fail('step count must be 1..32');
 const seen=new Set();
 const steps=flow.steps.map((step,index)=>{
  const stepId=id(step.id,'step ID');
  if(seen.has(stepId))fail('duplicate step ID '+stepId);
  seen.add(stepId);
  const objectRef=id(step.objectRef,'step Object reference');
  if(!available.has(objectRef))fail('Object '+objectRef+' not found');
  const resolved=resolveFlowStep({flow,stepRef:stepId,objects:available});
  if(resolved.objectRef!==objectRef)fail('resolved identity mismatch');
  if(!modes.has(resolved.effectiveExecutionMode))fail('unsupported execution mode');
  const repeat=resolved.repeat;
  if(!Number.isInteger(repeat)||repeat<1||repeat>99)fail('repeat out of bounds');
  const schema=jsonCopy(resolved.effectiveMetricSchema);
  if(schema?.schema!=='axis.metric-schema.v1'||!Array.isArray(schema.metrics)||schema.metrics.length===0)fail('invalid resolved metric snapshot');
  const metrics=new Set();
  for(const metric of schema.metrics){const metricId=id(metric.id,'metric ID');if(metrics.has(metricId))fail('duplicate metric '+metricId);metrics.add(metricId)}
  return {id:stepId,objectRef,executionMode:resolved.effectiveExecutionMode,metricSchemaSnapshot:schema,repeat,source:{metricSchema:resolved.overrideProvenance.metricSchema,executionMode:resolved.overrideProvenance.executionMode}};
 });
 const result={schema:PLAYABLE_SPEC_SCHEMA,id:stableId,compilerVersion:PLAYABLE_COMPILER_VERSION,source:{kind:source.kind,ref:sourceRef},steps};
 if(heading!==undefined)result.heading=heading;
 if(JSON.stringify(result).length>32768)fail('compiled spec exceeds budget');
 return freezeDeep(result);
}

export function assertPlayableSpec(spec){
 const raw=jsonCopy(spec);
 shape(raw,'PlayableSpec');
 only(raw,['schema','id','compilerVersion','source','steps','heading'],'PlayableSpec');
 if(raw.schema!==PLAYABLE_SPEC_SCHEMA)fail('unsupported PlayableSpec schema');
 id(raw.id,'playable ID');
 if(raw.compilerVersion!==PLAYABLE_COMPILER_VERSION)fail('unsupported compiler version');
 if(raw.heading!==undefined)text(raw.heading,'heading');
 shape(raw.source,'PlayableSpec source');only(raw.source,['kind','ref'],'PlayableSpec source');
 if(!['object','flow'].includes(raw.source.kind))fail('unsupported source kind');
 id(raw.source.ref,'source reference');
 if(!Array.isArray(raw.steps)||raw.steps.length<1||raw.steps.length>32)fail('steps out of bounds');
 const ids=new Set();
 for(const step of raw.steps){
  shape(step,'PlayableSpec step');only(step,['id','objectRef','executionMode','metricSchemaSnapshot','repeat','source'],'step');
  const sid=id(step.id,'step ID');if(ids.has(sid))fail('duplicate step ID');ids.add(sid);
  id(step.objectRef,'step objectRef');
  if(!modes.has(step.executionMode))fail('unsupported execution mode');
  if(!Number.isInteger(step.repeat)||step.repeat<1||step.repeat>99)fail('invalid repeat');
  shape(step.metricSchemaSnapshot,'metric schema');
  if(step.metricSchemaSnapshot.schema!=='axis.metric-schema.v1'||!Array.isArray(step.metricSchemaSnapshot.metrics)||step.metricSchemaSnapshot.metrics.length<1)fail('metric schema missing');
  shape(step.source,'step source');
  only(step.source,['metricSchema','executionMode'],'step source');
  if(typeof step.source.metricSchema!=='string'||typeof step.source.executionMode!=='string')fail('missing derivation provenance');
 }
 if(raw.source.kind==='object'&&(raw.steps.length!==1||raw.steps[0].objectRef!==raw.source.ref))fail('Object source identity drift');
 if(JSON.stringify(raw).length>32768)fail('spec exceeds budget');
 return freezeDeep(raw);
}
