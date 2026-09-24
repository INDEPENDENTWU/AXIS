import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.2 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const count=(s,n)=>s.split(n).length-1;
const SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
if(project?.product?.productionRelease!=='8.26.2'||project?.product?.releaseStatus!=='candidate')fail('8.26.2 must remain candidate before exact merged-main certification');
if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==153||project?.product?.candidatePullRequest!==155)fail('8.26.2 candidate must preserve exact 8.26.1 seal and PR #155 identity');
if(decision?.sequence!==18||decision?.base_release!=='8.26.1'||decision?.release!=='8.26.2'||decision?.decision!=='bump'||decision?.change_class!=='bug-fix')fail('version decision must be 8.26.1 -> 8.26.2 / bump / sequence 18 / bug-fix');
const v=project?.engineering?.versionDecision;if(v?.sequence!==18||v?.baseRelease!=='8.26.1'||v?.release!=='8.26.2'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('project version provenance drift');
if(project?.engineering?.deliveryBranch!=='fix/8262-active-rest-selector'||project?.engineering?.pullRequest!==155||project?.engineering?.pullRequestDraft!==true)fail('8.26.2 delivery identity drift');
const production=project?.production||{};
if(production.sealedRelease!=='8.26.1'||production.candidateRelease!=='8.26.2'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate/sealed production state drift');
if(production.vercel?.sourceSha!==SEALED_SHA||production.edgeOne?.sourceSha!==SEALED_SHA||production.customDomain?.sourceSha!==SEALED_SHA)fail('candidate incorrectly relabeled sealed provider evidence');
const rest=project?.engineering?.activeRestState,binding=project?.engineering?.activeRestSelector;
if(rest?.status!=='production-sealed-8.26.1-inherited')fail('8.26.1 rest-state inheritance drift');
for(const key of ['selectorBound','physicalBrowserProofRequired','pausedTruthOwnerUnchanged','timerTruthOwnerUnchanged','reducedMotionSafe'])if(binding?.[key]!==true)fail(`8.26.2 selector capability missing ${key}`);
if(binding?.status!=='8.26.2-release-candidate'||binding?.canonicalSelector!=='.v87Rest'||binding?.pointerEvents!==false)fail('8.26.2 selector candidate boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(binding?.[key]!==false)fail(`8.26.2 acquired forbidden authority ${key}`);
if(owners?.baselineRelease!=='8.26.2')fail('owner registry baseline must be 8.26.2');
const restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261'),bindingOwner=owners.owners?.find(x=>x.capability==='active-rest-selector-8262');
if(restOwner?.status!=='presentation-only-production-sealed'||restOwner?.storage!=='none')fail('sealed 8.26.1 rest owner drift');
if(bindingOwner?.status!=='presentation-only-release-candidate'||bindingOwner?.storage!=='none'||!String(bindingOwner?.owner||'').includes('v87Rest'))fail('8.26.2 selector owner drift');
const css=read('styles/axis-826-active-continuity.css'),prepare=read('prepare-8262-active-rest-selector.mjs'),post=read('postbuild-8262-active-rest-selector-contract.mjs'),build=read('build-release.mjs');
if(!css.includes('#v87Now.axis821ActiveStage .v87Rest{margin-top:12px!important'))fail('live v87Rest selector binding missing');
if(!prepare.includes("const FROM='8.26.1',VERSION='8.26.2'"))fail('8.26.2 release transition drift');
if(!build.includes("'prepare-8262-active-rest-selector.mjs'"))fail('8.26.2 prepare is not deterministic build authority');
if(!post.includes('activeRestSelectorBinding8262:true'))fail('8.26.2 postbuild gate marker missing');
const selectorSmoke='node scripts/axis-8262-active-rest-selector-smoke.mjs';
for(const [path,want,label] of [
  ['.github/workflows/axis-current-release-gate.yml',2,'Current Release'],
  ['.github/workflows/axis-edgeone-production-mirror.yml',2,'EdgeOne Production'],
  ['.github/workflows/axis-custom-domain-production.yml',2,'axis.juele.fun'],
  ['.github/workflows/axis-production-deployment-gate.yml',1,'fixed Vercel Production']
])if(count(read(path),selectorSmoke)!==want)fail(`${label} must run 8.26.2 selector proof ${want} time(s)`);

/* Repository and Production contracts are intentionally source-stable across
   sealed releases; candidate governance converges their current-release view
   in the CI/build workspace before those contracts execute. */
{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const old="const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 const next="const expectedSteps=CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 s=replaceOnce(s,old,next,'repository deterministic step family');
 for(const [from,to] of [
  ["['8.22','8.23','8.24','8.24.1','8.25']","['8.22','8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2']"],
  ["['8.23','8.24','8.24.1','8.25']","['8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2']"],
  ["['8.24','8.24.1','8.25']","['8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2']"],
  ["['8.24.1','8.25']","['8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2']"]
 ])if(s.includes(from))s=s.replaceAll(from,to);
 write(f,s);
}
{
 const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
 const map="if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}";
 const mapNext=map+"\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}\nif(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}\nif(CURRENT==='8.26.2'){sourceOwner='prepare-8262-active-rest-selector.mjs';sourceCurrent='8.26.2';sourceFrom='8.26.1'}";
 s=replaceOnce(s,map,mapNext,'Production release owner map');
 const pivot="}else if(CURRENT==='8.23'){";
 const block=`}else if(CURRENT==='8.26.2'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.26.1')fail('8.26.2 must be candidate over sealed 8.26.1');
  if(RUNTIME_SHA!=='${SEALED_SHA}'||SEALED_PR!==153)fail('8.26.2 candidate lost exact 8.26.1 seal baseline');
  if(project?.production?.candidateRelease!=='8.26.2'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.2 Production candidate state drift');
  if(CANDIDATE_PR!==155||project?.engineering?.pullRequest!==155||project?.engineering?.pullRequestDraft!==true)fail('8.26.2 candidate PR state must identify draft PR #155');
  if(project?.engineering?.activeMilestone!=='AXIS 8.26.2 — Active Rest Selector Binding'||project?.engineering?.deliveryBranch!=='fix/8262-active-rest-selector')fail('8.26.2 milestone/delivery identity drift');
  if(!(decision?.sequence===18&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.2'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix'))fail('8.26.2 version decision drift');
  const b=project?.engineering?.activeRestSelector;if(b?.status!=='8.26.2-release-candidate'||b?.canonicalSelector!=='.v87Rest'||b?.selectorBound!==true)fail('8.26.2 selector capability governance drift');
${pivot}`;
 s=replaceOnce(s,pivot,block,'8.26.2 Production candidate block');
 write(f,s);
}
console.log('[AXIS 8.26.2 governance compat] PASS · exact PR #155 candidate · sealed 8.26.1 provider evidence preserved · selector proof integrated into governed release/Production gates');
