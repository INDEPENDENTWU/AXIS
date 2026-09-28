# Stage 01 — Release Integrity & Program Foundation

**Status:** active

**Program branch:** `program/performance-os-foundation`

**Base main SHA at program start:** `61ff52383eb8103cb3aeca985bfb9b1c50b04a23`

## Why Stage 01 exists

AXIS should not begin the next architectural/product expansion while release truth, product documentation and long-range product direction disagree.

Stage 01 has two responsibilities:

1. establish a factual release baseline and fail closed on incomplete Production certification;
2. make the long-range Performance OS direction explicit and repository-governed before new capability work begins.

## Observed baseline

At the start of this stage, `main` is exact SHA `61ff52383eb8103cb3aeca985bfb9b1c50b04a23`, the merge commit for **AXIS 8.26.4 — Active Rest Utility Rail**.

The merge message records that the PR candidate passed its pre-merge Repository, Version Authority, Work Continuity, Current Release, Deep Compatibility, Runtime, Universal Practice Object, Chromium and iPhone-like WebKit gates.

However, post-merge Production certification is **not complete**. The Vercel-triggered **AXIS Production Deployment Gate** run `36333871883` failed. Its exact-manifest and immutable-asset steps passed; the failure occurred in `Real Chromium inherited product foundation against fixed Production URL`. The subsequent current-release flow step was skipped.

Therefore:

- 8.26.4 is merged provenance;
- 8.26.4 must not be described as Production-sealed from the currently observed evidence;
- the last repository-declared fully sealed baseline remains 8.26.1 until a later exact artifact completes the required certification chain;
- the failed Production gate should be understood before another expensive rerun is attempted.

## Stage 01 work completed on this branch

The program foundation now contains:

- `governance/product-program.json` — machine-readable north star, non-negotiables, stages, commercial sequence and non-goals;
- `docs/PRODUCT_PROGRAM.md` — human-readable product/engineering program;
- `docs/CAPABILITY_MANIFEST.md` — current/foundation/planned capability truth by durable domain rather than release number;
- `docs/DESIGN_CONTRACT.md` — semantic UI and geometry-as-state rules;
- `docs/ENTERPRISE_BOUNDARIES.md` — organization, tenancy, authority, audit, Evidence and claim boundaries;
- a converged `docs/PRODUCT.md` that no longer describes 8.12 as the current product.

These documents define direction. They do not relabel unverified features as shipped product.

## Remaining Stage 01 engineering work

### 1. Diagnose the failed fixed-Production foundation gate

Do not blindly rerun the workflow. Identify which command in the inherited foundation group failed and determine whether the cause is:

- a deterministic regression in the exact 8.26.4 artifact;
- a production-only environment/timing difference;
- a stale test contract;
- a non-deterministic test;
- a provider/network assumption that violates fail-open behavior.

Any fix must preserve the exact source/deployment identity model rather than weakening the gate.

### 2. Reconcile release documentation after the failure is understood

`README.md`, `docs/CURRENT_RELEASE.md`, `docs/CURRENT_WORK.md` and `governance/project-state.json` must describe one consistent state:

- merged candidate SHA;
- last sealed SHA;
- failed/passed certification evidence;
- exact next action;
- no premature Production-sealed claim.

### 3. Establish capability-oriented work tracking

Stage 02 should not continue the pattern of creating permanent version-specific layers for every correction. Before the next product slice, identify the current source/test owners for:

- Object/metric recording;
- Flow/Protocol intent;
- Active Runtime;
- Encounter/history;
- Evidence/media;
- Evolution/replay;
- AI/provider boundary;
- sync/platform boundary;
- release/build governance.

This map becomes the input to source convergence.

### 4. Keep CI Actions-sparing

Until the current usage constraint changes, Stage 01 uses this sequence:

```text
repository/static inspection
→ deterministic local/static contracts where available
→ batched branch changes
→ one candidate validation boundary
→ required browser/Production gates only
```

No repeated workflow run should be used as a diagnostic technique.

## Exit criteria

Stage 01 is complete only when all of the following are true:

- the exact status of 8.26.4 is unambiguous;
- the failed Production gate has a root cause or an explicit evidence-backed hold decision;
- release/governance documentation agrees with the observed state;
- the new product program is accepted into repository governance;
- the capability manifest is the basis for new work;
- future product changes can be assigned to a durable capability owner rather than a new historical patch layer.

## Next stage

**Stage 02 — Capability & Source Convergence** begins only after this release-integrity boundary is satisfied. It will convert the existing historical/version-shaped implementation map into durable capability owners and a retirement plan without a big-bang rewrite.
