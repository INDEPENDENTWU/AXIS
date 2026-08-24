import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.20 executable practice objects] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

/* --------------------------------------------------------------------------
 * Object execution is separate from metric measurement. The existing 8.18
 * metric schema remains the historical schema owner; 8.20 adds a derived or
 * explicitly persisted execution contract without introducing another store.
 * Quick Record may ask app.js to enter its existing schema-recorder lifecycle,
 * but app.js remains the only schema-recorder writer.
 * ----------------------------------------------------------------------- */
{
 const FILE='app.js';let s=read(FILE);
 const exportToken='window.__AXIS_OBJECT_TRUTH__=';
 const bridge=String.raw`
function axis820ExecutionModeForEq(ref){const eq=axis818Eq(ref);if(!eq)return'single';const explicit=String(eq.executionMode||'').trim();if(['single','sets','rounds','timed','hold','complete'].includes(explicit))return explicit;const keys=new Set(axis818SchemaForEq(eq).map(x=>x.key));if(keys.has('hold'))return'hold';if(keys.has('weight')&&keys.has('reps'))return'sets';if(keys.has('duration'))return'timed';return'single'}
function axis820BeginQuickRecorder(ref){const eq=axis818Eq(ref);if(!eq||!Array.isArray(eq.metricSchema)||!eq.metricSchema.length)return false;axis819RecorderSuppressed=false;const host=$('#axis818MetricRecorder');if(host){host.dataset.axis818RenderSuppressed='';host.dataset.axis818RenderKey=''}axis818RenderRecorder();return !!$('#axis818MetricRecorder')?.classList.contains('show')}
window.__AXIS_EXECUTABLE_OBJECTS__={version:'8.20',owner:'app.js+ObjectTruth',modeForEq:axis820ExecutionModeForEq,schemaForEq:axis818SchemaForEq,explicit:eq=>!!axis818Eq(eq)?.metricSchema?.length,beginQuickRecorder:axis820BeginQuickRecorder,persistence:'existing-object-only'};
`;
 const exports=s.split(exportToken).length-1;
 if(exports!==1)fail(`Object Truth export anchor expected once, found ${exports}`);
 s=s.replace(exportToken,bridge+exportToken);
 const captureMarker="e.objectTruthVersion='8.18';";
 const captureHits=s.split(captureMarker).length-1;
 if(captureHits!==1)fail(`Encounter execution snapshot marker expected once, found ${captureHits}`);
 s=s.replace(captureMarker,captureMarker+"e.executionModeSnapshot=axis820ExecutionModeForEq(eq);e.executableObjectVersion='8.20';");
 syntax(s,FILE);write(FILE,s);
}

/* --------------------------------------------------------------------------
 * v61 still owns the Quick Record shell and classic repeated-set controls. For
 * an explicit non-classic Object it delegates recorder presentation to app.js,
 * then gets out of the save path so app.js remains the sole Encounter writer.
 * ----------------------------------------------------------------------- */
{
 const FILE='v61.js';let s=read(FILE);
 const replaceRange=(re,mutate,label)=>{
  const matches=[...s.matchAll(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))];
  if(matches.length!==1)fail(`${label} expected once, found ${matches.length}`);
  const before=matches[0][0],after=mutate(before);
  if(!after||after===before)fail(`${label} mutation did not change source`);
  s=s.slice(0,matches[0].index)+after+s.slice(matches[0].index+before.length);
 };
 const anchor='function syncDock(){';
 if(!s.includes(anchor))fail('v61 syncDock anchor missing');
 const bridge=String.raw`
function axis820Schema(e){const t=window.__AXIS_OBJECT_TRUTH__;if(!e?.id||!t?.explicit?.(e.id))return null;const xs=t.schemaForEq?.(e.id);return Array.isArray(xs)&&xs.length?xs:null}
function axis820Mode(e){return window.__AXIS_EXECUTABLE_OBJECTS__?.modeForEq?.(e?.id)||'single'}
function axis820ClassicOwner(e,schema=axis820Schema(e)){if(!schema)return false;const keys=schema.map(x=>x?.key).filter(k=>k&&k!=='sets');return axis820Mode(e)==='sets'&&keys.length===2&&keys.includes('weight')&&keys.includes('reps')}
function axis820UseSchemaRecorder(e){const schema=axis820Schema(e),host=$('#axis818MetricRecorder');if(!schema){if(host)host.dataset.axis820Quick='';return false}if(axis820ClassicOwner(e,schema)){host?.classList.remove('show');if(host)host.dataset.axis820Quick='';return false}$('#strengthFields')?.classList.add('axis818LegacyMetricHidden');$('#cardioFields')?.classList.add('axis818LegacyMetricHidden');$('#v8Sets')?.classList.add('hidden');const began=window.__AXIS_EXECUTABLE_OBJECTS__?.beginQuickRecorder?.(e.id)===true;const rendered=$('#axis818MetricRecorder');if(began&&rendered)rendered.dataset.axis820Quick='1';return began}
`;
 s=s.replace(anchor,bridge+anchor);
 replaceRange(
  /function showQuickEditor\(id\)\{[\s\S]*?\}(?=\nfunction prepare)/,
  fn=>{const token='const e=selected();';const hits=fn.split(token).length-1;if(hits!==1)fail(`Quick editor selected boundary expected once, found ${hits}`);return fn.replace(token,token+"if(axis820UseSchemaRecorder(e)){hideSets();syncDock();return}")},
  'Quick editor presentation ownership'
 );
 replaceRange(
  /function onSaveClick\([^)]*\)\{[\s\S]*?\}(?=\nfunction attach)/,
  fn=>{const token='const e=selected();if(!e)return;';const hits=fn.split(token).length-1;if(hits!==1)fail(`Quick Record save selected boundary expected once, found ${hits}`);const guard="const axis820QuickSchema=axis820Schema(e);if(axis820QuickSchema&&!axis820ClassicOwner(e,axis820QuickSchema)){pending=null;deferOnce=false;if(!core().active){$('#startBtn')?.click();$('#toast')?.classList.remove('show')}pulseSaving();return}";return fn.replace(token,token+guard)},
  'Quick Record save ownership'
 );
 syntax(s,FILE);write(FILE,s);
}

console.log('[AXIS 8.20 executable practice objects] PASS · explicit Object Truth drives Quick Record through app-owned recorder · execution mode separated from metrics · immutable Encounter execution/schema snapshot · legacy strength fallback preserved');
