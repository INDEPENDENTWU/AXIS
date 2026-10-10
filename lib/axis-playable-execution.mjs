/* AXIS 8.31 — deterministic intent projection. No storage, time, network or fact writer. */
export const PLAYABLE_EXECUTION_SCHEMA='axis.playable-execution.v1';
const playableFail=m=>{throw new Error('[AXIS playable execution] '+m)};
const playableId=(v,k)=>{if(typeof v!=='string'||!v.trim()||v.length>128||/[\u0000-\u001f\u007f]/.test(v))playableFail(k+' must be a stable bounded ID');return v};
const playablePlain=(v,k)=>{if(!v||typeof v!=='object'||Array.isArray(v)||Object.getPrototypeOf(v)!==Object.prototype)playableFail(k+' must be a plain object');return v};
const playableClone=v=>v==null?v:JSON.parse(JSON.stringify(v));
const playableImmutable=v=>{if(v&&typeof v==='object'){for(const x of Object.values(v))playableImmutable(x);Object.freeze(v)}return v};
function playableSpecCheck(spec){
 playablePlain(spec,'spec');
 if(spec.schema!=='axis.playable.v1'||!Array.isArray(spec.steps)||spec.steps.length<1||spec.steps.length>32)playableFail('invalid PlayableSpec');
 playableId(spec.id,'spec ID');
 if(!spec.source||!['flow','object'].includes(spec.source.kind))playableFail('unsupported source kind');
 playableId(spec.source.ref,'source ref');
 const seen=new Set();
 for(const step of spec.steps){playablePlain(step,'step');playableId(step.id,'step ID');playableId(step.objectRef,'step Object ID');if(seen.has(step.id))playableFail('duplicate step ID');seen.add(step.id);if(!Number.isInteger(step.repeat)||step.repeat<1||step.repeat>99)playableFail('unbounded repeat');}
 if(spec.source.kind==='object'&&(spec.steps.length!==1||spec.steps[0].objectRef!==spec.source.ref))playableFail('Object origin changed');
}
function playableOwnerCheck(owner){if(owner==null)return {};return playablePlain(owner,'owner')}
function playableEventMatch(entry,run,step){
 if(!entry||typeof entry!=='object'||typeof entry.id!=='string'||entry.id!==run.lastEncounterId)return false;
 const p=entry.flowProvenance;
 return !!p&&p.schema==='axis.flow-provenance.v1'&&p.flowRef===run.flowRef&&p.flowStepRef===step.id&&p.objectRef===step.objectRef&&entry.equipmentId===step.objectRef;
}
/** Rendering projection from existing canonical owner snapshots; no new current-fact state. */
export function projectPlayableExecution({spec,owner,attemptId}={}){
 playableSpecCheck(spec);playableId(attemptId,'attempt ID');
 const o=playableOwnerCheck(owner);
 const base={schema:PLAYABLE_EXECUTION_SCHEMA,playableId:spec.id,attemptId,sourceKind:spec.source.kind,sourceRef:spec.source.ref,phase:'ready',cursor:0,stepRef:spec.steps[0].id,objectRef:spec.steps[0].objectRef,canRequest:'select',evidenceId:null,reasonCodes:[]};
 if(spec.source.kind==='object'){
  // Pure Object selection is not a workout fact. Without a canonical provenance
  // hook, no old same-name/ID Encounter may assert this attempt completed.
  if(o.active&&o.active.status==='active'&&o.active.objectRef!==spec.source.ref){base.phase='blocked';base.canRequest='none';base.reasonCodes=['foreign-active-owner'];return playableImmutable(base)}
 if(o.selectedObjectId===spec.source.ref){base.phase='selected';base.canRequest='none';base.reasonCodes=['selection-is-not-completion']}
  else base.reasonCodes=['requires-canonical-selection'];
  if(o.active&&o.active.status==='active'&&o.active.objectRef===spec.source.ref){base.phase='executing';base.canRequest='none';base.reasonCodes=['existing-active-authoritative']}
  return playableImmutable(base);
 }
 const run=o.flowRun;
 if(!run){base.canRequest='launch';base.reasonCodes=['existing-flow-owner-required'];return playableImmutable(base)}
 playablePlain(run,'Flow run');
 if(run.flowRef!==spec.source.ref){base.phase='blocked';base.canRequest='none';base.reasonCodes=['foreign-flow-run'];return playableImmutable(base)}
 if(!Array.isArray(run.steps)||run.steps.length!==spec.steps.length||run.steps.some((s,i)=>s.id!==spec.steps[i].id||s.objectRef!==spec.steps[i].objectRef)){base.phase='blocked';base.canRequest='none';base.reasonCodes=['flow-run-definition-drift'];return playableImmutable(base)}
 const pos=Number(run.cursor);
 if(!Number.isInteger(pos)||pos<0||pos>spec.steps.length){base.phase='blocked';base.canRequest='none';base.reasonCodes=['invalid-canonical-cursor'];return playableImmutable(base)}
 base.cursor=pos;
 base.stepRef=spec.steps[pos]?.id??null;
 base.objectRef=spec.steps[pos]?.objectRef??null;
 if(run.status==='complete'&&pos===spec.steps.length&&Array.isArray(run.consumedStepRefs)&&spec.steps.every(s=>run.consumedStepRefs.includes(s.id))){
  const completeFacts=Array.isArray(o.encounters)&&Number.isFinite(run.startedAt)&&spec.steps.every(step=>o.encounters.some(event=>event?.equipmentId===step.objectRef&&Number.isFinite(event.time)&&event.time>=run.startedAt&&event.flowProvenance?.schema==='axis.flow-provenance.v1'&&event.flowProvenance?.flowRef===run.flowRef&&event.flowProvenance?.flowStepRef===step.id&&event.flowProvenance?.objectRef===step.objectRef));
  if(!completeFacts){base.phase='blocked';base.canRequest='none';base.reasonCodes=['completed-flow-evidence-unavailable'];return playableImmutable(base)}
  base.phase='complete';base.canRequest='none';base.reasonCodes=['canonical-flow-complete'];return playableImmutable(base);
 }
 if(run.status!=='active'||!base.stepRef){base.phase='blocked';base.canRequest='none';base.reasonCodes=['canonical-flow-not-active'];return playableImmutable(base)}
 const current=o.flowCurrent;
 if(!current||current.flowRef!==run.flowRef||current.stepRef!==base.stepRef||current.objectRef!==base.objectRef||current.missingObject){
  base.phase='blocked';base.canRequest='none';base.reasonCodes=['current-owner-not-converged'];return playableImmutable(base);
 }
 if(run.lastEncounterId){
  const events=Array.isArray(o.encounters)?o.encounters:[];
  const matching=events.find(e=>playableEventMatch(e,run,spec.steps[pos]));
  if(matching){base.phase='ready-to-advance';base.canRequest='advance';base.evidenceId=matching.id;base.reasonCodes=['confirmed-canonical-encounter']}
  else{base.phase='awaiting-evidence';base.canRequest='none';base.reasonCodes=['last-encounter-unverified']}
 }else{
  base.phase='awaiting-fact';base.canRequest='select-current';base.reasonCodes=['canonical-fact-required'];
  if(o.active&&o.active.status==='active') {base.phase=o.active.objectRef===base.objectRef?'executing':'blocked';base.canRequest='none';base.reasonCodes=[base.phase==='executing'?'active-owner-holds-execution':'foreign-active-owner']}
 }
 return playableImmutable(base);
}
/** A command is advisory until an *existing* owner executes and confirms it. */
export function planPlayableCommand({projection,action,requestId}={}){
 playablePlain(projection,'projection');
 if(projection.schema!==PLAYABLE_EXECUTION_SCHEMA)playableFail('unknown projection');
 playableId(projection.attemptId,'attempt ID');playableId(projection.playableId,'playable ID');
 playableId(requestId,'request ID');
 if(!['select','launch','select-current','advance'].includes(action))playableFail('unknown action');
 if(projection.canRequest!==action) return playableImmutable({ok:false,reason:'owner-state-not-ready',phase:projection.phase});
 if(projection.stepRef!=null)playableId(projection.stepRef,'step ID');
 if(projection.objectRef!=null)playableId(projection.objectRef,'Object ID');
 const key=projection.attemptId+'/'+projection.playableId+'/'+String(projection.cursor)+'/'+action+'/'+(projection.evidenceId||'none');
 return playableImmutable({ok:true,schema:'axis.playable-command.v1',action,requestId,commandKey:key,playableId:projection.playableId,attemptId:projection.attemptId,sourceKind:projection.sourceKind,sourceRef:projection.sourceRef,cursor:projection.cursor,stepRef:projection.stepRef,objectRef:projection.objectRef,evidenceId:projection.evidenceId});
}
function playableSnapshot(owner){
 if(!owner||typeof owner!=='object')playableFail('explicit owner adapter required');
 const snap=owner.snapshot?.();
 if(!snap)playableFail('owner snapshot unavailable');
 return snap;
}
/** Safe caller-owned dispatch; no Encounter, Session, Active or persistence writes. */
export function dispatchPlayableCommand({spec,attemptId,command,owner}={}){
 playablePlain(command,'command');
 if(command.schema!=='axis.playable-command.v1'||command.ok!==true)playableFail('unadmitted command');
 const snap=playableSnapshot(owner);
 const projection=projectPlayableExecution({spec,owner:snap,attemptId});
 const expected=planPlayableCommand({projection,action:command.action,requestId:command.requestId});
 if(!expected.ok||['schema','action','requestId','commandKey','playableId','attemptId','sourceKind','sourceRef','cursor','stepRef','objectRef','evidenceId'].some(key=>expected[key]!==command[key]))return {status:'stale',reason:'owner-state-changed'};
 if(!owner||typeof owner.dispatch!=='function')playableFail('existing owner dispatch unavailable');
 // Owner checks actual run, ID, confirmation and duplicate conditions again.
 const result=owner.dispatch(playableClone(command),playableClone(projection),playableClone(spec));
 return {status:result===true?'accepted':'not-confirmed',reason:result===true?'delegated-to-canonical-owner':'owner-rejected'};
}
