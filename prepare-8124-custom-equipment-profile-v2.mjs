import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 custom equipment v2] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,()=>to)};
const onceRe=(src,re,to,label)=>{const m=src.match(re)||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};
const rename=(fn,name)=>fn.toString().replace(/^function\s+[^ (]+/,`function ${name}`);

function generatedSaveCustomEq(){
 const name=$('#customName').value.trim(),type=$('#customType .active')?.dataset.type||'strength',muscles=$$('#customMuscles .active').map(b=>b.dataset.muscle),metrics=$$('#axisCustomMetrics [data-axis-metric].active').map(b=>b.dataset.axisMetric).filter(Boolean);
 if(!name)return toast('请输入名称');
 if(!metrics.length)return toast('至少选择一项记录内容');
 const key=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,''),list=state.profile.customEq||[],existing=list.find(x=>key(x.name)===key(name)&&x.id!==editCustomId),intent=window.__AXIS_CUSTOM_CREATE_INTENT__;
 if(existing&&!editCustomId){closeSheet('customEqSheet');renderManageEq();render();window.__AXIS_EQUIPMENT_PICKER_REFRESH__?.();window.__AXIS_CUSTOM_CREATE_INTENT__=null;if(intent?.fromPicker){window.__AXIS_PICK_EQUIPMENT__?.(existing.id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.()}toast('已存在，直接使用');return}
 const id=editCustomId||('custom-'+uid('').replace(/^-/, '').toLowerCase()),recording={version:1,metrics:[...new Set(metrics)]};let e=list.find(x=>x.id===id);
 if(e){e.name=name;e.type=type;e.muscles=muscles;e.pattern=derivePattern(type,muscles);e.effect=muscles.slice(0,2).join(' · ')||'自定义项目';e.recording=recording;e.custom=true}else{e={id,name,type,pattern:derivePattern(type,muscles),muscles,effect:muscles.slice(0,2).join(' · ')||'自定义项目',recording,custom:true};state.profile.customEq.push(e)}
 save();closeSheet('customEqSheet');renderManageEq();render();window.__AXIS_EQUIPMENT_PICKER_REFRESH__?.();window.__AXIS_CUSTOM_CREATE_INTENT__=null;if(intent?.fromPicker){window.__AXIS_PICK_EQUIPMENT__?.(id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.()}toast('已保存')
}
function generatedEventMeta(e){const ms=e.recording?.metrics;if(Array.isArray(ms)&&ms.length){const out=[];if(ms.includes('weight'))out.push(numFmt(e.weight)+'kg');if(ms.includes('reps'))out.push((Number(e.reps)||0)+'次');if(ms.includes('duration'))out.push((Number(e.duration)||0)+'分钟');if(ms.includes('intensity'))out.push('强度'+(Number(e.intensity)||0));if(ms.includes('level'))out.push('档位'+(Number(e.level??e.intensity)||0));if((ms.includes('weight')||ms.includes('reps'))&&Number(e.sets))out.push(Number(e.sets)+'组');return out.join(' · ')||'已记录'}return e.kind==='strength'?(numFmt(e.weight)+'kg · '+e.reps+'次 · '+e.sets+'组'):(e.duration+'分钟 · 强度'+e.intensity)}
function generatedRenderManageEq(){const a=state.profile.customEq||[],labels={weight:'重量',reps:'次数',duration:'时间',intensity:'强度',level:'档位'};$('#manageEqList').innerHTML=a.length?a.map(e=>{const muscle=(e.muscles||[]).slice(0,3).join(' · '),metrics=(e.recording?.metrics||[]).map(x=>labels[x]).filter(Boolean).join(' · '),meta=muscle||metrics||(e.type==='cardio'?'时间 · 强度':'重量 · 次数');return '<button class="manageEq" data-edit-eq="'+e.id+'"><span><b>'+esc(e.name)+'</b><span>'+esc(meta)+'</span></span><i>›</i></button>'}).join(''):'<div class="empty">暂无自定义器械</div>';$$('[data-edit-eq]').forEach(b=>b.onclick=()=>openCustomEditor(b.dataset.editEq))}
function generatedSmartSearch(){const input=$('#eqSearch'),host=$('#v873SmartResults');if(!input||!host)return;host.classList.add('v8124Owned');const q=input.value.trim();if(!q){host.classList.remove('show');host.innerHTML='';axis8124SetCatalogSearching(false);axis8124RenderPickerContext();return}axis8124SetCatalogSearching(true);const rs=axis8124CatalogRanked(q,12),best=rs[0]?.score||0,create=best<86?'<button class="v873SmartCreate" type="button" data-axis-create-custom="'+esc(q)+'"><span><b>＋ 新建“'+esc(q)+'”</b><small>创建后加入我的器械，并设置记录内容</small></span><em>›</em></button>':'';host.innerHTML='<div class="v873SmartHead"><b>'+(rs.length&&best>=86?'匹配结果':'没有足够匹配')+'</b><span>'+rs.length+'</span></div>'+rs.map(({x})=>{const detail=(x.primaryTargets||x.detailMuscles||x.muscles||[]).slice(0,2),meta=[x.custom?'我的':(x.type==='cardio'?'有氧':'力量'),...detail].filter(Boolean).join(' · ');return '<button class="v873SmartItem" type="button" data-v8124-pick="'+esc(x.pickId||x.id)+'"><span><b>'+esc(x.name)+'</b><small>'+esc(meta||x.movementPattern||'器械 / 运动')+'</small></span><em>›</em></button>'}).join('')+create;host.classList.add('show')}
function generatedQuickSummary(e){if(!e)return'';const metrics=e.recording?.metrics;if(Array.isArray(metrics)&&metrics.length){const ms=new Set(metrics),out=[];if(ms.has('weight'))out.push(fmt(e.weight)+'kg');if(ms.has('reps'))out.push((Number(e.reps)||0)+'次');if((ms.has('weight')||ms.has('reps'))&&Number(e.sets))out.push(Number(e.sets)+'组');if(ms.has('duration'))out.push((Number(e.duration)||0)+'分钟');if(ms.has('intensity'))out.push('强度'+(Number(e.intensity)||0));if(ms.has('level'))out.push('档位'+(Number(e.level??e.intensity)||0));return out.join(' · ')||'已记录'}if(e.kind==='cardio')return String(e.duration||0)+'分钟 · 强度'+String(e.intensity||0);const all=setsOf(e),done=all.filter(s=>s.state!=='unfinished'),weights=[...new Set(done.map(s=>fmt(s.weight)))],reps=done.map(s=>fmt(s.reps)),base=(weights.length===1?weights[0]+'kg':weights.length?'分组重量':'重量—')+' · '+(reps.length?reps.join(' / '):'次数—'),incomplete=done.length<all.length?' · '+done.length+'/'+all.length+'组':'',review=mread().events?.[e.id]?.needsReview?' · 待补':'';return base+incomplete+review}

/* Additive custom editor recording profile. */
{
 const FILE='index.html';let src=read(FILE);
 if(src.includes('axisCustomMetrics'))fail('custom recording metrics already installed');
 const anchor='<div class="sectionLabel">主要锻炼</div><div class="musclePicker" id="customMuscles"></div>';
 const controls='<div class="sectionLabel">记录内容</div><div class="axisCustomMetrics" id="axisCustomMetrics"><button type="button" data-axis-metric="weight">重量</button><button type="button" data-axis-metric="reps">次数</button><button type="button" data-axis-metric="duration">时间</button><button type="button" data-axis-metric="intensity">强度</button><button type="button" data-axis-metric="level">档位</button></div><div class="axisCustomMetricHint" id="axisCustomMetricHint">记录时只显示这里选择的内容，可多选</div>'+anchor;
 src=once(src,anchor,controls,'custom metric controls');write(FILE,src);
}

{
 const FILE='app.js';let src=read(FILE);
 if(!src.includes('__AXIS_8124_PICKER_PROJECTION__'))fail('8.12.4 picker projection must run first');
 if(src.includes('__AXIS_8124_CUSTOM_EQUIPMENT_PROFILE__'))fail('custom equipment profile already installed');
 const projection="window.__AXIS_EQUIPMENT_PICKER_DATA__={version:'8.12.4',owner:'app-readonly-projection',personal:(limit=8)=>";
 const projectionNext="window.__AXIS_EQUIPMENT_PICKER_DATA__={version:'8.12.4',owner:'app-readonly-projection',custom:(limit=120)=>(state.profile?.customEq||[]).slice(0,Math.max(1,Number(limit)||120)).map(x=>({id:x.id,name:x.name,type:x.type||'strength',custom:true,muscles:[...(x.muscles||[])],recording:x.recording||null})),personal:(limit=8)=>";
 src=once(src,projection,projectionNext,'all custom picker projection');
 src=onceRe(src,/function saveCustomEq\(\)\{[^\n]*\}/g,rename(generatedSaveCustomEq,'saveCustomEq'),'custom save owner');
 src=onceRe(src,/function eventMeta\(e\)\{[^\n]*\}/g,rename(generatedEventMeta,'eventMeta'),'recording-aware event summary');
 src=onceRe(src,/function renderManageEq\(\)\{[^\n]*\}/g,rename(generatedRenderManageEq,'renderManageEq'),'custom list recording summary');
 const metricAssign="if(eq.type==='strength'){e.weight=nval('weight',0,1000,0);e.reps=choiceVal('reps',10);e.sets=choiceVal('sets',3)}else{e.duration=nval('duration',1,600,15);e.intensity=choiceVal('intensity',5)}";
 src=once(src,metricAssign,"axis8124AssignRecordingMetrics(e,eq)",'flexible scan metrics');
 const rows="const rows=e.kind==='strength'?[['重量',numFmt(e.weight)+' kg'],['次数',e.reps+' 次'],['组数',e.sets+' 组']]:[['时间',e.duration+' 分钟'],['强度',e.intensity+' / 10']];rows.unshift(['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—']);";
 const rowsNext="const rows=Array.isArray(e.recording?.metrics)&&e.recording.metrics.length?(()=>{const ms=new Set(e.recording.metrics),out=[];if(ms.has('weight'))out.push(['重量',numFmt(e.weight)+' kg']);if(ms.has('reps'))out.push(['次数',(Number(e.reps)||0)+' 次']);if((ms.has('weight')||ms.has('reps'))&&Number(e.sets))out.push(['组数',Number(e.sets)+' 组']);if(ms.has('duration'))out.push(['时间',(Number(e.duration)||0)+' 分钟']);if(ms.has('intensity'))out.push(['强度',(Number(e.intensity)||0)+' / 10']);if(ms.has('level'))out.push(['档位',String(Number(e.level??e.intensity)||0)]);return out})():(e.kind==='strength'?[['重量',numFmt(e.weight)+' kg'],['次数',e.reps+' 次'],['组数',e.sets+' 组']]:[['时间',e.duration+' 分钟'],['强度',e.intensity+' / 10']]);rows.unshift(['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—']);";
 src=once(src,rows,rowsNext,'record detail flexible rows');
 const end=src.lastIndexOf('})();');if(end<0)fail('app IIFE end missing');
 const block=String.raw`
/* AXIS 8.12.4 — all custom definitions are searchable and define their recording shape. */
const AXIS8124_METRICS=['weight','reps','duration','intensity','level'];
(function axis8124CustomMetricStyle(){if($('#axis8124CustomMetricStyle'))return;const s=D.createElement('style');s.id='axis8124CustomMetricStyle';s.textContent='.axisCustomMetrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px}.axisCustomMetrics button{height:44px;border-radius:13px;background:var(--s2);color:var(--dim);font-size:12px;font-weight:600}.axisCustomMetrics button.active{background:rgba(115,124,255,.16);color:var(--accent2);box-shadow:inset 0 0 0 1px rgba(115,124,255,.22)}.axisCustomMetricHint{margin:8px 1px 2px;color:var(--dim);font-size:10.5px;line-height:1.45}@media(max-width:380px){.axisCustomMetrics{gap:7px}.axisCustomMetrics button{height:42px;font-size:11.5px}}';(D.head||D.documentElement).appendChild(s)})();
function axis8124RecordingMetrics(eq){const a=eq?.recording?.metrics;if(Array.isArray(a)){const clean=[...new Set(a.filter(x=>AXIS8124_METRICS.includes(x)))];if(clean.length)return clean}return eq?.type==='cardio'?['duration','intensity']:['weight','reps']}
function axis8124SetCustomMetricUI(metrics){const set=new Set(metrics);$$('#axisCustomMetrics [data-axis-metric]').forEach(b=>b.classList.toggle('active',set.has(b.dataset.axisMetric)))}
function axis8124ApplyRecordingProfile(eq){if(!eq)return;const metrics=axis8124RecordingMetrics(eq),set=new Set(metrics),strength=set.has('weight')||set.has('reps'),cardio=set.has('duration')||set.has('intensity')||set.has('level'),strengthBox=$('#strengthFields'),cardioBox=$('#cardioFields');strengthBox?.classList.toggle('hidden',!strength);cardioBox?.classList.toggle('hidden',!cardio);$('#weight')?.closest('.numberControl')?.classList.toggle('hidden',!set.has('weight'));$('#repsChoices')?.closest('.choiceControl')?.classList.toggle('hidden',!set.has('reps'));$('#setsChoices')?.closest('.choiceControl')?.classList.toggle('hidden',!strength);$('#duration')?.closest('.numberControl')?.classList.toggle('hidden',!set.has('duration'));const intensityRow=$('#intensityChoices')?.closest('.choiceControl');intensityRow?.classList.toggle('hidden',!(set.has('intensity')||set.has('level')));const label=intensityRow?.querySelector(':scope>span');if(label)label.textContent=set.has('level')&&!set.has('intensity')?'档位':'强度';if(intensityRow)intensityRow.dataset.axisMetricMode=set.has('level')&&!set.has('intensity')?'level':'intensity'}
function axis8124AssignRecordingMetrics(e,eq){const metrics=axis8124RecordingMetrics(eq),set=new Set(metrics);e.recording={version:1,metrics:[...metrics]};if(set.has('weight'))e.weight=nval('weight',0,1000,0);if(set.has('reps'))e.reps=choiceVal('reps',10);if(set.has('weight')||set.has('reps'))e.sets=choiceVal('sets',3);if(set.has('duration'))e.duration=nval('duration',1,600,15);if(set.has('intensity'))e.intensity=choiceVal('intensity',5);if(set.has('level')){e.level=choiceVal('intensity',5);if(e.intensity==null)e.intensity=e.level}}
function axis8124OpenCustomFromPicker(query=''){window.__AXIS_CUSTOM_CREATE_INTENT__={fromPicker:true,query:String(query||'').trim()};closeSheet('eqSheet');openCustomEditor();const input=$('#customName');if(input){input.value=String(query||'').trim();requestAnimationFrame(()=>{input.focus();try{input.setSelectionRange(input.value.length,input.value.length)}catch{}})}}
const axis8124OpenCustomEditorBase=openCustomEditor;
openCustomEditor=function(id=null){if(id)window.__AXIS_CUSTOM_CREATE_INTENT__=null;axis8124OpenCustomEditorBase(id);const e=id?(state.profile.customEq||[]).find(x=>x.id===id):null,metrics=axis8124RecordingMetrics(e||{type:$('#customType .active')?.dataset.type||'strength'});axis8124SetCustomMetricUI(metrics)};
const axis8124SelectEqBase=selectEq;
selectEq=function(id,manual=true){axis8124SelectEqBase(id,manual);axis8124ApplyRecordingProfile(eqById(id))};
$('#customType')?.addEventListener('click',e=>{const b=e.target.closest('[data-type]');if(!b)return;const current=$$('#axisCustomMetrics [data-axis-metric].active').map(x=>x.dataset.axisMetric),defaults=b.dataset.type==='cardio'?['duration','intensity']:['weight','reps'];if(!current.length||current.join('|')==='weight|reps'||current.join('|')==='duration|intensity')axis8124SetCustomMetricUI(defaults)});
$('#axisCustomMetrics')?.addEventListener('click',e=>{const b=e.target.closest('[data-axis-metric]');if(!b)return;const on=!b.classList.contains('active');if(on&&(b.dataset.axisMetric==='intensity'||b.dataset.axisMetric==='level'))$$('#axisCustomMetrics [data-axis-metric="intensity"],#axisCustomMetrics [data-axis-metric="level"]').forEach(x=>x.classList.remove('active'));b.classList.toggle('active',on)});
$('#saveCustomEq').onclick=saveCustomEq;
$('#addCustomEq').onclick=()=>axis8124OpenCustomFromPicker($('#eqSearch')?.value||'');
$('#newCustomEq').onclick=()=>{window.__AXIS_CUSTOM_CREATE_INTENT__=null;openCustomEditor()};
D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis-create-custom]');if(!b)return;e.preventDefault();e.stopPropagation();axis8124OpenCustomFromPicker(b.dataset.axisCreateCustom||$('#eqSearch')?.value||'')},true);
D.addEventListener('click',e=>{if(e.target?.closest?.('#v8New')){e.preventDefault();e.stopImmediatePropagation();window.__AXIS_EQUIPMENT_PICK_CONTEXT__='quick';axis8124OpenCustomFromPicker('');return}const closing=e.target?.closest?.('#customEqSheet [data-close="customEqSheet"]')||e.target===$('#customEqSheet');if(closing)window.__AXIS_CUSTOM_CREATE_INTENT__=null},true);
window.__AXIS_OPEN_CUSTOM_EQUIPMENT__=axis8124OpenCustomFromPicker;
try{window.__AXIS_8124_CUSTOM_EQUIPMENT_PROFILE__={version:'8.12.4',owner:'app-customEq',allCustomSearchable:true,directNoMatchCreate:true,recordingProfileVersion:1,metrics:[...AXIS8124_METRICS],canonicalPickerReturn:true,duplicateIdentitySafe:true,intentCancelSafe:true,detailMetrics:true,intensityLevelExclusive:true,trainingOwner:false}}catch{}
`;
 src=src.slice(0,end)+block+'\n'+src.slice(end);syntax(src,FILE);write(FILE,src);
}

{
 const FILE='v873-smart-input.js';let src=read(FILE);
 if(!src.includes('__AXIS_8124_CATALOG_POLISH__'))fail('8.12.4 smart search owner must run first');
 const catalogRe=/function axis8124CatalogItems\(\)\{[\s\S]*?\n\}/;
 const catalog="function axis8124CatalogItems(){\n const byName=new Map(),add=(x,prefer=false)=>{if(!x?.name||!x?.pickId)return;const k=norm(x.name),old=byName.get(k);if(!old||prefer)byName.set(k,x)};\n const api=window.__AXIS_EQUIPMENT_PICKER_DATA__;\n for(const x of api?.custom?.(120)||[])add({...x,pickId:x.id,aliases:[],metaText:'我的 自定义',custom:true},true);\n for(const x of LIB)add({...x,pickId:x.baseId||x.id},!!x.baseId);\n for(const x of api?.personal?.(80)||[])add({...x,aliases:x.aliases||[],muscles:x.muscles||[],pickId:x.id,metaText:x.custom?'我的 自定义':'我的 已使用',custom:!!x.custom},!!x.custom);\n for(const b of $$('#eqList [data-eq]')){const name=b.querySelector('b')?.textContent?.trim();if(name)add({id:b.dataset.eq,pickId:b.dataset.eq,name,aliases:[],muscles:[],type:/有氧/.test(b.textContent)?'cardio':'strength',metaText:b.textContent},false)}\n return [...byName.values()]\n}";
 src=onceRe(src,catalogRe,catalog,'custom-aware search catalog');
 src=onceRe(src,/function renderSmartSearch\(\)\{[^\n]*\}/,rename(generatedSmartSearch,'renderSmartSearch'),'no-match direct creation');
 const styleNeedle=".v873SmartResults.v8124Owned .v873SmartItem small{font-size:11px;line-height:1.4}";
 const styleAdd=styleNeedle+".v873SmartCreate{width:100%;min-height:58px;margin-top:8px;padding:10px 12px;border-radius:14px;background:rgba(115,124,255,.10);display:flex;align-items:center;justify-content:space-between;text-align:left;color:var(--accent2)}.v873SmartCreate span{min-width:0}.v873SmartCreate b{display:block;font-size:13px}.v873SmartCreate small{display:block;margin-top:4px;color:var(--dim);font-size:10px}.v873SmartCreate em{font-style:normal;color:var(--dim)}";
 src=once(src,styleNeedle,styleAdd,'create result style');
 const marker="try{window.__AXIS_8124_CATALOG_POLISH__={version:'8.12.4',owner:'v873-search-projection',singleSearchOwner:true,compositionAware:true,legacyPerKeyRender:false,personal:true,recent:true,canonicalSelection:true,detailMetadata:true,storageWriter:false}}catch{}";
 src=once(src,marker,marker+";try{window.__AXIS_8124_CUSTOM_SEARCH__={version:'8.12.4',allCustom:true,noMatchCreate:true,queryPrefill:true,storageWriter:false}}catch{}",'custom search marker');
 syntax(src,FILE);write(FILE,src);
}

{
 const FILE='v61.js';let src=read(FILE);
 if(!src.includes('__AXIS_8123_QUICK_CATALOG_BRIDGE__'))fail('Quick catalog bridge must run first');
 src=onceRe(src,/function summary\(e\)\{[^\n]*\}/,rename(generatedQuickSummary,'summary'),'Quick recording-profile summary');
 const showRe=/function showQuickEditor\(id\)\{[^\n]*\}/,current=(src.match(showRe)||[])[0];if(!current)fail('Quick editor function missing');
 src=src.replace(showRe,()=>current.replace("if(e?.type==='strength')prepare(id||e.id)","if(e?.type==='strength'&&axis8124QuickUsesSetEditor(e))prepare(id||e.id);else hideSets()"));
 const anchor='function showQuickEditor(id)',i=src.indexOf(anchor);if(i<0)fail('Quick editor anchor missing');
 const helper="function axis8124QuickUsesSetEditor(e){if(!e)return false;const c=core(),custom=(c.profile?.customEq||[]).find(x=>x.id===e.id||x.name===e.name),metrics=custom?.recording?.metrics;if(!Array.isArray(metrics)||!metrics.length)return e.type==='strength';const set=new Set(metrics);return set.has('weight')&&set.has('reps')&&!set.has('duration')&&!set.has('intensity')&&!set.has('level')}\n";
 src=src.slice(0,i)+helper+src.slice(i);
 const end=src.lastIndexOf('})();');if(end<0)fail('v61 IIFE end missing');
 src=src.slice(0,end)+"try{window.__AXIS_8124_QUICK_CUSTOM_PROFILE__={version:'8.12.4',classicSetEditorOnly:true,customMetricsDeferToCanonicalForm:true,summaryAware:true}}catch{}\n"+src.slice(end);
 syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.12.4 custom equipment v2] PASS · custom search · exact-query create · non-destructive identity reuse · flexible recording profile · Camera/Quick canonical return · detail/history compatibility');
