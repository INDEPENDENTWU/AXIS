import assert from 'node:assert/strict';
const engine=process.env.AXIS_ENGINE||'chromium',url=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=engine==='webkit'?await import('playwright'):await import('playwright-core');
const browser=await (engine==='webkit'?mod.webkit:mod.chromium).launch(
 engine==='webkit'?{headless:true}:{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN',
 isMobile:engine==='webkit',hasTouch:true,deviceScaleFactor:2,colorScheme:'light'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
for(const [pattern,data] of [
 ['**/api/ai-status**',{available:false}],
 ['**/api/owner-config**',{error:'owner_lock_not_configured'}],
 ['**/api/analyze**',{available:false}],
 ['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],
 ['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]
])await context.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)}));
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const intent=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_preplay_intent_v1')||'null'));
try{
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
 await page.evaluate(()=>{
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify({
   version:60,sessions:[],active:null,flows:[],flowRun:null,
   profile:{customEq:[],memories:[]},prefs:{scanSeconds:3}
  }));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
  localStorage.setItem('axis_ui_theme_v1','light');
 });
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_PREPLAY__&&window.__AXIS_832_PLAY_THIS__&&window.__AXIS_CORE_INTERACTIVE__,
  undefined,{timeout:22000});
 assert.equal(await page.evaluate(()=>window.__AXIS_PREPLAY__.newEncounterWriter),false);
 await page.locator('#quickRecordBtn').click();
 await page.locator('#quickRecordSheet #v8Other').click();
 await page.locator('#eqSearch').fill('胸托划船');
 const start=page.locator('#v8710Cards .axis832ObjectGo[data-axis832-object="chest-row"]').first();
 await start.waitFor({state:'visible'});
 await start.click();
 await page.locator('#axisPreplaySheet.show').waitFor({state:'visible',timeout:5000});
 assert.equal(await page.locator('#scanSheet.show').count(),0,'PLAY THIS must never start in retrospective Recorder');
 let i=await intent();
 assert.equal(i.objectId,'chest-row');assert.equal(i.status,'running');
 assert.equal((await state()).active?.events?.length||0,0,'starting live practice fabricated Encounter');
 assert.equal(Object.keys(JSON.parse(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')||'{}')).events||{}).length,0,
  'starting live practice fabricated canonical Active activity');
 await page.screenshot({path:'/tmp/axis-preplay-start-'+engine+'.png',fullPage:false});
 await page.locator('#axisPreplaySheet [data-preplay="pause"]').click();
 i=await intent();assert.equal(i.status,'paused');
 const paused=i.elapsedMs;
 await page.waitForTimeout(1200);
 assert.equal((await intent()).elapsedMs,paused,'paused clock advanced');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>!!window.__AXIS_PREPLAY__&&!!document.querySelector('#axisPreplayResume')&&!document.querySelector('#axisPreplayResume').hidden);
 assert.equal((await intent()).status,'paused','reload lost paused prospective practice');
 await page.locator('#axisPreplayResume').click();
 await page.locator('#axisPreplaySheet [data-preplay="resume"]').click();
 assert.equal((await intent()).status,'running');
 await page.locator('#axisPreplaySheet [data-preplay="review"]').click();
 assert.equal((await intent()).status,'review');
 assert.equal((await state()).active?.events?.length||0,0,'finish intent prematurely recorded an Encounter');
 await page.screenshot({path:'/tmp/axis-preplay-review-'+engine+'.png',fullPage:false});
 await page.locator('#axisPreplaySheet [data-preplay="record"]').click();
 await page.locator('#scanSheet.show').waitFor({state:'visible',timeout:7500});
 assert.equal((await intent()).handoff,true);
 assert.equal((await state()).active?.events?.length||0,0,'Recorder handoff created a premature Encounter');
 const submit=page.locator('#saveScan');
 await submit.click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.length===1,
  undefined,{timeout:15000});
 assert.equal((await state()).active.events[0].equipmentId,'chest-row');
 assert.equal(await intent(),null,'successfully saved Encounter must retire its prospective draft');
 assert.equal((await state()).active.events.length,1,'unexpected double Encounter');
 await page.screenshot({path:'/tmp/axis-preplay-committed-'+engine+'.png',fullPage:false});

 // A second new attempt on the same saved activity is never silently forced.
 // Existing v82 Activity conflict remains authoritative.
 const blocked=await page.evaluate(()=>window.__AXIS_832_PLAY_THIS__.startObject('lat-pulldown'));
 if(blocked)assert.equal((await intent())?.objectId,'lat-pulldown');
 // Explicit abandoned practice cannot create another historical event.
 if(await intent()){
  await page.evaluate(()=>{window.confirm=()=>true});
  await page.locator('#axisPreplaySheet [data-preplay="abandon"]').click();
  assert.equal(await intent(),null);
  assert.equal((await state()).active.events.length,1);
 }
 assert.deepEqual(errors,[],'uncaught browser errors');
 console.log('[AXIS PREPLAY P1] PASS · visible live first · pause/reload/resume · review · exactly one canonical record · '+engine);
}finally{await browser.close()}
