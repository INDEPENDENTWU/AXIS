# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.5** · **Release candidate** · last sealed **8.26.1** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.5 — Recording Review Geometry Stability** is the current bounded corrective candidate on PR **#158**, branch `fix/8265-recording-review-geometry`.

AXIS **8.26.4** merged to `main` at `61ff52383eb8103cb3aeca985bfb9b1c50b04a23` from PR **#157**, but fixed Vercel Production run **36333871883** exposed a real inherited Review geometry regression: the first weight edit caused the lazily inserted `#v82Estimate` row to move existing recording controls upward by **22.75px**. 8.26.4 therefore remains merged-but-unsealed provenance.

AXIS **8.26.1** remains the exact Production-sealed baseline at product/runtime merge `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153** until an exact later merged-main artifact completes the full certification chain. `latestDeploymentIsAuthority` remains false.

Sealed 8.26.1 Production evidence remains:

- Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact sealed product-runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium + iPhone-like WebKit success

## What 8.26.5 changes

The existing `#v82Estimate` row is now structural in the Review shell before Review becomes interactive. v82 still owns its value and existing estimate-sheet action, but it no longer inserts the row after the first metric edit. The first editable frame therefore has the same 54px + 8px estimate geometry as every later frame.

The strict physical contract remains unchanged: first metric interaction must preserve both `#axisSetControls` and `#v82Estimate` DOM identity and geometry within **0.5px**. No tolerance is widened.

The patch does **not** change metric truth, recorder semantics, Session, Encounter, Flow, Active, persistence, media, network or AI ownership. AXIS 8.26.4 Active Rest Utility Rail is inherited unchanged.

## Current engineering state

Active milestone: **AXIS 8.26.5 — Recording Review Geometry Stability**

Governed target branch: `main`

Bounded delivery branch: `fix/8265-recording-review-geometry` · PR **#158**.

Version decision: **8.26.4 → 8.26.5 / bump / sequence 21 / bug-fix**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks.

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
