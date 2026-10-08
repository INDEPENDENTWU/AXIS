import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const metric=(key,label,unit,step)=>({key,label,type:'number',unit,step,min:0,max:999});
const OBJECT={id:'axis829-proof',name:'Record Continuity Proof',type:'cardio',pattern:'cardio',muscles:[],effect:'',custom:true,
  metricSchema:[metric('duration','时长','分钟',1),metric('intensity','强度','级',1)],
  metricSchemaVersion:'8.21',executionMode:'single',
  recording:{version:2,metrics:['duration','intensity'],executionMode:'single'}};
const FLOW={schema:'axis.flow.v1',id:'axis829-flow',title:'Record Continuity',steps:[{id:'s1',objectRef:OBJECT.id,executionOverride:'single'}],metadata:{createdAt:1,updatedAt:1}};
const read=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const openNext=async()=>{
 await page.evaluate(id=>{const x=window.__AXIS_FLOW_RUNTIME__;x.launch(id);window.__AXIS_821_FLOW_SURFACE__.render()},FLOW.id);
 await page.waitForFunction(()=>window.__AXIS_FLOW_RUNTIME__?.current?.()?.objectRef==='axis829-proof',undefined,{timeout:3500});
 const btn=page.locator('#axis821FlowHome [data-axis-flow-record]');await btn.waitFor({state:'visible',timeout:4000});
 if(ENGINE==='webkit')await btn.tap();else await btn.click();
 await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&document.querySelector('[data-axis818-metric="duration"]'),undefined,{timeout:5000});
};
try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  await page.evaluate(obj=>{
    localStorage.clear();
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[],active:null,flows:[],flowRun:null,profile:{customEq:[obj],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
  },OBJECT);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.29'&&window.__AXIS_829_RECORDING__?.schema==='axis.recording-continuity.v1',undefined,{timeout:15000});
  await page.evaluate(flow=>window.__AXIS_FLOW_RUNTIME__.saveFlow(flow),FLOW);
  const keysBefore=await page.evaluate(()=>Object.keys(localStorage).sort());
  const cap=await page.evaluate(()=>({version:window.__AXIS_829_RECORDING__.version,source:window.__AXIS_829_RECORDING__.source,noNewStorage:window.__AXIS_829_RECORDING__.noNewStorage,noEncounterWriter:window.__AXIS_829_RECORDING__.noEncounterWriter}));
  assert.equal(cap.version,'8.29');assert.equal(cap.noNewStorage,true);assert.equal(cap.noEncounterWriter,true);

  await openNext();
  assert.equal(await page.locator('[data-axis829-context]').count(),0,'no previous fact must not display a reuse claim');
  await page.locator('[data-axis818-metric="duration"]').fill('30');
  await page.locator('[data-axis818-metric="intensity"]').fill('6');
  await page.evaluate(()=>{document.querySelector('#saveScan').click();document.querySelector('#saveScan').click()});
  await page.waitForFunction(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return s.active?.events?.filter(e=>e.equipmentId==='axis829-proof').length===1},undefined,{timeout:6500});
  let s=await read(),events=s.active.events.filter(e=>e.equipmentId===OBJECT.id);
  assert.equal(events.length,1,'double click created duplicate Encounter');
  const first=events[0],historicalFact=e=>JSON.stringify({id:e.id,time:e.time,metrics:e.metrics,metricSchemaSnapshot:e.metricSchemaSnapshot,flowProvenance:e.flowProvenance}),frozen=historicalFact(first);
  assert.equal(Number(first.metrics?.duration),30);assert.equal(Number(first.metrics?.intensity),6);
  assert.ok(first.metricSchemaSnapshot?.length>=2,'confirmed fact missing metric schema snapshot');

  await openNext();
  await page.waitForFunction(()=>!!document.querySelector('[data-axis829-context]'),undefined,{timeout:4000});
  assert.match(await page.locator('[data-axis829-context]').innerText(),/上次確認的記錄/);
  assert.equal(await page.locator('[data-axis818-metric="duration"]').inputValue(),'30','compatible last value was not suggested');
  await page.locator('[data-axis818-metric="duration"]').fill('33');
  await page.evaluate(()=>window.__AXIS_829_RECORDING__.render());
  assert.equal(await page.locator('[data-axis818-metric="duration"]').inputValue(),'33','live unsaved draft lost on presentation rerender');
  // Real inherited re-entry: AXIS 8.20 clears the canonical render key and
  // rebuilds the recorder. A direct render() call alone does not cover this.
  assert.equal(await page.evaluate(id=>window.__AXIS_EXECUTABLE_OBJECTS__.beginQuickRecorder(id),OBJECT.id),true,
    'canonical Quick Recorder re-entry failed');
  assert.equal(await page.locator('[data-axis818-metric="duration"]').inputValue(),'33',
    'Quick Recorder key invalidation discarded the unsaved same-object draft');
  assert.equal((await read()).active.events.filter(e=>e.equipmentId===OBJECT.id).length,1,'render duplicated historical facts');
  const reuse=page.locator('[data-axis829-reuse]');
  if(ENGINE==='webkit')await reuse.tap();else await reuse.click();
  assert.equal(await page.locator('[data-axis818-metric="duration"]').inputValue(),'30','reapplying confirmed last values failed');
  await page.locator('[data-axis818-metric="duration"]').fill('34');
  await page.locator('#saveScan').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').active?.events?.filter(e=>e.equipmentId==='axis829-proof').length===2,undefined,{timeout:6500});
  s=await read();events=s.active.events.filter(e=>e.equipmentId===OBJECT.id);
  assert.equal(events.length,2);
  assert.equal(historicalFact(events[0]),frozen,'previous confirmed Encounter metrics, schema or provenance was mutated');
  assert.equal(Number(events[1].metrics.duration),34);
  assert.equal(Number(events[1].metrics.intensity),6);

  // Object schema change is another real inherited rerender route. Changing
  // presentation/options alone must invalidate unsaved values from the old
  // control definition even if the metric key, type, unit and bounds agree.
  await openNext();
  await page.locator('[data-axis818-metric="duration"]').fill('47');
  await page.evaluate(({id,schema})=>{
    const next=schema.map(m=>({...m}));
    next[0].presentation='timer';
    next[0].options=[{value:'10',label:'Ten'}];
    window.dispatchEvent(new CustomEvent('axis:object-schema-changed',{
      detail:{id,schema:next,metricSchemaVersion:'8.29-test-schema-shift'}
    }));
  },{id:OBJECT.id,schema:OBJECT.metricSchema});
  assert.notEqual(await page.locator('[data-axis818-metric="duration"]').inputValue(),'47',
    'schema presentation/options change illegally restored old draft');
  assert.equal((await read()).active.events.filter(e=>e.equipmentId===OBJECT.id).length,2,
    'changing recorder schema wrote another Encounter');

  assert.deepEqual(await page.evaluate(()=>Object.keys(localStorage).sort()),keysBefore,'Recording created new persistent namespace');

  const overflow=await page.evaluate(()=>Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth);
  assert.ok(overflow<=1,'390px horizontal overflow '+overflow);
  assert.deepEqual(errors,[],'page errors:\n'+errors.join('\n'));
  console.log('[AXIS 8.29 Recording '+ENGINE+'] PASS · Flow one-shot Record → double-click single Encounter → compatible last-value suggestion → draft rerender + Quick Recorder re-entry retention → explicit reuse → next canonical fact · immutable history · no new storage');
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
