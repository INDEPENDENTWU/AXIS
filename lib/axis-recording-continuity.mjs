export const RECORDING_CONTINUITY_SCHEMA='axis.recording-continuity.v1';
export const RECORDING_CONTINUITY_VERSION='8.29';

const key=m=>String(m?.key??m?.id??'').trim();
const type=m=>String(m?.type||'number').trim();
const unit=m=>String(m?.unit||'').trim();
const quantitative=new Set(['number','count','duration','distance','percentage','rating']);
function normalizedPace(raw){
  if(typeof raw!=='number'&&typeof raw!=='string')return null;
  const v=String(raw).trim();
  const clock=v.match(/^(\d{1,3}):(\d{1,2})$/);
  let seconds;
  if(clock){
    if(Number(clock[2])>59)return null;
    seconds=Number(clock[1])*60+Number(clock[2]);
  }else if(/^\d+(?:\.\d+)?$/.test(v)){
    const minutes=Number(v);
    if(!Number.isFinite(minutes))return null;
    seconds=Math.round(minutes*60);
  }else return null;
  if(!Number.isSafeInteger(seconds)||seconds<0)return null;
  return Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0');
}
function compatibleBounds(prior,current){
  // Compare the definition, not just whether a historical value still fits.
  // An omitted bound and an explicit finite bound carry different meanings.
  for(const side of ['min','max']){
    const normalize=(metric)=>{
      const raw=metric?.[side];
      if(raw==null||raw==='')return null;
      const n=Number(raw);
      return Number.isFinite(n)?n:NaN;
    };
    const a=normalize(prior),b=normalize(current);
    if(Number.isNaN(a)||Number.isNaN(b)||a!==b)return false;
  }
  return true;
}
function compatibleChoices(prior,current){
  const relevant=m=>String(m?.presentation||'')==='choice'||Array.isArray(m?.options);
  if(!relevant(prior)&&!relevant(current))return true;
  // An option label, value or presentation change may alter the meaning of a
  // previously confirmed choice. Reuse only when the old definition matches.
  return String(prior?.presentation||'')===String(current?.presentation||'')&&
    JSON.stringify(prior?.options??[])===JSON.stringify(current?.options??[]);
}
function permittedChoice(m,value){
  if(value==null)return null;
  const options=Array.isArray(m?.options)?m.options:[];
  if(String(m?.presentation||'')==='choice'&&!options.length)return null;
  if(!options.length)return value;
  const canonical=String(value);
  const allowed=options.some(x=>String(x&&typeof x==='object'?x.value??'':x)===canonical);
  return allowed?canonical:null;
}
function validValue(m,raw){
  if(raw==null||raw==='')return null;
  const t=type(m);
  if(t==='boolean'){
    if(raw===true||raw===false)return permittedChoice(m,raw?'1':'0');
    if(raw==='1'||raw===1||raw==='true')return permittedChoice(m,'1');
    if(raw==='0'||raw===0||raw==='false')return permittedChoice(m,'0');
    return null;
  }
  if(quantitative.has(t)){
    // Blank or non-scalar legacy values must never turn into fabricated zero.
    if(typeof raw!=='number'&&typeof raw!=='string')return null;
    if(typeof raw==='string'&&!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(raw.trim()))return null;
    const n=Number(raw);
    if(!Number.isFinite(n))return null;
    if(m.min!=null&&Number.isFinite(Number(m.min))&&n<Number(m.min))return null;
    if(m.max!=null&&Number.isFinite(Number(m.max))&&n>Number(m.max))return null;
    if((t==='count'||t==='rating')&&!Number.isInteger(n))return null;
    return permittedChoice(m,String(n));
  }
  // Canonical Recorder exposes pace as a text-typed metric in some snapshots.
  // Apply the pace control's semantics by key/presentation as well as by type.
  if(t==='pace'||key(m)==='pace'||String(m?.presentation||'')==='pace'){
    return permittedChoice(m,normalizedPace(raw));
  }
  const v=String(raw).trim();
  if(!v||v.length>120)return null;
  return permittedChoice(m,v);
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
    if(type(prior)!==type(m)||unit(prior)!==unit(m)||!compatibleBounds(prior,m)||!compatibleChoices(prior,m))continue;
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
