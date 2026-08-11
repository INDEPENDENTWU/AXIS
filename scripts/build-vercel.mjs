import {readFile,writeFile,mkdir,copyFile,rm} from 'node:fs/promises';
import path from 'node:path';

const root=process.cwd();
const dist=path.join(root,'dist');
const read=p=>readFile(path.join(root,p),'utf8');
const escScript=s=>s.replace(/<\/script/gi,'<\\/script');
const escStyle=s=>s.replace(/<\/style/gi,'<\\/style');

await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});

const [source,styles,v61css,bootstrap,app,v61,reliability]=await Promise.all([
  read('index.html'),read('styles.css'),read('v61.css'),read('edge-bootstrap.js'),read('app.js'),read('v61.js'),read('reliability-v83.js')
]);

let html=source;

// Vercel production boots from one HTML response. The source files stay modular for development/EdgeOne.
html=html.replace(/<link\s+rel=["']manifest["'][^>]*>\s*/gi,'');
html=html.replace(/<link[^>]+href=["']\/(?:styles\.css|v61\.css)[^"']*["'][^>]*>\s*/gi,'');
html=html.replace(/<noscript>[\s\S]*?(?:styles\.css|v61\.css)[\s\S]*?<\/noscript>\s*/gi,'');
html=html.replace(/<script[^>]+src=["']\/(?:edge-bootstrap\.js|app\.js|v61\.js)[^"']*["'][^>]*><\/script>\s*/gi,'');

// Remove the temporary critical CSS from 8.2.1; full CSS is now in the document itself.
html=html.replace(/<style>[\s\S]*?<\/style>\s*/i,'');

const fullCss=`\n<style id="axis-full-css">\n${escStyle(styles)}\n${escStyle(v61css)}\n</style>\n`;
html=html.replace('</head>',`<meta name="axis-build" content="8.3.0-single-request">${fullCss}</head>`);

const scripts=`\n<script data-axis="bootstrap">${escScript(bootstrap)}</script>\n<script data-axis="core">${escScript(app)}</script>\n<script data-axis="experience">${escScript(v61)}</script>\n<script data-axis="reliability">${escScript(reliability)}</script>\n<script>window.addEventListener('load',()=>{setTimeout(()=>{if(!document.querySelector('link[rel="manifest"]')){const l=document.createElement('link');l.rel='manifest';l.href='/manifest.webmanifest?v=830';document.head.appendChild(l)}},0)},{once:true});</script>\n`;
html=html.replace('</body>',`${scripts}</body>`);

await writeFile(path.join(dist,'index.html'),html,'utf8');
for(const f of ['owner.html','manifest.webmanifest','sw.js']) await copyFile(path.join(root,f),path.join(dist,f));

console.log(`AXIS Vercel shell built: ${Buffer.byteLength(html)} bytes uncompressed`);
