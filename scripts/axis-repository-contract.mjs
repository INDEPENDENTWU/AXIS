import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const fail=message=>{throw new Error(`[AXIS repository contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`invalid JSON ${path}: ${error.message}`)}};

const project=json('governance/project-state.json');
const CURRENT=String(project?.product?.productionRelease||'');
const STATUS=String(project?.product?.releaseStatus||'');
const SEALED=String(project?.product?.lastSealedRelease||project?.production?.sealedRelease||CURRENT);
const FOUNDATION=String(project?.compatibility?.longLivedFoundation||'');
const PROD_SHA=String(project?.product?.productionRuntimeSha||'');
if(!/^8\.\d+(?:\.\d+)?$/.test(CURRENT))fail(`invalid governed current release ${CURRENT}`);
if(!/^8\.\d+(?:\.\d+)?$/.test(SEALED))fail(`invalid governed sealed release ${SEALED}`);
if(!FOUNDATION)fail('governed compatibility foundation missing');
if(!/^[0-9a-f]{40}$/.test(PROD_SHA))fail(`invalid governed Production SHA ${PROD_SHA}`);
if(project?.product?.architecture!=='canonical-single-runtime')fail(`governed architecture is ${project?.product?.architecture}`);
if(project?.product?.releaseBuildCommand!=='node build-release.mjs')fail(`governed release command is ${project?.product?.releaseBuildCommand}`);
if(CURRENT==='8.22'){
  if(STATUS==='candidate'){
    if(SEALED!=='8.21')fail(`8.22 candidate must preserve 8.21 as last sealed release, got ${SEALED}`);
    if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.22 candidate must declare intended product behavior change');
    if(project?.engineering?.versionDecision?.decision!=='bump'||project?.engineering?.versionDecision?.sequence!==5)fail('8.22 candidate version decision must be bump sequence 5');
  }else if(STATUS==='production-certified'){
    if(SEALED!=='8.22')fail(`8.22 Production-certified state must seal 8.22, got ${SEALED}`);
    if(PROD_SHA!=='abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631')fail(`8.22 Production seal SHA drifted to ${PROD_SHA}`);
  }else fail(`unsupported 8.22 releaseStatus ${STATUS||'<empty>'}`);
}
if(CURRENT==='8.23'){
  if(STATUS!=='candidate')fail(`8.23 must remain candidate until exact merged-main certification, got ${STATUS}`);
  if(SEALED!=='8.22'||PROD_SHA!=='abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631')fail(`8.23 candidate must preserve exact 8.22 seal, got ${SEALED} @ ${PROD_SHA}`);
  if(project?.product?.candidatePullRequest!==146)fail('8.23 candidate PR must be #146');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.23 must declare intended product behavior change');
  if(project?.engineering?.versionDecision?.decision!=='bump'||project?.engineering?.versionDecision?.sequence!==7||project?.engineering?.versionDecision?.changeClass!=='product-runtime')fail('8.23 governed version decision must be bump sequence 7 product-runtime');
}
if(CURRENT==='8.24'){
  if(STATUS!=='candidate')fail(`8.24 must remain candidate until exact merged-main certification, got ${STATUS}`);
  if(SEALED!=='8.23'||PROD_SHA!=='2418103c786f2d0865aece49d738e9ed9161ef55')fail(`8.24 candidate must preserve exact 8.23 seal, got ${SEALED} @ ${PROD_SHA}`);
  if(project?.product?.candidatePullRequest!==148)fail('8.24 candidate PR must be #148');
  if(project?.engineering?.intendedProductBehaviorChange!==true)fail('8.24 must declare intended product behavior change');
  if(project?.engineering?.versionDecision?.decision!=='bump'||project?.engineering?.versionDecision?.sequence!==9||project?.engineering?.versionDecision?.changeClass!=='product-ui')fail('8.24 governed version decision must be bump sequence 9 product-ui');
  const tactile=project?.engineering?.activeStageTactile;
  if(tactile?.status!=='8.24-release-candidate'||tactile?.setProgressSingleTruth!==true||tactile?.timeMetaNoSetDuplication!==true||tactile?.tactileFeedback!==true||tactile?.dockLayerIsolation!==true||tactile?.reducedMotionSafe!==true)fail('8.24 Active Stage Tactile governed capability state drift');
  if(tactile?.newTrainingOwner!==false||tactile?.newStorage!==false||tactile?.newEncounterWriter!==false||tactile?.newActiveOwner!==false)fail('8.24 Active Stage Tactile introduced a forbidden factual owner');
}

const required=[
  'README.md','CONTRIBUTING.md','SECURITY.md','CODE_OF_CONDUCT.md',
  'governance/README.md','governance/project-state.json','governance/version-decision.json','governance/owners.json','governance/retirements.json',
  'docs/README.md','docs/HANDOFF.md','docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/CURRENT_RELEASE.md','docs/CURRENT_WORK.md',
  'docs/OWNERSHIP.md','docs/RETIREMENTS.md','docs/LOCALIZATION_AND_THEME.md','docs/GLOSSARY.md',
  'docs/RUNTIME_CONTRACT.md','docs/ENGINEERING_PLAYBOOK.md','docs/ROADMAP.md',
  'docs/REPOSITORY_STRUCTURE.md','docs/COMPATIBILITY_LEDGER.md','docs/CI_AND_RELEASE.md',
  '.github/CODEOWNERS','.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug.yml','.github/ISSUE_TEMPLATE/change.yml','.github/ISSUE_TEMPLATE/config.yml',
  '.editorconfig','.gitattributes','.gitignore','.nvmrc',
  'build-release.mjs','vercel.json','edgeone.json'
];
for(const path of required)if(!fs.existsSync(path))fail(`required file missing: ${path}`);

const readme=read('README.md'),handoff=read('docs/HANDOFF.md'),releaseDoc=read('docs/CURRENT_RELEASE.md'),work=read('docs/CURRENT_WORK.md');
if(!readme.slice(0,1800).includes(`Current release: ${CURRENT}`))fail(`README current release is not ${CURRENT}`);
for(const [name,text] of [['HANDOFF',handoff],['CURRENT_RELEASE',releaseDoc]]){
  if(!text.includes(`AXIS ${CURRENT}`))fail(`${name} does not identify AXIS ${CURRENT}`);
  if(!text.includes(PROD_SHA))fail(`${name} does not preserve governed Production SHA`);
}
if(!releaseDoc.match(new RegExp(`^# Current Release — AXIS ${CURRENT.replaceAll('.','\\.')}\\s*$`,'m')))fail('CURRENT_RELEASE title does not match governed current release');
if(CURRENT!==SEALED){
  for(const [name,text] of [['README',readme],['HANDOFF',handoff],['CURRENT_RELEASE',releaseDoc],['CURRENT_WORK',work]])if(!text.includes(SEALED))fail(`${name} does not identify last sealed release ${SEALED}`);
  if(!/candidate|Release candidate|候选/i.test(readme+handoff+releaseDoc+work))fail('candidate/sealed distinction is not documented');
}
if(!work.includes(project.engineering.activeMilestone))fail('CURRENT_WORK does not identify the governed active milestone');
if(!work.includes(project.engineering.activeBranch))fail('CURRENT_WORK does not identify the governed target branch');
if(project?.engineering?.deliveryBranch&&!work.includes(project.engineering.deliveryBranch))fail('CURRENT_WORK does not identify the bounded delivery branch');
if(!read('docs/RUNTIME_CONTRACT.md').includes(FOUNDATION))fail(`docs/RUNTIME_CONTRACT.md does not preserve the ${FOUNDATION} runtime foundation`);

const localeSpec=project?.presentationFoundation?.locales;
const expectedLocales=[['zh-Hans','简体中文'],['zh-Hant','繁體中文'],['en','English']];
if(!Array.isArray(localeSpec)||localeSpec.length!==expectedLocales.length)fail('presentation locale registry must contain exactly zh-Hans, zh-Hant and en');
for(let i=0;i<expectedLocales.length;i++){const [id,name]=expectedLocales[i],actual=localeSpec[i];if(actual?.id!==id||actual?.name!==name||actual?.requireProfessionalTranslation!==true)fail(`locale contract mismatch at ${id}`)}
const themes=project?.presentationFoundation?.themes;if(JSON.stringify(themes)!==JSON.stringify(['system','light','dark']))fail('theme contract must be exactly system / light / dark');
const localization=read('docs/LOCALIZATION_AND_THEME.md'),glossary=read('docs/GLOSSARY.md');for(const needle of ['zh-Hans','简体中文','zh-Hant','繁體中文','English'])if(!localization.includes(needle)||!glossary.includes(needle))fail(`localization/glossary contract missing ${needle}`);

const owners=json('governance/owners.json'),retirements=json('governance/retirements.json');
if(owners?.baselineRelease!==CURRENT||!Array.isArray(owners?.owners)||owners.owners.length<8)fail('owner registry is missing the current critical-owner baseline');
const allowedRetirementBaselines=new Set([CURRENT,SEALED,'8.21']);if(!allowedRetirementBaselines.has(retirements?.baselineRelease)||!Array.isArray(retirements?.retirements)||retirements.retirements.length<4)fail('retirement registry is missing an accepted current/sealed historical baseline');
for(const id of ['keep-clip-visible-setting','three-mode-default-capture-controller','v876-capture-preference-writer','low-fps-watermark-video-path'])if(!retirements.retirements.some(x=>x.id===id))fail(`retirement guard missing ${id}`);
if(['8.22','8.23','8.24'].includes(CURRENT)){const replay=(owners.owners||[]).find(x=>x.capability==='evolution-replay-822');if(!String(replay?.status||'').includes('derived-read-only')||replay?.storage!=='none')fail('8.22 Evolution Replay owner registry drift')}
if(CURRENT==='8.23'){const handoff=(owners.owners||[]).find(x=>x.capability==='evolution-replay-evidence-continuity-823');if(handoff?.status!=='presentation-handoff-release-candidate'||handoff?.storage!=='none')fail('8.23 Replay Evidence handoff owner registry drift')}
if(CURRENT==='8.24'){
  const handoff=(owners.owners||[]).find(x=>x.capability==='evolution-replay-evidence-continuity-823');if(handoff?.status!=='presentation-handoff-production-sealed'||handoff?.storage!=='none')fail('8.24 inherited Replay Evidence handoff owner registry drift');
  const tactile=(owners.owners||[]).find(x=>x.capability==='active-stage-tactile-824');if(tactile?.status!=='presentation-only-release-candidate'||tactile?.storage!=='none')fail('8.24 Active Stage Tactile owner registry drift');
}

const build=read('build-release.mjs');
for(const marker of ['prepare-812-release-compat.mjs','prepare-812-learning-content.mjs','prepare-812-learning-settings.mjs','postbuild-812-contract.mjs'])if(!build.includes(marker))fail(`inherited foundation build marker missing: ${marker}`);
if(!build.includes("architecture==='canonical-single-runtime'"))fail('canonical single-runtime release assertion missing');
const releaseDriver=read('prepare-8151-regression-release.mjs');if(!releaseDriver.includes("await import('./prepare-816-release.mjs')"))fail('8.16 substrate is not chained from the sealed 8.15.1 release driver');
const release816=read('prepare-816-release.mjs');if(!release816.includes("await import('./prepare-817-release.mjs')"))fail('8.17 release is not chained from inherited 8.16');
const release818=read('prepare-818-release.mjs');if(!release818.includes("const FROM='8.17',VERSION='8.18';"))fail('8.18 release transition drift');
const release819=read('prepare-819-release.mjs');if(!release819.includes("const FROM='8.18',VERSION='8.19';"))fail('8.19 release transition drift');
const release820=read('prepare-820-release.mjs');if(!release820.includes("const FROM='8.19',VERSION='8.20';"))fail('8.20 release transition drift');
const release821=read('prepare-821-release.mjs');if(!release821.includes("const FROM='8.20.1',VERSION='8.21';"))fail('8.21 release transition drift');
const lifecycle=read('prepare-819-postcommit-lifecycle.mjs');
if(['8.22','8.23','8.24'].includes(CURRENT)&&!lifecycle.includes("await import('./prepare-822-evolution-replay.mjs')"))fail('8.22 Replay is not reachable');
if(['8.23','8.24'].includes(CURRENT)&&!lifecycle.includes("await import('./prepare-823-replay-evidence-continuity.mjs')"))fail('8.23 Replay Evidence Continuity is not reachable after 8.22');
if(['8.22','8.23','8.24'].includes(CURRENT)){const release822=read('prepare-822-evolution-replay.mjs');if(!release822.includes("const FROM='8.21',VERSION='8.22'"))fail('8.22 release transition drift');if(!build.includes("'postbuild-822-evolution-replay-contract.mjs'"))fail('8.22 postbuild contract is not deterministic build authority')}
if(['8.23','8.24'].includes(CURRENT)){
  const release823=read('prepare-823-replay-evidence-continuity.mjs');if(!release823.includes("const FROM='8.22',VERSION='8.23'"))fail('8.23 release transition contract drift');if(!build.includes("'postbuild-823-replay-evidence-continuity-contract.mjs'"))fail('8.23 postbuild contract is not deterministic build authority');
  for(const path of ['docs/823_SCOPE.md','prepare-823-replay-evidence-continuity.mjs','postbuild-823-replay-evidence-continuity-contract.mjs','scripts/axis-823-replay-evidence-continuity-contract.mjs','scripts/axis-823-replay-evidence-continuity-smoke.mjs'])if(!fs.existsSync(path))fail(`8.23 release surface missing ${path}`);
  const currentWorkflow=read('.github/workflows/axis-current-release-gate.yml');if((currentWorkflow.match(/node scripts\/axis-823-replay-evidence-continuity-smoke\.mjs/g)||[]).length!==2)fail('8.23 smoke must remain in the converged Current Release family in both engines');if(fs.existsSync('.github/workflows/axis-823-replay-evidence-continuity.yml'))fail('version-specific 8.23 automatic workflow fanout must not return');
}
if(CURRENT==='8.24'){
  if(!lifecycle.includes("await import('./prepare-824-active-stage-tactile.mjs')"))fail('8.24 Active Stage Tactile prepare is not reachable after inherited 8.23 continuity');
  if(!build.includes("'postbuild-824-active-stage-tactile-contract.mjs'"))fail('8.24 postbuild contract is not deterministic build authority');
  for(const path of ['prepare-824-active-stage-tactile.mjs','postbuild-824-active-stage-tactile-contract.mjs','scripts/axis-824-active-stage-tactile-smoke.mjs','styles/axis-824-active-stage-tactile.css'])if(!fs.existsSync(path))fail(`8.24 release surface missing ${path}`);
}

const convergenceDriver=read('prepare-8151-regression-seal.mjs');for(const marker of ["await import('./prepare-816-capture-evidence-convergence.mjs')","await import('./prepare-816-evidence-compat-refine.mjs')","await import('./prepare-817-interaction-convergence-driver.mjs')"])if(!convergenceDriver.includes(marker))fail(`8.16/8.17 convergence chain missing: ${marker}`);
const captureDriver=read('prepare-816-capture-evidence-convergence.mjs');if(!captureDriver.includes('prepare-816-capture-evidence-convergence-v2.mjs'))fail('8.16 Capture v2 convergence is not reachable');
const evidenceDriver=read('prepare-816-evidence-compat-refine.mjs');if(!evidenceDriver.includes('prepare-816-capture-marker-seal.mjs'))fail('8.16 final Capture seal is not reachable');
const postDriver=read('postbuild-8151-regression-contract.mjs');if(!postDriver.includes("await import('./postbuild-816-contract.mjs')"))fail('8.16 postbuild chain drift');
const post816=read('postbuild-816-contract.mjs');if(!post816.includes("await import('./postbuild-817-contract.mjs')"))fail('8.17 postbuild chain drift');
const post817=read('postbuild-817-contract.mjs');if(!post817.includes("await import('./postbuild-8171-source-first-media-contract.mjs')"))fail('8.17.1 postbuild chain drift');
const post8171=read('postbuild-8171-source-first-media-contract.mjs');if(!post8171.includes("await import('./postbuild-818-contract.mjs')"))fail('8.18 postbuild chain drift');
const post818=read('postbuild-818-contract.mjs');
/* Keep this source block at the historical pre-8.20.1 shape. Sequential release
   owners append built identities in order; pre-populating later identities here
   breaks those fail-closed transforms. */
const source818Identity=post818.includes("contract.publicVersion!=='8.18'")&&post818.includes("contract.stableBaseVersion!=='8.18'")&&post818.includes("info.version!=='8.18'")&&post818.includes("info.baseVersion!=='8.18'");
const built819Identity=post818.includes("contract.publicVersion!=='8.19'")&&post818.includes("contract.stableBaseVersion!=='8.19'")&&post818.includes("info.version!=='8.19'")&&post818.includes("info.baseVersion!=='8.19'");
const built820Identity=post818.includes("contract.publicVersion!=='8.20'")&&post818.includes("contract.stableBaseVersion!=='8.20'")&&post818.includes("info.version!=='8.20'")&&post818.includes("info.baseVersion!=='8.20'");
if(!source818Identity&&!built819Identity&&!built820Identity)fail('8.18 semantic contract has neither sealed source identity nor supported built identity');
for(const marker of ['objectMetricSchema818:true','pwaRouteTruth818:true','capturePreferenceModel818:true','evolutionObjectShelf818:true'])if(!post818.includes(marker))fail(`8.18 semantic contract missing ${marker}`);

const stepBlock=build.match(/const STEPS=\[([\s\S]*?)\n\];/);if(!stepBlock)fail('cannot parse deterministic build steps');const steps=[...stepBlock[1].matchAll(/'([^']+\.mjs)'/g)].map(match=>match[1]);if(!steps.length)fail('no deterministic build steps found');const duplicateSteps=steps.filter((step,index)=>steps.indexOf(step)!==index);if(duplicateSteps.length)fail(`duplicate build steps: ${[...new Set(duplicateSteps)].join(', ')}`);for(const step of steps)if(!fs.existsSync(step))fail(`build step does not exist: ${step}`);const expectedSteps=['8.23','8.24'].includes(CURRENT)?86:85;if(steps.length!==expectedSteps)fail(`${CURRENT} must have exactly ${expectedSteps} deterministic top-level steps, found ${steps.length}`);
for(const forbidden of ['docs/history/','archive/'])if(build.includes(forbidden))fail(`release build directly references provenance path ${forbidden}`);

const vercel=json('vercel.json');if(vercel.buildCommand!=='node build-release.mjs')fail(`Vercel buildCommand is ${vercel.buildCommand}`);if(vercel.git?.deploymentEnabled?.['**']!==false||vercel.git?.deploymentEnabled?.main!==true)fail('Vercel deployment policy must be main-only');
const edge=json('edgeone.json'),edgePrebuiltCommand='node scripts/edgeone-prebuilt-verify.mjs';if(edge.buildCommand!==edgePrebuiltCommand)fail(`EdgeOne buildCommand is ${edge.buildCommand}`);if(edge.outputDirectory!=='.')fail(`EdgeOne outputDirectory is ${edge.outputDirectory}`);if(!fs.existsSync('scripts/edgeone-prebuilt-verify.mjs'))fail('EdgeOne prebuilt verification script missing');if(edge.nodeVersion!=='20.18.0'||read('.nvmrc').trim()!=='20.18.0')fail('Node/EdgeOne version drift');

const history=['docs/history/8.3.3-stable-marker.txt','docs/history/production-restore-2026-08-12.txt','docs/history/deploy-trigger-8.10.3-2026-08-16.txt','docs/history/deploy-trigger-8.8.4-2026-08-16.md'];for(const path of history)if(!fs.existsSync(path))fail(`historical record missing: ${path}`);for(const path of ['LATEST_RELEASE_833.txt','PRODUCTION_RESTORE_20260812.txt','deploy-trigger.txt','docs/deploy-trigger.md'])if(fs.existsSync(path))fail(`one-off historical marker remains: ${path}`);
const ignore=read('.gitignore');for(const artifact of ['axis-core.js','axis-style.css','axis-build.json','node_modules/','.env'])if(!ignore.includes(artifact))fail(`.gitignore missing ${artifact}`);try{const tracked=new Set(execFileSync('git',['ls-files'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean));for(const artifact of ['axis-core.js','axis-style.css','axis-build.json'])if(tracked.has(artifact))fail(`generated artifact is tracked: ${artifact}`)}catch(error){if(String(error?.message||'').includes('[AXIS repository contract]'))throw error;console.warn('[AXIS repository contract] git tracked-file audit unavailable; filesystem contract still verified')}

const prepareCount=steps.filter(step=>step.startsWith('prepare-')).length,postbuildCount=steps.filter(step=>step.startsWith('postbuild-')).length;console.log(`[AXIS repository contract] PASS · governed current ${CURRENT} (${STATUS}) / sealed ${SEALED} @ ${PROD_SHA.slice(0,12)} · inherited runtime foundation ${FOUNDATION} · ${steps.length} deterministic top-level steps (${prepareCount} prepare / ${postbuildCount} postbuild) · converged Current Release CI preserved · locales/themes exact · Vercel + EdgeOne policies aligned`);
