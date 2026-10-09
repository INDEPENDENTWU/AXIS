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

const downstream828=
  project?.product?.productionRelease==='8.28'&&
  project?.product?.releaseStatus==='candidate'&&
  project?.product?.lastSealedRelease==='8.27'&&
  project?.product?.productionRuntimeSha===RUNTIME_827&&
  project?.product?.productionPullRequest===160&&
  project?.product?.candidatePullRequest===162&&
  decision?.sequence===25&&decision?.base_release==='8.27'&&decision?.release==='8.28'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';

const sealed828=
  project?.product?.productionRelease==='8.28'&&project?.product?.releaseStatus==='production-certified'&&
  project?.product?.lastSealedRelease==='8.28'&&
  project?.product?.productionRuntimeSha==='df67fc0a20c0c34a79341315c8c85b5461acfe44'&&
  project?.product?.productionPullRequest===162&&project?.product?.candidatePullRequest===162&&
  decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&decision?.decision==='confirm'&&decision?.change_class==='governance';

const downstream829=
  project?.product?.productionRelease==='8.29'&&project?.product?.releaseStatus==='candidate'&&
  project?.product?.lastSealedRelease==='8.28'&&project?.product?.productionRuntimeSha==='df67fc0a20c0c34a79341315c8c85b5461acfe44'&&
  project?.product?.productionPullRequest===162&&project?.product?.candidatePullRequest===164&&
  decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
const sealed829Stage=decision?.sequence===28&&decision?.base_release==='8.29'&&decision?.release==='8.29'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const staged829=sealed829Stage||decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
if(!sealed8265&&!candidate827&&!sealed827&&!downstream828&&!sealed828&&!staged829)fail('current governance must be sealed 8.26.5, 8.27 candidate/seal, or bounded 8.28 successor/seal');

const production=project?.production||{};
if(sealed827){
  if(production.sealedRelease!=='8.27'||production.candidateStatus!=='production-sealed')fail('8.27 sealed production state drift');
  if(production.vercel?.deploymentId!=='dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm'||production.vercel?.sourceSha!==RUNTIME_827)fail('8.27 Vercel seal drift');
  if(Number(production.edgeOne?.verificationRunId)!==37333415798||production.edgeOne?.sourceSha!==RUNTIME_827)fail('8.27 EdgeOne seal drift');
  if(Number(production.customDomain?.verificationRunId)!==37333415692||production.customDomain?.sourceSha!==RUNTIME_827)fail('8.27 custom-domain seal drift');
}else if(sealed828){
  if(production.sealedRelease!=='8.28'||production.candidateStatus!=='production-sealed'||production.latestDeploymentIsAuthority!==false)fail('8.28 successor seal drift');
  if(production.vercel?.sourceSha!==project.product.productionRuntimeSha||production.edgeOne?.sourceSha!==project.product.productionRuntimeSha||production.customDomain?.sourceSha!==project.product.productionRuntimeSha)fail('8.28 provider source authority drift');
}else if(sealed829Stage){
  const exact='4a9c73b2ea5330b9cffad3f9e322eb6970dfe171';
  if(project?.product?.productionRelease!=='8.29'||project?.product?.releaseStatus!=='production-certified'||project?.product?.lastSealedRelease!=='8.29'||project?.product?.productionRuntimeSha!==exact||project?.product?.productionPullRequest!==164)fail('8.29 exact product seal drift');
  if(production.sealedRelease!=='8.29'||production.candidateRelease!=='8.29'||production.candidateStatus!=='production-sealed'||production.latestDeploymentIsAuthority!==false)fail('8.29 sealed Production status drift');
  for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==exact)fail('8.29 sealed provider source drift '+provider);
  if(production.vercel?.deploymentId!=='dpl_BJz2iaThLqFnPbTDJ4RTQdDPKNY1'||production.vercel?.state!=='READY'||production.vercel?.target!=='production')fail('8.29 verified Vercel deployment drift');
  if(production.edgeOne?.deploymentId!=='dpfctvvd321b'||production.edgeOne?.verificationRunId!==37831475199)fail('8.29 verified EdgeOne deployment drift');
  if(production.customDomain?.verificationRunId!==37831475553||production.customDomain?.exactParity!=='success')fail('8.29 verified custom domain drift');
}else if(downstream829){
  if(production.sealedRelease!=='8.28'||production.candidateRelease!=='8.29'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.29 candidate Production boundary drift');
  for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!=='df67fc0a20c0c34a79341315c8c85b5461acfe44')fail('8.29 lost sealed 8.28 provider '+provider);
}else if(downstream828){
  if(production.sealedRelease!=='8.27'||production.candidateRelease!=='8.28'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.28 successor production state drift');
  if(production.vercel?.deploymentId!=='dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm'||production.vercel?.sourceSha!==RUNTIME_827)fail('8.28 successor lost 8.27 Vercel seal');
  if(Number(production.edgeOne?.verificationRunId)!==37333415798||production.edgeOne?.sourceSha!==RUNTIME_827)fail('8.28 successor lost 8.27 EdgeOne seal');
  if(Number(production.customDomain?.verificationRunId)!==37333415692||production.customDomain?.sourceSha!==RUNTIME_827)fail('8.28 successor lost 8.27 custom-domain seal');
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

if(!['8.26.5','8.27','8.28','8.29'].includes(owners?.baselineRelease))fail('owner registry baseline drift');
const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826');
const restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 sealed owner registry drift');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('8.26.1 sealed rest owner registry drift');

for(const p of [
  'prepare-826-active-continuity.mjs','prepare-8261-active-rest-state.mjs','prepare-8262-active-rest-selector.mjs',
  'prepare-8263-active-rest-convergence.mjs','prepare-8264-active-rest-utility-rail.mjs','prepare-8265-recording-review-geometry.mjs',
  'postbuild-8265-recording-review-geometry-contract.mjs'
])if(!fs.existsSync(p))fail(`release surface missing ${p}`);

if(candidate827||sealed827||downstream828||sealed828||downstream829||sealed829Stage){
  for(const p of ['lib/axis-reality-route.mjs','prepare-827-reality-route.mjs','postbuild-827-reality-route-contract.mjs','scripts/axis-827-governance-compat.mjs'])if(!fs.existsSync(p))fail(`8.27 release surface missing ${p}`);
  await import('./axis-827-governance-compat.mjs');
}

console.log(`[AXIS 8.26.1 governance compat] PASS · inherited 8.26/8.26.1 truth preserved inside ${sealed829Stage?'sealed 8.29':downstream829?'8.29 candidate':sealed828?'sealed 8.28':downstream828?'8.28 candidate':sealed827?'sealed 8.27':candidate827?'8.27 candidate':'sealed 8.26.5'}`);
