import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow Active convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function functionRange(src,signature,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
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
 * Manual Production testing exposed a semantic split: Flow had gained a direct
 * "complete item" writer/presentation while the established app/v82/v87 Active
 * lifecycle was still visible below it. This pass removes that split without
 * adding a new recorder, Active owner, picker, store or Encounter append.
 *
 * Flow owns context + sequencing only:
 *   current Flow item -> existing canonical recorder -> existing Active lifecycle
 *   -> existing Active finish -> Flow advances.
 * One-shot single/complete items advance after the canonical Encounter commit.
 * A temporary other record is a factual record-only detour: no skip and no Active.
 */
{
 const FILE='app.js';let s=read(FILE);

 s=replaceFunction(s,'function axis821AttachFlowProvenance(e,eq,options)',`function axis821AttachFlowProvenance(e,eq,options){const intent=String(options?.intent||'');if(intent!=='flow-current-record'&&intent!=='flow-item')return false;const ctx=axis821ResolvedCurrent();if(!ctx||ctx.missingObject||ctx.objectRef!==eq?.id)return false;const execution=String(options?.executionMode||e?.executionModeSnapshot||ctx.effectiveExecutionMode||'complete');const p=axis821CreateEncounterProvenance(ctx,execution);if(!p)return false;e.flowProvenance=p;return true}`,'Flow provenance canonical-current intent');

 const completeAnchor='function axis821CompleteCurrentItem()';
 if(!s.includes(completeAnchor))fail('item-unit completion anchor missing');
 const helpers=String.raw`
let axis821FlowRecordingIntent=null;
function axis821FlowObject(ref){return axis818Eq(ref)||eqById(ref)||null}
function axis821FlowOngoingMode(mode){return ['sets','rounds','timed','hold'].includes(String(mode||''))}
function axis821FlowRecorderContextClear(){
 const host=$('#axis821FlowRecordContext');if(host)host.remove();const saveBtn=$('#saveScan');if(saveBtn?.dataset.axis821FlowOriginalText!=null){saveBtn.textContent=saveBtn.dataset.axis821FlowOriginalText;delete saveBtn.dataset.axis821FlowOriginalText}
}
function axis821FlowRecorderContextShow(mode,eq){
 const sheet=$('#scanSheet .sheet');if(!sheet||!eq)return;let host=$('#axis821FlowRecordContext');if(!host){host=D.createElement('div');host.id='axis821FlowRecordContext';host.className='axis821FlowRecordContext';const head=$('#scanSheet .sheetHead');head?.insertAdjacentElement('afterend',host)}
 const r=state.flowRun,total=Array.isArray(r?.steps)?r.steps.length:0,index=Math.max(0,Number(r?.cursor)||0),position=total?(Math.min(index+1,total)+' / '+total):'',execution=mode==='current'?axis821ExecutionForRecording(eq):null,ongoing=axis821FlowOngoingMode(execution);
 host.dataset.mode=mode;host.innerHTML=mode==='current'?'<span>流程'+(position?' · '+position:'')+'</span><b>'+esc(eq.name||'当前项目')+'</b><small>'+(ongoing?'记录后进入进行中；暂停、休息和完成继续使用原有控制。':'这是一次性项目，记下后直接进入下一项。')+'</small>':'<span>临时记录</span><b>'+esc(eq.name||'其他项目')+'</b><small>只留下这条记录，不会跳过当前流程项，也不会启动另一个进行中项目。</small>';
 const saveBtn=$('#saveScan');if(saveBtn){if(saveBtn.dataset.axis821FlowOriginalText==null)saveBtn.dataset.axis821FlowOriginalText=saveBtn.textContent||'记下';saveBtn.textContent=mode==='current'?(ongoing?'开始此项':'完成并继续'):'记下，不改变流程'}
}
function axis821FlowReconcileCoreEvent(id){try{const fresh=JSON.parse(localStorage.getItem('axis_v60_state')||'null'),next=fresh?.active?.events?.find(x=>x.id===id),cur=state.active?.events?.find(x=>x.id===id);if(next&&cur)Object.assign(cur,next)}catch{}}
function axis821FlowAdvanceCompletedCurrent(encounter,reason='complete'){
 axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw();if(!r||r.status!=='active'||!step)return false;if(encounter&&step.objectRef!==(encounter.equipmentId||encounter.eq))return false;
 const now=Date.now();if(encounter?.id)r.lastEncounterId=encounter.id;if(!r.consumedStepRefs?.includes(step.id))r.consumedStepRefs=[...(r.consumedStepRefs||[]),step.id];r.currentEncounterId=null;r.currentStepRef=null;r.cursor=(Number(r.cursor)||0)+1;
 if(r.cursor>=r.steps.length){r.status='complete';r.completedAt=now;r.itemStartedAt=null}else r.itemStartedAt=now;
 save();try{render()}catch{};axis821FlowSurfaceRenderHome?.();try{window.dispatchEvent(new CustomEvent('axis:flow-step-completed',{detail:{flowRef:r.flowRef,stepRef:step.id,encounterId:encounter?.id||null,reason}}))}catch{}return true
}
function axis821FlowAfterCanonicalCommit(e,intent){
 axis821FlowRecorderContextClear();if(!e||!intent)return false;
 if(intent.mode==='detour'){axis821FlowSurfaceRenderHome?.();toast?.('已记录，当前流程项不变');return true}
 if(intent.mode!=='current')return false;const r=state.flowRun,step=axis821CurrentStepRaw();if(!r||r.status!=='active'||!step||step.objectRef!==(e.equipmentId||e.eq))return false;
 const mode=String(e.executionModeSnapshot||'');if(axis821FlowOngoingMode(mode)){r.currentEncounterId=e.id;r.currentStepRef=step.id;r.itemStartedAt=Number(e.time)||Date.now();save();axis821FlowSurfaceRenderHome?.();return true}
 return axis821FlowAdvanceCompletedCurrent(e,'one-shot-commit')
}
function axis821FlowOnActiveFinished(id){
 axis821FlowState();const r=state.flowRun;if(!id||!r||r.status!=='active'||r.currentEncounterId!==id)return false;axis821FlowReconcileCoreEvent(id);const e=state.active?.events?.find(x=>x.id===id);if(!e)return false;return axis821FlowAdvanceCompletedCurrent(e,'active-finished')
}
function axis821BeginCurrentItem(){
 axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw(),ctx=axis821ResolvedCurrent();if(!r||r.status!=='active'||!step||!ctx||ctx.missingObject)return false;if(r.currentEncounterId){toast?.('当前项目已经在进行中');return false}const eq=axis821FlowObject(step.objectRef);if(!eq)return false;
 axis821FlowRecordingIntent={mode:'current',flowRef:r.flowRef,stepRef:step.id,objectRef:eq.id};const q=window.__AXIS_QUICK_RECORD__;if(!q?.openFor){axis821FlowRecordingIntent=null;toast?.('记录入口尚未就绪');return false}q.openFor(eq.id);requestAnimationFrame(()=>axis821FlowRecorderContextShow('current',eq));return true
}
function axis821BeginDetour(id){
 axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw(),eq=axis821FlowObject(id);if(!r||r.status!=='active'||!step||!eq)return false;axis821FlowRecordingIntent={mode:'detour',flowRef:r.flowRef,stepRef:step.id,objectRef:eq.id};const q=window.__AXIS_QUICK_RECORD__;if(!q?.openFor){axis821FlowRecordingIntent=null;toast?.('记录入口尚未就绪');return false}q.openFor(eq.id);requestAnimationFrame(()=>axis821FlowRecorderContextShow('detour',eq));return true
}
`;
 s=s.replace(completeAnchor,helpers+completeAnchor);
 s=replaceFunction(s,'function axis821CompleteCurrentItem()',`function axis821CompleteCurrentItem(){return axis821BeginCurrentItem()}`,'direct completion compatibility now begins canonical current record');

 s=replaceFunction(s,'function axis821CommitEncounter(e,eq)',`function axis821CommitEncounter(e,eq){if(!state.active||!e||!eq)return false;const intent=axis821FlowRecordingIntent;axis821FlowRecordingIntent=null;if(intent?.mode==='current'&&intent.objectRef===eq.id){axis821AttachFlowProvenance(e,eq,{intent:'flow-current-record',executionMode:e.executionModeSnapshot});const r=state.flowRun,step=axis821CurrentStepRaw();if(r?.status==='active'&&step?.id===intent.stepRef&&step.objectRef===eq.id){r.currentEncounterId=e.id;r.currentStepRef=step.id;r.itemStartedAt=Number(e.time)||Date.now()}}else if(intent?.mode==='detour'){e.flowDetour={schema:'axis.flow-detour.v1',recordOnly:true,flowRef:state.flowRun?.flowRef||null,returnStepRef:axis821CurrentStepRaw()?.id||null}}learnMemory(eq.id);state.active.events.push(e);save();queueMicrotask(()=>axis821FlowAfterCanonicalCommit(e,intent));return e}`,'single app Encounter append with Flow intent context');

 s=replaceFunction(s,'function axis821LaunchFlow(id)',`function axis821LaunchFlow(id){const flow=axis821FlowById(id);if(!flow)return null;const startedAt=Date.now(),steps=axis821FlowClone(flow.steps);if(!state.active)state.active={id:uid('S'),start:startedAt,events:[]};state.flowRun={schema:'axis.flow-run.v1',id:uid('FR'),flowRef:flow.id,startedAt,status:'active',cursor:0,steps,consumedStepRefs:[],skippedStepRefs:[],lastEncounterId:null,currentEncounterId:null,currentStepRef:null,itemStartedAt:startedAt};save();try{render()}catch{}return axis821FlowClone(axis821ResolvedCurrent())}`,'Flow launch current Active handoff fields');
 s=replaceFunction(s,'function axis821SkipFlow()',`function axis821SkipFlow(){axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw();if(!r||!step)return false;if(r.currentEncounterId)return false;const now=Date.now();r.skippedStepRefs=[...(r.skippedStepRefs||[]),step.id];r.cursor=(Number(r.cursor)||0)+1;r.lastEncounterId=null;r.currentEncounterId=null;r.currentStepRef=null;if(r.cursor>=r.steps.length){r.status='complete';r.completedAt=now;r.itemStartedAt=null}else r.itemStartedAt=now;save();return axis821FlowClone(axis821ResolvedCurrent())||true}`,'skip only before current item starts');

 const runtimeOld='finish:axis821FinishFlow,completeCurrent:axis821CompleteCurrentItem,itemUnit:true,genericEncounterAdvance:false,hasMetricOverride:axis821HasMetricOverrideForRecording';
 const runtimeNew='finish:axis821FinishFlow,completeCurrent:axis821CompleteCurrentItem,beginCurrent:axis821BeginCurrentItem,beginDetour:axis821BeginDetour,itemUnit:true,genericEncounterAdvance:false,hasMetricOverride:axis821HasMetricOverrideForRecording';
 s=once(s,runtimeOld,runtimeNew,'Flow runtime canonical-current methods');

 s=replaceFunction(s,'function axis821FlowSurfaceRenderHome()',`function axis821FlowSurfaceRenderHome(){
 axis821FlowSurfaceEnsureDom();const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();if(!host||!api){if(host)host.innerHTML='';return}
 const run=api.run?.(),ctx=api.current?.(),flows=axis821FlowSurfaceFlows(),active=run?.status==='active'&&!!ctx;
 const activeHome=$('#activeHome'),pageHead=$('#todayView .pageHead');if(active&&activeHome){if(host.parentElement!==activeHome)activeHome.insertBefore(host,activeHome.firstChild)}else if(pageHead&&host.previousElementSibling!==pageHead)pageHead.insertAdjacentElement('afterend',host);
 if(active){const total=Array.isArray(run.steps)?run.steps.length:0,index=Math.max(0,Number(run.cursor)||0),position=total?(Math.min(index+1,total)+' / '+total):'',nextStep=run.steps?.[index+1]||null,next=nextStep?axis821FlowSurfaceName(nextStep.objectRef):'',executing=!!run.currentEncounterId;host.dataset.state='active';host.dataset.substate=executing?'executing':'waiting';host.innerHTML='<div class="axis821FlowTop"><span>流程'+(position?' · '+position:'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead"><small>'+(executing?'当前项目 · 进行中':'当前项目')+'</small><b>'+esc(axis821FlowSurfaceName(ctx.objectRef))+'</b><span>'+(next?'接下来 · '+esc(next):'最后一项')+'</span></div>'+(executing?'<div class="axis821FlowRunStatus"><i></i><span><b>此项已开始</b><small>时间、暂停、休息与完成继续使用原有进行中控制。</small></span></div>':'<button class="axis821FlowRunPrimary" data-axis-flow-record>开始此项</button>')+'<div class="axis821FlowRunSecondary '+(executing?'executing':'')+'">'+(executing?'':'<button data-axis-flow-skip>跳过</button>')+'<button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束流程</button></div>';return}
 if(run?.status==='complete'){const flow=flows.find(x=>x.id===run.flowRef),done=(run.consumedStepRefs?.length||0),skipped=(run.skippedStepRefs?.length||0);host.dataset.state='complete';delete host.dataset.substate;host.innerHTML='<div class="axis821FlowTop"><span>流程完成</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead complete"><small>'+done+' 项完成'+(skipped?' · '+skipped+' 项跳过':'')+'</small><b>'+esc(flow?axis821FlowSurfaceTitle(flow):'本次流程')+'</b><span>所有真实记录已经保留。</span></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-dismiss>收起</button><button data-axis-flow-restart="'+esc(run.flowRef)+'">再来一次</button></div>';return}
 if(flows.length){const flow=flows[0],count=flow.steps?.length||0;host.dataset.state='ready';delete host.dataset.substate;host.innerHTML='<div class="axis821FlowTop"><span>流程'+(count?' · '+count+' 项':'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceTitle(flow))+'</b><small>'+esc(axis821FlowSurfaceChain(flow))+'</small></div><button class="axis821FlowRunPrimary ready" data-axis-flow-start="'+esc(flow.id)+'">开始</button><button class="axis821FlowReadyEdit" data-axis-flow-edit="'+esc(flow.id)+'">编辑流程</button>';return}
 host.dataset.state='empty';delete host.dataset.substate;host.innerHTML='<div class="axis821FlowCompactEmpty"><span>流程</span><button data-axis-flow-new>＋ 新建</button></div>';
}`,'Today Flow converged into existing Active surface');
 s=replaceFunction(s,'function axis821FlowSurfaceRecord()',`function axis821FlowSurfaceRecord(){const api=axis821FlowSurfaceApi();if(!api?.beginCurrent?.())return;axis821FlowSurfaceRenderHome()}`,'Flow current begins canonical record');
 s=replaceFunction(s,'function axis821FlowSurfaceOther()',`function axis821FlowSurfaceOther(){const api=axis821FlowSurfaceApi(),run=api?.run?.();if(!api||run?.status!=='active')return;const open=window.__AXIS_OPEN_EQUIPMENT_PICKER__;if(!open){toast('项目选择入口尚未就绪');return}open({mode:'select',owner:'flow-detour',onPick:eq=>{if(!eq?.id||!api.beginDetour?.(eq.id))toast('临时记录入口尚未就绪')}})}`,'temporary record is select-only record detour');
 s=replaceFunction(s,'function axis821FlowSurfaceSkip()',`function axis821FlowSurfaceSkip(){const api=axis821FlowSurfaceApi(),run=api?.run?.();if(run?.currentEncounterId){toast('当前项目已经开始，请使用进行中控制完成此项');return false}if(!api?.skip?.())return false;axis821FlowSurfaceRenderHome();return true}`,'skip cannot abandon started Active item');
 s=replaceFunction(s,'function axis821FlowSurfaceAfterEncounter(id)',`function axis821FlowSurfaceAfterEncounter(id){axis821FlowSurfaceRenderHome();return !!id}`,'canonical commit lifecycle owns Flow progression');

 const marker="\n;try{window.__AXIS_821_FLOW_ACTIVE_CONVERGENCE__={version:'8.21',owner:'app.js-orchestration',currentRecordOwner:'existing-canonical-recorder',activeOwner:'existing-v82/v87',advanceOn:['one-shot-canonical-commit','matching-active-finish'],detour:'record-only-no-skip-no-active',flowEmbeddedInActiveHome:true,newStorage:false,newPicker:false,newRecorder:false,newActiveOwner:false,newEncounterWriter:false};window.__AXIS_821_ITEM_UNIT_FLOW__=Object.assign({},window.__AXIS_821_ITEM_UNIT_FLOW__||{},{directCurrentCompletion:false,canonicalCurrentRecord:true,activeLifecycleDelegated:true,detourRecordOnly:true})}catch{};\n";
 s+=marker;
 const cancel=`\nD.addEventListener('click',e=>{const sheet=$('#scanSheet');if(e.target.closest?.('[data-close="scanSheet"]')||e.target===sheet){axis821FlowRecordingIntent=null;axis821FlowRecorderContextClear()}},true);\nwindow.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished(e?.detail?.id));\n`;
 s+=cancel;

 if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership must remain exactly once');
 for(const token of ['beginCurrent:axis821BeginCurrentItem','beginDetour:axis821BeginDetour','currentEncounterId','flowDetour={schema:',"directCurrentCompletion:false","detour:'record-only-no-skip-no-active'"])if(!s.includes(token))fail(`app invariant missing ${token}`);
 syntax(s,FILE);write(FILE,s);
}

/* v82 remains the sole Active creation owner. A detour is explicitly record-only;
   all normal standalone/current-Flow ongoing Encounters keep the existing path. */
{
 const FILE='v82-runtime.js';let s=read(FILE);
 const old='if(axis8201Ongoing(e))startActivity(e,axis8201EstimateForEvent(e,estimateMs));';
 const next="if(!e?.flowDetour?.recordOnly&&axis8201Ongoing(e))startActivity(e,axis8201EstimateForEvent(e,estimateMs));";
 s=once(s,old,next,'v82 record-only detour Active exclusion');
 s=mutateFunction(s,'function finishActivity(id)',fn=>fn.slice(0,-1)+"try{window.dispatchEvent(new CustomEvent('axis:active-finished',{detail:{id,owner:'v82'}}))}catch{}"+'}', 'v82 post-finish lifecycle event');
 syntax(s,FILE);write(FILE,s);
}

/* v87 remains the polished current Active presentation/action owner. Publish an
   additive post-finish event only after its existing authoritative write. */
{
 const FILE='v87-runtime.js';let s=read(FILE);
 s=mutateFunction(s,'function finish(id,t=now(),flash=true)',fn=>{const i=fn.lastIndexOf('return true');if(i<0)fail('v87 finish success return missing');return fn.slice(0,i)+"try{window.dispatchEvent(new CustomEvent('axis:active-finished',{detail:{id,owner:'v87'}}))}catch{};"+fn.slice(i)},'v87 post-finish lifecycle event');
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Flow Active Convergence */';if(s.includes(marker))fail('Flow Active convergence CSS duplicated');
 s+=String.raw`

/* AXIS 8.21 Flow Active Convergence */
#activeHome>.axis821FlowHome[data-state="active"]{margin:0 0 20px!important;padding:14px 0 18px!important;border-top:1px solid var(--line2)!important;border-bottom:1px solid var(--line2)!important}.axis821FlowHome[data-state="active"] .axis821FlowRunLead{padding:10px 0 12px!important}.axis821FlowHome[data-state="active"] .axis821FlowRunLead>b{font-size:22px!important}.axis821FlowHome[data-state="active"] .axis821FlowRunPrimary{width:auto!important;min-width:132px!important;height:46px!important;padding:0 18px!important;border-radius:14px!important;background:rgba(115,124,255,.14)!important;color:var(--accent2)!important;font-size:13px!important;font-weight:680!important}.axis821FlowHome[data-state="active"] .axis821FlowRunSecondary{display:flex!important;grid-template-columns:none!important;gap:4px!important;margin-top:7px!important}.axis821FlowHome[data-state="active"] .axis821FlowRunSecondary button{height:38px!important;padding:0 12px!important;font-size:10.5px!important;color:var(--dim)!important}.axis821FlowHome[data-state="active"] .axis821FlowRunSecondary.executing{margin-top:4px!important}.axis821FlowRunStatus{min-height:48px;display:flex;align-items:center;gap:10px;padding:8px 0 7px}.axis821FlowRunStatus>i{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 5px rgba(115,124,255,.09)}.axis821FlowRunStatus>span{min-width:0;display:block}.axis821FlowRunStatus b{display:block;font-size:11.5px;font-weight:650;color:var(--muted)}.axis821FlowRunStatus small{display:block;margin-top:3px;font-size:9.5px;line-height:1.45;color:var(--dim)}.axis821FlowRecordContext{margin:2px 16px 13px;padding:11px 12px;border-radius:14px;background:rgba(115,124,255,.08);box-shadow:inset 0 0 0 1px rgba(115,124,255,.10)}.axis821FlowRecordContext>span{display:block;font-size:9.5px;font-weight:650;color:var(--accent2)}.axis821FlowRecordContext>b{display:block;margin-top:4px;font-size:13px;font-weight:660;color:var(--text)}.axis821FlowRecordContext>small{display:block;margin-top:4px;font-size:9.5px;line-height:1.45;color:var(--muted)}.axis821FlowRecordContext[data-mode="detour"]{background:rgba(255,255,255,.035);box-shadow:inset 0 0 0 1px var(--line2)}.axis821FlowRecordContext[data-mode="detour"]>span{color:var(--muted)}
@media(max-width:360px){.axis821FlowHome[data-state="active"] .axis821FlowRunSecondary button{padding:0 8px!important;font-size:10px!important}.axis821FlowRecordContext{margin-left:12px;margin-right:12px}}
`;
 write(FILE,s);
}

for(const [f,tokens] of [
 ['app.js',['__AXIS_821_FLOW_ACTIVE_CONVERGENCE__','axis821BeginCurrentItem','axis821BeginDetour','axis821FlowOnActiveFinished','axis821FlowRecordContext','record-only-no-skip-no-active','flowEmbeddedInActiveHome:true']],
 ['v82-runtime.js',["!e?.flowDetour?.recordOnly&&axis8201Ongoing(e)","axis:active-finished"]],
 ['v87-runtime.js',["axis:active-finished"]],
 ['styles.css',['AXIS 8.21 Flow Active Convergence','#activeHome>.axis821FlowHome[data-state="active"]','.axis821FlowRunStatus{min-height:48px','.axis821FlowRecordContext{margin:2px']]
]){const x=read(f);for(const t of tokens)if(!x.includes(t))fail(`${f} missing ${t}`)}

console.log('[AXIS 8.21 Flow Active convergence] PASS · Flow embedded into existing Active surface · canonical current recorder · v82/v87 lifecycle finish advances · detour record-only/no-skip/no-Active · one app Encounter append');
