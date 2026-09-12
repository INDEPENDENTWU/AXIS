import fs from 'node:fs';

const fail=message=>{throw new Error(`[AXIS Production governance contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`${path} invalid JSON · ${error.message}`)}};
const has=(text,needle,label)=>{if(!text.includes(needle))fail(`${label} missing ${needle}`)};
const success=value=>String(value||'').toLowerCase()==='success';

const project=json('governance/project-state.json'),owners=json('governance/owners.json'),retirements=json('governance/retirements.json'),decision=json('governance/version-decision.json');
const readme=read('README.md'),handoff=read('docs/HANDOFF.md'),currentRelease=read('docs/CURRENT_RELEASE.md'),currentWork=read('docs/CURRENT_WORK.md');
const CURRENT=String(project?.product?.productionRelease||''),STATUS=String(project?.product?.releaseStatus||'sealed'),SEALED=String(project?.product?.lastSealedRelease||project?.production?.sealedRelease||CURRENT),RUNTIME_SHA=String(project?.product?.productionRuntimeSha||'');
const SEALED_PR=Number(project?.product?.productionPullRequest),CANDIDATE_PR=Number(project?.product?.candidatePullRequest||project?.engineering?.pullRequest||0),candidate=CURRENT!==SEALED||STATUS==='candidate';

if(!/^[0-9a-f]{40}$/.test(RUNTIME_SHA))fail('productionRuntimeSha must remain a full sealed product-runtime SHA');
if(!Number.isInteger(SEALED_PR)||SEALED_PR<1)fail('productionPullRequest must identify the sealed product PR');
if(project?.product?.architecture!=='canonical-single-runtime')fail('canonical architecture governance drift');
if(project?.engineering?.baselineRelease!==CURRENT||project?.engineering?.nextProductRelease!==CURRENT)fail('engineering current/next release drift');
if(project?.engineering?.activeBranch!=='main')fail('governed target branch must remain main');

let sourceOwner='prepare-821-release.mjs',sourceCurrent='8.21',sourceFrom='8.20.1';
if(CURRENT==='8.22'){sourceOwner='prepare-822-evolution-replay.mjs';sourceCurrent='8.22';sourceFrom='8.21'}
if(CURRENT==='8.23'){sourceOwner='prepare-823-replay-evidence-continuity.mjs';sourceCurrent='8.23';sourceFrom='8.22'}
const releaseOwner=read(sourceOwner),releaseMatch=releaseOwner.match(/const FROM='([^']+)',VERSION='([^']+)'/);if(!releaseMatch)fail(`${sourceOwner} current release identity missing`);if(releaseMatch[1]!==sourceFrom||releaseMatch[2]!==sourceCurrent)fail(`${sourceOwner} release transition drift ${releaseMatch[1]} -> ${releaseMatch[2]}`);if(CURRENT!==sourceCurrent)fail(`governed current release ${CURRENT} does not match release owner ${sourceCurrent}`);

if(CURRENT==='8.23'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.22')fail(`8.23 must be candidate over sealed 8.22, got ${STATUS} / ${SEALED}`);
  if(RUNTIME_SHA!=='abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631'||SEALED_PR!==144)fail('8.23 candidate lost the exact 8.22 Production seal baseline');
  if(project?.production?.candidateRelease!=='8.23'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.23 Production candidate state drift');
  if(CANDIDATE_PR!==146||project?.engineering?.pullRequest!==146||project?.engineering?.pullRequestDraft!==true)fail('8.23 candidate PR state must identify draft PR #146');
  if(project?.engineering?.activeMilestone!=='AXIS 8.23 — Replay Evidence Continuity')fail('8.23 active milestone drift');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.23 must be governed as intended product behavior change');
  const productDecision=decision?.sequence===7&&decision?.base_release==='8.22'&&decision?.release==='8.23'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
  const infrastructureRepair=decision?.sequence===8&&decision?.base_release==='8.23'&&decision?.release==='8.23'&&decision?.decision==='confirm'&&decision?.change_class==='infrastructure';
  if(!productDecision&&!infrastructureRepair)fail('8.23 latest version decision must be the product bump or the bounded sequence-8 infrastructure confirmation');
}else if(CURRENT==='8.22'&&!candidate){
  if(STATUS!=='production-certified'||SEALED!=='8.22'||RUNTIME_SHA!=='abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631'||SEALED_PR!==144)fail('sealed 8.22 governance drift');
}

const edgeWorkflow=read('.github/workflows/axis-edgeone-production-mirror.yml');
if(/^\s*env:\s*\{[^\n]*\$\{\{/m.test(edgeWorkflow))fail('EdgeOne workflow must use block env mappings around GitHub expressions; flow mappings can fail before jobs are created');
if(CURRENT==='8.23'&&(edgeWorkflow.match(/node scripts\/axis-823-replay-evidence-continuity-smoke\.mjs/g)||[]).length!==2)fail('EdgeOne workflow must preserve the 8.23 smoke in Chromium and iPhone WebKit');

const production=project?.production||{};if(production.evidenceScope!=='product-runtime-seal-snapshot'||production.latestDeploymentIsAuthority!==false)fail('Production evidence authority drift');if(String(production.sealedRelease||SEALED)!==SEALED)fail('Production sealedRelease drift');
const evidenceSemantics=String(production.evidenceSemantics||'');if(CURRENT==='8.23'&&!evidenceSemantics.includes('last fully sealed AXIS 8.22'))fail('8.23 candidate evidence semantics must preserve the 8.22 seal snapshot');
const vercel=production.vercel||{};if(vercel.sourceSha!==RUNTIME_SHA||vercel.state!=='READY'||vercel.target!=='production')fail('Vercel sealed evidence identity drift');if(!success(vercel.exactManifestParity)||!success(vercel.chromiumProductionFlow))fail('Vercel exact parity / current flow proof is not sealed');if(Number(vercel.productionGateRunId)!==34612916951||Number(vercel.publicAliasGateRunId)!==34612916591)fail('8.22 Vercel seal evidence run drift');
const edge=production.edgeOne||{};if(edge.sourceSha!==RUNTIME_SHA||edge.deploymentId!=='dpp90dvhamrl'||Number(edge.verificationRunId)!==34612882892)fail('8.22 EdgeOne seal evidence drift');for(const key of ['packageContract','deployProduction','boundedFixedDomainConvergence','vercelApiParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(edge[key]))fail(`EdgeOne ${key} evidence is not success`);
const custom=production.customDomain||{};if(custom.sourceSha!==RUNTIME_SHA||custom.publicUrl!=='https://axis.juele.fun'||Number(custom.verificationRunId)!==34612882890)fail('8.22 custom-domain seal evidence drift');for(const key of ['exactParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(custom[key]))fail(`custom domain ${key} evidence is not success`);
const combined=production.combinedStatus||{};if(combined.sourceSha!==RUNTIME_SHA||!success(combined.vercel)||!success(combined.edgeOneProduction))fail('sealed combined commit status drift');

if(owners?.baselineRelease!==CURRENT)fail('owner registry must describe current release');
if(!new Set([CURRENT,SEALED,'8.21']).has(retirements?.baselineRelease))fail('retirement ledger baseline drift');
const flowOwner=(owners.owners||[]).find(x=>x.capability==='flow-orchestration-821');if(flowOwner?.status!=='app-owned-intent-production-sealed')fail('Flow owner is not Production-sealed');
const activeOwner=(owners.owners||[]).find(x=>x.capability==='active-lifecycle');if(!/ordinary single\/complete remain one-shot/i.test(String(activeOwner?.notes||'')))fail('Active owner lost ordinary one-shot semantics');
for(const id of ['flow-set-level-completion-authority','flow-current-item-quick-config-route','visible-raw-object-enum-metadata'])if(!(retirements.retirements||[]).some(x=>x.id===id&&String(x.status).startsWith('retired')))fail(`8.21 retirement guard missing · ${id}`);
const replay=(owners.owners||[]).find(x=>x.capability==='evolution-replay-822');if(replay?.status!=='derived-read-only-production-sealed'||replay?.storage!=='none')fail('8.22 Replay must remain Production-sealed derived read-only');if(!String(replay?.notes||'').includes('may not write Session/Encounter/media/storage'))fail('8.22 Replay owner notes lost no-writer boundary');
if(CURRENT==='8.23'){
  const handoff=(owners.owners||[]).find(x=>x.capability==='evolution-replay-evidence-continuity-823');if(handoff?.status!=='presentation-handoff-release-candidate'||handoff?.storage!=='none')fail('8.23 continuity handoff owner drift');
  if(!String(handoff?.notes||'').includes('may not persist selection'))fail('8.23 continuity notes lost transient boundary');
  const e=project?.engineering?.evolutionEvidenceContinuity||{};for(const [key,value] of [['selectionPersistence',false],['newStorage',false],['newDatabase',false],['newSessionWriter',false],['newEncounterWriter',false],['newMediaOwner',false],['network',false],['ai',false],['interpretiveScoring',false]])if(e[key]!==value)fail(`8.23 continuity governance drift ${key}`);
  if(e.handoffEvent!=='axis:evolution-replay-selection'||e.selectedNoEvidenceSemantics!=='explicit-only-when-object-has-other-evidence')fail('8.23 continuity semantics drift');
}
const er=project?.engineering?.evolutionReplay||{};for(const [key,value] of [['newStorage',false],['newDatabase',false],['newSessionWriter',false],['newEncounterWriter',false],['newMediaOwner',false],['network',false],['ai',false],['interpretiveScoring',false]])if(er[key]!==value)fail(`8.22 Replay governance drift ${key}`);

if(!String(project?.engineering?.flow?.status||'').startsWith('production-sealed')||project?.engineering?.flow?.uiImplemented!==true||project?.engineering?.flow?.completionUnit!=='whole-object-item'||project?.engineering?.flow?.currentItemDirectActive!==true||project?.engineering?.flow?.detourQuickRecordOnly!==true||project?.engineering?.flow?.metricOpticalCenterTolerancePx!==0.5)fail('inherited whole-item Flow governance drift');

for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]]){has(text,`AXIS ${CURRENT}`,label);has(text,RUNTIME_SHA,label);if(candidate)has(text,SEALED,label)}
has(readme,`**Current release: ${CURRENT}**`,'README');const releasePr=candidate?CANDIDATE_PR:SEALED_PR;has(handoff,`#${releasePr}`,'HANDOFF release PR');has(currentRelease,`#${releasePr}`,'CURRENT_RELEASE release PR');has(currentRelease,'runtime seal baseline','CURRENT_RELEASE durable baseline semantics');has(currentRelease,'not a self-referential requirement','CURRENT_RELEASE non-self-referential semantics');has(currentWork,project.engineering.activeMilestone,'CURRENT_WORK');has(currentWork,'governed target branch: `main`','CURRENT_WORK');
if(candidate){for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]])if(!/candidate|Release candidate|候选/i.test(text))fail(`${label} does not explicitly mark ${CURRENT} as candidate`);const joined=[readme,handoff,currentRelease,currentWork].join('\n');for(const forbidden of [`AXIS **${CURRENT}** is the current sealed`,`AXIS ${CURRENT} is Production-sealed`,`Status: Production sealed — AXIS ${CURRENT}`])if(joined.includes(forbidden))fail(`candidate documentation overstates ${CURRENT} Production seal`)}

const portable=new Set(project?.crossPlatform?.portableContracts||[]);for(const id of ['axis.domain.v1','axis.data.v1','axis.flow.v1','axis.flow-provenance.v1'])if(!portable.has(id))fail(`portable contract missing · ${id}`);if(project?.crossPlatform?.foundationId!=='axis-native-foundation-0'||project?.crossPlatform?.nativeRepository!=='INDEPENDENTWU/AXIS-iOS')fail('cross-platform foundation governance drift');

console.log(`[AXIS Production governance contract] PASS · current ${CURRENT} (${STATUS}) · sealed ${SEALED} @ ${RUNTIME_SHA.slice(0,12)} / PR #${SEALED_PR} · provider seal snapshot coherent · inherited whole-item Flow + Replay + 8.23 continuity ownership bounded`);
