import fs from 'node:fs';

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
 * longer allowed to prevent the canonical UI reset.  Pre-commit media failures
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

try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.19 post-commit lifecycle] PASS · committed Encounter always reaches reset/render · capture teardown remains best-effort · pre-commit media failures unchanged');
