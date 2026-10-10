import fs from 'node:fs';

const fail=m=>{throw new Error('[AXIS 8.28 governance compat] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail('invalid '+f+': '+e.message)}};
const SEALED_SHA='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const RUNTIME_828='df67fc0a20c0c34a79341315c8c85b5461acfe44';
const sealed=decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&decision?.decision==='confirm'&&decision?.change_class==='governance';

const sealed829Stage=decision?.sequence===28&&decision?.base_release==='8.29'&&decision?.release==='8.29'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const sealed831=(decision?.sequence===32&&decision?.base_release==='8.31'&&decision?.release==='8.31'&&decision?.decision==='confirm'&&decision?.change_class==='governance'&&project.product?.productionRelease==='8.31'&&project.product?.releaseStatus==='production-certified'&&project.product?.productionRuntimeSha==='dddce5401e80087a7ccceb43ec466f1ad7abb505');
const downstream831=(decision?.sequence===31&&decision?.base_release==='8.30'&&decision?.release==='8.31'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime' )||sealed831;
const sealed830=(decision?.sequence===30&&decision?.base_release==='8.30'&&decision?.release==='8.30'&&decision?.decision==='confirm'&&decision?.change_class==='governance')||downstream831;
const downstream830=(decision?.sequence===29&&decision?.base_release==='8.29'&&decision?.release==='8.30'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime')||sealed830;
const downstream829=downstream830||sealed829Stage||(
  decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&
  decision?.decision==='bump'&&decision?.change_class==='product-runtime');

if(downstream829){
  const certified='df67fc0a20c0c34a79341315c8c85b5461acfe44';
  if(project?.product?.productionRelease==='8.29'){
  if(sealed829Stage||(sealed830&&project?.product?.productionRelease==='8.29')){
    const run='4a9c73b2ea5330b9cffad3f9e322eb6970dfe171';
    if(project.product.releaseStatus!=='production-certified'||project.product.lastSealedRelease!=='8.29'||project.product.productionRuntimeSha!==run||project.product.productionPullRequest!==164||project.product.candidatePullRequest!==164)fail('8.29 sealed runtime authority drift');
    if(project.production?.sealedRelease!=='8.29'||project.production?.candidateStatus!=='production-sealed'||project.production?.latestDeploymentIsAuthority!==false)fail('8.29 seal production boundary drift');
    for(const prov of ['vercel','edgeOne','customDomain'])if(project.production?.[prov]?.sourceSha!==run)fail('8.29 sealed provider mismatch '+prov);
    if(owners.baselineRelease!=='8.29')fail('8.29 sealed owners baseline drift');
  }else{
  if(project?.product?.productionRelease!=='8.29'||project?.product?.releaseStatus!=='candidate'||
     project?.product?.lastSealedRelease!=='8.28'||project?.product?.productionRuntimeSha!==certified||
     project?.product?.productionPullRequest!==162||project?.product?.candidatePullRequest!==164)fail('8.29 successor lost exact 8.28 production authority');
  if(project?.production?.sealedRelease!=='8.28'||project?.production?.candidateRelease!=='8.29'||
     project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification'||
     project?.production?.latestDeploymentIsAuthority!==false)fail('8.29 candidate/seal boundary drift');
  for(const p of ['vercel','edgeOne','customDomain'])if(project?.production?.[p]?.sourceSha!==certified)fail('sealed 8.28 provider source drift '+p);
  if(project?.engineering?.practiceLoop?.status!=='production-sealed-8.28'||project?.engineering?.practiceLoop?.productionRuntimeSha!==certified)fail('8.28 Practice Loop seal lost');
  const owner=owners.owners?.find(o=>o.capability==='practice-loop-convergence-828');
  if(owner?.status!=='derived-runtime-production-sealed'||owner?.storage!=='none')fail('certified Practice Loop owner boundary drift');
  if(owners.baselineRelease!=='8.29')fail('successor owner baseline drift');
  }
  }else{
    // Earlier deterministic release builders temporarily expose prior product
    // state while the sequence 27 decision remains the bounded authority.
    // Exact 8.29 candidate identity is enforced by final 8.29 governance.
    if(!project?.engineering?.realityRoute)fail('inherited Reality Route capability missing');
    if(downstream830&&project?.product?.productionRelease==='8.30'){if(owners.baselineRelease!=='8.30'||project.engineering.versionDecision?.sequence!==(sealed830?30:29)||project.engineering.recordingFriction?.status!=='production-sealed-8.29')fail('8.30 predecessor owner/version drift');for(const p of ['vercel','edgeOne','customDomain'])if(project.production?.[p]?.sourceSha!==(sealed830?'eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f':'4a9c73b2ea5330b9cffad3f9e322eb6970dfe171'))fail('8.30 exact inherited provider drift '+p);}
  }
  console.log('[AXIS 8.28 governance compat] PASS · sealed Practice Loop inherited inside 8.29 candidate');
}else{
if(project?.product?.productionRelease!=='8.28'||project?.product?.candidatePullRequest!==162)fail('8.28 product identity drift');
if(sealed){
  if(project?.product?.releaseStatus!=='production-certified'||project?.product?.lastSealedRelease!=='8.28'||project?.product?.productionRuntimeSha!==RUNTIME_828||project?.product?.productionPullRequest!==162)fail('exact 8.28 Production seal drift');
}else if(project?.product?.releaseStatus!=='candidate'||project?.product?.lastSealedRelease!=='8.27'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==160)fail('8.28 candidate identity drift');
if(!sealed&&(decision?.sequence!==25||decision?.base_release!=='8.27'||decision?.release!=='8.28'||decision?.decision!=='bump'||decision?.change_class!=='product-runtime'))fail('8.28 candidate version decision drift');
const v=project?.engineering?.versionDecision;
if(sealed){
  if(v?.sequence!==26||v?.baseRelease!=='8.28'||v?.release!=='8.28'||v?.decision!=='confirm'||v?.changeClass!=='governance')fail('sealed project version provenance drift');
}else if(v?.sequence!==25||v?.baseRelease!=='8.27'||v?.release!=='8.28'||v?.decision!=='bump'||v?.changeClass!=='product-runtime')fail('candidate project version provenance drift');
if(project?.engineering?.deliveryBranch!==(sealed?'main':'feature/828-practice-loop-convergence')||project?.engineering?.pullRequest!==162)fail('delivery identity drift');

const production=project?.production||{};
if(production.sealedRelease!==(sealed?'8.28':'8.27')||production.candidateRelease!=='8.28'||production.candidateStatus!==(sealed?'production-sealed':'pending-exact-head-and-merged-main-certification'))fail('candidate/sealed production state drift');
if(production.evidenceScope!=='product-runtime-seal-snapshot'||production.latestDeploymentIsAuthority!==false)fail('Production authority drift');
for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==(sealed?RUNTIME_828:SEALED_SHA))fail('Production provider source identity drift '+provider);
if(sealed){
 const v=production.vercel||{},e=production.edgeOne||{},c=production.customDomain||{},all=production.combinedStatus||{};
 if(v.deploymentId!=='dpl_3FLstNd9rvptfaA3YP1THwWfoazF'||v.state!=='READY'||v.target!=='production'||Number(v.productionGateRunId)!==37759655524||Number(v.publicAliasGateRunId)!==37759655542||v.exactManifestParity!=='success'||v.chromiumProductionFlow!=='success')fail('8.28 exact Vercel Production certification drift');
 if(e.deploymentId!=='dpxaahz57drn'||Number(e.verificationRunId)!==37759608127||e.packageContract!=='success'||e.deployProduction!=='success'||e.vercelApiParity!=='success'||e.chromiumProductionFlow!=='success'||e.webkitProductionFlow!=='success')fail('8.28 exact EdgeOne Production certification drift');
 if(Number(c.verificationRunId)!==37759608391||c.publicUrl!=='https://axis.juele.fun'||c.exactParity!=='success'||c.chromiumProductionFlow!=='success'||c.webkitProductionFlow!=='success')fail('8.28 exact custom domain certification drift');
 if(all.sourceSha!==RUNTIME_828||all.vercel!=='success'||all.edgeOneProduction!=='success'||all.customDomain!=='success')fail('8.28 combined Production seal drift');
}

const loop=project?.engineering?.practiceLoop||{};
if(loop.status!==(sealed?'production-sealed-8.28':'8.28-release-candidate')||loop.pureOwner!=='lib/axis-practice-loop.mjs'||loop.projectionSchema!=='axis.practice-loop.v1'||loop.reloadSafe!==true||loop.promptOnRestore!==false)fail('Practice Loop governance identity drift');
if(sealed&&(loop.productionRuntimeSha!==RUNTIME_828||loop.productionPullRequest!==162||loop.productionCertification?.mergedMainSha!==RUNTIME_828))fail('Practice Loop runtime certification provenance drift');
for(const key of ['newStorageNamespace','flowDefinitionMutation','historicalEncounterRewrite','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(loop[key]!==false)fail('Practice Loop acquired forbidden authority '+key);

if(owners?.baselineRelease!=='8.28')fail('owner baseline must be 8.28');
const owner=owners.owners?.find(x=>x.capability==='practice-loop-convergence-828');
if(owner?.status!==(sealed?'derived-runtime-production-sealed':'derived-runtime-release-candidate')||owner?.contract!=='axis.practice-loop.v1'||owner?.storage!=='none')fail('Practice Loop owner registry drift');

for(const f of ['README.md','docs/HANDOFF.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md']){
  const s=read(f);if(!s.includes('8.28')||!s.includes('8.27'))fail(f+' does not preserve candidate/sealed identity');
}

{
  const f='scripts/axis-repository-contract.mjs';let s=read(f);
  const re=/const expectedSteps=[^;]+;/;
  if(!s.includes("CURRENT==='8.28'?95")){
    if(!re.test(s))fail('repository deterministic step contract missing');
    s=s.replace(re,"const expectedSteps=CURRENT==='8.28'?95:CURRENT==='8.27'?94:CURRENT==='8.26.5'?93:CURRENT==='8.26.4'?92:CURRENT==='8.26.3'?91:CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;");
  }
  for(const prefix of ["['8.22','8.23','8.24','8.24.1','8.25'","['8.23','8.24','8.24.1','8.25'","['8.24','8.24.1','8.25'","['8.24.1','8.25'"]){
    const start=s.indexOf(prefix);
    if(start>=0){
      const end=s.indexOf(']',start),raw=s.slice(start,end+1);
      if(!raw.includes("'8.28'"))s=s.slice(0,start)+raw.slice(0,-1)+",'8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5','8.27','8.28']"+s.slice(end+1);
    }
  }
  write(f,s);
}
{
  const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
  const ownerAnchor="if(CURRENT==='8.27'){sourceOwner='prepare-827-reality-route.mjs';sourceCurrent='8.27';sourceFrom='8.26.5'}";
  if(s.includes(ownerAnchor)&&!s.includes("if(CURRENT==='8.28'){sourceOwner='prepare-828-practice-loop.mjs'"))s=s.replace(ownerAnchor,ownerAnchor+"\nif(CURRENT==='8.28'){sourceOwner='prepare-828-practice-loop.mjs';sourceCurrent='8.28';sourceFrom='8.27'}");
  if(!s.includes('8.28 must be candidate over sealed 8.27')){
    const pivot="}else if(CURRENT==='8.27'){";
    if(!s.includes(pivot))fail('Production candidate block anchor missing');
    const block="}else if(CURRENT==='8.28'){\n"+
      "  if(!candidate||STATUS!=='candidate'||SEALED!=='8.27')fail('8.28 must be candidate over sealed 8.27');\n"+
      "  if(RUNTIME_SHA!=='d6044f0b30a92c007dd2fbab5792c2aa62dfd485'||SEALED_PR!==160)fail('8.28 candidate lost exact 8.27 seal baseline');\n"+
      "  if(project?.production?.candidateRelease!=='8.28'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.28 Production candidate state drift');\n"+
      "  if(CANDIDATE_PR!==162||project?.engineering?.pullRequest!==162)fail('8.28 candidate PR must be #162');\n"+
      "  if(project?.engineering?.activeMilestone!=='AXIS 8.28 — Practice Loop Convergence'||project?.engineering?.deliveryBranch!=='feature/828-practice-loop-convergence')fail('8.28 milestone/delivery identity drift');\n"+
      "  if(!(decision?.sequence===25&&decision?.base_release==='8.27'&&decision?.release==='8.28'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.28 version decision drift');\n"+
      "  const l=project?.engineering?.practiceLoop;if(l?.status!=='8.28-release-candidate'||l?.projectionSchema!=='axis.practice-loop.v1'||l?.newStorageNamespace!==false||l?.flowDefinitionMutation!==false||l?.historicalEncounterRewrite!==false)fail('8.28 Practice Loop governance drift');\n"+
      pivot;
    s=s.replace(pivot,block);
  }
  write(f,s);
}

console.log('[AXIS 8.28 governance compat] PASS · '+(sealed?'Production-sealed exact runtime '+RUNTIME_828:'candidate PR #162 over exact sealed 8.27 runtime')+' · Practice Loop remains derived continuity projection');

}
