# CI convergence

AXIS is reducing historical CI fanout **without reducing release proof**. Machine evidence lives in [`../governance/ci-inventory.json`](../governance/ci-inventory.json).

## Baseline

PR #79 initially triggered **25 workflow families** for a governance/docs-oriented head, spanning 8.8→8.18 plus current/runtime/provider checks. The issue was duplicated build/browser setup and inherited smoke repetition, not the age of the assertions.

## Rule

A workflow may be retired only after:

1. its current semantic/data/engine responsibilities are explicit;
2. a replacement contains equivalent or stronger assertions;
3. the replacement passes on one exact candidate;
4. Chromium/WebKit coverage is retained where relevant;
5. required status-check names are audited;
6. a post-retirement guard prevents accidental resurrection.

`main` currently has no branch protection required checks, so historical check-name compatibility does not block proven replacements.

## Verified optimization 1 · stale-head cancellation

`AXIS PR Run Convergence` cancels only still-active older-SHA runs from the same PR. Run `32626975731` found 10 stale active runs, accepted 8 cancellations, and never touched the current head or `push/main` Production runs.

## Verified optimization 2 · Current Release Gate

Seven 8.14→8.18 automatic workflow families were replaced by `AXIS Current Release Gate` + `axis-current-release-contract.mjs`.

Replacement run `32630099680` on `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59` passed Chromium + WebKit and the full inherited Evolution / Evidence / watermark / Capture / interaction chain.

After physical retirement, head `709d801e268e6d06248c21f517aa1a17e565764b` passed Repository/guard `32630367007` and Current Release `32630367047` on both engines.

## Verified optimization 3 · Runtime Foundation Gate

Four 8.13 Runtime Core / Shadow Runtime / Live Route / Settings automatic workflows were replaced by `AXIS Runtime Foundation Gate` + `axis-runtime-foundation-contract.mjs`.

Replacement run `32630563608` passed pure-runtime-parity, Chromium and WebKit. After physical retirement, head `b4cd93e091ac7368dc2b6e5b57aa96236bbaa70d` passed Repository/11-workflow guard `32630723051` and Runtime Foundation `32630723007` on all three jobs.

## Verified optimization 4 · Deep Compatibility Gate

Nine remaining 8.8→8.12.x automatic compatibility workflow families were mapped by actual responsibility rather than release number and replaced by:

- `.github/workflows/axis-deep-compatibility-gate.yml`;
- `scripts/axis-deep-compatibility-contract.mjs`.

The replacement keeps the exact current compatibility promises:

- legacy storage identities `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`;
- reminder repaint/bottom-stack geometry;
- Home active hierarchy, inter-item transition, completed Home and canonical Quick camera;
- 8.9→8.10.3 detail, learning, timer, local recording, home/sound and multilingual voice behavior;
- 8.12 field hardening, real Group Plan and Settings behavior;
- Personal Equipment library/photos/history, gallery/picker lifecycle and geometry;
- simplified local-only Learning/no-upload/no-training-owner boundaries;
- 8.12.4 training timing/completion/catalog and 8.12.5 smart-create;
- static syntax of inherited server/compiler/postbuild/smoke surfaces.

The first replacement attempt, run `32630933984`, exposed a replacement-harness-only dependency error: Chromium installed `playwright-core` while `axis-reminder-layout-smoke.mjs` imports `playwright`. No product code, assertion or timeout was changed. The harness was corrected to the same full `playwright@1.55.0` dependency used by the historical Reminder workflow.

Exact candidate `a879d30c2cf6e0b3eb2e0fed91a48f3b62262da0`, run `32631072695`:

- static compatibility — **success**;
- Chromium compatibility — **success**;
- iPhone-like WebKit compatibility — **success**;
- every grouped inherited browser smoke — **success**.

That exact-candidate proof authorizes atomic retirement of these nine old workflow files:

- `axis-812-field-hardening-gate.yml`;
- `axis-8121-hotfix-gate.yml`;
- `axis-8122-settings-gate.yml`;
- `axis-8123-field-polish-gate.yml`;
- `axis-8123-learning-simplify-gate.yml`;
- `axis-89-gate.yml`;
- `axis-88-reminder-layout-gate.yml`;
- `axis-home-transition-gate.yml`;
- `axis-8124-flow-gate.yml`.

`axis-ci-convergence-contract.mjs` now requires the Deep Compatibility replacement and forbids all **20** retired workflow files from returning.

## Current automatic workflow architecture after this retirement

The intended automatic PR/main families are now **9**, organized by responsibility rather than historical version:

1. AXIS Repository Contract;
2. AXIS Work Continuity Contract;
3. AXIS Runtime Gate;
4. AXIS Current Release Gate;
5. AXIS Runtime Foundation Gate;
6. AXIS Deep Compatibility Gate;
7. AXIS Cross-Platform Foundation Gate;
8. AXIS PR Run Convergence;
9. AXIS EdgeOne Production Mirror.

EdgeOne was separately audited: pull requests run only the prebuilt/package contract; `deploy-production` remains strictly `push` to `main`. No PR can deploy EdgeOne Production through this workflow.

## Current target architecture

1. **Fast Repository Gate** — governance, structure, owner/retirement guards.
2. **Current Release Gate** — current user-visible product semantics.
3. **Runtime Foundation Gate** — pure/shadow runtime + exact base parity + Live Route/Settings.
4. **Deep Compatibility Gate** — old data and genuinely unique inherited behavior.
5. **Exact-SHA Production Seal** — provider artifact parity + real Production browser verification.

The objective remains: **less duplicate work, never less verification**.
