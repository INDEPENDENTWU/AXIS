import fs from 'node:fs';

const fail=m=>{throw new Error(`AXIS inherited 8.8.1 gate: ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const runtime=read('axis-core.js'),html=read('index.html'),manifest=JSON.parse(read('axis-build.json')),release=JSON.parse(read('release-contract.json'));

if(manifest.version!==release.publicVersion||manifest.baseVersion!==release.stableBaseVersion)fail(`current release identity mismatch ${manifest.version}/${manifest.baseVersion}`);
if(manifest.architecture!=='canonical-single-runtime')fail(`architecture ${manifest.architecture}`);
if(!runtime.includes('v881WeightChips')||!runtime.includes('v881RepChips'))fail('group-plan presets missing');
if(!runtime.includes('剩余 ${clock(remaining)}'))fail('active countdown presentation missing');
if(!runtime.includes('id="v881WmBrand"')||!runtime.includes("fillText('AXIS'"))fail('center AXIS brand missing');
if(runtime.includes("fillText('A X I S'"))fail('legacy spaced AXIS brand returned');
if(!html.includes(`canonical-${release.publicVersion}`))fail('current canonical HTML marker missing');
if(!runtime.includes("const due=Math.max(60000,Number(a.estimateMs)||0)"))fail('normalized countdown threshold missing');
if(!runtime.includes("elapsed(a)>=due&&!D.querySelector('#v87Hold.show')"))fail('countdown sound long-press suppression missing');

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
manifest.canonical.groupPlan={mainValueUnits:false,weightPresets:[.5,1,1.25,2,2.5,5,7.5,10],repPresets:[1,2,3,4,5,6]};
manifest.canonical.activeCountdown={source:'activity.estimateMs',pauseAware:true,toneOwner:'v8710-sound-ui.js',longPressSuppressesTone:true,automaticTrigger:'countdown-zero-only'};
manifest.canonical.watermarkBrand={text:'AXIS',position:'center',opacityOwner:'v876WmOpacity',infoRailOpacityIndependent:true};
fs.writeFileSync('axis-build.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`[AXIS inherited 8.8.1] PASS inside ${release.publicVersion} · planner · countdown · center brand`);
