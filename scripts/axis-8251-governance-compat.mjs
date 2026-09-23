import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

/*
 * Historical boundary guard.
 *
 * AXIS 8.25.1 is already Production-sealed. During a current 8.26.1 build this
 * script is reached from prepare-8251-inline-set-morph.mjs before the 8.26 and
 * 8.26.1 prepare layers run. It must therefore prove the inherited 8.25.1
 * boundary and then stop. Deep Compatibility also runs this guard directly
 * against repository source, where the governed owner registry is already at
 * 8.26.1. Both states are exact and intentional: 8.25.1 is the transient replay
 * baseline; 8.26.1 is the current source baseline. Neither path may rewrite
 * current repository/production governance: the exact current release is
 * converged and verified later by scripts/axis-8261-governance-compat.mjs from
 * the 8.26.1 postbuild contract.
 */
const project=json('governance/project-state.json');
const decision=json('governance/version-decision.json');
const owners=json('governance/owners.json');

const current8261=
  decision?.sequence===14&&
  decision?.base_release==='8.26'&&
  decision?.release==='8.26.1'&&
  decision?.decision==='bump'&&
  decision?.change_class==='bug-fix';

if(!current8261)fail('current release must be exact governed successor 8.26 -> 8.26.1; historical branches retain their own sealed compatibility script');
if(project?.product?.productionRelease!=='8.26.1'||project?.product?.releaseStatus!=='candidate')fail('8.26.1 project state drift');
if(project?.product?.lastSealedRelease!=='8.26'||project?.product?.productionRuntimeSha!=='11e50c75efa032e7759f8047ef46d233c335bb66')fail('8.26.1 must preserve exact sealed 8.26 baseline');
if(project?.product?.productionPullRequest!==152||project?.product?.candidatePullRequest!==153)fail('8.26/8.26.1 PR identity drift');

const ownerBaseline=owners?.baselineRelease;
if(ownerBaseline!=='8.25.1'&&ownerBaseline!=='8.26.1')fail(`8.25.1 replay/current owner baseline drift ${ownerBaseline}`);
if(ownerBaseline==='8.26.1'){
  const continuityOwner=owners.owners?.find(x=>x.capability==='active-continuity-826');
  const restOwner=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
  if(continuityOwner?.status!=='presentation-and-coordination-production-sealed'||continuityOwner?.storage!=='none')fail('8.26 current source lost sealed Active Continuity owner');
  if(restOwner?.status!=='presentation-only-release-candidate'||restOwner?.storage!=='none')fail('8.26.1 current source rest owner drift');
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
  'prepare-8251-inline-set-morph.mjs',
  'postbuild-8251-inline-set-morph-contract.mjs',
  'scripts/axis-8251-inline-set-morph-smoke.mjs',
  'styles/axis-8251-inline-set-morph.css',
  'prepare-826-active-continuity.mjs',
  'postbuild-826-active-continuity-contract.mjs',
  'scripts/axis-826-active-continuity-smoke.mjs',
  'styles/axis-826-active-continuity.css',
  'prepare-8261-active-rest-state.mjs',
  'postbuild-8261-active-rest-state-contract.mjs',
  'scripts/axis-8261-governance-compat.mjs'
])if(!fs.existsSync(path))fail(`inherited/current release surface missing ${path}`);

console.log(`[AXIS 8.25.1 governance compat] PASS · sealed 8.25.1 boundary preserved inside exact 8.26.1 ${ownerBaseline==='8.25.1'?'build replay':'source governance'} · current governance intentionally delegated to 8.26.1 guard`);
