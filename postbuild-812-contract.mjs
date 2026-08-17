import fs from 'node:fs';
import {auditAxis812} from './lib/learning-studio-812.mjs';
const fail=m=>{throw new Error(`[AXIS 8.12 contract] ${m}`)},read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),info=JSON.parse(read('axis-build.json')),runtime=read('axis-core.js'),audit=auditAxis812();
if(contract.publicVersion!=='8.12'||contract.stableBaseVersion!=='8.12')fail(`release identity ${contract.publicVersion}/${contract.stableBaseVersion}`);
if(info.version!=='8.12'||info.baseVersion!=='8.12')fail(`manifest identity ${info.version}/${info.baseVersion}`);
for(const lang of ['en','ja','ko','zh'])if(audit.newByLanguage[lang]!==4896)fail(`${lang} new count ${audit.newByLanguage[lang]}`);
if(audit.totalNew!==19584)fail(`new total ${audit.totalNew}`);
if(Object.values(audit.tailPairMax).some(n=>n>40))fail(`tail repetition ${JSON.stringify(audit.tailPairMax)}`);
for(const needle of [
 '/* AXIS 8.12 — Language Studio:',
 'function axis812StudioUnits(lang)',
 'function axis812ConversationFor(r)',
 "dialogueDepth||'full'",
 "['看懂意图','注意母语差异','盲回想','接下一句','影子跟读','换条件再说','隔天复现']",
 'function axis812MethodLab(panel,r)',
 "window.__AXIS_812_LEARNING__={version:'8.12'",
 "availableByLanguage:{en:10632,ja:5028,ko:5028,zh:5028}",
 "dialogueTurns:{short:4,full:8,immersive:12}",
 '/* AXIS 8.12 — learning schedule:',
 'function axis812ConvergeLearningSettings()',
 "visibleCore:['purpose','method','intensity','level','dialogueDepth']",
 "purposes:['auto','native','travel','work','gym','ielts']",
 "methods:['mixed','dialogue','listen','shadow','recall','dictation']",
 "fineTune:['novelty','track','cadence','dailyTarget','opportunity']"
])if(!runtime.includes(needle))fail(`runtime missing ${needle}`);
const start=runtime.indexOf('/* AXIS 8.12 — Language Studio:'),settings=runtime.indexOf('/* AXIS 8.12 — learning schedule:',start);if(start<0||settings<0)fail('8.12 runtime segments missing');
const studio=runtime.slice(start,settings);if(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|setInterval\s*\(|MutationObserver|ResizeObserver/.test(studio))fail('Language Studio introduced network or persistent owner');
if(/speechSynthesis\.speak\s*\(/.test(studio))fail('Language Studio introduced autoplay owner');
if(info.axis811?.release!==true||info.axis811?.learning?.totalUnits!==6132||info.axis811?.learning?.dialogueTurns!==6)fail('8.11 inherited manifest contract changed');
info.gates=info.gates||{};Object.assign(info.gates,{
 languageStudio812:true,languageCorpusExpanded812:true,nativeMultilingual812:true,dialogueTailDiversity812:true,dialogueDepthSelectable812:true,teachingLoop812:true,activeRecall812:true,transformPractice812:true,learningSettingsPurpose812:true,learningSettingsMethod812:true,learningSettingsNovelty812:true,legacy811Preserved812:true,learningNoAutoplay812:true,learningLocalFirst812:true,learningNoTrainingOwner812:true
});
info.axis812={release:true,learning:{owner:'axis_v89_speak',newPerLanguage:{en:4896,ja:4896,ko:4896,zh:4896},totalNew:19584,availableByLanguage:{en:10632,ja:5028,ko:5028,zh:5028},totalAvailable:25716,dialogueTurns:{short:4,full:8,immersive:12},tailPairMax:audit.tailPairMax,teachingLoop:['meaning','noticing','retrieval','response','shadow','transform','review'],practice:['dialogue','listen','shadow','recall','dictation','transform'],settings:{visibleCore:['purpose','method','intensity','level','dialogueDepth'],purposes:['auto','native','travel','work','gym','ielts'],fineTune:['novelty','track','cadence','dailyTarget','opportunity']},networkRequired:false,autoplay:false,trainingOwner:false},inheritance:{axis811:true,legacyDiagnostics:{richEnglish:456,totalUnits:492,phrases:492}}};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log(`[AXIS 8.12 contract] PASS · 25,716 available units · 4/8/12-turn dialogue · tail max ${JSON.stringify(audit.tailPairMax)} · seven-step active learning`);
