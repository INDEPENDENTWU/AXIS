import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN'});
const page=await context.newPage();
await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"enabled":false}'}));
await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false,"disabled":true}'}));
await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false,"disabled":true}'}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const near=(a,b,t=1.5)=>Math.abs(a-b)<=t;

const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res?.ok());
await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,{timeout:5000});
await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready',{timeout:9000});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready'&&window.__AXIS_8712_COMPLETION_READY__===true,{timeout:5000});
assert.equal((await page.locator('.versionLine').innerText()).trim(),'版本 8.7.12');

console.log('[AXIS convergence] settings + sound');
await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),{timeout:1000});
await page.waitForTimeout(180);
assert.equal(await page.locator('#v8710Test,#v85Test,#v876Test,.v8710Test,.v85Test,.v876Test').count(),0,'sound audition button must be removed');

console.log('[AXIS convergence] nested sheet return geometry');
const wm=page.locator('#watermarkBtn');
if(await wm.count()){
 const parentScroll=await page.locator('#settingsSheet>.sheet').evaluate(el=>{el.scrollTop=Math.min(96,Math.max(0,el.scrollHeight-el.clientHeight));return el.scrollTop});
 await wm.click();
 await page.waitForFunction(()=>document.querySelector('#watermarkSheet')?.classList.contains('show'),{timeout:1200});
 await page.waitForTimeout(180);
 assert.equal(await page.locator('#watermarkSheet .axisBack').count(),1,'watermark detail requires exactly one return control');
 const g=await page.locator('#watermarkSheet .sheetHead').evaluate(head=>{
  const back=head.querySelector('.axisBack')?.getBoundingClientRect(),title=head.querySelector('b')?.getBoundingClientRect(),close=head.querySelector('.closeBtn')?.getBoundingClientRect(),hr=head.getBoundingClientRect();
  return{back,title,close,head:hr};
 });
 assert.ok(g.back&&g.title&&g.close,'nested header geometry incomplete');
 assert.ok(near(g.back.width,44,.75)&&near(g.back.height,44,.75),`return hit target must be 44×44: ${JSON.stringify(g.back)}`);
 assert.ok(near(g.back.y+g.back.height/2,g.close.y+g.close.height/2,1),`header actions are not vertically aligned: ${JSON.stringify(g)}`);
 assert.ok(g.title.x>g.back.x+g.back.width-1,'title overlaps return control');
 assert.equal(await page.locator('#watermarkPreview #v8711Corners button[data-p]').count(),4,'exactly four visible watermark corner controls required');
 const baseCorners=await page.locator('#watermarkPreview>button[data-pos]').evaluateAll(xs=>xs.map(x=>({opacity:getComputedStyle(x).opacity,pointer:getComputedStyle(x).pointerEvents})));
 assert.ok(baseCorners.length===4,'base watermark hit targets missing');
 assert.ok(baseCorners.every(x=>Number(x.opacity)===0&&x.pointer==='none'),`base corner visuals must be inert: ${JSON.stringify(baseCorners)}`);
 await page.locator('#watermarkSheet .axisBack').click();
 await page.waitForTimeout(100);
 assert.equal(await page.locator('#watermarkSheet.show').count(),0,'return did not close child sheet');
 assert.equal(await page.locator('#settingsSheet.show').count(),1,'return did not restore parent sheet');
 const restored=await page.locator('#settingsSheet>.sheet').evaluate(el=>el.scrollTop);
 assert.ok(Math.abs(restored-parentScroll)<=2,`parent scroll was not restored: ${parentScroll} -> ${restored}`);
}

console.log('[AXIS convergence] core-owned strength editor');
await page.reload({waitUntil:'domcontentloaded'});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready',{timeout:12000});
assert.equal(await page.evaluate(()=>typeof window.__AXIS_RECORDING__?.adjust),'function','v61 recording owner API missing');
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelectorAll('#v8Recent [data-qid]').length>0,{timeout:1200});
const quick=page.locator('#v8Recent [data-qid]:visible').first();
assert.ok(await quick.count(),'missing current v61 quick-record item');
await quick.click();
await page.waitForFunction(()=>document.querySelectorAll('#v8Sets .v8SetRow').length>0&&document.querySelector('#axisSetControls'),{timeout:2200});
assert.equal(await page.locator('#axisSetControls').count(),1,'recording controls must have one owner');
assert.equal(await page.locator('#v8Sets .v879Adjust,.v8712cStandalone').count(),0,'retired recording painters must not render');
const legacyDisplay=await page.locator('#v8Sets .v8Adjust').evaluate(el=>getComputedStyle(el).display);
assert.equal(legacyDisplay,'none','legacy adjust UI must be inert');
assert.ok(await page.locator('#v8Sets [data-cnt]').count()>=2,'group count controls missing');
assert.equal(await page.locator('#axisSetControls [data-axis-step="weight"]').count(),2,'weight stepper missing');
assert.equal(await page.locator('#axisSetControls [data-axis-step="reps"]').count(),2,'rep stepper missing');

const geometry=await page.locator('#axisSetControls').evaluate(box=>{
 const fields=[...box.querySelectorAll('.axisSetField')].map(x=>x.getBoundingClientRect());
 const steppers=[...box.querySelectorAll('.axisSetStepper')].map(x=>x.getBoundingClientRect());
 const values=[...box.querySelectorAll('.axisSetValue')].map(x=>x.getBoundingClientRect());
 const buttons=[...box.querySelectorAll('.axisSetStepper>button')].map(x=>x.getBoundingClientRect());
 return{fields,steppers,values,buttons};
});
assert.equal(geometry.fields.length,2,'expected two recording fields');
assert.ok(near(geometry.fields[0].width,geometry.fields[1].width,1),`recording columns differ: ${JSON.stringify(geometry.fields)}`);
assert.ok(near(geometry.steppers[0].height,geometry.steppers[1].height,.5),'recording controls have inconsistent heights');
assert.ok(near(geometry.values[0].y+geometry.values[0].height/2,geometry.values[1].y+geometry.values[1].height/2,1),'recording values are not horizontally aligned');
assert.ok(geometry.buttons.every(b=>near(b.height,60,.75)),'recording +/- hit geometry is inconsistent');

const active=page.locator('#v8Sets .v8SetRow.active');
const before=Number(await active.locator('span b').first().innerText());
await page.evaluate(()=>{window.__AXIS_TEST_ROW__=document.querySelector('#v8Sets .v8SetRow.active');window.__AXIS_TEST_RECT__=document.querySelector('#axisSetControls').getBoundingClientRect().toJSON()});
await page.locator('#axisSetControls [data-axis-step="weight"][data-dir="1"]').click();
await page.waitForTimeout(90);
const after=Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText());
assert.ok(after>before,`weight did not change: ${before} -> ${after}`);
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'weight adjustment rebuilt the active row and can visibly flicker');
const afterRect=await page.locator('#axisSetControls').evaluate(el=>el.getBoundingClientRect().toJSON());
const beforeRect=await page.evaluate(()=>window.__AXIS_TEST_RECT__);
assert.ok(near(beforeRect.x,afterRect.x,.5)&&near(beforeRect.y,afterRect.y,.5)&&near(beforeRect.width,afterRect.width,.5)&&near(beforeRect.height,afterRect.height,.5),`weight adjustment shifted control geometry: ${JSON.stringify({beforeRect,afterRect})}`);

await page.locator('#axisSetControls [data-axis-input="weight"]').fill('27.5');
await page.locator('#axisSetControls [data-axis-input="weight"]').press('Enter');
await page.waitForTimeout(70);
assert.equal(Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText()),27.5,'direct weight input did not commit');
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'direct input rebuilt the active row');

const repsBefore=Number(await page.locator('#v8Sets .v8SetRow.active span b').nth(1).innerText());
await page.locator('#axisSetControls [data-axis-step="reps"][data-dir="1"]').click();
await page.waitForTimeout(70);
const repsAfter=Number(await page.locator('#v8Sets .v8SetRow.active span b').nth(1).innerText());
assert.equal(repsAfter,repsBefore+1,'rep stepper did not update exactly once');
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'rep adjustment rebuilt the active row');

const groupsBefore=await page.locator('#v8Sets .v8SetRow').count();
await page.locator('#v8Sets [data-cnt="1"]').click();
await page.waitForTimeout(100);
const groupsAfter=await page.locator('#v8Sets .v8SetRow').count();
assert.equal(groupsAfter,groupsBefore+1,'group count did not increase');
assert.equal(await page.locator('#axisSetControls').count(),1,'structural group change duplicated recording controls');

console.log('[AXIS convergence] active-session single adjustment entry');
await page.locator('#saveScan').click();
await page.waitForFunction(()=>!document.querySelector('#activeHome')?.classList.contains('hidden'),{timeout:2500});
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),{timeout:3000});
await page.waitForTimeout(180);
const adjustTexts=await page.locator('#v87Now button:visible').allInnerTexts();
const adjust=adjustTexts.map(x=>x.trim()).filter(x=>x==='调整'||x==='调整一次'||x.startsWith('调整'));
assert.equal(adjust.length,1,`active session must expose one adjustment entry, found ${JSON.stringify(adjust)}`);
assert.equal(await page.locator('#v879EditBtn:visible').count(),0,'retired v879 duplicate adjustment is visible');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS convergence] PASS');
await context.close();await browser.close();