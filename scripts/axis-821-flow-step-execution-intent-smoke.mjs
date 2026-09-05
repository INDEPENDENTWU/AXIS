import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Flow execution intent ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:4500}):l.click({timeout:4500});
const metric=(key,label,type='number',unit='',step=1)=>({key,label,type,unit,step});
const ATOMIC={id:'axis821-exec-atomic',name:'Flow 原子项目',type:'mobility',pattern:'mobility',muscles:['髋部'],effect:'execution override timed proof',custom:true,metricSchema:[metric('completed','完成','boolean','',1)],metricSchemaVersion:'8.21',executionMode:'complete',recording:{version:2,metrics:['completed'],executionMode:'complete'}};
const TIMED={id:'axis821-exec-timed',name:'Flow 计时项目',type:'cardio',pattern:'cardio',muscles:['心肺'],effect:'execution override single proof',custom:true,metricSchema:[metric('duration','时间','duration','分钟',1),metric('intensity','强度','number','/10',1)],metricSchemaVersion:'8.21',executionMode:'timed',recording:{version:2,metrics:['duration','intensity'],executionMode:'timed'}};
const FLOW_TIMED={schema:'axis.flow.v1',id:'axis821-exec-flow-timed',title:'原子改计时',steps:[{id:'axis821-exec-step-timed',objectRef:ATOMIC.id}],metadata:{createdAt:1,updatedAt:2}};
const FLOW_SINGLE={schema:'axis.flow.v1',id:'axis821-exec-flow-single',title:'计时改一次',steps:[{id:'axis821-exec-step-single',objectRef:TIMED.id}],metadata:{createdAt:1,updatedAt:1}};
const waitCore=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21'&&window.__AXIS_821_FLOW_STEP_EXECUTION_INTENT__?.version==='8.21'&&window.__AXIS_ACTIVE_RUNTIME__?.version==='8.21',undefined,{timeout:9000});
};
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const meta=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'));
const flowSaved=id=>page.evaluate(id=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').flows?.find(x=>x.id===id)||null,id);
const closeFlowSheet=async()=>{if(await page.locator('#axis821FlowSheet').evaluate(x=>x.classList.contains('show')))await tap(page.locator('#axis821FlowClose'));await page.waitForFunction(()=>!document.querySelector('#axis821FlowSheet')?.classList.contains('show'),undefined,{timeout:2500})};
const editMode=async(flowId,mode)=>{
 await page.evaluate(id=>window.__AXIS_821_FLOW_SURFACE__.editFlow(id),flowId);
 await page.waitForFunction(()=>document.querySelector('#axis821FlowSheet')?.classList.contains('show')&&document.querySelector('.axis821FlowStepExecutionSummary'),undefined,{timeout:3000});
 await tap(page.locator('[data-axis-flow-step-execution-toggle="0"]'));
 const choice=page.locator(`[data-axis-flow-step-execution-choice="${mode}"][data-index="0"]`);await choice.waitFor({state:'visible',timeout:2500});await tap(choice);
 assert.ok((await page.locator('.axis821FlowStepExecutionSummary b').innerText()).includes('此流程'),'execution choice did not become Flow-local intent');
 await tap(page.locator('[data-axis-flow-save]'));await page.waitForFunction(()=>!document.querySelector('[data-axis-flow-save]'),undefined,{timeout:2500});await closeFlowSheet();
};
const resetMode=async flowId=>{
 await page.evaluate(id=>window.__AXIS_821_FLOW_SURFACE__.editFlow(id),flowId);await page.waitForFunction(()=>document.querySelector('.axis821FlowStepExecutionSummary'),undefined,{timeout:2500});await tap(page.locator('[data-axis-flow-step-execution-toggle="0"]'));await tap(page.locator('[data-axis-flow-step-execution-follow="0"]'));await tap(page.locator('[data-axis-flow-save]'));await page.waitForFunction(()=>!document.querySelector('[data-axis-flow-save]'),undefined,{timeout:2500});await closeFlowSheet();
};
const launch=async id=>{await page.evaluate(id=>{window.__AXIS_FLOW_RUNTIME__.launch(id);window.__AXIS_821_FLOW_SURFACE__.render()},id);await page.waitForFunction(id=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.flowRef===id,id,{timeout:3000})};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.evaluate(({ATOMIC,TIMED})=>{
  localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[ATOMIC,TIMED],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },{ATOMIC,TIMED});
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();
 const cap=await page.evaluate(()=>window.__AXIS_821_FLOW_STEP_EXECUTION_INTENT__);assert.equal(cap.owner,'axis.flow.v1.step.executionOverride');assert.deepEqual(cap.modes,['single','complete','timed','hold','sets','rounds']);assert.equal(cap.newStorage,false);assert.equal(cap.newRecorder,false);assert.equal(cap.newEncounterWriter,false);assert.equal(cap.newActiveOwner,false);
 await page.evaluate(({a,b})=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(a);window.__AXIS_FLOW_RUNTIME__.saveFlow(b);window.__AXIS_821_FLOW_SURFACE__.render()},{a:FLOW_TIMED,b:FLOW_SINGLE});

 console.log(`[AXIS 8.21 Flow execution intent ${ENGINE}] edit executionOverride without mutating Objects`);
 await page.evaluate(id=>window.__AXIS_821_FLOW_SURFACE__.editFlow(id),FLOW_TIMED.id);await page.waitForFunction(()=>document.querySelector('.axis821FlowStepExecutionSummary'),undefined,{timeout:2500});assert.ok((await page.locator('.axis821FlowStepExecutionSummary b').innerText()).includes('自动 · 完成即记'),'atomic Object default was not visible before override');await closeFlowSheet();
 await editMode(FLOW_TIMED.id,'timed');let saved=await flowSaved(FLOW_TIMED.id);assert.equal(saved.steps[0].executionOverride,'timed');
 await resetMode(FLOW_TIMED.id);saved=await flowSaved(FLOW_TIMED.id);assert.equal(Object.prototype.hasOwnProperty.call(saved.steps[0],'executionOverride'),false,'follow Object setting did not remove Flow-only executionOverride');
 await editMode(FLOW_TIMED.id,'timed');await editMode(FLOW_SINGLE.id,'single');
 let c=await core();let a=c.profile.customEq.find(x=>x.id===ATOMIC.id),t=c.profile.customEq.find(x=>x.id===TIMED.id);assert.equal(a.executionMode,'complete','Flow execution intent mutated atomic Object');assert.equal(t.executionMode,'timed','Flow execution intent mutated timed Object');assert.equal(c.profile.objectMetricOverrides,undefined,'Flow execution intent contaminated Profile metric preferences');

 console.log(`[AXIS 8.21 Flow execution intent ${ENGINE}] atomic Object overridden to timed enters existing Active owner`);
 await launch(FLOW_TIMED.id);await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(id=>{try{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=c.active?.events?.find(x=>x.equipmentId===id);return !!(e&&m.events?.[e.id]?.activity?.status==='active')}catch{return false}},ATOMIC.id,{timeout:5000});
 c=await core();let eventTimed=c.active.events.find(x=>x.equipmentId===ATOMIC.id);let m=await meta();assert.equal(eventTimed.executionModeSnapshot,'timed','resolved timed override did not reach Encounter snapshot');assert.equal(eventTimed.flowProvenance?.stepSnapshot?.effectiveExecutionMode,'timed','Flow provenance did not freeze timed override');assert.equal(eventTimed.flowProvenance?.stepSnapshot?.overrideProvenance?.executionMode,'flow-step-override');assert.equal(m.events?.[eventTimed.id]?.activity?.status,'active','timed override did not use existing Active truth');assert.equal(await page.locator('#scanSheet.show').count(),0,'timed direct-start unexpectedly opened a second recorder');
 await page.evaluate(id=>window.__AXIS_ACTIVE_RUNTIME__.finish(id),eventTimed.id);await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='complete',undefined,{timeout:3500});await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.finish());

 console.log(`[AXIS 8.21 Flow execution intent ${ENGINE}] timed Object overridden to single uses canonical recorder and advances without Active`);
 await launch(FLOW_SINGLE.id);await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('[data-axis818-metric="duration"]'),undefined,{timeout:3500});
 await page.locator('[data-axis818-metric="duration"]').fill('12');const intensity=page.locator('[data-axis818-metric="intensity"]');if(await intensity.count())await intensity.fill('6');await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='complete',undefined,{timeout:5000});
 c=await core();const eventSingle=c.active.events.find(x=>x.equipmentId===TIMED.id);assert.ok(eventSingle?.id,'single override Encounter missing');assert.equal(eventSingle.executionModeSnapshot,'single','resolved single override did not reach Encounter snapshot');assert.equal(eventSingle.flowProvenance?.stepSnapshot?.effectiveExecutionMode,'single','Flow provenance did not freeze single override');assert.equal(eventSingle.flowProvenance?.stepSnapshot?.overrideProvenance?.executionMode,'flow-step-override');m=await meta();assert.equal(m.events?.[eventSingle.id]?.activity,undefined,'single override incorrectly created an Active Activity');
 c=await core();a=c.profile.customEq.find(x=>x.id===ATOMIC.id);t=c.profile.customEq.find(x=>x.id===TIMED.id);assert.equal(a.executionMode,'complete');assert.equal(t.executionMode,'timed');const frozenTimed=JSON.stringify(eventTimed.flowProvenance),frozenSingle=JSON.stringify(eventSingle.flowProvenance),savedTimed=JSON.stringify(c.flows.find(x=>x.id===FLOW_TIMED.id)),savedSingle=JSON.stringify(c.flows.find(x=>x.id===FLOW_SINGLE.id));

 await page.reload({waitUntil:'domcontentloaded'});await waitCore();c=await core();assert.equal(JSON.stringify(c.active?.events?.find(x=>x.id===eventTimed.id)?.flowProvenance),frozenTimed,'reload changed timed historical provenance');assert.equal(JSON.stringify(c.active?.events?.find(x=>x.id===eventSingle.id)?.flowProvenance),frozenSingle,'reload changed single historical provenance');assert.equal(JSON.stringify(c.flows.find(x=>x.id===FLOW_TIMED.id)),savedTimed,'reload changed timed Flow intent');assert.equal(JSON.stringify(c.flows.find(x=>x.id===FLOW_SINGLE.id)),savedSingle,'reload changed single Flow intent');
 const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth);assert.ok(overflow<=1,`390px horizontal overflow ${overflow}px`);assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Flow execution intent ${ENGINE}] PASS · editor override/follow · atomic→timed canonical Active · timed→single canonical recorder · immutable provenance · Object defaults untouched`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
