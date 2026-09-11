import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.22 Evolution Replay source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const source=read('v822-evolution-replay.js');
const prepare=read('prepare-822-evolution-replay.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
const build=read('build-release.mjs');
const post=read('postbuild-822-evolution-replay-contract.mjs');
const current=read('.github/workflows/axis-current-release-gate.yml');
const edge=read('.github/workflows/axis-edgeone-production-mirror.yml');
const custom=read('.github/workflows/axis-custom-domain-production.yml');

try{new Function(source)}catch(e){fail(`source syntax ${e.message}`)}
for(const token of ['__AXIS_EVOLUTION_OBJECTS__','__AXIS_EVOLUTION_REPLAY__','__AXIS_822_EVOLUTION_REPLAY__','resolveReplay','ordering:\'time-session-event\'','factualOnly:true','readOnly:true','persistence:false','network:false','ai:false','trainingOwner:false','mediaOwner:false'])if(!source.includes(token))fail(`source token missing ${token}`);
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(source.includes(forbidden))fail(`source acquired forbidden authority ${forbidden}`);
for(const forbidden of ['进步','提升','改善','更好','评分','分数','预测','建议'])if(source.includes(forbidden))fail(`source contains interpretive copy ${forbidden}`);
if(!prepare.includes("const FROM='8.21',VERSION='8.22'"))fail('8.21 -> 8.22 release transition missing');
if(!prepare.includes("['v822-evolution-replay.js','__AXIS_822_EVOLUTION_REPLAY_READY__']"))fail('Replay is not added to canonical compiled runtime');
if(!lifecycle.includes("await import('./prepare-822-evolution-replay.mjs')"))fail('8.22 prepare is not reachable after the 8.21 product chain');
if(!build.includes("'postbuild-822-evolution-replay-contract.mjs'"))fail('8.22 postbuild contract is not canonical-build reachable');
for(const token of ['evolutionReplay822:true','evolutionReplayDeterministicOrdering822:true','evolutionReplaySingleEncounterTruth822:true','evolutionReplayNoNewPersistence822:true'])if(!post.includes(token))fail(`postbuild gate missing ${token}`);
if((current.match(/node scripts\/axis-822-evolution-replay-smoke\.mjs/g)||[]).length!==2)fail('Current Release must prove Replay in Chromium and iPhone WebKit');
if((edge.match(/node scripts\/axis-822-evolution-replay-smoke\.mjs/g)||[]).length!==2)fail('EdgeOne Production must prove Replay in Chromium and iPhone WebKit');
if((custom.match(/node scripts\/axis-822-evolution-replay-smoke\.mjs/g)||[]).length!==2)fail('axis.juele.fun must prove Replay in Chromium and iPhone WebKit');
console.log('[AXIS 8.22 Evolution Replay source contract] PASS · one derived Replay owner · deterministic factual ordering · dual-engine Current/EdgeOne/custom-domain coverage · no second fact/storage/network/AI owner');
