# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.24.1** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.24.1 — Dock Occlusion Hotfix** is the current release candidate. It fixes the still-visible thin dark separator at the fixed Capture / Quick Record dock by correcting the actual compositing boundary rather than hiding legitimate scrolling separators. It is not Production-sealed until its exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

The last fully Production-sealed runtime is AXIS **8.24 — Active Stage Tactile Convergence** at runtime seal baseline `321647b9aaca783b7f6ba99ec66616941208c698`:

- product/release PR: **#148**
- Vercel Production gate `34700744685` — success
- Vercel Public Production Alias Gate `34700744673` — success
- EdgeOne deployment `dp7e6rlpyczu`, verification run `34700727554` — success
- `axis.juele.fun` verification run `34700727551` — success
- Chromium and iPhone-like WebKit Production proofs — success

Those provider records remain the AXIS 8.24 seal snapshot while 8.24.1 is a candidate. They are not 8.24.1 evidence.

## What 8.24.1 changes

The 8.24 dock-isolation intent was correct, but two paint details could still expose a 1px scrolling separator: `contain: paint` clipped the negative-top underlay, and the underlay began transparent. 8.24.1 therefore makes the fixed dock and its overscan curtain fully opaque, removes paint containment from that boundary, removes the translucent gradient window, and keeps Capture / Quick Record controls explicitly above the occlusion plane.

The change is presentation-only. Existing v87 pause/set/add/hold and capture/quick-record actions remain authoritative. No Session, Encounter, storage, recorder, media, Active lifecycle, network or AI owner is added.

## Current engineering state

Active milestone: **AXIS 8.24.1 — Dock Occlusion Hotfix**

Governed target branch: `main`

Bounded delivery branch: `hotfix/8241-dock-occlusion` · PR **#149**.

Version decision: **8.24 → 8.24.1 / bump / sequence 10 / product-ui**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. The exact PR head must pass inherited contracts plus the 8.24.1 computed-style occlusion smoke in Chromium and iPhone-like WebKit before merge; the exact merged main artifact must then pass Vercel, EdgeOne and `axis.juele.fun` Production certification.

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
