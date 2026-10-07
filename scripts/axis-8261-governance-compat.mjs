import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

const SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342',RUNTIME_827='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');

const sealed8265=
  project?.product?.productionRelease==='8.26.5'&&
  project?.product?.releaseStatus==='production-certified'&&
  project?.product?.lastSealedRelease==='8.26.5'&&
  project?.product?.productionRuntimeSha===SEALED_SHA&&
  decision?.sequence===22&&decision?.base_release==='8.26.5'&&decision?.release==='8.26.5'&&decision?.decision==='confirm';

const candidate827=
  project?.product?.productionRelease==='8.27'&&
  project?.product?.releaseStatus==='candidate'&&
  project?.product?.lastSealedRelease==='8.26.5'&&
  project?.product?.productionRuntimeSha===SEALED_SHA&&
  project?.product?.productionPullRequest===158&&
  project?.product?.candidatePullRequest===160&&
  decision?.sequence===23&&decision?.base_release==='8.26.5'&&decision?.release==='8.27'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';

const sealed827=
  project?.product?.productionRelease==='8.27'&&
  project?.product?.releaseStatus==='production-certified'&&
  project?.product?.lastSealedRelease==='8.27'&&
  project?.product?.productionRuntimeSha===RUNTIME_827&&
  project?.product?.productionPullRequest===160&&
  project?.product?.candidatePullRequest===160&&
  decision?.sequence===24&&decision?.base_release==='8.27'&&decision?.release==='8.27'&&decision?.decision==='confirm'&&decision?.change_class==='governance';

if(!sealed8265&&!candidate827&&!sealed827)fail('current governance must be sealed 8.26.5, exact 8.27 Reality Route candidate, or sealed 8.27');

const production=project?.production||{};
if(sealed827){
  if(production.sealedRelease!=='8.27'||production.candidateStatus!=='production-sealed')fail('8.27 sealed production state drift');
  if(production.vercel?.deploymentId!=='dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm'||production.vercel?.sourceSha!==RUNTIME_827)fail('8.27 Vercel seal drift');
  if(Number(production.edgeOne?.verificationRunId)!==37333415798||production.edgeOne?.sourceSha!==RUNTIME_827)fail('8.27 EdgeOne seal drift');
  if(Number(production.customDomain?.verificationRunId)!==37333415692||production.customDomain?.sourceSha!==RUNTIME_827)fail('8.27 custom-domain seal drift');
}else{
  if(production.sealedRelease!=='8.26.5')fail('sealed release baseline drift');
  if(production.vercel?.deploymentId!=='dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn'||production.vercel?.sourceSha!==SEALED_SHA)fail('8.26.5 Vercel seal drift');
  if(Number(production.edgeOne?.verificationRunId)!==37187139894||production.edgeOne?.sourceSha!==SEALED_SHA)fail('8.26.5 EdgeOne seal drift');
  if(Number(production.customDomain?.verificationRunId)!==37187139864||production.customDomain?.sourceSha!==SEALED_SHA)fail('8.26.5 custom-domain seal drift');
}
if(candidate827&&(production.candidateRelease!=='8.27'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification'))fail('8.27 candidate production state drift');

const continuity=project?.engineering?.activeContinuity,rest=project?.engineering?.activeRestState;
for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','stableStageGeometry','reducedMotionSafe'])if(continuity?.[key]!==true)fail(`inherited 8.26 Active Continuity missing ${key}`);
if(continuity?.status!=='production-sealed-8.26-inherited')fail('8.26 inherited boundary drift');
for(const key of ['pausedTruthOwnerUnchanged','restStateBreathingSpace','restStateGrouped','restStateTonalCue','reducedMotionSafe'])if(rest?.[key]!==true)fail(`8.26.1 rest-state capability missing ${key}`);
if(!String(rest?.status||'').startsWith('production-sealed-8.26.1'))fail('8.26.1 inherited rest-state seal drift');

if(!['8.26.5','8.27'].includes(owners?.baselineRelease))fail('owner registry baseline drift');
const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826');
const restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 sealed owner registry drift');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('8.26.1 sealed rest owner registry drift');

for(const p of [
  'prepare-826-active-continuity.mjs','prepare-8261-active-rest-state.mjs','prepare-8262-active-rest-selector.mjs',
  'prepare-8263-active-rest-convergence.mjs','prepare-8264-active-rest-utility-rail.mjs','prepare-8265-recording-review-geometry.mjs',
  'postbuild-8265-recording-review-geometry-contract.mjs'
])if(!fs.existsSync(p))fail(`release surface missing ${p}`);

if(candidate827||sealed827){
  for(const p of ['lib/axis-reality-route.mjs','prepare-827-reality-route.mjs','postbuild-827-reality-route-contract.mjs','scripts/axis-827-governance-compat.mjs'])if(!fs.existsSync(p))fail(`8.27 release surface missing ${p}`);
  await import('./axis-827-governance-compat.mjs');
}

console.log(`[AXIS 8.26.1 governance compat] PASS · inherited 8.26/8.26.1 truth preserved inside ${sealed827?'sealed 8.27':candidate827?'8.27 candidate':'sealed 8.26.5'}`);
