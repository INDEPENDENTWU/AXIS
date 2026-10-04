import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.26.5 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=s.split(from).length-1;if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const count=(s,n)=>s.split(n).length-1;

const SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');

if(project?.product?.productionRelease!=='8.26.5'||project?.product?.releaseStatus!=='production-certified')fail('8.26.5 must be Production-sealed');
if(project?.product?.lastSealedRelease!=='8.26.5'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==158||project?.product?.candidatePullRequest!==158)fail('8.26.5 exact seal identity drift');
if(decision?.sequence!==22||decision?.base_release!=='8.26.5'||decision?.release!=='8.26.5'||decision?.decision!=='confirm'||decision?.change_class!=='governance')fail('8.26.5 governance closeout decision drift');
const v=project?.engineering?.versionDecision;
if(v?.sequence!==22||v?.baseRelease!=='8.26.5'||v?.release!=='8.26.5'||v?.decision!=='confirm'||v?.changeClass!=='governance')fail('project closeout version provenance drift');

const production=project?.production||{};
if(production.sealedRelease!=='8.26.5'||production.candidateRelease!=='8.26.5'||production.candidateStatus!=='production-sealed')fail('8.26.5 Production status drift');
if(production.vercel?.deploymentId!=='dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn'||production.vercel?.sourceSha!==SEALED_SHA)fail('Vercel seal evidence drift');
if(Number(production.vercel?.currentReleaseGateRunId)!==37187139856||Number(production.vercel?.deepCompatibilityGateRunId)!==37187139889||Number(production.vercel?.productionGateRunId)!==37187159342||Number(production.vercel?.publicAliasGateRunId)!==37187159392)fail('Vercel/current/deep run evidence drift');
if(Number(production.edgeOne?.verificationRunId)!==37187139894||production.edgeOne?.sourceSha!==SEALED_SHA)fail('EdgeOne seal evidence drift');
if(Number(production.customDomain?.verificationRunId)!==37187139864||production.customDomain?.sourceSha!==SEALED_SHA)fail('custom-domain seal evidence drift');

const rail=project?.engineering?.activeRestUtilityRail,geometry=project?.engineering?.recordingReviewGeometry;
if(rail?.status!=='8.26.4-merged-unsealed-inherited')fail('8.26.4 provenance drift');
if(geometry?.status!=='production-sealed-8.26.5'||geometry?.structuralEstimateSlot!==true||geometry?.reviewGeometryStableBeforeInteraction!==true||geometry?.metricControlTolerancePx!==0.5)fail('8.26.5 Review geometry seal drift');
for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(geometry?.[key]!==false)fail(`8.26.5 acquired forbidden authority ${key}`);

if(owners?.baselineRelease!=='8.26.5')fail('owner registry baseline must be 8.26.5');
const oldRail=owners.owners?.find(x=>x.capability==='active-rest-utility-rail-8264');
const owner=owners.owners?.find(x=>x.capability==='recording-review-geometry-8265');
if(oldRail?.status!=='presentation-only-merged-unsealed-inherited')fail('8.26.4 owner provenance drift');
if(owner?.status!=='presentation-only-production-sealed'||owner?.storage!=='none'||!String(owner?.owner||'').includes('v82'))fail('8.26.5 sealed owner registry drift');

for(const f of ['README.md','docs/HANDOFF.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md']){
  const s=read(f);
  if(!s.includes('8.26.5'))fail(`${f} does not identify 8.26.5`);
  if(!/Production-sealed|Production seal|Production-certified|production-certified/.test(s))fail(`${f} does not identify the sealed state`);
}

const prepare=read('prepare-8265-recording-review-geometry.mjs'),post=read('postbuild-8265-recording-review-geometry-contract.mjs'),build=read('build-release.mjs');
for(const token of ['22.75px','id="v82Estimate"','estimate row structural before Review becomes interactive','recordingReviewGeometry'])if(!prepare.includes(token))fail(`8.26.5 source proof missing ${token}`);
if(!prepare.includes("const FROM='8.26.4',VERSION='8.26.5'"))fail('8.26.5 release transition drift');
if(!build.includes("'prepare-8265-recording-review-geometry.mjs'"))fail('8.26.5 prepare is not deterministic build authority');
if(!post.includes('recordingReviewGeometry8265:true'))fail('8.26.5 postbuild gate marker missing');

{
  const f='scripts/axis-repository-contract.mjs';let s=read(f);
  const old="const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
  const next="const expectedSteps=CURRENT==='8.26.5'?93:CURRENT==='8.26.4'?92:CURRENT==='8.26.3'?91:CURRENT==='8.26.2'?90:CURRENT==='8.26.1'?89:CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;";
  s=replaceOnce(s,old,next,'repository deterministic step family');
  for(const [from,to] of [
    ["['8.22','8.23','8.24','8.24.1','8.25']","['8.22','8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5']"],
    ["['8.23','8.24','8.24.1','8.25']","['8.23','8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5']"],
    ["['8.24','8.24.1','8.25']","['8.24','8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5']"],
    ["['8.24.1','8.25']","['8.24.1','8.25','8.25.1','8.26','8.26.1','8.26.2','8.26.3','8.26.4','8.26.5']"]
  ])if(s.includes(from))s=s.replaceAll(from,to);
  write(f,s);
}

{
  const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
  const map="if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}";
  const mapNext=map+"\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}\nif(CURRENT==='8.26.1'){sourceOwner='prepare-8261-active-rest-state.mjs';sourceCurrent='8.26.1';sourceFrom='8.26'}\nif(CURRENT==='8.26.2'){sourceOwner='prepare-8262-active-rest-selector.mjs';sourceCurrent='8.26.2';sourceFrom='8.26.1'}\nif(CURRENT==='8.26.3'){sourceOwner='prepare-8263-active-rest-convergence.mjs';sourceCurrent='8.26.3';sourceFrom='8.26.2'}\nif(CURRENT==='8.26.4'){sourceOwner='prepare-8264-active-rest-utility-rail.mjs';sourceCurrent='8.26.4';sourceFrom='8.26.3'}\nif(CURRENT==='8.26.5'){sourceOwner='prepare-8265-recording-review-geometry.mjs';sourceCurrent='8.26.5';sourceFrom='8.26.4'}";
  s=replaceOnce(s,map,mapNext,'Production release owner map');
  const pivot="}else if(CURRENT==='8.23'){";
  const block=`}else if(CURRENT==='8.26.5'){
  if(candidate||STATUS!=='production-certified'||SEALED!=='8.26.5')fail('8.26.5 must be Production-certified and sealed');
  if(RUNTIME_SHA!=='${SEALED_SHA}'||SEALED_PR!==158)fail('8.26.5 exact product/runtime seal identity drift');
  if(project?.production?.candidateRelease!=='8.26.5'||project?.production?.candidateStatus!=='production-sealed')fail('8.26.5 Production status drift');
  if(CANDIDATE_PR!==158||project?.engineering?.pullRequest!==158||project?.engineering?.pullRequestDraft!==false)fail('8.26.5 completed PR identity drift');
  if(!(decision?.sequence===22&&decision?.base_release==='8.26.5'&&decision?.release==='8.26.5'&&decision?.decision==='confirm'&&decision?.change_class==='governance'))fail('8.26.5 closeout version decision drift');
  const g=project?.engineering?.recordingReviewGeometry;if(g?.status!=='production-sealed-8.26.5'||g?.structuralEstimateSlot!==true||g?.reviewGeometryStableBeforeInteraction!==true||g?.metricControlTolerancePx!==0.5)fail('8.26.5 Review geometry seal drift');
  const p=project?.production||{};if(p.vercel?.deploymentId!=='dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn'||Number(p.vercel?.currentReleaseGateRunId)!==37187139856||Number(p.vercel?.deepCompatibilityGateRunId)!==37187139889||Number(p.vercel?.productionGateRunId)!==37187159342||Number(p.vercel?.publicAliasGateRunId)!==37187159392)fail('8.26.5 Vercel seal evidence drift');if(Number(p.edgeOne?.verificationRunId)!==37187139894||Number(p.customDomain?.verificationRunId)!==37187139864)fail('8.26.5 EdgeOne/custom-domain seal evidence drift');
${pivot}`;
  s=replaceOnce(s,pivot,block,'8.26.5 Production sealed block');
  write(f,s);
}

const selectorSmoke='node scripts/axis-8262-active-rest-selector-smoke.mjs';
for(const [path,want,label] of [
  ['.github/workflows/axis-current-release-gate.yml',2,'Current Release'],
  ['.github/workflows/axis-edgeone-production-mirror.yml',2,'EdgeOne Production'],
  ['.github/workflows/axis-custom-domain-production.yml',2,'axis.juele.fun'],
  ['.github/workflows/axis-production-deployment-gate.yml',1,'fixed Vercel Production']
])if(count(read(path),selectorSmoke)!==want)fail(`${label} must retain chained Review geometry proof ${want} time(s)`);

console.log('[AXIS 8.26.5 governance compat] PASS · exact Production seal recorded · provider evidence bound to 5bf575730c5c · 8.26.4 provenance preserved');
