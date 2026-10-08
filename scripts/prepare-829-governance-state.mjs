import fs from 'node:fs';

const LAST='df67fc0a20c0c34a79341315c8c85b5461acfe44';
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
const write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n');
const decision=read('governance/version-decision.json');
if(decision?.sequence!==27||decision?.base_release!=='8.28'||decision?.release!=='8.29'||decision?.decision!=='bump'||decision?.change_class!=='product-runtime')throw Error('[AXIS 8.29 governance] expected version decision sequence 27');
{
 const f='governance/project-state.json',x=read(f);
 Object.assign(x.product,{productionRelease:'8.29',releaseStatus:'candidate',lastSealedRelease:'8.28',productionRuntimeSha:LAST,productionPullRequest:162,candidatePullRequest:164});
 Object.assign(x.production,{sealedRelease:'8.28',candidateRelease:'8.29',candidateStatus:'pending-exact-head-and-merged-main-certification',latestDeploymentIsAuthority:false,evidenceScope:'product-runtime-seal-snapshot',evidenceSemantics:'Provider evidence remains the exact certified AXIS 8.28 runtime at '+LAST+' until AXIS 8.29 completes exact-head, merged-main and provider certification.'});
 for(const provider of ['vercel','edgeOne','customDomain'])if(x.production?.[provider])x.production[provider].sourceSha=LAST;
 x.production.combinedStatus={sourceSha:LAST,vercel:'success',edgeOneProduction:'success',customDomain:'success'};
 Object.assign(x.engineering,{activeMilestone:'AXIS 8.29 — Recording Friction Collapse',activePhase:'Product-runtime candidate — safe Record continuity and explicit reuse',activeBranch:'main',deliveryBranch:'feature/829-recording-friction-collapse',pullRequest:164,pullRequestDraft:false,baselineRelease:'8.29',baselineRuntimeSha:LAST,lastSealedRelease:'8.28',lastSealedRuntimeSha:LAST,intendedProductBehaviorChange:true,nextProductRelease:'8.29',versionDecision:{sequence:27,baseRelease:'8.28',release:'8.29',decision:'bump',changeClass:'product-runtime'}});
 x.engineering.practiceLoop={...(x.engineering.practiceLoop||{}),status:'production-sealed-8.28',pureOwner:'lib/axis-practice-loop.mjs',projectionSchema:'axis.practice-loop.v1',reloadSafe:true,promptOnRestore:false,newStorageNamespace:false,flowDefinitionMutation:false,historicalEncounterRewrite:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,network:false,ai:false,productionRuntimeSha:LAST,productionPullRequest:162};
 x.engineering.recordingFriction={status:'8.29-release-candidate',pureOwner:'lib/axis-recording-continuity.mjs',projectionSchema:'axis.recording-continuity.v1',existingRecorderOwner:'app.js+v874',existingEncounterOwner:'app.js',priorConfirmedMetricsAreOnlySuggestions:true,needsExplicitSave:true,compatibleTypeAndUnitRequired:true,inSheetRerenderPreservesEdits:true,oneInFlightSave:true,newStorageNamespace:false,newSessionWriter:false,newEncounterWriter:false,newRecorderOwner:false,newActiveOwner:false,historicalEncounterRewrite:false,flowDefinitionMutation:false,network:false,ai:false,browsers:['chromium','webkit'],productionProviders:['Vercel','EdgeOne','axis.juele.fun']};
 if(x.crossPlatform?.portableContracts&&!x.crossPlatform.portableContracts.includes('axis.recording-continuity.v1'))x.crossPlatform.portableContracts.push('axis.recording-continuity.v1');
 write(f,x);
}
{
 const f='governance/owners.json',x=read(f);
 x.baselineRelease='8.29';
 const owner=x.owners.find(o=>o.capability==='recording-friction-collapse-829');
 if(!owner)throw Error('[AXIS 8.29 governance] derived recording owner missing');
 Object.assign(owner,{status:'derived-presentation-release-candidate',contract:'axis.recording-continuity.v1',storage:'none'});
 write(f,x);
}
console.log('[AXIS 8.29 governance] exact candidate state restored after inherited build stages');
