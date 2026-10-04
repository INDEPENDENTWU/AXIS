/* AXIS 8.27 — Reality Route browser bridge.
 * Derived execution projection only. Existing app.js FlowRun remains the owner.
 */
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
  }
  return p;
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
  axis827SyncRealityRoute();
  state.flowRun.itemStartedAt=Date.now();
  save();
  try{render()}catch{}
  if(typeof axis821FlowSurfaceRenderHome==='function')axis821FlowSurfaceRenderHome();
  try{window.dispatchEvent(new CustomEvent('axis:reality-route-changed',{detail:{flowRef:state.flowRun.flowRef,stepRef:result.stepRef,reason:result.reason}}))}catch{}
  return axis821FlowClone(axis827RealityProjection());
}
function axis827CurrentStepRaw(){
  axis821FlowState();
  const r=state.flowRun,p=axis827RealityProjection();
  if(!r||r.status!=='active'||!p||!p.current)return null;
  return r.steps.find(x=>x&&x.id===p.current.id)||null;
}
function axis827ResolvedCurrent(){
  const step=axis827CurrentStepRaw();
  if(!step)return null;
  const eq=axis818Eq(step.objectRef),route=axis827RealityProjection();
  if(!eq)return{schema:'axis.resolved-flow-step.v1',resolverVersion:'8.27',flowRef:state.flowRun.flowRef,stepRef:step.id,objectRef:step.objectRef,missingObject:true};
  const schema=axis821SchemaForRecording(eq);
  const objectHasSchema=Array.isArray(eq.metricSchema)&&eq.metricSchema.length>0;
  const metricOverride=!!axis821OverrideSchema(step);
  const metricSource=metricOverride?'flow-step-override':objectHasSchema?'object':'legacy-compatibility';
  const explicitMode=axis821FlowText(eq.executionMode||eq.recording&&eq.recording.executionMode);
  const executionSource=step.executionOverride?'flow-step-override':AXIS821_FLOW_MODES.has(explicitMode)||objectHasSchema?'object':metricOverride?'flow-step-override':'legacy-compatibility';
  const next=route&&route.next||null;
  return{
    schema:'axis.resolved-flow-step.v1',
    resolverVersion:'8.27',
    flowRef:state.flowRun.flowRef,
    stepRef:step.id,
    objectRef:step.objectRef,
    effectiveMetricSchema:schema.map(axis818CloneMetric),
    effectiveExecutionMode:axis821ExecutionForRecording(eq),
    repeat:Number(step.repeat)||1,
    overrideProvenance:{metricSchema:metricSource,executionMode:executionSource,temporary:metricSource==='flow-step-override'||executionSource==='flow-step-override'},
    nextIntent:next?{stepRef:next.id,objectRef:next.objectRef}:null,
    realityRoute:{schema:route&&route.schema||'axis.reality-route.v1',currentDeferred:!!(route&&route.currentDeferred),deferredCount:Number(route&&route.counts&&route.counts.deferred)||0,remainingCount:Number(route&&route.counts&&route.counts.remaining)||0,reasonCodes:Array.isArray(route&&route.reasonCodes)?route.reasonCodes.slice():[]}
  };
}
function axis827LaunchFlow(id){
  const flow=axis821FlowById(id);
  if(!flow)return null;
  const startedAt=Date.now(),steps=axis821FlowClone(flow.steps);
  if(!state.active)state.active={id:uid('S'),start:startedAt,events:[]};
  state.flowRun={schema:'axis.flow-run.v1',id:uid('FR'),flowRef:flow.id,startedAt:startedAt,status:'active',cursor:0,steps:steps,consumedStepRefs:[],skippedStepRefs:[],lastEncounterId:null,currentEncounterId:null,currentStepRef:null,itemStartedAt:startedAt,temporaryConstraints:{schema:'axis.execution-constraints.v1',deferredStepRefs:[]}};
  axis827SyncRealityRoute();
  save();
  try{render()}catch{}
  return axis821FlowClone(axis827ResolvedCurrent());
}
function axis827SkipFlow(){
  axis821FlowState();
  const r=state.flowRun,step=axis827CurrentStepRaw();
  if(!r||!step||r.currentEncounterId)return false;
  r.skippedStepRefs=[].concat(r.skippedStepRefs||[],step.id);
  if(r.temporaryConstraints&&Array.isArray(r.temporaryConstraints.deferredStepRefs))r.temporaryConstraints.deferredStepRefs=r.temporaryConstraints.deferredStepRefs.filter(x=>x!==step.id);
  r.lastEncounterId=null;
  r.currentStepRef=null;
  axis827SyncRealityRoute();
  if(r.status==='active')r.itemStartedAt=Date.now();
  save();
  return axis821FlowClone(axis827ResolvedCurrent())||true;
}
function axis827AdvanceFlow(){
  axis821FlowState();
  const r=state.flowRun,step=axis827CurrentStepRaw();
  if(!r||!step||!r.lastEncounterId)return false;
  const event=allEvents().find(e=>e.id===r.lastEncounterId);
  if(!event||!event.flowProvenance||event.flowProvenance.flowRef!==r.flowRef||event.flowProvenance.flowStepRef!==step.id)return false;
  return axis827AdvanceCompletedCurrent(event,'legacy-advance');
}
function axis827AdvanceCompletedCurrent(encounter,reason){
  axis821FlowState();
  const r=state.flowRun,step=axis827CurrentStepRaw();
  if(!r||r.status!=='active'||!step)return false;
  if(encounter&&step.objectRef!==(encounter.equipmentId||encounter.eq))return false;
  const now=Date.now();
  if(encounter&&encounter.id)r.lastEncounterId=encounter.id;
  if(!(r.consumedStepRefs||[]).includes(step.id))r.consumedStepRefs=[].concat(r.consumedStepRefs||[],step.id);
  if(r.temporaryConstraints&&Array.isArray(r.temporaryConstraints.deferredStepRefs))r.temporaryConstraints.deferredStepRefs=r.temporaryConstraints.deferredStepRefs.filter(x=>x!==step.id);
  r.currentEncounterId=null;
  r.currentStepRef=null;
  const route=axis827SyncRealityRoute();
  r.itemStartedAt=route&&route.current?now:null;
  save();
  try{render()}catch{}
  if(typeof axis821FlowSurfaceRenderHome==='function')axis821FlowSurfaceRenderHome();
  try{window.dispatchEvent(new CustomEvent('axis:flow-step-completed',{detail:{flowRef:r.flowRef,stepRef:step.id,encounterId:encounter&&encounter.id||null,reason:reason||'complete',realityRoute:route&&route.schema||null}}))}catch{}
  return true;
}
function axis827FlowSurfaceRenderHome(){
  axis821FlowSurfaceEnsureDom();
  const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();
  if(!host||!api){if(host)host.innerHTML='';return}
  const run=api.run&&api.run(),ctx=api.current&&api.current(),route=api.project&&api.project(),flows=axis821FlowSurfaceFlows();
  const active=run&&run.status==='active'&&ctx&&route&&route.status==='active';
  const activeHome=$('#activeHome'),pageHead=$('#todayView .pageHead');
  if(active&&activeHome){if(host.parentElement!==activeHome)activeHome.insertBefore(host,activeHome.firstChild)}
  else if(pageHead&&host.previousElementSibling!==pageHead)pageHead.insertAdjacentElement('afterend',host);
  if(active){
    const total=Number(route.counts&&route.counts.total)||0;
    const done=(Number(route.counts&&route.counts.completed)||0)+(Number(route.counts&&route.counts.dropped)||0);
    const position=total?Math.min(done+1,total)+' / '+total:'';
    const next=route.next?axis821FlowSurfaceName(route.next.objectRef):'';
    const deferred=Number(route.counts&&route.counts.deferred)||0;
    const executing=!!run.currentEncounterId,currentDeferred=route.currentDeferred===true;
    host.dataset.state='active';
    host.dataset.substate=executing?'executing':currentDeferred?'deferred-return':'waiting';
    host.innerHTML='<div class="axis821FlowTop"><span>流程'+(position?' · '+position:'')+'</span><button data-axis-flow-open>全部</button></div>'+
      '<div class="axis821FlowRunLead"><small>'+(executing?'当前项目 · 进行中':currentDeferred?'稍后项目 · 回到这里':'当前项目')+'</small><b>'+esc(axis821FlowSurfaceName(ctx.objectRef))+'</b><span>'+(next?'接下来 · '+esc(next):'最后一项')+(deferred&&!currentDeferred?' · 稍后 '+deferred+' 项':'')+'</span></div>'+
      (executing?'<div class="axis821FlowRunStatus"><i></i><span><b>此项已开始</b><small>时间、暂停、休息与完成继续使用原有进行中控制。</small></span></div>':'<button class="axis821FlowRunPrimary" data-axis-flow-record>'+(currentDeferred?'开始稍后项':'开始此项')+'</button>')+
      '<div class="axis821FlowRunSecondary '+(executing?'executing':'')+'">'+(!executing&&!currentDeferred?'<button data-axis-flow-defer>稍后</button>':'')+(!executing?'<button data-axis-flow-skip>跳过</button>':'')+'<button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束流程</button></div>';
    return;
  }
  if(run&&run.status==='complete'){
    const flow=flows.find(x=>x.id===run.flowRef),done=(run.consumedStepRefs||[]).length,skipped=(run.skippedStepRefs||[]).length;
    host.dataset.state='complete';delete host.dataset.substate;
    host.innerHTML='<div class="axis821FlowTop"><span>流程完成</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead complete"><small>'+done+' 项完成'+(skipped?' · '+skipped+' 项跳过':'')+'</small><b>'+esc(flow?axis821FlowSurfaceTitle(flow):'本次流程')+'</b><span>真实记录保持不变。</span></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-dismiss>收起</button><button data-axis-flow-restart="'+esc(run.flowRef)+'">再来一次</button></div>';
    return;
  }
  if(flows.length){
    const flow=flows[0],count=(flow.steps||[]).length;
    host.dataset.state='ready';delete host.dataset.substate;
    host.innerHTML='<div class="axis821FlowTop"><span>流程'+(count?' · '+count+' 项':'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceTitle(flow))+'</b><small>'+esc(axis821FlowSurfaceChain(flow))+'</small></div><button class="axis821FlowRunPrimary ready" data-axis-flow-start="'+esc(flow.id)+'">开始</button><button class="axis821FlowReadyEdit" data-axis-flow-edit="'+esc(flow.id)+'">编辑流程</button>';
    return;
  }
  host.dataset.state='empty';delete host.dataset.substate;
  host.innerHTML='<div class="axis821FlowCompactEmpty"><span>流程</span><button data-axis-flow-new>＋ 新建</button></div>';
}
function axis827FlowSurfaceDefer(){
  const api=axis821FlowSurfaceApi(),run=api&&api.run&&api.run();
  if(!api||!run||run.status!=='active')return false;
  if(run.currentEncounterId){toast&&toast('当前项目已经开始');return false}
  const result=api.deferCurrent&&api.deferCurrent();
  if(!result)return false;
  axis827FlowSurfaceRenderHome();
  toast&&toast('已放到稍后');
  return true;
}
function axis827RecorderContextShow(mode,eq){
  const sheet=$('#scanSheet .sheet');if(!sheet||!eq)return;
  let host=$('#axis821FlowRecordContext');
  if(!host){host=D.createElement('div');host.id='axis821FlowRecordContext';host.className='axis821FlowRecordContext';const head=$('#scanSheet .sheetHead');if(head)head.insertAdjacentElement('afterend',host)}
  const route=axis827RealityProjection(),total=Number(route&&route.counts&&route.counts.total)||0;
  const done=(Number(route&&route.counts&&route.counts.completed)||0)+(Number(route&&route.counts&&route.counts.dropped)||0);
  const position=total?Math.min(done+1,total)+' / '+total:'';
  const execution=mode==='current'?axis821ExecutionForRecording(eq):null,ongoing=axis821FlowOngoingMode(execution);
  host.dataset.mode=mode;
  host.innerHTML=mode==='current'?'<span>流程'+(position?' · '+position:'')+'</span><b>'+esc(eq.name||'当前项目')+'</b><small>'+(ongoing?'记录后进入进行中；暂停、休息和完成继续使用原有控制。':'这是一次性项目，记下后按现实路线继续。')+'</small>':'<span>临时记录</span><b>'+esc(eq.name||'其他项目')+'</b><small>只留下这条记录，不改变当前 Reality Route。</small>';
  const saveBtn=$('#saveScan');if(saveBtn){if(saveBtn.dataset.axis821FlowOriginalText==null)saveBtn.dataset.axis821FlowOriginalText=saveBtn.textContent||'记下';saveBtn.textContent=mode==='current'?(ongoing?'开始此项':'完成并继续'):'记下，不改变流程'}
}

axis821CurrentStepRaw=axis827CurrentStepRaw;
axis821ResolvedCurrent=axis827ResolvedCurrent;
axis821LaunchFlow=axis827LaunchFlow;
axis821SkipFlow=axis827SkipFlow;
axis821AdvanceFlow=axis827AdvanceFlow;
axis821FlowAdvanceCompletedCurrent=axis827AdvanceCompletedCurrent;
axis821FlowRecorderContextShow=axis827RecorderContextShow;
axis821FlowSurfaceRenderHome=axis827FlowSurfaceRenderHome;

if(window.__AXIS_821_FLOW_SURFACE__)window.__AXIS_821_FLOW_SURFACE__.render=axis827FlowSurfaceRenderHome;

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
