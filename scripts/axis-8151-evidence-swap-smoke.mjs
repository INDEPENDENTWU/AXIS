import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8151_MEDIA_SWAP__?.stableSection===true&&window.__AXIS_MEDIA_STORE__?.format==='axis-media-arraybuffer-v1',undefined,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.15.1');

 await page.evaluate(async()=>{
  const DAY=864e5,latest=new Date();latest.setHours(9,0,0,0);const t2=latest.getTime(),starts=[t2-DAY,t2],sessions=[],meta={events:{}};
  starts.forEach((start,i)=>{const id=`elliptical-${i+1}`;const e={id,time:start+60000,kind:'cardio',equipmentId:'elliptical',name:'椭圆机',duration:i?15:30,intensity:i?7:9,muscles:['心肺'],frameRefs:[i?'F-ELLIPTICAL-LATEST':'F-ELLIPTICAL-FIRST']};meta.events[id]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+110000,intervals:[{start:start+10000,end:start+110000}]}};sessions.push({id:`session-${i+1}`,start,end:start+20*60000,events:[e]})});
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
  const svg=(label,bg)=>new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400"><rect width="640" height="400" fill="${bg}"/><text x="30" y="210" fill="white" font-size="40">${label}</text></svg>`],{type:'image/svg+xml'});
  await window.__AXIS_MEDIA_STORE__.put('F-ELLIPTICAL-FIRST',svg('FIRST','#242a33'));
  await window.__AXIS_MEDIA_STORE__.put('F-ELLIPTICAL-LATEST',svg('LATEST','#343b46'));
  window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'8151-stable-swap'}}));
 });

 await tap(page.locator('nav.nav [data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length===2,undefined,{timeout:4000});
 await tap(page.locator('.v813Node.selected'));
 await page.waitForFunction(()=>document.querySelector('.v813Activity[data-v814-key="elliptical"]'),undefined,{timeout:2000});
 await tap(page.locator('.v813Activity[data-v814-key="elliptical"]'));
 await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第2/2次'),undefined,{timeout:2500});

 const firstNode=page.locator('#v815Evidence [data-v815-encounter="1"]');
 await firstNode.scrollIntoViewIfNeeded();
 await page.waitForTimeout(80);
 const before=await page.evaluate(()=>{
  const section=document.querySelector('#v815Evidence'),stage=section?.querySelector('.v815Stage');window.__AXIS_8151_TEST_SECTION__=section;window.__AXIS_8151_NATIVE_MEDIA_GET__=window.__AXIS_MEDIA_READ__.get;window.__AXIS_MEDIA_READ__.get=async(...args)=>{await new Promise(r=>setTimeout(r,320));return window.__AXIS_8151_NATIVE_MEDIA_GET__(...args)};return{html:stage?.innerHTML||'',height:stage?.offsetHeight||0,offsetTop:stage?.offsetTop||0,scrollY:window.scrollY}
 });
 assert.ok(before.html.includes('第2/2次'),'latest evidence was not mounted before swap test');

 await tap(firstNode);
 await page.waitForTimeout(90);
 const during=await page.evaluate(()=>{const section=document.querySelector('#v815Evidence'),stage=section?.querySelector('.v815Stage'),cs=stage?getComputedStyle(stage):null;return{same:section===window.__AXIS_8151_TEST_SECTION__,loading:section?.dataset.loading,html:stage?.innerHTML||'',height:stage?.offsetHeight||0,offsetTop:stage?.offsetTop||0,scrollY:window.scrollY,opacity:cs?.opacity,active:document.querySelector('#insightsView')?.classList.contains('active'),sheets:document.querySelectorAll('.sheetWrap.show').length}});
 assert.equal(during.same,true,'evidence section was remounted during date switch');
 assert.equal(during.loading,'1','stable swap did not expose local loading state');
 assert.ok(during.html.includes('第2/2次'),'previous evidence was removed before next local asset became ready');
 assert.equal(during.opacity,'1','evidence stage visibly dimmed during date switch');
 assert.equal(during.height,before.height,'evidence stage height changed during pending swap');
 assert.equal(during.offsetTop,before.offsetTop,'evidence stage moved inside its stable shell during pending swap');
 assert.ok(Math.abs(during.scrollY-before.scrollY)<1,'date switch unexpectedly scrolled the Trends view');
 assert.equal(during.active,true,'Trends surface stopped being active during evidence swap');
 assert.equal(during.sheets,0,'evidence swap exposed another sheet/page layer');

 await page.waitForFunction(()=>document.querySelector('#v815Evidence .v815Overlay')?.textContent.includes('第1/2次')&&document.querySelector('#v815Evidence')===window.__AXIS_8151_TEST_SECTION__,undefined,{timeout:2500});
 const after=await page.evaluate(()=>{window.__AXIS_MEDIA_READ__.get=window.__AXIS_8151_NATIVE_MEDIA_GET__;delete window.__AXIS_8151_NATIVE_MEDIA_GET__;delete window.__AXIS_8151_TEST_SECTION__;const s=document.querySelector('#v815Evidence');return{loading:s?.dataset.loading,selected:s?.querySelector('[data-v815-encounter="1"]')?.getAttribute('aria-selected'),marker:window.__AXIS_8151_MEDIA_SWAP__}});
 assert.equal(after.loading,'0');assert.equal(after.selected,'true');assert.equal(after.marker.stableShell,true);assert.equal(after.marker.retainPreviousUntilReady,true);assert.equal(after.marker.warmBeforeCommit,true);assert.equal(after.marker.loadingOpacityBlink,false);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.15.1 evidence swap ${ENGINE}] PASS · stable shell identity/geometry · previous visual retained until ready · zero opacity pulse · zero layer exposure`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
