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
 const mediaDevices={getUserMedia:async()=>new MediaStream()};
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:mediaDevices})}catch{try{navigator.mediaDevices.getUserMedia=mediaDevices.getUserMedia}catch{}}
});

const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async loc=>ENGINE==='webkit'?loc.tap():loc.click();

try{
 const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});assert.ok(response?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.18'&&window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&window.__AXIS_818_HARDENING__?.version==='8.18'&&window.__AXIS_818_MEDIA__?.version==='8.18'&&window.__AXIS_818_FOCUS__?.version==='8.18'&&window.__AXIS_EVOLUTION_LIBRARY__?.version==='8.18',undefined,{timeout:15000});

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

 assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.openCanonicalCamera('photo','wall-hold',false)),true);
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&window.__AXIS_CAPTURE__?.snapshot?.().mode==='video',undefined,{timeout:2500});
 assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE__.snapshot().owner),'canonical');
 const facingText=(await page.locator('#v8171CameraFlip').innerText()).trim();assert.equal(facingText,'前置','8.18 default facing was not applied to Capture');
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
 await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))).catch(()=>page.evaluate(()=>window.dispatchEvent(new Event('pageshow'))));
 await page.waitForTimeout(550);
 const route=await page.evaluate(()=>({active:[...document.querySelectorAll('main>.view.active')].map(x=>x.id),todayActive:document.querySelector('#todayView')?.classList.contains('active'),todayInert:document.querySelector('#todayView')?.hasAttribute('inert'),insightsInert:document.querySelector('#insightsView')?.hasAttribute('inert'),away:document.body.classList.contains('axis818-route-away'),dockVisible:document.querySelector('#dock')?getComputedStyle(document.querySelector('#dock')).display!=='none':false}));
 assert.deepEqual(route.active,['insightsView'],'resume created multiple active main views');assert.equal(route.todayActive,false);assert.equal(route.todayInert,true);assert.equal(route.insightsInert,false);assert.equal(route.away,true);assert.equal(route.dockVisible,false,'Today dock leaked onto Insights after resume');

 const media=await page.evaluate(()=>({source:window.__AXIS_MEDIA_SOURCE__?.readOnly,sourceStore:window.__AXIS_MEDIA_SOURCE__?.store,format:window.__AXIS_MEDIA_STORE__?.format,mediaOwner:window.__AXIS_818_MEDIA__?.owner,hardening:window.__AXIS_818_HARDENING__,watermark:window.__AXIS_818_WATERMARK__}));
 assert.equal(media.source,true);assert.equal(media.sourceStore,'axis_v42_media');assert.equal(media.format,'axis-media-arraybuffer-v1');assert.equal(media.mediaOwner,'app.js');assert.equal(media.hardening?.oneActiveView,true);assert.equal(media.hardening?.captureDefaultsApplied,true);assert.equal(media.hardening?.videoWatermark?.fps,30);assert.equal(media.watermark?.owner,'v8710-watermark');assert.equal(media.watermark?.centerBrand,true);

 const overflow=await page.evaluate(()=>({w:document.documentElement.scrollWidth,v:innerWidth}));assert.ok(overflow.w<=overflow.v+1,`horizontal overflow ${overflow.w}/${overflow.v}`);
 assert.deepEqual(errors,[],`page errors: ${errors.join('\n')}`);
 console.log(`[AXIS 8.18 Object + Route + Capture + Focus ${ENGINE}] PASS · time-only schema · resume-safe single route · applied Capture defaults · schema-aware Focus · source-first media · derived Evolution Library`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
