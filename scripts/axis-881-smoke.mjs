import assert from 'node:assert/strict';
import fs from 'node:fs';

const VERSION=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:8000});await page.waitForFunction(()=>window.__AXIS_QUICK_READY__===true,undefined,{timeout:1200})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),`版本 ${VERSION}`);

console.log(`[AXIS inherited 8.8.1 ${ENGINE}] unitless group-plan controls + expanded presets`);
assert.equal(await page.locator('#startBtn').isVisible(),false,'legacy explicit start entry unexpectedly returned');
assert.ok(await page.locator('#quickRecordBtn').isVisible(),'Quick Record is not the ready-state entry');
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1600});
await page.locator('#v8Recent [data-qid]:visible').first().click();await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('.v875PlanEntry'),undefined,{timeout:2400});
await page.locator('.v875PlanEntry').click();await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&document.querySelector('[data-v8712-mode="pyramid"]'),undefined,{timeout:1400});await page.locator('[data-v8712-mode="pyramid"]').click();await page.waitForTimeout(80);
const weightTexts=await page.locator('.v881WeightChips button').allInnerTexts(),repTexts=await page.locator('.v881RepChips button').allInnerTexts();
assert.deepEqual(weightTexts.map(x=>x.trim()),['0.5','1','1.25','2','2.5','5','7.5','10']);assert.deepEqual(repTexts.map(x=>x.trim()),['−1','−2','−3','−4','−5','−6']);assert.equal(await page.locator('.v881StepEditor small').count(),0);
for(const input of await page.locator('.v881StepEditor input').all()){const d=await input.evaluate(el=>{const i=el.getBoundingClientRect(),p=el.closest('.v881StepEditor').getBoundingClientRect();return{delta:Math.abs((i.left+i.width/2)-(p.left+p.width/2)),align:getComputedStyle(el).textAlign}});assert.ok(d.delta<=1.5);assert.equal(d.align,'center')}
await page.locator('#v875PlanSheet [data-v875-close-plan]').click();await page.waitForTimeout(60);

console.log(`[AXIS inherited 8.8.1 ${ENGINE}] center AXIS brand + opacity single target`);
await page.locator('#scanSheet [data-close="scanSheet"]').click();await page.waitForTimeout(60);await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});await page.locator('#watermarkBtn').click();await page.waitForFunction(()=>document.querySelector('#v881WmBrand'),undefined,{timeout:1400});
const brand=page.locator('#v881WmBrand');assert.equal((await brand.innerText()).trim(),'AXIS');const railBefore=await page.locator('#v8710WmPreview .v8710WmRail').evaluate(el=>getComputedStyle(el).opacity),range=page.locator('#v876OpacityRange');
await range.evaluate(el=>{el.value='12';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))});await page.waitForTimeout(100);assert.ok(Math.abs(Number(await brand.evaluate(el=>getComputedStyle(el).opacity))-.12)<.02);
await range.evaluate(el=>{el.value='36';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))});await page.waitForTimeout(100);assert.ok(Math.abs(Number(await brand.evaluate(el=>getComputedStyle(el).opacity))-.36)<.02);assert.equal(await page.locator('#v8710WmPreview .v8710WmRail').evaluate(el=>getComputedStyle(el).opacity),railBefore);
await page.locator('#settingsSheet [data-close="settingsSheet"]').click();await page.waitForTimeout(60);

console.log(`[AXIS inherited 8.8.1 ${ENGINE}] pause-aware active countdown presentation`);
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1600});await page.locator('#v8Recent [data-qid]:visible').first().click();await page.waitForFunction(()=>document.querySelector('#saveScan')&&document.querySelector('#v8Sets .v8SetRow'),undefined,{timeout:2200});await page.locator('#saveScan').click();await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});
const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();a.status='active';a.estimateMs=60000;a.startedAt=t-56000;a.lastResumedAt=t-56000;a.intervals=[{start:t-56000,end:null}];a.restStartedAt=null;localStorage.setItem(k,JSON.stringify(m))},activeId);await page.waitForTimeout(650);assert.match((await page.locator('#v87Meta').innerText()).trim(),/^剩余 00:0[2-4]/);
await page.locator('#v87Toggle').click();await page.waitForTimeout(620);const paused=(await page.locator('#v87Meta').innerText()).trim();await page.waitForTimeout(1050);assert.equal((await page.locator('#v87Meta').innerText()).trim(),paused);assert.equal((await page.locator('#v87Toggle').innerText()).trim(),'▶','single paused item did not expose canonical resume control');await page.locator('#v87Toggle').click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused);

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS inherited 8.8.1 ${ENGINE}] PASS · planner · countdown display · brand`);
await context.close();await browser.close();