import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Flow step intent ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:4500}):l.click({timeout:4500});
const metric=(key,label,type='number',unit='',step=1)=>({key,label,type,unit,step});
const OBJECT={id:'axis821-step-intent-object',name:'Flow 独立记录项',type:'strength',pattern:'push',muscles:['胸肌'],effect:'Flow step recording intent proof',custom:true,metricSchema:[metric('weight','重量','number','kg',2.5),metric('reps','次数','number','次',1),metric('sets','组数','number','组',1)],metricSchemaVersion:'8.21',executionMode:'sets',recording:{version:2,metrics:['weight','reps','sets'],executionMode:'sets'}};
const FLOW={schema:'axis.flow.v1',id:'axis821-step-intent-flow',title:'Flow 独立记录',steps:[{id:'axis821-step-intent-step',objectRef:OBJECT.id}],metadata:{createdAt:1,updatedAt:1}};
const waitCore=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21'&&window.__AXIS_821_FLOW_STEP_RECORDING_INTENT__?.version==='8.21',undefined,{timeout:9000});
};
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const flowSaved=()=>page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').flows?.find(x=>x.id===id)||null,FLOW.id);
const openEditor=async()=>{
 await tap(page.locator(`#axis821FlowHome [data-axis-flow-edit="${FLOW.id}"]`));
 await page.waitForFunction(()=>document.querySelector('#axis821FlowSheet')?.classList.contains('show')&&document.querySelector('.axis821FlowStepIntentSummary'),undefined,{timeout:3000});
};
const removeSetsOverride=async()=>{
 await tap(page.locator('[data-axis-flow-step-intent-toggle="0"]'));
 const sets=page.locator('[data-axis-flow-step-intent-choice="sets"][data-index="0"]');await sets.waitFor({state:'visible',timeout:2500});
 assert.equal(await sets.getAttribute('class'),'active','default Object schema did not begin with sets selected');
 await tap(sets);
 assert.ok((await page.locator('.axis821FlowStepIntentSummary b').innerText()).includes('此流程'),'Flow step did not visibly switch to independent recording intent');
};
const saveEditor=async()=>{
 await tap(page.locator('[data-axis-flow-save]'));
 await page.waitForFunction(()=>!document.querySelector('[data-axis-flow-save]'),undefined,{timeout:2500});
 if(await page.locator('#axis821FlowSheet').evaluate(x=>x.classList.contains('show')))await tap(page.locator('#axis821FlowClose'));
 await page.waitForFunction(()=>!document.querySelector('#axis821FlowSheet')?.classList.contains('show'),undefined,{timeout:2500});
};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.evaluate(OBJECT=>{
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[OBJECT],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },OBJECT);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();
 const cap=await page.evaluate(()=>window.__AXIS_821_FLOW_STEP_RECORDING_INTENT__);assert.equal(cap.owner,'axis.flow.v1.step.metricOverride');assert.equal(cap.newStorage,false);assert.equal(cap.newRecorder,false);assert.equal(cap.newEncounterWriter,false);assert.equal(cap.newActiveOwner,false);
 await page.evaluate(flow=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(flow);window.__AXIS_821_FLOW_SURFACE__.render()},FLOW);
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')?.dataset.state==='ready');

 console.log(`[AXIS 8.21 Flow step intent ${ENGINE}] edit one Flow step without changing Object/Profile defaults`);
 await openEditor();
 assert.ok((await page.locator('.axis821FlowStepIntentSummary b').innerText()).includes('跟随项目'),'new Flow step did not inherit Object recording content');
 await removeSetsOverride();await saveEditor();
 let saved=await flowSaved();assert.deepEqual(saved.steps[0].metricOverride?.metrics,['weight','reps'],'Flow step override was not saved as existing axis.flow.v1 metricOverride');
 let c=await core();assert.equal(c.profile.objectMetricOverrides,undefined,'Flow step edit contaminated global Object/Profile recording settings');

 console.log(`[AXIS 8.21 Flow step intent ${ENGINE}] explicit follow action removes only the per-Flow override`);
 await openEditor();await tap(page.locator('[data-axis-flow-step-intent-toggle="0"]'));await tap(page.locator('[data-axis-flow-step-intent-follow="0"]'));await saveEditor();
 saved=await flowSaved();assert.equal(Object.prototype.hasOwnProperty.call(saved.steps[0],'metricOverride'),false,'follow Object setting did not remove Flow-only metricOverride');
 c=await core();assert.equal(c.profile.objectMetricOverrides,undefined,'follow action wrote a global recording preference');

 console.log(`[AXIS 8.21 Flow step intent ${ENGINE}] restore independent intent and prove canonical recorder + Encounter snapshot consume it`);
 await openEditor();await removeSetsOverride();await saveEditor();
 await tap(page.locator(`#axis821FlowHome [data-axis-flow-start="${FLOW.id}"]`));
 await page.waitForFunction(id=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef===id,OBJECT.id,{timeout:3000});
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('[data-axis818-metric="weight"]')&&document.querySelector('[data-axis818-metric="reps"]'),undefined,{timeout:3500});
 assert.equal(await page.locator('[data-axis818-metric="sets"]').count(),0,'canonical recorder ignored Flow step metricOverride');
 await page.locator('[data-axis818-metric="weight"]').fill('42.5');await page.locator('[data-axis818-metric="reps"]').fill('8');await tap(page.locator('#saveScan'));
 await page.waitForFunction(id=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.some(e=>e.equipmentId===id)}catch{return false}},OBJECT.id,{timeout:5000});
 c=await core();const event=c.active.events.find(e=>e.equipmentId===OBJECT.id);assert.ok(event?.id,'Flow step Encounter missing');assert.deepEqual(event.metricSchemaSnapshot?.map(x=>x.key),['weight','reps'],'Encounter schema snapshot did not preserve effective Flow step recording intent');assert.equal(event.metrics?.weight,42.5);assert.equal(event.metrics?.reps,8);assert.equal(event.metrics?.sets,undefined);assert.deepEqual(event.flowProvenance?.stepSnapshot?.effectiveMetricIds,['weight','reps'],'Flow provenance did not freeze effective metric ids');
 const frozen=JSON.stringify(event.flowProvenance),savedFlow=JSON.stringify(c.flows.find(x=>x.id===FLOW.id));

 await page.reload({waitUntil:'domcontentloaded'});await waitCore();c=await core();const again=c.active?.events?.find(e=>e.id===event.id);assert.equal(JSON.stringify(again?.flowProvenance),frozen,'reload changed historical Flow provenance');assert.equal(JSON.stringify(c.flows.find(x=>x.id===FLOW.id)),savedFlow,'reload changed saved Flow step intent');
 const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth);assert.ok(overflow<=1,`390px horizontal overflow ${overflow}px`);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Flow step intent ${ENGINE}] PASS · Flow editor independent metric intent · follow/reset · canonical recorder consumption · immutable Encounter provenance · no Profile contamination`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
