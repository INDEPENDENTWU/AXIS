# Current Release — AXIS 8.26.5

**Status: Production-sealed**

AXIS **8.26.5 — Recording Review Geometry Stability** is the current Production-sealed Web release.

## Exact sealed identity

- release PR: **#158**
- completed delivery branch: `fix/8265-recording-review-geometry`
- exact product/runtime merge: `5bf575730c5c8de542c603d40b0f8b780204a342`
- product version decision: **8.26.4 → 8.26.5 / bump / sequence 21 / bug-fix**
- governance closeout decision: **8.26.5 → 8.26.5 / confirm / sequence 22 / governance**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Production certification

The exact merged product/runtime SHA earned the complete governed Production chain:

- Vercel deployment `dpl_D4FC1ro8RZV6hGu1Kqm9LrJcqMRn` — READY / Production / exact source SHA
- Current Release Gate `37187139856` — success
- Deep Compatibility Gate `37187139889` — success
- Vercel Production Deployment Gate `37187159342` — success
- Vercel Public Production Alias Gate `37187159392` — success
- EdgeOne Production run `37187139894` — exact-prebuilt deploy, Vercel parity, Chromium + iPhone-like WebKit success
- EdgeOne deployment `dp7q7u41l4c8`
- `axis.juele.fun` Production run `37187139864` — exact parity, Chromium + iPhone-like WebKit success

All **28 / 28** post-merge/deployment workflow runs associated with the exact merged SHA completed successfully.

Runtime seal baseline: the exact merged SHA above is the durable AXIS 8.26.5 product/runtime seal snapshot. This is not a self-referential requirement: the governance closeout records certification already earned by that exact product/runtime artifact. Later governance-only commits or provider redeploys are not release authority unless a new governed product release earns a new exact certification chain.

## What 8.26.5 changes

The existing `#v82Estimate` row is structural in the Review shell from the first interactive frame. The existing v82 owner binds, updates and opens its existing estimate sheet, but no longer creates the row after a metric edit.

The physical contract remains strict: the first metric interaction must preserve DOM identity and x/y/width/height of both `#axisSetControls` and `#v82Estimate` within **0.5px**.

8.26.5 does **not** change metric truth, recorder semantics, Session, Encounter, Flow, Active state, persistence, media, network or AI ownership.

## Inherited provenance

AXIS 8.26.4 Active Rest Utility Rail behavior is inherited by this sealed artifact. AXIS 8.26.2, 8.26.3 and 8.26.4 remain merged-but-unsealed provenance rather than independent Production seals.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Next stage

The 8.26.x corrective line is closed. The next bounded product stage is **AXIS 8.27 — Reality Route**, the first productized Domain Runtime slice under **Intent → Execution → Evidence → Evolution**.

8.27 must preserve reusable Flow intent and immutable Encounter truth while deriving the current continuation route from actual execution plus temporary constraints. Its first user-visible operation is deterministic deferral of an unavailable current Flow item without rewriting the Flow definition or historical facts.
