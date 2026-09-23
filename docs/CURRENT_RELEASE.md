# Current Release — AXIS 8.26.2

**Status: Release candidate** · last Production-sealed release: **AXIS 8.26.1**

AXIS **8.26.2 — Active Rest Selector Binding** is the current bounded corrective candidate. A real-use audit found that the 8.26.1 rest-state presentation targeted `.v87-restline`, while the canonical integrated Active Home stage actually renders the existing v87-owned rest node as `.v87Rest`. The intended breathing room, grouped rest state and reduced-motion treatment therefore did not bind to the live node.

## Candidate identity

- candidate PR: **#155**
- delivery branch: `fix/8262-active-rest-selector`
- sealed baseline release: **8.26.1**
- exact sealed baseline product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- sealed baseline PR: **#153**
- version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## What 8.26.2 changes

The already-designed rest-state presentation now targets the canonical `.v87Rest` node that exists in the Active stage. The candidate adds physical Chromium and iPhone-like WebKit proof for the actual computed spacing, grouped tonal surface, transition and reduced-motion behavior.

It does **not** change pause/resume semantics, elapsed/rest timing, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership. Existing v87 remains the pause/resume and timer truth owner.

## Sealed baseline certification

Until the exact 8.26.2 merged-main artifact completes certification, all provider evidence below remains explicitly **8.26.1** evidence:

- Vercel deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact sealed source SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy, Vercel parity, Chromium and iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium and iPhone-like WebKit success

The sealed 8.26.1 SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` remains release authority until 8.26.2 earns its own exact merged-main certification chain. `latestDeploymentIsAuthority` remains false.

## Inherited behavior

AXIS 8.26.1 remains the sealed rest-state presentation boundary. AXIS 8.26 remains authoritative for atomic record-save settlement, ongoing Flow direct Active admission, one-shot recorder ownership, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy. 8.26.2 reuses these owners and changes only selector binding.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Completion condition

8.26.2 becomes Production-sealed only after exact PR #155 head validation, merge to `main`, exact merged-main Current Release + Deep Compatibility, fixed Vercel Production, exact-prebuilt EdgeOne Production, `axis.juele.fun` parity and Chromium + iPhone-like WebKit physical proof all succeed. Until then, 8.26.1 remains the Production baseline.
