import fs from 'node:fs';

const fail=m=>{throw Error('[AXIS 8.29 governance] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const json=f=>JSON.parse(read(f));
const LAST='df67fc0a20c0c34a79341315c8c85b5461acfe44',SEALED='4a9c73b2ea5330b9cffad3f9e322eb6970dfe171';
const p=json('governance/project-state.json'),d=json('governance/version-decision.json'),o=json('governance/owners.json');
const candidate=d.sequence===27&&d.base_release==='8.28'&&d.release==='8.29'&&d.decision==='bump'&&d.change_class==='product-runtime';
const downstream831=(d?.sequence===31&&d?.base_release==='8.30'&&d?.release==='8.31'&&d?.decision==='bump'&&d?.change_class==='product-runtime');
const sealed830=d.sequence===30&&d.base_release==='8.30'&&d.release==='8.30'&&d.decision==='confirm'&&d.change_class==='governance'||downstream831;
const downstream830=(d.sequence===29&&d.base_release==='8.29'&&d.release==='8.30'&&d.decision==='bump'&&d.change_class==='product-runtime')||sealed830;
const certified=d.sequence===28&&d.base_release==='8.29'&&d.release==='8.29'&&d.decision==='confirm'&&d.change_class==='governance';
if(!candidate&&!certified&&!downstream830)fail('unknown 8.29 version-decision sequence');
if(!downstream830&&(p.product?.productionRelease!=='8.29'||p.product?.candidatePullRequest!==164))fail('8.29 product identity');
if(o.baselineRelease!==(downstream831&&p.product?.productionRelease==='8.31'?'8.31':downstream830&&p.product?.productionRelease==='8.30'?'8.30':'8.29'))fail('owner baseline drift');
if(p.production?.latestDeploymentIsAuthority!==false||p.production?.evidenceScope!=='product-runtime-seal-snapshot')fail('production authority boundary');
const recording=p.engineering?.recordingFriction;
if(recording?.pureOwner!=='lib/axis-recording-continuity.mjs'||recording?.projectionSchema!=='axis.recording-continuity.v1')fail('recording contract identity');
for(const key of ['priorConfirmedMetricsAreOnlySuggestions','needsExplicitSave','compatibleTypeAndUnitRequired','inSheetRerenderPreservesEdits','oneInFlightSave'])if(recording[key]!==true)fail('recording behavior drift '+key);
for(const key of ['newStorageNamespace','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','historicalEncounterRewrite','flowDefinitionMutation','network','ai'])if(recording[key]!==false)fail('new factual authority '+key);
if(p.engineering?.practiceLoop?.status!=='production-sealed-8.28'||p.engineering?.practiceLoop?.productionRuntimeSha!==LAST)fail('inherited 8.28 seal lost');
const owner=o.owners?.find(x=>x.capability==='recording-friction-collapse-829');
if(owner?.contract!=='axis.recording-continuity.v1'||owner?.storage!=='none')fail('derived owner identity');
let expectedSha=LAST;
if(downstream830){
  const prior=json('governance/production-certifications/8.29.json');
  if(prior.productRuntimeSha!==SEALED||prior.productPullRequest!==164||prior.release!=='8.29')fail('8.30 lost exact 8.29 certificate');
  const atPredecessorRestoration=sealed830&&p.product.productionRelease==='8.29';
  const expected=sealed830&&!atPredecessorRestoration?'eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f':SEALED;
  if(p.product.productionRuntimeSha!==expected||p.product.productionPullRequest!==(sealed830&&!atPredecessorRestoration?167:164)||p.product.lastSealedRelease!==(sealed830&&!atPredecessorRestoration?'8.30':'8.29')||p.production.sealedRelease!==(sealed830&&!atPredecessorRestoration?'8.30':'8.29'))fail('8.30 product seal authority drift');
  if(p.product.productionRelease==='8.30'){
    if(sealed830){
      const cert=json('governance/production-certifications/8.30.json');
      if(cert.productRuntimeSha!==expected||cert.productPullRequest!==167||cert.exactHeadSuccess!==34||cert.mergedMainWorkflows?.success!==30)fail('8.30 certificate lost');
      if(p.product.releaseStatus!=='production-certified'||p.product.candidatePullRequest!==167||p.production.candidateRelease!=='8.30'||p.production.candidateStatus!=='production-sealed')fail('8.30 certified status drift');
    }else if(p.product.releaseStatus!=='candidate'||p.product.candidatePullRequest!==167||p.production.candidateRelease!=='8.30'||p.production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.30 exact candidate state drift');
  }else if(downstream831&&p.product.productionRelease==='8.31'){
    if(p.product.releaseStatus!=='candidate'||p.product.lastSealedRelease!=='8.30'||p.product.productionRuntimeSha!=='eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f'||p.product.productionPullRequest!==167||p.product.candidatePullRequest!==170||p.production.candidateRelease!=='8.31'||p.production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.31 successor lost exact 8.30 certificate and state');
  }else if(p.product.productionRelease!=='8.29'||p.product.releaseStatus!=='production-certified'||p.production.candidateRelease!=='8.29'||p.production.candidateStatus!=='production-sealed')fail('8.29 inherited build state drift');
  if(recording.status!=='production-sealed-8.29'||recording.productionRuntimeSha!==SEALED||owner.status!=='derived-presentation-production-sealed')fail('8.29 recording owner lost during 8.30');
  for(const prov of ['vercel','edgeOne','customDomain'])if(p.production?.[prov]?.sourceSha!==expected)fail('8.30 provider provenance changed '+prov);
  expectedSha=expected;
}else if(candidate){
  if(p.product.releaseStatus!=='candidate'||p.product.lastSealedRelease!=='8.28'||p.product.productionRuntimeSha!==LAST||p.product.productionPullRequest!==162)fail('candidate predecessor seal drift');
  if(p.production.sealedRelease!=='8.28'||p.production.candidateRelease!=='8.29'||p.production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate evidence boundary');
  if(p.engineering.deliveryBranch!=='feature/829-recording-friction-collapse'||p.engineering.pullRequest!==164||p.engineering.versionDecision?.sequence!==27||p.engineering.versionDecision?.decision!=='bump')fail('candidate delivery/version identity');
  if(recording.status!=='8.29-release-candidate'||owner.status!=='derived-presentation-release-candidate')fail('candidate owner state');
}else{
  const cert=json('governance/production-certifications/8.29.json');
  if(cert.release!=='8.29'||cert.productRuntimeSha!==SEALED||cert.productPullRequest!==164||cert.exactHeadSha!=='8dc4d80f17c061b81a294963c4723f1d6d7e826e'||cert.exactHeadSuccess!==33)fail('certificate release/head mismatch');
  if(p.product.releaseStatus!=='production-certified'||p.product.lastSealedRelease!=='8.29'||p.product.productionRuntimeSha!==SEALED||p.product.productionPullRequest!==164)fail('certified product identity drift');
  if(p.production.sealedRelease!=='8.29'||p.production.candidateRelease!=='8.29'||p.production.candidateStatus!=='production-sealed')fail('certified status drift');
  if(p.engineering.deliveryBranch!=='main'||p.engineering.pullRequest!==164||p.engineering.versionDecision?.sequence!==28||p.engineering.versionDecision?.decision!=='confirm'||p.engineering.intendedProductBehaviorChange!==false)fail('certified engineering version drift');
  if(recording.status!=='production-sealed-8.29'||recording.productionRuntimeSha!==SEALED||owner.status!=='derived-presentation-production-sealed')fail('certified recording owner drift');
  for(const provider of ['vercel','edgeOne','customDomain'])if(p.production?.[provider]?.sourceSha!==SEALED)fail('provider runtime provenance drift '+provider);
  if(p.production.vercel?.projectId!=='prj_8JJhe0nj2CryZb4xHoHV1WBffn8f'||p.production.vercel?.deploymentId!==cert.vercel.deploymentId||p.production.vercel?.state!=='READY'||p.production.vercel?.target!=='production'||p.production.vercel?.source!=='git'||p.production.vercel?.aliasError!==null||p.production.vercel?.productionGateRunId!==cert.vercel.productionGateRunId)fail('Vercel certification drift');
  if(p.production.edgeOne?.deploymentId!==cert.edgeOne.deploymentId||p.production.edgeOne?.verificationRunId!==cert.edgeOne.verificationRunId||p.production.edgeOne?.deployProduction!=='success'||p.production.edgeOne?.chromiumProductionFlow!=='success'||p.production.edgeOne?.webkitProductionFlow!=='success')fail('EdgeOne certification drift');
  if(p.production.customDomain?.verificationRunId!==cert.customDomain.verificationRunId||p.production.customDomain?.publicUrl!=='https://axis.juele.fun'||p.production.customDomain?.exactParity!=='success'||p.production.customDomain?.chromiumProductionFlow!=='success'||p.production.customDomain?.webkitProductionFlow!=='success')fail('custom domain certification drift');
  if(p.production.combinedStatus?.sourceSha!==SEALED||p.production.combinedStatus?.vercel!=='success'||p.production.combinedStatus?.edgeOneProduction!=='success'||p.production.combinedStatus?.customDomain!=='success')fail('combined Production evidence drift');
  expectedSha=SEALED;
}
if(candidate)for(const provider of ['vercel','edgeOne','customDomain'])if(p.production?.[provider]?.sourceSha!==LAST)fail('candidate preserved 8.28 evidence drift '+provider);
for(const f of ['README.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md','docs/HANDOFF.md']){
 const s=read(f);if(!s.includes('8.29')||(!downstream830&&!s.includes('8.28'))||!s.includes(expectedSha))fail('release document identity '+f);
}
console.log('[AXIS 8.29 governance] PASS · '+(downstream830?'inherited exact 8.29 seal inside 8.30':certified?'Production-sealed at exact merged-main '+SEALED:'candidate over sealed 8.28')+' · one recorder/Encounter owner');
