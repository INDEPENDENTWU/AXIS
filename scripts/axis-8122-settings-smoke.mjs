import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];const statusRequests=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('request',r=>{if(/\/api\/(cloud-status|ai-capabilities)/.test(r.url()))statusRequests.push(r.url())});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:true,enabled:true}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:true,capabilities:{vision:true,insight:true,voice:true,dialogue:true}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:8000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:10000});await page.waitForFunction(()=>window.__AXIS_8122_SETTINGS__?.version==='8.12.2',undefined,{timeout:4000})};
const gridCheck=async(sel,cols)=>{const x=await page.locator(sel).evaluate(el=>{const cs=getComputedStyle(el),bs=[...el.querySelectorAll('button')].filter(b=>getComputedStyle(b).display!=='none'),rects=bs.map(b=>b.getBoundingClientRect());return{columns:cs.gridTemplateColumns.trim().split(/\s+/).filter(Boolean).length,widths:rects.map(r=>r.width),heights:rects.map(r=>r.height),overflow:bs.map(b=>b.scrollWidth-b.clientWidth)}});assert.equal(x.columns,cols,`${sel} columns`);assert.ok(Math.max(...x.widths)-Math.min(...x.widths)<=1.5,`${sel} widths drift`);assert.ok(x.heights.every(h=>h>=42&&h<=46),`${sel} touch height`);assert.ok(x.overflow.every(v=>v<=1),`${sel} text clipped`)};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.2');
 assert.equal(await page.evaluate(()=>window.__AXIS_8122_SETTINGS__?.trainingOwner),false);
 const before=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta')}));

 console.log(`[AXIS 8.12.2 ${ENGINE}] Learning fine-tune`);
 await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
 assert.equal((await page.locator('#v811ServiceEntry>span').textContent()).trim(),'云端与AI');
 for(const sel of ['#v813LearningGate>.settingLink','#v813ServiceGate>.settingLink'])assert.equal(await page.locator(sel).evaluate(el=>getComputedStyle(el).borderBottomWidth),'0px');
 assert.equal(statusRequests.length,0,'service status network started before Cloud/AI opened');
 await tap(page.locator('#v810ConfigEntry'));await page.waitForFunction(()=>document.querySelector('#v813LearningGate')?.classList.contains('open'));
 await tap(page.locator('#v811FineTune>summary'));await page.waitForFunction(()=>document.querySelector('#v811FineTune')?.open===true);
 const keys=await page.locator('#v811FineTuneBody>[data-v8122-fine]').evaluateAll(es=>es.map(e=>e.dataset.v8122Fine));
 assert.deepEqual(keys,['novelty','track','cadence','dailyTarget','opportunity','standalone']);
 assert.equal(await page.locator('#v811FineTuneBody>.v810SpeakBlock').count(),0,'legacy duplicated fine-tune controls visible');
 await gridCheck('[data-v8122-fine="novelty"] .axis8122Grid',3);
 await gridCheck('[data-v8122-fine="track"] .axis8122Grid',2);
 await gridCheck('[data-v8122-fine="cadence"] .axis8122Grid',3);
 await gridCheck('[data-v8122-fine="dailyTarget"] .axis8122Grid',2);
 await gridCheck('[data-v8122-fine="opportunity"] .axis8122Grid',3);
 await gridCheck('[data-v8122-fine="standalone"] .axis8122Grid',3);
 for(const [k,v] of [['novelty','review'],['track','gym'],['cadence','long'],['dailyTarget','12'],['opportunity','pause'],['standalone','manual']]){await tap(page.locator(`[data-v8122-learning="${k}"][data-v8122-value="${v}"]`));await page.waitForTimeout(30)}
 const lp=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v89_speak')||'{}').prefs||{});
 assert.equal(lp.novelty,'review');assert.equal(lp.track,'gym');assert.equal(lp.cadence,'long');assert.equal(Number(lp.dailyTarget),12);assert.equal(lp.opportunity,'pause');assert.equal(lp.standalone,'manual');

 console.log(`[AXIS 8.12.2 ${ENGINE}] Cloud/AI four-group surface`);
 await tap(page.locator('#v811ServiceEntry'));await page.waitForFunction(()=>document.querySelector('#v813ServiceGate')?.classList.contains('open'));
 await page.waitForFunction(()=>document.querySelectorAll('#v811AIFacts .axis8122Fact').length===4,undefined,{timeout:3000});
 assert.equal(await page.locator('#v813ServiceGate .axis8122Group').count(),4);
 assert.equal(await page.locator('#v811AIFacts .axis8122Fact').count(),4);
 await gridCheck('#v811CloudMode',3);await gridCheck('#v811AIMode',3);await gridCheck('#v8122Scope',3);
 assert.equal(await page.locator('#v811PrivacyRows').isVisible(),false,'legacy privacy rows leaked into primary UI');
 assert.ok(statusRequests.length===2,`expected two explicit service status requests, got ${statusRequests.length}`);
 await tap(page.locator('[data-v811-cloud="data"]'));await tap(page.locator('[data-v811-ai="assist"]'));await tap(page.locator('[data-v8122-scope="balanced"]'));
 const sp=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v811_services')||'{}'));
 assert.equal(sp.cloudMode,'data');assert.equal(sp.aiMode,'assist');assert.deepEqual(sp.privacy,{text:true,training:true,image:false,audio:false});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth)<=1,'horizontal Settings overflow');
 assert.equal(await page.locator('.sheetWrap.show').count(),1,'nested Settings sheet returned');
 const after=await page.evaluate(()=>({core:localStorage.getItem('axis_v60_state'),meta:localStorage.getItem('axis_v8_meta')}));
 assert.deepEqual(after,before,'Settings redesign touched training stores');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.12.2 ${ENGINE}] PASS · reduced fine-tune · four-group Cloud/AI · no clipping · training stores untouched`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
