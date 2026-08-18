import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.12.3 field polish postbuild] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const core=read('axis-core.js');
const info=JSON.parse(read('axis-build.json'));

if(info.version!=='8.12.3'||info.baseVersion!=='8.12.3')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime')fail(`architecture ${info.architecture}`);
for(const needle of [
  '__AXIS_8123_EQUIPMENT_MEMORY__',
  "library:'history+custom'",
  "photoOwner:'axis-media-store'",
  'multiSelectRemove:true',
  '__AXIS_GROUP_PLAN_STABLE__',
  "owner:'recording-render'",
  '__AXIS_GROUP_PLAN_SYNC__?.()',
  "dataset.v8123Plan='1'",
  'v8123FieldPolishStyle',
  'padding-left:28px!important',
  'padding-right:28px!important'
])if(!core.includes(needle))fail(`compiled contract missing ${needle}`);

if(!core.includes('window.__AXIS_RECORDING__'))fail('recording owner missing');
if(!core.includes('applyPlan:applyRecordingPlan'))fail('atomic recording plan transaction missing');
if(!core.includes('profile.memories'))fail('existing visual memory contract missing');
if(!core.includes('equipmentArchivedAt'))fail('personal library archive boundary missing');

info.gates={
  ...(info.gates||{}),
  personalEquipmentLibrary8123:true,
  personalEquipmentPhotos8123:true,
  personalEquipmentVisualMemory8123:true,
  personalEquipmentSwipeRemove8123:true,
  personalEquipmentBatchRemove8123:true,
  personalEquipmentHistoryPreserved8123:true,
  groupPlanStableLauncher8123:true,
  groupPlanRenderOwnedSync8123:true,
  settingsRowAlignmentFieldPolish8123:true
};
info.fieldPolish8123={
  equipmentLibrary:'history + custom definitions + existing visual memory',
  equipmentPhotos:'existing canonical media references',
  removeSemantics:'remove from personal library; training history remains',
  groupPlanOwner:'recording render -> canonical set-bridge launcher -> atomic recording transaction',
  settingsRowInsetPx:28
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2));
console.log('[AXIS 8.12.3 field polish postbuild] PASS · personal equipment memory · stable Group Plan launcher · native Settings row alignment');
