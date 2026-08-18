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
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
await page.route('**/api/cloud-status**',r=>json(r,{cloud:{configured:false,enabled:false}}));
await page.route('**/api/ai-capabilities**',r=>json(r,{ai:{enabled:false,capabilities:{vision:false,insight:false,voice:false,dialogue:false}}}));
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
const tapScrolled=async l=>{await l.scrollIntoViewIfNeeded();await tap(l)};
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:12000});await page.waitForFunction(()=>window.__AXIS_8123_FIELD_POLISH__?.version==='8.12.3',undefined,{timeout:6000});await page.waitForFunction(()=>window.__AXIS_GROUP_PLAN_STABLE__?.owner==='recording-render',undefined,{timeout:6000})};
const left=async sel=>page.locator(sel).evaluate(el=>el.getBoundingClientRect().left);
const right=async sel=>page.locator(sel).evaluate(el=>el.getBoundingClientRect().right);

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
  await page.evaluate(()=>{
    localStorage.clear();
    const now=Date.now();
    localStorage.setItem('axis_v60_state',JSON.stringify({
      version:60,
      sessions:[{id:'S-HISTORY',start:now-86400000,end:now-86400000+3000000,events:[
        {id:'E-CHEST',equipmentId:'chest',name:'胸推',pattern:'push',kind:'strength',muscles:['胸肌','肱三头肌'],effect:'胸部推力',time:now-86400000+1000,weight:40,reps:10,sets:3,frameRefs:['F-E-CHEST-0'],photoBytes:128,videoBytes:0},
        {id:'E-CUSTOM',equipmentId:'custom-blue',name:'蓝色腿推',pattern:'knee',kind:'strength',muscles:['股四头肌'],effect:'股四头肌',time:now-86400000+2000,weight:60,reps:12,sets:3,frameRefs:[],photoBytes:0,videoBytes:0}
      ]}],
      active:{id:'S-ACTIVE',start:now-120000,events:[]},
      profile:{name:'Ray',weight:'92',customEq:[{id:'custom-blue',name:'蓝色腿推',type:'strength',pattern:'knee',muscles:['股四头肌'],effect:'股四头肌',custom:true}],memories:[{equipmentId:'chest',fp:'0000000000000000',t:now-86400000}]},
      prefs:{}
    }));
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
  assert.equal(await page.locator('#manageEqList [data-my-eq-photo="F-E-CHEST-0"]').count(),1,'representative photo ref missing');
  assert.equal(await page.locator('#manageEqList [data-my-eq-remove]').count(),2,'swipe remove actions missing');
  await tapScrolled(page.locator('#myEqSelect'));assert.equal(await page.locator('#manageEqList.selecting').count(),1);
  const rowState=await page.locator('#manageEqList [data-my-eq-id]').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return{id:el.dataset.myEqId,w:r.width,h:r.height,top:r.top,display:s.display,visibility:s.visibility}}));
  console.log(`[AXIS 8.12.3 field ${ENGINE}] personal row geometry ${JSON.stringify(rowState)}`);
  assert.ok(rowState.length===2&&rowState.every(x=>x.w>0&&x.h>0&&x.display!=='none'&&x.visibility!=='hidden'),'personal equipment rows must remain rendered while selecting');
  const rows=page.locator('#manageEqList [data-my-eq-id]');await rows.nth(0).evaluate(el=>el.click());await rows.nth(1).evaluate(el=>el.click());
  assert.equal((await page.locator('#v8123EqBatch [data-my-eq-batch]').textContent()).trim(),'移除 2 项');
  assert.equal(await page.locator('#manageEqList .v8123EqDot.on').count(),2,'both personal equipment rows should be selected in place');
  await tapScrolled(page.locator('#myEqSelect'));assert.equal(await page.locator('#manageEqList.selecting').count(),0);
  await tapScrolled(page.locator('#myEqBtn'));await page.waitForFunction(()=>!document.querySelector('#axisConfigGate-equipment')?.classList.contains('open'));
  await tap(page.locator('#settingsSheet [data-close="settingsSheet"]'));

  console.log(`[AXIS 8.12.3 field ${ENGINE}] Group Plan survives count/weight/reps repaints + reopen`);
  await page.waitForFunction(()=>!!document.querySelector('#quickRecordBtn'),undefined,{timeout:4000});
  await tap(page.locator('#quickRecordBtn'));await page.waitForFunction(()=>document.querySelector('#quickRecordSheet')?.classList.contains('show'));
  await tap(page.locator('#v8Recent [data-qid="chest"]'));
  await page.waitForFunction(()=>{const h=document.querySelector('#v8Sets');return h&&!h.classList.contains('hidden')&&document.querySelector('[data-v8123-plan]')},undefined,{timeout:5000});
  const planEntry=page.locator('#v8Sets [data-v8123-plan]');
  assert.equal(await planEntry.count(),1,'stable Group Plan entry must be singular');
  for(let i=0;i<2;i++)await tap(page.locator('#v8Sets [data-cnt="1"]'));
  await page.waitForTimeout(80);assert.equal(await planEntry.count(),1,'count repaint duplicated/lost Group Plan entry');
  const weightPlus=page.locator('#axisSetControls [data-axis-step="weight"][data-dir="1"]');if(await weightPlus.count())await tap(weightPlus.first());
  const repsPlus=page.locator('#axisSetControls [data-axis-step="reps"][data-dir="1"]');if(await repsPlus.count())await tap(repsPlus.first());
  await page.waitForTimeout(80);assert.equal(await planEntry.count(),1,'adjust repaint duplicated/lost Group Plan entry');

  for(let i=0;i<3;i++){
    await tap(planEntry);await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&!!document.querySelector('#v8712PlanBody'),undefined,{timeout:3000});
    assert.equal(await page.locator('#v875PlanSheet #v8712PlanBody').count(),1,`planner body missing on open ${i+1}`);
    await tap(page.locator('#v875PlanSheet .closeBtn'));await page.waitForFunction(()=>!document.querySelector('#v875PlanSheet')?.classList.contains('show'));
    if(i===0){await tap(page.locator('#v8Sets [data-cnt="1"]'));await page.waitForTimeout(60)}
    if(i===1&&await weightPlus.count()){await tap(weightPlus.first());await page.waitForTimeout(60)}
    assert.equal(await planEntry.count(),1,`planner entry lost after close/repaint ${i+1}`);
  }

  await tap(planEntry);await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show'));
  await tap(page.locator('#v875PlanSheet [data-v8712-mode="up"]'));await tap(page.locator('#v8712Apply'));
  await page.waitForFunction(()=>!document.querySelector('#v875PlanSheet')?.classList.contains('show'),undefined,{timeout:3000});
  await page.waitForTimeout(100);assert.equal(await planEntry.count(),1,'planner entry lost after atomic apply');
  await tap(planEntry);await page.waitForFunction(()=>document.querySelector('#v875PlanSheet')?.classList.contains('show')&&!!document.querySelector('#v8712PlanBody'));
  await tap(page.locator('#v875PlanSheet .closeBtn'));

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.12.3 field ${ENGINE}] PASS · personal equipment memory · singular repaint-safe Group Plan · Settings row geometry aligned`);
}finally{
  await context.close().catch(()=>{});await browser.close().catch(()=>{});
}
