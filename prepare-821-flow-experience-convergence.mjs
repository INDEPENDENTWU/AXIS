import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow experience convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
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
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

/*
 * This pass is deliberately last in the 8.21 product stack. It does not add a
 * second Flow owner or recording path; it only makes the already-proven Flow UI
 * feel like the rest of AXIS: one focused current action, quiet secondary paths,
 * and direct touch/keyboard reordering instead of admin-style arrow controls.
 */
{
 const FILE='app.js';let s=read(FILE);
 const home=`function axis821FlowSurfaceRenderHome(){
 axis821FlowSurfaceEnsureDom();const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();if(!host||!api){if(host)host.innerHTML='';return}
 const run=api.run?.(),ctx=api.current?.(),flows=axis821FlowSurfaceFlows();
 if(run?.status==='active'&&ctx){const next=ctx.nextIntent?axis821FlowSurfaceName(ctx.nextIntent.objectRef):'',total=Array.isArray(run.steps)?run.steps.length:0,index=Math.max(0,Number(run.cursor)||0),position=total?(Math.min(index+1,total)+' / '+total):'';host.dataset.state='active';host.innerHTML='<div class="axis821FlowTop"><span>流程'+(position?' · '+position:'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead"><small>当前项目</small><b>'+esc(axis821FlowSurfaceName(ctx.objectRef))+'</b><span>'+(next?'接下来 · '+esc(next):'这是最后一项')+'</span></div><button class="axis821FlowRunPrimary" data-axis-flow-record>记下</button><div class="axis821FlowRunSecondary"><button data-axis-flow-skip>跳过</button><button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束</button></div>';return}
 if(run?.status==='complete'){const flow=flows.find(x=>x.id===run.flowRef);host.dataset.state='complete';host.innerHTML='<div class="axis821FlowTop"><span>流程</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowRunLead complete"><small>已到末尾</small><b>'+esc(flow?axis821FlowSurfaceTitle(flow):'流程完成')+'</b><span>记录已经保存，不额外打分。</span></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-restart="'+esc(run.flowRef)+'">再来一次</button><button data-axis-flow-dismiss>收起</button></div>';return}
 if(flows.length){const flow=flows[0],count=flow.steps?.length||0;host.dataset.state='ready';host.innerHTML='<div class="axis821FlowTop"><span>流程'+(count?' · '+count+' 项':'')+'</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceTitle(flow))+'</b><small>'+esc(axis821FlowSurfaceChain(flow))+'</small></div><button class="axis821FlowRunPrimary ready" data-axis-flow-start="'+esc(flow.id)+'">开始</button><button class="axis821FlowReadyEdit" data-axis-flow-edit="'+esc(flow.id)+'">编辑流程</button>';return}
 host.dataset.state='empty';host.innerHTML='<div class="axis821FlowTop"><span>流程</span></div><div class="axis821FlowCurrent"><b>把常用项目排成一个顺序</b><small>开始后仍可跳过，也可以临时记录其他项目。</small></div><div class="axis821FlowPrimaryActions one"><button class="primary" data-axis-flow-new>新建流程</button></div>';
}`;
 s=replaceFunction(s,'function axis821FlowSurfaceRenderHome()',home,'focused Today Flow surface');

 const editor=`function axis821FlowSurfaceRenderEditor(){
 axis821FlowSurfaceEnsureDom();if(!axis821FlowDraft)return axis821FlowSurfaceRenderHub();setText('#axis821FlowSheetTitle',axis821FlowEditingId?'编辑流程':'新建流程');const body=$('#axis821FlowBody');if(!body)return;const steps=axis821FlowDraft.steps||[];
 const rows=steps.map((step,i)=>{const eq=axis821FlowSurfaceEq(step.objectRef),muscles=Array.isArray(eq?.muscles)?eq.muscles.filter(Boolean).slice(0,2).join(' · '):'',meta=eq?.custom?'我的项目':(muscles||'项目');return'<div class="axis821FlowStep" data-axis-flow-step-index="'+i+'"><i>'+String(i+1).padStart(2,'0')+'</i><span><b>'+esc(axis821FlowSurfaceName(step.objectRef))+'</b><small>'+esc(meta)+'</small></span><button type="button" class="axis821FlowDragHandle" data-axis-flow-drag="'+i+'" aria-label="拖动 '+esc(axis821FlowSurfaceName(step.objectRef))+' 排序"><span></span><span></span><span></span></button><button type="button" class="axis821FlowRemove" data-axis-flow-remove-step data-index="'+i+'" aria-label="移除 '+esc(axis821FlowSurfaceName(step.objectRef))+'">−</button></div>'}).join('');
 body.innerHTML='<label class="axis821FlowTitleInput"><span>名称</span><input id="axis821FlowTitleInput" maxlength="32" placeholder="可不填" value="'+esc(axis821FlowDraft.title||'')+'"></label><div class="axis821FlowEditorHead"><span>项目顺序</span><small>'+(steps.length?steps.length+' 项 · 按住右侧拖动':'按真实使用顺序排列')+'</small></div><div class="axis821FlowSteps">'+(rows||'<div class="axis821FlowStepEmpty">先添加一个项目</div>')+'</div><button class="axis821FlowAdd" data-axis-flow-add><span>添加项目</span><i>＋</i></button><button class="saveRecord axis821FlowSave" data-axis-flow-save '+(steps.length?'':'disabled')+'>保存流程</button>'+(axis821FlowEditingId?'<button class="dangerAction axis821FlowDelete" data-axis-flow-delete="'+esc(axis821FlowEditingId)+'">删除此流程</button>':'')+'<button class="axis821FlowBack" data-axis-flow-back>返回流程列表</button>';
}`;
 s=replaceFunction(s,'function axis821FlowSurfaceRenderEditor()',editor,'native Flow composition editor');

 const anchor='function axis821FlowSurfaceSave(){';
 if(!s.includes(anchor))fail('Flow save anchor missing');
 const drag=String.raw`
let axis821FlowDragState=null;
function axis821FlowSurfaceReorder(from,to){axis821FlowSurfacePullEditor();const a=axis821FlowDraft?.steps||[];from=Number(from);to=Number(to);if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=a.length||to>=a.length||from===to)return false;const [step]=a.splice(from,1);a.splice(to,0,step);axis821FlowSurfaceRenderEditor();return true}
function axis821FlowSurfaceDragIndex(y){const rows=Array.from(D.querySelectorAll('#axis821FlowBody .axis821FlowStep'));if(!rows.length)return-1;for(const row of rows){const r=row.getBoundingClientRect();if(y<r.top+r.height/2)return Number(row.dataset.axisFlowStepIndex)}return Number(rows[rows.length-1].dataset.axisFlowStepIndex)}
function axis821FlowSurfaceDragClear(){for(const row of D.querySelectorAll('#axis821FlowBody .axis821FlowStep'))row.classList.remove('dragging','dragTarget')}
function axis821FlowSurfaceDragBegin(e){const h=e.target.closest?.('[data-axis-flow-drag]');if(!h||!axis821FlowDraft)return;if(e.pointerType==='mouse'&&e.button!==0)return;const from=Number(h.dataset.axisFlowDrag);if(!Number.isInteger(from))return;e.preventDefault();axis821FlowDragState={pointerId:e.pointerId,from,to:from,handle:h};h.closest('.axis821FlowStep')?.classList.add('dragging');try{h.setPointerCapture?.(e.pointerId)}catch{}}
function axis821FlowSurfaceDragMove(e){const d=axis821FlowDragState;if(!d||e.pointerId!==d.pointerId)return;e.preventDefault();const to=axis821FlowSurfaceDragIndex(e.clientY);if(to<0)return;d.to=to;for(const row of D.querySelectorAll('#axis821FlowBody .axis821FlowStep'))row.classList.toggle('dragTarget',Number(row.dataset.axisFlowStepIndex)===to)}
function axis821FlowSurfaceDragEnd(e){const d=axis821FlowDragState;if(!d||e.pointerId!==d.pointerId)return;axis821FlowDragState=null;try{d.handle?.releasePointerCapture?.(e.pointerId)}catch{}axis821FlowSurfaceDragClear();axis821FlowSurfaceReorder(d.from,d.to)}
D.addEventListener('pointerdown',axis821FlowSurfaceDragBegin,{passive:false});
D.addEventListener('pointermove',axis821FlowSurfaceDragMove,{passive:false});
D.addEventListener('pointerup',axis821FlowSurfaceDragEnd);D.addEventListener('pointercancel',axis821FlowSurfaceDragEnd);
D.addEventListener('keydown',e=>{const h=e.target.closest?.('[data-axis-flow-drag]');if(!h)return;const i=Number(h.dataset.axisFlowDrag);if(e.key==='ArrowUp'){e.preventDefault();axis821FlowSurfaceMove(i,-1);requestAnimationFrame(()=>D.querySelector('[data-axis-flow-drag="'+Math.max(0,i-1)+'"]')?.focus())}else if(e.key==='ArrowDown'){e.preventDefault();axis821FlowSurfaceMove(i,1);requestAnimationFrame(()=>D.querySelector('[data-axis-flow-drag="'+(i+1)+'"]')?.focus())}});
`;
 s=once(s,anchor,drag+anchor,'Flow touch + keyboard reorder owner');
 s += "\n;try{window.__AXIS_821_FLOW_EXPERIENCE__={version:'8.21',owner:'app.js-presentation',touchReorder:true,keyboardReorder:true,focusedRunSurface:true,nativeEditor:true,newFlowOwner:false,newRecorder:false,newStorage:false,newEncounterWriter:false}}catch{};\n";
 syntax(s,FILE);write(FILE,s);
}

{
 const FILE='styles.css';let s=read(FILE),marker='/* AXIS 8.21 Flow Experience Convergence */';if(s.includes(marker))fail('Flow experience CSS duplicated');
 s+=String.raw`

/* AXIS 8.21 Flow Experience Convergence */
.axis821FlowRunLead{padding:11px 0 16px}.axis821FlowRunLead>small{display:block;font-size:10px;line-height:1.2;color:var(--dim);letter-spacing:.04em}.axis821FlowRunLead>b{display:block;margin-top:6px;font-size:23px;line-height:1.22;font-weight:690;letter-spacing:-.025em}.axis821FlowRunLead>span{display:block;margin-top:7px;font-size:12px;line-height:1.45;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowRunLead.complete>b{font-size:20px}.axis821FlowRunPrimary{width:100%;height:54px;border-radius:17px;background:var(--text);color:#0a0b0d;font-size:15px;font-weight:690;letter-spacing:-.01em}.axis821FlowRunPrimary.ready{margin-top:1px}.axis821FlowRunSecondary{display:grid;grid-template-columns:1fr 1.6fr 1fr;gap:4px;margin-top:5px}.axis821FlowRunSecondary button{height:42px;padding:0 3px;font-size:11px;color:var(--dim);white-space:nowrap}.axis821FlowReadyEdit{width:100%;height:40px;margin-top:3px;font-size:11px;color:var(--dim)}
.axis821FlowEditorHead{min-height:47px!important}.axis821FlowSteps{margin-top:0!important}.axis821FlowStep{position:relative;min-height:76px!important;grid-template-columns:30px minmax(0,1fr) 34px 30px!important;gap:8px!important;transition:background .14s ease,opacity .14s ease}.axis821FlowStep.dragging{opacity:.48}.axis821FlowStep.dragTarget{background:var(--s2)}.axis821FlowStep>i{font-size:10px!important;letter-spacing:.05em}.axis821FlowStep>span b{font-size:14px!important;font-weight:640!important}.axis821FlowStep>span small{font-size:10px!important;margin-top:5px!important}.axis821FlowDragHandle{width:34px;height:52px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;color:var(--muted);touch-action:none;cursor:grab}.axis821FlowDragHandle:active{cursor:grabbing}.axis821FlowDragHandle span{display:block;width:15px;height:2px;border-radius:2px;background:currentColor;opacity:.7}.axis821FlowRemove{width:30px;height:44px;font-size:19px;font-weight:350;color:var(--dim)}.axis821FlowAdd{height:56px!important;margin:0!important;padding:0 2px!important;border-bottom:1px solid var(--line2);display:flex;align-items:center;justify-content:space-between;text-align:left!important}.axis821FlowAdd span{font-size:13px;font-weight:600;color:var(--accent2)}.axis821FlowAdd i{font-style:normal;font-size:20px;font-weight:350;color:var(--accent2)}.axis821FlowStepEmpty{height:66px!important}.axis821FlowSave{margin-top:20px!important}.axis821FlowBack{margin-top:4px!important}
@media(max-width:360px){.axis821FlowRunSecondary{grid-template-columns:1fr 1.45fr 1fr}.axis821FlowRunSecondary button{font-size:10px}.axis821FlowStep{grid-template-columns:28px minmax(0,1fr) 32px 28px!important;gap:6px!important}}
`;
 write(FILE,s);
}

for(const [f,tokens] of [
 ['app.js',['__AXIS_821_FLOW_EXPERIENCE__','data-axis-flow-drag','axis821FlowSurfaceReorder','touchReorder:true','focusedRunSurface:true']],
 ['styles.css',['AXIS 8.21 Flow Experience Convergence','.axis821FlowRunPrimary{width:100%','.axis821FlowDragHandle{width:34px']]
]){const s=read(f);for(const t of tokens)if(!s.includes(t))fail(`${f} missing ${t}`)}
console.log('[AXIS 8.21 Flow experience convergence] PASS · focused Today execution · native editor rhythm · touch/keyboard reorder · no new Flow/recording/storage owner');
