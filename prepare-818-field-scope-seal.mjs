import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.18 field scope seal] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');
const startNeedle='function axis818ApplyScanSeconds(sec){';
const marker="try{window.__AXIS_818_FIELD_POLISH__={version:'8.18',cameraFlip:'stable-canvas-source-swap',midRecordFlip:true,exclusiveCameraFallback:'hold-last-frame',scanSeconds:[3,5],scanTouchOwner:'axis818-final',videoPseudoSetting:false,freshness:'xhr-fail-open'}}catch{}";
const start=s.indexOf(startNeedle);if(start<0)fail('field binding block missing');
if(s.indexOf(startNeedle,start+1)>=0)fail('field binding block duplicated');
const markerAt=s.indexOf(marker,start);if(markerAt<0)fail('field polish marker missing after binding block');
let end=markerAt+marker.length;while(s[end]==='\n'||s[end]==='\r')end++;
const block=s.slice(start,end);
s=s.slice(0,start)+s.slice(end);
const rootClose=s.indexOf('})();');if(rootClose<0)fail('canonical app IIFE close missing');
if(rootClose<=s.indexOf("let state={"))fail('canonical app scope boundary invalid');
s=s.slice(0,rootClose)+'\n'+block+'\n'+s.slice(rootClose);
const relocated=s.indexOf(startNeedle);const canonicalClose=s.indexOf('})();');
if(relocated<0||relocated>=canonicalClose)fail('field bindings did not land inside canonical app scope');
if(!s.slice(0,relocated).includes("let state={"))fail('state owner is not visible before field bindings');
if((s.match(/__AXIS_818_FIELD_POLISH__/g)||[]).length!==1)fail('field polish marker is not singular');
try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.18 field scope seal] PASS · final 3/5 + camera control bindings anchored before canonical app IIFE close');
