import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow step execution intent] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
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
  if(ch==='{')depth++;else if(ch==='}'&&--depth===0){end=i+1;break}
 }
 if(end<0)fail(`${label} closing brace missing`);return{start,end,text:src.slice(start,end)};
}
function mutateFunction(src,signature,mutate,label){const r=functionRange(src,signature,label),next=mutate(r.text);if(!next||next===r.text)fail(`${label} mutation did not change source`);return src.slice(0,r.start)+next+src.slice(r.end)}
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

{
 const FILE='app.js';let s=read(FILE);
 if(s.includes('__AXIS_821_FLOW_STEP_EXECUTION_INTENT__'))fail('Flow step execution intent already installed');
 const stateAt=s.indexOf('let state={'),ownerEnd=s.indexOf('})();',stateAt);
 if(stateAt<0||ownerEnd<0)fail('canonical app lexical owner missing');
 const block=String.raw`
/* AXIS 8.21 — per-Flow-step execution intent. This edits only the existing
   axis.flow.v1 step.executionOverride field. Object execution defaults remain
   untouched and the existing Encounter + v82/v87 Active owners consume the
   resolved mode. */
let axis821FlowStepExecutionOpenIndex=-1,axis821FlowStepExecutionDraftId='';
const AXIS821_FLOW_EXECUTION_OPTIONS=['single','complete','timed','hold','sets','rounds'];
function axis821FlowStepExecutionLabel(mode){return({single:'一次记录',complete:'完成即记',timed:'连续计时',hold:'保持计时',sets:'分组进行',rounds:'循环轮次'}[String(mode||'')]||String(mode||''))}
function axis821FlowStepExecutionEq(step){return step?axis821FlowSurfaceEq(step.objectRef):null}
function axis821FlowStepExecutionDefaultMode(step){
 const eq=axis821FlowStepExecutionEq(step);if(!eq)return'single';const explicit=axis821ExecutionExplicit(eq);if(explicit)return explicit;
 const keys=axis821FlowStepIntentKeys?.(step);if(keys?.length){const defs=keys.map(k=>axis821FlowStepIntentDefinition(eq,k)).filter(Boolean);if(defs.length)return axis821AutoExecutionMode(eq,defs)}
 return axis820ExecutionModeForEq(eq)
}
function axis821FlowStepExecutionShort(step){const own=String(step?.executionOverride||'').trim(),mode=own||axis821FlowStepExecutionDefaultMode(step);return(own?'此流程 · ':'自动 · ')+axis821FlowStepExecutionLabel(mode)}
function axis821FlowStepExecutionDecorateEditor(){
 const draft=axis821FlowDraft;if(!draft||!Array.isArray(draft.steps))return;const did=String(draft.id||'');if(did!==axis821FlowStepExecutionDraftId){axis821FlowStepExecutionDraftId=did;axis821FlowStepExecutionOpenIndex=-1}
 const rows=$$('.axis821FlowStep[data-axis-flow-step-index]');for(const row of rows){const index=Number(row.dataset.axisFlowStepIndex),step=draft.steps[index];if(!step)continue;let anchor=row.nextElementSibling;if(anchor?.classList?.contains('axis821FlowStepIntent')){}else anchor=row;let panel=anchor.nextElementSibling;if(!panel?.classList?.contains('axis821FlowStepExecutionIntent')){panel=D.createElement('div');panel.className='axis821FlowStepExecutionIntent';anchor.insertAdjacentElement('afterend',panel)}const open=index===axis821FlowStepExecutionOpenIndex,own=String(step.executionOverride||'').trim(),effective=own||axis821FlowStepExecutionDefaultMode(step);panel.dataset.index=String(index);panel.innerHTML='<button type="button" class="axis821FlowStepExecutionSummary" data-axis-flow-step-execution-toggle="'+index+'"><span><small>进行方式</small><b>'+esc(axis821FlowStepExecutionShort(step))+'</b></span><em>'+(open?'收起':'设置')+'</em></button>'+(open?'<div class="axis821FlowStepExecutionEditor"><p>只影响这个流程里的这一项。没有单独设置时，继续使用项目与当前记录内容推导出的方式。</p><div class="axis821FlowStepExecutionChoices">'+AXIS821_FLOW_EXECUTION_OPTIONS.map(mode=>'<button type="button" data-axis-flow-step-execution-choice="'+mode+'" data-index="'+index+'" class="'+(own===mode?'active':'')+'"><b>'+esc(axis821FlowStepExecutionLabel(mode))+'</b><small>'+(mode===effective&&!own?'当前自动':'')+'</small></button>').join('')+'</div><button type="button" class="axis821FlowStepExecutionFollow" data-axis-flow-step-execution-follow="'+index+'">跟随项目设置</button></div>':'')}
}
function axis821FlowStepExecutionChoose(index,mode){const step=axis821FlowDraft?.steps?.[index];if(!step||!AXIS821_FLOW_EXECUTION_OPTIONS.includes(mode))return false;step.executionOverride=mode;axis821FlowStepExecutionDecorateEditor();return true}
function axis821FlowStepExecutionFollow(index){const step=axis821FlowDraft?.steps?.[index];if(!step)return false;delete step.executionOverride;axis821FlowStepExecutionDecorateEditor();return true}
function axis821FlowHasExecutionOverrideForRecording(ref){const step=axis821CurrentForObject(ref);return !!(step?.executionOverride&&AXIS821_FLOW_MODES.has(step.executionOverride))}
D.addEventListener('click',e=>{const toggle=e.target.closest?.('[data-axis-flow-step-execution-toggle]');if(toggle){e.preventDefault();axis821FlowStepExecutionOpenIndex=Number(toggle.dataset.axisFlowStepExecutionToggle);axis821FlowStepExecutionDecorateEditor();return}const choice=e.target.closest?.('[data-axis-flow-step-execution-choice]');if(choice){e.preventDefault();axis821FlowStepExecutionChoose(Number(choice.dataset.index),String(choice.dataset.axisFlowStepExecutionChoice||''));return}const follow=e.target.closest?.('[data-axis-flow-step-execution-follow]');if(follow){e.preventDefault();axis821FlowStepExecutionFollow(Number(follow.dataset.axisFlowStepExecutionFollow));return}},true);
window.__AXIS_821_FLOW_STEP_EXECUTION_INTENT__={version:'8.21',owner:'axis.flow.v1.step.executionOverride',surface:'Flow editor',inheritsObjectDefault:true,modes:[...AXIS821_FLOW_EXECUTION_OPTIONS],newStorage:false,newRecorder:false,newEncounterWriter:false,newActiveOwner:false};
`;
 s=s.slice(0,ownerEnd)+block+s.slice(ownerEnd);
 s=mutateFunction(s,'function axis821FlowSurfaceRenderEditor()',fn=>fn.slice(0,-1)+';axis821FlowStepExecutionDecorateEditor()}', 'Flow editor execution-intent decoration');
 s=mutateFunction(s,'function axis821FlowStartWholeItem(eq)',fn=>{
  const from='sourceMode=axis820ExecutionModeForEq(eq)';if((fn.split(from).length-1)!==1)fail('Flow whole-item execution snapshot boundary drift');return fn.replace(from,'sourceMode=axis821ExecutionForRecording(eq)')
 },'resolved Flow execution snapshot handoff');
 s=mutateFunction(s,'function axis821BeginCurrentItem()',fn=>{
  const token="  if(axis821HasMetricOverrideForRecording(eq.id))return axis821FlowOpenRecorder('current',eq);";if((fn.split(token).length-1)!==1)fail('Flow recording preflight boundary drift');
  return fn.replace(token,"  const axis821ResolvedExecution=axis821ExecutionForRecording(eq);if(axis821HasMetricOverrideForRecording(eq.id)||(axis821FlowHasExecutionOverrideForRecording(eq.id)&&!axis821FlowOngoingMode(axis821ResolvedExecution)))return axis821FlowOpenRecorder('current',eq);")
 },'explicit one-shot execution canonical recorder preflight');
 s=mutateFunction(s,'function axis821FlowAfterCanonicalCommit(e,intent)',fn=>{
  const token="if(!r||r.status!=='active'||!step||step.objectRef!==(e.equipmentId||e.eq))return false;r.currentEncounterId=e.id;";if((fn.split(token).length-1)!==1)fail('Flow post-commit execution boundary drift');
  return fn.replace(token,"if(!r||r.status!=='active'||!step||step.objectRef!==(e.equipmentId||e.eq))return false;const execution=String(e.executionModeSnapshot||axis821ExecutionForRecording(e.equipmentId||e.eq));if(!axis821FlowOngoingMode(execution))return axis821FlowAdvanceCompletedCurrent(e,'one-shot-commit');r.currentEncounterId=e.id;")
 },'one-shot Flow execution advances after canonical Encounter commit');
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE);if(s.includes('AXIS 8.21 Flow step execution intent'))fail('Flow step execution styles already installed');
 s+=`\n/* AXIS 8.21 Flow step execution intent */\n.axis821FlowStepExecutionIntent{margin:-2px 0 8px 34px;border:1px solid var(--line);border-radius:13px;background:color-mix(in srgb,var(--s2) 62%,transparent);overflow:hidden}.axis821FlowStepExecutionSummary{width:100%;min-height:45px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left}.axis821FlowStepExecutionSummary span{display:grid;gap:2px;min-width:0}.axis821FlowStepExecutionSummary small{font-size:10.5px;color:var(--dim);font-weight:560}.axis821FlowStepExecutionSummary b{font-size:12px;line-height:1.35;font-weight:620;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowStepExecutionSummary em{font-size:11px;font-style:normal;color:var(--accent2);font-weight:650;flex:0 0 auto}.axis821FlowStepExecutionEditor{padding:0 10px 10px;border-top:1px solid var(--line)}.axis821FlowStepExecutionEditor p{margin:9px 0 8px;color:var(--dim);font-size:11px;line-height:1.45}.axis821FlowStepExecutionChoices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.axis821FlowStepExecutionChoices button{min-height:42px;padding:6px 8px;border-radius:10px;background:var(--s2);color:var(--dim);display:grid;gap:1px;text-align:left}.axis821FlowStepExecutionChoices button b{font-size:11px;font-weight:650;color:inherit}.axis821FlowStepExecutionChoices button small{min-height:12px;font-size:9.5px;color:var(--dim)}.axis821FlowStepExecutionChoices button.active{background:rgba(115,124,255,.16);color:var(--accent2);box-shadow:inset 0 0 0 1px rgba(115,124,255,.24)}.axis821FlowStepExecutionFollow{margin-top:8px;min-height:34px;width:100%;border-radius:10px;color:var(--dim);font-size:11px;font-weight:600;background:transparent;border:1px solid var(--line)}@media(max-width:380px){.axis821FlowStepExecutionIntent{margin-left:29px}}\n`;
 write(FILE,s);
}

console.log('[AXIS 8.21 Flow step execution intent] PASS · existing step.executionOverride only · resolved mode reaches canonical Encounter/Active owners · one-shot override uses canonical recorder · no Object mutation · no new persistence/recorder/Encounter/Active owner');
