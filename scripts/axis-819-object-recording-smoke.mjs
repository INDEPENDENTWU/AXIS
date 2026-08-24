import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});

await context.addInitScript(()=>{
 const now=Date.now();
 const wall={
  id:'wall-hold',name:'靠墙站立',type:'strength',pattern:'functional',muscles:['腿部'],custom:true,
  metricSchema:[{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1}],metricSchemaVersion:'8.18'
 };
 localStorage.setItem('axis_v60_state',JSON.stringify({
  version:60,sessions:[],active:{id:'S-819',start:now-60000,events:[]},
  profile:{customEq:[wall]},prefs:{scanSeconds:3,watermark:{photoMode:'raw',videoMode:'raw'}}
 }));
 localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
});

const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async locator=>ENGINE==='webkit'?locator.tap():locator.click();
const exposeReview=()=>page.evaluate(()=>{
 document.querySelector('#scanSheet')?.classList.add('show');
 document.querySelector('#captureStage')?.classList.add('hidden');
 document.querySelector('#reviewStage')?.classList.remove('hidden');
});

try{
 const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});assert.ok(response?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_OBJECT_TRUTH__?.version==='8.18',undefined,{timeout:5000});
 await exposeReview();

 /* Real Object selection must materialize the existing schema into Recording. */
 await tap(page.locator('#equipmentRow'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:1500});
 const wallChoice=page.locator('#eqSheet [data-eq="wall-hold"]');assert.equal(await wallChoice.count(),1,'custom Object missing from real equipment picker');
 await tap(wallChoice);
 await page.waitForFunction(()=>document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelectorAll('#axis818MetricRecorder [data-axis818-metric]').length===1,undefined,{timeout:1500});
 const surface=await page.evaluate(()=>({
  keys:[...document.querySelectorAll('#axis818MetricRecorder [data-axis818-metric]')].map(x=>x.dataset.axis818Metric),
  strengthLegacyHidden:document.querySelector('#strengthFields')?.classList.contains('axis818LegacyMetricHidden')||false,
  title:document.querySelector('#axis818MetricRecorder b')?.textContent||''
 }));
 assert.deepEqual(surface.keys,['duration']);
 assert.equal(surface.strengthLegacyHidden,true,'schema-driven Object leaked the legacy strength editor');
 assert.equal(surface.title,'靠墙站立');

 await page.locator('[data-axis818-metric="duration"]').fill('7');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}')?.active?.events?.length===1}catch{return false}},undefined,{timeout:2500});
 const saved=await page.evaluate(()=>{
  const state=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');
  const meta=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');
  const event=state.active.events[0];
  return{
   event,
   metaHasEvent:!!meta.events?.[event.id],
   customSchema:state.profile.customEq.find(x=>x.id==='wall-hold')?.metricSchema,
   recorderVisible:document.querySelector('#axis818MetricRecorder')?.classList.contains('show')||false
  };
 });
 assert.equal(saved.event.metrics.duration,7,'visible schema input was not saved as the Encounter fact');
 assert.deepEqual(saved.event.metricSchemaSnapshot.map(x=>x.key),['duration'],'Encounter did not freeze the Object schema used for recording');
 for(const irrelevant of ['weight','reps','sets','intensity'])assert.equal(Object.hasOwn(saved.event,irrelevant),false,`irrelevant legacy fact ${irrelevant} leaked into time-only Encounter`);
 assert.equal(saved.event.duration,7,'compatible duration projection missing');
 assert.equal(saved.metaHasEvent,false,'time-only schema unexpectedly created a v61 strength fact owner');
 assert.deepEqual(saved.customSchema,[{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1}],'Object schema was destructively rewritten during recording');
 assert.equal(saved.recorderVisible,false,'recording reset left schema controls visibly mounted');

 /* Switching back to a legacy Object must restore its existing editor cleanly. */
 await exposeReview();
 await tap(page.locator('#equipmentRow'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:1500});
 await tap(page.locator('#eqSheet [data-eq="lat"]'));
 await page.waitForFunction(()=>!document.querySelector('#axis818MetricRecorder')?.classList.contains('show'),undefined,{timeout:1500});
 const legacy=await page.evaluate(()=>({
  strengthHidden:document.querySelector('#strengthFields')?.classList.contains('axis818LegacyMetricHidden')||false,
  cardioHidden:document.querySelector('#cardioFields')?.classList.contains('axis818LegacyMetricHidden')||false
 }));
 assert.equal(legacy.strengthHidden,false,'legacy strength editor did not recover after schema-driven Object');
 assert.equal(legacy.cardioHidden,false,'legacy cardio editor retained schema-driven suppression state');

 /* Reload proves the same persisted Encounter remains readable without migration. */
 await page.reload({waitUntil:'domcontentloaded',timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_OBJECT_TRUTH__?.version==='8.18',undefined,{timeout:10000});
 const reload=await page.evaluate(()=>{
  const state=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');
  const event=state.active.events[0];
  return{duration:event.metrics?.duration,snapshot:event.metricSchemaSnapshot?.map(x=>x.key),rows:window.__AXIS_OBJECT_TRUTH__.eventRows(event)};
 });
 assert.equal(reload.duration,7);
 assert.deepEqual(reload.snapshot,['duration']);
 assert.deepEqual(reload.rows.map(x=>x[0]),['时间']);
 assert.deepEqual(errors,[],`page errors: ${errors.join('\n')}`);
 console.log(`[AXIS Universal Practice Object ${ENGINE}] PASS · Object schema → visible Recording → authoritative Encounter → frozen snapshot → reload · no irrelevant legacy facts · no v61 duplicate owner`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
