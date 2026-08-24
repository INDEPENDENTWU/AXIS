import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS Runtime Foundation contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const core=read('axis-core.js');

if(info.version!=='8.18'||info.baseVersion!=='8.18')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');

for(const gate of [
  'liveRoute813','liveRouteSingleOwner813','liveRouteReadOnly813','liveRoutePureRuntime813','liveRouteFallback813','liveRouteNoRecordingOwner813','liveRouteCanonicalSingleRuntime813',
  'learningSettingsPurpose812','learningSettingsMethod812','learningSettingsNovelty812','serviceSettingsConverged811','serviceSettingsUserInvokedNetwork811','serviceSettingsNoTrainingOwner811'
])if(info.gates?.[gate]!==true)fail(`missing gate ${gate}`);

if(info.axis813?.stage3?.recordingOwner!==false||info.axis813?.stage3?.storageOwner!==false)fail('Live Route acquired recording/storage ownership');
for(const marker of ['__AXIS_813_SETTINGS__','canonical-settings-inline'])if(!core.includes(marker))fail(`Settings convergence marker missing ${marker}`);

for(const script of [
  'scripts/axis-813-runtime-core.mjs',
  'scripts/axis-813-shadow-runtime.mjs',
  'scripts/axis-813-build-parity.mjs',
  'scripts/axis-813-shadow-browser.mjs',
  'scripts/axis-813-live-route-ci-diagnostic.mjs',
  'scripts/axis-813-settings-convergence-smoke.mjs',
  'prepare-8123-ci-stability.mjs'
])if(!fs.existsSync(script))fail(`Runtime Foundation dependency missing ${script}`);

const stability=read('prepare-8123-ci-stability.mjs');
if(!stability.includes("const f='scripts/axis-813-shadow-browser.mjs'"))fail('Shadow browser compatibility test convergence missing');
for(const productArtifact of ['axis-core.js','index.html','axis-style.css'])if(stability.includes(`const f='${productArtifact}'`))fail(`CI stability preparer must not mutate product artifact ${productArtifact}`);

console.log('[AXIS Runtime Foundation contract] PASS · pure Runtime + Shadow + exact-base parity + Live Route + inline Settings responsibilities preserved · test-only shadow compatibility convergence');
