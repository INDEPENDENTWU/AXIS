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
try{new Function(src)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.21 recording property compat] PASS · canonical recorder still resolves selected Object through axis818Eq while preserving the 8.21 value-only surface');
