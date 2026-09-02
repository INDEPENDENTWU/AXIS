export const AXIS_OBJECT_CAPABILITIES_ID='axis.object-capabilities.v1';

export const EXECUTION_MODES=Object.freeze(['auto','single','sets','rounds','timed','hold','complete']);
const EXECUTION_SET=new Set(EXECUTION_MODES);

export const METRIC_CAPABILITIES=Object.freeze({
  weight:{id:'weight',label:'重量',group:'volume',type:'number',unit:'kg',presentation:'stepper',min:0,step:2.5,repeatability:'per-entry',aggregation:'max',executionHint:'context'},
  reps:{id:'reps',label:'次数',group:'volume',type:'count',unit:'次',presentation:'stepper',min:0,step:1,repeatability:'per-entry',aggregation:'max',executionHint:'context'},
  sets:{id:'sets',label:'组数',group:'volume',type:'count',unit:'组',presentation:'stepper',min:1,step:1,repeatability:'single',aggregation:'max',executionHint:'sets'},
  duration:{id:'duration',label:'时间',group:'time_motion',type:'duration',unit:'分钟',presentation:'timer',min:0,step:1,repeatability:'single',aggregation:'sum',executionHint:'timed',presets:[5,10,15,20,30,45]},
  hold:{id:'hold',label:'保持时间',group:'time_motion',type:'duration',unit:'秒',presentation:'timer',min:0,step:5,repeatability:'single',aggregation:'sum',executionHint:'hold',presets:[10,20,30,45,60,90]},
  distance:{id:'distance',label:'距离',group:'time_motion',type:'distance',unit:'km',presentation:'distance',min:0,step:0.1,repeatability:'single',aggregation:'sum',executionHint:'timed',presets:[0.5,1,3,5,10]},
  pace:{id:'pace',label:'配速',group:'time_motion',type:'pace',unit:'min/km',presentation:'pace',repeatability:'single',aggregation:'average',executionHint:'timed'},
  speed:{id:'speed',label:'速度',group:'time_motion',type:'number',unit:'km/h',presentation:'stepper',min:0,step:0.1,repeatability:'single',aggregation:'average',executionHint:'timed',presets:[5,8,10,12,15]},
  intensity:{id:'intensity',label:'强度',group:'load_device',type:'rating',unit:'/10',presentation:'rating',min:1,max:10,step:1,repeatability:'single',aggregation:'average',executionHint:'timed'},
  resistance:{id:'resistance',label:'阻力 / 档位',group:'load_device',type:'number',unit:'',presentation:'stepper',min:0,step:1,repeatability:'single',aggregation:'average',executionHint:'timed'},
  level:{id:'level',label:'等级',group:'load_device',type:'number',unit:'级',presentation:'stepper',min:0,step:1,repeatability:'single',aggregation:'average',executionHint:'timed'},
  incline:{id:'incline',label:'坡度',group:'load_device',type:'percentage',unit:'%',presentation:'percentage',min:0,step:0.5,repeatability:'single',aggregation:'average',executionHint:'timed',presets:[0,2,5,8,10,12]},
  rating:{id:'rating',label:'感受',group:'context',type:'rating',unit:'/10',presentation:'rating',min:1,max:10,step:1,repeatability:'single',aggregation:'average',executionHint:'context'},
  completed:{id:'completed',label:'完成',group:'context',type:'boolean',unit:'',presentation:'toggle',repeatability:'single',aggregation:'count',executionHint:'complete'}
});

export const METRIC_GROUPS=Object.freeze([
  {id:'volume',label:'训练量',metricIds:['weight','reps','sets']},
  {id:'time_motion',label:'时间与移动',metricIds:['duration','hold','distance','pace','speed']},
  {id:'load_device',label:'强度与设备',metricIds:['intensity','resistance','level','incline']},
  {id:'context',label:'结果与感受',metricIds:['rating','completed']}
]);

export const CUSTOM_METRIC_TYPES=Object.freeze({
  number:{type:'number',label:'数值',presentation:'stepper',step:1,executionHint:'context'},
  count:{type:'count',label:'次数 / 数量',presentation:'stepper',step:1,min:0,executionHint:'context'},
  duration:{type:'duration',label:'时间',presentation:'timer',step:1,min:0,executionHint:'timed'},
  distance:{type:'distance',label:'距离',presentation:'distance',step:0.1,min:0,executionHint:'timed'},
  pace:{type:'pace',label:'配速',presentation:'pace',executionHint:'timed'},
  percentage:{type:'percentage',label:'百分比',presentation:'percentage',step:0.5,executionHint:'context'},
  rating:{type:'rating',label:'1–10',presentation:'rating',step:1,min:1,max:10,executionHint:'context'},
  boolean:{type:'boolean',label:'是 / 否',presentation:'toggle',executionHint:'complete'},
  choice:{type:'choice',label:'选项',presentation:'choice',executionHint:'context'}
});

const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
const idOf=m=>String(m?.id??m?.key??'').trim();
const hintOf=m=>String(m?.extensions?.axis?.executionHint??m?.executionHint??METRIC_CAPABILITIES[idOf(m)]?.executionHint??CUSTOM_METRIC_TYPES[String(m?.type||'')]?.executionHint??'context');

export function metricCapability(id){
  const key=String(id||'').trim();
  return METRIC_CAPABILITIES[key]?clone(METRIC_CAPABILITIES[key]):null;
}

export function metricDefinitionForRuntime(id){
  const c=metricCapability(id);if(!c)return null;
  const out={key:c.id,id:c.id,label:c.label,type:c.type,unit:c.unit,step:c.step??1,presentation:c.presentation,custom:false};
  for(const k of ['min','max'])if(Number.isFinite(Number(c[k])))out[k]=Number(c[k]);
  if(Array.isArray(c.presets))out.presets=[...c.presets];
  return out;
}

export function customMetricDefinition({id,label,type='number',unit='',options=null,executionHint=null}={}){
  const key=String(id||'').trim(),name=String(label||'').trim(),spec=CUSTOM_METRIC_TYPES[String(type||'')];
  if(!/^[A-Za-z][A-Za-z0-9._-]*$/.test(key))throw new Error('[AXIS object capabilities] invalid custom metric id');
  if(!name)throw new Error('[AXIS object capabilities] custom metric label required');
  if(!spec)throw new Error(`[AXIS object capabilities] unsupported custom metric type ${type}`);
  const out={id:key,key,label:name,type:spec.type,unit:String(unit||''),presentation:spec.presentation,step:spec.step??1,custom:true,extensions:{axis:{executionHint:String(executionHint||spec.executionHint)}}};
  for(const k of ['min','max'])if(Number.isFinite(Number(spec[k])))out[k]=Number(spec[k]);
  if(spec.type==='choice'){
    const xs=(Array.isArray(options)?options:[]).map(v=>typeof v==='string'?{value:v.trim(),label:v.trim()}:{value:String(v?.value??'').trim(),label:String(v?.label??v?.value??'').trim()}).filter(v=>v.value);
    if(!xs.length)throw new Error('[AXIS object capabilities] choice metric requires options');
    out.options=xs;
  }
  return out;
}

export function resolveExecutionMode(metrics=[],requested='auto'){
  const explicit=String(requested||'auto');
  if(explicit!=='auto'&&EXECUTION_SET.has(explicit))return explicit;
  const xs=Array.isArray(metrics)?metrics:[],keys=new Set(xs.map(idOf).filter(Boolean)),hints=new Set(xs.map(hintOf));
  if(keys.has('rounds')||hints.has('rounds'))return'rounds';
  if(keys.has('sets')||(keys.has('weight')&&keys.has('reps'))||hints.has('sets'))return'sets';
  if(keys.has('hold')||hints.has('hold'))return'hold';
  if(keys.size===1&&keys.has('completed'))return'complete';
  if(hints.has('timed'))return'timed';
  if(xs.length===1&&hintOf(xs[0])==='complete')return'complete';
  return'single';
}

export function normalizeMetricValue(metric,value){
  if(value==null||value==='')return null;
  const type=String(metric?.type||metricCapability(idOf(metric))?.type||'number');
  if(type==='boolean')return value===true||value===1||value==='1'||value==='true';
  if(type==='choice'){
    const v=String(value);const opts=Array.isArray(metric?.options)?metric.options:[];
    return !opts.length||opts.some(o=>String(o?.value??o)===v)?v:null;
  }
  if(type==='pace'){
    const v=String(value).trim();if(!v)return null;
    const clean=v.replace(/\s*\/\s*km$/i,'').trim();
    return /^\d{1,3}:\d{2}$/.test(clean)?clean:v;
  }
  const n=Number(value);if(!Number.isFinite(n))return null;
  const min=Number(metric?.min),max=Number(metric?.max);
  let out=n;if(Number.isFinite(min))out=Math.max(min,out);if(Number.isFinite(max))out=Math.min(max,out);return out;
}

export function formatMetricValue(metric,value,{locale='zh-Hans'}={}){
  const v=normalizeMetricValue(metric,value);if(v==null)return'';
  const type=String(metric?.type||''),unit=String(metric?.unit||'');
  if(type==='boolean')return v?(locale==='en'?'Yes':'是'):(locale==='en'?'No':'否');
  if(type==='choice'){
    const hit=(metric?.options||[]).find(o=>String(o?.value??o)===String(v));return String(hit?.label??v);
  }
  const text=typeof v==='number'?(Number.isInteger(v)?String(v):String(Math.round(v*1000)/1000)):String(v);
  return text+(unit?' '+unit:'');
}

export function capabilityMatrix(){
  return {schema:AXIS_OBJECT_CAPABILITIES_ID,metricCount:Object.keys(METRIC_CAPABILITIES).length,metricIds:Object.keys(METRIC_CAPABILITIES),groups:clone(METRIC_GROUPS),customTypes:Object.keys(CUSTOM_METRIC_TYPES),executionModes:[...EXECUTION_MODES]};
}
