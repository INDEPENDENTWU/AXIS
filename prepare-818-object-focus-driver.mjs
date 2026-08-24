import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-818-object-focus-foundation.mjs',TMP='.axis-818-object-focus.generated.mjs';
const replaceOnce=(src,from,to,label)=>{const n=src.split(from).length-1;if(n!==1)throw new Error(`[AXIS 8.19 recording bridge] ${label} expected once, found ${n}`);return src.replace(from,to)};

let src=fs.readFileSync(SOURCE,'utf8');
const brittle=` s=s.replace("host.classList.add('show');D.body.classList.add('v87-now')}","host.classList.add('show');D.body.classList.add('v87-now');axis818FocusSync()}");\n`;
const n=src.split(brittle).length-1;if(n!==1)throw new Error(`[AXIS 8.18 driver] v87 render-tail mutation expected once, found ${n}`);
src=src.replace(brittle,'');
const marker="window.__AXIS_818_FOCUS__={version:'8.18',owner:'presentation-only',open:axis818FocusOpen,close:axis818FocusClose,completionOwner:'v87-direct-884',automatic:false};";
const replacement="setInterval(axis818FocusSync,250);\n"+marker;
const m=src.split(marker).length-1;if(m!==1)throw new Error(`[AXIS 8.18 driver] Focus marker expected once, found ${m}`);
src=src.replace(marker,replacement);
fs.writeFileSync(TMP,src);
try{execFileSync(process.execPath,[TMP],{stdio:'inherit'})}finally{try{fs.unlinkSync(TMP)}catch{}}
await import('./prepare-818-foundation-hardening.mjs');
await import('./prepare-818-runtime-crash-seal.mjs');
await import('./prepare-818-media-store-seal.mjs');
await import('./prepare-818-field-polish.mjs');
await import('./prepare-818-scan-owner-seal.mjs');
await import('./prepare-818-field-scope-seal.mjs');
await import('./prepare-818-final-field-seal.mjs');
await import('./prepare-818-camera-readiness-seal.mjs');
await import('./prepare-818-detail-atomic-seal.mjs');
await import('./prepare-818-final-smoke-seal.mjs');
await import('./prepare-818-inherited-test-flow-seal.mjs');

/*
 * AXIS 8.19 product bridge.
 *
 * 8.18 already owns the visible metric editor and Encounter snapshot logic. The
 * missing link was lifecycle: selecting an Object never rendered that schema's
 * recorder. Keep persistence and writers where they already live; only connect
 * the existing Object Truth to the existing recording surface and prevent
 * irrelevant legacy defaults from becoming facts on schema-driven Encounters.
 *
 * This deliberately lives at the current 8.18 driver handoff instead of adding
 * another prepare-819-* transform. Source Convergence can later move the bridge
 * into the direct app owner without changing data semantics.
 */
{
 let app=fs.readFileSync('app.js','utf8');
 app=replaceOnce(
  app,
  "applyEqDefaults(e,last);if(manual)setText('#aiStatus','已确认')}\nfunction renderEqList",
  "applyEqDefaults(e,last);$('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');$('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');axis818RenderRecorder();if(manual)setText('#aiStatus','已确认')}\nfunction renderEqList",
  'Object selection → schema recorder lifecycle'
 );
 app=replaceOnce(
  app,
  "$('#strengthFields').classList.add('hidden');$('#cardioFields').classList.add('hidden');$('#lastValue').classList.add('hidden')}\nfunction setVal",
  "$('#strengthFields').classList.add('hidden');$('#cardioFields').classList.add('hidden');$('#lastValue').classList.add('hidden');$('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');$('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');const axis819Recorder=$('#axis818MetricRecorder');if(axis819Recorder){axis819Recorder.classList.remove('show');axis819Recorder.innerHTML=''}}\nfunction setVal",
  'recording reset clears schema recorder state'
 );
 app=replaceOnce(
  app,
  "function axis818CaptureEvent(e,eq){const schema=axis818SchemaForEq(eq),vals=axis818ReadMetricInputs(schema);e.metricSchemaSnapshot=schema.map(axis818CloneMetric);e.metrics=vals;axis818ApplyLegacy(e,vals);e.objectTruthVersion='8.18';return e}",
  "function axis818CaptureEvent(e,eq){const schema=axis818SchemaForEq(eq),vals=axis818ReadMetricInputs(schema),keys=new Set(schema.map(m=>m.key));if(Array.isArray(eq?.metricSchema)&&eq.metricSchema.length)for(const k of ['weight','reps','sets','duration','intensity'])if(!keys.has(k))delete e[k];e.metricSchemaSnapshot=schema.map(axis818CloneMetric);e.metrics=vals;axis818ApplyLegacy(e,vals);e.objectTruthVersion='8.18';return e}",
  'schema-driven Encounter removes irrelevant legacy defaults'
 );
 try{new Function(app)}catch(e){throw new Error(`[AXIS 8.19 recording bridge] app syntax ${e.message}`)}
 fs.writeFileSync('app.js',app);
}

console.log('[AXIS 8.18 driver] PASS · v87 canonical render signature preserved · Focus mirrors presentation only · runtime owner initialization sealed · final truth hardening + WebKit-safe media seal + field capture polish + track-aware camera readiness + single-owner detail routing + physical Settings + inherited Capture flow seals applied · 8.19 Object Truth → Recording lifecycle bridge applied');
