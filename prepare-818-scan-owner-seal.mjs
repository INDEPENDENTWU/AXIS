import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 scan owner seal] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const from="try{D.dispatchEvent(new CustomEvent('axis:recording-pref-changed',{detail:{scanSeconds:sec,source:'axis818-final'}}))}catch(e){}";
const to="try{window.__AXIS_CAPTURE_PREF__?.set?.(String(sec))}catch(e){}";
const n=s.split(from).length-1;if(n!==1)fail(`final scan duplicate writer expected once, found ${n}`);
s=s.replace(from,to);
if((s.match(/source:'axis818-final'/g)||[]).length)fail('final duplicate delegated event survived');
if(!s.includes("window.__AXIS_CAPTURE_PREF__?.set?.(String(sec))"))fail('canonical capture preference setter delegation missing');
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.18 scan owner seal] PASS · touch 3/5 delegates to existing capture preference setter · no second recording-pref event writer');
