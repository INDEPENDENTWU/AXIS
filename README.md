# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.26.4** · **Release candidate** · last sealed **8.26.1** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md) · [Product](docs/PRODUCT.md) · [Architecture](docs/ARCHITECTURE.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Encounters freeze what actually happened, Evidence anchors those facts, Flow describes intended continuity, and Evolution reveals reality without inventing a second history.

## Release truth

AXIS **8.26.4 — Active Rest Utility Rail** is the current bounded corrective candidate on PR **#157**, branch `fix/8264-active-rest-utility-rail`.

AXIS **8.26.3** was merged to `main` at `ed418938c07383745d5485c2a46d37d20bfbebc7`, but real-device review exposed two remaining presentation defects: plan-complete could leave a rest-shaped visual residue, and paused `休息 mm:ss` sat on a separate vertical row from the existing `调整` action. 8.26.4 corrects those two presentation defects without changing training truth.

AXIS **8.26.1** remains the exact Production-sealed baseline at product/runtime merge `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153** until an exact later merged-main artifact completes the full certification chain. `latestDeploymentIsAuthority` remains false.

Sealed 8.26.1 Production evidence remains:

- Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact sealed product-runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deployment, Vercel parity, Chromium + iPhone-like WebKit success
- `axis.juele.fun` Production run `35873719011` — exact parity, Chromium + iPhone-like WebKit success

## What 8.26.4 changes

Paused Active keeps the existing canonical `#v87Rest` factual timer but places it inside the already-existing `.axis821StageControls` utility grid. The rest state sits on the **left** and the existing `调整` action sits on the **right**, on one fixed 32px secondary row. The rest text has deliberate secondary emphasis but no pill, border, frame, shadow or decorative container.

Running Active continues to have zero rest geometry. `plan-complete` now also has zero rest geometry, so no empty oval, badge or residual frame can survive after the planned sets are complete. Inherited Rest Speak keeps the same 32px geometry and its existing explicit interaction.

The patch does **not** change pause/resume semantics, rest-time calculation, set completion, Flow, Session, Encounter, recorder, storage, media, network or AI ownership.

## Current engineering state

Active milestone: **AXIS 8.26.4 — Active Rest Utility Rail**

Governed target branch: `main`

Bounded delivery branch: `fix/8264-active-rest-utility-rail` · PR **#157**.

Version decision: **8.26.3 → 8.26.4 / bump / sequence 20 / bug-fix**.

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
