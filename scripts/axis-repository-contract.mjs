import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const fail=message=>{throw new Error(`[AXIS repository contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`invalid JSON ${path}: ${error.message}`)}};

const project=json('governance/project-state.json');
const CURRENT=String(project?.product?.productionRelease||'');
const FOUNDATION=String(project?.compatibility?.longLivedFoundation||'');
const PROD_SHA=String(project?.product?.productionRuntimeSha||'');
if(!/^8\.\d+(?:\.\d+)?$/.test(CURRENT))fail(`invalid governed production release ${CURRENT}`);
if(!FOUNDATION)fail('governed compatibility foundation missing');
if(!/^[0-9a-f]{40}$/.test(PROD_SHA))fail(`invalid governed Production SHA ${PROD_SHA}`);
if(project?.product?.architecture!=='canonical-single-runtime')fail(`governed architecture is ${project?.product?.architecture}`);
if(project?.product?.releaseBuildCommand!=='node build-release.mjs')fail(`governed release command is ${project?.product?.releaseBuildCommand}`);

const required=[
  'README.md','CONTRIBUTING.md','SECURITY.md','CODE_OF_CONDUCT.md',
  'governance/README.md','governance/project-state.json','governance/owners.json','governance/retirements.json',
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
if(!readme.slice(0,1600).includes(`Current release: ${CURRENT}`))fail(`README current release is not ${CURRENT}`);
for(const [name,text] of [['HANDOFF',handoff],['CURRENT_RELEASE',releaseDoc]]){
  if(!text.includes(`AXIS ${CURRENT}`))fail(`${name} does not identify AXIS ${CURRENT}`);
  if(!text.includes(PROD_SHA))fail(`${name} does not identify governed Production SHA`);
}
if(!work.includes(project.engineering.activeMilestone))fail('CURRENT_WORK does not identify the governed active milestone');
if(!work.includes(project.engineering.activeBranch))fail('CURRENT_WORK does not identify the governed active branch');
if(!read('docs/RUNTIME_CONTRACT.md').includes(FOUNDATION))fail(`docs/RUNTIME_CONTRACT.md does not preserve the ${FOUNDATION} runtime foundation`);

const localeSpec=project?.presentationFoundation?.locales;
const expectedLocales=[['zh-Hans','简体中文'],['zh-Hant','繁體中文'],['en','English']];
if(!Array.isArray(localeSpec)||localeSpec.length!==expectedLocales.length)fail('presentation locale registry must contain exactly zh-Hans, zh-Hant and en');
for(let i=0;i<expectedLocales.length;i++){
  const [id,name]=expectedLocales[i],actual=localeSpec[i];
  if(actual?.id!==id||actual?.name!==name||actual?.requireProfessionalTranslation!==true)fail(`locale contract mismatch at ${id}`);
}
const themes=project?.presentationFoundation?.themes;
if(JSON.stringify(themes)!==JSON.stringify(['system','light','dark']))fail('theme contract must be exactly system / light / dark');
const localization=read('docs/LOCALIZATION_AND_THEME.md'),glossary=read('docs/GLOSSARY.md');
for(const needle of ['zh-Hans','简体中文','zh-Hant','繁體中文','English'])if(!localization.includes(needle)||!glossary.includes(needle))fail(`localization/glossary contract missing ${needle}`);

const owners=json('governance/owners.json'),retirements=json('governance/retirements.json');
if(owners?.baselineRelease!==CURRENT||!Array.isArray(owners?.owners)||owners.owners.length<8)fail('owner registry is missing the current critical-owner baseline');
if(retirements?.baselineRelease!==CURRENT||!Array.isArray(retirements?.retirements)||retirements.retirements.length<4)fail('retirement registry is missing the current baseline');
for(const id of ['keep-clip-visible-setting','three-mode-default-capture-controller','v876-capture-preference-writer','low-fps-watermark-video-path'])if(!retirements.retirements.some(x=>x.id===id))fail(`retirement guard missing ${id}`);

const build=read('build-release.mjs');
for(const marker of ['prepare-812-release-compat.mjs','prepare-812-learning-content.mjs','prepare-812-learning-settings.mjs','postbuild-812-contract.mjs'])if(!build.includes(marker))fail(`inherited foundation build marker missing: ${marker}`);

/* Preserve the already-proven nested release graph while governance is separated from
   historical filenames. These are reachability assertions, not declarations that old
   version-labelled files remain current product owners. */
const releaseDriver=read('prepare-8151-regression-release.mjs');
if(!releaseDriver.includes("await import('./prepare-816-release.mjs')"))fail('8.16 substrate is not chained from the sealed 8.15.1 release driver');
const release816=read('prepare-816-release.mjs');
if(!release816.includes("await import('./prepare-817-release.mjs')"))fail('8.17 release is not chained from the inherited 8.16 release driver');
const release818=read('prepare-818-release.mjs');
if(!release818.includes("const FROM='8.17',VERSION='8.18';"))fail('8.18 release transition contract drift');
const release819=read('prepare-819-release.mjs');
if(!release819.includes("const FROM='8.18',VERSION='8.19';"))fail('8.19 release transition contract drift');
const convergenceDriver=read('prepare-8151-regression-seal.mjs');
for(const marker of ["await import('./prepare-816-capture-evidence-convergence.mjs')","await import('./prepare-816-evidence-compat-refine.mjs')","await import('./prepare-817-interaction-convergence-driver.mjs')"])if(!convergenceDriver.includes(marker))fail(`8.16/8.17 convergence chain missing: ${marker}`);
const captureDriver=read('prepare-816-capture-evidence-convergence.mjs');
if(!captureDriver.includes('prepare-816-capture-evidence-convergence-v2.mjs'))fail('8.16 Capture v2 convergence is not reachable');
const evidenceDriver=read('prepare-816-evidence-compat-refine.mjs');
if(!evidenceDriver.includes('prepare-816-capture-marker-seal.mjs'))fail('8.16 final Capture selector/entry seal is not reachable');
const postDriver=read('postbuild-8151-regression-contract.mjs');
if(!postDriver.includes("await import('./postbuild-816-contract.mjs')"))fail('8.16 postbuild contract is not chained from the inherited 8.15.1 seal');
const post816=read('postbuild-816-contract.mjs');
if(!post816.includes("await import('./postbuild-817-contract.mjs')"))fail('8.17 postbuild contract is not chained from inherited 8.16');
const post817=read('postbuild-817-contract.mjs');
if(!post817.includes("await import('./postbuild-8171-source-first-media-contract.mjs')"))fail('8.17.1 source-media contract is not chained from 8.17');
const post8171=read('postbuild-8171-source-first-media-contract.mjs');
if(!post8171.includes("await import('./postbuild-818-contract.mjs')"))fail('8.18 postbuild contract is not chained from 8.17.1');
const post818=read('postbuild-818-contract.mjs');
const source818Identity=post818.includes("contract.publicVersion!=='8.18'")&&post818.includes("contract.stableBaseVersion!=='8.18'")&&post818.includes("info.version!=='8.18'")&&post818.includes("info.baseVersion!=='8.18'");
const built819Identity=post818.includes("contract.publicVersion!=='8.19'")&&post818.includes("contract.stableBaseVersion!=='8.19'")&&post818.includes("info.version!=='8.19'")&&post818.includes("info.baseVersion!=='8.19'");
if(!source818Identity&&!built819Identity)fail('8.18 semantic contract has neither sealed source identity nor 8.19 built identity');
for(const marker of ['objectMetricSchema818:true','pwaRouteTruth818:true','capturePreferenceModel818:true','evolutionObjectShelf818:true'])if(!post818.includes(marker))fail(`8.18 semantic contract missing ${marker}`);
if(!build.includes("architecture==='canonical-single-runtime'"))fail('canonical single-runtime release assertion missing');

const stepBlock=build.match(/const STEPS=\[([\s\S]*?)\n\];/);
if(!stepBlock)fail('cannot parse deterministic build steps');
const steps=[...stepBlock[1].matchAll(/'([^']+\.mjs)'/g)].map(match=>match[1]);
if(!steps.length)fail('no deterministic build steps found');
const duplicateSteps=steps.filter((step,index)=>steps.indexOf(step)!==index);
if(duplicateSteps.length)fail(`duplicate build steps: ${[...new Set(duplicateSteps)].join(', ')}`);
for(const step of steps)if(!fs.existsSync(step))fail(`build step does not exist: ${step}`);

/* Provenance directories may be referenced by documentation but may not become the
   release entry point or runtime authority. */
for(const forbidden of ['docs/history/','archive/'])if(build.includes(forbidden))fail(`release build directly references provenance path ${forbidden}`);

const vercel=json('vercel.json');
if(vercel.buildCommand!=='node build-release.mjs')fail(`Vercel buildCommand is ${vercel.buildCommand}`);
if(vercel.git?.deploymentEnabled?.['**']!==false||vercel.git?.deploymentEnabled?.main!==true)fail('Vercel deployment policy must be main-only');
const edge=json('edgeone.json');
const edgePrebuiltCommand='node scripts/edgeone-prebuilt-verify.mjs';
if(edge.buildCommand!==edgePrebuiltCommand)fail(`EdgeOne buildCommand is ${edge.buildCommand}; expected verified-prebuilt publisher ${edgePrebuiltCommand}`);
if(edge.outputDirectory!=='.')fail(`EdgeOne outputDirectory is ${edge.outputDirectory}; expected repository-root verified artifact`);
if(!fs.existsSync('scripts/edgeone-prebuilt-verify.mjs'))fail('EdgeOne prebuilt verification script is missing');
if(edge.nodeVersion!=='20.18.0')fail(`EdgeOne Node version is ${edge.nodeVersion}`);
if(read('.nvmrc').trim()!=='20.18.0')fail('.nvmrc must match CI/EdgeOne Node 20.18.0');

const history=[
  'docs/history/8.3.3-stable-marker.txt',
  'docs/history/production-restore-2026-08-12.txt',
  'docs/history/deploy-trigger-8.10.3-2026-08-16.txt',
  'docs/history/deploy-trigger-8.8.4-2026-08-16.md'
];
for(const path of history)if(!fs.existsSync(path))fail(`historical record missing: ${path}`);
for(const path of ['LATEST_RELEASE_833.txt','PRODUCTION_RESTORE_20260812.txt','deploy-trigger.txt','docs/deploy-trigger.md'])if(fs.existsSync(path))fail(`one-off historical marker remains in active repository surface: ${path}`);

const ignore=read('.gitignore');
for(const artifact of ['axis-core.js','axis-style.css','axis-build.json','node_modules/','.env'])if(!ignore.includes(artifact))fail(`.gitignore missing ${artifact}`);
try{
  const tracked=new Set(execFileSync('git',['ls-files'],{encoding:'utf8'}).split(/\r?\n/).filter(Boolean));
  for(const artifact of ['axis-core.js','axis-style.css','axis-build.json'])if(tracked.has(artifact))fail(`generated artifact is tracked: ${artifact}`);
}catch(error){
  if(String(error?.message||'').includes('[AXIS repository contract]'))throw error;
  console.warn('[AXIS repository contract] git tracked-file audit unavailable; filesystem contract still verified');
}

const prepareCount=steps.filter(step=>step.startsWith('prepare-')).length;
const postbuildCount=steps.filter(step=>step.startsWith('postbuild-')).length;
console.log(`[AXIS repository contract] PASS · governed current ${CURRENT} @ ${PROD_SHA.slice(0,12)} · inherited runtime foundation ${FOUNDATION} · 8.18 semantic contract reachable/source-or-8.19-built identity sealed · ${steps.length} deterministic top-level steps (${prepareCount} prepare / ${postbuildCount} postbuild) · exact locales zh-Hans/zh-Hant/en · themes system/light/dark · Vercel + EdgeOne policies aligned`);
