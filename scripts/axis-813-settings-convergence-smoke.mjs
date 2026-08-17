import assert from 'node:assert/strict';
import fs from 'node:fs';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const EXPECTED=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const errors=[];const serviceRequests=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('request',r=>{if(/\/api\/(cloud-status|ai-capabilities)/.test(r.url()))serviceRequests.push(r.url())});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [
 ['**/api/ai-status**',{available:false,vision:false,insight:false,version:'axis-ai-v4'}],
 ['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false,error:'not_available'}],['**/api/insight**',{available:false,error:'not_available'}],
 ['**/api/cloud-status**',{cloud:{configured:true,enabled:true}}],
 ['**/api/ai-capabilities**',{ai:{enabled:true,capabilities:{vision:true,insight:true,voice:true,pronunciation:true,dialogue:true}}}],
 ['**/nominatim.openstreetmap.org/reverse**',{name:'测试健身房',address:{road:'测试路',city:'测试市'}}]
])await page.route(pattern,r=>json(r,obj));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:7000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_813_SETTINGS__?.owner==='canonical-settings-inline',undefined,{timeout:4000})};
const trainingStores=()=>page.evaluate(()=>[localStorage.getItem('axis_v60_state'),localStorage.getItem('axis_v8_meta')]);
const shownSheets=()=>page.locator('.sheetWrap.show').count();

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);assert.equal(EXPECTED,'8.12');
 const diag=await page.evaluate(()=>window.__AXIS_813_SETTINGS__);
 assert.deepEqual({learningInline:diag.learningInline,serviceInline:diag.serviceInline,separateLearningSheet:diag.separateLearningSheet,separateServiceSheet:diag.separateServiceSheet,trainingOwner:diag.trainingOwner},{learningInline:true,serviceInline:true,separateLearningSheet:false,separateServiceSheet:false,trainingOwner:false});
 assert.equal(serviceRequests.length,0,'Cloud/AI status network ran before explicit user expansion');

 console.log(`[AXIS settings ${ENGINE}] canonical Settings owns both expandable sections`);
 await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 assert.equal(await shownSheets(),1,'opening Settings created an unexpected second sheet');
 assert.equal(await page.locator('#v813LearningGate').count(),1);assert.equal(await page.locator('#v813ServiceGate').count(),1);
 assert.equal(await page.locator('#v810ConfigPanel.v810ConfigPanel').count(),0,'legacy fixed learning panel still owns UI');
 assert.equal(await page.locator('#v811ServicePanel.v811ServicePanel').count(),0,'legacy fixed service panel still owns UI');
 assert.equal(await page.locator('.v810ConfigHead,.v811ServiceHead').count(),0,'nested sheet headers remain visible');
 const before=await trainingStores();

 console.log(`[AXIS settings ${ENGINE}] Learning Schedule expands in place and stays compact`);
 await page.locator('#v810ConfigEntry').click();
 await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 assert.equal(await shownSheets(),1,'Learning Schedule opened a second sheet');
 const learningPosition=await page.locator('#v810ConfigPanel').evaluate(el=>getComputedStyle(el).position);assert.notEqual(learningPosition,'fixed');
 const learningRowHeight=await page.locator('#v810ConfigEntry').evaluate(el=>el.getBoundingClientRect().height);assert.ok(learningRowHeight<=56,`learning row is not converged: ${learningRowHeight}`);
 const coreButtonHeight=await page.locator('#v811CoreLearning button').first().evaluate(el=>el.getBoundingClientRect().height);assert.ok(coreButtonHeight<=34,`learning options remain oversized: ${coreButtonHeight}`);
 assert.ok(await page.locator('[data-v812-core="purpose"]').count()>=6,'8.12 learning purpose controls disappeared');
 assert.ok(await page.locator('[data-v812-core="method"]').count()>=6,'8.12 learning method controls disappeared');
 await page.locator('[data-v812-core="purpose"][data-v812-value="native"]').click();
 await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v89_speak')||'{}').prefs?.purpose==='native');
 assert.deepEqual(await trainingStores(),before,'learning preference changed authoritative training storage');
 assert.match(await page.locator('#v810ConfigSummary').innerText(),/母语口语/);
 await page.locator('#v810ConfigEntry').click();await page.waitForFunction(()=>!document.querySelector('#v813LearningGate')?.classList.contains('open'));

 console.log(`[AXIS settings ${ENGINE}] Cloud + AI expands in place; network remains user-invoked`);
 assert.equal(serviceRequests.length,0,'service status loaded before Cloud/AI row was opened');
 await page.locator('#v811ServiceEntry').click();await page.waitForFunction(()=>document.querySelector('#v813ServiceGate')?.classList.contains('open'));
 assert.equal(await shownSheets(),1,'Cloud + AI opened a second sheet');
 const servicePosition=await page.locator('#v811ServicePanel').evaluate(el=>getComputedStyle(el).position);assert.notEqual(servicePosition,'fixed');
 const serviceRowHeight=await page.locator('#v811ServiceEntry').evaluate(el=>el.getBoundingClientRect().height);assert.ok(serviceRowHeight<=56,`service row is not converged: ${serviceRowHeight}`);
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-v811-cloud="data"],[data-v811-ai="assist"]')].every(x=>!x.disabled),undefined,{timeout:3000});
 assert.equal(serviceRequests.length,2,'Cloud/AI explicit expansion did not perform exactly the two status reads');
 const serviceButtonHeight=await page.locator('[data-v811-cloud="off"]').evaluate(el=>el.getBoundingClientRect().height);assert.ok(serviceButtonHeight<=34,`service options remain oversized: ${serviceButtonHeight}`);
 await page.locator('[data-v811-cloud="data"]').click();await page.locator('[data-v811-ai="assist"]').click();
 await page.waitForFunction(()=>{const p=JSON.parse(localStorage.getItem('axis_v811_services')||'{}');return p.cloudMode==='data'&&p.aiMode==='assist'});
 assert.deepEqual(await trainingStores(),before,'Cloud/AI preference changed authoritative training storage');
 assert.match(await page.locator('#v811ServiceSummary').innerText(),/已同步|AI/);
 assert.equal(await page.locator('#v813ServiceGate .v813ServiceDetails').count(),2,'progressive capability/privacy disclosure missing');
 await page.locator('#v811ServiceEntry').click();await page.waitForFunction(()=>!document.querySelector('#v813ServiceGate')?.classList.contains('open'));
 assert.equal(await shownSheets(),1,'collapsing inline service changed sheet ownership');

 console.log(`[AXIS settings ${ENGINE}] persistence + reopen keep one Settings surface`);
 await page.locator('[data-close="settingsSheet"]').click();await page.locator('#settingsBtn').click();await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 assert.equal(await shownSheets(),1);assert.equal(await page.locator('#v813LearningGate').count(),1);assert.equal(await page.locator('#v813ServiceGate').count(),1);
 const persisted=await page.evaluate(()=>({learning:JSON.parse(localStorage.getItem('axis_v89_speak')||'{}').prefs?.purpose,service:JSON.parse(localStorage.getItem('axis_v811_services')||'null')}));
 assert.equal(persisted.learning,'native');assert.equal(persisted.service?.cloudMode,'data');assert.equal(persisted.service?.aiMode,'assist');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS settings ${ENGINE}] PASS · one Settings sheet · inline Learning + Cloud/AI · compact controls · preserved stores/ownership · explicit service network`);
}finally{
 await context.close().catch(()=>{});await browser.close().catch(()=>{});
}
