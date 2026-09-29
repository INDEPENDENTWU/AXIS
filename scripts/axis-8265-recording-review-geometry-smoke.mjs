import assert from 'node:assert/strict';
import {chromium,webkit} from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const ENGINE=process.env.AXIS_ENGINE==='webkit'?'webkit':'chromium';
const type=ENGINE==='webkit'?webkit:chromium;
const launch=ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true};
const browser=await type.launch(launch);
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
await page.route('**/api/ai-status**',r=>json(r,{ok:true,enabled:false}));
await page.route('**/api/owner-config**',r=>json(r,{ok:true}));
await page.route('**/api/analyze**',r=>json(r,{ok:false,disabled:true}));
await page.route('**/api/insight**',r=>json(r,{ok:false,disabled:true}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const near=(a,b,t=.5)=>Math.abs(a-b)<=t;
const rect=async sel=>page.locator(sel).evaluate(el=>el.getBoundingClientRect().toJSON());

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,{timeout:7000});
await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready',{timeout:10000});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:7000});
await page.waitForFunction(()=>window.__AXIS_RELEASE__==='8.26.5',{timeout:5000});

await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelectorAll('#v8Recent [data-qid]').length>0,{timeout:1800});
await page.locator('#v8Recent [data-qid]:visible').first().click();
await page.waitForFunction(()=>document.querySelector('#reviewStage:not(.hidden)')&&document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#axisSetControls'),{timeout:3500});
await page.waitForFunction(()=>{const e=document.querySelector('#v82Estimate');return !!e&&e.getBoundingClientRect().height>=53},{timeout:1200});

const identityReady=await page.evaluate(()=>{window.__AXIS_8265_ESTIMATE=document.querySelector('#v82Estimate');window.__AXIS_8265_CONTROLS=document.querySelector('#axisSetControls');return !!window.__AXIS_8265_ESTIMATE&&!!window.__AXIS_8265_CONTROLS});
assert.equal(identityReady,true,'Review structural nodes missing before interaction');
const controlsBefore=await rect('#axisSetControls'),estimateBefore=await rect('#v82Estimate');
assert.ok(estimateBefore.height>=53&&estimateBefore.width>300,'estimate row is not structural on first interactive Review frame');
const weightBefore=Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText());

await page.locator('#axisSetControls [data-axis-step="weight"][data-dir="1"]').click();
await page.waitForTimeout(100);
assert.ok(Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText())>weightBefore,'weight edit did not commit');
const controlsAfter=await rect('#axisSetControls'),estimateAfter=await rect('#v82Estimate');
const sameNodes=await page.evaluate(()=>window.__AXIS_8265_ESTIMATE===document.querySelector('#v82Estimate')&&window.__AXIS_8265_CONTROLS===document.querySelector('#axisSetControls'));
assert.equal(sameNodes,true,'first metric edit rebuilt structural Review controls');
for(const [name,a,b] of [['controls x',controlsBefore.x,controlsAfter.x],['controls y',controlsBefore.y,controlsAfter.y],['controls width',controlsBefore.width,controlsAfter.width],['controls height',controlsBefore.height,controlsAfter.height],['estimate x',estimateBefore.x,estimateAfter.x],['estimate y',estimateBefore.y,estimateAfter.y],['estimate width',estimateBefore.width,estimateAfter.width],['estimate height',estimateBefore.height,estimateAfter.height]])assert.ok(near(a,b),`${name} drifted ${a} -> ${b}`);
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS 8.26.5 recording Review geometry] PASS · ${ENGINE} · structural estimate row present before interaction · first weight edit <=0.5px geometry tolerance`);
await context.close();await browser.close();
