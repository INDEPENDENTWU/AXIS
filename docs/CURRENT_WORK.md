# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- `main` baseline: `4b4bae03b305b3ff6d5778ddde99d92532daba96`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Existing workout/training stores, equipment/gallery media, Group Plan, recording, Settings, Learning, Cloud/AI and report ownership are inherited unchanged.

## Active change

**AXIS 8.12.3 cold-start Home semantic first-paint hotfix.**

This work fixes one presentation defect only: after a cache-busted deployment, the static source Home could briefly paint the obsolete `尚未开始 / 开始训练` idle state before the canonical runtime read local state and rendered the real Home.

The fix uses the existing canonical bootstrap boundary `data-axis-core-ready="1"`:

- before core-ready, `#idleHome` and `#activeHome` keep their layout geometry but are `visibility:hidden` and non-interactive;
- `app.js` remains the sole Home state owner and is not changed;
- after its synchronous local-state render completes, the existing bootstrap sets `data-axis-core-ready="1"` and the semantic Home is revealed normally;
- no loading screen, splash, animation, timer, storage key, Home state, render owner or business logic is added.

Explicitly unchanged: public version, Home calculations, training state/data, equipment/gallery, picker lifecycle, Group Plan, camera/watermark, Settings, Training Report, Learning, Cloud/AI, Runtime/Live Route and deployment topology.

## Validation for this work

Before merge:

- deliberately hold the cache-busted canonical runtime request during first navigation;
- preload a persisted active session so the static idle copy is objectively incorrect;
- sample the held cold-start frame and require both legacy Home semantic surfaces, including `开始训练` / `尚未开始`, to remain invisible;
- release the runtime, require the existing `data-axis-core-ready="1"` boundary, and verify the active state resolves correctly with no persistent first-paint mask;
- run the same cold-start semantic regression in Chromium and iPhone WebKit;
- retain all inherited Runtime, Home transition, field, Settings, Group Plan and repository gates.

No failed or cancelled required gate is treated as deployable evidence.

## Next planned stage

When the exact PR #51 head is green, squash-merge it into `main`. Then verify Vercel deploys that exact merge SHA to the existing AXIS Production project.

Production verification must confirm:

- deployment state is READY for the exact merge SHA;
- `https://axis-five-puce.vercel.app` returns HTTP 200 and remains AXIS 8.12.3 / `canonical-single-runtime`;
- the built stylesheet contains the pre-core Home semantic gate;
- runtime errors remain clear.

No other product optimization is part of this hotfix.
