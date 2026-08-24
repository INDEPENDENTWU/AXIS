import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const snap=label=>page.evaluate(l=>{const btn=document.querySelector('#scanBtn'),dock=document.querySelector('#dock'),state=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');const info=e=>{if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return{class:String(e.className||''),display:c.display,visibility:c.visibility,opacity:c.opacity,pointerEvents:c.pointerEvents,rect:[r.x,r.y,r.width,r.height]}};return{label:l,scan:info(btn),dock:info(dock),scanOnclick:typeof btn?.onclick,scanOnclickSource:String(btn?.onclick||'').slice(0,900),sheetClass:document.querySelector('#scanSheet')?.className||'',captureOwner:document.querySelector('#scanSheet')?.dataset.captureOwner||'',captureIntent:document.querySelector('#scanSheet')?.dataset.captureIntent||'',settingsClass:document.querySelector('#settingsSheet')?.className||'',openSheets:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id),openGates:[...document.querySelectorAll('.v8711SettingGate.open,.axisConfigGate.open')].map(x=>x.id),pref:window.__AXIS_CAPTURE_PREF__?.get?.()||null,defaultMode:state?.prefs?.captureDefaultMode||null,resolvedMode:window.__AXIS_CAPTURE__?.snapshot?.().mode||null,scanSeconds:[...document.querySelectorAll('#scanSeconds [data-sec]')].map(x=>({sec:x.dataset.sec,active:x.classList.contains('active')})),keepClipHidden:document.querySelector('#keepClipSwitch')?.hidden===true,activeModes:[...document.querySelectorAll('#captureModes button.active')].map(x=>x.dataset.mode),captureText:document.querySelector('#captureNow')?.textContent?.trim()||''}},label);

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:6500});
await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
await page.locator('#v8711RecordGate > .settingLink').click();
await page.waitForFunction(()=>document.querySelector('#v8711RecordGate')?.classList.contains('open'),undefined,{timeout:1200});

/* 8.18 has two independent preferences here: Scan sampling is 3/5 seconds,
   while default Capture entry is last/photo/scan/video. Prove both persist, then
   prove the real visible Capture button follows default entry rather than reusing
   the 3/5-second compatibility bridge as its camera mode. */
assert.deepEqual(await page.locator('#scanSeconds [data-sec]').evaluateAll(xs=>xs.map(x=>x.dataset.sec)),['3','5']);
await page.locator('#scanSeconds [data-sec="5"]').click();
await page.waitForTimeout(80);
assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE_PREF__?.get?.()),'5');
const videoPref=page.locator('#axis818CapturePrefs [data-axis818-pref="captureDefaultMode"][data-value="video"]');
assert.equal(await videoPref.count(),1,'8.18 default Capture-mode preference is missing');
await videoPref.click();
await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}')?.prefs?.captureDefaultMode==='video',undefined,{timeout:1200});
assert.equal(await videoPref.evaluate(x=>x.classList.contains('active')),true,'Video default preference did not become visually active');
assert.equal(await page.locator('#keepClipSwitch').evaluate(x=>x.hidden),true,'retired video pseudo-setting became visible');

await page.locator('#settingsSheet [data-close="settingsSheet"]').click();
await page.waitForTimeout(80);
const afterClose=await snap('after-close');console.log('[AXIS capture after close]',JSON.stringify(afterClose,null,2));
assert.equal(await page.locator('#settingsSheet.show').count(),0,'Settings did not close');
assert.ok(await page.locator('#dock').isVisible(),`capture dock hidden after Settings: ${JSON.stringify(afterClose)}`);
assert.ok(await page.locator('#scanBtn').isVisible(),`capture button hidden after Settings: ${JSON.stringify(afterClose)}`);
assert.equal(afterClose.pref,'5','Scan sampling preference changed while selecting the default Capture mode');
assert.equal(afterClose.defaultMode,'video','default Capture mode did not survive Settings close');
const ownerSource=await page.locator('#scanBtn').evaluate(x=>String(x.onclick||''));
assert.ok(ownerSource.includes('openCanonicalCamera'),`main capture no longer delegates to canonical camera owner: ${ownerSource.slice(0,900)}`);
assert.equal(await page.evaluate(()=>(String(window.__AXIS_CAPTURE__?.openCanonicalCamera||'').match(/startCamera\(\)/g)||[]).length),1,'canonical camera owner does not own exactly one startCamera call');

await page.locator('#scanBtn').click({timeout:2000});
await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&window.__AXIS_CAPTURE__?.snapshot?.().mode==='video',undefined,{timeout:1600});
const opened=await snap('opened');console.log('[AXIS capture opened]',JSON.stringify(opened,null,2));
assert.ok(await page.locator('#scanSheet.show').count(),'capture sheet did not remain open');
assert.equal(opened.captureOwner,'canonical','capture sheet did not identify canonical owner');
assert.equal(opened.captureIntent,'record','main capture entered the wrong capture intent');
assert.equal(opened.pref,'5','Scan sampling preference was not preserved through delegation');
assert.equal(opened.defaultMode,'video','persisted default Capture preference changed during delegation');
assert.equal(opened.resolvedMode,'video','visible Capture entry ignored the selected default mode');
assert.ok(await page.locator('#captureModes [data-mode="video"]').evaluate(x=>x.classList.contains('active')),'Capture UI did not open in Video mode');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS capture entry diagnostic] PASS · physical Scan 3/5 stays independent · physical default Video -> visible Capture -> canonical Video · retired pseudo-setting stays hidden');
await context.close();await browser.close();
