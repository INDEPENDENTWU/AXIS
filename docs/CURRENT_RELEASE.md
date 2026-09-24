# Current Release — AXIS 8.26.2

**Status: Production-sealed**

AXIS **8.26.2 — Active Rest Selector Binding** is the current Production-sealed Web release. The real-use audit found that AXIS 8.26.1 targeted `.v87-restline`, while the canonical integrated Active stage actually renders the existing v87-owned rest node as `.v87Rest`. 8.26.2 binds the intended presentation to the live node and seals the same treatment in the final Active-stage presentation owner so it survives the complete CSS cascade.

## Exact sealed identity

- release PR: **#155**
- completed delivery branch: `fix/8262-active-rest-selector`
- exact product/runtime merge: `7662d857fd5d442e3a7f775a430f0d4d8479bece`
- product version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**
- Production evidence confirmation: **8.26.2 → 8.26.2 / confirm / sequence 19 / governance**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- release graph: **90 deterministic top-level steps**
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Production certification

The exact merged product/runtime SHA above earned the complete governed Production chain:

- Vercel deployment: `dpl_FM52hUPwo7Nf3CThK2n145QLP3Zq` — READY / Production / exact source SHA
- Current Release Gate `35963269939` — success in Chromium and iPhone-like WebKit
- Deep Compatibility Gate `35963269792` — success in Chromium, iPhone-like WebKit and static compatibility
- Vercel Production Deployment Gate `35963296512` — success after exact manifest/assets and real Production flow proof
- Vercel Public Production Alias Gate `35963296503` — success
- EdgeOne Production run `35963269663` — exact-prebuilt deploy, Vercel parity, Chromium and iPhone-like WebKit success
- `axis.juele.fun` Production run `35963269856` — exact parity, Chromium and iPhone-like WebKit success

This exact merged SHA is the durable AXIS 8.26.2 **runtime seal baseline**. This is **not a self-referential requirement**: the runtime authority is the exact certified product merge, while later governance-only reconciliation commits merely record that evidence. `latestDeploymentIsAuthority` remains false.

## What 8.26.2 changes

The existing rest-state presentation now targets canonical `.v87Rest` and remains effective at the final Active-stage CSS owner. The visible result is the intended breathing room, grouped rest capsule, restrained tonal separation, responsive geometry and reduced-motion-safe entry behavior on the actual shipped node.

The proof follows established product truth: pausing through the existing v87 owner starts the rest clock; resuming clears the active rest start and accumulates rest time. Set completion does not create a second rest truth.

This patch does **not** change pause/resume semantics, elapsed/rest timing, set completion, Flow, Session, Encounter, recorder, persistence, media, network or AI ownership. Existing v87 remains the pause/resume and timer truth owner.

## Inherited behavior

AXIS 8.26.1 remains historical rest-state provenance. AXIS 8.26 remains authoritative for atomic record-save settlement, ongoing Flow direct Active admission, one-shot recorder ownership, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy. 8.26.2 inherits all of those behaviors unchanged.

Protected stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## Next stage

No 8.27 implementation branch is active. The next stage begins with one bounded real-use UX audit across Active, Flow and Evolution and selects only one concrete high-value user problem before another product version is opened.
