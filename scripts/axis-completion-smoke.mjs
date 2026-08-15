import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({
 viewport:{width:430,height:932},locale:'zh-CN',permissions:['geolocation'],
 geolocation:{latitude:22.40582,longitude:113.54341,accuracy:18}
});
const page=await context.newPage();
await page.route('**/api/ai-status**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true,"enabled":false}'}));
await page.route('**/api/owner-config**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'}));
await page.route('**/api/analyze**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false,"disabled":true}'}));
await page.route('**/api/insight**',r=>r.fulfill({status:200,contentType:'application/json',body:'{"ok":false,"disabled":true}'}));
await page.route('https://nominatim.openstreetmap.org/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({
 name:'INDEPENDENT 健身中心',namedetails:{'name:zh':'独立健身中心'},
 address:{road:'情侣北路',house_number:'88号',suburb:'唐家湾',city_district:'香洲区',city:'珠海市'}
})}));
await page.route('https://api.bigdatacloud.net/**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({locality:'唐家湾',city:'珠海市',principalSubdivision:'广东省',localityInfo:{informative:[],administrative:[]}})}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const near=(a,b,t=1.5)=>Math.abs(a-b)<=t;

const res=await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000});assert.ok(res?.ok());
await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,{timeout:5000});
await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready',{timeout:9000});
await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready'&&window.__AXIS_8712_COMPLETION_READY__===true,{timeout:5000});
assert.equal((await page.locator('.versionLine').innerText()).trim(),'版本 8.7.12');

console.log('[AXIS convergence] exclusive inline settings');
await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),{timeout:1000});
await page.waitForFunction(()=>document.querySelectorAll('#settingsSheet .axisConfigGate').length===4,{timeout:1200});
assert.equal(await page.locator('#v8710Test,#v85Test,#v876Test,.v8710Test,.v85Test,.v876Test').count(),0,'sound audition button must be removed');
for(const [key,button,sheet] of [['profile','#profileBtn','#profileSheet'],['equipment','#myEqBtn','#myEqSheet'],['watermark','#watermarkBtn','#watermarkSheet'],['storage','#storageBtn','#storageSheet']]){
 await page.locator(button).click();
 await page.waitForTimeout(100);
 assert.equal(await page.locator(`#axisConfigGate-${key}.open`).count(),1,`${key} settings did not expand inline`);
 assert.equal(await page.locator('#settingsSheet .v8711SettingGate.open').count(),1,'settings accordion must keep exactly one section open');
 assert.equal(await page.locator(`${sheet}.axisInlineSheetWrap`).count(),1,`${sheet} was not portalled into settings`);
 assert.equal(await page.locator(`${sheet}.show`).count(),0,`${sheet} opened as an overlay instead of inline`);
 assert.equal(await page.locator(`${sheet} .axisBack`).count(),0,`${sheet} must not grow a nested-sheet back button while inline`);
 assert.equal(await page.locator(`${sheet}`).evaluate(el=>el.closest('#settingsSheet')!==null),true,`${sheet} is outside the settings owner`);
}

console.log('[AXIS convergence] watermark Chinese precise place');
await page.locator('#watermarkBtn').click();
await page.waitForTimeout(100);
assert.equal(await page.locator('#v8710WmControls,#v8710WmLang').count(),0,'watermark language configuration must be removed, not merely hidden');
assert.equal(await page.locator('#watermarkPreview #v8711Corners button[data-p]').count(),4,'exactly four visible watermark corner controls required');
const baseCorners=await page.locator('#watermarkPreview>button[data-pos]').evaluateAll(xs=>xs.map(x=>({opacity:getComputedStyle(x).opacity,pointer:getComputedStyle(x).pointerEvents})));
assert.ok(baseCorners.length===4,'base watermark hit targets missing');
assert.ok(baseCorners.every(x=>Number(x.opacity)===0&&x.pointer==='none'),`base corner visuals must be inert: ${JSON.stringify(baseCorners)}`);
if(await page.locator('#v876Locate').count()){
 await page.locator('#v876Locate').click();
 await page.waitForFunction(()=>/独立健身中心/.test(document.querySelector('#v876LocationName')?.textContent||''),{timeout:4500});
 const place=(await page.locator('#v876LocationName').innerText()).trim();
 assert.ok(place.includes('独立健身中心')&&place.includes('情侣北路88号'),`precise Chinese POI/road missing: ${place}`);
 assert.equal(await page.locator('#v8712PlaceCredit').innerText(),'地名 © OpenStreetMap contributors');
}

console.log('[AXIS convergence] report remains an output sheet and clips internally');
const parentScroll=await page.locator('#settingsSheet>.sheet').evaluate(el=>{el.scrollTop=Math.min(96,Math.max(0,el.scrollHeight-el.clientHeight));return el.scrollTop});
await page.locator('#reportBtn').click();
await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),{timeout:1500});
await page.waitForTimeout(180);
assert.equal(await page.locator('#reportSheet .axisBack').count(),1,'report output sheet requires one return control');
const header=await page.locator('#reportSheet .sheetHead').evaluate(head=>{
 const back=head.querySelector('.axisBack')?.getBoundingClientRect(),title=head.querySelector('b')?.getBoundingClientRect(),close=head.querySelector('.closeBtn')?.getBoundingClientRect();return{back,title,close};
});
assert.ok(header.back&&header.title&&header.close,'report header geometry incomplete');
assert.ok(near(header.back.width,44,.75)&&near(header.back.height,44,.75),'report return hit target must be 44×44');
assert.ok(near(header.back.y+header.back.height/2,header.close.y+header.close.height/2,1),'report header actions are not vertically aligned');
await page.waitForFunction(()=>document.querySelectorAll('#v8710ReportDeck .v8710Plate').length>=2,{timeout:1500});
const plates=await page.locator('#v8710ReportDeck .v8710Plate').evaluateAll(xs=>xs.map(p=>{
 const r=p.getBoundingClientRect(),children=[...p.children].map(x=>{const q=x.getBoundingClientRect();return{top:q.top,bottom:q.bottom,left:q.left,right:q.right,cls:x.className}});return{r:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},scrollH:p.scrollHeight,clientH:p.clientHeight,children};
}));
for(const p of plates){
 assert.ok(p.scrollH<=p.clientH+1,`report plate scroll overflow: ${JSON.stringify(p)}`);
 for(const c of p.children)assert.ok(c.top>=p.r.top-1&&c.bottom<=p.r.bottom+1&&c.left>=p.r.left-1&&c.right<=p.r.right+1,`report child escaped plate: ${JSON.stringify({plate:p.r,child:c})}`);
}
await page.locator('#reportSheet .axisBack').click();
await page.waitForTimeout(100);
assert.equal(await page.locator('#reportSheet.show').count(),0,'report return did not close output sheet');
assert.equal(await page.locator('#settingsSheet.show').count(),1,'report return did not restore settings');
const restored=await page.locator('#settingsSheet>.sheet').evaluate(el=>el.scrollTop);
assert.ok(Math.abs(restored-parentScroll)<=2,`settings scroll was not restored: ${parentScroll} -> ${restored}`);

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
assert.equal(await page.locator('#v8Sets .v8Adjust').evaluate(el=>getComputedStyle(el).display),'none','legacy adjust UI must be inert');
assert.ok(await page.locator('#v8Sets [data-cnt]').count()>=2,'group count controls missing');
assert.equal(await page.locator('#axisSetControls [data-axis-step="weight"]').count(),2,'weight stepper missing');
assert.equal(await page.locator('#axisSetControls [data-axis-step="reps"]').count(),2,'rep stepper missing');

const geometry=await page.locator('#axisSetControls').evaluate(box=>{
 const fields=[...box.querySelectorAll('.axisSetField')].map(x=>x.getBoundingClientRect()),steppers=[...box.querySelectorAll('.axisSetStepper')].map(x=>x.getBoundingClientRect()),values=[...box.querySelectorAll('.axisSetValue')].map(x=>x.getBoundingClientRect()),buttons=[...box.querySelectorAll('.axisSetStepper>button')].map(x=>x.getBoundingClientRect());return{fields,steppers,values,buttons};
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
assert.ok(after>before,`weight click route failed: ${before} -> ${after}`);
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'weight adjustment rebuilt the active row and can visibly flicker');
const afterRect=await page.locator('#axisSetControls').evaluate(el=>el.getBoundingClientRect().toJSON()),beforeRect=await page.evaluate(()=>window.__AXIS_TEST_RECT__);
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

while(await page.locator('#v8Sets .v8SetRow').count()<3){await page.locator('#v8Sets [data-cnt="1"]').click();await page.waitForTimeout(80)}
assert.equal(await page.locator('#axisSetControls').count(),1,'structural group change duplicated recording controls');
const rowGrid=await page.locator('#v8Sets .v8SetRow').evaluateAll(rs=>rs.slice(0,3).map(r=>{
 const rr=r.getBoundingClientRect(),cells=[r.querySelector(':scope>i'),...r.querySelectorAll(':scope>span'),r.querySelector(':scope>em')].map(x=>{const q=x.getBoundingClientRect();return{x:q.x+q.width/2,y:q.y+q.height/2,w:q.width,h:q.height}});return{row:{x:rr.x,y:rr.y,w:rr.width,h:rr.height},cells,bg:getComputedStyle(r).backgroundColor};
}));
assert.equal(rowGrid.length,3,'three-row geometry sample missing');
for(let col=0;col<4;col++){const x=rowGrid[0].cells[col].x;assert.ok(rowGrid.every(r=>near(r.cells[col].x,x,.75)),`set-row column ${col} drifts horizontally: ${JSON.stringify(rowGrid)}`)}
assert.ok(rowGrid.every(r=>r.cells.every(c=>near(c.y,r.row.y+r.row.h/2,1))),`set-row cells are not vertically centered: ${JSON.stringify(rowGrid)}`);
assert.ok(rowGrid.every(r=>near(r.row.w,rowGrid[0].row.w,.5)),'set-row backgrounds have inconsistent width');
assert.equal(await page.locator('#v8Sets').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'set editor has horizontal overflow');

console.log('[AXIS convergence] configurable group plan from first set');
const planEntry=page.locator('#v8Sets [data-v875-plan],#v8Sets [data-v874-plan]').first();
assert.ok(await planEntry.count(),'group plan entry missing');
await planEntry.click();
await page.waitForFunction(()=>document.querySelector('#v874PlanSheet')?.classList.contains('show'),{timeout:1500});
await page.waitForFunction(()=>document.querySelector('#v8712PlanBody'),{timeout:1500});
await page.locator('[data-v8712-mode="up"]').click();
await page.waitForFunction(()=>document.querySelector('[data-v8712-step-input="w"]'),{timeout:800});
const stepInput=page.locator('[data-v8712-step-input="w"]');
await stepInput.fill('3.5');await stepInput.blur();await page.waitForTimeout(80);
await page.locator('[data-v8712-count="3"]').click();await page.waitForTimeout(60);
const preview=await page.locator('.v8712PreviewRow b').allInnerTexts(),weights=preview.map(x=>Number.parseFloat(x));
assert.equal(weights.length,3,'group plan preview count mismatch');
assert.ok(near(weights[1]-weights[0],3.5,.01)&&near(weights[2]-weights[1],3.5,.01),`custom weight step did not drive preview: ${JSON.stringify(weights)}`);
await page.locator('#v8712Apply').click();
await page.waitForFunction(()=>!document.querySelector('#v874PlanSheet')?.classList.contains('show'),{timeout:1500});
await page.waitForTimeout(100);
const applied=await page.locator('#v8Sets .v8SetRow span:first-of-type b').allInnerTexts(),appliedW=applied.slice(0,3).map(Number);
assert.deepEqual(appliedW,weights,'group plan did not apply through the canonical recording draft');

console.log('[AXIS convergence] active-session single adjustment entry');
await page.locator('#saveScan').click();
await page.waitForFunction(()=>!document.querySelector('#activeHome')?.classList.contains('hidden'),{timeout:2500});
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),{timeout:3000});
await page.waitForTimeout(180);
const adjustTexts=await page.locator('#v87Now button:visible').allInnerTexts();
const adjust=adjustTexts.map(x=>x.trim()).filter(x=>x==='调整'||x=>x==='调整一次'||x.startsWith?.('调整'));
// Guard the semantic action directly because old labels varied across iterations.
const semanticAdjust=adjustTexts.map(x=>x.trim()).filter(x=>x==='调整'||x==='调整一次'||x.startsWith('调整'));
assert.equal(semanticAdjust.length,1,`active session must expose one adjustment entry, found ${JSON.stringify(semanticAdjust)}`);
assert.equal(await page.locator('#v879EditBtn:visible').count(),0,'retired v879 duplicate adjustment is visible');

assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS convergence] PASS');
await context.close();await browser.close();