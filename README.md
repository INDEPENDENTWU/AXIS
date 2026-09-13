# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.25.1** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.25.1 — Inline Set Morph** is the current release candidate. It replaces the 8.25 body-level full-screen Set Lock visual treatment with a stage-native completion moment that stays inside the existing Active fact row. The timer, primary/secondary controls, dock and navigation remain visually unobstructed; the existing stage geometry does not jump. Completion still happens only after the established v87 factual commit, with bounded haptic feedback and reduced-motion support.

The last fully Production-sealed runtime is AXIS **8.25 — Set Lock Interaction** at runtime seal baseline `e28f0411288e42fc68e70a79a4180a06f7d18ee3`:

- product/release PR: **#150**
- Vercel Production gate `34747540811` — success
- Vercel Public Production Alias Gate `34747540777` — success
- canonical Vercel deployment `dpl_HjrgujidrdBxDo9n243jnaoi4w5k` — READY / Production / exact main SHA
- EdgeOne deployment `dplc6t1yw7ho`, verification run `34747525787` — success
- `axis.juele.fun` verification run `34747525811` — exact parity plus Chromium and iPhone-like WebKit success
- combined Vercel + EdgeOne Production commit status — success

Those provider records remain the AXIS 8.25 seal snapshot while 8.25.1 is a candidate. They are not 8.25.1 evidence.

## What 8.25.1 changes

The completion interaction is no longer a layer placed over the interface. The existing v87 `completeSet()` action still commits `completedSets`, set timestamps and rest truth first. Only when the existing render boundary observes `done > prevDone` does the fact row temporarily morph from its normal status into a compact centered confirmation such as `01 / 04 · 已完成`, then return to the canonical next progress state.

The motion is distributed across elements that already exist instead of creating another visual plane: the fact row crossfades in place, the progress rail receives a short lock pulse, the primary button settles back from the press, and the clock receives a restrained micro-settle. The completion moment is pointer-inert, remains inside the fact-row bounds, preserves stage height, and has an explicit reduced-motion fade path. Supported devices retain the bounded two-beat haptic signature.

AXIS 8.24 tactile progress convergence, AXIS 8.24.1 fixed-dock occlusion and the 8.25 post-fact factual/haptic boundary remain inherited and Production-sealed. The 8.25 full-screen overlay is deliberately superseded. No Session, Encounter, storage, recorder, media, Active lifecycle, network or AI owner is added.

## Current engineering state

Active milestone: **AXIS 8.25.1 — Inline Set Morph**

Governed target branch: `main`

Bounded delivery branch: `axis-8251-inline-set-morph` · PR **#151**.

Version decision: **8.25 → 8.25.1 / bump / sequence 12 / product-ui**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. The exact PR head must prove the inline completion stays inside the existing fact row, does not intersect the clock or either Active control, does not change stage height, and passes Chromium plus iPhone-like WebKit before merge. The exact merged main artifact must then pass Vercel, EdgeOne and `axis.juele.fun` Production certification.

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
