export const REALITY_ROUTE_SCHEMA_ID='axis.reality-route.v1';
export const REALITY_ROUTE_VERSION='8.27';
export const EXECUTION_CONSTRAINT_SCHEMA_ID='axis.execution-constraints.v1';

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const text=value=>String(value??'').trim();
const unique=list=>[...new Set((Array.isArray(list)?list:[]).map(text).filter(Boolean))];

function normalizeSteps(raw){
  if(!Array.isArray(raw))throw new Error('[AXIS Reality Route] steps must be an array');
  const seen=new Set();
  return raw.map((step,index)=>{
    if(!step||typeof step!=='object'||Array.isArray(step))throw new Error(`[AXIS Reality Route] step ${index} must be an object`);
    const id=text(step.id),objectRef=text(step.objectRef);
    if(!id||!objectRef)throw new Error(`[AXIS Reality Route] step ${index} identity is incomplete`);
    if(seen.has(id))throw new Error(`[AXIS Reality Route] duplicate step ${id}`);
    seen.add(id);
    return {id,objectRef};
  });
}

function encounterStepRefs(encounters,flowRef){
  const refs=[];
  for(const e of Array.isArray(encounters)?encounters:[]){
    const p=e?.flowProvenance;
    if(p?.flowRef===flowRef&&text(p?.flowStepRef))refs.push(text(p.flowStepRef));
  }
  return unique(refs);
}

export function normalizeExecutionConstraints(input={}){
  const raw=input&&typeof input==='object'&&!Array.isArray(input)?input:{};
  return {
    schema:EXECUTION_CONSTRAINT_SCHEMA_ID,
    deferredStepRefs:unique(raw.deferredStepRefs)
  };
}

export function projectRealityRoute({flowRef='',steps=[],run={},encounters=[]}={}){
  const normalizedSteps=normalizeSteps(steps);
  const id=text(flowRef||run?.flowRef);
  if(!id)throw new Error('[AXIS Reality Route] flowRef is required');

  const allIds=new Set(normalizedSteps.map(step=>step.id));
  const consumed=unique(run?.consumedStepRefs).filter(ref=>allIds.has(ref));
  const skipped=unique(run?.skippedStepRefs).filter(ref=>allIds.has(ref));
  const constraints=normalizeExecutionConstraints(run?.temporaryConstraints);
  const deferredRefs=constraints.deferredStepRefs.filter(ref=>allIds.has(ref));
  const consumedSet=new Set(consumed),skippedSet=new Set(skipped),deferredSet=new Set(deferredRefs);
  const observedEncounterStepRefs=encounterStepRefs(encounters,id);
  const observedSet=new Set(observedEncounterStepRefs);

  const activeRef=run?.currentEncounterId?text(run?.currentStepRef):'';
  const available=normalizedSteps.filter(step=>!consumedSet.has(step.id)&&!skippedSet.has(step.id));
  const active=activeRef?available.find(step=>step.id===activeRef)||null:null;
  const immediate=available.filter(step=>step.id!==activeRef&&!deferredSet.has(step.id));
  const deferred=available.filter(step=>step.id!==activeRef&&deferredSet.has(step.id));
  const ordered=active?[active,...immediate,...deferred]:[...immediate,...deferred];
  const current=ordered[0]||null,next=ordered[1]||null;
  const currentDeferred=!!current&&deferredSet.has(current.id)&&current.id!==activeRef;
  const completedWithoutEncounter=consumed.filter(ref=>!observedSet.has(ref));
  const reasonCodes=[];
  if(deferred.length||currentDeferred)reasonCodes.push('temporary-deferred-item');
  if(currentDeferred)reasonCodes.push('resuming-deferred-item');
  if(active)reasonCodes.push('active-item-authoritative');
  if(completedWithoutEncounter.length)reasonCodes.push('consumed-step-missing-encounter-evidence');
  if(!current)reasonCodes.push('route-complete');

  return {
    schema:REALITY_ROUTE_SCHEMA_ID,
    runtimeVersion:REALITY_ROUTE_VERSION,
    flowRef:id,
    status:current?'active':'complete',
    current:current?clone(current):null,
    next:next?clone(next):null,
    remaining:ordered.map(clone),
    deferred:deferred.map(clone),
    dropped:normalizedSteps.filter(step=>skippedSet.has(step.id)).map(clone),
    completedStepRefs:[...consumed],
    observedEncounterStepRefs,
    completedWithoutEncounter,
    constraints,
    currentDeferred,
    counts:{
      total:normalizedSteps.length,
      completed:consumed.length,
      dropped:skipped.length,
      deferred:deferred.length+(currentDeferred?1:0),
      remaining:ordered.length
    },
    reasonCodes
  };
}

export function deferRealityRouteCurrent({run={},projection}={}){
  if(!projection||projection.schema!==REALITY_ROUTE_SCHEMA_ID)throw new Error('[AXIS Reality Route] current projection is required');
  if(projection.status!=='active'||!projection.current)return {changed:false,run:clone(run),reason:'route-complete'};
  if(run?.currentEncounterId&&text(run?.currentStepRef)===projection.current.id)return {changed:false,run:clone(run),reason:'active-item-cannot-defer'};
  if(projection.currentDeferred)return {changed:false,run:clone(run),reason:'already-deferred'};
  const next=clone(run)||{};
  next.temporaryConstraints=normalizeExecutionConstraints(next.temporaryConstraints);
  next.temporaryConstraints.deferredStepRefs=unique([...next.temporaryConstraints.deferredStepRefs,projection.current.id]);
  return {changed:true,run:next,reason:'temporary-deferred-item',stepRef:projection.current.id};
}
