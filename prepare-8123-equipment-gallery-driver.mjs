import fs from 'node:fs';
import {spawnSync} from 'node:child_process';

const APP='app.js';
const PREP='prepare-8123-equipment-gallery-and-picker-fix.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12.3 equipment gallery driver] ${m}`)};
let app=fs.readFileSync(APP,'utf8');
const prepOriginal=fs.readFileSync(PREP,'utf8');
const boundary='function overlayLines(';
const sentinel='function axis8123InstallFieldPolish(){/* AXIS 8.12.3 transient gallery insertion anchor */}\n';
if(!app.includes(boundary))fail('app overlay boundary missing');
if(app.includes('transient gallery insertion anchor'))fail('transient anchor already present');
app=app.replace(boundary,sentinel+boundary);
fs.writeFileSync(APP,app);
const appCommit='syntax(src,FILE);write(FILE,src)';
const countBoundary='function personalEqCount()`;';
const plainTextReplace='return src.replace(from,to)};';
const plainRegexReplace='return src.replace(re,to)};';
if((prepOriginal.split(appCommit).length-1)<1)fail('app transform commit signature missing');
if((prepOriginal.split(countBoundary).length-1)!==1)fail('personal equipment count boundary signature missing');
if((prepOriginal.split(plainTextReplace).length-1)!==1||(prepOriginal.split(plainRegexReplace).length-1)!==1)fail('replacement helper signatures missing');
const prepForBuild=prepOriginal
 .replace(countBoundary,'function personalEqCount`;')
 .replace(plainTextReplace,'return src.replace(from,()=>to)};')
 .replace(plainRegexReplace,'return src.replace(re,()=>to)};')
 .replace(appCommit,'write(FILE,src);syntax(src,FILE)');
fs.writeFileSync(PREP,prepForBuild);

let v61=fs.readFileSync('v61.js','utf8');
const hardenedQuick="const other=$('#v8Other');if(other)other.onclick=()=>{quickOther=true;$('#quickRecordSheet')?.classList.remove('show');$('#equipmentRow')?.click()};const add=$('#v8New');if(add)add.onclick=()=>{$('#quickRecordSheet')?.classList.remove('show');$('#addCustomEq')?.click()}";
const normalizedQuick="$('#v8Other').onclick=()=>{quickOther=true;$('#quickRecordSheet').classList.remove('show');$('#equipmentRow')?.click()};$('#v8New').onclick=()=>{$('#quickRecordSheet').classList.remove('show');$('#addCustomEq')?.click()}";
if((v61.split(hardenedQuick).length-1)!==1)fail('hardened Quick handler boundary missing');
v61=v61.replace(hardenedQuick,normalizedQuick);
fs.writeFileSync('v61.js',v61);

let importError=null;
try{
  await import('./prepare-8123-equipment-gallery-and-picker-fix.mjs');
  const finalApp=fs.readFileSync(APP,'utf8');
  if(finalApp.includes("$('[data-eq]',$('#eqSheet')).forEach"))fail('renderEqList collection selector collapsed to single-element helper');
  if(!finalApp.includes("$$('[data-eq]',$('#eqSheet')).forEach"))fail('renderEqList collection selector missing');
  let finalV61=fs.readFileSync('v61.js','utf8');
  if(finalV61.includes("const direct=$('#eqSheet [data-eq]').find"))fail('Quick Record fallback collection selector collapsed');
  if(!finalV61.includes("const direct=$$('#eqSheet [data-eq]').find"))fail('Quick Record canonical fallback selector missing');
  const finalV877=fs.readFileSync('v877-runtime.js','utf8');
  if(finalV877.includes("const existing=$('#eqSheet [data-eq]').find"))fail('expanded catalog fallback collection selector collapsed');
  if(!finalV877.includes("const existing=$$('#eqSheet [data-eq]').find"))fail('expanded catalog canonical fallback selector missing');
  const marker="try{window.__AXIS_8123_RECORDING_SELECTION_RECONCILE__={version:'8.12.3',owner:'v61-recording',catalogRoute:true,observerFallback:true,idempotentByEquipment:true}}catch{}";
  if((finalV61.split(marker).length-1)!==1)fail('recording reconcile marker expected once');
  const explicit="window.addEventListener('axis:equipment-selected',()=>setTimeout(axis8123ReconcileSelectedRecording,0));";
  finalV61=finalV61.replace(marker,explicit+marker.replace('observerFallback:true','observerFallback:true,explicitPickerEvent:true'));
  if(!finalV61.includes("explicitPickerEvent:true"))fail('explicit picker reconciliation marker missing');
  try{new Function(finalV61)}catch(e){fail(`v61 explicit reconciliation syntax ${e.message}`)}
  fs.writeFileSync('v61.js',finalV61);
}catch(e){
  importError=e;
  console.error('[AXIS 8.12.3 equipment gallery driver] transformed app syntax diagnostic follows');
  spawnSync(process.execPath,['--check',APP],{stdio:'inherit'});
  try{
    const cur=fs.readFileSync('v61.js','utf8');
    for(const token of ['function injectQuick()','function chooseQuick(id)','v8Other']){const i=cur.indexOf(token);if(i>=0){const a=Math.max(0,cur.lastIndexOf('\n',i)+1),b=cur.indexOf('\n',i);console.error('[AXIS 8.12.3 equipment gallery driver] v61 signature:',cur.slice(a,b<0?cur.length:b))}}
  }catch{}
}finally{
  fs.writeFileSync(PREP,prepOriginal);
  let out=fs.readFileSync(APP,'utf8');
  if(!out.includes(sentinel))fail('transient anchor was lost during transform');
  out=out.replace(sentinel,'');
  if(out.includes('transient gallery insertion anchor'))fail('transient anchor survived cleanup');
  if(!importError){try{new Function(out)}catch(e){fail(`clean app syntax ${e.message}`)}}
  fs.writeFileSync(APP,out);
}
if(importError)throw importError;
console.log('[AXIS 8.12.3 equipment gallery driver] PASS · collection selectors preserved · gallery inserted at stable app boundary · canonical picker emits explicit v61 reconcile · Quick handlers converge · transient anchor removed');
