import fs from 'node:fs';

const read=f=>fs.readFileSync(f,'utf8');
const write=(f,s)=>fs.writeFileSync(f,s);
const decision=JSON.parse(read('governance/version-decision.json'));
const VERSION='8.26.5',SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342',PR=158;

if(decision?.sequence!==22||decision?.base_release!==VERSION||decision?.release!==VERSION||decision?.decision!=='confirm'||decision?.change_class!=='governance'){
  throw new Error('[AXIS 8.26.5 governance source] exact Production seal requires 8.26.5 -> 8.26.5 / confirm / sequence 22 / governance');
}

const p='governance/project-state.json',project=JSON.parse(read(p));
project.product.productionRelease=VERSION;
project.product.releaseStatus='production-certified';
project.product.lastSealedRelease=VERSION;
project.product.productionRuntimeSha=SEALED_SHA;
project.product.productionPullRequest=PR;
project.product.candidatePullRequest=PR;

project.production.sealedRelease=VERSION;
project.production.sealedAt='2026-10-04';
project.production.candidateRelease=VERSION;
project.production.candidateStatus='production-sealed';
project.production.evidenceScope='product-runtime-seal-snapshot';
project.production.latestDeploymentIsAuthority=false;
project.production.evidenceSemantics=`Provider IDs, source SHA and workflow evidence below are the fully sealed AXIS 8.26.5 product/runtime certification snapshot for exact merged main ${SEALED_SHA} from PR #158. Later governance-only commits or provider redeploys do not replace this product/runtime authority.`;
Object.assign(project.production.vercel,{deploymentId:'dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn',sourceSha:SEALED_SHA,state:'READY',target:'production',currentReleaseGateRunId:37187139856,deepCompatibilityGateRunId:37187139889,productionGateRunId:37187159342,publicAliasGateRunId:37187159392,exactManifestParity:'success',chromiumProductionFlow:'success',webkitCurrentReleaseFlow:'success'});
Object.assign(project.production.edgeOne,{verificationRunId:37187139894,sourceSha:SEALED_SHA,deploymentId:'dp7q7u41l4c8',packageContract:'success',deployProduction:'success',boundedFixedDomainConvergence:'success',vercelApiParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'});
Object.assign(project.production.customDomain,{verificationRunId:37187139864,sourceSha:SEALED_SHA,exactParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'});
project.production.combinedStatus={sourceSha:SEALED_SHA,vercel:'success',edgeOneProduction:'success',customDomain:'success'};

Object.assign(project.engineering,{
  activeMilestone:'AXIS 8.26.5 — Recording Review Geometry Stability',
  activePhase:'Production-sealed — governance closeout complete; next stage AXIS 8.27 Reality Route',
  activeBranch:'main',
  deliveryBranch:'fix/8265-recording-review-geometry',
  pullRequest:PR,
  pullRequestDraft:false,
  baselineRelease:VERSION,
  baselineRuntimeSha:SEALED_SHA,
  lastSealedRelease:VERSION,
  lastSealedRuntimeSha:SEALED_SHA,
  intendedProductBehaviorChange:false,
  nextProductRelease:VERSION,
  versionDecision:{sequence:22,baseRelease:VERSION,release:VERSION,decision:'confirm',changeClass:'governance'},
  nextSlice:'Begin AXIS 8.27 Reality Route with a pure continuation projection and one bounded defer-current-item interaction.'
});
if(project.engineering.activeRestUtilityRail)project.engineering.activeRestUtilityRail.status='8.26.4-merged-unsealed-inherited';
if(project.engineering.recordingReviewGeometry)project.engineering.recordingReviewGeometry.status='production-sealed-8.26.5';
if(project.presentationFoundation)project.presentationFoundation.status='AXIS 8.26.5 is Production-sealed; localization/theme authority remains unchanged.';
write(p,JSON.stringify(project,null,2)+'\n');

const op='governance/owners.json',owners=JSON.parse(read(op));
owners.baselineRelease=VERSION;
const rail=owners.owners?.find(x=>x.capability==='active-rest-utility-rail-8264');
if(rail)rail.status='presentation-only-merged-unsealed-inherited';
const geometry=owners.owners?.find(x=>x.capability==='recording-review-geometry-8265');
if(!geometry)throw new Error('[AXIS 8.26.5 governance source] recording-review-geometry owner missing');
geometry.status='presentation-only-production-sealed';
geometry.notes='AXIS 8.26.5 is Production-sealed. The canonical Review shell owns the structural estimate slot while v82 remains the estimate presentation/action owner; no factual or persistence authority is added.';
write(op,JSON.stringify(owners,null,2)+'\n');

console.log('[AXIS 8.26.5 governance source] PASS · exact Production seal converged');
