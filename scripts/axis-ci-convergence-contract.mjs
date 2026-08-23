import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS CI convergence contract] ${m}`)};
const required=[
  '.github/workflows/axis-current-release-gate.yml',
  '.github/workflows/axis-runtime-foundation-gate.yml',
  '.github/workflows/axis-pr-run-convergence.yml',
  'scripts/axis-current-release-contract.mjs',
  'scripts/axis-runtime-foundation-contract.mjs',
  'governance/ci-inventory.json',
  'docs/CI_CONVERGENCE.md'
];
for(const f of required)if(!fs.existsSync(f))fail(`required current CI surface missing ${f}`);

const retired=[
  '.github/workflows/axis-814-evolution-object-gate.yml',
  '.github/workflows/axis-815-media-evidence-gate.yml',
  '.github/workflows/axis-8151-regression-seal-gate.yml',
  '.github/workflows/axis-816-capture-evidence-gate.yml',
  '.github/workflows/axis-817-interaction-gate.yml',
  '.github/workflows/axis-8171-source-media-gate.yml',
  '.github/workflows/axis-818-object-focus-gate.yml',
  '.github/workflows/axis-813-runtime-core-gate.yml',
  '.github/workflows/axis-813-shadow-runtime-gate.yml',
  '.github/workflows/axis-813-live-route-gate.yml',
  '.github/workflows/axis-813-settings-convergence-gate.yml'
];
for(const f of retired)if(fs.existsSync(f))fail(`superseded automatic workflow returned ${f}`);

const current=fs.readFileSync('.github/workflows/axis-current-release-gate.yml','utf8');
for(const needle of [
  'node scripts/axis-current-release-contract.mjs',
  'axis-8131-evolution-smoke.mjs','axis-814-evolution-object-smoke.mjs','axis-815-media-evidence-smoke.mjs',
  'axis-8151-regression-seal-smoke.mjs','axis-8151-evidence-swap-smoke.mjs','axis-watermark-smoke.mjs',
  'axis-816-capture-evidence-smoke.mjs','axis-817-interaction-smoke.mjs','axis-8171-source-first-media-smoke.mjs','axis-818-object-focus-smoke.mjs',
  'AXIS_ENGINE: chromium','AXIS_ENGINE: webkit'
])if(!current.includes(needle))fail(`Current Release Gate lost inherited coverage ${needle}`);

const runtime=fs.readFileSync('.github/workflows/axis-runtime-foundation-gate.yml','utf8');
for(const needle of [
  'pure-runtime-parity','chromium-runtime','webkit-runtime',
  'axis-813-runtime-core.mjs','axis-813-shadow-runtime.mjs','axis-813-build-parity.mjs',
  'axis-813-shadow-browser.mjs','axis-813-live-route-ci-diagnostic.mjs','axis-813-settings-convergence-smoke.mjs',
  'prepare-8123-ci-stability.mjs','node scripts/axis-runtime-foundation-contract.mjs'
])if(!runtime.includes(needle))fail(`Runtime Foundation Gate lost responsibility ${needle}`);

const state=JSON.parse(fs.readFileSync('governance/ci-inventory.json','utf8'));
const currentProof=state?.currentReleaseConvergence;
if(currentProof?.replacementRunId!==32630099680||currentProof?.chromium!=='success'||currentProof?.webkit!=='success')fail('Current Release replacement proof missing');
if(currentProof?.postRetirementRunId!==32630367047||currentProof?.postRetirementChromium!=='success'||currentProof?.postRetirementWebkit!=='success')fail('Current Release post-retirement proof missing');
if(currentProof?.retiredAutomaticWorkflows?.length!==7)fail('Current Release retired workflow count must be seven');

const runtimeProof=state?.runtimeFoundationConvergence;
if(runtimeProof?.replacementRunId!==32630563608)fail('Runtime Foundation replacement proof missing');
if(runtimeProof?.pureRuntimeParity!=='success'||runtimeProof?.chromium!=='success'||runtimeProof?.webkit!=='success')fail('Runtime Foundation three-job proof incomplete');
if(runtimeProof?.retiredAutomaticWorkflows?.length!==4)fail('Runtime Foundation retired workflow count must be four');
if(state?.branchProtectionAudit?.requiredStatusChecks!==0)fail('branch-protection audit changed; re-evaluate workflow retirement');

console.log('[AXIS CI convergence contract] PASS · Current Release + Runtime Foundation own current automatic coverage · 11 duplicate version workflows remain retired · exact replacement proofs sealed');
