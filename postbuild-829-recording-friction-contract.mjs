import fs from 'node:fs';
const fail=m=>{throw Error('[AXIS 8.29 postbuild] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),css=read('axis-style.css');
if(!['8.29','8.30'].includes(info.version)||info.baseVersion!==info.version)fail('release identity '+info.version+'/'+info.baseVersion);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('runtime topology drift');
for(const gate of ['practiceLoop828','practiceLoopPureProjection828','realityRoute827','realityRouteExistingOwnersPreserved827'])if(info.gates?.[gate]!==true)fail('inherited capability missing '+gate);
for(const marker of ['__AXIS_829_RECORDING__','axis829Core.projectRecordingRecall','axis829CaptureDraft','axis829DecorateRecorder','axis829SaveInFlight','axis829PreviousValue','axis829RecordContext','data-axis829-reuse'])if(!runtime.includes(marker)&&!css.includes(marker))fail('recording runtime marker missing '+marker);
if((runtime.match(/state\.active\.events\.push\(/g)||[]).length!==1)fail('Encounter append ownership changed');
for(const pattern of ['axis_829_store','axis_recording_continuity','indexedDB.open(\'axis_829'])if(runtime.includes(pattern))fail('new 8.29 storage namespace '+pattern);
for(const forbidden of ['window.','document.','localStorage','indexedDB','fetch(','XMLHttpRequest','WebSocket','navigator.'])if(read('lib/axis-recording-continuity.mjs').includes(forbidden))fail('pure core platform dependency '+forbidden);
Object.assign(info.gates,{
 recordingContinuity829:true,
 recordingConfirmedPreviousOnly829:true,
 recordingDraftRerender829:true,
 recordingInFlightCommitGuard829:true,
 recordingCanonicalOwnerPreserved829:true,
 recordingNoNewStorage829:true
});
info.axis829={release:true,scope:'recording-friction-collapse',contract:'axis.recording-continuity.v1',pureOwner:'lib/axis-recording-continuity.mjs',facts:{previousIsSuggestion:true,currentRequiresExplicitSave:true},interaction:{draftRerenderSafe:true,oneInFlightSave:true},ownership:{newRecorder:false,newEncounterWriter:false,newActiveOwner:false,newSessionWriter:false,newStorage:false,network:false,ai:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
await import('./scripts/axis-829-recording-continuity-contract.mjs');
await import('./scripts/axis-829-governance-compat.mjs');
console.log('[AXIS 8.29 postbuild] PASS · derived compatible suggestions · in-sheet draft continuity · single in-flight canonical save · no second truth owner');
