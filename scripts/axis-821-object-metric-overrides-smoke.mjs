import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Object overrides ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const waitReady=async()=>{
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
  await page.waitForFunction(()=>window.__AXIS_821_OBJECT_METRIC_OVERRIDES__?.newPersistence===false&&window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&Array.isArray(window.__AXIS_873_LIBRARY__)&&window.__AXIS_873_LIBRARY__.length>20,undefined,{timeout:10000});
};
const closeIfShown=async id=>{const sheet=page.locator('#'+id);if(await sheet.count()&&await sheet.evaluate(x=>x.classList.contains('show'))){await tap(sheet.locator('[data-close="'+id+'"]'));await page.waitForFunction(x=>!document.querySelector('#'+x)?.classList.contains('show'),id,{timeout:1500})}};
const openQuick=async id=>{
  await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick'));
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});
  const input=page.locator('#eqSearch');await input.fill(id==='treadmill'?'跑步机':id);
  await page.waitForFunction(()=>document.querySelector('#v873SmartResults')?.classList.contains('show'),undefined,{timeout:2500});
  const row=page.locator(`#v873SmartResults [data-v8124-pick="${id}"]`).first();assert.equal(await row.count(),1,`picker result missing for ${id}`);await tap(row);
  await page.waitForFunction(x=>document.querySelector('#equipmentName')?.textContent?.trim()&&document.querySelector('#axis818MetricRecorder'),id,{timeout:3000});
};

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const now=Date.now();
  await page.evaluate(t=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S-821-OVERRIDE',start:t-60000,events:[]},flows:[],flowRun:null,profile:{customEq:[{id:'custom-override-proof',name:'自定义证明',type:'strength',custom:true,metricSchema:[{key:'weight',label:'重量',type:'number',unit:'kg',step:2.5}],recording:{version:2,metrics:['weight']}}],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},now);
  await page.reload({waitUntil:'domcontentloaded'});await waitReady();

  const initial=await page.evaluate(()=>{const api=window.__AXIS_821_OBJECT_METRIC_OVERRIDES__,lib=window.__AXIS_873_LIBRARY__.find(x=>x.id==='treadmill');return{marker:{...api,has:undefined,baseSchema:undefined,resolvedSchema:undefined,executionMode:undefined},base:api.baseSchema('treadmill'),resolved:api.resolvedSchema('treadmill'),mode:api.executionMode('treadmill'),library:JSON.stringify(lib),custom:api.resolvedSchema('custom-override-proof')}});
  assert.equal(initial.marker.owner,'app-profile-preference');assert.equal(initial.marker.storage,'axis_v60_state.profile.objectMetricOverrides');assert.equal(initial.marker.builtInDefinitionMutation,false);assert.equal(initial.marker.newPersistence,false);assert.equal(initial.marker.newRecorder,false);assert.equal(initial.marker.newEncounterWriter,false);assert.deepEqual(initial.resolved,initial.base);assert.deepEqual(initial.custom,['weight'],'custom Object schema was changed by built-in override layer');
  assert.ok(initial.base.includes('duration'),`treadmill default schema must contain duration · ${initial.base.join(',')}`);

  console.log(`[AXIS 8.21 Object overrides ${ENGINE}] Settings saves treadmill duration-only without mutating catalog`);
  await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'),undefined,{timeout:2000});
  await tap(page.locator('#axisObjectMetricSettingsBtn'));await page.waitForFunction(()=>document.querySelector('#axisObjectMetricSettingsSheet')?.classList.contains('show'),undefined,{timeout:2000});
  await page.locator('#axisObjectMetricSearch').fill('跑步机');await page.waitForFunction(()=>document.querySelector('[data-axis821-object-metric-open="treadmill"]'),undefined,{timeout:2000});
  await tap(page.locator('[data-axis821-object-metric-open="treadmill"]'));await page.waitForFunction(()=>document.querySelector('#axisObjectMetricEditSheet')?.classList.contains('show')&&document.querySelectorAll('#axisObjectMetricChoices [data-axis821-object-metric-choice]').length>=10,undefined,{timeout:2000});
  const choices=page.locator('#axisObjectMetricChoices [data-axis821-object-metric-choice]');const current=await choices.evaluateAll(xs=>xs.map(x=>({key:x.dataset.axis821ObjectMetricChoice,active:x.classList.contains('active')})));
  assert.ok(current.some(x=>x.key==='duration'),'duration override choice missing');
  for(const x of current){const want=x.key==='duration';if(x.active!==want)await tap(page.locator(`#axisObjectMetricChoices [data-axis821-object-metric-choice="${x.key}"]`))}
  assert.deepEqual(await choices.evaluateAll(xs=>xs.filter(x=>x.classList.contains('active')).map(x=>x.dataset.axis821ObjectMetricChoice)),['duration']);
  await tap(page.locator('#axisObjectMetricSave'));await page.waitForFunction(()=>!document.querySelector('#axisObjectMetricEditSheet')?.classList.contains('show'),undefined,{timeout:2000});
  const stored=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),api=window.__AXIS_821_OBJECT_METRIC_OVERRIDES__,lib=window.__AXIS_873_LIBRARY__.find(x=>x.id==='treadmill');return{override:c.profile?.objectMetricOverrides?.treadmill,resolved:api.resolvedSchema('treadmill'),mode:api.executionMode('treadmill'),library:JSON.stringify(lib),custom:api.resolvedSchema('custom-override-proof')}});
  assert.deepEqual(stored.override?.metrics,['duration']);assert.deepEqual(stored.resolved,['duration']);assert.equal(stored.mode,'timed');assert.equal(stored.library,initial.library,'built-in catalog Object was mutated');assert.deepEqual(stored.custom,['weight']);

  await closeIfShown('axisObjectMetricSettingsSheet');await closeIfShown('settingsSheet');
  console.log(`[AXIS 8.21 Object overrides ${ENGINE}] Quick Record consumes the same resolved duration-only schema`);
  await openQuick('treadmill');
  await page.waitForFunction(()=>document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelector('#axis818MetricRecorder [data-axis818-metric="duration"]'),undefined,{timeout:2500});
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric]').count(),1,'Quick recorder did not converge to duration-only');
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric="intensity"]').count(),0,'default intensity leaked through duration-only override');
  await page.locator('#axis818MetricRecorder [data-axis818-metric="duration"]').fill('22');
  await tap(page.locator('#saveScan'));
  await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId==='treadmill')},undefined,{timeout:3500});
  const event=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId==='treadmill');return{schema:e?.metricSchemaSnapshot?.map(x=>x.key),metrics:e?.metrics,mode:e?.executionModeSnapshot}});
  assert.deepEqual(event.schema,['duration']);assert.equal(event.metrics?.duration,22);assert.equal(event.mode,'timed');

  console.log(`[AXIS 8.21 Object overrides ${ENGINE}] reset restores built-in defaults; explicit empty remains distinct from absent`);
  await tap(page.locator('#settingsBtn'));await tap(page.locator('#axisObjectMetricSettingsBtn'));await page.locator('#axisObjectMetricSearch').fill('跑步机');await page.waitForFunction(()=>document.querySelector('[data-axis821-object-metric-open="treadmill"]'),undefined,{timeout:2000});await tap(page.locator('[data-axis821-object-metric-open="treadmill"]'));await tap(page.locator('#axisObjectMetricReset'));
  const reset=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),api=window.__AXIS_821_OBJECT_METRIC_OVERRIDES__;return{present:Object.prototype.hasOwnProperty.call(c.profile?.objectMetricOverrides||{},'treadmill'),resolved:api.resolvedSchema('treadmill'),base:api.baseSchema('treadmill')}});assert.equal(reset.present,false);assert.deepEqual(reset.resolved,reset.base);

  await page.locator('#axisObjectMetricSearch').fill('卧推');await page.waitForFunction(()=>document.querySelector('[data-axis821-object-metric-open="bench"]'),undefined,{timeout:2000});await tap(page.locator('[data-axis821-object-metric-open="bench"]'));const benchChoices=page.locator('#axisObjectMetricChoices [data-axis821-object-metric-choice]');for(const x of await benchChoices.evaluateAll(xs=>xs.map(x=>({key:x.dataset.axis821ObjectMetricChoice,active:x.classList.contains('active')}))))if(x.active)await tap(page.locator(`#axisObjectMetricChoices [data-axis821-object-metric-choice="${x.key}"]`));await tap(page.locator('#axisObjectMetricSave'));
  const empty=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),api=window.__AXIS_821_OBJECT_METRIC_OVERRIDES__;return{present:Object.prototype.hasOwnProperty.call(c.profile?.objectMetricOverrides||{},'bench'),metrics:c.profile?.objectMetricOverrides?.bench?.metrics,resolved:api.resolvedSchema('bench'),mode:api.executionMode('bench')}});assert.equal(empty.present,true);assert.deepEqual(empty.metrics,[]);assert.deepEqual(empty.resolved,[]);assert.equal(empty.mode,'single');

  assert.deepEqual(errors,[],`page errors: ${errors.join(' | ')}`);
  console.log(`[AXIS 8.21 Object overrides ${ENGINE}] PASS · Settings override · built-in non-mutation · resolved Quick schema · immutable Encounter snapshot · reset · explicit empty · custom isolation`);
}finally{await browser.close()}
