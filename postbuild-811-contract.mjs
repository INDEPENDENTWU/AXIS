import fs from 'node:fs';
import {buildAxis811Atlas,auditAxis811Atlas} from './lib/learning-atlas-811.mjs';

const fail=m=>{throw new Error(`[AXIS 8.11 experience contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const contract=JSON.parse(read('release-contract.json')),runtime=read('axis-core.js'),index=read('index.html'),info=JSON.parse(read('axis-build.json'));
if(String(contract.publicVersion)!=='8.10.3')fail(`8.11 candidate must not silently change sealed public identity: ${contract.publicVersion}`);
const audit=auditAxis811Atlas(buildAxis811Atlas());
if(audit.count!==5280||audit.duplicateTargets!==0||audit.missing.length||audit.unresolved.length||!audit.fourTurn||!audit.sixTurn)fail('learning atlas audit failed');
for(const [k,n] of Object.entries(audit.levelCounts))if(n!==880)fail(`level ${k} count ${n}`);
for(const needle of [
 'const AXIS811_LEVELS=',
 'function axis811SpeakAtlas(){',
 "atlasEnglish=5280",
 "availableEnglish=5736",
 "availableUnits=5772",
 "legacyDiagnosticsPreserved:true",
 "dialogue:'unit-specific-four-turn'",
 "window.__AXIS_811_DIALOGUE__={version:'8.11-candidate',turns:6",
 "connectedSpeech:true",
 "spelling:true",
 "dictation:true",
 "visibleCore:['goal','intensity','level']",
 "fineTunePreserves:['mode','track','cadence','level','dailyTarget','opportunity']",
 "model:'state-field-trajectory'",
 "states:['未成形','起点','成形','推进','稳定','待续']",
 "goals:['health','muscle','fat','strength','cardio']",
 "score:false",
 "networkRequired:false",
 "evidenceOnly:true"
])if(!runtime.includes(needle))fail(`runtime contract missing ${needle}`);
for(const needle of ['legacy.richEnglish=456','legacy.totalUnits=492','legacy.phrases=()=>492'])if(!runtime.includes(needle))fail(`legacy 8.10 diagnostic compatibility missing ${needle}`);
for(const id of ['insightSessions','insightMins','revisitRate','coverageMeta','coverageGrid','evidenceList','rhythmGrid','nextCard']){
 const n=(index.match(new RegExp(`id="${id}"`,'g'))||[]).length;if(n!==1)fail(`legacy insight #${id} expected once, found ${n}`)
}
for(const id of ['v811StateField','v811StateName','v811Trajectory','v811Evidence','v811Needle','v811GoalName']){
 if(!index.includes(`id="${id}"`))fail(`new trend surface missing #${id}`)
}
if(/setInterval\s*\([^)]*axis811|new\s+MutationObserver\s*\([^)]*axis811|new\s+ResizeObserver\s*\([^)]*axis811/.test(runtime))fail('8.11 experience gained forbidden persistent owner');
const trendStart=runtime.indexOf('/* AXIS 8.11 — State Field');
const trendEnd=runtime.indexOf("window.__AXIS_811_TRENDS__",trendStart);
if(trendStart<0||trendEnd<0)fail('trend runtime segment missing');
const trend=runtime.slice(trendStart,trendEnd);
if(/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource/.test(trend))fail('trend state field introduced network dependency');
if(!runtime.includes("legacyPrefsPreserved:true"))fail('learning fine-tune legacy preference preservation missing');
info.gates=info.gates||{};
Object.assign(info.gates,{
 learningAtlas811:true,
 learningAtlasUnique811:true,
 learningDialogueFourTurn811:true,
 learningDialogueSixTurn811:true,
 learningConnectedSpeech811:true,
 learningSpelling811:true,
 learningSettingsConverged811:true,
 learningLegacyDiagnosticsPreserved811:true,
 trendsStateField811:true,
 trendsGoalAware811:true,
 trendsEvidenceOnly811:true,
 trendsLocalFirst811:true
});
info.axis811Candidate={
 publicVersionUnchanged:true,
 learning:{
  owner:'axis_v89_speak',
  baseEnglish:456,
  atlasEnglish:5280,
  totalEnglish:5736,
  totalUnits:5772,
  legacyDiagnostics:{richEnglish:456,totalUnits:492,phrases:492},
  exactTargetDuplicates:0,
  levels:audit.levelCounts,
  tracks:audit.trackCounts,
  dialogueTurns:6,
  connectedSpeech:true,
  spelling:true,
  dictation:true,
  shadow:true,
  settings:{visibleCore:['goal','intensity','level'],fineTunePreserves:['mode','track','cadence','level','dailyTarget','opportunity']}
 },
 trends:{
  model:'state-field-trajectory',
  states:['未成形','起点','成形','推进','稳定','待续'],
  goals:['health','muscle','fat','strength','cardio'],
  fitnessScore:false,
  socialComparison:false,
  evidenceOnly:true,
  networkRequired:false,
  legacyInsightIdsPreserved:true
 },
 ownership:{trainingState:false,trainingControls:false,cloudRequired:false,aiRequired:false}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.11 experience contract] PASS · 5280 unique six-turn atlas · converged schedule · state-field trajectory · inherited diagnostics preserved');