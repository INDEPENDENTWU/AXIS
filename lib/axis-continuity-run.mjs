/**
 * AXIS continuity plan v1 — only an intent/sequence, never a record of exercise.
 * Source exercises come from a real completed Encounter session; nothing invented.
 */
export const AXIS_CONTINUITY_SCHEMA='axis.continuity-run.v1';
const idOK=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const axisContInt=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const stages=new Set(['running','between','complete','done']);
export function axisContinuityPlan(sessions,resolve){
 if(!Array.isArray(sessions))return null;
 for(const s of sessions){
  if(!s||!Array.isArray(s.events))continue;
  const seen=new Set(),ids=[];
  for(const e of s.events){
   if(!idOK(e?.equipmentId)||seen.has(e.equipmentId)||!['strength','cardio'].includes(e.kind))continue;
   if(resolve(e.equipmentId)?.type!==e.kind)continue;
   seen.add(e.equipmentId);ids.push(e.equipmentId);
   if(ids.length===5)break;
  }
  if(ids.length)return {sourceId:idOK(s.id)?s.id:null,sourceAt:s.end||s.start||0,objectIds:ids};
 }
 return null;
}
export function axisContinuityCreate({id,objectIds,mode='full',sourceId=null,now}){
 if(!idOK(id)||!Array.isArray(objectIds)||!['full','short'].includes(mode)||
  !axisContInt(now,0,Number.MAX_SAFE_INTEGER))throw Error('invalid continuity start');
 const all=objectIds.filter(idOK);
 if(all.length<1||all.length>5||new Set(all).size!==all.length)throw Error('invalid source plan');
 const steps=mode==='short'?all.slice(0,Math.min(all.length,2)):all;
 return axisContinuityValidate({schema:AXIS_CONTINUITY_SCHEMA,id,sourceId,createdAt:now,mode,
  steps,index:0,stage:'running',facts:[],skipped:[],sessionId:null});
}
export function axisContinuityValidate(p){
 if(!p||p.schema!==AXIS_CONTINUITY_SCHEMA||!idOK(p.id)||
 !axisContInt(p.createdAt,0,Number.MAX_SAFE_INTEGER)||!['full','short'].includes(p.mode)||
 !Array.isArray(p.steps)||p.steps.length<1||p.steps.length>5||
 p.steps.some(x=>!idOK(x))||new Set(p.steps).size!==p.steps.length||
 !axisContInt(p.index,0,p.steps.length)||!stages.has(p.stage)||
 !Array.isArray(p.facts)||!Array.isArray(p.skipped)||p.facts.length>p.steps.length||
 p.skipped.length>p.steps.length||(p.sessionId!==null&&!idOK(p.sessionId)))
 throw Error('invalid continuity draft');
 const indexes=[...p.facts.map(x=>x.index),...p.skipped];
 if(indexes.some(i=>!axisContInt(i,0,p.steps.length-1))||new Set(indexes).size!==indexes.length||
 p.facts.some(x=>!idOK(x.eventId)||x.objectId!==p.steps[x.index]||!axisContInt(x.sets,0,99)))
 throw Error('invalid continuity facts');
 if(p.stage==='done'&&p.index!==p.steps.length)throw Error('invalid completed index');
 return p;
}
export function axisContinuityRecorded(p,event){
 axisContinuityValidate(p);
 const meta=event?.playThis?.continuity;
 if(p.stage!=='running'||meta?.runId!==p.id||meta?.stepIndex!==p.index||
 event.equipmentId!==p.steps[p.index]||!idOK(event.id)||
 !((event.kind==='strength'&&Array.isArray(event.playThis?.actualSets)&&event.playThis.actualSets.length>0)||
   (event.kind==='cardio'&&Number.isFinite(Number(event.playThis?.actualDurationMinutes))&&Number(event.playThis.actualDurationMinutes)>0)))
 throw Error('nonmatching confirmed Encounter');
 if(p.facts.some(x=>x.eventId===event.id))return p;
 const facts=[...p.facts,{index:p.index,objectId:event.equipmentId,eventId:event.id,sets:event.kind==='strength'?event.playThis.actualSets.length:0}];
 return axisContinuityValidate({...p,facts,stage:p.index+1===p.steps.length?'complete':'between',
  index:p.index+1});
}
export function axisContinuitySkip(p){
 axisContinuityValidate(p);
 if(p.stage!=='running')throw Error('cannot skip current step');
 return axisContinuityValidate({...p,skipped:[...p.skipped,p.index],
  index:p.index+1,stage:p.index+1===p.steps.length?'complete':'between'});
}
export function axisContinuityNext(p){
 axisContinuityValidate(p);
 if(p.stage!=='between')throw Error('not between steps');
 return axisContinuityValidate({...p,stage:'running'});
}
export function axisContinuityDone(p,sessionId){
 axisContinuityValidate(p);
 if(p.stage!=='complete'||(sessionId!==null&&!idOK(sessionId)))throw Error('cannot finish');
 return axisContinuityValidate({...p,index:p.steps.length,stage:'done',sessionId});
}
