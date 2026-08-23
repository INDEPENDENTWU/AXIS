# CI convergence

This document records the evidence-driven migration from historical per-release workflow accumulation toward a smaller current CI system **without reducing release proof**.

Machine snapshot: [`../governance/ci-inventory.json`](../governance/ci-inventory.json).

## Baseline evidence

On PR #79, a governance/documentation-oriented Source Convergence change triggered **25 workflows** on one head SHA. The set spanned historical labels from 8.8 through 8.18 plus current repository/runtime/cross-platform/provider gates.

The problem was not that every old assertion was useless. The problem was that many workflows rebuilt and re-served the same canonical artifact repeatedly, often rerunning inherited smokes already contained by later release-era gates.

## Classification rule

Every workflow receives one state:

- **current** — directly protects current repository/product/runtime truth;
- **provider-release** — provider packaging/deployment/Production policy;
- **compatibility-required-pending-equivalence-audit** — historical name but potentially unique current compatibility behavior;
- **superseded** — equivalent or stronger current proof is explicit and retirement evidence exists;
- **historical-only** — no current executable/compatibility role remains.

A version-shaped name is never sufficient evidence for deletion.

## Optimization 1 — stale PR head cancellation · verified

Implementation: `.github/workflows/axis-pr-run-convergence.yml` using official `actions/github-script@v9`.

It cancels only still-active `pull_request` runs that belong to the same PR/head branch but execute an older SHA than the current PR head. It does not query `push` runs and therefore does not target `main`/Production runs.

Proof:

- first run `32626897002` — **success**;
- cross-head run `32626975731` — **success**;
- stale active runs found: **10**;
- cancellation requests accepted: **8**;
- 2 finished before cancellation;
- latest head touched: **false**.

Coverage on the newest candidate is unchanged.

## Optimization 2 — Current Release Gate · verified

### What was audited

The automatic workflow chain from 8.14 through 8.18 contained seven separate workflow families:

1. AXIS 8.14 Evolution Objects;
2. AXIS 8.15 Media Evidence;
3. AXIS 8.15.1 Regression Seal;
4. AXIS 8.16 Capture + Comparative Evidence;
5. AXIS 8.17 Interaction Convergence;
6. AXIS 8.17.1 Source Media;
7. AXIS 8.18 Object + Route + Capture + Focus.

Each built the same current canonical artifact. Later workflows also reran lower-layer browser smokes. For example, 8.17 reran 8.16 + 8.15.1 + 8.15, while 8.17.1 reran 8.17 + 8.16. This created substantial duplicate build/browser setup work.

### Replacement

- `.github/workflows/axis-current-release-gate.yml`
- `scripts/axis-current-release-contract.mjs`

The semantic contract contains the union of the original manifest/ownership/current-runtime checks across 8.14→8.18.

The Current Release Gate performs one build per engine and runs the complete union of original user-visible smokes:

- 8.13.1 Evolution foundation;
- 8.14 Evolution Objects;
- 8.15 Media Evidence;
- 8.15.1 regression seal;
- 8.15.1 stable Evidence swap;
- watermark controls;
- 8.16 Capture + Comparative Evidence;
- 8.17 Interaction Convergence;
- 8.17.1 source-first media;
- 8.18 Object + Route + Capture + Focus.

### Exact equivalence proof

Candidate: `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59`

Workflow run: `32630099680`

- Chromium — **success**;
- iPhone-like WebKit — **success**;
- exact build — success in both engines;
- unified semantic contract — success in both engines;
- every listed smoke — success in both engines.

### Branch-protection constraint

`main` was audited at the AXIS 8.18 Production baseline and returned:

- protected: **false**;
- required status checks: **0**.

Therefore no required historical check-name contract blocks retirement of the seven version-shaped workflow files.

### Retirement

The seven workflow files are now classified **superseded** and are physically removed from the active workflow directory. Git history retains provenance; current coverage lives in a version-neutral replacement.

A new guard, `scripts/axis-ci-convergence-contract.mjs`, is executed by **AXIS Repository Contract**. It requires the replacement workflow/semantic contract and fails if any of the seven retired workflow files returns.

This is a CI-orchestration retirement only. Historical source/compiler/data compatibility is not inferred dead from this result.

### Expected runner effect

Starting from the observed 25-workflow baseline:

- +1 PR Run Convergence;
- +1 Current Release Gate;
- −7 superseded version workflows;

produces an estimated **20 automatically triggered workflow families** before later path scoping / compatibility convergence. More importantly, seven duplicated dual-engine build families become one dual-engine build family for the 8.14→8.18 semantic chain.

## Current CI groups after this retirement

### Current core

- AXIS Repository Contract
- AXIS Work Continuity Contract
- AXIS Runtime Gate
- AXIS Current Release Gate
- AXIS Cross-Platform Foundation Gate
- AXIS PR Run Convergence

### Provider/release

- AXIS EdgeOne Production Mirror

### Compatibility-required pending audit

- AXIS 8.13 Runtime Core
- AXIS 8.13 Shadow Runtime
- AXIS 8.13 Live Route
- AXIS 8.13 Settings Convergence
- 8.12 Field Hardening / Field Hotfix / Settings / Field Polish / Learning Simplify
- 8.10.3 Gate
- 8.8 Reminder Layout Gate
- Home Transition Gate
- Inherited Web Release Gate

## Why 8.13 is not retired yet

The 8.13 family contains responsibilities that are not merely version-shaped browser regression:

- pure Runtime invariants;
- Shadow Runtime invariants;
- exact build parity against the PR base SHA;
- authoritative transition observation in Chromium/WebKit;
- Continue + Live Route semantics;
- inline Settings ownership.

Those should converge into a future **Runtime Foundation / Deep Compatibility** layer only after their distinct responsibilities are mapped and preserved.

## Target CI architecture

### 1. Fast PR / repository gate

Cheap structural, syntax, governance, owner/retirement and focused checks.

### 2. Current Product Matrix

Version-neutral current semantics by surface.

### 3. Deep Compatibility / Runtime Foundation

Old-data, domain/runtime and inherited compatibility fixtures that genuinely remain unique.

### 4. Exact-SHA Production Seal

Provider artifact parity plus real Production browser verification. This layer is not weakened for speed.

## Next audit priority

1. decompose 8.13 pure/runtime/parity/browser responsibilities;
2. identify unique old-data value in 8.12 and older gates;
3. compare older Home/Watermark/interaction gates against Runtime Gate current matrix;
4. separate EdgeOne PR package contract from `main` Production deployment responsibilities;
5. add path scoping so docs/governance-only PRs do not trigger unrelated expensive behavioral gates.

The objective remains **less duplicate work, not less verification**.
