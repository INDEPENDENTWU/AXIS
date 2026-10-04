/* AXIS 8.27 — Reality Route browser bridge.
 * Extends the established app-owned Flow runtime. It does not create a second
 * Flow/Session/Encounter/Active/recorder/storage owner.
 */
const axis827BaseResolvedCurrent=axis821ResolvedCurrent;
const axis827BaseLaunchFlow=axis821LaunchFlow;
const axis827BaseSkipFlow=axis821SkipFlow;
const axis827BaseAdvanceCompletedCurrent=axis821FlowAdvanceCompletedCurrent;
const axis827BaseFlowSurfaceRenderHome=axis821FlowSurfaceRenderHome;

function axis827RealityProjection(){
  axis821FlowState();
  const r=state.flowRun;
  if(!r||!Array.isArray(r.steps))return null;
  return axis827Core.projectRealityRoute({flowRef:r.flowRef,steps:r.steps,run:r,encounters:allEvents()});
}
function axis827SyncRealityRoute(){
  const r=state.flowRun,p=axis827RealityProjection();
  if(!r||!p)return p;
  if(p.current){
    r.status='active';
    const i=r.steps.findIndex(x=>x&&x.id===p.current.id);
    r.cursor=i<0?0:i;
  }else{
    r.status='complete';
    r.cursor=r.steps.length;
    r.completedAt=r.completedAt||Date.now();
    r.itemStartedAt=null;
    r.gapStartedAt=null;
  }
  return p;
}
function axis827CurrentStepRaw(){
  axis821FlowState();
  const r=state.flowRun,p=axis827RealityProjection();
  if(!r||r.status!=='active'||!p||!p.current)return null;
  return r.steps.find(x=>x&&x.id===p.current.id)||null;
}
function axis827ResolvedCurrent(){
  const out=axis827BaseResolvedCurrent();
  if(!out)return null;
  const route=axis827RealityProjection(),next=route&&route.next||null;
  out.resolverVersion='8.27';
  out.nextIntent=next?{stepRef:next.id,objectRef:next.objectRef}:null;
  out.realityRoute={
    schema:route&&route.schema||'axis.reality-route.v1',
    currentDeferred:!!(route&&route.currentDeferred),
    deferredCount:Number(route&&route.counts&&route.counts.deferred)||0,
    remainingCount:Number(route&&route.counts&&route.counts.remaining)||0,
    reasonCodes:Array.isArray(route&&route.reasonCodes)?route.reasonCodes.slice():[]
  };
  return out;
}
function axis827LaunchFlow(id){
  const out=axis827BaseLaunchFlow(id),r=state.flowRun;
  if(!r)return out;
  r.temporaryConstraints=axis827Core.normalizeExecutionConstraints(r.temporaryConstraints);
  axis827SyncRealityRoute();
  save();
  return axis821FlowClone(axis827ResolvedCurrent());
}
function axis827SkipFlow(){
  const step=axis827CurrentStepRaw();
  if(!step)return false;
  const ok=axis827BaseSkipFlow();
  if(!ok)return false;
  const r=state.flowRun;
  if(r&&r.temporaryConstraints&&Array.isArray(r.temporaryConstraints.deferredStepRefs))r.temporaryConstraints.deferredStepRefs=r.temporaryConstraints.deferredStepRefs.filter(x=>x!==step.id);
  const route=axis827SyncRealityRoute();
  if(route&&route.current){r.itemStartedAt=null;r.gapStartedAt=Date.now();r.suggestedGapMs=axis821FlowSuggestedGap(step.objectRef,route.current.objectRef)}
  save();
  return axis821FlowClone(axis827ResolvedCurrent())||true;
}
function axis827AdvanceCompletedCurrent(encounter,reason){
  const step=axis827CurrentStepRaw();
  if(!step)return false;
  const ok=axis827BaseAdvanceCompletedCurrent(encounter,reason||'complete');
  if(!ok)return false;
  const r=state.flowRun;
  if(r&&r.temporaryConstraints&&Array.isArray(r.temporaryConstraints.deferredStepRefs))r.temporaryConstraints.deferredStepRefs=r.temporaryConstraints.deferredStepRefs.filter(x=>x!==step.id);
  const route=axis827SyncRealityRoute();
  if(route&&route.current){
    r.itemStartedAt=null;
    r.gapStartedAt=Date.now();
    r.suggestedGapMs=axis821FlowSuggestedGap(step.objectRef,route.current.objectRef);
  }
  save();
  try{render()}catch{}
  axis821FlowSurfaceRenderHome();
  return true;
}
function axis827AdvanceFlow(){
  axis821FlowState();
  const r=state.flowRun,step=axis827CurrentStepRaw();
  if(!r||!step||!r.lastEncounterId)return false;
  const event=allEvents().find(e=>e.id===r.lastEncounterId);
  if(!event||!event.flowProvenance||event.flowProvenance.flowRef!==r.flowRef||event.flowProvenance.flowStepRef!==step.id)return false;
  return axis827AdvanceCompletedCurrent(event,'legacy-advance');
}
function axis827DeferCurrent(){
  axis821FlowState();
  const r=state.flowRun,p=axis827RealityProjection();
  if(!r||!p)return false;
  const result=axis827Core.deferRealityRouteCurrent({run:r,projection:p});
  if(!result.changed){
    if(result.reason==='active-item-cannot-defer')toast&&toast('当前项目已经开始');
    else if(result.reason==='already-deferred')toast&&toast('这一项已经稍后');
    return false;
  }
  state.flowRun=result.run;
  state.flowRun.lastEncounterId=null;
  state.flowRun.itemStartedAt=null;
  state.flowRun.gapStartedAt=null;
  state.flowRun.suggestedGapMs=null;
  axis827SyncRealityRoute();
  save();
  try{render()}catch{}
  axis821FlowSurfaceRenderHome();
  try{window.dispatchEvent(new CustomEvent('axis:reality-route-changed',{detail:{flowRef:state.flowRun.flowRef,stepRef:result.stepRef,reason:result.reason}}))}catch{}
  return axis821FlowClone(axis827RealityProjection());
}
function axis827DecorateFlowSurface(){
  const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();
  const run=api&&api.run&&api.run(),route=api&&api.project&&api.project(),ctx=api&&api.current&&api.current();
  if(!host||!run||run.status!=='active'||!route||!ctx)return;
  const currentDeferred=route.currentDeferred===true,deferred=Number(route.counts&&route.counts.deferred)||0,next=route.next?axis821FlowSurfaceName(route.next.objectRef):'';
  if(!run.currentEncounterId){
    host.dataset.substate=currentDeferred?'deferred-return':'waiting';
    const lead=host.querySelector('.axis821FlowRunLead');
    const small=lead&&lead.querySelector('small'),tail=lead&&lead.querySelector('span');
    if(small)small.textContent=currentDeferred?'稍后项目 · 回到这里':'当前项目';
    if(tail)tail.textContent=(next?'接下来 · '+next:'最后一项')+(deferred&&!currentDeferred?' · 稍后 '+deferred+' 项':'');
    const primary=host.querySelector('[data-axis-flow-record]');
    if(primary)primary.textContent=currentDeferred?'开始稍后项':'开始此项';
    const actions=host.querySelector('.axis821FlowRunSecondary:not(.executing)');
    const old=actions&&actions.querySelector('[data-axis-flow-defer]');
    if(currentDeferred&&old)old.remove();
    if(actions&&!currentDeferred&&!old){
      const b=D.createElement('button');b.setAttribute('data-axis-flow-defer','');b.textContent='稍后';
      const skip=actions.querySelector('[data-axis-flow-skip]');actions.insertBefore(b,skip||actions.firstChild);
    }
  }
  const queue=host.querySelector('.axis821FlowQueue'),upcoming=(route.remaining||[]).slice(1);
  if(queue&&!upcoming.length)queue.remove();
  else if(upcoming.length){
    let q=queue;
    if(!q){q=D.createElement('div');q.className='axis821FlowQueue';const timeline=host.querySelector('.axis821FlowTimeline');host.insertBefore(q,timeline||null)}
    q.innerHTML='<div class="axis821FlowSectionHead"><b>接下来</b><span>'+upcoming.length+' 项</span></div>'+upcoming.map((x,i)=>{
      const step=(run.steps||[]).find(s=>s&&s.id===x.id)||x;
      const later=(route.deferred||[]).some(d=>d.id===x.id)?' · 稍后':'';
      return '<div class="axis821FlowQueueRow"><i>'+String(i+2).padStart(2,'0')+'</i><span><b>'+esc(axis821FlowSurfaceName(x.objectRef))+'</b><small>'+axis821FlowApprox(Number(step.expectedDurationMs)||axis821FlowExpectedForObject(x.objectRef))+later+'</small></span></div>';
    }).join('');
  }
}
function axis827FlowSurfaceRenderHome(){
  const out=axis827BaseFlowSurfaceRenderHome();
  axis827DecorateFlowSurface();
  return out;
}
function axis827FlowSurfaceDefer(){
  const api=axis821FlowSurfaceApi(),run=api&&api.run&&api.run(),route=api&&api.project&&api.project();
  if(!api||!run||run.status!=='active'||run.currentEncounterId||route&&route.currentDeferred)return false;
  const result=api.deferCurrent&&api.deferCurrent();
  if(!result)return false;
  axis821FlowSurfaceRenderHome();
  toast&&toast('已放到稍后');
  return true;
}

axis821CurrentStepRaw=axis827CurrentStepRaw;
axis821ResolvedCurrent=axis827ResolvedCurrent;
axis821LaunchFlow=axis827LaunchFlow;
axis821SkipFlow=axis827SkipFlow;
axis821AdvanceFlow=axis827AdvanceFlow;
axis821FlowAdvanceCompletedCurrent=axis827AdvanceCompletedCurrent;
axis821FlowSurfaceRenderHome=axis827FlowSurfaceRenderHome;

if(window.__AXIS_FLOW_RUNTIME__){
  window.__AXIS_FLOW_RUNTIME__.launch=axis827LaunchFlow;
  window.__AXIS_FLOW_RUNTIME__.current=function(){return axis821FlowClone(axis827ResolvedCurrent())};
  window.__AXIS_FLOW_RUNTIME__.project=function(){return axis821FlowClone(axis827RealityProjection())};
  window.__AXIS_FLOW_RUNTIME__.deferCurrent=axis827DeferCurrent;
  window.__AXIS_FLOW_RUNTIME__.skip=axis827SkipFlow;
  window.__AXIS_FLOW_RUNTIME__.advance=axis827AdvanceFlow;
}
D.addEventListener('click',function(e){
  const t=e.target&&e.target.closest&&e.target.closest('[data-axis-flow-defer]');
  if(!t)return;
  e.preventDefault();
  e.stopImmediatePropagation();
  axis827FlowSurfaceDefer();
},true);

window.__AXIS_827_REALITY_ROUTE__={version:'8.27',schema:'axis.reality-route.v1',constraintSchema:'axis.execution-constraints.v1',owner:'lib/axis-reality-route.mjs',bridgeOwner:'existing-app-flowRun',deferAction:'temporary-current-item',flowDefinitionMutation:false,historicalEncounterRewrite:false,newStorage:false,newSessionWriter:false,newEncounterWriter:false,newRecorder:false,newActiveOwner:false,network:false,ai:false};
