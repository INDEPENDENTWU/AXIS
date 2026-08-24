import fs from 'node:fs';

const FILE='axis-core.js',MANIFEST='axis-build.json';
const fail=m=>{throw new Error(`[AXIS 8.19 UPO final-runtime seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

for(const token of [
  'axis818Eq(state.selectedEq)',
  'axis818RenderKey',
  'axis819RecorderSuppressed',
  "$('#reviewStage')?.classList.contains('hidden')"
])if(!src.includes(token))fail(`final recorder invariant missing ${token}`);
if((src.match(/let axis819RecorderSuppressed=true;/g)||[]).length!==1)fail('app-owned recorder lifecycle state must exist exactly once');

const occurrences=needle=>{const out=[];let i=-1;while((i=src.indexOf(needle,i+1))>=0)out.push(i);return out};
const audit={
 recorderId:occurrences('axis818MetricRecorder'),
 recorderHead:occurrences('axis818MetricHead'),
 renderFunction:occurrences('function axis818RenderRecorder'),
 legacyToggle:occurrences("classList.toggle('show',explicit)"),
 renderKey:occurrences('axis818RenderKey'),
 saveFunction:occurrences('function saveScan'),
 captureEvent:occurrences('axis818CaptureEvent'),
 eventPush:occurrences('state.active.events.push'),
 saveScanRefs:occurrences('saveScan'),
 closeSheetFunction:occurrences('function closeSheet'),
 stopCameraFunction:occurrences('function stopCamera'),
 abortVideoFunction:occurrences('function capture816AbortVideo'),
 abortVideoRefs:occurrences('capture816AbortVideo')
};
const contextFor=positions=>positions.slice(0,16).map(i=>src.slice(Math.max(0,i-320),Math.min(src.length,i+920)).replace(/\s+/g,' '));
console.log('[AXIS 8.19 UPO canonical audit] '+JSON.stringify({
 counts:Object.fromEntries(Object.entries(audit).map(([k,v])=>[k,v.length])),
 recorderContexts:contextFor(audit.recorderId),
 saveContexts:contextFor([...audit.saveFunction,...audit.captureEvent,...audit.eventPush,...audit.saveScanRefs]),
 postSaveBoundaryContexts:contextFor([...audit.closeSheetFunction,...audit.stopCameraFunction,...audit.abortVideoFunction,...audit.abortVideoRefs])
}));

const resetToken='function resetScan(',nextToken='function setVal(';
const resetStart=src.indexOf(resetToken),resetAgain=src.indexOf(resetToken,resetStart+1);
if(resetStart<0||resetAgain>=0)fail(`canonical resetScan expected once, start ${resetStart}, duplicate ${resetAgain}`);
const nextStart=src.indexOf(nextToken,resetStart+resetToken.length);
if(nextStart<0)fail('canonical setVal boundary missing after resetScan');
const range=src.slice(resetStart,nextStart),close=range.lastIndexOf('}');
if(close<0)fail('canonical resetScan closing brace missing');
if(!range.includes('axis819RecorderSuppressed=true'))fail('source-owned reset lifecycle state missing from canonical runtime');
if(range.includes('__AXIS_819_FINAL_RECORDER_RESET__'))fail('final recorder reset duplicated');
const patch=";axis819RecorderSuppressed=true;const axis819FinalRecorder=$('#axis818MetricRecorder');if(axis819FinalRecorder){axis819FinalRecorder.classList.remove('show');axis819FinalRecorder.innerHTML='';axis819FinalRecorder.dataset.axis818RenderKey='';axis819FinalRecorder.dataset.axis818RenderSuppressed='1'}try{window.__AXIS_819_FINAL_RECORDER_RESET__={version:'8.19',owner:'app.js',presentationOnly:true,lifecycleState:true}}catch{}";
const sealedRange=range.slice(0,close)+patch+range.slice(close);
src=src.slice(0,resetStart)+sealedRange+src.slice(nextStart);
if(!src.includes('__AXIS_819_FINAL_RECORDER_RESET__'))fail('final reset marker missing after patch');
try{new Function(src)}catch(e){fail(`canonical runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);

if(fs.existsSync(MANIFEST)){
 const info=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
 info.gates=info.gates||{};
 info.gates.universalPracticeObjectFinalReset819=true;
 info.axis819=info.axis819||{};
 info.axis819.recording=Object.assign({},info.axis819.recording,{finalRuntimeResetSealed:true,lifecycleStateOwnedByApp:true,presentationOwner:'app.js'});
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.19 UPO final-runtime seal] PASS · canonical recorder lifecycle state + reset presentation sealed after compiler/postbuild');
