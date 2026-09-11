import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.23 Replay Evidence Continuity source contract] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const replay=read('v822-evolution-replay.js');
const evidence=read('v815-media-evidence.js');
const prepare=read('prepare-823-replay-evidence-continuity.mjs');
const postbuild=read('postbuild-823-replay-evidence-continuity-contract.mjs');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
const build=read('build-release.mjs');
const current=read('.github/workflows/axis-current-release-gate.yml');
const vercel=read('.github/workflows/axis-production-deployment-gate.yml');
const edge=read('.github/workflows/axis-edgeone-production-mirror.yml');
const custom=read('.github/workflows/axis-custom-domain-production.yml');

for(const [label,source] of [['Replay',replay],['Evidence',evidence]])try{new Function(source)}catch(e){fail(`${label} syntax ${e.message}`)}
for(const needle of ['axis:evolution-replay-selection','selectionEvent:\'axis:evolution-replay-selection\'','eventId:x.eventId','sessionId:x.sessionId','time:Number(x.time)'])if(!replay.includes(needle))fail(`Replay selection contract missing ${needle}`);
for(const needle of ['axis:evolution-replay-selection','selectReplayEncounter','selectEncounter:selectReplayEncounter','replaySelectionConsumer:true','linkedEncounter','selected-without-media','这一次没有留下影像证据'])if(!evidence.includes(needle))fail(`Evidence continuity contract missing ${needle}`);
if(!evidence.includes('if(!bundle.visualEncounters.length)return bundle'))fail('wholly no-media Object must preserve data-only/no-pressure behavior');
for(const forbidden of ['localStorage.setItem','sessionStorage.setItem','indexedDB.open','fetch(','XMLHttpRequest','WebSocket(','state.sessions.push','state.active.events.push'])if(replay.includes(forbidden)||evidence.includes(forbidden))fail(`read-only source acquired forbidden authority ${forbidden}`);
if(!prepare.includes("const FROM='8.22',VERSION='8.23'"))fail('8.23 release transition owner drift');
if(!lifecycle.includes("await import('./prepare-823-replay-evidence-continuity.mjs')"))fail('8.23 release owner is not reachable after 8.22');
if(!build.includes("'postbuild-823-replay-evidence-continuity-contract.mjs'"))fail('8.23 postbuild contract is not deterministic build authority');
for(const needle of ['evolutionReplayEvidenceContinuity823:true','evolutionReplayEvidenceExactEncounter823:true','evolutionReplaySelectedNoEvidenceTruth823:true'])if(!postbuild.includes(needle))fail(`8.23 postbuild gate missing ${needle}`);
const smoke='node scripts/axis-823-replay-evidence-continuity-smoke.mjs';
if((current.match(new RegExp(smoke.replaceAll('.','\\.'),'g'))||[]).length!==2)fail('8.23 smoke must run in both Current Release engines');
if((vercel.match(new RegExp(smoke.replaceAll('.','\\.'),'g'))||[]).length!==1)fail('fixed Vercel Production must run the 8.23 Chromium proof exactly once');
if((edge.match(new RegExp(smoke.replaceAll('.','\\.'),'g'))||[]).length!==2)fail('EdgeOne Production must run the 8.23 proof in Chromium and iPhone WebKit');
if((custom.match(new RegExp(smoke.replaceAll('.','\\.'),'g'))||[]).length!==2)fail('axis.juele.fun must run the 8.23 proof in Chromium and iPhone WebKit');
if(fs.existsSync('.github/workflows/axis-823-replay-evidence-continuity.yml'))fail('version-specific automatic workflow fanout must not be introduced');

console.log('[AXIS 8.23 Replay Evidence Continuity source contract] PASS · exact Replay→Evidence identity handoff · wholly-no-media behavior preserved · v815 remains Evidence owner · dual-engine Current/EdgeOne/custom + Vercel coverage · no new factual/storage/network/AI/media owner');
