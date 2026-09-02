export const OBJECT_METRIC_OVERRIDES_ID='axis.object-metric-overrides.v1';

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const idOf=value=>String(value??'').trim();
const own=(object,key)=>Object.prototype.hasOwnProperty.call(object||{},key);

export function normalizeMetricIds(values,{allowedIds=null}={}){
  if(!Array.isArray(values))throw new Error('[AXIS object metric overrides] metrics must be an array');
  const allowed=allowedIds==null?null:new Set((allowedIds||[]).map(idOf).filter(Boolean));
  const out=[];
  const seen=new Set();
  for(const raw of values){
    const id=idOf(typeof raw==='string'?raw:raw?.id??raw?.key);
    if(!id||seen.has(id))continue;
    if(allowed&&!allowed.has(id))continue;
    seen.add(id);out.push(id);
  }
  return out;
}

export function overrideMap(profile={}){
  const raw=profile?.objectMetricOverrides;
  return raw&&typeof raw==='object'&&!Array.isArray(raw)?raw:{};
}

export function hasObjectMetricOverride(profile,objectId){
  const id=idOf(objectId);
  return !!id&&own(overrideMap(profile),id);
}

export function objectMetricOverride(profile,objectId,{allowedIds=null}={}){
  const id=idOf(objectId),items=overrideMap(profile);
  if(!id||!own(items,id))return null;
  const raw=items[id];
  const metrics=normalizeMetricIds(Array.isArray(raw)?raw:(raw?.metrics||[]),{allowedIds});
  return {schema:OBJECT_METRIC_OVERRIDES_ID,objectId:id,version:1,metrics,updatedAt:Number(raw?.updatedAt)||null};
}

export function resolveObjectMetricIds({profile={},objectId,defaultMetricIds=[],allowedIds=null,custom=false}={}){
  const defaults=normalizeMetricIds(defaultMetricIds,{allowedIds});
  if(custom)return {source:'object',metricIds:defaults,overridden:false};
  const override=objectMetricOverride(profile,objectId,{allowedIds});
  return override?{source:'profile-override',metricIds:[...override.metrics],overridden:true}:{source:'object',metricIds:defaults,overridden:false};
}

export function setObjectMetricOverride(profile,objectId,metricIds,{allowedIds=null,updatedAt=Date.now()}={}){
  const id=idOf(objectId);
  if(!id)throw new Error('[AXIS object metric overrides] objectId is required');
  const next=clone(profile)||{};
  const items={...overrideMap(next)};
  items[id]={version:1,metrics:normalizeMetricIds(metricIds,{allowedIds}),updatedAt:Number(updatedAt)||0};
  next.objectMetricOverrides=items;
  return next;
}

export function clearObjectMetricOverride(profile,objectId){
  const id=idOf(objectId),next=clone(profile)||{},items={...overrideMap(next)};
  if(id)delete items[id];
  next.objectMetricOverrides=items;
  return next;
}
