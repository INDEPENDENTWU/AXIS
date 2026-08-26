import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 recording property compat] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const from='function axis818RenderRecorder(){const eq=eqById(state.selectedEq);';
const to='function axis818RenderRecorder(){const eq=axis818Eq(state.selectedEq);';
const hits=src.split(from).length-1;
if(hits!==1)fail(`canonical recorder Object lookup expected once, found ${hits}`);
src=src.replace(from,to);
if(!src.includes('axis818Eq(state.selectedEq)'))fail('8.19 recorder Object Truth invariant not restored');

// Preserve the inherited 8.19 lifecycle contract: the app-owned recorder is
// visible only during an active Review, except for the explicit Quick Record
// handoff which intentionally runs outside reviewStage. Hiding before return
// also prevents a previously-visible recorder from leaking into another sheet.
// A same-Object/same-schema repaint must be idempotent while visible: replacing
// innerHTML would erase a value the user is actively entering before commit.
const lifecycleFrom="if(axis819RecorderSuppressed&&host.dataset.axis820Quick!=='1')return;host.dataset.axis818RenderKey=renderKey;";
const lifecycleTo="if(axis819RecorderSuppressed&&host.dataset.axis820Quick!=='1'){host.classList.remove('show');return}if($('#reviewStage')?.classList.contains('hidden')&&host.dataset.axis820Quick!=='1'){host.classList.remove('show');return}if(host.dataset.axis818RenderKey===renderKey&&host.classList.contains('show'))return;host.dataset.axis818RenderKey=renderKey;";
const lifecycleHits=src.split(lifecycleFrom).length-1;
if(lifecycleHits!==1)fail(`active-review recorder lifecycle boundary expected once, found ${lifecycleHits}`);
src=src.replace(lifecycleFrom,lifecycleTo);
if(!src.includes("$('#reviewStage')?.classList.contains('hidden')"))fail('8.19 active-review recorder scope invariant not restored');
if(!src.includes("host.dataset.axis818RenderKey===renderKey&&host.classList.contains('show')"))fail('8.19 in-progress value idempotence invariant not restored');

try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 recording property compat] PASS · canonical recorder resolves Object Truth + preserves active-review visibility + keeps in-progress values across idempotent repaints');
