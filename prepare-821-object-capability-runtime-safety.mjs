import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Object capability runtime safety] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
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
  return {start,end,text:src.slice(start,end)};
}
function replaceFunction(src,signature,replacement,label){
  const r=functionRange(src,signature,label);
  return src.slice(0,r.start)+replacement+src.slice(r.end);
}

/* Reuse the exact field-scope boundary that has been release-blocking since
 * 8.18. The first `})();` is the canonical app IIFE close; `let state={` proves
 * it is the app owner rather than a later generated scope. */
function appOwnerBoundary(src){
  const stateAt=src.indexOf('let state={');
  const closeAt=src.indexOf('})();');
  if(stateAt<0)fail('canonical app state owner missing');
  if(closeAt<0)fail('canonical app IIFE close missing');
  if(closeAt<=stateAt)fail('canonical app scope boundary invalid');
  return {stateAt,closeAt};
}
function relocateBlockInsideOwner(src,startNeedle,endNeedle,label){
  let {stateAt,closeAt}=appOwnerBoundary(src);
  const start=src.indexOf(startNeedle);
  if(start<0)fail(`${label} start missing`);
  if(src.indexOf(startNeedle,start+startNeedle.length)>=0)fail(`${label} duplicated`);
  const tail=src.indexOf(endNeedle,start);
  if(tail<0)fail(`${label} end missing`);
  const end=tail+endNeedle.length;
  if(start>stateAt&&end<=closeAt)return src;
  const block=src.slice(start,end);
  src=src.slice(0,start)+src.slice(end);
  ({stateAt,closeAt}=appOwnerBoundary(src));
  src=src.slice(0,closeAt)+'\n'+block+'\n'+src.slice(closeAt);
  const placed=src.indexOf(startNeedle),final=appOwnerBoundary(src);
  if(!(placed>final.stateAt&&placed<final.closeAt))fail(`${label} did not land inside canonical app owner`);
  return src;
}

/* Choice writes the one app-owned metric input. Keep its listener in the exact
 * lexical owner of axis821MetricInput; document is only the delegated event root. */
const choiceFrom="D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');";
const choiceTo="document.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');";
const choiceHits=s.split(choiceFrom).length-1;
if(choiceHits!==1)fail(`choice binding expected once, found ${choiceHits}`);
s=s.replace(choiceFrom,choiceTo);
s=relocateBlockInsideOwner(s,choiceTo,'},true);','choice metric binding');

/* Enum localization consumes the app-private visible Object formatter. */
const enumSignature='function axis821LocalizeVisibleEnums(root=document)';
const enumTail='queueMicrotask(()=>axis821LocalizeVisibleEnums(document));';
s=relocateBlockInsideOwner(s,enumSignature,enumTail,'visible enum localization bridge');

/* Pace values remain strings. Avoid regex text that the historical compiler can
 * tokenize into a runtime km$ identifier. */
const paceHelper=`function axis821CleanPaceValue(v){const raw=String(v??'').trim(),low=raw.toLowerCase();for(const suffix of [' / km','/ km',' /km','/km'])if(low.endsWith(suffix))return raw.slice(0,raw.length-suffix.length).trim();return raw}\n`;
const valueSignature='function axis821MetricValueText(m,v)';
const valueAt=s.indexOf(valueSignature);
if(valueAt<0)fail('metric value formatter missing');
if(!s.includes('function axis821CleanPaceValue(v)'))s=s.slice(0,valueAt)+paceHelper+s.slice(valueAt);
s=replaceFunction(
  s,
  valueSignature,
  `function axis821MetricValueText(m,v){if(v==null||v===''||String(v)==='undefined'||String(v)==='NaN')return'';const type=String(m?.type||''),unit=String(m?.unit||'');if(type==='boolean')return(v===true||v===1||v==='1'||v==='true')?'是':'否';if(type==='choice'){const hit=(m?.options||[]).find(x=>String(x?.value??x)===String(v));return String(hit?.label??v)}if(type==='pace'||String(m?.key)==='pace'){const clean=axis821CleanPaceValue(v);return clean+(unit?' '+unit:'')}const n=Number(v),base=Number.isFinite(n)?(n%1?String(Math.round(n*1000)/1000):String(n)):String(v);return(base==='undefined'||base==='NaN')?'':base+(unit?' '+unit:'')}`,
  'build-safe metric value formatter'
);

/* Final runtime projection must obey the capability truth: a fact does not own
 * an execution mode. `reps` alone remains single; Group Plan begins only when
 * `sets` exists, weight+reps jointly imply a set structure, or an explicit sets
 * capability hint is present. */
const executionSignature='function axis821AutoExecutionMode(eq,schema=axis818SchemaForEq(eq))';
s=replaceFunction(
  s,
  executionSignature,
  `function axis821AutoExecutionMode(eq,schema=axis818SchemaForEq(eq)){const explicit=axis821ExecutionExplicit(eq);if(explicit)return explicit;const xs=Array.isArray(schema)?schema:[],keys=new Set(xs.map(x=>String(x?.key||x?.id||'')).filter(Boolean)),hints=new Set(xs.map(x=>String(x?.extensions?.axis?.executionHint||AXIS821_RUNTIME_CAPABILITIES[String(x?.key||x?.id||'')]?.executionHint||(({duration:'timed',distance:'timed',pace:'timed',boolean:'complete'})[String(x?.type||'')]||'context'))));if(keys.has('rounds')||hints.has('rounds'))return'rounds';if(keys.has('sets')||(keys.has('weight')&&keys.has('reps'))||hints.has('sets'))return'sets';if(keys.has('hold')||hints.has('hold'))return'hold';if(keys.size===1&&keys.has('completed'))return'complete';if(hints.has('timed'))return'timed';if(xs.length===1&&hints.has('complete'))return'complete';return'single'}`,
  'fact/execution ownership resolver'
);

const controlSignature='function axis821MetricControl(m,prev)';
const control=functionRange(s,controlSignature,'metric-control-system recorder renderer');
for(const token of ['axis821MetricFamily(m)','AXIS821_RUNTIME_CAPABILITIES',"if(kind==='pace'){",'data-axis821-family','data-axis821-choice','data-axis821-pace-step','data-axis821-rate','data-axis821-bool'])if(!control.text.includes(token))fail('metric-control-system recorder renderer safety contract missing '+token);
if(control.text.includes('km$/')||control.text.includes('km$'))fail('metric-control-system recorder renderer contains compiler-unsafe pace token');

/* Final lexical seal. All capability code that consumes private app helpers must
 * be before the proven canonical app close. */
const owner=appOwnerBoundary(s);
for(const [needle,label] of [[choiceTo,'choice binding'],[enumSignature,'enum localization'],['function axis821CleanPaceValue(v)','pace helper'],[valueSignature,'metric formatter'],[executionSignature,'execution resolver'],[controlSignature,'metric control']]){
  const at=s.indexOf(needle);
  if(at<0||at<=owner.stateAt||at>=owner.closeAt)fail(`${label} is outside canonical app lexical owner`);
}
if(s.includes(choiceFrom))fail('app-private D survived in choice binding');
for(const signature of [valueSignature,executionSignature,controlSignature]){
  const text=functionRange(s,signature,signature).text;
  if(text.includes('km$/')||text.includes('km$'))fail(`${signature} still contains compiler-unsafe pace token`);
}
const staleRepsOwnership="keys.has('sets')||keys.has('reps')||hints.has('sets')";
const finalSetBoundary="keys.has('sets')||(keys.has('weight')&&keys.has('reps'))||hints.has('sets')";
if(s.includes(staleRepsOwnership))fail('runtime still lets reps fact claim sets execution');
if(!functionRange(s,executionSignature,'execution resolver').text.includes(finalSetBoundary))fail('runtime set execution boundary missing');

/* Audit the complete tail while respecting self-contained later IIFEs that own
 * their own `const D=document`. A D use is legal only when the nearest enclosing
 * historical IIFE declares its own D before that use; otherwise it is an app
 * private-alias leak and must stop the release build with source context. */
{
  const {closeAt}=appOwnerBoundary(s),tail=s.slice(closeAt),leaks=[];
  const re=/\bD(?:\.|\[)/g;
  for(const m of tail.matchAll(re)){
    const rel=m.index||0,at=closeAt+rel;
    const before=s.slice(closeAt,at);
    const iifeAt=Math.max(before.lastIndexOf('(function '),before.lastIndexOf('(function('),before.lastIndexOf('(()=>{'));
    const iifeEnd=iifeAt>=0?s.indexOf('})();',closeAt+iifeAt):-1;
    const localPrefix=iifeAt>=0?s.slice(closeAt+iifeAt,at):'';
    const ownsLocalD=iifeAt>=0&&iifeEnd>at&&/(?:const|let)\s+D\s*=\s*document\b/.test(localPrefix);
    if(ownsLocalD)continue;
    const context=s.slice(Math.max(closeAt,at-120),Math.min(s.length,at+260)).replace(/\s+/g,' ').trim();
    leaks.push(context);
  }
  if(leaks.length)fail(`app-private D leaks after canonical owner (${leaks.length}) :: ${leaks.slice(0,8).join(' || ')}`);
}

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);

/* The visible Object editor must project the exact same execution boundary as
 * app runtime so editing a reps-only schema cannot silently turn it into Group
 * Plan execution before the Object is saved. */
const EDITOR_FILE='v874-professional.js';
if(!fs.existsSync(EDITOR_FILE))fail(`missing ${EDITOR_FILE}`);
let editor=fs.readFileSync(EDITOR_FILE,'utf8');
const editorExecutionSignature='function axis821EditorAutoMode()';
editor=replaceFunction(
  editor,
  editorExecutionSignature,
  `function axis821EditorAutoMode(){const xs=axis818MetricDraft||[],keys=new Set(xs.map(x=>String(x?.key||x?.id||'')).filter(Boolean)),hints=new Set(xs.map(x=>String(x?.extensions?.axis?.executionHint||AXIS821_EDITOR_EXECUTION_HINTS[String(x?.key||x?.id||'')]||(({duration:'timed',distance:'timed',pace:'timed',boolean:'complete'})[String(x?.type||'')]||'context'))));if(keys.has('rounds')||hints.has('rounds'))return'rounds';if(keys.has('sets')||(keys.has('weight')&&keys.has('reps'))||hints.has('sets'))return'sets';if(keys.has('hold')||hints.has('hold'))return'hold';if(keys.size===1&&keys.has('completed'))return'complete';if(hints.has('timed'))return'timed';if(xs.length===1&&hints.has('complete'))return'complete';return'single'}`,
  'editor fact/execution ownership resolver'
);
const editorExecution=functionRange(editor,editorExecutionSignature,'editor execution resolver').text;
if(editor.includes(staleRepsOwnership))fail('editor still lets reps fact claim sets execution');
if(!editorExecution.includes(finalSetBoundary))fail('editor set execution boundary missing');
try{new Function(editor)}catch(e){fail(`editor syntax ${e.message}`)}
fs.writeFileSync(EDITOR_FILE,editor);

console.log('[AXIS 8.21 Object capability runtime safety] PASS · proven 8.18 app boundary reused · capability truth projected into runtime/editor execution ownership · choice/localization/pace inside canonical owner · local-D-aware tail audit · hardened isolation safe');
