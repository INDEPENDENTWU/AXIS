import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const {chromium,webkit}=await import('playwright');
const browser=await(ENGINE==='webkit'?webkit:chromium).launch(ENGINE==='chromium'?
 {headless:true,args:['--no-sandbox'],executablePath:process.env.CHROME_BIN||undefined}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},
 deviceScaleFactor:2,hasTouch:true,isMobile:ENGINE==='webkit',locale:'zh-CN',reducedMotion:'reduce'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
for(const [pattern,data] of [
 ['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],
 ['**/api/analyze**',{available:false}],['**/api/cloud-status**',{cloud:{enabled:false}}],
 ['**/api/ai-capabilities**',{ai:{enabled:false}}]
])await context.route(pattern,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)}));
const tap=l=>ENGINE==='webkit'?l.tap():l.click();
const snapshot=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const plan=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'null'));
const timed=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_play_timed_draft_v1')||'null'));
async function init(custom=[]){
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:26000});
 await page.evaluate(custom=>{
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify({
   version:60,sessions:[],active:null,flows:[],flowRun:null,
   profile:{customEq:custom,memories:[]},prefs:{scanSeconds:3}
  }));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },custom);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CONTINUITY__&&window.__AXIS_LIVE_TIMED__&&
  window.__AXIS_LIVE_STRENGTH__&&document.querySelector('#axisContinuityStarterList'),undefined,{timeout:18000});
}
try{
 // First ever use starts LIVE with zero saved sessions, not "記下".
 await init();
 const row=page.locator('#axisContinuityStarterList [data-continuity="starter"][data-object-id="row"]');
 await row.waitFor({state:'visible',timeout:8000});
 assert.equal((await snapshot()).sessions.length,0);
 await page.screenshot({path:'/tmp/axis-first-use-'+ENGINE+'.png',fullPage:false});
 await tap(row);
 await page.locator('#axisStrengthSheet.show').waitFor({state:'visible'});
 assert.equal(await page.locator('#scanSheet.show').count(),0,'first-ever practice is a Recorder handoff');
 assert.equal(await page.locator('#quickRecordSheet.show').count(),0,'first-ever practice is Quick Record');
 await page.locator('#axisStrengthTarget').fill('1');
 await page.locator('#axisStrengthTarget').dispatchEvent('change');
 await page.locator('#axisStrengthActualWeight').fill('20');
 await page.locator('#axisStrengthActualReps').fill('8');
 await tap(page.locator('#axisStrengthSheet [data-strength="confirm-set"]'));
 await tap(page.locator('#axisStrengthSheet [data-strength="save"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='complete',undefined,{timeout:9000});
 assert.equal((await snapshot()).active?.events?.length,1);
 await tap(page.locator('#axisStrengthSheet [data-continuity="finish"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='done');
 assert.equal((await snapshot()).sessions.length,1);
 await tap(page.locator('#axisStrengthSheet [data-continuity="dismiss"]'));
 await page.waitForFunction(()=>!!document.querySelector('#axisContinuityToday [data-continuity="start-full"]'));
 assert.equal(await page.locator('#scanSheet.show').count(),0);
 await page.screenshot({path:'/tmp/axis-first-use-continued-'+ENGINE+'.png',fullPage:false});
 // A truly different mode: user-authored cardio, independent factual duration.
 await init([{id:'custom-walk',name:'走路計時',type:'cardio',pattern:'cardio',
  muscles:['心肺'],effect:'輕鬆活動',custom:true}]);
 await tap(page.locator('#axisContinuityToday [data-continuity="more"]'));
 await page.locator('#axisContinuitySearch').fill('走路計時');
 const custom=page.locator('#axisContinuityStarterList [data-object-id="custom-walk"]');
 await custom.waitFor({state:'visible',timeout:9000});
 await tap(custom);
 await page.locator('#axisStrengthSheet.show').waitFor({state:'visible'});
 assert.equal((await timed())?.objectId,'custom-walk');
 assert.equal(await page.locator('#scanSheet.show').count(),0);
 assert.equal((await snapshot()).active?.events?.length||0,0,'starting a timer manufactured an Encounter');
 await page.screenshot({path:'/tmp/axis-live-timed-'+ENGINE+'.png',fullPage:false});
 await tap(page.locator('#axisStrengthSheet [data-timed="pause"]'));
 assert.equal((await timed()).phase,'paused');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_LIVE_TIMED__&&
  document.querySelector('#axisTimedResume')&&!document.querySelector('#axisTimedResume').hidden,undefined,{timeout:16000});
 assert.equal((await timed()).phase,'paused','reload rewrote elapsed time or state');
 await tap(page.locator('#axisTimedResume'));
 await tap(page.locator('#axisStrengthSheet [data-timed="resume"]'));
 await tap(page.locator('#axisStrengthSheet [data-timed="finish"]'));
 assert.equal((await timed()).phase,'review');
 assert.equal((await snapshot()).active?.events?.length||0,0,'timer finish wrote a false fact before review');
 await page.locator('#axisTimedMinutes').fill('3.5');
 await page.locator('#axisTimedIntensity').selectOption('4');
 await tap(page.locator('#axisStrengthSheet [data-timed="save"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='complete',undefined,{timeout:9000});
 let st=await snapshot();
 assert.equal(st.active?.events?.length,1,'timed commit created duplicates');
 assert.equal(st.active.events[0].kind,'cardio');
 assert.equal(st.active.events[0].duration,3.5);
 assert.equal(st.active.events[0].intensity,4);
 assert.equal(st.active.events[0].playThis.actualDurationMinutes,3.5);
 assert.equal(await timed(),null);
 assert.equal(await page.locator('#scanSheet.show').count(),0,'timer still led to Recorder');
 await page.screenshot({path:'/tmp/axis-timed-reviewed-'+ENGINE+'.png',fullPage:false});
 await tap(page.locator('#axisStrengthSheet [data-continuity="finish"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='done');
 st=await snapshot();
 assert.equal(st.sessions.length,1);
 assert.equal(st.sessions[0].events.length,1);
 assert.equal(st.active,null);
 await tap(page.locator('#axisStrengthSheet [data-continuity="dismiss"]'));
 await page.waitForFunction(()=>!!document.querySelector('#axisContinuityToday [data-continuity="start-full"]'));
 assert.equal(await page.locator('#scanSheet.show').count(),0);
 assert.deepEqual(errors,[],'JavaScript console errors');
 console.log('[AXIS first use + timed '+ENGINE+'] PASS · no-history first live strength; real confirmed history; cardio timer pause reload review save; next prepared, no Recorder');
}finally{await browser.close()}
