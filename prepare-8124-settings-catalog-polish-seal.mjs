import fs from 'node:fs';

const FILE='v87-runtime.js';
const fail=m=>{throw new Error(`[AXIS 8.12.4 settings/catalog polish seal] ${m}`)};
const once=(src,a,b,label)=>{const n=src.split(a).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return src.replace(a,b)};
let src=fs.readFileSync(FILE,'utf8');

src=once(src,
 "#settingsSheet{--axis-settings-ui:var(--axis-ui,15px);--axis-settings-control-h:48px;--axis-settings-radius:14px;--axis-settings-block-y:16px;--axis-settings-gap:8px}",
 "#settingsSheet{--axis-settings-ui:var(--axis-ui,15px);--axis-settings-control-h:48px;--axis-settings-option-h:42px;--axis-settings-radius:14px;--axis-settings-block-y:16px;--axis-settings-gap:8px}",
 'Settings detail token set');

src=once(src,
 "#v813LearningGate .v811CoreOptions button{height:var(--axis-settings-control-h)!important;border-radius:var(--axis-settings-radius)!important;padding:0 10px!important;font-size:var(--axis-settings-ui)!important;font-weight:630!important;line-height:1!important}",
 "#v813LearningGate .v811CoreOptions button{height:var(--axis-settings-option-h)!important;min-height:var(--axis-settings-option-h)!important;border-radius:var(--axis-settings-radius)!important;padding:0 10px!important;font-size:var(--axis-settings-ui)!important;font-weight:630!important;line-height:1!important}",
 'Learning option native height');

src=once(src,
 "foldHorizontalInset:0,uiPx:15,controlHeightPx:48,blockYPx:16,reference:'sound-watermark'",
 "foldHorizontalInset:0,uiPx:15,segmentHeightPx:48,optionHeightPx:42,blockYPx:16,reference:'sound-watermark'",
 'Settings geometry marker semantics');

const end=src.lastIndexOf('})();');if(end<0)fail('runtime end missing');
const seal=String.raw`
(function axis8124SettingsDetailSeal(){
 if(D.querySelector('#v8124SettingsDetailSealStyle'))return;
 const s=D.createElement('style');s.id='v8124SettingsDetailSealStyle';s.textContent=
 '#settingsSheet #v813LearningGate>.v8711Fold,#settingsSheet #v813ServiceGate>.v8711Fold{padding-left:0!important;padding-right:0!important}'+
 '#settingsSheet .axis8122Group{padding:16px 0 10px!important;margin:0!important}'+
 '#settingsSheet .axis8122Group+.axis8122Group{padding-top:16px!important}'+
 '#settingsSheet .axis8122Head{gap:12px!important;margin:0 0 10px!important}'+
 '#settingsSheet .axis8122Head span{font-size:var(--axis-settings-ui)!important;line-height:1.35!important;font-weight:500!important}'+
 '#settingsSheet .axis8122Head small{margin-top:4px!important;font-size:12px!important;line-height:1.45!important}'+
 '#settingsSheet .axis8122Head>b{font-size:var(--axis-settings-ui)!important;line-height:1.35!important;font-weight:570!important}'+
 '#settingsSheet .axis8122Grid{gap:8px!important}'+
 '#settingsSheet .axis8122Grid button{height:var(--axis-settings-option-h)!important;min-height:var(--axis-settings-option-h)!important;border-radius:13px!important;font-size:var(--axis-settings-ui)!important;font-weight:590!important}'+
 '#settingsSheet #v811FineTune>summary{height:56px!important;min-height:56px!important;font-size:var(--axis-settings-ui)!important}'+
 '#settingsSheet .axis8122StandaloneStart{height:42px!important;border-radius:13px!important;font-size:14px!important}'+
 '#settingsSheet .axis8122ServiceNote{margin-top:10px!important;font-size:12px!important;line-height:1.55!important}'+
 '#settingsSheet .axis8122Facts{gap:8px!important}'+
 '#settingsSheet .axis8122Fact{min-height:64px!important;padding:12px 13px!important;border-radius:13px!important;gap:7px!important}'+
 '#settingsSheet .axis8122Fact span,#settingsSheet .axis8122Fact b{font-size:13px!important;line-height:1.35!important}'+
 '@media(max-width:360px){#settingsSheet .axis8122Grid{gap:7px!important}#settingsSheet .axis8122Grid button{font-size:13px!important}}';
 (D.head||D.documentElement).appendChild(s)
})();
try{window.__AXIS_8124_SETTINGS_DETAIL_SEAL__={version:'8.12.4',owner:'current-settings-detail-classes',foldHorizontalInset:0,segmentHeightPx:48,optionHeightPx:42,uiPx:15,reference:'v8710-sound',trainingOwner:false}}catch{}
`;
src=src.slice(0,end)+seal+'\n'+src.slice(end);

if(!src.includes('min-height:var(--axis-settings-option-h)!important'))fail('Learning min-height override missing');
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 settings/catalog polish seal] PASS · current 8.12.2 detail classes aligned · 42px Learning/Cloud options · zero nested fold inset');
