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
const seed=async count=>page.evaluate(count=>{
 const now=Date.now(),base=new Date().setHours(9,0,0,0);
 const sessions=[];
 for(let i=0;i<count;i++){
  const start=base+i*27*60000,end=start+(2+i%3)*60000;
  const activityStart=start+10000,activityEnd=Math.min(end,activityStart+50000);
  sessions.push({id:`same-day-${i+1}`,start,end,events:[{id:`event-${i+1}`,time:start+20000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:30+(i>=3?2.5:0),reps:10,sets:3,muscles:['背部'],frameRefs:i===0?['P-FIRST']:[],activity:{startedAt:activityStart,finishedAt:activityEnd,intervals:[{start:activityStart,end:activityEnd}]}}]});
 }
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:true}}));
 return{count:sessions.length,now};
},count);
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8131_EVOLUTION_FIELD__?.version==='8.13.1'&&window.__AXIS_EVOLUTION__?.version==='8.13.1',undefined,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.13.1');
 await tap(page.locator('[data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active'),undefined,{timeout:4000});
 assert.equal((await page.locator('#v813Empty').innerText()).trim(),'暂无训练记录。');
 const visibleCopy=(await page.locator('#insightsView').innerText()).trim();
 for(const text of ['左右滑动查看','点一下展开','留下几次训练后','继续留下相同动作'])assert.ok(!visibleCopy.includes(text),`instructional copy survived: ${text}`);

 await seed(1);
 await page.waitForFunction(()=>document.querySelectorAll('.v813Node').length===1,undefined,{timeout:3000});
 assert.equal(await page.locator('#v813Field').isVisible(),true,'first sealed session should immediately create a time-field node');
 const firstInsight=(await page.locator('#v813Insight').innerText()).trim();
 assert.ok(firstInsight.includes('完成1个项目')&&firstInsight.includes('整次训练'),`first-session copy must be factual: ${firstInsight}`);

 await seed(7);
 await page.waitForFunction(()=>document.querySelectorAll('.v813Node').length===7,undefined,{timeout:3000});
 assert.equal(await page.locator('.v813Node').count(),7,'seven same-day sealed sessions must remain seven distinct nodes');
 assert.equal(await page.locator('.v813Node.selected').count(),1,'exactly one latest node selected');
 assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),6,'state lifecycle refresh should select newest sealed session');
 assert.ok(await page.locator('#v813Fingerprint i').count()>0,'session fingerprint missing');
 const geometry=await page.locator('.v813Node').evaluateAll(nodes=>nodes.map(n=>Number.parseFloat(n.style.left)));
 assert.equal(new Set(geometry.map(Math.round)).size,7,'same-day sessions overlapped instead of retaining minimum spatial separation');
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));

 const evo=await page.evaluate(()=>window.__AXIS_EVOLUTION__.resolve());
 assert.equal(evo.sessionCount,7);assert.equal(evo.items.length,1);assert.equal(evo.items[0].name,'坐姿划船机');assert.equal(evo.items[0].encounterCount,7);assert.equal(evo.items[0].firstEncounter.summary,'30kg · 30次');assert.equal(evo.items[0].latestEncounter.summary,'32.5kg · 30次');assert.ok(evo.items[0].mediaEvidence>=1);assert.equal(evo.items[0].timeSpanDays,0);

 await tap(page.locator('.v813Node.selected'));await page.waitForTimeout(80);
 assert.equal(await page.locator('#v813Expand').isVisible(),true,'selected node tap should expand in place');
 assert.equal(await page.locator('#v813Activities .v813Activity').count(),1);
 assert.equal(await page.locator('.sheetWrap.show').count(),0,'Evolution interaction must not open modal/sheet');

 const beforeScrub=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));
 await page.evaluate(()=>{const v=document.querySelector('#v813Viewport'),r=v.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+100;for(const [type,cx,cy] of [['pointerdown',x,y],['pointermove',x+145,y+2],['pointerup',x+145,y+2]])v.dispatchEvent(new PointerEvent(type,{pointerId:31,pointerType:'touch',isPrimary:true,bubbles:true,clientX:cx,clientY:cy,button:0,buttons:type==='pointerup'?0:1}))});
 await page.waitForTimeout(140);
 const afterScrub=Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node'));
 assert.ok(afterScrub<beforeScrub,`horizontal scrub did not move ${beforeScrub}->${afterScrub}`);

 const edgeBefore=afterScrub;
 await page.evaluate(()=>{const v=document.querySelector('#v813Viewport'),r=v.getBoundingClientRect(),y=r.top+90;for(const [type,x] of [['pointerdown',r.left+10],['pointermove',r.left+150],['pointerup',r.left+150]])v.dispatchEvent(new PointerEvent(type,{pointerId:77,pointerType:'touch',isPrimary:true,bubbles:true,clientX:x,clientY:y,button:0,buttons:type==='pointerup'?0:1}))});
 await page.waitForTimeout(80);assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),edgeBefore,'24px Safari edge rail intercepted system gesture');

 const surface=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,touch:getComputedStyle(document.querySelector('#v813Viewport')).touchAction,owner:document.querySelector('#insightsView')?.dataset.axisTrendsOwner,copy:document.querySelector('#insightsView')?.innerText||''}));
 assert.ok(surface.scroll<=surface.inner+1,`horizontal overflow ${surface.scroll}/${surface.inner}`);assert.equal(surface.touch,'pan-y');assert.equal(surface.owner,'v8131-evolution-field');
 for(const text of ['左右滑动查看','点一下展开','留下几次训练后','继续留下相同动作'])assert.ok(!surface.copy.includes(text),`visible helper copy survived: ${text}`);
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),rawBefore,'read-only Trends/Evolution interaction mutated canonical training storage');
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('#v813TrackCanvas')).transitionDuration),'0s');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.13.1 evolution ${ENGINE}] PASS · empty + first factual state · 7 same-day sealed sessions · live state refresh · read-only Evolution resolver · tap/scrub/edge safety · no helper copy/storage writes`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
