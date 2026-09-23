import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const count=(s,n)=>s.split(n).length-1;
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=count(s,from);if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const replaceAllExact=(s,from,to,label)=>{if(s.includes(to)&&!s.includes(from))return s;const n=count(s,from);if(!n)fail(`${label} source token missing`);return s.replaceAll(from,to)};

const SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const exactDecision=decision?.sequence===14&&decision?.base_release==='8.26'&&decision?.release==='8.26.1'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
if(!exactDecision)fail('version decision must be 8.26 -> 8.26.1 / bump / sequence 14 / bug-fix');
if(project?.product?.productionRelease!=='8.26.1'||project?.product?.releaseStatus!=='production-certified')fail('8.26.1 sealed project state drift');
if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_SHA)fail('8.26.1 exact Production runtime seal drift');
if(project?.product?.productionPullRequest!==153||project?.product?.candidatePullRequest!==153)fail('8.26.1 PR identity drift');
if(project?.engineering?.deliveryBranch!=='fix/8261-active-rest-state'||project?.engineering?.pullRequest!==153||project?.engineering?.pullRequestDraft!==false)fail('8.26.1 completed delivery identity drift');
if(project?.engineering?.baselineRelease!=='8.26.1'||project?.engineering?.nextProductRelease!=='8.26.1')fail('8.26.1 engineering release identity drift');
if(project?.engineering?.baselineRuntimeSha!==SEALED_SHA||project?.engineering?.lastSealedRuntimeSha!==SEALED_SHA)fail('8.26.1 engineering runtime seal drift');
if(owners?.baselineRelease!=='8.26.1')fail('owner registry baseline must be 8.26.1');

const production=project?.production||{};
if(production.sealedRelease!=='8.26.1'||production.candidateRelease!=='8.26.1'||production.candidateStatus!=='production-sealed')fail('8.26.1 Production seal status drift');
if(!String(production.evidenceSemantics||'').includes('fully sealed AXIS 8.26.1'))fail('8.26.1 Production evidence semantics drift');
const vercel=production.vercel||{},edge=production.edgeOne||{},custom=production.customDomain||{};
if(vercel.deploymentId!=='dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9'||vercel.sourceSha!==SEALED_SHA||vercel.state!=='READY'||vercel.target!=='production')fail('8.26.1 Vercel Production identity drift');
if(Number(vercel.currentReleaseGateRunId)!==35873718900||Number(vercel.deepCompatibilityGateRunId)!==35873718880||Number(vercel.productionGateRunId)!==35873771687||Number(vercel.publicAliasGateRunId)!==35873771699)fail('8.26.1 Vercel/current/deep certification run drift');
if(Number(edge.verificationRunId)!==35873718809||edge.sourceSha!==SEALED_SHA)fail('8.26.1 EdgeOne seal evidence drift');
if(Number(custom.verificationRunId)!==35873719011||custom.sourceSha!==SEALED_SHA)fail('8.26.1 custom-domain seal evidence drift');

const continuity=project?.engineering?.activeContinuity,rest=project?.engineering?.activeRestState;
for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','setCuePostFactOnly','stableStageGeometry','nonOverlapping','reducedMotionSafe','quieterHomeHierarchy'])if(continuity?.[key]!==true)fail(`inherited 8.26 Active Continuity missing ${key}`);
if(continuity?.status!=='production-sealed-8.26-inherited'||continuity?.setCuePointerEvents!==false)fail('8.26 inherited status/pointer boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(continuity?.[key]!==false)fail(`8.26 inherited authority drift ${key}`);
for(const key of ['pausedTruthOwnerUnchanged','restStateBreathingSpace','restStateGrouped','restStateTonalCue','reducedMotionSafe'])if(rest?.[key]!==true)fail(`8.26.1 rest-state capability missing ${key}`);
if(rest?.status!=='production-sealed-8.26.1'||rest?.pointerEvents!==false)fail('8.26.1 sealed rest-state status/pointer boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(rest?.[key]!==false)fail(`8.26.1 acquired forbidden authority ${key}`);
const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826'),restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 sealed owner registry drift');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('8.26.1 sealed rest owner registry drift');

for(const path of ['prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-826-active-continuity-smoke.mjs','styles/axis-826-active-continuity.css','prepare-8261-active-rest-state.mjs','postbuild-8261-active-rest-state-contract.mjs'])if(!fs.existsSync(path))fail(`8.26.1 inherited/current release surface missing ${path}`);
const workflows=[
 ['.github/workflows/axis-current-release-gate.yml','Current Release',2],
 ['.github/workflows/axis-edgeone-production-mirror.yml','EdgeOne Production',2],
 ['.github/workflows/axis-custom-domain-production.yml','axis.juele.fun',2],
 ['.github/workflows/axis-production-deployment-gate.yml','fixed Vercel Production',1]
];
for(const [path,label,want] of workflows){const s=read(path);if(count(s,'node scripts/axis-826-active-continuity-smoke.mjs')!==want)fail(`${label} must preserve inherited/current 8.26 physical chain ${want} time(s)`)}

{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const oldSteps="const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 const nextSteps="const expectedSteps=CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 s=replaceOnce(s,oldSteps,nextSteps,'repository deterministic step family');
 for(const [from,to,label] of [
  ["['8.22','8.23','8.24','8.24.1','8.25']","['8.22','8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1']",'repository inherited replay family'],
  ["['8.23','8.24','8.24.1','8.25']","['8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1']",'repository inherited continuity family'],
  ["['8.24','8.24.1','8.25']","['8.24','8.24.1','8.25','8.25.1','8.26','8.26.1']",'repository inherited tactile family'],
  ["['8.24.1','8.25']","['8.24.1','8.25','8.25.1','8.26','8.26.1']",'repository inherited dock family']
 ])s=replaceAllExact(s,from,to,label);
 const block=`if(CURRENT==='8.26.1'){
  if(STATUS!=='production-certified'||SEALED!=='8.26.1'||PROD_SHA!=='${SEALED_SHA}')fail('8.26.1 must be exact Production-certified sealed runtime');
  if(project?.product?.productionPullRequest!==153||project?.product?.candidatePullRequest!==153)fail('8.26.1 PR identity drift');
  if(project?.engineering?.deliveryBranch!=='fix/8261-active-rest-state'||project?.engineering?.pullRequest!==153||project?.engineering?.pullRequestDraft!==false)fail('8.26.1 completed delivery identity drift');
  if(project?.engineering?.versionDecision?.sequence!==14||project?.engineering?.versionDecision?.baseRelease!=='8.26'||project?.engineering?.versionDecision?.release!=='8.26.1'||project?.engineering?.versionDecision?.decision!=='bump'||project?.engineering?.versionDecision?.changeClass!=='bug-fix')fail('8.26.1 governed version decision drift');
  const c=project?.engineering?.activeContinuity,r=project?.engineering?.activeRestState;if(c?.status!=='production-sealed-8.26-inherited')fail('8.26.1 lost sealed 8.26 inheritance');if(r?.status!=='production-sealed-8.26.1')fail('8.26.1 rest-state seal drift');for(const key of ['pausedTruthOwnerUnchanged','restStateBreathingSpace','restStateGrouped','restStateTonalCue','reducedMotionSafe'])if(r?.[key]!==true)fail('8.26.1 rest capability missing '+key);
}

`;
 s=replaceOnce(s,'const required=[',block+'const required=[','repository 8.26.1 sealed governance block');
 const ownerBlock=`if(CURRENT==='8.26.1'){const c=(owners.owners||[]).find(x=>x.capability==='active-continuity-826'),r=(owners.owners||[]).find(x=>x.capability==='active-rest-state-8261');if(c?.status!=='presentation-and-coordination-production-sealed'||c?.storage!=='none')fail('8.26.1 lost sealed 8.26 owner');if(r?.status!=='presentation-only-production-sealed'||r?.storage!=='none')fail('8.26.1 sealed rest owner registry drift')}
`;
 s=replaceOnce(s,"const build=read('build-release.mjs');",ownerBlock+"const build=read('build-release.mjs');",'repository 8.26.1 owner block');
 const chain=`if(CURRENT==='8.26.1'){const p=read('prepare-826-active-continuity.mjs'),p1=read('prepare-8261-active-rest-state.mjs'),pb=read('postbuild-8261-active-rest-state-contract.mjs');if(!p.includes("const FROM='8.25.1',VERSION='8.26'"))fail('8.26 inherited release transition drift');if(!p1.includes("const FROM='8.26',VERSION='8.26.1'"))fail('8.26.1 release transition drift');if(!build.includes("'prepare-826-active-continuity.mjs'")||!build.includes("'prepare-8261-active-rest-state.mjs'"))fail('8.26/8.26.1 prepare chain is not deterministic build authority');if(!pb.includes('activeRestState8261:true'))fail('8.26.1 postbuild contract marker missing')}

`;
 s=replaceOnce(s,"const convergenceDriver=read('prepare-8151-regression-seal.mjs');",chain+"const convergenceDriver=read('prepare-8151-regression-seal.mjs');",'repository 8.26.1 chain block');
 write(f,s);
}
{
 const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
 s=replaceOnce(s,"if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}","if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}\nif(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}",'Production release owner map');
 s=replaceAllExact(s,"['8.24.1','8.25']","['8.24.1','8.25','8.25.1','8.26','8.26.1']",'Production inherited physical family');
 const block=`else if(CURRENT==='8.26.1'){
  if(candidate||STATUS!=='production-certified'||SEALED!=='8.26.1')fail('8.26.1 must be Production-certified and sealed');
  if(RUNTIME_SHA!=='${SEALED_SHA}'||SEALED_PR!==153)fail('8.26.1 exact product/runtime seal identity drift');
  if(project?.production?.candidateRelease!=='8.26.1'||project?.production?.candidateStatus!=='production-sealed')fail('8.26.1 Production status drift');
  if(CANDIDATE_PR!==153||project?.engineering?.pullRequest!==153||project?.engineering?.pullRequestDraft!==false)fail('8.26.1 completed PR identity drift');
  if(project?.engineering?.activeMilestone!=='AXIS 8.26.1 — Active Rest State'||project?.engineering?.deliveryBranch!=='fix/8261-active-rest-state')fail('8.26.1 milestone/delivery identity drift');
  if(!(decision?.sequence===14&&decision?.base_release==='8.26'&&decision?.release==='8.26.1'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix'))fail('8.26.1 version decision drift');
  if(!String(project?.production?.evidenceSemantics||'').includes('fully sealed AXIS 8.26.1'))fail('8.26.1 sealed evidence semantics drift');
  const p=project?.production||{};if(p.vercel?.deploymentId!=='dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9'||Number(p.vercel?.currentReleaseGateRunId)!==35873718900||Number(p.vercel?.deepCompatibilityGateRunId)!==35873718880||Number(p.vercel?.productionGateRunId)!==35873771687||Number(p.vercel?.publicAliasGateRunId)!==35873771699)fail('8.26.1 Vercel seal evidence drift');if(Number(p.edgeOne?.verificationRunId)!==35873718809||Number(p.customDomain?.verificationRunId)!==35873719011)fail('8.26.1 EdgeOne/custom-domain seal evidence drift');
}`;
 s=replaceOnce(s,"}else if(CURRENT==='8.23'){",'}'+block+"else if(CURRENT==='8.23'){",'Production 8.26.1 sealed block');
 const proof=`if(CURRENT==='8.26.1'){for(const [text,label,want] of [[currentWorkflow,'Current Release',2],[edgeWorkflow,'EdgeOne Production',2],[customWorkflow,'axis.juele.fun',2],[vercelWorkflow,'fixed Vercel Production',1]])if(count(text,'node scripts/axis-826-active-continuity-smoke.mjs')!==want)fail(label+' must prove inherited 8.26 plus sealed 8.26.1 rest-state regression '+want+' time(s)');}
`;
 s=replaceOnce(s,"if(CURRENT==='8.25'){\n  const inheritedSmoke=read('scripts/axis-8241-dock-occlusion-smoke.mjs');",proof+"if(CURRENT==='8.25'){\n  const inheritedSmoke=read('scripts/axis-8241-dock-occlusion-smoke.mjs');",'Production 8.26.1 physical proof block');
 write(f,s);
}

console.log('[AXIS 8.26.1 governance compat] PASS · exact d187123 Product/runtime seal · Vercel / EdgeOne / axis.juele.fun certification recorded · ownership assertions remain fail-closed');
