import fs from 'node:fs';

const FILE='axis-core.js',MANIFEST='axis-build.json';
const fail=m=>{throw new Error(`[AXIS 8.19 UPO final-runtime seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

/*
 * The source owner remains app.js. This seal runs only after canonical bundling so
 * compiler/postbuild stages cannot silently drop the same lifecycle invariants.
 */
for(const token of [
  'axis818Eq(state.selectedEq)',
  'axis818RenderKey',
  'axis818RenderSuppressed',
  "$('#reviewStage')?.classList.contains('hidden')"
])if(!src.includes(token))fail(`final recorder invariant missing ${token}`);

const resetToken='function resetScan(',nextToken='function setVal(';
const resetStart=src.indexOf(resetToken),resetAgain=src.indexOf(resetToken,resetStart+1);
if(resetStart<0||resetAgain>=0)fail(`canonical resetScan expected once, start ${resetStart}, duplicate ${resetAgain}`);
const nextStart=src.indexOf(nextToken,resetStart+resetToken.length);
if(nextStart<0)fail('canonical setVal boundary missing after resetScan');
const range=src.slice(resetStart,nextStart),close=range.lastIndexOf('}');
if(close<0)fail('canonical resetScan closing brace missing');
if(range.includes('__AXIS_819_FINAL_RECORDER_RESET__'))fail('final recorder reset duplicated');
const patch=";const axis819FinalRecorder=$('#axis818MetricRecorder');if(axis819FinalRecorder){axis819FinalRecorder.classList.remove('show');axis819FinalRecorder.innerHTML='';axis819FinalRecorder.dataset.axis818RenderKey='';axis819FinalRecorder.dataset.axis818RenderSuppressed='1'}try{window.__AXIS_819_FINAL_RECORDER_RESET__={version:'8.19',owner:'app.js',presentationOnly:true}}catch{}";
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
 info.axis819.recording=Object.assign({},info.axis819.recording,{finalRuntimeResetSealed:true,presentationOwner:'app.js'});
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.19 UPO final-runtime seal] PASS · canonical recorder invariants present · reset presentation sealed after compiler/postbuild');
