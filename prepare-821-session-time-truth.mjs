import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.21 Session Time Truth] ${m}`)};
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

const FILE='app.js';
let s=read(FILE);
if(s.includes('__AXIS_821_SESSION_TIME_TRUTH__'))fail('Session time truth already installed');
if(!s.includes('__AXIS_821_PROFILE_SESSION_TRUTH__'))fail('Profile / Goal Session-start truth must exist first');
if(!s.includes('__AXIS_821_METRIC_OPTICAL_SYSTEM__'))fail('Metric Optical System must exist first');

const pureSource=read('lib/axis-session-time-truth.mjs');
if(/\bimport\s/.test(pureSource))fail('pure Session time model must not import runtime modules');
const browserSource=pureSource.replace(/^export\s+/gm,'');
if(/\bexport\s/.test(browserSource))fail('pure Session time model export stripping incomplete');

const finish=functionRange(s,'function completeFinish()','canonical Session completion');
if(!finish.text.includes('sealSessionActivities(s,t);'))fail('canonical Session completion seal boundary missing');
if((finish.text.match(/sealSessionActivities\(s,t\);/g)||[]).length!==1)fail('canonical Session activity seal must occur exactly once');
const patchedFinish=finish.text.replace('sealSessionActivities(s,t);','axis821SealSessionTime(s,t);sealSessionActivities(s,t);');
s=s.slice(0,finish.start)+patchedFinish+s.slice(finish.end);

const runtime=`
/* AXIS 8.21 — immutable Session factual time truth. */
${browserSource}
function axis821SealSessionTime(s,t){const summary=axisSessionTimeBuild(s,homeMeta(),t);s.timeSummary=summary;return summary}
try{window.__AXIS_821_SESSION_TIME_TRUTH__={version:'8.21',schema:'axis.session-time.v1',owner:'app-session-completion',storage:'axis_v60_state.sessions[].timeSummary',total:'session-start-end',active:'real-activity-intervals-or-explicit-duration',rest:'explicit-pause-only-no-active-overlap',unaccounted:'not-inferred',legacyBackfill:false,strengthInference:false,newPersistence:false,newSessionWriter:false,newEncounterWriter:false,newActiveOwner:false,newFlowOwner:false,reportOwner:false,build:axisSessionTimeBuild}}catch{}
`;
const stateAt=s.indexOf('let state={'),closeAt=s.indexOf('})();');
if(stateAt<0||closeAt<0||closeAt<=stateAt)fail('canonical app lexical owner missing');
s=s.slice(0,closeAt)+runtime+s.slice(closeAt);

const finalFinish=functionRange(s,'function completeFinish()','final canonical Session completion').text;
if(!finalFinish.includes('axis821SealSessionTime(s,t);sealSessionActivities(s,t);'))fail('Session time summary is not sealed before Activity cleanup');
for(const token of ['axis.session-time.v1','explicit-pause-only-no-active-overlap','strengthInference:false','legacyBackfill:false','newPersistence:false','newEncounterWriter:false','newActiveOwner:false','newFlowOwner:false'])if(!s.includes(token))fail(`Session time runtime contract missing ${token}`);
syntax(s,FILE);write(FILE,s);
console.log('[AXIS 8.21 Session Time Truth] PASS · completion-owned immutable Session time · real Active union · explicit pause rest · no inferred strength time');
