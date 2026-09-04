import fs from 'node:fs';

const FILE='app.js',fail=m=>{throw new Error(`[AXIS 8.21 Report PDF Export scope] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');

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

const start=s.indexOf('\nfunction axis821ReportInputDate(ms){');
if(start<0)fail('generated PDF runtime block missing');
const marker='try{window.__AXIS_821_REPORT_PDF_EXPORT__={';
const markerAt=s.indexOf(marker,start);
if(markerAt<0)fail('PDF runtime marker missing');
const endLine=s.indexOf('\n',markerAt);
if(endLine<0)fail('PDF runtime marker line end missing');
const block=s.slice(start,endLine+1);
if((block.match(/__AXIS_821_REPORT_PDF_EXPORT__/g)||[]).length!==1)fail('PDF runtime marker count inside block is not one');
s=s.slice(0,start)+s.slice(endLine+1);
if(s.includes(marker))fail('PDF runtime marker remained at old post-IIFE location');

const report=functionRange(s,'function renderReport()','canonical Training Report renderer');
s=s.slice(0,report.end)+block+s.slice(report.end);
if((s.match(/__AXIS_821_REPORT_PDF_EXPORT__/g)||[]).length!==1)fail('final PDF runtime marker count is not one');
if(s.indexOf('function axis821ReportInputDate(ms){')<report.start)fail('PDF helpers were not moved after canonical Report owner');
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Report PDF Export scope] PASS · one PDF runtime moved into canonical Training Report lexical scope · no second owner/request/store');