import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',reducedMotion:'no-preference'});
const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(pattern,r=>json(r,obj));
const tap=async l=>ENGINE==='webkit'?l.tap():l.click();
try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
  await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_813_TRENDS_FIELD__?.version==='8.13.1'&&window.__AXIS_8131_EVOLUTION_FOUNDATION__?.version==='8.13.1',undefined,{timeout:12000});
  assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13.1');
  await page.evaluate(()=>{
    localStorage.clear();
    const now=Date.now(),base=now-22*60000;
    const sessions=[],meta={events:{}};
    for(let i=0;i<7;i++){
      const start=base+i*3*60000,end=start+70000,id=`same-${i}`,eid=`ev-${i}`;
      sessions.push({id,start,end,events:[{id:eid,time:start+12000,kind:'strength',equipmentId:i%2?'row':'ab',name:i%2?'高位划船机':'坐姿卷腹机',weight:i%2?32.5:43,reps:10+i%3,sets:3,muscles:i%2?['背部']:['核心']}]});
      meta.events[eid]={activity:{status:'finished',startedAt:start+8000,finishedAt:end-7000,intervals:[{start:start+8000,end:start+31000},{start:start+42000,end:end-7000}]}};
    }
    localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{goal:'health',freq:3}}));
    localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
  });
  await tap(page.locator('[data-view="insightsView"]'));
  await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length===7,undefined,{timeout:4000});
  assert.equal(await page.locator('.v813Node').count(),7,'seven same-day sealed sessions must remain seven bearings');
  assert.equal(await page.locator('.v813Node.selected').count(),1,'one latest bearing required');
  assert.ok(await page.locator('#v813Fingerprint i').count()>=2,'fingerprint must read canonical axis_v8_meta activity intervals');
  const text=(await page.locator('#insightsView').innerText()).trim();
  for(const retired of ['左右滑动查看','点一下展开这次训练','留下几次训练后','留下训练记录后'])assert.ok(!text.includes(retired),`retired helper copy visible: ${retired}`);
  const state=await page.evaluate(()=>({field:!document.querySelector('#v813Field')?.hidden,empty:!document.querySelector('#v813Empty')?.hidden,owner:document.querySelector('#insightsView')?.dataset.axisTrendsOwner,touch:getComputedStyle(document.querySelector('#v813Viewport')).touchAction,scroll:document.documentElement.scrollWidth,inner:innerWidth,evolution:window.__AXIS_8131_EVOLUTION_FOUNDATION__.objects()}));
  assert.equal(state.field,true);assert.equal(state.empty,false);assert.equal(state.owner,'v813-trends-field');assert.equal(state.touch,'pan-y');assert.ok(state.scroll<=state.inner+1,`horizontal overflow ${state.scroll}/${state.inner}`);assert.equal(state.evolution.length,2,'same-day fixture should resolve two Evolution objects');assert.equal(state.evolution.reduce((n,x)=>n+x.encounters,0),7,'Evolution encounters must derive from sealed event evidence');

  const latest=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));
  await page.evaluate(()=>{const v=document.querySelector('#v813Viewport'),r=v.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+100;for(const [type,cx,cy] of [['pointerdown',x,y],['pointermove',x+130,y+2],['pointerup',x+130,y+2]])v.dispatchEvent(new PointerEvent(type,{pointerId:41,pointerType:'touch',isPrimary:true,bubbles:true,clientX:cx,clientY:cy,button:0,buttons:type==='pointerup'?0:1}))});
  await page.waitForTimeout(120);
  const after=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));assert.ok(after<latest,`horizontal scrub did not select earlier same-day session ${latest}->${after}`);
  await tap(page.locator('.v813Node.selected'));await page.waitForTimeout(80);assert.equal(await page.locator('#v813Expand').isVisible(),true,'bearing tap must expand in place');assert.equal(await page.locator('.sheetWrap.show').count(),0,'Trends interaction must not open a modal');

  const beforeEdge=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));
  await page.evaluate(()=>{const v=document.querySelector('#v813Viewport'),r=v.getBoundingClientRect(),y=r.top+90;v.dispatchEvent(new PointerEvent('pointerdown',{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:r.left+10,clientY:y,button:0,buttons:1}));v.dispatchEvent(new PointerEvent('pointermove',{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:r.left+150,clientY:y+1,button:0,buttons:1}));v.dispatchEvent(new PointerEvent('pointerup',{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:r.left+150,clientY:y+1,button:0,buttons:0}))});
  await page.waitForTimeout(80);assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),beforeEdge,'24px Safari edge-safe rail was not preserved');

  await tap(page.locator('[data-view="todayView"]'));
  await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state')),m=JSON.parse(localStorage.getItem('axis_v8_meta')),start=Date.now()-20000,end=start+10000,id='same-7',eid='ev-7';c.sessions.unshift({id,start,end,events:[{id:eid,time:start+2000,kind:'strength',equipmentId:'row',name:'高位划船机',weight:35,reps:10,sets:3,muscles:['背部']}]});m.events[eid]={activity:{status:'finished',startedAt:start+1000,finishedAt:end-1000,intervals:[{start:start+1000,end:end-1000}]}};localStorage.setItem('axis_v60_state',JSON.stringify(c));localStorage.setItem('axis_v8_meta',JSON.stringify(m))});
  await tap(page.locator('[data-view="insightsView"]'));
  await page.waitForFunction(()=>document.querySelectorAll('.v813Node').length===8,undefined,{timeout:2500});
  assert.equal(await page.locator('.v813Node').count(),8,'navigation must re-read newly sealed sessions without reload');
  assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),7,'latest newly sealed session must become selected');

  await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('#v813TrackCanvas')).transitionDuration),'0s','reduced motion contract not applied');
  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.13.1 trends ${ENGINE}] PASS · 7→8 same-day sealed sessions · live navigation projection · meta activity fingerprint · scrub/tap/edge-safe · direct copy · Evolution foundation`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
