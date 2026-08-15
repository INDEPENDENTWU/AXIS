import fs from 'node:fs';
import crypto from 'node:crypto';

const VERSION='8.8';
const ARCH='canonical-single-runtime';
const ROOT=process.cwd();
const fail=m=>{throw new Error(`AXIS 8.8 canonical gate: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const chunkFiles=['axis-enhance-foundation.js','axis-enhance-recording.js','axis-enhance-interaction.js','axis-enhance-product.js'];
const required=['index.html','axis-core.js','axis-style.css','axis-build.json','v8712-runtime.js','v8712-completion.js',...chunkFiles];
for(const f of required)read(f);

let core=read('axis-core.js');
const manifestPattern=/const manifest=\[[^\n]*\];/;
if(!manifestPattern.test(core))fail('stable chunk manifest signature missing');
core=core.replace(manifestPattern,'const manifest=[];');

const normalizedVersion=src=>src
  .replace("const VERSION='8.7.12'",`const VERSION='${VERSION}'`)
  .replace(/版本 8\.7\.12/g,`版本 ${VERSION}`);
const feature=normalizedVersion(read('v8712-runtime.js'));
const completion=normalizedVersion(read('v8712-completion.js'));
syntax(feature,'embedded feature');
syntax(completion,'embedded completion');

const chunks=chunkFiles.map(f=>read(f));
for(let i=0;i<chunks.length;i++)syntax(chunks[i],chunkFiles[i]);

const canonicalPreamble=`\n/* ===== AXIS ${VERSION} canonical runtime ===== */\n(()=>{'use strict';\nwindow.__AXIS_RELEASE__='${VERSION}';\nwindow.__AXIS_VERSION__='${VERSION}';\nwindow.__AXIS_ARCH__='${ARCH}';\nwindow.__AXIS_CANONICAL_88__={state:'booting',version:'${VERSION}',architecture:'${ARCH}',startedAt:Date.now(),errors:[]};\n})();\n`;
const canonicalFinalize=`\n(()=>{'use strict';\nconst K=window.__AXIS_CANONICAL_88__;\nconst done=()=>{\n  const feature=window.__AXIS_8712_READY__===true;\n  const completion=window.__AXIS_8712_COMPLETION_READY__===true;\n  if(!feature||!completion)return false;\n  window.__AXIS_FEATURE_KERNEL__={state:'ready',base:'${VERSION}',target:'${VERSION}',embedded:true,errors:[],readyAt:Date.now()};\n  window.__AXIS_COMPLETION_KERNEL__={state:'ready',embedded:true,errors:[],readyAt:Date.now()};\n  window.__AXIS_LATEST_READY__=true;\n  window.__AXIS_STABLE_COMPLETE__=true;\n  window.__AXIS_STABLE_DEGRADED__=false;\n  window.__AXIS_BOOT_WATCHDOG__='ready';\n  document.documentElement.dataset.axisReady='1';\n  document.documentElement.dataset.axisCanonical='8.8';\n  const v=document.querySelector('.versionLine');\n  if(v){v.setAttribute('aria-label','版本 ${VERSION}');v.dataset.axisPublicRelease='${VERSION}';v.dataset.axisPublicLabel='版本 ${VERSION}';v.dataset.axisVersion='${VERSION}';}\n  if(K){K.state='ready';K.readyAt=Date.now();K.featureReady=feature;K.completionReady=completion}\n  return true;\n};\nlet tries=0;const probe=()=>{if(done())return;if(++tries<40)setTimeout(probe,50);else{if(K){K.state='degraded';K.errors.push('canonical-settle-timeout')}window.__AXIS_STABLE_DEGRADED__=true;window.__AXIS_BOOT_WATCHDOG__='degraded'}};\nif(document.readyState==='complete')probe();else window.addEventListener('load',probe,{once:true});\n})();\n`;

const runtime=[canonicalPreamble,core,...chunks,feature,completion,canonicalFinalize].join('\n');
syntax(runtime,'canonical runtime');
const runtimeHash=hash(runtime);
write('axis-core.js',runtime);

let html=read('index.html');
html=html
 .replace(/<!-- AXIS_FEATURE_LOADER_START -->[\s\S]*?<!-- AXIS_FEATURE_LOADER_END -->\s*/g,'')
 .replace(/<!-- AXIS_COMPLETION_LOADER_START -->[\s\S]*?<!-- AXIS_COMPLETION_LOADER_END -->\s*/g,'');
const scriptRefs=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
if(scriptRefs.length!==1||!scriptRefs[0].startsWith('/axis-core.js?v='))fail(`expected one runtime script before canonicalization, got ${scriptRefs.join(',')}`);
html=html.replace(/\/axis-core\.js\?v=[a-f0-9]+/,`/axis-core.js?v=${runtimeHash}`);
html=html.replace('<html lang="zh-CN">','<html lang="zh-CN" data-axis-runtime="canonical-8.8">');
if(/AXIS_FEATURE_LOADER_START|AXIS_COMPLETION_LOADER_START|axis-enhance-(?:foundation|recording|interaction|product)\.js/.test(html))fail('dynamic legacy runtime reference survived in HTML');
write('index.html',html);

const info=JSON.parse(read('axis-build.json'));
const featureHash=hash(feature),completionHash=hash(completion);
info.version=VERSION;
info.baseVersion=VERSION;
info.architecture=ARCH;
info.assets=info.assets||{};
info.assets.core=runtimeHash;
info.assets.chunks=[];
info.requests={initialJavascript:1,stableChunks:0,dynamicJavascript:0,stylesheet:1};
info.boot={...(info.boot||{}),releaseOwner:VERSION,canonicalRuntime:true,legacySourceModulesCompileOnly:true,dynamicChunkLoading:false,embeddedFeature:true,embeddedCompletion:true};
info.featureKernel={blocking:true,embedded:true,feature:'v8712-runtime.js',hash:featureHash,maxBytes:Buffer.byteLength(feature),timeoutMs:0,loadAfter:'embedded in canonical runtime',fallback:null,versionOwner:'canonical-runtime'};
info.completionKernel={blocking:true,embedded:true,feature:'v8712-completion.js',hash:completionHash,maxBytes:Buffer.byteLength(completion),timeoutMs:0,requires:['canonical runtime'],fallback:null,owns:['nested sheet return','watermark corner cleanup','sound audition cleanup']};
info.gates={...(info.gates||{}),canonicalSingleRuntime:true,noDynamicRuntimeChunks:true,noVersionFallback:true,embeddedFeature:true,embeddedCompletion:true};
info.canonical={version:VERSION,architecture:ARCH,runtimeHash,sourceInputs:['app.js','v61.js',...chunkFiles,'v8712-runtime.js','v8712-completion.js'],productionRequests:{javascript:1,stylesheet:1}};
write('axis-build.json',JSON.stringify(info,null,2));

const finalScripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
if(finalScripts.length!==1||finalScripts[0]!==`/axis-core.js?v=${runtimeHash}`)fail('canonical HTML does not point to the single runtime');
if(!runtime.includes("window.__AXIS_ARCH__='canonical-single-runtime'"))fail('canonical architecture marker missing');
if(!runtime.includes("window.__AXIS_FEATURE_KERNEL__={state:'ready'"))fail('embedded feature compatibility marker missing');
if(!runtime.includes("window.__AXIS_COMPLETION_KERNEL__={state:'ready'"))fail('embedded completion compatibility marker missing');
console.log(`[AXIS 8.8 canonical] single runtime ${runtimeHash} · ${(Buffer.byteLength(runtime)/1024).toFixed(1)} KiB source`);
console.log('[AXIS 8.8 canonical] 1 JS request · 0 dynamic runtime chunks · no silent 8.7.x fallback');
