import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"enabled":false}'}));
await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false,"disabled":true}'}));
await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false,"disabled":true}'}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res?.ok());
await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,{timeout:5000});
await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready',{timeout:9000});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready'&&window.__AXIS_8712_COMPLETION_READY__===true,{timeout:5000});
assert.equal((await page.locator('.versionLine').innerText()).trim(),'版本 8.7.12');

console.log('[AXIS completion] settings + sound');
await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),{timeout:1000});
await page.waitForTimeout(220);
assert.equal(await page.locator('#v8710Test,#v85Test,#v876Test,.v8710Test,.v85Test,.v876Test').count(),0,'sound audition button must be removed');

console.log('[AXIS completion] watermark corners');
const wm=page.locator('#watermarkBtn');
if(await wm.count()){
 await wm.click();
 await page.waitForFunction(()=>document.querySelector('#watermarkSheet')?.classList.contains('show'),{timeout:1200});
 await page.waitForTimeout(220);
 assert.equal(await page.locator('#watermarkPreview #v8711Corners button[data-p]').count(),4,'exactly four visible watermark corner controls required');
 const baseCorners=await page.locator('#watermarkPreview>button[data-pos]').evaluateAll(xs=>xs.map(x=>({opacity:getComputedStyle(x).opacity,border:getComputedStyle(x).borderTopWidth})));
 assert.ok(baseCorners.length===4,'base watermark hit targets missing');
 assert.ok(baseCorners.every(x=>Number(x.opacity)===0||x.border==='0px'),`base corner visuals must be suppressed: ${JSON.stringify(baseCorners)}`);
}

console.log('[AXIS completion] fresh recording editor');
await page.reload({waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:12000});
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),{timeout:1000});
const item=page.locator('#v8Recent [data-v8eq]').first();assert.ok(await item.count(),'missing strength quick item');
await item.click();
await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelectorAll('#v8SetEditor .v8SetRow').length>0,{timeout:1800});
await page.waitForFunction(()=>document.querySelector('#v8SetEditor .v8712cAdjust'),{timeout:1200});
assert.ok(await page.locator('#v8SetEditor [data-v8setcount]').count()>=2,'group count controls missing');
assert.equal(await page.locator('#v8SetEditor [data-v8712c-step="weight"]').count(),2,'weight stepper missing');
assert.equal(await page.locator('#v8SetEditor [data-v8712c-step="reps"]').count(),2,'rep stepper missing');
const before=Number(await page.locator('#v8SetEditor .v8SetRow.active span b').first().innerText());
await page.locator('#v8SetEditor [data-v8712c-step="weight"][data-dir="1"]').click();
await page.waitForTimeout(120);
const after=Number(await page.locator('#v8SetEditor .v8SetRow.active span b').first().innerText());
assert.ok(after>before,`weight did not change: ${before} -> ${after}`);

console.log('[AXIS completion] nested back');
await page.locator('#v8SetEditor [data-v8712c-edit="weight"]').click();
await page.waitForFunction(()=>document.querySelector('#v8712cNumSheet')?.classList.contains('show'),{timeout:800});
await page.waitForTimeout(120);
assert.equal(await page.locator('#v8712cNumSheet .v8712cBack').count(),1,'nested adjustment sheet requires back button');
await page.locator('#v8712cNumSheet .v8712cBack').click();
await page.waitForTimeout(80);
assert.equal(await page.locator('#v8712cNumSheet.show').count(),0,'back did not close child sheet');
assert.equal(await page.locator('#scanSheet.show').count(),1,'back did not preserve parent sheet');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS completion] PASS');
await context.close();await browser.close();
