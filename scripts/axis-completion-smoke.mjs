import assert from 'node:assert/strict';
import { chromium } from 'playwright-core';

const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']});
const context=await browser.newContext({viewport:{width:430,height:932},locale:'zh-CN',permissions:['geolocation'],geolocation:{latitude:22.40582,longitude:113.54341,accuracy:18}});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(obj)});
await page.route('**/api/ai-status**',r=>json(r,{ok:true,enabled:false}));
await page.route('**/api/owner-config**',r=>json(r,{ok:true}));
await page.route('**/api/analyze**',r=>json(r,{ok:false,disabled:true}));
await page.route('**/api/insight**',r=>json(r,{ok:false,disabled:true}));
await page.route('https://nominatim.openstreetmap.org/**',r=>json(r,{name:'INDEPENDENT 健身中心',namedetails:{'name:zh':'独立健身中心'},address:{road:'情侣北路',house_number:'88号',suburb:'唐家湾',city_district:'香洲区',city:'珠海市'}}));
await page.route('https://api.bigdatacloud.net/**',r=>json(r,{locality:'唐家湾',city:'珠海市',principalSubdivision:'广东省',localityInfo:{informative:[],administrative:[]}}));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const near=(a,b,t=1.5)=>Math.abs(a-b)<=t;
const waitReady=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,{timeout:5000});
 await page.waitForFunction(()=>window.__AXIS_FEATURE_KERNEL__?.state==='ready',{timeout:9000});
 await page.waitForFunction(()=>window.__AXIS_COMPLETION_KERNEL__?.state==='ready'&&window.__AXIS_8712_COMPLETION_READY__===true,{timeout:5000});
};

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:10000}))?.ok());
await waitReady();
assert.equal((await page.locator('.versionLine').innerText()).trim(),'版本 8.7.12');

console.log('[AXIS convergence] inline settings owner');
await page.locator('#settingsBtn').click();
await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),{timeout:1000});
await page.waitForFunction(()=>document.querySelectorAll('#settingsSheet .axisConfigGate').length===4,{timeout:1200});
assert.equal(await page.locator('#v8710Test,#v85Test,#v876Test,.v8710Test,.v85Test,.v876Test').count(),0,'sound audition UI must stay retired');
for(const [key,btn,sheet] of [['profile','#profileBtn','#profileSheet'],['equipment','#myEqBtn','#myEqSheet'],['watermark','#watermarkBtn','#watermarkSheet'],['storage','#storageBtn','#storageSheet']]){
 await page.locator(btn).click();await page.waitForTimeout(90);
 assert.equal(await page.locator(`#axisConfigGate-${key}.open`).count(),1,`${key} did not open inline`);
 assert.equal(await page.locator('#settingsSheet .v8711SettingGate.open').count(),1,'settings accordion exposed more than one section');
 assert.equal(await page.locator(`${sheet}.axisInlineSheetWrap`).count(),1,`${sheet} not portalled into settings`);
 assert.equal(await page.locator(`${sheet}.show`).count(),0,`${sheet} became an overlay`);
 assert.equal(await page.locator(`${sheet} .axisBack`).count(),0,`${sheet} gained a redundant back action`);
 assert.equal(await page.locator(sheet).evaluate(el=>!!el.closest('#settingsSheet')),true,`${sheet} escaped settings ownership`);
}

console.log('[AXIS convergence] Chinese precise watermark location');
await page.locator('#watermarkBtn').click();await page.waitForTimeout(90);
assert.equal(await page.locator('#v8710WmControls,#v8710WmLang').count(),0,'watermark language controls must not exist');
assert.equal(await page.locator('#watermarkPreview #v8711Corners button[data-p]').count(),4,'watermark must expose exactly four position hit targets');
const corners=await page.locator('#watermarkPreview>button[data-pos]').evaluateAll(xs=>xs.map(x=>({opacity:getComputedStyle(x).opacity,pointer:getComputedStyle(x).pointerEvents})));
assert.ok(corners.length===4&&corners.every(x=>Number(x.opacity)===0&&x.pointer==='none'),`legacy corner layer is active: ${JSON.stringify(corners)}`);
if(await page.locator('#v876Locate').count()){
 await page.locator('#v876Locate').click();
 await page.waitForFunction(()=>/独立健身中心/.test(document.querySelector('#v876LocationName')?.textContent||''),{timeout:4500});
 const place=(await page.locator('#v876LocationName').innerText()).trim();
 assert.ok(place.includes('独立健身中心')&&place.includes('情侣北路88号'),`precise Chinese POI/road missing: ${place}`);
 assert.equal((await page.locator('#v8712PlaceCredit').innerText()).trim(),'地名 © OpenStreetMap contributors');
}

console.log('[AXIS convergence] report containment + parent return');
await page.locator('#reportBtn').scrollIntoViewIfNeeded();
const parentScroll=await page.locator('#settingsSheet>.sheet').evaluate(el=>el.scrollTop);
await page.locator('#reportBtn').click();
await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),{timeout:1500});await page.waitForTimeout(160);
assert.equal(await page.locator('#reportSheet .axisBack').count(),1,'report output must have one parent-return action');
const hg=await page.locator('#reportSheet .sheetHead').evaluate(h=>{const r=x=>x?.getBoundingClientRect();return{back:r(h.querySelector('.axisBack')),close:r(h.querySelector('.closeBtn')),title:r(h.querySelector('b'))}});
assert.ok(hg.back&&hg.close&&hg.title&&near(hg.back.width,44,.75)&&near(hg.back.height,44,.75),'report header geometry is invalid');
assert.ok(near(hg.back.y+hg.back.height/2,hg.close.y+hg.close.height/2,1),'report header controls are not vertically aligned');
await page.waitForFunction(()=>document.querySelectorAll('#v8710ReportDeck .v8710Plate').length>=2,{timeout:1500});
const plates=await page.locator('#v8710ReportDeck .v8710Plate').evaluateAll(xs=>xs.map(p=>{const r=p.getBoundingClientRect();return{r:{top:r.top,bottom:r.bottom,left:r.left,right:r.right},scrollH:p.scrollHeight,clientH:p.clientHeight,children:[...p.children].map(x=>{const q=x.getBoundingClientRect();return{top:q.top,bottom:q.bottom,left:q.left,right:q.right,cls:x.className}})}}));
for(const p of plates){
 assert.ok(p.scrollH<=p.clientH+1,`report plate overflows vertically: ${JSON.stringify(p)}`);
 for(const c of p.children)assert.ok(c.top>=p.r.top-1&&c.bottom<=p.r.bottom+1&&c.left>=p.r.left-1&&c.right<=p.r.right+1,`report child escaped plate: ${JSON.stringify({plate:p.r,child:c})}`);
}
await page.locator('#reportSheet .axisBack').click();await page.waitForTimeout(90);
assert.equal(await page.locator('#reportSheet.show').count(),0,'report return failed');
assert.equal(await page.locator('#settingsSheet.show').count(),1,'settings parent was not restored');
assert.ok(Math.abs((await page.locator('#settingsSheet>.sheet').evaluate(el=>el.scrollTop))-parentScroll)<=2,'settings scroll was not restored');

console.log('[AXIS convergence] immutable recording geometry');
await page.reload({waitUntil:'domcontentloaded'});await waitReady();
assert.equal(await page.evaluate(()=>typeof window.__AXIS_RECORDING__?.adjust),'function','canonical recording API missing');
await page.locator('#quickRecordBtn').click();
await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&document.querySelectorAll('#v8Recent [data-qid]').length>0,{timeout:1200});
await page.locator('#v8Recent [data-qid]:visible').first().click();
await page.waitForFunction(()=>document.querySelector('#v8Sets .v8SetRow')&&document.querySelector('#axisSetControls'),{timeout:2200});
assert.equal(await page.locator('#axisSetControls').count(),1,'recording controls have multiple owners');
assert.equal(await page.locator('#v8Sets .v879Adjust,.v8712cStandalone').count(),0,'retired recording painter returned');
assert.equal(await page.locator('#v8Sets .v8Adjust').evaluate(el=>getComputedStyle(el).display),'none','legacy adjustment UI is active');

const controls=await page.locator('#axisSetControls').evaluate(box=>({fields:[...box.querySelectorAll('.axisSetField')].map(x=>x.getBoundingClientRect()),steppers:[...box.querySelectorAll('.axisSetStepper')].map(x=>x.getBoundingClientRect()),values:[...box.querySelectorAll('.axisSetValue')].map(x=>x.getBoundingClientRect()),buttons:[...box.querySelectorAll('.axisSetStepper>button')].map(x=>x.getBoundingClientRect())}));
assert.ok(near(controls.fields[0].width,controls.fields[1].width,1),'recording columns differ');
assert.ok(near(controls.steppers[0].height,controls.steppers[1].height,.5),'recording stepper heights differ');
assert.ok(near(controls.values[0].y+controls.values[0].height/2,controls.values[1].y+controls.values[1].height/2,1),'recording values are not aligned');
assert.ok(controls.buttons.every(b=>near(b.height,60,.75)),'recording tap targets are inconsistent');

const before=Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText());
await page.evaluate(()=>{window.__AXIS_TEST_ROW__=document.querySelector('#v8Sets .v8SetRow.active');window.__AXIS_TEST_RECT__=document.querySelector('#axisSetControls').getBoundingClientRect().toJSON()});
await page.locator('#axisSetControls [data-axis-step="weight"][data-dir="1"]').click();await page.waitForTimeout(80);
assert.ok(Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText())>before,'weight step did not change value');
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'weight step rebuilt the active row');
const br=await page.evaluate(()=>window.__AXIS_TEST_RECT__),ar=await page.locator('#axisSetControls').evaluate(el=>el.getBoundingClientRect().toJSON());
assert.ok(near(br.x,ar.x,.5)&&near(br.y,ar.y,.5)&&near(br.width,ar.width,.5)&&near(br.height,ar.height,.5),'weight step shifted control geometry');
await page.locator('#axisSetControls [data-axis-input="weight"]').fill('27.5');await page.locator('#axisSetControls [data-axis-input="weight"]').press('Enter');await page.waitForTimeout(60);
assert.equal(Number(await page.locator('#v8Sets .v8SetRow.active span b').first().innerText()),27.5,'direct weight input failed');
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'direct input rebuilt active row');
const rb=Number(await page.locator('#v8Sets .v8SetRow.active span b').nth(1).innerText());await page.locator('#axisSetControls [data-axis-step="reps"][data-dir="1"]').click();await page.waitForTimeout(60);
assert.equal(Number(await page.locator('#v8Sets .v8SetRow.active span b').nth(1).innerText()),rb+1,'rep step did not update exactly once');
assert.equal(await page.evaluate(()=>window.__AXIS_TEST_ROW__===document.querySelector('#v8Sets .v8SetRow.active')),true,'rep step rebuilt active row');

while(await page.locator('#v8Sets .v8SetRow').count()<3){await page.locator('#v8Sets [data-cnt="1"]').click();await page.waitForTimeout(70)}
assert.equal(await page.locator('#axisSetControls').count(),1,'group count duplicated recording controls');
const grid=await page.locator('#v8Sets .v8SetRow').evaluateAll(rs=>rs.slice(0,3).map(r=>{const rr=r.getBoundingClientRect(),els=[r.querySelector(':scope>i'),...r.querySelectorAll(':scope>span'),r.querySelector(':scope>em')];return{row:{x:rr.x,y:rr.y,w:rr.width,h:rr.height},cells:els.map(x=>{const q=x.getBoundingClientRect();return{x:q.x+q.width/2,y:q.y+q.height/2}})}}));
assert.equal(grid.length,3,'three-row geometry sample missing');
for(let col=0;col<4;col++){const x=grid[0].cells[col].x;assert.ok(grid.every(r=>near(r.cells[col].x,x,.75)),`set row column ${col} drifts horizontally`)}
assert.ok(grid.every(r=>r.cells.every(c=>near(c.y,r.row.y+r.row.h/2,1))),'set-row cells are not vertically centered');
assert.ok(grid.every(r=>near(r.row.w,grid[0].row.w,.5)),'set-row backgrounds have inconsistent width');
assert.equal(await page.locator('#v8Sets').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,'set editor has horizontal overflow');

console.log('[AXIS convergence] configurable group plan');
const planEntry=page.locator('#v8Sets [data-v875-plan],#v8Sets [data-v874-plan]').first();assert.ok(await planEntry.count(),'group plan entry missing');
await planEntry.click();await page.waitForFunction(()=>document.querySelector('#v874PlanSheet')?.classList.contains('show'),{timeout:1500});
await page.waitForFunction(()=>document.querySelector('#v8712PlanBody'),{timeout:1500});
await page.locator('[data-v8712-mode="up"]').click();await page.waitForFunction(()=>document.querySelector('[data-v8712-step-input="w"]'),{timeout:800});
const step=page.locator('[data-v8712-step-input="w"]');await step.fill('3.5');await step.blur();await page.waitForTimeout(60);await page.locator('[data-v8712-count="3"]').click();await page.waitForTimeout(50);
const planned=(await page.locator('.v8712PreviewRow b').allInnerTexts()).map(Number.parseFloat);
assert.equal(planned.length,3,'plan preview count mismatch');
assert.ok(near(planned[1]-planned[0],3.5,.01)&&near(planned[2]-planned[1],3.5,.01),`custom group-plan step failed: ${JSON.stringify(planned)}`);
await page.locator('#v8712Apply').click();await page.waitForFunction(()=>!document.querySelector('#v874PlanSheet')?.classList.contains('show'),{timeout:1500});await page.waitForTimeout(100);
const applied=(await page.locator('#v8Sets .v8SetRow span:first-of-type b').allInnerTexts()).slice(0,3).map(Number);
assert.deepEqual(applied,planned,'group plan did not apply to canonical recording draft');

console.log('[AXIS convergence] active-session single adjustment');
await page.locator('#saveScan').click();
await page.waitForFunction(()=>!document.querySelector('#activeHome')?.classList.contains('hidden'),{timeout:2500});
await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show'),{timeout:3000});await page.waitForTimeout(160);
const texts=(await page.locator('#v87Now button:visible').allInnerTexts()).map(x=>x.trim()),adjust=texts.filter(x=>x==='调整'||x==='调整一次'||x.startsWith('调整'));
assert.equal(adjust.length,1,`active session exposes duplicate adjustment actions: ${JSON.stringify(adjust)}`);
assert.equal(await page.locator('#v879EditBtn:visible').count(),0,'retired v879 adjustment is visible');
assert.deepEqual(errors,[],`uncaught page errors:\n${errors.join('\n')}`);
console.log('[AXIS convergence] PASS');
await context.close();await browser.close();