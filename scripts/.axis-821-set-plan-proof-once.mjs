import fs from 'node:fs';
const file='prepare-821-metric-control-proof.mjs';
let s=fs.readFileSync(file,'utf8');
const once=(from,to,label)=>{const n=s.split(from).length-1;if(n!==1)throw new Error(`[AXIS 8.21 set-plan proof] ${label} expected once, found ${n}`);s=s.replace(from,to)};
once(" 'weight control drifted from Group Plan geometry',"," 'hold control drifted from Group Plan geometry',\n 'set-plan single ownership',\n 'residual-only shared recorder',\n 'set-owned metrics leaked into full generic recorder',",'physical ownership evidence');
once("console.log('[AXIS 8.21 metric control proof] PASS · five semantic control families · 64px Group Plan geometry · expanded dual-engine physical assertions · public identity still 8.20.1');","console.log('[AXIS 8.21 metric control proof] PASS · five semantic control families · single set-plan ownership · residual-only generic recorder · 64px Group Plan geometry · expanded dual-engine physical assertions · public identity still 8.20.1');",'proof summary');
fs.writeFileSync(file,s);
console.log('[AXIS 8.21 set-plan proof] staged · static proof follows the single recording owner contract');