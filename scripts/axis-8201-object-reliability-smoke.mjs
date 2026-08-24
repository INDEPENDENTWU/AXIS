import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.20.1 ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const waitCore=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});await page.waitForFunction(()=>window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20'&&window.__AXIS_8201_OBJECT_SYNC__?.liveSchema===true,undefined,{timeout:8000})};
const openPicker=async()=>{await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});await page.waitForTimeout(100)};
const search=async q=>{const input=page.locator('#eqSearch');await input.fill(q);await page.waitForFunction(v=>document.querySelector('#eqSearch')?.value===v&&document.querySelector('#v873SmartResults')?.classList.contains('show'),q,{timeout:2500});await page.waitForTimeout(100)};
const createFromSearch=async(name,{allowManualName=false}={})=>{await openPicker();await search(name);const create=page.locator('#v873SmartResults [data-axis-create-custom]');assert.equal(await create.count(),1,`direct create missing for ${name}`);await tap(create);await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:2500});const input=page.locator('#customName'),seed=await input.inputValue();if(seed!==name){assert.equal(allowManualName&&seed==='',true,`unexpected custom-name seed for ${name}: ${seed}`);await input.fill(name);assert.equal(await input.inputValue(),name)}await page.waitForFunction(()=>document.querySelectorAll('#axis818MetricEditor [data-axis818-metric-choice]').length>=9,undefined,{timeout:2500})};
const keepOnly=async key=>{const choices=page.locator('#axis818MetricEditor [data-axis818-metric-choice]');const target=choices.filter({has:page.locator(`[data-axis818-metric-choice="${key}"]`)});void target;const btn=page.locator(`#axis818MetricEditor [data-axis818-metric-choice="${key}"]`);if(!(await btn.evaluate(x=>x.classList.contains('active'))))await tap(btn);for(const k of ['weight','reps','sets','duration','intensity','distance','resistance','pace','hold']){if(k===key)continue;const b=page.locator(`#axis818MetricEditor [data-axis818-metric-choice="${k}"]`);if(await b.count()&&await b.evaluate(x=>x.classList.contains('active')))await tap(b)}await page.waitForFunction(k=>{const xs=[...document.querySelectorAll('#axis818MetricEditor [data-axis818-metric-choice].active')].map(x=>x.dataset.axis818MetricChoice);return xs.length===1&&xs[0]===k},key,{timeout:1500})};
const saveCustom=async name=>{await tap(page.locator('#saveCustomEq'));await page.waitForFunction(n=>!document.querySelector('#customEqSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()===n,name,{timeout:3000});await page.waitForTimeout(80);return await page.evaluate(n=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');const x=(c.profile?.customEq||[]).find(e=>e.name===n);return x&&{id:x.id,type:x.type,metricSchema:x.metricSchema,recording:x.recording}},name)};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const t=Date.now();
 await page.evaluate(now=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S-8201',start:now-60000,events:[]},profile:{customEq:[{id:'enum-strength',name:'枚举力量测试',type:'strength',pattern:'core',muscles:[],effect:'',custom:true},{id:'enum-cardio',name:'枚举有氧测试',type:'cardio',pattern:'cardio',muscles:[],effect:'',custom:true}],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},t);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.20');
 const manifest=await (await page.request.get(`${BASE}/axis-build.json`)).json();
 for(const g of ['executableObjectLiveSchemaSync8201','activeLifecycleExecutionMode8201','activeLifecycleSingleCompleteNoFalseActive8201','customEnumLocalized8201'])assert.equal(manifest.gates?.[g],true,`missing ${g}`);

 console.log(`[AXIS 8.20.1 ${ENGINE}] physical custom editor -> pace-only Object -> immediate Quick Record`);
 await createFromSearch('测试测试');await keepOnly('pace');
 const pace=await saveCustom('测试测试');assert.ok(pace?.id);assert.deepEqual(pace.metricSchema.map(x=>x.key),['pace']);assert.deepEqual(pace.recording?.metrics,['pace']);
 const live=await page.evaluate(id=>({explicit:window.__AXIS_OBJECT_TRUTH__.explicit(id),schema:window.__AXIS_OBJECT_TRUTH__.schemaForEq(id).map(x=>x.key)}),pace.id);
 assert.equal(live.explicit,true,'new schema did not enter live Object Truth');assert.deepEqual(live.schema,['pace']);
 await page.waitForFunction(()=>document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelector('[data-axis818-metric="pace"]'),undefined,{timeout:2500});
 assert.equal(await page.locator('#strengthFields').evaluate(x=>x.classList.contains('axis818LegacyMetricHidden')),true,'legacy strength recorder leaked beside pace schema');
 assert.equal(await page.locator('#cardioFields').evaluate(x=>x.classList.contains('axis818LegacyMetricHidden')),true,'legacy cardio recorder leaked beside pace schema');
 await page.locator('[data-axis818-metric="pace"]').fill('5:40 / km');await tap(page.locator('#saveScan'));
 await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId===id)},pace.id,{timeout:3500});
 await page.waitForTimeout(180);
 const paceSaved=await page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}');const e=(c.active?.events||[]).find(x=>x.equipmentId===id);return{schema:e?.metricSchemaSnapshot?.map(x=>x.key),mode:e?.executionModeSnapshot,pace:e?.metrics?.pace,activity:m.events?.[e?.id]?.activity||null}},pace.id);
 assert.deepEqual(paceSaved.schema,['pace']);assert.equal(paceSaved.mode,'single');assert.equal(paceSaved.pace,'5:40 / km');assert.equal(paceSaved.activity,null,'single pace record created a false persistent Active lifecycle');

 console.log(`[AXIS 8.20.1 ${ENGINE}] duration Object -> Quick Record -> polished ongoing Active UI`);
 await createFromSearch('靠墙站立',{allowManualName:true});await keepOnly('duration');
 const wall=await saveCustom('靠墙站立');assert.ok(wall?.id);assert.deepEqual(wall.metricSchema.map(x=>x.key),['duration']);
 await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="duration"]'),undefined,{timeout:2000});await page.locator('[data-axis818-metric="duration"]').fill('3');await tap(page.locator('#saveScan'));
 await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===id);return e?.executionModeSnapshot==='timed'&&m.events?.[e.id]?.activity?.status==='active'&&document.querySelector('#v87Now')?.classList.contains('show')},wall.id,{timeout:5000});
 const active=await page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===id),a=m.events?.[e?.id]?.activity;return{name:document.querySelector('#v87Name')?.textContent?.trim(),mode:e?.executionModeSnapshot,status:a?.status,estimateMs:a?.estimateMs,primary:getComputedStyle(document.querySelector('#v87Primary')).display,add:getComputedStyle(document.querySelector('#v87Add')).display,toggle:getComputedStyle(document.querySelector('#v87Toggle')).display,finish:getComputedStyle(document.querySelector('#v87Finish')).display}},wall.id);
 assert.equal(active.name,'靠墙站立');assert.equal(active.mode,'timed');assert.equal(active.status,'active');assert.equal(active.estimateMs,180000);assert.equal(active.primary,'none','timed Active incorrectly exposed 完成一组');assert.equal(active.add,'none','timed Active incorrectly exposed ＋一组');assert.notEqual(active.toggle,'none');assert.notEqual(active.finish,'none');

 console.log(`[AXIS 8.20.1 ${ENGINE}] internal type enums stay internal in Chinese picker`);
 await openPicker();await search('枚举');await page.waitForTimeout(120);
 const raw=await page.locator('#eqSheet span,#eqSheet small').evaluateAll(xs=>xs.map(x=>(x.textContent||'').trim()).filter(x=>x==='strength'||x==='cardio'));
 assert.deepEqual(raw,[],'raw strength/cardio enum leaked into Chinese picker');

 /* Classic fallback remains intact: one legacy strength Event still starts set Active. */
 await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');c.profile.customEq.push({id:'legacy-classic',name:'经典组训练',type:'strength',pattern:'push',muscles:['胸肌'],effect:'胸肌',custom:true});localStorage.setItem('axis_v60_state',JSON.stringify(c))});
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();await openPicker();await search('经典组训练');const pick=page.locator('[data-v8124-pick="legacy-classic"],[data-eq="legacy-classic"]').first();assert.ok(await pick.count());await tap(pick);await page.waitForFunction(()=>document.querySelector('#equipmentName')?.textContent?.trim()==='经典组训练');await tap(page.locator('#saveScan'));await page.waitForFunction(()=>document.querySelector('#v87Now')?.classList.contains('show')&&document.querySelector('#v87Primary')?.textContent?.includes('完成一组'),undefined,{timeout:5000});

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.20.1 ${ENGINE}] PASS · physical editor live schema · pace-only recorder · timed Active lifecycle · set UI authority · Chinese enum presentation · classic fallback`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
