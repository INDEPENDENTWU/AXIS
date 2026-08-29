import fs from 'node:fs';

const fail=message=>{throw new Error(`[AXIS Production governance contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`${path} invalid JSON · ${error.message}`)}};
const has=(text,needle,label)=>{if(!text.includes(needle))fail(`${label} missing ${needle}`)};
const success=value=>String(value||'').toLowerCase()==='success';

const project=json('governance/project-state.json');
const owners=json('governance/owners.json');
const retirements=json('governance/retirements.json');
const readme=read('README.md');
const handoff=read('docs/HANDOFF.md');
const currentRelease=read('docs/CURRENT_RELEASE.md');
const currentWork=read('docs/CURRENT_WORK.md');
const releaseOwner=read('prepare-821-release.mjs');

/* Independent release identity: governance may not define its own current version.
   The current release owner is source-of-truth for the public release transition. */
const releaseMatch=releaseOwner.match(/const FROM='([^']+)',VERSION='([^']+)';/);
if(!releaseMatch)fail('prepare-821-release.mjs current release identity missing');
const SOURCE_CURRENT=releaseMatch[2];
const CURRENT=String(project?.product?.productionRelease||'');
const RUNTIME_SHA=String(project?.product?.productionRuntimeSha||'');
const PROD_PR=Number(project?.product?.productionPullRequest);

if(CURRENT!==SOURCE_CURRENT)fail(`governed Production release ${CURRENT||'<empty>'} does not match current release owner ${SOURCE_CURRENT}`);
if(!/^[0-9a-f]{40}$/.test(RUNTIME_SHA))fail('productionRuntimeSha must be a full 40-character Git SHA');
if(!Number.isInteger(PROD_PR)||PROD_PR<1)fail('productionPullRequest must be a positive integer');
if(project?.product?.architecture!=='canonical-single-runtime')fail('canonical architecture governance drift');
if(project?.engineering?.baselineRelease!==CURRENT)fail('engineering baselineRelease drift');
if(project?.engineering?.baselineRuntimeSha!==RUNTIME_SHA)fail('engineering baselineRuntimeSha drift');
if(project?.engineering?.activeBranch!=='main')fail('post-release governed active branch must remain stable main, not an ephemeral PR branch');
if(project?.engineering?.activeMilestone!=='AXIS 8.21 — Post-release Architecture Governance')fail('post-release active milestone drift');
if(project?.engineering?.intendedProductBehaviorChange!==false)fail('governance reconciliation must remain product-behavior neutral');

/* Provider records are a durable release-seal snapshot, not a logically impossible
   assertion that a repo file can equal every later governance-only deployment SHA. */
const production=project?.production||{};
if(production.evidenceScope!=='product-runtime-seal-snapshot')fail('Production evidence scope must be product-runtime-seal-snapshot');
if(production.latestDeploymentIsAuthority!==false)fail('repository must not treat the latest deployment SHA as self-referential file authority');
has(String(production.evidenceSemantics||''),'Later governance-only main deployments','Production evidence semantics');

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

if(owners?.baselineRelease!==CURRENT)fail('owner registry baseline release drift');
if(retirements?.baselineRelease!==CURRENT)fail('retirement registry baseline release drift');
const flowOwner=(owners.owners||[]).find(x=>x.capability==='flow-orchestration-821');
if(flowOwner?.status!=='app-owned-intent-production-sealed')fail('Flow owner registry is not Production-sealed');
const activeOwner=(owners.owners||[]).find(x=>x.capability==='active-lifecycle');
if(!String(activeOwner?.notes||'').includes('ordinary single/complete remain one-shot')&&!String(activeOwner?.notes||'').includes('Ordinary single/complete remain one-shot'))fail('Active owner registry lost ordinary one-shot semantics');
for(const id of ['flow-set-level-completion-authority','flow-current-item-quick-config-route','visible-raw-object-enum-metadata'])if(!(retirements.retirements||[]).some(x=>x.id===id&&String(x.status).startsWith('retired')))fail(`8.21 retirement guard missing · ${id}`);

if(project?.engineering?.flow?.status!=='production-sealed'||project?.engineering?.flow?.uiImplemented!==true)fail('project Flow state is not Production-sealed UI truth');
if(project?.engineering?.flow?.completionUnit!=='whole-object-item')fail('whole-item Flow completion unit governance drift');
if(project?.engineering?.flow?.currentItemDirectActive!==true||project?.engineering?.flow?.detourQuickRecordOnly!==true)fail('Flow direct Active / detour isolation governance drift');
if(project?.engineering?.flow?.metricOpticalCenterTolerancePx!==0.5)fail('strict metric optical-center tolerance governance drift');

const releaseLabel=`AXIS ${CURRENT}`;
const prLabel=`#${PROD_PR}`;
for(const [label,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',currentRelease],['CURRENT_WORK',currentWork]]){
  has(text,CURRENT,label);
  has(text,RUNTIME_SHA,label);
}
has(readme,`**Current release: ${CURRENT}**`,'README');
has(readme,'runtime seal evidence snapshot','README self-reference semantics');
has(handoff,releaseLabel,'HANDOFF');
has(handoff,prLabel,'HANDOFF');
has(currentRelease,releaseLabel,'CURRENT_RELEASE');
has(currentRelease,prLabel,'CURRENT_RELEASE');
has(currentRelease,'product/runtime seal evidence snapshot','CURRENT_RELEASE self-reference semantics');
has(currentWork,project.engineering.activeMilestone,'CURRENT_WORK');
has(currentWork,'governed active branch: `main`','CURRENT_WORK');

const portable=new Set(project?.crossPlatform?.portableContracts||[]);
for(const id of ['axis.domain.v1','axis.data.v1','axis.flow.v1','axis.flow-provenance.v1'])if(!portable.has(id))fail(`portable contract missing · ${id}`);
if(project?.crossPlatform?.foundationId!=='axis-native-foundation-0'||project?.crossPlatform?.nativeRepository!=='INDEPENDENTWU/AXIS-iOS')fail('cross-platform foundation governance drift');

console.log(`[AXIS Production governance contract] PASS · ${CURRENT} · runtime seal ${RUNTIME_SHA.slice(0,12)} · PR #${PROD_PR} · Vercel/EdgeOne seal evidence coherent · non-self-referential deployment semantics · whole-item Flow governance sealed`);
