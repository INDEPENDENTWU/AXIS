# Current Release — AXIS 8.26.1

**Status: Production-certified — AXIS 8.26.1 Active Rest State**

AXIS **8.26.1 — Active Rest State** is the current Production-sealed Web release. The exact product/runtime authority is the merged `main` commit from release PR **#153**:

`d187123dfdb2c0de0e5d202cf62bd6672586a8e7`

## Exact release identity

- release: **AXIS 8.26.1 — Active Rest State**
- release PR: **#153**
- exact Production runtime seal SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- deterministic graph: **89 top-level steps**
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**
- product version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**
- Production-evidence reconciliation decision: **8.26.1 → 8.26.1 / confirm / sequence 15 / governance**

The governance reconciliation that records this evidence is not a new product/runtime release. `productionRuntimeSha` remains the exact user-visible runtime SHA above and `latestDeploymentIsAuthority` remains false.

## Production certification evidence

### Vercel golden Production

- fixed Production URL: `https://axis-five-puce.vercel.app`
- deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9`
- source/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- state: **READY / production**
- Current Release Gate `35873718900` — **success**
- Deep Compatibility Gate `35873718880` — **success**
- Production Deployment Gate `35873771687` — **success**
- Public Production Alias Gate `35873771699` — **success**
- exact manifest / immutable asset parity: **success**
- current-release Chromium proof: **success**
- iPhone-like WebKit release compatibility proof: **success**

### EdgeOne exact-prebuilt mirror

- Production URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- project: `axisfitness-mirror` / `makers-bxiu1vmyd0ba`
- deployment: `dpgow7txb8og`
- verification run `35873718809` — **success**
- verification artifact `10756197062`
- artifact SHA-256: `04d6923b737ac5b4a1ed584b7e552534aac93bd9b5d01aa87f237a2bb392fbac`
- exact Vercel-golden artifact / API parity: **success**
- Chromium current-release flow: **success**
- iPhone-like WebKit current-release flow: **success**

### Governed custom domain

- URL: `https://axis.juele.fun`
- verification run `35873719011` — **success**
- verification artifact `10757291650`
- artifact SHA-256: `fb6fc74ccb26ec8961f8180c459365d1e6b917f3e664be578755373662bf3fb5`
- exact artifact parity: **success**
- Chromium current-release flow: **success**
- iPhone-like WebKit current-release flow: **success**

### Final provider status

For exact runtime SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`:

- Vercel: **success**
- EdgeOne Production: **success**
- governed custom domain: **success**
- unresolved release-blocking runtime certification failure: **none**

## What 8.26.1 changes

The existing v87 paused/rest state has deliberate upper breathing room and presents `休息 + 計時` as one restrained execution state rather than loose text. The treatment remains non-interactive, bounded and reduced-motion-safe.

This release does **not** change pause/resume semantics, rest-time calculation, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership. It does not add another Active owner.

## Inherited 8.26 behavior

AXIS 8.26 remains inherited and authoritative for atomic record-save settlement, ongoing Flow direct Active admission, one-shot canonical recorder ownership, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No user data migration, deletion or rewrite is part of this Production-evidence reconciliation.
