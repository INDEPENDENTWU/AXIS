import {builtinMetric,normalizeMetricSchema,resolveRecordingSurface} from './axis-metric-schema.mjs';

export const AXIS_818_METRIC_SCHEMA_VERSION='8.18';
export const AXIS_819_METRIC_CONTRACT='axis.metric-schema.v1';

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const fail=message=>{throw new Error(`[AXIS 8.18 metric adapter] ${message}`)};

function legacyDefinition(raw,index){
 if(!raw||typeof raw!=='object'||Array.isArray(raw))fail(`metric ${index} must be an object`);
 const id=String(raw.id??raw.key??'').trim();
 if(!id)fail(`metric ${index} has no key`);
 const base=builtinMetric(id);
 if(base){
  return {
   ...base,
   id,
   label:String(raw.label??base.label??id),
   step:Number.isFinite(Number(raw.step))&&Number(raw.step)>0?Number(raw.step):base.step,
   extensions:{
    ...(base.extensions||{}),
    legacy818:{key:id,type:String(raw.type??''),unit:String(raw.unit??''),custom:raw.custom===true}
   }
  };
 }
 const legacyType=String(raw.type??'number');
 if(!['number','duration'].includes(legacyType))fail(`custom metric ${id} uses unsupported 8.18 type ${legacyType}`);
 return {
  id,
  type:legacyType,
  label:String(raw.label??id),
  unit:String(raw.unit??''),
  priority:'secondary',
  repeatability:'single',
  aggregation:legacyType==='duration'?'sum':'last',
  presentation:legacyType==='duration'?'timer':'stepper',
  step:Number.isFinite(Number(raw.step))&&Number(raw.step)>0?Number(raw.step):1,
  extensions:{legacy818:{key:id,type:legacyType,unit:String(raw.unit??''),custom:raw.custom===true}}
 };
}

/**
 * Read-only compatibility projection from the already-shipped 8.18 custom
 * Object format into axis.metric-schema.v1. Nothing is rewritten in storage.
 * `sets` is structural when paired with weight + reps because v61 owns the
 * authoritative repeated set facts; treating it as a third metric would create
 * a second strength writer.
 */
export function adapt818ObjectMetricSchema(object={}){
 const objectId=String(object.id??object.equipmentId??'').trim();
 if(!objectId)fail('object identity is required');
 const raw=Array.isArray(object.metricSchema)?clone(object.metricSchema):[];
 if(!raw.length)return null;
 const ids=raw.map(metric=>String(metric?.id??metric?.key??'').trim());
 const structuralMetricIds=ids.includes('weight')&&ids.includes('reps')&&ids.includes('sets')?['sets']:[];
 const metricDefs=raw
  .filter(metric=>!structuralMetricIds.includes(String(metric?.id??metric?.key??'').trim()))
  .map(legacyDefinition);
 const schema=normalizeMetricSchema({
  objectId,
  source:`compat:${String(object.metricSchemaVersion||AXIS_818_METRIC_SCHEMA_VERSION)}`,
  metrics:metricDefs
 });
 return {
  schema,
  surface:resolveRecordingSurface(schema),
  compatibility:{
   sourceVersion:String(object.metricSchemaVersion||AXIS_818_METRIC_SCHEMA_VERSION),
   storage:'axis_v60_state.profile.customEq[].metricSchema',
   readOnly:true,
   structuralMetricIds
  }
 };
}
