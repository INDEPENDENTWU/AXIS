import fs from 'node:fs';

const FILE='axis-core.js',MANIFEST='axis-build.json';
const fail=m=>{throw new Error(`[AXIS 8.20.1 Active lifecycle seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

const old="function axis819ClassicActivityEncounter(x){let e=x&&typeof x==='object'?(x.e&&typeof x.e==='object'?x.e:x):null;if(!e){try{const c=readCore(),all=[...(c.active?.events||[]),...(c.sessions||[]).flatMap(s=>s?.events||[])];e=all.find(v=>v?.id===x)||null}catch{}}const schema=Array.isArray(e?.metricSchemaSnapshot)&&e.metricSchemaSnapshot.length?e.metricSchemaSnapshot:null;if(!schema)return true;const keys=new Set(schema.map(m=>m?.key||m?.id).filter(Boolean));return keys.has('weight')&&keys.has('reps')}";
const next="function axis819ClassicActivityEncounter(x){let e=x&&typeof x==='object'?(x.e&&typeof x.e==='object'?x.e:x):null;if(!e){try{const c=readCore(),all=[...(c.active?.events||[]),...(c.sessions||[]).flatMap(s=>s?.events||[])];e=all.find(v=>v?.id===x)||null}catch{}}const schema=Array.isArray(e?.metricSchemaSnapshot)&&e.metricSchemaSnapshot.length?e.metricSchemaSnapshot:null;if(!schema)return true;const explicit=String(e?.executionModeSnapshot||'').trim();if(['sets','rounds','timed','hold'].includes(explicit))return true;if(['single','complete'].includes(explicit))return false;const keys=new Set(schema.map(m=>m?.key||m?.id).filter(Boolean));if(keys.has('hold'))return true;if(keys.has('weight')&&keys.has('reps'))return true;if(keys.has('duration'))return true;return false}";
const n=src.split(old).length-1;if(n!==1)fail(`8.19 Active Truth helper expected once, found ${n}`);
src=src.replace(old,next);

if((src.match(/function axis819ClassicActivityEncounter\(/g)||[]).length!==1)fail('Active Truth helper must remain single-owner');
if((src.match(/const axis819ActivityTarget=arguments\[0\]/g)||[]).length!==1)fail('startActivity guard must remain exactly once');
if(!src.includes("['sets','rounds','timed','hold'].includes(explicit)"))fail('persistent executable modes missing');
if(!src.includes("['single','complete'].includes(explicit)"))fail('one-shot executable modes missing');
if(!src.includes("axis819CommittedKeys.has('weight')&&axis819CommittedKeys.has('reps')"))fail('v61 classic immutable-schema authority changed');
try{new Function(src)}catch(e){fail(`canonical runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);

if(fs.existsSync(MANIFEST)){
 const info=JSON.parse(fs.readFileSync(MANIFEST,'utf8'));
 info.gates=info.gates||{};
 info.gates.executableObjectLiveSchemaSync8201=true;
 info.gates.activeLifecycleExecutionMode8201=true;
 info.gates.activeLifecycleSingleCompleteNoFalseActive8201=true;
 info.gates.customEnumLocalized8201=true;
 info.axis8201={
  objectTruth:{liveSchemaSync:true,extendedMetricKeys:true,compatProjection:'recording.metrics-v2'},
  active:{owner:'existing-v82/v87',executionModeAuthority:true,modes:['sets','rounds','timed','hold'],oneShotModes:['single','complete']},
  localization:{internalEnumsPersisted:true,visibleChinese:true},
  ownership:{newPersistence:false,newDatabase:false,newRecorder:false,newActiveOwner:false}
 };
 if(info.axis819?.recording)info.axis819.recording.activeTruthClassicOnly=false;
 fs.writeFileSync(MANIFEST,JSON.stringify(info,null,2)+'\n');
}
console.log('[AXIS 8.20.1 Active lifecycle seal] PASS · execution-mode Active authority supersedes 8.19 classic-only restriction · v61 classic metadata authority unchanged');
