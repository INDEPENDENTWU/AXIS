import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Flow user surface] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/*
 * Phase 3 is deliberately presentation/orchestration only. The Flow definition
 * and FlowRun remain app-owned in axis_v60_state, Object picking stays on the
 * existing equipment picker, and recording stays on the existing v61/app path.
 */
{
 const FILE='app.js';let s=read(FILE);
 const owner=/window\.__AXIS_821_RECORDING_SURFACE__=\{[^\n]*\};/;
 const hit=s.match(owner)?.[0];if(!hit)fail('recording surface owner marker missing');
 const block=String.raw`
/* AXIS 8.21 — user-visible Flow surface; intent UI only, no factual owner. */
let axis821FlowDraft=null,axis821FlowEditingId=null,axis821FlowPick=false,axis821FlowAwaitCustom=false,axis821FlowCustomBefore=null;
function axis821FlowSurfaceApi(){return window.__AXIS_FLOW_RUNTIME__||null}
function axis821FlowSurfaceClone(v){return v==null?v:JSON.parse(JSON.stringify(v))}
function axis821FlowSurfaceEq(ref){return axis818Eq(ref)||eqById(ref)||null}
function axis821FlowSurfaceName(ref){return axis821FlowSurfaceEq(ref)?.name||'已移除的项目'}
function axis821FlowSurfaceTitle(flow){const t=String(flow?.title||'').trim();if(t)return t;const names=(flow?.steps||[]).slice(0,3).map(x=>axis821FlowSurfaceName(x.objectRef));return names.length?names.join(' → '):'未命名流程'}
function axis821FlowSurfaceChain(flow,limit=4){const xs=(flow?.steps||[]).map(x=>axis821FlowSurfaceName(x.objectRef));if(!xs.length)return'还没有项目';return xs.slice(0,limit).join(' → ')+(xs.length>limit?' …':'')}
function axis821FlowSurfaceFlows(){const api=axis821FlowSurfaceApi(),xs=api?.list?.()||[];return xs.slice().sort((a,b)=>Number(b.metadata?.updatedAt||0)-Number(a.metadata?.updatedAt||0))}
function axis821FlowSurfaceEnsureDom(){
 if(!$('#axis821FlowHome')){const x=D.createElement('section');x.id='axis821FlowHome';x.className='axis821FlowHome';$('#todayView .pageHead')?.insertAdjacentElement('afterend',x)}
 if(!$('#axis821FlowSheet'))D.body.insertAdjacentHTML('beforeend','<div class="sheetWrap" id="axis821FlowSheet"><div class="sheet axis821FlowSheet"><div class="grabber"></div><div class="sheetHead"><b id="axis821FlowSheetTitle">流程</b><button class="closeBtn" id="axis821FlowClose" aria-label="关闭">×</button></div><div id="axis821FlowBody"></div></div></div>');
 const sheet=$('#axis821FlowSheet');if(sheet&&!sheet.dataset.axis821Bound){sheet.dataset.axis821Bound='1';$('#axis821FlowClose').onclick=()=>axis821FlowSurfaceClose();sheet.addEventListener('click',e=>{if(e.target===sheet)axis821FlowSurfaceClose()})}
}
function axis821FlowSurfaceOpen(mode='hub'){axis821FlowSurfaceEnsureDom();if(mode==='hub')axis821FlowSurfaceRenderHub();$('#axis821FlowSheet')?.classList.add('show')}
function axis821FlowSurfaceClose(){$('#axis821FlowSheet')?.classList.remove('show')}
function axis821FlowSurfaceRenderHome(){
 axis821FlowSurfaceEnsureDom();const host=$('#axis821FlowHome'),api=axis821FlowSurfaceApi();if(!host||!api){if(host)host.innerHTML='';return}
 const run=api.run?.(),ctx=api.current?.(),flows=axis821FlowSurfaceFlows();
 if(run?.status==='active'&&ctx){const next=ctx.nextIntent?axis821FlowSurfaceName(ctx.nextIntent.objectRef):'';host.dataset.state='active';host.innerHTML='<div class="axis821FlowTop"><span>流程 · 当前</span><button data-axis-flow-open>管理</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceName(ctx.objectRef))+'</b>'+(next?'<small>接下来 · '+esc(next)+'</small>':'<small>这是最后一项</small>')+'</div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-record>记录当前</button><button data-axis-flow-skip>跳过</button></div><div class="axis821FlowQuietActions"><button data-axis-flow-other>临时记录其他</button><button data-axis-flow-finish>结束流程</button></div>';return}
 if(run?.status==='complete'){const flow=flows.find(x=>x.id===run.flowRef);host.dataset.state='complete';host.innerHTML='<div class="axis821FlowTop"><span>流程</span><button data-axis-flow-open>管理</button></div><div class="axis821FlowCurrent"><b>'+esc(flow?axis821FlowSurfaceTitle(flow):'流程已到末尾')+'</b><small>已到最后一项，没有额外完成评分</small></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-restart="'+esc(run.flowRef)+'">再来一次</button><button data-axis-flow-dismiss>收起</button></div>';return}
 if(flows.length){const flow=flows[0];host.dataset.state='ready';host.innerHTML='<div class="axis821FlowTop"><span>流程</span><button data-axis-flow-open>全部</button></div><div class="axis821FlowCurrent"><b>'+esc(axis821FlowSurfaceTitle(flow))+'</b><small>'+esc(axis821FlowSurfaceChain(flow))+'</small></div><div class="axis821FlowPrimaryActions"><button class="primary" data-axis-flow-start="'+esc(flow.id)+'">开始</button><button data-axis-flow-edit="'+esc(flow.id)+'">编辑</button></div>';return}
 host.dataset.state='empty';host.innerHTML='<div class="axis821FlowTop"><span>流程</span></div><div class="axis821FlowCurrent"><b>把常用项目排成一个顺序</b><small>开始后仍可跳过，也可以临时记录其他项目。</small></div><div class="axis821FlowPrimaryActions one"><button class="primary" data-axis-flow-new>新建流程</button></div>';
}
function axis821FlowSurfaceRenderHub(){
 axis821FlowSurfaceEnsureDom();axis821FlowEditingId=null;axis821FlowDraft=null;setText('#axis821FlowSheetTitle','流程');const body=$('#axis821FlowBody'),api=axis821FlowSurfaceApi(),flows=axis821FlowSurfaceFlows(),run=api?.run?.();if(!body)return;
 body.innerHTML='<div class="axis821FlowHubHead"><span>已保存</span><button data-axis-flow-new>＋ 新建</button></div>'+(flows.length?'<div class="axis821FlowList">'+flows.map(f=>'<div class="axis821FlowRow"><button class="axis821FlowRowMain" data-axis-flow-start="'+esc(f.id)+'"><span><b>'+esc(axis821FlowSurfaceTitle(f))+'</b><small>'+esc(axis821FlowSurfaceChain(f))+'</small></span><em>'+(run?.status==='active'&&run.flowRef===f.id?'进行中':'开始')+'</em></button><button class="axis821FlowEdit" data-axis-flow-edit="'+esc(f.id)+'" aria-label="编辑 '+esc(axis821FlowSurfaceTitle(f))+'">编辑</button></div>').join('')+'</div>':'<div class="axis821FlowEmpty"><b>还没有流程</b><span>流程只保存顺序，不会提前生成训练记录。</span></div>');
}
function axis821FlowSurfaceNew(){const now=Date.now();axis821FlowEditingId=null;axis821FlowDraft={schema:'axis.flow.v1',id:uid('FL'),title:'',steps:[],metadata:{createdAt:now,updatedAt:now}};axis821FlowSurfaceRenderEditor();axis821FlowSurfaceOpen('editor')}
function axis821FlowSurfaceEdit(id){const f=axis821FlowSurfaceFlows().find(x=>x.id===id);if(!f)return;axis821FlowEditingId=id;axis821FlowDraft=axis821FlowSurfaceClone(f);axis821FlowSurfaceRenderEditor();axis821FlowSurfaceOpen('editor')}
function axis821FlowSurfacePullEditor(){const input=$('#axis821FlowTitleInput');if(axis821FlowDraft&&input)axis821FlowDraft.title=input.value.slice(0,32)}
function axis821FlowSurfaceRenderEditor(){
 axis821FlowSurfaceEnsureDom();if(!axis821FlowDraft)return axis821FlowSurfaceRenderHub();setText('#axis821FlowSheetTitle',axis821FlowEditingId?'编辑流程':'新建流程');const body=$('#axis821FlowBody');if(!body)return;const steps=axis821FlowDraft.steps||[];
 body.innerHTML='<label class="axis821FlowTitleInput"><span>名称</span><input id="axis821FlowTitleInput" maxlength="32" placeholder="可不填" value="'+esc(axis821FlowDraft.title||'')+'"></label><div class="axis821FlowEditorHead"><span>顺序</span><small>按真实使用顺序排列</small></div><div class="axis821FlowSteps">'+(steps.length?steps.map((s,i)=>'<div class="axis821FlowStep" data-axis-flow-step-index="'+i+'"><i>'+String(i+1).padStart(2,'0')+'</i><span><b>'+esc(axis821FlowSurfaceName(s.objectRef))+'</b><small>'+esc(axis821FlowSurfaceEq(s.objectRef)?.custom?'我的项目':'Practice Object')+'</small></span><div><button data-axis-flow-move="-1" data-index="'+i+'" '+(i===0?'disabled':'')+' aria-label="上移">↑</button><button data-axis-flow-move="1" data-index="'+i+'" '+(i===steps.length-1?'disabled':'')+' aria-label="下移">↓</button><button data-axis-flow-remove-step data-index="'+i+'" aria-label="移除">×</button></div></div>').join(''):'<div class="axis821FlowStepEmpty">先添加一个项目</div>')+'</div><button class="axis821FlowAdd" data-axis-flow-add>＋ 添加项目</button><button class="saveRecord axis821FlowSave" data-axis-flow-save '+(steps.length?'':'disabled')+'>保存流程</button>'+(axis821FlowEditingId?'<button class="dangerAction axis821FlowDelete" data-axis-flow-delete="'+esc(axis821FlowEditingId)+'">删除此流程</button>':'')+'<button class="axis821FlowBack" data-axis-flow-back>返回流程列表</button>';
}
function axis821FlowSurfaceBeginPick(){if(!axis821FlowDraft)return;axis821FlowSurfacePullEditor();axis821FlowPick=true;axis821FlowAwaitCustom=false;axis821FlowSurfaceClose();if($('#eqSearch'))$('#eqSearch').value='';renderEqList();openSheet('eqSheet')}
function axis821FlowSurfaceResumeEditor(){axis821FlowPick=false;axis821FlowAwaitCustom=false;axis821FlowCustomBefore=null;axis821FlowSurfaceRenderEditor();$('#axis821FlowSheet')?.classList.add('show')}
function axis821FlowSurfaceAddObject(id){const eq=axis821FlowSurfaceEq(id);if(!eq||!axis821FlowDraft)return;axis821FlowDraft.steps=axis821FlowDraft.steps||[];axis821FlowDraft.steps.push({id:uid('FS'),objectRef:eq.id});closeSheet('eqSheet');axis821FlowSurfaceResumeEditor()}
function axis821FlowSurfaceMove(index,delta){axis821FlowSurfacePullEditor();const a=axis821FlowDraft?.steps||[],j=index+delta;if(index<0||j<0||index>=a.length||j>=a.length)return;[a[index],a[j]]=[a[j],a[index]];axis821FlowSurfaceRenderEditor()}
function axis821FlowSurfaceRemoveStep(index){axis821FlowSurfacePullEditor();const a=axis821FlowDraft?.steps||[];if(index<0||index>=a.length)return;a.splice(index,1);axis821FlowSurfaceRenderEditor()}
function axis821FlowSurfaceSave(){axis821FlowSurfacePullEditor();const api=axis821FlowSurfaceApi();if(!api||!axis821FlowDraft?.steps?.length)return;const old=axis821FlowEditingId?axis821FlowSurfaceFlows().find(x=>x.id===axis821FlowEditingId):null,now=Date.now();axis821FlowDraft.metadata={...(old?.metadata||axis821FlowDraft.metadata||{}),createdAt:Number(old?.metadata?.createdAt||axis821FlowDraft.metadata?.createdAt||now),updatedAt:now};api.saveFlow(axis821FlowDraft);axis821FlowEditingId=null;axis821FlowDraft=null;axis821FlowSurfaceRenderHub();axis821FlowSurfaceRenderHome();toast('流程已保存')}
function axis821FlowSurfaceDelete(id){const api=axis821FlowSurfaceApi();if(!api||!id)return;if(!confirm('删除这个流程？历史记录不会被修改。'))return;api.removeFlow(id);axis821FlowEditingId=null;axis821FlowDraft=null;axis821FlowSurfaceRenderHub();axis821FlowSurfaceRenderHome()}
function axis821FlowSurfaceStart(id){const api=axis821FlowSurfaceApi();if(!api)return;const run=api.run?.();if(run?.status==='active'&&run.flowRef!==id&&!confirm('当前流程还在进行，切换到这个流程？'))return;const ctx=api.launch(id);if(!ctx)return;axis821FlowSurfaceClose();axis821FlowSurfaceRenderHome();toast('流程已开始')}
function axis821FlowSurfaceRecord(){const api=axis821FlowSurfaceApi(),ctx=api?.current?.();if(!ctx)return;api.selectCurrent?.();const q=window.__AXIS_QUICK_RECORD__;if(q?.openFor)return q.openFor(ctx.objectRef);toast('记录入口尚未就绪')}
function axis821FlowSurfaceOther(){const q=window.__AXIS_QUICK_RECORD__;if(q?.open)return q.open();toast('记录入口尚未就绪')}
function axis821FlowSurfaceSkip(){const api=axis821FlowSurfaceApi();if(!api?.skip?.())return;axis821FlowSurfaceRenderHome()}
function axis821FlowSurfaceFinish(){const api=axis821FlowSurfaceApi();if(!api?.run?.())return;api.finish?.();axis821FlowSurfaceRenderHome()}
function axis821FlowSurfaceDismiss(){axis821FlowSurfaceApi()?.finish?.();axis821FlowSurfaceRenderHome()}
function axis821FlowSurfaceAfterEncounter(id){const api=axis821FlowSurfaceApi(),run=api?.run?.();if(!run||run.status!=='active'||run.lastEncounterId!==id)return false;const ok=api.advance?.();axis821FlowSurfaceRenderHome();if(api.run?.()?.status==='complete')toast('流程已到末尾');return !!ok}
function axis821FlowSurfaceHandle(e){
 const t=e.target.closest?.('[data-axis-flow-open],[data-axis-flow-new],[data-axis-flow-edit],[data-axis-flow-start],[data-axis-flow-restart],[data-axis-flow-record],[data-axis-flow-skip],[data-axis-flow-other],[data-axis-flow-finish],[data-axis-flow-dismiss],[data-axis-flow-add],[data-axis-flow-move],[data-axis-flow-remove-step],[data-axis-flow-save],[data-axis-flow-delete],[data-axis-flow-back]');if(!t)return;
 if(t.hasAttribute('data-axis-flow-open'))axis821FlowSurfaceOpen('hub');else if(t.hasAttribute('data-axis-flow-new'))axis821FlowSurfaceNew();else if(t.dataset.axisFlowEdit)axis821FlowSurfaceEdit(t.dataset.axisFlowEdit);else if(t.dataset.axisFlowStart)axis821FlowSurfaceStart(t.dataset.axisFlowStart);else if(t.dataset.axisFlowRestart)axis821FlowSurfaceStart(t.dataset.axisFlowRestart);else if(t.hasAttribute('data-axis-flow-record'))axis821FlowSurfaceRecord();else if(t.hasAttribute('data-axis-flow-skip'))axis821FlowSurfaceSkip();else if(t.hasAttribute('data-axis-flow-other'))axis821FlowSurfaceOther();else if(t.hasAttribute('data-axis-flow-finish'))axis821FlowSurfaceFinish();else if(t.hasAttribute('data-axis-flow-dismiss'))axis821FlowSurfaceDismiss();else if(t.hasAttribute('data-axis-flow-add'))axis821FlowSurfaceBeginPick();else if(t.dataset.axisFlowMove)axis821FlowSurfaceMove(Number(t.dataset.index),Number(t.dataset.axisFlowMove));else if(t.hasAttribute('data-axis-flow-remove-step'))axis821FlowSurfaceRemoveStep(Number(t.dataset.index));else if(t.hasAttribute('data-axis-flow-save'))axis821FlowSurfaceSave();else if(t.dataset.axisFlowDelete)axis821FlowSurfaceDelete(t.dataset.axisFlowDelete);else if(t.hasAttribute('data-axis-flow-back'))axis821FlowSurfaceRenderHub();
}
D.addEventListener('click',axis821FlowSurfaceHandle,true);
D.addEventListener('click',e=>{
 if(axis821FlowPick){const b=e.target.closest?.('#eqSheet [data-eq]');if(b){e.preventDefault();e.stopImmediatePropagation();return axis821FlowSurfaceAddObject(b.dataset.eq)}if(e.target.closest?.('#addCustomEq')){axis821FlowCustomBefore=new Set((state.profile?.customEq||[]).map(x=>x.id));axis821FlowPick=false;axis821FlowAwaitCustom=true;return}if(e.target.closest?.('[data-close="eqSheet"]')||e.target===$('#eqSheet')){axis821FlowPick=false;setTimeout(axis821FlowSurfaceResumeEditor,0);return}}
 if(axis821FlowAwaitCustom&&e.target.closest?.('#saveCustomEq'))setTimeout(()=>{const made=(state.profile?.customEq||[]).filter(x=>!axis821FlowCustomBefore?.has(x.id)).at(-1);if(made&&axis821FlowDraft){axis821FlowDraft.steps.push({id:uid('FS'),objectRef:made.id});axis821FlowSurfaceResumeEditor()}else if(!$('#customEqSheet')?.classList.contains('show'))axis821FlowSurfaceResumeEditor()},220);
 if(axis821FlowAwaitCustom&&e.target.closest?.('[data-close="customEqSheet"]'))setTimeout(axis821FlowSurfaceResumeEditor,0);
},true);
window.addEventListener('axis:flow-encounter-committed',e=>axis821FlowSurfaceAfterEncounter(e.detail?.id));
window.addEventListener('pageshow',()=>axis821FlowSurfaceRenderHome());
window.addEventListener('axis:object-schema-changed',()=>axis821FlowSurfaceRenderHome());
window.__AXIS_821_FLOW_SURFACE__={version:'8.21',owner:'app.js',definitionOwner:'app.js',pickerOwner:'existing-eqSheet',recordingOwner:'existing-v61+app',newStorage:false,newPicker:false,newRecorder:false,newEncounterWriter:false,mount:axis821FlowSurfaceEnsureDom,render:axis821FlowSurfaceRenderHome,open:axis821FlowSurfaceOpen,newFlow:axis821FlowSurfaceNew,editFlow:axis821FlowSurfaceEdit,recordCurrent:axis821FlowSurfaceRecord,afterEncounter:axis821FlowSurfaceAfterEncounter};
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',()=>axis821FlowSurfaceRenderHome(),{once:true});else queueMicrotask(axis821FlowSurfaceRenderHome);
`;
 s=s.replace(hit,hit+'\n'+block);
 s=once(s,"state.active.events.push(e);save();try{closeSheet('scanSheet')}","state.active.events.push(e);save();try{window.dispatchEvent(new CustomEvent('axis:flow-encounter-committed',{detail:{id:e.id,equipmentId:e.equipmentId,flowProvenance:e.flowProvenance||null}}))}catch{};try{closeSheet('scanSheet')}",'post-commit Flow surface advance signal');
 syntax(s,FILE);write(FILE,s);
}

/* Existing v61 Quick Record remains the sole user recording route. Flow only
   receives a tiny open/openFor bridge to that already-owned lifecycle. */
{
 const FILE='v61.js';let s=read(FILE);
 s=once(s,'function bind(){injectQuick();injectPending();basic();',"function bind(){injectQuick();window.__AXIS_QUICK_RECORD__={version:'8.21',owner:'v61',open:openQuick,openFor:chooseQuick};injectPending();basic();",'v61 Quick Record bridge');
 syntax(s,FILE);write(FILE,s);
}

/* Static presentation only: no runtime stylesheet owner is introduced. */
{
 const FILE='styles.css';let s=read(FILE);const marker='/* AXIS 8.21 Flow user surface */';if(s.includes(marker))fail('Flow surface CSS duplicated');
 s+=String.raw`

/* AXIS 8.21 Flow user surface */
.axis821FlowHome{margin:0 0 26px;padding:17px 0 18px;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}.axis821FlowTop{height:28px;display:flex;align-items:center;justify-content:space-between}.axis821FlowTop>span{font-size:11px;font-weight:660;letter-spacing:.08em;color:var(--muted)}.axis821FlowTop>button{min-width:44px;height:36px;text-align:right;font-size:12px;color:var(--muted)}.axis821FlowCurrent{padding:8px 0 13px}.axis821FlowCurrent b{display:block;font-size:18px;line-height:1.3;font-weight:680;letter-spacing:-.018em}.axis821FlowCurrent small{display:block;margin-top:6px;font-size:12px;line-height:1.5;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowPrimaryActions{display:grid;grid-template-columns:1fr 1fr;gap:9px}.axis821FlowPrimaryActions.one{grid-template-columns:1fr}.axis821FlowPrimaryActions button{height:46px;border-radius:14px;background:var(--s2);font-size:13px;font-weight:650}.axis821FlowPrimaryActions button.primary{background:var(--text);color:#0a0b0d}.axis821FlowQuietActions{display:flex;justify-content:space-between;gap:12px;margin-top:8px}.axis821FlowQuietActions button{min-height:38px;font-size:11px;color:var(--dim);text-align:left}.axis821FlowQuietActions button+button{text-align:right}.axis821FlowHubHead,.axis821FlowEditorHead{display:flex;align-items:center;justify-content:space-between;min-height:42px;border-bottom:1px solid var(--line2)}.axis821FlowHubHead span,.axis821FlowEditorHead span{font-size:12px;color:var(--muted)}.axis821FlowHubHead button{height:42px;font-size:13px;color:var(--accent2)}.axis821FlowEditorHead small{font-size:11px;color:var(--dim)}.axis821FlowList{margin-top:2px}.axis821FlowRow{min-height:78px;display:grid;grid-template-columns:1fr 54px;align-items:stretch;border-bottom:1px solid var(--line2)}.axis821FlowRowMain{min-width:0;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;text-align:left;padding:12px 0}.axis821FlowRowMain span{min-width:0}.axis821FlowRowMain b{display:block;font-size:15px;font-weight:660;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowRowMain small{display:block;margin-top:6px;font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowRowMain em{font-style:normal;font-size:11px;color:var(--accent2)}.axis821FlowEdit{font-size:11px;color:var(--dim)}.axis821FlowEmpty{padding:26px 0;border-bottom:1px solid var(--line2)}.axis821FlowEmpty b{display:block;font-size:15px}.axis821FlowEmpty span{display:block;margin-top:7px;font-size:12px;line-height:1.5;color:var(--muted)}.axis821FlowTitleInput{height:58px;display:grid;grid-template-columns:62px 1fr;align-items:center;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}.axis821FlowTitleInput span{font-size:12px;color:var(--muted)}.axis821FlowTitleInput input{height:56px;border:0;background:transparent;color:var(--text);outline:none;font-size:15px;text-align:right}.axis821FlowTitleInput input::placeholder{color:var(--dim)}.axis821FlowSteps{margin-top:4px}.axis821FlowStep{min-height:70px;display:grid;grid-template-columns:34px minmax(0,1fr) auto;align-items:center;gap:10px;border-bottom:1px solid var(--line2)}.axis821FlowStep>i{font-style:normal;font-size:10px;color:var(--dim);font-variant-numeric:tabular-nums}.axis821FlowStep>span{min-width:0}.axis821FlowStep>span b{display:block;font-size:14px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.axis821FlowStep>span small{display:block;margin-top:4px;font-size:10px;color:var(--dim)}.axis821FlowStep>div{display:flex}.axis821FlowStep>div button{width:38px;height:44px;font-size:16px;color:var(--muted)}.axis821FlowStep>div button:disabled{opacity:.22}.axis821FlowStep>div button:last-child{font-size:20px;color:var(--dim)}.axis821FlowStepEmpty{height:70px;display:flex;align-items:center;border-bottom:1px solid var(--line2);font-size:12px;color:var(--muted)}.axis821FlowAdd{width:100%;height:50px;margin-top:8px;text-align:left;font-size:13px;color:var(--accent2)}.axis821FlowSave:disabled{opacity:.32}.axis821FlowDelete{margin-top:12px}.axis821FlowBack{width:100%;height:48px;margin-top:8px;font-size:12px;color:var(--muted)}
@media(min-width:700px){.axis821FlowSheet{max-height:86dvh}.axis821FlowHome{padding-top:19px}.axis821FlowPrimaryActions button{height:48px}}
`;
 write(FILE,s);
}

console.log('[AXIS 8.21 Flow user surface] PASS · Today Flow composition/run surface · existing Object picker · existing Quick Record · post-Encounter advance · skip/insert/finish-early · static UI only');
