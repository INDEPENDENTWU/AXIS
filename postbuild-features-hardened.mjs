import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const BASE_VERSION='8.7.11';
const TARGET_VERSION='8.7.12';
const FEATURE_FILE='v8712-runtime.js';
const MAX_FEATURE_BYTES=64*1024;
const p=f=>path.join(ROOT,f);
const read=f=>fs.readFileSync(p(f),'utf8');
const fail=m=>{throw new Error(`AXIS hardened feature gate: ${m}`)};

for(const f of ['index.html','axis-core.js','axis-style.css','axis-build.json',FEATURE_FILE])if(!fs.existsSync(p(f)))fail(`missing ${f}`);
for(const f of ['axis-enhance-foundation.js','axis-enhance-recording.js','axis-enhance-interaction.js','axis-enhance-product.js'])if(!fs.existsSync(p(f)))fail(`missing stable chunk ${f}`);

const feature=read(FEATURE_FILE);
if(Buffer.byteLength(feature)>MAX_FEATURE_BYTES)fail(`${FEATURE_FILE} exceeds ${MAX_FEATURE_BYTES/1024} KiB budget`);
try{new Function(feature)}catch(e){fail(`${FEATURE_FILE} syntax ${e.message}`)}
const forbidden=[
  ['global loading flag',/__AXIS_LATEST_LOADING__|__AXIS_HYDRATING__|__AXIS_BOOT_WATCHDOG__/],
  ['service worker mutation',/serviceWorker\s*\.|navigator\.serviceWorker/],
  ['full page mutation observer',/observe\s*\(\s*document\.body/],
  ['permanent interval',/setInterval\s*\(/],
  ['forced navigation/reload',/location\.(?:reload|replace|assign)\s*\(/],
  ['document replacement',/document\.(?:body|documentElement)\.innerHTML\s*=/],
  ['busy loop',/while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/]
];
for(const [name,re] of forbidden)if(re.test(feature))fail(`${FEATURE_FILE} violates ${name}`);

const featureHash=crypto.createHash('sha256').update(feature).digest('hex').slice(0,12);
const src=`/${FEATURE_FILE}?v=${featureHash}`;
const loader=`<!-- AXIS_FEATURE_LOADER_START -->
<script>(()=>{'use strict';
const BASE='${BASE_VERSION}',TARGET='${TARGET_VERSION}',SRC='${src}';
if(window.__AXIS_FEATURE_KERNEL__)return;
const kernel=window.__AXIS_FEATURE_KERNEL__={state:'waiting',base:BASE,target:TARGET,errors:[],startedAt:Date.now()};
const cmp=(a,b)=>String(a||'0').split('.').map(Number).reduce((r,n,i)=>r||(n-(String(b||'0').split('.').map(Number)[i]||0)),0);
let owned=BASE,versionObserver=null;
const setVersionText=v=>{const el=document.querySelector('.versionLine');if(el){const t='版本 '+v;if(el.textContent!==t)el.textContent=t;if(el.dataset.axisVersion!==v)el.dataset.axisVersion=v;if(el.style.visibility!=='visible')el.style.visibility='visible'}};
const ownVersion=()=>{
  owned=TARGET;
  for(const key of ['__AXIS_RELEASE__','__AXIS_VERSION__']){
    try{Object.defineProperty(window,key,{configurable:true,enumerable:true,get:()=>owned,set:v=>{if(cmp(v,owned)>=0)owned=String(v)}})}catch{window[key]=TARGET}
  }
  setVersionText(TARGET);
  const NativeMO=window.__AXIS_NATIVE_MUTATION_OBSERVER__||window.MutationObserver;
  const el=document.querySelector('.versionLine');
  if(NativeMO&&el&&!versionObserver){versionObserver=new NativeMO(()=>setVersionText(owned));versionObserver.observe(el,{childList:true,characterData:true,subtree:true,attributes:true,attributeFilter:['data-axis-version','style']})}
};
const stableHealthy=()=>!!(window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_STABLE_COMPLETE__&&window.__AXIS_LATEST_READY__&&window.__AXIS_8711_READY__&&window.__AXIS_873_LIBRARY_READY__&&!window.__AXIS_STABLE_DEGRADED__);
const fallback=(reason,err)=>{kernel.state='base';kernel.errors.push(String(reason));if(err)console.warn('[AXIS feature]',reason,err);setVersionText(BASE)};
const promote=()=>{if(!window.__AXIS_8712_READY__)return false;kernel.state='ready';kernel.readyAt=Date.now();ownVersion();document.documentElement.dataset.axisOptionalReady='1';return true};
const load=()=>{
  if(kernel.state!=='waiting')return;
  if(!stableHealthy()){fallback(window.__AXIS_STABLE_DEGRADED__?'stable-degraded':'stable-not-ready');return}
  kernel.state='loading';
  const s=document.createElement('script');s.src=SRC;s.async=true;s.dataset.axisFeature='8712';
  let done=false;
  const timer=setTimeout(()=>{if(done)return;done=true;try{s.remove()}catch{};fallback('feature-timeout')},4500);
  s.onload=()=>{if(done)return;done=true;clearTimeout(timer);let n=0;const verify=()=>{if(promote())return;if(++n<12)setTimeout(verify,100);else fallback('feature-not-ready')};verify()};
  s.onerror=e=>{if(done)return;done=true;clearTimeout(timer);fallback('feature-network',e)};
  (document.head||document.documentElement).appendChild(s);
};
const waitStable=()=>{
  let tries=0;
  const probe=()=>{
    if(stableHealthy()){
      const schedule=()=>setTimeout(load,900);
      if('requestIdleCallback'in window)requestIdleCallback(schedule,{timeout:1800});else setTimeout(schedule,1200);
      return;
    }
    if(window.__AXIS_STABLE_DEGRADED__){fallback('stable-degraded');return}
    if(++tries<50)setTimeout(probe,120);else fallback('stable-timeout');
  };
  probe();
};
if(document.readyState==='complete')setTimeout(waitStable,100);else window.addEventListener('load',()=>setTimeout(waitStable,100),{once:true});
})();</script>
<!-- AXIS_FEATURE_LOADER_END -->`;

let html=read('index.html');
html=html.replace(/<!-- AXIS_FEATURE_LOADER_START -->[\s\S]*?<!-- AXIS_FEATURE_LOADER_END -->\s*/g,'');
if(!html.includes('/axis-core.js?v='))fail('hardened core entry missing');
html=html.replace('</body>',`${loader}\n</body>`);
fs.writeFileSync(p('index.html'),html);

const info=JSON.parse(read('axis-build.json'));
if(info.architecture!=='hardened-chunk-kernel')fail(`unexpected base architecture ${info.architecture}`);
info.version=TARGET_VERSION;
info.baseVersion=BASE_VERSION;
info.architecture='hardened-chunk-kernel+nonblocking-feature';
info.featureKernel={blocking:false,feature:FEATURE_FILE,hash:featureHash,maxBytes:MAX_FEATURE_BYTES,timeoutMs:4500,loadAfter:'stable kernel complete + healthy + idle',fallback:BASE_VERSION,versionOwner:'monotonic'};
info.gates={...(info.gates||{}),optionalRuntimeSyntax:true,optionalRuntimeBudget:true,optionalRuntimeContract:true,optionalRuntimeNonBlocking:true};
fs.writeFileSync(p('axis-build.json'),JSON.stringify(info,null,2));

const fresh=p('fresh/index.html');
if(fs.existsSync(fresh)){
  let f=fs.readFileSync(fresh,'utf8');
  f=f.replace(/8\.7\.11 · 正在清理旧启动缓存/g,`${TARGET_VERSION} · 正在清理旧启动缓存`);
  fs.writeFileSync(fresh,f);
}
console.log(`[AXIS] hardened feature gate passed · ${TARGET_VERSION} · ${featureHash}`);
console.log('[AXIS] feature loads only after a healthy completed stable kernel; any failure stays on 8.7.11.');
