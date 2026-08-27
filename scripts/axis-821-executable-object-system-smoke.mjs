import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Object system ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const waitCore=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});await page.waitForFunction(()=>window.__AXIS_821_OBJECT_CAPABILITY_CONVERGENCE__?.customMetricTypes===9&&window.__AXIS_ACTIVE_RUNTIME__?.owner==='v87'&&window.__AXIS_QUICK_RECORD__?.openFor,undefined,{timeout:8000})};
const state=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const meta=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'));
const closeIfShown=async id=>{const sheet=page.locator(`#${id}`);if(await sheet.count()&&await sheet.evaluate(x=>x.classList.contains('show'))){const close=sheet.locator(`[data-close="${id}"],.closeBtn`).first();if(await close.count())await tap(close);await page.waitForTimeout(80)}};
const longPress=async(locator,ms)=>{const box=await locator.boundingBox();assert.ok(box,`long-press target missing ${await locator.getAttribute('id')}`);const init={pointerId:7,pointerType:'touch',isPrimary:true,button:0,buttons:1,clientX:box.x+box.width/2,clientY:box.y+box.height/2};await locator.dispatchEvent('pointerdown',init);await page.waitForTimeout(ms);await locator.dispatchEvent('pointerup',{...init,buttons:0}).catch(()=>{})};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S-821-OBJECT',start:t-120000,events:[]},profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},now);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();

 console.log(`[AXIS 8.21 Object system ${ENGINE}] real editor → 测试A → 坡度 + 速度`);
 await page.waitForFunction(()=>document.querySelector('#quickRecordBtn'));
 await tap(page.locator('#quickRecordBtn'));await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'));
 await tap(page.locator('#v8New'));await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'));
 await page.locator('#customName').fill('测试A');await page.waitForFunction(()=>document.querySelector('[data-axis821-property-open]'));
 await tap(page.locator('[data-axis821-property-open]'));await page.waitForFunction(()=>document.querySelector('#axis821MetricPickerSheet')?.classList.contains('show')&&document.querySelectorAll('#axis821MetricPickerBody [data-axis818-metric-choice]').length===14);
 const choices=page.locator('#axis821MetricPickerBody [data-axis818-metric-choice]');
 for(let i=0;i<await choices.count();i++){const b=choices.nth(i);if(await b.evaluate(x=>x.classList.contains('active')))await tap(b)}
 for(const key of ['incline','speed'])await tap(page.locator(`#axis821MetricPickerBody [data-axis818-metric-choice="${key}"]`));
 const selected=await page.locator('#axis821MetricPickerBody [data-axis818-metric-choice].active').evaluateAll(xs=>xs.map(x=>x.dataset.axis818MetricChoice));assert.deepEqual(selected,['speed','incline'].filter(k=>selected.includes(k)).sort((a,b)=>selected.indexOf(a)-selected.indexOf(b)),'unexpected property selection');
 assert.deepEqual(new Set(selected),new Set(['incline','speed']));
 await tap(page.locator('[data-axis821-property-close]'));await page.waitForFunction(()=>!document.querySelector('#axis821MetricPickerSheet')?.classList.contains('show'));
 const executionSummary=(await page.locator('[data-axis821-execution-open]').innerText()).replace(/\s+/g,' ');assert.match(executionSummary,/连续计时/,'auto execution did not resolve to timed');assert.match(executionSummary,/自动/);
 await tap(page.locator('#saveCustomEq'));await page.waitForFunction(()=>!document.querySelector('#customEqSheet')?.classList.contains('show'));
 await page.waitForTimeout(160);
 const custom=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return(c.profile?.customEq||[]).find(x=>x.name==='测试A')||null});assert.ok(custom?.id);assert.deepEqual(new Set((custom.metricSchema||[]).map(x=>x.key)),new Set(['incline','speed']));assert.equal(custom.executionMode,'auto');
 await closeIfShown('scanSheet');await closeIfShown('eqSheet');

 console.log(`[AXIS 8.21 Object system ${ENGINE}] physical Quick Record picker → exact schema controls`);
 await tap(page.locator('#quickRecordBtn'));await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'));
 await tap(page.locator('#v8Other'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'));
 await page.locator('#eqSearch').fill('测试A');await page.waitForTimeout(160);
 const pick=page.locator(`[data-v8124-pick="${custom.id}"],[data-eq="${custom.id}"]`).first();assert.ok(await pick.count(),'测试A missing from canonical picker');
 const pickerText=await page.locator('#eqSheet').innerText();assert.doesNotMatch(pickerText,/(^|\s)(strength|cardio|relative)(\s|$)/i,'raw enum leaked in picker');
 await tap(pick);await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&!document.querySelector('#reviewStage')?.classList.contains('hidden')&&document.querySelector('#axis818MetricRecorder')?.classList.contains('show'),undefined,{timeout:4000});
 await page.waitForFunction(()=>document.querySelectorAll('#axis818MetricRecorder [data-axis818-metric]').length===2);
 const keys=await page.locator('#axis818MetricRecorder [data-axis818-metric]').evaluateAll(xs=>xs.map(x=>x.dataset.axis818Metric).sort());assert.deepEqual(keys,['incline','speed']);
 assert.equal(await page.locator('#strengthFields').evaluate(x=>x.classList.contains('axis818LegacyMetricHidden')),true);assert.equal(await page.locator('#cardioFields').evaluate(x=>x.classList.contains('axis818LegacyMetricHidden')),true);
 const before=await page.evaluate(()=>{const speed=document.querySelector('[data-axis821-key="speed"]'),save=document.querySelector('#saveScan');return{speed: speed?.getBoundingClientRect().top,save:save?.getBoundingClientRect().top}});
 const inclinePreset=page.locator('[data-axis821-preset="incline"][data-value="8"]'),speedPreset=page.locator('[data-axis821-preset="speed"][data-value="12"]');assert.equal(await inclinePreset.count(),1,'incline preset missing');assert.equal(await speedPreset.count(),1,'speed preset missing');await tap(inclinePreset);await tap(speedPreset);
 assert.equal(await page.locator('[data-axis818-metric="incline"]').inputValue(),'8');assert.equal(await page.locator('[data-axis818-metric="speed"]').inputValue(),'12');
 const after=await page.evaluate(()=>{const speed=document.querySelector('[data-axis821-key="speed"]'),save=document.querySelector('#saveScan');return{speed:speed?.getBoundingClientRect().top,save:save?.getBoundingClientRect().top}});assert.ok(Math.abs(after.speed-before.speed)<=0.5,`speed control moved ${after.speed-before.speed}px`);assert.ok(Math.abs(after.save-before.save)<=0.5,`save control moved ${after.save-before.save}px`);
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===id);return e?.executionModeSnapshot==='timed'&&e?.metrics?.incline===8&&e?.metrics?.speed===12&&m.events?.[e.id]?.activity?.status==='active'&&document.querySelector('#v87Now')?.classList.contains('show')},custom.id,{timeout:6000});
 const fact=await page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===id);return{event:e,activity:m.events?.[e?.id]?.activity||null,nowName:document.querySelector('#v87Name')?.textContent?.trim(),timeline:document.querySelector('#eventList')?.innerText||''}},custom.id);
 assert.deepEqual(new Set(fact.event.metricSchemaSnapshot.map(x=>x.key)),new Set(['incline','speed']));assert.deepEqual(fact.event.metrics,{incline:8,speed:12});assert.equal(fact.event.executionModeSnapshot,'timed');assert.equal(fact.activity.status,'active');assert.equal(fact.nowName,'测试A');assert.match(fact.timeline,/坡度\s*8\s*%/);assert.match(fact.timeline,/速度\s*12\s*km\/h/);assert.doesNotMatch(fact.timeline,/undefined|NaN|0kg/i);
 const eventId=fact.event.id;

 console.log(`[AXIS 8.21 Object system ${ENGINE}] existing Active pause/resume → individual long-hold finish`);
 await tap(page.locator('#v87Toggle'));await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='paused',eventId);
 await tap(page.locator('#v87Toggle'));await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='active',eventId);
 await longPress(page.locator('#v87Finish'),1700);await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='finished',eventId,{timeout:3500});
 assert.ok((await state()).active,'individual finish incorrectly ended Session');

 console.log(`[AXIS 8.21 Object system ${ENGINE}] session finish → schema-aware History`);
 await longPress(page.locator('#finishHold'),1200);await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return !c.active&&(c.sessions||[]).some(s=>(s.events||[]).some(e=>e.name==='测试A'))},undefined,{timeout:3500});
 if(await page.locator('#finishDone').isVisible().catch(()=>false))await tap(page.locator('#finishDone'));
 await tap(page.locator('.nav button[data-view="historyView"]'));await page.waitForFunction(()=>document.querySelector('#historyView')?.classList.contains('active')&&document.querySelector('#historyList .history'));
 await tap(page.locator('#historyList .history').first());await page.waitForFunction(()=>document.querySelector('#detailSheet')?.classList.contains('show'));
 let detailText=await page.locator('#detail').innerText();assert.match(detailText,/坡度\s*8\s*%/);assert.match(detailText,/速度\s*12\s*km\/h/);assert.doesNotMatch(detailText,/undefined|NaN|0kg/i);assert.doesNotMatch(detailText,/重量.*测试A|测试A.*重量/i);
 const eventRow=page.locator(`#detail [data-event="${eventId}"]`);assert.equal(await eventRow.count(),1,'archived event row missing');await tap(eventRow);await page.waitForTimeout(120);detailText=await page.locator('#detail').innerText();assert.match(detailText,/坡度\s*8\s*%/);assert.match(detailText,/速度\s*12\s*km\/h/);assert.doesNotMatch(detailText,/undefined|NaN|重量|次数|组数/i);
 await closeIfShown('detailSheet');

 console.log(`[AXIS 8.21 Object system ${ENGINE}] representative control families`);
 const familyObjects=[
  ['family-number','阻力测试',{key:'resistance',label:'阻力 / 档位',type:'number',unit:'',step:1},'stepper'],
  ['family-count','组数测试',{key:'sets',label:'组数',type:'count',unit:'组',step:1},'stepper'],
  ['family-duration','时间测试',{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1},'timer'],
  ['family-hold','保持测试',{key:'hold',label:'保持时间',type:'duration',unit:'秒',step:5},'timer'],
  ['family-distance','距离测试',{key:'distance',label:'距离',type:'distance',unit:'km',step:.1},'stepper'],
  ['family-pace','配速测试',{key:'pace',label:'配速',type:'pace',unit:'min/km',step:1},'pace'],
  ['family-percent','百分比测试',{key:'incline',label:'坡度',type:'percentage',unit:'%',step:.5},'stepper'],
  ['family-rating','感受测试',{key:'rating',label:'感受',type:'rating',unit:'/10',step:1,min:1,max:10},'rating'],
  ['family-boolean','完成测试',{key:'completed',label:'完成',type:'boolean',unit:'',step:1},'toggle'],
  ['family-choice','场地测试',{key:'custom_surface',label:'场地',type:'choice',unit:'',step:1,custom:true,options:[{value:'road',label:'公路'},{value:'trail',label:'越野'}],extensions:{axis:{executionHint:'context'}}},'choice']
 ];
 await page.evaluate(xs=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');c.active={id:'S-821-FAMILIES',start:Date.now()-30000,events:[]};c.profile=c.profile||{};c.profile.customEq=c.profile.customEq||[];for(const [id,name,metric] of xs)c.profile.customEq.push({id,name,type:'strength',pattern:'core',muscles:[],custom:true,metricSchema:[metric],metricSchemaVersion:'8.21',executionMode:'auto',recording:{version:2,metrics:[metric.key],executionMode:'auto'}});localStorage.setItem('axis_v60_state',JSON.stringify(c));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},familyObjects.map(x=>x.slice(0,3)));
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();
 for(const [id,name,metric,kind] of familyObjects){
  await page.evaluate(x=>window.__AXIS_QUICK_RECORD__.openFor(x),id);await page.waitForFunction(([n,k])=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()===n&&document.querySelector(`#axis818MetricRecorder [data-axis821-kind="${k}"]`),[name,kind],{timeout:4000});
  const inputs=await page.locator('#axis818MetricRecorder [data-axis818-metric]').evaluateAll(xs=>xs.map(x=>x.dataset.axis818Metric));assert.deepEqual(inputs,[metric.key],`${name} leaked another metric control`);
  const control=page.locator(`#axis818MetricRecorder [data-axis821-kind="${kind}"]`);const box=await control.boundingBox();assert.ok(box&&box.width<=390&&box.height>40,`${name} invalid mobile control geometry`);
  if(kind==='choice'){assert.equal(await control.locator('[data-axis821-choice]').count(),2);await tap(control.locator('[data-axis821-choice][data-value="trail"]'));assert.equal(await control.locator('[data-axis818-metric]').inputValue(),'trail')}
  if(kind==='rating')assert.ok(await control.locator('input[data-axis818-metric]').isVisible(),'rating direct value owner is not visible');
  await closeIfShown('scanSheet');
 }

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Object system ${ENGINE}] PASS · real 测试A slope+speed lifecycle · timed v82/v87 Active · individual + Session finish · immutable schema History · 10 representative control surfaces · no raw enum/undefined · ≤0.5px value-change geometry`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
