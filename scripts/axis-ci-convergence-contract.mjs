import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS CI convergence contract] ${m}`)};
const required=[
  '.github/workflows/axis-current-release-gate.yml',
  '.github/workflows/axis-pr-run-convergence.yml',
  'scripts/axis-current-release-contract.mjs',
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
  '.github/workflows/axis-818-object-focus-gate.yml'
];
for(const f of retired)if(fs.existsSync(f))fail(`superseded automatic workflow returned ${f}`);

const current=fs.readFileSync('.github/workflows/axis-current-release-gate.yml','utf8');
for(const needle of [
  'node scripts/axis-current-release-contract.mjs',
  'axis-8131-evolution-smoke.mjs',
  'axis-814-evolution-object-smoke.mjs',
  'axis-815-media-evidence-smoke.mjs',
  'axis-8151-regression-seal-smoke.mjs',
  'axis-8151-evidence-swap-smoke.mjs',
  'axis-watermark-smoke.mjs',
  'axis-816-capture-evidence-smoke.mjs',
  'axis-817-interaction-smoke.mjs',
  'axis-8171-source-first-media-smoke.mjs',
  'axis-818-object-focus-smoke.mjs',
  'AXIS_ENGINE: chromium',
  'AXIS_ENGINE: webkit'
])if(!current.includes(needle))fail(`Current Release Gate lost inherited coverage ${needle}`);

const state=JSON.parse(fs.readFileSync('governance/ci-inventory.json','utf8'));
const proof=state?.currentReleaseConvergence;
if(proof?.replacementRunId!==32630099680||proof?.chromium!=='success'||proof?.webkit!=='success')fail('replacement dual-engine proof missing');
if(proof?.retiredAutomaticWorkflows?.length!==7)fail('retired workflow count must be seven');
if(proof?.branchProtectionRequiredChecks!==0)fail('branch-protection audit changed; re-evaluate workflow retirement');

console.log('[AXIS CI convergence contract] PASS · Current Release Gate owns 8.14→8.18 automatic regression coverage · 7 duplicate version workflows remain retired · replacement dual-engine proof sealed');
