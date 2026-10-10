import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS 8.25.1 governance compat] ${m}`)};
const read=f=>{if(!fs.existsSync(f))fail(`missing ${f}`);return fs.readFileSync(f,'utf8')};
const json=f=>{try{return JSON.parse(read(f))}catch(e){fail(`invalid ${f}: ${e.message}`)}};

const project=json('governance/project-state.json'),decision=json('governance/version-decision.json'),owners=json('governance/owners.json');
const SEALED_SHA='5bf575730c5c8de542c603d40b0f8b780204a342',RUNTIME_827='d6044f0b30a92c007dd2fbab5792c2aa62dfd485';
const sealed8265=project?.product?.productionRelease==='8.26.5'&&project?.product?.releaseStatus==='production-certified'&&decision?.sequence===22;
const candidate827=project?.product?.productionRelease==='8.27'&&project?.product?.releaseStatus==='candidate'&&project?.product?.lastSealedRelease==='8.26.5'&&project?.product?.productionRuntimeSha===SEALED_SHA&&project?.product?.candidatePullRequest===160&&decision?.sequence===23&&decision?.base_release==='8.26.5'&&decision?.release==='8.27'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
const sealed827=project?.product?.productionRelease==='8.27'&&project?.product?.releaseStatus==='production-certified'&&project?.product?.lastSealedRelease==='8.27'&&project?.product?.productionRuntimeSha===RUNTIME_827&&project?.product?.productionPullRequest===160&&decision?.sequence===24&&decision?.base_release==='8.27'&&decision?.release==='8.27'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const downstream828=project?.product?.productionRelease==='8.28'&&project?.product?.releaseStatus==='candidate'&&project?.product?.lastSealedRelease==='8.27'&&project?.product?.productionRuntimeSha===RUNTIME_827&&project?.product?.productionPullRequest===160&&project?.product?.candidatePullRequest===162&&decision?.sequence===25&&decision?.base_release==='8.27'&&decision?.release==='8.28'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
const sealed828=project?.product?.productionRelease==='8.28'&&project?.product?.releaseStatus==='production-certified'&&project?.product?.lastSealedRelease==='8.28'&&project?.product?.productionRuntimeSha==='df67fc0a20c0c34a79341315c8c85b5461acfe44'&&project?.product?.productionPullRequest===162&&project?.product?.candidatePullRequest===162&&decision?.sequence===26&&decision?.base_release==='8.28'&&decision?.release==='8.28'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const downstream829=project?.product?.productionRelease==='8.29'&&project?.product?.releaseStatus==='candidate'&&project?.product?.lastSealedRelease==='8.28'&&project?.product?.productionRuntimeSha==='df67fc0a20c0c34a79341315c8c85b5461acfe44'&&project?.product?.productionPullRequest===162&&project?.product?.candidatePullRequest===164&&decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
const sealed829Stage=decision?.sequence===28&&decision?.base_release==='8.29'&&decision?.release==='8.29'&&decision?.decision==='confirm'&&decision?.change_class==='governance';
const downstream831=(decision?.sequence===31&&decision?.base_release==='8.30'&&decision?.release==='8.31'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime');
const sealed830=(decision?.sequence===30&&decision?.base_release==='8.30'&&decision?.release==='8.30'&&decision?.decision==='confirm'&&decision?.change_class==='governance')||downstream831;
const downstream830=(decision?.sequence===29&&decision?.base_release==='8.29'&&decision?.release==='8.30'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime')||sealed830;
const staged829=downstream830||sealed829Stage||decision?.sequence===27&&decision?.base_release==='8.28'&&decision?.release==='8.29'&&decision?.decision==='bump'&&decision?.change_class==='product-runtime';
if(!sealed8265&&!candidate827&&!sealed827&&!downstream828&&!sealed828&&!staged829)fail('current governance must be sealed 8.26.5, 8.27 candidate/seal, or bounded 8.28 successor');
if(!sealed827&&!downstream828&&!sealed828&&!staged829&&(project?.product?.productionRuntimeSha!==SEALED_SHA||project?.product?.productionPullRequest!==158))fail('8.26.5 Production baseline drift');
if((sealed827||downstream828)&&(project?.product?.productionRuntimeSha!==RUNTIME_827||project?.product?.productionPullRequest!==160))fail('8.27 Production seal drift');

if(!['8.25.1','8.26.5','8.27','8.28','8.29','8.30'].includes(owners?.baselineRelease))fail(`owner baseline drift ${owners?.baselineRelease}`);
const morph=project?.engineering?.activeInlineSetMorph;
for(const key of ['postFactOnly','inStageFactRow','stableStageGeometry','nonOverlapping','railConfirmation','buttonReturn','clockSettle','boundedHaptic','reducedMotionSafe'])if(morph?.[key]!==true)fail(`Inline Set Morph inherited capability missing ${key}`);
if(morph?.status!=='production-sealed-8.25.1-inherited'||morph?.fullScreenOverlay!==false||morph?.pointerEvents!==false)fail('8.25.1 presentation boundary drift');

const oldOwner=owners.owners?.find(x=>x.capability==='active-set-lock-825');
const morphOwner=owners.owners?.find(x=>x.capability==='active-inline-set-morph-8251');
const continuity=owners.owners?.find(x=>x.capability==='active-continuity-826');
const rest=owners.owners?.find(x=>x.capability==='active-rest-state-8261');
if(oldOwner?.status!=='presentation-only-production-sealed-superseded'||oldOwner?.storage!=='none')fail('8.25 historical Set Lock owner drift');
if(morphOwner?.status!=='presentation-only-production-sealed'||morphOwner?.storage!=='none')fail('8.25.1 sealed owner drift');
if(owners?.baselineRelease!=='8.25.1'){
  if(continuity?.status!=='presentation-and-coordination-production-sealed'||continuity?.storage!=='none')fail('sealed 8.26 owner drift');
  if(rest?.status!=='presentation-only-production-sealed'||rest?.storage!=='none')fail('sealed 8.26.1 rest owner drift');
}

for(const p of ['prepare-8251-inline-set-morph.mjs','postbuild-8251-inline-set-morph-contract.mjs','styles/axis-8251-inline-set-morph.css','prepare-826-active-continuity.mjs','prepare-8261-active-rest-state.mjs','prepare-8262-active-rest-selector.mjs','prepare-8263-active-rest-convergence.mjs','prepare-8264-active-rest-utility-rail.mjs','prepare-8265-recording-review-geometry.mjs'])if(!fs.existsSync(p))fail(`inherited/current release surface missing ${p}`);

console.log(`[AXIS 8.25.1 governance compat] PASS · sealed 8.25.1 boundary preserved inside ${downstream829?'8.29 candidate':sealed828?'sealed 8.28':downstream828?'8.28 candidate':sealed827?'sealed 8.27':candidate827?'8.27 candidate':'sealed 8.26.5'}`);
