import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 recording surface ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const waitCore=async()=>{
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
  await page.waitForFunction(()=>window.__AXIS_OBJECT_TRUTH__?.version==='8.18'&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20'&&window.__AXIS_821_RECORDING_SURFACE__?.explicitEmptySchema===true,undefined,{timeout:9000});
};
const openPicker=async()=>{await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('quick'));await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});await page.waitForTimeout(100)};
const search=async q=>{const input=page.locator('#eqSearch');await input.fill(q);await page.waitForFunction(v=>document.querySelector('#eqSearch')?.value===v&&document.querySelector('#v873SmartResults')?.classList.contains('show'),q,{timeout:2500});await page.waitForTimeout(100)};
const createFromSearch=async(name,{allowManualName=true}={})=>{await openPicker();await search(name);const create=page.locator('#v873SmartResults [data-axis-create-custom]');assert.equal(await create.count(),1,`direct create missing for ${name}`);await tap(create);await page.waitForFunction(()=>document.querySelector('#customEqSheet')?.classList.contains('show'),undefined,{timeout:2500});const input=page.locator('#customName');await page.waitForTimeout(140);await page.waitForFunction(()=>document.querySelectorAll('#axis818MetricEditor [data-axis818-metric-choice]').length>=14,undefined,{timeout:2500});const seed=await input.inputValue();if(seed!==name){assert.equal(allowManualName&&seed==='',true,`unexpected custom-name seed for ${name}: ${seed}`);await input.fill(name)}};
const setMetrics=async keys=>{const wanted=[...keys];const current=await page.locator('#axis818MetricEditor [data-axis818-metric-choice]').evaluateAll(xs=>xs.map(x=>({key:x.dataset.axis818MetricChoice,active:x.classList.contains('active')})));assert.ok(current.length>=14,'expanded property catalog missing');for(const x of current){const want=wanted.includes(x.key);if(want!==x.active)await tap(page.locator(`#axis818MetricEditor [data-axis818-metric-choice="${x.key}"]`))}await page.waitForFunction(w=>{const xs=[...document.querySelectorAll('#axis818MetricEditor [data-axis818-metric-choice].active')].map(x=>x.dataset.axis818MetricChoice);return xs.length===w.length&&w.every(k=>xs.includes(k))},wanted,{timeout:2000})};
const saveCustom=async name=>{await tap(page.locator('#saveCustomEq'));await page.waitForFunction(n=>!document.querySelector('#customEqSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()===n,name,{timeout:3500});await page.waitForTimeout(120);return await page.evaluate(n=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');const x=(c.profile?.customEq||[]).find(e=>e.name===n);return x&&{id:x.id,type:x.type,metricSchema:x.metricSchema,recording:x.recording}},name)};
const savedEvent=async id=>page.evaluate(objectId=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===objectId);return e&&{id:e.id,schema:e.metricSchemaSnapshot?.map(x=>x.key),metrics:e.metrics,mode:e.executionModeSnapshot,legacy:{weight:e.weight,reps:e.reps,sets:e.sets,duration:e.duration,intensity:e.intensity},activity:m.events?.[e.id]?.activity||null}},id);

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const t=Date.now();
  await page.evaluate(now=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S-821-PROPS',start:now-60000,events:[]},flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},t);
  await page.reload({waitUntil:'domcontentloaded'});await waitCore();

  const surface=await page.evaluate(()=>window.__AXIS_821_RECORDING_SURFACE__);
  assert.equal(surface.schemaEditing,'object-editor-only');assert.equal(surface.recordingSurface,'value-controls-only');assert.equal(surface.presetMetricCount,14);assert.equal(surface.newRecorder,false);assert.equal(surface.newPersistence,false);

  console.log(`[AXIS 8.21 recording surface ${ENGINE}] explicit zero-property Object stays empty`);
  await createFromSearch('空属性测试');await setMetrics([]);
  assert.equal(await page.locator('#axis818MetricEditor [data-axis818-metric-choice="duration"]').evaluate(x=>x.classList.contains('active')),false,'duration was silently reselected after clearing all properties');
  assert.ok((await page.locator('#axis818MetricEditor').innerText()).includes('不记录数值也可以'),'empty-schema explanation missing');
  const empty=await saveCustom('空属性测试');assert.ok(empty?.id);assert.deepEqual(empty.metricSchema,[]);assert.deepEqual(empty.recording?.metrics,[]);
  await page.waitForFunction(id=>window.__AXIS_OBJECT_TRUTH__?.explicit?.(id)===true&&window.__AXIS_OBJECT_TRUTH__?.schemaForEq?.(id)?.length===0,empty.id,{timeout:2500});
  await page.waitForFunction(()=>document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelector('#axis818MetricRecorder .axis821NoMetrics'),undefined,{timeout:2500});
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric]').count(),0,'empty Object recorder invented a value field');
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric-choice]').count(),0,'record page leaked Object schema editing controls');
  assert.equal(await page.locator('#strengthFields').evaluate(x=>x.classList.contains('axis818LegacyMetricHidden')),true,'legacy strength fields leaked for explicit empty schema');
  assert.equal(await page.locator('#cardioFields').evaluate(x=>x.classList.contains('axis818LegacyMetricHidden')),true,'legacy cardio fields leaked for explicit empty schema');
  await tap(page.locator('#saveScan'));
  await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId===id)},empty.id,{timeout:3500});await page.waitForTimeout(180);
  const emptyEvent=await savedEvent(empty.id);assert.deepEqual(emptyEvent.schema,[]);assert.deepEqual(emptyEvent.metrics,{});assert.equal(emptyEvent.mode,'single');assert.equal(emptyEvent.activity,null,'empty one-shot record created false Active lifecycle');assert.equal(emptyEvent.legacy.weight,undefined);assert.equal(emptyEvent.legacy.duration,undefined);

  console.log(`[AXIS 8.21 recording surface ${ENGINE}] duration + intensity uses the same canonical value controls`);
  await createFromSearch('组合属性测试');await setMetrics(['duration','intensity']);
  const combo=await saveCustom('组合属性测试');assert.ok(combo?.id);assert.deepEqual(combo.metricSchema.map(x=>x.key),['duration','intensity']);
  await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="duration"]')&&document.querySelector('[data-axis818-metric="intensity"]'),undefined,{timeout:2500});
  assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric-choice]').count(),0,'record page became a schema editor');
  assert.equal(await page.locator('[data-axis821-key="duration"]').getAttribute('data-axis821-kind'),'timer');
  assert.equal(await page.locator('[data-axis821-key="intensity"]').getAttribute('data-axis821-kind'),'rating');
  const preset=page.locator('[data-axis821-preset="duration"][data-value="20"]');assert.equal(await preset.count(),1);await tap(preset);
  const rate=page.locator('[data-axis821-rate="intensity"][data-value="7"]');assert.equal(await rate.count(),1);await tap(rate);
  assert.equal(await page.locator('[data-axis818-metric="duration"]').inputValue(),'20');assert.equal(await page.locator('[data-axis818-metric="intensity"]').inputValue(),'7');
  const durationGeometry=await page.locator('[data-axis821-key="duration"]').evaluate(root=>{const cell=root.querySelector('.axis821Stepper>div'),input=root.querySelector('[data-axis818-metric="duration"]'),unit=input?.nextElementSibling,presets=[...root.querySelectorAll('.axis821Presets button')],rail=root.querySelector('.axis821Presets');const c=cell.getBoundingClientRect(),i=input.getBoundingClientRect(),u=unit.getBoundingClientRect(),r=rail.getBoundingClientRect(),bs=presets.map(x=>x.getBoundingClientRect());return{center:(Math.min(i.left,u.left)+Math.max(i.right,u.right))/2,cell:(c.left+c.right)/2,widths:bs.map(x=>x.width),left:bs[0].left-r.left,right:r.right-bs.at(-1).right}});assert.ok(Math.abs(durationGeometry.center-durationGeometry.cell)<=.5,'duration value + unit lost optical center');assert.ok(Math.max(...durationGeometry.widths)-Math.min(...durationGeometry.widths)<=.5,'duration presets are not equal-width');assert.ok(Math.abs(durationGeometry.left-durationGeometry.right)<=.75,'duration presets are not symmetric');
  await tap(page.locator('#saveScan'));
  await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId===id)},combo.id,{timeout:3500});await page.waitForTimeout(180);
  const comboEvent=await savedEvent(combo.id);assert.deepEqual(comboEvent.schema,['duration','intensity']);assert.equal(comboEvent.metrics.duration,20);assert.equal(comboEvent.metrics.intensity,7);assert.equal(comboEvent.mode,'timed');

  console.log(`[AXIS 8.21 recording surface ${ENGINE}] resistance uses the same optically centered native geometry`);
  await createFromSearch('档位几何测试');await setMetrics(['resistance']);const gear=await saveCustom('档位几何测试');assert.ok(gear?.id);await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="resistance"]'),undefined,{timeout:2500});const gearInput=page.locator('[data-axis818-metric="resistance"]');await gearInput.fill('8');const gearGeometry=await page.locator('[data-axis821-key="resistance"]').evaluate(root=>{const cell=root.querySelector('.axis821Stepper>div'),input=root.querySelector('[data-axis818-metric="resistance"]'),unit=input?.nextElementSibling,presets=[...root.querySelectorAll('.axis821Presets button')],rail=root.querySelector('.axis821Presets');const c=cell.getBoundingClientRect(),i=input.getBoundingClientRect(),u=unit.getBoundingClientRect(),r=rail.getBoundingClientRect(),bs=presets.map(x=>x.getBoundingClientRect());return{center:(Math.min(i.left,u.left)+Math.max(i.right,u.right))/2,cell:(c.left+c.right)/2,widths:bs.map(x=>x.width),left:bs[0].left-r.left,right:r.right-bs.at(-1).right}});assert.ok(Math.abs(gearGeometry.center-gearGeometry.cell)<=.5,'resistance value + unit lost optical center');assert.ok(Math.max(...gearGeometry.widths)-Math.min(...gearGeometry.widths)<=.5,'resistance presets are not equal-width');assert.ok(Math.abs(gearGeometry.left-gearGeometry.right)<=.75,'resistance presets are not symmetric');
  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.21 recording surface ${ENGINE}] PASS · 14-property Object editor · zero selection preserved · no default-time fallback · value-only shared recorder · duration/rating controls · immutable Encounter facts`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
