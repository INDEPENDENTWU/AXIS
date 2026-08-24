import fs from 'node:fs';

const FILE='v61.js';
const fail=m=>{throw new Error(`[AXIS 8.19 v61 authority seal] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

/*
 * Save-click guards are necessary but not sufficient because v61 commits its
 * metadata asynchronously through attach().  The final ownership check therefore
 * lives immediately before the META write and is based on the newly committed
 * Encounter's equipment identity, not DOM/event timing.
 */
const from="function attach(before,n=0){const c=core(),e=(c.active?.events||[]).find(x=>!before.has(x.id));if(e){const m=mread();";
const to="function attach(before,n=0){const c=core(),e=(c.active?.events||[]).find(x=>!before.has(x.id));if(e){const axis819Committed={id:e.equipmentId,name:e.name,type:e.kind||e.type};if(axis819Committed.type==='strength'&&!axis819ClassicStrengthOwner(axis819Committed)){pending=null;deferOnce=false;hideSets();return}const m=mread();";
const hits=src.split(from).length-1;
if(hits!==1)fail(`attach write boundary expected once, found ${hits}`);
src=src.replace(from,to);
if((src.match(/function attach\(/g)||[]).length!==1)fail('attach owner duplicated');
if(!src.includes("axis819Committed.type==='strength'&&!axis819ClassicStrengthOwner(axis819Committed)"))fail('committed Encounter ownership guard missing');
try{new Function(src)}catch(e){fail(`v61 syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.19 v61 authority seal] PASS · async META attach re-checks committed Encounter schema ownership · non-classic explicit strength schemas cannot write axis_v8_meta');
