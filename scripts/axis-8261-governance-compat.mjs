import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

const sourceDecision=json('governance/version-decision.json');
if(sourceDecision?.release==='8.26.5')await import('./axis-8265-governance-source-convergence.mjs');

const SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');

if(project?.product?.productionRelease!=='8.26.5'||project?.product?.releaseStatus!=='production-certified')fail('current governed release must be Production-sealed 8.26.5');
if(project?.product?.lastSealedRelease!=='8.26.5'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==158||project?.product?.candidatePullRequest!==158)fail('exact 8.26.5 Production seal identity drift');
if(decision?.sequence!==22||decision?.base_release!=='8.26.5'||decision?.release!=='8.26.5'||decision?.decision!=='confirm'||decision?.change_class!=='governance')fail('8.26.5 governance closeout decision drift');

const production=project?.production||{};
if(production.sealedRelease!=='8.26.5'||production.candidateRelease!=='8.26.5'||production.candidateStatus!=='production-sealed')fail('8.26.5 Production seal status drift');
if(production.vercel?.deploymentId!=='dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn'||production.vercel?.sourceSha!==SEALED_SHA)fail('8.26.5 Vercel seal drift');
if(Number(production.vercel?.currentReleaseGateRunId)!==37187139856||Number(production.vercel?.deepCompatibilityGateRunId)!==37187139889||Number(production.vercel?.productionGateRunId)!==37187159342||Number(production.vercel?.publicAliasGateRunId)!==37187159392)fail('8.26.5 Vercel/current/deep run identity drift');
if(Number(production.edgeOne?.verificationRunId)!==37187139894||production.edgeOne?.sourceSha!==SEALED_SHA)fail('8.26.5 EdgeOne seal drift');
if(Number(production.customDomain?.verificationRunId)!==37187139864||production.customDomain?.sourceSha!==SEALED_SHA)fail('8.26.5 custom-domain seal drift');

const continuity=project?.engineering?.activeContinuity,rest=project?.engineering?.activeRestState;
for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','stableStageGeometry','reducedMotionSafe'])if(continuity?.[key]!==true)fail(`inherited 8.26 Active Continuity missing ${key}`);
if(continuity?.status!=='production-sealed-8.26-inherited')fail('8.26 inherited boundary drift');
for(const key of ['pausedTruthOwnerUnchanged','restStateBreathingSpace','restStateGrouped','restStateTonalCue','reducedMotionSafe'])if(rest?.[key]!==true)fail(`8.26.1 rest-state capability missing ${key}`);
if(!String(rest?.status||'').startsWith('production-sealed-8.26.1'))fail('8.26.1 inherited rest-state seal drift');

if(owners?.baselineRelease!=='8.26.5')fail('owner registry baseline must be 8.26.5');
const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826');
const restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 sealed owner registry drift');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('8.26.1 sealed rest owner registry drift');

for(const path of [
  'prepare-826-active-continuity.mjs',
  'prepare-8261-active-rest-state.mjs',
  'prepare-8262-active-rest-selector.mjs',
  'prepare-8263-active-rest-convergence.mjs',
  'prepare-8264-active-rest-utility-rail.mjs',
  'prepare-8265-recording-review-geometry.mjs',
  'postbuild-8265-recording-review-geometry-contract.mjs',
  'scripts/axis-8265-governance-compat.mjs',
  'scripts/axis-8265-recording-review-geometry-smoke.mjs'
])if(!fs.existsSync(path))fail(`release surface missing ${path}`);

await import('./axis-8265-governance-compat.mjs');

console.log('[AXIS 8.26.1 governance compat] PASS · inherited 8.26/8.26.1 truth preserved inside exact Production-sealed 8.26.5');
