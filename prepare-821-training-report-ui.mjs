import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Training Report UI] ${m}`)};
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
  if(s.includes('axis821ReportScope'))fail('Training Report UI already installed');
  const start=s.indexOf('<div class="sheetWrap" id="reportSheet">'),end=s.indexOf('\n<div class="toast"',start);
  if(start<0||end<0)fail('canonical reportSheet boundary missing');
  const block=`<div class="sheetWrap" id="reportSheet"><div class="sheet reportSheet axis821ReportSheet">
  <div class="grabber"></div><div class="sheetHead"><b id="axis821ReportTitle">训练报告</b><button class="closeBtn" data-close="reportSheet">×</button></div>
  <div class="axis821ReportScope" id="axis821ReportScope"></div>
  <div class="reportPreview axis821ReportPreview" id="reportPreview"></div>
</div></div>
`;
  s=s.slice(0,start)+block+s.slice(end);
  if(s.includes('id="reportRange"')||s.includes('id="shareReport"'))fail('legacy Report range/export controls remain');
  write(FILE,s);
}

{
  const FILE='app.js';let s=read(FILE);
  if(!s.includes('__AXIS_821_REPORT_RANGE_TRUTH__'))fail('Report Range Truth must be installed first');
  if(s.includes('__AXIS_821_TRAINING_REPORT_UI__'))fail('Training Report UI already installed');

  const runtime=`function axis821ReportTruth(){const t=window.__AXIS_821_REPORT_RANGE_TRUTH__;if(!t||t.schema!=='axis.report-range.v1'||typeof t.build!=='function')throw new Error('[AXIS Training Report] report truth unavailable');return t}
function axis821ReportFinite(v){const n=Number(v);return Number.isFinite(n)?n:null}
function axis821ReportMs(v){const n=axis821ReportFinite(v);if(n==null)return'—';const sec=Math.max(0,Math.round(n/1000)),h=Math.floor(sec/3600),m=Math.floor(sec%3600/60),s=sec%60;if(h)return h+'小时'+(m?' '+m+'分':'');if(m)return m+'分'+(s?' '+s+'秒':'');return s+'秒'}
function axis821ReportDateTime(v){const n=axis821ReportFinite(v);return n==null?'—':dlabel(n)+' '+tlabel(n)}
function axis821ReportMetricLabel(key){return({weight:'重量',reps:'次数',sets:'组数',duration:'时长',distance:'距离',speed:'速度',incline:'坡度',level:'等级',resistance:'阻力',cadence:'节奏',pace:'配速',hold:'保持',count:'计数',intensity:'强度'})[key]||key}
function axis821ReportGoalLabel(kind){return({health:'健康',muscle:'增肌',fat:'减脂',strength:'力量',cardio:'体能'})[kind]||kind||'—'}
function axis821ReportUiSummary(sessions){const out={sessionCount:sessions.length,encounterCount:0,metricObservationCount:0,time:{sessionsWithCanonicalTruth:0,sessionsMissingCanonicalTruth:0,totalMs:0,activeMs:0,restMs:0,unaccountedMs:0},coverage:{sessionsWithProfileSnapshot:0,sessionsMissingProfileSnapshot:0,sessionsWithGoalSnapshot:0,sessionsMissingGoalSnapshot:0,encountersMissingSchemaSnapshot:0,encountersMissingCanonicalMetrics:0,unknownMetricDefinitions:0}};for(const x of sessions){out.encounterCount+=x.encounters.length;if(x.profileSnapshot)out.coverage.sessionsWithProfileSnapshot++;else out.coverage.sessionsMissingProfileSnapshot++;if(x.goalSnapshot)out.coverage.sessionsWithGoalSnapshot++;else out.coverage.sessionsMissingGoalSnapshot++;if(x.timeSummary?.schema==='axis.session-time.v1'){out.time.sessionsWithCanonicalTruth++;for(const k of ['totalMs','activeMs','restMs','unaccountedMs'])out.time[k]+=Math.max(0,axis821ReportFinite(x.timeSummary[k])||0)}else out.time.sessionsMissingCanonicalTruth++;for(const e of x.encounters){out.coverage.encountersMissingSchemaSnapshot+=Number(!!e.missing?.schemaSnapshot);out.coverage.encountersMissingCanonicalMetrics+=Number(!!e.missing?.canonicalMetrics);out.coverage.unknownMetricDefinitions+=Number(e.missing?.unknownMetricDefinitions)||0;out.metricObservationCount+=e.metricFacts.filter(f=>f.recorded).length}}return out}
function axis821ReportView(){const truth=axis821ReportTruth();if(String(reportRange||'').startsWith('session:')){const id=String(reportRange).slice(8),route=state.sessions.find(x=>String(x.id)===id);if(!route||!Number.isFinite(Number(route.start)))return{mode:'session',sessions:[],summary:axis821ReportUiSummary([])};const bundle=truth.build({start:Number(route.start),end:Number(route.start)+1}),session=bundle.sessions.find(x=>String(x.id)===id),sessions=session?[session]:[];return{mode:'session',sessions,summary:axis821ReportUiSummary(sessions),truth:bundle}}const bundle=truth.build({});return{mode:'all',sessions:bundle.sessions,summary:bundle.summary,truth:bundle}}
function axis821ReportRows(rows){const xs=rows.filter(x=>x[1]!==null&&x[1]!==undefined&&x[1]!=='');return xs.length?'<div class="axis821ReportRows">'+xs.map(x=>'<div><span>'+esc(x[0])+'</span><b>'+esc(x[1])+'</b></div>').join('')+'</div>':''}
function axis821ReportProfile(snapshot){if(!snapshot)return'<div class="axis821ReportMissing">当时未记录身体快照</div>';const m=snapshot.measurements||{},t=snapshot.training||{};return axis821ReportRows([['身高',m.heightCm==null?null:m.heightCm+' cm'],['体重',m.weightKg==null?null:m.weightKg+' kg'],['体脂率',m.bodyFatPct==null?null:m.bodyFatPct+'%'],['腰围',m.waistCm==null?null:m.waistCm+' cm'],['训练年限',t.years==null?null:t.years+' 年'],['每周训练',t.weeklyFrequency==null?null:t.weeklyFrequency+' 次']])||'<div class="axis821ReportMissing">当时身体快照没有可显示数值</div>'}
function axis821ReportGoal(snapshot){if(!snapshot)return'<div class="axis821ReportMissing">当时未记录目标快照</div>';const t=snapshot.targets||{};return axis821ReportRows([['主要目标',axis821ReportGoalLabel(snapshot.kind)],['目标体重',t.weightKg==null?null:t.weightKg+' kg'],['目标体脂率',t.bodyFatPct==null?null:t.bodyFatPct+'%'],['目标腰围',t.waistCm==null?null:t.waistCm+' cm']])}
function axis821ReportMetricValue(v){if(v===null||v===undefined)return'—';if(typeof v==='object')return JSON.stringify(v);return String(v)}
function axis821ReportEncounter(e){const i=e.identity||{},title=i.name||i.title||i.kind||i.objectId||i.equipmentId||i.id||'记录项目',facts=e.metricFacts.filter(f=>f.recorded),legacy=Object.keys(e.legacyRecordedFacts||{}).length>0;return'<div class="axis821ReportEncounter"><div class="axis821ReportEncounterHead"><b>'+esc(title)+'</b><span>'+esc(axis821ReportDateTime(e.time))+'</span></div>'+(facts.length?'<div class="axis821ReportMetrics">'+facts.map(f=>'<div><span>'+esc(axis821ReportMetricLabel(f.key))+(f.definitionMissing?'<i>定义未保存</i>':'')+'</span><b>'+esc(axis821ReportMetricValue(f.value))+'</b></div>').join('')+'</div>':'<div class="axis821ReportMissing">暂无标准指标事实'+(legacy?' · 旧格式字段未升级':'')+'</div>')+'</div>'}
function axis821ReportSession(x){const time=x.timeSummary?.schema==='axis.session-time.v1'?axis821ReportRows([['训练时长',axis821ReportMs(x.timeSummary.totalMs)],['实际训练',axis821ReportMs(x.timeSummary.activeMs)],['已知休息',axis821ReportMs(x.timeSummary.restMs)],['暂停 / 未归类',axis821ReportMs(x.timeSummary.unaccountedMs) ]):'<div class="axis821ReportMissing">暂无标准时间事实</div>';return'<article class="axis821ReportSession" data-axis821-report-session="'+esc(x.id||'')+'"><div class="axis821ReportSessionHead"><div><span>'+esc(dlabel(x.start))+'</span><b>'+esc(tlabel(x.start))+' — '+esc(tlabel(x.end))+'</b></div><strong>'+x.encounters.length+' 项</strong></div><section><h3>时间</h3>'+time+'</section><section><h3>当时身体状态</h3>'+axis821ReportProfile(x.profileSnapshot)+'</section><section><h3>当时目标</h3>'+axis821ReportGoal(x.goalSnapshot)+'</section><section><h3>训练记录</h3>'+(x.encounters.length?x.encounters.map(axis821ReportEncounter).join(''):'<div class="axis821ReportMissing">本次没有训练项目</div>')+'</section></article>'}
function reportSessions(){return axis821ReportView().sessions}
`;
  s=replaceFunction(s,'function reportSessions()',runtime,'legacy Report session aggregator');
  s=replaceFunction(s,'function reportStats()',`function reportStats(){const v=axis821ReportView();return{truth:v.truth||null,ss:v.sessions,summary:v.summary}}`,'legacy Report stats aggregator');
  const render=`function renderReport(){const v=axis821ReportView(),sum=v.summary,time=sum.time||{},coverage=sum.coverage||{},sessions=v.sessions.slice().reverse(),scope=$('#axis821ReportScope');if(scope)scope.textContent=v.mode==='session'?(sessions[0]?dlabel(sessions[0].start)+' · 单次训练':'单次训练'):'全部完成记录';setText('#axis821ReportTitle','训练报告');if(!sessions.length){$('#reportPreview').innerHTML='<div class="axis821ReportEmpty"><b>暂无可用训练记录</b><span>完成一次训练后，这里会保留当时真实记录。</span></div>';return}const timeCoverage=time.sessionsWithCanonicalTruth+' / '+sum.sessionCount+' 次有标准时间事实',profileCoverage=coverage.sessionsWithProfileSnapshot+' / '+sum.sessionCount+' 次有身体快照',goalCoverage=coverage.sessionsWithGoalSnapshot+' / '+sum.sessionCount+' 次有目标快照';$('#reportPreview').innerHTML='<div class="axis821ReportHero"><div><span>完成训练</span><b>'+sum.sessionCount+'</b></div><div><span>训练项目</span><b>'+sum.encounterCount+'</b></div><div><span>指标事实</span><b>'+sum.metricObservationCount+'</b></div></div><section class="axis821ReportTime"><div class="axis821ReportSectionHead"><b>时间事实</b><span>'+esc(timeCoverage)+'</span></div>'+axis821ReportRows([['已知训练时长',axis821ReportMs(time.totalMs)],['实际训练',axis821ReportMs(time.activeMs)],['已知休息',axis821ReportMs(time.restMs)],['暂停 / 未归类',axis821ReportMs(time.unaccountedMs)]])+'</section><div class="axis821ReportCoverage"><span>'+esc(profileCoverage)+'</span><span>'+esc(goalCoverage)+'</span>'+(coverage.encountersMissingCanonicalMetrics?'<span>'+coverage.encountersMissingCanonicalMetrics+' 个项目缺少标准指标</span>':'')+(coverage.unknownMetricDefinitions?'<span>'+coverage.unknownMetricDefinitions+' 个自定义指标没有历史定义</span>':'')+'</div><div class="axis821ReportSessions">'+sessions.map(axis821ReportSession).join('')+'</div>'}`;
  s=replaceFunction(s,'function renderReport()',render,'legacy Report renderer');
  s=replaceFunction(s,'async function makeReportImage()',`async function makeReportImage(){return null}`,'legacy Report image exporter');

  const oldBind="$('#reportBtn').onclick=()=>{reportRange='last';renderReport();openSheet('reportSheet')};$$('#reportRange button').forEach(b=>b.onclick=()=>{reportRange=b.dataset.range;renderReport()});$('#shareReport').onclick=async()=>{const blob=await makeReportImage();if(blob)shareBlob(blob,`AXIS-训练报告-${dlabel(Date.now())}.jpg`,'image/jpeg')};";
  const newBind="$('#reportBtn').onclick=()=>{reportRange='all';renderReport();openSheet('reportSheet')};";
  if(!s.includes(oldBind))fail('legacy Report binding cluster missing');
  s=s.replace(oldBind,newBind);

  const closeAt=s.lastIndexOf('})();');if(closeAt<0)fail('canonical app close missing');
  const marker="\ntry{window.__AXIS_821_TRAINING_REPORT_UI__={version:'8.21',truthSchema:'axis.report-range.v1',sourceOwner:'__AXIS_821_REPORT_RANGE_TRUTH__',reportUIOwner:true,storageWrite:false,liveProfileRead:false,currentObjectDefinitionRead:false,legacyReportAggregation:false,exportOwner:false,legacyShareExport:false}}catch{};\n";
  s=s.slice(0,closeAt)+marker+s.slice(closeAt);

  for(const forbidden of ['state.profile.name','reportRange===\'7\'','reportRange===\'30\'']){const r=functionRange(s,'function renderReport()','final Training Report renderer').text;if(r.includes(forbidden))fail(`final renderer forbidden token ${forbidden}`)}
  if(!s.includes("truth.build({})")||!s.includes("truth.build({start:Number(route.start),end:Number(route.start)+1})"))fail('truth-backed all/session routes missing');
  syntax(s,FILE);write(FILE,s);
}

{
  const FILE='styles.css';let s=read(FILE);
  if(s.includes('AXIS 8.21 Training Report UI'))fail('Training Report styles already installed');
  s+=`\n/* AXIS 8.21 Training Report UI */\n.axis821ReportSheet{padding-bottom:calc(34px + env(safe-area-inset-bottom))}.axis821ReportScope{margin:-8px 0 18px;font-size:12px;color:var(--muted);font-variant-numeric:tabular-nums}.axis821ReportPreview{display:block}.axis821ReportHero{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid var(--line2);border-bottom:1px solid var(--line2)}.axis821ReportHero>div{padding:18px 0;min-width:0}.axis821ReportHero>div+div{border-left:1px solid var(--line2);padding-left:16px}.axis821ReportHero span{display:block;font-size:11px;color:var(--muted)}.axis821ReportHero b{display:block;margin-top:8px;font-size:28px;line-height:1;font-weight:660;letter-spacing:-.04em;font-variant-numeric:tabular-nums}.axis821ReportTime{margin-top:30px}.axis821ReportSectionHead{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:8px}.axis821ReportSectionHead>b,.axis821ReportSession h3{font-size:14px;font-weight:680;letter-spacing:-.01em}.axis821ReportSectionHead>span{font-size:11px;color:var(--muted);text-align:right}.axis821ReportRows{border-top:1px solid var(--line2)}.axis821ReportRows>div{min-height:46px;display:flex;align-items:center;justify-content:space-between;gap:20px;border-bottom:1px solid var(--line2)}.axis821ReportRows span{font-size:12px;color:var(--muted)}.axis821ReportRows b{font-size:13px;font-weight:620;text-align:right;font-variant-numeric:tabular-nums}.axis821ReportCoverage{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}.axis821ReportCoverage span{padding:7px 9px;border-radius:999px;background:var(--s2);font-size:10.5px;color:var(--muted)}.axis821ReportSessions{margin-top:30px}.axis821ReportSession{padding:24px 0 8px;border-top:1px solid var(--line)}.axis821ReportSessionHead{display:flex;align-items:flex-end;justify-content:space-between;gap:18px}.axis821ReportSessionHead div>span{display:block;font-size:11px;color:var(--muted)}.axis821ReportSessionHead div>b{display:block;margin-top:5px;font-size:18px;font-weight:660;letter-spacing:-.02em;font-variant-numeric:tabular-nums}.axis821ReportSessionHead>strong{font-size:12px;color:var(--muted);font-weight:560}.axis821ReportSession section{margin-top:22px}.axis821ReportSession h3{margin:0 0 9px}.axis821ReportMissing{padding:14px 0;border-top:1px solid var(--line2);border-bottom:1px solid var(--line2);font-size:11.5px;line-height:1.55;color:var(--muted)}.axis821ReportEncounter{padding:14px 0;border-top:1px solid var(--line2)}.axis821ReportEncounter:last-child{border-bottom:1px solid var(--line2)}.axis821ReportEncounterHead{display:flex;align-items:baseline;justify-content:space-between;gap:16px}.axis821ReportEncounterHead b{font-size:13px;font-weight:650}.axis821ReportEncounterHead span{font-size:10.5px;color:var(--dim);font-variant-numeric:tabular-nums}.axis821ReportMetrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 16px;margin-top:11px}.axis821ReportMetrics>div{min-width:0}.axis821ReportMetrics span{display:flex;align-items:center;gap:6px;font-size:10.5px;color:var(--muted)}.axis821ReportMetrics i{font-style:normal;font-size:9px;color:var(--dim)}.axis821ReportMetrics b{display:block;margin-top:4px;font-size:14px;font-weight:620;overflow-wrap:anywhere}.axis821ReportEmpty{padding:52px 0;text-align:center}.axis821ReportEmpty b{display:block;font-size:17px;font-weight:660}.axis821ReportEmpty span{display:block;max-width:290px;margin:9px auto 0;font-size:12px;line-height:1.6;color:var(--muted)}@media(min-width:760px){.axis821ReportSheet{width:min(720px,calc(100% - 48px));border-radius:28px 28px 0 0}.axis821ReportMetrics{grid-template-columns:repeat(3,minmax(0,1fr))}}\n`;
  write(FILE,s);
}

console.log('[AXIS 8.21 Training Report UI] PASS · existing Report entrypoints retained · axis.report-range.v1 only · historical snapshots/time/metrics rendered · explicit missing coverage · legacy range/image export retired · no persistence owner');