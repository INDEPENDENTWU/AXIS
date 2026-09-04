import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-report-pdf-export.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
const current=read('docs/CURRENT_WORK.md');

for(const token of [
  '__AXIS_821_REPORT_PDF_EXPORT__',
  "truthSchema:'axis.report-range.v1'",
  "pipeline:'browser-print-pdf'",
  'vectorText:true',
  'rasterized:false',
  "rangeSemantics:'local-day-half-open'",
  "personalInfo:'optional-export-time'",
  "historicalProfileOwner:'session.profileSnapshot'",
  "historicalGoalOwner:'session.goalSnapshot'",
  "reportRange='range:'",
  'window.print()',
  '@page{size:A4',
  'break-inside:avoid-page',
  'orphans:3;widows:3'
])assert.ok(prepare.includes(token),`missing PDF contract token ${token}`);

const runtimeStart=prepare.indexOf('const runtime=`'),runtimeEnd=prepare.indexOf('`;\n  const closeAt=',runtimeStart);
assert.ok(runtimeStart>=0&&runtimeEnd>runtimeStart,'runtime template boundary missing');
const runtime=prepare.slice(runtimeStart,runtimeEnd);
for(const forbidden of ['html2canvas','jsPDF','pdf-lib','canvas.toDataURL','toBlob(','fetch(','XMLHttpRequest','localStorage.setItem','indexedDB.open']){
  assert.equal(runtime.includes(forbidden),false,`PDF runtime contains forbidden owner/token ${forbidden}`);
}

assert.equal((runtime.match(/state\.profile\|\|\{\}/g)||[]).length,1,'live Profile may be read exactly once inside PDF runtime for optional export identity only');
assert.ok(runtime.includes('function axis821ReportExportIdentity(){const p=state.profile||{}'),'live Profile read escaped optional export identity function');
assert.ok(prepare.includes("const bundle=truth.build({start,end})"),'custom range does not route through Report Range Truth');
assert.ok(prepare.includes("const bundle=truth.build({})"),'all-history truth route disappeared');
assert.ok(prepare.includes("truth.build({start:Number(route.start),end:Number(route.start)+1})"),'single-Session truth route disappeared');
assert.equal(runtime.includes('state.sessions.filter('),false,'PDF export introduced parallel Session aggregation');

const convergence="await import('./prepare-821-training-report-ui-convergence.mjs');";
const pdf="await import('./prepare-821-report-pdf-export.mjs');";
assert.ok(lifecycle.includes(convergence),'Training Report convergence missing from lifecycle');
assert.ok(lifecycle.includes(pdf),'Report PDF prepare missing from lifecycle');
assert.ok(lifecycle.indexOf(pdf)>lifecycle.indexOf(convergence),'Report PDF prepare must run after final Training Report convergence');

for(const token of [
  'governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`',
  'governed active branch: `main`',
  'Chat history is not authoritative project memory',
  'axis-native-foundation-0',
  'INDEPENDENTWU/AXIS-iOS',
  'axis.report-range.v1'
])assert.ok(current.includes(token),`CURRENT_WORK governance token missing ${token}`);

if(fs.existsSync('app.js')&&fs.existsSync('index.html')&&fs.existsSync('styles.css')){
  const app=read('app.js'),html=read('index.html'),css=read('styles.css');
  for(const id of ['axis821ReportFrom','axis821ReportTo','axis821ReportApply','axis821ReportAll','axis821ReportIdentity','axis821ReportPdf','axis821ReportPrintCover'])assert.ok(html.includes(`id="${id}"`),`built Report PDF control missing ${id}`);
  assert.ok(app.includes('__AXIS_821_REPORT_PDF_EXPORT__'),'built PDF runtime marker missing');
  assert.ok(app.includes("pipeline:'browser-print-pdf'"),'built PDF pipeline marker missing');
  assert.ok(app.includes('window.print()'),'built PDF runtime does not use browser print');
  assert.equal(app.includes('html2canvas'),false,'rasterizer leaked into built runtime');
  assert.equal(app.includes('jsPDF'),false,'jsPDF leaked into built runtime');
  assert.ok(css.includes('@page{size:A4'),'built A4 print contract missing');
  assert.ok(css.includes('break-inside:avoid-page'),'built page-break protection missing');
  assert.equal(html.includes('id="shareReport"'),false,'legacy share Report owner returned');
}

console.log('[AXIS 8.21 Report PDF Export contract] PASS · range truth · optional export identity · vector browser PDF · A4 pagination · no raster/store/network owner');