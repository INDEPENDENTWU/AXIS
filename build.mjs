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

for(const [file] of modules){
  if(!fs.existsSync(path.join(ROOT,file))) throw new Error(`Missing production module: ${file}`);
}

const prologue=`(()=>{'use strict';\n`+
`window.__AXIS_RELEASE__='${VERSION}';window.__AXIS_BUILD__='${BUILD}';window.__AXIS_BOOT_READY__=true;window.__AXIS_LATEST_LOADING__=true;window.__AXIS_ARCH__='single-runtime';\n`+
`try{if('serviceWorker'in navigator){const sw=navigator.serviceWorker;try{Object.defineProperty(sw,'register',{configurable:true,value:()=>Promise.resolve(null)})}catch{try{sw.register=()=>Promise.resolve(null)}catch{}}sw.getRegistrations?.().then(rs=>Promise.all(rs.map(r=>r.unregister()))).catch(()=>{})}}catch{}\n`+
`window.addEventListener('error',e=>{try{console.error('[AXIS runtime]',e.error||e.message||e)}catch{}},{passive:true});\n`+
`})();\n`;

let bundle=prologue;
for(const [file,flag] of modules){
  const src=fs.readFileSync(path.join(ROOT,file),'utf8');
  bundle+=`\n/* ===== ${file} ===== */\ntry{\n${src}\nwindow.${flag}=true;\n}catch(e){window.${flag}=false;console.error('[AXIS] ${file} isolated',e);}\n`;
}
bundle+=`\n(()=>{window.__AXIS_LATEST_LOADING__=false;window.__AXIS_LATEST_READY__=true;window.__AXIS_BOOT_WATCHDOG__='ready';window.__AXIS_VERSION__='${VERSION}';const v=document.querySelector('.versionLine');if(v){v.textContent='版本 ${VERSION}';v.style.visibility='visible';v.dataset.axisVersion='${VERSION}'}document.documentElement.dataset.axisReady='1';})();\n`;

// Build must fail before deployment if any source introduced invalid JavaScript.
new Function(bundle);
fs.writeFileSync(path.join(ROOT,'axis-runtime.js'),bundle);

const cssFiles=['styles.css','v61.css'];
for(const file of cssFiles){if(!fs.existsSync(path.join(ROOT,file)))throw new Error(`Missing stylesheet: ${file}`)}
const css=cssFiles.map(f=>`/* ===== ${f} ===== */\n${fs.readFileSync(path.join(ROOT,f),'utf8')}`).join('\n\n');
fs.writeFileSync(path.join(ROOT,'axis-style.css'),css);

let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
html=html
  .replace(/<link rel="stylesheet" href="\/styles\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<link rel="stylesheet" href="\/v61\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<link rel="stylesheet" href="\/axis-style\.css(?:\?[^\"]*)?">\s*/g,'')
  .replace(/<script src="\/edge-bootstrap\.js(?:\?[^\"]*)?"><\/script>\s*/g,'')
  .replace(/<script src="\/app\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/v61\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'')
  .replace(/<script src="\/axis-runtime\.js(?:\?[^\"]*)?"(?:\s+defer)?><\/script>\s*/g,'');
html=html.replace('</head>',`<link rel="stylesheet" href="/axis-style.css?v=${BUILD}">\n</head>`);
html=html.replace('</body>',`<script>window.__AXIS_RELEASE__='${VERSION}';window.__AXIS_BUILD__='${BUILD}';</script>\n<script src="/axis-runtime.js?v=${BUILD}" defer></script>\n</body>`);
fs.writeFileSync(path.join(ROOT,'index.html'),html);

const fresh=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,'PingFang SC',sans-serif}main{min-height:100dvh;display:grid;place-items:center;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12px}</style></head><body><main><div><b>AXIS</b><span>8.7.8 · 正在清理旧启动缓存</span></div></main><script>(async()=>{try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>/axis/i.test(k)).map(k=>caches.delete(k)))}}catch{}location.replace('/')})();</script></body></html>`;
fs.mkdirSync(path.join(ROOT,'fresh'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'fresh','index.html'),fresh);

fs.writeFileSync(path.join(ROOT,'axis-build.json'),JSON.stringify({version:VERSION,build:BUILD,architecture:'single-runtime',modules:modules.map(x=>x[0]),generatedAt:new Date().toISOString()},null,2));

console.log(`[AXIS] ${VERSION} production build complete`);
console.log(`[AXIS] JS ${(Buffer.byteLength(bundle)/1024).toFixed(1)} KiB · CSS ${(Buffer.byteLength(css)/1024).toFixed(1)} KiB · ${modules.length} source modules -> 1 runtime request`);
