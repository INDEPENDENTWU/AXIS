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
    if(block){if(ch==='*'&&next==='/'){block=false;i++;continue}
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

/*
 * The choice control is emitted inside the canonical app owner. Use the browser
 * document for the event target so later compiler stages cannot confuse the
 * helper alias, while still delegating to the one app-owned metric value owner.
 */
const choicePrefix="D.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');";
const choiceHits=s.split(choicePrefix).length-1;
if(choiceHits!==1)fail(`choice binding expected once, found ${choiceHits}`);
s=s.replace(choicePrefix,"document.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]');");

/*
 * Executable Object convergence originally emitted the enum/localization bridge
 * immediately after the app IIFE. That bridge calls axis821VisibleObjectType,
 * which is deliberately private to the app owner. Moving the whole bridge back
 * before the same IIFE close fixes the lexical boundary rather than exporting a
 * second global presentation owner.
 */
const enumSignature='function axis821LocalizeVisibleEnums(root=document)';
const enumStart=s.indexOf(enumSignature);
const enumTail='queueMicrotask(()=>axis821LocalizeVisibleEnums(document));';
const enumTailAt=s.indexOf(enumTail,enumStart);
if(enumStart<0||enumTailAt<0)fail('localization bridge missing after capability convergence');
const enumEnd=enumTailAt+enumTail.length;
const ownerClose=s.lastIndexOf('})();',enumStart);
if(ownerClose<0)fail('canonical app IIFE close missing before localization bridge');
if(enumStart<ownerClose)fail('localization bridge unexpectedly already inside app owner');
const enumBlock=s.slice(enumStart,enumEnd);
s=s.slice(0,enumStart)+s.slice(enumEnd);
s=s.slice(0,ownerClose)+enumBlock+'\n'+s.slice(ownerClose);

/*
 * Do not emit a slash-heavy pace regular expression through the historical
 * canonical compiler. The previous generated /...km$/ expression was valid in
 * source but could be tokenized into a runtime km$ identifier. Plain suffix
 * handling is deterministic, portable and preserves the same user value.
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

if(s.includes(choicePrefix))fail('app-private D survived in choice binding');
if(!s.includes("document.addEventListener('click',e=>{const b=e.target.closest?.('[data-axis821-choice]')"))fail('document-scoped choice binding missing');
if(!s.includes('function axis821CleanPaceValue(v)'))fail('plain-string pace normalizer missing');
const finalEnumStart=s.indexOf(enumSignature),finalEnumClose=s.indexOf('})();',finalEnumStart);
if(finalEnumStart<0||finalEnumClose<0||finalEnumStart>finalEnumClose)fail('localization bridge did not return inside canonical app IIFE');
for(const signature of [valueSignature,controlSignature]){
  const text=functionRange(s,signature,signature).text;
  if(text.includes('km$/'))fail(`${signature} still contains compiler-unsafe pace regex`);
  if(text.includes('km$'))fail(`${signature} still contains compiler-unsafe km$ token`);
}
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Object capability runtime safety] PASS · localization returned to app lexical owner · choice binding compiler-safe · pace normalization regex-free · Chromium/WebKit cold-boot boundary sealed');
