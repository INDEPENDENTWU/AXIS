import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 settings alignment fix] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_FIELD_POLISH__'))fail('field polish must run first');
if(src.includes('__AXIS_8123_SETTINGS_ALIGNMENT_FIX__'))fail('alignment fix already installed');
const end=src.lastIndexOf('})();');if(end<0)fail('v87 runtime IIFE end missing');
const block=String.raw`
/* AXIS 8.12.3 — measured Settings geometry: gate owns full row width; link uses native 6px local inset. */
(function axis8123SettingsAlignmentFix(){
 if(D.querySelector('#v8123SettingsAlignmentFixStyle'))return;
 const s=D.createElement('style');s.id='v8123SettingsAlignmentFixStyle';s.textContent=
  '#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{display:block!important;width:100%!important;margin:0!important;padding:0!important;transform:none!important}'+
  '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{box-sizing:border-box!important;width:100%!important;margin:0!important;padding-left:6px!important;padding-right:6px!important;transform:none!important}'+
  '@media(max-width:380px){#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{padding-left:6px!important;padding-right:6px!important}}';
 D.head.appendChild(s)
})();
try{window.__AXIS_8123_FIELD_POLISH__.settingsRowInset=6;window.__AXIS_8123_SETTINGS_ALIGNMENT_FIX__={version:'8.12.3',gateWidth:'100%',localInsetPx:6,measuredAtCssWidth:417,trainingOwner:false}}catch{}
`;
src=src.slice(0,end)+block+'\n'+src.slice(end);
for(const needle of ['__AXIS_8123_SETTINGS_ALIGNMENT_FIX__','localInsetPx:6','padding-left:6px!important','padding-right:6px!important'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 settings alignment fix] PASS · full-width gates · native 6px local inset · label/chevron share native Settings columns');
