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
const tap=async l=>ENGINE==='webkit'?l.tap({timeout:4500}):l.click({timeout:4500});
let armed=false,replayNetwork=0;page.on('request',r=>{if(armed&&/\/api\//.test(new URL(r.url()).pathname))replayNetwork++});

const seed=()=>page.evaluate(()=>{
 const DAY=864e5,latest=new Date();latest.setHours(9,0,0,0);const t3=latest.getTime(),starts=[t3-14*DAY,t3-7*DAY,t3],sessions=[],meta={events:{}};
 const rows=[{w:30,r:10},{w:32.5,r:10},{w:35,r:12}];
 starts.forEach((start,i)=>{
  const events=[],eid=`row-${i+1}`;
  events.push({id:eid,time:start+60000,kind:'strength',equipmentId:'row',name:'坐姿划船机',weight:rows[i].w,reps:rows[i].r,sets:3,muscles:['背部'],frameRefs:[]});
  meta.events[eid]={activity:{status:'finished',startedAt:start+10000,finishedAt:start+110000,intervals:[{start:start+10000,end:start+50000},{start:start+65000,end:start+110000}]}};
  if(i===2){const cid='cardio-once';events.push({id:cid,time:start+150000,kind:'cardio',equipmentId:'treadmill',name:'跑步机',duration:20,level:6,muscles:['心肺'],frameRefs:[]});meta.events[cid]={activity:{status:'finished',startedAt:start+120000,finishedAt:start+260000,intervals:[{start:start+120000,end:start+260000}]}}}
  sessions.push({id:`session-${i+1}`,start,end:start+30*60000,events});
 });
 localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions,active:null,profile:{customEq:[]},prefs:{}}));
 localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
 window.dispatchEvent(new CustomEvent('axis:state-changed',{detail:{test:'822'}}));
});

try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_814_EVOLUTION_OBJECTS__?.version==='8.14'&&window.__AXIS_815_MEDIA_EVIDENCE__?.version==='8.15'&&window.__AXIS_822_EVOLUTION_REPLAY__?.version==='8.22'&&window.__AXIS_EVOLUTION_REPLAY__?.version==='8.22',undefined,{timeout:15000});
 assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),'8.22');
 assert.equal(await page.evaluate(()=>window.__AXIS_ARCH__),'canonical-single-runtime');
 await seed();
 await tap(page.locator('nav.nav [data-view="insightsView"]'));
 await page.waitForFunction(()=>document.querySelector('#insightsView')?.classList.contains('active')&&document.querySelectorAll('.v813Node').length===3,undefined,{timeout:5000});
 await tap(page.locator('.v813Node.selected'));
 await page.waitForFunction(()=>document.querySelectorAll('#v813Activities .v813Activity').length===2,undefined,{timeout:2500});
 const rawBefore=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 const metaBefore=await page.evaluate(()=>localStorage.getItem('axis_v8_meta'));
 armed=true;

 const row=page.locator('.v813Activity[data-v814-key="row"]');
 await tap(row);
 await page.waitForFunction(()=>{const x=document.querySelector('#v822Replay');return x&&!x.hidden&&x.textContent.includes('过程回看')&&x.textContent.includes('3次真实记录')},undefined,{timeout:2200});
 let text=(await page.locator('#v822Replay').innerText()).trim();
 for(const expected of ['过程回看','3次真实记录 · 按发生时间回看','1 / 3','30kg · 30次','这次没有影像证据'])assert.ok(text.includes(expected),`Replay missing ${expected}: ${text}`);
 for(const forbidden of ['进步','提升','改善','更好','评分','分数','预测','建议'])assert.ok(!text.includes(forbidden),`Replay fabricated interpretation ${forbidden}`);
 assert.equal(await page.locator('#v822Replay .v822Rail button').count(),3,'Replay rail must represent all real Encounters');
 assert.equal(await page.locator('.sheetWrap.show').count(),0,'Replay must stay in-place');
 assert.equal(replayNetwork,0,'Replay unexpectedly requested an API');

 const resolved=await page.evaluate(()=>window.__AXIS_EVOLUTION_REPLAY__.resolve('row'));
 assert.equal(resolved.encounterCount,3);assert.equal(resolved.status,'sequence');assert.equal(resolved.hasTimeComparison,true);
 assert.deepEqual(resolved.encounters.map(x=>x.eventId),['row-1','row-2','row-3']);
 assert.ok(resolved.encounters[0].time<resolved.encounters[1].time&&resolved.encounters[1].time<resolved.encounters[2].time,'Replay chronology is not ascending factual time');

 await tap(page.locator('#v822Replay [data-v822-step="1"]'));
 await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('2 / 3')&&document.querySelector('#v822Replay')?.textContent.includes('32.5kg · 30次'),undefined,{timeout:1500});
 await tap(page.locator('#v822Replay [data-v822-index="2"]'));
 await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('3 / 3')&&document.querySelector('#v822Replay')?.textContent.includes('35kg · 36次'),undefined,{timeout:1500});
 assert.equal(await page.locator('#v822Replay [data-v822-step="1"]').isDisabled(),true,'latest Replay node must disable forward step');

 const one=page.locator('.v813Activity[data-v814-key="treadmill"]');
 await tap(one);
 await page.waitForFunction(()=>{const x=document.querySelector('#v822Replay');return x&&x.textContent.includes('只有一次真实记录 · 暂无前后对照')},undefined,{timeout:1800});
 text=(await page.locator('#v822Replay').innerText()).trim();
 for(const expected of ['过程回看','只有一次真实记录 · 暂无前后对照','这里显示的是当时留下的事实，不把单次记录解释成变化。','20分钟 · 档位6'])assert.ok(text.includes(expected),`single-Encounter Replay missing ${expected}: ${text}`);
 assert.equal(await page.locator('#v822Replay .v822Rail').count(),0,'single Encounter must not fabricate a comparison rail');
 assert.equal(await page.locator('#v822Replay .v822Controls').count(),0,'single Encounter must not fabricate navigation controls');
 const oneResolved=await page.evaluate(()=>window.__AXIS_EVOLUTION_REPLAY__.resolve('treadmill'));
 assert.equal(oneResolved.encounterCount,1);assert.equal(oneResolved.status,'single');assert.equal(oneResolved.hasTimeComparison,false);

 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),rawBefore,'Replay interaction mutated canonical training storage');
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v8_meta')),metaBefore,'Replay interaction mutated canonical metadata storage');
 assert.equal(replayNetwork,0,'Replay interaction triggered network ownership');
 const geometry=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,inner:innerWidth,root:document.querySelector('#v822Replay')?.getBoundingClientRect(),view:document.querySelector('#insightsView')?.getBoundingClientRect()}));
 assert.ok(geometry.scroll<=geometry.inner+1,`Replay caused horizontal overflow ${geometry.scroll}/${geometry.inner}`);
 assert.ok(geometry.root&&geometry.view&&geometry.root.width<=geometry.view.width+1,'Replay escaped Trends geometry');
 await page.emulateMedia({reducedMotion:'reduce'});
 await tap(row);await page.waitForFunction(()=>document.querySelector('#v822Replay')?.textContent.includes('3次真实记录'),undefined,{timeout:1500});
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.22 Evolution Replay ${ENGINE}] PASS · deterministic factual chronology · direct/step navigation · honest single Encounter · read-only/no-network · mobile-safe`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
