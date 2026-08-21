import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
await context.addInitScript(()=>{
 const t=Date.now()-2*86400000;
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'8151-prior',start:t,end:t+30*60000,events:[{id:'8151-e',time:t+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:30,reps:10,sets:3}]}],active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
for(const [p,b] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(p,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(b)}));
let releaseCore;const coreGate=new Promise(r=>releaseCore=r);
await page.route('**/axis-core.js*',async r=>{await coreGate;r.continue()});
try{
 /* Remote-safe cold-start harness: wait only for the main document commit while
    axis-core.js is intentionally held. Waiting for DOMContentLoaded here creates
    a navigation/request dependency on remote CDNs and can reject before the held
    core is released; commit gives us the real parsed document without weakening
    the first-paint assertion. */
 await page.goto(BASE,{waitUntil:'commit',timeout:12000});
 await page.waitForSelector('#axisNowHero',{state:'attached',timeout:8000});
 for(let i=0;i<12;i++){
  const x=await page.evaluate(()=>{const h=document.querySelector('#axisNowHero'),cs=getComputedStyle(h);return{homeReady:document.documentElement.dataset.axisHomeReady||'',coreReady:document.documentElement.dataset.axisCoreReady||'',visibility:cs.visibility,opacity:cs.opacity,title:document.querySelector('#axisNowTitle')?.textContent?.trim()||'',meta:document.querySelector('#axisNowMeta')?.textContent?.trim()||''}});
  assert.equal(x.homeReady,'','Home unexpectedly committed while canonical core was held');
  assert.equal(x.coreReady,'','core unexpectedly became ready while request was held');
  assert.equal(x.visibility,'hidden',`historical Home semantic frame painted during cold start: ${JSON.stringify(x)}`);
  await page.waitForTimeout(40);
 }
 releaseCore();
 await page.waitForLoadState('domcontentloaded',{timeout:12000});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&document.documentElement.dataset.axisHomeReady==='1',undefined,{timeout:6500});
 /* The canonical bundle intentionally contains the inherited hardened-kernel boot
    guard before its canonical finalizer. Chromium normally reaches window load
    before the assertion below; WebKit can expose that valid intermediate diagnostic
    value for a few milliseconds. Finish the real navigation lifecycle and require
    the final canonical owner rather than accepting or asserting an intermediate. */
 await page.waitForLoadState('load',{timeout:12000});
 await page.waitForFunction(()=>window.__AXIS_STABLE_COMPLETE__===true&&window.__AXIS_ARCH__==='canonical-single-runtime',undefined,{timeout:6500});
 const x=await page.evaluate(()=>({release:window.__AXIS_RELEASE__,arch:window.__AXIS_ARCH__,seal:window.__AXIS_8151_REGRESSION_SEAL__,homeReady:document.documentElement.dataset.axisHomeReady,visibility:getComputedStyle(document.querySelector('#axisNowHero')).visibility,title:document.querySelector('#axisNowTitle')?.textContent?.trim()||'',meta:document.querySelector('#axisNowMeta')?.textContent?.trim()||''}));
 assert.equal(x.release,'8.15.1');assert.equal(x.arch,'canonical-single-runtime');assert.equal(x.homeReady,'1');assert.equal(x.visibility,'visible');
 assert.notEqual(x.title,'准备开始','persisted history resolved back to static historical Hero semantics');
 assert.equal(x.seal?.legacyPhotoCompositor,false);assert.equal(x.seal?.centerBrand,false);assert.equal(x.seal?.currentCard,true);assert.equal(x.seal?.photoWatermarkOwner,'v8710-watermark');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.15.1 regression seal ${ENGINE}] PASS · no static Home flash before canonical render · one current photo watermark owner · center brand retired`);
}finally{releaseCore?.();await context.close().catch(()=>{});await browser.close().catch(()=>{})}
