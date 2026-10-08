import fs from 'node:fs';

const fail=m=>{throw Error('[AXIS 8.29 runtime] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
function functionRange(src,signature){
  const start=src.indexOf(signature);
  if(start<0||src.indexOf(signature,start+signature.length)>=0)fail('function anchor not unique '+signature);
  const open=src.indexOf('{',start+signature.length-1);
  if(open<0)fail('brace missing '+signature);
  let depth=0,quote='',escape=false,line=false,block=false;
  for(let i=open;i<src.length;i++){
    const ch=src[i],next=src[i+1]||'';
    if(line){if(ch==='\n')line=false;continue}
    if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
    if(quote){if(escape){escape=false;continue}if(ch==='\\'){escape=true;continue}if(ch===quote)quote='';continue}
    if(ch==='/'&&next==='/'){line=true;i++;continue}
    if(ch==='/'&&next==='*'){block=true;i++;continue}
    if(ch==='"'||ch==="'"||ch==='\`'){quote=ch;continue}
    if(ch==='{')depth++;else if(ch==='}'&&--depth===0)return{start,open,end:i+1,text:src.slice(start,i+1)};
  }
  fail('unclosed function '+signature);
}
function replaceFunction(src,signature,mutate){
 const r=functionRange(src,signature),next=mutate(r.text);
 if(next===r.text)fail('no function mutation '+signature);
 return src.slice(0,r.start)+next+src.slice(r.end);
}

{
  const f='app.js';let s=read(f);
  if(s.includes('__AXIS_829_RECORDING__'))fail('duplicate Recording Continuity');
  const seed=read('lib/axis-recording-continuity.mjs').replaceAll('export const ','const ').replaceAll('export function ','function ');
  const core='\nconst axis829Core=(()=>{\n'+seed+'\nreturn {projectRecordingRecall,RECORDING_CONTINUITY_SCHEMA,RECORDING_CONTINUITY_VERSION};\n})();\n';
  const anchor='function axis818RenderRecorder()';
  if(s.split(anchor).length!==2)fail('canonical Recorder anchor missing/duplicated');
  s=s.replace(anchor,core+anchor);
  const bridge=read('runtime/axis-829-recording-friction.js');
  const previous="window.__AXIS_828_PRACTICE_LOOP__={";
  const at=s.indexOf(previous),end=at<0?-1:s.indexOf('\n',at);
  if(at<0||end<0||s.indexOf(previous,end)>0)fail('Practice Loop integration anchor missing or duplicated');
  s=s.slice(0,end)+'\n'+bridge+'\n'+s.slice(end);
  s=replaceFunction(s,'function axis818RenderRecorder()',fn=>{
    const token='valueSchema.map(m=>axis821MetricControl(m,pv[m.key]))';
    if(fn.split(token).length!==2)fail('Recorder previous-value control anchor drift');
    fn=fn.replace(token,'valueSchema.map(m=>axis821MetricControl(m,axis829PreviousValue(m,prev)))');
    const open=fn.indexOf('{');
    fn=fn.slice(0,open+1)+'const axis829Draft=axis829CaptureDraft();'+fn.slice(open+1);
    const closing=fn.lastIndexOf('}');
    return fn.slice(0,closing)+';axis829DecorateRecorder(eq,valueSchema,prev,axis829Draft)'+fn.slice(closing);
  });
  s=replaceFunction(s,'async function saveScan()',fn=>{
    const open=fn.indexOf('{'),closing=fn.lastIndexOf('}');
    if(open<0||closing<=open)fail('canonical saveScan shape drift');
    return fn.slice(0,open+1)+
      "if(axis829SaveInFlight)return;axis829SaveInFlight=true;try{"+
      fn.slice(open+1,closing)+
      "}finally{setTimeout(()=>{axis829SaveInFlight=false},0)}"+
      fn.slice(closing);
  });
  for(const marker of ['axis829Core.projectRecordingRecall','axis829CaptureDraft','axis829DecorateRecorder','axis829SaveInFlight','__AXIS_829_RECORDING__'])if(!s.includes(marker))fail('runtime integration missing '+marker);
  try{new Function(s)}catch(e){fail('runtime syntax '+e.message)}
  write(f,s);
}
{
  const f='styles.css';let s=read(f);
  if(s.includes('AXIS 8.29 — Recording Friction Collapse'))fail('duplicate 8.29 CSS');
  s+='\n'+read('styles/axis-829-recording-friction.css').trim()+'\n';
  write(f,s);
}
console.log('[AXIS 8.29 runtime] PASS · confirmed-value reuse context · render-safe editable draft · in-flight save guard · canonical Encounter writer unchanged');
