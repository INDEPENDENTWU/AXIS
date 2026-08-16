import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{ok:true,enabled:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{ok:false,disabled:true}],['**/api/insight**',{ok:false,disabled:true}]])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:5000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:7000})};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
assert.equal((await page.locator('.versionLine').getAttribute('aria-label')||'').trim(),'版本 8.8.1');

console.log(`[AXIS 8.8.1 ${ENGINE}] unitless group-plan controls + expanded presets`);
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1600});
await page.locator('#v8Recent [data-qid]:visible').first().click();
await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('.v875PlanEntry'),undefined,{timeout:2400});
await page.locator('.v875PlanEntry').click();
await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&document.querySelector('[data-v8712-mode="pyramid"]'),undefined,{timeout:1400});
await page.locator('[data-v8712-mode="pyramid"]').click();await page.waitForTimeout(80);
const weightTexts=await page.locator('.v881WeightChips button').allInnerTexts();
const repTexts=await page.locator('.v881RepChips button').allInnerTexts();
assert.deepEqual(weightTexts.map(x=>x.trim()),['0.5','1','1.25','2','2.5','5','7.5','10']);
assert.deepEqual(repTexts.map(x=>x.trim()),['−1','−2','−3','−4','−5','−6']);
assert.ok(!weightTexts.some(x=>/kg/i.test(x))&&!repTexts.some(x=>/次/.test(x)),'quick presets still carry unit copy');
assert.equal(await page.locator('.v881StepEditor small').count(),0,'main numeric control still renders a unit');
for(const input of await page.locator('.v881StepEditor input').all()){
  const d=await input.evaluate(el=>{const i=el.getBoundingClientRect(),p=el.closest('.v881StepEditor').getBoundingClientRect(),s=getComputedStyle(el);return{delta:Math.abs((i.left+i.width/2)-(p.left+p.width/2)),align:s.textAlign}});
  assert.ok(d.delta<=1.5,`plan number is not geometrically centered: ${JSON.stringify(d)}`);assert.equal(d.align,'center');
}
await page.locator('[data-v8712-wstep="7.5"]').click();await page.locator('[data-v8712-rstep="5"]').click();await page.waitForTimeout(60);
assert.equal(await page.locator('[data-v8712-step-input="w"]').inputValue(),'7.5');
assert.equal(await page.locator('[data-v8712-step-input="r"]').inputValue(),'5');
await page.locator('#v875PlanSheet [data-v875-close-plan]').click();await page.waitForTimeout(60);

console.log(`[AXIS 8.8.1 ${ENGINE}] center AXIS brand + opacity single target`);
await page.locator('#scanSheet [data-close="scanSheet"]').click();await page.waitForTimeout(50);
await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:1200});
await page.locator('#watermarkBtn').click();await page.waitForFunction(()=>document.querySelector('#axisConfigGate-watermark')?.classList.contains('open')&&document.querySelector('#v881WmBrand'),undefined,{timeout:1400});
const brand=page.locator('#v881WmBrand');assert.equal((await brand.innerText()).trim(),'AXIS');assert.ok(await brand.isVisible(),'center AXIS brand is hidden');
const railBefore=await page.locator('#v8710WmPreview .v8710WmRail').evaluate(el=>getComputedStyle(el).opacity);
const range=page.locator('#v876OpacityRange');assert.ok(await range.count(),'brand opacity range missing');
await range.evaluate(el=>{el.value='12';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))});await page.waitForTimeout(100);
assert.ok(Math.abs(Number(await brand.evaluate(el=>getComputedStyle(el).opacity))-.12)<.02,'brand preview opacity did not follow 12%');
await range.evaluate(el=>{el.value='36';el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))});await page.waitForTimeout(100);
assert.ok(Math.abs(Number(await brand.evaluate(el=>getComputedStyle(el).opacity))-.36)<.02,'brand preview opacity did not follow 36%');
assert.equal(await page.locator('#v8710WmPreview .v8710WmRail').evaluate(el=>getComputedStyle(el).opacity),railBefore,'brand opacity changed info rail opacity');
await page.locator('#settingsSheet [data-close="settingsSheet"]').click();await page.waitForTimeout(60);

console.log(`[AXIS 8.8.1 ${ENGINE}] pause-aware active countdown + completion tone`);
await page.locator('#quickRecordBtn').click();await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelector('#v8Recent [data-qid]'),undefined,{timeout:1600});
await page.locator('#v8Recent [data-qid]:visible').first().click();await page.waitForFunction(()=>document.querySelector('#saveScan')&&document.querySelector('#v8Sets .v8SetRow'),undefined,{timeout:2200});
await page.locator('#saveScan').click();await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),undefined,{timeout:3500});
const activeId=await page.locator('#v87Finish').getAttribute('data-id');assert.ok(activeId);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();if(!a)throw new Error('active activity missing');a.status='active';a.estimateMs=60000;a.startedAt=t-56000;a.lastResumedAt=t-56000;a.intervals=[{start:t-56000,end:null}];delete a.itemReminderNotifiedAt;m.prefs=m.prefs||{};m.prefs.v87SoundEnabled=true;m.prefs.v86ItemReminder=true;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForTimeout(650);
assert.match((await page.locator('#v87Meta').innerText()).trim(),/^剩余 00:0[2-4]/,'active item does not show normalized countdown');
const toggle=page.locator('#v87Toggle');await toggle.click();await page.waitForTimeout(620);const paused=(await page.locator('#v87Meta').innerText()).trim();await page.waitForTimeout(1050);assert.equal((await page.locator('#v87Meta').innerText()).trim(),paused,'countdown moved while paused');
await toggle.click();await page.waitForTimeout(700);assert.notEqual((await page.locator('#v87Meta').innerText()).trim(),paused,'countdown did not resume');
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();if(!a)throw new Error('activity missing');a.status='active';a.estimateMs=60000;a.startedAt=t-59400;a.lastResumedAt=t-59400;a.intervals=[{start:t-59400,end:null}];delete a.itemReminderNotifiedAt;localStorage.setItem(k,JSON.stringify(m))},activeId);
await page.waitForFunction(id=>{try{return Number(JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.itemReminderNotifiedAt)>0}catch{return false}},activeId,{timeout:3000});
await page.waitForFunction(()=>document.querySelector('#v87Meta')?.textContent.trim().startsWith('剩余 00:00'),undefined,{timeout:800});

console.log(`[AXIS 8.8.1 ${ENGINE}] long-press finish suppresses pending countdown tone`);
await page.evaluate(id=>{const k='axis_v8_meta',m=JSON.parse(localStorage.getItem(k)||'{}'),a=m.events?.[id]?.activity,t=Date.now();if(!a)throw new Error('activity missing');a.status='active';a.estimateMs=60000;a.startedAt=t;a.lastResumedAt=t-59700;a.intervals=[{start:t-59700,end:null}];delete a.itemReminderNotifiedAt;localStorage.setItem(k,JSON.stringify(m))},activeId);
const box=await page.locator('#v87Finish').boundingBox();assert.ok(box);
await page.locator('#v87Finish').dispatchEvent('pointerdown',{pointerId:41,pointerType:'touch',isPrimary:true,buttons:1,clientX:box.x+box.width/2,clientY:box.y+box.height/2});
await page.waitForTimeout(1750);
await page.locator('#v87Finish').dispatchEvent('pointerup',{pointerId:41,pointerType:'touch',isPrimary:true,buttons:0,clientX:box.x+box.width/2,clientY:box.y+box.height/2}).catch(()=>{});
const finalState=await page.evaluate(id=>{try{const a=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity;return{status:a?.status,notified:a?.itemReminderNotifiedAt||0}}catch{return{}}},activeId);
assert.equal(finalState.status,'finished','long press did not finish item');assert.equal(finalState.notified,0,'countdown tone was marked played during intentional long-press finish');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log(`[AXIS 8.8.1 ${ENGINE}] PASS · planner · countdown · brand`);
await context.close();await browser.close();
