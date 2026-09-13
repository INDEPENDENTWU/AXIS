import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const count=(s,n)=>s.split(n).length-1;
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=count(s,from);if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const replaceAllExact=(s,from,to,label)=>{if(s.includes(to)&&!s.includes(from))return s;const n=count(s,from);if(!n)fail(`${label} source token missing`);return s.replaceAll(from,to)};

const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const decision8251=decision?.sequence===12&&decision?.base_release==='8.25'&&decision?.release==='8.25.1'&&decision?.decision==='bump'&&decision?.change_class==='product-ui';
const decision826=decision?.sequence===13&&decision?.base_release==='8.25.1'&&decision?.release==='8.26'&&decision?.decision==='bump'&&decision?.change_class==='product-ui';
if(!(decision8251||decision826))fail('version decision must preserve 8.25 -> 8.25.1 or advance exactly to direct successor 8.25.1 -> 8.26');

if(decision8251){
 if(project?.product?.productionRelease!=='8.25.1'||project?.product?.releaseStatus!=='candidate')fail('8.25.1 project state drift');
 if(project?.product?.lastSealedRelease!=='8.25'||project?.product?.productionRuntimeSha!=='e28f0411288e42fc68e70a79a4180a06f7d18ee3')fail('8.25.1 must preserve exact sealed 8.25 main baseline');
 if(project?.product?.productionPullRequest!==150||project?.product?.candidatePullRequest!==151)fail('8.25.1 sealed/candidate PR identity drift');
 if(project?.engineering?.deliveryBranch!=='axis-8251-inline-set-morph'||project?.engineering?.pullRequest!==151||project?.engineering?.pullRequestDraft!==true)fail('8.25.1 delivery identity drift');
 if(owners?.baselineRelease!=='8.25.1')fail('owner registry baseline must be 8.25.1');
}else{
 if(project?.product?.productionRelease!=='8.26'||project?.product?.releaseStatus!=='candidate')fail('direct successor project state must be 8.26 candidate');
 if(project?.product?.lastSealedRelease!=='8.25.1'||project?.product?.productionRuntimeSha!=='f4d3d02e1a7b655185806b2dbb3bface804d93cc')fail('8.26 must preserve exact sealed 8.25.1 main baseline');
 if(project?.product?.productionPullRequest!==151||project?.product?.candidatePullRequest!==152)fail('8.26 sealed/candidate PR identity drift');
 if(project?.engineering?.deliveryBranch!=='release/826-active-continuity'||project?.engineering?.pullRequest!==152||project?.engineering?.pullRequestDraft!==true)fail('8.26 delivery identity drift');
 if(owners?.baselineRelease!=='8.26')fail('owner registry baseline must be 8.26');
}

const morph=project?.engineering?.activeInlineSetMorph;
for(const key of ['postFactOnly','inStageFactRow','stableStageGeometry','nonOverlapping','railConfirmation','buttonReturn','clockSettle','boundedHaptic','reducedMotionSafe'])if(morph?.[key]!==true)fail(`Inline Set Morph governed capability missing ${key}`);
if(morph?.fullScreenOverlay!==false||morph?.pointerEvents!==false)fail('Inline Set Morph overlay/pointer boundary drift');
const wantMorphStatus=decision826?'production-sealed-8.25.1-inherited':'8.25.1-release-candidate';
if(morph?.status!==wantMorphStatus)fail(`Inline Set Morph status drift ${morph?.status}`);
for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(morph?.[key]!==false)fail(`Inline Set Morph acquired forbidden authority ${key}`);
const oldOwner=owners.owners?.find(x=>x.capability==='active-set-lock-825'),morphOwner=owners.owners?.find(x=>x.capability==='active-inline-set-morph-8251');
if(oldOwner?.status!=='presentation-only-production-sealed-superseded'||oldOwner?.storage!=='none')fail('8.25 Set Lock owner must stay sealed and presentation-superseded');
if(morphOwner?.storage!=='none')fail('8.25.1 Inline Set Morph acquired storage authority');
if(decision826){
 if(morphOwner?.status!=='presentation-only-production-sealed')fail('8.26 must inherit sealed 8.25.1 Inline Set Morph owner');
 const continuity=project?.engineering?.activeContinuity,continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826');
 for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','setCuePostFactOnly','stableStageGeometry','nonOverlapping','reducedMotionSafe','quieterHomeHierarchy'])if(continuity?.[key]!==true)fail(`8.26 Active Continuity capability missing ${key}`);
 for(const key of ['newTrainingOwner','newStorage','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(continuity?.[key]!==false)fail(`8.26 Active Continuity acquired forbidden authority ${key}`);
 if(continuity?.setCuePointerEvents!==false||continuity?.status!=='8.26-release-candidate')fail('8.26 Active Continuity pointer/status boundary drift');
 if(continuityOwner?.status!=='presentation-and-coordination-release-candidate'||continuityOwner?.storage!=='none')fail('8.26 owner registry drift');
}else if(morphOwner?.status!=='presentation-only-release-candidate')fail('8.25.1 Inline Set Morph owner registry drift');

for(const [path,needle] of [
 ['prepare-8241-dock-occlusion.mjs',"await import('./prepare-8251-inline-set-morph.mjs')"],
 ['postbuild-825-set-lock-contract.mjs',"await import('./postbuild-8251-inline-set-morph-contract.mjs')"],
 ['scripts/axis-8241-dock-occlusion-smoke.mjs',"await import('./axis-8251-inline-set-morph-smoke.mjs')"]
])if(!read(path).includes(needle))fail(`${path} does not chain 8.25.1 authority`);
if(read('scripts/axis-8241-dock-occlusion-smoke.mjs').includes("await import('./axis-825-set-lock-smoke.mjs')"))fail('superseded 8.25 fullscreen smoke remains active in current physical chain');
for(const path of ['prepare-8251-inline-set-morph.mjs','postbuild-8251-inline-set-morph-contract.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','styles/axis-8251-inline-set-morph.css'])if(!fs.existsSync(path))fail(`8.25.1 release surface missing ${path}`);
if(decision826)for(const path of ['prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-826-active-continuity-smoke.mjs','styles/axis-826-active-continuity.css'])if(!fs.existsSync(path))fail(`8.26 release surface missing ${path}`);

const workflows=[
 ['.github/workflows/axis-current-release-gate.yml','Current Release',2],
 ['.github/workflows/axis-edgeone-production-mirror.yml','EdgeOne Production',2],
 ['.github/workflows/axis-custom-domain-production.yml','axis.juele.fun',2],
 ['.github/workflows/axis-production-deployment-gate.yml','fixed Vercel Production',1]
];
for(const [path,label,want] of workflows){const s=read(path);if(count(s,'node scripts/axis-8241-dock-occlusion-smoke.mjs')!==want)fail(`${label} must preserve inherited 8.24.1 physical chain ${want} time(s)`)}

{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 for(const [from,to,label] of [
  ["['8.22','8.23','8.24','8.24.1','8.25']",decision826?"['8.22','8.23','8.24','8.24.1','8.25','8.25.1','8.26']":"['8.22','8.23','8.24','8.24.1','8.25','8.25.1']",'repository inherited replay family'],
  ["['8.23','8.24','8.24.1','8.25']",decision826?"['8.23','8.24','8.24.1','8.25','8.25.1','8.26']":"['8.23','8.24','8.24.1','8.25','8.25.1']",'repository inherited continuity family'],
  ["['8.24','8.24.1','8.25']",decision826?"['8.24','8.24.1','8.25','8.25.1','8.26']":"['8.24','8.24.1','8.25','8.25.1']",'repository inherited tactile family'],
  ["['8.24.1','8.25']",decision826?"['8.24.1','8.25','8.25.1','8.26']":"['8.24.1','8.25','8.25.1']",'repository inherited dock family']
 ])s=replaceAllExact(s,from,to,label);
 s=replaceOnce(s,"const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;",decision826?"const expectedSteps=CURRENT==='8.26'?88:['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;":"const expectedSteps=['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;",'repository deterministic step family');
 if(decision826){
  const block=`if(CURRENT==='8.26'){\n  if(STATUS!=='candidate'||SEALED!=='8.25.1'||PROD_SHA!=='f4d3d02e1a7b655185806b2dbb3bface804d93cc')fail('8.26 candidate must preserve exact sealed 8.25.1 baseline');\n  if(project?.product?.productionPullRequest!==151||project?.product?.candidatePullRequest!==152)fail('8.26 sealed/candidate PR identity drift');\n  if(project?.engineering?.deliveryBranch!=='release/826-active-continuity'||project?.engineering?.pullRequest!==152||project?.engineering?.pullRequestDraft!==true)fail('8.26 delivery identity drift');\n  if(project?.engineering?.versionDecision?.sequence!==13||project?.engineering?.versionDecision?.baseRelease!=='8.25.1'||project?.engineering?.versionDecision?.release!=='8.26'||project?.engineering?.versionDecision?.decision!=='bump'||project?.engineering?.versionDecision?.changeClass!=='product-ui')fail('8.26 governed version decision drift');\n  const c=project?.engineering?.activeContinuity;for(const key of ['atomicSaveSettlement','ongoingFlowDirectActive','oneShotFlowCanonicalRecorder','foreignActivePausePreserve','kineticSetCue','setCuePostFactOnly','stableStageGeometry','nonOverlapping','reducedMotionSafe','quieterHomeHierarchy'])if(c?.[key]!==true)fail('8.26 capability missing '+key);\n}\n\n`;
  s=replaceOnce(s,'const required=[',block+'const required=[','repository 8.26 governance block');
  const ownerBlock=`if(CURRENT==='8.26'){const morph=(owners.owners||[]).find(x=>x.capability==='active-inline-set-morph-8251'),c=(owners.owners||[]).find(x=>x.capability==='active-continuity-826');if(morph?.status!=='presentation-only-production-sealed'||morph?.storage!=='none')fail('8.26 lost sealed 8.25.1 Inline Set Morph owner');if(c?.status!=='presentation-and-coordination-release-candidate'||c?.storage!=='none')fail('8.26 Active Continuity owner registry drift')}\n`;
  s=replaceOnce(s,'const build=read(\'build-release.mjs\');',ownerBlock+'const build=read(\'build-release.mjs\');','repository 8.26 owner block');
  const chain=`if(CURRENT==='8.26'){const p=read('prepare-826-active-continuity.mjs'),pb=read('postbuild-826-active-continuity-contract.mjs');if(!p.includes("const FROM='8.25.1',VERSION='8.26'"))fail('8.26 release transition drift');if(!build.includes("'prepare-826-active-continuity.mjs'"))fail('8.26 prepare is not deterministic build authority');for(const path of ['prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-826-active-continuity-smoke.mjs','styles/axis-826-active-continuity.css'])if(!fs.existsSync(path))fail('8.26 release surface missing '+path);if(!pb.includes('activeContinuity826:true'))fail('8.26 postbuild contract marker missing')}\n\n`;
  s=replaceOnce(s,'const convergenceDriver=read(\'prepare-8151-regression-seal.mjs\');',chain+'const convergenceDriver=read(\'prepare-8151-regression-seal.mjs\');','repository 8.26 chain block');
 }
 write(f,s);
}
{
 const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
 s=replaceOnce(s,"if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}",decision826?"if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}\nif(CURRENT==='8.26'){sourceOwner='prepare-826-active-continuity.mjs';sourceCurrent='8.26';sourceFrom='8.25.1'}":"if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}",'Production release owner map');
 s=replaceAllExact(s,"['8.24.1','8.25']",decision826?"['8.24.1','8.25','8.25.1','8.26']":"['8.24.1','8.25','8.25.1']",'Production inherited physical family');
 if(decision826){
  const block=`else if(CURRENT==='8.26'){\n  if(!candidate||STATUS!=='candidate'||SEALED!=='8.25.1')fail('8.26 must be candidate over sealed 8.25.1');\n  if(RUNTIME_SHA!=='f4d3d02e1a7b655185806b2dbb3bface804d93cc'||SEALED_PR!==151)fail('8.26 candidate lost exact 8.25.1 Production seal baseline');\n  if(project?.production?.candidateRelease!=='8.26'||project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('8.26 Production candidate state drift');\n  if(CANDIDATE_PR!==152||project?.engineering?.pullRequest!==152||project?.engineering?.pullRequestDraft!==true)fail('8.26 candidate PR state must identify draft PR #152');\n  if(project?.engineering?.activeMilestone!=='AXIS 8.26 — Active Continuity'||project?.engineering?.deliveryBranch!=='release/826-active-continuity')fail('8.26 milestone/delivery identity drift');\n  if(!(decision?.sequence===13&&decision?.base_release==='8.25.1'&&decision?.release==='8.26'&&decision?.decision==='bump'&&decision?.change_class==='product-ui'))fail('8.26 version decision drift');\n}`;
  s=replaceOnce(s,"}else if(CURRENT==='8.23'){",'}'+block+"else if(CURRENT==='8.23'){",'Production 8.26 candidate block');
  s=replaceOnce(s,"if(CURRENT==='8.25'){\n  const inheritedSmoke=read('scripts/axis-8241-dock-occlusion-smoke.mjs');",`if(CURRENT==='8.26'){for(const [text,label,want] of [[currentWorkflow,'Current Release',2],[edgeWorkflow,'EdgeOne Production',2],[customWorkflow,'axis.juele.fun',2],[vercelWorkflow,'fixed Vercel Production',1]])if(count(text,'node scripts/axis-826-active-continuity-smoke.mjs')!==want)fail(label+' must prove 8.26 Active Continuity '+want+' time(s)');}\nif(CURRENT==='8.25'){\n  const inheritedSmoke=read('scripts/axis-8241-dock-occlusion-smoke.mjs');`,'Production 8.26 physical proof block');
 }
 write(f,s);
}

console.log(`[AXIS 8.25.1 governance compat] PASS · ${decision826?'sealed 8.25.1 baseline / direct-successor 8.26 governance':'sealed 8.25 baseline / 8.25.1 current'} · inherited contracts converged without relaxing ownership assertions`);
