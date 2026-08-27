import fs from 'node:fs';

const FILE='app.js';
const fail=m=>{throw new Error(`[AXIS 8.21 Flow Active boot scope] ${m}`)};
let s=fs.readFileSync(FILE,'utf8');

/*
 * Flow Active convergence must subscribe from inside the canonical app IIFE.
 * The first convergence pass intentionally reused app-local state/functions, but
 * its two lifecycle listeners were appended after the IIFE. `D` is app-local,
 * so that placement produced a real Production cold-boot ReferenceError before
 * the callbacks could ever run. Move the exact listeners back under the app
 * owner rather than exporting private state or creating a second lifecycle owner.
 */
const leaked=`\nD.addEventListener('click',e=>{const sheet=$('#scanSheet');if(e.target.closest?.('[data-close="scanSheet"]')||e.target===sheet){axis821FlowRecordingIntent=null;axis821FlowRecorderContextClear()}},true);\nwindow.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished(e?.detail?.id));\n`;
const hits=s.split(leaked).length-1;
if(hits!==1)fail(`expected one leaked listener block, found ${hits}`);
s=s.replace(leaked,'\n');

const marker=';try{window.__AXIS_821_FLOW_ACTIVE_CONVERGENCE__=';
const markerAt=s.indexOf(marker);
if(markerAt<0)fail('Flow Active convergence marker missing');
const closeAt=s.lastIndexOf('})();',markerAt);
if(closeAt<0)fail('canonical app IIFE close missing before Flow marker');

const scoped=`\nD.addEventListener('click',e=>{const sheet=$('#scanSheet');if(e.target.closest?.('[data-close="scanSheet"]')||e.target===sheet){axis821FlowRecordingIntent=null;axis821FlowRecorderContextClear()}},true);\nwindow.addEventListener('axis:active-finished',e=>axis821FlowOnActiveFinished(e?.detail?.id));\n`;
s=s.slice(0,closeAt)+scoped+s.slice(closeAt);

const flag='flowEmbeddedInActiveHome:true';
if((s.split(flag).length-1)!==1)fail('Flow convergence marker shape drift');
s=s.replace(flag,'flowEmbeddedInActiveHome:true,bootScopedListeners:true');

const listenerAt=s.indexOf("D.addEventListener('click',e=>{const sheet=$('#scanSheet')");
const newMarkerAt=s.indexOf(marker);
if(listenerAt<0||listenerAt>newMarkerAt)fail('Flow listeners are not inside canonical app scope');
if(s.slice(newMarkerAt).includes("D.addEventListener('click',e=>{const sheet=$('#scanSheet')"))fail('Flow listener still survives outside app scope');
if((s.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership drift');

try{new Function(s)}catch(e){fail(`app syntax ${e.message}`)}
fs.writeFileSync(FILE,s);
console.log('[AXIS 8.21 Flow Active boot scope] PASS · Flow close/finish listeners moved inside canonical app IIFE · no private app state exported · one Encounter append retained');
