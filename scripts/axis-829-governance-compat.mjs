import fs from 'node:fs';
const fail=m=>{throw Error('[AXIS 8.29 governance] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const json=f=>JSON.parse(read(f));
const LAST='df67fc0a20c0c34a79341315c8c85b5461acfe44';
const p=json('governance/project-state.json'),d=json('governance/version-decision.json'),o=json('governance/owners.json');
if(d.sequence!==27||d.base_release!=='8.28'||d.release!=='8.29'||d.decision!=='bump'||d.change_class!=='product-runtime')fail('sequence 27 product-runtime decision drift');
if(p.product?.productionRelease!=='8.29'||p.product?.releaseStatus!=='candidate'||p.product?.lastSealedRelease!=='8.28'||
  p.product?.productionRuntimeSha!==LAST||p.product?.productionPullRequest!==162||p.product?.candidatePullRequest!==164)fail('candidate/sealed product authority drift');
if(p.production?.sealedRelease!=='8.28'||p.production?.candidateRelease!=='8.29'||
  p.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification'||
  p.production?.latestDeploymentIsAuthority!==false||p.production?.evidenceScope!=='product-runtime-seal-snapshot')fail('candidate Production evidence boundary drift');
for(const provider of ['vercel','edgeOne','customDomain'])if(p.production?.[provider]?.sourceSha!==LAST)fail('sealed 8.28 provider source drift '+provider);
if(p.engineering?.deliveryBranch!=='feature/829-recording-friction-collapse'||p.engineering?.pullRequest!==164)fail('delivery identity drift');
const vd=p.engineering?.versionDecision;
if(vd?.sequence!==27||vd?.baseRelease!=='8.28'||vd?.release!=='8.29'||vd?.decision!=='bump'||vd?.changeClass!=='product-runtime')fail('engineering decision drift');
const recording=p.engineering?.recordingFriction;
if(recording?.status!=='8.29-release-candidate'||recording?.pureOwner!=='lib/axis-recording-continuity.mjs'||recording?.projectionSchema!=='axis.recording-continuity.v1')fail('recording contract identity drift');
for(const bool of ['priorConfirmedMetricsAreOnlySuggestions','needsExplicitSave','compatibleTypeAndUnitRequired','inSheetRerenderPreservesEdits','oneInFlightSave'])if(recording[bool]!==true)fail('recording semantics drift '+bool);
for(const bool of ['newStorageNamespace','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','historicalEncounterRewrite','flowDefinitionMutation','network','ai'])if(recording[bool]!==false)fail('recording acquired forbidden authority '+bool);
if(p.engineering?.practiceLoop?.status!=='production-sealed-8.28'||p.engineering?.practiceLoop?.productionRuntimeSha!==LAST)fail('inherited Practice Loop seal drift');
if(o.baselineRelease!=='8.29')fail('owner baseline drift');
const owner=o.owners?.find(x=>x.capability==='recording-friction-collapse-829');
if(owner?.status!=='derived-presentation-release-candidate'||owner?.contract!=='axis.recording-continuity.v1'||owner?.storage!=='none')fail('derived recorder owner drift');
for(const f of ['README.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md','docs/HANDOFF.md']){
 const s=read(f);if(!s.includes('8.29')||!s.includes('8.28')||!s.includes(LAST))fail('candidate/sealed docs drift '+f);
}
console.log('[AXIS 8.29 governance] PASS · candidate sequence 27 / exactly sealed 8.28 Runtime '+LAST+' · pure recording continuity without fact ownership');
