import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.10.2 contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json'));
if(String(contract.publicVersion)!=='8.10.2')fail(`unexpected public version ${contract.publicVersion}`);
if(info.version!=='8.10.2'||info.baseVersion!=='8.10.2')fail(`release identity mismatch ${info.version}/${info.baseVersion}`);
for(const [needle,label] of [
 ["patch:'8.10.2',stableShell:true,singleComposition:true,legacyHeightHold:false",'single-composition detail diagnostic missing'],
 ['axis8102DetailSwap','detail swap stability class missing'],
 ['function axis8102KeepOpportunityOpen(','explicit opportunity lifetime owner missing'],
 ["p.dataset.axis8102Source==='opportunity'",'opportunity source guard missing'],
 ['e.stopImmediatePropagation()','opportunity single event owner missing'],
 ['function axis8102OpenStandalone(','standalone learning launcher missing'],
 ['data-v810-options="standalone"','standalone learning schedule control missing'],
 ['data-v810-standalone-start','standalone learning start action missing'],
 ["standaloneModes:['off','manual','daily']",'standalone learning modes missing'],
 ["version:'8.10.2',opportunityPanelPersistent:true",'8.10.2 learning diagnostic missing']
])if(!runtime.includes(needle))fail(label);
if(!css.includes('AXIS 8.10.2 detail drill-down'))fail('detail drill-down CSS contract missing');
if(!runtime.includes('AXIS 8.10.2 learning lifetime + isolated standalone surface.'))fail('standalone learning visual contract missing');
const detail=(runtime.match(/function axis89CommitDetail[\s\S]*?async function openEvent/)||[''])[0];
if(/minHeight|removeProperty\('min-height'\)/.test(detail))fail('one-frame inherited detail height survived');
const standalone=(runtime.match(/function axis8102OpenStandalone\([\s\S]*?(?=\nfunction )/)||[''])[0];
if(/writeMeta\(|writeCore\(|axis_v8_meta|axis_v60_state/.test(standalone))fail('standalone learning writes training state');
if(/setInterval\s*\(\s*axis8102|new\s+MutationObserver\s*\(\s*axis8102|new\s+ResizeObserver\s*\(\s*axis8102/.test(runtime))fail('8.10.2 gained persistent timer/observer ownership');
if(/axis8102OpenStandalone\(\)/.test(runtime.match(/function axis8101Install\([\s\S]*?window\.__AXIS_8101_PRACTICE__/)?.[0]?.split("D.addEventListener('click'")[0]||''))fail('standalone learning auto-opens');
info.gates=info.gates||{};
Object.assign(info.gates,{
 detailSingleCompositionSwap:true,
 detailNoLegacyHeightHold:true,
 restSpeakOpportunityPanelPersistent:true,
 restSpeakOpportunitySingleEventOwner:true,
 restSpeakStandaloneLearning:true,
 restSpeakStandaloneControl:true,
 restSpeakStandaloneNoTrainingOwnership:true,
 restSpeakNoAutoplay8102:true
});
info.axis8102={
 detail:{owner:'atomic-handoff',sameSheetSwap:'single-composition',legacyHeightHold:false,transitionDuringSwap:false},
 learning:{opportunityLifetime:'explicit-panel-owned',standalone:true,standaloneModes:['off','manual','daily'],entry:'learning-schedule',autoplay:false},
 ownership:{trainingState:false,trainingControls:false,geometryPersistent:false,timer:false,observer:false,soundAutomatic:false,learningStore:'axis_v89_speak'}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.10.2 contract] PASS · single-composition detail · persistent opportunity panel · standalone learning · training isolation');
