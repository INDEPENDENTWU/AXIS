import assert from 'node:assert/strict';
import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const prepare=read('prepare-821-report-pdf-export.mjs');
const legacyScope=read('prepare-821-report-pdf-export-scope.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
const current=read('docs/CURRENT_WORK.md');
const retirements=JSON.parse(read('governance/retirements.json'));

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
  'orphans:3;widows:3',
  "const report=functionRange(s,'function renderReport()','canonical Training Report renderer');",
  's=s.slice(0,report.end)+runtime+s.slice(report.end);',
  "if((s.match(/__AXIS_821_REPORT_PDF_EXPORT__/g)||[]).length!==1)fail('final PDF runtime marker count is not one')",
  "if(s.indexOf('function axis821ReportInputDate(ms){')<report.end)fail('PDF runtime escaped canonical Report lexical scope')"
])assert.ok(prepare.includes(token),`missing PDF contract token ${token}`);

const runtimeStart=prepare.indexOf('const runtime=`'),runtimeEnd=prepare.indexOf('`;\n  const report=',runtimeStart);
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
assert.equal(prepare.includes("const closeAt=s.lastIndexOf('})();')"),false,'PDF runtime still installs at the late app-close boundary');

const convergence="await import('./prepare-821-training-report-ui-convergence.mjs');";
const pdf="await import('./prepare-821-report-pdf-export.mjs');";
const scope="await import('./prepare-821-report-pdf-export-scope.mjs');";
const share="await import('./prepare-821-report-share-card.mjs');";
const backup="await import('./prepare-821-portable-backup.mjs');";
assert.ok(lifecycle.includes(convergence),'Training Report convergence missing from lifecycle');
assert.ok(lifecycle.includes(pdf),'Report PDF prepare missing from lifecycle');
assert.ok(lifecycle.indexOf(pdf)>lifecycle.indexOf(convergence),'Report PDF prepare must run after final Training Report convergence');
assert.equal(lifecycle.includes(scope),false,'historical corrective Report PDF scope prepare remains build-reachable');
assert.equal((lifecycle.match(/prepare-821-report-pdf-export\.mjs/g)||[]).length,1,'Report PDF feature prepare must remain exactly once');
assert.ok(lifecycle.indexOf(share)>lifecycle.indexOf(pdf),'Report Share Card order changed');
assert.ok(lifecycle.indexOf(backup)>lifecycle.indexOf(share),'Portable Backup order changed');
for(const token of ['generated PDF runtime block missing','PDF runtime marker missing','one PDF runtime moved into canonical Training Report lexical scope'])assert.ok(legacyScope.includes(token),`historical scope provenance drifted: ${token}`);

for(const token of [
  'governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`',
  'governed active branch: `main`',
  'Chat history is not authoritative project memory',
  'axis-native-foundation-0',
  'INDEPENDENTWU/AXIS-iOS',
  'axis.report-range.v1',
  'completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`',
  'completed Report PDF scope source-convergence PR: **#133**',
  'Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`'
])assert.ok(current.includes(token),`CURRENT_WORK governance token missing ${token}`);

const pdfRetirement=retirements.retirements?.find(row=>row.id==='report-pdf-corrective-scope-prepare-821');
assert.ok(pdfRetirement,'Report PDF corrective-scope retirement registry entry missing');
assert.equal(pdfRetirement.status,'retired-from-build-authority','Report PDF corrective scope retirement status drift');
assert.equal(pdfRetirement.productionAuthorityAllowed,false,'Report PDF corrective scope regained Production authority');
assert.equal(pdfRetirement.compatibilityHookAllowed,false,'Report PDF corrective scope regained compatibility authority');
assert.ok(String(pdfRetirement.historicalSurface||'').includes('prepare-821-report-pdf-export-scope.mjs'),'Report PDF retirement lost historical scope identity');
assert.ok(String(pdfRetirement.replacement||'').includes('prepare-821-report-pdf-export.mjs'),'Report PDF retirement lost current source owner');
assert.ok(String(pdfRetirement.guard||'').includes('repository provenance'),'Report PDF retirement lost provenance-only guard');
assert.ok(String(pdfRetirement.guard||'').includes('canonical build reachability'),'Report PDF retirement lost build-reachability guard');

if(fs.existsSync('app.js')&&fs.existsSync('index.html')&&fs.existsSync('styles.css')){
  const app=read('app.js'),html=read('index.html'),css=read('styles.css');
  for(const id of ['axis821ReportFrom','axis821ReportTo','axis821ReportApply','axis821ReportAll','axis821ReportIdentity','axis821ReportPdf','axis821ReportPrintCover'])assert.ok(html.includes(`id="${id}"`),`built Report PDF control missing ${id}`);
  assert.equal((app.match(/__AXIS_821_REPORT_PDF_EXPORT__/g)||[]).length,1,'built PDF runtime marker must be exactly one');
  assert.ok(app.includes("pipeline:'browser-print-pdf'"),'built PDF pipeline marker missing');
  assert.ok(app.includes('window.print()'),'built PDF runtime does not use browser print');
  assert.equal(app.includes('html2canvas'),false,'rasterizer leaked into built runtime');
  assert.equal(app.includes('jsPDF'),false,'jsPDF leaked into built runtime');
  assert.ok(css.includes('@page{size:A4'),'built A4 print contract missing');
  assert.ok(css.includes('break-inside:avoid-page'),'built page-break protection missing');
  assert.equal(html.includes('id="shareReport"'),false,'legacy share Report owner returned');
}

console.log('[AXIS 8.21 Report PDF Export contract] PASS · range truth · source-owned Report lexical scope · corrective scope prepare unreachable · completed source-convergence continuity + retirement registry · optional export identity · vector browser PDF · A4 pagination · no raster/store/network owner');
