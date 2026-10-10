import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const engine=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await engine.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const tap=async x=>ENGINE==='webkit'?x.tap():x.click();
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [pattern,data] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,data));
const stored=()=>page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}'));
const startQuick=async id=>{
  // 8.20 beginQuickRecorder is only for explicit custom metric schemas. Native Objects
  // must enter through the real Quick Record + canonical picker, not that private bridge.
  const entry=await page.evaluate(()=>({url:location.pathname,core:window.__AXIS_CORE_INTERACTIVE__,quickReady:window.__AXIS_QUICK_READY__,dock:document.querySelector('#dock')?.className,quickCount:document.querySelectorAll('#quickRecordBtn').length,quickSheet:document.querySelector('#quickRecordSheet')?.className,eqSheet:document.querySelector('#eqSheet')?.className,scanSheet:document.querySelector('#scanSheet')?.className,active:(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return {id:s.active?.id,events:s.active?.events?.length}})()}));console.log('[AXIS 8.30 Quick entry]',id,JSON.stringify(entry));assert.equal(entry.quickCount,1,'Quick Record entry missing in real product runtime');
  // A successful Recording picker selection already opens Scan Review; close that
  // real modal before accessing the separately owned Quick Record dock entry.
  if(await page.locator('#scanSheet.show').count()){
    await tap(page.locator('#scanSheet [data-close="scanSheet"]').first());
    await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:5000});
  }
  await page.waitForFunction(()=>document.querySelector('#quickRecordBtn')&&document.querySelector('#dock')?.classList.contains('show'),undefined,{timeout:5000});
  await tap(page.locator('#quickRecordBtn'));
  await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'),undefined,{timeout:4500});
  await tap(page.locator('#v8Other'));
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:4500});
  const name=await page.evaluate(x=>(window.__AXIS_873_LIBRARY__||[]).find(e=>e.id===x)?.name||(JSON.parse(localStorage.getItem('axis_v60_state')||'{}').profile?.customEq||[]).find(e=>e.id===x)?.name||'',id);
  assert.ok(name,'Quick Record has no catalog name for '+id);
  await page.locator('#eqSearch').fill(name);
  await page.waitForFunction(x=>!!document.querySelector('#v873SmartResults [data-v8124-pick="'+x+'"]'),id,{timeout:4500});
  await tap(page.locator('#v873SmartResults [data-v8124-pick="'+id+'"]').first());
  await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show')&&!!document.querySelector('#saveScan'),undefined,{timeout:4500});
  assert.equal(await page.evaluate(()=>window.__AXIS_SELECTED_EQUIPMENT__?.()?.id),id,'Quick Record picked a different canonical ID');
  for(const input of await page.locator('#axis818MetricRecorder.show [data-axis818-metric]').all()){
    const key=await input.getAttribute('data-axis818-metric');
    if(['duration','weight','reps','sets','intensity'].includes(key))await input.fill(key==='duration'?'4':key==='weight'?'25':key==='intensity'?'5':'8');
  }
  await tap(page.locator('#saveScan'));
  await page.waitForFunction(x=>{
    const state=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');
    return (state.active?.events||[]).some(e=>e.equipmentId===x.id&&e.time>=x.since)
  },{id,since:Date.now()-15000},{timeout:6500});
};
try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  const now=Date.now();
  const historic={id:'E-LEGACY',equipmentId:'row',name:'划船',kind:'strength',time:now-120000,weight:40,reps:10,sets:3,metricSchemaSnapshot:[{key:'weight',unit:'kg'}]};
  await page.evaluate(({now,historic})=>{
    localStorage.clear();
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'H',start:now-180000,end:now-100000,events:[historic]}],active:null,flows:[],flowRun:null,profile:{customEq:[{id:'custom-identity-proof',name:'胸托划船',type:'strength',custom:true,pattern:'pull',muscles:['背部'],effect:''}],memories:[]},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify({events:{},prefs:{}}));
  },{now,historic});
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_RELEASE__==='8.30'&&window.__AXIS_829_RECORDING__?.schema==='axis.recording-continuity.v1',undefined,{timeout:18000});
  const native=await page.evaluate(()=>window.__AXIS_873_LIBRARY__.map(x=>({id:x.id,name:x.name,baseId:x.baseId})));
  const ids=new Set(native.map(x=>x.id));
  for(const id of ['seated-row','chest-row','leg-curl','seated-curl','lying-curl','run','treadmill'])assert.ok(ids.has(id),'native ID missing '+id);

  // Real ranked-search paths: two movements with the same base ID must not converge.
  await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('recording'));
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:3000});
  await page.locator('#eqSearch').fill('坐姿划船');
  await page.waitForFunction(()=>document.querySelector('#v873SmartResults')?.classList.contains('show')&&document.querySelector('#v873SmartResults [data-v8124-pick="seated-row"]'),undefined,{timeout:3000});
  await page.locator('#eqSearch').fill('胸托划船');
  const identityDiagnostic=await page.evaluate(()=>({custom:(JSON.parse(localStorage.getItem('axis_v60_state')||'{}').profile?.customEq||[]).map(x=>({id:x.id,name:x.name})),personal:window.__AXIS_EQUIPMENT_PICKER_DATA__?.personal?.(60)?.map(x=>({id:x.id,name:x.name})),native:(window.__AXIS_873_LIBRARY__||[]).filter(x=>x.id==='chest-row').map(x=>({id:x.id,name:x.name})),query:document.querySelector('#eqSearch')?.value,items:[...document.querySelectorAll('#v873SmartResults [data-v8124-pick]')].map(b=>({id:b.dataset.v8124Pick,name:b.querySelector('b')?.textContent||''}))}));
  console.log('[AXIS 8.30 search identity diagnostic]',JSON.stringify(identityDiagnostic));
  const catalogDiagnostic=await page.evaluate(()=>{
    const native=(window.__AXIS_873_LIBRARY__||[]).find(x=>x.id==='chest-row');
    const indexed=window.__AXIS_830_TEST_CATALOG__?.('胸托划船')||null;
    return{native:{exists:!!native,id:native?.id,name:native?.name,ownKeys:native?Object.keys(native):[]},indexed};
  });
  console.log('[AXIS 8.30 internal ranked search diagnostic]',JSON.stringify(catalogDiagnostic));
  assert.ok(catalogDiagnostic.native.exists,'canonical chest-row missing from live native library');
  assert.deepEqual(catalogDiagnostic.indexed?.nativeMissing||[],[],'some canonical native IDs were silently dropped from ranked catalog');
  assert.ok(catalogDiagnostic.indexed?.matched?.some(x=>x.id==='chest-row'),
    'canonical chest-row omitted from indexed search candidates: '+JSON.stringify(catalogDiagnostic));
  await page.waitForFunction(()=>document.querySelector('#v873SmartResults')?.classList.contains('show')&&document.querySelector('#v873SmartResults [data-v8124-pick="chest-row"]')&&document.querySelector('#v873SmartResults [data-v8124-pick="custom-identity-proof"]'),undefined,{timeout:3000});
  const queryIds=await page.locator('#v873SmartResults [data-v8124-pick]').evaluateAll(xs=>xs.map(x=>x.dataset.v8124Pick));
  assert.ok(queryIds.includes('chest-row')&&queryIds.includes('custom-identity-proof'),'same-name canonical and personal IDs collapsed '+queryIds.join(','));
  await tap(page.locator('#v873SmartResults [data-v8124-pick="chest-row"]').first());
  await page.waitForFunction(()=>window.__AXIS_SELECTED_EQUIPMENT__?.()?.id==='chest-row',undefined,{timeout:3000});

  // Historical base-family ID must remain intact as an old event, not rewritten to either row.
  const oldBefore=JSON.stringify((await stored()).sessions[0].events[0]);
  const cases=['chest-row','seated-row','seated-curl','lying-curl','run','treadmill'];
  for(const id of cases){
    assert.equal(await page.evaluate(x=>window.__AXIS_SELECT_EQUIPMENT__?.(x,true),id),true,'direct selection failed '+id);
    const pick=await page.evaluate(()=>window.__AXIS_SELECTED_EQUIPMENT__?.());
    assert.equal(pick.id,id,'selection collapsed to another Object '+id);
    await startQuick(id);
    const saved=(await stored()).active.events;
    assert.ok(saved.some(e=>e.equipmentId===id),'confirmed Encounter lost exact ID '+id);
    assert.equal(JSON.stringify((await stored()).sessions[0].events[0]),oldBefore,'historic base-family Encounter was mutated');
  }
  // Same visible name must lead to two separate confirmed Encounters, not just two search buttons.
  await page.evaluate(()=>window.__AXIS_OPEN_EQUIPMENT_PICKER__?.('recording'));
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show'),undefined,{timeout:3000});
  await page.locator('#eqSearch').fill('胸托划船');
  await page.waitForFunction(()=>document.querySelector('#v873SmartResults [data-v8124-pick="custom-identity-proof"]'),undefined,{timeout:3000});
  await tap(page.locator('#v873SmartResults [data-v8124-pick="custom-identity-proof"]').first());
  await page.waitForFunction(()=>window.__AXIS_SELECTED_EQUIPMENT__?.()?.id==='custom-identity-proof',undefined,{timeout:3000});
  await startQuick('custom-identity-proof');
  assert.equal(JSON.stringify((await stored()).sessions[0].events[0]),oldBefore,
    'custom Encounter rewrote historical base-family evidence');
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:15000});
  const final=await stored(),newIds=final.active.events.map(e=>e.equipmentId);
  for(const id of [...cases,'custom-identity-proof'])assert.ok(newIds.includes(id),'reload lost independently saved '+id);
  assert.equal(JSON.stringify(final.sessions[0].events[0]),oldBefore,'reload changed historic immutable Encounter');
  assert.deepEqual(errors,[],'uncaught page error:\n'+errors.join('\n'));
  console.log('[AXIS 8.30 Object Identity '+ENGINE+'] PASS · native/personal search split · 6 native + 1 same-label custom exact selections → real confirmed Encounter IDs → reload · historic generic base ID immutable');
}finally{
  await context.close().catch(()=>{});
  await browser.close().catch(()=>{});
}
