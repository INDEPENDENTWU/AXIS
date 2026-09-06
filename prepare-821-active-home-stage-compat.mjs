import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/* Preserve inherited Active countdown/tone/rest semantics and resolve set
   controls from immutable Encounter execution truth. Final stage geometry is
   source-owned by prepare-821-active-home-stage.mjs; this compatibility pass
   may adapt semantics but must not re-own the final visual system. */
once(
 "rest=a.restStartedAt&&a.status==='active'?now()-a.restStartedAt:0,status=",
 "rest=a.status==='paused'?restElapsed(a):0,remaining=Math.max(0,est-actual),execution=String(e.executionModeSnapshot||''),setMode=execution==='sets'||(!execution&&e.kind==='strength'),status=",
 'pause-owned rest / remaining / execution derivation'
);
once(
 "$('#v87Meta').textContent='预计 '+clock(est)+(e.kind==='strength'?' · '+(tracked?(done+'/'+total+' 组'):('计划 '+total+' 组')):'');",
 "$('#v87Meta').textContent=`剩余 ${clock(remaining)} · 预计 ${clock(est)}${setMode?' · '+(tracked?(done+'/'+total+' 组'):('计划 '+total+' 组')):''}`;",
 'legacy countdown plus estimate presentation'
);
once(
 "$('#v87Rest').textContent=rest?'组间休息中':",
 "if(typeof renderRestLine==='function')renderRestLine(rest,e,a);else $('#v87Rest').textContent=rest?('休息 '+clock(rest)):",
 'inherited passive rest presenter'
);
once(
 "$('#axis821StageProgressText').textContent=e.kind==='strength'?",
 "$('#axis821StageProgressText').textContent=setMode?",
 'execution-aware progress presentation'
);
once(
 "if(e.kind==='strength'&&a.status==='active')",
 "if(setMode&&a.status==='active')",
 'execution-aware set controls'
);

/* Rest Speak historically positioned its fixed learning panel only above the
   floating Active card. Integrated Home can place Active much higher on small
   iPhone viewports, so that assumption can move the panel's real hit targets
   above the viewport. Keep the inherited panel owner and event route, but make
   its placement fail-safe: use the available space above Active when it is
   sufficient, otherwise pin the natural-height scroll panel inside the
   viewport. This changes no learning, training, timer or persistence owner. */
once(
 "if(rect){panel.style.bottom=Math.max(12,window.innerHeight-rect.top+8)+'px';panel.style.maxHeight=Math.max(180,Math.floor(rect.top-22))+'px'}",
 "if(rect){const vh=Math.max(320,window.innerHeight||0),pad=12,gap=8,above=Math.floor(rect.top-pad-gap);if(above>=180){panel.style.top='auto';panel.style.bottom=Math.max(pad,vh-rect.top+gap)+'px';panel.style.maxHeight=above+'px'}else{panel.style.top=pad+'px';panel.style.bottom='auto';panel.style.maxHeight=Math.max(180,vh-pad*2)+'px'}}",
 'Rest Speak viewport-safe placement'
);

/* The large control keeps a visible 暂停/继续 label while the button's DOM
   innerText remains the inherited canonical glyph (Ⅱ / ▶). That preserves
   long-standing browser contracts without duplicating the action owner. */
once(
 ".axis821StageToggleGlyph{display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;color:var(--muted);font-size:13px}.axis821StageToggleLabel{font-size:13px}",
 ".axis821StageToggleGlyph{display:inline-flex;width:18px;height:18px;align-items:center;justify-content:center;color:var(--muted);font-size:13px}.axis821StageToggleLabel{display:none}.v87Now.axis821ActiveStage #v87Toggle::after{content:attr(data-label);font-size:13px;font-weight:660}",
 'visible label with inherited glyph contract'
);
once(
 "$('#axis821StageToggleLabel').textContent=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.id=e.id;",
 "$('#axis821StageToggleLabel').textContent=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.label=a.status==='active'?'暂停':'继续';$('#v87Toggle').dataset.id=e.id;",
 'toggle visual label state'
);

/* A completed set plan has one action in the primary slot: add another set.
   Hide the now-disabled completion control instead of creating a third visible
   grid item. The existing #v87Add click owner still performs the mutation. */
once(
 "if(planDone){pri.textContent='计划已完成';pri.classList.add('plan');pri.disabled=true;add.style.display='block';add.dataset.id=e.id}else",
 "if(planDone){pri.textContent='计划已完成';pri.classList.add('plan');pri.disabled=true;pri.style.display='none';add.style.display='block';add.dataset.id=e.id}else",
 'single visible plan-complete action'
);

/* Preserve the inherited stable geometry signature at the semantic display
   boundary only. Final dimensions/placement live in the stage-owned CSS. */
once(
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}if(typeof renderRestLine==='function')",
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}add.style.visibility=planDone?'visible':'hidden';if(typeof renderRestLine==='function')",
 'stable add-set visibility compatibility'
);

/* 8.10.2 standalone learning intentionally survives an idle-Home repaint.
   The large stage still hides when there is no Active item, but it must not
   close an explicitly opened standalone learning panel as a side effect. */
once(
 "if(!target||!today||!activeHome||sheet){host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now');return}",
 "if(!target||!today||!activeHome||sheet){const keepStandalone=!sheet&&axis8102PanelSource()==='standalone';if(!keepStandalone)axis891CloseSpeak();host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now');return}",
 'standalone learning lifetime'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);

/* Flow's one-second clock must not rebuild the integrated action DOM. Replacing
   the hold button while a finger is down can cancel the proven v87 hold owner,
   and WebKit can observe the same replacement between visible and geometry
   reads. Keep structural renders event-driven and make the periodic tick a
   read-only text/progress paint over the already-mounted Flow projection. */
{
 const APP='app.js';let app=fs.readFileSync(APP,'utf8');
 const volatileTimer="clearInterval(axis821FlowUiTimer);axis821FlowUiTimer=setInterval(()=>{if(D.visibilityState==='visible'&&state.flowRun?.status==='active')axis821FlowSurfaceRenderHome?.()},1000);";
 const stableTimer=String.raw`function axis821FlowSurfaceTick(){
  if(D.visibilityState!=='visible'||state.flowRun?.status!=='active')return;const host=$('#axis821FlowHome'),run=state.flowRun;if(!host||host.dataset.state!=='active'){axis821FlowSurfaceRenderHome?.();return}
  if(!run.currentEncounterId){const gap=host.querySelector('.axis821FlowGap b');if(gap&&run.gapStartedAt)gap.textContent=axis821FlowClock(Math.max(0,Date.now()-run.gapStartedAt));return}
  const active=axis821FlowCurrentActive();if(!active||!host.querySelector('[data-axis-flow-active-finish]')){axis821FlowSurfaceRenderHome?.();return}const est=Math.max(0,Number(active.estimateMs)||0),status=host.querySelector('.axis821FlowActiveState>b'),axis=host.querySelector('.axis821FlowActiveAxis i');if(status)status.textContent='本项 '+axis821FlowClock(active.elapsedMs)+(est?' / '+axis821FlowApprox(est):'');if(axis)axis.style.width=(est?Math.min(100,active.elapsedMs/est*100):0)+'%';const plan=axis821FlowPlanning(run,active),remain=host.querySelector('.axis821FlowPlan>span:nth-child(2) b');if(remain)remain.textContent=axis821FlowApprox(plan.remaining)
}
clearInterval(axis821FlowUiTimer);axis821FlowUiTimer=setInterval(axis821FlowSurfaceTick,1000);`;
 const n=app.split(volatileTimer).length-1;if(n!==1)fail(`Flow volatile ticker expected once, found ${n}`);app=app.replace(volatileTimer,stableTimer);try{new Function(app)}catch(e){fail(`app Flow tick syntax ${e.message}`)}fs.writeFileSync(APP,app);
}

console.log('[AXIS 8.21 Active Home stage compat] PASS · inherited countdown/glyph/rest + execution-aware set controls + viewport-safe Rest Speak + standalone learning lifetime + stable Flow hold control · final geometry remains stage-owned');
