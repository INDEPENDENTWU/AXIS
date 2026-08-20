import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8124_CUSTOM_SAFE__?.allCustomSearchable===true,undefined,{timeout:7000})};
const openPicker=async contextName=>{await page.evaluate(c=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.(c),contextName);await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'));await page.waitForTimeout(50)};
const search=async q=>{const input=page.locator('#eqSearch');await input.fill(q);await page.waitForFunction(v=>document.querySelector('#eqSearch')?.value===v&&document.querySelector('#v873SmartResults')?.classList.contains('show'),q,{timeout:2500});await page.waitForTimeout(80)};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'A-custom',start:t-60000,events:[]},profile:{customEq:[{id:'custom-never',name:'恢复测试动作',type:'cardio',pattern:'cardio',muscles:['核心'],effect:'核心',custom:true,recording:{version:1,metrics:['duration','level']}},{id:'custom-strength',name:'自定义测试推举',type:'strength',pattern:'push',muscles:['胸肌'],effect:'胸肌',custom:true,recording:{version:1,metrics:['weight','reps']}}],memories:[]},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}))},now);
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.4');

 console.log(`[AXIS custom ${ENGINE}] never-used My item is first-class searchable`);
 await openPicker('recording');await search('恢复测试动作');
 assert.equal(await page.locator('#v873SmartResults [data-v8124-pick="custom-never"]').count(),1,'never-used custom item missing from search');
 assert.match((await page.locator('#v873SmartResults').innerText()).replace(/\s+/g,' '),/我的/,'custom result is not labeled My');
 assert.equal(await page.locator('#v873SmartResults [data-axis-create-custom]').count(),0,'exact custom match incorrectly offers duplicate create');
 await page.locator('#eqSheet [data-close="eqSheet"]').click();await page.waitForFunction(()=>!document.querySelector('#eqSheet')?.classList.contains('show'));

 console.log(`[AXIS custom ${ENGINE}] no-match query opens one prefilled canonical custom editor`);
 const name='测试恢复档位动作';await openPicker('recording');await search(name);
 assert.equal(await page.locator('#v873SmartResults [data-axis-create-custom]').count(),1,'no-match direct create action missing');
 await tap(page.locator('#v873SmartResults [data-axis-create-custom]'));
 await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'));
 assert.equal(await page.locator('#customName').inputValue(),name,'typed query was not carried into custom editor');
 assert.equal(await page.locator('#axisCustomMetrics [data-axis-metric]').count(),5,'recording profile controls missing');
 await tap(page.locator('#axisCustomMetrics [data-axis-metric="duration"]'));
 await tap(page.locator('#axisCustomMetrics [data-axis-metric="level"]'));
 const muscle=page.locator('#customMuscles [data-muscle]').first();assert.ok(await muscle.count(),'custom muscle choices unavailable');await tap(muscle);
 await tap(page.locator('#saveCustomEq'));
 await page.waitForFunction(n=>!document.querySelector('#customEqSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()===n,name,{timeout:2500});
 await page.waitForTimeout(80);
 const created=await page.evaluate(n=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),x=(c.profile?.customEq||[]).find(e=>e.name===n);return x&&{id:x.id,type:x.type,metrics:x.recording?.metrics}},name);
 assert.ok(created?.id,'new custom identity was not saved');assert.equal(created.type,'cardio','time/level profile did not converge custom type to cardio');assert.deepEqual(new Set(created.metrics),new Set(['duration','level']),'time/level recording profile was not persisted');
 assert.equal(await page.locator('#strengthFields').evaluate(el=>el.classList.contains('hidden')),true,'strength fields leaked into time/level profile');
 assert.equal(await page.locator('#duration').evaluate(el=>el.closest('.numberControl')?.classList.contains('hidden')),false,'duration field hidden for time/level profile');
 assert.equal((await page.locator('#intensityChoices').evaluate(el=>el.closest('.choiceControl')?.querySelector(':scope>span')?.textContent?.trim())),'档位','level profile did not relabel intensity control as 档位');

 console.log(`[AXIS custom ${ENGINE}] canonical save persists profile semantics`);
 await page.locator('#duration').fill('18');
 const level=page.locator('#intensityChoices [data-choice="intensity"][data-value="7"],#intensityChoices [data-value="7"]').first();if(await level.count())await tap(level);
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:3000});await page.waitForTimeout(80);
 const saved=await page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),e=[...(c.active?.events||[])].reverse().find(x=>x.equipmentId===id);return e&&{duration:e.duration,intensity:e.intensity,level:e.level,metrics:e.recording?.metrics}},created.id);
 assert.equal(saved?.duration,18,'custom duration was not saved');assert.ok(Number.isFinite(Number(saved?.level)),'level alias was not persisted');assert.deepEqual(new Set(saved?.metrics||[]),new Set(['duration','level']),'saved event lost recording profile semantics');

 console.log(`[AXIS custom ${ENGINE}] created item survives reopen and Quick Record uses same picker/profile`);
 await openPicker('quick');await search(name);assert.equal(await page.locator(`#v873SmartResults [data-v8124-pick="${created.id}"]`).count(),1,'created custom item missing from Quick search');
 await tap(page.locator(`#v873SmartResults [data-v8124-pick="${created.id}"]`));
 await page.waitForFunction(n=>document.querySelector('#equipmentName')?.textContent?.trim()===n,name,{timeout:2500});await page.waitForTimeout(80);
 assert.equal((await page.locator('#intensityChoices').evaluate(el=>el.closest('.choiceControl')?.querySelector(':scope>span')?.textContent?.trim())),'档位','Quick selection did not reuse time/level profile');
 assert.equal(await page.locator('#strengthFields').evaluate(el=>el.classList.contains('hidden')),true,'Quick selection leaked strength fields');

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS custom ${ENGINE}] PASS · My search · no-match create · persisted profile · Camera/Quick parity`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
