import fs from 'node:fs';

const FILE='v8710-watermark.js';
const fail=m=>{throw new Error(`[AXIS 8.8.3 inherited brand] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let src=fs.readFileSync(FILE,'utf8');
const before=(src.match(/fillText\('A X I S'/g)||[]).length;
if(before!==1)fail(`spaced center brand expected once after 8.8.3 layout, found ${before}`);
src=src.replace("c.fillText('A X I S',W/2,H*.48)","c.fillText('AXIS',W/2,H*.48)");
if(/fillText\('A X I S'/.test(src))fail('legacy spaced AXIS brand survived');
if(!/fillText\('AXIS',W\/2,H\*\.48\)/.test(src))fail('centered AXIS brand missing');
try{new Function(src)}catch(e){fail(`syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.8.3 inherited brand] PASS · centered AXIS brand preserved without legacy spacing');
