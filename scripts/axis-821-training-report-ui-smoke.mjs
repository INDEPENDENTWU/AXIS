import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const waitBoot=()=>page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_821_REPORT_RANGE_TRUTH__?.schema==='axis.report-range.v1'&&window.__AXIS_821_TRAINING_REPORT_UI__?.reportUIOwner===true,undefined,{timeout:15000});
const day=86400000,base=Date.UTC(2026,7,10,8,0,0);
const profile=(capturedAt,weight,bodyFat,waist)=>({schema:'axis.profile-snapshot.v1',version:1,capturedAt,measurements:{heightCm:178,weightKg:weight,bodyFatPct:bodyFat,waistCm:waist},training:{years:4,weeklyFrequency:3}});
const goal=(capturedAt,kind,targetWeight)=>({schema:'axis.goal-snapshot.v1',version:1,capturedAt,kind,targets:{weightKg:targetWeight,bodyFatPct:15,waistCm:78}});
const time=(start,end,totalMs,activeMs,restMs,unaccountedMs)=>({schema:'axis.session-time.v1',version:1,sealedAt:end,start,end,totalMs,activeMs,restMs,unaccountedMs,classifiedMs:activeMs+restMs,sources:{},policy:{}});
const aStart=base,aEnd=aStart+3600000,bStart=base+day,bEnd=bStart+1800000,cStart=base+day*2,cEnd=cStart+1200000;
const sessions=[
 {id:'legacy-c',start:cStart,end:cEnd,events:[{id:'legacy-e',time:cStart+1000,name:'旧记录项目',equipmentId:'legacy',weight:77,reps:8}]},
 {id:'session-b',start:bStart,end:bEnd,profileSnapshot:profile(bStart,73,17.5,81),goalSnapshot:goal(bStart,'strength',79),timeSummary:time(bStart,bEnd,1800000,900000,300000,600000),events:[{id:'enc-b',time:bStart+1000,name:'自定义节奏',equipmentId:'custom-x',schemaSnapshot:['tempoX'],executionModeSnapshot:'single',metrics:{tempoX:'slow'}}]},
 {id:'session-a',start:aStart,end:aEnd,profileSnapshot:profile(aStart,72.5,18,82),goalSnapshot:goal(aStart,'muscle',78),timeSummary:time(aStart,aEnd,3600000,1800000,600000,1200000),events:[{id:'enc-a',time:aStart+1000,name:'坐姿腿推',equipmentId:'legpress',schemaSnapshot:['weight','reps','sets'],executionModeSnapshot:'sets',metrics:{weight:80,reps:10,sets:3}}]}
];
const state={version:60,sessions,active:null,profile:{name:'LIVE-PROFILE-SHOULD-NOT-APPEAR',height:'210',weight:'199',bodyFat:'4',years:'20',freq:'7',goal:'cardio',measurements:{waistCm:'140'},targets:{weightKg:'220',bodyFatPct:'3',waistCm:'130'},customEq:[{id:'custom-x',name:'CURRENT-DEFINITION-SHOULD-NOT-APPEAR',type:'strength'}],memories:[],objectMetricOverrides:{'custom-x':{version:1,metrics:['weight'],updatedAt:1}}},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}};
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.evaluate(payload=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(payload))},state);await page.reload({waitUntil:'domcontentloaded'});await waitBoot();
 const marker=await page.evaluate(()=>window.__AXIS_821_TRAINING_REPORT_UI__);assert.equal(marker.truthSchema,'axis.report-range.v1');assert.equal(marker.storageWrite,false);assert.equal(marker.liveProfileRead,false);assert.equal(marker.currentObjectDefinitionRead,false);assert.equal(marker.exportOwner,false);assert.equal(marker.legacyShareExport,false);
 const before=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 console.log(`[AXIS 8.21 Training Report UI ${ENGINE}] global Report uses all archived completed Sessions and explicit coverage`);
 await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});
 assert.equal(await page.locator('#axis821ReportScope').textContent(),'全部完成记录');
 assert.deepEqual(await page.locator('.axis821ReportHero b').allTextContents(),['3','3','4']);
 const globalText=await page.locator('#reportPreview').innerText();
 for(const token of ['2 / 3 次有标准时间事实','2 / 3 次有身体快照','2 / 3 次有目标快照','1小时 30分','45分','15分','30分','72.5 kg','73 kg','当时未记录身体快照','当时未记录目标快照','暂无标准时间事实','tempoX','定义未保存','旧格式字段未升级'])assert.ok(globalText.includes(token),`global report missing ${token}`);
 for(const forbidden of ['LIVE-PROFILE-SHOULD-NOT-APPEAR','199 kg','CURRENT-DEFINITION-SHOULD-NOT-APPEAR'])assert.ok(!globalText.includes(forbidden),`live/current data leaked: ${forbidden}`);
 assert.equal(await page.locator('#reportRange').count(),0);assert.equal(await page.locator('#shareReport').count(),0);
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),before,'opening global Report must not mutate canonical storage');
 await page.click('#reportSheet [data-close="reportSheet"]');await page.click('#settingsSheet [data-close="settingsSheet"]');
 console.log(`[AXIS 8.21 Training Report UI ${ENGINE}] existing History -> Session detail -> Training Report remains single-session`);
 await page.click('[data-view="historyView"]');await page.click('[data-session="session-a"]');await page.waitForSelector('#detailSheet.show',{state:'visible'});await page.click('#sessionReportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});
 const singleText=await page.locator('#reportPreview').innerText();assert.ok(singleText.includes('72.5 kg'));assert.ok(singleText.includes('坐姿腿推'));assert.ok(singleText.includes('1小时'));assert.ok(!singleText.includes('73 kg'));assert.ok(!singleText.includes('自定义节奏'));assert.ok(!singleText.includes('旧记录项目'));
 assert.equal(await page.locator('[data-axis821-report-session]').count(),1);
 console.log(`[AXIS 8.21 Training Report UI ${ENGINE}] later live Profile/Object mutation cannot change historical Report`);
 const mutated=await page.evaluate(()=>{const x=JSON.parse(localStorage.getItem('axis_v60_state'));x.profile.weight='333';x.profile.name='MUTATED-LIVE';x.profile.customEq=[{id:'custom-x',name:'MUTATED-OBJECT'}];const raw=JSON.stringify(x);localStorage.setItem('axis_v60_state',raw);return raw});
 await page.click('#reportSheet [data-close="reportSheet"]');await page.click('#sessionReportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});const reopened=await page.locator('#reportPreview').innerText();assert.ok(reopened.includes('72.5 kg'));assert.ok(!reopened.includes('333'));assert.ok(!reopened.includes('MUTATED-LIVE'));assert.ok(!reopened.includes('MUTATED-OBJECT'));
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),mutated,'rerendering historical Report must not write canonical storage');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Training Report UI ${ENGINE}] PASS · existing report IA · all + single-session truth projection · canonical time separation · immutable Profile/Goal snapshots · missing coverage · no export/storage owner`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}