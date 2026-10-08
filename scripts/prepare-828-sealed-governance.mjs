import fs from 'node:fs';

// Reconstruct the exact certified governance snapshot after historical
// deterministic build stages temporarily project earlier release states.
// This is governance-only. It never touches app/runtime source, storage or
// existing factual owners.
const SHA='df67fc0a20c0c34a79341315c8c85b5461acfe44';
const prior='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n');
const d=read('governance/version-decision.json');
if(d.sequence!==26||d.base_release!=='8.28'||d.release!=='8.28'||d.decision!=='confirm'||d.change_class!=='governance')throw Error('[AXIS 8.28 Production seal] source version decision is not governance sequence 26');

{
  const f='governance/project-state.json',x=read(f);
  Object.assign(x.product,{productionRelease:'8.28',releaseStatus:'production-certified',lastSealedRelease:'8.28',productionRuntimeSha:SHA,productionPullRequest:162,candidatePullRequest:162});
  Object.assign(x.production,{sealedRelease:'8.28',sealedAt:'2026-10-08',candidateRelease:'8.28',candidateStatus:'production-sealed',evidenceScope:'product-runtime-seal-snapshot',latestDeploymentIsAuthority:false,evidenceSemantics:'AXIS 8.28 Practice Loop Convergence is Production-sealed at exact merged-main runtime SHA '+SHA+'. Later governance-only commits or provider redeploys do not replace this runtime authority.'});
  x.production.vercel={projectId:'prj_8JJhe0nj2CryZb4xHoHV1WBffn8f',deploymentId:'dpl_3FLstNd9rvptfaA3YP1THwWfoazF',deploymentUrl:'https://axis-3gr3qcc9j-independentwus-projects.vercel.app',publicUrl:'https://axis-five-puce.vercel.app',sourceSha:SHA,state:'READY',target:'production',currentReleaseGateRunId:37759608238,deepCompatibilityGateRunId:37759608259,productionGateRunId:37759655524,publicAliasGateRunId:37759655542,exactManifestParity:'success',chromiumProductionFlow:'success'};
  x.production.edgeOne={publicUrl:'https://axisfitness-mirror-9x91gveo.edgeone.cool',projectId:'makers-bxiu1vmyd0ba',policy:'exact-prebuilt-artifact-mirror',verificationRunId:37759608127,sourceSha:SHA,packageContract:'success',deployProduction:'success',boundedFixedDomainConvergence:'success',vercelApiParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success',deploymentId:'dpxaahz57drn'};
  x.production.customDomain={publicUrl:'https://axis.juele.fun',verificationRunId:37759608391,sourceSha:SHA,exactParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'};
  x.production.combinedStatus={sourceSha:SHA,vercel:'success',edgeOneProduction:'success',customDomain:'success'};
  Object.assign(x.engineering,{activeMilestone:'AXIS 8.28 — Practice Loop Convergence',activePhase:'Production-sealed — resume-safe Flow → Reality Route → Active → Encounter → continuation',activeBranch:'main',deliveryBranch:'main',pullRequest:162,pullRequestDraft:false,baselineRelease:'8.28',baselineRuntimeSha:SHA,lastSealedRelease:'8.28',lastSealedRuntimeSha:SHA,intendedProductBehaviorChange:false,nextProductRelease:'8.28',versionDecision:{sequence:26,baseRelease:'8.28',release:'8.28',decision:'confirm',changeClass:'governance'},nextSlice:'Begin the next bounded AXIS product-runtime stage only with a fresh version decision. Prioritize Recording Friction Collapse, then metric-aware Evolution truth and Home continuity.'});
  x.engineering.realityRoute={...(x.engineering.realityRoute||{}),status:'production-sealed-8.27',pureOwner:'lib/axis-reality-route.mjs',projectionSchema:'axis.reality-route.v1',temporaryConstraintSchema:'axis.execution-constraints.v1',newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,manualDetourConsumesFlowStep:false,activeItemDeferrable:false,deferredItemsReturnAfterImmediateRoute:true,reasonCodes:true,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,productionRuntimeSha:prior,productionPullRequest:160};
  x.engineering.practiceLoop={...(x.engineering.practiceLoop||{}),status:'production-sealed-8.28',pureOwner:'lib/axis-practice-loop.mjs',projectionSchema:'axis.practice-loop.v1',reloadSafe:true,promptOnRestore:false,pageshowRefresh:true,visibilityRefresh:true,newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,productionRuntimeSha:SHA,productionPullRequest:162,productionCertification:{exactHeadSha:'dee53456da37beff3dae815407c77ba2598c0887',mergedMainSha:SHA,exactHeadWorkflowRuns:'31/31 success',mergedMainWorkflowRuns:'30/30 success',vercelDeploymentId:'dpl_3FLstNd9rvptfaA3YP1THwWfoazF',vercelProductionGateRunId:37759655524,publicAliasGateRunId:37759655542,edgeOneProductionRunId:37759608127,edgeOneDeploymentId:'dpxaahz57drn',customDomainRunId:37759608391}};
  if(x.crossPlatform?.portableContracts&&!x.crossPlatform.portableContracts.includes('axis.practice-loop.v1'))x.crossPlatform.portableContracts.push('axis.practice-loop.v1');
  write(f,x);
}
{
  const f='governance/owners.json',x=read(f);x.baselineRelease='8.28';
  const rr=x.owners?.find(o=>o.capability==='flow-reality-route-827');
  if(rr)rr.status='derived-runtime-production-sealed';
  const owner=x.owners?.find(o=>o.capability==='practice-loop-convergence-828');
  if(!owner)throw Error('[AXIS 8.28 Production seal] Practice Loop owner absent');
  Object.assign(owner,{status:'derived-runtime-production-sealed',contract:'axis.practice-loop.v1',storage:'none',notes:'Production-sealed at exact runtime '+SHA+'. Derived continuity/presentation only; no new fact, storage, network, AI or lifecycle owner.'});
  write(f,x);
}
console.log('[AXIS 8.28 Production seal] exact source/runtime and provider snapshot restored after inherited release stages');
