import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const BUILD='8.4.3';
const V='843';
const RUNTIME='/axis-runtime-843.js';
const read=p=>readFile(path.join(root,p),'utf8');
const escStyle=s=>s.replace(/<\/style/gi,'<\\/style');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

const [source,styles,v61css,bootstrap,app,v61,reliability]=await Promise.all([
  read('index.html'),read('styles.css'),read('v61.css'),read('edge-bootstrap.js'),read('app.js'),read('v61.js'),read('reliability-v83.js')
]);

const layers=[['bootstrap',bootstrap],['core',app],['experience',v61],['reliability',reliability]];
for(const [name,code] of layers){
  try{new Function(code)}catch(error){throw new Error(`AXIS ${name} syntax error: ${error.message}`)}
}

const runtime=`window.__AXIS_RUNTIME_BUILD__='${BUILD}';\n`+layers.map(([name,code])=>`/* ${name} */\n${code}\n;`).join('\n');
try{new Function(runtime)}catch(error){throw new Error(`AXIS combined runtime syntax error: ${error.message}`)}
await writeFile(path.join(dist,RUNTIME.slice(1)),runtime,'utf8');

function makeAppHtml(){
  let html=source
    .replace(/<link\s+rel=["']preload["'][^>]+(?:styles\.css|v61\.css)[^>]*>\s*/gi,'')
    .replace(/<link\s+rel=["']stylesheet["'][^>]+(?:styles\.css|v61\.css)[^>]*>\s*/gi,'')
    .replace(/<noscript>[\s\S]*?(?:styles\.css|v61\.css)[\s\S]*?<\/noscript>\s*/gi,'')
    .replace(/<script[^>]+src=["']\/(?:edge-bootstrap\.js|app\.js|v61\.js|reliability-v83\.js|axis-runtime-[^"']+)[^>]*><\/script>\s*/gi,'')
    .replace(/<meta name="axis-build"[^>]*>\s*/gi,'');

  const fullCss=`<style id="axis-full-css">${escStyle(styles)}\n${escStyle(v61css)}</style>`;
  html=html.replace('</head>',`<meta name="axis-build" content="${BUILD}-2request"><link rel="preload" href="${RUNTIME}?v=${V}" as="script">${fullCss}</head>`);
  html=html.replace('</body>',`<script src="${RUNTIME}?v=${V}" defer data-axis-runtime="${BUILD}"></script></body>`);
  return html;
}

const html=makeAppHtml();
await writeFile(path.join(dist,'index.html'),html,'utf8');

for(const dir of ['app','standalone']){
  await mkdir(path.join(dist,dir),{recursive:true});
  await writeFile(path.join(dist,dir,'index.html'),html,'utf8');
}

await mkdir(path.join(dist,'repair'),{recursive:true});
const repair=`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#08090b"><meta name="color-scheme" content="dark"><title>AXIS</title><style>html,body{margin:0;min-height:100%;background:#08090b;color:#f4f3ef;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC",sans-serif}main{min-height:100dvh;display:grid;place-items:center;padding:28px;text-align:center}b{font-size:15px;letter-spacing:.22em}span{display:block;margin-top:12px;color:#9299a5;font-size:12.5px}</style></head><body><main><div><b>AXIS</b><span id="s">正在恢复最新版本…</span></div></main><script>(async()=>{const s=document.getElementById('s');try{if('serviceWorker'in navigator){const rs=await navigator.serviceWorker.getRegistrations();await Promise.all(rs.map(r=>r.unregister()))}if('caches'in window){const ks=await caches.keys();await Promise.all(ks.filter(k=>k.startsWith('axis-shell-')).map(k=>caches.delete(k)))}s.textContent='恢复完成';setTimeout(()=>location.replace('/app/?v=${V}&axis_recovered=1'),160)}catch(e){location.replace('/app/?v=${V}&axis_recovered=1')}})();</script></body></html>`;
await writeFile(path.join(dist,'repair','index.html'),repair,'utf8');

for(const f of ['owner.html','manifest.webmanifest','sw.js','styles.css','v61.css','edge-bootstrap.js','app.js','v61.js','reliability-v83.js']){
  await copyFile(path.join(root,f),path.join(dist,f));
}

console.log(`AXIS ${BUILD}: HTML+CSS ${Buffer.byteLength(html)}B; runtime ${Buffer.byteLength(runtime)}B; 2-request boot`);
