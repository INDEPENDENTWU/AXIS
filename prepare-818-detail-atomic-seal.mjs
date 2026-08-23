import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 detail atomic seal] ${m}`)};
if(!fs.existsSync(FILE))fail('missing app.js');
let s=fs.readFileSync(FILE,'utf8');

function functionRange(src,signature){
 const start=src.indexOf(signature);if(start<0)fail(`${signature} missing`);if(src.indexOf(signature,start+signature.length)>=0)fail(`${signature} duplicated`);
 const brace=src.indexOf('{',start+signature.length-1);if(brace<0)fail(`${signature} brace missing`);let depth=0,quote='',esc=false,line=false,block=false,end=-1;
 for(let i=brace;i<src.length;i++){
  const ch=src[i],next=src[i+1]||'';
  if(line){if(ch==='\n')line=false;continue}
  if(block){if(ch==='*'&&next==='/'){block=false;i++}continue}
  if(quote){if(esc){esc=false;continue}if(ch==='\\'){esc=true;continue}if(ch===quote)quote='';continue}
  if(ch==='/'&&next==='/'){line=true;i++;continue}
  if(ch==='/'&&next==='*'){block=true;i++;continue}
  if(ch==="'"||ch==='"'||ch==='`'){quote=ch;continue}
  if(ch==='{')depth++;else if(ch==='}'){depth--;if(depth===0){end=i+1;break}}
 }
 if(end<0)fail(`${signature} closing brace missing`);return{start,end}
}

/* bindDynamic has exactly two canonical DOM0 binding responsibilities: event detail
   and session detail. Historical contract strings elsewhere are irrelevant. Accept
   the four inherited event-router shapes plus the repaired/legacy session helper,
   then emit one deterministic collection-safe function. No new listener/owner. */
const eventPlainDouble="$$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const eventPlainSingle="$('[data-event]').forEach(b=>b.onclick=()=>openEvent(b.dataset.event));";
const eventGuardDouble="$$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const eventGuardSingle="$('[data-event]').forEach(b=>b.onclick=()=>{const sheet=$('#detailSheet');if(sheet?.classList.contains('show'))sheet.classList.add('axis884Prepaint');return openEvent(b.dataset.event)});";
const sessionDouble="$$('[data-session]').forEach(b=>b.onclick=()=>openSession(b.dataset.session))";
const sessionSingle="$('[data-session]').forEach(b=>b.onclick=()=>openSession(b.dataset.session))";
const canonical=[
 `function bindDynamic(){${eventPlainDouble}${sessionDouble}}`,
 `function bindDynamic(){${eventPlainSingle}${sessionDouble}}`,
 `function bindDynamic(){${eventGuardDouble}${sessionDouble}}`,
 `function bindDynamic(){${eventGuardSingle}${sessionDouble}}`,
 `function bindDynamic(){${eventPlainDouble}${sessionSingle}}`,
 `function bindDynamic(){${eventPlainSingle}${sessionSingle}}`,
 `function bindDynamic(){${eventGuardDouble}${sessionSingle}}`,
 `function bindDynamic(){${eventGuardSingle}${sessionSingle}}`
];
const target=`function bindDynamic(){${eventGuardDouble}${sessionDouble}}`;
const range=functionRange(s,'function bindDynamic()');
const bind=s.slice(range.start,range.end);
const shape=canonical.indexOf(bind);
if(shape<0)fail(`unexpected bindDynamic compiler shape: ${bind.replace(/\s+/g,' ')}`);
if(!s.includes("owner:'atomic-handoff'"))fail('canonical atomic detail commit owner missing');
if(!s.includes('async function axis89HydrateDetailMedia('))fail('final artifact lost asynchronous detail media hydrator');
if(!s.includes('async function openEvent(id){'))fail('canonical openEvent missing');
if(!s.includes("sheet?.classList.remove('axis884Prepaint')"))fail('atomic commit does not release prepaint guard');
const helperAt=s.indexOf('async function axis89HydrateDetailMedia('),commitAt=s.indexOf('function axis89CommitDetail('),eventAt=s.indexOf('async function openEvent(id){');
if(!(helperAt>=0&&helperAt<commitAt&&commitAt<eventAt))fail('legacy commit compiler consumed or reordered the media hydrator');
const eventRange=functionRange(s,'async function openEvent(id)');
const eventBody=s.slice(eventRange.start,eventRange.end);
const factRe=/axis89CommitDetail\s*\(\s*txn\s*,\s*e\.name\s*,\s*buildStage\s*\(\s*(['"])\1\s*\)\s*,\s*\[\s*\]\s*,\s*bind\s*\)/g;
const hydrateRe=/axis89HydrateDetailMedia\s*\(\s*txn\s*,\s*e\s*,\s*buildStage\s*,\s*bind\s*\)/g;
const facts=[...eventBody.matchAll(factRe)],hydrates=[...eventBody.matchAll(hydrateRe)];
if(facts.length!==1||hydrates.length!==1)fail(`event detail fact/hydrate cardinality invalid · facts ${facts.length} · hydrate ${hydrates.length} · ${eventBody.replace(/\s+/g,' ').slice(0,1200)}`);
const factAt=facts[0].index??-1,hydrateAt=hydrates[0].index??-1;
if(factAt<0||hydrateAt<0||factAt>hydrateAt)fail('event detail does not commit facts before media hydration');
if(/\bawait\b/.test(eventBody.slice(0,factAt)))fail('event detail awaits before first factual commit');
if(/await\s+axis89MediaUrl\s*\(/.test(eventBody))fail('event visibility still waits on media-store reads');
if((eventBody.match(/axis89CommitDetail\s*\(/g)||[]).length!==1)fail('openEvent gained more than one direct detail commit owner');
s=s.slice(0,range.start)+target+s.slice(range.end);
const sealed=functionRange(s,'function bindDynamic()');
if(s.slice(sealed.start,sealed.end)!==target)fail('deterministic bindDynamic seal did not hold');

const close=s.lastIndexOf('})();');if(close<0)fail('app IIFE close missing');
if(s.includes('__AXIS_818_DETAIL_ATOMIC__'))fail('detail atomic diagnostic duplicated');
const bridge=`
try{window.__AXIS_818_DETAIL_ATOMIC__={version:'8.18',owner:'app.js',router:'canonical-dom0',guard:'router-prepaint',commitOwner:'atomic-handoff',retainPreviousUntilReady:true,factsFirst:true,mediaFetchBlocking:false,collectionHelper:'$$'}}catch(e){}
`;
s=s.slice(0,close)+bridge+s.slice(close);
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)};
fs.writeFileSync(FILE,s);
console.log(`[AXIS 8.18 detail atomic seal] PASS · deterministic bindDynamic · semantic fact-first detail · async media hydrator preserved · collection-safe event/session bindings · input-shape ${shape}`);
