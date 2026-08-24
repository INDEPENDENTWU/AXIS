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

const re=/function resetScan\([^)]*\)\{[\s\S]*?\}(?=function setVal)/g;
const matches=[...src.matchAll(re)];
if(matches.length!==1)fail(`canonical resetScan expected once, found ${matches.length}`);
const before=matches[0][0];
if(before.includes('__AXIS_819_FINAL_RECORDER_RESET__'))fail('final recorder reset duplicated');
const after=before.slice(0,-1)+";const axis819FinalRecorder=$('#axis818MetricRecorder');if(axis819FinalRecorder){axis819FinalRecorder.classList.remove('show');axis819FinalRecorder.innerHTML='';axis819FinalRecorder.dataset.axis818RenderKey='';axis819FinalRecorder.dataset.axis818RenderSuppressed='1'}try{window.__AXIS_819_FINAL_RECORDER_RESET__={version:'8.19',owner:'app.js',presentationOnly:true}}catch{}}";
src=src.slice(0,matches[0].index)+after+src.slice(matches[0].index+before.length);
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
