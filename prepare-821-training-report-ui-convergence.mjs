import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Training Report UI convergence] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};
const replaceOnce=(src,from,to,label)=>{
  const hits=src.split(from).length-1;
  if(hits!==1)fail(`${label} expected once, found ${hits}`);
  return src.replace(from,to);
};

/*
 * v8710-report.js was the former presentation/export owner. AXIS 8.21 Report
 * Range Truth + Training Report UI supersede only that Report module. Preserve
 * its readiness identity for diagnostics, but remove style, observer, click,
 * live-Profile aggregation and image/share behavior so it cannot cover the
 * truth-backed report after the canonical app renders it.
 */
{
  const FILE='v8710-report.js',legacy=read(FILE);
  for(const token of [
    '#reportPreview,#v877ReportDeck,#v877ReportDots,#v877ReportHint{display:none!important}',
    'id="v8710ReportDeck"',
    'function ensure()',
    'function bind()',
    'v8710ShareReport',
    'navigator.share',
    'window.__AXIS_8710_REPORT_READY__=true'
  ])if(!legacy.includes(token))fail(`legacy v8710 Report contract drifted: ${token}`);
  const retired=`(()=>{'use strict';\ntry{window.__AXIS_8710_REPORT_READY__=true;window.__AXIS_8710_REPORT_RETIRED__={version:'8.21',reason:'superseded-by-axis.report-range.v1',presentationOwner:false,eventOwner:false,liveProfileRead:false,legacyAggregation:false,exportOwner:false}}catch{}\n})();\n`;
  syntax(retired,FILE);write(FILE,retired);
}

/* Strengthen the dedicated physical smoke: content is insufficient if an old
 * module hides it. The truth-backed surface itself must be the visible owner. */
{
  const FILE='scripts/axis-821-training-report-ui-smoke.mjs';let s=read(FILE);
  const from=` await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});\n assert.equal(await page.locator('#axis821ReportScope').textContent(),'全部完成记录');`;
  const to=` await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});await page.waitForSelector('#reportPreview .axis821ReportHero',{state:'visible'});\n assert.ok(await page.locator('#reportPreview').isVisible(),'truth-backed Report preview is not the visible presentation owner');assert.ok(await page.locator('#axis821ReportScope').isVisible(),'truth-backed Report scope is hidden');assert.equal(await page.locator('#v8710ReportDeck,#v8710ShareReport,#v8710ReportStyle').count(),0,'retired v8710 Report owner remounted');assert.equal(await page.locator('#v877ReportDeck:visible').count(),0,'retired v877 Report owner became visible');\n assert.equal(await page.locator('#axis821ReportScope').textContent(),'全部完成记录');`;
  s=replaceOnce(s,from,to,'dedicated visible Report owner proof');
  write(FILE,s);
}

/* Runtime matrix compatibility now proves the new canonical Report owner rather
 * than requiring the intentionally retired v8710 three-card/JPG projection. */
{
  const FILE='scripts/axis-product-matrix.mjs';let s=read(FILE);
  const from=`await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),undefined,{timeout:1200});\nawait page.waitForFunction(()=>document.querySelector('#v8710ReportDeck')&&document.querySelectorAll('#v8710ReportDeck .v8710Plate').length===3,undefined,{timeout:1200});\nassert.equal(await page.locator('#reportPreview:visible').count(),0,'retired base report preview became visible');\nassert.equal(await page.locator('#v877ReportDeck:visible').count(),0,'retired v877 report deck became visible');\nassert.ok(await page.locator('#v8710ReportDeck').isVisible(),'canonical v8710 report deck did not open visibly');\nassert.equal(await page.locator('#v8710ReportDeck .v8710Plate').count(),3,'canonical report must render exactly three final cards');\nassert.ok((await page.locator('#v8710ReportDeck').innerText()).trim().length>0,'canonical v8710 report deck rendered no content');\nassert.ok(await page.locator('#v8710ShareReport').isVisible(),'canonical report share owner is missing or hidden');\nassert.equal(await page.locator('#shareReport').count(),0,'retired base report share owner survived canonical report hydration');`;
  const to=`await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),undefined,{timeout:1200});\nawait page.waitForSelector('#reportPreview .axis821ReportHero',{state:'visible',timeout:1200});\nassert.ok(await page.locator('#reportPreview').isVisible(),'truth-backed canonical report preview is hidden');\nassert.ok(await page.locator('#axis821ReportScope').isVisible(),'truth-backed canonical report scope is hidden');\nassert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'全部完成记录','Settings report must project all completed Sessions');\nassert.ok((await page.locator('#reportPreview').innerText()).trim().length>0,'truth-backed canonical report rendered no content');\nassert.equal(await page.locator('#v877ReportDeck:visible,#v8710ReportDeck:visible').count(),0,'retired report presentation owner became visible');\nassert.equal(await page.locator('#v8710ReportDeck,#v8710ShareReport,#shareReport').count(),0,'retired Report deck/share owner survived canonical convergence');\nconst reportOwner=await page.evaluate(()=>window.__AXIS_821_TRAINING_REPORT_UI__);assert.equal(reportOwner?.truthSchema,'axis.report-range.v1');assert.equal(reportOwner?.reportUIOwner,true);assert.equal(reportOwner?.exportOwner,false);assert.equal(reportOwner?.legacyShareExport,false);`;
  s=replaceOnce(s,from,to,'Chromium Runtime canonical Report owner contract');
  s=s.replace('[AXIS product matrix] PASS · navigation · Settings · Capture default/Scan independence · persistence · recording · active session · history · canonical trends · canonical report','[AXIS product matrix] PASS · navigation · Settings · Capture default/Scan independence · persistence · recording · active session · history · canonical trends · truth-backed canonical report');
  write(FILE,s);
}

{
  const FILE='scripts/axis-webkit-smoke.mjs';let s=read(FILE);
  const from=`console.log('[AXIS WebKit] current v84 trends + current v8710 report');`;
  s=replaceOnce(s,from,`console.log('[AXIS WebKit] current v84 trends + truth-backed canonical report');`,'WebKit Report phase label');
  const old=`await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),undefined,{timeout:1200});\nawait page.waitForFunction(()=>document.querySelector('#v8710ReportDeck')&&document.querySelectorAll('#v8710ReportDeck .v8710Plate').length===3,undefined,{timeout:1200});\nassert.equal(await page.locator('#reportPreview:visible,#v877ReportDeck:visible').count(),0,'WebKit retired report surface became visible');\nassert.ok(await page.locator('#v8710ReportDeck').isVisible(),'WebKit canonical v8710 report deck is hidden');\nassert.equal(await page.locator('#v8710ReportDeck .v8710Plate').count(),3,'WebKit canonical report does not contain three final cards');\nassert.ok(await page.locator('#v8710ShareReport').isVisible(),'WebKit canonical report share owner is missing/hidden');`;
  const current=`await page.waitForFunction(()=>document.querySelector('#reportSheet')?.classList.contains('show'),undefined,{timeout:1200});\nawait page.waitForSelector('#reportPreview .axis821ReportHero',{state:'visible',timeout:1200});\nassert.ok(await page.locator('#reportPreview').isVisible(),'WebKit truth-backed canonical report preview is hidden');\nassert.ok(await page.locator('#axis821ReportScope').isVisible(),'WebKit truth-backed canonical report scope is hidden');\nassert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'全部完成记录','WebKit Settings report must project all completed Sessions');\nassert.ok((await page.locator('#reportPreview').innerText()).trim().length>0,'WebKit truth-backed canonical report rendered no content');\nassert.equal(await page.locator('#v877ReportDeck:visible,#v8710ReportDeck:visible').count(),0,'WebKit retired report presentation owner became visible');\nassert.equal(await page.locator('#v8710ReportDeck,#v8710ShareReport,#shareReport').count(),0,'WebKit retired Report deck/share owner survived canonical convergence');\nconst reportOwner=await page.evaluate(()=>window.__AXIS_821_TRAINING_REPORT_UI__);assert.equal(reportOwner?.truthSchema,'axis.report-range.v1');assert.equal(reportOwner?.reportUIOwner,true);assert.equal(reportOwner?.exportOwner,false);assert.equal(reportOwner?.legacyShareExport,false);`;
  s=replaceOnce(s,old,current,'WebKit Runtime canonical Report owner contract');
  write(FILE,s);
}

console.log('[AXIS 8.21 Training Report UI convergence] PASS · truth-backed report is sole visible presentation owner · v8710 report style/observer/share retired · Chromium/WebKit runtime contracts target axis.report-range.v1 · no training/storage owner change');
