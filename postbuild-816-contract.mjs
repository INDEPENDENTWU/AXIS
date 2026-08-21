import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.16 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),html=read('index.html'),app=read('app.js'),media=read('v815-media-evidence.js'),css=read('axis-style.css');
if(contract.publicVersion!=='8.16'||contract.stableBaseVersion!=='8.16')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.16'||info.baseVersion!=='8.16')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['evolutionFoundation8131','evolutionObjects814','mediaEvidenceLayer815','coldStartHomeSemanticSeal8151','watermarkSinglePhotoCompositor8151','mediaEvidenceStableSection8151','mediaEvidenceRetainUntilReady8151','mediaEvidenceWarmBeforeCommit8151','mediaEvidenceNoOpacityBlink8151'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);

if((html.match(/data-axis-capture-surface="v816-capture-field"/g)||[]).length!==2)fail('Capture Field surface ownership missing/duplicated');
if((html.match(/data-axis-capture-owner="app\.js"/g)||[]).length!==1)fail('canonical capture owner drift');
for(const id of ['v816CaptureContext','v816CaptureMeta','v816CaptureMode','v816Shutter','v816CaptureDone','v816DraftRail'])if((html.match(new RegExp(`id="${id}"`,'g'))||[]).length!==1)fail(`Capture Field DOM #${id} missing/duplicated`);
if(!html.includes('id="photoInput"')||!html.includes('capture="environment" multiple'))fail('multi-photo fallback input missing');
for(const needle of ['CAPTURE816_PHOTO_MAX=12','CAPTURE816_VIDEO_MAX_MS=60000','capture816TakePhoto','capture816RunScan','capture816StartVideo','capture816StopVideo','capture816SetCover','capture816DraftSnapshot','__AXIS_816_CAPTURE_FIELD__'])if(!app.includes(needle)||!runtime.includes(needle))fail(`compiled Capture Field marker missing ${needle}`);
for(const needle of ["maxPhotos:12","maxVideoSeconds:60","audio:false","oneRecorder:true","persistenceOwner:'app.js'","mediaStore:'axis_v42_media'","newStorage:false"])if(!runtime.includes(needle))fail(`Capture ownership marker missing ${needle}`);
if((app.match(/new MediaRecorder\(/g)||[]).length<1)fail('MediaRecorder owner disappeared');
if(!app.includes("videoBitsPerSecond:2500000")||!app.includes('rec.start(1000)'))fail('bounded video recorder configuration missing');
const hardStop=/capture816StopTimer\s*=\s*setTimeout\(function\(\)\{toast\('已录满 60 秒'\);capture816StopVideo\(false\)\},CAPTURE816_VIDEO_MAX_MS\)/;
if(!hardStop.test(app)||!hardStop.test(runtime))fail('hard 60 second stop missing');
if(!app.includes("state.frames.splice(i,1)[0];state.frames.unshift(f)"))fail('cover reorder contract missing');
if(!app.includes('frameRefs:[]')||!app.includes('e.frameRefs.push(ref)')||!app.includes('e.clipRef=`V-${e.id}`'))fail('existing media event schema drift');
if(!app.includes("DB='axis_v42_media'"))fail('existing media store owner drift');
if((app.match(/indexedDB\.open\(/g)||[]).length!==1)fail('new IndexedDB owner introduced');
for(const forbidden of ['axis_v816_media','axis_816_media','axis_v816_capture'])if(app.includes(forbidden)||runtime.includes(forbidden))fail(`new media persistence introduced ${forbidden}`);
for(const needle of ['AXIS 8.16 Capture Field','.v816CaptureMode','.v816Shutter','.v816DraftRail','.v816CompareTools'])if(!css.includes(needle))fail(`8.16 static style missing ${needle}`);

for(const needle of ['__AXIS_816_COMPARATIVE_EVIDENCE__','arbitraryPair:true',"presets:['ends','recent','adjacent']",'compareCandidates','comparePair','compareSelect','data-v816-compare-side','data-v816-compare-preset','photoEncounters','stableSwapInherited:true'])if(!media.includes(needle)||!runtime.includes(needle))fail(`comparative evidence marker missing ${needle}`);
if(!media.includes('retainPreviousUntilReady:true')||!media.includes('warmBeforeCommit:true')||media.includes('.v815Evidence[data-loading="1"] .v815Stage{opacity:.72}'))fail('8.15.1 stable swap regressed');
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest'])if(media.includes(forbidden))fail(`comparative evidence acquired forbidden writer/network owner ${forbidden}`);
if(/<video[^>]*\sautoplay/i.test(media))fail('evidence autoplay survived');
for(const forbidden of ['评分','分数','进步','提升','改善','更好'])if(media.includes(forbidden))fail(`interpretive comparison copy survived ${forbidden}`);

info.gates=info.gates||{};Object.assign(info.gates,{captureField816:true,captureUnifiedEntry816:true,captureMultiPhoto816:true,capturePhotoCap816:true,captureCoverReorder816:true,captureVideo816:true,captureVideoLimit816:true,captureVideoSingleRecorder816:true,captureExistingMediaStore816:true,captureNoNewStorage816:true,captureQuickRecordUnified816:true,comparativeEvidence816:true,comparativeEvidenceArbitraryPair816:true,comparativeEvidencePresets816:true,comparativeEvidenceRailSelection816:true,comparativeEvidenceStableSwap816:true,comparativeEvidenceFactualOnly816:true,replayDeferred816:true});
info.axis816={release:true,scope:'capture-field-comparative-evidence',capture:{surface:'v816-capture-field',cameraOwner:'app.js',persistenceOwner:'app.js',mediaStore:'axis_v42_media',entryPoints:['capture-record','quick-record-supplement'],photo:{multi:true,maxPerEncounter:12,cover:'frameRefs[0]-reorder-no-schema'},video:{enabled:true,maxSeconds:60,maxPerEncounter:1,clipSchema:'clipRef',audio:false,autostop:true,bitrateTarget:2500000},scan:{preserved:true,usesExistingPreference:true,addsFramesToDraft:true},newStorage:false,newSchema:false},evidence:{owner:'v815-media-evidence',mode:'arbitrary-two-point',photoBearingEncounters:true,presets:['ends','recent','adjacent'],railSelectsActiveSide:true,stableInPlace:true,autoplay:false,factualOnly:true},ownership:{trainingState:false,newPersistence:false,newNetwork:false,newAi:false,newRecorderOwner:false,replay:false},next:{replay:'deferred-until-capture-density-and-selection-semantics-are-sealed'}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.16 contract] PASS · unified Capture Field · <=12 photos · one <=60s silent clip · existing app/IndexedDB ownership · arbitrary factual two-point evidence · Replay deferred');
