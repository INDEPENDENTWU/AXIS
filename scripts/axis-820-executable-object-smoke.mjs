import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});

await context.addInitScript(()=>{
 const object={
  id:'axis820-a',name:'A',type:'strength',pattern:'functional',muscles:['胸部整体','肱三头肌','肩部整体'],custom:true,
  metricSchema:[
   {key:'duration',label:'时间',type:'duration',unit:'分钟',step:1},
   {key:'intensity',label:'强度',type:'number',unit:'',step:1}
  ],metricSchemaVersion:'8.18'
 };
 localStorage.setItem('axis_v60_state',JSON.stringify({
  version:60,sessions:[],active:null,
  profile:{customEq:[object]},
  prefs:{scanSeconds:3,watermark:{photoMode:'raw',videoMode:'raw'}}
 }));
 localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{const e=new Error('CI camera unavailable');e.name='NotAllowedError';throw e},enumerateDevices:async()=>[]}})}catch{}
});

const page=await context.newPage(),errors=[];
page.setDefaultTimeout(3500);
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async locator=>ENGINE==='webkit'?locator.tap({timeout:3500}):locator.click({timeout:3500});
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const visible=sel=>page.locator(`${sel}:visible`);

const openObjectFromQuick=async({recent=false}={})=>{
 await page.evaluate(()=>document.querySelector('#quickRecordBtn')?.click());
 await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:1800});
 if(recent){
  const item=page.locator('#v8Recent [data-qid="axis820-a"]:visible').first();
  assert.equal(await item.count(),1,'edited object did not return as a recent Quick Record object');
  await tap(item);
 }else{
  await tap(page.locator('#v8Other'));
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:1800});
  let item=page.locator('#eqSheet [data-eq="axis820-a"]:visible').first();
  if(!(await item.count())){
   const search=page.locator('#eqSearch');
   await search.fill('A');
   await page.waitForTimeout(120);
   item=page.locator('#eqSheet [data-eq="axis820-a"]:visible').first();
  }
  assert.equal(await item.count(),1,'custom object A is missing from the real equipment picker');
  await tap(item);
 }
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&!document.querySelector('#reviewStage')?.classList.contains('hidden')&&document.querySelector('#axis818MetricRecorder')?.dataset.axis820Quick==='1',undefined,{timeout:2200});
};

const assertExecutableFields=async expected=>{
 const keys=await page.locator('#axis818MetricRecorder.show [data-axis818-metric]').evaluateAll(xs=>xs.map(x=>x.dataset.axis818Metric));
 assert.deepEqual(keys,expected,'Quick Record did not render the explicit Object metric schema');
 assert.equal(await visible('#v8Sets').count(),0,'legacy weight/reps/sets editor is still visible for a non-classic explicit Object');
 assert.equal(await visible('#strengthFields:not(.axis818LegacyMetricHidden)').count(),0,'legacy strength fields escaped executable Object ownership');
};

try{
 const response=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000});assert.ok(response?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20',undefined,{timeout:15000});
 await page.waitForTimeout(600);

 const boot=await page.evaluate(()=>({
  executable:window.__AXIS_EXECUTABLE_OBJECTS__?.version,
  explicit:window.__AXIS_OBJECT_TRUTH__?.explicit?.('axis820-a'),
  mode:window.__AXIS_EXECUTABLE_OBJECTS__?.modeForEq?.('axis820-a'),
  schema:window.__AXIS_OBJECT_TRUTH__?.schemaForEq?.('axis820-a')?.map(x=>x.key)
 }));
 assert.equal(boot.executable,'8.20');
 assert.equal(boot.explicit,true);
 assert.equal(boot.mode,'timed','duration/intensity Object should derive timed execution instead of strength sets');
 assert.deepEqual(boot.schema,['duration','intensity']);

 /* Exact user regression: a strength-category custom Object configured as
    时间 + 强度 must never fall back to 重量 + 次数 + 组数 in Quick Record. */
 await openObjectFromQuick();
 await assertExecutableFields(['duration','intensity']);
 await page.locator('[data-axis818-metric="duration"]').fill('8');
 await page.locator('[data-axis818-metric="intensity"]').fill('7');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}')?.active?.events?.length===1,undefined,{timeout:3500});
 let c=await core(),first=c.active.events[0];
 assert.deepEqual(Object.keys(first.metrics||{}),['duration','intensity']);
 assert.equal(first.metrics.duration,8);assert.equal(first.metrics.intensity,7);
 assert.deepEqual((first.metricSchemaSnapshot||[]).map(x=>x.key),['duration','intensity']);
 assert.equal(first.executionModeSnapshot,'timed');
 assert.equal(first.executableObjectVersion,'8.20');
 for(const stale of ['weight','reps','sets'])assert.equal(first[stale],undefined,`stale classic field ${stale} leaked into executable Encounter`);

 /* Editing an Object changes future recording only. The first Encounter remains
    an immutable snapshot while the next Quick Record immediately follows the
    edited schema. */
 await page.evaluate(()=>{
  const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');
  const a=c.profile.customEq.find(x=>x.id==='axis820-a');
  a.metricSchema=[...a.metricSchema,{key:'distance',label:'距离',type:'number',unit:'km',step:.1}];
  a.metricSchemaVersion='8.20';
  localStorage.setItem('axis_v60_state',JSON.stringify(c));
 });
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20',undefined,{timeout:15000});
 await page.waitForTimeout(500);
 await openObjectFromQuick({recent:true});
 await assertExecutableFields(['duration','intensity','distance']);
 await page.locator('[data-axis818-metric="duration"]').fill('9');
 await page.locator('[data-axis818-metric="intensity"]').fill('8');
 await page.locator('[data-axis818-metric="distance"]').fill('1.2');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}')?.active?.events?.length===2,undefined,{timeout:3500});
 c=await core();
 const [oldEvent,newEvent]=c.active.events;
 assert.deepEqual((oldEvent.metricSchemaSnapshot||[]).map(x=>x.key),['duration','intensity'],'editing Object mutated historical Encounter schema');
 assert.deepEqual(Object.keys(oldEvent.metrics||{}),['duration','intensity'],'editing Object mutated historical Encounter metrics');
 assert.deepEqual((newEvent.metricSchemaSnapshot||[]).map(x=>x.key),['duration','intensity','distance']);
 assert.deepEqual(Object.keys(newEvent.metrics||{}),['duration','intensity','distance']);
 assert.equal(newEvent.metrics.distance,1.2);

 const fallback=await page.evaluate(()=>({explicit:window.__AXIS_OBJECT_TRUTH__?.explicit?.('lat'),mode:window.__AXIS_EXECUTABLE_OBJECTS__?.modeForEq?.('lat')}));
 assert.equal(fallback.explicit,false,'legacy catalog object unexpectedly became explicit');
 assert.equal(fallback.mode,'sets','legacy weight/reps object lost sets execution fallback');
 assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.20 executable object smoke] PASS · ${ENGINE} · 时间+强度 drives real Quick Record · edit affects future only · immutable Encounter snapshot · legacy fallback preserved`);
}finally{
 await context.close();await browser.close();
}
