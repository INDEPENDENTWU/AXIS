import fs from 'node:fs';

const fail=msg=>{throw new Error(`[AXIS EdgeOne prebuilt] ${msg}`)};
const required=['index.html','axis-core.js','axis-style.css','axis-build.json'];
for(const file of required){
  if(!fs.existsSync(file))fail(`missing ${file}`);
  if(fs.statSync(file).size<=0)fail(`empty ${file}`);
}

const manifest=JSON.parse(fs.readFileSync('axis-build.json','utf8'));
if(manifest.version!=='8.12.3')fail(`version drift ${manifest.version}`);
if(manifest.baseVersion!=='8.12.3')fail(`base version drift ${manifest.baseVersion}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture drift ${manifest.architecture}`);
if(manifest.requests?.initialJavascript!==1)fail(`initial javascript drift ${manifest.requests?.initialJavascript}`);
if(manifest.requests?.dynamicJavascript!==0)fail(`dynamic javascript drift ${manifest.requests?.dynamicJavascript}`);
if(manifest.gates?.canonicalSingleRuntime!==true)fail('canonicalSingleRuntime gate missing');
if(manifest.gates?.personalEquipmentPhotos8123!==true)fail('personalEquipmentPhotos8123 gate missing');
if(manifest.gates?.groupPlanStableLauncher8123!==true)fail('groupPlanStableLauncher8123 gate missing');

console.log('[AXIS EdgeOne prebuilt] verified AXIS 8.12.3 canonical artifact; publish without rebuilding product runtime');
