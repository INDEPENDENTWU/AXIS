import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const BASE_VERSION='8.7.11';
const TARGET_VERSION='8.7.12';
const FEATURE_FILE='v8712-runtime.js';
const MAX_FEATURE_BYTES=64*1024;

const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const fail=m=>{throw new Error(`AXIS feature gate: ${m}`)};

for(const p of ['index.html','axis-core.js','axis-enhance.js','axis-style.css','axis-build.json',FEATURE_FILE]){
  if(!fs.existsSync(path.join(ROOT,p))) fail(`missing ${p}`);
}

const feature=read(FEATURE_FILE);
if(Buffer.byteLength(feature)>MAX_FEATURE_BYTES) fail(`${FEATURE_FILE} exceeds ${MAX_FEATURE_BYTES/1024} KiB budget`);
try{new Function(feature)}catch(e){fail(`${FEATURE_FILE} syntax ${e.message}`)}

const forbidden=[
  ['global loading flag',/__AXIS_LATEST_LOADING__|__AXIS_HYDRATING__|__AXIS_BOOT_WATCHDOG__/],
  ['service worker mutation',/serviceWorker\s*\.|navigator\.serviceWorker/],
  ['full page mutation observer',/observe\s*\(\s*document\.body/],
  ['permanent interval',/setInterval\s*\(/],
  ['forced reload/navigation',/location\.(?:reload|replace|assign)\s*\(/],
  ['document replacement',/document\.(?:body|documentElement)\.innerHTML\s*=/],
  ['busy loop',/while\s*\(\s*true\s*\)|for\s*\(\s*;\s*;\s*\)/]
];
for(const [name,re] of forbidden){if(re.test(feature))fail(`${FEATURE_FILE} violates ${name}`)}

let html=read('index.html');
if(!html.includes('/axis-core.js?v=')) fail('stable core entry missing');
if(!html.includes('/axis-style.css?v=')) fail('stable stylesheet entry missing');

const featureHash=hash(feature);
const loader=`<!-- AXIS_FEATURE_LOADER_START -->\n<script>(()=>{'use strict';\nconst BASE='${BASE_VERSION}',TARGET='${TARGET_VERSION}',SRC='/${FEATURE_FILE}?v=${featureHash}';\nif(window.__AXIS_FEATURE_KERNEL__)return;\nconst kernel=window.__AXIS_FEATURE_KERNEL__={state:'waiting',base:BASE,target:TARGET,errors:[],startedAt:Date.now()};\nconst setVersion=v=>{window.__AXIS_RELEASE__=v;window.__AXIS_VERSION__=v;const el=document.querySelector('.versionLine');if(el){el.textContent='版本 '+v;el.dataset.axisVersion=v;el.style.visibility='visible'}};\nconst baseHealthy=()=>!!(window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_LATEST_READY__&&document.documentElement.dataset.axisCoreReady==='1');\nconst fail=(reason,err)=>{kernel.state='base';kernel.errors.push(String(reason));if(err)console.warn('[AXIS feature]',reason,err);setVersion(BASE)};\nconst verify=()=>{if(window.__AXIS_8712_READY__){kernel.state='ready';kernel.readyAt=Date.now();setVersion(TARGET);return true}return false};\nconst load=()=>{\n  if(kernel.state!=='waiting')return;\n  if(!baseHealthy()){fail('base-not-ready');return}\n  kernel.state='loading';\n  const s=document.createElement('script');s.src=SRC;s.async=true;s.dataset.axisFeature='8712';\n  const timer=setTimeout(()=>{try{s.remove()}catch{};if(kernel.state==='loading')fail('feature-timeout')},4500);\n  s.onload=()=>{clearTimeout(timer);if(!verify()){setTimeout(()=>{if(!verify())fail('feature-not-ready')},250)}};\n  s.onerror=e=>{clearTimeout(timer);fail('feature-network',e)};\n  (document.head||document.documentElement).appendChild(s);\n};\nconst schedule=()=>{\n  const run=()=>setTimeout(load,1200);\n  if('requestIdleCallback'in window)requestIdleCallback(run,{timeout:2600});else setTimeout(run,1800);\n};\nif(document.readyState==='complete')schedule();else window.addEventListener('load',schedule,{once:true});\nsetTimeout(()=>{if(kernel.state==='waiting'&&!baseHealthy())fail('base-watchdog')},7000);\n})();</script>\n<!-- AXIS_FEATURE_LOADER_END -->`;

html=html.replace(/<!-- AXIS_FEATURE_LOADER_START -->[\s\S]*?<!-- AXIS_FEATURE_LOADER_END -->\s*/g,'');
html=html.replace('</body>',`${loader}\n</body>`);
fs.writeFileSync(path.join(ROOT,'index.html'),html);

const info=JSON.parse(read('axis-build.json'));
info.version=TARGET_VERSION;
info.baseVersion=BASE_VERSION;
info.architecture='stable-base+nonblocking-features';
info.featureKernel={
  blocking:false,
  feature:FEATURE_FILE,
  hash:featureHash,
  maxBytes:MAX_FEATURE_BYTES,
  timeoutMs:4500,
  loadAfter:'window.load + idle + stable base ready',
  fallback:BASE_VERSION,
  forbidden:forbidden.map(x=>x[0])
};
info.gates={...(info.gates||{}),featureSyntax:true,featureBudget:true,featureContract:true,featureNonBlocking:true};
fs.writeFileSync(path.join(ROOT,'axis-build.json'),JSON.stringify(info,null,2));

const fresh=path.join(ROOT,'fresh','index.html');
if(fs.existsSync(fresh)){
  let f=fs.readFileSync(fresh,'utf8');
  f=f.replace(/8\.7\.11 · 正在清理旧启动缓存/g,`${TARGET_VERSION} · 正在清理旧启动缓存`);
  fs.writeFileSync(fresh,f);
}

console.log(`[AXIS] feature contract passed · ${TARGET_VERSION} · ${featureHash}`);
console.log('[AXIS] stable 8.7.11 boot remains authoritative; 8.7.12 is fail-open and non-blocking.');
