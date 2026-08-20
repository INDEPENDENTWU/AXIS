import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 custom equipment safe] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* Add recording-shape controls to the existing canonical custom editor. */
{
 const f='index.html';let s=read(f);
 if(s.includes('axisCustomMetrics'))fail('custom metric controls already installed');
 const anchor='<div class="sectionLabel">主要锻炼</div><div class="musclePicker" id="customMuscles"></div>';
 if(!s.includes(anchor))fail('custom editor anatomy anchor missing');
 const controls='<div class="sectionLabel">记录内容</div><div class="axisCustomMetrics" id="axisCustomMetrics"><button type="button" data-axis-metric="weight">重量</button><button type="button" data-axis-metric="reps">次数</button><button type="button" data-axis-metric="duration">时间</button><button type="button" data-axis-metric="intensity">强度</button><button type="button" data-axis-metric="level">档位</button></div><div class="axisCustomMetricHint">只显示以后记录这个项目真正需要填写的内容</div>'+anchor;
 s=s.replace(anchor,controls);write(f,s);
}

/* Keep the established v873 search owner; extend only its projection + interaction. */
{
 const f='v873-smart-input.js';let s=read(f);
 if(!s.includes('__AXIS_8124_CATALOG_POLISH__'))fail('8.12.4 search owner must exist first');
 if(s.includes('__AXIS_8124_CUSTOM_SAFE__'))fail('safe custom profile already installed');

 const catalogStart=s.indexOf('function axis8124CatalogItems(){'),catalogEnd=s.indexOf('function axis8124CatalogRanked(',catalogStart);
 if(catalogStart<0||catalogEnd<0)fail('catalog projection boundary missing');
 const catalog=`function axis8124CatalogItems(){
 const byName=new Map(),add=(x,prefer=false)=>{if(!x?.name||!x?.pickId)return;const k=norm(x.name),old=byName.get(k);if(!old||prefer)byName.set(k,x)};
 for(const x of axis8124CustomDefinitions())add({id:x.id,pickId:x.id,name:x.name,type:x.type||'strength',muscles:[...(x.muscles||[])],aliases:[],custom:true,recording:x.recording||null,metaText:'我的 自定义'},true);
 for(const x of LIB)add({...x,pickId:x.baseId||x.id},!!x.baseId);
 const api=window.__AXIS_EQUIPMENT_PICKER_DATA__;
 for(const x of api?.personal?.(80)||[])add({...x,aliases:x.aliases||[],muscles:x.muscles||[],pickId:x.id,metaText:x.custom?'我的 自定义':'我的 已使用',custom:!!x.custom},!!x.custom);
 for(const b of $$('#eqList [data-eq]')){const name=b.querySelector('b')?.textContent?.trim();if(name)add({id:b.dataset.eq,pickId:b.dataset.eq,name,aliases:[],muscles:[],type:/有氧/.test(b.textContent)?'cardio':'strength',metaText:b.textContent},false)}
 return [...byName.values()]
}
`;
 s=s.slice(0,catalogStart)+catalog+s.slice(catalogEnd);

 const contextStart=s.indexOf('function axis8124RenderPickerContext(){'),contextEnd=s.indexOf('function axis8124SetCatalogSearching(',contextStart);
 if(contextStart<0||contextEnd<0)fail('picker context boundary missing');
 const context=`function axis8124RenderPickerContext(){axis8124PickerStyle();const input=$('#eqSearch');if(!input)return;let host=$('#v8124PickerContext');if(!host){host=D.createElement('div');host.id='v8124PickerContext';host.className='v8124PickerContext';input.insertAdjacentElement('afterend',host)}const api=window.__AXIS_EQUIPMENT_PICKER_DATA__,recent=api?.recent?.(6)||[],mineMap=new Map();for(const x of axis8124CustomDefinitions())mineMap.set(x.id,{id:x.id,name:x.name});for(const x of api?.personal?.(80)||[])if(x?.id&&!mineMap.has(x.id))mineMap.set(x.id,x);const mine=[...mineMap.values()].slice(0,12),group=(title,items,kind)=>items.length?'<div class="v8124PickerGroup"><div class="v8124PickerHead"><span>'+title+'</span><b>'+items.length+'</b></div><div class="v8124PickerRail">'+items.map(x=>'<button type="button" data-v8124-pick="'+esc(x.id)+'" data-v8124-kind="'+kind+'">'+esc(x.name)+'</button>').join('')+'</div></div>':'';host.innerHTML=group('最近',recent,'recent')+group('我的',mine,'mine');host.hidden=!host.innerHTML}
`;
 s=s.slice(0,contextStart)+context+s.slice(contextEnd);

 const searchStart=s.indexOf('function renderSmartSearch(){'),searchEnd=s.indexOf('let axis8124SearchRAF=',searchStart);
 if(searchStart<0||searchEnd<0)fail('smart search renderer boundary missing');
 const search=`function renderSmartSearch(){const input=$('#eqSearch'),host=$('#v873SmartResults');if(!input||!host)return;host.classList.add('v8124Owned');const q=input.value.trim();if(!q){host.classList.remove('show');host.innerHTML='';axis8124SetCatalogSearching(false);axis8124RenderPickerContext();return}axis8124SetCatalogSearching(true);const rs=axis8124CatalogRanked(q,12),best=rs[0]?.score||0,create=best<86?'<button class="v873SmartCreate" type="button" data-axis-create-custom="'+esc(q)+'"><span><b>＋ 新建“'+esc(q)+'”</b><small>加入我的器械，并设置以后需要记录什么</small></span><em>›</em></button>':'';host.innerHTML='<div class="v873SmartHead"><b>'+(rs.length&&best>=86?'匹配结果':'没有足够匹配')+'</b><span>'+rs.length+'</span></div>'+rs.map(({x})=>{const detail=(x.primaryTargets||x.detailMuscles||x.muscles||[]).slice(0,2),meta=[x.custom?'我的':(x.type==='cardio'?'有氧':'力量'),...detail].filter(Boolean).join(' · ');return '<button class="v873SmartItem" type="button" data-v8124-pick="'+esc(x.pickId||x.id)+'"><span><b>'+esc(x.name)+'</b><small>'+esc(meta||x.movementPattern||'器械 / 运动')+'</small></span><em>›</em></button>'}).join('')+create;host.classList.add('show')}
`;
 s=s.slice(0,searchStart)+search+s.slice(searchEnd);

 const end=s.lastIndexOf('})();');if(end<0)fail('v873 IIFE end missing');
 const block=String.raw`
/* AXIS 8.12.4 — safe custom search/create/recording profile extension. */
const AXIS8124_CUSTOM_CORE='axis_v60_state',AXIS8124_CUSTOM_METRICS=['weight','reps','duration','intensity','level'];
let axis8124PendingCreate=null,axis8124SelectedCustomId=null;
function axis8124CustomRead(){try{return JSON.parse(localStorage.getItem(AXIS8124_CUSTOM_CORE)||'null')||{}}catch{return{}}}
function axis8124CustomWrite(c){try{localStorage.setItem(AXIS8124_CUSTOM_CORE,JSON.stringify(c));return true}catch{return false}}
function axis8124CustomNorm(v){return String(v||'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,'')}
function axis8124CustomDefinitions(){const c=axis8124CustomRead();return Array.isArray(c.profile?.customEq)?c.profile.customEq:[]}
function axis8124CustomById(id){return axis8124CustomDefinitions().find(x=>x.id===id)||null}
function axis8124CustomMetrics(eq){const a=eq?.recording?.metrics;if(Array.isArray(a)){const clean=[...new Set(a.filter(x=>AXIS8124_CUSTOM_METRICS.includes(x)))];if(clean.length)return clean}return eq?.type==='cardio'?['duration','intensity']:['weight','reps']}
function axis8124MetricSet(metrics){const set=new Set(metrics);$$('#axisCustomMetrics [data-axis-metric]').forEach(b=>b.classList.toggle('active',set.has(b.dataset.axisMetric)))}
function axis8124MetricActive(){return $$('#axisCustomMetrics [data-axis-metric].active').map(b=>b.dataset.axisMetric).filter(Boolean)}
function axis8124MetricDefaults(type){return type==='cardio'?['duration','intensity']:['weight','reps']}
function axis8124MetricPrepare(eq=null){axis8124MetricSet(axis8124CustomMetrics(eq||{type:$('#customType .active')?.dataset.type||'strength'}))}
function axis8124MetricChoose(metric){let set=new Set(axis8124MetricActive()),strength=metric==='weight'||metric==='reps',cardio=!strength;if(strength){set.delete('duration');set.delete('intensity');set.delete('level')}else{set.delete('weight');set.delete('reps');if(metric==='level')set.delete('intensity');if(metric==='intensity')set.delete('level')}set.has(metric)?set.delete(metric):set.add(metric);if(!set.size)set=new Set(strength?['weight','reps']:['duration',metric==='level'?'level':'intensity']);axis8124MetricSet([...set]);const type=[...set].some(x=>x==='weight'||x==='reps')?'strength':'cardio';$$('#customType [data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===type))}
function axis8124ApplyCustomProfile(id){const eq=axis8124CustomById(id);if(!eq?.recording)return;axis8124SelectedCustomId=id;const set=new Set(axis8124CustomMetrics(eq)),strength=set.has('weight')||set.has('reps'),cardio=set.has('duration')||set.has('intensity')||set.has('level');$('#strengthFields')?.classList.toggle('hidden',!strength);$('#cardioFields')?.classList.toggle('hidden',!cardio);$('#weight')?.closest('.numberControl')?.classList.toggle('hidden',!set.has('weight'));$('#repsChoices')?.closest('.choiceControl')?.classList.toggle('hidden',!set.has('reps'));$('#setsChoices')?.closest('.choiceControl')?.classList.toggle('hidden',!strength);$('#duration')?.closest('.numberControl')?.classList.toggle('hidden',!set.has('duration'));const row=$('#intensityChoices')?.closest('.choiceControl');row?.classList.toggle('hidden',!(set.has('intensity')||set.has('level')));const label=row?.querySelector(':scope>span');if(label)label.textContent=set.has('level')&&!set.has('intensity')?'档位':'强度';if(row)row.dataset.axisMetricMode=set.has('level')&&!set.has('intensity')?'level':'intensity'}
function axis8124OpenCustomCreate(query){const q=String(query||'').trim(),existing=axis8124CustomDefinitions().find(x=>axis8124CustomNorm(x.name)===axis8124CustomNorm(q));if(existing){window.__AXIS_PICK_EQUIPMENT__?.(existing.id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.();return}axis8124PendingCreate={query:q};$('#addCustomEq')?.click();setTimeout(()=>{const input=$('#customName');if(input){input.value=q;input.focus();try{input.setSelectionRange(q.length,q.length)}catch{}}axis8124MetricPrepare(null)},0)}
(function axis8124CustomStyle(){if($('#axis8124CustomSafeStyle'))return;const st=D.createElement('style');st.id='axis8124CustomSafeStyle';st.textContent='.axisCustomMetrics{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:8px}.axisCustomMetrics button{height:44px;border-radius:13px;background:var(--s2);color:var(--dim);font-size:12px;font-weight:600}.axisCustomMetrics button.active{background:rgba(115,124,255,.16);color:var(--accent2);box-shadow:inset 0 0 0 1px rgba(115,124,255,.22)}.axisCustomMetricHint{margin:8px 1px 2px;color:var(--dim);font-size:10.5px;line-height:1.45}.v873SmartCreate{width:100%;min-height:58px;margin-top:8px;padding:10px 12px;border-radius:14px;background:rgba(115,124,255,.10);display:flex;align-items:center;justify-content:space-between;text-align:left}.v873SmartCreate b{display:block;color:var(--accent2);font-size:12px}.v873SmartCreate small{display:block;margin-top:4px;color:var(--dim);font-size:10px}.v873SmartCreate em{color:var(--accent2);font-style:normal}@media(max-width:380px){.axisCustomMetrics{gap:7px}.axisCustomMetrics button{height:42px;font-size:11.5px}}';(D.head||D.documentElement).appendChild(st)})();
D.addEventListener('click',e=>{const create=e.target.closest?.('[data-axis-create-custom]');if(create){e.preventDefault();e.stopImmediatePropagation();axis8124OpenCustomCreate(create.dataset.axisCreateCustom||$('#eqSearch')?.value||'');return}const metric=e.target.closest?.('#axisCustomMetrics [data-axis-metric]');if(metric){e.preventDefault();axis8124MetricChoose(metric.dataset.axisMetric);return}const edit=e.target.closest?.('[data-edit-eq]');if(edit)setTimeout(()=>axis8124MetricPrepare(axis8124CustomById(edit.dataset.editEq)),0);if(e.target.closest?.('#newCustomEq'))setTimeout(()=>axis8124MetricPrepare(null),0);const type=e.target.closest?.('#customType [data-type]');if(type)setTimeout(()=>{const active=axis8124MetricActive(),isStrength=active.some(x=>x==='weight'||x==='reps');if(!active.length||(type.dataset.type==='strength'&&!isStrength)||(type.dataset.type==='cardio'&&isStrength))axis8124MetricSet(axis8124MetricDefaults(type.dataset.type))},0)},true);
D.addEventListener('click',e=>{if(!e.target.closest?.('#saveCustomEq'))return;let metrics=axis8124MetricActive();if(!metrics.length){metrics=axis8124MetricDefaults($('#customType .active')?.dataset.type||'strength');axis8124MetricSet(metrics)}const family=metrics.some(x=>x==='weight'||x==='reps')?'strength':'cardio';$$('#customType [data-type]').forEach(b=>b.classList.toggle('active',b.dataset.type===family));const name=$('#customName')?.value?.trim()||'',pending=axis8124PendingCreate;setTimeout(()=>{if($('#customEqSheet')?.classList.contains('show'))return;const c=axis8124CustomRead(),list=c.profile?.customEq||[],item=list.find(x=>axis8124CustomNorm(x.name)===axis8124CustomNorm(name));if(!item)return;item.recording={version:1,metrics:[...new Set(metrics)]};item.custom=true;axis8124CustomWrite(c);window.__AXIS_EQUIPMENT_PICKER_REFRESH__?.();if(pending){axis8124PendingCreate=null;window.__AXIS_PICK_EQUIPMENT__?.(item.id,true);window.__AXIS_EQUIPMENT_SEARCH_RESET__?.()}},0)},true);
window.addEventListener('axis:equipment-selected',e=>{axis8124SelectedCustomId=e.detail?.id||null;axis8124ApplyCustomProfile(axis8124SelectedCustomId)});
D.addEventListener('click',e=>{if(!e.target.closest?.('#saveScan')||!axis8124SelectedCustomId)return;const id=axis8124SelectedCustomId,eq=axis8124CustomById(id);if(!eq?.recording)return;const metrics=axis8124CustomMetrics(eq);setTimeout(()=>{const c=axis8124CustomRead(),events=c.active?.events||[],ev=[...events].reverse().find(x=>x.equipmentId===id);if(!ev)return;ev.recording={version:1,metrics:[...metrics]};if(metrics.includes('level'))ev.level=ev.intensity;axis8124CustomWrite(c)},0)},true);
window.__AXIS_8124_CUSTOM_SAFE__={version:'8.12.4',owner:'v873-additive',allCustomSearchable:true,directNoMatchCreate:true,recordingProfiles:true,metrics:[...AXIS8124_CUSTOM_METRICS],trainingOwner:false};
`;
 s=s.slice(0,end)+block+'\n'+s.slice(end);
 syntax(s,f);write(f,s);
}
console.log('[AXIS 8.12.4 custom equipment safe] PASS · all My items searchable · no-match direct create · weight/reps, time/intensity, time/level profiles · existing training owners preserved');
