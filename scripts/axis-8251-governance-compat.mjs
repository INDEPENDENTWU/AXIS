import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

const sourceDecision=json('governance/version-decision.json');
if(sourceDecision?.release==='8.26.5')await import('./axis-8265-governance-source-convergence.mjs');

const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342';

if(project?.product?.productionRelease!=='8.26.5'||project?.product?.releaseStatus!=='production-certified')fail('current governance must be exact Production-sealed 8.26.5');
if(project?.product?.lastSealedRelease!=='8.26.5'||project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==158)fail('8.26.5 Production baseline drift');
if(decision?.sequence!==22||decision?.base_release!=='8.26.5'||decision?.release!=='8.26.5'||decision?.decision!=='confirm'||decision?.change_class!=='governance')fail('8.26.5 closeout decision drift');

const ownerBaseline=owners?.baselineRelease;
if(ownerBaseline!=='8.26.5')fail(`8.25.1 replay/current owner baseline drift ${ownerBaseline}`);

const morph=project?.engineering?.activeInlineSetMorph;
for(const key of ['postFactOnly','inStageFactRow','stableStageGeometry','nonOverlapping','railConfirmation','buttonReturn','clockSettle','boundedHaptic','reducedMotionSafe'])if(morph?.[key]!==true)fail(`Inline Set Morph sealed capability missing ${key}`);
if(morph?.status!=='production-sealed-8.25.1-inherited'||morph?.fullScreenOverlay!==false||morph?.pointerEvents!==false)fail('8.25.1 sealed presentation boundary drift');
for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(morph?.[key]!==false)fail(`Inline Set Morph acquired forbidden authority ${key}`);

const oldOwner=owners.owners?.find(x=>x.capability==='active-set-lock-825');
const morphOwner=owners.owners?.find(x=>x.capability==='active-inline-set-morph-8251');
const continuity=owners.owners?.find(x=>x.capability==='active-continuity-826');
const rest=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(oldOwner?.status!=='presentation-only-production-sealed-superseded'||oldOwner?.storage!=='none')fail('8.25 historical Set Lock owner drift');
if(morphOwner?.status!=='presentation-only-production-sealed'||morphOwner?.storage!=='none')fail('8.25.1 sealed owner drift');
if(continuity?.status!=='presentation-and-coordination-production-sealed'||continuity?.storage!=='none')fail('sealed 8.26 owner drift');
if(rest?.status!=='presentation-only-production-sealed'||rest?.storage!=='none')fail('sealed 8.26.1 rest owner drift');

for(const path of [
  'prepare-8251-inline-set-morph.mjs',
  'postbuild-8251-inline-set-morph-contract.mjs',
  'styles/axis-8251-inline-set-morph.css',
  'prepare-826-active-continuity.mjs',
  'prepare-8261-active-rest-state.mjs',
  'prepare-8262-active-rest-selector.mjs',
  'prepare-8263-active-rest-convergence.mjs',
  'prepare-8264-active-rest-utility-rail.mjs',
  'prepare-8265-recording-review-geometry.mjs'
])if(!fs.existsSync(path))fail(`inherited/current release surface missing ${path}`);

console.log('[AXIS 8.25.1 governance compat] PASS · sealed 8.25.1 boundary preserved inside exact Production-sealed 8.26.5');
