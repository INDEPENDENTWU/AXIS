import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const {chromium,webkit}=await import('playwright');
const browser=await(ENGINE==='webkit'?webkit:chromium).launch(ENGINE==='webkit'?
 {headless:true}:{headless:true,args:['--no-sandbox'],executablePath:process.env.CHROME_BIN||undefined});
const context=await browser.newContext({viewport:{width:390,height:844},
 deviceScaleFactor:2,hasTouch:true,isMobile:ENGINE==='webkit',locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e)));
for(const [pat,body] of [
 ['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],
 ['**/api/analyze**',{available:false}],['**/api/cloud-status**',{cloud:{enabled:false}}],
 ['**/api/ai-capabilities**',{ai:{enabled:false}}]
])await context.route(pat,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)}));
const tap=l=>ENGINE==='webkit'?l.tap():l.click();
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const plan=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'null'));
const strength=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_play_strength_draft_v1')||'null'));
const saved=async()=>{const s=await state();return [...(s.active?.events||[]),...(s.sessions||[]).flatMap(x=>x.events||[])].filter(e=>e.playThis?.continuity?.runId)};
async function confirmSet(weight,reps){
 await page.locator('#axisStrengthTarget').fill('1');
 await page.locator('#axisStrengthTarget').dispatchEvent('change');
 await page.locator('#axisStrengthActualWeight').fill(String(weight));
 await page.locator('#axisStrengthActualReps').fill(String(reps));
 await tap(page.locator('#axisStrengthSheet [data-strength="confirm-set"]'));
 assert.equal((await strength())?.phase,'review');
}
try{
 await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:25000});
 await page.evaluate(()=>{
  localStorage.clear();
  const now=Date.now()-3*86400000;
  const old=[['row','坐姿 / 胸托划船'],['lat','高位下拉']].map(([id,name],i)=>({
   id:'old-'+i,equipmentId:id,name,kind:'strength',time:now+5000*i,
   weight:20,reps:10,sets:2,frameRefs:[],fingerprints:[],photoBytes:0,videoBytes:0}));
  localStorage.setItem('axis_v60_state',JSON.stringify({
   version:60,sessions:[{id:'last-workout',start:now,end:now+300000,events:old}],
   active:null,flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3}
  }));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 });
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CONTINUITY__&&window.__AXIS_LIVE_STRENGTH__&&document.querySelector('#axisContinuityToday [data-continuity="start-full"]'),undefined,{timeout:20000});
 const today=page.locator('#axisContinuityToday');
 assert.equal(await today.locator('.axisContinuityPlanRow').count(),2);
 assert.equal(await today.locator('h2').innerText(),'下一次，已準備好');
 assert.equal((await state()).sessions.length,1,'read-only Next altered prior session');
 await page.screenshot({path:'/tmp/axis-834-today-'+ENGINE+'.png',fullPage:false});
 await tap(today.locator('[data-continuity="start-full"]'));
 await page.locator('#axisStrengthSheet.show').waitFor({state:'visible'});
 assert.equal(await page.locator('#scanSheet.show').count(),0,'Today opened old retrospective Recorder');
 assert.deepEqual((await plan()).steps,['row','lat']);
 assert.equal((await strength()).objectId,'row');
 assert.equal((await saved()).length,0,'planning manufactured historical facts');
 await page.screenshot({path:'/tmp/axis-834-live-'+ENGINE+'.png',fullPage:false});
 await confirmSet(30,10);
 await tap(page.locator('#axisStrengthSheet [data-strength="save"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='between',undefined,{timeout:9000});
 assert.equal((await saved()).length,1,'first step not persisted exactly once');
 assert.equal(await page.locator('#scanSheet.show').count(),0,'save opened old Recorder');
 await page.screenshot({path:'/tmp/axis-834-between-'+ENGINE+'.png',fullPage:false});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CONTINUITY__&&document.querySelector('#axisContinuityToday [data-continuity="next"]'),undefined,{timeout:18000});
 assert.equal((await plan()).stage,'between','reload lost progress');
 await tap(page.locator('#axisContinuityToday [data-continuity="next"]'));
 await page.locator('#axisStrengthSheet.show').waitFor({state:'visible'});
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_play_strength_draft_v1')||'{}').objectId==='lat',undefined,{timeout:9000});
 await confirmSet(25,9);
 await tap(page.locator('#axisStrengthSheet [data-strength="save"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='complete',undefined,{timeout:9000});
 assert.equal((await saved()).length,2);
 assert.equal(await page.locator('#scanSheet.show').count(),0);
 await tap(page.locator('#axisStrengthSheet [data-continuity="finish"]'));
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_continuity_run_v1')||'{}').stage==='done',undefined,{timeout:9000});
 const after=await state(),run=await plan();
 assert.equal(after.active,null,'completed run left an active session requiring a second finish');
 assert.equal(after.sessions.length,2,'canonical session was not finalized once');
 assert.equal(after.sessions[0].events.length,2);
 assert.equal(after.sessions[0].id,run.sessionId);
 assert.equal(await page.locator('#finishSheet.show').count(),0,'legacy finished popover unexpectedly appeared');
 assert.equal(await page.locator('#scanSheet.show').count(),0,'legacy 記下 required after finish');
 await page.screenshot({path:'/tmp/axis-834-finished-'+ENGINE+'.png',fullPage:false});
 await tap(page.locator('#axisStrengthSheet [data-continuity="dismiss"]'));
 assert.equal(await plan(),null);
 await page.waitForFunction(()=>!!document.querySelector('#axisContinuityToday [data-continuity="start-full"]'));
 assert.equal((await state()).sessions.length,2,'closing outcome altered facts');
 assert.deepEqual(errors,[],'browser errors');
 console.log('[AXIS Today 8.34 '+ENGINE+'] PASS · History → Today → 2 live Objects → same-sheet saves → reload → canonical finish → Next');
}finally{await browser.close()}
