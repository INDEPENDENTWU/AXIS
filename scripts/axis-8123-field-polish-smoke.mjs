import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'});
const page=await context.newPage();
const errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));
await page.addInitScript(()=>{try{Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>{throw new Error('AXIS_TEST_CAMERA_OFFLINE')}}})}catch{}});
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:false,enabled:false}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:false,capabilities:{vision:false,insight:false,voice:false,dialogue:false}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const tapScrolled=async l=>{await l.scrollIntoViewIfNeeded();await tap(l)};
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8123_FIELD_POLISH__?.version==='8.12.3',undefined,{timeout:6000});await page.waitForFunction(()=>window.__AXIS_GROUP_PLAN_STABLE__?.owner==='recording-render',undefined,{timeout:6000})};
const left=async sel=>page.locator(sel).evaluate(el=>el.getBoundingClientRect().left);
const right=async sel=>page.locator(sel).evaluate(el=>el.getBoundingClientRect().right);
const waitPlanner=async()=>page.waitForFunction(()=>{const h=document.querySelector('#v8Sets'),p=h?.querySelector('[data-v8123-plan]');return !!h&&!h.classList.contains('hidden')&&!!p&&p.getClientRects().length>0},undefined,{timeout:5000});
const planner=()=>page.locator('#v8Sets [data-v8123-plan]');
const closePlanner=async()=>{await tap(page.locator('#v875PlanSheet .closeBtn'));await page.waitForFunction(()=>!document.querySelector('#v875PlanSheet')?.classList.contains('show'))};
const openPlanner=async()=>{await tap(planner());await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&!!document.querySelector('#v8712PlanBody'),undefined,{timeout:3000});assert.equal(await page.locator('#v875PlanSheet #v8712PlanBody').count(),1)};
const adjustOnce=async()=>{const w=page.locator('#axisSetControls [data-axis-step="weight"][data-dir="1"]'),r=page.locator('#axisSetControls [data-axis-step="reps"][data-dir="1"]');if(await w.count())await tap(w.first());if(await r.count())await tap(r.first());await page.waitForTimeout(80)};
const stressPlanner=async(label)=>{
 assert.equal(await planner().count(),1,`${label}: stable Group Plan entry must be singular`);
 await tap(page.locator('#v8Sets [data-cnt="1"]'));await tap(page.locator('#v8Sets [data-cnt="1"]'));await page.waitForTimeout(90);
 assert.equal(await planner().count(),1,`${label}: count repaint duplicated/lost Group Plan entry`);
 await adjustOnce();assert.equal(await planner().count(),1,`${label}: value repaint duplicated/lost Group Plan entry`);
 for(let i=0;i<3;i++){
  await openPlanner();await closePlanner();
  if(i===0){await tap(page.locator('#v8Sets [data-cnt="1"]'));await page.waitForTimeout(70)}
  if(i===1)await adjustOnce();
  assert.equal(await planner().count(),1,`${label}: planner entry lost after close/repaint ${i+1}`);
 }
};

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
  await page.evaluate(()=>{
    localStorage.clear();
    const now=Date.now();
    localStorage.setItem('axis_v60_state',JSON.stringify({
      version:60,
      sessions:[{id:'S-HISTORY',start:now-86400000,end:now-86400000+3000000,events:[
        {id:'E-LAT',equipmentId:'lat-pulldown',name:'高位下拉',pattern:'pull',kind:'strength',muscles:['背部','肱二头肌'],effect:'背部宽度',time:now-86400000+1000,weight:40,reps:10,sets:3,frameRefs:['F-E-LAT-0'],photoBytes:128,videoBytes:0},
        {id:'E-CUSTOM',equipmentId:'custom-blue',name:'蓝色腿推',pattern:'knee',kind:'strength',muscles:['股四头肌'],effect:'股四头肌',time:now-86400000+2000,weight:60,reps:12,sets:3,frameRefs:[],photoBytes:0,videoBytes:0}
      ]}],
      active:{id:'S-ACTIVE',start:now-120000,events:[]},
      profile:{name:'Ray',weight:'92',customEq:[{id:'custom-blue',name:'蓝色腿推',type:'strength',pattern:'knee',muscles:['股四头肌'],effect:'股四头肌',custom:true}],memories:[{equipmentId:'lat-pulldown',fp:'0000000000000000',t:now-86400000}]},
      prefs:{}
    }));
    localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{}}));
  });
  await page.reload({waitUntil:'domcontentloaded'});await ready();
  assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.12.3');
  assert.equal(await page.evaluate(()=>window.__AXIS_8123_EQUIPMENT_MEMORY__?.photoOwner),'axis-media-store');

  console.log(`[AXIS 8.12.3 field ${ENGINE}] Settings geometry at 417 CSS px`);
  await tap(page.locator('#settingsBtn'));await page.waitForFunction(()=>document.querySelector('#settingsSheet')?.classList.contains('show'));
  const nativeLeft=await left('#profileBtn>span'),nativeRight=await right('#profileBtn>i');
  for(const [label,row] of [['learning','#v810ConfigEntry'],['service','#v811ServiceEntry']]){
    const l=await left(`${row}>span`),r=await right(`${row}>i`);
    assert.ok(Math.abs(l-nativeLeft)<=1.5,`${label} label drift ${l} vs ${nativeLeft}`);
    assert.ok(Math.abs(r-nativeRight)<=1.5,`${label} arrow drift ${r} vs ${nativeRight}`);
  }

  console.log(`[AXIS 8.12.3 field ${ENGINE}] personal equipment library`);
  assert.equal((await page.locator('#customCount').textContent()).trim(),'2');
  await tap(page.locator('#myEqBtn'));await page.waitForFunction(()=>document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'));
  await page.locator('#myEqSelect').waitFor({state:'visible'});
  assert.equal(await page.locator('#manageEqList [data-my-eq-id]').count(),2,'native + custom personal rows expected');
  assert.equal(await page.locator('#manageEqList [data-my-eq-photo="F-E-LAT-0"]').count(),1,'representative photo ref missing');
  assert.equal(await page.locator('#manageEqList [data-my-eq-remove]').count(),2,'swipe remove actions missing');
  await tapScrolled(page.locator('#myEqSelect'));assert.equal(await page.locator('#manageEqList.selecting').count(),1);
  const rowState=await page.locator('#manageEqList [data-my-eq-id]').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{id:el.dataset.myEqId,w:r.width,h:r.height,top:r.top,display:s.display,visibility:s.visibility}}));
  assert.ok(rowState.length===2&&rowState.every(x=>x.w>0&&x.h>0&&x.display!=='none'&&x.visibility!=='hidden'),'personal equipment rows must remain rendered while selecting');
  const rows=page.locator('#manageEqList [data-my-eq-id]');await rows.nth(0).evaluate(el=>el.click());await rows.nth(1).evaluate(el=>el.click());
  assert.equal((await page.locator('#v8123EqBatch [data-my-eq-batch]').textContent()).trim(),'移除 2 项');
  assert.equal(await page.locator('#manageEqList .v8123EqDot.on').count(),2,'both personal equipment rows should be selected in place');
  await tapScrolled(page.locator('#myEqSelect'));assert.equal(await page.locator('#manageEqList.selecting').count(),0);
  await tapScrolled(page.locator('#myEqBtn'));await page.waitForFunction(()=>!document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'));
  await tap(page.locator('#settingsSheet [data-close="settingsSheet"]'));

  console.log(`[AXIS 8.12.3 field ${ENGINE}] photo record Group Plan survives count/value repaint + repeated reopen`);
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABAklEQVR4nO2asQ3CMBREHZRBKKiYgRlSMQIlYhhEmRGomIHBKNwgxU7Ad3CxfK90IudefvLlWOm2u32omY06AIoF1FhAjQXU9LkDw/H8zxyLPO635Hj1FbCAGguosYAaC6ixgJrsWgjkcjpMB6/jk34hvkAy+vshrgZTYCb69DSWBu0d+DB98fk5OAJlaSgOBAEkB+5QfRtFBfBbCM7QdgVYnQSZp+0KrAELqLGAGkiAtaJE5mm7AoFRBHCG5isQsFuIF5BTgbIclB5Ae4S+TcPqYMyP+phpcWm53l2JyIxGHftCkV9kTeI2qsYCaiygxgJqLKCm83+jYiygxgJqLKDmBVV6OVsV43ZUAAAAAElFTkSuQmCC','base64');
  await tap(page.locator('#scanBtn'));await page.waitForFunction(()=>document.querySelector('#scanSheet')?.classList.contains('show'));
  await page.locator('#photoInput').setInputFiles({name:'axis-field.png',mimeType:'image/png',buffer:png});
  await page.waitForFunction(()=>!document.querySelector('#reviewStage')?.classList.contains('hidden'),undefined,{timeout:3500});
  await tap(page.locator('#equipmentRow'));
  await page.waitForFunction(()=>document.querySelector('#eqSheet')?.classList.contains('show')&&document.querySelector('#v8710Cards button'),undefined,{timeout:3000});
  const chest=page.locator('#v8710Cards button').filter({hasText:'胸推'}).first();assert.equal(await chest.count(),1,'canonical visible chest-press card missing');await tap(chest);
  await waitPlanner();await stressPlanner('photo');
  await openPlanner();await tap(page.locator('#v875PlanSheet [data-v8712-mode="up"]'));await tap(page.locator('#v8712Apply'));
  await page.waitForFunction(()=>!document.querySelector('#v875PlanSheet')?.classList.contains('show'),undefined,{timeout:3000});await page.waitForTimeout(100);
  assert.equal(await planner().count(),1,'photo: planner entry lost after atomic apply');
  await openPlanner();await closePlanner();
  await tap(page.locator('#saveScan'));await page.waitForFunction(()=>!document.querySelector('#scanSheet')?.classList.contains('show'),undefined,{timeout:3500});
  const savedId=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}');return c.active?.events?.at(-1)?.equipmentId||''});
  assert.ok(savedId,'photo flow did not save a canonical equipment id');

  console.log(`[AXIS 8.12.3 field ${ENGINE}] generated Quick Record recent Group Plan survives repaint + reopen`);
  await tap(page.locator('#quickRecordBtn'));
  await page.waitForFunction(id=>document.querySelector('#quickRecordSheet')?.classList.contains('show')&&[...document.querySelectorAll('#v8Recent [data-qid]')].some(x=>x.dataset.qid===id),savedId,{timeout:2500});
  const quick=page.locator(`#v8Recent [data-qid="${savedId}"]`).first();assert.equal(await quick.count(),1,'generated recent item missing');await tap(quick);
  await waitPlanner();await stressPlanner('quick');
  await openPlanner();await closePlanner();

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.12.3 field ${ENGINE}] PASS · personal equipment memory · photo + Quick repaint-safe Group Plan · Settings row geometry aligned`);
}finally{
  await context.close().catch(()=>{});await browser.close().catch(()=>{});
}
