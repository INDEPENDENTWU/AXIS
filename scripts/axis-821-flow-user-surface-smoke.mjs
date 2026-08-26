import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Flow surface ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const waitCore=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21'&&window.__AXIS_QUICK_RECORD__?.owner==='v61',undefined,{timeout:9000});
};
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const addStep=async(id,query)=>{
 await tap(page.locator('[data-axis-flow-add]'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});
 const search=page.locator('#eqSearch');assert.equal(await search.count(),1,'canonical Object picker search missing');
 let pick=page.locator(`#eqSheet [data-v8124-pick="${id}"]:visible, #eqSheet [data-eq="${id}"]:visible`).first();
 if(await pick.count()===0){
  await search.fill(query);
  pick=page.locator(`#v873SmartResults.show [data-v8124-pick="${id}"]:visible`).first();
  await pick.waitFor({state:'visible',timeout:3000});
 }
 assert.equal(await pick.count(),1,`canonical Object picker did not visibly expose ${id}`);
 await tap(pick);
 await page.waitForFunction(()=>document.querySelector('#axis821FlowSheet')?.classList.contains('show'),undefined,{timeout:2500});
};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{
  localStorage.clear();
  const metric=(key,label,type,unit,step=1)=>({key,label,type,unit,step});
  const a={id:'axis821-ui-a',name:'Flow 时间项',type:'strength',pattern:'core',muscles:['核心'],effect:'流程测试',custom:true,metricSchema:[metric('duration','时间','duration','分钟',1),metric('intensity','强度','rating','',1)],metricSchemaVersion:'8.21',recording:{version:2,metrics:['duration','intensity']}};
  const c={id:'axis821-ui-c',name:'Flow 完成项',type:'strength',pattern:'core',muscles:['核心'],effect:'流程测试',custom:true,metricSchema:[],metricSchemaVersion:'8.21',executionMode:'complete',recording:{version:2,metrics:[],executionMode:'complete'}};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[a,c],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },now);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();

 const surface=await page.evaluate(()=>window.__AXIS_821_FLOW_SURFACE__);
 assert.equal(surface.definitionOwner,'app.js');assert.equal(surface.pickerOwner,'existing-eqSheet');assert.equal(surface.recordingOwner,'existing-v61+app');assert.equal(surface.newStorage,false);assert.equal(surface.newPicker,false);assert.equal(surface.newRecorder,false);assert.equal(surface.newEncounterWriter,false);
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'empty');

 console.log(`[AXIS 8.21 Flow surface ${ENGINE}] compose A/C/B through visible canonical Object picker surfaces, then reorder`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-new]'));
 await page.waitForFunction(()=>document.querySelector('#axis821FlowSheet')?.classList.contains('show')&&document.querySelector('#axis821FlowTitleInput'),undefined,{timeout:2500});
 await page.locator('#axis821FlowTitleInput').fill('日常流程');
 await addStep('axis821-ui-a','Flow 时间项');await addStep('axis821-ui-c','Flow 完成项');await addStep('chest','胸推');
 let names=await page.locator('.axis821FlowStep>span>b').allTextContents();assert.deepEqual(names,['Flow 时间项','Flow 完成项','胸推']);
 await tap(page.locator('[data-axis-flow-move="-1"][data-index="2"]'));
 names=await page.locator('.axis821FlowStep>span>b').allTextContents();assert.deepEqual(names,['Flow 时间项','胸推','Flow 完成项']);
 await tap(page.locator('[data-axis-flow-save]'));
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return c.flows?.length===1&&c.flows[0].steps?.length===3},undefined,{timeout:2500});
 let c=await core(),flow=c.flows[0];assert.equal(flow.title,'日常流程');assert.deepEqual(flow.steps.map(x=>x.objectRef),['axis821-ui-a','chest','axis821-ui-c']);
 assert.equal(c.active,null,'composing intent created a training Session');assert.equal(c.sessions.length,0,'composing intent created factual history');

 console.log(`[AXIS 8.21 Flow surface ${ENGINE}] launch shows only current + next intent, then records through canonical Quick Record`);
 await tap(page.locator(`#axis821FlowBody [data-axis-flow-start="${flow.id}"]`));
 await page.waitForFunction(id=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef==='axis821-ui-a'&&window.__AXIS_FLOW_RUNTIME__?.run?.()?.flowRef===id,flow.id,{timeout:2500});
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'active');
 const homeText=await page.locator('#axis821FlowHome').innerText();assert.ok(homeText.includes('Flow 时间项'));assert.ok(homeText.includes('接下来 · 胸推'));assert.ok(!homeText.includes('%'),'Flow surfaced completion percentage');
 c=await core();assert.equal(c.active,null,'launching Flow marked Objects/Session active before recording');

 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#scanSheet')?.classList.contains('v8-quick')&&document.querySelector('[data-axis818-metric="duration"]')&&document.querySelector('[data-axis818-metric="intensity"]'),undefined,{timeout:3500});
 assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric-choice]').count(),0,'Flow duplicated Object schema editing onto Record');
 await tap(page.locator('[data-axis821-preset="duration"][data-value="20"]'));
 await tap(page.locator('[data-axis821-rate="intensity"][data-value="7"]'));
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef==='chest',undefined,{timeout:4000});
 c=await core();assert.equal(c.active?.events?.length,1,'first Flow Encounter not committed exactly once');
 const first=c.active.events[0];assert.equal(first.equipmentId,'axis821-ui-a');assert.equal(first.flowProvenance?.flowRef,flow.id);assert.equal(first.flowProvenance?.objectRef,'axis821-ui-a');assert.equal(first.flowProvenance?.stepSnapshot?.effectiveExecutionMode,'timed');assert.deepEqual(first.metricSchemaSnapshot?.map(x=>x.key),['duration','intensity']);assert.equal(first.metrics?.duration,20);assert.equal(first.metrics?.intensity,7);

 console.log(`[AXIS 8.21 Flow surface ${ENGINE}] skip changes intent only; completion-only C stays one-shot`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-skip]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef==='axis821-ui-c',undefined,{timeout:2500});
 c=await core();assert.equal(c.active.events.length,1,'skip invented an Encounter');assert.deepEqual(c.flowRun.skippedStepRefs,[flow.steps[1].id]);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelector('#axis818MetricRecorder .axis821NoMetrics'),undefined,{timeout:3500});
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='complete',undefined,{timeout:4000});
 c=await core();assert.equal(c.active.events.length,2);const last=c.active.events[1];assert.equal(last.equipmentId,'axis821-ui-c');assert.deepEqual(last.metricSchemaSnapshot,[]);assert.equal(last.executionModeSnapshot,'complete');assert.equal(last.flowProvenance?.flowRef,flow.id);assert.equal(last.flowProvenance?.stepSnapshot?.effectiveExecutionMode,'complete');
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'complete');
 const frozen=JSON.stringify(c.active.events.map(e=>e.flowProvenance));

 console.log(`[AXIS 8.21 Flow surface ${ENGINE}] edit/reorder future intent without mutating old Encounter provenance`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-open]'));
 await tap(page.locator(`#axis821FlowBody [data-axis-flow-edit="${flow.id}"]`));
 await tap(page.locator('[data-axis-flow-move="-1"][data-index="2"]'));
 await tap(page.locator('[data-axis-flow-move="-1"][data-index="1"]'));
 names=await page.locator('.axis821FlowStep>span>b').allTextContents();assert.deepEqual(names,['Flow 完成项','Flow 时间项','胸推']);
 await tap(page.locator('[data-axis-flow-save]'));
 c=await core();assert.deepEqual(c.flows[0].steps.map(x=>x.objectRef),['axis821-ui-c','axis821-ui-a','chest']);assert.equal(JSON.stringify(c.active.events.map(e=>e.flowProvenance)),frozen,'editing Flow rewrote historical provenance');

 await page.reload({waitUntil:'domcontentloaded'});await waitCore();
 c=await core();assert.deepEqual(c.flows[0].steps.map(x=>x.objectRef),['axis821-ui-c','axis821-ui-a','chest']);assert.equal(JSON.stringify(c.active.events.map(e=>e.flowProvenance)),frozen,'reload changed immutable Encounter provenance');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Flow surface ${ENGINE}] PASS · canonical picker composition · reorder/save/reload · current/next intent · canonical Quick Record · Encounter-gated advance · skip reality tolerance · immutable history`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
