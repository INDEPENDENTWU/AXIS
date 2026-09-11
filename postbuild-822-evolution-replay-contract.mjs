import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.22 Evolution Replay contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js');
const source=read('v822-evolution-replay.js');

if(info.version!=='8.22'||info.baseVersion!=='8.22')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['evolutionObjects814','evolutionObjectFirstLatest814','evolutionObjectEncounterCount814','evolutionObjectFactualDelta814','evolutionObjectReadOnly814','evolutionObjectNoNetwork814','mediaEvidenceLayer815','mediaEvidenceEncounterBinding815','mediaEvidenceIndexedDbReadOnly815','mediaEvidenceInPlaceViewer815','mediaEvidenceUniversalBundle815'])if(info.gates?.[gate]!==true)fail(`inherited Evolution/Evidence gate missing ${gate}`);
for(const marker of ['__AXIS_822_EVOLUTION_REPLAY__','__AXIS_EVOLUTION_REPLAY__','__AXIS_822_EVOLUTION_REPLAY_READY__','resolveReplay','time-session-event','factualOnly:true','readOnly:true'])if(!runtime.includes(marker))fail(`compiled Replay marker missing ${marker}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(source.includes(forbidden))fail(`Replay source acquired forbidden authority ${forbidden}`);
for(const forbidden of ['进步','提升','改善','更好','评分','分数','预测','建议'])if(source.includes(forbidden))fail(`interpretive/score copy survived ${forbidden}`);
for(const needle of ['过程回看','只有一次真实记录 · 暂无前后对照','按发生时间回看','这次没有影像证据','persistence:false','network:false','ai:false','trainingOwner:false','mediaOwner:false'])if(!source.includes(needle))fail(`Replay factual/presentation contract missing ${needle}`);

info.gates=info.gates||{};
Object.assign(info.gates,{
  evolutionReplay822:true,
  evolutionReplayDeterministicOrdering822:true,
  evolutionReplaySingleEncounterTruth822:true,
  evolutionReplayReadOnly822:true,
  evolutionReplayNoNetwork822:true,
  evolutionReplayNoAi822:true,
  evolutionReplayNoNewPersistence822:true,
  evolutionReplayNoTruthOwner822:true
});
info.axis822={
  release:true,
  scope:'truthful-evolution-replay',
  projection:{source:'existing Evolution Object encounters',ordering:'time-session-event',singleEncounter:'explicit-no-comparison',sequence:'factual-chronology',interpretation:false},
  presentation:{owner:'v822-evolution-replay',location:'in-place Evolution Object',transientSelection:true},
  ownership:{trainingState:false,sessionWriter:false,encounterWriter:false,mediaWrites:false,persistence:false,network:false,ai:false}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.22 Evolution Replay contract] PASS · factual deterministic chronology · honest single-Encounter state · in-place read-only Replay · no storage/network/AI/truth owner');
