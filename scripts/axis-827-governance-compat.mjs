import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.27 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

const PRIOR_SHA='5bf575730c5c8de542c603d40b0f8b780204a342';
const RUNTIME_SHA='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const project=json('governance/project-state.json');
const decision=json('governance/version-decision.json');
const owners=json('governance/owners.json');
const production=project?.production||{};
const rr=project?.engineering?.realityRoute||{};

const candidate=
  project?.product?.productionRelease==='8.27'&&
  project?.product?.releaseStatus==='candidate'&&
  project?.product?.lastSealedRelease==='8.26.5'&&
  project?.product?.productionRuntimeSha===PRIOR_SHA&&
  project?.product?.productionPullRequest===158&&
  project?.product?.candidatePullRequest===160&&
  decision?.sequence===23&&decision?.base_release==='8.26.5'&&decision?.release==='8.27'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';

const sealed=
  project?.product?.productionRelease==='8.27'&&
  project?.product?.releaseStatus==='production-certified'&&
  project?.product?.lastSealedRelease==='8.27'&&
  project?.product?.productionRuntimeSha===RUNTIME_SHA&&
  project?.product?.productionPullRequest===160&&
  project?.product?.candidatePullRequest===160&&
  decision?.sequence===24&&decision?.base_release==='8.27'&&decision?.release==='8.27'&&decision?.decision==='confirm'&&decision?.change_class==='governance';

const downstream828=
  decision?.sequence===25&&decision?.base_release==='8.27'&&decision?.release==='8.28'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
const downstream828Exact=
  downstream828&&project?.product?.productionRelease==='8.28'&&project?.product?.releaseStatus==='candidate'&&
  project?.product?.lastSealedRelease==='8.27'&&project?.product?.productionRuntimeSha===RUNTIME_SHA&&
  project?.product?.productionPullRequest===160&&project?.product?.candidatePullRequest===162;
const downstream829=decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
const seal828Stage=decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const sealed828=
  decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&
  decision?.decision==='confirm'&&decision?.change_class==='governance'&&
  project?.product?.productionRelease==='8.28'&&project?.product?.releaseStatus==='production-certified'&&
  project?.product?.lastSealedRelease==='8.28'&&project?.product?.productionRuntimeSha==='df67fc0a20c0c34a79341315c8c85b5461acfe44'&&
  project?.product?.productionPullRequest===162&&project?.product?.candidatePullRequest===162;

if(!candidate&&!sealed&&!downstream828&&!seal828Stage&&!downstream829)fail('governance must be exact 8.27 candidate/seal or governed 8.28 successor/seal');

const v=project?.engineering?.versionDecision;
if(downstream828||seal828Stage||downstream829){
  if(sealed828){
    if(production.sealedRelease!=='8.28'||production.candidateStatus!=='production-sealed'||production.latestDeploymentIsAuthority!==false)fail('8.28 successor Production seal boundary drift');
    if(rr?.status!=='production-sealed-8.27'||rr?.productionRuntimeSha!==RUNTIME_SHA||rr?.productionPullRequest!==160)fail('8.28 seal lost inherited Reality Route authority');
  }
  if(downstream828Exact){
    if(v?.sequence!==25||v?.baseRelease!=='8.27'||v?.release!=='8.28'||v?.decision!=='bump'||v?.changeClass!=='product-runtime')fail('8.28 successor version provenance drift');
    if(production.sealedRelease!=='8.27'||production.candidateRelease!=='8.28'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.28 successor production state drift');
    for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==RUNTIME_SHA)fail('8.28 successor lost sealed 8.27 '+provider+' evidence');
    if(rr?.status!=='production-sealed-8.27'||rr?.productionRuntimeSha!==RUNTIME_SHA||rr?.productionPullRequest!==160)fail('8.28 successor lost Reality Route Production seal');
  }
}else if(candidate){
  if(v?.sequence!==23||v?.baseRelease!=='8.26.5'||v?.release!=='8.27'||v?.decision!=='bump'||v?.changeClass!=='product-runtime')fail('candidate project version provenance drift');
  if(project?.engineering?.deliveryBranch!=='feature/827-reality-route'||project?.engineering?.pullRequest!==160)fail('candidate delivery identity drift');
  if(production.sealedRelease!=='8.26.5'||production.candidateRelease!=='8.27'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate production state drift');
  for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==PRIOR_SHA)fail(`candidate incorrectly relabeled sealed ${provider} evidence`);
  if(rr?.status!=='8.27-release-candidate')fail('Reality Route candidate status drift');
}else{
  if(v?.sequence!==24||v?.baseRelease!=='8.27'||v?.release!=='8.27'||v?.decision!=='confirm'||v?.changeClass!=='governance')fail('sealed project version provenance drift');
  if(project?.engineering?.deliveryBranch!=='main'||project?.engineering?.pullRequest!==160)fail('sealed delivery identity drift');
  if(project?.engineering?.baselineRuntimeSha!==RUNTIME_SHA||project?.engineering?.lastSealedRuntimeSha!==RUNTIME_SHA)fail('sealed engineering runtime provenance drift');
  if(production.sealedRelease!=='8.27'||production.candidateRelease!=='8.27'||production.candidateStatus!=='production-sealed')fail('sealed production state drift');
  if(production.latestDeploymentIsAuthority!==false||production.evidenceScope!=='product-runtime-seal-snapshot')fail('sealed evidence authority drift');
  for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==RUNTIME_SHA)fail(`sealed ${provider} source identity drift`);
  const vercel=production.vercel||{},edge=production.edgeOne||{},custom=production.customDomain||{},combined=production.combinedStatus||{};
  if(vercel.deploymentId!=='dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm'||vercel.state!=='READY'||vercel.target!=='production'||Number(vercel.currentReleaseGateRunId)!==37333415838||Number(vercel.deepCompatibilityGateRunId)!==37333415780||Number(vercel.productionGateRunId)!==37333475667||Number(vercel.publicAliasGateRunId)!==37333475632||vercel.exactManifestParity!=='success'||vercel.chromiumProductionFlow!=='success')fail('Vercel 8.27 certification drift');
  if(edge.deploymentId!=='dpmrug23mtim'||Number(edge.verificationRunId)!==37333415798||edge.packageContract!=='success'||edge.deployProduction!=='success'||edge.vercelApiParity!=='success'||edge.chromiumProductionFlow!=='success'||edge.webkitProductionFlow!=='success')fail('EdgeOne 8.27 certification drift');
  if(Number(custom.verificationRunId)!==37333415692||custom.publicUrl!=='https://axis.juele.fun'||custom.exactParity!=='success'||custom.chromiumProductionFlow!=='success'||custom.webkitProductionFlow!=='success')fail('custom-domain 8.27 certification drift');
  if(combined.sourceSha!==RUNTIME_SHA||combined.vercel!=='success'||combined.edgeOneProduction!=='success'||combined.customDomain!=='success')fail('combined 8.27 certification drift');
  if(rr?.status!=='production-sealed-8.27'||rr?.productionRuntimeSha!==RUNTIME_SHA||rr?.productionPullRequest!==160)fail('Reality Route Production seal drift');
}

if(!downstream828&&!seal828Stage&&!downstream829||downstream828Exact||sealed828){
  if(rr?.pureOwner!=='lib/axis-reality-route.mjs'||rr?.projectionSchema!=='axis.reality-route.v1'||rr?.temporaryConstraintSchema!=='axis.execution-constraints.v1')fail('Reality Route governance identity drift');
  for(const key of ['newStorageNamespace','flowDefinitionMutation','historicalEncounterRewrite','manualDetourConsumesFlowStep','activeItemDeferrable','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(rr?.[key]!==false)fail(`Reality Route acquired forbidden authority ${key}`);
  if(rr?.deferredItemsReturnAfterImmediateRoute!==true||rr?.reasonCodes!==true)fail('Reality Route projection semantics drift');
  if(!['8.27','8.28','8.29'].includes(owners?.baselineRelease))fail('owner registry baseline must be 8.27 or bounded 8.28 successor');
  const owner=owners.owners?.find(x=>x.capability==='flow-reality-route-827');
  const wantStatus=sealed||downstream828Exact||sealed828?'derived-runtime-production-sealed':'derived-runtime-release-candidate';
  if(owner?.status!==wantStatus||owner?.contract!=='axis.reality-route.v1'||owner?.storage!=='axis_v60_state.flowRun.temporaryConstraints')fail('Reality Route owner registry drift');
}

for(const f of ['README.md','docs/HANDOFF.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md']){
  const s=read(f);if(!downstream829&&!s.includes('8.27'))fail(`${f} does not identify 8.27`);
  if(sealed&&!/Production-sealed|production-certified/i.test(s))fail(`${f} does not identify sealed 8.27`);
  if((sealed||downstream828||sealed828)&&!s.includes('8.27'))fail(`${f} does not preserve sealed 8.27 identity`);
  if((sealed||downstream828)&&!s.includes(RUNTIME_SHA))fail(`${f} does not identify exact 8.27 runtime SHA`);
}
for(const f of ['lib/axis-reality-route.mjs','scripts/axis-827-reality-route-contract.mjs','prepare-827-reality-route.mjs','postbuild-827-reality-route-contract.mjs'])if(!fs.existsSync(f))fail(`8.27 release surface missing ${f}`);

/* Historical repository contract predates 8.27. Extend only its moving-current
   release tables; product truth remains in project-state and the exact runtime seal. */
{
  const f='scripts/axis-repository-contract.mjs';let s=read(f);
  if(!s.includes("CURRENT==='8.27'?94")){
    const re=/const expectedSteps=[^;]+;/;
    if(!re.test(s))fail('repository deterministic step contract missing');
    s=s.replace(re,"const expectedSteps=CURRENT==='8.27'?94:CURRENT==='8.26.5'?93:CURRENT==='8.26.4'?92:CURRENT==='8.26.3'?91:CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;");
  }
  for(const prefix of [
    "['8.22','8.23','8.24','8.24.1','8.25'",
    "['8.23','8.24','8.24.1','8.25'",
    "['8.24','8.24.1','8.25'",
    "['8.24.1','8.25'"
  ]){
    const start=s.indexOf(prefix);
    if(start>=0){
      const end=s.indexOf(']',start),raw=s.slice(start,end+1);
      if(!raw.includes("'8.27'"))s=s.slice(0,start)+raw.slice(0,-1)+",'8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5','8.27']"+s.slice(end+1);
    }
  }
  write(f,s);
}

console.log(`[AXIS 8.27 governance compat] PASS · ${downstream829?'inherited by 8.29 candidate':sealed828?'inherited by Production-sealed 8.28':downstream828?'inherited by bounded 8.28 successor':sealed?'Production-sealed exact runtime '+RUNTIME_SHA:'exact PR #160 candidate over sealed 8.26.5'} · Reality Route remains derived execution projection`);
