import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pat,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pat,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',{timeout:6500});
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),{timeout:1500});
await page.locator('#v8Recent [data-qid]:visible').first().click();
await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow'),{timeout:2200});
await page.locator('#saveScan').click();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),{timeout:3500});
const snap=()=>page.locator('#v87Now button:visible').evaluateAll(xs=>xs.map((x,i)=>({i,id:x.id||'',class:String(x.className||''),text:String(x.textContent||'').trim(),owner:x.dataset.axisOwner||'',html:x.outerHTML.slice(0,320)})));
const samples=[];let last=0;for(const at of [0,20,80,160,300,700]){await page.waitForTimeout(Math.max(0,at-last));last=at;samples.push({at,buttons:await snap()})}
console.log('[AXIS active-adjust diagnostic]',JSON.stringify(samples,null,2));
const maxima=samples.map(s=>({at:s.at,adjust:s.buttons.filter(x=>x.text.startsWith('调整'))}));
const worst=maxima.reduce((a,b)=>b.adjust.length>a.adjust.length?b:a,{at:0,adjust:[]});
assert.ok(worst.adjust.length<=1,`duplicate adjustment at ${worst.at}ms: ${JSON.stringify(worst.adjust)}`);
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS active-adjust diagnostic] PASS · max visible adjustment <= 1');
await context.close();await browser.close();
