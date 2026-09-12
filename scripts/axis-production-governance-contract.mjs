import fs from 'node:fs';

const fail=message=>{throw new Error(`[AXIS Production governance contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`${path} invalid JSON · ${error.message}`)}};
const has=(text,needle,label)=>{if(!text.includes(needle))fail(`${label} missing ${needle}`)};
const success=value=>String(value||'').toLowerCase()==='success';
const count=(text,needle)=>(text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;

const project=json('governance/project-state.json'),owners=json('governance/owners.json'),retirements=json('governance/retirements.json'),decision=json('governance/version-decision.json');
const readme=read('README.md'),handoff=read('docs/HANDOFF.md'),currentRelease=read('docs/CURRENT_RELEASE.md'),currentWork=read('docs/CURRENT_WORK.md');
const CURRENT=String(project?.product?.productionRelease||''),STATUS=String(project?.product?.releaseStatus||'sealed'),SEALED=String(project?.product?.lastSealedRelease||project?.production?.sealedRelease||CURRENT),RUNTIME_SHA=String(project?.product?.productionRuntimeSha||'');
const SEALED_PR=Number(project?.product?.productionPullRequest),CANDIDATE_PR=Number(project?.product?.candidatePullRequest||project?.engineering?.pullRequest||0),candidate=CURRENT!==SEALED||STATUS==='candidate';

if(!/^[0-9a-f]{40}$/.test(RUNTIME_SHA))fail('productionRuntimeSha must remain a full sealed product-runtime SHA');
if(!Number.isInteger(SEALED_PR)||SEALED_PR<1)fail('productionPullRequest must identify the sealed exact-main certification merge');
if(project?.product?.architecture!=='canonical-single-runtime')fail('canonical architecture governance drift');
if(project?.engineering?.baselineRelease!==CURRENT||project?.engineering?.nextProductRelease!==CURRENT)fail('engineering current/next release drift');
if(project?.engineering?.activeBranch!=='main')fail('governed target branch must remain main');

let sourceOwner='prepare-821-release.mjs',sourceCurrent='8.21',sourceFrom='8.20.1';
if(CURRENT==='8.22'){sourceOwner='prepare-822-evolution-replay.mjs';sourceCurrent='8.22';sourceFrom='8.21'}
if(CURRENT==='8.23'){sourceOwner='prepare-823-replay-evidence-continuity.mjs';sourceCurrent='8.23';sourceFrom='8.22'}
if(CURRENT==='8.24'){sourceOwner='prepare-824-active-stage-tactile.mjs';sourceCurrent='8.24';sourceFrom='8.23'}
const releaseOwner=read(sourceOwner),releaseMatch=releaseOwner.match(/const FROM='([^']+)',VERSION='([^']+)'/);if(!releaseMatch)fail(`${sourceOwner} current release identity missing`);if(releaseMatch[1]!==sourceFrom||releaseMatch[2]!==sourceCurrent)fail(`${sourceOwner} release transition drift ${releaseMatch[1]} -> ${releaseMatch[2]}`);if(CURRENT!==sourceCurrent)fail(`governed current release ${CURRENT} does not match release owner ${sourceCurrent}`);

if(CURRENT==='8.24'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.23')fail(`8.24 must be candidate over sealed 8.23, got ${STATUS} / ${SEALED}`);
  if(RUNTIME_SHA!=='2418103c786f2d0865aece49d738e9ed9161ef55'||SEALED_PR!==147)fail('8.24 candidate lost the exact 8.23 Production seal baseline');
  if(project?.production?.candidateRelease!=='8.24'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.24 Production candidate state drift');
  if(CANDIDATE_PR!==148||project?.engineering?.pullRequest!==148||project?.engineering?.pullRequestDraft!==true)fail('8.24 candidate PR state must identify draft PR #148');
  if(project?.engineering?.activeMilestone!=='AXIS 8.24 — Active Stage Tactile Convergence')fail('8.24 active milestone drift');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.24 must be governed as intended product behavior change');
  if(!(decision?.sequence===9&&decision?.base_release==='8.23'&&decision?.release==='8.24'&&decision?.decision==='bump'&&decision?.change_class==='product-ui'))fail('8.24 version decision must be 8.23 → 8.24 / bump / sequence 9 / product-ui');
}else if(CURRENT==='8.23'){
  if(candidate){
    if(STATUS!=='candidate'||SEALED!=='8.22')fail('8.23 candidate baseline drift');
  }else if(STATUS!=='production-certified')fail('sealed 8.23 must be production-certified');
}

const edgeWorkflow=read('.github/workflows/axis-edgeone-production-mirror.yml'),customWorkflow=read('.github/workflows/axis-custom-domain-production.yml'),vercelWorkflow=read('.github/workflows/axis-production-deployment-gate.yml');
if(/^\s*env:\s*\{[^\n]*\$\{\{/m.test(edgeWorkflow))fail('EdgeOne workflow must use block env mappings around GitHub expressions; flow mappings can fail before jobs are created');
if(CURRENT==='8.24'){
  if(count(edgeWorkflow,'node scripts/axis-823-replay-evidence-continuity-smoke.mjs')!==2)fail('EdgeOne must preserve inherited 8.23 smoke in Chromium and iPhone WebKit');
  if(count(edgeWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('EdgeOne must prove 8.24 in Chromium and iPhone WebKit');
  if(count(customWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('axis.juele.fun must prove 8.24 in Chromium and iPhone WebKit');
  if(count(vercelWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==1)fail('fixed Vercel Production must prove 8.24 in Chromium');
}

const production=project?.production||{};if(production.evidenceScope!=='product-runtime-seal-snapshot'||production.latestDeploymentIsAuthority!==false)fail('Production evidence authority drift');if(String(production.sealedRelease||SEALED)!==SEALED)fail('Production sealedRelease drift');
const evidenceSemantics=String(production.evidenceSemantics||'');if(CURRENT==='8.24'&&!evidenceSemantics.includes('last fully sealed AXIS 8.23'))fail('8.24 candidate evidence semantics must preserve the 8.23 seal snapshot');
const vercel=production.vercel||{};if(vercel.sourceSha!==RUNTIME_SHA||vercel.state!=='READY'||vercel.target!=='production')fail('Vercel sealed evidence identity drift');if(!success(vercel.exactManifestParity)||!success(vercel.chromiumProductionFlow))fail('Vercel exact parity / current flow proof is not sealed');
const edge=production.edgeOne||{};if(edge.sourceSha!==RUNTIME_SHA)fail('EdgeOne sealed source identity drift');for(const key of ['packageContract','deployProduction','boundedFixedDomainConvergence','vercelApiParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(edge[key]))fail(`EdgeOne ${key} evidence is not success`);
const custom=production.customDomain||{};if(custom.sourceSha!==RUNTIME_SHA||custom.publicUrl!=='https://axis.juele.fun')fail('custom-domain sealed evidence identity drift');for(const key of ['exactParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(custom[key]))fail(`custom domain ${key} evidence is not success`);
const combined=production.combinedStatus||{};if(combined.sourceSha!==RUNTIME_SHA||!success(combined.vercel)||!success(combined.edgeOneProduction))fail('sealed combined commit status drift');
if(CURRENT==='8.24'){
  if(Number(vercel.productionGateRunId)!==34685665958||Number(vercel.publicAliasGateRunId)!==34685665973)fail('8.23 Vercel seal evidence run drift');
  if(edge.deploymentId!=='dp2z63vp6fz9'||Number(edge.verificationRunId)!==34685651257||Number(edge.verificationArtifactId)!==10295824755||edge.verificationArtifactSha256!=='e6bb504fe84003abb183dd46b012f8f71aec732a7123c3b7957bbb53d27eb6c7')fail('8.23 EdgeOne seal evidence drift');
  if(Number(custom.verificationRunId)!==34685651239)fail('8.23 custom-domain seal evidence drift');
}

if(owners?.baselineRelease!==CURRENT)fail('owner registry must describe current release');
if(!new Set([CURRENT,SEALED,'8.21']).has(retirements?.baselineRelease))fail('retirement ledger baseline drift');
const flowOwner=(owners.owners||[]).find(x=>x.capability==='flow-orchestration-821');if(flowOwner?.status!=='app-owned-intent-production-sealed')fail('Flow owner is not Production-sealed');
const activeOwner=(owners.owners||[]).find(x=>x.capability==='active-lifecycle');if(!/ordinary single\/complete remain one-shot/i.test(String(activeOwner?.notes||'')))fail('Active owner lost ordinary one-shot semantics');
for(const id of ['flow-set-level-completion-authority','flow-current-item-quick-config-route','visible-raw-object-enum-metadata'])if(!(retirements.retirements||[]).some(x=>x.id===id&&String(x.status).startsWith('retired')))fail(`8.21 retirement guard missing · ${id}`);
const replay=(owners.owners||[]).find(x=>x.capability==='evolution-replay-822');if(replay?.status!=='derived-read-only-production-sealed'||replay?.storage!=='none')fail('8.22 Replay must remain Production-sealed derived read-only');if(!String(replay?.notes||'').includes('may not write Session/Encounter/media/storage'))fail('8.22 Replay owner notes lost no-writer boundary');
const continuityHandoff=(owners.owners||[]).find(x=>x.capability==='evolution-replay-evidence-continuity-823');if(!['presentation-handoff-production-sealed','presentation-handoff-release-candidate'].includes(continuityHandoff?.status)||continuityHandoff?.storage!=='none')fail('8.23 continuity handoff owner drift');if(!String(continuityHandoff?.notes||'').includes('may not persist selection'))fail('8.23 continuity notes lost transient boundary');
const e=project?.engineering?.evolutionEvidenceContinuity||{};for(const [key,value] of [['selectionPersistence',false],['newStorage',false],['newDatabase',false],['newSessionWriter',false],['newEncounterWriter',false],['newMediaOwner',false],['network',false],['ai',false],['interpretiveScoring',false]])if(e[key]!==value)fail(`8.23 continuity governance drift ${key}`);if(e.handoffEvent!=='axis:evolution-replay-selection'||e.selectedNoEvidenceSemantics!=='explicit-only-when-object-has-other-evidence')fail('8.23 continuity semantics drift');
const er=project?.engineering?.evolutionReplay||{};for(const [key,value] of [['newStorage',false],['newDatabase',false],['newSessionWriter',false],['newEncounterWriter',false],['newMediaOwner',false],['network',false],['ai',false],['interpretiveScoring',false]])if(er[key]!==value)fail(`8.22 Replay governance drift ${key}`);
if(CURRENT==='8.24'){
  if(continuityHandoff?.status!=='presentation-handoff-production-sealed'||e.status!=='production-sealed-8.23-inherited')fail('8.24 must inherit Production-sealed 8.23 Replay Evidence Continuity');
  const tactile=(owners.owners||[]).find(x=>x.capability==='active-stage-tactile-824'),t=project?.engineering?.activeStageTactile||{};
  if(tactile?.status!=='presentation-only-release-candidate'||tactile?.storage!=='none')fail('8.24 tactile owner must remain presentation-only');
  for(const key of ['setProgressSingleTruth','timeMetaNoSetDuplication','tactileFeedback','dockLayerIsolation','reducedMotionSafe'])if(t[key]!==true)fail(`8.24 tactile contract missing ${key}`);
  for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(t[key]!==false)fail(`8.24 tactile ownership drift ${key}`);
}

if(!String(project?.engineering?.flow?.status||'').startsWith('production-sealed')||project?.engineering?.flow?.uiImplemented!==true||project?.engineering?.flow?.completionUnit!=='whole-object-item'||project?.engineering?.flow?.currentItemDirectActive!==true||project?.engineering?.flow?.detourQuickRecordOnly!==true||project?.engineering?.flow?.metricOpticalCenterTolerancePx!==0.5)fail('inherited whole-item Flow governance drift');

for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]]){has(text,`AXIS ${CURRENT}`,label);has(text,RUNTIME_SHA,label);if(candidate)has(text,SEALED,label)}
has(readme,`**Current release: ${CURRENT}**`,'README');const releasePr=candidate?CANDIDATE_PR:SEALED_PR;has(handoff,`#${releasePr}`,'HANDOFF release PR');has(currentRelease,`#${releasePr}`,'CURRENT_RELEASE release PR');has(currentRelease,'runtime seal baseline','CURRENT_RELEASE durable baseline semantics');has(currentRelease,'not a self-referential requirement','CURRENT_RELEASE non-self-referential semantics');has(currentWork,project.engineering.activeMilestone,'CURRENT_WORK');has(currentWork,'governed target branch: `main`','CURRENT_WORK');
if(candidate){for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]])if(!/candidate|Release candidate|候选/i.test(text))fail(`${label} does not explicitly mark ${CURRENT} as candidate`);const joined=[readme,handoff,currentRelease,currentWork].join('\n');for(const forbidden of [`AXIS **${CURRENT}** is the current sealed`,`AXIS ${CURRENT} is Production-sealed`,`Status: Production sealed — AXIS ${CURRENT}`])if(joined.includes(forbidden))fail(`candidate documentation overstates ${CURRENT} Production seal`)}

const portable=new Set(project?.crossPlatform?.portableContracts||[]);for(const id of ['axis.domain.v1','axis.data.v1','axis.flow.v1','axis.flow-provenance.v1'])if(!portable.has(id))fail(`portable contract missing · ${id}`);if(project?.crossPlatform?.foundationId!=='axis-native-foundation-0'||project?.crossPlatform?.nativeRepository!=='INDEPENDENTWU/AXIS-iOS')fail('cross-platform foundation governance drift');

console.log(`[AXIS Production governance contract] PASS · current ${CURRENT} (${STATUS}) · sealed ${SEALED} @ ${RUNTIME_SHA.slice(0,12)} / certification PR #${SEALED_PR} · provider seal snapshot coherent · inherited Flow + Replay + 8.23 continuity bounded · 8.24 tactile presentation bounded`);
