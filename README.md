# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.1** · **Production-sealed** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.1 — Active Rest State** is Production-sealed at exact product/runtime merge `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153**.

It fixes one Active-state presentation problem: the paused/rest line receives deliberate upper breathing room and `休息 + 計時` reads as one restrained state instead of loose text. Existing v87 pause/resume and timer truth are unchanged.

Exact Production evidence:

- Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact merged product-runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium + iPhone-like WebKit success

`latestDeploymentIsAuthority` remains false: later governance-only commits or provider redeploys do not replace the exact sealed product/runtime SHA above.

## What 8.26.1 changes

The existing paused/rest presentation now has explicit vertical clearance from the stage boundary, low-density accent grouping and a short state-entry transition. The transition is disabled under reduced motion.

The patch does not change pause/resume semantics, rest-time calculation, set completion, Flow, Session, Encounter, recorder, storage, media, network or AI ownership. It does not create another Active owner or interactive surface.

AXIS 8.26 remains inherited unchanged: atomic record-save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy remain authoritative.

## Current engineering state

Active milestone: **AXIS 8.26.1 — Active Rest State**

Governed target branch: `main`

Completed bounded delivery branch: `fix/8261-active-rest-state` · PR **#153**.

Version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks, with **89 deterministic top-level steps**. No 8.27 branch or new factual owner is active; the next work starts with one bounded real-use UX audit.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice remains usable without account, network or model calls.

**One action, one owner.** Derived presentation can delegate but cannot create a second factual writer.

**Evidence before interpretation.** AXIS may reveal recorded change but does not manufacture progress scores as fact.

**Quiet interfaces.** Better intelligence should remove ambiguity and taps rather than add setup burden.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

Release build:

```bash
node build-release.mjs
```
