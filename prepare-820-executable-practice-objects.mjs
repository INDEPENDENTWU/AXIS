import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.20 executable practice objects] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const once=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(from,to)};
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* --------------------------------------------------------------------------
 * Object execution is separate from metric measurement. The existing 8.18
 * metric schema remains the historical schema owner; 8.20 adds a derived or
 * explicitly persisted execution contract without introducing another store.
 * ----------------------------------------------------------------------- */
{
 const FILE='app.js';let s=read(FILE);
 const exportToken='window.__AXIS_OBJECT_TRUTH__=';
 const bridge=String.raw`
function axis820ExecutionModeForEq(ref){const eq=axis818Eq(ref);if(!eq)return'single';const explicit=String(eq.executionMode||'').trim();if(['single','sets','rounds','timed','hold','complete'].includes(explicit))return explicit;const keys=new Set(axis818SchemaForEq(eq).map(x=>x.key));if(keys.has('hold'))return'hold';if(keys.has('weight')&&keys.has('reps'))return'sets';if(keys.has('duration'))return'timed';return'single'}
window.__AXIS_EXECUTABLE_OBJECTS__={version:'8.20',owner:'app.js+ObjectTruth',modeForEq:axis820ExecutionModeForEq,schemaForEq:axis818SchemaForEq,explicit:eq=>!!axis818Eq(eq)?.metricSchema?.length,persistence:'existing-object-only'};
`;
 const exports=s.split(exportToken).length-1;
 if(exports!==1)fail(`Object Truth export anchor expected once, found ${exports}`);
 s=s.replace(exportToken,bridge+exportToken);
 const captureFrom="function axis818CaptureEvent(e,eq){const schema=axis818SchemaForEq(eq),vals=axis818ReadMetricInputs(schema);e.metricSchemaSnapshot=schema.map(axis818CloneMetric);e.metrics=vals;axis818ApplyLegacy(e,vals);e.objectTruthVersion='8.18';return e}";
 const captureTo="function axis818CaptureEvent(e,eq){const schema=axis818SchemaForEq(eq),vals=axis818ReadMetricInputs(schema);e.metricSchemaSnapshot=schema.map(axis818CloneMetric);e.metrics=vals;axis818ApplyLegacy(e,vals);e.objectTruthVersion='8.18';e.executionModeSnapshot=axis820ExecutionModeForEq(eq);e.executableObjectVersion='8.20';return e}";
 s=once(s,captureFrom,captureTo,'Encounter execution snapshot');
 syntax(s,FILE);write(FILE,s);
}

/* --------------------------------------------------------------------------
 * v61 owns Quick Record presentation. Before 8.20 it still branched only on
 * `type === strength`, so an explicit duration/intensity object was rendered as
 * weight/reps/sets. Explicit Object Truth now owns Quick Record presentation;
 * classic v61 controls remain only for legacy objects or an explicit classic
 * weight+reps object whose execution mode is sets.
 * ----------------------------------------------------------------------- */
{
 const FILE='v61.js';let s=read(FILE);
 const anchor='function syncDock(){';
 if(!s.includes(anchor))fail('v61 syncDock anchor missing');
 const bridge=String.raw`
function axis820Schema(e){const t=window.__AXIS_OBJECT_TRUTH__;if(!e?.id||!t?.explicit?.(e.id))return null;const xs=t.schemaForEq?.(e.id);return Array.isArray(xs)&&xs.length?xs:null}
function axis820Mode(e){return window.__AXIS_EXECUTABLE_OBJECTS__?.modeForEq?.(e?.id)||'single'}
function axis820ClassicOwner(e,schema=axis820Schema(e)){if(!schema)return false;const keys=schema.map(x=>x?.key).filter(k=>k&&k!=='sets');return axis820Mode(e)==='sets'&&keys.length===2&&keys.includes('weight')&&keys.includes('reps')}
function axis820UseSchemaRecorder(e){const schema=axis820Schema(e);if(!schema)return false;if(axis820ClassicOwner(e,schema)){const host=$('#axis818MetricRecorder');host?.classList.remove('show');if(host)host.innerHTML='';return false}let host=$('#axis818MetricRecorder');if(!host){host=D.createElement('div');host.id='axis818MetricRecorder';host.className='axis818MetricRecorder';const save=$('#saveScan');save?.parentNode?.insertBefore(host,save)}if(!host)return false;$('#strengthFields')?.classList.add('axis818LegacyMetricHidden');$('#cardioFields')?.classList.add('axis818LegacyMetricHidden');$('#v8Sets')?.classList.add('hidden');host.classList.add('show');host.dataset.axis820Quick='1';host.innerHTML='<div class="axis818MetricHead"><span>本次记录</span><b>'+esc(e.name)+'</b></div>'+schema.filter(m=>m?.key&&m.key!=='sets').map(m=>'<label class="axis818MetricField"><span>'+esc(m.label||m.key)+'</span><div><input data-axis818-metric="'+esc(m.key)+'" '+(m.type==='text'?'':'inputmode="decimal"')+' placeholder="—"><small>'+esc(m.unit||'')+'</small></div></label>').join('');const prev=last(e.id,editingId),vals=prev?(window.__AXIS_OBJECT_TRUTH__?.eventMetrics?.(prev)||{}):{};for(const m of schema){if(m?.key==='sets')continue;const el=$('[data-axis818-metric="'+m.key+'"]');if(el&&vals[m.key]!=null)el.value=String(vals[m.key])}return true}
`;
 s=s.replace(anchor,bridge+anchor);
 const renderNeedle="if(e?.type==='strength')prepare(e.id);else hideSets()";
 const renderHits=s.split(renderNeedle).length-1;
 if(renderHits!==2)fail(`Quick editor render ownership expected twice, found ${renderHits}`);
 s=s.replaceAll(renderNeedle,"if(axis820UseSchemaRecorder(e))hideSets();else if(e?.type==='strength')prepare(e.id);else hideSets()");
 const saveFrom="function onSaveClick(ev){const e=selected();if(!e)return;if(editingId){";
 const saveTo="function onSaveClick(ev){const e=selected();if(!e)return;if(axis820UseSchemaRecorder(e)){pending=null;deferOnce=false;if(!core().active){$('#startBtn')?.click();$('#toast')?.classList.remove('show')}pulseSaving();return}if(editingId){";
 s=once(s,saveFrom,saveTo,'Quick Record save ownership');
 syntax(s,FILE);write(FILE,s);
}

console.log('[AXIS 8.20 executable practice objects] PASS · explicit Object Truth drives Quick Record · execution mode separated from metrics · immutable Encounter execution/schema snapshot · legacy strength fallback preserved');
