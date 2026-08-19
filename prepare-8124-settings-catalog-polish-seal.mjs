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
 "#v813LearningGate .v811CoreOptions button{height:var(--axis-settings-option-h)!important;border-radius:var(--axis-settings-radius)!important;padding:0 10px!important;font-size:var(--axis-settings-ui)!important;font-weight:630!important;line-height:1!important}",
 'Learning option native height');

src=once(src,
 "foldHorizontalInset:0,uiPx:15,controlHeightPx:48,blockYPx:16,reference:'sound-watermark'",
 "foldHorizontalInset:0,uiPx:15,segmentHeightPx:48,optionHeightPx:42,blockYPx:16,reference:'sound-watermark'",
 'Settings geometry marker semantics');

try{new Function(src)}catch(e){fail(`runtime syntax ${e.message}`)}
fs.writeFileSync(FILE,src);
console.log('[AXIS 8.12.4 settings/catalog polish seal] PASS · 48px segmented frame · 42px option touch geometry · zero nested fold inset');
