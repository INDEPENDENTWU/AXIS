import assert from 'node:assert/strict';

const ENGINE=process.env.AXIS_ENGINE||'chromium',BASE=process.env.AXIS_URL||'http://127.0.0.1:4173';
const mod=ENGINE==='webkit'?await import('playwright'):await import('playwright-core'),launcher=ENGINE==='webkit'?mod.webkit:mod.chromium;
const browser=await launcher.launch(ENGINE==='chromium'?{headless:true,executablePath:process.env.CHROME_BIN||undefined,args:['--no-sandbox']}:{headless:true});
const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:ENGINE==='webkit',hasTouch:true,locale:'zh-CN',timezoneId:'Asia/Shanghai'});
const page=await context.newPage(),errors=[];
page.on('pageerror',e=>errors.push(String(e?.stack||e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
const json=(r,o)=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*','cache-control':'no-store'},body:JSON.stringify(o)});
for(const [p,o] of [['**/api/ai-status**',{available:false}],['**/api/owner-config**',{ok:true}],['**/api/analyze**',{available:false}],['**/api/insight**',{available:false}],['**/api/cloud-status**',{cloud:{configured:false,enabled:false}}],['**/api/ai-capabilities**',{ai:{enabled:false,capabilities:{}}}]])await page.route(p,r=>json(r,o));

const waitBoot=()=>page.waitForFunction(()=>window.__AXIS_CORE_INTERACTIVE__===true&&window.__AXIS_821_REPORT_RANGE_TRUTH__?.schema==='axis.report-range.v1'&&window.__AXIS_821_TRAINING_REPORT_UI__?.reportUIOwner===true&&window.__AXIS_821_TRAINING_REPORT_PDF__?.exportOwner===true,undefined,{timeout:15000});
const startOf=(day,h=8)=>Date.parse(`2026-08-${String(day).padStart(2,'0')}T${String(h).padStart(2,'0')}:00:00+08:00`);
const profile=(capturedAt,weight)=>({schema:'axis.profile-snapshot.v1',version:1,capturedAt,measurements:{heightCm:178,weightKg:weight,bodyFatPct:18,waistCm:82},training:{years:4,weeklyFrequency:3}});
const goal=capturedAt=>({schema:'axis.goal-snapshot.v1',version:1,capturedAt,kind:'muscle',targets:{weightKg:78,bodyFatPct:15,waistCm:78}});
const time=(start,end)=>({schema:'axis.session-time.v1',version:1,sealedAt:end,start,end,totalMs:end-start,activeMs:1800000,restMs:600000,unaccountedMs:(end-start)-2400000,classifiedMs:2400000,sources:{},policy:{}});
const canonicalSession=(day,index)=>{
  const start=startOf(day),end=start+3600000;
  return{id:`session-${index}`,start,end,profileSnapshot:profile(start,70+index),goalSnapshot:goal(start),timeSummary:time(start,end),events:[
    {id:`leg-${index}`,time:start+60000,name:'坐姿腿推',equipmentId:'legpress',schemaSnapshot:['weight','reps','sets'],executionModeSnapshot:'sets',metrics:{weight:80+index,reps:10,sets:3}},
    {id:`tempo-${index}`,time:start+120000,name:'节奏控制',equipmentId:'custom-tempo',schemaSnapshot:['tempoX'],executionModeSnapshot:'single',metrics:{tempoX:`3-1-${index}`}}
  ]};
};
const legacyStart=startOf(18),legacyEnd=legacyStart+1800000;
const sessions=[
  {id:'outside-september',start:Date.parse('2026-09-02T08:00:00+08:00'),end:Date.parse('2026-09-02T09:00:00+08:00'),profileSnapshot:profile(Date.parse('2026-09-02T08:00:00+08:00'),76),goalSnapshot:goal(Date.parse('2026-09-02T08:00:00+08:00')),timeSummary:time(Date.parse('2026-09-02T08:00:00+08:00'),Date.parse('2026-09-02T09:00:00+08:00')),events:[]},
  {id:'legacy-aug18',start:legacyStart,end:legacyEnd,events:[{id:'legacy-e',time:legacyStart+1000,name:'旧记录项目',equipmentId:'legacy',weight:88,reps:6}]},
  canonicalSession(16,4),canonicalSession(14,3),canonicalSession(12,2),canonicalSession(10,1)
];
const state={version:60,sessions,active:null,profile:{name:'导出测试用户',height:'180',weight:'99',bodyFat:'20',years:'6',freq:'4',goal:'strength',measurements:{waistCm:'85'},targets:{weightKg:'82',bodyFatPct:'16',waistCm:'80'},customEq:[{id:'custom-tempo',name:'当前定义不应解释历史'}],memories:[],objectMetricOverrides:{}},prefs:{scanSeconds:3,captureDefaultMode:'photo',captureDefaultFacing:'environment'}};

async function openExport(){
  await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});
  await page.click('#axis821PdfOpen');await page.waitForSelector('#axis821PdfConfig:not([hidden])',{state:'visible'});
}
async function makePopup(){
  const pending=page.waitForEvent('popup',{timeout:5000});
  await page.click('#axis821PdfGenerate');
  const popup=await pending;
  await popup.waitForSelector('.axis821PdfDoc',{state:'visible',timeout:5000});
  return popup;
}

try{
  assert.ok((await page.goto(BASE,{waitUntil:'domcontentloaded',timeout:15000}))?.ok());
  await page.evaluate(payload=>{localStorage.clear();localStorage.setItem('axis_v60_state',JSON.stringify(payload))},state);
  await page.reload({waitUntil:'domcontentloaded'});await waitBoot();
  const marker=await page.evaluate(()=>window.__AXIS_821_TRAINING_REPORT_PDF__);
  assert.equal(marker.truthSchema,'axis.report-range.v1');assert.equal(marker.exportOwner,true);assert.equal(marker.transport,'browser-print');assert.equal(marker.pageSize,'A4');assert.equal(marker.multiPage,true);assert.equal(marker.pageBreakProtection,true);assert.equal(marker.selectableText,true);assert.equal(marker.storageWrite,false);assert.equal(marker.historicalLiveProfileRead,false);assert.equal(marker.optionalCurrentProfileCover,true);assert.equal(marker.imageRasterization,false);

  const before=await page.evaluate(()=>localStorage.getItem('axis_v60_state'));
  console.log(`[AXIS 8.21 Training Report PDF ${ENGINE}] explicit local-date range + current-profile cover + immutable report truth`);
  await openExport();
  assert.equal(await page.locator('#axis821PdfStart').inputValue(),'2026-08-10');
  assert.equal(await page.locator('#axis821PdfEnd').inputValue(),'2026-09-02');
  const configBox=await page.locator('#axis821PdfConfig').boundingBox();assert.ok(configBox&&configBox.x>=0&&configBox.x+configBox.width<=391,'PDF configuration overflows mobile viewport');
  await page.fill('#axis821PdfStart','2026-08-10');await page.fill('#axis821PdfEnd','2026-08-31');
  assert.equal(await page.locator('#axis821PdfIncludeProfile').isChecked(),true);
  const popup=await makePopup();
  const text=await popup.locator('.axis821PdfDoc').innerText();
  for(const token of ['训练报告','范围 2026-08-10 — 2026-08-31','导出时个人档案（当前）','导出测试用户','99 kg','5','9','16','坐姿腿推','节奏控制','tempoX','定义未保存','旧记录项目','旧格式字段（仅存档，不计入标准指标统计）','88','6','当时未记录身体快照','暂无标准时间事实','实际训练','已知休息','暂停 / 未归类'])assert.ok(text.includes(token),`PDF missing ${token}`);
  for(const forbidden of ['outside-september','当前定义不应解释历史'])assert.ok(!text.includes(forbidden),`out-of-range/current definition leaked: ${forbidden}`);
  assert.equal(await popup.locator('[data-axis821-pdf-session]').count(),5);
  assert.equal(await popup.locator('.axis821PdfEncounter').count(),9);
  await popup.emulateMedia({media:'print'});
  const printContract=await popup.evaluate(()=>{const encounter=getComputedStyle(document.querySelector('.axis821PdfEncounter')),head=getComputedStyle(document.querySelector('.axis821PdfSessionHead')),bar=getComputedStyle(document.querySelector('.axis821PdfPrintBar'));return{encounterBreak:encounter.breakInside||encounter.pageBreakInside,headBreak:head.breakAfter||head.pageBreakAfter,barDisplay:bar.display}});
  assert.ok(['avoid','avoid-page'].includes(printContract.encounterBreak),`Encounter break protection missing: ${printContract.encounterBreak}`);
  assert.ok(['avoid','avoid-page'].includes(printContract.headBreak),`Session header orphan protection missing: ${printContract.headBreak}`);
  assert.equal(printContract.barDisplay,'none');
  await popup.waitForTimeout(450);assert.equal(await popup.evaluate(()=>window.__AXIS_821_PRINT_REQUESTED__===true),true,'native print request was not issued');
  if(ENGINE==='chromium'){
    const bytes=await popup.pdf({format:'A4',preferCSSPageSize:true,printBackground:true});
    const {PDFDocument}=await import('pdf-lib');const pdf=await PDFDocument.load(bytes),pages=pdf.getPageCount(),size=pdf.getPage(0).getSize();
    assert.ok(pages>=2,`expected multipage PDF, got ${pages}`);
    assert.ok(Math.abs(size.width-595.28)<2&&Math.abs(size.height-841.89)<2,`unexpected A4 page size ${size.width}x${size.height}`);
  }
  const exportMarker=await page.evaluate(()=>window.__AXIS_821_PDF_LAST_EXPORT__);
  assert.equal(exportMarker.sessionCount,5);assert.equal(exportMarker.encounterCount,9);assert.equal(exportMarker.metricObservationCount,16);assert.equal(exportMarker.includeCurrentProfile,true);assert.equal(exportMarker.range.startLabel,'2026-08-10');assert.equal(exportMarker.range.endLabel,'2026-08-31');assert.equal(exportMarker.transport,'browser-print');
  assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),before,'PDF export must not mutate canonical storage');
  await popup.close();

  console.log(`[AXIS 8.21 Training Report PDF ${ENGINE}] personal-information control removes current cover without removing historical Session snapshots`);
  await page.uncheck('#axis821PdfIncludeProfile');
  const popup2=await makePopup(),text2=await popup2.locator('.axis821PdfDoc').innerText();
  assert.ok(!text2.includes('导出测试用户'));assert.ok(!text2.includes('99 kg'));assert.ok(text2.includes('71 kg'),'historical Session profile snapshot disappeared when current cover was disabled');
  assert.equal(await page.evaluate(()=>window.__AXIS_821_PDF_LAST_EXPORT__.includeCurrentProfile),false);
  assert.equal(await page.evaluate(()=>localStorage.getItem('axis_v60_state')),before,'second PDF export must not mutate canonical storage');
  await popup2.close();

  assert.deepEqual(errors,[],`page errors:\n${errors.join('\n')}`);
  console.log(`[AXIS 8.21 Training Report PDF ${ENGINE}] PASS · bounded date range · complete canonical facts · optional current-profile cover · A4 native text · page-break protection · no storage/current-object reinterpretation`);
}finally{await context.close().catch(()=>{});await browser.close().catch(()=>{})}
