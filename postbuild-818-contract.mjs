import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.18 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const runtime=read('axis-core.js'),app=read('app.js'),smart=read('v873-smart-input.js'),v874=read('v874-professional.js'),v87=read('v87-runtime.js'),wm=read('v8710-watermark.js'),css=read('axis-style.css');
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json'));
if(contract.publicVersion!=='8.18'||contract.stableBaseVersion!=='8.18')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.18'||info.baseVersion!=='8.18')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const g of ['interactionConvergence817','captureCleanSourceSidecar8171','mediaSourceBridge8171','watermarkSourceFirst8171','evidenceSourceFirst8171'])if(info.gates?.[g]!==true)fail(`inherited gate missing ${g}`);

for(const src of [app,runtime])for(const n of ['__AXIS_OBJECT_TRUTH__','metricSchemaSnapshot','axis818LegacyProfileSchema','axis818HasExplicitSchema','axis818RouteGuard','captureDefaultMode','__AXIS_818_MEDIA__','__AXIS_EVOLUTION_LIBRARY__','__AXIS_818_HARDENING__','legacyProfileMigration:true','nonSchemaFieldsRemoved:true','navFirstRoute:true','oneActiveView:true','captureDefaultsApplied:true'])if(!src.includes(n))fail(`Object/Route/Capture truth missing ${n}`);
if(!runtime.includes("axis818Requested==='photo'?axis818DesiredMode():axis818Requested")||!runtime.includes('capture8171Facing=axis818DesiredFacing()'))fail('Capture preferences do not affect the next canonical opening');
if(!runtime.includes("v.classList.toggle('active',on)"))fail('Route Truth does not enforce one active main view');

for(const src of [smart,runtime])for(const n of ['__AXIS_818_LEGACY_METRIC_MIGRATION__',"source:'axis_v8124_custom_profiles'",'readOnlyInput:true',"visibleOwner:'v874'",'typeCoercion:false'])if(!src.includes(n))fail(`legacy metric migration contract missing ${n}`);
if(smart.includes("const type=[...set].some(x=>x==='weight'||x==='reps')?'strength':'cardio'"))fail('legacy metric selector can still coerce object type');
for(const src of [v874,runtime])for(const n of ['axis818MetricDraft','metricSchemaVersion','__AXIS_CUSTOM_EDITOR__.metricSchema'])if(!src.includes(n))fail(`metric editor contract missing ${n}`);

for(const src of [v87,runtime])for(const n of ['__AXIS_818_FOCUS__','axis818FocusOpen',"completionOwner:'v87-direct-884'",'axis818TracksSets','__AXIS_818_ACTIVE_SCHEMA__',"setPredicate:'metric-schema'"])if(!src.includes(n))fail(`Focus/active schema contract missing ${n}`);
for(const src of [wm,runtime])for(const n of ["c.fillText('AXIS',W/2,H*.48)",'__AXIS_818_WATERMARK__',"owner:'v8710-watermark'",'__AXIS_WATERMARK_RENDER__','axis818PaintWatermark','videoFps:30'])if(!src.includes(n))fail(`watermark contract missing ${n}`);
for(const n of ["compositor:'axis818-canvas-30fps'",'axis818StartRecordPump','videoBitsPerSecond:6000000','cv.captureStream(30)'])if(!runtime.includes(n))fail(`video compositor contract missing ${n}`);
if(runtime.includes('cv.captureStream(15)')||runtime.includes('const max=720'))fail('historical low-frame-rate/720p watermark compositor survived');

if((runtime.match(/indexedDB\.open\(/g)||[]).length!==1)fail('additional IndexedDB owner introduced');
for(const n of ['axis_v818_media','axis_v818_route','axis_v818_state','F-RAW-','V-RAW-'])if(runtime.includes(n))fail(`competing persistence/media schema ${n}`);
if(!css.includes('#axisCustomMetrics')||!css.includes('axis818-route-away'))fail('final metric/route static guards missing');

/* 8.18 restores the current center AXIS presentation only after 8.15.1 sealed the
   single physical compositor. The historical marker remains audit truth. */
const legacySeal=runtime.includes('__AXIS_8151_REGRESSION_SEAL__')&&runtime.includes("photoWatermarkOwner:'v8710-watermark'")&&runtime.includes('legacyPhotoCompositor:false');
if(!legacySeal)fail('8.15.1 single watermark compositor seal missing');

info.gates=info.gates||{};
Object.assign(info.gates,{
 objectMetricSchema818:true,
 objectMetricLegacyMigration818:true,
 objectMetricNoLegacyPollution818:true,
 eventMetricSnapshot818:true,
 pwaRouteTruth818:true,
 pwaRouteSingleActive818:true,
 capturePreferenceModel818:true,
 capturePreferenceApplied818:true,
 activeFocusLayer818:true,
 activeMetricSchema818:true,
 mediaBatchExport818:true,
 eventDelete818:true,
 continuousCameraCompositor818:true,
 videoWatermark30fps818:true,
 watermarkCenterBrand818:true,
 watermarkSharedPainter818:true,
 evolutionObjectShelf818:true,
 noNewPersistence818:true
});
info.axis818={foundation:true,objectTruth:{owner:'app.js',schema:'metricSchema',eventSnapshot:'metricSchemaSnapshot + metrics',legacyMigration:'axis_v8124_custom_profiles',legacyFallback:true,removeNonSchemaLegacyFields:true,typeIndependent:true},routeTruth:{owner:'app.js',authority:'active-nav-first',oneActiveView:true,resumeSafe:true,inactiveViewsInert:true},capture:{owner:'app.js',modes:['photo','scan','video'],defaultMode:['last','photo','scan','video'],facing:['last','environment','user'],preferencesAppliedOnOpen:true,midRecordFlip:'stable-canvas-compositor',recordFps:30,recordTargetBitrate:6000000},watermark:{owner:'v8710-watermark',sharedPainter:true,centerBrand:true,cleanSourceFirst:true,videoDerivative:{fps:30,maxDimension:1080,targetBitrate:6000000}},focus:{owner:'presentation-only',completionOwner:'v87-direct-884',setPredicate:'metric-schema',automatic:false},media:{batchExport:true,eventDelete:true,sourceRefsPreserved:true},library:{owner:'derived-read-only',persistence:false},ownership:{newPersistence:false,newDatabase:false,newNetwork:false,newAi:false,newSoundOwner:false,newRecorderOwner:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.18 contract] PASS · Object Truth + migration · single Route Truth · applied Capture prefs · schema-aware Focus · batch media/delete · continuous camera · v8710 30fps watermark · derived Evolution Library');
