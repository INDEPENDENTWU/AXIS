import fs from 'node:fs';

const INHERITED_VERSION='8.8.2';
const fail=m=>{throw new Error(`AXIS inherited 8.8.2 artifact gate: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const runtime=read('axis-core.js'),css=read('axis-style.css'),html=read('index.html'),manifest=JSON.parse(read('axis-build.json')),contract=JSON.parse(read('release-contract.json'));
const CURRENT_VERSION=String(contract.publicVersion||'');
const STABLE_BASE=String(contract.stableBaseVersion||CURRENT_VERSION);
const sessionDurationExtension=CURRENT_VERSION==='8.10.3';
const reminderCall=/renderTimeline\(\)\s*;\s*reminderTick\(\)/g;
const reminderContexts=()=>[...runtime.matchAll(reminderCall)].map((m,i)=>{const at=m.index||0,start=Math.max(0,at-520),end=Math.min(runtime.length,at+520);return `#${i+1} @${at}\n${runtime.slice(start,end)}`});

if(!CURRENT_VERSION||manifest.version!==CURRENT_VERSION||manifest.baseVersion!==STABLE_BASE)fail(`release identity mismatch ${manifest.version}/${manifest.baseVersion} · contract ${CURRENT_VERSION}/${STABLE_BASE}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture ${manifest.architecture}`);
if(!html.includes('id="axisNowHero"')||!runtime.includes('function deriveHomeState(')||!runtime.includes('window.__AXIS_HOME_STATE__=x'))fail('single home-state model missing');
if(!runtime.includes('function visualSigFromCanvas(')||!runtime.includes('function localVisualDistance(')||!runtime.includes('function memoryGuess(')||!runtime.includes('function learnMemory('))fail('local personal visual memory missing');
if(!runtime.includes('v882QuickMine')||!runtime.includes('v882QuickMedia')||!runtime.includes('window.__AXIS_CAPTURE__')||!runtime.includes('beginQuickMedia'))fail('quick custom/media contract missing');
if(!runtime.includes("label:'腰'")||!runtime.includes("['back-extension','45°罗马椅背伸'")||!runtime.includes("['nordic-curl','北欧腿弯举'"))fail('expanded movement / waist anatomy contract missing');
const forbiddenSonic=sessionDurationExtension?/sets>old\.sets\)cue\('set'\)|status==='finished'.*cue\('item'\)|cue\('rest'\)/:/sets>old\.sets\)cue\('set'\)|status==='finished'.*cue\('item'\)|cue\('rest'\)|cue\('session'\)/;
if(forbiddenSonic.test(runtime))fail('forbidden non-countdown automatic sonic cue survived');
if(sessionDurationExtension&&!runtime.includes("automaticKinds:['item','session']"))fail('8.10.3 duration extension is not owned by canonical v8710');
if(!runtime.includes("const due=Math.max(60000,Number(a.estimateMs)||0)")||!runtime.includes("elapsed(a)>=due&&!D.querySelector('#v87Hold.show')"))fail('countdown-zero / long-press sound contract missing');
if(!/async function reminderTick\(\)\s*\{\s*return false\s*\}/.test(runtime))fail('v87 reminderTick is not a no-op in canonical runtime');
const calls=reminderContexts();if(calls.length){console.error('[AXIS inherited 8.8.2 reminder call contexts]\n'+calls.join('\n---\n'));fail(`v87 reminder polling call survived canonical runtime · ${calls.length} occurrence(s)`)}
if(!runtime.includes("add.style.visibility=planDone?'visible':'hidden'")||!css.includes('#v87Now .v87Actions{display:grid!important;grid-template-columns:96px minmax(0,1fr) 68px!important'))fail('active-card stable geometry contract missing');
if(!css.includes('#axisNowHero{--axis-now-accent')||!css.includes('.axisNowDial'))fail('home visual system missing');
if(!runtime.includes("AXIS_MEDIA_FORMAT='axis-media-arraybuffer-v1'")||!runtime.includes('window.__AXIS_MEDIA_STORE__={get:getMedia,put:putMedia'))fail('canonical WebKit-safe media store missing');
const mediaDbOwners=(runtime.match(/indexedDB\.open\(DB,1\)/g)||[]).length;if(mediaDbOwners!==1)fail(`media IndexedDB ownership is not singular · ${mediaDbOwners}`);
if(!runtime.includes("new Blob([v.bytes],{type:v.type||'application/octet-stream'})"))fail('legacy-compatible media decode contract missing');
if(!fs.existsSync('docs/releases/8.8.2.md'))fail('durable 8.8.2 release log missing');
if(!html.includes(`canonical-${CURRENT_VERSION}`))fail(`HTML canonical version marker missing · ${CURRENT_VERSION}`);

manifest.gates=manifest.gates||{};
Object.assign(manifest.gates,{
  homeStateSingleOwner:true,
  homeStateAdaptiveRest:true,
  localVisualMemory:true,
  quickCustomEquipment:true,
  quickMediaAttachment:true,
  activeCardGeometryStable:true,
  countdownOnlyAutomaticSound:true,
  expandedExerciseLibrary:true,
  waistAnatomyRegion:true,
  durableReleaseLog:true,
  mediaStoreWebKitSafe:true
});
manifest.canonical=manifest.canonical||{};
manifest.canonical.inheritedMinorReleases=[...new Set([...(manifest.canonical.inheritedMinorReleases||[]),INHERITED_VERSION])];
manifest.canonical.homeState={owner:'app.js',surface:'#axisNowHero',modes:['ready','recovery','active','rest','warn','danger','paused','between','session'],tickMs:1000};
manifest.canonical.localVisualMemory={owner:'app.js',networkRequired:false,signatures:['full-dhash','center-dhash','4x4-luma-zones'],samplesPerEquipment:16,semanticUnseenRecognition:false};
manifest.canonical.quickRecord={owner:'v61.js',customItems:true,mediaBridge:'window.__AXIS_CAPTURE__',mediaModes:['photo','3','5'],mediaPersistenceOwner:'app.js'};
manifest.canonical.sound=sessionDurationExtension?{owner:'v8710-sound-ui.js',automaticTrigger:'active-item-countdown-zero + explicit-workout-duration-threshold',manualPreview:true,setCue:false,manualFinishCue:false,restCue:false,sessionCue:true,v87AutomaticReminder:false,longPressSuppressed:true}:{owner:'v8710-sound-ui.js',automaticTrigger:'active-item-countdown-zero-only',manualPreview:true,setCue:false,manualFinishCue:false,restCue:false,sessionCue:false,v87AutomaticReminder:false,longPressSuppressed:true};
manifest.canonical.activeCard={owner:'v87',outerGeometryStable:true,actionColumns:[96,'1fr',68],setCompletionRebuild:false};
manifest.canonical.exerciseLibrary={owner:'v873-exercise-library.js',waistRegionOwner:'v874-professional.js',newCanonicalMuscles:['腰部','前臂','内收肌','髋屈肌','胫骨前肌','前锯肌']};
manifest.canonical.mediaStore={owner:'app.js',database:'axis_v42_media',store:'media',writeFormat:'arraybuffer-v1',legacyBlobRead:true,delegates:['v877-runtime.js','v8710-watermark.js'],webkitSafe:true};
fs.writeFileSync('axis-build.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`[AXIS inherited 8.8.2] PASS inside ${CURRENT_VERSION} · home · local memory · quick media · library · immutable geometry · v8710-only automatic sound · WebKit-safe media store · release log`);
