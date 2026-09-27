import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.3 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const count=(s,n)=>s.split(n).length-1;
const SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const MERGED_8262='7662d857fd5d442e3a7f775a430f0d4d8479bece';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');

if(project?.product?.productionRelease!=='8.26.3'||project?.product?.releaseStatus!=='candidate')fail('8.26.3 must remain candidate before exact merged-main certification');
if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==153||project?.product?.candidatePullRequest!==156)fail('8.26.3 candidate must preserve exact 8.26.1 seal and PR #156 identity');
if(decision?.sequence!==19||decision?.base_release!=='8.26.2'||decision?.release!=='8.26.3'||decision?.decision!=='bump'||decision?.change_class!=='bug-fix')fail('version decision must be 8.26.2 -> 8.26.3 / bump / sequence 19 / bug-fix');
const v=project?.engineering?.versionDecision;if(v?.sequence!==19||v?.baseRelease!=='8.26.2'||v?.release!=='8.26.3'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('project version provenance drift');
if(project?.engineering?.deliveryBranch!=='fix/8262-rest-convergence'||project?.engineering?.pullRequest!==156||project?.engineering?.pullRequestDraft!==false)fail('8.26.3 delivery identity drift');
const production=project?.production||{};
if(production.sealedRelease!=='8.26.1'||production.candidateRelease!=='8.26.3'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate/sealed production state drift');
if(production.vercel?.sourceSha!==SEALED_SHA||production.edgeOne?.sourceSha!==SEALED_SHA||production.customDomain?.sourceSha!==SEALED_SHA)fail('candidate incorrectly relabeled sealed provider evidence');
if(!read('docs/CURRENT_WORK.md').includes(MERGED_8262))fail('merged-but-unsealed 8.26.2 provenance is not documented');

const selector=project?.engineering?.activeRestSelector,conv=project?.engineering?.activeRestConvergence;
if(selector?.status!=='8.26.2-merged-unsealed-inherited'||selector?.canonicalSelector!=='.v87Rest'||selector?.selectorBound!==true)fail('8.26.2 selector provenance drift');
for(const key of ['pausedSingleStatus','restSpeakGeometryStable','restSpeakExistingActionPreserved','pausedTruthOwnerUnchanged','timerTruthOwnerUnchanged','reducedMotionSafe'])if(conv?.[key]!==true)fail(`8.26.3 convergence capability missing ${key}`);
if(conv?.status!=='8.26.3-release-candidate'||conv?.pausedRailHeightPx!==32||conv?.runningRestGeometry!=='zero'||conv?.pausedPill!==false)fail('8.26.3 presentation boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(conv?.[key]!==false)fail(`8.26.3 acquired forbidden authority ${key}`);
if(owners?.baselineRelease!=='8.26.3')fail('owner registry baseline must be 8.26.3');
const selectorOwner=owners.owners?.find(x=>x.capability==='active-rest-selector-8262'),convOwner=owners.owners?.find(x=>x.capability==='active-rest-convergence-8263');
if(selectorOwner?.status!=='presentation-only-merged-unsealed-inherited'||selectorOwner?.storage!=='none')fail('8.26.2 selector owner provenance drift');
if(convOwner?.status!=='presentation-only-release-candidate'||convOwner?.storage!=='none'||!String(convOwner?.owner||'').includes('v87Rest'))fail('8.26.3 convergence owner drift');

const css=read('styles/axis-826-active-continuity.css'),prepare=read('prepare-8263-active-rest-convergence.mjs'),post=read('postbuild-8263-active-rest-convergence-contract.mjs'),build=read('build-release.mjs');
for(const token of ['[data-status="active"] .v87Rest{display:none!important','height:32px!important;min-height:32px!important;max-height:32px!important','.v87Rest.v89Speak{display:flex!important','pointer-events:auto!important'])if(!css.includes(token))fail(`8.26.3 CSS proof missing ${token}`);
if(!prepare.includes("const FROM='8.26.2',VERSION='8.26.3'"))fail('8.26.3 release transition drift');
if(!build.includes("'prepare-8263-active-rest-convergence.mjs'"))fail('8.26.3 prepare is not deterministic build authority');
if(!post.includes('activeRestConvergence8263:true'))fail('8.26.3 postbuild gate marker missing');
const selectorSmoke='node scripts/axis-8262-active-rest-selector-smoke.mjs';
for(const [path,want,label] of [
 ['.github/workflows/axis-current-release-gate.yml',2,'Current Release'],
 ['.github/workflows/axis-edgeone-production-mirror.yml',2,'EdgeOne Production'],
 ['.github/workflows/axis-custom-domain-production.yml',2,'axis.juele.fun'],
 ['.github/workflows/axis-production-deployment-gate.yml',1,'fixed Vercel Production']
])if(count(read(path),selectorSmoke)!==want)fail(`${label} must run Active Rest convergence proof ${want} time(s)`);

/* Converge source-stable repository contract to the current deterministic build. */
{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const old="const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 const next="const expectedSteps=CURRENT==='8.26.3'?91:CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 s=replaceOnce(s,old,next,'repository deterministic step family');
 for(const [from,to] of [
  ["['8.22','8.23','8.24','8.24.1','8.25']","['8.22','8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3']"],
  ["['8.23','8.24','8.24.1','8.25']","['8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3']"],
  ["['8.24','8.24.1','8.25']","['8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3']"],
  ["['8.24.1','8.25']","['8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3']"]
 ])if(s.includes(from))s=s.replaceAll(from,to);
 write(f,s);
}

/* Production contract learns the release-owner lineage and this exact candidate. */
{
 const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
 const map="if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}";
 const mapNext=map+"\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}\nif(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}\nif(CURRENT==='8.26.2'){sourceOwner='prepare-8262-active-rest-selector.mjs';sourceCurrent='8.26.2';sourceFrom='8.26.1'}\nif(CURRENT==='8.26.3'){sourceOwner='prepare-8263-active-rest-convergence.mjs';sourceCurrent='8.26.3';sourceFrom='8.26.2'}";
 s=replaceOnce(s,map,mapNext,'Production release owner map');
 const pivot="}else if(CURRENT==='8.23'){";
 const block=`}else if(CURRENT==='8.26.3'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.26.1')fail('8.26.3 must be candidate over sealed 8.26.1');
  if(RUNTIME_SHA!=='${SEALED_SHA}'||SEALED_PR!==153)fail('8.26.3 candidate lost exact 8.26.1 seal baseline');
  if(project?.production?.candidateRelease!=='8.26.3'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.3 Production candidate state drift');
  if(CANDIDATE_PR!==156||project?.engineering?.pullRequest!==156||project?.engineering?.pullRequestDraft!==false)fail('8.26.3 candidate PR state must identify ready PR #156');
  if(project?.engineering?.activeMilestone!=='AXIS 8.26.3 — Active Rest Convergence'||project?.engineering?.deliveryBranch!=='fix/8262-rest-convergence')fail('8.26.3 milestone/delivery identity drift');
  if(!(decision?.sequence===19&&decision?.base_release==='8.26.2'&&decision?.release==='8.26.3'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix'))fail('8.26.3 version decision drift');
  const c=project?.engineering?.activeRestConvergence;if(c?.status!=='8.26.3-release-candidate'||c?.pausedRailHeightPx!==32||c?.runningRestGeometry!=='zero'||c?.restSpeakGeometryStable!==true)fail('8.26.3 convergence capability governance drift');
${pivot}`;
 s=replaceOnce(s,pivot,block,'8.26.3 Production candidate block');
 write(f,s);
}
console.log('[AXIS 8.26.3 governance compat] PASS · exact PR #156 candidate · merged-unsealed 8.26.2 provenance · sealed 8.26.1 provider evidence preserved · convergence proof integrated into governed release/Production gates');
