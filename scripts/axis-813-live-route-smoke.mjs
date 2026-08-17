import assert from 'node:assert/strict';
import fs from 'node:fs';

const ENGINE=process.env.AXIS_ENGINE||'chromium';
const BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const EXPECTED=JSON.parse(fs.readFileSync('release-contract.json','utf8')).publicVersion;
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core');
const launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},locale:'zh-CN'});
const page=await context.newPage();
const json=(r,obj)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(obj)});
for(const [pattern,obj] of [
 ['**/api/ai-status**',{available:false,vision:false,insight:false,version:'axis-ai-v4'}],
 ['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false,error:'not_available'}],['**/api/insight**',{available:false,error:'not_available'}],
 ['**/nominatim.openstreetmap.org/reverse**',{name:'测试健身房',address:{road:'测试路',city:'测试市'}}]
])await page.route(pattern,r=>json(r,obj));
const errors=[];page.on('pageerror',e=>errors.push(String(e?.stack||e)));
const ready=async()=>{await page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true,undefined,{timeout:6000});await page.waitForFunction(()=>window.__AXIS_CANONICAL_88__?.state==='ready',undefined,{timeout:9000});await page.waitForFunction(()=>window.__AXIS_813_ROUTE__?.owner==='v813-live-route',undefined,{timeout:3000})};
const stores=()=>page.evaluate(()=>[localStorage.getItem('axis_v60_state'),localStorage.getItem('axis_v8_meta')]);
const routeText=async()=>((await page.locator('#axis813Route').innerText())||'').replace(/\s+/g,' ').trim();

assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:12000}))?.ok());
await page.evaluate(()=>localStorage.clear());await page.reload({waitUntil:'domcontentloaded'});await ready();
assert.equal(await page.evaluate(()=>window.__AXIS_RELEASE__),EXPECTED);assert.equal(EXPECTED,'8.12');

console.log(`[AXIS 8.13 Live Route ${ENGINE}] idle Home keeps route non-owning`);
assert.equal(await page.locator('#axis813Route').count(),1,'single route owner did not mount');
assert.equal(await page.locator('#axis813Route').isHidden(),true,'route surfaced without an active workout');
assert.equal(await page.locator('#finishHold:visible').count(),0,'idle Home recording controls changed');
let diag=await page.evaluate(()=>window.__AXIS_813_ROUTE__);
assert.deepEqual({owner:diag.owner,recordingOwner:diag.recordingOwner,storageOwner:diag.storageOwner,networkOwner:diag.networkOwner,writes:diag.writes,storageWrites:diag.storageWrites},{owner:'v813-live-route',recordingOwner:false,storageOwner:false,networkOwner:false,writes:0,storageWrites:0});

console.log(`[AXIS 8.13 Live Route ${ENGINE}] factual current stays in active card; route starts from future continuation`);
await page.evaluate(()=>{
 const t=Date.now(),histStart=t-3*86400000;
 const hist={id:'R-HIST',start:histStart,end:histStart+42*60000,events:[
  {id:'RH-C',equipmentId:'chest',name:'胸推',kind:'strength',time:histStart+4*60000,weight:40,reps:10,sets:3,pattern:'push',muscles:['胸肌'],frameRefs:[]},
  {id:'RH-R',equipmentId:'row',name:'坐姿划船',kind:'strength',time:histStart+16*60000,weight:42.5,reps:10,sets:3,pattern:'pull',muscles:['背部'],frameRefs:[]},
  {id:'RH-S',equipmentId:'shoulder',name:'肩推',kind:'strength',time:histStart+29*60000,weight:25,reps:10,sets:3,pattern:'push',muscles:['肩部'],frameRefs:[]}
 ]};
 const event={id:'R-CHEST',equipmentId:'chest',name:'胸推',kind:'strength',time:t-5*60000,weight:40,reps:10,sets:3,pattern:'push',muscles:['胸肌'],frameRefs:[]};
 const core={version:60,sessions:[hist],active:{id:'R-LIVE',start:t-8*60000,events:[event]},selectedEq:null,frames:[],clip:null,stream:null,ai:null,profile:{name:'',height:'',weight:'',bodyFat:'',years:'',freq:3,goal:'保持规律',memories:[],customEq:[]},prefs:{keepClip:true,scanSeconds:3,watermark:{name:true,data:true,time:true,brand:true,pos:'bl',photoMode:'wm',videoMode:'wm'}}};
 const meta={prefs:{},events:{'R-CHEST':{activity:{status:'active',startedAt:t-5*60000,lastResumedAt:t-5*60000,pausedAt:null,finishedAt:null,estimateMs:7*60000,completedSets:0,intervals:[{start:t-5*60000,end:null}],restStartedAt:null,restAccumulatedMs:0},sets:[{weight:40,reps:10,state:'assumed',doneAt:null},{weight:40,reps:10,state:'assumed',doneAt:null},{weight:40,reps:10,state:'assumed',doneAt:null}]}}};
 localStorage.setItem('axis_v60_state',JSON.stringify(core));localStorage.setItem('axis_v8_meta',JSON.stringify(meta));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();
await page.waitForFunction(()=>document.querySelector('#v87Finish')?.dataset.id==='R-CHEST'&&!document.querySelector('#axis813Route')?.classList.contains('hidden'),undefined,{timeout:5000});
const firstRoute=await routeText();
assert.match(firstRoute,/接下来/);assert.match(firstRoute,/坐姿划船/,'historical continuation was not surfaced');assert.doesNotMatch(firstRoute,/胸推/,'factual current item was duplicated in future route');
const snap=await page.evaluate(()=>window.__AXIS_813_ROUTE__.snapshot());
assert.equal(snap.facts.currentEventId,'R-CHEST');assert.equal(snap.facts.activeEvents.find(x=>x.eventId==='R-CHEST').performedSets,0,'assumed sets became performed work');
const geometry=await page.evaluate(()=>({card:document.querySelector('#v87Now')?.getBoundingClientRect().toJSON(),nav:document.querySelector('.nav')?.getBoundingClientRect().toJSON()}));
const beforeRefresh=await stores();await page.evaluate(()=>window.__AXIS_813_ROUTE__.refresh());await page.waitForTimeout(80);assert.deepEqual(await stores(),beforeRefresh,'manual route refresh wrote training storage');
const geometryAfter=await page.evaluate(()=>({card:document.querySelector('#v87Now')?.getBoundingClientRect().toJSON(),nav:document.querySelector('.nav')?.getBoundingClientRect().toJSON()}));
for(const key of ['x','y','width','height'])assert.ok(Math.abs((geometry.card?.[key]||0)-(geometryAfter.card?.[key]||0))<=1.5,`active card geometry changed on route refresh: ${key}`);
for(const key of ['x','y','width','height'])assert.ok(Math.abs((geometry.nav?.[key]||0)-(geometryAfter.nav?.[key]||0))<=1.5,`navigation geometry changed on route refresh: ${key}`);

console.log(`[AXIS 8.13 Live Route ${ENGINE}] real set completion, pause and resume update facts without route ownership drift`);
await page.waitForFunction(()=>document.querySelector('#v87Primary')&&!document.querySelector('#v87Primary').disabled);
await page.locator('#v87Primary').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')||'{}').events?.['R-CHEST']?.activity?.completedSets===1);
await page.waitForFunction(()=>window.__AXIS_813_ROUTE__?.snapshot?.()?.facts?.activeEvents?.find(x=>x.eventId==='R-CHEST')?.performedSets===1,undefined,{timeout:2500});
let activity=await page.evaluate(()=>JSON.parse(localStorage.getItem('axis_v8_meta')).events['R-CHEST'].activity);assert.equal(activity.restStartedAt,null,'route integration regressed set-complete rest semantics');
assert.match(await routeText(),/坐姿划船/);
const routeAfterSet=await routeText();
await page.locator('#v87Toggle').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')).events?.['R-CHEST']?.activity?.status==='paused');await page.waitForTimeout(120);
assert.equal(await routeText(),routeAfterSet,'pause changed future route without any factual route change');
assert.equal(await page.evaluate(()=>window.__AXIS_813_ROUTE__.snapshot().facts.activeEvents.find(x=>x.eventId==='R-CHEST').performedSets),1,'pause fabricated route progress');
await page.waitForTimeout(180);await page.locator('#v87Toggle').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('axis_v8_meta')).events?.['R-CHEST']?.activity?.status==='active');await page.waitForTimeout(120);
assert.equal(await routeText(),routeAfterSet,'resume changed future route without factual route change');
assert.equal(await page.evaluate(()=>window.__AXIS_ACTIVE_CONTROL__?.owner),'v87-direct-884','Live Route took active-control ownership');

console.log(`[AXIS 8.13 Live Route ${ENGINE}] current-event change recomputes continuation`);
await page.evaluate(()=>{
 const t=Date.now(),c=JSON.parse(localStorage.getItem('axis_v60_state')),m=JSON.parse(localStorage.getItem('axis_v8_meta'));
 const chest=m.events['R-CHEST'].activity;if(chest.status==='active'){chest.intervals.at(-1).end=t;chest.status='paused';chest.pausedAt=t;chest.restStartedAt=t}
 const row={id:'R-ROW',equipmentId:'row',name:'坐姿划船',kind:'strength',time:t-1000,weight:42.5,reps:10,sets:3,pattern:'pull',muscles:['背部'],frameRefs:[]};c.active.events.push(row);
 m.events['R-ROW']={activity:{status:'active',startedAt:t-1000,lastResumedAt:t-1000,pausedAt:null,finishedAt:null,estimateMs:7*60000,completedSets:0,intervals:[{start:t-1000,end:null}],restStartedAt:null,restAccumulatedMs:0},sets:[{weight:42.5,reps:10,state:'assumed',doneAt:null},{weight:42.5,reps:10,state:'assumed',doneAt:null},{weight:42.5,reps:10,state:'assumed',doneAt:null}]};
 localStorage.setItem('axis_v60_state',JSON.stringify(c));localStorage.setItem('axis_v8_meta',JSON.stringify(m));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>document.querySelector('#v87Finish')?.dataset.id==='R-ROW');await page.waitForFunction(()=>window.__AXIS_813_ROUTE__?.snapshot?.()?.facts?.currentEventId==='R-ROW');
const rowRoute=await routeText();assert.match(rowRoute,/肩推/,'route did not advance from factual row to historical next');assert.doesNotMatch(rowRoute,/坐姿划船/,'new factual current item was duplicated in future route');

console.log(`[AXIS 8.13 Live Route ${ENGINE}] active cardio remains unfinished in presentation facts`);
await page.evaluate(()=>{
 const t=Date.now(),c=JSON.parse(localStorage.getItem('axis_v60_state'));
 const event={id:'R-CARDIO',equipmentId:'treadmill',name:'跑步机',kind:'cardio',time:t-2*60000,duration:20,intensity:5,pattern:'cardio',muscles:['心肺'],frameRefs:[]};c.active={id:'R-CARDIO-SESSION',start:t-2*60000,events:[event]};localStorage.setItem('axis_v60_state',JSON.stringify(c));
 localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{'R-CARDIO':{activity:{status:'active',startedAt:t-2*60000,lastResumedAt:t-2*60000,pausedAt:null,finishedAt:null,estimateMs:20*60000,completedSets:0,intervals:[{start:t-2*60000,end:null}],restStartedAt:null,restAccumulatedMs:0},sets:[]}}}));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>window.__AXIS_813_ROUTE__?.snapshot?.()?.facts?.currentEventId==='R-CARDIO');
assert.equal(await page.evaluate(()=>window.__AXIS_813_ROUTE__.snapshot().facts.activeEvents.find(x=>x.eventId==='R-CARDIO').completed),false,'active cardio plan became completed work');

console.log(`[AXIS 8.13 Live Route ${ENGINE}] insufficient evidence hides route instead of inventing work`);
await page.evaluate(()=>{
 const t=Date.now(),event={id:'R-ONLY',equipmentId:'pec',name:'夹胸',kind:'strength',time:t-1000,weight:30,reps:12,sets:3,pattern:'push',muscles:['胸肌'],frameRefs:[]};
 const c=JSON.parse(localStorage.getItem('axis_v60_state'));c.sessions=[];c.active={id:'R-ONLY-S',start:t-2000,events:[event]};localStorage.setItem('axis_v60_state',JSON.stringify(c));localStorage.setItem('axis_v8_meta',JSON.stringify({prefs:{},events:{'R-ONLY':{activity:{status:'active',startedAt:t-1000,lastResumedAt:t-1000,pausedAt:null,finishedAt:null,estimateMs:7*60000,completedSets:0,intervals:[{start:t-1000,end:null}],restStartedAt:null,restAccumulatedMs:0},sets:[{weight:30,reps:12,state:'assumed',doneAt:null},{weight:30,reps:12,state:'assumed',doneAt:null},{weight:30,reps:12,state:'assumed',doneAt:null}]}}}));
});
await page.reload({waitUntil:'domcontentloaded'});await ready();await page.waitForFunction(()=>window.__AXIS_813_ROUTE__?.state==='empty',undefined,{timeout:3000});assert.equal(await page.locator('#axis813Route').isHidden(),true,'route invented a future item without evidence');

console.log(`[AXIS 8.13 Live Route ${ENGINE}] lifecycle is idempotent`);
await page.evaluate(()=>{window.dispatchEvent(new Event('pageshow'));window.dispatchEvent(new Event('focus'));document.dispatchEvent(new Event('visibilitychange'))});await page.waitForTimeout(120);assert.equal(await page.locator('#axis813Route').count(),1,'lifecycle duplicated route owner');
assert.equal(await page.evaluate(()=>window.__AXIS_813_ROUTE__.recordingOwner),false);
assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
await context.close();await browser.close();
console.log(`[AXIS 8.13 Live Route ${ENGINE}] PASS · single read-only route owner · factual current/future split · set/pause/resume/current-change/cardio · neutral fallback · stable geometry`);
