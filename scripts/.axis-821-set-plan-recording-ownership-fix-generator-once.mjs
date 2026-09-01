import fs from 'node:fs';
const file='scripts/.axis-821-set-plan-recording-ownership-once.mjs';
let s=fs.readFileSync(file,'utf8');
const pairs=[
 ["console.log(`[AXIS 8.21 recording surface ${ENGINE}] set-plan owns weight / reps / sets without a duplicate generic editor`);","console.log('[AXIS 8.21 recording surface '+ENGINE+'] set-plan owns weight / reps / sets without a duplicate generic editor');"],
 ["console.log(`[AXIS 8.21 recording surface ${ENGINE}] set-plan plus residual property renders only the residual generic control`);","console.log('[AXIS 8.21 recording surface '+ENGINE+'] set-plan plus residual property renders only the residual generic control');"]
];
for(const [from,to] of pairs){const n=s.split(from).length-1;if(n!==1)throw new Error(`generator log anchor expected once, found ${n}`);s=s.replace(from,to)}
fs.writeFileSync(file,s);
console.log('[AXIS 8.21 set-plan migration generator] repaired nested template literals');