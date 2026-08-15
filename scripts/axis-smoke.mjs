import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const BYPASS=String(process.env.VERCEL_AUTOMATION_BYPASS_SECRET||'').trim();
const contextOptions=viewport=>({viewport,locale:'zh-CN',...(BYPASS?{extraHTTPHeaders:{'x-vercel-protection-bypass':BYPASS}}:{})});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const wait=(page,fn,ms)=>page.waitForFunction(fn,undefined,{timeout:ms});
const hard=(promise,ms,label)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error(`hard deadline ${ms}ms: ${label}`)),ms))]);

function wireConsole(page){
 page.on('console',async msg=>{
  if(msg.type()!=='error')return;
  const parts=[];
  for(const arg of msg.args()){
   try{parts.push(await arg.evaluate(v=>v instanceof Error?{name:v.name,message:v.message,stack:v.stack}:typeof v==='string'?v:JSON.stringify(v)))}catch{parts.push(msg.text())}
  }
  console.error('[AXIS browser console]',...parts);
 });
}
async function routeApis(page){
  await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,enabled:false})}));
  await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
  await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
  await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
}
async function uiState(page){return hard(page.evaluate(()=>{const snap=id=>{const e=document.querySelector(id);if(!e)return null;const c=getComputedStyle(e),r=e.getBoundingClientRect();return{class:e.className,display:c.display,visibility:c.visibility,opacity:c.opacity,rect:[+r.x.toFixed(2),+r.y.toFixed(2),+r.width.toFixed(2),+r.height.toFixed(2)],onclick:typeof e.onclick}};return{settings:snap('#settingsBtn'),quick:snap('#quickRecordBtn'),settingsSheet:document.querySelector('#settingsSheet')?.className||'',quickSheet:document.querySelector('#quickRecordSheet')?.className||'',openSheets:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id),core:window.__AXIS_CORE_INTERACTIVE__,latest:window.__AXIS_LATEST_READY__,stableComplete:window.__AXIS_STABLE_COMPLETE__,degraded:window.__AXIS_STABLE_DEGRADED__,feature:window.__AXIS_FEATURE_KERNEL__||null,diag:window.__AXIS_ENHANCE_DIAG__||null}}),1200,'read UI state')}
async function waitGeometryStable(page,selector,budgetMs=900){const started=Date.now();let prev=null,same=0,last=null;while(Date.now()-started<budgetMs){const cur=await hard(page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return[r.x,r.y,r.width,r.height].map(x=>Math.round(x*10)/10)}),1000,`geometry ${selector}`);last=cur;const eq=prev&&cur.every((v,i)=>Math.abs(v-prev[i])<=.2);same=eq?same+1:0;if(same>=3)return{ms:Date.now()-started,rect:cur};prev=cur;await page.waitForTimeout(45)}console.error('[AXIS geometry diagnostic]',selector,last,JSON.stringify(await uiState(page),null,2));throw new Error(`${selector} geometry did not stabilize within ${budgetMs}ms`)}
async function measuredClick(page,selector,budgetMs=250){console.log('[AXIS stage] click',selector);const result=await hard(page.evaluate(sel=>{const el=document.querySelector(sel);if(!el)return{ok:false,ms:0};const t=performance.now();el.click();return{ok:true,ms:performance.now()-t,onclick:typeof el.onclick}},selector),1200,`click ${selector}`);assert.ok(result.ok,`missing click target ${selector}`);if(result.ms>budgetMs)throw new Error(`${selector} synchronous click work ${result.ms.toFixed(1)}ms exceeds ${budgetMs}ms`);return result}
async function requireStableEnhance(page){console.log('[AXIS stage] wait stable enhancement');try{await wait(page,()=>window.__AXIS_LATEST_READY__===true,6500)}catch{console.error('[AXIS enhancement diagnostic]',JSON.stringify(await uiState(page),null,2));throw new Error('stable 8.7.11 enhancement did not finish within 6.5s')}const diag=await hard(page.evaluate(()=>window.__AXIS_ENHANCE_DIAG__||null),1200,'read enhancement diagnostics');assert.ok(diag,'missing stable enhancement diagnostics');assert.equal(diag.errors?.length||0,0,`stable enhancement has module errors: ${JSON.stringify(diag.errors||[])}`);assert.equal(await hard(page.evaluate(()=>!!window.__AXIS_STABLE_DEGRADED__),1200,'read degraded flag'),false,'stable kernel marked degraded');assert.ok((diag.totalMs||0)<1800,`stable background enhancement too slow: ${diag.totalMs}ms`)}
async function verifyIdleEntry(page){console.log('[AXIS stage] verify idle entry');if(await page.locator('#activeHome').isVisible())return'active';assert.ok(await page.locator('#idleHome').isVisible(),'neither idle nor active home is visible');const ok=(await page.locator('#dock').isVisible())&&(await page.locator('#scanBtn').isVisible())&&(await page.locator('#quickRecordBtn').isVisible());if(!ok){console.error('[AXIS idle diagnostic]',JSON.stringify(await uiState(page),null,2));assert.fail('current idle recording controls are not visible')}await measuredClick(page,'#quickRecordBtn',250);await wait(page,()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),800);await measuredClick(page,'#quickClose',180);return'idle'}
async function shellSmoke(page){await waitGeometryStable(page,'#settingsBtn',900);const settings=await measuredClick(page,'#settingsBtn',250);await wait(page,()=>document.querySelector('#settingsSheet')?.classList.contains('show'),600);await measuredClick(page,'[data-close="settingsSheet"]',180);await measuredClick(page,'nav.nav [data-view="historyView"]',180);await wait(page,()=>document.querySelector('#historyView')?.classList.contains('active'),1500);await measuredClick(page,'nav.nav [data-view="todayView"]',180);await wait(page,()=>document.querySelector('#todayView')?.classList.contains('active'),1500);return settings}
async function coreSmoke(viewport,full=false){console.log('[AXIS stage] cold boot',viewport.width,viewport.height,full?'full':'core');const context=await browser.newContext(contextOptions(viewport)),page=await context.newPage();wireConsole(page);await routeApis(page);const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e?.stack||e)));const started=Date.now(),res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res&&res.ok(),`navigation failed ${res?.status()}`);await wait(page,()=>window.__AXIS_CORE_INTERACTIVE__===true&&document.documentElement.dataset.axisCoreReady==='1',5000);const coreMs=Date.now()-started;assert.ok(coreMs<5000,`core interactive too slow: ${coreMs}ms`);const geometry=await waitGeometryStable(page,'#settingsBtn',900),settings=await shellSmoke(page);await requireStableEnhance(page);if(full){await verifyIdleEntry(page);console.log('[AXIS stage] wait optional 8.7.12');await wait(page,()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready'||window.__AXIS_FEATURE_KERNEL__?.state==='base',9000);const state=await hard(page.evaluate(()=>window.__AXIS_FEATURE_KERNEL__?.state),1200,'read feature state');if(state!=='ready')console.error('[AXIS feature diagnostic]',JSON.stringify(await uiState(page),null,2));assert.equal(state,'ready','8.7.12 feature did not become ready');await measuredClick(page,'#settingsBtn',250);await wait(page,()=>document.querySelector('#settingsSheet')?.classList.contains('show'),1000);const version=(await page.locator('.versionLine').innerText()).trim();assert.equal(version,'版本 8.7.12',`unexpected version: ${version}`)}assert.deepEqual(pageErrors,[],`uncaught page errors:\n${pageErrors.join('\n')}`);await context.close();return{coreMs,geometryMs:geometry.ms,settingsClickMs:settings.ms}}

async function featureFailureSmoke(){
  console.log('[AXIS stage] forced 8.7.12 network failure');
  const context=await browser.newContext(contextOptions({width:390,height:844})),page=await context.newPage();wireConsole(page);
  await routeApis(page);await page.route('**/v8712-runtime.js**',r=>r.abort('failed'));
  const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
  const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res&&res.ok());
  await wait(page,()=>window.__AXIS_CORE_INTERACTIVE__===true,5000);await requireStableEnhance(page);
  await wait(page,()=>window.__AXIS_FEATURE_KERNEL__?.state==='base',9000);
  const kernel=await hard(page.evaluate(()=>window.__AXIS_FEATURE_KERNEL__),1200,'read failed feature kernel');
  assert.equal(kernel.state,'base');assert.ok(kernel.errors.some(x=>String(x).includes('feature-network')),`expected network fallback: ${JSON.stringify(kernel.errors)}`);
  await shellSmoke(page);await verifyIdleEntry(page);
  await measuredClick(page,'#settingsBtn',250);await wait(page,()=>document.querySelector('#settingsSheet')?.classList.contains('show'),700);
  const version=(await page.locator('.versionLine').innerText()).trim();assert.equal(version,'版本 8.7.11',`failed feature must keep base version, got ${version}`);
  assert.deepEqual(errors,[],`feature failure caused page errors:\n${errors.join('\n')}`);
  console.log('[AXIS feature fallback] PASS · 8.7.11 remained fully interactive');
  await context.close();
}

if(BYPASS)console.log('[AXIS smoke] Vercel automation bypass enabled');
const results=[];for(let i=0;i<4;i++)results.push(await coreSmoke({width:390,height:844},false));results.push(await coreSmoke({width:430,height:932},true));results.push(await coreSmoke({width:1440,height:900},false));await featureFailureSmoke();console.log('[AXIS smoke] core ms:',results.map(x=>x.coreMs).join(', '));console.log('[AXIS smoke] settings stable ms:',results.map(x=>x.geometryMs).join(', '));console.log('[AXIS smoke] settings click ms:',results.map(x=>x.settingsClickMs.toFixed(1)).join(', '));console.log('[AXIS smoke] PASS');await browser.close();