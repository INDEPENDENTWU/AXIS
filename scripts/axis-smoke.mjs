import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});

async function routeApis(page){
  await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true,enabled:false})}));
  await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})}));
  await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
  await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:false,disabled:true})}));
}

async function uiState(page){
  return page.evaluate(()=>{
    const snap=id=>{const e=document.querySelector(id);if(!e)return null;const c=getComputedStyle(e);return{class:e.className,display:c.display,visibility:c.visibility,opacity:c.opacity,rect:[Math.round(e.getBoundingClientRect().width),Math.round(e.getBoundingClientRect().height)]}};
    return{today:snap('#todayView'),idle:snap('#idleHome'),active:snap('#activeHome'),dock:snap('#dock'),scan:snap('#scanBtn'),quick:snap('#quickRecordBtn'),app:snap('.app'),openSheets:[...document.querySelectorAll('.sheetWrap.show')].map(x=>x.id),core:window.__AXIS_CORE_INTERACTIVE__,latest:window.__AXIS_LATEST_READY__,latestLoading:window.__AXIS_LATEST_LOADING__,hydrating:window.__AXIS_HYDRATING__,watchdog:window.__AXIS_BOOT_WATCHDOG__,stableComplete:window.__AXIS_STABLE_COMPLETE__,stableDegraded:window.__AXIS_STABLE_DEGRADED__,ready8711:window.__AXIS_8711_READY__,ready873Library:window.__AXIS_873_LIBRARY_READY__,featureKernel:window.__AXIS_FEATURE_KERNEL__||null,enhanceDiag:window.__AXIS_ENHANCE_DIAG__||null};
  });
}

async function requireStableEnhance(page){
  try{
    await page.waitForFunction(()=>window.__AXIS_LATEST_READY__===true,{timeout:6500});
  }catch(e){
    console.error('[AXIS enhancement diagnostic]',JSON.stringify(await uiState(page),null,2));
    throw new Error('stable 8.7.11 enhancement did not finish within 6.5s');
  }
}

async function verifyIdleEntry(page){
  const activeVisible=await page.locator('#activeHome').isVisible();
  if(activeVisible)return 'active';
  const idleVisible=await page.locator('#idleHome').isVisible();
  assert.ok(idleVisible,'neither idle nor active home is visible');
  const dockVisible=await page.locator('#dock').isVisible();
  const scanVisible=await page.locator('#scanBtn').isVisible();
  const quickVisible=await page.locator('#quickRecordBtn').isVisible();
  if(!(dockVisible&&scanVisible&&quickVisible)){
    console.error('[AXIS idle diagnostic]',JSON.stringify(await uiState(page),null,2));
    assert.fail('current idle recording controls are not visible');
  }
  await page.locator('#quickRecordBtn').click({timeout:1500});
  await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),{timeout:1500});
  await page.locator('#quickClose').click();
  return 'idle';
}

async function coreSmoke(viewport,full=false){
  const context=await browser.newContext({viewport,locale:'zh-CN'});
  const page=await context.newPage();
  await routeApis(page);
  const pageErrors=[];
  page.on('pageerror',e=>pageErrors.push(String(e?.stack||e)));
  const started=Date.now();
  const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});
  assert.ok(res&&res.ok(),`navigation failed ${res?.status()}`);
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&document.documentElement.dataset.axisCoreReady==='1',{timeout:5000});
  const coreMs=Date.now()-started;
  assert.ok(coreMs<5000,`core interactive too slow: ${coreMs}ms`);

  await page.locator('#settingsBtn').click({timeout:1500});
  await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),{timeout:1500});
  await page.locator('[data-close="settingsSheet"]').click();

  await page.locator('nav.nav [data-view="historyView"]').click();
  await page.waitForFunction(()=>document.querySelector('#historyView')?.classList.contains('active'),{timeout:1200});
  await page.locator('nav.nav [data-view="todayView"]').click();
  await page.waitForFunction(()=>document.querySelector('#todayView')?.classList.contains('active'),{timeout:1200});

  await requireStableEnhance(page);
  if(full){
    await verifyIdleEntry(page);
    await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready'||window.__AXIS_FEATURE_KERNEL__?.state==='base',{timeout:9000});
    const state=await page.evaluate(()=>window.__AXIS_FEATURE_KERNEL__?.state);
    if(state!=='ready')console.error('[AXIS feature diagnostic]',JSON.stringify(await uiState(page),null,2));
    assert.equal(state,'ready','8.7.12 feature did not become ready in local smoke test');
    await page.locator('#settingsBtn').click();
    await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),{timeout:1500});
    const version=(await page.locator('.versionLine').innerText()).trim();
    assert.equal(version,'版本 8.7.12',`unexpected version: ${version}`);
  }

  assert.deepEqual(pageErrors,[],`uncaught page errors:\n${pageErrors.join('\n')}`);
  await context.close();
  return coreMs;
}

const timings=[];
for(let i=0;i<4;i++)timings.push(await coreSmoke({width:390,height:844},false));
timings.push(await coreSmoke({width:430,height:932},true));
timings.push(await coreSmoke({width:1440,height:900},false));
console.log('[AXIS smoke] core ms:',timings.join(', '));
console.log('[AXIS smoke] PASS');
await browser.close();
