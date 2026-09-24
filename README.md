# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.2** · **Production-sealed** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.2 — Active Rest Selector Binding** is Production-sealed at exact product/runtime merge `7662d857fd5d442e3a7f775a430f0d4d8479bece` from PR **#155**.

The bounded real-use audit found that 8.26.1 authored the rest-state presentation against `.v87-restline`, while the canonical Active stage renders the existing v87-owned node as `.v87Rest`. 8.26.2 binds the intended rest presentation to the node that actually exists and seals that binding in the final Active-stage presentation owner so later stage CSS cannot silently override it.

Exact Production evidence:

- Vercel deployment `dpl_FM52hUPwo7Nf3CThK2n145QLP3Zq` — READY / Production / exact merged product-runtime SHA
- Current Release Gate `35963269939` — Chromium + iPhone-like WebKit success
- Deep Compatibility Gate `35963269792` — Chromium + iPhone-like WebKit + static compatibility success
- Vercel Production Deployment Gate `35963296512` — exact manifest/assets + real Production flow success
- Vercel Public Production Alias Gate `35963296503` — fixed public alias exact-release success
- EdgeOne Production run `35963269663` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35963269856` — exact parity, Chromium + iPhone-like WebKit success

`latestDeploymentIsAuthority` remains false: later governance-only commits or provider redeploys do not replace the sealed product/runtime SHA above unless a new governed product release earns a new exact certification chain.

## What 8.26.2 changes

The existing rest presentation is now bound to canonical `.v87Rest`, including its breathing room, restrained tonal capsule, responsive geometry and reduced-motion-safe entry behavior. The physical proof follows the real product semantics: rest truth begins when the established v87 owner pauses an Active item; completing a set does not invent rest state.

The release does **not** change pause/resume semantics, rest-time calculation, set completion, Flow, Session, Encounter, recorder, storage, media, network or AI ownership. It does not create another Active owner or interactive surface.

AXIS 8.26.1 remains inherited as historical rest-presentation provenance. AXIS 8.26 remains inherited unchanged for atomic record-save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy.

## Current engineering state

Completed milestone: **AXIS 8.26.2 — Active Rest Selector Binding**

Governed target branch: `main`

Completed bounded delivery branch: `fix/8262-active-rest-selector` · PR **#155**.

Product version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**. Production evidence reconciliation is **8.26.2 → 8.26.2 / confirm / sequence 19 / governance**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. No 8.27 implementation branch is active. The next product stage starts only after a bounded real-use audit identifies one concrete high-value problem.

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
