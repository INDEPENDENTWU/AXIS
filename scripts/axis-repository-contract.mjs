import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

const fail=message=>{throw new Error(`[AXIS repository contract] ${message}`)};
const read=path=>{if(!fs.existsSync(path))fail(`missing ${path}`);return fs.readFileSync(path,'utf8')};
const json=path=>{try{return JSON.parse(read(path))}catch(error){fail(`invalid JSON ${path}: ${error.message}`)}};

const CURRENT='8.16',FOUNDATION='8.12';
const required=[
  'README.md','CONTRIBUTING.md','SECURITY.md','CODE_OF_CONDUCT.md',
  'docs/README.md','docs/PRODUCT.md','docs/ARCHITECTURE.md','docs/CURRENT_RELEASE.md',
  'docs/RUNTIME_CONTRACT.md','docs/ENGINEERING_PLAYBOOK.md','docs/ROADMAP.md',
  'docs/REPOSITORY_STRUCTURE.md','docs/COMPATIBILITY_LEDGER.md','docs/CI_AND_RELEASE.md',
  '.github/CODEOWNERS','.github/PULL_REQUEST_TEMPLATE.md',
  '.github/ISSUE_TEMPLATE/bug.yml','.github/ISSUE_TEMPLATE/change.yml','.github/ISSUE_TEMPLATE/config.yml',
  '.editorconfig','.gitattributes','.gitignore','.nvmrc',
  'build-release.mjs','vercel.json','edgeone.json'
];
for(const path of required)if(!fs.existsSync(path))fail(`required file missing: ${path}`);

const readme=read('README.md');
if(!readme.slice(0,1200).includes(`Current release: ${CURRENT}`))fail(`README current release is not ${CURRENT}`);
if(!read('docs/CURRENT_RELEASE.md').includes(`AXIS ${CURRENT}`))fail(`docs/CURRENT_RELEASE.md does not identify ${CURRENT}`);
if(!read('docs/RUNTIME_CONTRACT.md').includes(FOUNDATION))fail(`docs/RUNTIME_CONTRACT.md does not preserve the ${FOUNDATION} runtime foundation`);

const build=read('build-release.mjs');
for(const marker of ['prepare-812-release-compat.mjs','prepare-812-learning-content.mjs','prepare-812-learning-settings.mjs','postbuild-812-contract.mjs'])if(!build.includes(marker))fail(`inherited foundation build marker missing: ${marker}`);
/* 8.16 deliberately enters through the existing deterministic convergence chain rather
   than adding duplicate top-level steps. Validate those real import edges explicitly. */
const releaseDriver=read('prepare-8151-regression-release.mjs');
if(!releaseDriver.includes("await import('./prepare-816-release.mjs')"))fail('8.16 release is not chained from the sealed 8.15.1 release driver');
const convergenceDriver=read('prepare-8151-regression-seal.mjs');
for(const marker of ["await import('./prepare-816-capture-evidence-convergence.mjs')","await import('./prepare-816-evidence-compat-refine.mjs')"])if(!convergenceDriver.includes(marker))fail(`8.16 convergence chain missing: ${marker}`);
const captureDriver=read('prepare-816-capture-evidence-convergence.mjs');
if(!captureDriver.includes("prepare-816-capture-evidence-convergence-v2.mjs"))fail('8.16 Capture v2 convergence is not reachable');
const evidenceDriver=read('prepare-816-evidence-compat-refine.mjs');
if(!evidenceDriver.includes("prepare-816-capture-marker-seal.mjs"))fail('8.16 final Capture selector/entry seal is not reachable');
const postDriver=read('postbuild-8151-regression-contract.mjs');
if(!postDriver.includes("await import('./postbuild-816-contract.mjs')"))fail('8.16 postbuild contract is not chained from the inherited 8.15.1 seal');
if(!build.includes("architecture==='canonical-single-runtime'"))fail('canonical single-runtime release assertion missing');

const stepBlock=build.match(/const STEPS=\[([\s\S]*?)\n\];/);
if(!stepBlock)fail('cannot parse deterministic build steps');
const steps=[...stepBlock[1].matchAll(/'([^']+\.mjs)'/g)].map(match=>match[1]);
if(!steps.length)fail('no deterministic build steps found');
const duplicateSteps=steps.filter((step,index)=>steps.indexOf(step)!==index);
if(duplicateSteps.length)fail(`duplicate build steps: ${[...new Set(duplicateSteps)].join(', ')}`);
for(const step of steps)if(!fs.existsSync(step))fail(`build step does not exist: ${step}`);

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
console.log(`[AXIS repository contract] PASS · current ${CURRENT} · inherited runtime foundation ${FOUNDATION} · nested 8.16 release/convergence/postbuild graph verified · ${steps.length} deterministic top-level steps (${prepareCount} prepare / ${postbuildCount} postbuild) · Vercel build + EdgeOne verified-prebuilt publishing aligned`);
