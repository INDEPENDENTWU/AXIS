# Current Release — AXIS 8.26.3

**Status: Release candidate** · last Production-sealed release: **AXIS 8.26.1**

AXIS **8.26.3 — Active Rest Convergence** is the current bounded corrective candidate. AXIS 8.26.2 was merged to `main` at `7662d857fd5d442e3a7f775a430f0d4d8479bece`, but remained unsealed after physical compatibility proof exposed a Rest Speak geometry regression. 8.26.3 retains the canonical `.v87Rest` selector correction and converges the paused-state geometry without changing factual ownership.

## Candidate identity

- candidate PR: **#156**
- delivery branch: `fix/8262-rest-convergence`
- merged-but-unsealed predecessor: **8.26.2** at `7662d857fd5d442e3a7f775a430f0d4d8479bece`
- last sealed baseline release: **8.26.1**
- exact sealed baseline product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- sealed baseline PR: **#153**
- version decision: **8.26.2 → 8.26.3 / bump / sequence 19 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## What 8.26.3 changes

Running Active removes `.v87Rest` from layout entirely. Paused Active renders exactly one factual v87-owned rest rail at 32px height. The duplicate `.v87State` paused label stays hidden. The rail has no pill background, border, shadow or component-entry animation.

Inherited Rest Speak uses the same 32px rail, so enabling or disabling its two-line learning content cannot move the Active stage. Normal paused rest stays pointer-inert; `.v87Rest.v89Speak` preserves the existing explicit Rest Speak interaction.

It does **not** change pause/resume semantics, elapsed/rest timing, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership.

## Sealed baseline certification

The certification model keeps an exact runtime seal baseline separate from later candidate/governance activity. Provider evidence remains attached to the exact already-certified runtime until the new merged-main artifact earns its own certification.

Until the exact 8.26.3 merged-main artifact completes certification, all provider evidence below remains explicitly **8.26.1** evidence:

- Vercel deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact sealed source SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy, Vercel parity, Chromium and iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium and iPhone-like WebKit success

The sealed 8.26.1 SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` remains release authority until 8.26.3 earns its own exact merged-main certification chain. `latestDeploymentIsAuthority` remains false.

## Inherited behavior

AXIS 8.26.2 remains merged-but-unsealed selector-binding provenance. AXIS 8.26.1 remains the last sealed rest-state boundary. AXIS 8.26 remains authoritative for atomic record-save settlement, ongoing Flow direct Active admission, one-shot recorder ownership, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Completion condition

8.26.3 becomes Production-sealed only after exact PR #156 head validation, merge to `main`, exact merged-main Current Release + Deep Compatibility, fixed Vercel Production, exact-prebuilt EdgeOne Production, `axis.juele.fun` parity and Chromium + iPhone-like WebKit physical proof all succeed. Until then, 8.26.1 remains the Production baseline.
