import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Active Home stage compat] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);s=s.replace(from,to)};

/* Preserve inherited Active countdown/tone/rest semantics and resolve set
   controls from immutable Encounter execution truth. This is presentation-only:
   v87 remains the sole pause/resume/set/finish action owner. */
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

/* A completed set plan has one visible action in the same primary slot: add
   another set. Keep the clicked completion button mounted and geometrically
   present behind that action instead of display:none; Chromium otherwise
   scroll-anchors when its focused control disappears and the whole in-flow
   stage jumps vertically. v87 remains the only action owner. */
once(
 "if(planDone){pri.textContent='计划已完成';pri.classList.add('plan');pri.disabled=true;add.style.display='block';add.dataset.id=e.id}else{pri.textContent='完成一组';",
 "if(planDone){pri.textContent='计划已完成';pri.classList.add('plan');pri.disabled=true;pri.style.display='block';pri.style.opacity='0';pri.style.pointerEvents='none';add.style.display='block';add.dataset.id=e.id}else{pri.style.opacity='';pri.style.pointerEvents='';pri.textContent='完成一组';",
 'single visible focus-stable plan-complete action'
);

/* Preserve the inherited stable geometry signature. Timed/non-set execution
   already hides the add-set button through the execution-aware branch above. */
once(
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}if(typeof renderRestLine==='function')",
 "}else{host.dataset.primary='none';pri.style.display='none';add.style.display='none'}add.style.visibility=planDone?'visible':'hidden';if(typeof renderRestLine==='function')",
 'stable add-set geometry compatibility'
);

/* 8.10.2 standalone learning intentionally survives an idle-Home repaint.
   The large stage still hides when there is no Active item, but it must not
   close an explicitly opened standalone learning panel as a side effect. */
once(
 "if(!target||!today||!activeHome||sheet){host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now');return}",
 "if(!target||!today||!activeHome||sheet){const keepStandalone=!sheet&&axis8102PanelSource()==='standalone';if(!keepStandalone)axis891CloseSpeak();host.classList.remove('show','axis821-set-bump','axis821-state-shift');D.body.classList.remove('v87-now');return}",
 'standalone learning lifetime'
);

/* The inherited Rest Speak panel used the old fixed-card top edge as its
   bottom anchor. An integrated Home stage can begin high in the viewport, so
   that calculation pushes the panel above iPhone WebKit. Keep the old anchor
   everywhere else, but give the integrated stage a viewport/safe-area bound. */
once(
 "if(rect){panel.style.bottom=Math.max(12,window.innerHeight-rect.top+8)+'px';panel.style.maxHeight=Math.max(180,Math.floor(rect.top-22))+'px'}",
 "if(host?.classList.contains('axis821ActiveStage')){panel.style.bottom='calc(84px + env(safe-area-inset-bottom))';panel.style.maxHeight=Math.max(240,Math.floor(window.innerHeight*.68))+'px'}else if(rect){panel.style.bottom=Math.max(12,window.innerHeight-rect.top+8)+'px';panel.style.maxHeight=Math.max(180,Math.floor(rect.top-22))+'px'}",
 'viewport-safe integrated learning panel'
);

/* Inherited fixed-card CSS still contains stronger ID + !important geometry.
   Add one geometry-only supersede with greater specificity. It deliberately
   does not own display, so .show continues to control stage visibility. The
   postbuild Adjust action stays on its inherited lower-right anchor and is
   removed from grid flow, so it cannot change stage height. The canonical
   primary/add-set actions share the same second-column grid cell; only one is
   visible at a time, which preserves the inherited immutable card geometry
   without duplicating the v87 action owner. On phone widths, compact only
   secondary vertical rhythm while the stage clears the capture dock. */
once(
 'backdrop-filter:none;-webkit-backdrop-filter:none;isolation:isolate}',
 'backdrop-filter:none;-webkit-backdrop-filter:none;isolation:isolate}html body #v87Now.axis821ActiveStage{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;transform:none!important;width:100%!important;max-width:none!important;margin:2px 0 22px!important}html body #v87Now.axis821ActiveStage #v87Toggle,html body #v87Now.axis821ActiveStage #v87Primary,html body #v87Now.axis821ActiveStage #v87Add{height:60px!important;min-height:60px!important;width:100%!important;max-width:none!important}html body #v87Now.axis821ActiveStage #v87Toggle{grid-column:1!important;grid-row:1!important}html body #v87Now.axis821ActiveStage #v87Primary,html body #v87Now.axis821ActiveStage #v87Add{grid-column:2!important;grid-row:1!important}html body #v87Now.axis821ActiveStage #v87Primary{z-index:1!important}html body #v87Now.axis821ActiveStage #v87Add{z-index:2!important}html body #v87Now.axis821ActiveStage #v87AdjustBtn{position:absolute!important;top:auto!important;right:12px!important;bottom:12px!important;grid-column:auto!important;width:64px!important;max-width:64px!important;height:38px!important;min-height:38px!important;margin:0!important;padding:0!important;z-index:3!important}@media(max-width:420px){html body #v87Now.axis821ActiveStage{min-height:294px!important;margin-bottom:16px!important}html body #v87Now.axis821ActiveStage .axis821StageHeader{min-height:48px!important;padding-top:8px!important}html body #v87Now.axis821ActiveStage .axis821StageCore{min-height:120px!important;padding-top:6px!important;padding-bottom:6px!important}html body #v87Now.axis821ActiveStage .axis821StageClock{margin-top:8px!important}html body #v87Now.axis821ActiveStage .v87Meta{margin-top:7px!important}html body #v87Now.axis821ActiveStage .axis821StageFact{margin-top:3px!important;padding-top:2px!important}html body #v87Now.axis821ActiveStage .axis821StageControls{padding-bottom:6px!important}html body #v87Now.axis821ActiveStage .v87Rest{box-sizing:border-box!important;height:24px!important;min-height:24px!important;padding-bottom:2px!important}}',
 'high-specificity integrated Home geometry'
);

try{new Function(s)}catch(e){fail(`v87 syntax ${e.message}`)}
fs.writeFileSync(FILE,s);

/* Runtime Foundation calls this an iPhone WebKit observation, but its inherited
   harness still used desktop-mouse click semantics. The dedicated Active Home
   gate already proves the same v87 action with a physical WebKit tap. Converge
   this inherited Shadow observation to the same mobile/touch input model; this
   changes only the test harness, never the v87 action or storage owner. */
{
 const SHADOW='scripts/axis-813-shadow-browser.mjs';let shadow=fs.readFileSync(SHADOW,'utf8');
 const oldContext="const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-CN' });\nconst page = await context.newPage();";
 const newContext="const context = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'zh-CN', ...(ENGINE === 'webkit' ? { isMobile: true, hasTouch: true, deviceScaleFactor: 2 } : {}) });\nconst page = await context.newPage();\nconst axis813Action = async (locator) => ENGINE === 'webkit' ? locator.tap({ timeout: 5000 }) : locator.click({ timeout: 5000 });";
 let n=shadow.split(oldContext).length-1;if(n!==1)fail(`Shadow mobile context expected once, found ${n}`);shadow=shadow.replace(oldContext,newContext);
 const primary="await page.locator('#v87Primary').click();";n=shadow.split(primary).length-1;if(n!==1)fail(`Shadow primary action expected once, found ${n}`);shadow=shadow.replace(primary,"await axis813Action(page.locator('#v87Primary'));" );
 const toggle="await page.locator('#v87Toggle').click();";n=shadow.split(toggle).length-1;if(n!==2)fail(`Shadow toggle actions expected twice, found ${n}`);shadow=shadow.replaceAll(toggle,"await axis813Action(page.locator('#v87Toggle'));" );
 fs.writeFileSync(SHADOW,shadow);
}

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

console.log('[AXIS 8.21 Active Home stage compat] PASS · inherited countdown/glyph/geometry + pause-owned rest + passive Rest Speak · viewport-safe learning panel + iPhone touch Shadow action · execution-aware set controls · standalone learning lifetime · compact iPhone rail · one visible focus-stable plan-complete action · stable Flow hold control');