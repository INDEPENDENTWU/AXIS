import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Flow ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));

const metric=(key,label,type='number',unit='',step=1)=>({key,label,type,unit,step,custom:false});
const A={id:'flow-a',name:'Flow 计时',type:'cardio',pattern:'cardio',muscles:[],effect:'',custom:true,metricSchema:[metric('duration','时间','duration','分钟',1),metric('intensity','强度','number','',1)],metricSchemaVersion:'8.20.1'};
const B={id:'flow-b',name:'Flow 经典组',type:'strength',pattern:'push',muscles:['胸肌'],effect:'胸肌',custom:true};
const C={id:'flow-c',name:'Flow 完成项',type:'strength',pattern:'core',muscles:[],effect:'',custom:true,executionMode:'complete',metricSchema:[metric('rating','感受','number','',1)],metricSchemaVersion:'8.20.1'};
const flow={schema:'axis.flow.v1',id:'flow-821-proof',title:'Phase 2 proof',steps:[{id:'a',objectRef:A.id,metricOverride:{metrics:['duration','pace']}},{id:'b',objectRef:B.id},{id:'c',objectRef:C.id}]};

await context.addInitScript(({A,B,C})=>{const now=Date.now();localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:{id:'S-821',start:now-60000,events:[]},profile:{customEq:[A,B,C],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}))},{A,B,C});

const waitCore=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_EXECUTABLE_OBJECTS__?.version==='8.20',undefined,{timeout:8000})};
const saveCurrent=async()=>{await page.evaluate(()=>document.querySelector('#saveScan')?.click())};
const eventBy=async id=>page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return(c.active?.events||[]).find(e=>e.equipmentId===id)||null},id);
const waitEvent=async id=>page.waitForFunction(id=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.some(e=>e.equipmentId===id)}catch{return false}},id,{timeout:5000});

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());await waitCore();
 assert.deepEqual(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.list()),[],'legacy same-version state did not load with an empty Flow definition default');
 assert.equal(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.run()),null,'legacy state unexpectedly gained an active Flow run');
 const marker=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__&&({version:window.__AXIS_FLOW_RUNTIME__.version,owner:window.__AXIS_FLOW_RUNTIME__.owner,storage:window.__AXIS_FLOW_RUNTIME__.storage,newStorage:window.__AXIS_FLOW_RUNTIME__.newStorage,newRecorder:window.__AXIS_FLOW_RUNTIME__.newRecorder,newActiveOwner:window.__AXIS_FLOW_RUNTIME__.newActiveOwner,newEncounterWriter:window.__AXIS_FLOW_RUNTIME__.newEncounterWriter}));
 assert.deepEqual(marker,{version:'8.21',owner:'app.js',storage:'axis_v60_state',newStorage:false,newRecorder:false,newActiveOwner:false,newEncounterWriter:false});

 console.log(`[AXIS 8.21 Flow ${ENGINE}] durable definition inside existing axis_v60_state`);
 const saved=await page.evaluate(flow=>window.__AXIS_FLOW_RUNTIME__.saveFlow(flow),flow);assert.equal(saved.id,flow.id);assert.equal(saved.steps.length,3);
 let stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));assert.equal(stored.flows.length,1);assert.equal(stored.flows[0].id,flow.id);assert.equal(stored.flowRun,null);
 assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).filter(k=>/^axis[_-]?flow/i.test(k))),[],'Flow introduced a separate localStorage namespace');
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();assert.equal(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.list().length),1,'Flow definition did not survive reload through axis_v60_state');

 console.log(`[AXIS 8.21 Flow ${ENGINE}] launch snapshots intent without creating training facts`);
 const currentA=await page.evaluate(id=>window.__AXIS_FLOW_RUNTIME__.launch(id),flow.id);assert.equal(currentA.stepRef,'a');assert.equal(currentA.objectRef,A.id);assert.deepEqual(currentA.effectiveMetricSchema.map(x=>x.key),['duration','pace']);assert.equal(currentA.effectiveExecutionMode,'timed');
 let launchState=await page.evaluate(()=>({core:JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),meta:JSON.parse(localStorage.getItem('axis_v8_meta')||'{}')}));assert.equal(launchState.core.active.events.length,0,'launch created an Encounter');assert.deepEqual(Object.keys(launchState.meta.events||{}),[],'launch created Active metadata');assert.equal(launchState.core.flowRun.cursor,0);assert.equal(launchState.core.flowRun.steps.length,3);
 const changed={...flow,title:'Edited while running',steps:[flow.steps[2],flow.steps[1],flow.steps[0]]};await page.evaluate(f=>window.__AXIS_FLOW_RUNTIME__.saveFlow(f),changed);assert.equal((await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.current())).stepRef,'a','live Flow edit rewrote running intent snapshot');

 console.log(`[AXIS 8.21 Flow ${ENGINE}] temporary metric override delegates to existing app recorder`);
 await page.evaluate(()=>{const r=window.__AXIS_FLOW_RUNTIME__,c=r.selectCurrent();window.__AXIS_EXECUTABLE_OBJECTS__.beginQuickRecorder(c.objectRef)});
 await page.waitForFunction(()=>document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelector('[data-axis818-metric="duration"]')&&document.querySelector('[data-axis818-metric="pace"]'),undefined,{timeout:2500});
 assert.equal(await page.locator('[data-axis818-metric="intensity"]').count(),0,'Object default intensity leaked beside temporary Flow override');await page.locator('[data-axis818-metric="duration"]').fill('2');await page.locator('[data-axis818-metric="pace"]').fill('5:30');await saveCurrent();await waitEvent(A.id);await page.waitForTimeout(180);
 const aEvent=await eventBy(A.id);assert.ok(aEvent?.id);assert.deepEqual(aEvent.metricSchemaSnapshot.map(x=>x.key),['duration','pace']);assert.equal(aEvent.executionModeSnapshot,'timed');assert.deepEqual(aEvent.flowProvenance,{schema:'axis.flow-provenance.v1',flowRef:flow.id,flowStepRef:'a',objectRef:A.id,stepSnapshot:{repeat:1,effectiveMetricIds:['duration','pace'],effectiveExecutionMode:'timed',overrideProvenance:{metricSchema:'flow-step-override',executionMode:'object',temporary:true}}});
 stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));assert.deepEqual(stored.profile.customEq.find(x=>x.id===A.id).metricSchema.map(x=>x.key),['duration','intensity'],'temporary Flow override mutated reusable Object defaults');assert.equal(stored.flowRun.lastEncounterId,aEvent.id,'app-owned Flow run did not bind the committed Encounter');
 const nextB=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.advance());assert.equal(nextB.stepRef,'b');assert.equal(nextB.objectRef,B.id);

 console.log(`[AXIS 8.21 Flow ${ENGINE}] classic step remains v61-owned while app writer adds Flow provenance`);
 await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.selectCurrent());await page.waitForTimeout(160);await saveCurrent();await waitEvent(B.id);
 await page.waitForFunction(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===id);return !!e?.flowProvenance&&Array.isArray(m.events?.[e.id]?.sets)&&m.events[e.id].sets.length>0},B.id,{timeout:5000});
 const b=await page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(c.active?.events||[]).find(x=>x.equipmentId===id);return{event:e,meta:m.events?.[e.id]}},B.id);assert.equal(b.event.executionModeSnapshot,'sets');assert.equal(b.event.flowProvenance.flowStepRef,'b');assert.deepEqual(b.event.flowProvenance.stepSnapshot.effectiveMetricIds,['weight','reps'],'classic structural sets leaked into portable provenance facts');assert.ok(b.meta.sets.length>0,'v61 classic set facts missing');
 const nextC=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.advance());assert.equal(nextC.stepRef,'c');

 console.log(`[AXIS 8.21 Flow ${ENGINE}] complete one-shot does not create false Active`);
 await page.evaluate(()=>{const r=window.__AXIS_FLOW_RUNTIME__,c=r.selectCurrent();window.__AXIS_EXECUTABLE_OBJECTS__.beginQuickRecorder(c.objectRef)});await page.waitForFunction(()=>document.querySelector('[data-axis818-metric="rating"]'),undefined,{timeout:2500});await page.locator('[data-axis818-metric="rating"]').fill('8');await saveCurrent();await waitEvent(C.id);await page.waitForTimeout(180);
 const c=await page.evaluate(id=>{const core=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),meta=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),e=(core.active?.events||[]).find(x=>x.equipmentId===id);return{e,activity:meta.events?.[e?.id]?.activity||null}},C.id);assert.equal(c.e.executionModeSnapshot,'complete');assert.equal(c.e.flowProvenance.flowStepRef,'c');assert.equal(c.activity,null,'complete Flow step created false persistent Active');assert.equal(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.advance()),true,'final Flow advance did not close current step');assert.equal((await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.run())).status,'complete');

 const frozenBefore=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return JSON.stringify(c.active.events.map(e=>e.flowProvenance))});await page.evaluate(f=>window.__AXIS_FLOW_RUNTIME__.saveFlow(f),flow);const frozenAfter=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return JSON.stringify(c.active.events.map(e=>e.flowProvenance))});assert.equal(frozenAfter,frozenBefore,'editing Flow rewrote historical Encounter provenance');
 assert.equal(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.finish()),true);stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));assert.equal(stored.flowRun,null);assert.equal(stored.flows.length,1);assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).filter(k=>/^axis[_-]?flow/i.test(k))),[],'Flow created a separate localStorage key');assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Flow ${ENGINE}] PASS · same-store definition/run · reload · one-current-step · temporary override nonmutation · app-owned provenance · v61 classic authority · complete one-shot · no new storage`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
