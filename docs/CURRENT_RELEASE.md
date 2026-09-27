# Current Release — AXIS 8.26.4

**Status: Release candidate** · last Production-sealed release: **AXIS 8.26.1**

AXIS **8.26.4 — Active Rest Utility Rail** is the current bounded corrective candidate. AXIS 8.26.3 merged to `main` at `ed418938c07383745d5485c2a46d37d20bfbebc7` but remains unsealed after real-device review exposed two final presentation defects: a plan-complete rest residue and vertical separation between paused `休息 mm:ss` and the existing `调整` action.

## Candidate identity

- candidate PR: **#157**
- delivery branch: `fix/8264-active-rest-utility-rail`
- merged-but-unsealed predecessor: **8.26.3** at `ed418938c07383745d5485c2a46d37d20bfbebc7`
- last sealed baseline release: **8.26.1**
- exact sealed baseline product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- sealed baseline PR: **#153**
- version decision: **8.26.3 → 8.26.4 / bump / sequence 20 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## What 8.26.4 changes

The canonical `#v87Rest` node moves into the existing `.axis821StageControls` grid; it does not become a new action or truth owner. During pause, the factual `休息 mm:ss` status occupies the left side of a fixed 32px secondary utility row, while the already-existing `#v87AdjustBtn` occupies the right side on the same horizontal axis.

The rest status has stronger secondary presence but no pill, frame, background, border, radius, shadow or entry animation. Running continues to have zero rest geometry. `plan-complete` now also forces zero rest geometry, preventing the empty framed/oval residue observed on a real iPhone.

Inherited Rest Speak keeps the same 32px utility geometry and its established explicit interaction. It does **not** change pause/resume semantics, elapsed/rest timing, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership.

## Sealed baseline certification

The exact AXIS 8.26.1 product/runtime evidence below remains the **runtime seal baseline** while 8.26.4 is a candidate. Candidate identity is **not a self-referential requirement** for inherited provider evidence: only a newly certified exact merged-main artifact can replace that durable baseline.

Until the exact 8.26.4 merged-main artifact completes certification, provider evidence remains explicitly attached to the exact fully certified AXIS 8.26.1 runtime:

- Vercel deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy, Vercel parity, Chromium and iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium and iPhone-like WebKit success

The sealed 8.26.1 SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` remains release authority until a later exact merged-main certification chain succeeds. `latestDeploymentIsAuthority` remains false.

## Completion condition

8.26.4 becomes Production-sealed only after exact PR #157 head validation, merge to `main`, exact merged-main Current Release + Deep Compatibility, fixed Vercel Production, exact-prebuilt EdgeOne Production, `axis.juele.fun` parity and Chromium + iPhone-like WebKit physical proof all succeed. Until then, 8.26.1 remains the Production baseline.
