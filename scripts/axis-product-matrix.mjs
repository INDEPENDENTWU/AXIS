import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN',permissions:['geolocation'],geolocation:{latitude:22.52325,longitude:113.38381,accuracy:18}});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [
  ['**/api/ai-status**',{ok:true,enabled:false}],
  ['**/api/owner-config**',{ok:true}],
  ['**/api/analyze**',{ok:false,disabled:true}],
  ['**/api/insight**',{ok:false,disabled:true}]
])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));

const waitReady=async()=>{
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
  await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:6500});
};
const store=key=>page.evaluate(k=>{try{return JSON.parse(localStorage.getItem(k)||'{}')}catch{return{}}},key);
const openSettings=async()=>{
  if(!await page.locator('#settingsSheet.show').count())await page.locator('#settingsBtn').click();
  await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
};
const openGate=async(btn,gate)=>{
  await openSettings();
  if(!await page.locator(`${gate}.open`).count())await page.locator(btn).click();
  await page.waitForFunction(sel=>document.querySelector(sel)?.classList.contains('open'),gate,{timeout:1200});
};
const closeSettings=async()=>{
  if(await page.locator('#settingsSheet.show').count()){
    await page.locator('#settingsSheet [data-close="settingsSheet"]').click();
    await page.waitForTimeout(60);
  }
};
const closeCustom=async()=>{
  if(await page.locator('#customEqSheet.show').count()){
    await page.locator('#customEqSheet [data-close="customEqSheet"]').click();
    await page.waitForTimeout(60);
  }
};
const requireRecordPrefs=async label=>{
  const s=await page.evaluate(l=>({
    label:l,
    scan:!!document.querySelector('#scanSeconds'),
    scanSeconds:[...document.querySelectorAll('#scanSeconds button[data-sec]')].map(x=>x.dataset.sec),
    keep:!!document.querySelector('#keepClipSwitch'),
    record:!!document.querySelector('#v8711RecordGate'),
    settings:document.querySelector('#settingsSheet')?.className||''
  }),label);
  console.log('[AXIS matrix record prefs]',JSON.stringify(s));
  assert.ok(s.scan&&s.keep&&s.record,`record preferences lost at ${label}: ${JSON.stringify(s)}`);
  assert.deepEqual(s.scanSeconds,['3','5'],`canonical scan-duration choices changed at ${label}: ${JSON.stringify(s.scanSeconds)}`);
};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await waitReady();
assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');

console.log('[AXIS matrix] top-level navigation');
for(const [view,label] of [['historyView','记录'],['insightsView','趋势'],['todayView','今天']]){
  await page.locator(`nav.nav [data-view="${view}"]`).click();
  await page.waitForFunction(v=>document.querySelector('#'+v)?.classList.contains('active'),view,{timeout:900});
  assert.ok(await page.locator(`#${view}`).isVisible(),`${label} view not visible`);
}

console.log('[AXIS matrix] profile gate -> save -> summary');
await openGate('#profileBtn','#axisConfigGate-profile');
await page.locator('#profileName').fill('Ray');
await page.locator('#profileWeight').fill('92');
await page.locator('#profileFreq [data-value="3"]').click();
await page.locator('#profileGoal [data-value="strength"]').click();
await page.locator('#saveProfile').click();
await page.waitForTimeout(100);
let core=await store('axis_v60_state');
assert.equal(core.profile?.name,'Ray');
assert.equal(String(core.profile?.weight),'92');
assert.equal(String(core.profile?.freq),'3');
assert.equal(core.profile?.goal,'strength');
assert.ok((await page.locator('#profileSummary').innerText()).includes('Ray'),'profile summary did not update');
await requireRecordPrefs('after-profile');

console.log('[AXIS matrix] My Equipment -> shared create/edit editor');
await openGate('#myEqBtn','#axisConfigGate-equipment');
await page.locator('#newCustomEq').click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.evaluate(()=>window.__AXIS_CUSTOM_EDITOR__?.owner),'v874');
await page.locator('#customName').fill('矩阵胸推');
await page.waitForTimeout(100);
assert.ok(await page.locator('#v874Details .active').count()>0,'custom auto association missing');
await page.locator('#saveCustomEq').click();
await page.waitForFunction(()=>!document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
core=await store('axis_v60_state');
assert.ok((core.profile?.customEq||[]).some(x=>x.name==='矩阵胸推'),'custom item not persisted');
await openGate('#myEqBtn','#axisConfigGate-equipment');
const customRow=page.locator('#manageEqList [data-edit-eq]').filter({hasText:'矩阵胸推'}).first();
assert.ok(await customRow.count(),'custom row missing from My Equipment');
await customRow.click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.equal(await page.locator('#customName').inputValue(),'矩阵胸推');
assert.equal(await page.evaluate(()=>window.__AXIS_CUSTOM_EDITOR__?.owner),'v874');
await closeCustom();
await openSettings();
await requireRecordPrefs('after-custom-editor');

console.log('[AXIS matrix] canonical capture preference + keep-video persistence');
await openGate('#v8711RecordGate > .settingLink','#v8711RecordGate');
const cap5=page.locator('#scanSeconds button[data-sec="5"]');
assert.ok(await cap5.isVisible(),'canonical 5-second capture preference is not visible');
await cap5.click();
const beforeKeep=await page.locator('#keepClipSwitch').getAttribute('aria-checked');
await page.locator('#keepClipSwitch').click();
await page.waitForTimeout(80);
let meta=await store('axis_v8_meta');
core=await store('axis_v60_state');
assert.equal(meta.prefs?.v876CaptureMode,'5','canonical capture preference did not persist');
assert.ok(await cap5.evaluate(x=>x.classList.contains('active')),'canonical 5-second preference is not visibly active');
assert.notEqual(await page.locator('#keepClipSwitch').getAttribute('aria-checked'),beforeKeep);
assert.equal(Boolean(core.prefs?.keepClip),beforeKeep==='false');
assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE_PREF__?.get?.()),'5','capture preference bridge disagrees with visible setting');

await closeSettings();
await page.locator('#scanBtn').click();
await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.ok(await page.locator('#captureModes [data-mode="5"]').evaluate(x=>x.classList.contains('active')),'capture sheet first frame did not use canonical 5-second preference');
assert.ok((await page.locator('#captureNow').innerText()).includes('5'),'capture action copy did not use canonical 5-second preference');
await page.locator('#scanSheet [data-close="scanSheet"]').click();
await page.waitForTimeout(80);

console.log('[AXIS matrix] countdown-only sound gate persistence');
await openGate('#v8711AudioGate > .settingLink','#v8711AudioGate');
await page.locator('#v8710On [data-v="off"]').click();
await page.locator('#v8710Tone [data-v="vector"]').click();
await page.locator('#v8710Repeat [data-v="once"]').click();
assert.equal(await page.locator('#v8710Rest:visible,#v8710Session:visible,#v876TargetSheet:visible').count(),0,'retired rest/session automatic reminder controls returned');
assert.equal(await page.locator('#v8710Item:visible').count(),1,'canonical item countdown reminder control missing');
await page.locator('#v8710Item').click();
await page.waitForTimeout(80);
meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v8710SoundEnabled,false);
assert.equal(meta.prefs?.v8710SoundSet,'vector');
assert.equal(meta.prefs?.v8710Repeat,'once');
assert.equal(meta.prefs?.v876ItemReminder,false);
await page.locator('#v8710Item').click();
await page.locator('#v8710On [data-v="on"]').click();
meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v876ItemReminder,true);
assert.equal(meta.prefs?.v8710SoundEnabled,true);

console.log('[AXIS matrix] watermark gate controls are canonical, visible and persistent');
await openGate('#watermarkBtn','#axisConfigGate-watermark');
const pos=page.locator('#v8711Corners button[data-p]:visible');
assert.equal(await pos.count(),4,'watermark should expose exactly four canonical placement buttons');
assert.equal(await page.locator('#watermarkPreview > button[data-pos][aria-hidden="true"]').count(),4,'legacy watermark placement buttons were not retired');
assert.equal(await page.locator('#wmName:visible').count(),0,'legacy watermark name switch unexpectedly became visible');
const canonicalName=page.locator('#v85WmName');
assert.ok(await canonicalName.isVisible(),'canonical watermark name switch is not visible');
const beforeName=await canonicalName.getAttribute('aria-checked');
await canonicalName.click();
await page.locator('#photoWmMode [data-value="raw"]').click();
await pos.nth(1).click();
await page.waitForTimeout(80);
meta=await store('axis_v8_meta');
core=await store('axis_v60_state');
assert.notEqual(await canonicalName.getAttribute('aria-checked'),beforeName);
assert.equal(Boolean(meta.prefs?.v85WmName),beforeName==='false','canonical watermark name preference did not persist');
assert.equal(core.prefs?.watermark?.photoMode,'raw','photo watermark mode did not persist');
assert.equal(meta.prefs?.v85WmPos,'tr','canonical watermark position did not persist through its sole owner');
assert.ok(await pos.nth(1).evaluate(x=>x.classList.contains('active')),'canonical watermark position is not visibly active');

console.log('[AXIS matrix] storage gate exposes real non-destructive controls');
await openGate('#storageBtn','#axisConfigGate-storage');
for(const sel of ['#storageTotal','#backupBtn','#clearVideos','#sessionDeleteList'])assert.ok(await page.locator(sel).count(),`storage control missing ${sel}`);
assert.ok(await page.locator('#storageTotal').isVisible(),'storage content not visible through Settings');

console.log('[AXIS matrix] quick record -> exact inputs -> set count -> save');
await closeSettings();
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1500});
await page.locator('#v8Recent [data-qid]:visible').first().click();
await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#axisSetControls'),undefined,{timeout:2200});
await page.locator('#axisSetControls [data-axis-input="weight"]').fill('30');
await page.locator('#axisSetControls [data-axis-input="weight"]').press('Enter');
await page.locator('#axisSetControls [data-axis-input="reps"]').fill('12');
await page.locator('#axisSetControls [data-axis-input="reps"]').press('Enter');
await page.waitForTimeout(60);
assert.equal(Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText()),30);
assert.equal(Number(await page.locator('#v8Sets .v8SetRow.active span b').nth(1).innerText()),12);
const rowsBefore=await page.locator('#v8Sets .v8SetRow').count();
await page.locator('#v8Sets [data-cnt="1"]').click();
await page.waitForTimeout(80);
assert.equal(await page.locator('#v8Sets .v8SetRow').count(),rowsBefore+1,'set count did not change exactly once');
await page.locator('#saveScan').click();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});

console.log('[AXIS matrix] active item pause/resume -> complete set -> canonical adjust');
const activeId=await page.locator('#v87Finish').getAttribute('data-id');
assert.ok(activeId,'active item id missing');
const toggle=page.locator('#v87Toggle');
await toggle.click();await page.waitForTimeout(80);assert.equal((await toggle.innerText()).trim(),'▶');
await toggle.click();await page.waitForTimeout(80);assert.equal((await toggle.innerText()).trim(),'Ⅱ');
meta=await store('axis_v8_meta');
const beforeSets=Number(meta.events?.[activeId]?.activity?.completedSets)||0;
await page.locator('#v87Primary').click();
await page.waitForTimeout(100);
meta=await store('axis_v8_meta');
assert.equal(Number(meta.events?.[activeId]?.activity?.completedSets)||0,beforeSets+1,'complete-set action did not persist exactly once');
assert.equal(await page.locator('#v87Now .v87Actions button').filter({hasText:/^调整$/}).count(),1,'active session has duplicate/missing adjustment');
await page.locator('#v87AdjustBtn').click();
await page.waitForFunction(()=>document.querySelector('#v879Edit')?.classList.contains('show'),undefined,{timeout:1200});
assert.ok(await page.locator('#v879Edit').isVisible(),'canonical adjustment sheet did not open');
await page.locator('#v879Edit [data-v879-edit-step="w"][data-dir="1"]').click();
await page.locator('#v879Save').click();
await page.waitForFunction(()=>!document.querySelector('#v879Edit')?.classList.contains('show'),undefined,{timeout:1200});
meta=await store('axis_v8_meta');
assert.ok(Number(meta.events?.[activeId]?.v879EditAt)>0,'canonical active adjustment did not persist');
assert.equal(await page.locator('#v8710EditOnce,#v879EditBtn').count(),0,'retired active adjustment owner reappeared');

console.log('[AXIS matrix] history / canonical v84 trends / canonical v8710 report');
await page.locator('nav.nav [data-view="historyView"]').click();
await page.waitForFunction(()=>document.querySelector('#historyView')?.classList.contains('active'),undefined,{timeout:900});
assert.ok((await page.locator('#historyList').innerText()).trim().length>0,'history did not render recorded event');
await page.locator('nav.nav [data-view="insightsView"]').click();
await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active'),undefined,{timeout:900});
assert.ok(await page.locator('#insightsView .v84Trends').isVisible(),'canonical v84 trends surface did not render');
assert.equal(await page.locator('#coverageGrid:visible').count(),0,'retired pre-v84 coverage grid became visible');
for(const sel of ['#v84NowList','#v84Axis','#v84MemoryRows','#v84Rhythm'])assert.ok(await page.locator(sel).isVisible(),`canonical trends control missing/hidden ${sel}`);
await page.waitForFunction(()=>document.querySelector('#v84NowList [data-v84-eq]')&&document.querySelector('#v84Axis .v84AxisCol'),undefined,{timeout:900});
assert.ok((await page.locator('#v84NowList').innerText()).trim().length>0,'canonical trends did not render the real recorded item');
assert.ok(await page.locator('#v84Axis .v84AxisCol').count()>0,'canonical trend axis did not render the recorded item');
await openSettings();
await page.locator('#reportBtn').click();
await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),undefined,{timeout:1200});
await page.waitForFunction(()=>document.querySelector('#v8710ReportDeck')&&document.querySelectorAll('#v8710ReportDeck .v8710Plate').length===3,undefined,{timeout:1200});
assert.equal(await page.locator('#reportPreview:visible').count(),0,'retired base report preview became visible');
assert.equal(await page.locator('#v877ReportDeck:visible').count(),0,'retired v877 report deck became visible');
assert.ok(await page.locator('#v8710ReportDeck').isVisible(),'canonical v8710 report deck did not open visibly');
assert.equal(await page.locator('#v8710ReportDeck .v8710Plate').count(),3,'canonical report must render exactly three final cards');
assert.ok((await page.locator('#v8710ReportDeck').innerText()).trim().length>0,'canonical v8710 report deck rendered no content');
assert.ok(await page.locator('#v8710ShareReport').isVisible(),'canonical report share owner is missing or hidden');
assert.equal(await page.locator('#shareReport').count(),0,'retired base report share owner survived canonical report hydration');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS product matrix] PASS · navigation · Settings · capture preference · persistence · recording · active session · history · canonical trends · canonical report');
await context.close();
await browser.close();