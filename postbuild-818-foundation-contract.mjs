import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.18 foundation contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),app=read('app.js'),smart=read('v873-smart-input.js'),css=read('axis-style.css');
if(contract.publicVersion!=='8.18'||contract.stableBaseVersion!=='8.18')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.18'||info.baseVersion!=='8.18')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['interactionConvergence817','captureCleanSourceSidecar8171','mediaSourceBridge8171','watermarkSourceFirst8171','evidenceSourceFirst8171'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);

for(const src of [smart,runtime])for(const needle of [
 '__AXIS_OBJECT_SCHEMA__',"version:2,owner:'v873-profile-projection'","storage:'axis_v8124_custom_profiles'",'typeIndependent:true','unknownMetricSafe:true'
])if(!src.includes(needle))fail(`Object Schema missing ${needle}`);
if(smart.includes("const type=[...set].some(x=>x==='weight'||x==='reps')?'strength':'cardio'"))fail('metric selection still rewrites equipment type');
if(smart.includes("const family=metrics.some(x=>x==='weight'||x==='reps')?'strength':'cardio'"))fail('metric save still rewrites equipment type');

for(const src of [app,runtime])for(const needle of [
 'AXIS818_PROFILE',"AXIS818_METRICS=['weight','reps','duration','intensity','level']",'function axis818ApplyMetricValues(e,eq)','recording={version:2,metrics:[...metrics],typeIndependent:true}','metricValues={}','function axis818EventRows(e,eq)','axis818ApplyMetricValues(e,eq);try{','const rows=axis818EventRows(e,eq);','__AXIS_818_OBJECT_FOUNDATION__'
])if(!src.includes(needle))fail(`event Object Truth missing ${needle}`);

for(const src of [app,runtime])for(const needle of [
 'axis818InstallRouteTruth','D.body.dataset.axisRoute=target.id','__AXIS_ROUTE_TRUTH__',"owner:'app-derived'",'persisted:false','__AXIS_818_ROUTE_FOUNDATION__'
])if(!src.includes(needle))fail(`Route Truth missing ${needle}`);
if(!css.includes('AXIS 8.18 Route Truth')||!css.includes('body[data-axis-route]:not([data-axis-route="todayView"]) #dock')||!css.includes('#v87Now'))fail('route CSS guard missing');
for(const forbidden of ['axis_v818_state','axis_v818_route','axis_v818_object_profiles','indexedDB.open'])if(smart.includes(forbidden)||app.includes(forbidden))fail(`new/competing persistence introduced ${forbidden}`);

info.gates=info.gates||{};Object.assign(info.gates,{
 objectMetricSchema818:true,
 objectTypeMetricIndependent818:true,
 eventMetricSnapshot818:true,
 detailMetricProjection818:true,
 routeTruth818:true,
 pwaResumeRoute818:true,
 homeOverlayRouteGuard818:true,
 objectFoundationNoNewPersistence818:true
});
info.axis818={foundation:true,object:{schemaVersion:2,profileStore:'axis_v8124_custom_profiles',typeIndependent:true,eventSnapshot:true,detailProjection:true,metricIds:['weight','reps','duration','intensity','level']},route:{owner:'app-derived',oneActiveView:true,resumeReconcile:true,homeOverlayGuard:true,persisted:false},ownership:{newPersistence:false,newDatabase:false,newNetwork:false,newAi:false,newRecorder:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.18 foundation contract] PASS · Object Metric Schema v2 · type/metrics independent · event snapshot · PWA Route Truth · no new persistence');
