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
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{const e=new Error('CI file fallback');e.name='NotAllowedError';throw e},enumerateDevices:async()=>[]}})}catch{}
});

const page=await context.newPage(),errors=[];
page.setDefaultTimeout(3000);
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async locator=>ENGINE==='webkit'?locator.tap({timeout:3000}):locator.click({timeout:3000});
const EVIDENCE_PNG=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
const beginReview=async()=>{
 const opened=await page.evaluate(()=>window.__AXIS_CAPTURE__.openCanonicalCamera('photo',null,false));
 assert.equal(opened,true,'canonical Capture did not open');
 const input=page.locator('#photoInput');
 await input.setInputFiles({name:'axis-819-evidence.png',mimeType:'image/png',buffer:EVIDENCE_PNG});
 await page.waitForFunction(()=>window.__AXIS_CAPTURE__?.draft?.().photos?.length===1,undefined,{timeout:3000});
 const finished=await page.evaluate(()=>window.__AXIS_CAPTURE__.finish());
 assert.equal(finished,true,'canonical Capture refused a valid evidence draft');
 await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:2000});
};
const chooseObject=async(id,label)=>{
 await tap(page.locator('#equipmentRow'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:1500});
 let choice=page.locator(`#v8124PickerContext [data-v8124-pick="${id}"]:visible`).first();
 if(!(await choice.count()))choice=page.locator('#v8710Cards button:visible').filter({hasText:label}).first();
 if(!(await choice.count())){
  const search=page.locator('#eqSearch');
  assert.equal(await search.count(),1,'current equipment search missing');
  await search.fill(label);
  await page.waitForFunction(({id,label})=>[...document.querySelectorAll('#v873SmartResults [data-v8124-pick],#v8710Cards button')].some(b=>b.offsetParent!==null&&(b.dataset.v8124Pick===id||b.textContent.includes(label))),{id,label},{timeout:2500});
  choice=page.locator(`#v873SmartResults [data-v8124-pick="${id}"]:visible`).first();
  if(!(await choice.count()))choice=page.locator('#v873SmartResults [data-v8124-pick]:visible').filter({hasText:label}).first();
  if(!(await choice.count()))choice=page.locator('#v8710Cards button:visible').filter({hasText:label}).first();
 }
 assert.equal(await choice.count(),1,`visible current picker item ${label} missing`);
 assert.equal(await choice.isVisible(),true,`current picker item ${label} is not physically visible`);
 await tap(choice);
 await page.waitForFunction(expected=>window.__AXIS_CAPTURE__.snapshot().selectedEq===expected,id,{timeout:1500});
};

try{
 const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});assert.ok(response?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_RELEASE__==='8.18',undefined,{timeout:5000});
 await page.waitForTimeout(900);
 const boot=await page.evaluate(()=>({object:window.__AXIS_OBJECT_TRUTH__?.version||null,capture:!!window.__AXIS_CAPTURE__}));
 assert.equal(boot.object,'8.18','8.18 Object Truth runtime layer missing');
 assert.equal(boot.capture,true,'canonical Capture API missing');

 /* Real user flow: Capture → Review → choose Object → visible schema Recording. */
 await beginReview();
 await chooseObject('wall-hold','靠墙站立');
 const recorder=page.locator('#axis818MetricRecorder');
 const durationInput=page.locator('[data-axis818-metric="duration"]');
 const recorderDiag=await page.evaluate(()=>{const state=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),rec=document.querySelector('#axis818MetricRecorder'),sets=document.querySelector('#v8Sets'),strength=document.querySelector('#strengthFields');return{selectedEq:window.__AXIS_CAPTURE__?.snapshot?.().selectedEq||null,equipmentName:document.querySelector('#equipmentName')?.textContent?.trim()||'',explicit:window.__AXIS_OBJECT_TRUTH__?.explicit?.('wall-hold')||false,schema:window.__AXIS_OBJECT_TRUTH__?.schemaForEq?.('wall-hold')?.map(x=>x.key)||[],customSchema:state.profile?.customEq?.find(x=>x.id==='wall-hold')?.metricSchema?.map(x=>x.key)||[],recorderClass:rec?.className||null,recorderHtml:rec?.innerHTML||'',setsClass:sets?.className||null,strengthClass:strength?.className||null}});
 assert.equal(await recorder.isVisible(),true,`schema recorder exists but is not visible in canonical Review · ${JSON.stringify(recorderDiag)}`);
 assert.equal(await durationInput.isVisible(),true,'duration metric is not a real visible Recording control');
 const surface=await page.evaluate(()=>({
  keys:[...document.querySelectorAll('#axis818MetricRecorder [data-axis818-metric]')].map(x=>x.dataset.axis818Metric),
  strengthLegacyHidden:document.querySelector('#strengthFields')?.classList.contains('axis818LegacyMetricHidden')||false,
  title:document.querySelector('#axis818MetricRecorder b')?.textContent||''
 }));
 assert.deepEqual(surface.keys,['duration']);
 assert.equal(surface.strengthLegacyHidden,true,'schema-driven Object leaked the legacy strength editor');
 assert.equal(surface.title,'靠墙站立');

 await durationInput.fill('7');
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

 /* A subsequent real Review selection of a legacy Object must restore its editor. */
 await beginReview();
 await chooseObject('lat','高位下拉');
 assert.equal(await page.locator('#axis818MetricRecorder').isVisible(),false,'legacy Object inherited schema-driven recorder');
 const legacy=await page.evaluate(()=>({
  strengthHidden:document.querySelector('#strengthFields')?.classList.contains('axis818LegacyMetricHidden')||false,
  cardioHidden:document.querySelector('#cardioFields')?.classList.contains('axis818LegacyMetricHidden')||false
 }));
 assert.equal(legacy.strengthHidden,false,'legacy strength editor did not recover after schema-driven Object');
 assert.equal(legacy.cardioHidden,false,'legacy cardio editor retained schema-driven suppression state');
 await tap(page.locator('#scanClose'));

 /* Reload proves persisted Encounter remains readable without migration. */
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
 console.log(`[AXIS Universal Practice Object ${ENGINE}] PASS · real Capture → Review → current My/search picker → Object → visible Recording → authoritative Encounter → frozen snapshot → reload · no irrelevant legacy facts · no v61 duplicate owner`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
