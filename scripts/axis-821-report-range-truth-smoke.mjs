import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const waitBoot=()=>page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_821_REPORT_RANGE_TRUTH__?.schema==='axis.report-range.v1'&&typeof window.__AXIS_821_REPORT_RANGE_TRUTH__?.build==='function',undefined,{timeout:15000});
const profileSnapshot={schema:'axis.profile-snapshot.v1',version:1,capturedAt:100,measurements:{heightCm:178,weightKg:72.5,bodyFatPct:18,waistCm:82},training:{years:4,weeklyFrequency:3}};
const goalSnapshot={schema:'axis.goal-snapshot.v1',version:1,capturedAt:100,kind:'muscle',targets:{weightKg:78,bodyFatPct:15,waistCm:78}};
const timeSummary={schema:'axis.session-time.v1',version:1,sealedAt:160,start:100,end:160,totalMs:60,activeMs:20,restMs:10,unaccountedMs:30,classifiedMs:30,sources:{},policy:{}};
const sessions=[
 {id:'canonical',start:100,end:160,profileSnapshot,goalSnapshot,timeSummary,events:[{id:'enc-1',time:150,equipmentId:'treadmill',schemaSnapshot:['duration','intensity','tempoX'],executionModeSnapshot:'timed',metrics:{duration:12,intensity:7,tempoX:'slow'},duration:999}]},
 {id:'legacy',start:150,end:180,events:[{id:'legacy-enc',time:170,equipmentId:'treadmill',duration:55}]},
 {id:'open',start:175,end:null,events:[{id:'open-enc'}]},
 {id:'boundary',start:200,end:220,events:[]}
];
const state=profile=>({version:60,sessions,active:null,profile:{name:'Live profile',height:'178',weight:String(profile.weight),bodyFat:String(profile.bodyFat),years:'4',freq:profile.freq,goal:profile.goal,measurements:{waistCm:String(profile.waist)},targets:{weightKg:String(profile.targetWeight),bodyFatPct:String(profile.targetBodyFat),waistCm:String(profile.targetWaist)},customEq:[],memories:[],objectMetricOverrides:{treadmill:{version:1,metrics:profile.metrics,updatedAt:1}}},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}});
async function seed(profile){await page.evaluate(payload=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(payload))},state(profile));await page.reload({waitUntil:'domcontentloaded'});await waitBoot()}
async function build(){return page.evaluate(()=>window.__AXIS_821_REPORT_RANGE_TRUTH__.build({start:100,end:200}))}
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 console.log(`[AXIS 8.21 Report Range Truth ${ENGINE}] archived canonical + legacy Session range projects without storage mutation`);
 await seed({weight:72.5,bodyFat:18,waist:82,targetWeight:78,targetBodyFat:15,targetWaist:78,freq:3,goal:'muscle',metrics:['duration','intensity']});
 const marker=await page.evaluate(()=>{const x=window.__AXIS_821_REPORT_RANGE_TRUTH__;return{schema:x.schema,owner:x.owner,source:x.source,liveProfileRead:x.liveProfileRead,currentObjectDefinitionRead:x.currentObjectDefinitionRead,legacyTimeInference:x.legacyTimeInference,legacyMetricPromotion:x.legacyMetricPromotion,storageWrite:x.storageWrite,reportUIOwner:x.reportUIOwner,exportOwner:x.exportOwner}});
 assert.deepEqual(marker,{schema:'axis.report-range.v1',owner:'read-only-report-range-projection',source:'axis_v60_state.sessions',liveProfileRead:false,currentObjectDefinitionRead:false,legacyTimeInference:false,legacyMetricPromotion:false,storageWrite:false,reportUIOwner:false,exportOwner:false});
 const before=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));const first=await build();const after=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 assert.equal(after,before,'Report Range build must not write canonical storage');
 assert.deepEqual(first.sessions.map(x=>x.id),['canonical','legacy']);
 assert.equal(first.summary.sessionCount,2);assert.equal(first.summary.encounterCount,2);assert.equal(first.summary.metricObservationCount,3);
 assert.deepEqual(first.summary.time,{sessionsWithCanonicalTruth:1,sessionsMissingCanonicalTruth:1,totalMs:60,activeMs:20,restMs:10,unaccountedMs:30});
 assert.equal(first.metricObservations.find(x=>x.key==='duration')?.value,12,'canonical Encounter metric must not be replaced by legacy root duration');
 assert.equal(first.sessions[0].encounters[0].legacyRecordedFacts.duration,999);
 assert.equal(first.sessions[1].encounters[0].legacyRecordedFacts.duration,55);
 assert.equal(first.sessions[1].encounters[0].metrics,null,'legacy root facts must not be promoted to canonical metrics');
 const custom=first.metricObservations.find(x=>x.key==='tempoX');assert.ok(custom);assert.equal(custom.definitionMissing,true);assert.equal(custom.definitionStatus,'encounter-key-only');assert.equal(Object.prototype.hasOwnProperty.call(custom,'definitionRef'),false);
 console.log(`[AXIS 8.21 Report Range Truth ${ENGINE}] live Profile changes do not rewrite historical facts`);
 await seed({weight:99,bodyFat:9,waist:60,targetWeight:120,targetBodyFat:8,targetWaist:55,freq:7,goal:'strength',metrics:[]});
 const second=await build();assert.deepEqual(second,first,'same archived Sessions must project identically after live Profile/Object preferences change');
 console.log(`[AXIS 8.21 Report Range Truth ${ENGINE}] current Object resolver is not consulted by historical projection`);
 await page.evaluate(()=>{if(window.__AXIS_OBJECT_TRUTH__)window.__AXIS_OBJECT_TRUTH__.schemaForEq=()=>{throw new Error('current Object definition lookup is forbidden for report range truth')}});
 const beforeResolverProbe=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));const third=await build();const afterResolverProbe=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 assert.deepEqual(third,first);assert.equal(afterResolverProbe,beforeResolverProbe);
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Report Range Truth ${ENGINE}] PASS · completed-only half-open range · immutable snapshot/Encounter facts · canonical time only · live Profile/Object independence · no storage write`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
