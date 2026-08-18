import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.3 final alignment] ${m}`)};
let src=fs.readFileSync(FILE,'utf8');
if(!src.includes('__AXIS_8123_LEARNING__'))fail('learning simplification must run first');
const end=src.lastIndexOf('})();');
if(end<0)fail('runtime IIFE end not found');
if(src.includes('__AXIS_8123_FINAL_ALIGNMENT__'))fail('final alignment already installed');

const block=String.raw`
/* AXIS 8.12.3 — final native Settings inset owner. */
(function axis8123InstallFinalSettingsAlignment(){
 if(D.querySelector('#v8123FinalSettingsAlignment'))return;
 const s=D.createElement('style');s.id='v8123FinalSettingsAlignment';s.textContent=
  '#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{margin-left:0!important;margin-right:0!important;padding-left:0!important;padding-right:0!important;transform:none!important;left:auto!important;right:auto!important;width:auto!important}'+
  '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{padding-left:24px!important;padding-right:24px!important}'+
  '#settingsSheet #v813LearningGate>.v8711Fold,#settingsSheet #v813ServiceGate>.v8711Fold{padding-left:18px!important;padding-right:18px!important}'+
  '@media(max-width:380px){#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{margin-left:0!important;margin-right:0!important}#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{padding-left:24px!important;padding-right:24px!important}}';
 D.head.appendChild(s)
})();
try{window.__AXIS_8123_FINAL_ALIGNMENT__={version:'8.12.3',nativeRowInset:24,gateHorizontalInset:0,legacyGateOffsetRetired:true,foldHorizontalInset:18,trainingOwner:false}}catch{}
`;

src=src.slice(0,end)+block+'\n'+src.slice(end);
for(const needle of ['__AXIS_8123_FINAL_ALIGNMENT__','nativeRowInset:24','gateHorizontalInset:0','legacyGateOffsetRetired:true'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 final alignment] PASS · legacy gate offset retired · Learning + Cloud/AI rows share native 24px inset · fold content preserved · no training ownership');
