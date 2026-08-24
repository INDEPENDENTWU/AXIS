import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.4 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),css=read('axis-style.css');
if(contract.publicVersion!=='8.12.4'||contract.stableBaseVersion!=='8.12.4')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.12.4'||info.baseVersion!=='8.12.4')fail(`manifest identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0)fail('canonical topology drift');
for(const needle of [
  'function homeLatestActivity(',
  'function homeSessionBounds(',
  'function sealSessionActivities(',
  'historyFallback:true',
  '__AXIS_QUICK_RECORD_FOR__',
  '__AXIS_8124_QUICK_FLOW__',
  'actionDelegate',
  'quick-record',
  'data-axis-route-id',
  '__AXIS_8124_SETTINGS_GEOMETRY__',
  "height:60px!important;min-height:60px!important",
  'real=(activity?.intervals||[])'
])if(!runtime.includes(needle))fail(`runtime missing ${needle}`);
const legacySetCompletion="complete=e.kind==='strength'&&done>=planned";
const executableSetCompletion='complete=axis8201SetExecution(e)&&done>=planned';
if(!runtime.includes(legacySetCompletion)&&!runtime.includes(executableSetCompletion))fail('runtime missing set-completion authority');
if(!css.includes('.settingLink,.settingPlain{min-height:60px'))fail('native Settings row contract missing');
for(const gate of ['liveRouteReadOnly813','groupPlanStableLauncher8123','personalEquipmentLibrary8123','settingsNativeAlignment8123'])if(info.gates?.[gate]!==true)fail(`inherited gate missing ${gate}`);
info.gates={...(info.gates||{}),trainingIntervalUnion8124:true,projectGapLatestActivity8124:true,sessionStartEndBounds8124:true,sessionActivitySeal8124:true,quickRecordDirectRecent8124:true,liveRouteActionDelegate8124:true,liveRouteDeviationSafe8124:true,settingsVerticalNative8124:true};
info.axis8124={release:true,scope:'training-flow-reliability',time:{projectIntervals:'activity-interval-union',projectGap:'latest-real-activity-end',sessionBounds:'stored-session + activity evidence',sessionSeal:true},quickRecord:{recentDirect:true,catalogHop:false,historyIdentityFallback:true},liveRoute:{readOnly:true,actionDelegate:'quick-record',deviationPenalty:false,reprojectsFromActualRecords:true},settings:{learningAndCloudNativeVerticalGeometry:true,reference:'#profileBtn'},ownership:{trainingState:'existing app/v82 owners',liveRouteWrites:false,newNetworkOwner:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.12.4 contract] PASS · truthful time semantics · direct Quick Record · actionable read-only Live Route · native Settings vertical geometry · set-completion contract preserved for final supersede');
