import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow step recording intent] ${m}`)};
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
 if(s.includes('__AXIS_821_FLOW_STEP_RECORDING_INTENT__'))fail('Flow step recording intent already installed');
 const stateAt=s.indexOf('let state={'),ownerEnd=s.indexOf('})();',stateAt);
 if(stateAt<0||ownerEnd<0)fail('canonical app lexical owner missing');
 const block=String.raw`
/* AXIS 8.21 — per-Flow-step recording intent. This edits only the already-owned
   axis.flow.v1 step.metricOverride intent. Object/Profile defaults remain intact;
   canonical Encounter snapshots preserve the effective schema when execution occurs. */
let axis821FlowStepIntentOpenIndex=-1,axis821FlowStepIntentDraftId='';
function axis821FlowStepIntentKeys(raw){const xs=raw?.metricOverride?.metrics;if(!Array.isArray(xs))return null;const out=[],seen=new Set();for(const item of xs){const k=String(typeof item==='string'?item:item?.key??item?.id??'').trim();if(k&&!seen.has(k)){seen.add(k);out.push(k)}}return out.length?out:null}
function axis821FlowStepIntentEq(step){return step?axis821FlowSurfaceEq(step.objectRef):null}
function axis821FlowStepIntentDefaultKeys(step){const eq=axis821FlowStepIntentEq(step);if(!eq)return[];try{return(axis818SchemaForEq(eq)||[]).map(x=>String(x?.key||x?.id||'')).filter(Boolean)}catch{return[]}}
function axis821FlowStepIntentDefinition(eq,key){try{return axis821ObjectMetricDefinition(eq,key)}catch{return AXIS818_METRICS?.[key]?axis818CloneMetric(AXIS818_METRICS[key]):null}}
function axis821FlowStepIntentDefs(step){const eq=axis821FlowStepIntentEq(step);if(!eq)return[];const order=[],seen=new Set(),add=k=>{k=String(k||'').trim();if(k&&!seen.has(k)){seen.add(k);order.push(k)}};for(const k of axis821FlowStepIntentKeys(step)||[])add(k);for(const k of axis821FlowStepIntentDefaultKeys(step))add(k);try{for(const x of axis821BaseSchemaForEq(eq)||[])add(x?.key||x?.id)}catch{}for(const k of ['duration','intensity','rating','completed'])add(k);return order.map(k=>axis821FlowStepIntentDefinition(eq,k)).filter(Boolean)}
function axis821FlowStepIntentLabel(eq,key){const m=axis821FlowStepIntentDefinition(eq,key);try{return axis821ObjectMetricLabel(m)||String(key)}catch{return String(m?.label||key)}}
function axis821FlowStepIntentShort(step){const eq=axis821FlowStepIntentEq(step),own=axis821FlowStepIntentKeys(step),keys=own||axis821FlowStepIntentDefaultKeys(step),labels=keys.map(k=>axis821FlowStepIntentLabel(eq,k)).filter(Boolean),body=labels.length?labels.slice(0,3).join(' · ')+(labels.length>3?' …':''):'不记录数值';return own?'此流程 · '+body:'跟随项目 · '+body}
function axis821FlowStepIntentDecorateEditor(){
 const draft=axis821FlowDraft;if(!draft||!Array.isArray(draft.steps))return;const did=String(draft.id||'');if(did!==axis821FlowStepIntentDraftId){axis821FlowStepIntentDraftId=did;axis821FlowStepIntentOpenIndex=-1}
 const rows=$$('.axis821FlowStep[data-axis-flow-step-index]');for(const row of rows){const index=Number(row.dataset.axisFlowStepIndex),step=draft.steps[index];if(!step)continue;let panel=row.nextElementSibling;if(!panel?.classList?.contains('axis821FlowStepIntent')){panel=D.createElement('div');panel.className='axis821FlowStepIntent';row.insertAdjacentElement('afterend',panel)}const open=index===axis821FlowStepIntentOpenIndex,own=axis821FlowStepIntentKeys(step),selected=new Set(own||axis821FlowStepIntentDefaultKeys(step)),defs=axis821FlowStepIntentDefs(step);panel.dataset.index=String(index);panel.innerHTML='<button type="button" class="axis821FlowStepIntentSummary" data-axis-flow-step-intent-toggle="'+index+'"><span><small>记录内容</small><b>'+esc(axis821FlowStepIntentShort(step))+'</b></span><em>'+(open?'收起':'设置')+'</em></button>'+(open?'<div class="axis821FlowStepIntentEditor"><p>只影响这个流程里的这一项。没有单独设置时，继续跟随该项目的记录内容。</p><div class="axis821FlowStepIntentChoices">'+defs.map(m=>{const k=String(m?.key||m?.id||'');return'<button type="button" data-axis-flow-step-intent-choice="'+esc(k)+'" data-index="'+index+'" class="'+(selected.has(k)?'active':'')+'">'+esc(axis821FlowStepIntentLabel(axis821FlowStepIntentEq(step),k))+'</button>'}).join('')+'</div><button type="button" class="axis821FlowStepIntentFollow" data-axis-flow-step-intent-follow="'+index+'">跟随项目设置</button></div>':'')}
}
function axis821FlowStepIntentToggleChoice(index,key){const step=axis821FlowDraft?.steps?.[index],eq=axis821FlowStepIntentEq(step);if(!step||!eq)return false;const own=axis821FlowStepIntentKeys(step),base=own||axis821FlowStepIntentDefaultKeys(step),next=[...base],at=next.indexOf(key);if(at>=0){if(next.length<=1){toast?.('至少保留一项；也可以改为跟随项目设置');return false}next.splice(at,1)}else next.push(key);step.metricOverride={metrics:next};axis821FlowStepIntentDecorateEditor();return true}
function axis821FlowStepIntentFollow(index){const step=axis821FlowDraft?.steps?.[index];if(!step)return false;delete step.metricOverride;axis821FlowStepIntentDecorateEditor();return true}
D.addEventListener('click',e=>{const toggle=e.target.closest?.('[data-axis-flow-step-intent-toggle]');if(toggle){e.preventDefault();axis821FlowStepIntentOpenIndex=Number(toggle.dataset.axisFlowStepIntentToggle);axis821FlowStepIntentDecorateEditor();return}const choice=e.target.closest?.('[data-axis-flow-step-intent-choice]');if(choice){e.preventDefault();axis821FlowStepIntentToggleChoice(Number(choice.dataset.index),String(choice.dataset.axisFlowStepIntentChoice||''));return}const follow=e.target.closest?.('[data-axis-flow-step-intent-follow]');if(follow){e.preventDefault();axis821FlowStepIntentFollow(Number(follow.dataset.axisFlowStepIntentFollow));return}},true);
window.__AXIS_821_FLOW_STEP_RECORDING_INTENT__={version:'8.21',owner:'axis.flow.v1.step.metricOverride',surface:'Flow editor',inheritsObjectDefault:true,explicitOverridePreflight:true,defaultCurrentItemDirectStart:true,newStorage:false,newRecorder:false,newEncounterWriter:false,newActiveOwner:false};
`;
 s=s.slice(0,ownerEnd)+block+s.slice(ownerEnd);
 s=mutateFunction(s,'function axis821FlowSurfaceRenderEditor()',fn=>fn.slice(0,-1)+';axis821FlowStepIntentDecorateEditor()}', 'Flow editor recording-intent decoration');
 s=mutateFunction(s,'function axis821RecorderValueSchema(eq,schema)',()=>`function axis821RecorderValueSchema(eq,schema){const xs=Array.isArray(schema)?schema:[];if(axis821HasMetricOverrideForRecording(eq))return xs;return axis821RecordingExecutionMode(eq)==='sets'?xs.filter(m=>!axis821SetPlanOwnedMetricKey(m?.key||m?.id)):xs}`,'Flow-step override canonical value handoff');
 s=mutateFunction(s,'function axis821BeginCurrentItem()',fn=>{
  const token="  const foreign=activeApi?.current?.();if(foreign)return axis821FlowShowSwitch('start',foreign,{id:eq.id,name:eq.name});return axis821FlowStartWholeItem(eq)";
  if((fn.split(token).length-1)!==1)fail('Flow current direct-start boundary drift');
  return fn.replace(token,"  if(axis821HasMetricOverrideForRecording(eq.id))return axis821FlowOpenRecorder('current',eq);\n"+token)
 },'explicit Flow-step recording preflight');
 syntax(s,FILE);write(FILE,s);
}

/* A Flow-specific metricOverride must use the app-owned canonical value recorder,
   not v61's classic repeated-set presentation. Execution ownership is unchanged. */
{
 const FILE='v61.js';let s=read(FILE);
 s=mutateFunction(s,'function axis820ClassicOwner(e,schema=axis820Schema(e))',()=>`function axis820ClassicOwner(e,schema=axis820Schema(e)){if(!schema)return false;if(window.__AXIS_FLOW_RUNTIME__?.hasMetricOverride?.(e?.id))return false;const keys=schema.map(x=>x?.key).filter(k=>k&&k!=='sets');return axis820Mode(e)==='sets'&&keys.length===2&&keys.includes('weight')&&keys.includes('reps')}`,'Flow-step override Quick Record handoff');
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE);if(s.includes('AXIS 8.21 Flow step recording intent'))fail('Flow step intent styles already installed');
 s+=`\n/* AXIS 8.21 Flow step recording intent */\n.axis821FlowStepIntent{margin:-3px 0 8px 34px;border:1px solid var(--line);border-radius:13px;background:color-mix(in srgb,var(--s2) 72%,transparent);overflow:hidden}.axis821FlowStepIntentSummary{width:100%;min-height:45px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;gap:12px;text-align:left}.axis821FlowStepIntentSummary span{display:grid;gap:2px;min-width:0}.axis821FlowStepIntentSummary small{font-size:10.5px;color:var(--dim);font-weight:560}.axis821FlowStepIntentSummary b{font-size:12px;line-height:1.35;font-weight:620;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowStepIntentSummary em{font-size:11px;font-style:normal;color:var(--accent2);font-weight:650;flex:0 0 auto}.axis821FlowStepIntentEditor{padding:0 10px 10px;border-top:1px solid var(--line)}.axis821FlowStepIntentEditor p{margin:9px 0 8px;color:var(--dim);font-size:11px;line-height:1.45}.axis821FlowStepIntentChoices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.axis821FlowStepIntentChoices button{min-height:36px;padding:6px;border-radius:10px;background:var(--s2);color:var(--dim);font-size:11px;font-weight:620;line-height:1.2}.axis821FlowStepIntentChoices button.active{background:rgba(115,124,255,.16);color:var(--accent2);box-shadow:inset 0 0 0 1px rgba(115,124,255,.24)}.axis821FlowStepIntentFollow{margin-top:8px;min-height:34px;width:100%;border-radius:10px;color:var(--dim);font-size:11px;font-weight:600;background:transparent;border:1px solid var(--line)}@media(max-width:380px){.axis821FlowStepIntent{margin-left:29px}.axis821FlowStepIntentChoices{grid-template-columns:repeat(2,minmax(0,1fr))}}\n`;
 write(FILE,s);
}

console.log('[AXIS 8.21 Flow step recording intent] PASS · existing step.metricOverride only · explicit override uses canonical preflight · default Flow item stays direct-start · Object defaults untouched · no new persistence/recorder/Encounter/Active owner');
