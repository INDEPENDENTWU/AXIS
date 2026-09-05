import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Report Share Card] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const syntax=(s,f)=>{try{new Function(s)}catch(e){fail(`${f} syntax ${e.message}`)}};

{
  const FILE='index.html';let s=read(FILE);
  if(!s.includes('id="axis821ReportPdf"')||!s.includes('id="axis821ReportIdentity"'))fail('Report PDF Export must be installed first');
  if(s.includes('id="axis821ReportShareImage"'))fail('Report Share Card already installed');
  const hook=`    <div class="axis821ReportExportBox">
      <label class="axis821ReportIdentity"><input type="checkbox" id="axis821ReportIdentity"><span>包含个人信息</span></label>
      <button type="button" class="saveRecord axis821ReportPdf" id="axis821ReportPdf">导出 PDF</button>
    </div>`;
  if(!s.includes(hook))fail('canonical Report export box boundary missing');
  const replacement=`    <div class="axis821ReportExportBox">
      <label class="axis821ReportIdentity"><input type="checkbox" id="axis821ReportIdentity"><span>导出时包含个人信息</span></label>
      <div class="axis821ReportExportActions">
        <button type="button" class="saveRecord axis821ReportShareImage" id="axis821ReportShareImage">分享图片</button>
        <button type="button" class="saveRecord axis821ReportPdf" id="axis821ReportPdf">导出 PDF</button>
      </div>
    </div>`;
  s=s.replace(hook,replacement);
  write(FILE,s);
}

{
  const FILE='app.js';let s=read(FILE);
  if(!s.includes('__AXIS_821_REPORT_PDF_EXPORT__'))fail('Report PDF Export runtime must be installed first');
  if(!s.includes("truthSchema:'axis.report-range.v1'"))fail('Report Range Truth marker missing');
  if(s.includes('__AXIS_821_REPORT_SHARE_CARD__'))fail('Report Share Card runtime already installed');

  const runtime=`
function axis821ReportShareCardScope(v){const base=axis821ReportScopeText(v);if(v?.mode!=='all'||!v?.sessions?.length)return base;let lo=null,hi=null;for(const x of v.sessions){const a=Number(x.start),b=Number(x.end);if(Number.isFinite(a))lo=lo==null?a:Math.min(lo,a);if(Number.isFinite(b))hi=hi==null?b:Math.max(hi,b);else if(Number.isFinite(a))hi=hi==null?a:Math.max(hi,a)}return lo==null?base:base+' · '+axis821ReportInputDate(lo)+' — '+axis821ReportInputDate(hi==null?lo:hi)}
function axis821ReportShareCardRound(c,x,y,w,h,r){const rr=Math.max(0,Math.min(Number(r)||0,w/2,h/2));c.beginPath();c.moveTo(x+rr,y);c.lineTo(x+w-rr,y);c.quadraticCurveTo(x+w,y,x+w,y+rr);c.lineTo(x+w,y+h-rr);c.quadraticCurveTo(x+w,y+h,x+w-rr,y+h);c.lineTo(x+rr,y+h);c.quadraticCurveTo(x,y+h,x,y+h-rr);c.lineTo(x,y+rr);c.quadraticCurveTo(x,y,x+rr,y);c.closePath()}
function axis821ReportShareCardFont(c,size,weight=600){c.font=String(weight)+' '+String(size)+'px -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei","Noto Sans SC",Arial,sans-serif'}
function axis821ReportShareCardText(c,text,x,y,maxWidth,lineHeight,maxLines=2){const chars=Array.from(String(text??'')),lines=[];let line='';for(const ch of chars){const next=line+ch;if(line&&c.measureText(next).width>maxWidth){lines.push(line);line=ch;if(lines.length>=maxLines)break}else line=next}if(lines.length<maxLines&&line)lines.push(line);if(lines.length===maxLines&&chars.join('').length>lines.join('').length){let last=lines[lines.length-1];while(last&&c.measureText(last+'…').width>maxWidth)last=last.slice(0,-1);lines[lines.length-1]=last+'…'}lines.forEach((t,i)=>c.fillText(t,x,y+i*lineHeight));return lines.length}
function axis821ReportShareCardDataUrlBlob(url){const comma=String(url||'').indexOf(',');if(comma<0)throw new Error('[AXIS Report Share] invalid canvas data');const head=url.slice(0,comma),match=/^data:([^;]+)/.exec(head),type=match?.[1]||'image/png',bin=atob(url.slice(comma+1)),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);return new Blob([bytes],{type})}
function axis821ReportShareCardBlob(view){const v=view||axis821ReportView();if(!v?.sessions?.length)return null;const sum=v.summary||{},time=sum.time||{},coverage=sum.coverage||{},includeIdentity=!!$('#axis821ReportIdentity')?.checked,identity=includeIdentity?axis821ReportExportIdentity():[],width=1080,height=identity.length?1540:1350,cv=D.createElement('canvas');cv.width=width;cv.height=height;const c=cv.getContext('2d');if(!c)throw new Error('[AXIS Report Share] canvas unavailable');
  c.fillStyle='#f1f0ec';c.fillRect(0,0,width,height);c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,32,800);c.fillText('AXIS',72,82);c.fillStyle='#737cff';c.fillRect(72,108,92,8);
  c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,56,760);c.fillText('训练报告摘要',72,190);c.fillStyle='#6f737a';axis821ReportShareCardFont(c,25,560);axis821ReportShareCardText(c,axis821ReportShareCardScope(v),72,238,936,34,2);
  const total=axis821ReportMs(time.totalMs||0);c.fillStyle='#0d0f12';let totalSize=94;axis821ReportShareCardFont(c,totalSize,760);while(totalSize>58&&c.measureText(total).width>936){totalSize-=4;axis821ReportShareCardFont(c,totalSize,760)}c.fillText(total,72,370);c.fillStyle='#777b82';axis821ReportShareCardFont(c,23,620);c.fillText('已知训练时长',72,412);
  const cards=[['完成训练',Number(sum.sessionCount||0)+' 次'],['训练项目',Number(sum.encounterCount||0)+' 项'],['指标事实',Number(sum.metricObservationCount||0)+' 条']];cards.forEach((x,i)=>{const bx=72+i*314,by=466,bw=286,bh=154;axis821ReportShareCardRound(c,bx,by,bw,bh,24);c.fillStyle='#e4e2dd';c.fill();c.fillStyle='#74787f';axis821ReportShareCardFont(c,20,620);c.fillText(x[0],bx+24,by+43);c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,42,720);c.fillText(x[1],bx+24,by+103)});
  c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,29,720);c.fillText('时间事实',72,704);const rows=[['实际训练',axis821ReportMs(time.activeMs||0)],['已知休息',axis821ReportMs(time.restMs||0)],['暂停 / 未归类',axis821ReportMs(time.unaccountedMs||0)],['标准时间覆盖',Number(time.sessionsWithCanonicalTruth||0)+' / '+Number(sum.sessionCount||0)+' 次']];rows.forEach((x,i)=>{const col=i%2,row=Math.floor(i/2),rx=72+col*472,ry=748+row*104;c.fillStyle='#73777e';axis821ReportShareCardFont(c,19,600);c.fillText(x[0],rx,ry);c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,28,680);axis821ReportShareCardText(c,x[1],rx,ry+38,420,34,1)});
  const cy=978;c.strokeStyle='#d5d3ce';c.lineWidth=2;c.beginPath();c.moveTo(72,cy-36);c.lineTo(1008,cy-36);c.stroke();c.fillStyle='#777b82';axis821ReportShareCardFont(c,20,610);c.fillText('记录覆盖',72,cy);c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,25,660);axis821ReportShareCardText(c,Number(coverage.sessionsWithProfileSnapshot||0)+' / '+Number(sum.sessionCount||0)+' 次有身体快照 · '+Number(coverage.sessionsWithGoalSnapshot||0)+' / '+Number(sum.sessionCount||0)+' 次有目标快照',72,cy+42,936,34,2);
  let bodyEnd=1084;if(identity.length){c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,29,720);c.fillText('导出时个人信息',72,1128);c.fillStyle='#777b82';axis821ReportShareCardFont(c,18,560);c.fillText('历史训练仍以每次训练当时保存的快照为准',72,1162);identity.forEach((x,i)=>{const col=i%2,row=Math.floor(i/2),ix=72+col*472,iy=1212+row*68;c.fillStyle='#7a7e85';axis821ReportShareCardFont(c,17,590);c.fillText(String(x[0]),ix,iy);c.fillStyle='#0d0f12';axis821ReportShareCardFont(c,22,650);axis821ReportShareCardText(c,String(x[1]),ix,iy+28,420,28,1)});bodyEnd=1212+Math.ceil(identity.length/2)*68}
  const fy=Math.max(bodyEnd+44,height-102);c.strokeStyle='#d5d3ce';c.lineWidth=2;c.beginPath();c.moveTo(72,fy-34);c.lineTo(1008,fy-34);c.stroke();c.fillStyle='#737cff';c.fillRect(72,fy-2,84,6);c.fillStyle='#777b82';axis821ReportShareCardFont(c,18,600);c.fillText('摘要图 · 完整明细以 AXIS 训练报告为准',178,fy+4);c.textAlign='right';c.fillText(axis821ReportDateTime(Date.now()),1008,fy+4);c.textAlign='left';
  return axis821ReportShareCardDataUrlBlob(cv.toDataURL('image/png'))}
function axis821ReportShareCard(){const v=axis821ReportView();if(!v.sessions.length){toast('当前范围没有可分享的训练记录');return false}const blob=axis821ReportShareCardBlob(v);if(!blob)return false;const name='AXIS-训练报告-'+axis821ReportInputDate(Date.now())+'.png',marker=window.__AXIS_821_REPORT_SHARE_CARD__;if(marker)marker.lastExport={type:blob.type,size:blob.size,width:1080,height:$('#axis821ReportIdentity')?.checked?1540:1350,scope:axis821ReportShareCardScope(v),identityIncluded:!!$('#axis821ReportIdentity')?.checked,identityFields:$('#axis821ReportIdentity')?.checked?axis821ReportExportIdentity().length:0};shareBlob(blob,name,'image/png');return true}
try{window.__AXIS_821_REPORT_SHARE_CARD__={version:'8.21',truthSchema:'axis.report-range.v1',sourceOwner:'__AXIS_821_TRAINING_REPORT_UI__',exportOwner:true,format:'image/png',projection:'summary-share-card',rasterized:true,screenshotBased:false,storageWrite:false,networkWrite:false,personalInfo:'optional-export-time',historicalAggregation:false,lastExport:null,generate:axis821ReportShareCardBlob,share:axis821ReportShareCard}}catch{}
$('#axis821ReportShareImage').onclick=axis821ReportShareCard;
`;
  for(const forbidden of ['state.sessions','state.profile','localStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest'])if(runtime.includes(forbidden))fail(`forbidden Share Card owner/token ${forbidden}`);
  if(!runtime.includes('axis821ReportView()')||!runtime.includes('axis821ReportExportIdentity()')||!runtime.includes("cv.toDataURL('image/png')")||!runtime.includes("projection:'summary-share-card'"))fail('Share Card truth/image contract incomplete');
  const pdfMarker='try{window.__AXIS_821_REPORT_PDF_EXPORT__={',pdfAt=s.indexOf(pdfMarker);if(pdfAt<0)fail('canonical Report PDF marker missing');
  const insertAt=s.indexOf('\n',pdfAt);if(insertAt<0)fail('canonical Report PDF marker line end missing');
  s=s.slice(0,insertAt+1)+runtime+s.slice(insertAt+1);
  if(s.indexOf('function axis821ReportShareCardScope(v){')<s.indexOf('function renderReport()'))fail('Share Card runtime escaped canonical Training Report lexical scope');
  syntax(runtime,'isolated Report Share Card runtime');syntax(s,FILE);write(FILE,s);
}

{
  const FILE='styles.css';let s=read(FILE);
  if(s.includes('AXIS 8.21 Report Share Card'))fail('Report Share Card styles already installed');
  s+=`\n/* AXIS 8.21 Report Share Card */\n.axis821ReportExportActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:236px}.axis821ReportExportActions .saveRecord{height:42px;margin:0;border-radius:13px;font-size:12px;padding:0 14px}.axis821ReportShareImage{background:var(--accent)!important;color:#fff!important}.axis821ReportExportActions .axis821ReportPdf{min-width:108px}@media(max-width:390px){.axis821ReportExportActions{width:100%;min-width:0}.axis821ReportExportActions .saveRecord{width:100%}}\n`;
  write(FILE,s);
}

console.log('[AXIS 8.21 Report Share Card] PASS · one truth-backed summary image projection · same Report range/session view · optional export-time identity · PNG canvas only · no new store/network/factual owner');
