import fs from 'node:fs';

const PREP='prepare-8124-custom-equipment-profile.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12.4 custom equipment driver] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,()=>to)};
const onceRe=(src,re,to,label)=>{const m=src.match(re)||[];if(m.length!==1)fail(`${label} expected once, found ${m.length}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const original=read(PREP);
let prepared=original;

/* Keep generated runtime interpolation inside app.js, never in the Node transform scope. */
prepared=onceRe(prepared,/ const metaFn=`[^\n]*`;\n/,` const metaFn="function eventMeta(e){const ms=e.recording?.metrics;if(Array.isArray(ms)&&ms.length){const out=[];if(ms.includes('weight'))out.push(numFmt(e.weight)+'kg');if(ms.includes('reps'))out.push((Number(e.reps)||0)+'次');if(ms.includes('duration'))out.push((Number(e.duration)||0)+'分钟');if(ms.includes('intensity'))out.push('强度'+(Number(e.intensity)||0));if(ms.includes('level'))out.push('档位'+(Number(e.level??e.intensity)||0));if((ms.includes('weight')||ms.includes('reps'))&&Number(e.sets))out.push(Number(e.sets)+'组');return out.join(' · ')||'已记录'}return e.kind==='strength'?(numFmt(e.weight)+'kg · '+e.reps+'次 · '+e.sets+'组'):(e.duration+'分钟 · 强度'+e.intensity)}";\n`,'event meta transform interpolation');

/* Reusing an existing normalized custom name selects it; it must never overwrite its profile. */
prepared=onceRe(prepared,/ const saveFn=`function saveCustomEq\(\)\{[^\n]*\}`;\n/,` const saveFn="function saveCustomEq(){const name=$('#customName').value.trim(),type=$('#customType .active')?.dataset.type||'strength',muscles=$$('#customMuscles .active').map(b=>b.dataset.muscle),metrics=$$('#axisCustomMetrics [data-axis-metric].active').map(b=>b.dataset.axisMetric).filter(Boolean);if(!name)return toast('请输入名称');if(!metrics.length)return toast('至少选择一项记录内容');const key=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/\\s+/g,''),list=state.profile.customEq||[],existing=list.find(x=>key(x.name)===key(name)&&x.id!==editCustomId),intent=window.__AXIS_CUSTOM_CREATE_INTENT__;if(existing&&!editCustomId){closeSheet('customEqSheet');renderManageEq();render();window.__AXIS_EQUIPMENT_PICKER_REFRESH__?.();window.__AXIS_CUSTOM_CREATE_INTENT__=null;if(intent?.fromPicker){window.__AXIS_PICK_EQUIPMENT__?.(existing.id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.()}toast('已存在，直接使用');return}const id=editCustomId||('custom-'+uid('').replace(/^-/, '').toLowerCase()),recording={version:1,metrics:[...new Set(metrics)]};let e=list.find(x=>x.id===id);if(e){e.name=name;e.type=type;e.muscles=muscles;e.pattern=derivePattern(type,muscles);e.effect=muscles.slice(0,2).join(' · ')||'自定义项目';e.recording=recording;e.custom=true}else{e={id,name,type,pattern:derivePattern(type,muscles),muscles,effect:muscles.slice(0,2).join(' · ')||'自定义项目',recording,custom:true};state.profile.customEq.push(e)}save();closeSheet('customEqSheet');renderManageEq();render();window.__AXIS_EQUIPMENT_PICKER_REFRESH__?.();window.__AXIS_CUSTOM_CREATE_INTENT__=null;if(intent?.fromPicker){window.__AXIS_PICK_EQUIPMENT__?.(id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.()}toast('已保存')}";\n`,'duplicate custom identity contract');

write(PREP,prepared);
let imported=false;
try{
 await import('./prepare-8124-custom-equipment-profile.mjs');
 imported=true;
}finally{
 write(PREP,original);
}
if(!imported)fail('custom profile transform did not complete');

/* Finish the additive compatibility layer after the primary transform has installed. */
{
 const FILE='app.js';let src=read(FILE);
 if(!src.includes('__AXIS_8124_CUSTOM_EQUIPMENT_PROFILE__'))fail('custom profile runtime marker missing');
 if(src.includes('__AXIS_8124_CUSTOM_EQUIPMENT_DRIVER__'))fail('custom profile driver already installed');

 const rows="const rows=e.kind==='strength'?[['重量',numFmt(e.weight)+' kg'],['次数',e.reps+' 次'],['组数',e.sets+' 组']]:[['时间',e.duration+' 分钟'],['强度',e.intensity+' / 10']];rows.unshift(['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—']);";
 const rowsNext="const rows=Array.isArray(e.recording?.metrics)&&e.recording.metrics.length?(()=>{const ms=new Set(e.recording.metrics),out=[];if(ms.has('weight'))out.push(['重量',numFmt(e.weight)+' kg']);if(ms.has('reps'))out.push(['次数',(Number(e.reps)||0)+' 次']);if((ms.has('weight')||ms.has('reps'))&&Number(e.sets))out.push(['组数',Number(e.sets)+' 组']);if(ms.has('duration'))out.push(['时间',(Number(e.duration)||0)+' 分钟']);if(ms.has('intensity'))out.push(['强度',(Number(e.intensity)||0)+' / 10']);if(ms.has('level'))out.push(['档位',String(Number(e.level??e.intensity)||0)]);return out})():(e.kind==='strength'?[['重量',numFmt(e.weight)+' kg'],['次数',e.reps+' 次'],['组数',e.sets+' 组']]:[['时间',e.duration+' 分钟'],['强度',e.intensity+' / 10']]);rows.unshift(['主要锻炼',(e.muscles||eq.muscles||[]).join(' · ')||'—']);";
 src=once(src,rows,rowsNext,'record detail flexible rows');

 const listener="$('#axisCustomMetrics')?.addEventListener('click',e=>{const b=e.target.closest('[data-axis-metric]');if(!b)return;b.classList.toggle('active')});";
 const listenerNext="$('#axisCustomMetrics')?.addEventListener('click',e=>{const b=e.target.closest('[data-axis-metric]');if(!b)return;const on=!b.classList.contains('active');if(on&&(b.dataset.axisMetric==='intensity'||b.dataset.axisMetric==='level'))$$('#axisCustomMetrics [data-axis-metric=\"intensity\"],#axisCustomMetrics [data-axis-metric=\"level\"]').forEach(x=>x.classList.remove('active'));b.classList.toggle('active',on)});";
 src=once(src,listener,listenerNext,'intensity/level exclusivity');

 const clickNeedle="D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis-create-custom]');if(!b)return;e.preventDefault();e.stopPropagation();axis8124OpenCustomFromPicker(b.dataset.axisCreateCustom||$('#eqSearch')?.value||'')},true);";
 const clickNext=clickNeedle+"\nD.addEventListener('click',e=>{if(e.target?.closest?.('#v8New')){e.preventDefault();e.stopImmediatePropagation();window.__AXIS_EQUIPMENT_PICK_CONTEXT__='quick';axis8124OpenCustomFromPicker('');return}const closing=e.target?.closest?.('#customEqSheet [data-close=\"customEqSheet\"]')||e.target===$('#customEqSheet');if(closing)window.__AXIS_CUSTOM_CREATE_INTENT__=null},true);";
 src=once(src,clickNeedle,clickNext,'custom create intent lifecycle');

 const marker="try{window.__AXIS_8124_CUSTOM_EQUIPMENT_PROFILE__={version:'8.12.4',owner:'app-customEq',allCustomSearchable:true,directNoMatchCreate:true,recordingProfileVersion:1,metrics:[...AXIS8124_METRICS],canonicalPickerReturn:true,trainingOwner:false}}catch{}";
 const markerNext=marker+"\ntry{window.__AXIS_8124_CUSTOM_EQUIPMENT_DRIVER__={version:'8.12.4',duplicateIdentitySafe:true,intentCancelSafe:true,detailMetrics:true,intensityLevelExclusive:true,trainingOwner:false}}catch{}";
 src=once(src,marker,markerNext,'driver marker');
 syntax(src,FILE);write(FILE,src);
}

{
 const FILE='v61.js';let src=read(FILE);
 if(!src.includes('__AXIS_8124_QUICK_CUSTOM_PROFILE__'))fail('Quick custom profile marker missing');
 const re=/function summary\(e\)\{[^\n]*\}/;
 const old=(src.match(re)||[])[0];if(!old)fail('Quick summary function missing');
 const next="function summary(e){if(!e)return'';const metrics=e.recording?.metrics;if(Array.isArray(metrics)&&metrics.length){const ms=new Set(metrics),out=[];if(ms.has('weight'))out.push(fmt(e.weight)+'kg');if(ms.has('reps'))out.push((Number(e.reps)||0)+'次');if((ms.has('weight')||ms.has('reps'))&&Number(e.sets))out.push(Number(e.sets)+'组');if(ms.has('duration'))out.push((Number(e.duration)||0)+'分钟');if(ms.has('intensity'))out.push('强度'+(Number(e.intensity)||0));if(ms.has('level'))out.push('档位'+(Number(e.level??e.intensity)||0));return out.join(' · ')||'已记录'}if(e.kind==='cardio')return`${e.duration||0}分钟 · 强度${e.intensity||0}`;const all=setsOf(e),done=all.filter(s=>s.state!=='unfinished'),weights=[...new Set(done.map(s=>fmt(s.weight)))],reps=done.map(s=>fmt(s.reps)),base=`${weights.length===1?weights[0]+'kg':weights.length?'分组重量':'重量—'} · ${reps.length?reps.join(' / '):'次数—'}`;const incomplete=done.length<all.length?` · ${done.length}/${all.length}组`:'';const review=mread().events?.[e.id]?.needsReview?' · 待补':'';return base+incomplete+review}";
 src=src.replace(re,()=>next);
 const end=src.lastIndexOf('})();');if(end<0)fail('v61 IIFE end missing');
 src=src.slice(0,end)+"try{window.__AXIS_8124_QUICK_CUSTOM_SUMMARY__={version:'8.12.4',recordingProfileAware:true}}catch{}\n"+src.slice(end);
 syntax(src,FILE);write(FILE,src);
}

console.log('[AXIS 8.12.4 custom equipment driver] PASS · transform interpolation safe · duplicate identity non-destructive · intent lifecycle sealed · detail/Quick summaries profile-aware');
