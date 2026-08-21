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
let armed=false,objectNetwork=0;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))objectNetwork++});

const seed=()=>page.evaluate(()=>{
 const DAY=864e5,latest=new Date();latest.setHours(9,0,0,0);const t3=latest.getTime(),starts=[t3-14*DAY,t3-7*DAY,t3],sessions=[],meta={events:{}};
 const rows=[{w:30,r:10,media:['P-FIRST']},{w:32.5,r:10,media:[]},{w:35,r:12,media:[]}];
 starts.forEach((start,i)=>{
  const events=[],eid=`row-${i+1}`;
  events.push({id:eid,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:rows[i].w,reps:rows[i].r,sets:3,muscles:['背部'],frameRefs:rows[i].media});
  meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+110000,intervals:[{start:start+10000,end:start+50000},{start:start+65000,end:start+110000}]}};
  if(i===2){const cid='cardio-once';events.push({id:cid,time:start+150000,kind:'cardio',equipmentId:'treadmill',name:'跑步机',duration:20,level:6,muscles:['心肺'],frameRefs:['P-CARDIO']});meta.events[cid]={activity:{status:'finished',startedAt:start+120000,finishedAt:start+260000,intervals:[{start:start+120000,end:start+260000}]}}}
  sessions.push({id:`session-${i+1}`,start,end:start+30*60000,events});
 });
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'814'}}));
});

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_8131_EVOLUTION_FIELD__?.version==='8.13.1'&&window.__AXIS_814_EVOLUTION_OBJECTS__?.version==='8.14'&&window.__AXIS_EVOLUTION_OBJECTS__?.version==='8.14',undefined,{timeout:12000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.14');
 assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
 await seed();
 await tap(page.locator('nav.nav [data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length===3,undefined,{timeout:4000});
 assert.equal(await page.locator('#insightsView').getAttribute('data-axis-trends-owner'),'v8131-evolution-field');
 assert.equal(await page.locator('#insightsView').getAttribute('data-axis-evolution-object-owner'),'v814-evolution-objects');
 assert.ok(await page.locator('#v813Fingerprint i').count()>=1,'metadata-only activity fingerprint missing before Evolution Object interaction');

 await tap(page.locator('.v813Node.selected'));
 await page.waitForFunction(()=>document.querySelector('#v813Expand')&&!document.querySelector('#v813Expand').hidden&&document.querySelectorAll('#v813Activities .v813Activity').length===2,undefined,{timeout:2000});
 assert.equal(await page.locator('#v813Activities button.v813Activity').count(),2,'activity rows must be semantic buttons');
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 const metaBefore=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));

 armed=true;
 const row=page.locator('.v813Activity[data-v814-key="row"]');
 await tap(row);
 await page.waitForFunction(()=>{const x=document.querySelector('#v814Object');return x&&!x.hidden&&x.textContent.includes('坐姿划船机')},undefined,{timeout:1500});
 await page.waitForTimeout(80);
 const objectText=(await page.locator('#v814Object').innerText()).trim();
 for(const expected of ['坐姿划船机','3次 · 跨14天','影像证据 1','第一次','最近一次','30kg · 30次','35kg · 36次','重量 30kg → 35kg','总次数 30 → 36'])assert.ok(objectText.includes(expected),`Evolution Object missing ${expected}: ${objectText}`);
 for(const forbidden of ['进步','提升','改善','更好','评分','分数'])assert.ok(!objectText.includes(forbidden),`interpretive/score copy survived: ${forbidden}`);
 assert.equal(await page.locator('#v814Object .v814Trail i').count(),3,'encounter trail must preserve all three encounters');
 assert.equal(await row.getAttribute('aria-expanded'),'true');
 assert.equal(await page.locator('.sheetWrap.show').count(),0,'Evolution Object must stay in place and never open a sheet');
 assert.equal(objectNetwork,0,'Evolution Object interaction unexpectedly requested an API');

 const resolved=await page.evaluate(()=>window.__AXIS_EVOLUTION_OBJECTS__.resolve('row'));
 assert.equal(resolved.encounterCount,3);assert.equal(resolved.timeSpanDays,14);assert.equal(resolved.mediaEvidence,1);
 assert.equal(resolved.firstEncounter.summary,'30kg · 30次');assert.equal(resolved.latestEncounter.summary,'35kg · 36次');
 assert.deepEqual(resolved.factualDelta,['重量 30kg → 35kg','总次数 30 → 36次'.replace('次','')]);

 const one=page.locator('.v813Activity[data-v814-key="treadmill"]');
 await tap(one);await page.waitForFunction(()=>{const x=document.querySelector('#v814Object');return x&&!x.hidden&&x.textContent.includes('跑步机')},undefined,{timeout:1200});
 const oneText=(await page.locator('#v814Object').innerText()).trim();
 for(const expected of ['跑步机','首次记录','影像证据 1','第一次 · 也是最近一次','20分钟 · 档位6'])assert.ok(oneText.includes(expected),`one-off object missing ${expected}: ${oneText}`);
 for(const forbidden of ['→','进步','提升','改善','更好'])assert.ok(!oneText.includes(forbidden),`one-off encounter fabricated change: ${forbidden}`);
 assert.equal(await page.locator('#v814Object .v814Trail i').count(),1);
 const oneResolved=await page.evaluate(()=>window.__AXIS_EVOLUTION_OBJECTS__.resolve('treadmill'));
 assert.equal(oneResolved.encounterCount,1);assert.equal(oneResolved.timeSpanDays,0);assert.deepEqual(oneResolved.factualDelta,[]);

 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),rawBefore,'Evolution Object interaction mutated canonical training storage');
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBefore,'Evolution Object interaction mutated canonical metadata storage');
 assert.equal(objectNetwork,0,'Evolution Object interaction triggered network ownership');
 const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,root:document.querySelector('#v814Object')?.getBoundingClientRect(),view:document.querySelector('#insightsView')?.getBoundingClientRect()}));
 assert.ok(geometry.scroll<=geometry.inner+1,`Evolution Object caused horizontal overflow ${geometry.scroll}/${geometry.inner}`);
 assert.ok(geometry.root&&geometry.root.width<=geometry.view.width+1,'Evolution Object escaped Trends geometry');

 await tap(page.locator('.v813Node.selected'));await page.waitForTimeout(80);
 assert.equal(await page.locator('#v814Object').isHidden(),true,'session re-selection must clear stale Evolution Object');
 await page.emulateMedia({reducedMotion:'reduce'});
 await tap(page.locator('.v813Node.selected'));await page.waitForFunction(()=>document.querySelectorAll('#v813Activities .v813Activity').length===2,undefined,{timeout:1200});
 await tap(page.locator('.v813Activity[data-v814-key="row"]'));await page.waitForTimeout(60);
 assert.equal(await page.locator('#v814Object').isVisible(),true,'reduced-motion mode lost Evolution Object interaction');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.14 Evolution Objects ${ENGINE}] PASS · repeated + first-only objects · factual first/latest delta · media/count/time evidence · in-place · read-only · no network · mobile geometry`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
