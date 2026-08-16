import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const ENGINE=process.env.AXIS_ENGINE||'chromium';
const browserType=ENGINE==='webkit'?webkit:chromium;
const launch=ENGINE==='chromium'&&process.env.CHROME_BIN?{headless:true,executablePath:process.env.CHROME_BIN,args:['--no-sandbox']}:{headless:true};
const browser=await browserType.launch(launch);
const viewport=ENGINE==='webkit'?{width:390,height:844}:{width:430,height:932};
const context=await browser.newContext({viewport,locale:'zh-CN',isMobile:true,hasTouch:true});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [
  ['**/api/ai-status**',{ok:true,enabled:false}],
  ['**/api/owner-config**',{ok:true}],
  ['**/api/analyze**',{ok:false,disabled:true}],
  ['**/api/insight**',{ok:false,disabled:true}]
])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));

const waitReady=async()=>{
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});
  await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:6500});
  await page.waitForFunction(()=>window.__AXIS_QUICK_READY__===true,undefined,{timeout:1200});
};
const openAudio=async()=>{
  if(!await page.locator('#settingsSheet.show').count())await page.locator('#settingsBtn').click();
  await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
  if(!await page.locator('#v8711AudioGate.open').count())await page.locator('#v8711AudioGate > .settingLink').click();
  await page.waitForFunction(()=>document.querySelector('#v8711AudioGate')?.classList.contains('open'),undefined,{timeout:1200});
  await page.waitForFunction(()=>document.querySelector('#v8710Audio'),undefined,{timeout:1200});
};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());
await page.reload({waitUntil:'domcontentloaded'});
await waitReady();
assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');

console.log(`[AXIS ${ENGINE}] item countdown + total-workout duration sound settings`);
await openAudio();
assert.equal(await page.locator('#v876TargetSheet:visible,#v8710Rest:visible').count(),0,'retired rest/session target overlays are visible');
assert.equal(await page.locator('#v8710Item:visible').count(),1,'canonical item countdown reminder control missing');
assert.equal(await page.locator('#v8710Session:visible').count(),1,'total workout duration reminder control missing');
assert.equal(await page.locator('#v8710SessionPreset button:visible').count(),5,'duration target presets missing');
assert.equal(await page.locator('#v8710Tone button:visible').count(),4,'canonical AXIS sound choices missing');
assert.equal(await page.locator('#v8710Test:visible').count(),0,'retired standalone audition action returned');
const soundCopy=(await page.locator('#v8710Audio').innerText()).trim();
assert.ok(soundCopy.includes('倒计时到点'),'sound UI does not state countdown semantics');
assert.ok(soundCopy.includes('总锻炼时长提醒'),'sound UI lost total workout duration reminder');

console.log(`[AXIS ${ENGINE}] current item / capture dock / nav share one geometry rhythm`);
await page.locator('#settingsSheet [data-close="settingsSheet"]').click();await page.waitForTimeout(60);
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1800});
await page.locator('#v8Recent [data-qid]:visible').first().click();
await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#saveScan'),undefined,{timeout:2200});
await page.locator('#saveScan').click();
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#dock')?.classList.contains('show'),undefined,{timeout:3500});

const geometry=await page.evaluate(()=>{
  const rect=s=>document.querySelector(s)?.getBoundingClientRect();
  const card=rect('#v87Now'),scan=rect('#scanBtn'),quick=rect('#quickRecordBtn'),nav=rect('nav.nav');
  if(!card||!scan||!quick||!nav)return null;
  const dockTop=Math.min(scan.top,quick.top),dockBottom=Math.max(scan.bottom,quick.bottom),dockLeft=Math.min(scan.left,quick.left),dockRight=Math.max(scan.right,quick.right);
  return{
    card:{left:card.left,right:card.right,top:card.top,bottom:card.bottom,width:card.width},
    dock:{left:dockLeft,right:dockRight,top:dockTop,bottom:dockBottom},
    nav:{top:nav.top,bottom:nav.bottom},
    cardDockGap:dockTop-card.bottom,
    dockNavGap:nav.top-dockBottom,
    leftDelta:card.left-dockLeft,
    rightDelta:card.right-dockRight
  };
});
assert.ok(geometry,`bottom-stack geometry unavailable: ${JSON.stringify(geometry)}`);
assert.ok(Math.abs(geometry.cardDockGap-12)<=1.5,`active-card / dock gap drifted: ${JSON.stringify(geometry)}`);
assert.ok(Math.abs(geometry.dockNavGap-8)<=1.5,`dock / nav gap drifted: ${JSON.stringify(geometry)}`);
assert.ok(Math.abs(geometry.leftDelta)<=1.5&&Math.abs(geometry.rightDelta)<=1.5,`active card no longer shares dock content edges: ${JSON.stringify(geometry)}`);
assert.ok(geometry.card.width>=340,'active card became too narrow');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS ${ENGINE}] PASS · item + total duration sound · four AXIS choices · 12px card/dock · 8px dock/nav · aligned content edges`);
await context.close();await browser.close();
