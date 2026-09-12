# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.24** · **release candidate; Production certification pending** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.24 — Active Stage Tactile Convergence** is the current release candidate. It is not Production-sealed until its exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

The last fully Production-sealed runtime is AXIS **8.23 — Replay Evidence Continuity** at runtime seal baseline `2418103c786f2d0865aece49d738e9ed9161ef55`:

- product behavior PR: **#146**; final certification/infrastructure merge: **#147**
- Vercel Production gate `34685665958` — success
- Vercel Public Production Alias Gate `34685665973` — success
- EdgeOne deployment `dp2z63vp6fz9`, verification run `34685651257` — success
- `axis.juele.fun` verification run `34685651239` — success
- Chromium and iPhone-like WebKit Production proofs — success

Those provider records remain the AXIS 8.23 seal snapshot while 8.24 is a candidate. They are not 8.24 evidence.

## What 8.24 changes

The Active surface now has one clearer presentation contract without changing training truth or action ownership:

- one primary set-progress truth: `第 n / total 组`, then `已完成 n / total 组`;
- time meta is limited to remaining/estimated time instead of repeating set count;
- press, rebound, completion and active-state motion provide bounded tactile feedback;
- the fixed Capture / Quick Record dock is an isolated opaque layer, so scrolling separators cannot paint through its controls;
- `prefers-reduced-motion` remains respected;
- existing v87 actions remain authoritative for pause, set completion, add-set and hold interactions.

AXIS 8.24 adds no Session, Encounter, storage, recorder or Active lifecycle owner. AXIS 8.23 Replay → Evidence continuity remains inherited and Production-sealed.

## Current engineering state

Active milestone: **AXIS 8.24 — Active Stage Tactile Convergence**

Governed target branch: `main`

Bounded delivery branch: `axis-824-active-stage-tactile` · PR **#148**.

Version decision: **8.23 → 8.24 / bump / sequence 9 / product-ui**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. The exact PR head must pass inherited contracts plus the 8.24 product smoke before merge; the exact merged main artifact must then pass Vercel, EdgeOne and `axis.juele.fun` Production certification.

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
