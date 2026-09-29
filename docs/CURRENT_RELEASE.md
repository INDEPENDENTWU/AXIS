# Current Release — AXIS 8.26.5

**Status: Release candidate** · last Production-sealed release: **AXIS 8.26.1**

AXIS **8.26.5 — Recording Review Geometry Stability** is the current bounded corrective candidate. AXIS 8.26.4 merged to `main` at `61ff52383eb8103cb3aeca985bfb9b1c50b04a23`, but fixed Vercel Production run **36333871883** exposed a real inherited Review geometry regression: the existing `#v82Estimate` row appeared only after the first metric interaction, increasing the bottom-anchored Review height and moving `#axisSetControls` upward by **22.75px**.

## Candidate identity

- candidate PR: **#158**
- delivery branch: `fix/8265-recording-review-geometry`
- merged-but-unsealed predecessor: **8.26.4** at `61ff52383eb8103cb3aeca985bfb9b1c50b04a23`
- failed 8.26.4 fixed-Production gate: **36333871883**
- last sealed baseline release: **8.26.1**
- exact sealed baseline product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- sealed baseline PR: **#153**
- version decision: **8.26.4 → 8.26.5 / bump / sequence 21 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## What 8.26.5 changes

The estimate row is no longer a lazily inserted element. `#v82Estimate` exists structurally in the Review shell from the first interactive frame with the same geometry that v82 already presents: **54px height + 8px top spacing**. The existing v82 estimate owner binds, updates and opens its existing estimate sheet, but cannot create the row after a metric edit.

The physical contract remains strict: the first weight edit must preserve the DOM identity and x/y/width/height of both `#axisSetControls` and `#v82Estimate` within **0.5px**. No geometry tolerance is widened.

8.26.5 does **not** change metric truth, recorder semantics, Session, Encounter, Flow, Active state, persistence, media, network or AI ownership. The 8.26.4 Active Rest Utility Rail remains inherited unchanged.

## Sealed baseline certification

The exact AXIS 8.26.1 product/runtime evidence remains the runtime seal baseline while 8.26.5 is a candidate. AXIS 8.26.4 is merged-but-unsealed provenance because its fixed Vercel Production Chromium foundation proof failed after deployment. Candidate builds may not relabel provider evidence.

Sealed 8.26.1 evidence remains:

- Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium + iPhone-like WebKit success

`latestDeploymentIsAuthority` remains false.

## Completion condition

8.26.5 becomes Production-sealed only after exact PR #158 head validation, merge to `main`, exact merged-main Current Release + Deep Compatibility, fixed Vercel Production, exact-prebuilt EdgeOne Production, `axis.juele.fun` parity and Chromium + iPhone-like WebKit physical proof all succeed. Until then, 8.26.1 remains the Production baseline.
