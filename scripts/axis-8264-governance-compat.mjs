import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.4 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const count=(s,n)=>s.split(n).length-1;
const SEALED_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const MERGED_8263='ed418938c07383745d5485c2a46d37d20bfbebc7';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');

if(project?.product?.productionRelease!=='8.26.4'||project?.product?.releaseStatus!=='candidate')fail('8.26.4 must remain candidate before exact merged-main certification');
if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==153||project?.product?.candidatePullRequest!==157)fail('8.26.4 candidate must preserve exact 8.26.1 seal and PR #157 identity');
if(decision?.sequence!==20||decision?.base_release!=='8.26.3'||decision?.release!=='8.26.4'||decision?.decision!=='bump'||decision?.change_class!=='bug-fix')fail('version decision must be 8.26.3 -> 8.26.4 / bump / sequence 20 / bug-fix');
const v=project?.engineering?.versionDecision;if(v?.sequence!==20||v?.baseRelease!=='8.26.3'||v?.release!=='8.26.4'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('project version provenance drift');
if(project?.engineering?.deliveryBranch!=='fix/8264-active-rest-utility-rail'||project?.engineering?.pullRequest!==157||project?.engineering?.pullRequestDraft!==false)fail('8.26.4 delivery identity drift');
const production=project?.production||{};
if(production.sealedRelease!=='8.26.1'||production.candidateRelease!=='8.26.4'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate/sealed production state drift');
if(production.vercel?.sourceSha!==SEALED_SHA||production.edgeOne?.sourceSha!==SEALED_SHA||production.customDomain?.sourceSha!==SEALED_SHA)fail('candidate incorrectly relabeled sealed provider evidence');
if(!read('docs/CURRENT_WORK.md').includes(MERGED_8263))fail('merged-but-unsealed 8.26.3 provenance is not documented');

const conv=project?.engineering?.activeRestConvergence,rail=project?.engineering?.activeRestUtilityRail;
if(conv?.status!=='8.26.3-merged-unsealed-inherited'||conv?.pausedRailHeightPx!==32||conv?.runningRestGeometry!=='zero')fail('8.26.3 convergence provenance drift');
for(const key of ['restInsideExistingActionGrid','pausedRestAndAdjustSameRow','restSpeakGeometryStable','restSpeakExistingActionPreserved','activeAdjustExistingActionPreserved','pausedTruthOwnerUnchanged','timerTruthOwnerUnchanged','reducedMotionSafe'])if(rail?.[key]!==true)fail(`8.26.4 utility rail capability missing ${key}`);
if(rail?.status!=='8.26.4-release-candidate'||rail?.pausedRailHeightPx!==32||rail?.planCompleteRestGeometry!=='zero'||rail?.pausedPill!==false||rail?.pausedTextPresence!=='strong-secondary')fail('8.26.4 presentation boundary drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(rail?.[key]!==false)fail(`8.26.4 acquired forbidden authority ${key}`);
if(owners?.baselineRelease!=='8.26.4')fail('owner registry baseline must be 8.26.4');
const convOwner=owners.owners?.find(x=>x.capability==='active-rest-convergence-8263'),railOwner=owners.owners?.find(x=>x.capability==='active-rest-utility-rail-8264');
if(convOwner?.status!=='presentation-only-merged-unsealed-inherited'||convOwner?.storage!=='none')fail('8.26.3 convergence owner provenance drift');
if(railOwner?.status!=='presentation-only-release-candidate'||railOwner?.storage!=='none'||!String(railOwner?.owner||'').includes('v87Rest'))fail('8.26.4 utility rail owner drift');

const prepare=read('prepare-8264-active-rest-utility-rail.mjs'),post=read('postbuild-8264-active-rest-utility-rail-contract.mjs'),build=read('build-release.mjs');
for(const token of ['rest/Adjust baseline drift','data-status="plan-complete"','font-size:12.5px!important','axis8264ActiveRestUtilityStyle'])if(!prepare.includes(token))fail(`8.26.4 source proof missing ${token}`);
if(!prepare.includes("const FROM='8.26.3',VERSION='8.26.4'"))fail('8.26.4 release transition drift');
if(!build.includes("'prepare-8264-active-rest-utility-rail.mjs'"))fail('8.26.4 prepare is not deterministic build authority');
if(!post.includes('activeRestUtilityRail8264:true'))fail('8.26.4 postbuild gate marker missing');
const selectorSmoke='node scripts/axis-8262-active-rest-selector-smoke.mjs';
for(const [path,want,label] of [
 ['.github/workflows/axis-current-release-gate.yml',2,'Current Release'],
 ['.github/workflows/axis-edgeone-production-mirror.yml',2,'EdgeOne Production'],
 ['.github/workflows/axis-custom-domain-production.yml',2,'axis.juele.fun'],
 ['.github/workflows/axis-production-deployment-gate.yml',1,'fixed Vercel Production']
])if(count(read(path),selectorSmoke)!==want)fail(`${label} must run Active Rest utility proof ${want} time(s)`);

{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 const old="const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 const next="const expectedSteps=CURRENT==='8.26.4'?92:CURRENT==='8.26.3'?91:CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
 s=replaceOnce(s,old,next,'repository deterministic step family');
 for(const [from,to] of [
  ["['8.22','8.23','8.24','8.24.1','8.25']","['8.22','8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4']"],
  ["['8.23','8.24','8.24.1','8.25']","['8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4']"],
  ["['8.24','8.24.1','8.25']","['8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4']"],
  ["['8.24.1','8.25']","['8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4']"]
 ])if(s.includes(from))s=s.replaceAll(from,to);
 write(f,s);
}

{
 const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
 const map="if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}";
 const mapNext=map+"\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}\nif(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}\nif(CURRENT==='8.26.2'){sourceOwner='prepare-8262-active-rest-selector.mjs';sourceCurrent='8.26.2';sourceFrom='8.26.1'}\nif(CURRENT==='8.26.3'){sourceOwner='prepare-8263-active-rest-convergence.mjs';sourceCurrent='8.26.3';sourceFrom='8.26.2'}\nif(CURRENT==='8.26.4'){sourceOwner='prepare-8264-active-rest-utility-rail.mjs';sourceCurrent='8.26.4';sourceFrom='8.26.3'}";
 s=replaceOnce(s,map,mapNext,'Production release owner map');
 const pivot="}else if(CURRENT==='8.23'){";
 const block=`}else if(CURRENT==='8.26.4'){
  if(!candidate||STATUS!=='candidate'||SEALED!=='8.26.1')fail('8.26.4 must be candidate over sealed 8.26.1');
  if(RUNTIME_SHA!=='${SEALED_SHA}'||SEALED_PR!==153)fail('8.26.4 candidate lost exact 8.26.1 seal baseline');
  if(project?.production?.candidateRelease!=='8.26.4'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26.4 Production candidate state drift');
  if(CANDIDATE_PR!==157||project?.engineering?.pullRequest!==157||project?.engineering?.pullRequestDraft!==false)fail('8.26.4 candidate PR state must identify ready PR #157');
  if(project?.engineering?.activeMilestone!=='AXIS 8.26.4 — Active Rest Utility Rail'||project?.engineering?.deliveryBranch!=='fix/8264-active-rest-utility-rail')fail('8.26.4 milestone/delivery identity drift');
  if(!(decision?.sequence===20&&decision?.base_release==='8.26.3'&&decision?.release==='8.26.4'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix'))fail('8.26.4 version decision drift');
  const c=project?.engineering?.activeRestUtilityRail;if(c?.status!=='8.26.4-release-candidate'||c?.pausedRailHeightPx!==32||c?.planCompleteRestGeometry!=='zero'||c?.pausedRestAndAdjustSameRow!==true)fail('8.26.4 utility rail governance drift');
${pivot}`;
 s=replaceOnce(s,pivot,block,'8.26.4 Production candidate block');
 write(f,s);
}
console.log('[AXIS 8.26.4 governance compat] PASS · exact PR #157 candidate · merged-unsealed 8.26.3 provenance · sealed 8.26.1 provider evidence preserved · utility rail proof integrated into governed release/Production gates');
