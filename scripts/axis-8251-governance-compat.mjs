import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

/* Historical 8.25.1 boundary guard. It may run while replaying the 8.25.1
 * layer inside either the original 8.26.1 candidate or the later governance-
 * only Production seal. It never rewrites current governance. */
const project=json('governance/project-state.json');
const decision=json('governance/version-decision.json');
const owners=json('governance/owners.json');

const candidate8261=decision?.sequence===14&&decision?.base_release==='8.26'&&decision?.release==='8.26.1'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
const sealed8261=decision?.sequence===15&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.1'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
if(!candidate8261&&!sealed8261)fail('current release must be governed AXIS 8.26.1 candidate or exact governance-only Production confirmation');

if(candidate8261){
  if(project?.product?.productionRelease!=='8.26.1'||project?.product?.releaseStatus!=='candidate')fail('8.26.1 candidate project state drift');
  if(project?.product?.lastSealedRelease!=='8.26'||project?.product?.productionRuntimeSha!=='11e50c75efa032e7759f8047ef46d233c335bb66')fail('8.26.1 candidate must preserve exact sealed 8.26 baseline');
  if(project?.product?.productionPullRequest!==152||project?.product?.candidatePullRequest!==153)fail('8.26/8.26.1 candidate PR identity drift');
}else{
  if(project?.product?.productionRelease!=='8.26.1'||project?.product?.releaseStatus!=='production-certified'||project?.product?.lastSealedRelease!=='8.26.1')fail('8.26.1 sealed project state drift');
  if(project?.product?.productionRuntimeSha!=='d187123dfdb2c0de0e5d202cf62bd6672586a8e7'||project?.product?.productionPullRequest!==153||project?.product?.candidatePullRequest!==null)fail('8.26.1 sealed runtime/PR identity drift');
}

const ownerBaseline=owners?.baselineRelease;
if(ownerBaseline!=='8.25.1'&&ownerBaseline!=='8.26.1')fail(`8.25.1 replay/current owner baseline drift ${ownerBaseline}`);
if(ownerBaseline==='8.26.1'){
  const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826');
  const restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
  if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 current source lost sealed Active Continuity owner');
  const wantRest=sealed8261?'presentation-only-production-sealed':'presentation-only-release-candidate';
  if(restOwner?.status!==wantRest||restOwner?.storage!=='none')fail(`8.26.1 current source rest owner drift ${restOwner?.status}`);
}

const morph=project?.engineering?.activeInlineSetMorph;
for(const key of ['postFactOnly','inStageFactRow','stableStageGeometry','nonOverlapping','railConfirmation','buttonReturn','clockSettle','boundedHaptic','reducedMotionSafe'])if(morph?.[key]!==true)fail(`Inline Set Morph sealed capability missing ${key}`);
if(morph?.status!=='production-sealed-8.25.1-inherited'||morph?.fullScreenOverlay!==false||morph?.pointerEvents!==false)fail('8.25.1 sealed presentation boundary drift');
for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(morph?.[key]!==false)fail(`Inline Set Morph acquired forbidden authority ${key}`);

const oldOwner=owners.owners?.find(x=>x.capability==='active-set-lock-825');
const morphOwner=owners.owners?.find(x=>x.capability==='active-inline-set-morph-8251');
if(oldOwner?.status!=='presentation-only-production-sealed-superseded'||oldOwner?.storage!=='none')fail('8.25 historical Set Lock owner drift');
if(morphOwner?.status!=='presentation-only-production-sealed'||morphOwner?.storage!=='none')fail('8.25.1 sealed owner drift');

for(const [path,needle] of [
  ['prepare-8241-dock-occlusion.mjs',"await import('./prepare-8251-inline-set-morph.mjs')"],
  ['postbuild-825-set-lock-contract.mjs',"await import('./postbuild-8251-inline-set-morph-contract.mjs')"],
  ['scripts/axis-8241-dock-occlusion-smoke.mjs',"await import('./axis-8251-inline-set-morph-smoke.mjs')"]
])if(!read(path).includes(needle))fail(`${path} lost sealed 8.25.1 chain`);
for(const path of [
  'prepare-8251-inline-set-morph.mjs','postbuild-8251-inline-set-morph-contract.mjs','scripts/axis-8251-inline-set-morph-smoke.mjs','styles/axis-8251-inline-set-morph.css',
  'prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','scripts/axis-826-active-continuity-smoke.mjs','styles/axis-826-active-continuity.css',
  'prepare-8261-active-rest-state.mjs','postbuild-8261-active-rest-state-contract.mjs','scripts/axis-8261-governance-compat.mjs'
])if(!fs.existsSync(path))fail(`inherited/current release surface missing ${path}`);

console.log(`[AXIS 8.25.1 governance compat] PASS · sealed 8.25.1 boundary preserved inside exact 8.26.1 ${ownerBaseline==='8.25.1'?'build replay':'source governance'} · ${sealed8261?'Production seal':'candidate'} governance delegated to 8.26.1 guard`);
