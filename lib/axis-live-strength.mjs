/* AXIS PLAY THIS strength P2 — prospective actions are not persisted Encounters. */
export const AXIS_STRENGTH_SCHEMA='axis.play-strength.v1';
const phases=new Set(['running','paused','rest','review']);
const int=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const validMetric=(w,r)=>Number.isFinite(w)&&w>=0&&w<=1000&&Number.isInteger(r)&&r>=1&&r<=500;
export function axisStrengthValidate(p){
 if(!p||p.schema!==AXIS_STRENGTH_SCHEMA||typeof p.attemptId!=='string'||!p.attemptId||
 typeof p.objectId!=='string'||!p.objectId||!phases.has(p.phase)||
 !int(p.startedAt,0,Number.MAX_SAFE_INTEGER)||!int(p.resumedAt??0,0,Number.MAX_SAFE_INTEGER)||
 !int(p.elapsedMs,0,30*86400000)||!int(p.targetSets,1,20)||
 !int(p.restSeconds,0,600)||!Array.isArray(p.sets)||p.sets.length>99||
 !int(p.revision,0,100000)||!int(p.restStartedAt??0,0,Number.MAX_SAFE_INTEGER))throw Error('invalid strength draft');
 if(p.sets.some((x,i)=>x.index!==i+1||!validMetric(x.weight,x.reps)||!int(x.at,0,Number.MAX_SAFE_INTEGER)))
  throw Error('invalid actual sets');
 if(['running','rest'].includes(p.phase)&&p.resumedAt===null)throw Error('running clock missing');
 if(['paused','review'].includes(p.phase)&&p.resumedAt!==null)throw Error('paused/review clock not closed');
 if(p.phase==='rest'&&p.restStartedAt===null)throw Error('rest clock missing');
 return p;
}
export function axisStrengthCreate({attemptId,objectId,at,targetSets=3,restSeconds=90}){
 return axisStrengthValidate({schema:AXIS_STRENGTH_SCHEMA,attemptId,objectId,startedAt:at,
  phase:'running',resumedAt:at,elapsedMs:0,targetSets,restSeconds,sets:[],restStartedAt:null,revision:0});
}
export function axisStrengthElapsed(p,at){
 axisStrengthValidate(p);
 if(!int(at,p.startedAt,Number.MAX_SAFE_INTEGER))throw Error('invalid timestamp');
 return p.elapsedMs+(['running','rest'].includes(p.phase)?Math.max(0,at-p.resumedAt):0);
}
export function axisStrengthRestLeft(p,at){
 axisStrengthValidate(p);
 return p.phase==='rest'?Math.max(0,p.restSeconds-Math.floor((at-p.restStartedAt)/1000)):0;
}
export function axisStrengthUpdate(p,action,at,payload={}){
 axisStrengthValidate(p);
 if(!int(at,p.startedAt,Number.MAX_SAFE_INTEGER))throw Error('invalid timestamp');
 const rev={...p,revision:p.revision+1};
 if(action==='plan'&&p.sets.length===0&&['running','paused'].includes(p.phase)){
   if(!int(payload.targetSets,1,20)||!int(payload.restSeconds,0,600))throw Error('invalid plan');
   return axisStrengthValidate({...rev,targetSets:payload.targetSets,restSeconds:payload.restSeconds});
 }
 if(action==='pause'&&p.phase==='running')return axisStrengthValidate({...rev,phase:'paused',resumedAt:null,elapsedMs:axisStrengthElapsed(p,at)});
 if(action==='resume'&&p.phase==='paused')return axisStrengthValidate({...rev,phase:'running',resumedAt:at});
 if(action==='confirm-set'&&p.phase==='running'){
   if(payload.expectedIndex!==p.sets.length+1)throw Error('stale set confirmation');
   const w=Number(payload.weight),r=Number(payload.reps);
   if(!validMetric(w,r))throw Error('actual metrics required');
   const sets=[...p.sets,{index:p.sets.length+1,weight:w,reps:r,at}];
   const elapsed=axisStrengthElapsed(p,at);
   if(sets.length>=p.targetSets)return axisStrengthValidate({...rev,sets,phase:'review',elapsedMs:elapsed,resumedAt:null,restStartedAt:null});
   if(p.restSeconds===0)return axisStrengthValidate({...rev,sets,phase:'running',elapsedMs:elapsed,resumedAt:at});
   return axisStrengthValidate({...rev,sets,phase:'rest',elapsedMs:elapsed,resumedAt:at,restStartedAt:at});
 }
 if(action==='rest-done'&&p.phase==='rest')return axisStrengthValidate({...rev,phase:'running',elapsedMs:axisStrengthElapsed(p,at),resumedAt:at,restStartedAt:null});
 if(action==='finish'&&['running','paused','rest'].includes(p.phase))
   return axisStrengthValidate({...rev,phase:'review',elapsedMs:axisStrengthElapsed(p,at),resumedAt:null,restStartedAt:null});
 if(action==='back'&&p.phase==='review')return axisStrengthValidate({...rev,phase:'paused',resumedAt:null});
 if(action==='edit-set'&&p.phase==='review'){
   if(!int(payload.index,1,p.sets.length))throw Error('invalid review row');
   const w=Number(payload.weight),r=Number(payload.reps);
   if(!validMetric(w,r))throw Error('invalid corrected actual metrics');
   return axisStrengthValidate({...rev,sets:p.sets.map(s=>s.index===payload.index?{...s,weight:w,reps:r}:s)});
 }
 throw Error('not admitted: '+action);
}
export function axisStrengthOutcome(p,at){
 axisStrengthValidate(p);
 if(p.phase!=='review'||!p.sets.length)throw Error('actual performance required');
 const actual=p.sets.map(s=>({index:s.index,weight:s.weight,reps:s.reps,at:s.at}));
 const last=actual.at(-1);
 return Object.freeze({schema:'axis.play-strength-outcome.v1',attemptId:p.attemptId,objectId:p.objectId,
  startedAt:p.startedAt,finishedAt:at,elapsedMs:p.elapsedMs,actualSets:actual,
  summary:{sets:actual.length,weight:last.weight,reps:last.reps},
  facts:'explicitly-confirmed-user-actions'});
}
