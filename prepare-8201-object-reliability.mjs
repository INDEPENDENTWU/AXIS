import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.20.1 object reliability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const onceRe=(src,re,to,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',matches=src.match(new RegExp(re.source,flags))||[];if(matches.length!==1)fail(`${label} expected once, found ${matches.length}`);return src.replace(re,()=>to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* AXIS 8.20.1 — Executable Object Reliability. No new state/store/recorder. */

/* v874 remains the visible Object editor. Persist its complete schema after the
   canonical custom save, then publish one authoritative change event. */
{
 const FILE='v874-professional.js';let s=read(FILE);
 const old="function axis818MetricPersist(){const c=readCore(),name=$('#customName')?.value.trim()||'';setTimeout(()=>{const cc=readCore(),eq=(cc.profile?.customEq||[]).find(x=>x.id===editId)||(cc.profile?.customEq||[]).filter(x=>x.name===name).at(-1);if(!eq)return;eq.metricSchema=axis818MetricDraft.map(x=>({...x}));eq.metricSchemaVersion='8.18';writeCore(cc);window.dispatchEvent(new CustomEvent('axis:object-schema-changed',{detail:{id:eq.id,schema:eq.metricSchema}}))},90)}";
 const next="function axis818MetricPersist(){const name=$('#customName')?.value.trim()||'',draft=axis818MetricDraft.map(x=>({...x}));queueMicrotask(()=>{const cc=readCore(),eq=(cc.profile?.customEq||[]).find(x=>x.id===editId)||(cc.profile?.customEq||[]).filter(x=>x.name===name).at(-1);if(!eq||!draft.length)return;eq.metricSchema=draft.map(x=>({...x}));eq.metricSchemaVersion='8.20.1';eq.recording=Object.assign({},eq.recording||{},{version:2,metrics:draft.map(x=>x.key)});writeCore(cc);window.dispatchEvent(new CustomEvent('axis:object-schema-changed',{detail:{id:eq.id,schema:eq.metricSchema.map(x=>({...x})),metricSchemaVersion:eq.metricSchemaVersion,recording:eq.recording}}))})}";
 s=once(s,old,next,'live custom metric persistence');
 syntax(s,FILE);write(FILE,s);
}

/* app.js remains Object Truth/state owner. Consume editor schema into live state
   immediately. The derived shelf changes presentation only. */
{
 const FILE='app.js';let s=read(FILE);
 const truthRe=/window\.__AXIS_OBJECT_TRUTH__=\{[^\n]*\};/;
 const truth=(s.match(truthRe)||[])[0];if(!truth)fail('app Object Truth structural export missing');
 const add=`${truth}\nfunction axis8201ApplyObjectSchemaChange(event){const d=event?.detail||{},eq=(state.profile?.customEq||[]).find(x=>x.id===d.id);if(!eq||!Array.isArray(d.schema)||!d.schema.length)return false;eq.metricSchema=d.schema.map(axis818CloneMetric);eq.metricSchemaVersion=String(d.metricSchemaVersion||'8.20.1');eq.recording=Object.assign({},eq.recording||{},{version:2,metrics:eq.metricSchema.map(x=>x.key)});save();if(state.selectedEq===eq.id){const host=$('#axis818MetricRecorder');if(host)host.dataset.axis818RenderKey='';axis818RenderRecorder()}try{render()}catch{}return true}\nwindow.addEventListener('axis:object-schema-changed',axis8201ApplyObjectSchemaChange);\nwindow.__AXIS_8201_OBJECT_SYNC__={version:'8.20.1',owner:'app.js',liveSchema:true,compatProjection:'recording.metrics-v2',newPersistence:false};`;
 s=onceRe(s,truthRe,add,'app Object schema live-state bridge');
 s=once(s,'Evolution Library','训练项目','Evolution shelf Chinese title');
 s=once(s,"+' 个对象</b>","+' 个项目</b>",'Evolution shelf Chinese count noun');
 syntax(s,FILE);write(FILE,s);
}

/* v82 remains Active Truth creation owner. Define executable semantics and change
   only event admission/estimate here. Historical presentation sentinels stay
   untouched until all inherited postbuild contracts have passed. */
{
 const FILE='v82-runtime.js';let s=read(FILE);
 const anchor="const pausedEvents=()=>{const m=readMeta(),ss=currentSession();if(!ss)return[];return (ss.events||[]).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a?.status==='paused').sort((x,y)=>(y.a.pausedAt||0)-(x.a.pausedAt||0))};";
 const helper=`${anchor}\n  function axis8201ExecutionMode(e){const explicit=String(e?.executionModeSnapshot||'').trim();if(['single','sets','rounds','timed','hold','complete'].includes(explicit))return explicit;const keys=new Set((Array.isArray(e?.metricSchemaSnapshot)?e.metricSchemaSnapshot:[]).map(m=>m?.key||m?.id).filter(Boolean));if(keys.has('hold'))return'hold';if(keys.has('weight')&&keys.has('reps'))return'sets';if(keys.has('duration'))return'timed';return e?.kind==='cardio'?'timed':'sets'}\n  function axis8201SetExecution(e){return axis8201ExecutionMode(e)==='sets'}\n  function axis8201Ongoing(e){return ['sets','rounds','timed','hold'].includes(axis8201ExecutionMode(e))}\n  function axis8201EstimateForEvent(e,fallback){const mode=axis8201ExecutionMode(e),vals=e?.metrics||{};if(mode==='hold'){const sec=Number(vals.hold??e?.hold);if(Number.isFinite(sec)&&sec>0)return Math.max(1000,sec*1000)}if(mode==='timed'){const min=Number(vals.duration??e?.duration);if(Number.isFinite(min)&&min>0)return Math.max(1000,min*60000)}return Number(fallback)||autoEstimate(e)}`;
 s=once(s,anchor,helper,'v82 execution-mode helpers');
 s=once(s,"if(!a||a.status!=='active'||!e)return;","if(!a||a.status!=='active'||!e||!axis8201SetExecution(e))return;",'v82 set completion authority');
 const oldWatch="function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1);startActivity(e,e.kind==='cardio'?(Number(e.duration)||15)*60000:estimateMs);saveArmed=false;estimateAuto=true;estimateMs=null;return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else saveArmed=false}";
 const newWatch="function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1);if(axis8201Ongoing(e))startActivity(e,axis8201EstimateForEvent(e,estimateMs));saveArmed=false;estimateAuto=true;estimateMs=null;return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else saveArmed=false}";
 s=once(s,oldWatch,newWatch,'v82 saved-event executable lifecycle');
 syntax(s,FILE);write(FILE,s);
}

/* v87 remains polished Active presentation/action owner. Only install helpers at
   source stage; final set-only presentation supersede is postbuild so inherited
   contracts can verify their original historical sentinels first. */
{
 const FILE='v87-runtime.js';let s=read(FILE);
 const anchor="function planned(e,m){return Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1)}";
 const helper=`${anchor}\nfunction axis8201ExecutionMode(e){const explicit=String(e?.executionModeSnapshot||'').trim();if(['single','sets','rounds','timed','hold','complete'].includes(explicit))return explicit;const keys=new Set((Array.isArray(e?.metricSchemaSnapshot)?e.metricSchemaSnapshot:[]).map(m=>m?.key||m?.id).filter(Boolean));if(keys.has('hold'))return'hold';if(keys.has('weight')&&keys.has('reps'))return'sets';if(keys.has('duration'))return'timed';return e?.kind==='cardio'?'timed':'sets'}\nfunction axis8201SetExecution(e){return axis8201ExecutionMode(e)==='sets'}`;
 s=once(s,anchor,helper,'v87 execution-mode helpers');
 syntax(s,FILE);write(FILE,s);
}

/* Stable internal enum IDs remain untouched. Localize only picker presentation;
   observer is scoped to the existing picker and owns no data. */
{
 const FILE='v873-smart-input.js';let s=read(FILE),end=s.lastIndexOf('})();');if(end<0)fail('v873 IIFE end missing');
 const block=`\n/* AXIS 8.20.1 — Chinese presentation for stable internal Object type IDs. */\nfunction axis8201LocalType(v){return v==='strength'?'力量':v==='cardio'?'有氧':v==='relative'?'自重':v}\nfunction axis8201LocalizePickerTypes(){const root=$('#eqSheet');if(!root)return;for(const el of $$('span,small',root)){const t=(el.textContent||'').trim();if(t==='strength'||t==='cardio'||t==='relative')el.textContent=axis8201LocalType(t)}}\nfunction axis8201WatchPickerTypes(){const root=$('#eqSheet');if(!root||root.dataset.axis8201LocaleWatch)return;root.dataset.axis8201LocaleWatch='1';new MutationObserver(()=>queueMicrotask(axis8201LocalizePickerTypes)).observe(root,{subtree:true,childList:true,characterData:true});axis8201LocalizePickerTypes()}\nD.addEventListener('input',e=>{if(e.target?.id==='eqSearch')queueMicrotask(axis8201LocalizePickerTypes)},true);\nD.addEventListener('click',e=>{if(e.target.closest('#equipmentRow,#quickEquipment,#v8Quick,#v873Quick,#addCustomEq,[data-v8124-pick]'))queueMicrotask(()=>{axis8201WatchPickerTypes();axis8201LocalizePickerTypes()})},true);\nwindow.addEventListener('axis:object-schema-changed',()=>queueMicrotask(axis8201LocalizePickerTypes));\naxis8201WatchPickerTypes();\nwindow.__AXIS_8201_LOCALIZATION__={version:'8.20.1',internalEnums:true,visibleChinese:true,evolutionShelf:true};\n`;
 s=s.slice(0,end)+block+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

for(const [file,tokens] of [
 ['app.js',['__AXIS_8201_OBJECT_SYNC__','axis8201ApplyObjectSchemaChange','训练项目','个项目']],
 ['v874-professional.js',["metricSchemaVersion='8.20.1'",'queueMicrotask']],
 ['v82-runtime.js',['axis8201Ongoing','axis8201EstimateForEvent']],
 ['v87-runtime.js',['axis8201ExecutionMode','axis8201SetExecution']],
 ['v873-smart-input.js',['__AXIS_8201_LOCALIZATION__','axis8201LocalType','axis8201WatchPickerTypes']]
]){const s=read(file);for(const t of tokens)if(!s.includes(t))fail(`${file} invariant missing ${t}`)}

console.log('[AXIS 8.20.1 object reliability] PASS · live Object schema sync · executable Active admission · postbuild presentation supersede staged · Chinese picker/Evolution presentation · no new persistence/recorder owner');
