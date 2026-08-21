import fs from 'node:fs';

const fail=msg=>{throw new Error(`[AXIS EdgeOne prebuilt] ${msg}`)};
const required=['index.html','axis-core.js','axis-style.css','axis-build.json'];
for(const file of required){if(!fs.existsSync(file))fail(`missing ${file}`);if(fs.statSync(file).size<=0)fail(`empty ${file}`)}
const manifest=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
if(manifest.version!=='8.14'||manifest.baseVersion!=='8.14')fail(`release drift ${manifest.version}/${manifest.baseVersion}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture drift ${manifest.architecture}`);
if(manifest.requests?.initialJavascript!==1||manifest.requests?.dynamicJavascript!==0)fail(`javascript topology drift ${manifest.requests?.initialJavascript}/${manifest.requests?.dynamicJavascript}`);
for(const gate of ['canonicalSingleRuntime','personalEquipmentPhotos8123','groupPlanStableLauncher8123','trainingIntervalUnion8124','quickRecordDirectRecent8124','liveRouteActionDelegate8124','settingsVerticalNative8124','trendsTimeField813','trendsSessionFingerprint813','trendsHorizontalScrub813','trendsEdgeSafe813','trendsReducedMotion813','trendsReadOnly813','evolutionFoundation8131','trendsStateLifecycle8131','trendsFactualCopy8131','trendsSameDaySessions8131','trendsMetaActivity8131','trendsNavigationRefresh8131','trendsTruthfulDuration8131','evolutionObjects814','evolutionObjectFirstLatest814','evolutionObjectEncounterCount814','evolutionObjectFactualDelta814','evolutionObjectMediaEvidence814','evolutionObjectReadOnly814','evolutionObjectNoNetwork814','evolutionObjectInPlace814'])if(manifest.gates?.[gate]!==true)fail(`release gate missing ${gate}`);
if(manifest.axis814?.trends?.objectOwner!=='v814-evolution-objects'||manifest.axis814?.ownership?.persistence!==false||manifest.axis814?.ownership?.network!==false||manifest.axis814?.ownership?.ai!==false)fail('8.14 Evolution Object ownership drift');
console.log('[AXIS EdgeOne prebuilt] verified exact AXIS 8.14 canonical Evolution Objects artifact; EdgeOne publishes the already-verified runtime without product rebuild');
