export const RECORDING_CONTINUITY_SCHEMA='axis.recording-continuity.v1';
export const RECORDING_CONTINUITY_VERSION='8.29';

const key=m=>String(m?.key??m?.id??'').trim();
const type=m=>String(m?.type||'number').trim();
const unit=m=>String(m?.unit||'').trim();
const quantitative=new Set(['number','count','duration','distance','percentage','rating']);
function validValue(m,raw){
  if(raw==null||raw==='')return null;
  const t=type(m);
  if(t==='boolean'){
    if(raw===true||raw===false)return raw?'1':'0';
    if(raw==='1'||raw===1||raw==='true')return'1';
    if(raw==='0'||raw===0||raw==='false')return'0';
    return null;
  }
  if(quantitative.has(t)){
    if(typeof raw==='boolean')return null;
    const n=Number(raw);
    if(!Number.isFinite(n))return null;
    if(m.min!=null&&Number.isFinite(Number(m.min))&&n<Number(m.min))return null;
    if(m.max!=null&&Number.isFinite(Number(m.max))&&n>Number(m.max))return null;
    if((t==='count'||t==='rating')&&!Number.isInteger(n))return null;
    return String(n);
  }
  if(t==='pace'){
    const v=String(raw).trim();
    return /^\d{1,3}:[0-5]\d$/.test(v)?v:null;
  }
  const v=String(raw).trim();
  if(!v||v.length>120)return null;
  if(Array.isArray(m.options)&&m.options.length){
    const allowed=m.options.map(x=>String(typeof x==='string'?x:x?.value??''));
    if(!allowed.includes(v))return null;
  }
  return v;
}
export function projectRecordingRecall({schema=[],previous=null,metrics=null}={}){
  const definitions=Array.isArray(schema)?schema:[];
  const last=previous&&typeof previous==='object'?previous:null;
  const old=last?.metricSchemaSnapshot;
  // Without a historical schema, unit and meaning cannot be proven compatible.
  if(!last||!Array.isArray(old)||!old.length||!metrics||typeof metrics!=='object'){
    return {schema:RECORDING_CONTINUITY_SCHEMA,sourceEncounterId:null,sourceTime:null,values:{},count:0,reasonCodes:['no-compatible-confirmed-evidence']};
  }
  const previousDefinitions=new Map(old.map(m=>[key(m),m]));
  const values={};
  for(const m of definitions){
    const k=key(m),prior=previousDefinitions.get(k);
    if(!k||!prior||Object.prototype.hasOwnProperty.call(values,k))continue;
    if(type(prior)!==type(m)||unit(prior)!==unit(m))continue;
    if(!Object.prototype.hasOwnProperty.call(metrics,k))continue;
    const value=validValue(m,metrics[k]);
    if(value!=null)values[k]=value;
  }
  return {
    schema:RECORDING_CONTINUITY_SCHEMA,
    sourceEncounterId:String(last.id||''),
    sourceTime:Number.isFinite(Number(last.time))?Number(last.time):null,
    values,
    count:Object.keys(values).length,
    reasonCodes:Object.keys(values).length?['confirmed-previous-encounter','explicit-user-confirmation-required']:['no-compatible-confirmed-evidence']
  };
}
