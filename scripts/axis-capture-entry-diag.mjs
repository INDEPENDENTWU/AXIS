import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const snap=label=>page.evaluate(l=>{const btn=document.querySelector('#scanBtn'),dock=document.querySelector('#dock');const info=e=>{if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return{class:String(e.className||''),display:c.display,visibility:c.visibility,opacity:c.opacity,pointerEvents:c.pointerEvents,rect:[r.x,r.y,r.width,r.height]}};return{label:l,scan:info(btn),dock:info(dock),scanOnclick:typeof btn?.onclick,scanOnclickSource:String(btn?.onclick||'').slice(0,900),sheetClass:document.querySelector('#scanSheet')?.className||'',captureOwner:document.querySelector('#scanSheet')?.dataset.captureOwner||'',captureIntent:document.querySelector('#scanSheet')?.dataset.captureIntent||'',settingsClass:document.querySelector('#settingsSheet')?.className||'',openSheets:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id),openGates:[...document.querySelectorAll('.v8711SettingGate.open,.axisConfigGate.open')].map(x=>x.id),pref:window.__AXIS_CAPTURE_PREF__?.get?.()||null,scanSeconds:[...document.querySelectorAll('#scanSeconds [data-sec]')].map(x=>({sec:x.dataset.sec,active:x.classList.contains('active')})),keepClipHidden:document.querySelector('#keepClipSwitch')?.hidden===true,activeModes:[...document.querySelectorAll('#captureModes button.active')].map(x=>x.dataset.mode),captureText:document.querySelector('#captureNow')?.textContent?.trim()||''}},l);

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:6500});
await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
await page.locator('#v8711RecordGate > .settingLink').click();
await page.waitForFunction(()=>document.querySelector('#v8711RecordGate')?.classList.contains('open'),undefined,{timeout:1200});

/* 8.18 retires the old data-v876-cap writer and the video pseudo-setting. The
   physical 3/5 controls are now the canonical preference surface. */
assert.deepEqual(await page.locator('#scanSeconds [data-sec]').evaluateAll(xs=>xs.map(x=>x.dataset.sec)),['3','5']);
await page.locator('#scanSeconds [data-sec="5"]').click();
await page.waitForTimeout(80);
assert.equal(await page.evaluate(()=>window.__AXIS_CAPTURE_PREF__?.get?.()),'5');
assert.equal(await page.locator('#keepClipSwitch').evaluate(x=>x.hidden),true,'retired video pseudo-setting became visible');

await page.locator('#settingsSheet [data-close="settingsSheet"]').click();
await page.waitForTimeout(80);
const afterClose=await snap('after-close');console.log('[AXIS capture after close]',JSON.stringify(afterClose,null,2));
assert.equal(await page.locator('#settingsSheet.show').count(),0,'Settings did not close');
assert.ok(await page.locator('#dock').isVisible(),`capture dock hidden after Settings: ${JSON.stringify(afterClose)}`);
assert.ok(await page.locator('#scanBtn').isVisible(),`capture button hidden after Settings: ${JSON.stringify(afterClose)}`);
const ownerSource=await page.locator('#scanBtn').evaluate(x=>String(x.onclick||''));
assert.ok(ownerSource.includes('__AXIS_CAPTURE_PREF__')&&ownerSource.includes('openCanonicalCamera'),`unexpected capture delegation: ${ownerSource.slice(0,900)}`);
assert.equal(await page.evaluate(()=>(String(window.__AXIS_CAPTURE__?.openCanonicalCamera||'').match(/startCamera\(\)/g)||[]).length),1,'canonical camera owner does not own exactly one startCamera call');

await page.locator('#scanBtn').click({timeout:2000});
await page.waitForTimeout(80);
const opened=await snap('opened');console.log('[AXIS capture opened]',JSON.stringify(opened,null,2));
assert.ok(await page.locator('#scanSheet.show').count(),'capture sheet did not remain open');
assert.equal(opened.captureOwner,'canonical','capture sheet did not identify canonical owner');
assert.equal(opened.captureIntent,'record','main capture entered the wrong capture intent');
assert.ok(await page.locator('#captureModes [data-mode="5"]').evaluate(x=>x.classList.contains('active')),'capture mode is not 5 seconds');
assert.ok((await page.locator('#captureNow').innerText()).includes('5'),'capture action does not reflect 5 seconds');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS capture entry diagnostic] PASS · physical 3/5 preference -> canonical delegated camera · retired pseudo-setting stays hidden');
await context.close();await browser.close();
