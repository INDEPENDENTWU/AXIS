import {chromium} from 'playwright-core';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'}),page=await context.newPage();
for(const [pat,body] of [['**/api/ai-status**','{"ok":true,"enabled":false}'],['**/api/owner-config**','{"ok":true}'],['**/api/analyze**','{"ok":false,"disabled":true}'],['**/api/insight**','{"ok":false,"disabled":true}']])await page.route(pat,r=>r.fulfill({status:200,contentType:'application/json',body}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')console.error('[diag console]',m.text())});
await page.goto(BASE,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:12000});
await page.locator('#settingsBtn').click();await page.waitForTimeout(120);
const settingsBefore=await page.evaluate(()=>({settings:document.querySelector('#settingsSheet')?.className,button:{class:document.querySelector('#profileBtn')?.className,fold:document.querySelector('#profileBtn')?.dataset.v8711Fold,parent:document.querySelector('#profileBtn')?.parentElement?.id},gate:document.querySelector('#axisConfigGate-profile')?.className,profile:document.querySelector('#profileSheet')?.className,profileParent:document.querySelector('#profileSheet')?.parentElement?.dataset.axisInlineBody}));
await page.locator('#profileBtn').click();await page.waitForTimeout(120);
const settingsAfter=await page.evaluate(()=>({settings:document.querySelector('#settingsSheet')?.className,gate:document.querySelector('#axisConfigGate-profile')?.className,profile:document.querySelector('#profileSheet')?.className,open:[...document.querySelectorAll('#settingsSheet .v8711SettingGate.open')].map(x=>x.id),visibleSheets:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id)}));

await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:12000});
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelectorAll('#v8Recent [data-qid]').length>0,{timeout:1500});
await page.locator('#v8Recent [data-qid]:visible').first().click();await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow'),{timeout:2500});
while(await page.locator('#v8Sets .v8SetRow').count()<3){await page.locator('#v8Sets [data-cnt="1"]').click();await page.waitForTimeout(60)}
const entry=page.locator('#v8Sets [data-v875-plan],#v8Sets [data-v874-plan]').first();
const planBefore=await page.evaluate(()=>({entry875:document.querySelectorAll('#v8Sets [data-v875-plan]').length,entry874:document.querySelectorAll('#v8Sets [data-v874-plan]').length,plan875:document.querySelector('#v875PlanSheet')?.className,body:!!document.querySelector('#v8712PlanBody')}));
await entry.click();await page.waitForTimeout(500);
const planAfter=await page.evaluate(()=>{const s=document.querySelector('#v875PlanSheet');return{sheetClass:s?.className,body:!!document.querySelector('#v8712PlanBody'),sheetHtml:s?.querySelector('.sheet')?.innerHTML?.slice(0,1800),feature:window.__AXIS_FEATURE_KERNEL__,enhance:window.__AXIS_ENHANCE_DIAG__,completion:window.__AXIS_COMPLETION_KERNEL__}});
console.error('[AXIS convergence diagnostic]',JSON.stringify({settingsBefore,settingsAfter,planBefore,planAfter,errors},null,2));
await context.close();await browser.close();