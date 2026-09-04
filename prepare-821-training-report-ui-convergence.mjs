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
const replaceSpan=(src,start,end,to,label)=>{
  const a=src.indexOf(start),second=a<0?-1:src.indexOf(start,a+start.length),b=a<0?-1:src.indexOf(end,a+start.length);
  if(a<0||second>=0||b<0)fail(`${label} boundaries drifted: start=${a} second=${second} end=${b}`);
  return src.slice(0,a)+to+src.slice(b+end.length);
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
  const retired=`(()=>{'use strict';\
try{window.__AXIS_8710_REPORT_READY__=true;window.__AXIS_8710_REPORT_RETIRED__={version:'8.21',reason:'superseded-by-axis.report-range.v1',presentationOwner:false,eventOwner:false,liveProfileRead:false,legacyAggregation:false,exportOwner:false}}catch{}\
})();\
`;
  syntax(retired,FILE);write(FILE,retired);
}

/*
 * v877 predates v8710 but also retained a complete Report presentation path.
 * Its MutationObserver re-rendered whenever #reportSheet gained .show and then
 * applied v877HiddenLegacy to #reportPreview, racing the truth-backed owner on
 * mobile/WebKit. Retire only v877's Report slice; all unrelated v877 equipment,
 * intensity and watermark behavior remains intact.
 */
{
  const FILE='v877-runtime.js';let s=read(FILE);
  for(const token of [
    "let reportRange='last',reportCard=0,processingPhoto=false,lastEqSig='';",
    '#reportPreview.v877HiddenLegacy{display:none!important}',
    'function sessionsForRange()',
    'function renderReport877()',
    'async function shareReport877()',
    "if(e.target.closest('#reportBtn,#sessionReportBtn,#makeSessionReport'))setTimeout(renderReport877,130);",
    "const rr=e.target.closest('#reportRange [data-range]');",
    "if($('#reportSheet')?.classList.contains('show'))setTimeout(renderReport877,20);"
  ])if(!s.includes(token))fail(`legacy v877 Report contract drifted: ${token}`);

  s=replaceOnce(s,"let reportRange='last',reportCard=0,processingPhoto=false,lastEqSig='';","let processingPhoto=false,lastEqSig='';",'v877 Report-only state');

  const reportCss=/#reportSheet \.reportSheet\{[\s\S]*?#shareReport\.v877Share\{margin-top:4px!important\}\n/;
  if((s.match(reportCss)||[]).length!==1)fail('v877 Report CSS block expected once');
  s=s.replace(reportCss,'');

  const reportLogic=/function sessionsForRange\(\)\{[\s\S]*?\nfunction wmPrefs\(\)/;
  if((s.match(reportLogic)||[]).length!==1)fail('v877 Report logic block expected once');
  s=s.replace(reportLogic,'function wmPrefs()');

  s=replaceOnce(s,"if(e.target.closest('#reportBtn,#sessionReportBtn,#makeSessionReport'))setTimeout(renderReport877,130);",'', 'v877 Report open click hook');
  s=replaceOnce(s,"const rr=e.target.closest('#reportRange [data-range]');if(rr){reportRange=rr.dataset.range;reportCard=0;setTimeout(renderReport877,20)}",'', 'v877 Report range hook');
  s=replaceOnce(s,"if(e.target.closest('#shareReport')){e.preventDefault();e.stopImmediatePropagation();shareReport877();return}",'', 'v877 Report share hook');
  s=replaceOnce(s,"if($('#reportSheet')?.classList.contains('show'))setTimeout(renderReport877,20);",'', 'v877 Report MutationObserver hook');

  for(const retired of ['renderReport877','shareReport877','v877HiddenLegacy','reportRange=','reportCard=','#reportRange [data-range]'])if(s.includes(retired))fail(`v877 Report owner survived retirement: ${retired}`);
  syntax(s,FILE);write(FILE,s);
}

/* Strengthen the dedicated physical smoke: content is insufficient if an old
 * module hides it. The truth-backed surface itself must be the visible owner. */
{
  const FILE='scripts/axis-821-training-report-ui-smoke.mjs';let s=read(FILE);
  const open=`await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});`;
  const visible=`await page.click('#settingsBtn');await page.click('#reportBtn');await page.waitForSelector('#reportSheet.show',{state:'visible'});await page.waitForSelector('#reportPreview .axis821ReportHero',{state:'visible'});assert.ok(await page.locator('#reportPreview').isVisible(),'truth-backed Report preview is not the visible presentation owner');assert.ok(await page.locator('#axis821ReportScope').isVisible(),'truth-backed Report scope is hidden');assert.equal(await page.locator('#v8710ReportDeck,#v8710ShareReport,#v8710ReportStyle').count(),0,'retired v8710 Report owner remounted');assert.equal(await page.locator('#v877ReportDeck:visible').count(),0,'retired v877 Report owner became visible');`;
  s=replaceOnce(s,open,visible,'dedicated visible Report owner proof');
  write(FILE,s);
}

/* Runtime matrix compatibility now proves the new canonical Report owner rather
 * than requiring the intentionally retired v8710 three-card/JPG projection. */
{
  const FILE='scripts/axis-product-matrix.mjs';let s=read(FILE);
  const start=`await page.waitForFunction(()=>document.querySelector('#v8710ReportDeck')&&document.querySelectorAll('#v8710ReportDeck .v8710Plate').length===3,undefined,{timeout:1200});`;
  const end=`assert.equal(await page.locator('#shareReport').count(),0,'retired base report share owner survived canonical report hydration');`;
  const current=`await page.waitForSelector('#reportPreview .axis821ReportHero',{state:'visible',timeout:1200});
assert.ok(await page.locator('#reportPreview').isVisible(),'truth-backed canonical report preview is hidden');
assert.ok(await page.locator('#axis821ReportScope').isVisible(),'truth-backed canonical report scope is hidden');
assert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'全部完成记录','Settings report must project all completed Sessions');
assert.ok((await page.locator('#reportPreview').innerText()).trim().length>0,'truth-backed canonical report rendered no content');
assert.equal(await page.locator('#v877ReportDeck:visible,#v8710ReportDeck:visible').count(),0,'retired report presentation owner became visible');
assert.equal(await page.locator('#v8710ReportDeck,#v8710ShareReport,#shareReport').count(),0,'retired Report deck/share owner survived canonical convergence');
const reportOwner=await page.evaluate(()=>window.__AXIS_821_TRAINING_REPORT_UI__);assert.equal(reportOwner?.truthSchema,'axis.report-range.v1');assert.equal(reportOwner?.reportUIOwner,true);assert.equal(reportOwner?.exportOwner,false);assert.equal(reportOwner?.legacyShareExport,false);`;
  s=replaceSpan(s,start,end,current,'Chromium Runtime canonical Report owner contract');
  s=s.replace('[AXIS product matrix] PASS · navigation · Settings · Capture default/Scan independence · persistence · recording · active session · history · canonical trends · canonical report','[AXIS product matrix] PASS · navigation · Settings · Capture default/Scan independence · persistence · recording · active session · history · canonical trends · truth-backed canonical report');
  write(FILE,s);
}

{
  const FILE='scripts/axis-webkit-smoke.mjs';let s=read(FILE);
  const from=`console.log('[AXIS WebKit] current v84 trends + current v8710 report');`;
  s=replaceOnce(s,from,`console.log('[AXIS WebKit] current v84 trends + truth-backed canonical report');`,'WebKit Report phase label');
  const start=`await page.waitForFunction(()=>document.querySelector('#v8710ReportDeck')&&document.querySelectorAll('#v8710ReportDeck .v8710Plate').length===3,undefined,{timeout:1200});`;
  const end=`assert.ok(await page.locator('#v8710ShareReport').isVisible(),'WebKit canonical report share owner is missing/hidden');`;
  const current=`await page.waitForSelector('#reportPreview .axis821ReportHero',{state:'visible',timeout:1200});
assert.ok(await page.locator('#reportPreview').isVisible(),'WebKit truth-backed canonical report preview is hidden');
assert.ok(await page.locator('#axis821ReportScope').isVisible(),'WebKit truth-backed canonical report scope is hidden');
assert.equal((await page.locator('#axis821ReportScope').innerText()).trim(),'全部完成记录','WebKit Settings report must project all completed Sessions');
assert.ok((await page.locator('#reportPreview').innerText()).trim().length>0,'WebKit truth-backed canonical report rendered no content');
assert.equal(await page.locator('#v877ReportDeck:visible,#v8710ReportDeck:visible').count(),0,'WebKit retired report presentation owner became visible');
assert.equal(await page.locator('#v8710ReportDeck,#v8710ShareReport,#shareReport').count(),0,'WebKit retired Report deck/share owner survived canonical convergence');
const reportOwner=await page.evaluate(()=>window.__AXIS_821_TRAINING_REPORT_UI__);assert.equal(reportOwner?.truthSchema,'axis.report-range.v1');assert.equal(reportOwner?.reportUIOwner,true);assert.equal(reportOwner?.exportOwner,false);assert.equal(reportOwner?.legacyShareExport,false);`;
  s=replaceSpan(s,start,end,current,'WebKit Runtime canonical Report owner contract');
  write(FILE,s);
}

console.log('[AXIS 8.21 Training Report UI convergence] PASS · truth-backed report is sole visible presentation owner · v8710/v877 report style, observer and share owners retired · Chromium/WebKit runtime contracts target axis.report-range.v1 · no training/storage owner change');
