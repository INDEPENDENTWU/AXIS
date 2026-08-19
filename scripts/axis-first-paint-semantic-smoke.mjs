import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const pw=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const browserType=pw[ENGINE];
if(!browserType)throw new Error(`unsupported AXIS_ENGINE ${ENGINE}`);
const launch=ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true};
const browser=await browserType.launch(launch);
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});

/* A persisted active session makes the static idle copy objectively wrong. */
await context.addInitScript(()=>{
  localStorage.setItem('axis_v60_state',JSON.stringify({
    version:60,
    sessions:[],
    active:{id:'FIRST-PAINT-ACTIVE',start:Date.now()-60000,events:[]},
    profile:{customEq:[],memories:[]},
    prefs:{}
  }));
});

const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
for(const [p,body] of [
  ['**/api/ai-status**',{ok:true,enabled:false}],
  ['**/api/owner-config**',{ok:true}],
  ['**/api/analyze**',{ok:false,disabled:true}],
  ['**/api/insight**',{ok:false,disabled:true}]
])await page.route(p,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(body)}));

let releaseCore;
const coreGate=new Promise(resolve=>{releaseCore=resolve});
await page.route('**/axis-core.js*',async route=>{await coreGate;await route.continue()});

const navigation=page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000});
await page.waitForSelector('#idleHome',{state:'attached',timeout:3500});
await page.waitForFunction(()=>{
  const idle=document.querySelector('#idleHome'),active=document.querySelector('#activeHome');
  return idle&&active&&getComputedStyle(idle).visibility==='hidden'&&getComputedStyle(active).visibility==='hidden';
},undefined,{timeout:2500});

/* Hold the cache-busted runtime long enough to reproduce a real deployment cold start. */
for(let i=0;i<10;i++){
  const pre=await page.evaluate(()=>({
    coreReady:document.documentElement.dataset.axisCoreReady||'',
    idleVisibility:getComputedStyle(document.querySelector('#idleHome')).visibility,
    activeVisibility:getComputedStyle(document.querySelector('#activeHome')).visibility,
    startVisibility:getComputedStyle(document.querySelector('#startBtn')).visibility,
    helloVisibility:getComputedStyle(document.querySelector('#helloTitle')).visibility,
    startText:document.querySelector('#startBtn')?.textContent?.replace(/\s+/g,'').trim()||'',
    helloText:document.querySelector('#helloTitle')?.textContent?.trim()||''
  }));
  assert.equal(pre.coreReady,'','runtime unexpectedly became ready while its request was held');
  assert.equal(pre.idleVisibility,'hidden','unverified idle Home painted before runtime state resolution');
  assert.equal(pre.activeVisibility,'hidden','unverified active Home painted before runtime state resolution');
  assert.equal(pre.startVisibility,'hidden',`obsolete ${pre.startText||'start'} action became visible during cold boot`);
  assert.equal(pre.helloVisibility,'hidden',`obsolete ${pre.helloText||'idle'} copy became visible during cold boot`);
  await page.waitForTimeout(35);
}

releaseCore();
await navigation;
await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&document.documentElement.dataset.axisCoreReady==='1',undefined,{timeout:6500});
const resolved=await page.evaluate(()=>({
  coreReady:document.documentElement.dataset.axisCoreReady,
  idleVisibility:getComputedStyle(document.querySelector('#idleHome')).visibility,
  activeVisibility:getComputedStyle(document.querySelector('#activeHome')).visibility,
  idleHidden:document.querySelector('#idleHome')?.classList.contains('hidden'),
  activeHidden:document.querySelector('#activeHome')?.classList.contains('hidden')
}));
assert.equal(resolved.coreReady,'1');
assert.equal(resolved.idleVisibility,'visible','first-paint gate remained attached after canonical core render');
assert.equal(resolved.activeVisibility,'visible','first-paint gate remained attached after canonical core render');
assert.equal(resolved.idleHidden,true,'persisted active session incorrectly resolved to the idle Home');
assert.equal(resolved.activeHidden,false,'persisted active session did not resolve to the active Home');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS first-paint semantic ${ENGINE}] PASS · cold runtime held · obsolete idle state never painted · canonical Home revealed after local-state render`);
await context.close();
await browser.close();
