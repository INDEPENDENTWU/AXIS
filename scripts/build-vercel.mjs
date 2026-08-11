import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const BUILD='8.4.1';
const V='841';
const read=p=>readFile(path.join(root,p),'utf8');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

const [source,bootstrap,app,v61,reliability]=await Promise.all([
  read('index.html'),read('edge-bootstrap.js'),read('app.js'),read('v61.js'),read('reliability-v83.js')
]);

// Refuse deployment if any executable layer is syntactically broken.
for(const [name,code] of [['bootstrap',bootstrap],['core',app],['experience',v61],['reliability',reliability]]){
  try{new Function(code)}catch(error){throw new Error(`AXIS ${name} syntax error: ${error.message}`)}
}

// Keep the source document and the exact stable modular boot path. Only bump resource
// versions and add the independent reminder/reliability layer. No bundling, no inline JS.
let html=source
  .replace(/\?v=821/g,`?v=${V}`)
  .replace(/<meta name="axis-build"[^>]*>\s*/gi,'')
  .replace('</head>',`<meta name="axis-build" content="${BUILD}-stable-modular">\n</head>`);

if(!html.includes('reliability-v83.js')){
  html=html.replace('</head>',`<script src="/reliability-v83.js?v=${V}" defer></script>\n</head>`);
}

await writeFile(path.join(dist,'index.html'),html,'utf8');

// A real physical /app/ path. Previous experimental service workers only intercepted '/'.
// This gives us a clean browser path even before old registrations are removed.
await mkdir(path.join(dist,'app'),{recursive:true});
await writeFile(path.join(dist,'app','index.html'),html,'utf8');

// A real physical /repair/ path: never touches localStorage or IndexedDB training/media data.
// It only removes AXIS page caches + old service workers, then navigates to /index.html,
// which is deliberately outside the old worker's '/' navigation interception rule.
await mkdir(path.join(dist,'repair'),{recursive:true});
const repair=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><meta name="color-scheme" content="dark"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{min-height:100dvh;display:grid;place-items:center;padding:28px;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12.5px}</style></head><body><main><div><b>AXIS</b><span id="s">正在恢复最新版本…</span></div></main><script>(async()=>{const s=document.getElementById('s');try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('axis-shell-')).map(k=>caches.delete(k)))}s.textContent='恢复完成';setTimeout(()=>location.replace('/index.html?v=${V}&axis_fresh=1'),180)}catch(e){s.textContent='正在进入 AXIS…';setTimeout(()=>location.replace('/index.html?v=${V}&axis_fresh=1'),180)}})();</script></body></html>`;
await writeFile(path.join(dist,'repair','index.html'),repair,'utf8');

for(const f of ['styles.css','v61.css','edge-bootstrap.js','app.js','v61.js','reliability-v83.js','owner.html','manifest.webmanifest','sw.js']){
  await copyFile(path.join(root,f),path.join(dist,f));
}

console.log(`AXIS ${BUILD}: physical /app/ + /repair/; stable modular boot; ${Buffer.byteLength(html)} byte HTML`);
