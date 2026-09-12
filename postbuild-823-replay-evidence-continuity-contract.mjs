import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.23 Replay Evidence Continuity contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const info=JSON.parse(read('axis-build.json'));
const runtime=read('axis-core.js');
const replay=read('v822-evolution-replay.js');
const evidence=read('v815-media-evidence.js');

if(info.version!=='8.23'||info.baseVersion!=='8.23')fail(`release identity ${info.version}/${info.baseVersion}`);
if(info.architecture!=='canonical-single-runtime'||info.requests?.initialJavascript!==1||info.requests?.dynamicJavascript!==0||info.assets?.chunks?.length!==0)fail('canonical topology drift');
for(const gate of ['evolutionReplay822','evolutionReplayDeterministicOrdering822','evolutionReplaySingleEncounterTruth822','evolutionReplayReadOnly822','mediaEvidenceLayer815','mediaEvidenceEncounterBinding815','mediaEvidenceIndexedDbReadOnly815'])if(info.gates?.[gate]!==true)fail(`inherited Replay/Evidence gate missing ${gate}`);
for(const marker of ['axis:evolution-replay-selection','selectionEvent:\'axis:evolution-replay-selection\'','eventId:x.eventId','sessionId:x.sessionId'])if(!runtime.includes(marker)||!replay.includes(marker))fail(`Replay continuity marker missing ${marker}`);
for(const marker of ['selectEncounter:selectReplayEncounter','replaySelectionConsumer:true','selected-without-media','这一次没有留下影像证据','axisReplayEvidenceLinked'])if(!runtime.includes(marker)||!evidence.includes(marker))fail(`Evidence continuity marker missing ${marker}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(replay.includes(forbidden)||evidence.includes(forbidden))fail(`continuity source acquired forbidden authority ${forbidden}`);
for(const forbidden of ['进步','提升','改善','更好','评分','分数','预测','建议'])if(replay.includes(forbidden)||evidence.includes(forbidden))fail(`interpretive copy survived ${forbidden}`);

info.gates=info.gates||{};
Object.assign(info.gates,{
  evolutionReplayEvidenceContinuity823:true,
  evolutionReplayEvidenceExactEncounter823:true,
  evolutionReplaySelectedNoEvidenceTruth823:true,
  evolutionReplayEvidenceReadOnly823:true,
  evolutionReplayEvidenceNoNetwork823:true,
  evolutionReplayEvidenceNoNewPersistence823:true
});
info.axis823={
  release:true,
  scope:'replay-evidence-continuity',
  handoff:{source:'v822-evolution-replay',event:'axis:evolution-replay-selection',identity:['eventId','sessionId','time'],consumer:'v815-media-evidence'},
  behavior:{exactEncounter:true,selectedNoEvidence:'explicit',manualEvidenceSelection:true,selectionPersistence:false},
  ownership:{trainingState:false,sessionWriter:false,encounterWriter:false,mediaWrites:false,persistence:false,network:false,ai:false}
};
fs.writeFileSync('axis-build.json',JSON.stringify(info,null,2)+'\n');
console.log('[AXIS 8.23 Replay Evidence Continuity contract] PASS · exact Encounter handoff · explicit selected no-evidence truth · read-only/no-network/no-new-storage');
