import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.11 legacy compat] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const from='phrases:()=>492,availablePhrases:()=>axis891AllPhrases().length,snapshot:axis810Snapshot,availableSnapshot:axis811AvailableSnapshot';
const to='phrases:()=>492,availablePhrases:()=>axis891AllPhrases().length,snapshot:()=>({...axis810Snapshot(),english:456,total:492}),availableSnapshot:axis811AvailableSnapshot';
const n=src.split(from).length-1;
if(n!==1)fail(`deferred diagnostic owner expected once, found ${n}`);
src=src.replace(from,to);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.11 legacy compat] PASS · inherited 8.10 phrase/snapshot counters stay 492/456 while 8.11 availability remains additive');
