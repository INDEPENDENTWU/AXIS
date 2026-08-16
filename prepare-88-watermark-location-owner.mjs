import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS 8.8 watermark location owner: ${m}`)};
const FILE='v85-runtime.js';
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');

// Historical setGeo may persist private GPS coordinates, but it may not decide whether
// location is visible in the watermark. The visible preference is owned only by setWm.
const direct=/\b[A-Za-z_$][\w$]*\.prefs\.v85WmLocation\s*=\s*[^;]+;/g;
const hits=src.match(direct)||[];
if(hits.length!==1)fail(`expected exactly one historical direct location-preference write, found ${hits.length}`);
src=src.replace(direct,'');
if(direct.test(src))fail('direct v85WmLocation assignment survived');
if(!/function setGeo\([^)]*\)[^\n]*v85LastGeo/.test(src))fail('private GPS setGeo owner missing after preference retirement');
if(!/function setWm\(k,v\)[^\n]*axis:watermark-pref-change/.test(src))fail('canonical event-emitting watermark preference writer missing');
try{new Function(src)}catch(e){fail(`syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8 watermark location] convergence passed · setGeo stores private GPS only · setWm owns visible location preference');