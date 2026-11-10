/* AXIS timed/cardio v1: prospective clock is NOT evidence of exercise.
   A cardio Encounter is written only after explicit review confirmation. */
export const AXIS_TIMED_SCHEMA='axis.play-timed.v1';
const axisTimedPhases=new Set(['running','paused','review']);
const axisTimedInt=(x,min,max)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
export function axisTimedValidate(p){
 if(!p||p.schema!==AXIS_TIMED_SCHEMA||typeof p.attemptId!=='string'||!p.attemptId||
 typeof p.objectId!=='string'||!p.objectId||!axisTimedPhases.has(p.phase)||
 !axisTimedInt(p.startedAt,0,Number.MAX_SAFE_INTEGER)||
 (p.resumedAt!==null&&!axisTimedInt(p.resumedAt,p.startedAt,Number.MAX_SAFE_INTEGER))||
 !axisTimedInt(p.elapsedMs,0,30*86400000)||!axisTimedInt(p.revision,0,100000))
 throw Error('invalid timed draft');
 if((p.phase==='running')!==(p.resumedAt!==null))throw Error('invalid timed clock');
 return p;
}
export function axisTimedCreate({attemptId,objectId,at}){
 return axisTimedValidate({schema:AXIS_TIMED_SCHEMA,attemptId,objectId,startedAt:at,
  phase:'running',resumedAt:at,elapsedMs:0,revision:0});
}
export function axisTimedElapsed(p,now){
 axisTimedValidate(p);
 if(!axisTimedInt(now,p.startedAt,Number.MAX_SAFE_INTEGER))throw Error('invalid timed clock time');
 return p.elapsedMs+(p.phase==='running'?Math.max(0,now-p.resumedAt):0);
}
export function axisTimedUpdate(p,action,now){
 axisTimedValidate(p);
 if(!axisTimedInt(now,p.startedAt,Number.MAX_SAFE_INTEGER))throw Error('invalid transition time');
 const rev={...p,revision:p.revision+1};
 if(action==='pause'&&p.phase==='running')
  return axisTimedValidate({...rev,phase:'paused',elapsedMs:axisTimedElapsed(p,now),resumedAt:null});
 if(action==='resume'&&p.phase==='paused')
  return axisTimedValidate({...rev,phase:'running',resumedAt:now});
 if(action==='finish'&&['paused','running'].includes(p.phase))
  return axisTimedValidate({...rev,phase:'review',elapsedMs:axisTimedElapsed(p,now),resumedAt:null});
 if(action==='back'&&p.phase==='review')
  return axisTimedValidate({...rev,phase:'paused',resumedAt:null});
 throw Error('invalid timed action');
}
export function axisTimedOutcome(p,now,actual){
 axisTimedValidate(p);
 if(p.phase!=='review')throw Error('time was not reviewed');
 const m=Number(actual?.minutes),intensity=Number(actual?.intensity);
 if(!Number.isFinite(m)||m<0.1||m>600||Math.round(m*10)!==m*10||
 !axisTimedInt(intensity,1,10))throw Error('actual time and user-selected intensity required');
 if(!axisTimedInt(now,p.startedAt,Number.MAX_SAFE_INTEGER))throw Error('invalid save time');
 return Object.freeze({schema:'axis.play-timed-outcome.v1',attemptId:p.attemptId,
  objectId:p.objectId,startedAt:p.startedAt,finishedAt:now,elapsedMs:p.elapsedMs,
  actualDurationMinutes:m,intensity,facts:'explicitly-confirmed-user-results'});
}
