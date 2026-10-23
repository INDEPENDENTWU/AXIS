import assert from 'node:assert/strict';
const {chromium,webkit}=await import('playwright');
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const b=await (ENGINE==='chromium'?chromium:webkit).launch(ENGINE==='chromium'?{headless:true,args:['--no-sandbox']}:{headless:true});
const c=await b.newContext({viewport:{width:360,height:780},isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await c.newPage();
page.on('pageerror',e=>console.log('PAGE_ERROR',String(e)));
const snap=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
try{
 await page.goto(BASE,{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__&&window.__AXIS_832_PLAY_THIS__,undefined,{timeout:20000});
 // Retrospective Quick Record remains the independent original Recorder path.
 // PLAY THIS now intentionally opens a pre-Encounter live practice instead.
 await page.locator('#quickRecordBtn').click();
 await page.locator('#quickRecordSheet.show').waitFor({state:'visible'});
 const btn=page.locator('#v8Recent [data-qid]').first();
 await btn.waitFor({state:'visible',timeout:6000});
 const originalObject=await btn.getAttribute('data-qid');
 assert.ok(originalObject,'original Quick Record fallback must resolve exact Object ID');
 await c.setOffline(true);
 assert.equal(await page.evaluate(()=>navigator.onLine),false,'P13 offline Recorder must not require network');
 await (ENGINE==='webkit'?btn.tap():btn.click());
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:6500});
 const before=await snap();
 assert.equal(before.active?.events?.length||0,0,'P13 Recorder opening fabricated Encounter');
 assert.equal(await page.locator('#saveScan').isEnabled(),true,'P13 offline save UI disabled');
 assert.equal(await page.evaluate(()=>document.querySelector('#scanSheet')?.contains(document.activeElement)),true,'P19 Recorder focus missing offline');
 await page.locator('#saveScan').click({timeout:5000});
 let yes=false;try{await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.length>0,undefined,{timeout:7000});yes=true}catch{}
 const after=await snap();
 assert.equal(yes,true,'P13 original offline save button did not commit Encounter');
 assert.equal(after.active?.events?.length,1,'P13 offline save did not create exactly one Encounter');
 const saved=after.active.events[0];
 assert.ok(saved.id&&saved.equipmentId===originalObject,'P13 saved canonical Object identity incorrect');
 assert.equal(await page.locator('#scanSheet').evaluate(el=>el.classList.contains('show')),false,'P13 Recorder still overlays after save');
 assert.deepEqual(Object.keys(await page.evaluate(()=>localStorage)).filter(k=>k.startsWith('axis_832')),[],'P13 must not create new 8.32 persistence namespace');
 await c.setOffline(false);
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__,undefined,{timeout:16000});
 const restored=await snap();
 assert.equal(restored.active?.events?.length,1,'P13 offline save did not survive reload');
 assert.equal(restored.active.events[0].id,saved.id,'P13 Encounter ID changed across reload');
 assert.equal(restored.active.events[0].equipmentId,originalObject,'P13 Encounter Object changed across reload');
 console.log('[AXIS 8.32d4 offline Recorder '+ENGINE+'] PASS · original UI save offline · exactly one Encounter · exact ID after reload · no new storage owner');
}finally{await b.close()}
