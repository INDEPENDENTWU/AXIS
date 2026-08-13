import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const VERSION='8.7.8';
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);

const coreModules=[
  ['app.js','__AXIS_CORE_READY__'],
  ['v61.js','__AXIS_61_READY__']
];
const enhanceModules=[
  ['v82-runtime.js','__AXIS_82_READY__'],
  ['v83-reminders.js','__AXIS_83_READY__'],
  ['v84-runtime.js','__AXIS_84_READY__'],
  ['v85-runtime.js','__AXIS_85_READY__'],
  ['v85-canvas-fix.js','__AXIS_85_CANVAS_READY__'],
  ['v86-runtime.js','__AXIS_86_READY__'],
  ['v86-gesture.js','__AXIS_86_GESTURE_READY__'],
  ['v87-runtime.js','__AXIS_87_READY__'],
  ['v87-fix.js','__AXIS_87_FIX_READY__'],
  ['v871-fix.js','__AXIS_871_READY__'],
  ['v872-fix.js','__AXIS_872_READY__'],
  ['v873-exercise-library.js','__AXIS_873_LIBRARY_READY__'],
  ['v873-smart-input.js','__AXIS_873_READY__'],
  ['v874-professional.js','__AXIS_874_READY__'],
  ['v874-set-bridge.js','__AXIS_874_SET_READY__'],
  ['v875-polish.js','__AXIS_875_READY__'],
  ['v876-runtime.js','__AXIS_876_READY__'],
  ['v877-runtime.js','__AXIS_877_READY__']
];
const allModules=[...coreModules,...enhanceModules];

const requiredFiles=[
  ...allModules.map(x=>x[0]),'styles.css','v61.css','index.html','owner.html','sw.js',
  'api/analyze.js','api/insight.js','api/ai-status.js','api/owner-config.js',
  'cloud-functions/api/analyze.js','cloud-functions/api/insight.js','cloud-functions/api/ai-status.js','cloud-functions/api/owner-config.js'
];
for(const file of requiredFiles){if(!fs.existsSync(path.join(ROOT,file)))throw new Error(`AXIS production gate: missing ${file}`)}

const sourceIndex=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const requiredDom=['settingsBtn','todayView','activeHome','eventList','scanSheet','reviewStage','equipmentName','settingsSheet','reportSheet','watermarkSheet','toast'];
for(const id of requiredDom){if(!sourceIndex.includes(`id="${id}"`))throw new Error(`AXIS production gate: missing DOM #${id}`)}

const safeObserver=`(()=>{'use strict';
const NativeMO=window.MutationObserver;
if(NativeMO&&!window.__AXIS_NATIVE_MUTATION_OBSERVER__){
  window.__AXIS_NATIVE_MUTATION_OBSERVER__=NativeMO;
  class AxisSafeMutationObserver{
    constructor(cb){this.cb=cb;this.native=[];this.queue=[];this.timer=0}
    _push(records){this.queue.push(...records);if(this.timer)return;this.timer=setTimeout(()=>{this.timer=0;const q=this.queue.splice(0);try{this.cb(q,this)}catch(e){console.warn('[AXIS] observer callback isolated',e)}},48)}
    _watch(target,opts){if(!target)return;const o=new NativeMO(r=>this._push(r));o.observe(target,opts);this.native.push(o)}
    observe(target,opts={}){
      if(target===document.body&&opts.subtree&&(opts.attributes||opts.childList)){
        const sels=['#scanSheet','#reviewStage','#settingsSheet','#finishSheet','#todayView','#activeHome','#eqSheet','#reportSheet','#watermarkSheet','#detailSheet'];
        if(opts.attributes){for(const sel of sels){const el=document.querySelector(sel);if(el)this._watch(el,{attributes:true,attributeFilter:['class']})}}
        if(opts.childList){
          this._watch(document.body,{childList:true});
          const ev=document.querySelector('#eventList');if(ev)this._watch(ev,{childList:true});
        }
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

const bootGuard=`(()=>{'use strict';
window.__AXIS_RELEASE__='${VERSION}';window.__AXIS_ARCH__='progressive-core-enhance';window.__AXIS_BOOT_READY__=true;
try{if('serviceWorker'in navigator){const sw=navigator.serviceWorker;try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}catch{try{sw.register=()=>Promise.resolve(null)}catch{}}sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{})}}catch{}
window.addEventListener('error',e=>{try{console.error('[AXIS runtime]',e.error||e.message||e)}catch{}},{passive:true});
})();\n`+safeObserver;

function isolatedSource(file,flag,index,label){
  const src=fs.readFileSync(path.join(ROOT,file),'utf8');
  return `\n/* ===== ${file} ===== */\nfunction __axis_${label}_${index}(){try{\n${src}\nwindow.${flag}=true;return true}catch(e){window.${flag}=false;console.error('[AXIS] ${file} isolated',e);return false}}\n`;
}

let enhanceDefs='';
enhanceModules.forEach(([f,flag],i)=>enhanceDefs+=isolatedSource(f,flag,i,'enh'));
let enhanceBundle=`(()=>{'use strict';window.__AXIS_LATEST_LOADING__=true;})();\n`+enhanceDefs;
enhanceBundle+=`\n(async()=>{'use strict';
const mods=[${enhanceModules.map((_,i)=>`__axis_enh_${i}`).join(',')}];
const names=${JSON.stringify(enhanceModules.map(x=>x[0]))};
const turn=()=>new Promise(r=>setTimeout(r,0));
const frame=()=>new Promise(r=>requestAnimationFrame(()=>r()));
try{
  for(let i=0;i<mods.length;i++){
    if(names[i]==='v85-runtime.js'){
      if(window.CanvasRenderingContext2D&&!window.__AXIS_NATIVE_DRAWIMAGE__)window.__AXIS_NATIVE_DRAWIMAGE__=CanvasRenderingContext2D.prototype.drawImage;
      if(window.HTMLCanvasElement&&!window.__AXIS_NATIVE_TOBLOB__)window.__AXIS_NATIVE_TOBLOB__=HTMLCanvasElement.prototype.toBlob;
    }
    mods[i]();
    await turn();
    if(i>0&&i%4===0)await frame();
  }
  window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true;window.__AXIS_HYDRATING__=false;window.__AXIS_BOOT_WATCHDOG__='ready';
  document.documentElement.dataset.axisReady='1';
}catch(e){window.__AXIS_LATEST_LOADING__=false;window.__AXIS_HYDRATING__=false;window.__AXIS_BOOT_WATCHDOG__='degraded';console.error('[AXIS] enhancement hydration',e)}
const v=document.querySelector('.versionLine');if(v){v.textContent='版本 ${VERSION}';v.style.visibility='visible';v.dataset.axisVersion='${VERSION}'}
})();\n`;
new Function(enhanceBundle);
const enhanceHash=hash(enhanceBundle);
fs.writeFileSync(path.join(ROOT,'axis-enhance.js'),enhanceBundle);

let coreDefs='';
coreModules.forEach(([f,flag],i)=>coreDefs+=isolatedSource(f,flag,i,'core'));
let coreBundle=bootGuard+coreDefs;
coreBundle+=`\n(()=>{'use strict';
__axis_core_0();__axis_core_1();
window.__AXIS_VERSION__='${VERSION}';window.__AXIS_CORE_INTERACTIVE__=true;document.documentElement.dataset.axisCoreReady='1';
const vv=document.querySelector('.versionLine');if(vv){vv.textContent='版本 ${VERSION}';vv.style.visibility='visible';vv.dataset.axisVersion='${VERSION}'}
const clean=()=>{try{const u=new URL(location.href);if(u.searchParams.has('boot')||u.searchParams.has('fresh')){u.searchParams.delete('boot');u.searchParams.delete('fresh');history.replaceState(history.state,'',u.pathname+(u.searchParams.size?'?'+u.searchParams.toString():'')+u.hash)}}catch{}};
const loadEnhance=()=>{if(window.__AXIS_ENHANCE_REQUESTED__||window.__AXIS_LATEST_READY__)return;window.__AXIS_ENHANCE_REQUESTED__=true;window.__AXIS_HYDRATING__=true;const s=document.createElement('script');s.src='/axis-enhance.js?v=${enhanceHash}';s.async=true;s.onload=()=>{setTimeout(clean,80)};s.onerror=()=>{window.__AXIS_HYDRATING__=false;window.__AXIS_LATEST_LOADING__=false;window.__AXIS_BOOT_WATCHDOG__='core-only';console.error('[AXIS] enhancement network unavailable');clean()};(document.head||document.documentElement).appendChild(s)};
if(document.readyState==='complete')setTimeout(loadEnhance,180);else window.addEventListener('load',()=>setTimeout(loadEnhance,180),{once:true});
})();\n`;
new Function(coreBundle);
const coreHash=hash(coreBundle);
fs.writeFileSync(path.join(ROOT,'axis-core.js'),coreBundle);

const cssFiles=['styles.css','v61.css'];
let css=cssFiles.map(f=>`/* ===== ${f} ===== */\n${fs.readFileSync(path.join(ROOT,f),'utf8')}`).join('\n\n');
css+=`\n/* AXIS 8.7.8 progressive boot */\nhtml:not([data-axis-core-ready="1"]) .versionLine{visibility:hidden}\n`;
if(Buffer.byteLength(css)<20000)throw new Error('AXIS production gate: stylesheet bundle unexpectedly small');
const cssHash=hash(css);fs.writeFileSync(path.join(ROOT,'axis-style.css'),css);

let html=sourceIndex
  .replace(/<link rel="stylesheet" href="\/styles\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<link rel="stylesheet" href="\/v61\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<link rel="stylesheet" href="\/axis-style\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<script src="\/edge-bootstrap\.js(?:\?[^\"]*)?"><\/script>\s*/g,'')
  .replace(/<script src="\/app\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/v61\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/axis-runtime\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/axis-core\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="/axis-style.css?v=${cssHash}">\n</head>`);
html=html.replace('</body>',`<script src="/axis-core.js?v=${coreHash}" defer></script>\n</body>`);
const externalScripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
const externalStyles=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m=>m[1]);
if(externalScripts.length!==1||!externalScripts[0].startsWith('/axis-core.js?v='))throw new Error(`AXIS production gate: bad core entry ${externalScripts.join(',')}`);
if(externalStyles.length!==1||!externalStyles[0].startsWith('/axis-style.css?v='))throw new Error(`AXIS production gate: bad stylesheet ${externalStyles.join(',')}`);
if(/edge-bootstrap|\/app\.js|\/v61\.js|axis-runtime\.js/.test(html))throw new Error('AXIS production gate: legacy bootstrap remains in HTML');
fs.writeFileSync(path.join(ROOT,'index.html'),html);

const releaseHash=hash(coreHash+enhanceHash+cssHash);
const fresh=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}main{min-height:100dvh;display:grid;place-items:center;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12px}</style></head><body><main><div><b>AXIS</b><span>8.7.8 · 正在清理旧启动缓存</span></div></main><script>(async()=>{try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)))}}catch{}location.replace('/?fresh=${releaseHash}')} )();</script></body></html>`;
fs.mkdirSync(path.join(ROOT,'fresh'),{recursive:true});fs.writeFileSync(path.join(ROOT,'fresh','index.html'),fresh);

const sw=fs.readFileSync(path.join(ROOT,'sw.js'),'utf8');if(!/unregister\(\)/.test(sw)||!/skipWaiting\(\)/.test(sw))throw new Error('AXIS production gate: service worker kill switch missing');
const info={version:VERSION,releaseHash,architecture:'progressive-core-enhance',assets:{core:coreHash,enhance:enhanceHash,css:cssHash},requests:{initialJavascript:1,deferredJavascript:1,stylesheet:1},boot:{coreModules:coreModules.map(x=>x[0]),enhanceModules:enhanceModules.map(x=>x[0]),bodyMutationObserverGuard:true,legacyDynamicVersionChain:false},gates:{javascriptSyntax:true,criticalDom:true,apiPresence:true,serviceWorkerKillSwitch:true,contentHashedAssets:true,legacyBootstrapRemoved:true},generatedAt:new Date().toISOString()};
fs.writeFileSync(path.join(ROOT,'axis-build.json'),JSON.stringify(info,null,2));
console.log(`[AXIS] ${VERSION} production gate passed · ${releaseHash}`);
console.log(`[AXIS] core ${(Buffer.byteLength(coreBundle)/1024).toFixed(1)} KiB · enhance ${(Buffer.byteLength(enhanceBundle)/1024).toFixed(1)} KiB · css ${(Buffer.byteLength(css)/1024).toFixed(1)} KiB`);
console.log('[AXIS] boot: interactive core first; one deferred enhancement bundle; content-hashed cache keys; guarded body observers');
