# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.2** · **Release candidate** · last sealed **8.26.1** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.2 — Active Rest Selector Binding** is a bounded corrective candidate on PR **#155**. The real-use audit found that AXIS 8.26.1 authored its rest-state presentation against `.v87-restline`, while the canonical integrated Active stage actually renders the existing v87-owned node as `.v87Rest`. The intended spacing, tonal grouping and reduced-motion treatment therefore did not bind to the shipped node.

AXIS **8.26.1** remains the exact Production-sealed baseline at product/runtime merge `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153** until the exact 8.26.2 merged-main artifact completes the full certification chain.

Sealed 8.26.1 Production evidence remains:

- Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact sealed product-runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium + iPhone-like WebKit success

`latestDeploymentIsAuthority` remains false: candidate builds, governance-only commits or provider redeploys do not replace the sealed product/runtime SHA above.

## What 8.26.2 changes

The existing 8.26.1 rest presentation is now bound to the canonical `.v87Rest` node that the Active Home stage actually renders. The same intended breathing room, restrained pill/tonal grouping and reduced-motion behavior can therefore become physically visible in the product.

The patch does **not** change pause/resume semantics, rest-time calculation, set completion, Flow, Session, Encounter, recorder, storage, media, network or AI ownership. It does not create another Active owner or interactive surface.

AXIS 8.26.1 remains inherited as the sealed rest-state presentation boundary, while AXIS 8.26 remains inherited unchanged for atomic record-save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy.

## Current engineering state

Active milestone: **AXIS 8.26.2 — Active Rest Selector Binding**

Governed target branch: `main`

Bounded delivery branch: `fix/8262-active-rest-selector` · PR **#155**.

Version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. No new factual owner or architecture branch is introduced; this release closes the concrete selector defect found by the bounded Active / Flow / Evolution real-use audit before another product slice begins.

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
