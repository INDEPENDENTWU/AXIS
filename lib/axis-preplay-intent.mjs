/**
 * AXIS prospective practice intent. No Encounter, Session, Active or Flow writer.
 * Pure, replayable state machine; a saved Encounter is always a separate commit.
 */
export const AXIS_PREPLAY_SCHEMA='axis.preplay-intent.v1';
const goodId=s=>typeof s==='string'&&s.trim().length>0&&s.length<=128;
const finiteMs=n=>Number.isFinite(n)&&n>=0&&n<=30*864e5;
const statuses=new Set(['running','paused','review']);
const modes=new Set(['single','sets','rounds','timed','hold','complete']);
export function axisPreplayValidate(p){
  if(!p||typeof p!=='object'||Array.isArray(p)||p.schema!==AXIS_PREPLAY_SCHEMA||
    !goodId(p.attemptId)||!goodId(p.objectId)||!modes.has(p.mode)||
    !statuses.has(p.status)||!Number.isSafeInteger(p.createdAt)||p.createdAt<0||
    !finiteMs(p.elapsedMs)||!Number.isInteger(p.completedSets)||p.completedSets<0||
    !Number.isInteger(p.repeat)||p.repeat<1||p.repeat>99||
    p.completedSets>99||typeof p.handoff!=='boolean')throw Error('invalid prospective practice intent');
  if(p.status==='running'&&(!Number.isSafeInteger(p.resumedAt)||p.resumedAt<p.createdAt))
    throw Error('invalid running clock');
  if(p.status!=='running'&&p.resumedAt!==null)throw Error('nonrunning clock must be closed');
  return p;
}
export function axisPreplayCreate({attemptId,objectId,mode,repeat=1,now}={}){
  if(!goodId(attemptId)||!goodId(objectId)||!modes.has(mode)||
    !Number.isInteger(repeat)||repeat<1||repeat>99||!Number.isSafeInteger(now)||now<0)
    throw Error('invalid practice start');
  return axisPreplayValidate({schema:AXIS_PREPLAY_SCHEMA,attemptId,objectId,mode,repeat,
    createdAt:now,status:'running',elapsedMs:0,resumedAt:now,completedSets:0,handoff:false});
}
export function axisPreplayElapsed(input,now){
  const p=axisPreplayValidate(input);
  if(!Number.isFinite(now)||now<p.createdAt)throw Error('invalid clock');
  return Math.max(0,p.elapsedMs+(p.status==='running'?Math.max(0,now-p.resumedAt):0));
}
export function axisPreplayTransition(input,action,now){
  const p=axisPreplayValidate(input);
  if(!Number.isSafeInteger(now)||now<p.createdAt)throw Error('invalid transition time');
  if(action==='pause'&&p.status==='running')
    return axisPreplayValidate({...p,status:'paused',elapsedMs:axisPreplayElapsed(p,now),resumedAt:null});
  if(action==='resume'&&p.status==='paused')
    return axisPreplayValidate({...p,status:'running',resumedAt:now});
  if(action==='complete-set'&&p.status==='running'&&['sets','rounds'].includes(p.mode))
    return axisPreplayValidate({...p,completedSets:Math.min(99,p.completedSets+1)});
  if(action==='review'&&['running','paused'].includes(p.status))
    return axisPreplayValidate({...p,status:'review',elapsedMs:axisPreplayElapsed(p,now),resumedAt:null});
  if(action==='back'&&p.status==='review')
    return axisPreplayValidate({...p,status:'paused',resumedAt:null,handoff:false});
  if(action==='handoff'&&p.status==='review')
    return axisPreplayValidate({...p,handoff:true});
  throw Error('transition not admitted: '+action);
}
