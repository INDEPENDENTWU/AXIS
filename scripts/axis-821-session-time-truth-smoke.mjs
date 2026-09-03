import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:417,height:896},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage();
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(o)});
for(const [p,o] of [['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}],['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}]])await page.route(p,r=>json(r,o));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true);await page.waitForFunction(()=>window.__AXIS_821_SESSION_TIME_TRUTH__?.schema==='axis.session-time.v1')};

try{
 await page.goto(BASE,{waitUntil:'domcontentloaded'});
 await page.evaluate(()=>{const n=Date.now(),b=n-180000,finished=iv=>({status:'finished',intervals:iv,restAccumulatedMs:0,restStartedAt:null});
  const ps={schema:'axis.profile-snapshot.v1',version:1,capturedAt:b,measurements:{heightCm:178,weightKg:78,bodyFatPct:16,waistCm:82},training:{years:4,weeklyFrequency:4}},gs={schema:'axis.goal-snapshot.v1',version:1,capturedAt:b,kind:'减脂',targets:{weightKg:75,bodyFatPct:13,waistCm:78}};
  const events=[{id:'A',name:'A',kind:'strength',time:b+80000,weight:50,reps:10,sets:2},{id:'B',name:'B',kind:'strength',time:b+70000,weight:30,reps:12,sets:1},{id:'C',name:'C',kind:'cardio',time:b+170000,duration:1,intensity:12,metrics:{duration:1},executionModeSnapshot:'timed'},{id:'D',name:'D',kind:'strength',time:b+175000,weight:80,reps:8,sets:3,metrics:{weight:80,reps:8,sets:3}}];
  const a=finished([{start:b+10000,end:b+30000},{start:b+60000,end:b+80000}]);a.restAccumulatedMs=30000;const m={prefs:{},events:{A:{activity:a},B:{activity:finished([{start:b+40000,end:b+70000}])},C:{activity:finished([])},D:{activity:finished([])}}};
  localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify({version:60,sessions:[{id:'OLD',start:b-100000,end:b-90000,events:[]}],active:{id:'TIME',start:b,events,profileSnapshot:ps,goalSnapshot:gs},profile:{name:'T',weight:'82',customEq:[],memories:[],targets:{weightKg:74}},prefs:{}}));localStorage.setItem('axis_v8_meta',JSON.stringify(m))});
 await page.reload({waitUntil:'domcontentloaded'});await ready();
 const marker=await page.evaluate(()=>window.__AXIS_821_SESSION_TIME_TRUTH__);for(const k of ['legacyBackfill','strengthInference','newPersistence','newEncounterWriter','newActiveOwner','newFlowOwner','reportOwner'])assert.equal(marker[k],false,k);assert.equal(marker.owner,'app-session-completion');
 const before=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state'));return{p:c.active.profileSnapshot,g:c.active.goalSnapshot}});
 const hold=page.locator('#finishHold');await hold.waitFor({state:'visible'});const box=await hold.boundingBox();assert.ok(box);await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();try{await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v60_state')||'{}').sessions?.[0]?.timeSummary?.schema==='axis.session-time.v1',undefined,{timeout:4000})}finally{await page.mouse.up().catch(()=>{})}
 const out=await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state'));return{s:c.sessions[0],old:c.sessions[1]}}),t=out.s.timeSummary;
 assert.equal(t.activeMs,120000);assert.equal(t.restMs,10000);assert.equal(t.classifiedMs,130000);assert.equal(t.unaccountedMs,t.totalMs-130000);assert.ok(t.unaccountedMs>0);assert.deepEqual(t.sources,{activeIntervals:3,explicitDurationEvents:1,explicitPauseIntervals:1,unmeasuredEvents:1,ambiguousSettledRestMs:0});assert.equal(t.policy.strengthInference,false);assert.deepEqual(out.s.profileSnapshot,before.p);assert.deepEqual(out.s.goalSnapshot,before.g);assert.equal(Object.hasOwn(out.old,'timeSummary'),false);
 const sealed=JSON.stringify({t,p:out.s.profileSnapshot,g:out.s.goalSnapshot});await page.evaluate(()=>{const c=JSON.parse(localStorage.getItem('axis_v60_state'));c.profile.weight='99';c.profile.targets={weightKg:68};localStorage.setItem('axis_v60_state',JSON.stringify(c))});await page.reload({waitUntil:'domcontentloaded'});await ready();
 assert.equal(await page.evaluate(()=>{const s=JSON.parse(localStorage.getItem('axis_v60_state')).sessions[0];return JSON.stringify({t:s.timeSummary,p:s.profileSnapshot,g:s.goalSnapshot})}),sealed);assert.deepEqual(errors,[]);
 console.log(`[AXIS 8.21 Session Time Truth ${ENGINE}] PASS · immutable completion summary · real Active union · explicit duration · overlap-safe rest · honest unaccounted · no legacy backfill`)
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
