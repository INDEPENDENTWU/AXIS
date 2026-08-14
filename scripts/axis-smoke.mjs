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

  if(full){
    const start=page.locator('#startBtn');
    if(await start.isVisible()){
      await start.click({timeout:1500});
      await page.waitForFunction(()=>!document.querySelector('#activeHome')?.classList.contains('hidden'),{timeout:1800});
    }else{
      const activeVisible=await page.locator('#activeHome').isVisible();
      assert.ok(activeVisible,'neither start button nor active training view is visible');
    }

    await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready'||window.__AXIS_FEATURE_KERNEL__?.state==='base',{timeout:9000});
    const state=await page.evaluate(()=>window.__AXIS_FEATURE_KERNEL__?.state);
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
