import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-report-share-card.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
const current=read('docs/CURRENT_WORK.md');

for(const token of [
  '__AXIS_821_REPORT_SHARE_CARD__',
  "truthSchema:'axis.report-range.v1'",
  "sourceOwner:'__AXIS_821_TRAINING_REPORT_UI__'",
  "format:'image/png'",
  "projection:'summary-share-card'",
  'rasterized:true',
  'screenshotBased:false',
  'storageWrite:false',
  'networkWrite:false',
  "personalInfo:'optional-export-time'",
  'historicalAggregation:false',
  'axis821ReportView()',
  'axis821ReportExportIdentity()',
  "cv.toDataURL('image/png')",
  "shareBlob(blob,name,'image/png')"
])assert.ok(prepare.includes(token),`missing Share Card contract token ${token}`);

const runtimeStart=prepare.indexOf('const runtime=`'),runtimeEnd=prepare.indexOf('`;\n  for(const forbidden',runtimeStart);
assert.ok(runtimeStart>=0&&runtimeEnd>runtimeStart,'Share Card runtime template boundary missing');
const runtime=prepare.slice(runtimeStart,runtimeEnd);
for(const forbidden of ['state.sessions','state.profile','localStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','html2canvas','jsPDF','pdf-lib'])assert.equal(runtime.includes(forbidden),false,`Share Card runtime contains forbidden owner/token ${forbidden}`);
assert.equal((runtime.match(/axis821ReportView\(\)/g)||[]).length>=2,true,'Share Card does not consume canonical Report view');
assert.ok(runtime.includes("includeIdentity=!!$('#axis821ReportIdentity')?.checked"),'optional identity control is not explicit');
assert.ok(runtime.includes("identity=includeIdentity?axis821ReportExportIdentity():[]"),'Share Card identity escaped export-time opt-in');
assert.equal(runtime.includes('axis821ReportTruth().build'),false,'Share Card bypassed canonical Training Report projection');
assert.equal(runtime.includes('reportRange='),false,'Share Card introduced a second range owner');

const pdfScope="await import('./prepare-821-report-pdf-export-scope.mjs');";
const share="await import('./prepare-821-report-share-card.mjs');";
assert.ok(lifecycle.includes(pdfScope),'Report PDF scope missing from lifecycle');
assert.ok(lifecycle.includes(share),'Report Share Card prepare missing from lifecycle');
assert.ok(lifecycle.indexOf(share)>lifecycle.indexOf(pdfScope),'Report Share Card must run after final PDF/Training Report scope');

for(const token of [
  'governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`',
  'governed active branch: `main`',
  'bounded delivery branch: `feat/821-report-share-card`',
  'exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`',
  'Chat history is not authoritative project memory',
  'axis-native-foundation-0',
  'INDEPENDENTWU/AXIS-iOS',
  'axis.report-range.v1'
])assert.ok(current.includes(token),`CURRENT_WORK Share Card governance token missing ${token}`);

if(fs.existsSync('app.js')&&fs.existsSync('index.html')&&fs.existsSync('styles.css')){
  const app=read('app.js'),html=read('index.html'),css=read('styles.css');
  assert.ok(html.includes('id="axis821ReportShareImage"'),'built Share Card control missing');
  assert.ok(html.includes('>分享图片</button>'),'built Share Card user action missing');
  assert.ok(html.includes('导出时包含个人信息'),'export identity label is not format-neutral');
  assert.ok(app.includes('__AXIS_821_REPORT_SHARE_CARD__'),'built Share Card runtime marker missing');
  assert.ok(app.includes("projection:'summary-share-card'"),'built Share Card projection marker missing');
  assert.ok(app.includes("cv.toDataURL('image/png')"),'built Share Card does not generate a real PNG canvas');
  assert.equal(app.includes('html2canvas'),false,'HTML screenshot rasterizer leaked into built runtime');
  assert.equal(app.includes('jsPDF'),false,'PDF library leaked into built runtime');
  assert.ok(css.includes('AXIS 8.21 Report Share Card'),'built Share Card styles missing');
}

console.log('[AXIS 8.21 Report Share Card contract] PASS · canonical Report projection · deliberate PNG canvas · optional export identity · no second range/store/network/factual owner');
