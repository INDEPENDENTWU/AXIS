import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const write=(f,s)=>fs.writeFileSync(f,s);
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const count=(s,n)=>s.split(n).length-1;
const replaceOnce=(s,from,to,label)=>{if(s.includes(to))return s;const n=count(s,from);if(n!==1)fail(`${label} expected once, found ${n}`);return s.replace(from,to)};
const replaceAllExact=(s,from,to,label)=>{if(s.includes(to)&&!s.includes(from))return s;const n=count(s,from);if(!n)fail(`${label} source token missing`);return s.replaceAll(from,to)};

const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
if(project?.product?.productionRelease!=='8.25.1'||project?.product?.releaseStatus!=='candidate')fail('project current release must be 8.25.1 candidate');
if(project?.product?.lastSealedRelease!=='8.25'||project?.product?.productionRuntimeSha!=='e28f0411288e42fc68e70a79a4180a06f7d18ee3')fail('8.25.1 must preserve exact sealed 8.25 main baseline');
if(project?.product?.productionPullRequest!==150||project?.product?.candidatePullRequest!==151)fail('8.25.1 sealed/candidate PR identity drift');
if(project?.engineering?.deliveryBranch!=='axis-8251-inline-set-morph'||project?.engineering?.pullRequest!==151||project?.engineering?.pullRequestDraft!==true)fail('8.25.1 delivery identity drift');
if(!(decision?.sequence===12&&decision?.base_release==='8.25'&&decision?.release==='8.25.1'&&decision?.decision==='bump'&&decision?.change_class==='product-ui'))fail('version decision must be 8.25 -> 8.25.1 / bump / sequence 12 / product-ui');
const morph=project?.engineering?.activeInlineSetMorph;
for(const key of ['postFactOnly','inStageFactRow','stableStageGeometry','nonOverlapping','railConfirmation','buttonReturn','clockSettle','boundedHaptic','reducedMotionSafe'])if(morph?.[key]!==true)fail(`Inline Set Morph governed capability missing ${key}`);
if(morph?.fullScreenOverlay!==false||morph?.pointerEvents!==false||morph?.status!=='8.25.1-release-candidate')fail('Inline Set Morph overlay/pointer/status boundary drift');
for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(morph?.[key]!==false)fail(`Inline Set Morph acquired forbidden authority ${key}`);
if(owners?.baselineRelease!=='8.25.1')fail('owner registry baseline must be 8.25.1');
const oldOwner=owners.owners?.find(x=>x.capability==='active-set-lock-825'),newOwner=owners.owners?.find(x=>x.capability==='active-inline-set-morph-8251');
if(oldOwner?.status!=='presentation-only-production-sealed-superseded'||oldOwner?.storage!=='none')fail('8.25 Set Lock owner must be sealed and presentation-superseded');
if(newOwner?.status!=='presentation-only-release-candidate'||newOwner?.storage!=='none')fail('8.25.1 Inline Set Morph owner registry drift');

for(const [path,needle] of [
 ['prepare-8241-dock-occlusion.mjs',"await import('./prepare-8251-inline-set-morph.mjs')"],
 ['postbuild-825-set-lock-contract.mjs',"await import('./postbuild-8251-inline-set-morph-contract.mjs')"],
 ['scripts/axis-8241-dock-occlusion-smoke.mjs',"await import('./axis-8251-inline-set-morph-smoke.mjs')"]
])if(!read(path).includes(needle))fail(`${path} does not chain 8.25.1 authority`);
if(read('scripts/axis-8241-dock-occlusion-smoke.mjs').includes("await import('./axis-825-set-lock-smoke.mjs')"))fail('superseded 8.25 fullscreen smoke remains active in current physical chain');
for(const path of ['prepare-8251-inline-set-morph.mjs','postbuild-8251-inline-set-morph-contract.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','styles/axis-8251-inline-set-morph.css'])if(!fs.existsSync(path))fail(`8.25.1 release surface missing ${path}`);

const workflows=[
 ['.github/workflows/axis-current-release-gate.yml','Current Release',2],
 ['.github/workflows/axis-edgeone-production-mirror.yml','EdgeOne Production',2],
 ['.github/workflows/axis-custom-domain-production.yml','axis.juele.fun',2],
 ['.github/workflows/axis-production-deployment-gate.yml','fixed Vercel Production',1]
];
for(const [path,label,want] of workflows){const s=read(path);if(count(s,'node scripts/axis-8241-dock-occlusion-smoke.mjs')!==want)fail(`${label} must preserve inherited 8.24.1 physical chain ${want} time(s)`)}

{
 const f='scripts/axis-repository-contract.mjs';let s=read(f);
 s=replaceAllExact(s,"['8.22','8.23','8.24','8.24.1','8.25']","['8.22','8.23','8.24','8.24.1','8.25','8.25.1']",'repository inherited replay family');
 s=replaceAllExact(s,"['8.23','8.24','8.24.1','8.25']","['8.23','8.24','8.24.1','8.25','8.25.1']",'repository inherited continuity family');
 s=replaceAllExact(s,"['8.24','8.24.1','8.25']","['8.24','8.24.1','8.25','8.25.1']",'repository inherited tactile family');
 s=replaceAllExact(s,"['8.24.1','8.25']","['8.24.1','8.25','8.25.1']",'repository inherited dock family');
 s=replaceOnce(s,"const expectedSteps=['8.24.1','8.25'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;","const expectedSteps=['8.24.1','8.25','8.25.1'].includes(CURRENT)?87:['8.23','8.24'].includes(CURRENT)?86:85;",'repository deterministic step family');
 write(f,s);
}
{
 const f='scripts/axis-production-governance-contract.mjs';let s=read(f);
 s=replaceOnce(s,"if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}","if(CURRENT==='8.25'){sourceOwner='prepare-825-set-lock.mjs';sourceCurrent='8.25';sourceFrom='8.24.1'}\nif(CURRENT==='8.25.1'){sourceOwner='prepare-8251-inline-set-morph.mjs';sourceCurrent='8.25.1';sourceFrom='8.25'}",'Production release owner map');
 s=replaceAllExact(s,"['8.24.1','8.25']","['8.24.1','8.25','8.25.1']",'Production inherited physical family');
 write(f,s);
}

console.log('[AXIS 8.25.1 governance compat] PASS · sealed 8.25 baseline · PR #151 · inherited contracts converged without relaxing existing assertions');
