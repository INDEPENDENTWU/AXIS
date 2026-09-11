import fs from 'node:fs';

const fail=message=>{throw new Error(`[AXIS Production governance contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`${path} invalid JSON · ${error.message}`)}};
const has=(text,needle,label)=>{if(!text.includes(needle))fail(`${label} missing ${needle}`)};
const success=value=>String(value||'').toLowerCase()==='success';

const project=json('governance/project-state.json');
const owners=json('governance/owners.json');
const retirements=json('governance/retirements.json');
const decision=json('governance/version-decision.json');
const readme=read('README.md');
const handoff=read('docs/HANDOFF.md');
const currentRelease=read('docs/CURRENT_RELEASE.md');
const currentWork=read('docs/CURRENT_WORK.md');

const CURRENT=String(project?.product?.productionRelease||'');
const STATUS=String(project?.product?.releaseStatus||'sealed');
const SEALED=String(project?.product?.lastSealedRelease||project?.production?.sealedRelease||CURRENT);
const RUNTIME_SHA=String(project?.product?.productionRuntimeSha||'');
const SEALED_PR=Number(project?.product?.productionPullRequest);
const CANDIDATE_PR=Number(project?.product?.candidatePullRequest||project?.engineering?.pullRequest||0);
const candidate=CURRENT!==SEALED||STATUS==='candidate';

if(!/^[0-9a-f]{40}$/.test(RUNTIME_SHA))fail('productionRuntimeSha must remain a full 40-character last-sealed Git SHA');
if(!Number.isInteger(SEALED_PR)||SEALED_PR<1)fail('productionPullRequest must identify the last sealed product PR');
if(project?.product?.architecture!=='canonical-single-runtime')fail('canonical architecture governance drift');
if(project?.engineering?.baselineRelease!==CURRENT)fail('engineering baselineRelease must equal the governed candidate/current release');
if(project?.engineering?.nextProductRelease!==CURRENT)fail('engineering nextProductRelease must equal the governed candidate/current release');
if(project?.engineering?.activeBranch!=='main')fail('governed target branch must remain main');

/* Current product identity comes from the current release owner, while provider
   evidence remains the last fully sealed artifact until a candidate is certified. */
let sourceOwner='prepare-821-release.mjs',sourceCurrent='8.21',sourceFrom='8.20.1';
if(CURRENT==='8.22'){
  sourceOwner='prepare-822-evolution-replay.mjs';sourceCurrent='8.22';sourceFrom='8.21';
}
const releaseOwner=read(sourceOwner);
const releaseMatch=releaseOwner.match(/const FROM='([^']+)',VERSION='([^']+)'/);
if(!releaseMatch)fail(`${sourceOwner} current release identity missing`);
if(releaseMatch[1]!==sourceFrom||releaseMatch[2]!==sourceCurrent)fail(`${sourceOwner} release transition drift ${releaseMatch[1]} -> ${releaseMatch[2]}`);
if(CURRENT!==sourceCurrent)fail(`governed current release ${CURRENT||'<empty>'} does not match current release owner ${sourceCurrent}`);

if(candidate){
  if(STATUS!=='candidate')fail('an unsealed release must explicitly use releaseStatus=candidate');
  if(CURRENT!=='8.22'||SEALED!=='8.21')fail(`expected 8.22 candidate over sealed 8.21, got current ${CURRENT} / sealed ${SEALED}`);
  if(project?.production?.candidateRelease!==CURRENT)fail('Production candidateRelease drift');
  if(project?.production?.candidateStatus!=='pending-exact-head-and-merged-main-certification')fail('candidate Production status is not explicitly pending certification');
  if(!Number.isInteger(CANDIDATE_PR)||CANDIDATE_PR!==144)fail('8.22 candidate PR must be #144');
  if(project?.engineering?.pullRequest!==CANDIDATE_PR||project?.engineering?.pullRequestDraft!==true)fail('engineering candidate PR state drift');
  if(project?.engineering?.activeMilestone!=='AXIS 8.22 — Truthful Evolution Replay')fail('8.22 active milestone drift');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.22 must be governed as an intended product behavior change');
  if(decision?.sequence!==5||decision?.base_release!=='8.21'||decision?.release!=='8.22'||decision?.decision!=='bump'||decision?.change_class!=='product-runtime')fail('8.22 version decision must be 8.21 -> 8.22 / bump / sequence 5 / product-runtime');
}else{
  if(project?.engineering?.intendedProductBehaviorChange!==false)fail('sealed governance-only state must not claim an active product behavior change');
}

/* Provider records are a durable seal snapshot. For a candidate, they MUST still
   refer to the previous sealed runtime and may not be relabeled as candidate proof. */
const production=project?.production||{};
if(production.evidenceScope!=='product-runtime-seal-snapshot')fail('Production evidence scope must be product-runtime-seal-snapshot');
if(production.latestDeploymentIsAuthority!==false)fail('repository must not treat latest deployment SHA as self-referential file authority');
if(String(production.sealedRelease||SEALED)!==SEALED)fail('Production sealedRelease drift');
if(!String(production.evidenceSemantics||'').includes(candidate?'last fully sealed AXIS 8.21':'seal'))fail('Production evidence semantics do not explain the seal snapshot');

const vercel=production.vercel||{};
if(vercel.sourceSha!==RUNTIME_SHA)fail('Vercel seal evidence SHA drift');
if(vercel.state!=='READY'||vercel.target!=='production')fail('Vercel seal evidence is not READY Production');
if(!success(vercel.exactManifestParity)||!success(vercel.chromiumProductionFlow))fail('Vercel exact parity / current Flow proof is not sealed');
if(!Number.isInteger(Number(vercel.productionGateRunId))||Number(vercel.productionGateRunId)<1)fail('Vercel Production gate run evidence missing');
if(!Number.isInteger(Number(vercel.publicAliasGateRunId))||Number(vercel.publicAliasGateRunId)<1)fail('Vercel public alias gate evidence missing');

const edge=production.edgeOne||{};
if(edge.sourceSha!==RUNTIME_SHA)fail('EdgeOne seal evidence SHA drift');
for(const key of ['packageContract','deployProduction','boundedFixedDomainConvergence','vercelApiParity','chromiumProductionFlow','webkitProductionFlow'])if(!success(edge[key]))fail(`EdgeOne ${key} evidence is not success`);
if(!Number.isInteger(Number(edge.verificationRunId))||Number(edge.verificationRunId)<1)fail('EdgeOne verification run evidence missing');

if(owners?.baselineRelease!==CURRENT)fail('owner registry must describe the current candidate/current release');
const retirementBaselines=new Set([CURRENT,SEALED]);
if(!retirementBaselines.has(retirements?.baselineRelease))fail('retirement registry baseline must match current or last sealed release');
const flowOwner=(owners.owners||[]).find(x=>x.capability==='flow-orchestration-821');
if(flowOwner?.status!=='app-owned-intent-production-sealed')fail('Flow owner registry is not Production-sealed');
const activeOwner=(owners.owners||[]).find(x=>x.capability==='active-lifecycle');
if(!String(activeOwner?.notes||'').includes('Ordinary single/complete remain one-shot')&&!String(activeOwner?.notes||'').includes('ordinary single/complete remain one-shot'))fail('Active owner registry lost ordinary one-shot semantics');
for(const id of ['flow-set-level-completion-authority','flow-current-item-quick-config-route','visible-raw-object-enum-metadata'])if(!(retirements.retirements||[]).some(x=>x.id===id&&String(x.status).startsWith('retired')))fail(`8.21 retirement guard missing · ${id}`);
if(candidate){
  const replay=(owners.owners||[]).find(x=>x.capability==='evolution-replay-822');
  if(replay?.status!=='derived-read-only-release-candidate'||replay?.storage!=='none')fail('8.22 Replay owner is not bounded derived read-only');
  if(!String(replay?.notes||'').includes('may not write Session/Encounter/media/storage'))fail('8.22 Replay owner notes lost no-writer boundary');
  const e=project?.engineering?.evolutionReplay||{};
  for(const [key,value] of [['newStorage',false],['newDatabase',false],['newSessionWriter',false],['newEncounterWriter',false],['newMediaOwner',false],['network',false],['ai',false],['interpretiveScoring',false]])if(e[key]!==value)fail(`8.22 Replay governance drift ${key}`);
  if(e.ordering!=='time-session-event'||e.singleEncounterSemantics!=='explicit-no-comparison')fail('8.22 Replay factual ordering/single semantics drift');
}

if(!String(project?.engineering?.flow?.status||'').startsWith('production-sealed'))fail('inherited Flow state is no longer marked Production-sealed');
if(project?.engineering?.flow?.uiImplemented!==true)fail('Flow UI truth drift');
if(project?.engineering?.flow?.completionUnit!=='whole-object-item')fail('whole-item Flow completion unit governance drift');
if(project?.engineering?.flow?.currentItemDirectActive!==true||project?.engineering?.flow?.detourQuickRecordOnly!==true)fail('Flow direct Active / detour isolation governance drift');
if(project?.engineering?.flow?.metricOpticalCenterTolerancePx!==0.5)fail('strict metric optical-center tolerance governance drift');

for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]]){
  has(text,`AXIS ${CURRENT}`,label);
  has(text,RUNTIME_SHA,label);
  if(candidate)has(text,SEALED,label);
}
has(readme,`**Current release: ${CURRENT}**`,'README');
has(handoff,`#${CANDIDATE_PR}`,'HANDOFF candidate PR');
has(currentRelease,`#${CANDIDATE_PR}`,'CURRENT_RELEASE candidate PR');
has(currentRelease,'runtime seal baseline','CURRENT_RELEASE durable baseline semantics');
has(currentRelease,'not a self-referential requirement','CURRENT_RELEASE non-self-referential semantics');
has(currentWork,project.engineering.activeMilestone,'CURRENT_WORK');
has(currentWork,'governed target branch: `main`','CURRENT_WORK');
if(candidate){
  for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]])if(!/candidate|Release candidate|候选/i.test(text))fail(`${label} does not explicitly mark 8.22 as candidate`);
  if(/AXIS \*\*8\.22\*\* is the current sealed|8\.22.*Production-sealed/i.test(readme+handoff+currentRelease+currentWork))fail('candidate documentation overstates 8.22 Production seal');
}

const portable=new Set(project?.crossPlatform?.portableContracts||[]);
for(const id of ['axis.domain.v1','axis.data.v1','axis.flow.v1','axis.flow-provenance.v1'])if(!portable.has(id))fail(`portable contract missing · ${id}`);
if(project?.crossPlatform?.foundationId!=='axis-native-foundation-0'||project?.crossPlatform?.nativeRepository!=='INDEPENDENTWU/AXIS-iOS')fail('cross-platform foundation governance drift');

console.log(`[AXIS Production governance contract] PASS · current ${CURRENT} (${STATUS}) · last sealed ${SEALED} @ ${RUNTIME_SHA.slice(0,12)} / PR #${SEALED_PR} · provider seal snapshot coherent · candidate evidence not overstated · inherited whole-item Flow + 8.22 Replay ownership bounded`);
