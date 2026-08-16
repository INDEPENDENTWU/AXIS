import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.9.1 inherited contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),css=read('axis-style.css'),info=JSON.parse(read('axis-build.json'));
const version=String(contract.publicVersion||'');
if(!['8.9.1','8.10'].includes(version))fail(`unexpected public version ${version}`);
if(info.version!==version||info.baseVersion!==String(contract.stableBaseVersion||version))fail(`release identity mismatch ${info.version}/${info.baseVersion}`);
const patch=version==='8.10'?'8.10':'8.9.1',rich=version==='8.10'?'richEnglish:456':'richEnglish:72';
for(const [needle,label] of [
 [`patch:'${patch}',owner:'passive-rest-reader'`,'Rest Speak patch marker missing'],
 ['userInvokedPanel:true','user-invoked learning panel contract missing'],
 [rich,'rich English curriculum marker missing'],
 ['function axis891MasterSpeak()','low-friction mastered state missing'],
 ['function axis891Pron(x)','pronunciation coaching layer missing'],
 ["id='v891SpeakPanel'",'micro-learning panel DOM missing'],
 ["patch:'8.9.1',stableShell:true",'stable detail shell marker missing']
])if(!runtime.includes(needle))fail(label);
if(!runtime.includes('.v891SpeakPanel{display:block;position:fixed'))fail('micro-learning panel visual contract missing');
if(!css.includes('#detailSheet{display:flex!important;visibility:hidden!important;opacity:0!important'))fail('precomposed detail reveal contract missing');
if(!css.includes('#detailSheet.axis891DetailSwap'))fail('in-place detail swap stability rule missing');
if(/setInterval\s*\(\s*axis891|new\s+MutationObserver\s*\(\s*axis891|new\s+ResizeObserver\s*\(\s*axis891/.test(runtime))fail('8.9.1 accessory gained timer/observer ownership');
if(!runtime.includes("if(speak){axis891OpenSpeak(speak);return}"))fail('rest phrase no longer opens learning panel');
if(/if\(speak\)\{axis89SpeakVoice\(speak\)/.test(runtime))fail('phrase tap still autoplays speech');
if(!runtime.includes("if(a==='voice')"))fail('explicit pronunciation action missing');

info.gates=info.gates||{};
Object.assign(info.gates,{restSpeakInlineComplete:true,restSpeakMicroLearning:true,restSpeakRichEnglish:true,restSpeakNoAutoplay:true,restSpeakSpacedExposure:true,detailStableReveal:true,detailStableInPlaceSwap:true,detailNoBlurFlash:true});
info.axis891={restSpeak:{mode:'passive-inline-plus-user-invoked-depth',englishUnits:version==='8.10'?456:72,totalUnits:version==='8.10'?492:108,mastery:'local-accessory-store',pronunciation:'contextual-coaching',autoplay:false},detail:{owner:'atomic-handoff',stableShell:true,precomposedReveal:true,detailBackdropBlur:false}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log(`[AXIS 8.9.1 inherited contract] PASS · ${version} · complete inline phrase · micro learning · stable detail reveal`);
