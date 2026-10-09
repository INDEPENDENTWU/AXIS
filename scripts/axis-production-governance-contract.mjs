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
if(CURRENT==='8.24.1'){sourceOwner='prepare-8241-dock-occlusion.mjs';sourceCurrent='8.24.1';sourceFrom='8.24'}
if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}
if(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}
if(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}
if(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}
if(CURRENT==='8.26.2'){sourceOwner='prepare-8262-active-rest-selector.mjs';sourceCurrent='8.26.2';sourceFrom='8.26.1'}
if(CURRENT==='8.26.3'){sourceOwner='prepare-8263-active-rest-convergence.mjs';sourceCurrent='8.26.3';sourceFrom='8.26.2'}
if(CURRENT==='8.26.4'){sourceOwner='prepare-8264-active-rest-utility-rail.mjs';sourceCurrent='8.26.4';sourceFrom='8.26.3'}
if(CURRENT==='8.26.5'){sourceOwner='prepare-8265-recording-review-geometry.mjs';sourceCurrent='8.26.5';sourceFrom='8.26.4'}
if(CURRENT==='8.27'){sourceOwner='prepare-827-reality-route.mjs';sourceCurrent='8.27';sourceFrom='8.26.5'}
if(CURRENT==='8.28'){sourceOwner='prepare-828-practice-loop.mjs';sourceCurrent='8.28';sourceFrom='8.27'}
if(CURRENT==='8.29'){sourceOwner='prepare-829-recording-friction.mjs';sourceCurrent='8.29';sourceFrom='8.28'}
if(CURRENT==='8.30'){sourceOwner='prepare-830-object-identity.mjs';sourceCurrent='8.30';sourceFrom='8.29'}
const releaseOwner=read(sourceOwner),releaseMatch=releaseOwner.match(/const FROM='([^']+)',VERSION='([^']+)'/);if(!releaseMatch)fail(`${sourceOwner} current release identity missing`);if(releaseMatch[1]!==sourceFrom||releaseMatch[2]!==sourceCurrent)fail(`${sourceOwner} release transition drift ${releaseMatch[1]} -> ${releaseMatch[2]}`);if(CURRENT!==sourceCurrent)fail(`governed current release ${CURRENT} does not match release owner ${sourceCurrent}`);

if(CURRENT==='8.24'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.23')fail(`8.24 must be candidate over sealed 8.23, got ${STATUS} / ${SEALED}`);
  if(RUNTIME_SHA!=='2418103c786f2d0865aece49d738e9ed9161ef55'||SEALED_PR!==147)fail('8.24 candidate lost the exact 8.23 Production seal baseline');
  if(project?.production?.candidateRelease!=='8.24'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.24 Production candidate state drift');
  if(CANDIDATE_PR!==148||project?.engineering?.pullRequest!==148||project?.engineering?.pullRequestDraft!==true)fail('8.24 candidate PR state must identify draft PR #148');
  if(project?.engineering?.activeMilestone!=='AXIS 8.24 — Active Stage Tactile Convergence')fail('8.24 active milestone drift');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.24 must be governed as intended product behavior change');
  if(!(decision?.sequence===9&&decision?.base_release==='8.23'&&decision?.release==='8.24'&&decision?.decision==='bump'&&decision?.change_class==='product-ui'))fail('8.24 version decision must be 8.23 → 8.24 / bump / sequence 9 / product-ui');
}else if(CURRENT==='8.24.1'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.24')fail(`8.24.1 must be candidate over sealed 8.24, got ${STATUS} / ${SEALED}`);
  if(RUNTIME_SHA!=='321647b9aaca783b7f6ba99ec66616941208c698'||SEALED_PR!==148)fail('8.24.1 candidate lost the exact 8.24 Production seal baseline');
  if(project?.production?.candidateRelease!=='8.24.1'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.24.1 Production candidate state drift');
  if(CANDIDATE_PR!==149||project?.engineering?.pullRequest!==149||project?.engineering?.pullRequestDraft!==true)fail('8.24.1 candidate PR state must identify draft PR #149');
  if(project?.engineering?.activeMilestone!=='AXIS 8.24.1 — Dock Occlusion Hotfix')fail('8.24.1 active milestone drift');
  if(project?.engineering?.deliveryBranch!=='hotfix/8241-dock-occlusion')fail('8.24.1 delivery branch drift');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.24.1 must be governed as intended product behavior change');
  if(!(decision?.sequence===10&&decision?.base_release==='8.24'&&decision?.release==='8.24.1'&&decision?.decision==='bump'&&decision?.change_class==='product-ui'))fail('8.24.1 version decision must be 8.24 → 8.24.1 / bump / sequence 10 / product-ui');
}else if(CURRENT==='8.25'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.24.1')fail(`8.25 must be candidate over sealed 8.24.1, got ${STATUS} / ${SEALED}`);
  if(RUNTIME_SHA!=='d4b009c327f6fa9c4900eaa41d7195f10f6ed425'||SEALED_PR!==149)fail('8.25 candidate lost the exact 8.24.1 Production seal baseline');
  if(project?.production?.candidateRelease!=='8.25'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.25 Production candidate state drift');
  if(CANDIDATE_PR!==150||project?.engineering?.pullRequest!==150||project?.engineering?.pullRequestDraft!==true)fail('8.25 candidate PR state must identify draft PR #150');
  if(project?.engineering?.activeMilestone!=='AXIS 8.25 — Set Lock Interaction')fail('8.25 active milestone drift');
  if(project?.engineering?.deliveryBranch!=='axis-825-set-lock')fail('8.25 delivery branch drift');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.25 must be governed as intended product behavior change');
  if(!(decision?.sequence===11&&decision?.base_release==='8.24.1'&&decision?.release==='8.25'&&decision?.decision==='bump'&&decision?.change_class==='product-ui'))fail('8.25 version decision must be 8.24.1 → 8.25 / bump / sequence 11 / product-ui');
 }else if(CURRENT==='8.30'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.29'||RUNTIME_SHA!=='4a9c73b2ea5330b9cffad3f9e322eb6970dfe171'||SEALED_PR!==164)fail('8.30 lost exact sealed 8.29 product runtime');
  if(CANDIDATE_PR!==167||project?.engineering?.pullRequest!==167||project?.engineering?.deliveryBranch!=='feature/830-object-identity-integrity')fail('8.30 candidate delivery PR drift');
  if(project?.production?.candidateRelease!=='8.30'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.30 candidate production status');
  if(!(decision?.sequence===29&&decision?.base_release==='8.29'&&decision?.release==='8.30'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.30 version decision drift');
  for(const prov of ['vercel','edgeOne','customDomain'])if(project.production?.[prov]?.sourceSha!==RUNTIME_SHA)fail('8.30 predecessor provider overwritten '+prov);
  const id=project?.engineering?.objectIdentity;
  if(id?.status!=='8.30-release-candidate'||id?.historicalEncounterRewrite!==false||id?.newEncounterWriter!==false||id?.newStorageNamespace!==false||id?.network!==false||id?.ai!==false)fail('8.30 bounded Object identity ownership');
 }else if(CURRENT==='8.29'){
  if(CANDIDATE_PR!==164||project?.engineering?.pullRequest!==164)fail('8.29 product PR identity drift');
  if(project?.engineering?.activeMilestone!=='AXIS 8.29 — Recording Friction Collapse')fail('8.29 milestone drift');
  const rf=project?.engineering?.recordingFriction;
  if(rf?.pureOwner!=='lib/axis-recording-continuity.mjs'||rf?.projectionSchema!=='axis.recording-continuity.v1'||rf?.newStorageNamespace!==false||rf?.newRecorderOwner!==false||rf?.newEncounterWriter!==false)fail('8.29 Recording owner drift');
  if(STATUS==='candidate'){
    if(!candidate||SEALED!=='8.28'||RUNTIME_SHA!=='df67fc0a20c0c34a79341315c8c85b5461acfe44'||SEALED_PR!==162)fail('8.29 must be candidate over sealed 8.28');
    if(project?.engineering?.deliveryBranch!=='feature/829-recording-friction-collapse'||project?.production?.candidateRelease!=='8.29'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.29 candidate Production boundary drift');
    if(!(decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.29 candidate version decision');
  }else if(STATUS==='production-certified'){
    const certificate=json('governance/production-certifications/8.29.json');
    if(candidate||SEALED!=='8.29'||RUNTIME_SHA!=='4a9c73b2ea5330b9cffad3f9e322eb6970dfe171'||SEALED_PR!==164)fail('8.29 certified product runtime mismatch');
    if(project?.production?.candidateRelease!=='8.29'||project?.production?.candidateStatus!=='production-sealed'||project?.production?.latestDeploymentIsAuthority!==false)fail('8.29 certified Production authority');
    for(const p of ['vercel','edgeOne','customDomain'])if(project?.production?.[p]?.sourceSha!==RUNTIME_SHA)fail('8.29 certified provider provenance '+p);
    if(project?.production?.vercel?.deploymentId!==certificate.vercel.deploymentId||project?.production?.edgeOne?.deploymentId!==certificate.edgeOne.deploymentId||project?.production?.customDomain?.verificationRunId!==certificate.customDomain.verificationRunId)fail('8.29 certificate provider evidence drift');
    if(project?.engineering?.deliveryBranch!=='main'||rf?.status!=='production-sealed-8.29')fail('8.29 production handoff drift');
    if(!(decision?.sequence===28&&decision?.base_release==='8.29'&&decision?.release==='8.29'&&decision?.decision==='confirm'&&decision?.change_class==='governance'))fail('8.29 closeout decision drift');
  }else fail('unexpected AXIS 8.29 release status '+STATUS);
}else if(CURRENT==='8.28'){
  if(CANDIDATE_PR!==162||project?.engineering?.pullRequest!==162)fail('8.28 product PR must remain #162');
  if(project?.engineering?.activeMilestone!=='AXIS 8.28 — Practice Loop Convergence')fail('8.28 milestone drift');
  const l=project?.engineering?.practiceLoop;
  if(l?.pureOwner!=='lib/axis-practice-loop.mjs'||l?.projectionSchema!=='axis.practice-loop.v1'||l?.reloadSafe!==true||l?.promptOnRestore!==false||l?.newStorageNamespace!==false||l?.flowDefinitionMutation!==false||l?.historicalEncounterRewrite!==false)fail('8.28 Practice Loop projection drift');
  if(STATUS==='production-certified'){
    if(SEALED!=='8.28'||RUNTIME_SHA!=='df67fc0a20c0c34a79341315c8c85b5461acfe44'||SEALED_PR!==162)fail('8.28 exact product/runtime seal drift');
    if(project?.production?.candidateRelease!=='8.28'||project?.production?.candidateStatus!=='production-sealed'||project?.production?.latestDeploymentIsAuthority!==false)fail('8.28 Production governance drift');
    if(project?.engineering?.deliveryBranch!=='main'||project?.engineering?.baselineRuntimeSha!==RUNTIME_SHA||project?.engineering?.lastSealedRuntimeSha!==RUNTIME_SHA||project?.engineering?.intendedProductBehaviorChange!==false)fail('8.28 sealed engineering runtime provenance drift');
    if(!(decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&decision?.decision==='confirm'&&decision?.change_class==='governance'))fail('8.28 governance closeout decision drift');
    if(l?.status!=='production-sealed-8.28'||l?.productionRuntimeSha!==RUNTIME_SHA||l?.productionPullRequest!==162)fail('8.28 Practice Loop certification drift');
  }else if(STATUS==='candidate'){
    if(SEALED!=='8.27'||RUNTIME_SHA!=='d6044f0b30a92c007dd2fbab5792c2aa62dfd485'||SEALED_PR!==160)fail('8.28 candidate lost exact 8.27 seal baseline');
    if(project?.production?.candidateRelease!=='8.28'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.28 candidate Production state drift');
    if(project?.engineering?.deliveryBranch!=='feature/828-practice-loop-convergence')fail('8.28 candidate delivery identity drift');
    if(!(decision?.sequence===25&&decision?.base_release==='8.27'&&decision?.release==='8.28'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.28 candidate version decision drift');
    if(l?.status!=='8.28-release-candidate')fail('8.28 Practice Loop candidate status drift');
  }else fail('unexpected AXIS 8.28 release status '+STATUS);
}else if(CURRENT==='8.27'){
  const sealed827=STATUS==='production-certified'&&SEALED==='8.27'&&RUNTIME_SHA==='d6044f0b30a92c007dd2fbab5792c2aa62dfd485'&&SEALED_PR===160;
  const candidate827=STATUS==='candidate'&&SEALED==='8.26.5'&&RUNTIME_SHA==='5bf575730c5c8de542c603d40b0f8b780204a342'&&SEALED_PR===158;
  if(!sealed827&&!candidate827)fail('8.27 Production seal identity drift');
  if(CANDIDATE_PR!==160||project?.engineering?.pullRequest!==160)fail('8.27 PR identity must remain #160');
  if(project?.engineering?.activeMilestone!=='AXIS 8.27 — Reality Route')fail('8.27 milestone drift');
  const r=project?.engineering?.realityRoute;
  if(r?.pureOwner!=='lib/axis-reality-route.mjs'||r?.projectionSchema!=='axis.reality-route.v1'||r?.temporaryConstraintSchema!=='axis.execution-constraints.v1'||r?.newStorageNamespace!==false||r?.flowDefinitionMutation!==false||r?.historicalEncounterRewrite!==false)fail('8.27 Reality Route governance drift');
  if(sealed827){
    if(project?.production?.candidateRelease!=='8.27'||project?.production?.candidateStatus!=='production-sealed')fail('8.27 sealed candidate status drift');
    if(r?.status!=='production-sealed-8.27'||r?.productionRuntimeSha!==RUNTIME_SHA)fail('8.27 Reality Route seal state drift');
    if(!(decision?.sequence===24&&decision?.base_release==='8.27'&&decision?.release==='8.27'&&decision?.decision==='confirm'&&decision?.change_class==='governance'))fail('8.27 governance closeout decision drift');
  }else{
    if(project?.production?.candidateRelease!=='8.27'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.27 candidate Production state drift');
    if(r?.status!=='8.27-release-candidate')fail('8.27 candidate Reality Route state drift');
    if(!(decision?.sequence===23&&decision?.base_release==='8.26.5'&&decision?.release==='8.27'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.27 candidate version decision drift');
  }
}else if(CURRENT==='8.23'){
  if(candidate){if(STATUS!=='candidate'||SEALED!=='8.22')fail('8.23 candidate baseline drift')}else if(STATUS!=='production-certified')fail('sealed 8.23 must be production-certified');
}

const edgeWorkflow=read('.github/workflows/axis-edgeone-production-mirror.yml'),customWorkflow=read('.github/workflows/axis-custom-domain-production.yml'),vercelWorkflow=read('.github/workflows/axis-production-deployment-gate.yml'),currentWorkflow=read('.github/workflows/axis-current-release-gate.yml');
if(/^\s*env:\s*\{[^\n]*\$\{\{/m.test(edgeWorkflow))fail('EdgeOne workflow must use block env mappings around GitHub expressions; flow mappings can fail before jobs are created');
if(CURRENT==='8.24'){
  if(count(edgeWorkflow,'node scripts/axis-823-replay-evidence-continuity-smoke.mjs')!==2)fail('EdgeOne must preserve inherited 8.23 smoke in Chromium and iPhone WebKit');
  if(count(edgeWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('EdgeOne must prove 8.24 in Chromium and iPhone WebKit');
  if(count(customWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('axis.juele.fun must prove 8.24 in Chromium and iPhone WebKit');
  if(count(vercelWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==1)fail('fixed Vercel Production must prove 8.24 in Chromium');
}
if(['8.24.1','8.25'].includes(CURRENT)){
  for(const [text,label,want] of [[currentWorkflow,'Current Release',2],[edgeWorkflow,'EdgeOne Production',2],[customWorkflow,'axis.juele.fun',2],[vercelWorkflow,'fixed Vercel Production',1]]){
    if(count(text,'node scripts/axis-8241-dock-occlusion-smoke.mjs')!==want)fail(`${label} must run inherited 8.24.1 Dock Occlusion smoke ${want} time(s)`);
  }
  if(count(currentWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('Current Release must preserve inherited 8.24 smoke in both engines');
  if(count(edgeWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('EdgeOne must preserve inherited 8.24 smoke in both engines');
  if(count(customWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==2)fail('axis.juele.fun must preserve inherited 8.24 smoke in both engines');
  if(count(vercelWorkflow,'node scripts/axis-824-active-stage-tactile-smoke.mjs')!==1)fail('fixed Vercel Production must preserve inherited 8.24 smoke');
}
if(CURRENT==='8.25'){
  const inheritedSmoke=read('scripts/axis-8241-dock-occlusion-smoke.mjs');
  if(count(inheritedSmoke,"await import('./axis-825-set-lock-smoke.mjs')")!==1)fail('8.25 Set Lock smoke must chain exactly once from inherited 8.24.1 physical proof');
  for(const [text,label,want] of [[currentWorkflow,'Current Release',2],[edgeWorkflow,'EdgeOne Production',2],[customWorkflow,'axis.juele.fun',2],[vercelWorkflow,'fixed Vercel Production',1]])if(count(text,'node scripts/axis-8241-dock-occlusion-smoke.mjs')!==want)fail(`${label} lost the physical proof that chains into Set Lock`);
}

if(CURRENT==='8.27'){
  const releaseIdentity=read('scripts/prepare-827-release-identity.mjs');
  if(!releaseIdentity.includes("await import('./axis-827-reality-route-smoke.mjs')"))fail('8.27 Reality Route smoke chain is not installed by release identity convergence');
  for(const [text,label,want] of [[currentWorkflow,'Current Release',2],[edgeWorkflow,'EdgeOne Production',2],[customWorkflow,'axis.juele.fun',2],[vercelWorkflow,'fixed Vercel Production',1]]){
    if(count(text,'node scripts/axis-8262-active-rest-selector-smoke.mjs')<want)fail(`${label} lost the inherited physical chain that reaches AXIS 8.27 Reality Route smoke ${want} time(s)`);
  }
}

const production=project?.production||{};if(production.evidenceScope!=='product-runtime-seal-snapshot'||production.latestDeploymentIsAuthority!==false)fail('Production evidence authority drift');if(String(production.sealedRelease||SEALED)!==SEALED)fail('Production sealedRelease drift');
const evidenceSemantics=String(production.evidenceSemantics||'');if(CURRENT==='8.24'&&!evidenceSemantics.includes('last fully sealed AXIS 8.23'))fail('8.24 candidate evidence semantics must preserve the 8.23 seal snapshot');if(CURRENT==='8.24.1'&&!evidenceSemantics.includes('last fully sealed AXIS 8.24'))fail('8.24.1 candidate evidence semantics must preserve the 8.24 seal snapshot');if(CURRENT==='8.25'&&!evidenceSemantics.includes('last fully sealed AXIS 8.24.1'))fail('8.25 candidate evidence semantics must preserve the 8.24.1 seal snapshot');
const vercel=production.vercel||{};if(vercel.sourceSha!==RUNTIME_SHA||vercel.state!=='READY'||vercel.target!=='production')fail('Vercel sealed evidence identity drift');if(!success(vercel.exactManifestParity)||!success(vercel.chromiumProductionFlow))fail('Vercel exact parity / current flow proof is not sealed');
const edge=production.edgeOne||{};if(edge.sourceSha!==RUNTIME_SHA)fail('EdgeOne sealed source identity drift');for(const key of ['packageContract','deployProduction','boundedFixedDomainConvergence','vercelApiParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(edge[key]))fail(`EdgeOne ${key} evidence is not success`);
const custom=production.customDomain||{};if(custom.sourceSha!==RUNTIME_SHA||custom.publicUrl!=='https://axis.juele.fun')fail('custom-domain sealed evidence identity drift');for(const key of ['exactParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(custom[key]))fail(`custom domain ${key} evidence is not success`);
const combined=production.combinedStatus||{};if(combined.sourceSha!==RUNTIME_SHA||!success(combined.vercel)||!success(combined.edgeOneProduction))fail('sealed combined commit status drift');
if(CURRENT==='8.24'){
  if(Number(vercel.productionGateRunId)!==34685665958||Number(vercel.publicAliasGateRunId)!==34685665973)fail('8.23 Vercel seal evidence run drift');
  if(edge.deploymentId!=='dp2z63vp6fz9'||Number(edge.verificationRunId)!==34685651257||Number(edge.verificationArtifactId)!==10295824755||edge.verificationArtifactSha256!=='e6bb504fe84003abb183dd46b012f8f71aec732a7123c3b7957bbb53d27eb6c7')fail('8.23 EdgeOne seal evidence drift');
  if(Number(custom.verificationRunId)!==34685651239)fail('8.23 custom-domain seal evidence drift');
}
if(CURRENT==='8.24.1'){
  if(Number(vercel.productionGateRunId)!==34700744685||Number(vercel.publicAliasGateRunId)!==34700744673)fail('8.24 Vercel seal evidence run drift');
  if(edge.deploymentId!=='dp7e6rlpyczu'||Number(edge.verificationRunId)!==34700727554||Number(edge.verificationArtifactId)!==10300048249||edge.verificationArtifactSha256!=='3dfed99f2e91b59b73f39bdeb29fee72d1b169f34305bd247cbd3faec49c488a')fail('8.24 EdgeOne seal evidence drift');
  if(Number(custom.verificationRunId)!==34700727551)fail('8.24 custom-domain seal evidence drift');
}
if(CURRENT==='8.25'){
  if(vercel.deploymentId!=='dpl_5P7gF35XDzSAkHoLwmpJ3PQJsT2w'||Number(vercel.productionGateRunId)!==34744363573||Number(vercel.publicAliasGateRunId)!==34744363564)fail('8.24.1 Vercel seal evidence drift');
  if(edge.deploymentId!=='dpp8w54o5vox'||Number(edge.verificationRunId)!==34744342607||Number(edge.verificationArtifactId)!==10313706251||edge.verificationArtifactSha256!=='935377f26bedd69522c35e2b0886fbc5a6f276348e0f4ab555361540e9c7a8d6')fail('8.24.1 EdgeOne seal evidence drift');
  if(Number(custom.verificationRunId)!==34744342633)fail('8.24.1 custom-domain seal evidence drift');
}
if(CURRENT==='8.27'&&STATUS==='production-certified'){
  if(vercel.deploymentId!=='dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm'||Number(vercel.currentReleaseGateRunId)!==37333415838||Number(vercel.deepCompatibilityGateRunId)!==37333415780||Number(vercel.productionGateRunId)!==37333475667||Number(vercel.publicAliasGateRunId)!==37333475632)fail('8.27 Vercel seal evidence drift');
  if(edge.deploymentId!=='dpmrug23mtim'||Number(edge.verificationRunId)!==37333415798)fail('8.27 EdgeOne seal evidence drift');
  if(Number(custom.verificationRunId)!==37333415692)fail('8.27 custom-domain seal evidence drift');
  if(combined.customDomain!=='success')fail('8.27 combined custom-domain seal drift');
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
if(['8.24','8.24.1','8.25'].includes(CURRENT)){
  if(continuityHandoff?.status!=='presentation-handoff-production-sealed'||e.status!=='production-sealed-8.23-inherited')fail(`${CURRENT} must inherit Production-sealed 8.23 Replay Evidence Continuity`);
  const tactile=(owners.owners||[]).find(x=>x.capability==='active-stage-tactile-824'),t=project?.engineering?.activeStageTactile||{};
  const tactileStatus=CURRENT==='8.24'?'presentation-only-release-candidate':'presentation-only-production-sealed';
  if(tactile?.status!==tactileStatus||tactile?.storage!=='none')fail(`${CURRENT} tactile owner state drift`);
  for(const key of ['setProgressSingleTruth','timeMetaNoSetDuplication','tactileFeedback','dockLayerIsolation','reducedMotionSafe'])if(t[key]!==true)fail(`8.24 tactile contract missing ${key}`);
  for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(t[key]!==false)fail(`8.24 tactile ownership drift ${key}`);
}
if(['8.24.1','8.25'].includes(CURRENT)){
  const occlusionOwner=(owners.owners||[]).find(x=>x.capability==='active-dock-occlusion-8241'),o=project?.engineering?.activeDockOcclusion||{};
  const wantStatus=CURRENT==='8.24.1'?'presentation-only-release-candidate':'presentation-only-production-sealed';
  if(occlusionOwner?.status!==wantStatus||occlusionOwner?.storage!=='none')fail(`${CURRENT} dock occlusion owner status drift`);
  for(const [key,value] of [['opaqueDock',true],['opaqueOverscan',true],['paintContainment',false],['translucentCurtain',false],['newTrainingOwner',false],['newStorage',false],['newEncounterWriter',false],['newActiveOwner',false],['network',false],['ai',false]])if(o[key]!==value)fail(`8.24.1 dock occlusion governance drift ${key}`);
}
if(CURRENT==='8.25'){
  const setLockOwner=(owners.owners||[]).find(x=>x.capability==='active-set-lock-825'),s=project?.engineering?.activeSetLock||{};
  if(setLockOwner?.status!=='presentation-only-release-candidate'||setLockOwner?.storage!=='none')fail('8.25 Set Lock owner must remain presentation-only release candidate');
  if(!String(setLockOwner?.notes||'').includes('after done > prevDone'))fail('8.25 Set Lock owner lost post-fact trigger boundary');
  for(const key of ['postFactOnly','largeSetMoment','clampLock','pressureHalo','stageRecoil','collapsesIntoProgress','boundedHaptic','reducedMotionSafe'])if(s[key]!==true)fail(`8.25 Set Lock governance missing ${key}`);
  if(s.pointerEvents!==false)fail('8.25 Set Lock must remain pointer-inert');
  for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(s[key]!==false)fail(`8.25 Set Lock ownership drift ${key}`);
}

if(!String(project?.engineering?.flow?.status||'').startsWith('production-sealed')||project?.engineering?.flow?.uiImplemented!==true||project?.engineering?.flow?.completionUnit!=='whole-object-item'||project?.engineering?.flow?.currentItemDirectActive!==true||project?.engineering?.flow?.detourQuickRecordOnly!==true||project?.engineering?.flow?.metricOpticalCenterTolerancePx!==0.5)fail('inherited whole-item Flow governance drift');

for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]]){has(text,`AXIS ${CURRENT}`,label);has(text,RUNTIME_SHA,label);if(candidate)has(text,SEALED,label)}
has(readme,`**Current release: ${CURRENT}**`,'README');const releasePr=candidate?CANDIDATE_PR:SEALED_PR;has(handoff,`#${releasePr}`,'HANDOFF release PR');has(currentRelease,`#${releasePr}`,'CURRENT_RELEASE release PR');if(candidate){has(currentRelease,'runtime seal baseline','CURRENT_RELEASE durable baseline semantics');has(currentRelease,'not a self-referential requirement','CURRENT_RELEASE non-self-referential semantics')}else{has(currentRelease,'product/runtime SHA','CURRENT_RELEASE exact sealed runtime semantics');has(currentRelease,'Later governance-only commits','CURRENT_RELEASE governance/runtime authority separation')}has(currentWork,project.engineering.activeMilestone,'CURRENT_WORK');has(currentWork,'governed target branch: `main`','CURRENT_WORK');
if(candidate){for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]])if(!/candidate|Release candidate|候选/i.test(text))fail(`${label} does not explicitly mark ${CURRENT} as candidate`);const joined=[readme,handoff,currentRelease,currentWork].join('\n');for(const forbidden of [`AXIS **${CURRENT}** is the current sealed`,`AXIS ${CURRENT} is Production-sealed`,`Status: Production sealed — AXIS ${CURRENT}`])if(joined.includes(forbidden))fail(`candidate documentation overstates ${CURRENT} Production seal`)}

const portable=new Set(project?.crossPlatform?.portableContracts||[]);for(const id of ['axis.domain.v1','axis.data.v1','axis.flow.v1','axis.flow-provenance.v1'])if(!portable.has(id))fail(`portable contract missing · ${id}`);if(project?.crossPlatform?.foundationId!=='axis-native-foundation-0'||project?.crossPlatform?.nativeRepository!=='INDEPENDENTWU/AXIS-iOS')fail('cross-platform foundation governance drift');

console.log(`[AXIS Production governance contract] PASS · current ${CURRENT} (${STATUS}) · sealed ${SEALED} @ ${RUNTIME_SHA.slice(0,12)} / certification PR #${SEALED_PR} · provider seal snapshot coherent · inherited Flow + Replay + 8.23 continuity + 8.24 tactile + 8.24.1 dock bounded · Set Lock presentation-only when current`);
