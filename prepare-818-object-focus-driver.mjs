import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const SOURCE='prepare-818-object-focus-foundation.mjs',TMP='.axis-818-object-focus.generated.mjs';
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
 * AXIS 8.19 — connect the already-shipped Object Truth to its existing owners.
 *
 * Do not create a second runtime/store/writer. The 8.18 compiler already provides
 * axis818Eq(), axis818RenderRecorder() and axis818CaptureEvent(). Lifecycle stays
 * inside the canonical app owner functions so build hardening/canonicalization
 * carry it forward as normal source. The recorder must use the Object Truth
 * resolver, not the older base-only eqById(), otherwise custom Objects disappear
 * after a successful picker selection.
 */
{
 let app=fs.readFileSync('app.js','utf8');
 const replaceRange=(re,mutate,label)=>{
  const matches=[...app.matchAll(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))];
  if(matches.length!==1)throw new Error(`[AXIS 8.19 recording owner] ${label} expected once, found ${matches.length}`);
  const before=matches[0][0],after=mutate(before);
  if(!after||after===before)throw new Error(`[AXIS 8.19 recording owner] ${label} mutation did not change source`);
  app=app.slice(0,matches[0].index)+after+app.slice(matches[0].index+before.length);
 };
 replaceRange(
  /function selectEq\([^)]*\)\{[\s\S]*?\}(?=\nfunction renderEqList)/,
  fn=>fn.slice(0,-1)+";$('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');$('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');axis818RenderRecorder()}",
  'selectEq lifecycle'
 );
 replaceRange(
  /function resetScan\([^)]*\)\{[\s\S]*?\}(?=\nfunction setVal)/,
  fn=>fn.slice(0,-1)+";$('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');$('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');const axis819Recorder=$('#axis818MetricRecorder');if(axis819Recorder){axis819Recorder.classList.remove('show');axis819Recorder.innerHTML=''}}",
  'resetScan lifecycle'
 );
 replaceRange(
  /function axis818RenderRecorder\([^)]*\)\{[\s\S]*?\}(?=\nfunction axis818CaptureEvent)/,
  fn=>{const from='const eq=eqById(state.selectedEq);',to='const eq=axis818Eq(state.selectedEq);';if(fn.split(from).length-1!==1)throw new Error('[AXIS 8.19 recording owner] recorder resolver contract changed');return fn.replace(from,to)},
  'Object Truth recorder resolver'
 );
 replaceRange(
  /function axis818CaptureEvent\([^)]*\)\{[\s\S]*?\}(?=\nwindow\.__AXIS_OBJECT_TRUTH__)/,
  fn=>{const token='return e}';if(fn.split(token).length-1!==1)throw new Error('[AXIS 8.19 recording owner] axis818CaptureEvent return contract changed');return fn.replace(token,"if(Array.isArray(eq?.metricSchema)&&eq.metricSchema.length){const axis819Keys=new Set(schema.map(m=>m.key));for(const k of ['weight','reps','sets','duration','intensity'])if(!axis819Keys.has(k))delete e[k]}return e}")},
  'Encounter truth cleanup'
 );
 try{new Function(app)}catch(e){throw new Error(`[AXIS 8.19 recording owner] app syntax ${e.message}`)}
 fs.writeFileSync('app.js',app);
}

/*
 * v61 remains the sole high-frequency repeated-set owner, but only for the
 * semantic shape it actually owns. Selection identity/type remains untouched.
 * The guard lives at v61 prepare/save boundaries: non-classic explicit schemas
 * never create a set draft and never attach an axis_v8_meta event fact.
 */
{
 let v61=fs.readFileSync('v61.js','utf8');
 const replaceRange=(re,mutate,label)=>{
  const matches=[...v61.matchAll(new RegExp(re.source,re.flags.includes('g')?re.flags:re.flags+'g'))];
  if(matches.length!==1)throw new Error(`[AXIS 8.19 v61 authority] ${label} expected once, found ${matches.length}`);
  const before=matches[0][0],after=mutate(before);
  if(!after||after===before)throw new Error(`[AXIS 8.19 v61 authority] ${label} mutation did not change source`);
  v61=v61.slice(0,matches[0].index)+after+v61.slice(matches[0].index+before.length);
 };
 replaceRange(
  /function selected\(\)\{[\s\S]*?\}(?=\nfunction syncDock)/,
  fn=>fn+"\nfunction axis819ClassicStrengthOwner(e){if(!e?.id)return true;const c=core(),ce=(c.profile?.customEq||[]).find(x=>x.id===e.id||x.name===e.name);if(!ce||!Array.isArray(ce.metricSchema)||!ce.metricSchema.length)return true;const keys=new Set(ce.metricSchema.map(m=>m?.key).filter(Boolean));return keys.has('weight')&&keys.has('reps')}",
  'classic strength ownership helper'
 );
 replaceRange(
  /function prepare\(id\)\{[\s\S]*?\}(?=\nfunction deltaText)/,
  fn=>{const from='function prepare(id){';if(fn.split(from).length-1!==1)throw new Error('[AXIS 8.19 v61 authority] prepare entry contract changed');return fn.replace(from,from+"const axis819Selected=selected();if(axis819Selected&&!axis819ClassicStrengthOwner(axis819Selected)){draft=[];hideSets();return}")},
  'non-classic prepare bypass'
 );
 replaceRange(
  /function onSaveClick\([^)]*\)\{[\s\S]*?\}(?=\nfunction attach)/,
  fn=>{const from="const e=selected();if(!e)return;";if(fn.split(from).length-1!==1)throw new Error('[AXIS 8.19 v61 authority] save entry contract changed');return fn.replace(from,from+"if(e.type==='strength'&&!axis819ClassicStrengthOwner(e)){pending=null;deferOnce=false;hideSets();return}")},
  'non-classic save bypass'
 );
 try{new Function(v61)}catch(e){throw new Error(`[AXIS 8.19 v61 authority] v61 syntax ${e.message}`)}
 fs.writeFileSync('v61.js',v61);
}

console.log('[AXIS 8.18 driver] PASS · v87 canonical render signature preserved · Focus mirrors presentation only · runtime owner initialization sealed · final truth hardening + WebKit-safe media seal + field capture polish + track-aware camera readiness + single-owner detail routing + physical Settings + inherited Capture flow seals applied · 8.19 Object Truth recording lifecycle anchored in existing app owners · custom recorder resolves through axis818Eq · v61 isolated at stable prepare/save boundaries without mutating Object selection');
