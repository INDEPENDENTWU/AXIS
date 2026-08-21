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
 const base=new Date().setHours(9,0,0,0),sessions=[],meta={events:{}};
 for(let i=0;i<count;i++){
  const start=base+i*27*60000,end=start+(2+i%3)*60000,eid=`event-${i+1}`;
  const a1=start+10000,a2=Math.min(end,start+35000),b1=Math.min(end,start+45000),b2=Math.min(end,start+65000);
  sessions.push({id:`same-day-${i+1}`,start,end,events:[{id:eid,time:start+20000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:30+(i>=3?2.5:0),reps:10,sets:3,muscles:['背部'],frameRefs:i===0?['P-FIRST']:[]}]});
  meta.events[eid]={activity:{status:'finished',startedAt:a1,finishedAt:b2,intervals:[{start:a1,end:a2},{start:b1,end:b2}].filter(x=>x.end>=x.start)}};
 }
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:true}}));
 return{count:sessions.length};
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
 assert.ok(await page.locator('#v813Fingerprint i').count()>=2,'first-session fingerprint must resolve axis_v8_meta activity intervals');

 await seed(7);
 await page.waitForFunction(()=>document.querySelectorAll('.v813Node').length===7,undefined,{timeout:3000});
 assert.equal(await page.locator('.v813Node').count(),7,'seven same-day sealed sessions must remain seven distinct nodes');
 assert.equal(await page.locator('.v813Node.selected').count(),1,'exactly one latest node selected');
 assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),6,'state lifecycle refresh should select newest sealed session');
 assert.ok(await page.locator('#v813Fingerprint i').count()>=2,'session fingerprint must read canonical axis_v8_meta activity intervals');
 const geometry=await page.locator('.v813Node').evaluateAll(nodes=>nodes.map(n=>Number.parseFloat(n.style.left)));
 assert.equal(new Set(geometry.map(Math.round)).size,7,'same-day sessions overlapped instead of retaining minimum spatial separation');
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 const metaBefore=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));

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
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBefore,'read-only Trends/Evolution interaction mutated canonical metadata storage');

 await tap(page.locator('[data-view="todayView"]'));
 await page.evaluate(()=>{
  const c=JSON.parse(localStorage.getItem('axis_v60_state')),m=JSON.parse(localStorage.getItem('axis_v8_meta')),start=Date.now()-20000,end=start+10000,eid='event-8';
  c.sessions.push({id:'same-day-8',start,end,events:[{id:eid,time:start+2000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:35,reps:10,sets:3,muscles:['背部']}]});
  m.events[eid]={activity:{status:'finished',startedAt:start+1000,finishedAt:end-1000,intervals:[{start:start+1000,end:end-1000}]}};
  localStorage.setItem('axis_v60_state',JSON.stringify(c));localStorage.setItem('axis_v8_meta',JSON.stringify(m));
 });
 await tap(page.locator('[data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelectorAll('.v813Node').length===8,undefined,{timeout:3000});
 assert.equal(Number(await page.locator('.v813Node.selected').getAttribute('data-v813-node')),7,'navigation re-entry must select the newest sealed session even if the lifecycle event was missed');
 const subMinute=await page.evaluate(()=>{
  const c=JSON.parse(localStorage.getItem('axis_v60_state')||'{}'),m=JSON.parse(localStorage.getItem('axis_v8_meta')||'{}'),s=(c.sessions||[]).find(x=>x.id==='same-day-8'),e=s?.events?.[0],a=m.events?.[e?.id]?.activity;
  return{rawSpan:(Number(s?.end)||0)-(Number(s?.start)||0),sessionStart:s?.start,sessionEnd:s?.end,eventTime:e?.time,activityStart:a?.startedAt,activityEnd:a?.finishedAt,selected:document.querySelector('.v813Node.selected')?.dataset.v813Node,sessionMeta:document.querySelector('#v813SessionMeta')?.textContent||'',fingerMeta:document.querySelector('#v813FingerMeta')?.textContent||'',insight:document.querySelector('#v813Insight')?.textContent||''};
 });
 assert.equal(subMinute.rawSpan,10000,`sub-minute fixture drifted: ${JSON.stringify(subMinute)}`);
 assert.ok(subMinute.sessionMeta.includes('<1分钟'),`sub-minute sealed session must not be fabricated as one minute: ${JSON.stringify(subMinute)}`);
 assert.ok(await page.locator('#v813Fingerprint i').count()>=1,'newly sealed metadata-only session fingerprint missing after navigation re-entry');

 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.querySelector('#v813TrackCanvas')).transitionDuration),'0s');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.13.1 evolution ${ENGINE}] PASS · canonical meta activity · empty/first factual state · 7→8 same-day sealed sessions · lifecycle + navigation refresh · truthful sub-minute duration · read-only resolver · tap/scrub/edge safety`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
