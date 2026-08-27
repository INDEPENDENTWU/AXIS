import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow Session coordination] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}
function mutateFunction(src,signature,mutate,label){const r=functionRange(src,signature,label),next=mutate(r.text);if(!next||next===r.text)fail(`${label} mutation did not change source`);return src.slice(0,r.start)+next+src.slice(r.end)}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

/*
 * User Production testing exposed the missing composition case: a Flow item can
 * be waiting while another established Activity is already foregrounded. The
 * mature v82/v87 model already supports one foreground Activity plus paused
 * Activities, so this pass coordinates Flow with that owner instead of creating
 * a second execution state machine.
 */

/* v61 stays the sole Quick Record shell. openFor must route through the current
   canonical picker so modern/custom Objects cannot silently fail because they no
   longer have a legacy [data-eq] row. */
{
 const FILE='v61.js';let s=read(FILE);
 s=replaceFunction(s,'function chooseQuick(id)',`function chooseQuick(id){
  $('#quickRecordSheet')?.classList.remove('show');
  const open=window.__AXIS_OPEN_EQUIPMENT_PICKER__,pick=window.__AXIS_PICK_EQUIPMENT__;
  if(open&&pick){open('quick');requestAnimationFrame(()=>pick(id,true));return true}
  $('#equipmentRow')?.click();setTimeout(()=>{const b=$$('#eqSheet [data-eq],#eqSheet [data-v8124-pick]').find(x=>(x.dataset.eq||x.dataset.v8124Pick)===id);if(b){b.click();setTimeout(()=>showQuickEditor(id),0)}},0);return true
 }`,'Quick Record canonical Object route');
 const old="function bind(){injectQuick();window.__AXIS_QUICK_RECORD__={version:'8.21',owner:'v61',open:openQuick,openFor:chooseQuick};injectPending();basic();";
 const next="function bind(){injectQuick();window.__AXIS_QUICK_SELECTION_COMMIT__=id=>{showQuickEditor(id);return true};window.__AXIS_QUICK_RECORD__={version:'8.21',owner:'v61',open:openQuick,openFor:chooseQuick};injectPending();basic();";
 s=once(s,old,next,'Quick Record canonical selection commit bridge');
 syntax(s,FILE);write(FILE,s);
}

/* v82 remains Activity creation truth. Snapshot detour intent at save-arm time so
   asynchronous post-commit cleanup cannot accidentally turn a record-only detour
   into a second Active Activity. Publish only an additive post-start signal after
   the authoritative Active write. */
{
 const FILE='v82-runtime.js';let s=read(FILE);
 const stateAnchor='let estimateMs=null,estimateAuto=true,precisionTimer=null,knownEvents=new Set(),saveArmed=false,finishHoldStart=0,finishHapticDone=false;';
 s=once(s,stateAnchor,stateAnchor.replace('finishHoldStart=0','axis821SaveRecordOnly=false,finishHoldStart=0'),'v82 record-only save snapshot state');
 s=replaceFunction(s,'function armSave()',`function armSave(){if(!$('#reviewStage')||$('#reviewStage').classList.contains('hidden'))return;if($('#scanSheet .sheetHead>b')?.textContent?.includes('补一下'))return;saveArmed=true;axis821SaveRecordOnly=window.__AXIS_FLOW_RECORD_CONTEXT__?.recordOnly===true;const tmpl=selectedEventTemplate();if(estimateAuto||!estimateMs)estimateMs=autoEstimate(tmpl||{kind:$('#cardioFields')?.classList.contains('hidden')?'strength':'cardio'});setTimeout(watchSavedEvent,0)}`,'v82 save-arm Flow detour snapshot');
 s=replaceFunction(s,'function watchSavedEvent(attempt=0)',`function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1),recordOnly=axis821SaveRecordOnly||e?.flowDetour?.recordOnly===true;if(!recordOnly&&axis8201Ongoing(e))startActivity(e,axis8201EstimateForEvent(e,estimateMs));saveArmed=false;axis821SaveRecordOnly=false;estimateAuto=true;estimateMs=null;return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else{saveArmed=false;axis821SaveRecordOnly=false}}`,'v82 deterministic record-only Active exclusion');
 s=mutateFunction(s,'function startActivity(e,customEstimate)',fn=>fn.slice(0,-1)+"try{window.dispatchEvent(new CustomEvent('axis:active-started',{detail:{id:e.id,equipmentId:e.equipmentId,estimateMs:Number(rec.activity?.estimateMs)||0,owner:'v82'}}))}catch{}"+'}', 'v82 post-start lifecycle signal');
 syntax(s,FILE);write(FILE,s);
}

/* v87 remains the polished Active action/presentation owner. Expose a narrow
   projection/delegation API over its existing private functions. The API writes
   nothing itself: every action calls the already-authoritative v87 function. */
{
 const FILE='v87-runtime.js';let s=read(FILE),end=s.lastIndexOf('})();');if(end<0)fail('v87 IIFE end missing');
 const block=String.raw`
function axis821ActiveSnapshot(id){const pair=sessionPairs(true).find(x=>x.e.id===id);if(!pair?.a)return null;const {e,a}=pair,m=readMeta(),estimate=Math.max(0,Number(a.estimateMs)||0),actual=elapsed(a),total=planned(e,m),done=Math.max(0,Number(a.completedSets)||0),rest=a.restStartedAt?Math.max(0,now()-a.restStartedAt):0;return{id:e.id,objectRef:e.equipmentId||null,name:e.name||'项目',kind:e.kind||'',mode:axis8201ExecutionMode(e),status:a.status||'',elapsedMs:actual,estimateMs:estimate,remainingMs:estimate?Math.max(0,estimate-actual):0,completedSets:done,plannedSets:total,restMs:rest,planComplete:isPlanComplete(e,a,m)}}
function axis821ActiveCurrent(){const x=activePair();return x?axis821ActiveSnapshot(x.e.id):null}
function axis821ActivePaused(){return pausedPairs().map(x=>axis821ActiveSnapshot(x.e.id)).filter(Boolean)}
function axis821ActivePause(id){const x=axis821ActiveSnapshot(id);if(!x||x.status!=='active')return false;toggle(id);return true}
function axis821ActiveResume(id){const x=axis821ActiveSnapshot(id);if(!x||x.status!=='paused')return false;toggle(id);return true}
function axis821ActiveCompleteSet(id){return completeSet(id)===true}
function axis821ActiveFinish(id){return finish(id,now(),true)===true}
function axis821ActiveBeginFinishHold(id,e){const x=axis821ActiveSnapshot(id);if(!x||x.status==='finished')return false;beginHold(id,e);return true}
function axis821ActiveCancelFinishHold(){cancelHold();return true}
window.__AXIS_ACTIVE_RUNTIME__={version:'8.21',owner:'v87',truth:'axis_v8_meta',cardinality:'one-foreground+paused',get:axis821ActiveSnapshot,current:axis821ActiveCurrent,paused:axis821ActivePaused,pause:axis821ActivePause,resume:axis821ActiveResume,completeSet:axis821ActiveCompleteSet,finish:axis821ActiveFinish,beginFinishHold:axis821ActiveBeginFinishHold,cancelFinishHold:axis821ActiveCancelFinishHold};
`;
 if(s.includes('__AXIS_ACTIVE_RUNTIME__'))fail('v87 Active projection API duplicated');
 s=s.slice(0,end)+block+s.slice(end);syntax(s,FILE);write(FILE,s);
}

/* app.js remains Flow orchestration/Session/Encounter owner. Add coordination,
   planning snapshots and a read-only Active projection; never write axis_v8_meta. */
{
 const FILE='app.js';let s=read(FILE);
 s=replaceFunction(s,'function axis821FlowRecorderContextClear()',`function axis821FlowRecorderContextClear(){window.__AXIS_FLOW_RECORD_CONTEXT__=null;const host=$('#axis821FlowRecordContext');if(host)host.remove();const saveBtn=$('#saveScan');if(saveBtn?.dataset.axis821FlowOriginalText!=null){saveBtn.textContent=saveBtn.dataset.axis821FlowOriginalText;delete saveBtn.dataset.axis821FlowOriginalText}}`,'Flow recorder context clears transient handoff');

 const beginAnchor='function axis821BeginCurrentItem()';
 const helpers=String.raw`
let axis821FlowSwitchPending=null,axis821FlowUiTimer=0;
function axis821FlowActiveApi(){return window.__AXIS_ACTIVE_RUNTIME__||null}
function axis821FlowClock(ms){ms=Math.max(0,Number(ms)||0);const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),sec=Math.floor(ms%60000/1000),p=n=>String(n).padStart(2,'0');return h?h+':'+p(m)+':'+p(sec):p(m)+':'+p(sec)}
function axis821FlowApprox(ms){const n=Math.max(0,Number(ms)||0);if(!n)return'0 分';return'约 '+Math.max(1,Math.round(n/60000))+' 分'}
function axis821FlowMetaRead(){try{const x=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');return x&&typeof x==='object'?x:{}}catch{return{}}}
function axis821FlowAllEvents(){return (state.active?[state.active]:[]).concat(state.sessions||[]).flatMap(x=>Array.isArray(x?.events)?x.events:[])}
function axis821FlowExpectedForObject(ref){
 const eq=axis821FlowObject(ref);if(!eq)return 5*60000;const meta=axis821FlowMetaRead(),hist=axis821FlowAllEvents().filter(e=>e?.equipmentId===eq.id).sort((a,b)=>(b.time||0)-(a.time||0));
 for(const e of hist){const a=meta.events?.[e.id]?.activity,actual=Number(a?.actualMs)||0;if(actual>=30000&&actual<=4*3600000)return actual}
 const last=hist[0],mode=axis820ExecutionModeForEq(eq);if(mode==='timed'){const min=Number(last?.metrics?.duration??last?.duration);if(min>0)return Math.max(60000,Math.min(3*3600000,min*60000))}if(mode==='hold'){const sec=Number(last?.metrics?.hold??last?.hold);if(sec>0)return Math.max(1000,Math.min(3600000,sec*1000))}if(mode==='sets'){const n=Math.max(1,Number(last?.sets)||meta.events?.[last?.id]?.sets?.length||3);return Math.max(3*60000,Math.min(60*60000,n*150000))}if(mode==='rounds')return 10*60000;return 5*60000
}
function axis821FlowExpectedTotal(steps){return(steps||[]).reduce((n,x)=>n+Math.max(0,Number(x?.expectedDurationMs)||axis821FlowExpectedForObject(x?.objectRef)),0)}
function axis821FlowPlanning(run,active){if(!run)return{total:0,remaining:0};const xs=run.steps||[],cursor=Math.max(0,Number(run.cursor)||0),total=Math.max(0,Number(run.expectedTotalMs)||axis821FlowExpectedTotal(xs));let remaining=0;for(let i=cursor;i<xs.length;i++){if(i===cursor&&active?.estimateMs)remaining+=Math.max(0,active.estimateMs-active.elapsedMs);else remaining+=Math.max(0,Number(xs[i]?.expectedDurationMs)||axis821FlowExpectedForObject(xs[i]?.objectRef))}return{total,remaining}}
function axis821FlowPublishRecordContext(mode,eq){const r=state.flowRun,step=axis821CurrentStepRaw();window.__AXIS_FLOW_RECORD_CONTEXT__={version:'8.21',owner:'flow-orchestration',mode,recordOnly:mode==='detour',flowRef:r?.flowRef||null,stepRef:step?.id||null,objectRef:eq?.id||null};return window.__AXIS_FLOW_RECORD_CONTEXT__}
function axis821FlowOpenRecorder(mode,eq){if(!eq)return false;axis821FlowPublishRecordContext(mode,eq);axis821FlowRecordingIntent={mode,flowRef:state.flowRun?.flowRef||null,stepRef:axis821CurrentStepRaw()?.id||null,objectRef:eq.id};const q=window.__AXIS_QUICK_RECORD__;if(!q?.openFor){axis821FlowRecordingIntent=null;axis821FlowRecorderContextClear();toast?.('记录入口尚未就绪');return false}const opened=q.openFor(eq.id);if(opened===false){axis821FlowRecordingIntent=null;axis821FlowRecorderContextClear();toast?.('记录入口尚未就绪');return false}requestAnimationFrame(()=>axis821FlowRecorderContextShow(mode==='detour'?'detour':'current',eq));return true}
function axis821FlowEnsureSwitchSheet(){if($('#axis821FlowSwitchSheet'))return;D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="axis821FlowSwitchSheet"><div class="sheet axis821FlowSwitchSheet"><div class="grabber"></div><div class="sheetHead"><b>切换进行中的项目</b><button class="closeBtn" data-axis-flow-switch-cancel aria-label="关闭">×</button></div><div id="axis821FlowSwitchBody"></div></div></div>')}
function axis821FlowCloseSwitch(){axis821FlowSwitchPending=null;$('#axis821FlowSwitchSheet')?.classList.remove('show')}
function axis821FlowShowSwitch(mode,foreign,target){axis821FlowEnsureSwitchSheet();const body=$('#axis821FlowSwitchBody');if(!body||!foreign||!target)return false;axis821FlowSwitchPending={mode,foreignId:foreign.id,targetId:target.id||null};body.innerHTML='<div class="axis821SwitchCurrent"><small>正在进行</small><b>'+esc(foreign.name||'当前项目')+'</b><span>'+axis821FlowClock(foreign.elapsedMs)+' · 进度会完整保留</span></div><div class="axis821SwitchTarget"><small>'+(mode==='resume'?'继续流程项目':'开始流程项目')+'</small><b>'+esc(target.name||axis821FlowSurfaceName(axis821CurrentStepRaw()?.objectRef))+'</b><span>'+(mode==='resume'?'继续后，当前项目会暂停。':'记下并开始后，当前项目会自动暂停。取消记录不会影响它。')+'</span></div><button class="saveRecord axis821SwitchPrimary" data-axis-flow-switch-confirm>'+(mode==='resume'?'暂停当前并继续此项':'暂停当前并开始')+'</button><button class="axis821SwitchKeep" data-axis-flow-switch-cancel>继续当前项目</button>';$('#axis821FlowSwitchSheet').classList.add('show');return true}
function axis821FlowConfirmSwitch(){const p=axis821FlowSwitchPending;if(!p)return false;axis821FlowCloseSwitch();if(p.mode==='resume'){const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi();if(!id||!api?.resume?.(id))return false;axis821FlowSurfaceRenderHome?.();return true}const eq=axis821FlowObject(axis821CurrentStepRaw()?.objectRef);return axis821FlowOpenRecorder('current',eq)}
function axis821FlowOnActiveStarted(detail){const r=state.flowRun;if(!r||r.status!=='active'||!detail?.id||r.currentEncounterId!==detail.id)return false;const step=axis821CurrentStepRaw();if(step&&Number(detail.estimateMs)>0){step.expectedDurationMs=Number(detail.estimateMs);r.expectedTotalMs=axis821FlowExpectedTotal(r.steps);save()}axis821FlowSurfaceRenderHome?.();return true}
function axis821FlowCurrentActive(){const id=state.flowRun?.currentEncounterId;return id?axis821FlowActiveApi()?.get?.(id)||null:null}
function axis821FlowSyncActiveSurface(active){const api=axis821FlowActiveApi(),foreground=api?.current?.(),id=state.flowRun?.currentEncounterId,duplicate=!!(id&&active&&(foreground?.id===id||(!foreground&&active.status==='paused')));D.body.classList.toggle('axis821-flow-integrated-active',duplicate)}
`;
 const at=s.indexOf(beginAnchor);if(at<0)fail('Flow current begin anchor missing');s=s.slice(0,at)+helpers+s.slice(at);

 s=replaceFunction(s,'function axis821BeginCurrentItem()',`function axis821BeginCurrentItem(){
  axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw(),ctx=axis821ResolvedCurrent(),activeApi=axis821FlowActiveApi();if(!r||r.status!=='active'||!step||!ctx||ctx.missingObject)return false;const eq=axis821FlowObject(step.objectRef);if(!eq){toast?.('这个项目已不可用');return false}
  if(r.currentEncounterId){const own=activeApi?.get?.(r.currentEncounterId);if(!own){toast?.('进行状态正在同步');return false}if(own.status==='active'){toast?.('当前项目已经在进行中');return true}if(own.status==='finished')return axis821FlowOnActiveFinished(r.currentEncounterId);if(own.status==='paused'){const foreign=activeApi?.current?.();if(foreign&&foreign.id!==own.id)return axis821FlowShowSwitch('resume',foreign,own);const ok=activeApi?.resume?.(own.id);if(ok)axis821FlowSurfaceRenderHome?.();return !!ok}return false}
  const ongoing=axis821FlowOngoingMode(ctx.effectiveExecutionMode),foreign=activeApi?.current?.();if(ongoing&&foreign)return axis821FlowShowSwitch('start',foreign,{id:eq.id,name:eq.name});return axis821FlowOpenRecorder('current',eq)
 }`,'Flow current start/resume coordination');
 s=replaceFunction(s,'function axis821BeginDetour(id)',`function axis821BeginDetour(id){axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw(),eq=axis821FlowObject(id);if(!r||r.status!=='active'||!step||!eq)return false;return axis821FlowOpenRecorder('detour',eq)}`,'Flow detour deterministic record-only route');
 s=replaceFunction(s,'function axis821LaunchFlow(id)',`function axis821LaunchFlow(id){const flow=axis821FlowById(id);if(!flow)return null;const startedAt=Date.now(),steps=axis821FlowClone(flow.steps).map(x=>({...x,expectedDurationMs:axis821FlowExpectedForObject(x.objectRef)}));if(!state.active)state.active={id:uid('S'),start:startedAt,events:[]};state.flowRun={schema:'axis.flow-run.v1',id:uid('FR'),flowRef:flow.id,startedAt,status:'active',cursor:0,steps,expectedTotalMs:axis821FlowExpectedTotal(steps),consumedStepRefs:[],skippedStepRefs:[],lastEncounterId:null,currentEncounterId:null,currentStepRef:null,itemStartedAt:null};save();try{render()}catch{};return axis821FlowClone(axis821ResolvedCurrent())}`,'Flow launch preserves existing Active and snapshots planning estimates');
 s=replaceFunction(s,'function axis821FlowAdvanceCompletedCurrent(encounter,reason=\'complete\')',`function axis821FlowAdvanceCompletedCurrent(encounter,reason='complete'){
  axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw();if(!r||r.status!=='active'||!step)return false;if(encounter&&step.objectRef!==(encounter.equipmentId||encounter.eq))return false;const active=r.currentEncounterId?axis821FlowActiveApi()?.get?.(r.currentEncounterId):null,now=Date.now();if(active?.elapsedMs>0)step.actualDurationMs=active.elapsedMs;if(encounter?.id)r.lastEncounterId=encounter.id;if(!r.consumedStepRefs?.includes(step.id))r.consumedStepRefs=[...(r.consumedStepRefs||[]),step.id];r.currentEncounterId=null;r.currentStepRef=null;r.cursor=(Number(r.cursor)||0)+1;if(r.cursor>=r.steps.length){r.status='complete';r.completedAt=now;r.itemStartedAt=null}else r.itemStartedAt=null;save();try{render()}catch{};axis821FlowSurfaceRenderHome?.();try{window.dispatchEvent(new CustomEvent('axis:flow-step-completed',{detail:{flowRef:r.flowRef,stepRef:step.id,encounterId:encounter?.id||null,reason}}))}catch{}return true
 }`,'Flow completion keeps Active actual duration as run-only context');
 s=replaceFunction(s,'function axis821SkipFlow()',`function axis821SkipFlow(){axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw();if(!r||!step||r.currentEncounterId)return false;const now=Date.now();step.skippedAt=now;r.skippedStepRefs=[...(r.skippedStepRefs||[]),step.id];r.cursor=(Number(r.cursor)||0)+1;r.lastEncounterId=null;r.currentEncounterId=null;r.currentStepRef=null;if(r.cursor>=r.steps.length){r.status='complete';r.completedAt=now;r.itemStartedAt=null}else r.itemStartedAt=null;save();return axis821FlowClone(axis821ResolvedCurrent())||true}`,'Flow skip only before factual item start');

 s=replaceFunction(s,'function axis821FlowSurfaceFinish()',`function axis821FlowSurfaceFinish(){const api=axis821FlowSurfaceApi(),run=api?.run?.();if(!run)return false;if(run.currentEncounterId&&!confirm('结束流程不会结束当前项目。当前项目会继续保留在进行中 / 已暂停列表，仍可单独完成。确定结束流程？'))return false;api.finish?.();axis821FlowSyncActiveSurface(null);axis821FlowSurfaceRenderHome();return true}`,'Flow early finish preserves linked Active truth');

 s=replaceFunction(s,'function axis821FlowSurfaceRenderHome()',`function axis821FlowSurfaceRenderHome(){
  axis821FlowSurfaceEnsureDom();const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();if(!host||!api){if(host)host.innerHTML='';return}
  const run=api.run?.(),ctx=api.current?.(),flows=axis821FlowSurfaceFlows(),isActive=run?.status==='active'&&!!ctx,active=isActive&&run.currentEncounterId?axis821FlowCurrentActive():null,activeApi=axis821FlowActiveApi();axis821FlowSyncActiveSurface(active);
  const activeHome=$('#activeHome'),pageHead=$('#todayView .pageHead');if(isActive&&activeHome){if(host.parentElement!==activeHome)activeHome.insertBefore(host,activeHome.firstChild)}else if(pageHead&&host.previousElementSibling!==pageHead)pageHead.insertAdjacentElement('afterend',host);
  if(isActive){const total=Array.isArray(run.steps)?run.steps.length:0,index=Math.max(0,Number(run.cursor)||0),position=total?(Math.min(index+1,total)+' / '+total):'',nextStep=run.steps?.[index+1]||null,next=nextStep?axis821FlowSurfaceName(nextStep.objectRef):'',plan=axis821FlowPlanning(run,active),foreign=activeApi?.current?.(),ownForeground=!!(active&&foreign?.id===active.id),waiting=!run.currentEncounterId;host.dataset.state='active';host.dataset.substate=waiting?'waiting':active?.status||'linked';let body='<div class="axis821FlowTop"><span>流程'+(position?' · '+position:'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead"><small>'+(active?(active.status==='active'?'当前项目 · 进行中':'当前项目 · 已暂停'):'当前项目')+'</small><b>'+esc(axis821FlowSurfaceName(ctx.objectRef))+'</b><span>'+(next?'接下来 · '+esc(next):'最后一项')+'</span></div><div class="axis821FlowPlan"><span><small>预计总时长</small><b>'+axis821FlowApprox(plan.total)+'</b></span><span><small>计划剩余</small><b>'+axis821FlowApprox(plan.remaining)+'</b></span></div>';
   if(waiting){if(foreign)body+='<div class="axis821FlowForeign"><i></i><span><b>'+esc(foreign.name)+' 正在进行</b><small>开始此项后会暂停并保留进度</small></span></div>';body+='<button class="axis821FlowRunPrimary" data-axis-flow-record>开始此项</button><div class="axis821FlowRunSecondary"><button data-axis-flow-skip>跳过</button><button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束流程</button></div>'}
   else if(active){const est=Math.max(0,Number(active.estimateMs)||0),pct=est?Math.min(100,active.elapsedMs/est*100):0,setMode=active.mode==='sets',canSet=setMode&&active.status==='active'&&!active.planComplete,rest=active.restMs?('休息 '+axis821FlowClock(active.restMs)):(active.status==='paused'?'实际时间已暂停':' ');body+='<div class="axis821FlowActiveProjection"><div class="axis821FlowActiveState"><span><i></i>'+(active.status==='active'?'进行中':'已暂停')+'</span><b>本项 '+axis821FlowClock(active.elapsedMs)+(est?' / '+axis821FlowApprox(est):'')+'</b></div><div class="axis821FlowActiveAxis"><i style="width:'+pct+'%"></i></div>'+(setMode?'<div class="axis821FlowActiveSets"><span><b>'+active.completedSets+' / '+active.plannedSets+'</b><small>组</small></span><em>'+esc(rest)+'</em>'+(canSet?'<button data-axis-flow-active-set>完成一组</button>':'')+'</div>':'<div class="axis821FlowActiveRest">'+esc(rest)+'</div>')+'<div class="axis821FlowActiveActions"><button data-axis-flow-active-toggle>'+(active.status==='active'?'暂停':'继续此项')+'</button><button class="axis821FlowHoldFinish" data-axis-flow-active-finish><span>长按完成此项</span><i></i></button></div></div><div class="axis821FlowRunSecondary executing"><button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束流程</button></div>';if(active.status==='paused'&&foreign&&foreign.id!==active.id)body+='<div class="axis821FlowForeign compact"><i></i><span><b>'+esc(foreign.name)+' 正在进行</b><small>继续此项时会自动切换</small></span></div>'}
   else body+='<div class="axis821FlowForeign"><i></i><span><b>进行状态正在同步</b><small>已存在本项记录，不会重复创建。</small></span></div>';
   host.innerHTML=body;return
  }
  if(run?.status==='complete'){const flow=flows.find(x=>x.id===run.flowRef),done=(run.consumedStepRefs?.length||0),skipped=(run.skippedStepRefs?.length||0);host.dataset.state='complete';delete host.dataset.substate;host.innerHTML='<div class="axis821FlowTop"><span>流程完成</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead complete"><small>'+done+' 项完成'+(skipped?' · '+skipped+' 项跳过':'')+'</small><b>'+esc(flow?axis821FlowSurfaceTitle(flow):'本次流程')+'</b><span>所有真实记录已经保留。</span></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-dismiss>收起</button><button data-axis-flow-restart="'+esc(run.flowRef)+'">再来一次</button></div>';return}
  if(flows.length){const flow=flows[0],count=flow.steps?.length||0;host.dataset.state='ready';delete host.dataset.substate;host.innerHTML='<div class="axis821FlowTop"><span>流程'+(count?' · '+count+' 项':'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceTitle(flow))+'</b><small>'+esc(axis821FlowSurfaceChain(flow))+'</small></div><button class="axis821FlowRunPrimary ready" data-axis-flow-start="'+esc(flow.id)+'">开始</button><button class="axis821FlowReadyEdit" data-axis-flow-edit="'+esc(flow.id)+'">编辑流程</button>';return}
  host.dataset.state='empty';delete host.dataset.substate;host.innerHTML='<div class="axis821FlowCompactEmpty"><span>流程</span><button data-axis-flow-new>＋ 新建</button></div>'
 }`,'Flow integrated Active projection');

 const marker=";try{window.__AXIS_821_FLOW_ACTIVE_CONVERGENCE__=";
 const markerAt=s.indexOf(marker);if(markerAt<0)fail('Flow Active convergence marker missing');
 const runtimePatch="\nwindow.addEventListener('axis:active-started',e=>axis821FlowOnActiveStarted(e?.detail));\nD.addEventListener('click',e=>{if(e.target.closest?.('[data-axis-flow-switch-cancel]')){axis821FlowCloseSwitch();return}if(e.target.closest?.('[data-axis-flow-switch-confirm]')){axis821FlowConfirmSwitch();return}if(e.target.closest?.('[data-axis-flow-active-set]')){const id=state.flowRun?.currentEncounterId;if(id&&axis821FlowActiveApi()?.completeSet?.(id)){axis821FlowSurfaceRenderHome()}return}if(e.target.closest?.('[data-axis-flow-active-toggle]')){axis821BeginCurrentItem();return}},true);\nD.addEventListener('pointerdown',e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]');if(!b)return;const id=state.flowRun?.currentEncounterId,api=axis821FlowActiveApi();if(!id||!api?.beginFinishHold?.(id,e))return;e.preventDefault();b.classList.add('holding')},true);\nfor(const type of ['pointerup','pointercancel'])D.addEventListener(type,e=>{const b=e.target.closest?.('[data-axis-flow-active-finish]')||$('#axis821FlowHome [data-axis-flow-active-finish].holding');if(!b)return;b.classList.remove('holding');axis821FlowActiveApi()?.cancelFinishHold?.()},true);\nclearInterval(axis821FlowUiTimer);axis821FlowUiTimer=setInterval(()=>{if(D.visibilityState==='visible'&&state.flowRun?.status==='active')axis821FlowSurfaceRenderHome?.()},1000);\ntry{window.__AXIS_821_FLOW_SESSION_COORDINATION__={version:'8.21',flowOwner:'app.js-orchestration',activeOwner:'v87',activeCardinality:'one-foreground+paused',switchCancelSafe:true,quickRecordCanonicalObject:true,expectedDurationPlanning:true,flowActiveProjection:true,detourRecordOnly:true,newStorage:false,newRecorder:false,newActiveOwner:false,newEncounterWriter:false}}catch{};\n";
 s=s.slice(0,markerAt)+runtimePatch+s.slice(markerAt);
 syntax(s,FILE);write(FILE,s);
}

/* Static presentation only. The integrated card reuses AXIS spacing, typography,
   muted/accent semantics and the existing v87 finish-hold feedback language. */
{
 const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Flow Session Coordination */';if(s.includes(marker))fail('Flow Session coordination CSS duplicated');
 s+=`\n\n${marker}\nbody.axis821-flow-integrated-active #v87Now{display:none!important}.axis821FlowPlan{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:17px 0 4px;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}.axis821FlowPlan>span{min-height:58px;display:flex;flex-direction:column;justify-content:center;gap:3px}.axis821FlowPlan>span+span{padding-left:18px;border-left:1px solid var(--line2)}.axis821FlowPlan small{font-size:10px;color:var(--dim)}.axis821FlowPlan b{font-size:13px;font-weight:620;color:var(--text)}.axis821FlowForeign{min-height:58px;margin:13px 0;display:flex;align-items:center;gap:10px;padding:0 13px;border-radius:16px;background:rgba(255,255,255,.032)}.axis821FlowForeign.compact{margin:9px 0 0;min-height:48px}.axis821FlowForeign>i{width:8px;height:8px;flex:0 0 8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 6px rgba(115,124,255,.10)}.axis821FlowForeign span{min-width:0}.axis821FlowForeign b,.axis821FlowForeign small{display:block}.axis821FlowForeign b{font-size:11.5px;font-weight:620;color:var(--text)}.axis821FlowForeign small{margin-top:3px;font-size:10px;line-height:1.45;color:var(--dim)}.axis821FlowActiveProjection{margin:14px 0 3px;padding:15px 14px 13px;border-radius:20px;background:linear-gradient(180deg,rgba(19,22,29,.96),rgba(13,16,21,.96));box-shadow:inset 0 0 0 1px rgba(255,255,255,.055)}.axis821FlowActiveState{display:flex;align-items:center;justify-content:space-between;gap:12px}.axis821FlowActiveState>span{display:flex;align-items:center;gap:8px;font-size:11px;color:var(--muted)}.axis821FlowActiveState>span i{width:7px;height:7px;border-radius:50%;background:var(--accent)}.axis821FlowActiveState>b{font-size:11px;font-weight:580;color:var(--muted);font-variant-numeric:tabular-nums}.axis821FlowActiveAxis{height:2px;margin:13px -14px 0;background:rgba(255,255,255,.045);overflow:hidden}.axis821FlowActiveAxis i{display:block;height:100%;background:linear-gradient(90deg,#737cff,#8e96ff);transition:width .3s ease}.axis821FlowActiveSets{min-height:62px;display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:12px;align-items:center}.axis821FlowActiveSets>span{display:flex;align-items:baseline;gap:4px}.axis821FlowActiveSets>span b{font-size:19px;font-weight:650}.axis821FlowActiveSets>span small,.axis821FlowActiveSets em{font-size:10px;color:var(--dim);font-style:normal}.axis821FlowActiveSets em{text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowActiveSets button{height:34px;padding:0 12px;border:0;border-radius:11px;background:rgba(115,124,255,.16);color:var(--accent2);font-size:11px;font-weight:650}.axis821FlowActiveRest{min-height:44px;display:flex;align-items:center;color:var(--dim);font-size:10.5px}.axis821FlowActiveActions{display:grid;grid-template-columns:1fr 1.35fr;gap:9px}.axis821FlowActiveActions>button{height:46px;border:0;border-radius:14px;background:rgba(255,255,255,.045);color:var(--muted);font-size:11.5px;font-weight:620}.axis821FlowHoldFinish{position:relative;overflow:hidden;color:var(--text)!important;touch-action:none}.axis821FlowHoldFinish:before{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(115,124,255,.19),rgba(142,150,255,.19));transform:scaleX(0);transform-origin:left;transition:none}.axis821FlowHoldFinish.holding:before{transform:scaleX(1);transition:transform 1.52s linear}.axis821FlowHoldFinish span,.axis821FlowHoldFinish i{position:relative;z-index:1}.axis821FlowHoldFinish i{display:inline-block;width:7px;height:7px;margin-left:8px;border:1px solid currentColor;border-radius:3px;opacity:.55}.axis821FlowSwitchSheet{padding-bottom:max(22px,env(safe-area-inset-bottom))}.axis821SwitchCurrent,.axis821SwitchTarget{padding:16px 2px;border-bottom:1px solid var(--line2)}.axis821SwitchCurrent small,.axis821SwitchTarget small,.axis821SwitchCurrent b,.axis821SwitchTarget b,.axis821SwitchCurrent span,.axis821SwitchTarget span{display:block}.axis821SwitchCurrent small,.axis821SwitchTarget small{font-size:10px;color:var(--dim)}.axis821SwitchCurrent b,.axis821SwitchTarget b{margin-top:5px;font-size:18px;font-weight:660}.axis821SwitchCurrent span,.axis821SwitchTarget span{margin-top:6px;font-size:11px;line-height:1.55;color:var(--muted)}.axis821SwitchPrimary{width:100%;height:58px;margin-top:18px;border-radius:18px!important;font-size:14px!important}.axis821SwitchKeep{width:100%;height:48px;margin-top:7px;border:0;background:transparent;color:var(--muted);font-size:12px}.axis821FlowHome[data-substate="paused"] .axis821FlowActiveState>span i{background:var(--dim);box-shadow:none}@media(max-width:420px){.axis821FlowPlan{margin-top:14px}.axis821FlowActiveProjection{padding-left:12px;padding-right:12px}.axis821FlowActiveAxis{margin-left:-12px;margin-right:-12px}}\n`;
 write(FILE,s);
}

for(const [f,tokens] of [
 ['app.js',['__AXIS_821_FLOW_SESSION_COORDINATION__','axis821FlowShowSwitch','axis821FlowExpectedForObject','axis821FlowActiveProjection','axis821-flow-integrated-active','__AXIS_FLOW_RECORD_CONTEXT__']],
 ['v61.js',['__AXIS_QUICK_SELECTION_COMMIT__','__AXIS_PICK_EQUIPMENT__','openFor:chooseQuick']],
 ['v82-runtime.js',['axis821SaveRecordOnly','axis:active-started','flowDetour?.recordOnly']],
 ['v87-runtime.js',['__AXIS_ACTIVE_RUNTIME__','one-foreground+paused','axis821ActiveBeginFinishHold']],
 ['styles.css',['AXIS 8.21 Flow Session Coordination','axis821FlowActiveProjection','axis821FlowSwitchSheet']]
]){const x=read(f);for(const t of tokens)if(!x.includes(t))fail(`${f} missing ${t}`)}
const app=read('app.js');if((app.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');for(const forbidden of ['axis_flow_state','axis_flow_run',"localStorage.setItem('axis_flow",'localStorage.setItem("axis_flow'])if(app.includes(forbidden))fail(`forbidden Flow persistence owner returned · ${forbidden}`);
console.log('[AXIS 8.21 Flow Session coordination] PASS · canonical modern Object openFor · existing one-active+paused owner · conflict-safe start/resume · Active projection · Flow expected duration context · detour record-only snapshot · no new factual owner');
