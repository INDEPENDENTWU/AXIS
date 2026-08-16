import fs from 'node:fs';

const VERSION='8.8.1';
const fail=m=>{throw new Error(`AXIS 8.8.1 artifact gate: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const runtime=read('axis-core.js'),html=read('index.html'),manifest=JSON.parse(read('axis-build.json'));

if(manifest.version!==VERSION||manifest.baseVersion!==VERSION)fail(`release identity mismatch ${manifest.version}/${manifest.baseVersion}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture ${manifest.architecture}`);
if(!runtime.includes('v881WeightChips')||!runtime.includes('v881RepChips'))fail('8.8.1 group-plan presets missing');
if(!runtime.includes('剩余 ${clock(remaining)}'))fail('active countdown presentation missing');
if(!runtime.includes('hold?.id!==e.id'))fail('countdown long-press suppression missing');
if(!runtime.includes('id="v881WmBrand"')||!runtime.includes("fillText('AXIS'"))fail('center AXIS brand contract missing');
if(runtime.includes("fillText('A X I S'"))fail('legacy spaced wordmark survived');
if(!html.includes(`canonical-${VERSION}`))fail('HTML canonical version marker missing');

manifest.gates=manifest.gates||{};
Object.assign(manifest.gates,{
  groupPlanUnitlessControls:true,
  groupPlanExpandedPresets:true,
  activeItemCountdown:true,
  activeItemCountdownTone:true,
  activeItemLongPressSuppressesTone:true,
  watermarkCenterBrand:true,
  watermarkBrandOpacitySingleTarget:true
});
manifest.canonical=manifest.canonical||{};
manifest.canonical.minorRelease=VERSION;
manifest.canonical.groupPlan={mainValueUnits:false,weightPresets:[.5,1,1.25,2,2.5,5,7.5,10],repPresets:[1,2,3,4,5,6]};
manifest.canonical.activeCountdown={source:'activity.estimateMs',pauseAware:true,toneOwner:'v87',longPressSuppressesTone:true};
manifest.canonical.watermarkBrand={text:'AXIS',position:'center',opacityOwner:'v876WmOpacity',infoRailOpacityIndependent:true};
fs.writeFileSync('axis-build.json',JSON.stringify(manifest,null,2)+'\n');
console.log('[AXIS 8.8.1 artifact] PASS · planner · countdown · center brand');
