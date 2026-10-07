/* AXIS 8.28 — Practice Loop Convergence.
 * Derived presentation/continuity layer over existing Reality Route, FlowRun,
 * Session, Encounter and v82/v87 Active owners.
 */
const axis828BaseFlowSurfaceRenderHome=axis821FlowSurfaceRenderHome;

function axis828PracticeLoopProjection(){
  axis821FlowState();
  const run=state.flowRun,route=axis827RealityProjection();
  const active=run?.currentEncounterId?axis821FlowActiveApi()?.get?.(run.currentEncounterId)||null:null;
  return axis828Core.projectPracticeLoop({route,run,active,session:state.active});
}
function axis828LoopPhaseLabel(loop){
  if(!loop)return'';
  if(loop.phase==='between-items')return'上一项已完成 · 接下来';
  if(loop.phase==='executing')return'进行中 · 返回后会停在这里';
  if(loop.phase==='paused')return'已暂停 · 继续后从这里恢复';
  if(loop.phase==='recovering')return'正在恢复进行状态';
  if(loop.phase==='settling')return'正在同步已完成项目';
  if(loop.phase==='complete')return'本次流程完成 · 记录已保留';
  if(loop.phase==='ready')return'现在';
  return'';
}
function axis828DecoratePracticeLoop(){
  const host=$('#axis821FlowHome'),loop=axis828PracticeLoopProjection();
  if(!host||!loop)return loop;
  host.dataset.loopPhase=loop.phase;
  let rail=host.querySelector('[data-axis-practice-loop-status]');
  if(loop.phase==='idle'){rail?.remove();return loop}
  if(!rail){
    rail=D.createElement('div');
    rail.className='axis828LoopStatus';
    rail.setAttribute('data-axis-practice-loop-status','');
    const lead=host.querySelector('.axis821FlowRunLead');
    if(lead)lead.insertAdjacentElement('afterend',rail);else host.prepend(rail);
  }
  const current=loop.current?axis821FlowSurfaceName(loop.current.objectRef):'';
  const label=axis828LoopPhaseLabel(loop);
  rail.innerHTML='<span>'+esc(label)+'</span>'+(current&&loop.phase!=='complete'?'<b>'+esc(current)+'</b>':'');
  const primary=host.querySelector('[data-axis-flow-record]');
  if(primary&&loop.phase==='between-items')primary.textContent='继续下一项';
  if(loop.phase==='paused'){
    const small=host.querySelector('.axis821FlowRunLead>small');
    if(small)small.textContent='当前项目 · 已暂停';
  }
  return loop;
}
function axis828FlowSurfaceRenderHome(){
  const out=axis828BaseFlowSurfaceRenderHome();
  axis828DecoratePracticeLoop();
  return out;
}
function axis828RestoreVisibleLoop(){
  if(D.visibilityState&&D.visibilityState!=='visible')return;
  if(!state.flowRun)return;
  try{axis828FlowSurfaceRenderHome()}catch{}
}

axis821FlowSurfaceRenderHome=axis828FlowSurfaceRenderHome;
if(window.__AXIS_821_FLOW_SURFACE__)window.__AXIS_821_FLOW_SURFACE__.render=axis828FlowSurfaceRenderHome;
if(window.__AXIS_FLOW_RUNTIME__)window.__AXIS_FLOW_RUNTIME__.practiceLoop=function(){return axis821FlowClone(axis828PracticeLoopProjection())};
window.addEventListener('pageshow',axis828RestoreVisibleLoop);
D.addEventListener('visibilitychange',axis828RestoreVisibleLoop);

window.__AXIS_828_PRACTICE_LOOP__={version:'8.28',schema:'axis.practice-loop.v1',owner:'lib/axis-practice-loop.mjs',projection:'flow+reality-route+active+session',reloadContinuity:true,promptOnRestore:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,newStorage:false,newSessionWriter:false,newEncounterWriter:false,newRecorder:false,newActiveOwner:false,network:false,ai:false};
