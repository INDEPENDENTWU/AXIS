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
 * AXIS 8.19 product bridge.
 *
 * 8.18 already owns the visible metric editor, canonical save path and Encounter
 * snapshot. The missing link is lifecycle: selecting an Object did not invoke
 * its schema recorder. Delegate to the existing functions instead of rewriting
 * their historical source shape, keep persistence/writers unchanged, and remove
 * only irrelevant defaults from newly-created explicit-schema Encounters.
 *
 * This is inserted into the existing canonical app IIFE and intentionally does
 * not add another prepare-819-* transform or another runtime/store owner.
 */
{
 let app=fs.readFileSync('app.js','utf8');
 const end=app.lastIndexOf('})();');if(end<0)throw new Error('[AXIS 8.19 recording bridge] canonical app IIFE end missing');
 const bridge=String.raw`
/* AXIS 8.19 — Universal Practice Object recording bridge. */
const axis819SelectEqBase=selectEq;
selectEq=function(id,manual=true){
 const out=axis819SelectEqBase(id,manual);
 $('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');
 $('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');
 axis818RenderRecorder();
 return out
};
const axis819ResetScanBase=resetScan;
resetScan=function(){
 const out=axis819ResetScanBase();
 $('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');
 $('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');
 const host=$('#axis818MetricRecorder');if(host){host.classList.remove('show');host.innerHTML=''}
 return out
};
const axis819CaptureEventBase=axis818CaptureEvent;
axis818CaptureEvent=function(e,eq){
 const out=axis819CaptureEventBase(e,eq);
 if(Array.isArray(eq?.metricSchema)&&eq.metricSchema.length){
  const keys=new Set(axis818SchemaForEq(eq).map(m=>m.key));
  for(const k of ['weight','reps','sets','duration','intensity'])if(!keys.has(k))delete out[k]
 }
 return out
};
window.__AXIS_819_RECORDING_BRIDGE__={version:'8.19-foundation',owner:'compatibility-delegation',persistence:false,selectOwner:'app.js',saveOwner:'app.js',classicStrengthOwner:'v61'};
`;
 app=app.slice(0,end)+bridge+'\n'+app.slice(end);
 try{new Function(app)}catch(e){throw new Error(`[AXIS 8.19 recording bridge] app syntax ${e.message}`)}
 fs.writeFileSync('app.js',app);
}

console.log('[AXIS 8.18 driver] PASS · v87 canonical render signature preserved · Focus mirrors presentation only · runtime owner initialization sealed · final truth hardening + WebKit-safe media seal + field capture polish + track-aware camera readiness + single-owner detail routing + physical Settings + inherited Capture flow seals applied · 8.19 delegated Object Truth → Recording bridge applied');
