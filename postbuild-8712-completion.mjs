import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const FEATURE='v8712-completion.js';
const MAX_BYTES=48*1024;
const p=f=>path.join(ROOT,f);
const read=f=>fs.readFileSync(p(f),'utf8');
const fail=m=>{throw new Error(`AXIS 8.7.12 completion gate: ${m}`)};

for(const f of ['index.html','axis-build.json','v8712-runtime.js',FEATURE])if(!fs.existsSync(p(f)))fail(`missing ${f}`);
const src=read(FEATURE);
if(Buffer.byteLength(src)>MAX_BYTES)fail(`${FEATURE} exceeds ${MAX_BYTES/1024} KiB budget`);
try{new Function(src)}catch(e){fail(`${FEATURE} syntax ${e.message}`)}
const forbidden=[
 ['global loading ownership',/__AXIS_LATEST_LOADING__|__AXIS_HYDRATING__|__AXIS_BOOT_WATCHDOG__/],
 ['service worker mutation',/navigator\.serviceWorker|serviceWorker\s*\./],
 ['full body observer',/\.observe\s*\(\s*document\.body/],
 ['permanent interval',/setInterval\s*\(/],
 ['forced navigation',/location\.(?:reload|replace|assign)\s*\(/],
 ['document replacement',/document\.(?:body|documentElement)\.innerHTML\s*=/]
];
for(const [name,re] of forbidden)if(re.test(src))fail(`${FEATURE} violates ${name}`);

const hash=crypto.createHash('sha256').update(src).digest('hex').slice(0,12);
const asset=`/${FEATURE}?v=${hash}`;
const loader=`<!-- AXIS_COMPLETION_LOADER_START -->
<script>(()=>{'use strict';
if(window.__AXIS_COMPLETION_KERNEL__)return;
const K=window.__AXIS_COMPLETION_KERNEL__={state:'waiting',startedAt:Date.now(),errors:[]};
const ready=()=>window.__AXIS_8712_READY__===true&&window.__AXIS_CORE_INTERACTIVE__===true;
const load=()=>{
 if(K.state!=='waiting'||!ready())return;
 K.state='loading';
 const s=document.createElement('script');s.src='${asset}';s.async=true;s.dataset.axisCompletion='8712';
 let done=false;
 const finish=(ok,reason='')=>{if(done)return;done=true;clearTimeout(timer);K.state=ok?'ready':'base';K.readyAt=Date.now();if(reason)K.errors.push(reason);if(!ok)console.warn('[AXIS completion]',reason)};
 const timer=setTimeout(()=>{try{s.remove()}catch{};finish(false,'completion-timeout')},3500);
 s.onload=()=>{let n=0;const probe=()=>{if(window.__AXIS_8712_COMPLETION_READY__===true)return finish(true);if(++n<10)setTimeout(probe,80);else finish(false,'completion-not-ready')};probe()};
 s.onerror=()=>finish(false,'completion-network');
 (document.head||document.documentElement).appendChild(s);
};
let tries=0;const probe=()=>{if(ready())return setTimeout(load,120);if(window.__AXIS_FEATURE_KERNEL__?.state==='base')return void(K.state='base');if(++tries<70)setTimeout(probe,100);else{K.state='base';K.errors.push('completion-parent-timeout')}};
if(document.readyState==='complete')setTimeout(probe,80);else window.addEventListener('load',()=>setTimeout(probe,80),{once:true});
})();</script>
<!-- AXIS_COMPLETION_LOADER_END -->`;

let html=read('index.html');
html=html.replace(/<!-- AXIS_COMPLETION_LOADER_START -->[\s\S]*?<!-- AXIS_COMPLETION_LOADER_END -->\s*/g,'');
if(!html.includes('AXIS_FEATURE_LOADER_START'))fail('8.7.12 feature loader missing before completion');
html=html.replace('</body>',`${loader}\n</body>`);
fs.writeFileSync(p('index.html'),html);

const info=JSON.parse(read('axis-build.json'));
info.completionKernel={blocking:false,feature:FEATURE,hash,maxBytes:MAX_BYTES,timeoutMs:3500,requires:['8.7.12 feature ready','core interactive'],fallback:'8.7.12 without completion'};
info.gates={...(info.gates||{}),completionSyntax:true,completionBudget:true,completionContract:true,completionNonBlocking:true};
fs.writeFileSync(p('axis-build.json'),JSON.stringify(info,null,2));
console.log(`[AXIS] 8.7.12 completion gate passed · ${hash} · ${Buffer.byteLength(src)} bytes`);
