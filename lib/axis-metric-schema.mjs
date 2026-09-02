import {metricCapability,normalizeMetricValue as normalizeCapabilityValue} from './axis-object-capabilities.mjs';

export const METRIC_SCHEMA_ID='axis.metric-schema.v1';
export const ENCOUNTER_METRICS_ID='axis.encounter-metrics.v1';

export const METRIC_TYPES=Object.freeze([
  'number','count','duration','distance','pace','percentage','rating','boolean','choice'
]);

const TYPE_SET=new Set(METRIC_TYPES);
const PRIORITIES=new Set(['primary','secondary','context']);
const REPEATABILITIES=new Set(['single','per-entry']);
const AGGREGATIONS=new Set(['last','max','min','sum','average','count','none']);
const PRESENTATIONS=new Set(['auto','stepper','timer','distance','pace','percentage','rating','toggle','choice']);

const BUILTIN=Object.freeze({
  weight:{id:'weight',type:'number',label:'重量',unit:'kg',priority:'primary',repeatability:'per-entry',aggregation:'max',presentation:'stepper',min:0,step:2.5},
  reps:{id:'reps',type:'count',label:'次数',unit:'次',priority:'primary',repeatability:'per-entry',aggregation:'max',presentation:'stepper',min:0,step:1},
  sets:{id:'sets',type:'count',label:'组数',unit:'组',priority:'primary',repeatability:'single',aggregation:'max',presentation:'stepper',min:1,step:1},
  duration:{id:'duration',type:'duration',label:'时间',unit:'分钟',priority:'primary',repeatability:'single',aggregation:'sum',presentation:'timer',min:0,step:1},
  hold:{id:'hold',type:'duration',label:'保持时间',unit:'秒',priority:'primary',repeatability:'single',aggregation:'sum',presentation:'timer',min:0,step:5},
  distance:{id:'distance',type:'distance',label:'距离',unit:'km',priority:'primary',repeatability:'single',aggregation:'sum',presentation:'distance',min:0,step:0.1},
  pace:{id:'pace',type:'pace',label:'配速',unit:'min/km',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'pace'},
  intensity:{id:'intensity',type:'rating',label:'强度',unit:'',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'rating',min:1,max:20,step:1},
  resistance:{id:'resistance',type:'number',label:'阻力 / 档位',unit:'',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'stepper',min:0,step:1},
  level:{id:'level',type:'number',label:'等级',unit:'级',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'stepper',min:0,step:1},
  speed:{id:'speed',type:'number',label:'速度',unit:'km/h',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'stepper',min:0,step:0.1},
  incline:{id:'incline',type:'percentage',label:'坡度',unit:'%',priority:'secondary',repeatability:'single',aggregation:'average',presentation:'percentage',min:0,step:0.5},
  rating:{id:'rating',type:'rating',label:'感受',unit:'/10',priority:'context',repeatability:'single',aggregation:'average',presentation:'rating',min:1,max:10,step:1},
  completed:{id:'completed',type:'boolean',label:'完成',unit:'',priority:'context',repeatability:'single',aggregation:'count',presentation:'toggle'}
});

const PROFILE_METRICS=Object.freeze({
  weight_reps:['weight','reps'],
  strength:['weight','reps'],
  time_intensity:['duration','intensity'],
  cardio:['duration','intensity'],
  time_level:['duration','level'],
  relative:['duration','level']
});

const clone=(value)=>value==null?value:JSON.parse(JSON.stringify(value));
const finite=(value)=>Number.isFinite(Number(value))?Number(value):null;
const fail=(message)=>{throw new Error(`[AXIS metric schema] ${message}`)};

function normalizeOptions(options){
  if(!Array.isArray(options))return undefined;
  const out=[];
  const seen=new Set();
  for(const raw of options){
    const item=typeof raw==='string'?{value:raw,label:raw}:raw;
    if(!item||typeof item!=='object')fail('choice option must be a string or object');
    const value=String(item.value??'').trim();
    if(!value)fail('choice option value is required');
    if(seen.has(value))fail(`duplicate choice option ${value}`);
    seen.add(value);
    out.push({value,label:String(item.label??value)});
  }
  return out;
}

export function builtinMetric(id){
  const key=String(id||'').trim();
  return BUILTIN[key]?clone(BUILTIN[key]):null;
}

export function normalizeMetricDefinition(input,index=0){
  const raw=typeof input==='string'?builtinMetric(input):clone(input);
  if(!raw||typeof raw!=='object'||Array.isArray(raw))fail(`metric ${index} must be an object or known metric id`);
  const id=String(raw.id??raw.key??'').trim();
  if(!id||!/^[A-Za-z][A-Za-z0-9._-]*$/.test(id))fail(`metric ${index} has invalid id`);
  const base=builtinMetric(id)||{};
  const merged={...base,...raw,id};
  const type=String(merged.type??'').trim();
  if(!TYPE_SET.has(type))fail(`metric ${id} has unsupported type ${type||'(missing)'}`);
  const priority=String(merged.priority??'secondary');
  const repeatability=String(merged.repeatability??'single');
  const aggregation=String(merged.aggregation??'last');
  const presentation=String(merged.presentation??'auto');
  if(!PRIORITIES.has(priority))fail(`metric ${id} has invalid priority ${priority}`);
  if(!REPEATABILITIES.has(repeatability))fail(`metric ${id} has invalid repeatability ${repeatability}`);
  if(!AGGREGATIONS.has(aggregation))fail(`metric ${id} has invalid aggregation ${aggregation}`);
  if(!PRESENTATIONS.has(presentation))fail(`metric ${id} has invalid presentation ${presentation}`);

  const out={
    id,
    type,
    label:String(merged.label??id).trim()||id,
    unit:String(merged.unit??''),
    priority,
    repeatability,
    aggregation,
    presentation,
    required:merged.required===true
  };
  for(const key of ['min','max','step']){
    const n=finite(merged[key]);
    if(n!=null)out[key]=n;
  }
  if(out.min!=null&&out.max!=null&&out.max<out.min)fail(`metric ${id} max is below min`);
  if(out.step!=null&&out.step<=0)fail(`metric ${id} step must be positive`);
  if(type==='choice'){
    const options=normalizeOptions(merged.options);
    if(!options?.length)fail(`choice metric ${id} requires options`);
    out.options=options;
  }
  const axisHint=metricCapability(id)?.executionHint;
  const extensions=merged.extensions&&typeof merged.extensions==='object'&&!Array.isArray(merged.extensions)?clone(merged.extensions):{};
  if(axisHint&&!extensions.axis?.executionHint)extensions.axis={...(extensions.axis||{}),executionHint:axisHint};
  if(Object.keys(extensions).length)out.extensions=extensions;
  return out;
}

function explicitMetricInput(object){
  if(!object||typeof object!=='object')return null;
  for(const candidate of [object.metricSchema,object.recording?.metricSchema,object.metrics]){
    if(Array.isArray(candidate))return {metrics:candidate};
    if(candidate&&typeof candidate==='object'&&Array.isArray(candidate.metrics))return candidate;
  }
  return null;
}

function profileForObject(object={}){
  const explicit=String(object.axisCustomProfile??object.recordProfile??object.recordingProfile??'').trim();
  if(explicit&&PROFILE_METRICS[explicit])return explicit;
  const type=String(object.type??object.kind??'').trim();
  if(type==='cardio')return 'time_intensity';
  if(type==='strength')return 'weight_reps';
  if(type==='relative')return 'time_level';
  return 'weight_reps';
}

export function normalizeMetricSchema(input,{objectId=null,source='explicit'}={}){
  const raw=Array.isArray(input)?{metrics:input}:clone(input);
  if(!raw||typeof raw!=='object'||!Array.isArray(raw.metrics))fail('metric schema requires a metrics array');
  const id=String(raw.objectId??objectId??'').trim();
  if(!id)fail('metric schema requires objectId');
  const metrics=raw.metrics.map((metric,index)=>normalizeMetricDefinition(metric,index));
  const seen=new Set();
  for(const metric of metrics){
    if(seen.has(metric.id))fail(`duplicate metric id ${metric.id}`);
    seen.add(metric.id);
  }
  return {
    schema:METRIC_SCHEMA_ID,
    objectId:id,
    source:String(raw.source??source??'explicit'),
    metrics
  };
}

export function resolveMetricSchema(object={}){
  const objectId=String(object.id??object.equipmentId??'').trim();
  if(!objectId)fail('object identity is required');
  const explicit=explicitMetricInput(object);
  if(explicit)return normalizeMetricSchema(explicit,{objectId,source:'explicit'});
  const profile=profileForObject(object);
  return normalizeMetricSchema({source:`legacy:${profile}`,metrics:PROFILE_METRICS[profile]},{objectId,source:`legacy:${profile}`});
}

export function createMetricSchemaSnapshot(schema,capturedAt=Date.now()){
  const normalized=normalizeMetricSchema(schema,{objectId:schema?.objectId,source:schema?.source});
  const at=finite(capturedAt);
  if(at==null||at<0)fail('schema snapshot capturedAt must be a non-negative number');
  return {...clone(normalized),capturedAt:at};
}

export function resolveRecordingSurface(schema){
  const normalized=normalizeMetricSchema(schema,{objectId:schema?.objectId,source:schema?.source});
  const entries=normalized.metrics.filter(metric=>metric.repeatability==='per-entry');
  const singles=normalized.metrics.filter(metric=>metric.repeatability!=='per-entry');
  const ids=new Set(normalized.metrics.map(metric=>metric.id));
  const classicStrength=entries.length===2&&ids.has('weight')&&ids.has('reps')&&singles.length===0;
  const continuous=entries.length===0&&normalized.metrics.some(metric=>['duration','distance','pace'].includes(metric.type)||['duration','hold','distance','pace','speed','intensity','resistance','level','incline'].includes(metric.id));
  return {
    kind:entries.length?'repeatable':continuous?'continuous':'fields',
    objectId:normalized.objectId,
    metricIds:normalized.metrics.map(metric=>metric.id),
    primaryMetricIds:normalized.metrics.filter(metric=>metric.priority==='primary').map(metric=>metric.id),
    entryMetricIds:entries.map(metric=>metric.id),
    singleMetricIds:singles.map(metric=>metric.id),
    legacyOwner:classicStrength?'v61':null
  };
}

function valueForMetric(metric,source){
  if(!source||typeof source!=='object')return null;
  const value=source[metric.id];
  if(value==null||value==='')return null;
  return normalizeCapabilityValue(metric,value);
}

function legacySetSource(event={},metaRecord={}){
  if(Array.isArray(metaRecord.sets)&&metaRecord.sets.length)return metaRecord.sets;
  const count=Math.max(1,Math.floor(finite(event.sets)??1));
  return Array.from({length:count},()=>({weight:event.weight??null,reps:event.reps??null,state:'done',doneAt:null,inferred:true}));
}

export function createEncounterMetricEnvelope({object,event,metaRecord=null,recordedAt=null}={}){
  if(!event||typeof event!=='object')fail('event is required');
  const identity=object&&typeof object==='object'?object:{
    id:event.equipmentId,
    type:event.kind,
    axisCustomProfile:event.axisCustomProfile,
    metricSchema:event.metricSchema
  };
  const metricSchema=resolveMetricSchema(identity);
  const snapshot=createMetricSchemaSnapshot(metricSchema,recordedAt??event.time??Date.now());
  const surface=resolveRecordingSurface(metricSchema);
  const envelope={
    schema:ENCOUNTER_METRICS_ID,
    objectId:metricSchema.objectId,
    activityId:String(event.id??''),
    capturedAt:snapshot.capturedAt,
    factSource:surface.legacyOwner==='v61'?'axis_v8_meta':'axis_v60_state',
    metricSchema:snapshot,
    values:{},
    entries:[]
  };
  if(!envelope.activityId)fail('event id is required');

  for(const metric of metricSchema.metrics.filter(metric=>metric.repeatability!=='per-entry')){
    envelope.values[metric.id]=valueForMetric(metric,event?.metrics&&Object.prototype.hasOwnProperty.call(event.metrics,metric.id)?event.metrics:event);
  }

  const entryMetrics=metricSchema.metrics.filter(metric=>metric.repeatability==='per-entry');
  if(entryMetrics.length){
    envelope.entries=legacySetSource(event,metaRecord||{}).map((set,index)=>{
      const values={};
      for(const metric of entryMetrics)values[metric.id]=valueForMetric(metric,set);
      return {
        index,
        state:String(set?.state??'done'),
        doneAt:finite(set?.doneAt),
        values
      };
    });
  }
  return envelope;
}

export function legacyProfileForObject(object={}){
  return profileForObject(object);
}