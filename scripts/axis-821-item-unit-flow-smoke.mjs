import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')console.log(`[AXIS 8.21 item-unit Flow ${ENGINE} console] ${m.text()}`)});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:4000}):l.click({timeout:4000});
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const meta=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'));
const waitCore=async()=>{
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.version==='8.21'&&window.__AXIS_FLOW_RUNTIME__?.itemUnit===true&&window.__AXIS_821_ITEM_UNIT_FLOW__?.directCurrentCompletion===true&&window.__AXIS_821_FLOW_SURFACE__?.version==='8.21',undefined,{timeout:9000});
};

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 const now=Date.now();
 await page.evaluate(t=>{
  localStorage.clear();
  const detour={id:'flow-detour',name:'临时项目',type:'strength',pattern:'core',muscles:['核心'],effect:'临时记录',custom:true,metricSchema:[],metricSchemaVersion:'8.21',executionMode:'complete',recording:{version:2,metrics:[],executionMode:'complete'}};
  localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[detour],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
  localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
 },now);
 await page.reload({waitUntil:'domcontentloaded'});await waitCore();

 console.log(`[AXIS 8.21 item-unit Flow ${ENGINE}] empty Today keeps Flow entry compact`);
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'empty');
 assert.equal(await page.locator('#axis821FlowHome [data-axis-flow-new]').count(),1);
 const emptyH=await page.locator('.axis821FlowCompactEmpty').evaluate(x=>Math.round(x.getBoundingClientRect().height));
 assert.ok(emptyH>=50&&emptyH<=58,`empty Flow entry is not compact: ${emptyH}`);
 const emptyText=await page.locator('#axis821FlowHome').innerText();assert.ok(!emptyText.includes('把常用项目排成一个顺序'),'Home still behaves like a Flow feature landing page');

 const flow={schema:'axis.flow.v1',id:'item-unit-proof',steps:[{id:'s1',objectRef:'chest'},{id:'s2',objectRef:'shoulder'},{id:'s3',objectRef:'pec'}]};
 await page.evaluate(f=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(f);window.__AXIS_821_FLOW_SURFACE__.render()},flow);
 await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')?.dataset.state==='ready',undefined,{timeout:2500});
 const readyText=await page.locator('#axis821FlowHome').innerText();assert.ok(readyText.includes('3 个项目'));assert.ok(readyText.includes('胸推'));assert.ok(readyText.includes('肩推'));assert.ok(readyText.includes('飞鸟 / 后三角'));

 console.log(`[AXIS 8.21 item-unit Flow ${ENGINE}] start goes directly to item 1 without Quick Record or set lifecycle`);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-start="item-unit-proof"]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='active'&&window.__AXIS_FLOW_RUNTIME__?.run?.()?.cursor===0,undefined,{timeout:3000});
 let c=await core();assert.ok(c.active?.id,'Flow start did not start the containing Session');assert.equal(c.active.events.length,0,'Flow start fabricated an Encounter');
 let homeText=await page.locator('#axis821FlowHome').innerText();assert.ok(homeText.includes('流程 · 1 / 3'));assert.ok(homeText.includes('胸推'));assert.ok(homeText.includes('接下来 · 肩推'));assert.ok(!homeText.includes('最后一项'),'first Flow item was incorrectly labelled final');assert.ok(homeText.includes('完成此项'));assert.ok(!homeText.includes('记录当前'));
 assert.equal(await page.locator('#scanSheet').evaluate(x=>x.classList.contains('show')),false,'Flow start opened standalone Quick Record');
 assert.equal(await page.locator('text=完成一组').evaluateAll(xs=>xs.filter(x=>x.offsetParent!==null).length),0,'Flow started a set-level Active lifecycle');

 await page.waitForTimeout(120);
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.cursor===1,undefined,{timeout:3000});
 c=await core();assert.equal(c.active.events.length,1,'item completion did not commit exactly one Encounter');
 const first=c.active.events[0];assert.equal(first.equipmentId,'chest');assert.equal(first.executionModeSnapshot,'complete');assert.equal(first.flowProvenance?.flowRef,flow.id);assert.equal(first.flowProvenance?.flowStepRef,'s1');assert.equal(first.flowProvenance?.stepSnapshot?.effectiveExecutionMode,'complete');assert.ok(Number(first.flowItem?.completedAt)>=Number(first.flowItem?.startedAt));
 let m=await meta();assert.equal(m.events?.[first.id]?.activity??null,null,'item completion created false set/timed Active metadata');
 homeText=await page.locator('#axis821FlowHome').innerText();assert.ok(homeText.includes('流程 · 2 / 3'));assert.ok(homeText.includes('肩推'));assert.ok(homeText.includes('接下来 · 飞鸟 / 后三角'));
 assert.equal(await page.locator('#scanSheet').evaluate(x=>x.classList.contains('show')),false,'complete-current detoured through Quick Record');
 assert.equal(await page.locator('text=完成一组').evaluateAll(xs=>xs.filter(x=>x.offsetParent!==null).length),0,'completed Flow item revealed set-level controls');

 console.log(`[AXIS 8.21 item-unit Flow ${ENGINE}] ordinary Quick Record during Flow is factual detour, not Flow completion`);
 await page.evaluate(()=>window.__AXIS_QUICK_RECORD__?.openFor?.('flow-detour'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('#equipmentName')?.textContent?.trim()==='临时项目',undefined,{timeout:3500});
 await tap(page.locator('#saveScan'));
 await page.waitForFunction(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return c.active?.events?.some(e=>e.equipmentId==='flow-detour')},undefined,{timeout:3500});
 c=await core();assert.equal(c.flowRun.cursor,1,'ordinary Quick Record consumed the current Flow item');
 const detour=c.active.events.find(e=>e.equipmentId==='flow-detour');assert.ok(detour?.id);assert.equal(detour.flowProvenance,undefined,'ordinary Quick Record inherited Flow provenance');

 console.log(`[AXIS 8.21 item-unit Flow ${ENGINE}] skip changes intent only; final item completes the Flow`);
 const beforeSkip=c.active.events.length;
 await tap(page.locator('#axis821FlowHome [data-axis-flow-skip]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.cursor===2,undefined,{timeout:2500});
 c=await core();assert.equal(c.active.events.length,beforeSkip,'skip fabricated an Encounter');assert.deepEqual(c.flowRun.skippedStepRefs,['s2']);
 homeText=await page.locator('#axis821FlowHome').innerText();assert.ok(homeText.includes('流程 · 3 / 3'));assert.ok(homeText.includes('飞鸟 / 后三角'));assert.ok(homeText.includes('最后一项'));assert.ok(!homeText.includes('接下来 ·'));
 await tap(page.locator('#axis821FlowHome [data-axis-flow-record]'));
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.run?.()?.status==='complete',undefined,{timeout:3000});
 c=await core();const flowEvents=c.active.events.filter(e=>e.flowProvenance?.flowRef===flow.id);assert.equal(flowEvents.length,2);assert.deepEqual(flowEvents.map(e=>e.equipmentId),['chest','pec']);assert.deepEqual(flowEvents.map(e=>e.executionModeSnapshot),['complete','complete']);assert.equal(c.active.events.some(e=>e.equipmentId==='shoulder'),false,'skipped item became factual history');
 assert.equal(await page.locator('#axis821FlowHome').getAttribute('data-state'),'complete');
 const completeText=await page.locator('#axis821FlowHome').innerText();assert.ok(completeText.includes('流程完成'));assert.ok(completeText.includes('2 项完成'));assert.ok(completeText.includes('1 项跳过'));

 console.log(`[AXIS 8.21 item-unit Flow ${ENGINE}] standalone Quick Record remains usable after Flow completion`);
 await page.evaluate(()=>window.__AXIS_QUICK_RECORD__?.openFor?.('flow-detour'));
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:3000});
 await tap(page.locator('#saveScan'));
 await page.waitForTimeout(180);
 c=await core();const detours=c.active.events.filter(e=>e.equipmentId==='flow-detour');assert.equal(detours.length,2);assert.ok(detours.every(e=>!e.flowProvenance),'standalone Quick Record gained Flow provenance');assert.equal(c.flowRun.status,'complete','standalone record rewrote completed Flow state');

 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 item-unit Flow ${ENGINE}] PASS · compact Home · start→item 1 · complete item→next · no Quick/set detour · ordinary Quick cannot advance · skip factuality · final completion`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
