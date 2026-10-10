import fs from 'node:fs';

// Governance-only restoration after earlier deterministic build stages project
// inherited historical states. Never modify runtime, Encounter or storage.
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const write=(path,value)=>fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');
const SHA='4a9c73b2ea5330b9cffad3f9e322eb6970dfe171';
const PRIOR='df67fc0a20c0c34a79341315c8c85b5461acfe44';
const decision=read('governance/version-decision.json');
const sealing=decision.sequence===28&&decision.base_release==='8.29'&&decision.release==='8.29'&&decision.decision==='confirm'&&decision.change_class==='governance';
const downstream831=(decision?.sequence===31&&decision?.base_release==='8.30'&&decision?.release==='8.31'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime');
const sealed830=(decision?.sequence===30&&decision?.base_release==='8.30'&&decision?.release==='8.30'&&decision?.decision==='confirm'&&decision?.change_class==='governance')||downstream831;
const inheritedBy830=(decision.sequence===29&&decision.base_release==='8.29'&&decision.release==='8.30'&&decision.decision==='bump'&&decision.change_class==='product-runtime')||sealed830;
if(!sealing&&!inheritedBy830)throw Error('[AXIS 8.29 seal] bounded exact certificate restoration requires 8.29 seal or 8.30 successor');
const cert=read('governance/production-certifications/8.29.json');
if(cert.schema!=='axis.production-certificate.v1'||cert.release!=='8.29'||cert.productRuntimeSha!==SHA||cert.productPullRequest!==164||cert.exactHeadSuccess!==33)throw Error('[AXIS 8.29 seal] invalid verified exact product certificate');
if(cert.mergedMainWorkflows?.failed!==0||cert.mergedMainWorkflows?.success!==27||cert.mergedMainWorkflows?.cancelled!==1||cert.mergedMainWorkflows?.total!==28)throw Error('[AXIS 8.29 seal] incomplete merged-main gate evidence');
if(cert.vercel?.projectId!=='prj_8JJhe0nj2CryZb4xHoHV1WBffn8f'||cert.vercel?.readyState!=='READY'||cert.vercel?.source!=='git'||cert.vercel?.aliasError!==null||!cert.vercel?.deploymentId)throw Error('[AXIS 8.29 seal] incomplete canonical Vercel certification');
if(!cert.edgeOne?.deploymentId||!cert.edgeOne?.verificationRunId||!cert.customDomain?.verificationRunId)throw Error('[AXIS 8.29 seal] provider verification evidence missing');

{
 const path='governance/project-state.json',p=read(path);
 Object.assign(p.product,{productionRelease:'8.29',releaseStatus:'production-certified',lastSealedRelease:'8.29',productionRuntimeSha:SHA,productionPullRequest:164,candidatePullRequest:164});
 Object.assign(p.production,{sealedRelease:'8.29',sealedAt:cert.certifiedAt,candidateRelease:'8.29',candidateStatus:'production-sealed',evidenceScope:'product-runtime-seal-snapshot',latestDeploymentIsAuthority:false,evidenceSemantics:'AXIS 8.29 is Production-sealed at certified exact product/runtime merged-main '+SHA+'. Governance-only commits and subsequent provider redeploys never replace that runtime authority.'});
 p.production.vercel={projectId:cert.vercel.projectId,deploymentId:cert.vercel.deploymentId,deploymentUrl:cert.vercel.deploymentUrl,publicUrl:'https://axis-five-puce.vercel.app',sourceSha:SHA,state:'READY',target:'production',source:'git',aliasError:null,currentReleaseGateRunId:cert.vercel.currentReleaseGateRunId,deepCompatibilityGateRunId:cert.vercel.deepCompatibilityGateRunId,productionGateRunId:cert.vercel.productionGateRunId,exactManifestParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'};
 p.production.edgeOne={publicUrl:'https://axisfitness-mirror-9x91gveo.edgeone.cool',projectId:'makers-bxiu1vmyd0ba',policy:'exact-prebuilt-artifact-mirror',verificationRunId:cert.edgeOne.verificationRunId,sourceSha:SHA,packageContract:'success',deployProduction:'success',boundedFixedDomainConvergence:'success',vercelApiParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success',deploymentId:cert.edgeOne.deploymentId};
 p.production.customDomain={publicUrl:'https://axis.juele.fun',verificationRunId:cert.customDomain.verificationRunId,sourceSha:SHA,exactParity:'success',chromiumProductionFlow:'success',webkitProductionFlow:'success'};
 p.production.combinedStatus={sourceSha:SHA,vercel:'success',edgeOneProduction:'success',customDomain:'success'};
 Object.assign(p.engineering,{activeMilestone:'AXIS 8.29 — Recording Friction Collapse',activePhase:'Production-sealed — compatible confirmed recall, preserved drafts, canonical save guard',activeBranch:'main',deliveryBranch:'main',pullRequest:164,pullRequestDraft:false,baselineRelease:'8.29',baselineRuntimeSha:SHA,lastSealedRelease:'8.29',lastSealedRuntimeSha:SHA,intendedProductBehaviorChange:false,nextProductRelease:'8.29',versionDecision:{sequence:28,baseRelease:'8.29',release:'8.29',decision:'confirm',changeClass:'governance'},nextSlice:"Next bounded AXIS 8.30 — Object Identity Integrity: audit and repair distinct catalog, search-picker, and recording Object identities with explicit historical compatibility before introducing Playable Practice (PLAY THIS, AIR, TAKE, FORK)."});
 p.engineering.practiceLoop={...(p.engineering.practiceLoop||{}),status:'production-sealed-8.28',pureOwner:'lib/axis-practice-loop.mjs',projectionSchema:'axis.practice-loop.v1',reloadSafe:true,promptOnRestore:false,newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,productionRuntimeSha:PRIOR,productionPullRequest:162};
 p.engineering.recordingFriction={status:'production-sealed-8.29',pureOwner:'lib/axis-recording-continuity.mjs',projectionSchema:'axis.recording-continuity.v1',existingRecorderOwner:'app.js+v874',existingEncounterOwner:'app.js',priorConfirmedMetricsAreOnlySuggestions:true,needsExplicitSave:true,compatibleTypeAndUnitRequired:true,inSheetRerenderPreservesEdits:true,oneInFlightSave:true,newStorageNamespace:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,historicalEncounterRewrite:false,flowDefinitionMutation:false,network:false,ai:false,browsers:['chromium','webkit'],productionProviders:['Vercel','EdgeOne','axis.juele.fun'],productionRuntimeSha:SHA,productionPullRequest:164,productionCertification:{...cert}};
 if(p.crossPlatform?.portableContracts&&!p.crossPlatform.portableContracts.includes('axis.recording-continuity.v1'))p.crossPlatform.portableContracts.push('axis.recording-continuity.v1');
 write(path,p);
}
{
 const path='governance/owners.json',o=read(path);o.baselineRelease='8.29';
 const owner=o.owners?.find(x=>x.capability==='recording-friction-collapse-829');
 if(!owner)throw Error('[AXIS 8.29 seal] recording presentation owner missing');
 Object.assign(owner,{status:'derived-presentation-production-sealed',contract:'axis.recording-continuity.v1',storage:'none',notes:'Production-sealed at exact runtime '+SHA+'. Read-only recall and transient recorder draft preservation; canonical app Encounter/Session/Active/media owners unchanged.'});
 write(path,o);
}
console.log('[AXIS 8.29 seal] exact product/runtime and Vercel/EdgeOne/custom-domain certification restored; governance does not replace product authority');
