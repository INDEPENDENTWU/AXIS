# Current Work

## Production baseline at start of this work

The current merged main baseline is `a22641616097d6ef65c1850269d4c4573999a93d`, AXIS **8.21**, from PR #105 (`AXIS 8.21 — deterministic recording layout settle`).

The deployment itself is healthy and exact: fixed Vercel Production serves the deterministic artifact for `a22641616097d6ef65c1850269d4c4573999a93d`, the release manifest reports AXIS 8.21 and `canonical-single-runtime`, and immutable core/CSS asset parity was verified by the Production gate. Vercel therefore is not the current blocker.

However, merged main is **not yet Production-certified**. `AXIS Production Deployment Gate` run `33183992501` failed its real-Chromium inherited product foundation after exact Production parity had already passed. The failure is a real first-interaction geometry defect, so this work remains a bounded 8.21 Production hotfix and no broader cleanup may ride with it.

Product/runtime ownership remains unchanged: Object/Session/Encounter truth is app-owned, recording stays on the canonical app/v61 route, ongoing execution stays v82/v87-owned, and Flow remains sequence/context rather than a second Active owner. Public identity remains **8.21**.

## Active change

**AXIS 8.21 — Production recording prepaint geometry stabilization**

- active branch: `fix/821-recording-layout-prepaint`
- base main SHA: `a22641616097d6ef65c1850269d4c4573999a93d`
- intended public identity change: **none; remains 8.21**
- intended factual ownership change: **none**
- product source touched: `v874-professional.js`
- governance handoff touched: `docs/CURRENT_WORK.md`

### Production evidence

The failing Production smoke is `scripts/axis-completion-smoke.mjs` with:

```text
AssertionError: weight step shifted control geometry
```

The strict existing invariant allows no more than `0.5px` movement across the first recording value interaction. Production diagnostics measured:

```text
#axisSetControls
before y = 574.25
 after y = 579.25
 delta y = +5px
```

The upstream cause was also physically captured:

```text
before: #musclePanel = "musclePanel v875Tidy"       · height 56px
after:  #musclePanel = "musclePanel v875Tidy v874Tidy" · height 61px
```

The first weight interaction was therefore exposing a late presentation settle. The recording value itself was correct; the already-owned v874 presentation class was simply reaching its final geometry only after the first visible interaction.

### Source-owner correction

The existing v874 hook already installs its stylesheet and runs the idempotent `tidyMusclePanel()` owner. This hotfix adds one next-frame convergence immediately after the v874 stylesheet is installed:

```text
install v874 stylesheet
  → requestAnimationFrame(tidyMusclePanel)
  → first user interaction occurs against final v874 geometry
```

This does **not** create a new presentation owner. It reuses the same `tidyMusclePanel()` function, does not mutate factual state, and does not change recording, persistence, Encounter, Active, Flow, media or navigation ownership.

No smoke delay, tolerance increase, retry or assertion weakening is allowed. The existing `≤0.5px` geometry requirement remains unchanged.

## Validation required before merge

The PR is mergeable only when the exact head proves all of the following without weakening inherited assertions:

1. deterministic release build remains AXIS 8.21 / `canonical-single-runtime`;
2. the existing Chromium completion smoke passes its original first-weight-step `≤0.5px` geometry assertion;
3. the dedicated 8.21 recording-geometry diagnostic remains green;
4. iPhone-like WebKit inherited recording flows remain green;
5. Current Release Chromium + WebKit pass through the full 8.21 executable Object and Flow paths;
6. Runtime and Runtime Foundation gates pass;
7. Universal Practice Object and exhaustive Object capability contracts pass;
8. Deep Compatibility, Cross-Platform Foundation, Repository, Work Continuity and PR Run Convergence gates pass;
9. no second recorder, Encounter writer, Active owner, Flow owner, persistence owner or presentation owner is introduced.

The governing regression invariant remains:

```text
first recording value interaction
  must not rebuild the active row
  must not move canonical recording controls by > 0.5 px
```

## Production certification after merge

PR CI is necessary but not sufficient because PR #105 was green before the defect was exposed against fixed Production.

After merge, completion requires all of the following on the exact merged main SHA:

1. Vercel Production deployment is `READY` and serves the exact merged SHA;
2. Production manifest and immutable assets match the deterministic local build;
3. `AXIS Production Deployment Gate` passes real Chromium inherited product foundation **and** current release flow against `https://axis-five-puce.vercel.app`;
4. deployment-triggered 8.12.x compatibility Production gate remains green;
5. EdgeOne Production mirror reaches success for the same governed release state;
6. main Current Release / Runtime / compatibility governance remains green.

Only after those checks pass is this 8.21 Production geometry incident considered closed.

## Next planned stage

After Production certification, resume the broader evidence-preserving architecture cleanup already planned: progressively move runtime behavior out of historical `prepare-*` / `postbuild-*` mutation stages into explicit canonical source owners, one bounded PR at a time. No broad refactor is allowed inside this hotfix.

Chat history is not authoritative project memory. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
