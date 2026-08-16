import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.3 final compat] ${m}`)};
const FILE='app.js';
let src=fs.readFileSync(FILE,'utf8');
const from="fetch('/axis-build.json?fresh='+t,{cache:'no-store',headers:{'cache-control':'no-cache'}})";
const to="fetch('/axis-build.json?fresh='+t,{cache:'no-store'})";
const n=src.split(from).length-1;
if(n!==1)fail(`freshness fetch expected once, found ${n}`);
src=src.replace(from,to);
if(src.includes("headers:{'cache-control':'no-cache'}"))fail('custom cache-control request header survived freshness fetch');
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.10.3 final compat] PASS · Safari/WebKit freshness uses same-origin simple no-store fetch');
