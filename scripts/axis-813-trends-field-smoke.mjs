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
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_813_TRENDS_FIELD__?.version==='8.13',undefined,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13');
 await page.evaluate(()=>{
  localStorage.clear();
  const DAY=864e5,now=Date.now();
  const make=(id,days,spanMin,events)=>{const start=now-days*DAY,end=start+spanMin*60000;return{id,start,end,events:events.map((e,i)=>{const a=start+(4+i*13)*60000,b=Math.min(end,a+(8+(i%2)*3)*60000);return{...e,activity:{startedAt:a,finishedAt:b,intervals:[{start:a,end:b}]}}})}};
  const strength=(id,name,w,reps,muscles)=>({kind:'strength',equipmentId:id,name,weight:w,reps,muscles});
  const cardio=(id,name,duration,intensity,muscles)=>({kind:'cardio',equipmentId:id,name,duration,intensity,muscles});
  const sessions=[
   make('old',140,74,[strength('ab','坐姿卷腹机',40,'12 / 12 / 12',['核心']),strength('row','高位划船机',30,'12 / 12 / 12',['背部'])]),
   make('s1',20,91,[strength('ab','坐姿卷腹机',43,'15 / 10 / 10 / 10 / 10 / 10 / 10',['核心']),strength('row','高位划船机',30,'14 / 14 / 14 / 14 / 14',['背部']),cardio('elliptical','椭圆机',30,9,['心肺','腿'])]),
   make('s2',10,78,[strength('ab','坐姿卷腹机',43,'15 / 10 / 10 / 10 / 10 / 10 / 10',['核心']),strength('row','高位划船机',30,'12 / 12 / 12 / 12',['背部']),strength('press','上斜卧推',22.5,'10 / 10 / 10',['胸肌'])]),
   make('s3',3,70,[strength('ab','坐姿卷腹机',43,'15 / 10 / 10 / 10 / 10 / 10 / 10',['核心']),strength('row','高位划船机',32.5,'10 / 10 / 10',['背部']),strength('leg','腿推',70,'10 / 10 / 10',['股四头肌','臀部'])]),
   make('s4',0,67,[strength('ab','坐姿卷腹机',43,'15 / 10 / 10 / 10 / 10 / 10 / 10',['核心']),strength('row','高位划船机',32.5,'10 / 10 / 10',['背部']),cardio('elliptical','椭圆机',30,7,['心肺','腿']),cardio('stretch','拉伸放松',15,1,['全身'])])
  ];
  localStorage.setItem('axis_v60_state',JSON.stringify({sessions,profile:{goal:'health',freq:3}}));
 });
 const seeded=await page.evaluate(()=>{try{return JSON.parse(localStorage.getItem('axis_v60_state')||'{}').sessions?.length||0}catch{return-1}});assert.equal(seeded,5,'post-boot Trends fixture not installed');
 await tap(page.locator('[data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active'),undefined,{timeout:5000});
 await page.waitForTimeout(180);
 const recentCount=await page.locator('.v813Node').count();assert.equal(recentCount,4,`recent range should contain four recent sessions; rendered ${recentCount}`);
 assert.equal(await page.locator('#v813Field').isVisible(),true);
 assert.equal(await page.locator('.v813Node.selected').count(),1,'one selected bearing required');
 assert.ok(await page.locator('#v813Fingerprint i').count()>0,'session fingerprint missing');
 assert.ok((await page.locator('#v813Insight').innerText()).trim().length>28,'natural explanation missing');
 const surface=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,touch:getComputedStyle(document.querySelector('#v813Viewport')).touchAction,owner:document.querySelector('#insightsView')?.dataset.axisTrendsOwner,legacy:['当前状态','这次让什么发生了','下一针','状态场'].some(t=>document.querySelector('#insightsView')?.innerText.includes(t))}));
 assert.ok(surface.scroll<=surface.inner+1,`horizontal overflow ${surface.scroll}/${surface.inner}`);assert.equal(surface.touch,'pan-y');assert.equal(surface.owner,'v813-trends-field');assert.equal(surface.legacy,false,'legacy trend copy visible');
 const firstSelected=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));
 const box=await page.locator('#v813Viewport').boundingBox();assert.ok(box);
 await page.evaluate(()=>{const v=document.querySelector('#v813Viewport'),r=v.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+100;for(const [type,cx,cy] of [['pointerdown',x,y],['pointermove',x+135,y+2],['pointerup',x+135,y+2]])v.dispatchEvent(new PointerEvent(type,{pointerId:33,pointerType:'touch',isPrimary:true,bubbles:true,clientX:cx,clientY:cy,button:0,buttons:type==='pointerup'?0:1}))});
 await page.waitForTimeout(140);
 const afterScrub=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));assert.ok(afterScrub<firstSelected,`horizontal scrub did not move to earlier session ${firstSelected}->${afterScrub}`);
 await tap(page.locator('.v813Node.selected'));await page.waitForTimeout(100);assert.equal(await page.locator('#v813Expand').isVisible(),true,'selected node tap should expand in place');assert.ok(await page.locator('#v813Activities .v813Activity').count()>0,'expanded session rows missing');assert.equal(await page.locator('.sheetWrap.show').count(),0,'trend interaction must not open modal/sheet');
 const beforeEdge=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));
 await page.evaluate(()=>{const v=document.querySelector('#v813Viewport'),r=v.getBoundingClientRect(),y=r.top+90;v.dispatchEvent(new PointerEvent('pointerdown',{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:r.left+10,clientY:y,button:0,buttons:1}));v.dispatchEvent(new PointerEvent('pointermove',{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:r.left+150,clientY:y+1,button:0,buttons:1}));v.dispatchEvent(new PointerEvent('pointerup',{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:r.left+150,clientY:y+1,button:0,buttons:0}))});
 await page.waitForTimeout(80);assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),beforeEdge,'24px Safari edge-safe rail intercepted system gesture');
 await tap(page.locator('[data-v813-range="all"]'));await page.waitForFunction(()=>document.querySelectorAll('.v813Node').length===5,undefined,{timeout:2000});assert.equal(await page.locator('#v813Memory').isVisible(),true,'memory lanes missing');assert.equal(await page.locator('#v813MemoryRows .v813Lane').count(),4,'memory lanes should stay compact');
 await page.emulateMedia({reducedMotion:'reduce'});const reduced=await page.evaluate(()=>getComputedStyle(document.querySelector('#v813TrackCanvas')).transitionDuration);assert.equal(reduced,'0s','reduced motion contract not applied');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.13 trends ${ENGINE}] PASS · post-boot fixture · SVG time field · bearing nodes · interval fingerprint · horizontal scrub + 24px edge safe · in-place expand · no overflow/modal · reduced motion`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
