# AXIS Engineering Handoff

## Current Production release

AXIS **8.26.1 — Active Rest State** is fully Production-sealed.

- release PR: **#153**
- completed delivery branch: `fix/8261-active-rest-state`
- exact sealed product/runtime merge: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- release graph: **89 deterministic top-level steps**

Exact Production evidence:

- canonical Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact product/runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy + Vercel parity + Chromium/WebKit success
- governed custom-domain run `35873719011` — exact parity + Chromium/WebKit success

The exact merged SHA above is the product/runtime seal authority. `latestDeploymentIsAuthority` remains false, so later governance-only commits or provider redeploys do not silently redefine the sealed runtime.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Future work may not migrate, clear, duplicate or rewrite them without an explicit governed migration.

## AXIS 8.26.1 Active Rest State

This release addressed one Active-state presentation defect: the paused/rest state sat too close to the upper boundary and read as loose text instead of a deliberate execution state.

The existing v87 paused/rest line now receives deliberate upper breathing room and becomes one restrained `休息 + 計時` state capsule with low-density accent tone. It stays within the current Active stage and does not create another card, modal, overlay or action surface.

A short entry transition is bounded presentation feedback. Under `prefers-reduced-motion`, translation motion is disabled.

### Truth boundary

The existing v87 pause/resume state and timer remain authoritative. 8.26.1 does not change how pause starts, how resume works, how rest time is calculated, how sets complete, how Flow advances, or how Session/Encounter facts are stored.

No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner was introduced.

## Inherited 8.26 behavior

AXIS 8.26 remains Production-sealed and authoritative for atomic save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy. AXIS 8.26.1 inherits these capabilities without re-owning them.

## Next engineering rule

No 8.27 implementation is currently authorized by this handoff. Start with one bounded real-use UX audit across Active, Flow and Evolution. Choose one concrete, high-value user problem; only then create the next governed product slice.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain outside this completed bounded stage unless separately governed.
