# Current Release — AXIS 8.26.1

**Status: Production-sealed**

AXIS **8.26.1 — Active Rest State** is the current Production-sealed Web release. It is a bounded corrective release over AXIS 8.26 and changes only the existing v87 paused/rest presentation: more breathing room above the rest indicator, a clearer grouped `休息 + 計時` state, restrained tonal separation, and reduced-motion-safe entry motion.

## Exact sealed identity

- release PR: **#153**
- completed delivery branch: `fix/8261-active-rest-state`
- exact product/runtime merge: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- release graph: **89 deterministic top-level steps**
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Production certification

The exact merged product/runtime SHA above earned the complete governed Production chain:

- Vercel deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact source SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy, Vercel parity, Chromium and iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium and iPhone-like WebKit success

This exact merged SHA is the durable AXIS 8.26.1 product/runtime seal snapshot. Later governance-only commits or provider redeploys are not release authority unless a new governed product release earns a new exact certification chain.

## What 8.26.1 changes

The paused/rest state previously sat too close to the upper boundary and read like loose text rather than a distinct execution state. 8.26.1 keeps the same v87 pause/resume truth and timer, but presents the rest line as one restrained state capsule with explicit vertical breathing room and low-density accent treatment.

This patch does **not** change pause/resume semantics, elapsed/rest timing, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership. It does not add another Active owner.

## Inherited behavior

AXIS 8.26 remains authoritative for atomic record-save settlement, ongoing Flow direct Active admission, one-shot recorder ownership, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy. AXIS 8.26.1 inherits all of those behaviors unchanged.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Next stage

No 8.27 implementation branch is active. The next stage begins with one bounded real-use UX audit across Active, Flow and Evolution, then selects only the single highest-value product problem to solve.
