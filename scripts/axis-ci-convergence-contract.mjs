import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS CI convergence contract] ${m}`)};
const required=[
  '.github/workflows/axis-current-release-gate.yml','.github/workflows/axis-runtime-foundation-gate.yml','.github/workflows/axis-pr-run-convergence.yml',
  'scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','governance/ci-inventory.json','docs/CI_CONVERGENCE.md'
];
for(const f of required)if(!fs.existsSync(f))fail(`required current CI surface missing ${f}`);
const retired=[
  '.github/workflows/axis-814-evolution-object-gate.yml','.github/workflows/axis-815-media-evidence-gate.yml','.github/workflows/axis-8151-regression-seal-gate.yml','.github/workflows/axis-816-capture-evidence-gate.yml','.github/workflows/axis-817-interaction-gate.yml','.github/workflows/axis-8171-source-media-gate.yml','.github/workflows/axis-818-object-focus-gate.yml',
  '.github/workflows/axis-813-runtime-core-gate.yml','.github/workflows/axis-813-shadow-runtime-gate.yml','.github/workflows/axis-813-live-route-gate.yml','.github/workflows/axis-813-settings-convergence-gate.yml'
];
for(const f of retired)if(fs.existsSync(f))fail(`superseded automatic workflow returned ${f}`);
const current=fs.readFileSync('.github/workflows/axis-current-release-gate.yml','utf8');
for(const n of ['axis-8131-evolution-smoke.mjs','axis-814-evolution-object-smoke.mjs','axis-815-media-evidence-smoke.mjs','axis-8151-regression-seal-smoke.mjs','axis-8151-evidence-swap-smoke.mjs','axis-watermark-smoke.mjs','axis-816-capture-evidence-smoke.mjs','axis-817-interaction-smoke.mjs','axis-8171-source-first-media-smoke.mjs','axis-818-object-focus-smoke.mjs','AXIS_ENGINE: chromium','AXIS_ENGINE: webkit'])if(!current.includes(n))fail(`Current Release Gate lost ${n}`);
const runtime=fs.readFileSync('.github/workflows/axis-runtime-foundation-gate.yml','utf8');
for(const n of ['pure-runtime-parity','chromium-runtime','webkit-runtime','axis-813-runtime-core.mjs','axis-813-shadow-runtime.mjs','axis-813-build-parity.mjs','axis-813-shadow-browser.mjs','axis-813-live-route-ci-diagnostic.mjs','axis-813-settings-convergence-smoke.mjs'])if(!runtime.includes(n))fail(`Runtime Foundation Gate lost ${n}`);
const state=JSON.parse(fs.readFileSync('governance/ci-inventory.json','utf8'));
const c=state.currentReleaseConvergence,r=state.runtimeFoundationConvergence;
if(c?.replacementRunId!==32630099680||c?.chromium!=='success'||c?.webkit!=='success'||c?.postRetirementRunId!==32630367047||c?.postRetirementChromium!=='success'||c?.postRetirementWebkit!=='success'||c?.retiredAutomaticWorkflows?.length!==7)fail('Current Release convergence proof incomplete');
if(r?.replacementRunId!==32630563608||r?.pureRuntimeParity!=='success'||r?.chromium!=='success'||r?.webkit!=='success'||r?.postRetirementRunId!==32630723007||r?.postRetirementPureRuntimeParity!=='success'||r?.postRetirementChromium!=='success'||r?.postRetirementWebkit!=='success'||r?.retiredAutomaticWorkflows?.length!==4)fail('Runtime Foundation convergence proof incomplete');
if(state?.branchProtectionAudit?.requiredStatusChecks!==0)fail('branch-protection audit changed; re-evaluate retirements');
console.log('[AXIS CI convergence contract] PASS · 11 retired workflow files absent · Current Release + Runtime Foundation replacement and post-retirement proofs sealed');
