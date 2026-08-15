import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const BYPASS=String(process.env.VERCEL_AUTOMATION_BYPASS_SECRET||'').trim();
const contextOptions=viewport=>({viewport,locale:'zh-CN',...(BYPASS?{extraHTTPHeaders:{'x-vercel-protection-bypass':BYPASS}}:{})});
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const wait=(page,fn,ms)=>page.waitForFunction(fn,undefined,{timeout:ms});
const hard=(promise,ms,label)=>Promise.race([promise,new Promise((_,reject)=>setTimeout(()=>reject(new Error(`hard deadline ${ms}ms: ${label}`)),ms))]);

function wireConsole(page){page.on('console',async msg=>{if(msg.type()!=='error')return;const parts=[];for(const arg of msg.args()){try{parts.push(await arg.evaluate(v=>v instanceof Error?{name:v.name,message:v.message,stack:v.stack}:typeof v==='string'?v:JSON.stringify(v)))}catch{parts.push(msg.text())}}console.error('[AXIS browser console]',...parts)})}
async function routeApis(page){
 await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,enabled:false})}));
 await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
 await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
 await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
}
async function uiState(page){return hard(page.evaluate(()=>({
 core:window.__AXIS_CORE_INTERACTIVE__,latest:window.__AXIS_LATEST_READY__,stable:window.__AXIS_STABLE_COMPLETE__,degraded:window.__AXIS_STABLE_DEGRADED__,
 canonical:window.__AXIS_CANONICAL_88__||null,feature:window.__AXIS_FEATURE_KERNEL__||null,completion:window.__AXIS_COMPLETION_KERNEL__||null,diag:window.__AXIS_ENHANCE_DIAG__||null,
 open:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id),arch:window.__AXIS_ARCH__,htmlArch:document.documentElement.dataset.axisRuntime
})),1200,'read UI state')}
async function waitGeometryStable(page,selector,budgetMs=900){const started=Date.now();let prev=null,same=0,last=null;while(Date.now()-started<budgetMs){const cur=await hard(page.locator(selector).evaluate(el=>{const r=el.getBoundingClientRect();return[r.x,r.y,r.width,r.height].map(x=>Math.round(x*10)/10)}),1000,`geometry ${selector}`);last=cur;const eq=prev&&cur.every((v,i)=>Math.abs(v-prev[i])<=.2);same=eq?same+1:0;if(same>=3)return{ms:Date.now()-started,rect:cur};prev=cur;await page.waitForTimeout(45)}console.error('[AXIS geometry diagnostic]',selector,last,JSON.stringify(await uiState(page),null,2));throw new Error(`${selector} geometry did not stabilize within ${budgetMs}ms`)}
async function measuredClick(page,selector,budgetMs=250){const result=await hard(page.evaluate(sel=>{const el=document.querySelector(sel);if(!el)return{ok:false,ms:0};const t=performance.now();el.click();return{ok:true,ms:performance.now()-t}},selector),1200,`click ${selector}`);assert.ok(result.ok,`missing click target ${selector}`);assert.ok(result.ms<=budgetMs,`${selector} synchronous click work ${result.ms.toFixed(1)}ms exceeds ${budgetMs}ms`);return result}
async function waitCanonical(page){
 try{await wait(page,()=>window.__AXIS_CANONICAL_88__?.state==='ready'&&window.__AXIS_FEATURE_KERNEL__?.state==='ready'&&window.__AXIS_COMPLETION_KERNEL__?.state==='ready',6500)}catch{console.error('[AXIS canonical diagnostic]',JSON.stringify(await uiState(page),null,2));throw new Error('canonical 8.8 runtime did not become ready within 6.5s')}
 const s=await uiState(page);assert.equal(s.arch,'canonical-single-runtime');assert.equal(s.htmlArch,'canonical-8.8');assert.equal(s.degraded,false);assert.equal(s.canonical?.version,'8.8');assert.equal(s.feature?.embedded,true);assert.equal(s.completion?.embedded,true);assert.equal(s.diag?.errors?.length||0,0,`canonical modules have errors: ${JSON.stringify(s.diag?.errors||[])}`)
}
async function shellSmoke(page){await waitGeometryStable(page,'#settingsBtn');const settings=await measuredClick(page,'#settingsBtn');await wait(page,()=>document.querySelector('#settingsSheet')?.classList.contains('show'),700);await measuredClick(page,'[data-close="settingsSheet"]',180);await measuredClick(page,'nav.nav [data-view="historyView"]',180);await wait(page,()=>document.querySelector('#historyView')?.classList.contains('active'),900);await measuredClick(page,'nav.nav [data-view="todayView"]',180);await wait(page,()=>document.querySelector('#todayView')?.classList.contains('active'),900);return settings}
async function verifyIdleEntry(page){if(await page.locator('#activeHome').isVisible())return;assert.ok(await page.locator('#idleHome').isVisible());assert.ok(await page.locator('#dock').isVisible());assert.ok(await page.locator('#scanBtn').isVisible());assert.ok(await page.locator('#quickRecordBtn').isVisible());await measuredClick(page,'#quickRecordBtn');await wait(page,()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),800);await measuredClick(page,'#quickClose',180)}

async function coldBoot(viewport,full=false){
 console.log('[AXIS canonical] cold boot',viewport.width,viewport.height,full?'full':'shell');
 const context=await browser.newContext(contextOptions(viewport)),page=await context.newPage();wireConsole(page);await routeApis(page);
 let retiredRequests=0;for(const pattern of ['**/axis-enhance-foundation.js**','**/axis-enhance-recording.js**','**/axis-enhance-interaction.js**','**/axis-enhance-product.js**','**/v8712-runtime.js**','**/v8712-completion.js**'])await page.route(pattern,r=>{retiredRequests++;return r.abort('failed')});
 const scripts=[];page.on('request',r=>{if(r.resourceType()==='script')scripts.push(new URL(r.url()).pathname)});
 const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
 const started=Date.now(),res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res?.ok(),`navigation failed ${res?.status()}`);
 await wait(page,()=>window.__AXIS_CORE_INTERACTIVE__===true&&document.documentElement.dataset.axisCoreReady==='1',5000);const coreMs=Date.now()-started;assert.ok(coreMs<5000,`core interactive too slow: ${coreMs}ms`);
 const geometry=await waitGeometryStable(page,'#settingsBtn'),settings=await shellSmoke(page);await waitCanonical(page);
 assert.equal(retiredRequests,0,`canonical runtime attempted ${retiredRequests} retired dynamic runtime requests`);
 assert.deepEqual([...new Set(scripts)],['/axis-core.js'],`unexpected external scripts: ${JSON.stringify(scripts)}`);
 const version=(await page.locator('.versionLine').getAttribute('aria-label')||'').trim();assert.equal(version,'版本 8.8');
 if(full)await verifyIdleEntry(page);
 assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
 await context.close();return{coreMs,geometryMs:geometry.ms,settingsClickMs:settings.ms};
}

if(BYPASS)console.log('[AXIS canonical] Vercel automation bypass enabled');
const results=[];for(let i=0;i<3;i++)results.push(await coldBoot({width:390,height:844},false));results.push(await coldBoot({width:430,height:932},true));results.push(await coldBoot({width:1440,height:900},false));
console.log('[AXIS canonical] core ms:',results.map(x=>x.coreMs).join(', '));console.log('[AXIS canonical] settings stable ms:',results.map(x=>x.geometryMs).join(', '));console.log('[AXIS canonical] settings click ms:',results.map(x=>x.settingsClickMs.toFixed(1)).join(', '));console.log('[AXIS canonical] PASS · single runtime · zero retired dynamic requests');
await browser.close();
