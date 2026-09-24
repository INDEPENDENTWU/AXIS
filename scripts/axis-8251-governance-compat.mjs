import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};
const SEALED_8261_SHA='d187123dfdb2c0de0e5d202cf62bd6672586a8e7';
const SEALED_8262_SHA='7662d857fd5d442e3a7f775a430f0d4d8479bece';
const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const sealed8261=project?.product?.productionRelease==='8.26.1'&&project?.product?.releaseStatus==='production-certified'&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.1'&&decision?.decision==='confirm'&&decision?.change_class==='governance'&&Number.isInteger(decision?.sequence)&&decision.sequence>=15;
const candidate8262=project?.product?.productionRelease==='8.26.2'&&project?.product?.releaseStatus==='candidate'&&project?.product?.candidatePullRequest===155&&decision?.sequence===18&&decision?.base_release==='8.26.1'&&decision?.release==='8.26.2'&&decision?.decision==='bump'&&decision?.change_class==='bug-fix';
const sealed8262=project?.product?.productionRelease==='8.26.2'&&project?.product?.releaseStatus==='production-certified'&&project?.product?.productionRuntimeSha===SEALED_8262_SHA&&project?.product?.productionPullRequest===155&&decision?.sequence===19&&decision?.base_release==='8.26.2'&&decision?.release==='8.26.2'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
if(!sealed8261&&!candidate8262&&!sealed8262)fail('current governance must be sealed 8.26.1, exact 8.26.2 PR #155 candidate, or exact sealed 8.26.2');
if(sealed8261||candidate8262){if(project?.product?.lastSealedRelease!=='8.26.1'||project?.product?.productionRuntimeSha!==SEALED_8261_SHA||project?.product?.productionPullRequest!==153)fail('8.26.1 exact Production baseline drift')}
if(sealed8262){if(project?.product?.lastSealedRelease!=='8.26.2'||project?.production?.sealedRelease!=='8.26.2'||project?.production?.combinedStatus?.sourceSha!==SEALED_8262_SHA)fail('8.26.2 exact Production seal drift')}
if(candidate8262){const v=project?.engineering?.versionDecision;if(v?.sequence!==18||v?.baseRelease!=='8.26.1'||v?.release!=='8.26.2'||v?.decision!=='bump'||v?.changeClass!=='bug-fix')fail('8.26.2 product version provenance drift')}
const ownerBaseline=owners?.baselineRelease;
if(!['8.25.1','8.26.1','8.26.2'].includes(ownerBaseline))fail(`8.25.1 replay/current owner baseline drift ${ownerBaseline}`);
const morph=project?.engineering?.activeInlineSetMorph;
for(const key of ['postFactOnly','inStageFactRow','stableStageGeometry','nonOverlapping','railConfirmation','buttonReturn','clockSettle','boundedHaptic','reducedMotionSafe'])if(morph?.[key]!==true)fail(`Inline Set Morph sealed capability missing ${key}`);
if(morph?.status!=='production-sealed-8.25.1-inherited'||morph?.fullScreenOverlay!==false||morph?.pointerEvents!==false)fail('8.25.1 sealed presentation boundary drift');
for(const key of ['newTrainingOwner','newStorage','newEncounterWriter','newActiveOwner','network','ai'])if(morph?.[key]!==false)fail(`Inline Set Morph acquired forbidden authority ${key}`);
const oldOwner=owners.owners?.find(x=>x.capability==='active-set-lock-825'),morphOwner=owners.owners?.find(x=>x.capability==='active-inline-set-morph-8251');
if(oldOwner?.status!=='presentation-only-production-sealed-superseded'||oldOwner?.storage!=='none')fail('8.25 historical Set Lock owner drift');
if(morphOwner?.status!=='presentation-only-production-sealed'||morphOwner?.storage!=='none')fail('8.25.1 sealed owner drift');
if(ownerBaseline!=='8.25.1'){
 const continuity=owners.owners?.find(x=>x.capability==='active-continuity-826'),rest=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
 if(continuity?.status!=='presentation-and-coordination-production-sealed'||continuity?.storage!=='none')fail('sealed 8.26 owner drift');
 if(rest?.status!=='presentation-only-production-sealed'||rest?.storage!=='none')fail('sealed 8.26.1 rest owner drift');
}
if(sealed8262){const binding=owners.owners?.find(x=>x.capability==='active-rest-selector-8262');if(binding?.status!=='presentation-only-production-sealed'||binding?.storage!=='none')fail('sealed 8.26.2 selector owner drift')}
for(const path of ['prepare-8251-inline-set-morph.mjs','postbuild-8251-inline-set-morph-contract.mjs','styles/axis-8251-inline-set-morph.css','prepare-826-active-continuity.mjs','postbuild-826-active-continuity-contract.mjs','styles/axis-826-active-continuity.css','prepare-8261-active-rest-state.mjs','postbuild-8261-active-rest-state-contract.mjs','prepare-8262-active-rest-selector.mjs','postbuild-8262-active-rest-selector-contract.mjs'])if(!fs.existsSync(path))fail(`inherited/current release surface missing ${path}`);
console.log(`[AXIS 8.25.1 governance compat] PASS · sealed 8.25.1 boundary preserved inside ${sealed8262?'sealed 8.26.2':candidate8262?'8.26.2 candidate':'sealed 8.26.1'} · owner replay ${ownerBaseline}`);
