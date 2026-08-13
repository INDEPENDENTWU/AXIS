import fs from 'node:fs';
import path from 'node:path';

const ROOT=process.cwd();
const VERSION='8.7.8';
const BUILD='878';

const modules=[
  ['app.js','__AXIS_CORE_READY__'],
  ['v61.js','__AXIS_61_READY__'],
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
  ['v877-runtime.js','__AXIS_877_READY__'],
  ['v878-stability.js','__AXIS_878_READY__']
];

const requiredFiles=[
  ...modules.map(x=>x[0]),
  'styles.css','v61.css','index.html','owner.html',
  'api/analyze.js','api/insight.js','api/ai-status.js','api/owner-config.js',
  'cloud-functions/api/analyze.js','cloud-functions/api/insight.js','cloud-functions/api/ai-status.js','cloud-functions/api/owner-config.js'
];
for(const file of requiredFiles){
  if(!fs.existsSync(path.join(ROOT,file))) throw new Error(`AXIS production gate: missing ${file}`);
}

const sourceIndex=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const requiredDom=['settingsBtn','todayView','activeHome','eventList','scanSheet','reviewStage','equipmentName','settingsSheet','reportSheet','watermarkSheet','toast'];
for(const id of requiredDom){
  if(!sourceIndex.includes(`id="${id}"`)) throw new Error(`AXIS production gate: missing DOM #${id}`);
}

const prologue=`(()=>{'use strict';\n`+
`window.__AXIS_RELEASE__='${VERSION}';window.__AXIS_BUILD__='${BUILD}';window.__AXIS_BOOT_READY__=true;window.__AXIS_LATEST_LOADING__=true;window.__AXIS_ARCH__='single-runtime';\n`+
`try{if('serviceWorker'in navigator){const sw=navigator.serviceWorker;try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}catch{try{sw.register=()=>Promise.resolve(null)}catch{}}sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{})}}catch{}\n`+
`window.addEventListener('error',e=>{try{console.error('[AXIS runtime]',e.error||e.message||e)}catch{}},{passive:true});\n`+
`})();\n`;

let bundle=prologue;
for(const [file,flag] of modules){
  const src=fs.readFileSync(path.join(ROOT,file),'utf8');
  // Isolate runtime exceptions so one optional enhancement cannot blank the product.
  bundle+=`\n/* ===== ${file} ===== */\ntry{\n${src}\nwindow.${flag}=true;\n}catch(e){window.${flag}=false;console.error('[AXIS] ${file} isolated',e);}\n`;
}
bundle+=`\n(()=>{window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true;window.__AXIS_BOOT_WATCHDOG__='ready';window.__AXIS_VERSION__='${VERSION}';const v=document.querySelector('.versionLine');if(v){v.textContent='版本 ${VERSION}';v.style.visibility='visible';v.dataset.axisVersion='${VERSION}'}document.documentElement.dataset.axisReady='1';})();\n`;

// Syntax gate: deployment stops before production if any source became invalid JS.
new Function(bundle);
if(bundle.includes("loadScript('/v82-runtime.js")||bundle.includes('AXIS_LATEST_LOADING__||window.__AXIS_LATEST_READY__')){
  throw new Error('AXIS production gate: legacy dynamic bootstrap leaked into bundle');
}
if(!bundle.includes("VERSION='8.7.8'")&&!bundle.includes("VERSION='8.7.8';")){
  throw new Error('AXIS production gate: 8.7.8 runtime not present');
}
fs.writeFileSync(path.join(ROOT,'axis-runtime.js'),bundle);

const cssFiles=['styles.css','v61.css'];
const css=cssFiles.map(f=>`/* ===== ${f} ===== */\n${fs.readFileSync(path.join(ROOT,f),'utf8')}`).join('\n\n');
if(Buffer.byteLength(css)<20000)throw new Error('AXIS production gate: stylesheet bundle unexpectedly small');
fs.writeFileSync(path.join(ROOT,'axis-style.css'),css);

let html=sourceIndex
  .replace(/<link rel="stylesheet" href="\/styles\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<link rel="stylesheet" href="\/v61\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<link rel="stylesheet" href="\/axis-style\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<script src="\/edge-bootstrap\.js(?:\?[^\"]*)?"><\/script>\s*/g,'')
  .replace(/<script src="\/app\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/v61\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/axis-runtime\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="/axis-style.css?v=${BUILD}">\n</head>`);
html=html.replace('</body>',`<script>window.__AXIS_RELEASE__='${VERSION}';window.__AXIS_BUILD__='${BUILD}';</script>\n<script src="/axis-runtime.js?v=${BUILD}" defer></script>\n</body>`);

const externalScripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
const externalStyles=[...html.matchAll(/<link[^>]+rel="stylesheet"[^>]+href="([^"]+)"/g)].map(m=>m[1]);
if(externalScripts.length!==1||!externalScripts[0].startsWith('/axis-runtime.js'))throw new Error(`AXIS production gate: expected exactly one runtime, got ${externalScripts.join(', ')}`);
if(externalStyles.length!==1||!externalStyles[0].startsWith('/axis-style.css'))throw new Error(`AXIS production gate: expected exactly one stylesheet, got ${externalStyles.join(', ')}`);
if(/edge-bootstrap|\/app\.js|\/v61\.js/.test(html))throw new Error('AXIS production gate: legacy browser bootstrap remains in built HTML');
fs.writeFileSync(path.join(ROOT,'index.html'),html);

const fresh=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}main{min-height:100dvh;display:grid;place-items:center;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12px}</style></head><body><main><div><b>AXIS</b><span>8.7.8 · 正在清理旧启动缓存</span></div></main><script>(async()=>{try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>/axis/i.test(k)).map(k=>caches.delete(k)))}}catch{}location.replace('/')})();</script></body></html>`;
fs.mkdirSync(path.join(ROOT,'fresh'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'fresh','index.html'),fresh);

const buildInfo={
  version:VERSION,
  build:BUILD,
  architecture:'single-runtime',
  requests:{javascript:1,stylesheet:1},
  modules:modules.map(x=>x[0]),
  gates:{javascriptSyntax:true,criticalDom:true,apiPresence:true,legacyBootstrapRemoved:true},
  generatedAt:new Date().toISOString()
};
fs.writeFileSync(path.join(ROOT,'axis-build.json'),JSON.stringify(buildInfo,null,2));

console.log(`[AXIS] ${VERSION} production gate passed`);
console.log(`[AXIS] ${(Buffer.byteLength(bundle)/1024).toFixed(1)} KiB JS · ${(Buffer.byteLength(css)/1024).toFixed(1)} KiB CSS`);
console.log('[AXIS] browser boot: 1 JS + 1 CSS; no dynamic version chain');
