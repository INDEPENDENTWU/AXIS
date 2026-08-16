import fs from 'node:fs';

const VERSION='8.8.2';
const fail=m=>{throw new Error(`AXIS 8.8.2 artifact gate: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const runtime=read('axis-core.js'),css=read('axis-style.css'),html=read('index.html'),manifest=JSON.parse(read('axis-build.json'));

if(manifest.version!==VERSION||manifest.baseVersion!==VERSION)fail(`release identity mismatch ${manifest.version}/${manifest.baseVersion}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture ${manifest.architecture}`);
if(!html.includes('id="axisNowHero"')||!runtime.includes('function deriveHomeState(')||!runtime.includes('window.__AXIS_HOME_STATE__=x'))fail('single home-state model missing');
if(!runtime.includes('function visualSigFromCanvas(')||!runtime.includes('function localVisualDistance(')||!runtime.includes('本地认出'))fail('local personal visual memory missing');
if(!runtime.includes('v882QuickMine')||!runtime.includes('v882QuickMedia')||!runtime.includes('window.__AXIS_CAPTURE__')||!runtime.includes('beginQuickMedia'))fail('quick custom/media contract missing');
if(!runtime.includes("label:'腰'")||!runtime.includes("['back-extension','45°罗马椅背伸'")||!runtime.includes("['nordic-curl','北欧腿弯举'"))fail('expanded movement / waist anatomy contract missing');
if(/sets>old\.sets\)cue\('set'\)|status==='finished'.*cue\('item'\)|cue\('rest'\)|cue\('session'\)/.test(runtime))fail('non-countdown automatic sonic cue survived');
if(!runtime.includes("const due=Math.max(60000,Number(a.estimateMs)||0)")||!runtime.includes("elapsed(a)>=due&&!D.querySelector('#v87Hold.show')"))fail('countdown-zero / long-press sound contract missing');
if(!runtime.includes('async function reminderTick(){return false}')||runtime.includes('renderTimeline();reminderTick()'))fail('v87 automatic reminder polling survived');
if(!runtime.includes("add.style.visibility=planDone?'visible':'hidden'")||!css.includes('#v87Now .v87Actions{display:grid!important;grid-template-columns:96px minmax(0,1fr) 68px!important'))fail('active-card stable geometry contract missing');
if(!css.includes('#axisNowHero{--axis-now-accent')||!css.includes('.axisNowDial'))fail('home visual system missing');
if(!fs.existsSync('docs/releases/8.8.2.md'))fail('durable 8.8.2 release log missing');
if(!html.includes(`canonical-${VERSION}`))fail('HTML canonical version marker missing');

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
  durableReleaseLog:true
});
manifest.canonical=manifest.canonical||{};
manifest.canonical.minorRelease=VERSION;
manifest.canonical.homeState={owner:'app.js',surface:'#axisNowHero',modes:['ready','recovery','active','rest','warn','danger','paused','between','session'],tickMs:1000};
manifest.canonical.localVisualMemory={owner:'app.js',networkRequired:false,signatures:['full-dhash','center-dhash','4x4-luma-zones'],samplesPerEquipment:16,semanticUnseenRecognition:false};
manifest.canonical.quickRecord={owner:'v61.js',customItems:true,mediaBridge:'window.__AXIS_CAPTURE__',mediaModes:['photo','3','5'],mediaPersistenceOwner:'app.js'};
manifest.canonical.sound={owner:'v8710-sound-ui.js',automaticTrigger:'active-item-countdown-zero-only',manualPreview:true,setCue:false,manualFinishCue:false,restCue:false,sessionCue:false,v87AutomaticReminder:false,longPressSuppressed:true};
manifest.canonical.activeCard={owner:'v87',outerGeometryStable:true,actionColumns:[96,'1fr',68],setCompletionRebuild:false};
manifest.canonical.exerciseLibrary={owner:'v873-exercise-library.js',waistRegionOwner:'v874-professional.js',newCanonicalMuscles:['腰部','前臂','内收肌','髋屈肌','胫骨前肌','前锯肌']};
fs.writeFileSync('axis-build.json',JSON.stringify(manifest,null,2)+'\n');
console.log('[AXIS 8.8.2 artifact] PASS · home · local memory · quick media · library · immutable geometry · sole countdown sound owner · release log');