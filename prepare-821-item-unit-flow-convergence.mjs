import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Item-unit Flow] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
function replaceFunction(src,signature,replacement,label){
 const start=src.indexOf(signature);if(start<0)fail(`${label} signature missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${label} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++;}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${label} closing brace missing`);
 return src.slice(0,start)+replacement+src.slice(end);
}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

/*
 * A Flow is ordered intent. During a Flow, the Object itself is the minimum
 * completion unit. Standalone Quick Record / Capture keeps the richer Object
 * execution semantics (sets, timed, hold, etc.); Flow must not route a current
 * item through that standalone lifecycle merely to move to the next item.
 *
 * One factual Encounter is still written for each completed Flow item. It is a
 * one-shot completion Encounter, committed by the same app-owned writer used by
 * ordinary saves. We do not fabricate weight/reps/sets from previous records.
 */
{
 const FILE='app.js';let s=read(FILE);

 s=replaceFunction(s,'function axis821CreateEncounterProvenance(ctx)',`function axis821CreateEncounterProvenance(ctx,executionMode){if(!ctx||ctx.missingObject)return null;let ids=(ctx.effectiveMetricSchema||[]).map(x=>x.key).filter(Boolean);const set=new Set(ids);if(set.has('weight')&&set.has('reps')&&set.has('sets'))ids=ids.filter(x=>x!=='sets');return{schema:AXIS821_FLOW_PROVENANCE,flowRef:ctx.flowRef,flowStepRef:ctx.stepRef,objectRef:ctx.objectRef,stepSnapshot:{repeat:Number(ctx.repeat)||1,effectiveMetricIds:ids,effectiveExecutionMode:executionMode||ctx.effectiveExecutionMode,overrideProvenance:axis821FlowClone(ctx.overrideProvenance)}}}`,'Flow provenance item completion mode');

 s=replaceFunction(s,'function axis821AttachFlowProvenance(e,eq)',`function axis821AttachFlowProvenance(e,eq,options){if(options?.intent!=='flow-item')return false;const ctx=axis821ResolvedCurrent();if(!ctx||ctx.missingObject||ctx.objectRef!==eq?.id)return false;const p=axis821CreateEncounterProvenance(ctx,'complete');if(!p)return false;e.flowProvenance=p;return true}`,'generic Encounter must not consume Flow intent');

 const saveAnchor='function axis821SaveFlow(input)';
 const saveAt=s.indexOf(saveAnchor);if(saveAt<0)fail('Flow save anchor missing');
 const itemBlock=`function axis821CommitEncounter(e,eq){if(!state.active||!e||!eq)return false;learnMemory(eq.id);state.active.events.push(e);save();return e}\nfunction axis821FlowItemMetrics(schema,startedAt,completedAt){const vals={};for(const m of schema||[]){if(m?.key==='completed')vals.completed=true;else if(m?.key==='duration'){const minutes=Math.max(0,Math.round(((completedAt-startedAt)/60000)*10)/10);vals.duration=minutes}}return vals}\nfunction axis821CompleteCurrentItem(){axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw(),ctx=axis821ResolvedCurrent();if(!r||!step||!ctx||ctx.missingObject)return false;const eq=axis818Eq(step.objectRef);if(!eq)return false;const completedAt=Date.now(),startedAt=Number(r.itemStartedAt)||completedAt,schema=axis821SchemaForRecording(eq),vals=axis821FlowItemMetrics(schema,startedAt,completedAt),e={id:uid('E'),equipmentId:eq.id,name:eq.name,pattern:eq.pattern,kind:eq.type,muscles:eq.muscles||[],effect:eq.effect||'',time:completedAt,frameRefs:[],photoBytes:0,videoBytes:0,metricSchemaSnapshot:schema.map(axis818CloneMetric),metrics:vals,executionModeSnapshot:'complete',objectTruthVersion:'8.18',flowItem:{startedAt,completedAt,durationMs:Math.max(0,completedAt-startedAt)}};axis818ApplyLegacy(e,vals);axis821AttachFlowProvenance(e,eq,{intent:'flow-item'});if(!e.flowProvenance)return false;if(!axis821CommitEncounter(e,eq))return false;r.lastEncounterId=e.id;r.consumedStepRefs=[...(r.consumedStepRefs||[]),step.id];r.cursor=(Number(r.cursor)||0)+1;if(r.cursor>=r.steps.length){r.status='complete';r.completedAt=completedAt;r.itemStartedAt=null}else{r.itemStartedAt=completedAt}save();try{render()}catch{}return{encounterId:e.id,complete:r.status==='complete',current:axis821FlowClone(axis821ResolvedCurrent()),run:axis821FlowClone(r)}}\n`;
 s=s.slice(0,saveAt)+itemBlock+s.slice(saveAt);

 s=replaceFunction(s,'function axis821LaunchFlow(id)',`function axis821LaunchFlow(id){const flow=axis821FlowById(id);if(!flow)return null;const startedAt=Date.now(),steps=axis821FlowClone(flow.steps);if(!state.active)state.active={id:uid('S'),start:startedAt,events:[]};state.flowRun={schema:'axis.flow-run.v1',id:uid('FR'),flowRef:flow.id,startedAt,status:'active',cursor:0,steps,consumedStepRefs:[],skippedStepRefs:[],lastEncounterId:null,itemStartedAt:startedAt};save();try{render()}catch{}return axis821FlowClone(axis821ResolvedCurrent())}`,'Flow launch starts one Session and first item directly');

 s=replaceFunction(s,'function axis821AdvanceFlow()',`function axis821AdvanceFlow(){return false}`,'retire arbitrary Encounter-driven Flow advance');

 s=replaceFunction(s,'function axis821SkipFlow()',`function axis821SkipFlow(){axis821FlowState();const r=state.flowRun,step=axis821CurrentStepRaw();if(!r||!step)return false;const now=Date.now();r.skippedStepRefs=[...(r.skippedStepRefs||[]),step.id];r.cursor=(Number(r.cursor)||0)+1;r.lastEncounterId=null;if(r.cursor>=r.steps.length){r.status='complete';r.completedAt=now;r.itemStartedAt=null}else r.itemStartedAt=now;save();return axis821FlowClone(axis821ResolvedCurrent())||true}`,'item-level skip');

 const oldCommit="learnMemory(eq.id);axis821AttachFlowProvenance(e,eq);state.active.events.push(e);save();try{closeSheet('scanSheet')}";
 const newCommit="axis821CommitEncounter(e,eq);try{closeSheet('scanSheet')}";
 s=once(s,oldCommit,newCommit,'canonical Encounter writer factor');

 const exportOld="finish:axis821FinishFlow,hasMetricOverride:axis821HasMetricOverrideForRecording";
 const exportNew="finish:axis821FinishFlow,completeCurrent:axis821CompleteCurrentItem,itemUnit:true,genericEncounterAdvance:false,hasMetricOverride:axis821HasMetricOverrideForRecording";
 s=once(s,exportOld,exportNew,'item-unit Flow runtime export');

 s=replaceFunction(s,'function axis821FlowSurfaceTitle(flow)',`function axis821FlowSurfaceTitle(flow){const t=String(flow?.title||'').trim();if(t)return t;const count=Array.isArray(flow?.steps)?flow.steps.length:0;return count?count+' 个项目':'未命名流程'}`,'unnamed Flow title must not duplicate chain');

 const home=`function axis821FlowSurfaceRenderHome(){
 axis821FlowSurfaceEnsureDom();const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();if(!host||!api){if(host)host.innerHTML='';return}
 const run=api.run?.(),ctx=api.current?.(),flows=axis821FlowSurfaceFlows();
 if(run?.status==='active'&&ctx){const total=Array.isArray(run.steps)?run.steps.length:0,index=Math.max(0,Number(run.cursor)||0),position=total?(Math.min(index+1,total)+' / '+total):'',nextStep=run.steps?.[index+1]||null,next=nextStep?axis821FlowSurfaceName(nextStep.objectRef):'';host.dataset.state='active';host.innerHTML='<div class="axis821FlowTop"><span>流程'+(position?' · '+position:'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead"><small>当前项目</small><b>'+esc(axis821FlowSurfaceName(ctx.objectRef))+'</b><span>'+(next?'接下来 · '+esc(next):'最后一项')+'</span></div><button class="axis821FlowRunPrimary" data-axis-flow-record>完成此项</button><div class="axis821FlowRunSecondary"><button data-axis-flow-skip>跳过</button><button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束</button></div>';return}
 if(run?.status==='complete'){const flow=flows.find(x=>x.id===run.flowRef),done=(run.consumedStepRefs?.length||0),skipped=(run.skippedStepRefs?.length||0);host.dataset.state='complete';host.innerHTML='<div class="axis821FlowTop"><span>流程完成</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead complete"><small>'+done+' 项完成'+(skipped?' · '+skipped+' 项跳过':'')+'</small><b>'+esc(flow?axis821FlowSurfaceTitle(flow):'本次流程')+'</b><span>记录已经保存，可以继续训练或收起流程。</span></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-dismiss>收起</button><button data-axis-flow-restart="'+esc(run.flowRef)+'">再来一次</button></div>';return}
 if(flows.length){const flow=flows[0],count=flow.steps?.length||0;host.dataset.state='ready';host.innerHTML='<div class="axis821FlowTop"><span>流程'+(count?' · '+count+' 项':'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceTitle(flow))+'</b><small>'+esc(axis821FlowSurfaceChain(flow))+'</small></div><button class="axis821FlowRunPrimary ready" data-axis-flow-start="'+esc(flow.id)+'">开始</button><button class="axis821FlowReadyEdit" data-axis-flow-edit="'+esc(flow.id)+'">编辑流程</button>';return}
 host.dataset.state='empty';host.innerHTML='<div class="axis821FlowCompactEmpty"><span>流程</span><button data-axis-flow-new>＋ 新建</button></div>';
}`;
 s=replaceFunction(s,'function axis821FlowSurfaceRenderHome()',home,'item-unit Today Flow surface');

 s=replaceFunction(s,'function axis821FlowSurfaceRecord()',`function axis821FlowSurfaceRecord(){const api=axis821FlowSurfaceApi();if(!api?.completeCurrent)return;const result=api.completeCurrent();if(!result)return;axis821FlowSurfaceRenderHome();toast(result.complete?'流程已完成':'已完成，进入下一项')}`,'Flow primary action completes item directly');
 s=replaceFunction(s,'function axis821FlowSurfaceAfterEncounter(id)',`function axis821FlowSurfaceAfterEncounter(id){axis821FlowSurfaceRenderHome();return false}`,'ordinary Encounter never advances Flow');

 s=replaceFunction(s,'function eventMeta(e)',`function eventMeta(e){if(e?.flowProvenance&&e?.executionModeSnapshot==='complete'){const ms=Number(e.flowItem?.durationMs)||0,minutes=Math.max(0,Math.round(ms/6000)/10);return minutes>0?'已完成 · '+minutes+'分钟':'已完成'}return e.kind==='strength'?\`${'${numFmt(e.weight)}'}kg · ${'${e.reps}'}次 · ${'${e.sets}'}组\`:\`${'${e.duration}'}分钟 · 强度${'${e.intensity}'}\`}`,'Flow item history metadata');

 s += "\n;try{window.__AXIS_821_ITEM_UNIT_FLOW__={version:'8.21',owner:'app.js-orchestration',itemIsCompletionUnit:true,directCurrentCompletion:true,standaloneQuickUnaffected:true,genericEncounterAdvance:false,oneEncounterPerCompletedItem:true,newStorage:false,newActiveOwner:false,newRecorder:false,newEncounterWriter:false}}catch{};\n";

 if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('authoritative Encounter append must remain exactly once');
 if(!s.includes("completeCurrent:axis821CompleteCurrentItem,itemUnit:true,genericEncounterAdvance:false"))fail('item-unit runtime export missing');
 if(s.includes("function axis821FlowSurfaceRecord(){const api=axis821FlowSurfaceApi(),ctx=api?.current?.();if(!ctx)return;api.selectCurrent?.()"))fail('Flow still routes current item through Quick Record');
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Item-unit Flow Convergence */';if(s.includes(marker))fail('item-unit Flow CSS duplicated');
 s+=String.raw`

/* AXIS 8.21 Item-unit Flow Convergence */
.axis821FlowHome[data-state="empty"]{margin:0 0 26px;padding:0;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}.axis821FlowCompactEmpty{height:54px;display:flex;align-items:center;justify-content:space-between}.axis821FlowCompactEmpty>span{font-size:12px;font-weight:620;color:var(--muted);letter-spacing:.02em}.axis821FlowCompactEmpty>button{height:44px;padding-left:20px;font-size:12px;font-weight:610;color:var(--accent2)}.axis821FlowHome[data-state="active"]{padding-top:15px}.axis821FlowHome[data-state="active"] .axis821FlowRunLead{padding-bottom:14px}.axis821FlowHome[data-state="active"] .axis821FlowRunPrimary{height:58px;border-radius:18px;font-size:16px}.axis821FlowHome[data-state="complete"] .axis821FlowRunLead>small{color:var(--accent2)}
`;
 write(FILE,s);
}

/* The current-release lane names the historical Flow runtime smoke directly.
   Redirect that entry point, and the nested 8.21 physical chain, to the final
   item-unit product scenario generated by this late convergence pass. */
{
 const FILE='scripts/axis-821-flow-runtime-smoke.mjs';
 write(FILE,"await import('./axis-821-item-unit-flow-smoke.mjs');\n");
 const CHAIN='scripts/axis-821-recording-property-surface-smoke.mjs';let s=read(CHAIN);
 const old="await import('./axis-821-flow-user-surface-smoke.mjs');\nawait import('./axis-821-flow-reality-smoke.mjs');";
 if(!s.includes(old))fail('8.21 physical Flow import chain missing');
 s=s.replace(old,"await import('./axis-821-item-unit-flow-smoke.mjs');");write(CHAIN,s);
}

for(const [f,tokens] of [
 ['app.js',['__AXIS_821_ITEM_UNIT_FLOW__','function axis821CompleteCurrentItem()','data-axis-flow-record>完成此项','axis821FlowCompactEmpty','genericEncounterAdvance:false']],
 ['styles.css',['AXIS 8.21 Item-unit Flow Convergence','.axis821FlowCompactEmpty{height:54px']],
 ['scripts/axis-821-flow-runtime-smoke.mjs',["axis-821-item-unit-flow-smoke.mjs"]]
]){const s=read(f);for(const t of tokens)if(!s.includes(t))fail(`${f} missing ${t}`)}

console.log('[AXIS 8.21 Item-unit Flow] PASS · Flow sequences Objects · Object is minimum completion unit · direct complete→next · ordinary Quick cannot consume Flow · compact empty Home · single Encounter writer preserved');
