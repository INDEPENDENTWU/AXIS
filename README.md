# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.25** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.25 — Set Lock Interaction** is the current release candidate. It turns a successful `完成一组` action into a large, tactile post-fact moment: the completed set number lands at screen scale, clamp marks converge, a broad pressure halo and stage recoil make the event physically legible, and the number then collapses into the existing set-progress position. It is not Production-sealed until its exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

The last fully Production-sealed runtime is AXIS **8.24.1 — Dock Occlusion Hotfix** at runtime seal baseline `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`:

- product/release PR: **#149**
- Vercel Production gate `34744363573` — success
- Vercel Public Production Alias Gate `34744363564` — success
- canonical Vercel deployment `dpl_5P7gF35XDzSAkHoLwmpJ3PQJsT2w` — READY / Production / exact main SHA
- EdgeOne deployment `dpp8w54o5vox`, verification run `34744342607` — success
- `axis.juele.fun` verification run `34744342633` — success
- Chromium and iPhone-like WebKit Production proofs — success

Those provider records remain the AXIS 8.24.1 seal snapshot while 8.25 is a candidate. They are not 8.25 evidence.

## What 8.25 changes

Set Lock is deliberately not another completion owner. The existing v87 `completeSet()` action still commits `completedSets`, set timestamps and rest truth first. Only when the existing render boundary observes `done > prevDone` does 8.25 present the lock moment. The overlay accepts no pointer input, cannot write state, cannot stack a second factual completion, and has an explicit reduced-motion path.

The visual sequence is short and consequential rather than decorative: stronger physical button travel → large completed-set numeral → side clamps and pressure halo → subtle Active-stage recoil → collapse into the canonical set-progress text. Supported devices receive a bounded two-beat haptic signature, with a slightly heavier final-set pattern. There is no confetti, badge, score or parallel gamification model.

AXIS 8.24 tactile progress convergence and AXIS 8.24.1 fixed-dock occlusion remain inherited and Production-sealed. No Session, Encounter, storage, recorder, media, Active lifecycle, network or AI owner is added.

## Current engineering state

Active milestone: **AXIS 8.25 — Set Lock Interaction**

Governed target branch: `main`

Bounded delivery branch: `axis-825-set-lock` · PR **#150**.

Version decision: **8.24.1 → 8.25 / bump / sequence 11 / product-ui**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. The exact PR head must pass inherited contracts plus the chained Set Lock physical smoke in Chromium and iPhone-like WebKit before merge; the exact merged main artifact must then pass Vercel, EdgeOne and `axis.juele.fun` Production certification.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice remains usable without account, network or model calls.

**One action, one owner.** Derived presentation can delegate but cannot create a second factual writer.

**Evidence before interpretation.** AXIS may reveal recorded change but does not manufacture progress scores as fact.

**Quiet interfaces.** Better intelligence should remove ambiguity and taps rather than add setup burden.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Existing portable backup compatibility remains protected.

Release build:

```bash
node build-release.mjs
```

Vercel builds `main`; EdgeOne mirrors the exact verified prebuilt artifact. Chromium and iPhone-like WebKit remain release-blocking where the Production gate requires them.
