import assert from 'node:assert/strict';
import {compilePlayableSpec} from '../lib/axis-playable.mjs';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const playwright=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const engine=ENGINE==='webkit'?playwright.webkit:playwright.chromium;
const browser=await engine.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),pageErrors=[];
page.on('pageerror',e=>pageErrors.push(String(e.stack||e)));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const json=(route,data)=>route.fulfill({status:200,contentType:'application/json',headers:{'cache-control':'no-store','access-control-allow-origin':'*'},body:JSON.stringify(data)});
for(const [pattern,data] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,data));
const flow={schema:'axis.flow.v1',id:'playable-flow-proof',title:'Playable identity proof',steps:[{id:'chest-first',objectRef:'chest-row'}]};
const spec=compilePlayableSpec({playableId:'playable-proof',source:{kind:'flow',flow},objects:[{id:'chest-row',baseId:'row',metricSchema:{metrics:['weight','reps']}}]});
const snapshot=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:16000}))?.ok());
 const now=Date.now(),legacy={id:'legacy-row',equipmentId:'row',name:'old ambiguous row',kind:'strength',time:now-100000,weight:40,reps:6};
 await page.evaluate(({now,legacy})=>{
  localStorage.clear();
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'old-session',start:now-120000,end:now-90000,events:[legacy]}],active:null,flows:[],flowRun:null,profile:{customEq:[],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },{now,legacy});
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.31'&&!!window.__AXIS_831_PLAYABLE__&&!!window.__AXIS_FLOW_RUNTIME__,undefined,{timeout:18000});
 const old=JSON.stringify((await snapshot()).sessions[0].events[0]);
 const start=await page.evaluate(({flow,spec})=>{
  const owner=window.__AXIS_FLOW_RUNTIME__,playable=window.__AXIS_831_PLAYABLE__;
  const saved=owner.saveFlow(flow);
  const prior=(JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events||[]).length;
  const ready=playable.project(spec,'attempt-1');
  const command=playable.plan(ready,'launch','req-start');
  const result=playable.dispatch(spec,'attempt-1',command);
  const repeated=playable.dispatch(spec,'attempt-1',command);
  return {saved,prior,ready,command,result,repeated,run:owner.run(),projected:playable.project(spec,'attempt-1')};
 },{flow,spec});
 assert.equal(start.ready.phase,'ready');assert.equal(start.command.ok,true);
 assert.equal(start.result.status,'accepted');assert.equal(start.repeated.status,'stale','Flow must not relaunch on double-click');
 assert.equal(start.run.flowRef,flow.id);assert.equal(start.projected.phase,'awaiting-fact','Live Flow owner snapshot: '+JSON.stringify(start));
 assert.equal((await snapshot()).active?.events?.length||0,start.prior,'Playable launch cannot invent an Encounter');
 const selected=await page.evaluate(({spec})=>{
  const p=window.__AXIS_831_PLAYABLE__;
  const projection=p.project(spec,'attempt-1'),command=p.plan(projection,'select-current','req-select');
  return {command,result:p.dispatch(spec,'attempt-1',command),selected:window.__AXIS_SELECTED_EQUIPMENT__?.()?.id};
 },{spec});
 assert.equal(selected.result.status,'accepted');assert.equal(selected.selected,'chest-row','existing Flow selection lost exact canonical Object');
 let projected=await page.evaluate(spec=>window.__AXIS_831_PLAYABLE__.project(spec,'attempt-1'),spec);
 assert.equal(projected.phase,'awaiting-fact');
 assert.equal(await page.evaluate(({spec})=>window.__AXIS_831_PLAYABLE__.plan(window.__AXIS_831_PLAYABLE__.project(spec,'attempt-1'),'advance','premature').ok,{spec}),false,'no early advancement without Encounter');
 if(await page.locator('#scanSheet.show').count()){
  await tap(page.locator('#scanSheet [data-close="scanSheet"]').first());
  await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:5000});
 }
 await page.waitForFunction(()=>document.querySelector('#quickRecordBtn')&&document.querySelector('#dock')?.classList.contains('show'),undefined,{timeout:5000});
 await tap(page.locator('#quickRecordBtn'));
 await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:5000});
 await tap(page.locator('#v8Other'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:5000});
 const name=await page.evaluate(()=>(window.__AXIS_873_LIBRARY__||[]).find(x=>x.id==='chest-row')?.name);
 assert.ok(name,'canonical native Object disappeared from catalog');
 await page.locator('#eqSearch').fill(name);
 await page.waitForFunction(()=>!!document.querySelector('#v873SmartResults [data-v8124-pick="chest-row"]'),undefined,{timeout:4500});
 await tap(page.locator('#v873SmartResults [data-v8124-pick="chest-row"]').first());
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:4500});
 for(const input of await page.locator('#axis818MetricRecorder.show [data-axis818-metric]').all()){
  const key=await input.getAttribute('data-axis818-metric');
  if(['weight','reps','sets','duration','intensity'].includes(key))await input.fill(key==='weight'?'25':key==='duration'?'4':'8');
 }
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (s.active?.events||[]).some(e=>e.equipmentId==='chest-row'&&e.flowProvenance?.flowStepRef==='chest-first');},undefined,{timeout:8000});
 const saved=(await snapshot());const event=saved.active.events.find(x=>x.flowProvenance?.flowStepRef==='chest-first');
 assert.equal(event.equipmentId,'chest-row');assert.equal(event.flowProvenance.flowRef,flow.id);
 assert.equal(JSON.stringify(saved.sessions[0].events[0]),old,'legacy history changed');
 await page.reload({waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_831_PLAYABLE__,undefined,{timeout:18000});
 const advanced=await page.evaluate(spec=>{
  const p=window.__AXIS_831_PLAYABLE__,flow=window.__AXIS_FLOW_RUNTIME__;
  const phase=p.project(spec,'attempt-1'),command=p.plan(phase,'advance','req-complete');
  const result=p.dispatch(spec,'attempt-1',command),repeated=p.dispatch(spec,'attempt-1',command);
  return {phase,command,result,repeated,final:p.project(spec,'attempt-1'),run:flow.run()};
 },spec);
 assert.equal(advanced.phase.phase,'ready-to-advance','must restore actual Encounter before advancement');
 assert.equal(advanced.command.evidenceId,event.id);
 assert.equal(advanced.result.status,'accepted');
 assert.equal(advanced.repeated.status,'stale');
 assert.equal(advanced.final.phase,'complete');
 assert.equal(advanced.run.consumedStepRefs.length,1);
 const final=await snapshot();assert.equal(final.active.events.filter(x=>x.id===event.id).length,1,'Playable duplicated canonical Encounter');
 assert.equal(JSON.stringify(final.sessions[0].events[0]),old);
 assert.deepEqual(pageErrors,[],'browser runtime errors: '+pageErrors.join('\n'));
 console.log('[AXIS 8.31 Playable '+ENGINE+'] PASS · existing Flow owner launch/selection · real Quick Record confirmed exact Encounter provenance · reload · verified advancement · duplicate/stale safe · legacy history unchanged');
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
