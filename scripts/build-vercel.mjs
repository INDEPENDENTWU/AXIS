import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const BUILD='8.4.0';
const read=p=>readFile(path.join(root,p),'utf8');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

const [source,bootstrap,app,v61,reliability]=await Promise.all([
  read('index.html'),read('edge-bootstrap.js'),read('app.js'),read('v61.js'),read('reliability-v83.js')
]);

// Refuse to deploy if any executable layer is syntactically broken.
for(const [name,code] of [['bootstrap',bootstrap],['core',app],['experience',v61],['reliability',reliability]]){
  try{new Function(code)}catch(error){throw new Error(`AXIS ${name} syntax error: ${error.message}`)}
}

let html=source;

// Keep the tiny inline first-paint CSS, but use the browser's most mature path for
// the full application: two normal stylesheets + ordered defer scripts.
html=html.replace(/<link\s+rel=["']preload["'][^>]+(?:styles\.css|v61\.css)[^>]*>\s*/gi,'');
html=html.replace(/<link\s+rel=["']stylesheet["'][^>]+(?:styles\.css|v61\.css)[^>]*>\s*/gi,'');
html=html.replace(/<noscript>[\s\S]*?(?:styles\.css|v61\.css)[\s\S]*?<\/noscript>\s*/gi,'');
html=html.replace(/<script[^>]+src=["']\/(?:edge-bootstrap\.js|app\.js|v61\.js|reliability-v83\.js)[^"']*["'][^>]*><\/script>\s*/gi,'');

const styles=`\n<link rel="stylesheet" href="/styles.css?v=840">\n<link rel="stylesheet" href="/v61.css?v=840">\n`;
html=html.replace('</head>',`<meta name="axis-build" content="${BUILD}-modular">${styles}</head>`);

const scripts=`\n<script src="/edge-bootstrap.js?v=840" defer></script>\n<script src="/app.js?v=840" defer></script>\n<script src="/v61.js?v=840" defer></script>\n<script src="/reliability-v83.js?v=840" defer></script>\n`;
html=html.replace('</body>',`${scripts}</body>`);

await writeFile(path.join(dist,'index.html'),html,'utf8');

const recover=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{min-height:100dvh;display:grid;place-items:center;padding:28px;text-align:center}b{font-size:15px;letter-spacing:.2em}span{display:block;margin-top:12px;color:#9299a5;font-size:12px}</style></head><body><main><div><b>AXIS</b><span id="s">正在恢复最新版本…</span></div></main><script>(async()=>{try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('axis-shell-')).map(k=>caches.delete(k)))}document.getElementById('s').textContent='恢复完成';setTimeout(()=>location.replace('/app?axis_recovered=840'),120)}catch(e){location.replace('/app?axis_recovered=840')}})();</script></body></html>`;
await writeFile(path.join(dist,'recover.html'),recover,'utf8');

for(const f of ['styles.css','v61.css','edge-bootstrap.js','app.js','v61.js','reliability-v83.js','owner.html','manifest.webmanifest','sw.js']){
  await copyFile(path.join(root,f),path.join(dist,f));
}

console.log(`AXIS ${BUILD} modular shell built: ${Buffer.byteLength(html)} bytes`);
