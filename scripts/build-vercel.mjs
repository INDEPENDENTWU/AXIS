import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const BUILD='8.3.2';
const RUNTIME='/axis-runtime-832.js';
const read=p=>readFile(path.join(root,p),'utf8');
const escStyle=s=>s.replace(/<\/style/gi,'<\\/style');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

const [source,styles,v61css,bootstrap,app,v61,reliability]=await Promise.all([
  read('index.html'),read('styles.css'),read('v61.css'),read('edge-bootstrap.js'),read('app.js'),read('v61.js'),read('reliability-v83.js')
]);

let html=source;

// Vercel gets a complete visual document in the first response. Runtime stays in one
// versioned external file because Safari is substantially more reliable on this path
// than executing the whole application as several very large inline scripts.
html=html.replace(/<link[^>]+href=["']\/(?:styles\.css|v61\.css)[^"']*["'][^>]*>\s*/gi,'');
html=html.replace(/<noscript>[\s\S]*?(?:styles\.css|v61\.css)[\s\S]*?<\/noscript>\s*/gi,'');
html=html.replace(/<script[^>]+src=["']\/(?:edge-bootstrap\.js|app\.js|v61\.js)[^"']*["'][^>]*><\/script>\s*/gi,'');
html=html.replace(/<style>[\s\S]*?<\/style>\s*/i,'');

const fullCss=`\n<style id="axis-full-css">\n${escStyle(styles)}\n${escStyle(v61css)}\n</style>\n`;
html=html.replace('</head>',`<meta name="axis-build" content="${BUILD}-1plus1"><link rel="preload" href="${RUNTIME}" as="script">${fullCss}</head>`);

const layers=[
  ['bootstrap',bootstrap],
  ['core',app],
  ['experience',v61],
  ['reliability',reliability]
];
const runtime=[`window.__AXIS_RUNTIME_BUILD__='${BUILD}';`]
  .concat(layers.map(([name,code])=>`\ntry{\n${code}\n}catch(error){\n  console.error('[AXIS ${name}]',error);\n  try{document.documentElement.dataset.axisRuntimeError='${name}'}catch{}\n}\n`))
  .join('\n');

// Fail deployment rather than shipping a syntactically broken runtime.
new Function(runtime);

const runtimeTag=`\n<script src="${RUNTIME}" defer data-axis-runtime="${BUILD}"></script>\n`;
html=html.replace('</body>',`${runtimeTag}</body>`);

await writeFile(path.join(dist,'index.html'),html,'utf8');
await writeFile(path.join(dist,RUNTIME.slice(1)),runtime,'utf8');
for(const f of ['owner.html','manifest.webmanifest','sw.js']) await copyFile(path.join(root,f),path.join(dist,f));

console.log(`AXIS Vercel 1+1 shell built: HTML ${Buffer.byteLength(html)} bytes; runtime ${Buffer.byteLength(runtime)} bytes`);
