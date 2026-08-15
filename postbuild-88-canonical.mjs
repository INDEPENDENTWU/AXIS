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

/* Default capture preference has one 8.8 owner. The base app keeps scanSeconds only
   as historical data for migration; it no longer paints or writes the Settings choice. */
const legacyScanOpen="$('#scanBtn').onclick=()=>{resetScan();captureMode=String(state.prefs.scanSeconds||3);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===captureMode));setText('#captureNow',captureMode==='photo'?'拍照':`开始扫描 ${captureMode} 秒`);openSheet('scanSheet');startCamera()};";
const canonicalScanOpen="$('#scanBtn').onclick=()=>{resetScan();const preferred=window.__AXIS_CAPTURE_PREF__?.get?.();captureMode=['photo','3','5'].includes(String(preferred))?String(preferred):String(state.prefs.scanSeconds||3);$$('#captureModes button').forEach(b=>b.classList.toggle('active',b.dataset.mode===captureMode));setText('#captureNow',captureMode==='photo'?'拍照':`开始扫描 ${captureMode} 秒`);openSheet('scanSheet');startCamera()};";
if(core.split(legacyScanOpen).length-1!==1)fail('legacy capture-open preference signature missing');
/* Function-form replacement is required: String.replace replacement strings interpret
   `$$` as one literal `$`, which would corrupt the canonical `$$()` selector helper. */
core=core.replace(legacyScanOpen,()=>canonicalScanOpen);

const legacyScanPainter=";$$('#scanSeconds button').forEach(b=>b.classList.toggle('active',Number(b.dataset.sec)===Number(state.prefs.scanSeconds)))";
if(core.split(legacyScanPainter).length-1!==1)fail('legacy scan preference painter expected once');
core=core.replace(legacyScanPainter,'');

const legacyScanClick=";$$('#scanSeconds button').forEach(b=>b.onclick=()=>{state.prefs.scanSeconds=Number(b.dataset.sec);save();renderSettings()})";
if(core.split(legacyScanClick).length-1!==1)fail('legacy scan preference click writer expected once');
core=core.replace(legacyScanClick,'');

const normalizedVersion=src=>src.replace("const VERSION='8.7.12'",`const VERSION='${VERSION}'`).replace(/版本 8\.7\.12/g,`版本 ${VERSION}`);
let feature=normalizedVersion(read('v8712-runtime.js'));
const completion=normalizedVersion(read('v8712-completion.js'));

/* The live equipment catalog is owned by v8710 in 8.8. v8712 used to repaint the
   same card surface after open/category changes, which made the first render and
   post-tap render follow different taxonomies. Retire that second painter here. */
let retiredCatalogWriters=0;
const featureCatalogBlock=/const CAT_RULES=\{[\s\S]*?function polishCategory\(\)\{[\s\S]*?\}\n\nconst DETAIL_CORE=/;
const featureCatalogMatches=feature.match(new RegExp(featureCatalogBlock.source,'g'))||[];
if(featureCatalogMatches.length!==1)fail(`v8712 catalog painter block expected once, found ${featureCatalogMatches.length}`);
feature=feature.replace(featureCatalogBlock,'const DETAIL_CORE=');
const featureCatalogClick="const cat=e.target.closest('#v8710Cats [data-v8710-cat]');if(cat){setTimeout(polishCategory,0);return}\n  if(e.target.closest('#equipmentRow')){setTimeout(polishCategory,140);return}\n  ";
if(feature.split(featureCatalogClick).length-1!==1)fail('v8712 catalog click painter route expected once');
feature=feature.replace(featureCatalogClick,'');
const featureCatalogInput="D.addEventListener('input',e=>{if(e.target.id==='eqSearch'&&!e.target.value.trim())setTimeout(polishCategory,0)},false);\n ";
if(feature.split(featureCatalogInput).length-1!==1)fail('v8712 catalog input painter route expected once');
feature=feature.replace(featureCatalogInput,'');
const featureCatalogPage="window.addEventListener('pageshow',()=>setTimeout(()=>{style();polishCategory()},120));";
if(feature.split(featureCatalogPage).length-1!==1)fail('v8712 catalog pageshow painter route expected once');
feature=feature.replace(featureCatalogPage,"window.addEventListener('pageshow',style);");
if(/function polishCategory\(|setTimeout\(polishCategory/.test(feature))fail('v8712 catalog painter survived retirement');
retiredCatalogWriters=1;

syntax(feature,'embedded feature');syntax(completion,'embedded completion');

let chunks=chunkFiles.map(f=>read(f));

/* v879 and v8711 historically claimed the whole product release identity. */
let retiredVersionWriters=0;
chunks=chunks.map(src=>src.replace(/function version\(\)\{window\.__AXIS_RELEASE__=VERSION;[\s\S]*?\}\n(?=function [A-Za-z_$][\w$]*\()/g,()=>{
  retiredVersionWriters++;
  return 'function version(){}\n';
}));
if(retiredVersionWriters!==2)fail(`expected exactly two historical release writers, retired ${retiredVersionWriters}`);

/* Converge v876 capture preference. Historical scanSeconds is read once when no
   v876 preference exists, after which v876CaptureMode is the sole truth. */
let retiredCaptureCorrectionFragments=0;
let captureMigrationRewrites=0;
chunks=chunks.map((src,i)=>{
  if(chunkFiles[i]!=='axis-enhance-interaction.js')return src;

  const migrationFrom="if(!p.v876CaptureMode)p.v876CaptureMode='photo';";
  const migrationTo="if(!p.v876CaptureMode){const legacy=String(core().prefs?.scanSeconds||'');p.v876CaptureMode=['3','5'].includes(legacy)?legacy:'photo'};";
  const migrationCount=src.split(migrationFrom).length-1;
  if(migrationCount!==1)fail(`v876 capture migration expected once, found ${migrationCount}`);
  src=src.replace(migrationFrom,migrationTo);captureMigrationRewrites++;

  const captureFrom="function capturePref(){return meta().prefs.v876CaptureMode||'photo'}";
  const captureTo="function capturePref(){const m=meta(),v=String(m.prefs.v876CaptureMode||'');if(['photo','3','5'].includes(v))return v;const legacy=String(core().prefs?.scanSeconds||'');return ['3','5'].includes(legacy)?legacy:'photo'}";
  if(src.split(captureFrom).length-1!==1)fail('v876 capture preference signature missing');
  src=src.replace(captureFrom,captureTo);

  const setter=/function setCapturePref\(v\)\{const m=meta\(\);m\.prefs\.v876CaptureMode=\['photo','3','5'\]\.includes\(String\(v\)\)\?String\(v\):'photo';saveMeta\(m\);syncCaptureSetting\(\)\}/;
  const setterMatches=src.match(new RegExp(setter.source,'g'))||[];
  if(setterMatches.length!==1)fail(`v876 capture setter expected once, found ${setterMatches.length}`);
  src=src.replace(setter,m=>m+"\nwindow.__AXIS_CAPTURE_PREF__={get:capturePref,set:setCapturePref};");

  /* Earlier compiler stages may already remove either delayed-correction fragment.
     0 or 1 is acceptable; duplicates are not. Final absence is asserted below. */
  const correctionExact="function applyCaptureMode(){const mode=capturePref(),sheet=$('#scanSheet');if(!sheet?.classList.contains('show'))return;const b=$(`#captureModes [data-mode=\"${mode}\"]`);if(b&&!b.classList.contains('active'))b.click()}";
  const correctionCount=src.split(correctionExact).length-1;
  if(correctionCount>1)fail(`v876 delayed capture function duplicated ${correctionCount} times`);
  if(correctionCount===1){src=src.replace(correctionExact,'');retiredCaptureCorrectionFragments++}

  const delayed="if(e.target.closest('#scanBtn,.scanPrimary'))setTimeout(applyCaptureMode,90);";
  const delayedCount=src.split(delayed).length-1;
  if(delayedCount>1)fail(`v876 delayed capture click correction duplicated ${delayedCount} times`);
  if(delayedCount===1){src=src.replace(delayed,'');retiredCaptureCorrectionFragments++}

  if(/applyCaptureMode|setTimeout\(applyCaptureMode/.test(src))fail('delayed capture correction survived retirement');
  return src;
});
if(captureMigrationRewrites!==1)fail(`expected one capture migration rewrite, got ${captureMigrationRewrites}`);

/* v8710 live catalog carried an older active-item editor. v879 is canonical. */
let retiredActiveAdjustWriters=0;
chunks=chunks.map((src,i)=>{
  if(chunkFiles[i]!=='axis-enhance-product.js')return src;
  const ownerBlock=/function ensureEdit\(\)\{[\s\S]*?\}\nconst CATS=/;
  const ownerMatches=src.match(new RegExp(ownerBlock.source,'g'))||[];
  if(ownerMatches.length!==1)fail(`v8710 active editor owner expected once, found ${ownerMatches.length}`);
  src=src.replace(ownerBlock,'const CATS=');

  const bindFrom="function bind(){style();ensureEdit();ensureExplore();editEntry();const t=setInterval(editEntry,550);window.addEventListener('pagehide',()=>clearInterval(t),{once:true});";
  if(src.split(bindFrom).length-1!==1)fail('v8710 active edit polling signature missing');
  src=src.replace(bindFrom,'function bind(){style();ensureExplore();');

  const clickFrom="D.addEventListener('click',e=>{const ed=e.target.closest('#v8710EditOnce');if(ed){openEdit(ed.dataset.id);return}if(e.target.closest('[data-v8710-edit-close]')){$('#v8710EditSheet')?.classList.remove('show');return}const es=e.target.closest('[data-v8710-ek]');if(es){editStep(es.dataset.v8710Ek,Number(es.dataset.d)||1);return}if(e.target.closest('#v8710EApply')){applyEdit();return}const c=";
  if(src.split(clickFrom).length-1!==1)fail('v8710 active edit click router signature missing');
  src=src.replace(clickFrom,"D.addEventListener('click',e=>{const c=");

  const pageFrom="window.addEventListener('pageshow',()=>{ensureExplore();editEntry()})";
  if(src.split(pageFrom).length-1!==1)fail('v8710 active edit pageshow signature missing');
  src=src.replace(pageFrom,"window.addEventListener('pageshow',ensureExplore)");

  if(/b\.id='v8710EditOnce'|setInterval\(editEntry|function editEntry\(|function openEdit\(/.test(src))fail('v8710 active adjustment implementation survived retirement');
  retiredActiveAdjustWriters++;
  return src;
});
if(retiredActiveAdjustWriters!==1)fail(`expected one v8710 active adjustment owner retirement, got ${retiredActiveAdjustWriters}`);

for(let i=0;i<chunks.length;i++){
  if(/window\.__AXIS_RELEASE__\s*=/.test(chunks[i]))fail(`${chunkFiles[i]} still writes canonical release identity`);
  syntax(chunks[i],chunkFiles[i]);
}
for(const [name,src] of [['v8712-runtime.js',feature],['v8712-completion.js',completion]])if(/window\.__AXIS_RELEASE__\s*=/.test(src))fail(`${name} writes canonical release identity`);

const canonicalPreamble=`\n/* ===== AXIS ${VERSION} canonical runtime ===== */\n(()=>{'use strict';\nwindow.__AXIS_RELEASE__='${VERSION}';\nwindow.__AXIS_VERSION__='${VERSION}';\nwindow.__AXIS_ARCH__='${ARCH}';\nwindow.__AXIS_CANONICAL_88__={state:'booting',version:'${VERSION}',architecture:'${ARCH}',startedAt:Date.now(),errors:[]};\n})();\n`;

const canonicalFinalize=`\n(()=>{'use strict';\nconst K=window.__AXIS_CANONICAL_88__;\nconst done=()=>{\n  const feature=window.__AXIS_8712_READY__===true;\n  const completion=window.__AXIS_8712_COMPLETION_READY__===true;\n  if(!feature||!completion)return false;\n  window.__AXIS_RELEASE__='${VERSION}';\n  window.__AXIS_VERSION__='${VERSION}';\n  window.__AXIS_ARCH__='${ARCH}';\n  window.__AXIS_FEATURE_KERNEL__={state:'ready',base:'${VERSION}',target:'${VERSION}',embedded:true,errors:[],readyAt:Date.now()};\n  window.__AXIS_COMPLETION_KERNEL__={state:'ready',embedded:true,errors:[],readyAt:Date.now()};\n  window.__AXIS_LATEST_READY__=true;\n  window.__AXIS_STABLE_COMPLETE__=true;\n  window.__AXIS_STABLE_DEGRADED__=false;\n  window.__AXIS_BOOT_WATCHDOG__='ready';\n  document.documentElement.dataset.axisReady='1';\n  document.documentElement.dataset.axisCanonical='8.8';\n  const v=document.querySelector('.versionLine');\n  if(v){v.setAttribute('aria-label','版本 ${VERSION}');v.dataset.axisPublicRelease='${VERSION}';v.dataset.axisPublicLabel='版本 ${VERSION}';v.dataset.axisVersion='${VERSION}';}\n  if(K){K.state='ready';K.readyAt=Date.now();K.featureReady=feature;K.completionReady=completion}\n  return true;\n};\nlet tries=0;const probe=()=>{if(done())return;if(++tries<40)setTimeout(probe,50);else{if(K){K.state='degraded';K.errors.push('canonical-settle-timeout')}window.__AXIS_STABLE_DEGRADED__=true;window.__AXIS_BOOT_WATCHDOG__='degraded'}};\nif(document.readyState==='complete')probe();else window.addEventListener('load',probe,{once:true});\n})();\n`;

const runtime=[canonicalPreamble,core,...chunks,feature,completion,canonicalFinalize].join('\n');
syntax(runtime,'canonical runtime');
const runtimeHash=hash(runtime);
write('axis-core.js',runtime);

let html=read('index.html');
html=html.replace(/<!-- AXIS_FEATURE_LOADER_START -->[\s\S]*?<!-- AXIS_FEATURE_LOADER_END -->\s*/g,'').replace(/<!-- AXIS_COMPLETION_LOADER_START -->[\s\S]*?<!-- AXIS_COMPLETION_LOADER_END -->\s*/g,'');
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
info.gates={...(info.gates||{}),canonicalSingleRuntime:true,noDynamicRuntimeChunks:true,noVersionFallback:true,embeddedFeature:true,embeddedCompletion:true,historicalReleaseWriterRetired:true,legacyV8710ActiveAdjustRetired:true,catalogCategorySingleOwner:true,capturePreferenceSingleOwner:true,legacyScanPreferencePainterRetired:true,legacyScanPreferenceClickRetired:true,canonicalReplacementPreservesDoubleDollar:true};
info.canonical={version:VERSION,architecture:ARCH,runtimeHash,sourceInputs:['app.js','v61.js',...chunkFiles,'v8712-runtime.js','v8712-completion.js'],productionRequests:{javascript:1,stylesheet:1},retiredReleaseWriters:retiredVersionWriters,retiredActiveAdjustWriters,retiredCatalogWriters,captureCorrectionFragmentsRetired:retiredCaptureCorrectionFragments,captureMigrationRewrites};
write('axis-build.json',JSON.stringify(info,null,2));

const finalScripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
if(finalScripts.length!==1||finalScripts[0]!==`/axis-core.js?v=${runtimeHash}`)fail('canonical HTML does not point to the single runtime');
if(!runtime.includes("window.__AXIS_ARCH__='canonical-single-runtime'"))fail('canonical architecture marker missing');
if(!runtime.includes("window.__AXIS_FEATURE_KERNEL__={state:'ready'"))fail('embedded feature compatibility marker missing');
if(!runtime.includes("window.__AXIS_COMPLETION_KERNEL__={state:'ready'"))fail('embedded completion compatibility marker missing');
if(!runtime.includes("window.__AXIS_CAPTURE_PREF__={get:capturePref,set:setCapturePref}"))fail('canonical capture preference bridge missing');
if(/function polishCategory\(|setTimeout\(polishCategory/.test(runtime))fail('legacy v8712 catalog painter survived canonical runtime');
if(!runtime.includes("function prioritized(cat)"))fail('canonical catalog prioritization missing');
if(!runtime.includes("const all=prioritized(cat)"))fail('canonical catalog category renderer missing');
if(/setTimeout\(applyCaptureMode|function applyCaptureMode\(/.test(runtime))fail('delayed capture correction survived canonical runtime');
if(runtime.includes("Number(b.dataset.sec)===Number(state.prefs.scanSeconds)"))fail('legacy scan preference painter survived canonical runtime');
if(runtime.includes("state.prefs.scanSeconds=Number(b.dataset.sec)"))fail('legacy scan preference click writer survived canonical runtime');
if(/(^|[^$])\$\('#captureModes button'\)\.forEach/.test(runtime))fail('canonical selector helper was corrupted to single-dollar query');
if(!runtime.includes("$$('#captureModes button').forEach"))fail('canonical multi-selector helper missing from capture owner');

console.log(`[AXIS 8.8 canonical] single runtime ${runtimeHash} · ${(Buffer.byteLength(runtime)/1024).toFixed(1)} KiB source`);
console.log(`[AXIS 8.8 canonical] retired release ${retiredVersionWriters} · active-adjust ${retiredActiveAdjustWriters} · catalog ${retiredCatalogWriters} · capture fragments ${retiredCaptureCorrectionFragments} · single owners preserved · 1 JS request · 0 dynamic runtime chunks`);