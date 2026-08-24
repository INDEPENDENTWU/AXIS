import fs from 'node:fs';

const FILE='v61.js';
const fail=m=>{throw new Error(`[AXIS 8.19 v61 authority seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

/*
 * v61 attaches metadata asynchronously after the Encounter exists. The immutable
 * Encounter schema snapshot is therefore the strongest ownership truth at this
 * boundary and removes every browser/event-order dependency. Explicit snapshots
 * may write v61 metadata only when they contain both weight + reps. Legacy events
 * without a snapshot retain the existing Object/profile fallback.
 */
const from="function attach(before,n=0){const c=core(),e=(c.active?.events||[]).find(x=>!before.has(x.id));if(e){const m=mread();";
const to="function attach(before,n=0){const c=core(),e=(c.active?.events||[]).find(x=>!before.has(x.id));if(e){const axis819CommittedSchema=Array.isArray(e.metricSchemaSnapshot)&&e.metricSchemaSnapshot.length?e.metricSchemaSnapshot:null;if(axis819CommittedSchema){const axis819CommittedKeys=new Set(axis819CommittedSchema.map(x=>x?.key||x?.id).filter(Boolean));if(!(axis819CommittedKeys.has('weight')&&axis819CommittedKeys.has('reps'))){pending=null;deferOnce=false;hideSets();return}}else{const axis819Committed={id:e.equipmentId,name:e.name};if(!axis819ClassicStrengthOwner(axis819Committed)){pending=null;deferOnce=false;hideSets();return}}const m=mread();";
const hits=src.split(from).length-1;
if(hits!==1)fail(`attach write boundary expected once, found ${hits}`);
src=src.replace(from,to);
if((src.match(/function attach\(/g)||[]).length!==1)fail('attach owner duplicated');
if((src.match(/axis819CommittedSchema/g)||[]).length<3)fail('immutable Encounter schema ownership guard missing');
if(!src.includes("axis819CommittedKeys.has('weight')&&axis819CommittedKeys.has('reps')"))fail('classic weight+reps attach condition missing');
if(src.includes("axis819Committed.type==='strength'"))fail('attach ownership still depends on coarse event kind/type');
try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.19 v61 authority seal] PASS · async META attach is governed by immutable Encounter schema snapshot · only explicit weight+reps may write v61 metadata · legacy fallback preserved');
