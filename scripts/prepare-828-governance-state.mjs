import fs from 'node:fs';

const SHA='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n');
const decision=read('governance/version-decision.json');
const sealCloseout=decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const seal829Stage=decision?.sequence===28&&decision?.base_release==='8.29'&&decision?.release==='8.29'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const downstream830=decision?.sequence===29&&decision?.base_release==='8.29'&&decision?.release==='8.30'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'||(decision?.sequence===31&&decision?.base_release==='8.30'&&decision?.release==='8.31'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime');
const downstream829=downstream830||seal829Stage||decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
if(!sealCloseout&&!downstream829){


{
  const f='governance/project-state.json',x=read(f);
  Object.assign(x.product,{productionRelease:'8.28',releaseStatus:'candidate',lastSealedRelease:'8.27',productionRuntimeSha:SHA,productionPullRequest:160,candidatePullRequest:162});
  Object.assign(x.production,{sealedRelease:'8.27',candidateRelease:'8.28',candidateStatus:'pending-exact-head-and-merged-main-certification',evidenceScope:'product-runtime-seal-snapshot',latestDeploymentIsAuthority:false});
  Object.assign(x.production.vercel||={}, {sourceSha:SHA,deploymentId:'dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm',currentReleaseGateRunId:37333415838,deepCompatibilityGateRunId:37333415780,productionGateRunId:37333475667,publicAliasGateRunId:37333475632,state:'READY',target:'production',exactManifestParity:'success',chromiumProductionFlow:'success'});
  Object.assign(x.production.edgeOne||={}, {sourceSha:SHA,deploymentId:'dpmrug23mtim',verificationRunId:37333415798,packageContract:'success',deployProduction:'success',boundedFixedDomainConvergence:'success',vercelApiParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'});
  Object.assign(x.production.customDomain||={}, {sourceSha:SHA,verificationRunId:37333415692,exactParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'});
  x.production.combinedStatus={sourceSha:SHA,vercel:'success',edgeOneProduction:'success',customDomain:'success'};
  Object.assign(x.engineering,{activeMilestone:'AXIS 8.28 — Practice Loop Convergence',activePhase:'Product runtime candidate — resume-safe practice loop',activeBranch:'main',deliveryBranch:'feature/828-practice-loop-convergence',pullRequest:162,pullRequestDraft:false,baselineRelease:'8.28',baselineRuntimeSha:SHA,lastSealedRelease:'8.27',lastSealedRuntimeSha:SHA,intendedProductBehaviorChange:true,nextProductRelease:'8.28',versionDecision:{sequence:25,baseRelease:'8.27',release:'8.28',decision:'bump',changeClass:'product-runtime'}});
  x.engineering.realityRoute={...(x.engineering.realityRoute||{}),status:'production-sealed-8.27',pureOwner:'lib/axis-reality-route.mjs',projectionSchema:'axis.reality-route.v1',temporaryConstraintSchema:'axis.execution-constraints.v1',newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,manualDetourConsumesFlowStep:false,activeItemDeferrable:false,deferredItemsReturnAfterImmediateRoute:true,reasonCodes:true,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,productionRuntimeSha:SHA,productionPullRequest:160};
  x.engineering.practiceLoop={status:'8.28-release-candidate',pureOwner:'lib/axis-practice-loop.mjs',projectionSchema:'axis.practice-loop.v1',reloadSafe:true,promptOnRestore:false,pageshowRefresh:true,visibilityRefresh:true,newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false};
  if(x.crossPlatform&&!x.crossPlatform.portableContracts.includes('axis.practice-loop.v1'))x.crossPlatform.portableContracts.push('axis.practice-loop.v1');
  write(f,x);
}
{
  const f='governance/owners.json',x=read(f);x.baselineRelease='8.28';
  const rr=x.owners?.find(o=>o.capability==='flow-reality-route-827');
  if(rr)rr.status='derived-runtime-production-sealed';
  let loop=x.owners?.find(o=>o.capability==='practice-loop-convergence-828');
  if(!loop){loop={capability:'practice-loop-convergence-828',owner:'lib/axis-practice-loop.mjs + existing app.js Flow presentation bridge'};x.owners.push(loop)}
  Object.assign(loop,{status:'derived-runtime-release-candidate',contract:'axis.practice-loop.v1',storage:'none'});
  write(f,x);
}
 }else if(sealCloseout){
  await import('./prepare-828-sealed-governance.mjs');
  const project=read('governance/project-state.json'),owners=read('governance/owners.json'),runtime='df67fc0a20c0c34a79341315c8c85b5461acfe44';
  if(project.product?.productionRelease!=='8.28'||project.product?.releaseStatus!=='production-certified'||project.product?.productionRuntimeSha!==runtime||project.product?.lastSealedRelease!=='8.28'||project.production?.sealedRelease!=='8.28'||project.production?.latestDeploymentIsAuthority!==false)throw Error('[AXIS 8.28 governance state] sealed runtime authority drift');
  const owner=owners.owners?.find(x=>x.capability==='practice-loop-convergence-828');
  if(owner?.status!=='derived-runtime-production-sealed'||owner?.storage!=='none')throw Error('[AXIS 8.28 governance state] sealed Practice Loop owner drift');
}
console.log('[AXIS 8.28 governance state] '+(downstream829?'downstream 8.29 governance preserved':sealCloseout?'exact Production seal preserved':'exact candidate state restored after historical release transforms'));
