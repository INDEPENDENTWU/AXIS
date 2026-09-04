import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Report PDF Export] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

function functionRange(src,signature,label){
  const start=src.indexOf(signature);
  if(start<0)fail(`${label} signature missing`);
  if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
  const brace=src.indexOf('{',start+signature.length-1);
  if(brace<0)fail(`${label} opening brace missing`);
  let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
  for(let i=brace;i<src.length;i++){
    const ch=src[i],next=src[i+1]||'';
    if(line){if(ch==='\n')line=false;continue}
    if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
    if(quote){if(escaped){escaped=false;continue}if(ch==='\\'){escaped=true;continue}if(ch===quote)quote='';continue}
    if(ch==='/'&&next==='/'){line=true;i++;continue}
    if(ch==='/'&&next==='*'){block=true;i++;continue}
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue}
    if(ch==='{')depth++;
    else if(ch==='}'&&--depth===0){end=i+1;break}
  }
  if(end<0)fail(`${label} closing brace missing`);
  return{start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){const r=functionRange(src,signature,label);return src.slice(0,r.start)+replacement+src.slice(r.end)}

{
  const FILE='index.html';let s=read(FILE);
  if(!s.includes('id="axis821ReportScope"')||!s.includes('id="reportPreview"'))fail('Training Report UI must be installed first');
  if(s.includes('id="axis821ReportPdf"'))fail('Report PDF controls already installed');
  const hook='  <div class="axis821ReportScope" id="axis821ReportScope"></div>\n  <div class="reportPreview axis821ReportPreview" id="reportPreview"></div>';
  if(!s.includes(hook))fail('canonical Training Report insertion boundary missing');
  const replacement=`  <div class="axis821ReportScope" id="axis821ReportScope"></div>
  <div class="axis821ReportToolbar" id="axis821ReportToolbar">
    <div class="axis821ReportRangeBox" id="axis821ReportRangeBox">
      <label><span>起始</span><input type="date" id="axis821ReportFrom"></label>
      <i>至</i>
      <label><span>结束</span><input type="date" id="axis821ReportTo"></label>
      <button type="button" id="axis821ReportApply">应用</button>
      <button type="button" id="axis821ReportAll">全部</button>
    </div>
    <div class="axis821ReportExportBox">
      <label class="axis821ReportIdentity"><input type="checkbox" id="axis821ReportIdentity"><span>包含个人信息</span></label>
      <button type="button" class="saveRecord axis821ReportPdf" id="axis821ReportPdf">导出 PDF</button>
    </div>
  </div>
  <div class="axis821ReportPrintOnly" id="axis821ReportPrintCover"></div>
  <div class="reportPreview axis821ReportPreview" id="reportPreview"></div>`;
  s=s.replace(hook,replacement);
  write(FILE,s);
}

{
  const FILE='app.js';let s=read(FILE);
  if(!s.includes('__AXIS_821_TRAINING_REPORT_UI__'))fail('Training Report UI must be installed first');
  if(s.includes('__AXIS_821_REPORT_PDF_EXPORT__'))fail('Report PDF Export already installed');

  const view=`function axis821ReportView(){const truth=axis821ReportTruth(),raw=String(reportRange||'all');if(raw.startsWith('session:')){const id=raw.slice(8),route=state.sessions.find(x=>String(x.id)===id);if(!route||!Number.isFinite(Number(route.start)))return{mode:'session',sessions:[],summary:axis821ReportUiSummary([])};const bundle=truth.build({start:Number(route.start),end:Number(route.start)+1}),session=bundle.sessions.find(x=>String(x.id)===id),sessions=session?[session]:[];return{mode:'session',sessions,summary:axis821ReportUiSummary(sessions),truth:bundle}}if(raw.startsWith('range:')){const parts=raw.split(':'),start=Number(parts[1]),end=Number(parts[2]);if(Number.isFinite(start)&&Number.isFinite(end)&&end>start){const bundle=truth.build({start,end});return{mode:'range',start,end,sessions:bundle.sessions,summary:bundle.summary,truth:bundle}}}const bundle=truth.build({});return{mode:'all',sessions:bundle.sessions,summary:bundle.summary,truth:bundle}}`;
  s=replaceFunction(s,'function axis821ReportView()',view,'Training Report view');

  const runtime=`
function axis821ReportInputDate(ms){const d=new Date(Number(ms));if(!Number.isFinite(d.getTime()))return'';const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return y+'-'+m+'-'+day}
function axis821ReportParseLocalDay(value,nextDay=false){const m=/^(\\d{4})-(\\d{2})-(\\d{2})$/.exec(String(value||''));if(!m)return null;const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]),x=new Date(y,mo-1,d+(nextDay?1:0));if(!nextDay&&(x.getFullYear()!==y||x.getMonth()!==mo-1||x.getDate()!==d))return null;const n=x.getTime();return Number.isFinite(n)?n:null}
function axis821ReportScopeText(v){if(v?.mode==='session')return v.sessions?.[0]?dlabel(v.sessions[0].start)+' · 单次训练':'单次训练';if(v?.mode==='range')return axis821ReportInputDate(v.start)+' — '+axis821ReportInputDate(v.end-1);return'全部完成记录'}
function axis821ReportSyncPdfControls(){const v=axis821ReportView(),range=$('#axis821ReportRangeBox'),from=$('#axis821ReportFrom'),to=$('#axis821ReportTo'),all=$('#axis821ReportAll'),scope=$('#axis821ReportScope');if(range)range.hidden=v.mode==='session';if(scope)scope.textContent=axis821ReportScopeText(v);if(all)all.classList.toggle('active',v.mode==='all');if(v.mode==='range'){if(from)from.value=axis821ReportInputDate(v.start);if(to)to.value=axis821ReportInputDate(v.end-1)}else if(v.mode==='all'&&v.sessions.length){const starts=v.sessions.map(x=>Number(x.start)).filter(Number.isFinite),ends=v.sessions.map(x=>Number(x.end)).filter(Number.isFinite);if(from&&!from.value&&starts.length)from.value=axis821ReportInputDate(Math.min(...starts));if(to&&!to.value&&ends.length)to.value=axis821ReportInputDate(Math.max(...ends))}}
function axis821ReportApplyRange(){const from=axis821ReportParseLocalDay($('#axis821ReportFrom')?.value,false),end=axis821ReportParseLocalDay($('#axis821ReportTo')?.value,true);if(from==null||end==null){toast('请选择完整日期范围');return}if(end<=from){toast('结束日期不能早于起始日期');return}reportRange='range:'+from+':'+end;renderReport()}
function axis821ReportAllRange(){reportRange='all';renderReport()}
function axis821ReportExportIdentity(){const p=state.profile||{},m=p.measurements||{};return[['姓名',p.name||null],['身高',p.height?String(p.height)+' cm':null],['当前体重',p.weight?String(p.weight)+' kg':null],['当前体脂率',p.bodyFat?String(p.bodyFat)+'%':null],['当前腰围',m.waistCm?String(m.waistCm)+' cm':null],['训练年限',p.years?String(p.years)+' 年':null],['每周训练',p.freq?String(p.freq)+' 次':null],['当前目标',p.goal?axis821ReportGoalLabel(p.goal):null]].filter(x=>x[1]!=null&&x[1]!=='')}
function axis821ReportPrintCoverHtml(v){const include=!!$('#axis821ReportIdentity')?.checked,identity=include?axis821ReportExportIdentity():[],sum=v.summary||{};return'<div class="axis821ReportPrintBrand">AXIS</div><h1>训练报告</h1><div class="axis821ReportPrintMeta"><div><span>训练范围</span><b>'+esc(axis821ReportScopeText(v))+'</b></div><div><span>完成训练</span><b>'+Number(sum.sessionCount||0)+' 次</b></div><div><span>训练项目</span><b>'+Number(sum.encounterCount||0)+' 项</b></div><div><span>导出时间</span><b>'+esc(axis821ReportDateTime(Date.now()))+'</b></div></div>'+(identity.length?'<section class="axis821ReportPrintIdentity"><h2>导出时个人信息</h2>'+axis821ReportRows(identity)+'<p>历史身体状态与目标仍以每次训练当时保存的快照为准。</p></section>':'')}
let axis821ReportPrintTitle='';
function axis821ReportPreparePrint(){const v=axis821ReportView();if(!v.sessions.length){toast('当前范围没有可导出的训练记录');return false}const cover=$('#axis821ReportPrintCover');if(cover)cover.innerHTML=axis821ReportPrintCoverHtml(v);axis821ReportPrintTitle=document.title;document.title='AXIS-训练报告-'+axis821ReportInputDate(Date.now());document.body.classList.add('axis821ReportPrinting');return true}
function axis821ReportCleanupPrint(){document.body.classList.remove('axis821ReportPrinting');if(axis821ReportPrintTitle){document.title=axis821ReportPrintTitle;axis821ReportPrintTitle=''}const cover=$('#axis821ReportPrintCover');if(cover)cover.innerHTML=''}
function axis821ReportPrintPdf(){if(!axis821ReportPreparePrint())return;try{window.print()}finally{setTimeout(axis821ReportCleanupPrint,0)}}
const axis821ReportBaseRender=renderReport;renderReport=function(){axis821ReportBaseRender();axis821ReportSyncPdfControls()};
$('#axis821ReportApply').onclick=axis821ReportApplyRange;$('#axis821ReportAll').onclick=axis821ReportAllRange;$('#axis821ReportPdf').onclick=axis821ReportPrintPdf;window.addEventListener('afterprint',axis821ReportCleanupPrint);
try{window.__AXIS_821_REPORT_PDF_EXPORT__={version:'8.21',truthSchema:'axis.report-range.v1',exportOwner:true,pipeline:'browser-print-pdf',vectorText:true,rasterized:false,storageWrite:false,networkWrite:false,customRange:true,rangeSemantics:'local-day-half-open',personalInfo:'optional-export-time',historicalProfileOwner:'session.profileSnapshot',historicalGoalOwner:'session.goalSnapshot',prepare:axis821ReportPreparePrint,cleanup:axis821ReportCleanupPrint}}catch{}
`;
  const closeAt=s.lastIndexOf('})();');if(closeAt<0)fail('canonical app close missing');
  s=s.slice(0,closeAt)+runtime+s.slice(closeAt);
  for(const forbidden of ['html2canvas','jsPDF','pdf-lib','canvas.toDataURL','localStorage.setItem','indexedDB.open'])if(runtime.includes(forbidden))fail(`forbidden PDF/runtime token ${forbidden}`);
  if(!runtime.includes("window.print()")||!runtime.includes("reportRange='range:'")||!runtime.includes("state.profile||{}"))fail('PDF export/range/optional identity contract incomplete');
  syntax(view+'\n'+runtime,'isolated Report PDF runtime');syntax(s,FILE);write(FILE,s);
}

{
  const FILE='styles.css';let s=read(FILE);
  if(s.includes('AXIS 8.21 Report PDF Export'))fail('Report PDF styles already installed');
  s+=`\n/* AXIS 8.21 Report PDF Export */
.axis821ReportToolbar{display:grid;gap:10px;margin:10px 0 14px}.axis821ReportRangeBox{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(0,1fr) auto auto;gap:7px;align-items:end}.axis821ReportRangeBox[hidden]{display:none}.axis821ReportRangeBox label{display:grid;gap:5px}.axis821ReportRangeBox label span{font-size:11px;font-weight:720;color:var(--muted)}.axis821ReportRangeBox input{min-width:0;height:40px;border:1px solid var(--line);border-radius:12px;padding:0 10px;background:var(--card);color:var(--text);font:inherit;font-size:13px;font-variant-numeric:tabular-nums}.axis821ReportRangeBox>i{font-style:normal;font-size:12px;color:var(--muted);align-self:center;padding-top:16px}.axis821ReportRangeBox>button{height:40px;border:1px solid var(--line);border-radius:12px;background:var(--card);color:var(--text);font-size:12px;font-weight:760;padding:0 12px}.axis821ReportRangeBox>button.active{background:var(--text);color:var(--bg);border-color:var(--text)}.axis821ReportExportBox{display:flex;align-items:center;justify-content:space-between;gap:12px}.axis821ReportIdentity{display:flex;align-items:center;gap:8px;min-width:0;font-size:12px;font-weight:680;color:var(--muted)}.axis821ReportIdentity input{width:17px;height:17px;margin:0;accent-color:var(--text)}.axis821ReportPdf{margin:0;min-width:112px}.axis821ReportPrintOnly{display:none}
@media(max-width:390px){.axis821ReportRangeBox{grid-template-columns:minmax(0,1fr) auto minmax(0,1fr);}.axis821ReportRangeBox>button{grid-row:2}.axis821ReportRangeBox>#axis821ReportApply{grid-column:1/3}.axis821ReportRangeBox>#axis821ReportAll{grid-column:3}.axis821ReportExportBox{align-items:stretch;flex-direction:column}.axis821ReportPdf{width:100%}}
@media print{
 @page{size:A4;margin:14mm 12mm 16mm}
 html,body{background:#fff!important;color:#111!important;width:auto!important;height:auto!important;overflow:visible!important}
 body.axis821ReportPrinting> *:not(#reportSheet){display:none!important}
 body.axis821ReportPrinting #reportSheet{display:block!important;position:static!important;inset:auto!important;width:auto!important;height:auto!important;background:#fff!important;overflow:visible!important;z-index:auto!important}
 body.axis821ReportPrinting #reportSheet>.axis821ReportSheet{display:block!important;position:static!important;inset:auto!important;transform:none!important;width:auto!important;max-width:none!important;height:auto!important;max-height:none!important;overflow:visible!important;border:0!important;border-radius:0!important;box-shadow:none!important;background:#fff!important;padding:0!important}
 body.axis821ReportPrinting .grabber,body.axis821ReportPrinting .sheetHead,body.axis821ReportPrinting .axis821ReportToolbar{display:none!important}
 body.axis821ReportPrinting .axis821ReportPrintOnly{display:block!important}
 body.axis821ReportPrinting .axis821ReportScope{margin:0 0 5mm!important;padding:0!important;background:none!important;border:0!important;color:#555!important;font-size:9.5pt!important}
 body.axis821ReportPrinting .axis821ReportPrintBrand{font-size:9pt;font-weight:850;letter-spacing:.18em;margin-bottom:4mm}
 body.axis821ReportPrinting #axis821ReportPrintCover>h1{font-size:24pt;line-height:1.08;margin:0 0 7mm;letter-spacing:-.02em}
 body.axis821ReportPrinting .axis821ReportPrintMeta{display:grid;grid-template-columns:1fr 1fr;gap:3mm 8mm;border-top:1px solid #d8d8d8;border-bottom:1px solid #d8d8d8;padding:4mm 0;margin-bottom:6mm}
 body.axis821ReportPrinting .axis821ReportPrintMeta>div{display:grid;gap:1mm;break-inside:avoid-page}
 body.axis821ReportPrinting .axis821ReportPrintMeta span{font-size:8.5pt;color:#666}body.axis821ReportPrinting .axis821ReportPrintMeta b{font-size:10.5pt;font-variant-numeric:tabular-nums}
 body.axis821ReportPrinting .axis821ReportPrintIdentity{margin:0 0 7mm;break-inside:avoid-page}body.axis821ReportPrinting .axis821ReportPrintIdentity h2{font-size:12pt;margin:0 0 3mm}body.axis821ReportPrinting .axis821ReportPrintIdentity p{font-size:8.5pt;color:#666;margin:2mm 0 0}
 body.axis821ReportPrinting .axis821ReportPreview{display:block!important;overflow:visible!important;padding:0!important;margin:0!important}
 body.axis821ReportPrinting .axis821ReportHero{gap:3mm!important;margin:0 0 5mm!important;break-inside:avoid-page}body.axis821ReportPrinting .axis821ReportHero>div{break-inside:avoid-page;border:1px solid #ddd!important;background:#fff!important}
 body.axis821ReportPrinting .axis821ReportCoverage,body.axis821ReportPrinting .axis821ReportTime{break-inside:avoid-page}
 body.axis821ReportPrinting .axis821ReportSession{break-inside:auto!important;page-break-inside:auto!important;margin:0 0 7mm!important;padding-top:4mm!important;border-top:1px solid #cfcfcf!important}
 body.axis821ReportPrinting .axis821ReportSessionHead,body.axis821ReportPrinting .axis821ReportSectionHead,body.axis821ReportPrinting .axis821ReportSession h3,body.axis821ReportPrinting .axis821ReportEncounterHead{break-after:avoid-page;page-break-after:avoid}
 body.axis821ReportPrinting .axis821ReportSession section{break-inside:auto;page-break-inside:auto}
 body.axis821ReportPrinting .axis821ReportEncounter,body.axis821ReportPrinting .axis821ReportRows>div,body.axis821ReportPrinting .axis821ReportMissing{break-inside:avoid-page;page-break-inside:avoid}
 body.axis821ReportPrinting .axis821ReportEncounter{border:1px solid #ddd!important;background:#fff!important;margin-bottom:2.5mm!important}
 body.axis821ReportPrinting .axis821ReportRows>div{min-height:7mm!important;border-bottom:1px solid #ececec!important}
 body.axis821ReportPrinting .axis821ReportSession *,body.axis821ReportPrinting .axis821ReportPrintOnly *{orphans:3;widows:3}
 body.axis821ReportPrinting button,body.axis821ReportPrinting input{display:none!important}
 body.axis821ReportPrinting *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
}
`;
  write(FILE,s);
}

console.log('[AXIS 8.21 Report PDF Export] PASS · exact local-date range → axis.report-range.v1 · optional export-time personal identity · native browser print/PDF vector text · A4 paged layout · block-safe pagination · no raster/export store/network owner');