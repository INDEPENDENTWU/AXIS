import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';

const annotate=e=>{const s=String(e?.stack||e||'AXIS first-paint failure').replace(/%/g,'%25').replace(/\r?\n/g,'%0A');console.error(`::error title=AXIS first-paint smoke::${s}`)};
process.on('uncaughtExceptionMonitor',annotate);process.on('unhandledRejection',annotate);

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));

await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,enabled:false})}));
await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));

const snap=()=>page.evaluate(()=>{
 const box=sel=>{const e=document.querySelector(sel);if(!e)return null;const r=e.getBoundingClientRect(),c=getComputedStyle(e);return{rect:[r.x,r.y,r.width,r.height].map(v=>Math.round(v*10)/10),display:c.display,visibility:c.visibility,background:c.backgroundColor,className:e.className}};
 return{
  settings:box('#settingsBtn'),dock:box('#dock'),nav:box('nav.nav'),activeNav:box('nav.nav button.active'),
  settingsMarkup:document.querySelector('#settingsBtn')?.innerHTML||'',
  quickExists:!!document.querySelector('#quickRecordBtn'),
  quickText:document.querySelector('#quickRecordBtn')?.textContent?.replace(/\s+/g,'').trim()||'',
  scanText:document.querySelector('#scanBtn span')?.textContent?.trim()||'',
  version:document.querySelector('.versionLine')?.textContent?.trim()||'',
  release:window.__AXIS_RELEASE__||null,feature:window.__AXIS_FEATURE_KERNEL__?.state||null
 };
});
const sameRect=(a,b,label)=>{assert.ok(a&&b,`${label} missing`);for(let i=0;i<4;i++)assert.ok(Math.abs(a.rect[i]-b.rect[i])<=.6,`${label} geometry moved: ${a.rect} -> ${b.rect}`)};

const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res?.ok());
const first=await snap();
assert.equal(first.quickExists,true,'quick record must exist in first DOM');
assert.equal(first.scanText,'拍摄记录','capture label must be final before hydration');
assert.equal(first.quickText,'＋快速记录','quick record label must be final before hydration');
assert.equal(first.version,'版本 8.7.12','public version must be 8.7.12 before enhancement');
assert.ok(first.settingsMarkup.includes('v877ControlGlyph'),'settings sliders must be present before enhancement');
assert.ok(first.dock.className.includes('v8-dual'),'dual dock must be a first-paint class');
assert.notEqual(first.activeNav.background,'rgba(0, 0, 0, 0)','active navigation must keep a visible selection surface');

await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
const core=await snap();
sameRect(first.settings,core.settings,'settings first->core');sameRect(first.dock,core.dock,'dock first->core');sameRect(first.nav,core.nav,'nav first->core');
assert.equal(core.settingsMarkup,first.settingsMarkup,'core must not replace settings-control DOM');
assert.equal(core.version,'版本 8.7.12');

await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready'||window.__AXIS_FEATURE_KERNEL__?.state==='base',undefined,{timeout:10000});
const final=await snap();
sameRect(first.settings,final.settings,'settings first->final');sameRect(first.dock,final.dock,'dock first->final');sameRect(first.nav,final.nav,'nav first->final');
assert.equal(final.settingsMarkup,first.settingsMarkup,'enhancement must not replace settings-control DOM');
assert.equal(final.version,'版本 8.7.12','public version must never promote visibly');
assert.equal(final.release,'8.7.12','public release identity must remain 8.7.12');

await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1000});
await page.locator('#myEqBtn').click();
await page.waitForFunction(()=>document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'),undefined,{timeout:1000});
assert.equal(await page.evaluate(()=>typeof window.__AXIS_OPEN_CUSTOM_EQUIPMENT__),'function','canonical custom equipment API missing');
await page.locator('#newCustomEq').click();
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:1000});
await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('v879Front'),undefined,{timeout:1000});
assert.equal(await page.locator('#customEqTitle').innerText(),'自定义运动');
assert.ok(await page.locator('#customName').isVisible(),'shared custom editor did not become visible');
assert.equal(typeof await page.locator('#saveCustomEq').evaluate(e=>e.onclick),'object');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS first-paint] PASS · final chrome from first DOM · public 8.7.12 invariant · Settings custom editor visible');
await browser.close();
