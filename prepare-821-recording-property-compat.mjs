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

// Rating/intensity keeps the 1–10 tactile rail, but its canonical value owner is
// also a real editable input. This preserves keyboard/accessibility/legacy Quick
// Record behavior and gives users a precise direct-entry path without creating a
// second value or schema owner; the rating buttons write this same input.
const ratingFrom="<input type=\"hidden\" data-axis818-metric=\"'+key+'\" value=\"'+esc(value)+'\"><div class=\"axis821Rating\">";
const ratingTo="<div class=\"axis821Direct axis821RatingDirect\"><input data-axis818-metric=\"'+key+'\" inputmode=\"numeric\" autocomplete=\"off\" value=\"'+esc(value)+'\" placeholder=\"—\" min=\"1\" max=\"10\"><small>/10</small></div><div class=\"axis821Rating\">";
const ratingHits=src.split(ratingFrom).length-1;
if(ratingHits!==1)fail(`canonical rating value owner expected once, found ${ratingHits}`);
src=src.replace(ratingFrom,ratingTo);
if(!src.includes('axis821RatingDirect'))fail('direct editable rating control missing');

try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 recording property compat] PASS · canonical recorder resolves Object Truth + preserves active-review visibility + keeps in-progress values + rating rail shares one directly editable value owner');
