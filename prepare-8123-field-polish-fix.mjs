import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 field polish fix] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
const from="for(const el of $$('[data-my-eq-photo]','#manageEqList')){if(el.dataset.loaded)return;";
const to="for(const el of $$('[data-my-eq-photo]',$('#manageEqList'))){if(el.dataset.loaded)continue;";
const count=src.split(from).length-1;
if(count!==1)fail(`photo hydration contract expected once, found ${count}`);
src=src.replace(from,to);
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 field polish fix] PASS · photo hydration uses the live list root and skips already hydrated rows');
