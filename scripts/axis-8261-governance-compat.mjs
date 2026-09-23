import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const sealed8261=project?.product?.productionRelease==='8.26.1'&&project?.product?.releaseStatus==='production-certified'&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.1'&&decision?.decision==='confirm'&&decision?.change_class==='governance'&&Number.isInteger(decision?.sequence)&&decision.sequence>=15;
const candidate8262=project?.product?.productionRelease==='8.26.2'&&project?.product?.releaseStatus==='candidate'&&project?.product?.candidatePullRequest===155&&decision?.sequence===18&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.2'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
if(!sealed8261&&!candidate8262)fail('current version authority must be sealed 8.26.1 or exact 8.26.2 PR #155 candidate');
if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==153)fail('8.26.1 exact Production runtime seal drift');
const production=project?.production||{};
if(production.sealedRelease!=='8.26.1'||production.vercel?.deploymentId!=='dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9'||production.vercel?.sourceSha!==SEALED_SHA||production.edgeOne?.sourceSha!==SEALED_SHA||production.customDomain?.sourceSha!==SEALED_SHA)fail('8.26.1 sealed provider snapshot drift');
if(candidate8262){
 if(production.candidateRelease!=='8.26.2'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.2 candidate production status drift');
 const v=project?.engineering?.versionDecision;if(v?.sequence!==18||v?.baseRelease!=='8.26.1'||v?.release!=='8.26.2'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('8.26.2 governed version provenance drift');
}
const continuity=project?.engineering?.activeContinuity,rest=project?.engineering?.activeRestState;
for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','setCuePostFactOnly','stableStageGeometry','nonOverlapping','reducedMotionSafe','quieterHomeHierarchy'])if(continuity?.[key]!==true)fail(`inherited 8.26 Active Continuity missing ${key}`);
if(continuity?.status!=='production-sealed-8.26-inherited'||continuity?.setCuePointerEvents!==false)fail('8.26 inherited boundary drift');
for(const key of ['pausedTruthOwnerUnchanged','restStateBreathingSpace','restStateGrouped','restStateTonalCue','reducedMotionSafe'])if(rest?.[key]!==true)fail(`8.26.1 rest-state capability missing ${key}`);
if(!String(rest?.status||'').startsWith('production-sealed-8.26.1')||rest?.pointerEvents!==false)fail('8.26.1 rest-state sealed boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(rest?.[key]!==false)fail(`8.26.1 acquired forbidden authority ${key}`);
const ownerBaseline=owners?.baselineRelease;if(!['8.26.1','8.26.2'].includes(ownerBaseline))fail(`owner registry baseline drift ${ownerBaseline}`);
const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826'),restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 sealed owner registry drift');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('8.26.1 sealed rest owner registry drift');
for(const path of ['prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-826-active-continuity-smoke.mjs','styles/axis-826-active-continuity.css','prepare-8261-active-rest-state.mjs','postbuild-8261-active-rest-state-contract.mjs','prepare-8262-active-rest-selector.mjs','postbuild-8262-active-rest-selector-contract.mjs'])if(!fs.existsSync(path))fail(`release surface missing ${path}`);
console.log(`[AXIS 8.26.1 governance compat] PASS · exact 8.26.1 sealed baseline preserved inside ${candidate8262?'8.26.2 candidate':'sealed source'} · owner baseline ${ownerBaseline}`);
