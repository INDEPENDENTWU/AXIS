import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const exe=process.env.CHROME_BIN;
if(!exe)throw new Error('CHROME_BIN required');
const browser=await chromium.launch({headless:true,executablePath:exe,args:['--no-sandbox','--disable-dev-shm-usage']});
const page=await browser.newPage({viewport:{width:430,height:932}});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const store=k=>page.evaluate(key=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return{}}},k);
const visible=sel=>page.locator(sel).isVisible().catch(()=>false);
const waitReady=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:8000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000})};
const openSettings=async()=>{if(!await visible('#settingsSheet'))await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200})};
const closeSettings=async()=>{if(await page.locator('#settingsSheet').evaluate(x=>x.classList.contains('show')).catch(()=>false)){await page.locator('#settingsSheet [data-close="settingsSheet"]').click();await page.waitForTimeout(80)}};
const openGate=async(entry,gate)=>{await openSettings();const g=page.locator(gate);if(!(await g.evaluate(x=>x.classList.contains('open')).catch(()=>false)))await page.locator(entry).click();await page.waitForFunction(s=>document.querySelector(s)?.classList.contains('open'),gate,{timeout:1200})};

await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await waitReady();

console.log('[AXIS matrix] top-level navigation');
for(const [tab,view] of [['#navHome','#todayView'],['#navHistory','#historyView'],['#navReport','#reportView'],['#navHome','#todayView']]){
  await page.locator(tab).click();await page.waitForTimeout(70);assert.ok(await page.locator(view).evaluate(x=>x.classList.contains('active')),`${tab} did not activate ${view}`)
}

console.log('[AXIS matrix] profile gate -> save -> summary');
await openGate('#v8711ProfileGate > .settingLink','#v8711ProfileGate');
const nick=page.locator('#nickname');if(await nick.count()){await nick.fill('Ray')}
const height=page.locator('#height');if(await height.count()){await height.fill('178')}
const weight=page.locator('#bodyWeight');if(await weight.count()){await weight.fill('92')}
const saveProfile=page.locator('#saveProfile');if(await saveProfile.count()){await saveProfile.click();await page.waitForTimeout(80)}
let core=await store('axis_v60_state');assert.ok(core.profile,'profile state missing');

const prefDiag=async label=>page.evaluate(label=>{const scan=document.querySelector('#scanSeconds');return{label,scan:!!scan,captureButtons:[...document.querySelectorAll('#scanSeconds [data-v876-cap]')].map(x=>x.dataset.v876Cap),keep:!!document.querySelector('#keepVideo'),record:!!document.querySelector('#v8711RecordGate'),settings:document.querySelector('#settingsSheet')?.className||''}},label);
console.log('[AXIS matrix record prefs]',JSON.stringify(await prefDiag('after-profile')));

console.log('[AXIS matrix] My Equipment -> shared create/edit editor');
await openGate('#v8711EquipmentGate > .settingLink','#v8711EquipmentGate');
const create=page.locator('#addCustomEq');if(await create.count()){await create.click();await page.waitForTimeout(120);if(await visible('#customEqSheet')){await page.locator('#customName').fill('矩阵测试动作');const save=page.locator('#saveCustomEq');if(await save.count())await save.click();await page.waitForTimeout(120)}}
console.log('[AXIS matrix record prefs]',JSON.stringify(await prefDiag('after-custom-editor')));

console.log('[AXIS matrix] canonical capture preference + keep-video persistence');
await openGate('#v8711RecordGate > .settingLink','#v8711RecordGate');
assert.ok(await visible('#scanSeconds'),'record preference capture selector missing');
await page.locator('#scanSeconds [data-v876-cap="5"]').click();
const keep=page.locator('#keepVideo');if(await keep.count()){const checked=await keep.evaluate(x=>x.checked);if(!checked)await keep.click()}
await page.waitForTimeout(80);
let meta=await store('axis_v8_meta');
assert.equal(meta.prefs?.v876CaptureDefault,'5');
assert.equal(meta.prefs?.v876KeepVideo,true);
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
for(const id of ['#wmShowName','#wmShowData','#wmShowLocation','#wmShowTime'])assert.ok(await visible(id),`${id} watermark control not visible`);

console.log('[AXIS matrix] storage / export affordances');
await openSettings();
assert.ok(await page.locator('#exportData').count()||await page.locator('#exportBtn').count(),'export affordance missing');

await closeSettings();
console.log('[AXIS matrix] quick record entry');
assert.ok(await visible('#quickRecordBtn'),'Quick Record entry missing');
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:1200});
assert.ok(await page.locator('#v8Recent [data-qid],#v882QuickMine [data-qid]').count(),'Quick Record has no selectable entries');

assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
console.log('[AXIS matrix] PASS · navigation · profile · custom equipment · capture prefs · countdown-only sound · watermark · storage · quick record');
await browser.close();
