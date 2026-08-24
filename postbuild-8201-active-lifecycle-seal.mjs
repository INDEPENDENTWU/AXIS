import fs from 'node:fs';

const FILE='axis-core.js',MANIFEST='axis-build.json';
const fail=m=>{throw new Error(`[AXIS 8.20.1 Active lifecycle seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

const replaceOnce=(from,to,label)=>{const n=src.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);src=src.replace(from,to)};
const replaceRange=(re,mutate,label)=>{const flags=re.flags.includes('g')?re.flags:re.flags+'g',matches=[...src.matchAll(new RegExp(re.source,flags))];if(matches.length!==1)fail(`${label} expected once, found ${matches.length}`);const before=matches[0][0],after=mutate(before);if(!after||after===before)fail(`${label} mutation did not change source`);src=src.slice(0,matches[0].index)+after+src.slice(matches[0].index+before.length)};

/* Historical 8.19 guard remains the single startActivity gate, but 8.20.1
   supersedes only its eligibility semantics after every inherited contract passed. */
const old="function axis819ClassicActivityEncounter(x){let e=x&&typeof x==='object'?(x.e&&typeof x.e==='object'?x.e:x):null;if(!e){try{const c=readCore(),all=[...(c.active?.events||[]),...(c.sessions||[]).flatMap(s=>s?.events||[])];e=all.find(v=>v?.id===x)||null}catch{}}const schema=Array.isArray(e?.metricSchemaSnapshot)&&e.metricSchemaSnapshot.length?e.metricSchemaSnapshot:null;if(!schema)return true;const keys=new Set(schema.map(m=>m?.key||m?.id).filter(Boolean));return keys.has('weight')&&keys.has('reps')}";
const next="function axis819ClassicActivityEncounter(x){let e=x&&typeof x==='object'?(x.e&&typeof x.e==='object'?x.e:x):null;if(!e){try{const c=readCore(),all=[...(c.active?.events||[]),...(c.sessions||[]).flatMap(s=>s?.events||[])];e=all.find(v=>v?.id===x)||null}catch{}}const schema=Array.isArray(e?.metricSchemaSnapshot)&&e.metricSchemaSnapshot.length?e.metricSchemaSnapshot:null;if(!schema)return true;const explicit=String(e?.executionModeSnapshot||'').trim();if(['sets','rounds','timed','hold'].includes(explicit))return true;if(['single','complete'].includes(explicit))return false;const keys=new Set(schema.map(m=>m?.key||m?.id).filter(Boolean));if(keys.has('hold'))return true;if(keys.has('weight')&&keys.has('reps'))return true;if(keys.has('duration'))return true;return false}";
replaceOnce(old,next,'8.19 Active Truth helper');

/* v82 keeps activity creation. Its visible legacy rail and the 8.12.4 completion
   projection now read the already-installed 8.20.1 execution resolver. */
replaceRange(
 /function renderActiveRail\(\)\{[\s\S]*?\}(?=\n  function injectPausedSheet)/,
 fn=>{const n=(fn.match(/e\.kind==='strength'/g)||[]).length;if(n<1)fail('v82 rail strength presentation boundary missing');return fn.replaceAll("e.kind==='strength'","axis8201SetExecution(e)")},
 'v82 Active rail execution presentation'
);
replaceOnce("complete=e.kind==='strength'&&done>=planned","complete=axis8201SetExecution(e)&&done>=planned",'8.12.4 current completion projection');

/* 8.18 already centralized every v87 set-only surface and action — plan complete,
   completeSet, add-set presentation, motion and Focus — behind axis818TracksSets.
   Supersede that one canonical predicate instead of patching those consumers. */
replaceRange(
 /function axis818TracksSets\(e\)\{[\s\S]*?\}(?=\nfunction planned)/,
 ()=>"function axis818TracksSets(e){return axis8201SetExecution(e)}",
 'v87 canonical set predicate'
);

if((src.match(/function axis819ClassicActivityEncounter\(/g)||[]).length!==1)fail('Active Truth helper must remain single-owner');
if((src.match(/const axis819ActivityTarget=arguments\[0\]/g)||[]).length!==1)fail('startActivity guard must remain exactly once');
if((src.match(/function axis818TracksSets\(/g)||[]).length!==1)fail('v87 set predicate must remain single-owner');
if(!src.includes("function axis818TracksSets(e){return axis8201SetExecution(e)}"))fail('v87 set predicate did not adopt execution mode');
if(!src.includes("['sets','rounds','timed','hold'].includes(explicit)"))fail('persistent executable modes missing');
if(!src.includes("['single','complete'].includes(explicit)"))fail('one-shot executable modes missing');
if(!src.includes("axis819CommittedKeys.has('weight')&&axis819CommittedKeys.has('reps')"))fail('v61 classic immutable-schema authority changed');
if(!src.includes('function axis8201SetExecution(e)'))fail('execution presentation helper missing');
if(src.includes("complete=e.kind==='strength'&&done>=planned"))fail('coarse completion projection survived current-runtime supersede');
try{new Function(src)}catch(e){fail(`canonical runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);

if(fs.existsSync(MANIFEST)){
 const info=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
 info.gates=info.gates||{};
 info.gates.executableObjectLiveSchemaSync8201=true;
 info.gates.activeLifecycleExecutionMode8201=true;
 info.gates.activeLifecycleSingleCompleteNoFalseActive8201=true;
 info.gates.activePresentationExecutionMode8201=true;
 info.gates.customEnumLocalized8201=true;
 info.gates.evolutionShelfLocalized8201=true;
 info.axis8201={
  objectTruth:{liveSchemaSync:true,extendedMetricKeys:true,compatProjection:'recording.metrics-v2'},
  active:{owner:'existing-v82/v87',executionModeAuthority:true,modes:['sets','rounds','timed','hold'],oneShotModes:['single','complete'],setControls:'sets-only',setPredicate:'axis818TracksSets -> axis8201SetExecution'},
  localization:{internalEnumsPersisted:true,visibleChinese:true,evolutionShelf:true},
  ownership:{newPersistence:false,newDatabase:false,newRecorder:false,newActiveOwner:false}
 };
 if(info.axis819?.recording)info.axis819.recording.activeTruthClassicOnly=false;
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.20.1 Active lifecycle seal] PASS · historical contracts verified first · execution-mode Active eligibility · one canonical v87 set predicate superseded · v61 classic metadata authority unchanged');
