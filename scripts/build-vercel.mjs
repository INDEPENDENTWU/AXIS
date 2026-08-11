import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const BUILD='8.4.2';
const V='842';
const read=p=>readFile(path.join(root,p),'utf8');
const escScript=s=>s.replace(/<\/script/gi,'<\\/script');
const escStyle=s=>s.replace(/<\/style/gi,'<\\/style');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

const [source,styles,v61css,bootstrap,app,v61,reliability]=await Promise.all([
  read('index.html'),read('styles.css'),read('v61.css'),read('edge-bootstrap.js'),read('app.js'),read('v61.js'),read('reliability-v83.js')
]);

// Refuse deployment if any executable layer is syntactically broken.
for(const [name,code] of [['bootstrap',bootstrap],['core',app],['experience',v61],['reliability',reliability]]){
  try{new Function(code)}catch(error){throw new Error(`AXIS ${name} syntax error: ${error.message}`)}
}

// Stable modular production path: preserve the already-proven browser execution model.
let html=source
  .replace(/\?v=821/g,`?v=${V}`)
  .replace(/<meta name="axis-build"[^>]*>\s*/gi,'')
  .replace('</head>',`<meta name="axis-build" content="${BUILD}-stable-modular">\n</head>`);

if(!html.includes('reliability-v83.js')){
  html=html.replace('</head>',`<script src="/reliability-v83.js?v=${V}" defer></script>\n</head>`);
}

await writeFile(path.join(dist,'index.html'),html,'utf8');

// Physical /app/ path bypasses all earlier experimental workers that only intercepted '/'.
await mkdir(path.join(dist,'app'),{recursive:true});
await writeFile(path.join(dist,'app','index.html'),html,'utf8');

// Physical recovery path. Never touches localStorage or IndexedDB training/media data.
await mkdir(path.join(dist,'repair'),{recursive:true});
const repair=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><meta name="color-scheme" content="dark"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{min-height:100dvh;display:grid;place-items:center;padding:28px;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12.5px}</style></head><body><main><div><b>AXIS</b><span id="s">正在恢复最新版本…</span></div></main><script>(async()=>{const s=document.getElementById('s');try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('axis-shell-')).map(k=>caches.delete(k)))}s.textContent='恢复完成';setTimeout(()=>location.replace('/standalone/?v=${V}&axis_recovered=1'),180)}catch(e){s.textContent='正在进入 AXIS…';setTimeout(()=>location.replace('/standalone/?v=${V}&axis_recovered=1'),180)}})();</script></body></html>`;
await writeFile(path.join(dist,'repair','index.html'),repair,'utf8');

// Physical /standalone/ is a true one-response full AXIS. It is intentionally kept
// separate from the production root until real iPhone Safari verifies it. No CSS/JS
// network request is needed after this HTML arrives; API requests remain on-demand.
await mkdir(path.join(dist,'standalone'),{recursive:true});
let standalone=source
  .replace(/<link\s+rel=["']preload["'][^>]+(?:styles\.css|v61\.css)[^>]*>\s*/gi,'')
  .replace(/<link\s+rel=["']stylesheet["'][^>]+(?:styles\.css|v61\.css)[^>]*>\s*/gi,'')
  .replace(/<noscript>[\s\S]*?(?:styles\.css|v61\.css)[\s\S]*?<\/noscript>\s*/gi,'')
  .replace(/<script[^>]+src=["']\/(?:edge-bootstrap\.js|app\.js|v61\.js|reliability-v83\.js)[^"']*["'][^>]*><\/script>\s*/gi,'')
  .replace(/<meta name="axis-build"[^>]*>\s*/gi,'');

standalone=standalone.replace('</head>',`<meta name="axis-build" content="${BUILD}-standalone"><style id="axis-full-css">${escStyle(styles)}\n${escStyle(v61css)}</style></head>`);
const inlineRuntime=`\n<script data-axis-layer="bootstrap">${escScript(bootstrap)}</script>\n<script data-axis-layer="core">${escScript(app)}</script>\n<script data-axis-layer="experience">${escScript(v61)}</script>\n<script data-axis-layer="reliability">${escScript(reliability)}</script>\n`;
standalone=standalone.replace('</body>',`${inlineRuntime}</body>`);
await writeFile(path.join(dist,'standalone','index.html'),standalone,'utf8');

for(const f of ['styles.css','v61.css','edge-bootstrap.js','app.js','v61.js','reliability-v83.js','owner.html','manifest.webmanifest','sw.js']){
  await copyFile(path.join(root,f),path.join(dist,f));
}

console.log(`AXIS ${BUILD}: modular root + physical standalone; root ${Buffer.byteLength(html)}B, standalone ${Buffer.byteLength(standalone)}B`);
