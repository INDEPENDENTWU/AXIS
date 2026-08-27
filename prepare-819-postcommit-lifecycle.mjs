import fs from 'node:fs';
import './prepare-819-v61-authority-seal.mjs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.19 post-commit lifecycle] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const replaceOnce=(from,to,label)=>{
 const hits=src.split(from).length-1;
 if(hits!==1)fail(`${label} expected once, found ${hits}`);
 src=src.replace(from,to);
};

/*
 * Once an Encounter is durably appended + saved, capture/media teardown is no
 * longer allowed to prevent the canonical UI reset. Pre-commit media failures
 * remain handled by saveScan's existing persistence catch and still abort the
 * Encounter commit.
 */
replaceOnce(
 "function closeSheet(id){$('#'+id)?.classList.remove('show');if(id==='scanSheet'){capture816AbortVideo(true);stopCamera()}}",
 "function closeSheet(id){$('#'+id)?.classList.remove('show');if(id==='scanSheet'){try{capture816AbortVideo(true)}catch(e){console.warn('[AXIS 8.19 capture cleanup · abort]',e)}try{stopCamera()}catch(e){console.warn('[AXIS 8.19 capture cleanup · camera]',e)}}}",
 'scan-sheet cleanup boundary'
);

replaceOnce(
 'function resetScan(preserveSelection=false){capture816AbortVideo(true);',
 "function resetScan(preserveSelection=false){try{capture816AbortVideo(true)}catch(e){console.warn('[AXIS 8.19 capture cleanup · reset]',e)};",
 'resetScan capture cleanup boundary'
);

replaceOnce(
 "learnMemory(eq.id);state.active.events.push(e);save();closeSheet('scanSheet');resetScan();render();toast('已记下')",
 "learnMemory(eq.id);state.active.events.push(e);save();try{closeSheet('scanSheet')}catch(e){console.warn('[AXIS 8.19 post-commit close]',e)}finally{try{resetScan()}finally{render()}}toast('已记下')",
 'durable Encounter post-commit boundary'
);

const lifecycleTail=";axis819RecorderSuppressed=true;$('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');$('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');const axis819Recorder=$('#axis818MetricRecorder');if(axis819Recorder){axis819Recorder.dataset.axis818RenderKey='';axis819Recorder.dataset.axis818RenderSuppressed='1';axis819Recorder.classList.remove('show');axis819Recorder.innerHTML=''}";
replaceOnce(lifecycleTail,'','recorder reset tail');
const resetEntry="function resetScan(preserveSelection=false){try{capture816AbortVideo(true)}catch(e){console.warn('[AXIS 8.19 capture cleanup · reset]',e)};";
const lifecycleEntry="axis819RecorderSuppressed=true;$('#strengthFields')?.classList.remove('axis818LegacyMetricHidden');$('#cardioFields')?.classList.remove('axis818LegacyMetricHidden');const axis819Recorder=$('#axis818MetricRecorder');if(axis819Recorder){axis819Recorder.dataset.axis818RenderKey='';axis819Recorder.dataset.axis818RenderSuppressed='1';axis819Recorder.classList.remove('show');axis819Recorder.innerHTML=''};";
replaceOnce(resetEntry,resetEntry+lifecycleEntry,'recorder reset entry');

try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.19 post-commit lifecycle] PASS · v61 attach authority sealed first · committed Encounter always reaches reset/render · recorder suppression/unmount is reset-entry-owned · capture teardown remains best-effort · pre-commit media failures unchanged');

/* 8.19 closes its historical release identity first. 8.20 then layers the next
   product contract. 8.20.1 reliability hardening runs before the 8.20 public
   seal. 8.21 then layers Flow runtime, canonical recording properties and the
   user-visible Flow surface without introducing a parallel factual owner. The
   8.21 public identity advances only after all 8.21 product convergence passes. */
await import('./prepare-819-release.mjs');
await import('./prepare-820-executable-practice-objects.mjs');
await import('./prepare-8201-object-reliability.mjs');
await import('./prepare-820-release.mjs');
await import('./prepare-8201-release.mjs');
await import('./prepare-821-flow-runtime.mjs');
await import('./prepare-821-recording-property-surface.mjs');
await import('./prepare-821-recording-property-compat.mjs');
await import('./prepare-821-recording-property-proof.mjs');
await import('./prepare-821-flow-user-surface.mjs');
await import('./prepare-821-flow-user-surface-compat.mjs');
await import('./prepare-821-flow-user-surface-proof.mjs');
await import('./prepare-821-product-convergence-compat.mjs');
await import('./prepare-821-product-convergence.mjs');
await import('./prepare-821-product-convergence-proof.mjs');
await import('./prepare-821-flow-active-convergence.mjs');
await import('./prepare-821-flow-active-boot-scope.mjs');
await import('./prepare-821-flow-session-coordination.mjs');
await import('./prepare-821-flow-session-coordination-scope.mjs');
await import('./prepare-821-executable-object-system.mjs');
await import('./prepare-821-executable-object-system-smoke-compat.mjs');
await import('./prepare-821-release.mjs');
