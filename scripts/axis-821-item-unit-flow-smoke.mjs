import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 Flow Active ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:5000}):l.click({timeout:5000});
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const meta=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'));
const waitCore=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_FLOW_RUNTIME__?.beginCurrent&&window.__AXIS_FLOW_RUNTIME__?.beginDetour&&window.__AXIS_821_FLOW_ACTIVE_CONVERGENCE__?.activeLifecycleDelegated!==false&&window.__AXIS_821_ITEM_UNIT_FLOW__?.canonicalCurrentRecord===true,undefined,{timeout:9000});
};
const holdFinish=async()=>{
 const f=page.locator('#axis821FlowHome [data-axis-flow-active-finish]');await f.waitFor({state:'visible',timeout:5000});const b=await f.boundingBox();assert.ok(b,'integrated Flow finish geometry missing');
 const init={pointerId:71,pointerType:'touch',isPrimary:true,clientX:b.x+b.width/2,clientY:b.y+b.height/2,button:0,buttons:1,bubbles:true};
 await f.dispatchEvent('pointerdown',init);await page.waitForTimeout(1660);await f.dispatchEvent('pointerup',{...init,buttons:0});
};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{
  localStorage.clear();
  const complete={id:'flow-complete',name:'一次完成测试',type:'strength',pattern:'core',muscles:['核心'],effect:'一次完成',custom:true,metricSchema:[],metricSchemaVersion:'8.21',executionMode:'complete',recording:{version:2,metrics:[],executionMode:'complete'}};
  const detour={id:'flow-detour',name:'临时计时测试',type:'cardio',pattern:'cardio',muscles:['心肺'],effect:'临时记录',custom:true,metricSchema:[{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1}],metricSchemaVersion:'8.21',executionMode:'timed',recording:{version:2,metrics:['duration'],executionMode:'timed'}};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[complete,detour],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },now);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] empty Today keeps Flow entry compact`);
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'empty');
 assert.equal(await page.locator('#axis821FlowHome [data-axis-flow-new]').count(),1);

 const flow={schema:'axis.flow.v1',id:'active-convergence-proof',steps:[{id:'s1',objectRef:'chest'},{id:'s2',objectRef:'flow-complete'}]};
 await page.evaluate(f=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(f);window.__AXIS_821_FLOW_SURFACE__.render()},flow);
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')?.dataset.state==='ready',undefined,{timeout:2500});

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] launch embeds Flow context into the existing session surface`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-start="active-convergence-proof"]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='active'&&window.__AXIS_FLOW_RUNTIME__?.run?.()?.cursor===0,undefined,{timeout:3000});
 assert.equal(await page.locator('#axis821FlowHome').evaluate(x=>x.parentElement?.id),'activeHome','Flow remained a second panel outside the existing Active session surface');
 let text=await page.locator('#axis821FlowHome').innerText();assert.ok(text.includes('流程 · 1 / 2'));assert.ok(text.includes('胸推'));assert.ok(text.includes('开始此项'));assert.ok(!text.includes('完成此项'),'parallel direct-completion CTA survived');
 let c=await core();assert.ok(c.active?.id);assert.equal(c.active.events.length,0,'Flow launch fabricated an Encounter');

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] current item uses the canonical recorder, then the existing v82/v87 Active lifecycle`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#axis821FlowRecordContext')?.dataset.mode==='current'&&document.querySelector('#equipmentName')?.textContent?.trim()==='胸推',undefined,{timeout:3500});
 const recorderText=await page.locator('#axis821FlowRecordContext').innerText();assert.ok(recorderText.includes('流程 · 1 / 2'));assert.ok(recorderText.includes('胸推'));
 assert.equal((await page.locator('#saveScan').innerText()).trim(),'开始此项');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),r=c.flowRun,e=(c.active?.events||[]).find(x=>x.id===r?.currentEncounterId);return r?.cursor===0&&e?.equipmentId==='chest'&&m.events?.[e.id]?.activity?.status==='active'&&document.querySelector('#v87Now')?.classList.contains('show')},undefined,{timeout:5500});
 c=await core();let m=await meta();const first=c.active.events.find(e=>e.id===c.flowRun.currentEncounterId);assert.ok(first?.id);assert.equal(first.flowProvenance?.flowRef,flow.id);assert.equal(first.flowProvenance?.flowStepRef,'s1');assert.equal(first.executionModeSnapshot,'sets');assert.equal(c.flowRun.cursor,0,'ongoing item advanced on initial record instead of Active completion');
 await page.waitForFunction(()=>{const host=document.querySelector('#axis821FlowHome'),coord=window.__AXIS_821_FLOW_SESSION_COORDINATION__;return host?.querySelector('.axis821FlowActiveProjection')&&host.querySelector('[data-axis-flow-active-toggle]')&&host.querySelector('[data-axis-flow-active-finish]')&&coord?.activeOwner==='v87'&&coord?.newActiveOwner===false&&coord?.integratedToggleDelegatesActiveOwner===true},undefined,{timeout:3000});
 text=await page.locator('#axis821FlowHome').innerText();assert.ok(text.includes('当前项目 · 进行中'));assert.ok(!text.includes('跳过'),'started item still exposed skip as if it had not begun');
 assert.equal(await page.locator('#axis821FlowHome .axis821FlowActiveProjection').count(),1,'Flow did not project the canonical Active lifecycle');
 assert.equal(await page.locator('#axis821FlowHome [data-axis-flow-active-toggle]').count(),1,'Flow Active projection lost delegated pause/resume');
 assert.equal(await page.locator('#axis821FlowHome [data-axis-flow-active-finish]').count(),1,'Flow Active projection lost delegated finish');
 assert.equal(await page.locator('#axis821FlowHome [data-axis-flow-active-set]').count(),1,'set-mode Flow Active projection lost delegated set completion');
 const coordination=await page.evaluate(()=>window.__AXIS_821_FLOW_SESSION_COORDINATION__);assert.equal(coordination.activeOwner,'v87');assert.equal(coordination.integratedToggleDelegatesActiveOwner,true);assert.equal(coordination.newActiveOwner,false);assert.equal(coordination.newRecorder,false);assert.equal(coordination.newEncounterWriter,false);
 assert.equal(await page.locator('#v87Name').innerText(),'胸推');assert.ok((await page.locator('#v87Primary').innerText()).includes('完成一组'));
 assert.equal(await page.locator('#v87Now').evaluate(x=>getComputedStyle(x).display),'none','duplicate v87 card remained visible beside integrated Flow Active projection');

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] visible Flow controls delegate set/rest/pause/resume to the established Active owner`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-active-set]'));
 await page.waitForFunction(id=>{const m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),a=m.events?.[id]?.activity,host=document.querySelector('#axis821FlowHome');return Number(a?.completedSets)>=1&&Number(a?.restStartedAt)>0&&host?.querySelector('.axis821FlowActiveProjection')?.textContent?.includes('休息')},first.id,{timeout:2500});
 await tap(page.locator('#axis821FlowHome [data-axis-flow-active-toggle]'));
 await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='paused',first.id,{timeout:2500});
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')?.dataset.substate==='paused'&&document.querySelector('#axis821FlowHome [data-axis-flow-active-toggle]')?.textContent?.includes('继续'),undefined,{timeout:2500});
 assert.equal((await core()).flowRun.cursor,0,'pause changed Flow sequencing');
 await tap(page.locator('#axis821FlowHome [data-axis-flow-active-toggle]'));
 await page.waitForFunction(id=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.[id]?.activity?.status==='active',first.id,{timeout:2500});
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')?.dataset.substate==='active'&&document.querySelector('#axis821FlowHome [data-axis-flow-active-toggle]')?.textContent?.trim()==='暂停',undefined,{timeout:2500});

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] temporary other is a record-only detour: no skip, no second Active, current item remains active`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-other]'));
 await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:2500});
 const picked=await page.evaluate(()=>window.__AXIS_PICK_EQUIPMENT__?.('flow-detour',true));assert.equal(picked,true,'canonical select-only picker did not return detour Object');
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#axis821FlowRecordContext')?.dataset.mode==='detour'&&document.querySelector('#equipmentName')?.textContent?.trim()==='临时计时测试',undefined,{timeout:3500});
 assert.ok((await page.locator('#axis821FlowRecordContext').innerText()).includes('不会跳过当前流程项'));
 assert.equal((await page.locator('#saveScan').innerText()).trim(),'记下，不改变流程');
 const duration=page.locator('[data-axis818-metric="duration"]');if(await duration.count())await duration.fill('2');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return (c.active?.events||[]).some(e=>e.equipmentId==='flow-detour')},undefined,{timeout:3500});
 await page.waitForTimeout(250);c=await core();m=await meta();const detour=c.active.events.find(e=>e.equipmentId==='flow-detour');assert.ok(detour?.id);assert.equal(detour.flowProvenance,undefined,'detour inherited current Flow provenance');assert.equal(detour.flowDetour?.recordOnly,true);assert.equal(m.events?.[detour.id]?.activity??null,null,'timed detour started a standalone Active item');assert.equal(m.events?.[first.id]?.activity?.status,'active','detour displaced or paused the current Flow Active item');assert.equal(c.flowRun.cursor,0,'detour skipped/consumed the current Flow item');assert.equal(c.flowRun.currentEncounterId,first.id,'detour replaced current Flow Active Encounter');
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome .axis821FlowActiveProjection')&&document.querySelector('#axis821FlowHome')?.dataset.substate==='active'&&document.querySelector('#axis821FlowHome [data-axis-flow-active-toggle]')?.textContent?.trim()==='暂停',undefined,{timeout:3000});

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] delegated Active finish is the only ongoing-item completion signal that advances Flow`);
 await holdFinish();
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.cursor===1,undefined,{timeout:4500});
 c=await core();m=await meta();assert.equal(m.events?.[first.id]?.activity?.status,'finished');assert.equal(c.flowRun.currentEncounterId,null);assert.ok(c.flowRun.consumedStepRefs.includes('s1'));
 text=await page.locator('#axis821FlowHome').innerText();assert.ok(text.includes('流程 · 2 / 2'));assert.ok(text.includes('一次完成测试'));assert.ok(text.includes('开始此项'));

 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] one-shot current item advances only after its canonical Encounter commit`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#axis821FlowRecordContext')?.dataset.mode==='current'&&document.querySelector('#equipmentName')?.textContent?.trim()==='一次完成测试',undefined,{timeout:3500});
 assert.equal((await page.locator('#saveScan').innerText()).trim(),'完成并继续');
 assert.equal(await page.locator('#axis818MetricRecorder [data-axis818-metric]').count(),0,'explicit empty one-shot unexpectedly gained value controls');
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='complete',undefined,{timeout:4000});
 c=await core();m=await meta();const one=c.active.events.find(e=>e.equipmentId==='flow-complete');assert.ok(one?.id);assert.deepEqual(one.metricSchemaSnapshot,[]);assert.equal(one.executionModeSnapshot,'complete');assert.equal(one.flowProvenance?.flowRef,flow.id);assert.equal(one.flowProvenance?.flowStepRef,'s2');assert.equal(m.events?.[one.id]?.activity??null,null,'one-shot Flow item created false Active metadata');
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'complete');
 const completeText=await page.locator('#axis821FlowHome').innerText();assert.ok(completeText.includes('流程完成'));assert.ok(completeText.includes('2 项完成'));

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Flow Active ${ENGINE}] PASS · integrated projection delegates set/rest/pause/resume/finish to v87 · detour record-only/no-skip/no-Active · one-shot canonical advance`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
