import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Flow reality ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:4500}):l.click({timeout:4500});
const metric=(key,label,type='number',unit='',step=1)=>({key,label,type,unit,step});
const CURRENT={id:'axis821-reality-current',name:'Flow 当前项',type:'cardio',pattern:'cardio',muscles:['心肺'],effect:'现实偏离测试',custom:true,metricSchema:[metric('duration','时间','duration','分钟',1)],metricSchemaVersion:'8.21',recording:{version:2,metrics:['duration']}};
/* Use a native canonical Object for the detour. This intentionally proves the ordinary
   Quick Record → existing catalog path rather than depending on custom-object projection. */
const DETOUR={id:'chest',name:'胸推'};
const FLOW={schema:'axis.flow.v1',id:'axis821-reality-flow',title:'现实流程',steps:[{id:'axis821-reality-step',objectRef:CURRENT.id}],metadata:{createdAt:1,updatedAt:1}};

const waitCore=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21'&&window.__AXIS_QUICK_RECORD__?.owner==='v61',undefined,{timeout:9000});
};
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const eventFor=id=>page.evaluate(id=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return(c.active?.events||[]).find(e=>e.equipmentId===id)||null},id);
const waitEvent=id=>page.waitForFunction(id=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.some(e=>e.equipmentId===id)}catch{return false}},id,{timeout:5000});
const visiblePickerItem=async(id,label)=>{
 const search=page.locator('#eqSearch');assert.equal(await search.count(),1,'canonical Object picker search missing');
 await search.fill(label);
 await page.waitForFunction(({id,label})=>[...document.querySelectorAll('#eqSheet [data-v8124-pick],#eqSheet [data-eq]')].some(x=>x.getClientRects().length>0&&getComputedStyle(x).visibility!=='hidden'&&(x.dataset.v8124Pick===id||x.dataset.eq===id||x.textContent.includes(label))),{id,label},{timeout:3000});
 const candidates=page.locator(`#eqSheet [data-v8124-pick="${id}"],#eqSheet [data-eq="${id}"]`);
 const index=await candidates.evaluateAll(xs=>xs.findIndex(x=>x.getClientRects().length>0&&getComputedStyle(x).visibility!=='hidden'));
 assert.ok(index>=0,`canonical picker did not visibly expose ${label}`);
 return candidates.nth(index);
};
const fillDurationAndSave=async value=>{
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#axis818MetricRecorder')?.classList.contains('show')&&document.querySelector('[data-axis818-metric="duration"]'),undefined,{timeout:3500});
 await page.locator('[data-axis818-metric="duration"]').fill(String(value));
 await tap(page.locator('#saveScan'));
};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.evaluate(CURRENT=>{
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[CURRENT],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },CURRENT);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();

 await page.evaluate(flow=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(flow);window.__AXIS_821_FLOW_SURFACE__.render()},FLOW);
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')?.dataset.state==='ready');

 console.log(`[AXIS 8.21 Flow reality ${ENGINE}] start one-step Flow and keep current intent visible`);
 await tap(page.locator(`#axis821FlowHome [data-axis-flow-start="${FLOW.id}"]`));
 await page.waitForFunction(id=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef===id&&document.querySelector('#axis821FlowHome')?.dataset.state==='active',CURRENT.id,{timeout:3000});
 const before=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.current());assert.equal(before.stepRef,FLOW.steps[0].id);assert.equal(before.objectRef,CURRENT.id);

 console.log(`[AXIS 8.21 Flow reality ${ENGINE}] temporary other Encounter must not consume current Flow step`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-other]'));
 await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:3000});
 await tap(page.locator('#v8Other'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:3000});
 await tap(await visiblePickerItem(DETOUR.id,DETOUR.name));
 await page.waitForFunction(label=>document.querySelector('#scanSheet')?.classList.contains('show')&&!document.querySelector('#reviewStage')?.classList.contains('hidden')&&document.querySelector('#equipmentName')?.textContent?.trim()===label,DETOUR.name,{timeout:3500});
 await tap(page.locator('#saveScan'));await waitEvent(DETOUR.id);await page.waitForTimeout(180);
 const detourEvent=await eventFor(DETOUR.id);assert.ok(detourEvent?.id,'temporary other Encounter was not committed');assert.ok(!detourEvent.flowProvenance,'temporary other Encounter incorrectly inherited current Flow provenance');
 let run=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.run()),current=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.current());
 assert.equal(run.status,'active');assert.equal(run.cursor,0,'temporary other Encounter advanced Flow cursor');assert.equal(run.lastEncounterId,null,'temporary other Encounter became Flow advance authority');assert.equal(current.stepRef,FLOW.steps[0].id);assert.equal(current.objectRef,CURRENT.id);
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'active');assert.ok((await page.locator('#axis821FlowHome').innerText()).includes(CURRENT.name),'Flow current item disappeared after temporary other Encounter');

 console.log(`[AXIS 8.21 Flow reality ${ENGINE}] Record Current resumes the same step and advances only after its matching Encounter`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(label=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()===label,CURRENT.name,{timeout:3500});
 await fillDurationAndSave(9);await waitEvent(CURRENT.id);
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='complete'&&document.querySelector('#axis821FlowHome')?.dataset.state==='complete',undefined,{timeout:5000});
 const currentEvent=await eventFor(CURRENT.id);assert.ok(currentEvent?.flowProvenance,'matching current Encounter lost Flow provenance');assert.equal(currentEvent.flowProvenance.flowRef,FLOW.id);assert.equal(currentEvent.flowProvenance.flowStepRef,FLOW.steps[0].id);
 let c=await core();assert.equal(c.active.events.length,2,'reality path did not preserve exactly two factual Encounters');assert.deepEqual(c.active.events.map(e=>e.equipmentId),[DETOUR.id,CURRENT.id]);
 const frozen=JSON.stringify(c.active.events.map(e=>e.flowProvenance||null));

 console.log(`[AXIS 8.21 Flow reality ${ENGINE}] explicit dismiss clears completed run only, not saved intent or history`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-dismiss]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()===null&&document.querySelector('#axis821FlowHome')?.dataset.state==='ready',undefined,{timeout:3000});
 c=await core();assert.equal(c.flowRun,null);assert.equal(c.flows.length,1);assert.equal(c.flows[0].id,FLOW.id);assert.equal(JSON.stringify(c.active.events.map(e=>e.flowProvenance||null)),frozen,'dismiss rewrote factual Encounter provenance');
 assert.ok((await page.locator('#axis821FlowHome').innerText()).includes(FLOW.title),'saved Flow did not return to ready state after dismiss');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Flow reality ${ENGINE}] PASS · native temporary-other Encounter remains factual but non-consuming · current intent survives · matching Record Current advances · dismiss clears run only`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
