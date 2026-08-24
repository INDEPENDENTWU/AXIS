import fs from 'node:fs';

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
  "[AXIS 8.19 capture cleanup · reset]"
])if(!src.includes(token))fail(`final recorder invariant missing ${token}`);
if((src.match(/let axis819RecorderSuppressed=true;/g)||[]).length!==1)fail('app-owned recorder lifecycle state must exist exactly once');
if((src.match(/function saveScan\(/g)||[]).length!==1)fail('canonical saveScan must exist exactly once');
if((src.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('authoritative Encounter append must exist exactly once');
if((src.match(/function axis818RenderRecorder\(/g)||[]).length!==1)fail('schema recorder renderer must exist exactly once');

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
 info.axis819=info.axis819||{};
 info.axis819.recording=Object.assign({},info.axis819.recording,{finalRuntimeResetSealed:true,lifecycleStateOwnedByApp:true,resetEntryOwned:true,postCommitFinally:true,presentationOwner:'app.js'});
 info.axis819.inheritedRuntime=Object.assign({},info.axis819.inheritedRuntime,{evolutionNullContinuityRepaired:true,forbidReturn112:true});
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.19 UPO final-runtime seal] PASS · reset-entry recorder suppression + durable post-commit reset/render · inherited Evolution null-continuity repaired · single writers preserved');
