import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.27 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

const SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342';
const project=json('governance/project-state.json');
const decision=json('governance/version-decision.json');
const owners=json('governance/owners.json');

if(project?.product?.productionRelease!=='8.27'||project?.product?.releaseStatus!=='candidate')fail('8.27 must remain candidate before exact merged-main certification');
if(project?.product?.lastSealedRelease!=='8.26.5'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==158||project?.product?.candidatePullRequest!==160)fail('8.27 candidate must preserve exact 8.26.5 seal and PR #160 identity');
if(decision?.sequence!==23||decision?.base_release!=='8.26.5'||decision?.release!=='8.27'||decision?.decision!=='bump'||decision?.change_class!=='product-runtime')fail('version decision must be 8.26.5 -> 8.27 / bump / sequence 23 / product-runtime');
const v=project?.engineering?.versionDecision;
if(v?.sequence!==23||v?.baseRelease!=='8.26.5'||v?.release!=='8.27'||v?.decision!=='bump'||v?.changeClass!=='product-runtime')fail('project version provenance drift');
if(project?.engineering?.deliveryBranch!=='feature/827-reality-route'||project?.engineering?.pullRequest!==160)fail('8.27 delivery identity drift');

const production=project?.production||{};
if(production.sealedRelease!=='8.26.5'||production.candidateRelease!=='8.27'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate/sealed production state drift');
for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==SEALED_SHA)fail(`8.27 candidate incorrectly relabeled sealed ${provider} evidence`);

const rr=project?.engineering?.realityRoute;
if(rr?.status!=='8.27-release-candidate'||rr?.pureOwner!=='lib/axis-reality-route.mjs'||rr?.projectionSchema!=='axis.reality-route.v1'||rr?.temporaryConstraintSchema!=='axis.execution-constraints.v1')fail('Reality Route governance identity drift');
for(const key of ['newStorageNamespace','flowDefinitionMutation','historicalEncounterRewrite','manualDetourConsumesFlowStep','activeItemDeferrable','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(rr?.[key]!==false)fail(`Reality Route acquired forbidden authority ${key}`);
if(rr?.deferredItemsReturnAfterImmediateRoute!==true||rr?.reasonCodes!==true)fail('Reality Route projection semantics drift');

if(owners?.baselineRelease!=='8.27')fail('owner registry baseline must be 8.27');
const owner=owners.owners?.find(x=>x.capability==='flow-reality-route-827');
if(owner?.status!=='derived-runtime-release-candidate'||owner?.contract!=='axis.reality-route.v1'||owner?.storage!=='axis_v60_state.flowRun.temporaryConstraints')fail('Reality Route owner registry drift');

for(const f of ['README.md','docs/HANDOFF.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md']){
  const s=read(f);if(!s.includes('8.27'))fail(`${f} does not identify 8.27`);
}
for(const f of ['lib/axis-reality-route.mjs','scripts/axis-827-reality-route-contract.mjs','prepare-827-reality-route.mjs','postbuild-827-reality-route-contract.mjs'])if(!fs.existsSync(f))fail(`8.27 release surface missing ${f}`);

{
  const f='scripts/axis-repository-contract.mjs';let s=read(f);
  if(!s.includes("CURRENT==='8.27'?94")){
    const re=/const expectedSteps=[^;]+;/;
    const hit=s.match(re);if(!hit)fail('repository deterministic step contract missing');
    s=s.replace(re,"const expectedSteps=CURRENT==='8.27'?94:CURRENT==='8.26.5'?93:CURRENT==='8.26.4'?92:CURRENT==='8.26.3'?91:CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;");
  }
  for(const prefix of [
    "['8.22','8.23','8.24','8.24.1','8.25'",
    "['8.23','8.24','8.24.1','8.25'",
    "['8.24','8.24.1','8.25'",
    "['8.24.1','8.25'"
  ]){
    const start=s.indexOf(prefix);if(start>=0){const end=s.indexOf(']',start);const raw=s.slice(start,end+1);if(!raw.includes("'8.27'"))s=s.slice(0,start)+raw.slice(0,-1)+",'8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5','8.27']"+s.slice(end+1)}
  }
  write(f,s);
}

{
  const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
  if(!s.includes("if(CURRENT==='8.27')")){
    const map="if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}";
    if(!s.includes(map))fail('Production release owner map anchor missing');
    const add=map+"\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}\nif(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}\nif(CURRENT==='8.26.2'){sourceOwner='prepare-8262-active-rest-selector.mjs';sourceCurrent='8.26.2';sourceFrom='8.26.1'}\nif(CURRENT==='8.26.3'){sourceOwner='prepare-8263-active-rest-convergence.mjs';sourceCurrent='8.26.3';sourceFrom='8.26.2'}\nif(CURRENT==='8.26.4'){sourceOwner='prepare-8264-active-rest-utility-rail.mjs';sourceCurrent='8.26.4';sourceFrom='8.26.3'}\nif(CURRENT==='8.26.5'){sourceOwner='prepare-8265-recording-review-geometry.mjs';sourceCurrent='8.26.5';sourceFrom='8.26.4'}\nif(CURRENT==='8.27'){sourceOwner='prepare-827-reality-route.mjs';sourceCurrent='8.27';sourceFrom='8.26.5'}";
    s=s.replace(map,add);
  }
  if(!s.includes("8.27 must be candidate over sealed 8.26.5")){
    const pivot="}else if(CURRENT==='8.23'){";
    if(!s.includes(pivot))fail('Production candidate block anchor missing');
    const block=`}else if(CURRENT==='8.27'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.26.5')fail('8.27 must be candidate over sealed 8.26.5');
  if(RUNTIME_SHA!=='${SEALED_SHA}'||SEALED_PR!==158)fail('8.27 candidate lost exact 8.26.5 seal baseline');
  if(project?.production?.candidateRelease!=='8.27'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.27 Production candidate state drift');
  if(CANDIDATE_PR!==160||project?.engineering?.pullRequest!==160)fail('8.27 candidate PR state must identify PR #160');
  if(project?.engineering?.activeMilestone!=='AXIS 8.27 — Reality Route'||project?.engineering?.deliveryBranch!=='feature/827-reality-route')fail('8.27 milestone/delivery identity drift');
  if(!(decision?.sequence===23&&decision?.base_release==='8.26.5'&&decision?.release==='8.27'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime'))fail('8.27 version decision drift');
  const r=project?.engineering?.realityRoute;if(r?.status!=='8.27-release-candidate'||r?.projectionSchema!=='axis.reality-route.v1'||r?.newStorageNamespace!==false||r?.flowDefinitionMutation!==false||r?.historicalEncounterRewrite!==false)fail('8.27 Reality Route governance drift');
${pivot}`;
    s=s.replace(pivot,block);
  }
  write(f,s);
}

console.log('[AXIS 8.27 governance compat] PASS · exact PR #160 candidate · sealed 8.26.5 provider evidence preserved · Reality Route remains derived execution projection');
