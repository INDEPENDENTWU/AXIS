import {chromium} from 'playwright-core';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'}),page=await context.newPage();
for(const [pat,body] of [['**/api/ai-status**','{"ok":true,"enabled":false}'],['**/api/owner-config**','{"ok":true}'],['**/api/analyze**','{"ok":false,"disabled":true}'],['**/api/insight**','{"ok":false,"disabled":true}']])await page.route(pat,r=>r.fulfill({status:200,contentType:'application/json',body}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')console.error('[diag console]',m.text())});
await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:12000});
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelectorAll('#v8Recent [data-qid]').length>0,{timeout:1200});
const q=page.locator('#v8Recent [data-qid]:visible').first();
const chosen=await q.evaluate(el=>({qid:el.dataset.qid,text:el.innerText}));
await q.click();
await page.waitForTimeout(2600);
const state=await page.evaluate(()=>({
 equipmentName:document.querySelector('#equipmentName')?.textContent,
 quick:document.querySelector('#quickRecordSheet')?.className,
 eq:document.querySelector('#eqSheet')?.className,
 scan:document.querySelector('#scanSheet')?.className,
 capture:document.querySelector('#captureStage')?.className,
 review:document.querySelector('#reviewStage')?.className,
 setHosts:document.querySelectorAll('#v8Sets').length,
 rows:document.querySelectorAll('#v8Sets .v8SetRow').length,
 controls:document.querySelectorAll('#axisSetControls').length,
 recording:window.__AXIS_RECORDING__?.snapshot?.(),
 diag:window.__AXIS_ENHANCE_DIAG__
}));
console.error('[AXIS recording-path diagnostic]',JSON.stringify({chosen,state,errors},null,2));
await context.close();await browser.close();