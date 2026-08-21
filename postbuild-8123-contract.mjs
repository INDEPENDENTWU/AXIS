import fs from 'node:fs';
const fail=m=>{throw new Error(`[AXIS 8.12.3 contract] ${m}`)},read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js');
if(contract.publicVersion!=='8.12.3'||contract.stableBaseVersion!=='8.12.3')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.12.3'||info.baseVersion!=='8.12.3')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const needle of ['__AXIS_8123_LEARNING__','axis8101MountPractice=axis8123MountPractice','settingsMethod:false','listenOriginal:true','localRecording:true','localPlayback:true','shadow:false','ab:false'])if(!runtime.includes(needle))fail(`runtime missing ${needle}`);
for(const gate of ['groupPlanUsesRecordingOwner','languageStudio812','liveRouteReadOnly813'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);
info.gates=info.gates||{};Object.assign(info.gates,{settingsNativeAlignment8123:true,settingsHelperCopyRetired8123:true,learningSettingsMethodRetired8123:true,learningShadowUiRetired8123:true,learningSimpleAudio8123:true,learningLocalRecording8123:true,learningNoUpload8123:true,learningNoTrainingOwner8123:true});
info.axis8123={release:true,scope:'learning-ui-simplification',settings:{nativeRowAlignment:true,methodSelector:false,helperCopy:false,visibleCore:['purpose','intensity','level','dialogueDepth']},practice:{surface:['listen-original','record-local','playback-local'],modeSelector:false,echo:false,shadow:false,ab:false,autoplay:false,upload:false,persistence:'memory-only'},ownership:{learningStore:'axis_v89_speak',trainingState:false,recordingState:false,serviceStoreUnchanged:true}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.12.3 contract] PASS · native Settings alignment · method/shadow/A-B retired · listen/record/replay only · training ownership unchanged');

await import('./postbuild-8123-field-polish.mjs');
await import('./postbuild-8124-contract.mjs');
await import('./postbuild-8131-evolution-contract.mjs');
await import('./postbuild-814-evolution-contract.mjs');
await import('./postbuild-815-media-evidence-contract.mjs');
await import('./postbuild-8151-regression-contract.mjs');
