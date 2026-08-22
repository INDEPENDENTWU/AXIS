import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});

await context.addInitScript(()=>{
 const now=Date.now();
 const durationMetric={key:'duration',label:'时间',type:'duration',unit:'分钟',step:1};
 const wall={id:'wall-hold',name:'靠墙站立',type:'strength',pattern:'functional',muscles:['腿部'],metricSchema:[durationMetric],metricSchemaVersion:'8.18'};
 const event={id:'E-818-WALL',equipmentId:wall.id,name:wall.name,kind:'strength',time:now-45000,duration:2,weight:999,reps:99,sets:9,metrics:{duration:2},metricSchemaSnapshot:[durationMetric],objectTruthVersion:'8.18',frameRefs:[],sourceFrameRefs:[]};
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S-818',start:now-60000,events:[event]},profile:{customEq:[wall]},prefs:{scanSeconds:3,captureDefaultMode:'video',captureDefaultFacing:'user',captureLastMode:'photo',captureLastFacing:'environment',watermark:{photoMode:'raw',videoMode:'raw'}}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify({events:{[event.id]:{activity:{status:'active',startedAt:now-45000,estimateMs:120000,completedSets:0,intervals:[{start:now-45000,end:null}]}}},prefs:{}}));
 try{Object.defineProperty(HTMLMediaElement.prototype,'play',{configurable:true,value:function(){return Promise.resolve()}})}catch{}
 try{Object.defineProperty(HTMLVideoElement.prototype,'videoWidth',{configurable:true,get:function(){return 640}});Object.defineProperty(HTMLVideoElement.prototype,'videoHeight',{configurable:true,get:function(){return 480}})}catch{}
 try{if(typeof HTMLCanvasElement.prototype.captureStream!=='function')Object.defineProperty(HTMLCanvasElement.prototype,'captureStream',{configurable:true,value:function(){return new MediaStream()}})}catch{}
 window.__axisCameraCalls=[];window.__axisRecorderInstances=[];
 const mediaDevices={getUserMedia:async constraints=>{const facing=constraints?.video?.facingMode?.ideal||constraints?.video?.facingMode||'unknown';window.__axisCameraCalls.push(String(facing));return new MediaStream()}};
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:mediaDevices})}catch{try{navigator.mediaDevices.getUserMedia=mediaDevices.getUserMedia}catch{}}
 class AxisFakeMediaRecorder{
  static isTypeSupported(){return true}
  constructor(stream,opts={}){this.stream=stream;this.mimeType=opts.mimeType||'video/webm';this.state='inactive';this.__axisId=window.__axisRecorderInstances.length+1;window.__axisRecorderInstances.push(this)}
  start(){this.state='recording'}
  requestData(){}
  stop(){if(this.state==='inactive')return;this.state='inactive';setTimeout(()=>{try{this.onstop&&this.onstop()}catch(e){}},0)}
 }
 try{Object.defineProperty(window,'MediaRecorder',{configurable:true,value:AxisFakeMediaRecorder})}catch{window.MediaRecorder=AxisFakeMediaRecorder}
});

const page=await context.newPage(),errors=[],consoleLines=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{const line=`${m.type()}: ${m.text()}`;consoleLines.push(line);if(m.type()==='error'||m.type()==='warning')console.log(`[AXIS browser ${ENGINE}] ${line}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async loc=>ENGINE==='webkit'?loc.tap():loc.click();

try{
 const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});assert.ok(response?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_RELEASE__==='8.18',undefined,{timeout:5000});
 await page.waitForTimeout(900);
 const boot=await page.evaluate(()=>({
  release:window.__AXIS_RELEASE__,core:window.__AXIS_CORE_INTERACTIVE__,
  object:window.__AXIS_OBJECT_TRUTH__?.version||null,hardening:window.__AXIS_818_HARDENING__?.version||null,
  media:window.__AXIS_818_MEDIA__?.version||null,focus:window.__AXIS_818_FOCUS__?.version||null,
  evolution:window.__AXIS_EVOLUTION_LIBRARY__?.version||null,quick:window.__AXIS_818_QUICK_CAPTURE__?.version||null,
  polish:window.__AXIS_818_FIELD_POLISH__||null,
  source:window.__AXIS_MEDIA_SOURCE__?.version||window.__AXIS_MEDIA_SOURCE__?.readOnly||null
 }));
 console.log(`[AXIS 8.18 boot ${ENGINE}] ${JSON.stringify(boot)}${errors.length?' errors='+JSON.stringify(errors):''}${consoleLines.length?' console='+JSON.stringify(consoleLines.slice(-12)):''}`);
 assert.equal(boot.release,'8.18','public runtime identity did not converge');assert.equal(boot.core,true,'core did not become interactive');
 assert.equal(boot.object,'8.18','Object Truth runtime layer missing');assert.equal(boot.hardening,'8.18','8.18 hardening runtime layer missing');
 assert.equal(boot.media,'8.18','8.18 media runtime layer missing');assert.equal(boot.focus,'8.18','8.18 Focus runtime layer missing');assert.equal(boot.evolution,'8.18','Evolution Library runtime layer missing');assert.equal(boot.quick,'8.18','Quick Capture intent seal missing');
 assert.equal(boot.polish?.version,'8.18','8.18 final field polish missing');assert.equal(boot.polish?.midRecordFlip,true,'mid-record camera flip contract missing');assert.equal(boot.polish?.videoPseudoSetting,false,'video pseudo-setting was not retired');assert.equal(boot.polish?.freshness,'xhr-fail-open','freshness fail-open contract missing');

 const manifest=await (await page.request.get(`${BASE}/axis-build.json`)).json();
 assert.equal(manifest.version,'8.18');assert.equal(manifest.baseVersion,'8.18');assert.equal(manifest.architecture,'canonical-single-runtime');
 for(const g of ['objectMetricSchema818','eventMetricSnapshot818','pwaRouteTruth818','capturePreferenceModel818','activeFocusLayer818','mediaBatchExport818','eventDelete818','continuousCameraCompositor818','watermarkCenterBrand818','evolutionObjectShelf818','noNewPersistence818'])assert.equal(manifest.gates?.[g],true,`missing 8.18 gate ${g}`);

 const truth=await page.evaluate(()=>{
  const t=window.__AXIS_OBJECT_TRUTH__,state=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),e=state.active.events[0];
  return{schema:t.schemaForEq('wall-hold'),rows:t.eventRows(e),metrics:t.eventMetrics(e),explicit:t.explicit('wall-hold'),owner:t.owner,migration:t.migrationSource};
 });
 assert.equal(truth.owner,'app.js');assert.equal(truth.explicit,true);assert.deepEqual(truth.schema.map(x=>x.key),['duration']);assert.deepEqual(truth.rows.map(x=>x[0]),['时间']);assert.equal(truth.metrics.duration,2);assert.ok(!truth.rows.some(x=>/重量|次数|组数/.test(x[0])),'time-only object leaked strength metrics');

 const library=await page.evaluate(()=>({persistence:window.__AXIS_EVOLUTION_LIBRARY__.persistence,owner:window.__AXIS_EVOLUTION_LIBRARY__.owner,objects:window.__AXIS_EVOLUTION_LIBRARY__.objects()}));
 assert.equal(library.persistence,false);assert.equal(library.owner,'derived-read-only');assert.ok(library.objects.some(x=>x.id==='wall-hold'&&x.count===1),'Evolution Object projection missing time-only object');

 /* Physical Settings controls: 3/5 seconds must respond on touch, and the old
    non-interactive video information row must not remain visible as a fake setting. */
 const settingsBtn=page.locator('#settingsBtn');assert.ok(await settingsBtn.count(),'Settings button missing');await tap(settingsBtn);
 await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:2000});
 assert.equal(await page.locator('#settingsSheet .v817CaptureInfo').count(),0,'read-only video pseudo-setting still visible');
 assert.equal(await page.locator('#keepClipSwitch').isHidden(),true,'compatibility video switch leaked into Settings');
 await tap(page.locator('#scanSeconds [data-sec="5"]'));
 await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return Number(s?.prefs?.scanSeconds)===5&&document.querySelector('#scanSeconds [data-sec="5"]')?.classList.contains('active')},undefined,{timeout:1500});
 assert.equal(await page.locator('#scanSeconds [data-sec="5"]').getAttribute('aria-pressed'),'true');
 await tap(page.locator('#scanSeconds [data-sec="3"]'));
 await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return Number(s?.prefs?.scanSeconds)===3&&document.querySelector('#scanSeconds [data-sec="3"]')?.classList.contains('active')},undefined,{timeout:1500});
 assert.equal(await page.locator('#scanSeconds [data-sec="3"]').getAttribute('aria-pressed'),'true');
 await page.evaluate(()=>document.querySelector('#settingsSheet')?.classList.remove('show'));

 /* Camera control: tap the actual facing pill, then start one logical recording and
    flip again. The recorder instance must remain identical while the camera source changes. */
 assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.openCanonicalCamera('photo','wall-hold',false)),true);
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&window.__AXIS_CAPTURE__?.snapshot?.().mode==='video',undefined,{timeout:2500});
 assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.snapshot().owner),'canonical');
 const facingText=(await page.locator('#v8171CameraFlip').innerText()).trim();assert.equal(facingText,'前置','8.18 default facing was not applied to Capture');
 const callsBefore=await page.evaluate(()=>window.__axisCameraCalls.length);await tap(page.locator('#v8171CameraFlip'));
 await page.waitForFunction(()=>window.__AXIS_CAPTURE__?.facing?.()==='environment'&&document.querySelector('#v8171CameraFlip')?.textContent.trim()==='后置',undefined,{timeout:2500});
 assert.ok((await page.evaluate(()=>window.__axisCameraCalls.length))>callsBefore,'physical camera flip did not request a new facing stream');
 await page.evaluate(()=>window.__AXIS_CAPTURE__.setMode('video'));
 assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.startVideo()),true,'video recorder did not start');
 const recordingBefore=await page.evaluate(()=>({count:window.__axisRecorderInstances.length,id:window.__axisRecorderInstances.at(-1)?.__axisId||0,state:window.__axisRecorderInstances.at(-1)?.state||''}));
 assert.equal(recordingBefore.state,'recording');
 await tap(page.locator('#v8171CameraFlip'));
 await page.waitForFunction(()=>window.__AXIS_CAPTURE__?.facing?.()==='user'&&document.querySelector('#v8171CameraFlip')?.textContent.trim()==='前置',undefined,{timeout:2500});
 const recordingAfter=await page.evaluate(()=>({count:window.__axisRecorderInstances.length,id:window.__axisRecorderInstances.at(-1)?.__axisId||0,state:window.__axisRecorderInstances.at(-1)?.state||''}));
 assert.equal(recordingAfter.count,recordingBefore.count,'camera flip created a second MediaRecorder');assert.equal(recordingAfter.id,recordingBefore.id,'camera flip replaced MediaRecorder identity');assert.equal(recordingAfter.state,'recording','camera flip interrupted logical recording');
 await page.evaluate(()=>window.__AXIS_CAPTURE__.stopVideo(true));
 await page.waitForFunction(()=>window.__axisRecorderInstances.at(-1)?.state==='inactive',undefined,{timeout:1500});
 await page.locator('#scanSheet [data-close="scanSheet"]').click();

 await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});
 await page.evaluate(()=>window.__AXIS_818_FOCUS__.open());
 await page.waitForSelector('#axis818Focus.show',{timeout:1500});
 assert.equal(await page.locator('#axis818FocusTap').isHidden(),true,'time-only object exposed set completion tap');
 assert.equal(await page.locator('#axis818FocusHold').isHidden(),true,'time-only object exposed set completion hold');
 assert.equal(await page.evaluate(()=>window.__AXIS_818_FOCUS__.completionOwner),'v87-direct-884');
 await page.evaluate(()=>window.__AXIS_818_FOCUS__.close());

 const insights=page.locator('nav.nav [data-view="insightsView"]');assert.ok(await insights.count(),'Insights navigation missing');await tap(insights);
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active'),undefined,{timeout:2500});
 await page.evaluate(()=>{try{window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))}catch{window.dispatchEvent(new Event('pageshow'))}});
 await page.waitForTimeout(550);
 const route=await page.evaluate(()=>({active:[...document.querySelectorAll('main>.view.active')].map(x=>x.id),todayActive:document.querySelector('#todayView')?.classList.contains('active'),todayInert:document.querySelector('#todayView')?.hasAttribute('inert'),insightsInert:document.querySelector('#insightsView')?.hasAttribute('inert'),away:document.body.classList.contains('axis818-route-away'),dockVisible:document.querySelector('#dock')?getComputedStyle(document.querySelector('#dock')).display!=='none':false}));
 assert.deepEqual(route.active,['insightsView'],'resume created multiple active main views');assert.equal(route.todayActive,false);assert.equal(route.todayInert,true);assert.equal(route.insightsInert,false);assert.equal(route.away,true);assert.equal(route.dockVisible,false,'Today dock leaked onto Insights after resume');

 const media=await page.evaluate(()=>({source:window.__AXIS_MEDIA_SOURCE__?.readOnly,sourceStore:window.__AXIS_MEDIA_SOURCE__?.store,format:window.__AXIS_MEDIA_STORE__?.format,mediaOwner:window.__AXIS_818_MEDIA__?.owner,hardening:window.__AXIS_818_HARDENING__,watermark:window.__AXIS_818_WATERMARK__}));
 assert.equal(media.source,true);assert.equal(media.sourceStore,'axis_v42_media');assert.equal(media.format,'axis-media-arraybuffer-v1');assert.equal(media.mediaOwner,'app.js');assert.equal(media.hardening?.oneActiveView,true);assert.equal(media.hardening?.captureDefaultsApplied,true);assert.equal(media.hardening?.videoWatermark?.fps,30);assert.equal(media.watermark?.owner,'v8710-watermark');assert.equal(media.watermark?.centerBrand,true);

 const overflow=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));assert.ok(overflow.w<=overflow.v+1,`horizontal overflow ${overflow.w}/${overflow.v}`);
 assert.deepEqual(errors,[],`page errors: ${errors.join('\n')}`);
 console.log(`[AXIS 8.18 Object + Route + Capture + Focus ${ENGINE}] PASS · time-only schema · resume-safe single route · touch scan 3/5 · physical + mid-record camera flip · applied Capture defaults · schema-aware Focus · source-first media · derived Evolution Library`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
