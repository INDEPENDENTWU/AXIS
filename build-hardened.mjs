import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const VERSION='8.7.11';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const write=(f,s)=>fs.writeFileSync(path.join(ROOT,f),s);
const exists=f=>fs.existsSync(path.join(ROOT,f));
const fail=m=>{throw new Error(`AXIS hardened gate: ${m}`)};

const coreModules=[
  ['app.js','__AXIS_CORE_READY__'],
  ['v61.js','__AXIS_61_READY__']
];
const chunks=[
  {id:'foundation',modules:[
    ['v82-runtime.js','__AXIS_82_READY__'],['v83-reminders.js','__AXIS_83_READY__'],['v84-runtime.js','__AXIS_84_READY__'],
    ['v85-runtime.js','__AXIS_85_READY__'],['v85-canvas-fix.js','__AXIS_85_CANVAS_READY__'],['v86-runtime.js','__AXIS_86_READY__'],
    ['v86-gesture.js','__AXIS_86_GESTURE_READY__'],['v87-runtime.js','__AXIS_87_READY__'],['v87-fix.js','__AXIS_87_FIX_READY__'],
    ['v871-fix.js','__AXIS_871_READY__'],['v872-fix.js','__AXIS_872_READY__']
  ]},
  {id:'recording',modules:[
    ['v873-exercise-library.js','__AXIS_873_LIBRARY_READY__'],['v873-smart-input.js','__AXIS_873_READY__'],
    ['v874-professional.js','__AXIS_874_READY__'],['v874-set-bridge.js','__AXIS_874_SET_READY__'],['v875-polish.js','__AXIS_875_READY__']
  ]},
  {id:'interaction',modules:[
    ['v876-runtime.js','__AXIS_876_READY__'],['v877-runtime.js','__AXIS_877_READY__'],['v878-stability.js','__AXIS_878_READY__'],['v879-runtime.js','__AXIS_879_READY__']
  ]},
  {id:'product',modules:[
    ['v8710-live-catalog.js','__AXIS_8710_LIVE_READY__'],['v8710-sonic-core.js','__AXIS_8710_SONIC_CORE_READY__'],
    ['v8710-sonic-motifs.js','__AXIS_8710_SONIC_MOTIFS_READY__'],['v8710-sound-ui.js','__AXIS_8710_SOUND_READY__'],
    ['v8710-report.js','__AXIS_8710_REPORT_READY__'],['v8710-watermark.js','__AXIS_8710_WATERMARK_READY__'],['v8711-runtime.js','__AXIS_8711_READY__']
  ]}
];
const allModules=[...coreModules,...chunks.flatMap(c=>c.modules)];
const required=[...allModules.map(x=>x[0]),'styles.css','v61.css','index.html','owner.html','sw.js',
  'api/analyze.js','api/insight.js','api/ai-status.js','api/owner-config.js',
  'cloud-functions/api/analyze.js','cloud-functions/api/insight.js','cloud-functions/api/ai-status.js','cloud-functions/api/owner-config.js'];
for(const f of required)if(!exists(f))fail(`missing ${f}`);

const sourceIndex=read('index.html');
for(const id of ['settingsBtn','todayView','activeHome','idleHome','eventList','scanSheet','reviewStage','equipmentName','settingsSheet','reportSheet','watermarkSheet','toast']){
  if(!sourceIndex.includes(`id="${id}"`))fail(`missing DOM #${id}`);
}

function normalizeReleaseVersion(src){
  return src
    .replace(/`版本 \$\{VERSION\}`/g,'`版本 ${window.__AXIS_RELEASE__||VERSION}`')
    .replace(/\.dataset\.axisVersion=VERSION/g,'.dataset.axisVersion=window.__AXIS_RELEASE__||VERSION')
    .replace(/window\.__AXIS_VERSION__=VERSION/g,'window.__AXIS_VERSION__=window.__AXIS_RELEASE__||VERSION');
}
function syntaxGate(src,label){try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}}
function isolated(file,flag,name){
  const src=normalizeReleaseVersion(read(file));
  syntaxGate(src,file);
  return `\n/* ===== ${file} ===== */\nfunction ${name}(){\n  const t0=performance.now();\n  try{\n${src}\n    window.${flag}=true;\n    return {ok:true,ms:performance.now()-t0};\n  }catch(e){\n    window.${flag}=false;\n    console.error('[AXIS module] ${file}',e);\n    return {ok:false,ms:performance.now()-t0,error:String(e&&e.message||e)};\n  }\n}\n`;
}

const safeObserver=`(()=>{'use strict';
const NativeMO=window.MutationObserver;
if(NativeMO&&!window.__AXIS_NATIVE_MUTATION_OBSERVER__){
  window.__AXIS_NATIVE_MUTATION_OBSERVER__=NativeMO;
  class AxisSafeMutationObserver{
    constructor(cb){this.cb=cb;this.native=[];this.queue=[];this.timer=0}
    _push(records){this.queue.push(...records);if(this.timer)return;this.timer=setTimeout(()=>{this.timer=0;const q=this.queue.splice(0);try{this.cb(q,this)}catch(e){console.warn('[AXIS observer]',e)}},48)}
    _watch(target,opts){if(!target)return;const o=new NativeMO(r=>this._push(r));o.observe(target,opts);this.native.push(o)}
    observe(target,opts={}){
      if(target===document.body&&opts.subtree&&(opts.attributes||opts.childList)){
        const sels=['#scanSheet','#reviewStage','#settingsSheet','#finishSheet','#todayView','#activeHome','#idleHome','#eqSheet','#reportSheet','#watermarkSheet','#detailSheet'];
        if(opts.attributes)for(const sel of sels){const el=document.querySelector(sel);if(el)this._watch(el,{attributes:true,attributeFilter:['class']})}
        if(opts.childList){this._watch(document.body,{childList:true});const ev=document.querySelector('#eventList');if(ev)this._watch(ev,{childList:true})}
        return;
      }
      this._watch(target,opts);
    }
    disconnect(){clearTimeout(this.timer);this.timer=0;this.queue.length=0;for(const o of this.native)o.disconnect();this.native=[]}
    takeRecords(){return this.native.flatMap(o=>o.takeRecords())}
  }
  window.MutationObserver=AxisSafeMutationObserver;
}
})();\n`;

let coreDefs='';
coreModules.forEach(([f,flag],i)=>coreDefs+=isolated(f,flag,`__axis_core_${i}`));

const chunkAssets=[];
for(const chunk of chunks){
  let defs='';
  chunk.modules.forEach(([f,flag],i)=>defs+=isolated(f,flag,`__axis_${chunk.id}_${i}`));
  const runner=`(()=>{'use strict';\n${defs}\nconst id='${chunk.id}',names=${JSON.stringify(chunk.modules.map(x=>x[0]))},mods=[${chunk.modules.map((_,i)=>`__axis_${chunk.id}_${i}`).join(',')}];\nconst diag=window.__AXIS_ENHANCE_DIAG__||(window.__AXIS_ENHANCE_DIAG__={startedAt:Date.now(),chunks:{},errors:[]});\nconst cd=diag.chunks[id]={startedAt:Date.now(),modules:[]};\nfor(let i=0;i<mods.length;i++){\n  diag.currentChunk=id;diag.currentModule=names[i];\n  if(names[i]==='v85-runtime.js'){\n    if(window.CanvasRenderingContext2D&&!window.__AXIS_NATIVE_DRAWIMAGE__)window.__AXIS_NATIVE_DRAWIMAGE__=CanvasRenderingContext2D.prototype.drawImage;\n    if(window.HTMLCanvasElement&&!window.__AXIS_NATIVE_TOBLOB__)window.__AXIS_NATIVE_TOBLOB__=HTMLCanvasElement.prototype.toBlob;\n  }\n  const r=mods[i]();cd.modules.push({name:names[i],...r});if(!r.ok)diag.errors.push({chunk:id,module:names[i],error:r.error});\n}\ncd.finishedAt=Date.now();cd.ms=cd.finishedAt-cd.startedAt;\nwindow['__AXIS_CHUNK_'+id.toUpperCase()+'_READY__']=true;\n})();\n`;
  syntaxGate(runner,`chunk ${chunk.id}`);
  const h=hash(runner),file=`axis-enhance-${chunk.id}.js`;
  write(file,runner);
  chunkAssets.push({id,file,hash:h,modules:chunk.modules.map(x=>x[0]),bytes:Buffer.byteLength(runner)});
}

const bootGuard=`(()=>{'use strict';
window.__AXIS_RELEASE__='${VERSION}';
window.__AXIS_VERSION__='${VERSION}';
window.__AXIS_ARCH__='hardened-chunk-kernel';
window.__AXIS_BOOT_READY__=true;
window.__AXIS_LATEST_LOADING__=false;
window.__AXIS_HYDRATING__=false;
try{
  if('serviceWorker'in navigator){
    const sw=navigator.serviceWorker;
    try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}catch{try{sw.register=()=>Promise.resolve(null)}catch{}}
    sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{});
  }
}catch{}
window.addEventListener('error',e=>{try{console.error('[AXIS runtime]',e.error||e.message||e)}catch{}},{passive:true});
})();\n`+safeObserver;

const manifest=chunkAssets.map(x=>({id:x.id,src:`/${x.file}?v=${x.hash}`,flag:`__AXIS_CHUNK_${x.id.toUpperCase()}_READY__`}));
const kernel=`\n(()=>{'use strict';
__axis_core_0();__axis_core_1();
window.__AXIS_CORE_INTERACTIVE__=true;
document.documentElement.dataset.axisCoreReady='1';
const version=document.querySelector('.versionLine');if(version){version.textContent='版本 ${VERSION}';version.style.visibility='visible';version.dataset.axisVersion='${VERSION}'}
const manifest=${JSON.stringify(manifest)};
const diag=window.__AXIS_ENHANCE_DIAG__||(window.__AXIS_ENHANCE_DIAG__={startedAt:0,chunks:{},errors:[]});
const delay=ms=>new Promise(r=>setTimeout(r,ms));
const loadChunk=entry=>new Promise(resolve=>{
  const started=Date.now();
  const s=document.createElement('script');s.src=entry.src;s.async=true;s.dataset.axisChunk=entry.id;
  let done=false;
  const finish=(ok,reason='')=>{if(done)return;done=true;clearTimeout(timer);if(!ok)diag.errors.push({chunk:entry.id,error:reason||'load-failed'});resolve({ok,ms:Date.now()-started,reason})};
  const timer=setTimeout(()=>{try{s.remove()}catch{};finish(false,'timeout')},4500);
  s.onload=()=>finish(window[entry.flag]===true,window[entry.flag]===true?'':'ready-flag-missing');
  s.onerror=()=>finish(false,'network');
  (document.head||document.documentElement).appendChild(s);
});
const run=async()=>{
  if(window.__AXIS_STABLE_KERNEL_STARTED__)return;window.__AXIS_STABLE_KERNEL_STARTED__=true;
  diag.startedAt=Date.now();diag.kernel='running';
  for(let i=0;i<manifest.length;i++){
    const entry=manifest[i];diag.currentChunk=entry.id;diag.currentModule=null;
    const r=await loadChunk(entry);if(!r.ok)console.warn('[AXIS chunk]',entry.id,r.reason);
    await delay(24);
  }
  diag.finishedAt=Date.now();diag.totalMs=diag.finishedAt-diag.startedAt;diag.currentChunk=null;diag.currentModule=null;diag.kernel=diag.errors.length?'degraded':'ready';
  window.__AXIS_LATEST_READY__=true;window.__AXIS_STABLE_COMPLETE__=true;window.__AXIS_STABLE_DEGRADED__=diag.errors.length>0;
  window.__AXIS_BOOT_WATCHDOG__=diag.errors.length?'degraded':'ready';
  document.documentElement.dataset.axisReady='1';
};
const schedule=()=>setTimeout(run,220);
if(document.readyState==='complete')schedule();else window.addEventListener('load',schedule,{once:true});
setTimeout(()=>{if(!window.__AXIS_STABLE_COMPLETE__){window.__AXIS_BOOT_WATCHDOG__='core-healthy';document.documentElement.dataset.axisCoreOnly='1'}},7000);
})();\n`;

let coreBundle=bootGuard+coreDefs+kernel;
syntaxGate(coreBundle,'core bundle');
const coreHash=hash(coreBundle);write('axis-core.js',coreBundle);

const cssFiles=['styles.css','v61.css'];
let css=cssFiles.map(f=>`/* ===== ${f} ===== */\n${read(f)}`).join('\n\n');
css+=`\n/* AXIS ${VERSION} hardened boot */\nhtml:not([data-axis-core-ready="1"]) .versionLine{visibility:hidden}\n`;
if(Buffer.byteLength(css)<20000)fail('stylesheet bundle unexpectedly small');
const cssHash=hash(css);write('axis-style.css',css);

let html=sourceIndex
  .replace(/<link rel="stylesheet" href="\/(?:styles|v61|axis-style)\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<script src="\/(?:edge-bootstrap|app|v61|axis-runtime|axis-core)\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<!-- AXIS_FEATURE_LOADER_START -->[\s\S]*?<!-- AXIS_FEATURE_LOADER_END -->\s*/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="/axis-style.css?v=${cssHash}">\n</head>`);
html=html.replace('</body>',`<script src="/axis-core.js?v=${coreHash}" defer></script>\n</body>`);
const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
const styles=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m=>m[1]);
if(scripts.length!==1||!scripts[0].startsWith('/axis-core.js?v='))fail(`bad core entry ${scripts.join(',')}`);
if(styles.length!==1||!styles[0].startsWith('/axis-style.css?v='))fail(`bad stylesheet ${styles.join(',')}`);
write('index.html',html);

const releaseHash=hash(coreHash+cssHash+chunkAssets.map(x=>x.hash).join(''));
const fresh=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}main{min-height:100dvh;display:grid;place-items:center;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12px}</style></head><body><main><div><b>AXIS</b><span>${VERSION} · 正在清理旧启动缓存</span></div></main><script>(async()=>{try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}location.replace('/?fresh=${releaseHash}')} )();</script></body></html>`;
fs.mkdirSync(path.join(ROOT,'fresh'),{recursive:true});write('fresh/index.html',fresh);

const sw=read('sw.js');if(!/unregister\(\)/.test(sw)||!/skipWaiting\(\)/.test(sw))fail('service worker kill switch missing');

const info={
  version:VERSION,releaseHash,architecture:'hardened-chunk-kernel',
  assets:{core:coreHash,css:cssHash,chunks:chunkAssets.map(x=>({id:x.id,file:x.file,hash:x.hash,bytes:x.bytes,modules:x.modules}))},
  requests:{initialJavascript:1,stableChunks:chunkAssets.length,stylesheet:1},
  boot:{coreModules:coreModules.map(x=>x[0]),stableChunks:chunks.map(x=>({id:x.id,modules:x.modules.map(m=>m[0])})),bodyMutationObserverGuard:true,legacyDynamicVersionChain:false,requestAnimationFrameBootDependency:false,releaseOwner:VERSION},
  gates:{javascriptSyntax:true,criticalDom:true,serviceWorkerKillSwitch:true,contentHashedAssets:true,moduleIsolation:true,chunkTimeout:true,noRafBootDependency:true},
  generatedAt:new Date().toISOString()
};
write('axis-build.json',JSON.stringify(info,null,2));
console.log(`[AXIS] ${VERSION} hardened production gate passed · ${releaseHash}`);
console.log(`[AXIS] core ${(Buffer.byteLength(coreBundle)/1024).toFixed(1)} KiB · css ${(Buffer.byteLength(css)/1024).toFixed(1)} KiB`);
for(const x of chunkAssets)console.log(`[AXIS] chunk ${x.id} ${(x.bytes/1024).toFixed(1)} KiB · ${x.modules.length} modules`);
console.log('[AXIS] boot: core first; bounded sequential chunks; no requestAnimationFrame dependency; fail-open stable kernel.');
