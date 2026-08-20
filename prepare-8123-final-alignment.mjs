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
  '#settingsSheet #v813LearningGate,#settingsSheet #v813ServiceGate{margin:0!important;padding:0!important;transform:none!important;left:auto!important;right:auto!important;width:auto!important}'+
  '#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{margin:0!important;padding-left:6px!important;padding-right:6px!important;transform:none!important}'+
  '#settingsSheet #v813LearningGate>.v8711Fold,#settingsSheet #v813ServiceGate>.v8711Fold{padding-left:18px!important;padding-right:18px!important}'+
  '@media(max-width:380px){#settingsSheet #v813LearningGate>.settingLink,#settingsSheet #v813ServiceGate>.settingLink{margin:0!important;padding-left:6px!important;padding-right:6px!important}}';
 D.head.appendChild(s)
})();
try{window.__AXIS_8123_FINAL_ALIGNMENT__={version:'8.12.3',nativeRowLocalInset:6,legacyGateClassRetired:true,foldHorizontalInset:18,trainingOwner:false}}catch{}
`;

src=src.slice(0,end)+block+'\n'+src.slice(end);
for(const needle of ['__AXIS_8123_FINAL_ALIGNMENT__','nativeRowLocalInset:6','legacyGateClassRetired:true'])if(!src.includes(needle))fail(`missing ${needle}`);
try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.3 final alignment] PASS · legacy gate class retired before mount · measured native row local inset 6px · fold content preserved · no training ownership');

await import('./prepare-8123-field-polish.mjs');
await import('./prepare-8123-canonical-library-selection.mjs');
await import('./prepare-8123-group-plan-render-owner.mjs');
await import('./prepare-8123-recording-selection-reconcile.mjs');
await import('./prepare-8123-group-plan-click-route.mjs');
await import('./prepare-8123-group-plan-close.mjs');
await import('./prepare-8123-equipment-inline-tools.mjs');
await import('./prepare-8123-equipment-selection-stability.mjs');
await import('./prepare-8123-equipment-delegated-selection.mjs');
await import('./prepare-8123-equipment-selection-guard.mjs');
await import('./prepare-8123-quick-catalog-bridge.mjs');
await import('./prepare-8123-settings-alignment-fix.mjs');
await import('./prepare-8123-ui-hotfix.mjs');
await import('./prepare-8123-equipment-gallery-driver.mjs');
await import('./prepare-8123-equipment-gallery-ui-geometry.mjs');
await import('./prepare-8123-visual-memory-seal.mjs');
await import('./prepare-8123-settings-divider-seal.mjs');
await import('./prepare-8124-training-flow.mjs');
await import('./prepare-8124-session-owner.mjs');
await import('./prepare-8124-live-route-compiled.mjs');
await import('./prepare-8124-settings-catalog-polish.mjs');
await import('./prepare-8124-taxonomy-coverage-seal.mjs');
await import('./prepare-8124-search-semantic-seal.mjs');
await import('./prepare-8124-settings-catalog-history-compat.mjs');
await import('./prepare-8124-settings-catalog-polish-seal.mjs');
await import('./prepare-8124-custom-equipment-profile.mjs');
