# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.26.1 — Active Rest State** is the current bounded corrective Web release candidate. AXIS **8.26 — Active Continuity** is the fully Production-sealed baseline.

Candidate delivery:

- release PR: **#153**
- exact sealed starting `main`: `11e50c75efa032e7759f8047ef46d233c335bb66`
- bounded branch: `fix/8261-active-rest-state`
- version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **89 deterministic top-level steps**

The exact AXIS 8.26 Production seal inherited by this candidate is:

- release PR: **#152**
- runtime seal baseline SHA: `11e50c75efa032e7759f8047ef46d233c335bb66`
- canonical Vercel deployment `dpl_Ap3Mx4GXLSWmR4oMBUCBe2dvCH9M` — READY / Production / exact main SHA
- Current Release Gate `34805575373` — success
- Deep Compatibility Gate `34805575408` — success
- Vercel Production Deployment Gate `34805721177` — success
- Vercel Public Production Alias Gate `34805721197` — success
- EdgeOne Production run `34805575432` — success
- governed custom-domain run `34805575434` — success

Those provider records are the 8.26 runtime seal snapshot and must not be relabeled as 8.26.1 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.26.1 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.26.1 Active Rest State

This corrective release addresses one real Active-state presentation defect: the paused/rest state sits too close to the upper boundary and reads as loose text instead of a deliberate execution state.

### Presentation correction

The existing v87 paused/rest line receives deliberate upper breathing room and becomes one restrained `休息 + 計時` state capsule with low-density accent tone. It stays within the current Active stage and does not create another card, modal, overlay or action surface.

A short entry transition is allowed only as bounded presentation feedback. Under `prefers-reduced-motion`, the translation animation is disabled.

### Truth boundary

The existing v87 pause/resume state and timer remain authoritative. 8.26.1 does not change how pause starts, how resume works, how rest time is calculated, how sets complete, how Flow advances, or how Session/Encounter facts are stored.

No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner is introduced.

## Inherited 8.26 behavior

AXIS 8.26 is Production-sealed and remains authoritative for atomic save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy. AXIS 8.26.1 inherits these capabilities without re-owning them.

## Certification rule

One exact PR #153 head must pass all inherited contracts plus the 8.26.1 physical proof in Chromium and iPhone-like WebKit. The release-blocking proof must verify:

1. deterministic build identity is 8.26.1 with 89 top-level steps, one initial JS and zero dynamic runtime chunks;
2. pause reaches the established rest state and the rest line has deliberate upper clearance and grouped visual hierarchy;
3. pause/resume and timer truth remain unchanged and v87-owned;
4. no viewport overflow, unsafe control overlap or Active-stage geometry regression is introduced;
5. reduced-motion disables the rest-state translation animation;
6. inherited 8.26 Active Continuity physical proof remains green;
7. Version Authority, Repository/Production governance, Work Continuity, Current Release, Deep Compatibility and inherited gates all settle green.

After merge, the exact merged `main` SHA must pass fixed Vercel Production, exact-prebuilt EdgeOne Production and `https://axis.juele.fun` parity/behavior proof. Only then may AXIS 8.26.1 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.
