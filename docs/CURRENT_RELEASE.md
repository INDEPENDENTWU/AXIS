# Current Release — AXIS 8.26.1

**Status: corrective release candidate — Production certification pending**

AXIS **8.26.1 — Active Rest State** is a bounded corrective release over the fully Production-sealed AXIS 8.26 runtime. It changes only how the existing v87 paused/rest state is presented: more breathing room above the rest indicator, a clearer grouped `休息 + 計時` state, restrained tonal separation, and reduced-motion-safe entry motion.

## Exact candidate identity

- release PR: **#153**
- delivery branch: `fix/8261-active-rest-state`
- exact sealed starting `main`: `11e50c75efa032e7759f8047ef46d233c335bb66`
- version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **89 deterministic top-level steps**
- topology target: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.26 — Active Continuity** is the exact Production-sealed baseline for this candidate.

- sealed `main`: `11e50c75efa032e7759f8047ef46d233c335bb66`
- release PR: **#152**
- Vercel deployment: `dpl_Ap3Mx4GXLSWmR4oMBUCBe2dvCH9M` — READY / Production / exact source SHA
- Current Release Gate `34805575373` — success
- Deep Compatibility Gate `34805575408` — success
- Vercel Production Deployment Gate `34805721177` — success
- Vercel Public Production Alias Gate `34805721197` — success
- EdgeOne Production run `34805575432` — success
- `axis.juele.fun` Production run `34805575434` — success

Those records are the AXIS 8.26 seal snapshot. They remain historical evidence while 8.26.1 is a candidate.

## What 8.26.1 changes

The paused/rest state previously sat too close to the upper boundary and read like loose text rather than a distinct execution state. 8.26.1 keeps the same v87 pause/resume truth and timer, but presents the rest line as one restrained state capsule with explicit vertical breathing room and low-density accent treatment.

This patch does **not** change pause/resume semantics, elapsed/rest timing, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership. It does not add another Active owner.

## Inherited 8.26 behavior

AXIS 8.26 remains authoritative for atomic record-save settlement, ongoing Flow direct Active admission, one-shot recorder ownership, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy. AXIS 8.26.1 inherits all of those behaviors unchanged.

## Release-blocking proof

The exact PR #153 head must prove:

1. deterministic build identity is 8.26.1 with 89 top-level steps and canonical single-runtime topology;
2. the rest state is visibly separated from the upper edge and reads as one grouped state;
3. pause/resume and timer truth remain v87-owned and unchanged;
4. no horizontal overflow or Active-stage geometry regression is introduced;
5. reduced-motion disables the rest-state translation animation;
6. inherited 8.26 Active Continuity smoke remains green in Chromium and iPhone-like WebKit;
7. Version Authority, Repository/Production governance, Work Continuity, Current Release and Deep Compatibility gates all pass on one exact PR head.

After merge, the exact merged SHA must pass the existing Vercel → EdgeOne → `axis.juele.fun` Production chain before 8.26.1 is called Production-sealed.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.
