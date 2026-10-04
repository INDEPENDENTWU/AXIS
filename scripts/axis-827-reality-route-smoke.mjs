import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e&&e.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:5000}):l.click({timeout:5000});
const core=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const objects=['lat','row','shoulder','curl'].map((id,i)=>({id:'rr-'+id,name:['下拉','划船','肩推','弯举'][i],type:'cardio',pattern:'cardio',muscles:[],effect:'',custom:true,metricSchema:[{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1}],metricSchemaVersion:'8.21',executionMode:'timed',recording:{version:2,metrics:['duration'],executionMode:'timed'}}));
  await page.evaluate(objects=>{
    localStorage.clear();
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:objects,memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
  },objects);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.27'&&window.__AXIS_FLOW_RUNTIME__&&window.__AXIS_FLOW_RUNTIME__.version==='8.21'&&window.__AXIS_827_REALITY_ROUTE__&&window.__AXIS_827_REALITY_ROUTE__.schema==='axis.reality-route.v1',undefined,{timeout:15000});

  const flow={schema:'axis.flow.v1',id:'rr-proof',title:'Reality Route proof',steps:[
    {id:'s1',objectRef:'rr-lat'},
    {id:'s2',objectRef:'rr-row'},
    {id:'s3',objectRef:'rr-shoulder'},
    {id:'s4',objectRef:'rr-curl'}
  ]};
  await page.evaluate(flow=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(flow);window.__AXIS_FLOW_RUNTIME__.launch(flow.id);window.__AXIS_821_FLOW_SURFACE__.render()},flow);
  await page.waitForFunction(()=>document.querySelector('#axis821FlowHome')&&document.querySelector('#axis821FlowHome').dataset.state==='active'&&document.querySelector('#axis821FlowHome [data-axis-flow-defer]'),undefined,{timeout:3500});

  const before=await page.evaluate(()=>({
    flow:window.__AXIS_FLOW_RUNTIME__.list().find(x=>x.id==='rr-proof'),
    route:window.__AXIS_FLOW_RUNTIME__.project(),
    events:(JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active||{}).events||[],
    keys:Object.keys(localStorage).sort()
  }));
  assert.equal(before.route.current.id,'s1');
  assert.equal(before.events.length,0,'launch fabricated Encounter');

  await tap(page.locator('#axis821FlowHome [data-axis-flow-defer]'));
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__.project&&window.__AXIS_FLOW_RUNTIME__.project().current&&window.__AXIS_FLOW_RUNTIME__.project().current.id==='s2',undefined,{timeout:2500});
  const after=await page.evaluate(()=>({
    flow:window.__AXIS_FLOW_RUNTIME__.list().find(x=>x.id==='rr-proof'),
    route:window.__AXIS_FLOW_RUNTIME__.project(),
    run:window.__AXIS_FLOW_RUNTIME__.run(),
    events:(JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active||{}).events||[],
    keys:Object.keys(localStorage).sort(),
    text:(document.querySelector('#axis821FlowHome')&&document.querySelector('#axis821FlowHome').innerText)||''
  }));
  assert.deepEqual(after.flow,before.flow,'defer mutated reusable Flow definition');
  assert.equal(after.events.length,0,'defer fabricated Encounter');
  assert.deepEqual(after.keys,before.keys,'defer introduced a new storage namespace');
  assert.deepEqual(after.run.temporaryConstraints,{schema:'axis.execution-constraints.v1',deferredStepRefs:['s1']});
  assert.equal(after.route.current.id,'s2');
  assert.equal(after.route.next.id,'s3');
  assert.deepEqual(after.route.remaining.map(x=>x.id),['s2','s3','s4','s1']);
  assert.deepEqual(after.route.deferred.map(x=>x.id),['s1']);
  assert.match(after.text,/稍后 1 项/);

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__&&window.__AXIS_FLOW_RUNTIME__.version==='8.21'&&window.__AXIS_FLOW_RUNTIME__.project&&window.__AXIS_FLOW_RUNTIME__.project().current&&window.__AXIS_FLOW_RUNTIME__.project().current.id==='s2',undefined,{timeout:12000});
  const reloaded=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.project());
  assert.deepEqual(reloaded.remaining.map(x=>x.id),['s2','s3','s4','s1'],'temporary route did not survive existing FlowRun persistence');

  const started=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.beginCurrent&&window.__AXIS_FLOW_RUNTIME__.beginCurrent());
  assert.equal(started,true,'current ongoing item did not enter existing Active owner');
  await page.waitForFunction(()=>!!(window.__AXIS_FLOW_RUNTIME__.run&&window.__AXIS_FLOW_RUNTIME__.run().currentEncounterId),undefined,{timeout:3500});
  assert.equal(await page.locator('#axis821FlowHome [data-axis-flow-defer]').count(),0,'active item still exposed defer action');
  assert.equal(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.deferCurrent&&window.__AXIS_FLOW_RUNTIME__.deferCurrent()),false,'already-active item was deferrable');
  const activeState=await core();
  assert.equal(activeState.flowRun.currentStepRef,'s2');
  assert.ok(activeState.flowRun.currentEncounterId,'existing Active handoff missing');
  assert.deepEqual(activeState.flowRun.temporaryConstraints.deferredStepRefs,['s1'],'active admission altered deferred constraint');

  assert.deepEqual(errors,[],'page errors:\n'+errors.join('\n'));
  console.log('[AXIS 8.27 Reality Route '+ENGINE+'] PASS · defer reprojects s2→s3→s4→s1 · Flow immutable · no fabricated Encounter/storage · reload safe · active item authoritative');
}finally{
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}
