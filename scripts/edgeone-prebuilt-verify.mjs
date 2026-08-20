import fs from 'node:fs';

const fail=msg=>{throw new Error(`[AXIS EdgeOne prebuilt] ${msg}`)};
const required=['index.html','axis-core.js','axis-style.css','axis-build.json'];
for(const file of required){if(!fs.existsSync(file))fail(`missing ${file}`);if(fs.statSync(file).size<=0)fail(`empty ${file}`)}
const manifest=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
if(manifest.version!=='8.12.5'||manifest.baseVersion!=='8.12.5')fail(`release drift ${manifest.version}/${manifest.baseVersion}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture drift ${manifest.architecture}`);
if(manifest.requests?.initialJavascript!==1||manifest.requests?.dynamicJavascript!==0)fail(`javascript topology drift ${manifest.requests?.initialJavascript}/${manifest.requests?.dynamicJavascript}`);
for(const gate of ['canonicalSingleRuntime','personalEquipmentPhotos8123','groupPlanStableLauncher8123','trainingIntervalUnion8124','quickRecordDirectRecent8124','liveRouteActionDelegate8124','settingsVerticalNative8124'])if(manifest.gates?.[gate]!==true)fail(`release gate missing ${gate}`);
console.log('[AXIS EdgeOne prebuilt] verified exact AXIS 8.12.5 canonical artifact; EdgeOne publishes the already-verified runtime without product rebuild');
