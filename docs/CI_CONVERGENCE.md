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

After physical retirement, head `709d801e268e6d06248c21f517aa1a17e565764b` passed:

- Repository + retirement guard `32630367007`;
- Current Release Gate `32630367047`, both engines.

Seven duplicated workflow files remain forbidden by `axis-ci-convergence-contract.mjs`.

## Verified optimization 3 · Runtime Foundation Gate

The 8.13 workflow family carried real unique responsibilities but did not need four separately version-shaped automatic workflows.

Replacement: `AXIS Runtime Foundation Gate` + `axis-runtime-foundation-contract.mjs`.

It has three explicit jobs:

- `pure-runtime-parity` — Runtime Core, Shadow Runtime, one build, exact base-SHA artifact parity;
- `chromium-runtime` — one build, Shadow transitions, Continue + Live Route, inline Settings;
- `webkit-runtime` — same browser responsibilities on iPhone-like WebKit.

`prepare-8123-ci-stability.mjs` was inspected first and confirmed to mutate inherited test scripts only, not the built product artifact.

Replacement run `32630563608` on `4e1d19581a0a4fd91d25823303aa8a6dc25657fa`:

- pure-runtime-parity — **success**;
- Chromium — **success**;
- WebKit — **success**.

This preserves exact base parity, pure/shadow Runtime semantics and both browser paths while reducing the old 8.13 responsibility from up to eight canonical builds to three.

The four old 8.13 workflow files are now classified **superseded** and approved for atomic physical retirement.

## Current target architecture

1. **Fast Repository Gate** — governance, structure, owner/retirement guards.
2. **Current Release Gate** — current user-visible product semantics.
3. **Runtime Foundation / Deep Compatibility** — pure runtime, old data and genuinely unique inherited behavior.
4. **Exact-SHA Production Seal** — provider artifact parity + real Production browser verification.

## Next audit · 8.12 and older

The remaining historical automatic gates are not yet approved for deletion. Current evidence:

- 8.12.1 / 8.12.2 / 8.12.3 repeatedly inherit Group Plan checks;
- 8.12.3 Field Polish uniquely includes Personal Equipment photos/history, gallery/picker lifecycle and geometry;
- 8.12.3 Learning Simplify uniquely covers local recording/no-upload/no-training-owner learning boundaries;
- `axis-89-gate.yml` is the 8.10.3 workflow and runs the full 8.9→8.10.3 learning/detail/home/voice chain;
- Runtime Gate already owns broad current Home/8.8.x/catalog/watermark/full-product behavior.

The next convergence must separate **old-data/compatibility promises** from repeated current behavior, then create one Deep Compatibility Gate before retiring older workflow fanout.

The objective remains: **less duplicate work, never less verification**.
