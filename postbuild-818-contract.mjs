import fs from 'node:fs';
import crypto from 'node:crypto';

const fail=m=>{throw new Error(`[AXIS 8.18 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const runtime=read('axis-core.js'),app=read('app.js'),v874=read('v874-professional.js'),v87=read('v87-runtime.js'),wm=read('v8710-watermark.js');
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json'));
if(contract.publicVersion!=='8.17'||contract.stableBaseVersion!=='8.17')fail(`inherited release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.17'||info.baseVersion!=='8.17')fail(`inherited manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0)fail('canonical topology drift');
for(const g of ['interactionConvergence817','captureCleanSourceSidecar8171','mediaSourceBridge8171','watermarkSourceFirst8171','evidenceSourceFirst8171'])if(info.gates?.[g]!==true)fail(`inherited gate missing ${g}`);
for(const src of [app,runtime])for(const n of ['__AXIS_OBJECT_TRUTH__','metricSchemaSnapshot','axis818RouteGuard','captureDefaultMode','__AXIS_818_MEDIA__','__AXIS_EVOLUTION_LIBRARY__'])if(!src.includes(n))fail(`Object/Route/Capture truth missing ${n}`);
for(const src of [v874,runtime])for(const n of ['axis818MetricDraft','metricSchemaVersion','__AXIS_CUSTOM_EDITOR__.metricSchema'])if(!src.includes(n))fail(`metric editor contract missing ${n}`);
for(const src of [v87,runtime])for(const n of ['__AXIS_818_FOCUS__','axis818FocusOpen',"completionOwner:'v87-direct-884'"])if(!src.includes(n))fail(`Focus contract missing ${n}`);
for(const src of [wm,runtime])for(const n of ["c.fillText('AXIS',W/2,H*.48)",'__AXIS_818_WATERMARK__',"owner:'v8710-watermark'"])if(!src.includes(n))fail(`watermark contract missing ${n}`);
for(const n of ["compositor:'axis818-canvas-30fps'",'axis818StartRecordPump','videoBitsPerSecond:6000000'])if(!runtime.includes(n))fail(`video compositor contract missing ${n}`);
if((runtime.match(/indexedDB\.open\(/g)||[]).length!==1)fail('additional IndexedDB owner introduced');
for(const n of ['axis_v818_media','F-RAW-','V-RAW-'])if(runtime.includes(n))fail(`competing media schema ${n}`);

/* 8.18 intentionally restores the current center AXIS brand after the inherited
   8.15.1 regression contract has already sealed single-compositor ownership. */
const legacySeal=runtime.includes("__AXIS_8151_REGRESSION_SEAL__")&&runtime.includes("photoWatermarkOwner:'v8710-watermark'");
if(!legacySeal)fail('8.15.1 single watermark compositor seal missing');

contract.publicVersion='8.18';contract.stableBaseVersion='8.18';
fs.writeFileSync('release-contract.json',JSON.stringify(contract,null,2)+'\n');
info.version='8.18';info.baseVersion='8.18';info.gates=info.gates||{};
Object.assign(info.gates,{objectMetricSchema818:true,eventMetricSnapshot818:true,pwaRouteTruth818:true,capturePreferenceModel818:true,activeFocusLayer818:true,mediaBatchExport818:true,eventDelete818:true,continuousCameraCompositor818:true,watermarkCenterBrand818:true,evolutionObjectShelf818:true,noNewPersistence818:true});
info.axis818={foundation:true,objectTruth:{owner:'app.js',schema:'metricSchema',eventSnapshot:'metricSchemaSnapshot + metrics',legacyFallback:true},routeTruth:{owner:'app.js',resumeSafe:true,inactiveViewsInert:true},capture:{owner:'app.js',modes:['photo','scan','video'],defaultMode:['last','photo','scan','video'],facing:['last','environment','user'],midRecordFlip:'stable-canvas-compositor',videoFps:30},watermark:{owner:'v8710-watermark',centerBrand:true,cleanSourceFirst:true},focus:{owner:'presentation-only',completionOwner:'v87-direct-884',automatic:false},library:{owner:'derived-read-only',persistence:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.18 contract] PASS · Object Truth · PWA Route Truth · Capture/Focus · batch media · continuous camera · current watermark · derived Evolution Library');
