import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.17 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),html=read('index.html'),app=read('app.js'),v61=read('v61.js'),media=read('v815-media-evidence.js'),css=read('axis-style.css');
if(contract.publicVersion!=='8.17'||contract.stableBaseVersion!=='8.17')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.17'||info.baseVersion!=='8.17')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['captureField816','captureUnifiedEntry816','captureMultiPhoto816','captureVideo816','captureVideoLimit816','captureExistingMediaStore816','comparativeEvidence816','comparativeEvidenceArbitraryPair816','comparativeEvidenceStableSwap816','mediaEvidenceWarmBeforeCommit8151','mediaEvidenceNoOpacityBlink8151'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);

for(const src of [v61,runtime]){
 if(!src.includes('v817QuickEvidence'))fail('single Quick Evidence surface missing');
 if(!src.includes('补拍照片 / 视频'))fail('current Quick Evidence copy missing');
 if(src.includes('>3秒视频<')||src.includes('>5秒视频<'))fail('legacy Quick video-duration entries survived');
 if(!src.includes("beginQuickMedia?.('photo',eq.id)"))fail('Quick Evidence does not delegate into canonical Capture Field');
}
if(!app.includes("$('#scanBtn').onclick=()=>openCanonicalCamera('photo',null,false);"))fail('main Capture does not default to photo');
if(!runtime.includes("openCanonicalCamera('photo',null,false)"))fail('compiled main Capture photo default missing');
if(!app.includes('if(state.clip?.blob)')||!runtime.includes('if(state.clip?.blob)'))fail('explicit video retention contract missing');
for(const old of ['if(state.prefs.keepClip&&state.clip?.blob)','if((state.prefs.keepClip||state.forceClip)&&state.clip?.blob)'])if(app.includes(old)||runtime.includes(old))fail(`legacy video save gate survived ${old}`);

const fieldPolish818=app.includes('__AXIS_818_FIELD_POLISH__')||runtime.includes('__AXIS_818_FIELD_POLISH__');
for(const needle of ['扫描取样','资料与收纳','记录整理'])if(!html.includes(needle))fail(`current Settings/archive copy missing ${needle}`);
if(fieldPolish818){
 if(html.includes('class="settingPlain v817CaptureInfo"')||html.includes('<span>拍摄视频</span>')||html.includes('最长60秒 · 自动保存'))fail('8.18 retired video pseudo-setting remained visible');
 if((html.match(/id="keepClipSwitch"/g)||[]).length!==1||!/<button[^>]*id="keepClipSwitch"[^>]*hidden/.test(html))fail('8.18 hidden keepClip compatibility hook missing');
}else{
 for(const needle of ['拍摄视频','最长60秒 · 自动保存'])if(!html.includes(needle))fail(`current Settings/archive copy missing ${needle}`);
 if(!html.includes('id="keepClipSwitch" role="switch" hidden'))fail('legacy keepClip compatibility hook is not visually retired');
}
if(html.includes('<span>默认扫描</span>')||html.includes('<span>保留现场视频</span>'))fail('obsolete Capture preference labels survived');
if((html.match(/id="scanSeconds"/g)||[]).length!==1)fail('Scan sampling preference duplicated');
if((html.match(/data-sec="3"/g)||[]).length<1||(html.match(/data-sec="5"/g)||[]).length<1)fail('Scan sampling duration choices missing');

for(const src of [app,runtime])for(const needle of ['v817ArchiveGroup','<details class="v817ArchiveGroup"','gi===0'])if(!src.includes(needle))fail(`time-first archive missing ${needle}`);
if(!css.includes('.v817ArchiveGroup'))fail('archive static style missing');

for(const src of [media,runtime]){
 for(const needle of ['__AXIS_817_INTERACTION__',"compareModel:'two-named-slots'","defaultActiveSlot:'right'",'timelineDirectReplace:true','stableControls:true','warmBeforeCommit:true','v817CompareBar','v817CompareSlots','>起点<','>对照<','dataset.v817Pair'])if(!src.includes(needle))fail(`two-slot comparison missing ${needle}`);
 if(src.includes('.v815Evidence[data-loading="1"] .v815Stage{opacity:.72}'))fail('Evidence opacity flash regression returned');
}
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest'])if(media.includes(forbidden))fail(`Media Evidence acquired forbidden writer/network owner ${forbidden}`);
if(!css.includes('.v817CompareBar')||!css.includes('.v817CompareSlots')||!css.includes('[data-v817-pair="a"]'))fail('two-slot comparison static style missing');

info.gates=info.gates||{};Object.assign(info.gates,{quickEvidenceSingleEntry817:true,capturePreferencesCurrent817:true,captureEntryDefaultsPhoto817:true,explicitVideoRetained817:true,comparativeTwoSlot817:true,comparativeDirectTimeline817:true,comparativeStableControls817:true,comparativeNoFlash817:true,archiveMonthCollection817:true,archiveNoNewStorage817:true,interactionConvergence817:true,videoPseudoSettingRetired818:fieldPolish818});
info.axis817={release:true,scope:'interaction-convergence',capture:{quickSupplement:'single-entry',defaultMode:'photo',scanSampling:[3,5],video:{maxSeconds:60,explicitAlwaysRetained:true,settingsPseudoRow:fieldPolish818?'retired-in-8.18':'legacy-hidden-control'},owner:'app.js',mediaStore:'axis_v42_media'},evidence:{owner:'v815-media-evidence',compareModel:'two-named-slots',slots:['start','compare'],defaultActiveSlot:'right',timelineDirectReplace:true,stableControls:true,warmBeforeCommit:true,autoplay:false,factualOnly:true},archive:{model:'time-first-month-groups',newestOpen:true,olderCollapsed:true,newStorage:false},ownership:{trainingState:false,newPersistence:false,newNetwork:false,newAi:false,newRecorderOwner:false,replay:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log(`[AXIS 8.17 contract] PASS · one Quick evidence entry · current Capture preferences · ${fieldPolish818?'8.18 video pseudo-setting retired':'legacy video info retained'} · direct two-slot compare · time-first archive · no new owners`);
await import('./postbuild-8171-source-first-media-contract.mjs');
