import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Object capability runtime safety] ${m}`)};
if(!fs.existsSync(FILE))fail(`missing ${FILE}`);
let s=fs.readFileSync(FILE,'utf8');

function braceRange(src,open,label){
  if(open<0||src[open]!=='{')fail(`${label} opening brace missing`);
  let depth=0,quote='',escaped=false,line=false,block=false,end=-1;
  for(let i=open;i<src.length;i++){
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
  return {start:open,end};
}
function functionRange(src,signature,label){
  const start=src.indexOf(signature);
  if(start<0)fail(`${label} signature missing`);
  if(src.indexOf(signature,start+signature.length)>=0)fail(`${label} duplicated`);
  const brace=src.indexOf('{',start+signature.length-1);
  const body=braceRange(src,brace,label);
  return {start,end:body.end,text:src.slice(start,body.end)};
}
function replaceFunction(src,signature,replacement,label){
  const r=functionRange(src,signature,label);
  return src.slice(0,r.start)+replacement+src.slice(r.end);
}
function appOwnerRange(src){
  const prefix="(function(){'use strict';";
  const hits=src.split(prefix).length-1;
  if(hits!==1)fail(`canonical app IIFE expected once, found ${hits}`);
  const start=src.indexOf(prefix),open=src.indexOf('{',start);
  const body=braceRange(src,open,'canonical app IIFE');
  const stateAt=src.indexOf('let state={',body.start);
  if(stateAt<0||stateAt>=body.end)fail('canonical app state owner is outside app IIFE');
  return {start,bodyStart:body.start+1,bodyEnd:body.end-1,stateAt};
}
function relocateBlockInsideOwner(src,startNeedle,endNeedle,label){
  let owner=appOwnerRange(src);
  const start=src.indexOf(startNeedle);
  if(start<0)fail(`${label} start missing`);
  if(src.indexOf(startNeedle,start+startNeedle.length)>=0)fail(`${label} duplicated`);
  const tail=src.indexOf(endNeedle,start);
  if(tail<0)fail(`${label} end missing`);
  const end=tail+endNeedle.length;
  if(start>owner.bodyStart&&end<=owner.bodyEnd)return src;
  const block=src.slice(start,end);
  src=src.slice(0,start)+src.slice(end);
  owner=appOwnerRange(src);
  src=src.slice(0,owner.bodyEnd)+'\n'+block+'\n'+src.slice(owner.bodyEnd);
  const placed=src.indexOf(startNeedle),finalOwner=appOwnerRange(src);
  if(!(placed>finalOwner.bodyStart&&placed<finalOwner.bodyEnd))fail(`${label} did not land inside canonical app owner`);
  return src;
}

/*
 * Choice writes the one app-owned metric input. Its delegated listener must live
 * in the same lexical owner as axis821MetricInput; browser document is used only
 * as the event target, never as a second value/state owner.
 */
const choiceFrom="D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');";
const choiceTo="document.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');";
const choiceHits=s.split(choiceFrom).length-1;
if(choiceHits!==1)fail(`choice binding expected once, found ${choiceHits}`);
s=s.replace(choiceFrom,choiceTo);
const choiceEnd="},true);";
s=relocateBlockInsideOwner(s,choiceTo,choiceEnd,'choice metric binding');

/*
 * Enum localization calls the app-private axis821VisibleObjectType helper. Keep
 * the entire function/observer/initial paint inside the canonical app IIFE. This
 * is the same scope discipline used by the established 8.18 field scope seal,
 * but the boundary is found structurally from the function body rather than a
 * fragile invocation spelling.
 */
const enumSignature='function axis821LocalizeVisibleEnums(root=document)';
const enumTail='queueMicrotask(()=>axis821LocalizeVisibleEnums(document));';
s=relocateBlockInsideOwner(s,enumSignature,enumTail,'visible enum localization bridge');

/*
 * Do not emit a slash-heavy pace regular expression through the historical
 * canonical compiler. Plain suffix handling is deterministic and portable.
 */
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

const controlSignature='function axis821MetricControl(m,prev)';
const control=functionRange(s,controlSignature,'metric control');
const paceStart=control.text.indexOf("if(kind==='pace'){");
const paceEnd=control.text.indexOf('}const inputMode=',paceStart);
if(paceStart<0||paceEnd<0)fail('pace control branch missing');
const safePaceBranch=`if(kind==='pace'){return'<section class="axis821MetricControl" data-axis821-kind="pace" data-axis821-key="'+key+'">'+head+'<div class="axis821Direct"><input data-axis818-metric="'+key+'" inputmode="text" autocomplete="off" value="'+esc(axis821CleanPaceValue(value))+'" placeholder="5:30"><small>'+(unit||'min/km')+'</small></div></section>'}`;
const controlText=control.text.slice(0,paceStart)+safePaceBranch+control.text.slice(paceEnd+1);
s=s.slice(0,control.start)+controlText+s.slice(control.end);

/* Final lexical seal: every new capability block that consumes private app
 * helpers must sit inside the same canonical owner before hardened isolation. */
const owner=appOwnerRange(s);
for(const [needle,label] of [[choiceTo,'choice binding'],[enumSignature,'enum localization'],['function axis821CleanPaceValue(v)','pace helper'],[valueSignature,'metric formatter'],[controlSignature,'metric control']]){
  const at=s.indexOf(needle);
  if(at<0||at<=owner.bodyStart||at>=owner.bodyEnd)fail(`${label} is outside canonical app lexical owner`);
}
if(s.includes(choiceFrom))fail('app-private D survived in choice binding');
for(const signature of [valueSignature,controlSignature]){
  const text=functionRange(s,signature,signature).text;
  if(text.includes('km$/')||text.includes('km$'))fail(`${signature} still contains compiler-unsafe pace token`);
}
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Object capability runtime safety] PASS · choice + localization + pace remain inside canonical app lexical owner · regex-free pace · hardened isolation safe');
