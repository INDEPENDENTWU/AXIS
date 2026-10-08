import fs from 'node:fs';

const fail=m=>{throw new Error('[AXIS 8.28 governance compat] '+m)};
const read=f=>{if(!fs.existsSync(f))fail('missing '+f);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail('invalid '+f+': '+e.message)}};
const SEALED_SHA='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');

if(project?.product?.productionRelease!=='8.28'||project?.product?.releaseStatus!=='candidate'||project?.product?.lastSealedRelease!=='8.27'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==160||project?.product?.candidatePullRequest!==162)fail('8.28 candidate identity drift');
if(decision?.sequence!==25||decision?.base_release!=='8.27'||decision?.release!=='8.28'||decision?.decision!=='bump'||decision?.change_class!=='product-runtime')fail('8.28 version decision drift');
const v=project?.engineering?.versionDecision;
if(v?.sequence!==25||v?.baseRelease!=='8.27'||v?.release!=='8.28'||v?.decision!=='bump'||v?.changeClass!=='product-runtime')fail('project version provenance drift');
if(project?.engineering?.deliveryBranch!=='feature/828-practice-loop-convergence'||project?.engineering?.pullRequest!==162)fail('delivery identity drift');

const production=project?.production||{};
if(production.sealedRelease!=='8.27'||production.candidateRelease!=='8.28'||production.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate/sealed production state drift');
for(const provider of ['vercel','edgeOne','customDomain'])if(production?.[provider]?.sourceSha!==SEALED_SHA)fail('8.28 candidate incorrectly relabeled sealed '+provider+' evidence');

const loop=project?.engineering?.practiceLoop||{};
if(loop.status!=='8.28-release-candidate'||loop.pureOwner!=='lib/axis-practice-loop.mjs'||loop.projectionSchema!=='axis.practice-loop.v1'||loop.reloadSafe!==true||loop.promptOnRestore!==false)fail('Practice Loop governance identity drift');
for(const key of ['newStorageNamespace','flowDefinitionMutation','historicalEncounterRewrite','newSessionWriter','newEncounterWriter','newRecorderOwner','newActiveOwner','network','ai'])if(loop[key]!==false)fail('Practice Loop acquired forbidden authority '+key);

if(owners?.baselineRelease!=='8.28')fail('owner baseline must be 8.28');
const owner=owners.owners?.find(x=>x.capability==='practice-loop-convergence-828');
if(owner?.status!=='derived-runtime-release-candidate'||owner?.contract!=='axis.practice-loop.v1'||owner?.storage!=='none')fail('Practice Loop owner registry drift');

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

console.log('[AXIS 8.28 governance compat] PASS · candidate PR #162 over exact sealed 8.27 runtime · Practice Loop remains derived continuity projection');
