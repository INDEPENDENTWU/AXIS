import fs from 'node:fs';
await import('./postbuild-819-active-truth-schema-seal.mjs');

const FILE='axis-core.js',MANIFEST='axis-build.json';
const fail=m=>{throw new Error(`[AXIS 8.19 UPO final-runtime seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

for(const token of [
  'axis818Eq(state.selectedEq)',
  'axis818RenderKey',
  'axis819RecorderSuppressed',
  "$('#reviewStage')?.classList.contains('hidden')",
  "try{closeSheet('scanSheet')}",
  'finally{try{resetScan()}finally{render()}}',
  "[AXIS 8.19 capture cleanup · reset]",
  'axis819CommittedSchema',
  'e.metricSchemaSnapshot',
  "axis819CommittedKeys.has('weight')&&axis819CommittedKeys.has('reps')",
  'axis819ClassicActivityEncounter',
  'axis819ActivityTarget=arguments[0]'
])if(!src.includes(token))fail(`final recorder invariant missing ${token}`);
if((src.match(/let axis819RecorderSuppressed=true;/g)||[]).length!==1)fail('app-owned recorder lifecycle state must exist exactly once');
if((src.match(/function saveScan\(/g)||[]).length!==1)fail('canonical saveScan must exist exactly once');
if((src.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('authoritative Encounter append must exist exactly once');
if((src.match(/function axis818RenderRecorder\(/g)||[]).length!==1)fail('schema recorder renderer must exist exactly once');
if((src.match(/const axis819CommittedSchema=/g)||[]).length!==1)fail('v61 immutable Encounter-schema attach guard must exist exactly once');
if((src.match(/function axis819ClassicActivityEncounter\(/g)||[]).length!==1)fail('Active Truth Encounter-schema authority must exist exactly once');
const v61GuardAt=src.indexOf('const axis819CommittedSchema=');
const v61MetaReadAt=src.indexOf('const m=mread();',v61GuardAt);
if(v61GuardAt<0||v61MetaReadAt<0||v61GuardAt>v61MetaReadAt)fail('v61 Encounter-schema authority must run before META read/write');
const activeGuardAt=src.indexOf('const axis819ActivityTarget=arguments[0]');
const activePauseAt=src.indexOf('pauseOthers',activeGuardAt);
if(activeGuardAt<0||activePauseAt<0||activeGuardAt>activePauseAt)fail('Active Truth schema authority must run before activity pause/write');

const resetToken='function resetScan(',nextToken='function setVal(';
const resetStart=src.indexOf(resetToken),resetAgain=src.indexOf(resetToken,resetStart+1);
if(resetStart<0||resetAgain>=0)fail(`canonical resetScan expected once, start ${resetStart}, duplicate ${resetAgain}`);
const nextStart=src.indexOf(nextToken,resetStart+resetToken.length);
if(nextStart<0)fail('canonical setVal boundary missing after resetScan');
let range=src.slice(resetStart,nextStart);
if(!range.includes('axis819RecorderSuppressed=true'))fail('source-owned reset lifecycle state missing from canonical runtime');
const lifecycleAt=range.indexOf('axis819RecorderSuppressed=true');
const inheritedResetAt=range.indexOf('state.frames.forEach');
if(lifecycleAt<0||inheritedResetAt<0||lifecycleAt>inheritedResetAt)fail('recorder suppression must happen at reset entry before inherited Capture reset');
if(range.includes('__AXIS_819_FINAL_RECORDER_RESET__'))fail('final recorder reset marker duplicated');

const entryEnd="axis819Recorder.innerHTML=''};";
const entryHits=range.split(entryEnd).length-1;
if(entryHits!==1)fail(`reset-entry recorder unmount boundary expected once, found ${entryHits}`);
const marker="try{window.__AXIS_819_FINAL_RECORDER_RESET__={version:'8.19',owner:'app.js',presentationOnly:true,lifecycleState:true,entryOwned:true}}catch{};";
range=range.replace(entryEnd,entryEnd+marker);
src=src.slice(0,resetStart)+range+src.slice(nextStart);
if(!src.includes('__AXIS_819_FINAL_RECORDER_RESET__'))fail('final reset marker missing after patch');

if(src.includes('return112'))fail('inherited 8.13.1 return112 identifier survived final bundling');
if(!src.includes('function yFor(s){const c=continuity(s);if(c===null)return 112;'))fail('8.13.1 null-continuity numeric fallback missing from final runtime');
try{new Function(src)}catch(e){fail(`canonical runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);

if(fs.existsSync(MANIFEST)){
 const info=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
 info.gates=info.gates||{};
 info.gates.universalPracticeObjectFinalReset819=true;
 info.gates.inheritedEvolutionNullContinuity819=true;
 info.gates.v61EncounterSchemaAuthority819=true;
 info.gates.activeTruthEncounterSchemaAuthority819=true;
 info.axis819=info.axis819||{};
 info.axis819.recording=Object.assign({},info.axis819.recording,{finalRuntimeResetSealed:true,lifecycleStateOwnedByApp:true,resetEntryOwned:true,postCommitFinally:true,presentationOwner:'app.js',v61AttachUsesImmutableEncounterSchema:true,activeTruthUsesImmutableEncounterSchema:true});
 info.axis819.inheritedRuntime=Object.assign({},info.axis819.inheritedRuntime,{evolutionNullContinuityRepaired:true,forbidReturn112:true});
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.19 UPO final-runtime seal] PASS · reset-entry recorder suppression + durable post-commit reset/render · immutable Encounter-schema v61 + Active Truth authority · inherited Evolution null-continuity repaired · single writers preserved');

/* 8.20.1 supersedes only the classic-only Active lifecycle restriction after all
   8.19 immutable Encounter/v61 authority checks are proven. */
await import('./postbuild-8201-active-lifecycle-seal.mjs');
