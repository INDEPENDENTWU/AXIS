import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.3 final compat] ${m}`)};
const FILE='app.js';
let src=fs.readFileSync(FILE,'utf8');
const from="fetch('/axis-build.json?fresh='+t,{cache:'no-store',headers:{'cache-control':'no-cache'}})";
const to="fetch('/axis-build.json',{cache:'no-store'})";
const n=src.split(from).length-1;
if(n!==1)fail(`freshness fetch expected once, found ${n}`);
src=src.replace(from,to);
const guard="async function check(){const t=Date.now();if(busy||t-last<15000)return;";
const guarded="async function check(){if(/^(?:127\\.|localhost$)/i.test(location.hostname))return;const t=Date.now();if(busy||t-last<15000)return;";
const g=src.split(guard).length-1;if(g!==1)fail(`freshness guard expected once, found ${g}`);src=src.replace(guard,guarded);
if(src.includes("headers:{'cache-control':'no-cache'}"))fail('custom cache-control request header survived freshness fetch');
if(src.includes('/axis-build.json?fresh='))fail('provider-sensitive freshness query survived');
if(!src.includes("fetch('/axis-build.json',{cache:'no-store'})"))fail('provider-neutral same-origin manifest freshness fetch missing');
if(!src.includes("/^(?:127\\.|localhost$)/i.test(location.hostname)"))fail('local harness freshness guard missing');
try{new Function(src)}catch(e){fail(`app.js syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.10.3 final compat] PASS · event-driven freshness uses provider-neutral same-origin manifest · local WebKit harness remains side-effect free');
