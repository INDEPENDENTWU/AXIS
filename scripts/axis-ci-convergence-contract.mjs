import fs from 'node:fs';

const fail=m=>{throw new Error(`[AXIS CI convergence contract] ${m}`)};
const required=[
  '.github/workflows/axis-current-release-gate.yml','.github/workflows/axis-runtime-foundation-gate.yml','.github/workflows/axis-deep-compatibility-gate.yml','.github/workflows/axis-pr-run-convergence.yml',
  'scripts/axis-current-release-contract.mjs','scripts/axis-runtime-foundation-contract.mjs','scripts/axis-deep-compatibility-contract.mjs','governance/ci-inventory.json','docs/CI_CONVERGENCE.md'
];
for(const f of required)if(!fs.existsSync(f))fail(`required current CI surface missing ${f}`);
const retired=[
  '.github/workflows/axis-814-evolution-object-gate.yml','.github/workflows/axis-815-media-evidence-gate.yml','.github/workflows/axis-8151-regression-seal-gate.yml','.github/workflows/axis-816-capture-evidence-gate.yml','.github/workflows/axis-817-interaction-gate.yml','.github/workflows/axis-8171-source-media-gate.yml','.github/workflows/axis-818-object-focus-gate.yml',
  '.github/workflows/axis-813-runtime-core-gate.yml','.github/workflows/axis-813-shadow-runtime-gate.yml','.github/workflows/axis-813-live-route-gate.yml','.github/workflows/axis-813-settings-convergence-gate.yml',
  '.github/workflows/axis-812-field-hardening-gate.yml','.github/workflows/axis-8121-hotfix-gate.yml','.github/workflows/axis-8122-settings-gate.yml','.github/workflows/axis-8123-field-polish-gate.yml','.github/workflows/axis-8123-learning-simplify-gate.yml','.github/workflows/axis-89-gate.yml','.github/workflows/axis-88-reminder-layout-gate.yml','.github/workflows/axis-home-transition-gate.yml','.github/workflows/axis-8124-flow-gate.yml'
];
for(const f of retired)if(fs.existsSync(f))fail(`superseded automatic workflow returned ${f}`);
const current=fs.readFileSync('.github/workflows/axis-current-release-gate.yml','utf8');
for(const n of ['axis-8131-evolution-smoke.mjs','axis-814-evolution-object-smoke.mjs','axis-815-media-evidence-smoke.mjs','axis-8151-regression-seal-smoke.mjs','axis-8151-evidence-swap-smoke.mjs','axis-watermark-smoke.mjs','axis-816-capture-evidence-smoke.mjs','axis-817-interaction-smoke.mjs','axis-8171-source-first-media-smoke.mjs','axis-818-object-focus-smoke.mjs','AXIS_ENGINE: chromium','AXIS_ENGINE: webkit'])if(!current.includes(n))fail(`Current Release Gate lost ${n}`);
const runtime=fs.readFileSync('.github/workflows/axis-runtime-foundation-gate.yml','utf8');
for(const n of ['pure-runtime-parity','chromium-runtime','webkit-runtime','axis-813-runtime-core.mjs','axis-813-shadow-runtime.mjs','axis-813-build-parity.mjs','axis-813-shadow-browser.mjs','axis-813-live-route-ci-diagnostic.mjs','axis-813-settings-convergence-smoke.mjs'])if(!runtime.includes(n))fail(`Runtime Foundation Gate lost ${n}`);
const deep=fs.readFileSync('.github/workflows/axis-deep-compatibility-gate.yml','utf8');
for(const n of ['static-compatibility','chromium-compatibility','webkit-compatibility','axis-reminder-layout-smoke.mjs','axis-882-home-transition-smoke.mjs','axis-882-completion-camera-smoke.mjs','axis-89-smoke.mjs','axis-8103-smoke.mjs','axis-812-field-hardening-smoke.mjs','axis-8121-hotfix-smoke.mjs','axis-8122-settings-smoke.mjs','axis-8123-field-polish-smoke.mjs','axis-8123-equipment-gallery-picker-smoke.mjs','axis-8123-learning-simplify-smoke.mjs','axis-8124-flow-smoke.mjs','axis-8124-catalog-polish-smoke.mjs','axis-8125-smart-create-polish-smoke.mjs'])if(!deep.includes(n))fail(`Deep Compatibility Gate lost ${n}`);
const state=JSON.parse(fs.readFileSync('governance/ci-inventory.json','utf8'));
const c=state.currentReleaseConvergence,r=state.runtimeFoundationConvergence,d=state.deepCompatibilityConvergence;
if(c?.replacementRunId!==32630099680||c?.chromium!=='success'||c?.webkit!=='success'||c?.postRetirementRunId!==32630367047||c?.postRetirementChromium!=='success'||c?.postRetirementWebkit!=='success'||c?.retiredAutomaticWorkflows?.length!==7)fail('Current Release convergence proof incomplete');
if(r?.replacementRunId!==32630563608||r?.pureRuntimeParity!=='success'||r?.chromium!=='success'||r?.webkit!=='success'||r?.postRetirementRunId!==32630723007||r?.postRetirementPureRuntimeParity!=='success'||r?.postRetirementChromium!=='success'||r?.postRetirementWebkit!=='success'||r?.retiredAutomaticWorkflows?.length!==4)fail('Runtime Foundation convergence proof incomplete');
if(d?.replacementRunId!==32631072695||d?.static!=='success'||d?.chromium!=='success'||d?.webkit!=='success'||d?.retiredAutomaticWorkflows?.length!==9||d?.retirementAuthorized!==true)fail('Deep Compatibility replacement proof incomplete');
if(state?.automaticWorkflowCountAfterDeepCompatibilityRetirement!==9)fail('expected automatic workflow convergence target is not 9');
if(state?.branchProtectionAudit?.requiredStatusChecks!==0)fail('branch-protection audit changed; re-evaluate retirements');
console.log('[AXIS CI convergence contract] PASS · 20 retired workflow files absent · Current Release + Runtime Foundation + Deep Compatibility replacement coverage sealed');
