# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.3** · **Release candidate** · last sealed **8.26.1** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.3 — Active Rest Convergence** is the bounded corrective candidate on PR **#156**. AXIS 8.26.2 was merged to `main` at `7662d857fd5d442e3a7f775a430f0d4d8479bece`, but remained unsealed after physical compatibility exposed a real Rest Speak geometry regression. 8.26.3 keeps the selector correction and closes that regression without changing training truth.

AXIS **8.26.1** remains the exact Production-sealed baseline at product/runtime merge `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153** until the exact 8.26.3 merged-main artifact completes the full certification chain.

Sealed 8.26.1 Production evidence remains:

- Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact sealed product-runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium + iPhone-like WebKit success

`latestDeploymentIsAuthority` remains false: candidate builds, governance-only commits or provider redeploys do not replace the sealed product/runtime SHA above.

## What 8.26.3 changes

Running Active has no visible or geometric rest placeholder. Paused Active reuses the existing v87-owned factual `休息 mm:ss` truth as one restrained, transparent **32px** state rail. The duplicate paused label remains hidden; there is no pill background, border, shadow or component-entry animation.

Inherited Rest Speak reuses that same 32px rail. Turning Rest Speak on or off must not move the Active card. The ordinary paused rail remains non-interactive, while `.v87Rest.v89Speak` preserves the already-existing explicit Rest Speak action rather than creating a new action owner.

The patch does **not** change pause/resume semantics, rest-time calculation, set completion, Flow, Session, Encounter, recorder, storage, media, network or AI ownership.

## Current engineering state

Active milestone: **AXIS 8.26.3 — Active Rest Convergence**

Governed target branch: `main`

Bounded delivery branch: `fix/8262-rest-convergence` · PR **#156**.

Version decision: **8.26.2 → 8.26.3 / bump / sequence 19 / bug-fix**.

The deterministic release remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks. The merged-but-unsealed 8.26.2 selector correction remains historical provenance; 8.26.3 is the release candidate that must earn exact-head and post-merge Production certification.

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
