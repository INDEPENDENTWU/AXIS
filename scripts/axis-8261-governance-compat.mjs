import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const sealed8261=project?.product?.productionRelease==='8.26.1'&&project?.product?.releaseStatus==='production-certified'&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.1'&&decision?.decision==='confirm'&&decision?.change_class==='governance'&&Number.isInteger(decision?.sequence)&&decision.sequence>=15;
const candidate8262=project?.product?.productionRelease==='8.26.2'&&project?.product?.releaseStatus==='candidate'&&project?.product?.candidatePullRequest===155&&decision?.sequence===18&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.2'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
const candidate8263=project?.product?.productionRelease==='8.26.3'&&project?.product?.releaseStatus==='candidate'&&project?.product?.candidatePullRequest===156&&decision?.sequence===19&&decision?.base_release==='8.26.2'&&decision?.release==='8.26.3'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
const candidate8264=project?.product?.productionRelease==='8.26.4'&&project?.product?.releaseStatus==='candidate'&&project?.product?.candidatePullRequest===157&&decision?.sequence===20&&decision?.base_release==='8.26.3'&&decision?.release==='8.26.4'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
if(!sealed8261&&!candidate8262&&!candidate8263&&!candidate8264)fail('current version authority must be sealed 8.26.1, exact 8.26.2 PR #155, exact 8.26.3 PR #156, or exact 8.26.4 PR #157 candidate');
if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==153)fail('8.26.1 exact Production runtime seal drift');
const production=project?.production||{};
if(production.sealedRelease!=='8.26.1'||production.vercel?.deploymentId!=='dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9'||production.vercel?.sourceSha!==SEALED_SHA||production.edgeOne?.sourceSha!==SEALED_SHA||production.customDomain?.sourceSha!==SEALED_SHA)fail('8.26.1 sealed provider snapshot drift');
if(candidate8262){
 if(production.candidateRelease!=='8.26.2'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.2 candidate production status drift');
 const v=project?.engineering?.versionDecision;if(v?.sequence!==18||v?.baseRelease!=='8.26.1'||v?.release!=='8.26.2'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('8.26.2 governed version provenance drift');
}
if(candidate8263){
 if(production.candidateRelease!=='8.26.3'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.3 candidate production status drift');
 const v=project?.engineering?.versionDecision;if(v?.sequence!==19||v?.baseRelease!=='8.26.2'||v?.release!=='8.26.3'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('8.26.3 governed version provenance drift');
}
if(candidate8264){
 if(production.candidateRelease!=='8.26.4'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.4 candidate production status drift');
 const v=project?.engineering?.versionDecision;if(v?.sequence!==20||v?.baseRelease!=='8.26.3'||v?.release!=='8.26.4'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('8.26.4 governed version provenance drift');
}
const continuity=project?.engineering?.activeContinuity,rest=project?.engineering?.activeRestState;
for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','setCuePostFactOnly','stableStageGeometry','nonOverlapping','reducedMotionSafe','quieterHomeHierarchy'])if(continuity?.[key]!==true)fail(`inherited 8.26 Active Continuity missing ${key}`);
if(continuity?.status!=='production-sealed-8.26-inherited'||continuity?.setCuePointerEvents!==false)fail('8.26 inherited boundary drift');
for(const key of ['pausedTruthOwnerUnchanged','restStateBreathingSpace','restStateGrouped','restStateTonalCue','reducedMotionSafe'])if(rest?.[key]!==true)fail(`8.26.1 rest-state capability missing ${key}`);
if(!String(rest?.status||'').startsWith('production-sealed-8.26.1')||rest?.pointerEvents!==false)fail('8.26.1 rest-state sealed boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(rest?.[key]!==false)fail(`8.26.1 acquired forbidden authority ${key}`);
const ownerBaseline=owners?.baselineRelease;if(!['8.26.1','8.26.2','8.26.3','8.26.4'].includes(ownerBaseline))fail(`owner registry baseline drift ${ownerBaseline}`);
const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826'),restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 sealed owner registry drift');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('8.26.1 sealed rest owner registry drift');
for(const path of ['prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-826-active-continuity-smoke.mjs','styles/axis-826-active-continuity.css','prepare-8261-active-rest-state.mjs','postbuild-8261-active-rest-state-contract.mjs','prepare-8262-active-rest-selector.mjs','postbuild-8262-active-rest-selector-contract.mjs'])if(!fs.existsSync(path))fail(`release surface missing ${path}`);
if(candidate8263||candidate8264)for(const path of ['prepare-8263-active-rest-convergence.mjs','postbuild-8263-active-rest-convergence-contract.mjs','scripts/axis-8263-governance-compat.mjs'])if(!fs.existsSync(path))fail(`8.26.3 release surface missing ${path}`);
if(candidate8264)for(const path of ['prepare-8264-active-rest-utility-rail.mjs','postbuild-8264-active-rest-utility-rail-contract.mjs','scripts/axis-8264-governance-compat.mjs'])if(!fs.existsSync(path))fail(`8.26.4 release surface missing ${path}`);
if(candidate8262)await import('./axis-8262-governance-compat.mjs');
if(candidate8263)await import('./axis-8263-governance-compat.mjs');
if(candidate8264)await import('./axis-8264-governance-compat.mjs');
const mode=candidate8264?'8.26.4 candidate':candidate8263?'8.26.3 candidate':candidate8262?'8.26.2 candidate':'sealed source';
console.log(`[AXIS 8.26.1 governance compat] PASS · exact 8.26.1 sealed baseline preserved inside ${mode} · owner baseline ${ownerBaseline}`);
