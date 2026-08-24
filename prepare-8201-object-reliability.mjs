import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.20.1 object reliability] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/*
 * AXIS 8.20.1 — Executable Object Reliability
 *
 * 8.20 made an explicit Object metricSchema authoritative for Recording, but two
 * inherited ownership gaps remained in real user flow:
 *   1. the custom editor persisted the schema to localStorage after a timer while
 *      app.js continued to hold a stale in-memory Object;
 *   2. the 8.19 Active Truth safety seal allowed only classic weight+reps Events,
 *      so timed/hold executable Objects never entered the polished Active surface.
 *
 * This stage closes those gaps without introducing a new state/store/recorder.
 */

/* --------------------------------------------------------------------------
 * 1. v874 remains the visible Object editor. Persist the full 8.18 metric
 *    vocabulary immediately after the canonical custom save and publish one
 *    authoritative schema-change event for the app state owner to consume.
 * ----------------------------------------------------------------------- */
{
 const FILE='v874-professional.js';let s=read(FILE);
 const old="function axis818MetricPersist(){const c=readCore(),name=$('#customName')?.value.trim()||'';setTimeout(()=>{const cc=readCore(),eq=(cc.profile?.customEq||[]).find(x=>x.id===editId)||(cc.profile?.customEq||[]).filter(x=>x.name===name).at(-1);if(!eq)return;eq.metricSchema=axis818MetricDraft.map(x=>({...x}));eq.metricSchemaVersion='8.18';writeCore(cc);window.dispatchEvent(new CustomEvent('axis:object-schema-changed',{detail:{id:eq.id,schema:eq.metricSchema}}))},90)}";
 const next="function axis818MetricPersist(){const name=$('#customName')?.value.trim()||'',draft=axis818MetricDraft.map(x=>({...x}));queueMicrotask(()=>{const cc=readCore(),eq=(cc.profile?.customEq||[]).find(x=>x.id===editId)||(cc.profile?.customEq||[]).filter(x=>x.name===name).at(-1);if(!eq||!draft.length)return;eq.metricSchema=draft.map(x=>({...x}));eq.metricSchemaVersion='8.20.1';eq.recording=Object.assign({},eq.recording||{},{version:2,metrics:draft.map(x=>x.key)});writeCore(cc);window.dispatchEvent(new CustomEvent('axis:object-schema-changed',{detail:{id:eq.id,schema:eq.metricSchema.map(x=>({...x})),metricSchemaVersion:eq.metricSchemaVersion,recording:eq.recording}}))})}";
 s=once(s,old,next,'live custom metric persistence');
 syntax(s,FILE);write(FILE,s);
}

/* --------------------------------------------------------------------------
 * 2. app.js is still the Object Truth/state owner. Consume the editor event into
 *    the live state before any later save can overwrite the freshly persisted
 *    schema. Re-render the active Recording surface immediately when relevant.
 * ----------------------------------------------------------------------- */
{
 const FILE='app.js';let s=read(FILE);
 const mark="window.__AXIS_OBJECT_TRUTH__={version:'8.18',owner:'app.js',schemaForEq:axis818SchemaForEq,schemaForEvent:axis818SchemaForEvent,eventMetrics:axis818EventMetrics,eventRows:axis818EventRows,explicit:eq=>!!axis818Eq(eq)?.metricSchema?.length};";
 const add=`${mark}\nfunction axis8201ApplyObjectSchemaChange(event){const d=event?.detail||{},eq=(state.profile?.customEq||[]).find(x=>x.id===d.id);if(!eq||!Array.isArray(d.schema)||!d.schema.length)return false;eq.metricSchema=d.schema.map(axis818CloneMetric);eq.metricSchemaVersion=String(d.metricSchemaVersion||'8.20.1');eq.recording=Object.assign({},eq.recording||{},{version:2,metrics:eq.metricSchema.map(x=>x.key)});save();if(state.selectedEq===eq.id){const host=$('#axis818MetricRecorder');if(host)host.dataset.axis818RenderKey='';axis818RenderRecorder()}try{render()}catch{}return true}\nwindow.addEventListener('axis:object-schema-changed',axis8201ApplyObjectSchemaChange);\nwindow.__AXIS_8201_OBJECT_SYNC__={version:'8.20.1',owner:'app.js',liveSchema:true,compatProjection:'recording.metrics-v2',newPersistence:false};`;
 s=once(s,mark,add,'app Object schema live-state bridge');
 syntax(s,FILE);write(FILE,s);
}

/* --------------------------------------------------------------------------
 * 3. v82 owns Active Truth creation. Persistent activity is now determined by
 *    executable semantics instead of the coarse strength/cardio template.
 *    single/complete remain one-shot; sets/rounds/timed/hold become Active.
 * ----------------------------------------------------------------------- */
{
 const FILE='v82-runtime.js';let s=read(FILE);
 const anchor="const pausedEvents=()=>{const m=readMeta(),ss=currentSession();if(!ss)return[];return (ss.events||[]).map(e=>({e,a:m.events?.[e.id]?.activity})).filter(x=>x.a?.status==='paused').sort((x,y)=>(y.a.pausedAt||0)-(x.a.pausedAt||0))};";
 const helper=`${anchor}\n  function axis8201ExecutionMode(e){const explicit=String(e?.executionModeSnapshot||'').trim();if(['single','sets','rounds','timed','hold','complete'].includes(explicit))return explicit;const keys=new Set((Array.isArray(e?.metricSchemaSnapshot)?e.metricSchemaSnapshot:[]).map(m=>m?.key||m?.id).filter(Boolean));if(keys.has('hold'))return'hold';if(keys.has('weight')&&keys.has('reps'))return'sets';if(keys.has('duration'))return'timed';return e?.kind==='cardio'?'timed':'sets'}\n  function axis8201SetExecution(e){return axis8201ExecutionMode(e)==='sets'}\n  function axis8201Ongoing(e){return ['sets','rounds','timed','hold'].includes(axis8201ExecutionMode(e))}\n  function axis8201EstimateForEvent(e,fallback){const mode=axis8201ExecutionMode(e),vals=e?.metrics||{};if(mode==='hold'){const sec=Number(vals.hold??e?.hold);if(Number.isFinite(sec)&&sec>0)return Math.max(1000,sec*1000)}if(mode==='timed'){const min=Number(vals.duration??e?.duration);if(Number.isFinite(min)&&min>0)return Math.max(1000,min*60000)}return Number(fallback)||autoEstimate(e)}`;
 s=once(s,anchor,helper,'v82 execution-mode helpers');
 s=once(s,"if(!a||a.status!=='active'||!e)return;","if(!a||a.status!=='active'||!e||!axis8201SetExecution(e))return;",'v82 set completion authority');
 s=s.replaceAll("e.kind==='strength'","axis8201SetExecution(e)");
 const oldWatch="function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1);startActivity(e,e.kind==='cardio'?(Number(e.duration)||15)*60000:estimateMs);saveArmed=false;estimateAuto=true;estimateMs=null;return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else saveArmed=false}";
 const newWatch="function watchSavedEvent(attempt=0){if(!saveArmed)return;const cur=currentSession()?.events||[],fresh=cur.filter(e=>!knownEvents.has(e.id));if(fresh.length){fresh.forEach(e=>knownEvents.add(e.id));const e=fresh.at(-1);if(axis8201Ongoing(e))startActivity(e,axis8201EstimateForEvent(e,estimateMs));saveArmed=false;estimateAuto=true;estimateMs=null;return}if(attempt<160)setTimeout(()=>watchSavedEvent(attempt+1),75);else saveArmed=false}";
 s=once(s,oldWatch,newWatch,'v82 saved-event executable lifecycle');
 syntax(s,FILE);write(FILE,s);
}

/* --------------------------------------------------------------------------
 * 4. v87 remains the polished Active presentation/action owner. All set-only
 *    UI/actions follow executionMode instead of a coarse strength classification.
 * ----------------------------------------------------------------------- */
{
 const FILE='v87-runtime.js';let s=read(FILE);
 const anchor="function planned(e,m){return Math.max(1,m.events?.[e.id]?.sets?.length||Number(e.sets)||1)}";
 const helper=`${anchor}\nfunction axis8201ExecutionMode(e){const explicit=String(e?.executionModeSnapshot||'').trim();if(['single','sets','rounds','timed','hold','complete'].includes(explicit))return explicit;const keys=new Set((Array.isArray(e?.metricSchemaSnapshot)?e.metricSchemaSnapshot:[]).map(m=>m?.key||m?.id).filter(Boolean));if(keys.has('hold'))return'hold';if(keys.has('weight')&&keys.has('reps'))return'sets';if(keys.has('duration'))return'timed';return e?.kind==='cardio'?'timed':'sets'}\nfunction axis8201SetExecution(e){return axis8201ExecutionMode(e)==='sets'}`;
 s=once(s,anchor,helper,'v87 execution-mode helpers');
 s=s.replaceAll("e?.kind==='strength'","axis8201SetExecution(e)");
 s=s.replaceAll("e.kind==='strength'","axis8201SetExecution(e)");
 syntax(s,FILE);write(FILE,s);
}

/* --------------------------------------------------------------------------
 * 5. Internal enum IDs remain stable; only their picker presentation is localized.
 *    No persisted type values are translated or migrated.
 * ----------------------------------------------------------------------- */
{
 const FILE='v873-smart-input.js';let s=read(FILE),end=s.lastIndexOf('})();');if(end<0)fail('v873 IIFE end missing');
 const block=`\n/* AXIS 8.20.1 — Chinese presentation for stable internal Object type IDs. */\nfunction axis8201LocalType(v){return v==='strength'?'力量':v==='cardio'?'有氧':v}\nfunction axis8201LocalizePickerTypes(){const root=$('#eqSheet');if(!root)return;for(const el of $$('span,small',root)){const t=(el.textContent||'').trim();if(t==='strength'||t==='cardio')el.textContent=axis8201LocalType(t)}}\nD.addEventListener('input',e=>{if(e.target?.id==='eqSearch')queueMicrotask(axis8201LocalizePickerTypes)},true);\nD.addEventListener('click',e=>{if(e.target.closest('#equipmentRow,#quickEquipment,#v8Quick,#v873Quick,#addCustomEq,[data-v8124-pick]'))queueMicrotask(axis8201LocalizePickerTypes)},true);\nwindow.addEventListener('axis:object-schema-changed',()=>queueMicrotask(axis8201LocalizePickerTypes));\nwindow.__AXIS_8201_LOCALIZATION__={version:'8.20.1',internalEnums:true,visibleChinese:true};\n`;
 s=s.slice(0,end)+block+s.slice(end);
 syntax(s,FILE);write(FILE,s);
}

for(const [file,tokens] of [
 ['app.js',['__AXIS_8201_OBJECT_SYNC__','axis8201ApplyObjectSchemaChange']],
 ['v874-professional.js',["metricSchemaVersion='8.20.1'",'queueMicrotask']],
 ['v82-runtime.js',['axis8201Ongoing','axis8201EstimateForEvent']],
 ['v87-runtime.js',['axis8201ExecutionMode','axis8201SetExecution']],
 ['v873-smart-input.js',['__AXIS_8201_LOCALIZATION__','axis8201LocalType']]
]){const s=read(file);for(const t of tokens)if(!s.includes(t))fail(`${file} invariant missing ${t}`)}

console.log('[AXIS 8.20.1 object reliability] PASS · live Object schema sync · executable Active lifecycle · set-only UI authority · localized internal enums · no new persistence/recorder owner');
