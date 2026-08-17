import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.13 live route] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const hash=s=>crypto.createHash('sha256').update(s).digest('hex').slice(0,12);
const syntax=(src,label)=>{try{new Function(src)}catch(e){fail(`${label} syntax ${e.message}`)}};

const route=read('v813-live-route.js');
const presenter=read('runtime/browser/axis-live-route-presenter.js');
let runtime=read('axis-core.js'),html=read('index.html');
const info=JSON.parse(read('axis-build.json'));

if(info.version!=='8.12'||info.baseVersion!=='8.12')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime')fail(`architecture ${info.architecture}`);
if(runtime.includes('/* ===== v813-live-route.js ===== */'))fail('Live Route already injected');
if(!route.includes('/* AXIS 8.13 Stage 3 — generated pure Runtime + read-only Live Route presentation */'))fail('generated route marker missing');
if(!route.includes('AXIS 8.13 Stage 3 — Continue + Live Route presenter'))fail('presenter marker missing');
if(!route.includes('function projectWorkout(')||!route.includes('function adaptAxis812Snapshot('))fail('pure Runtime/8.12 adapter source was not embedded');
if((route.match(/window\.__AXIS_813_ROUTE__=/g)||[]).length!==1)fail('Live Route presentation owner must be exactly one');
if(/localStorage\.setItem|sessionStorage\.setItem|indexedDB|\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/.test(presenter))fail('Live Route presenter gained storage/network writer');
for(const forbidden of ['#v87Primary','#v87Toggle'])if(presenter.includes(forbidden))fail(`Live Route presenter references training control ${forbidden}`);
if(!presenter.includes("const currentEventId=()=>String($('#v87Finish')?.dataset.id||'').trim()||null"))fail('current event read boundary missing');
if(!presenter.includes("recordingOwner:false,storageOwner:false,networkOwner:false,writes:0,storageWrites:0"))fail('zero-ownership diagnostic missing');
if(!presenter.includes("if(!core.active)return{state:'idle'"))fail('idle fail-safe missing');
if(!presenter.includes("catch(error){hideRoute('error')"))fail('Runtime failure fallback missing');

runtime+=`\n/* ===== v813-live-route.js ===== */\n${route}`;
syntax(runtime,'canonical Runtime + Live Route');
const runtimeHash=hash(runtime);
write('axis-core.js',runtime);

const coreRefs=[...html.matchAll(/\/axis-core\.js\?v=([a-f0-9]+)/g)];
if(coreRefs.length!==1)fail(`expected one canonical core ref, found ${coreRefs.length}`);
html=html.replace(/\/axis-core\.js\?v=[a-f0-9]+/,`/axis-core.js?v=${runtimeHash}`);
write('index.html',html);

info.assets=info.assets||{};info.assets.core=runtimeHash;
info.canonical=info.canonical||{};info.canonical.runtimeHash=runtimeHash;
info.releaseHash=hash(`${info.releaseHash||''}|axis813-live-route|${runtimeHash}|${info.assets.css||''}`);
info.gates=info.gates||{};Object.assign(info.gates,{
 liveRoute813:true,
 liveRouteSingleOwner813:true,
 liveRouteReadOnly813:true,
 liveRoutePureRuntime813:true,
 liveRouteFallback813:true,
 liveRouteNoRecordingOwner813:true,
 liveRouteCanonicalSingleRuntime813:true
});
info.axis813=info.axis813||{};
info.axis813.stage3={
 feature:'continue-live-route',owner:'v813-live-route',presentationOwner:true,recordingOwner:false,storageOwner:false,networkOwner:false,
 runtimeSource:'runtime/axis-runtime.mjs',adapterSource:'runtime/compat/axis-812-adapter.mjs',presenterSource:'runtime/browser/axis-live-route-presenter.js',
 persistence:'none',fallback:'hide-route-preserve-8.12',publicRelease:'8.12'
};
write('axis-build.json',JSON.stringify(info,null,2)+'\n');

const scripts=[...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(m=>m[1]);
if(scripts.length!==1||scripts[0]!==`/axis-core.js?v=${runtimeHash}`)fail(`single-runtime topology changed: ${scripts.join(',')}`);
if(info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0)fail('request topology changed');
if(Array.isArray(info.assets?.chunks)&&info.assets.chunks.length!==0)fail('dynamic chunks returned');

console.log(`[AXIS 8.13 live route] PASS · one read-only presentation owner · pure Runtime embedded · core ${runtimeHash} · 1 JS / 0 dynamic · no recording/storage/network ownership`);
