import assert from 'node:assert/strict';
const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',timezoneId:'Asia/Shanghai'}),page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));
const waitBoot=()=>page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_821_REPORT_RANGE_TRUTH__?.schema==='axis.report-range.v1'&&window.__AXIS_821_TRAINING_REPORT_UI__?.reportUIOwner===true&&window.__AXIS_821_REPORT_PDF_EXPORT__?.exportOwner===true,undefined,{timeout:15000});
const profile=(at,i)=>({schema:'axis.profile-snapshot.v1',version:1,capturedAt:at,measurements:{heightCm:178,weightKg:70+i/10,bodyFatPct:18-i/20,waistCm:82-i/10},training:{years:4,weeklyFrequency:4}});
const goal=at=>({schema:'axis.goal-snapshot.v1',version:1,capturedAt:at,kind:'strength',targets:{weightKg:78,bodyFatPct:15,waistCm:78}});
const time=(start,end)=>({schema:'axis.session-time.v1',version:1,sealedAt:end,start,end,totalMs:end-start,activeMs:1800000,restMs:600000,unaccountedMs:600000,classifiedMs:2400000,sources:{},policy:{}});
const sessions=[];
for(let day=1;day<=12;day++){
 const start=Date.UTC(2026,7,day,1,0,0),end=start+3000000,events=[];
 for(let j=1;j<=6;j++)events.push({id:`e-${day}-${j}`,time:start+j*120000,name:`历史项目 ${day}-${j}`,equipmentId:`eq-${j}`,schemaSnapshot:['weight','reps','sets','intensity'],executionModeSnapshot:'sets',metrics:{weight:40+day+j,reps:8+j,sets:3,intensity:8+((day+j)%8)}});
 sessions.push({id:`s-${day}`,start,end,profileSnapshot:profile(start,day),goalSnapshot:goal(start),timeSummary:time(start,end),events});
}
sessions.reverse();
const state={version:60,sessions,active:null,profile:{name:'导出用户',height:'181',weight:'88.8',bodyFat:'16.2',years:'6',freq:'5',goal:'strength',measurements:{waistCm:'84'},targets:{weightKg:'82',bodyFatPct:'14',waistCm:'80'},customEq:[],memories:[],objectMetricOverrides:{}},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}};
try{
 assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
 await page.evaluate(payload=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(payload))},state);await page.reload({waitUntil:'domcontentloaded'});await waitBoot();
 const marker=await page.evaluate(()=>window.__AXIS_821_REPORT_PDF_EXPORT__);assert.equal(marker.truthSchema,'axis.report-range.v1');assert.equal(marker.pipeline,'browser-print-pdf');assert.equal(marker.vectorText,true);assert.equal(marker.rasterized,false);assert.equal(marker.storageWrite,false);assert.equal(marker.networkWrite,false);assert.equal(marker.rangeSemantics,'local-day-half-open');assert.equal(marker.personalInfo,'optional-export-time');
 const before=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
 console.log(`[AXIS 8.21 Report PDF Export ${ENGINE}] Settings Report supports exact local-date range`);
 await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});
 assert.equal(await page.locator('[data-axis821-report-session]').count(),12,'all-history Report did not start with all completed Sessions');
 await page.locator('#axis821ReportFrom').fill('2026-08-03');await page.locator('#axis821ReportTo').fill('2026-08-06');await page.click('#axis821ReportApply');
 await page.waitForFunction(()=>document.querySelectorAll('[data-axis821-report-session]').length===4,undefined,{timeout:1500});
 assert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'2026-08-03 — 2026-08-06');
 const ids=await page.locator('[data-axis821-report-session]').evaluateAll(xs=>xs.map(x=>x.getAttribute('data-axis821-report-session')));
 assert.deepEqual(ids,['s-3','s-4','s-5','s-6'],'date range is not inclusive-by-day / half-open internally');
 const rangeText=await page.locator('#reportPreview').innerText();for(const token of ['历史项目 3-1','历史项目 6-6','70.3 kg','70.6 kg'])assert.ok(rangeText.includes(token),`range Report missing ${token}`);for(const token of ['历史项目 2-1','历史项目 7-1','88.8 kg','导出用户'])assert.ok(!rangeText.includes(token),`screen historical Report leaked out-of-range/live export identity ${token}`);
 const overflow=await page.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth,box:document.querySelector('#axis821ReportToolbar')?.getBoundingClientRect()}));assert.ok(overflow.sw<=overflow.cw+1,`390px Report toolbar overflows horizontally ${JSON.stringify(overflow)}`);
 await page.locator('#axis821ReportIdentity').check();
 if(ENGINE==='chromium'){
   console.log('[AXIS 8.21 Report PDF Export chromium] real A4 PDF bytes remain vector browser output and span multiple pages');
   assert.equal(await page.evaluate(()=>window.__AXIS_821_REPORT_PDF_EXPORT__.prepare()),true);
   assert.equal(await page.evaluate(()=>document.body.classList.contains('axis821ReportPrinting')),true);
   const cover=await page.locator('#axis821ReportPrintCover').innerText();for(const token of ['AXIS','训练报告','2026-08-03 — 2026-08-06','导出时个人信息','导出用户','88.8 kg','历史身体状态与目标仍以每次训练当时保存的快照为准'])assert.ok(cover.includes(token),`print cover missing ${token}`);
   assert.ok(rangeText.includes('70.3 kg')&&!rangeText.includes('88.8 kg'),'export-time identity contaminated historical Session snapshot');
   const pdf=await page.pdf({format:'A4',printBackground:true,preferCSSPageSize:true});assert.ok(pdf.subarray(0,4).toString()==='%PDF','Chromium did not produce a PDF document');assert.ok(pdf.length>25000,`PDF unexpectedly small ${pdf.length}`);const pages=(pdf.toString('latin1').match(/\/Type\s*\/Page\b/g)||[]).length;assert.ok(pages>=2,`expected multi-page PDF, got ${pages}`);assert.ok(!pdf.toString('latin1').includes('html2canvas'),'raster pipeline marker leaked into PDF');
   await page.evaluate(()=>window.__AXIS_821_REPORT_PDF_EXPORT__.cleanup());assert.equal(await page.evaluate(()=>document.body.classList.contains('axis821ReportPrinting')),false);
 }else{
   console.log('[AXIS 8.21 Report PDF Export webkit] real export button invokes native print document with same truthful cover');
   await page.evaluate(()=>{window.__AXIS_WK_PRINT_CAPTURE__=null;window.print=()=>{window.__AXIS_WK_PRINT_CAPTURE__={printing:document.body.classList.contains('axis821ReportPrinting'),title:document.title,cover:document.querySelector('#axis821ReportPrintCover')?.innerText||'',scope:document.querySelector('#axis821ReportScope')?.innerText||'',sessions:document.querySelectorAll('[data-axis821-report-session]').length}}});
   await page.click('#axis821ReportPdf');await page.waitForFunction(()=>window.__AXIS_WK_PRINT_CAPTURE__!=null,undefined,{timeout:1500});const cap=await page.evaluate(()=>window.__AXIS_WK_PRINT_CAPTURE__);assert.equal(cap.printing,true);assert.ok(cap.title.startsWith('AXIS-训练报告-'));assert.equal(cap.scope,'2026-08-03 — 2026-08-06');assert.equal(cap.sessions,4);for(const token of ['导出时个人信息','导出用户','88.8 kg'])assert.ok(cap.cover.includes(token),`WebKit print cover missing ${token}`);await page.waitForFunction(()=>!document.body.classList.contains('axis821ReportPrinting'),undefined,{timeout:1500});
 }
 assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),before,'Report PDF range/export mutated canonical state');
 await page.click('#axis821ReportAll');await page.waitForFunction(()=>document.querySelectorAll('[data-axis821-report-session]').length===12,undefined,{timeout:1500});assert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'全部完成记录');
 assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
 console.log(`[AXIS 8.21 Report PDF Export ${ENGINE}] PASS · exact date range · optional export identity · historical snapshots stay immutable · professional native PDF/print · no storage write`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}