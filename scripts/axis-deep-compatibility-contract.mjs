import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS Deep Compatibility contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const core=read('axis-core.js');

if(info.version!=='8.18'||info.baseVersion!=='8.18')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');

const gates=[
  'groupPlanUsesRecordingOwner','languageStudio812','liveRouteReadOnly813',
  'personalEquipmentLibrary8123','personalEquipmentPhotos8123','personalEquipmentVisualMemory8123','personalEquipmentSwipeRemove8123','personalEquipmentBatchRemove8123','personalEquipmentHistoryPreserved8123','groupPlanStableLauncher8123','groupPlanRenderOwnedSync8123','settingsRowAlignmentFieldPolish8123',
  'settingsNativeAlignment8123','settingsHelperCopyRetired8123','learningSettingsMethodRetired8123','learningShadowUiRetired8123','learningSimpleAudio8123','learningLocalRecording8123','learningNoUpload8123','learningNoTrainingOwner8123',
  'trainingIntervalUnion8124','projectGapLatestActivity8124','sessionActivitySeal8124','quickRecordDirectRecent8124','settingsVerticalNative8124',
  'trendsTimeField813','trendsSessionFingerprint813','trendsHorizontalScrub813','trendsEdgeSafe813','trendsReducedMotion813','trendsReadOnly813',
  'evolutionFoundation8131','trendsStateLifecycle8131','trendsFactualCopy8131','trendsSameDaySessions8131','trendsMetaActivity8131','trendsNavigationRefresh8131','trendsTruthfulDuration8131'
];
for(const gate of gates)if(info.gates?.[gate]!==true)fail(`missing compatibility gate ${gate}`);

for(const marker of [
  '__AXIS_8121_HOTFIX__','v8121PlanButton','__AXIS_8122_SETTINGS__',
  '__AXIS_8123_EQUIPMENT_MEMORY__','__AXIS_GROUP_PLAN_STABLE__','v8123FieldPolishStyle','__AXIS_8123_UI_HOTFIX__','__AXIS_8123_EQUIPMENT_GALLERY__','__AXIS_8123_EQUIPMENT_GALLERY_UI_GEOMETRY__','__AXIS_8123_PICKER_ROUTER__','__AXIS_8123_QUICK_PICKER_FIX__','__AXIS_8123_SETTINGS_SURFACE__','__AXIS_8123_DIVIDER_SEAL__','__AXIS_8123_LEARNING__',
  '__AXIS_8124_WORKOUT_OWNER__','__AXIS_8124_CATALOG_POLISH__','__AXIS_8124_CUSTOM_SAFE__','__AXIS_8125_SMART_CREATE_POLISH__','__AXIS_8131_EVOLUTION_FIELD__','__AXIS_EVOLUTION__','v8131-evolution-field','axis:state-changed'
])if(!core.includes(marker))fail(`compiled compatibility owner missing ${marker}`);

for(const key of ['axis_v60_state','axis_v8_meta','axis_v89_speak','axis_v42_media'])if(!core.includes(key))fail(`historical storage contract missing ${key}`);

for(const script of [
  'scripts/axis-reminder-layout-smoke.mjs','scripts/axis-882-home-transition-smoke.mjs','scripts/axis-882-completion-camera-smoke.mjs',
  'scripts/axis-89-smoke.mjs','scripts/axis-891-smoke.mjs','scripts/axis-810-smoke.mjs','scripts/axis-8101-smoke.mjs','scripts/axis-8102-smoke.mjs','scripts/axis-8103-smoke.mjs',
  'scripts/axis-812-field-hardening-smoke.mjs','scripts/axis-8121-hotfix-smoke.mjs','scripts/axis-8122-settings-smoke.mjs',
  'scripts/axis-8123-field-polish-smoke.mjs','scripts/axis-8123-ui-hotfix-smoke.mjs','scripts/axis-8123-equipment-gallery-picker-smoke.mjs','scripts/axis-8123-equipment-gallery-ui-geometry-smoke.mjs','scripts/axis-8123-learning-simplify-smoke.mjs',
  'scripts/axis-8124-flow-smoke.mjs','scripts/axis-8124-catalog-polish-smoke.mjs','scripts/axis-8125-smart-create-polish-smoke.mjs',
  'scripts/prepare-release-test-contract.mjs','prepare-8123-ci-stability.mjs'
])if(!fs.existsSync(script))fail(`Deep Compatibility dependency missing ${script}`);

console.log('[AXIS Deep Compatibility contract] PASS · legacy storage keys + Group Plan + Personal Equipment + Settings + Learning + 8.12.4/8.12.5 factual owners preserved in current canonical artifact');
