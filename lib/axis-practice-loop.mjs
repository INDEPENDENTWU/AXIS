export const PRACTICE_LOOP_SCHEMA_ID='axis.practice-loop.v1';
export const PRACTICE_LOOP_VERSION='8.28';

const clone=value=>value==null?value:JSON.parse(JSON.stringify(value));
const text=value=>String(value??'').trim();
const PHASES=new Set(['idle','ready','between-items','executing','paused','recovering','settling','complete']);

function normalizedRoute(route){
  if(route==null)return null;
  if(!route||typeof route!=='object'||Array.isArray(route))throw new Error('[AXIS Practice Loop] route must be an object');
  if(route.schema!=='axis.reality-route.v1')throw new Error('[AXIS Practice Loop] unsupported route schema '+route.schema);
  return clone(route);
}
function normalizedActive(active){
  if(active==null)return null;
  if(!active||typeof active!=='object'||Array.isArray(active))throw new Error('[AXIS Practice Loop] active must be an object');
  const id=text(active.id),status=text(active.status);
  if(!id)throw new Error('[AXIS Practice Loop] active id is required');
  if(!['active','paused','finished'].includes(status))throw new Error('[AXIS Practice Loop] unsupported active status '+status);
  return {id,status,elapsedMs:Math.max(0,Number(active.elapsedMs)||0),estimateMs:Math.max(0,Number(active.estimateMs)||0)};
}

export function projectPracticeLoop({route=null,run=null,active=null,session=null}={}){
  const r=run&&typeof run==='object'&&!Array.isArray(run)?clone(run):null;
  const reality=normalizedRoute(route);
  const activity=normalizedActive(active);
  if(!r||!reality){
    return {schema:PRACTICE_LOOP_SCHEMA_ID,runtimeVersion:PRACTICE_LOOP_VERSION,phase:'idle',status:'idle',current:null,next:null,progress:{total:0,completed:0,dropped:0,remaining:0,position:0},action:{kind:'none',requiresPrompt:false},continuity:{resumeSafe:true,requiresPrompt:false,activeAuthoritative:false,preservesFlowIntent:true,preservesEncounterTruth:true},reasonCodes:['no-active-flow']};
  }
  const total=Math.max(0,Number(reality.counts?.total)||0);
  const completed=Math.max(0,Number(reality.counts?.completed)||0);
  const dropped=Math.max(0,Number(reality.counts?.dropped)||0);
  const remaining=Math.max(0,Number(reality.counts?.remaining)||0);
  const current=reality.current?clone(reality.current):null;
  const next=reality.next?clone(reality.next):null;
  const linkedId=text(r.currentEncounterId);
  const position=current&&total?Math.min(total,Math.max(1,total-remaining+1)):0;
  let phase='ready',action='start-current';
  const reasonCodes=[];
  if(r.status==='complete'||reality.status==='complete'||!current){
    phase='complete';action='none';reasonCodes.push('route-complete');
  }else if(linkedId){
    if(!activity||activity.id!==linkedId){
      phase='recovering';action='wait-for-active-owner';reasonCodes.push('linked-active-sync-pending');
    }else if(activity.status==='active'){
      phase='executing';action='none';reasonCodes.push('linked-active-authoritative');
    }else if(activity.status==='paused'){
      phase='paused';action='resume-current';reasonCodes.push('linked-active-paused');
    }else{
      phase='settling';action='settle-finished-current';reasonCodes.push('linked-active-finished');
    }
  }else if(r.lastCompletedAt&&r.gapStartedAt){
    phase='between-items';action='start-current';reasonCodes.push('previous-item-complete');
  }else{
    phase='ready';action='start-current';reasonCodes.push('current-ready');
  }
  if(reality.currentDeferred)reasonCodes.push('returning-deferred-item');
  if(Array.isArray(reality.reasonCodes))for(const code of reality.reasonCodes)if(!reasonCodes.includes(code))reasonCodes.push(code);
  if(!PHASES.has(phase))throw new Error('[AXIS Practice Loop] invalid phase '+phase);
  return {
    schema:PRACTICE_LOOP_SCHEMA_ID,
    runtimeVersion:PRACTICE_LOOP_VERSION,
    phase,
    status:phase==='complete'?'complete':'active',
    flowRef:text(r.flowRef||reality.flowRef),
    runRef:text(r.id),
    sessionRef:text(session?.id),
    current,
    next,
    active:activity,
    progress:{total,completed,dropped,remaining,position},
    action:{kind:action,requiresPrompt:false},
    continuity:{resumeSafe:true,requiresPrompt:false,activeAuthoritative:!!linkedId,preservesFlowIntent:true,preservesEncounterTruth:true},
    reasonCodes
  };
}
