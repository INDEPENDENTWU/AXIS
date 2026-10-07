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

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const objects=['a','b','c'].map((id,i)=>({id:'pl-'+id,name:['胸推','划船','肩推'][i],type:'cardio',pattern:'cardio',muscles:[],effect:'',custom:true,metricSchema:[{key:'duration',label:'时间',type:'duration',unit:'分钟',step:1}],metricSchemaVersion:'8.21',executionMode:'timed',recording:{version:2,metrics:['duration'],executionMode:'timed'}}));
  await page.evaluate(objects=>{
    localStorage.clear();
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:objects,memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
  },objects);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.28'&&window.__AXIS_828_PRACTICE_LOOP__?.schema==='axis.practice-loop.v1'&&window.__AXIS_FLOW_RUNTIME__?.practiceLoop,undefined,{timeout:15000});

  const flow={schema:'axis.flow.v1',id:'pl-proof',title:'Practice Loop proof',steps:[{id:'s1',objectRef:'pl-a'},{id:'s2',objectRef:'pl-b'},{id:'s3',objectRef:'pl-c'}]};
  await page.evaluate(flow=>{window.__AXIS_FLOW_RUNTIME__.saveFlow(flow);window.__AXIS_FLOW_RUNTIME__.launch(flow.id);window.__AXIS_821_FLOW_SURFACE__.render()},flow);
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__.practiceLoop().phase==='ready'&&document.querySelector('#axis821FlowHome')?.dataset.loopPhase==='ready',undefined,{timeout:3500});
  const keysBefore=await page.evaluate(()=>Object.keys(localStorage).sort());

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.practiceLoop?.().phase==='ready'&&document.querySelector('#axis821FlowHome')?.dataset.loopPhase==='ready',undefined,{timeout:12000});
  const restored=await page.evaluate(()=>({loop:window.__AXIS_FLOW_RUNTIME__.practiceLoop(),run:window.__AXIS_FLOW_RUNTIME__.run(),keys:Object.keys(localStorage).sort(),text:document.querySelector('#axis821FlowHome')?.innerText||''}));
  assert.equal(restored.loop.current.id,'s1');assert.equal(restored.loop.action.requiresPrompt,false);assert.deepEqual(restored.keys,keysBefore);assert.match(restored.text,/现在/);

  assert.equal(await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.beginCurrent()),true,'current item did not enter canonical Active owner');
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__.practiceLoop().phase==='executing',undefined,{timeout:4000});
  const active=await page.evaluate(()=>({loop:window.__AXIS_FLOW_RUNTIME__.practiceLoop(),run:window.__AXIS_FLOW_RUNTIME__.run(),state:JSON.parse(localStorage.getItem('axis_v60_state')||'{}')}));
  assert.ok(active.run.currentEncounterId);assert.equal(active.loop.active.id,active.run.currentEncounterId);assert.equal(active.loop.continuity.activeAuthoritative,true);
  const eventCount=active.state.active?.events?.length||0;

  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>['executing','paused'].includes(window.__AXIS_FLOW_RUNTIME__?.practiceLoop?.().phase),undefined,{timeout:12000});
  const afterReload=await page.evaluate(()=>({loop:window.__AXIS_FLOW_RUNTIME__.practiceLoop(),state:JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),text:document.querySelector('#axis821FlowHome')?.innerText||''}));
  assert.equal((afterReload.state.active?.events?.length||0),eventCount,'reload duplicated Encounter');
  assert.equal(afterReload.loop.current.id,'s1');assert.equal(afterReload.loop.action.requiresPrompt,false);
  assert.match(afterReload.text,/返回后会停在这里|已暂停 · 继续后从这里恢复/);

  const activeId=await page.evaluate(()=>window.__AXIS_FLOW_RUNTIME__.run().currentEncounterId);
  await page.evaluate(id=>window.__AXIS_ACTIVE_RUNTIME__.pause(id),activeId);
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__.practiceLoop().phase==='paused',undefined,{timeout:3000});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.practiceLoop?.().phase==='paused',undefined,{timeout:12000});
  assert.match(await page.locator('[data-axis-practice-loop-status]').innerText(),/已暂停/);

  assert.deepEqual(errors,[],'page errors:\n'+errors.join('\n'));
  console.log('[AXIS 8.28 Practice Loop '+ENGINE+'] PASS · launch → reload-ready → canonical Active → reload-active → pause → reload-paused · zero duplicate Encounter/storage · prompt-free continuity');
}finally{
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}
