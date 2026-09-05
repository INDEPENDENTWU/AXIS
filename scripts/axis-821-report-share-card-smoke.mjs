import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',timezoneId:'Asia/Shanghai'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const waitBoot=()=>page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_821_REPORT_RANGE_TRUTH__?.schema==='axis.report-range.v1'&&window.__AXIS_821_TRAINING_REPORT_UI__?.reportUIOwner===true&&window.__AXIS_821_REPORT_PDF_EXPORT__?.exportOwner===true&&window.__AXIS_821_REPORT_SHARE_CARD__?.exportOwner===true,undefined,{timeout:15000});
const profile=(at,i)=>({schema:'axis.profile-snapshot.v1',version:1,capturedAt:at,measurements:{heightCm:178,weightKg:70+i/10,bodyFatPct:18-i/20,waistCm:82-i/10},training:{years:4,weeklyFrequency:4}});
const goal=at=>({schema:'axis.goal-snapshot.v1',version:1,capturedAt:at,kind:'strength',targets:{weightKg:78,bodyFatPct:15,waistCm:78}});
const time=(start,end)=>({schema:'axis.session-time.v1',version:1,sealedAt:end,start,end,totalMs:end-start,activeMs:1800000,restMs:600000,unaccountedMs:600000,classifiedMs:2400000,sources:{},policy:{}});
const sessions=[];
for(let day=1;day<=6;day++){
 const start=Date.UTC(2026,7,day,1,0,0),end=start+3000000,events=[];
 for(let j=1;j<=4;j++)events.push({id:`e-${day}-${j}`,time:start+j*120000,name:`历史项目 ${day}-${j}`,equipmentId:`eq-${j}`,schemaSnapshot:['weight','reps','sets'],executionModeSnapshot:'sets',metrics:{weight:40+day+j,reps:8+j,sets:3}});
 sessions.push({id:`s-${day}`,start,end,profileSnapshot:profile(start,day),goalSnapshot:goal(start),timeSummary:time(start,end),events});
}
sessions.reverse();
const state={version:60,sessions,active:null,profile:{name:'分享用户',height:'181',weight:'88.8',bodyFat:'16.2',years:'6',freq:'5',goal:'strength',measurements:{waistCm:'84'},targets:{weightKg:'82',bodyFatPct:'14',waistCm:'80'},customEq:[],memories:[],objectMetricOverrides:{}},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}};
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.evaluate(payload=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(payload))},state);await page.reload({waitUntil:'domcontentloaded'});await waitBoot();
 const marker=await page.evaluate(()=>{const m=window.__AXIS_821_REPORT_SHARE_CARD__;return{truthSchema:m.truthSchema,sourceOwner:m.sourceOwner,format:m.format,projection:m.projection,rasterized:m.rasterized,screenshotBased:m.screenshotBased,storageWrite:m.storageWrite,networkWrite:m.networkWrite,personalInfo:m.personalInfo,historicalAggregation:m.historicalAggregation}});
 assert.deepEqual(marker,{truthSchema:'axis.report-range.v1',sourceOwner:'__AXIS_821_TRAINING_REPORT_UI__',format:'image/png',projection:'summary-share-card',rasterized:true,screenshotBased:false,storageWrite:false,networkWrite:false,personalInfo:'optional-export-time',historicalAggregation:false});
 const before=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 console.log(`[AXIS 8.21 Report Share Card ${ENGINE}] custom Report range stays canonical`);
 await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});
 await page.locator('#axis821ReportFrom').fill('2026-08-02');await page.locator('#axis821ReportTo').fill('2026-08-04');await page.click('#axis821ReportApply');
 await page.waitForFunction(()=>document.querySelectorAll('[data-axis821-report-session]').length===3,undefined,{timeout:1500});
 assert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'2026-08-02 — 2026-08-04');
 const ids=await page.locator('[data-axis821-report-session]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-axis821-report-session')));assert.deepEqual(ids,['s-4','s-3','s-2']);
 const rangeText=await page.locator('#reportPreview').innerText();for(const token of ['历史项目 2-1','历史项目 4-4','70.2 kg','70.4 kg'])assert.ok(rangeText.includes(token),`range Report missing ${token}`);for(const token of ['历史项目 1-1','历史项目 5-1','88.8 kg','分享用户'])assert.ok(!rangeText.includes(token),`screen historical Report leaked ${token}`);
 assert.equal((await page.locator('#axis821ReportIdentity+span').innerText()).trim(),'导出时包含个人信息');
 const overflow=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,box:document.querySelector('#axis821ReportToolbar')?.getBoundingClientRect()}));assert.ok(overflow.sw<=overflow.cw+1,`390px Report export toolbar overflows ${JSON.stringify(overflow)}`);
 const png=await page.evaluate(async()=>{const b=window.__AXIS_821_REPORT_SHARE_CARD__.generate();const u=new Uint8Array(await b.arrayBuffer());return{type:b.type,size:b.size,head:Array.from(u.slice(0,8))}});assert.equal(png.type,'image/png');assert.ok(png.size>8000,`Share Card PNG unexpectedly small ${png.size}`);assert.deepEqual(png.head,[137,80,78,71,13,10,26,10],'Share Card bytes are not PNG');
 await page.evaluate(()=>{try{Object.defineProperty(navigator,'canShare',{configurable:true,value:()=>false})}catch{}try{Object.defineProperty(navigator,'share',{configurable:true,value:undefined})}catch{}window.__AXIS_SHARE_DOWNLOAD__=null;try{URL.createObjectURL=()=> 'blob:axis-report-share-test';URL.revokeObjectURL=()=>{}}catch{}HTMLAnchorElement.prototype.click=function(){window.__AXIS_SHARE_DOWNLOAD__={download:this.download,href:this.href}}});
 console.log(`[AXIS 8.21 Report Share Card ${ENGINE}] image action produces truthful local PNG without identity by default`);
 await page.click('#axis821ReportShareImage');await page.waitForFunction(()=>window.__AXIS_821_REPORT_SHARE_CARD__.lastExport!=null,undefined,{timeout:1500});
 let out=await page.evaluate(()=>({last:window.__AXIS_821_REPORT_SHARE_CARD__.lastExport,download:window.__AXIS_SHARE_DOWNLOAD__}));assert.equal(out.last.type,'image/png');assert.ok(out.last.size>8000);assert.equal(out.last.width,1080);assert.equal(out.last.height,1350);assert.equal(out.last.scope,'2026-08-02 — 2026-08-04');assert.equal(out.last.identityIncluded,false);assert.equal(out.last.identityFields,0);assert.ok(out.download?.download.startsWith('AXIS-训练报告-')&&out.download.download.endsWith('.png'),'Share Card fallback filename is not PNG');
 console.log(`[AXIS 8.21 Report Share Card ${ENGINE}] opt-in export identity stays export-only`);
 await page.locator('#axis821ReportIdentity').check();await page.click('#axis821ReportShareImage');await page.waitForFunction(()=>window.__AXIS_821_REPORT_SHARE_CARD__.lastExport?.identityIncluded===true,undefined,{timeout:1500});out=await page.evaluate(()=>({last:window.__AXIS_821_REPORT_SHARE_CARD__.lastExport,download:window.__AXIS_SHARE_DOWNLOAD__}));assert.equal(out.last.height,1540);assert.equal(out.last.identityIncluded,true);assert.ok(out.last.identityFields>=4,'opt-in identity fields missing');assert.ok(out.last.size>8000);assert.equal((await page.locator('#reportPreview').innerText()).includes('88.8 kg'),false,'current export identity contaminated historical Report body');assert.equal((await page.locator('#reportPreview').innerText()).includes('分享用户'),false,'current export name contaminated historical Report body');
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),before,'Share Card generation mutated canonical state');assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Report Share Card ${ENGINE}] PASS · exact range projection · real PNG · optional export identity · no storage mutation · 390px stable`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
