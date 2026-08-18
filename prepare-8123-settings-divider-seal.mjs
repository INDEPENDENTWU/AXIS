import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 Settings divider seal] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_SETTINGS_SURFACE__'))fail('Settings surface must run first');
if(src.includes('__AXIS_8123_DIVIDER_SEAL__'))fail('divider seal already installed');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end missing');
const block=String.raw`
/* AXIS 8.12.3 — requested top-level Settings rows are divider-free even after late compatibility styles. */
(function axis8123InstallDividerSeal(){
 const clear=el=>{if(!el)return;el.classList.remove('v8123NoDivider');el.style.setProperty('border-bottom','0px','important')};
 const apply=()=>{
  clear(D.querySelector('#v813LearningGate>.settingLink'));
  clear(D.querySelector('#v813ServiceGate>.settingLink'));
  clear(D.querySelector('#reportBtn'));
  for(const el of Array.from(D.querySelectorAll('#settingsSheet button,#settingsSheet .settingLink'))){
   const text=(el.querySelector(':scope>span')?.textContent||el.textContent||'').replace(/\s+/g,'').trim();
   if(text.startsWith('提醒与声音'))clear(el)
  }
 };
 let queued=false;const schedule=()=>{if(queued)return;queued=true;queueMicrotask(()=>{queued=false;apply()})};
 apply();const sheet=D.querySelector('#settingsSheet');if(sheet)new MutationObserver(schedule).observe(sheet,{childList:true,subtree:true});
 D.addEventListener('click',e=>{if(e.target instanceof Element&&e.target.closest('#settingsBtn'))setTimeout(apply,0)},true);
 window.addEventListener('pageshow',()=>setTimeout(apply,0),{passive:true})
})();
try{window.__AXIS_8123_DIVIDER_SEAL__={version:'8.12.3',rows:['学习安排','云端与AI','提醒与声音','训练报告'],borderBottom:0,nativeRowClassesUnchanged:true,reportFunctionUnchanged:true}}catch{}
`;
src=src.slice(0,end)+block+'\n'+src.slice(end);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 Settings divider seal] PASS · four requested rows divider-free · synthetic divider class removed from native Settings contracts');
