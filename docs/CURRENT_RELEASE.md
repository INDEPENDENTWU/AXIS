# Current Release — AXIS 8.22

**Status: Release candidate — Production seal pending**

AXIS **8.22 — Truthful Evolution Replay** is the current Web release candidate. This document deliberately distinguishes candidate identity from provider seal evidence: AXIS 8.22 must not be described as Production-sealed until the exact merged `main` SHA has completed the Vercel → EdgeOne → `axis.juele.fun` certification chain.

## Exact candidate identity

- release: **AXIS 8.22 — Truthful Evolution Replay**
- release PR: **#144**
- exact certified starting `main`: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`
- delivery branch: `product/822-truthful-evolution-replay`
- version decision: **8.21 → 8.22 / bump / sequence 5 / product-runtime**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate build graph: **85 deterministic top-level steps** after adding the explicit 8.22 postbuild Replay contract to the 84-step certified base
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.21** remains the last fully Production-sealed runtime until the 8.22 merged artifact is certified.

- sealed release PR: **#108**
- runtime seal baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- Vercel seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX`
- Vercel Production gate: `33278987731` — **success**
- Vercel Public Production Alias Gate: `33278987745` — **success**
- EdgeOne seal deployment: `dpysj966i0hh`
- EdgeOne verification run: `33278965885` — **success**

That 8.21 SHA is a durable runtime seal baseline, **not a self-referential requirement** that the 8.22 candidate use the same SHA and not evidence that 8.22 is already live. Provider evidence will be replaced only after exact 8.22 merged-main certification.

## What 8.22 changes

### Truthful Evolution Replay

Replay turns an existing Evolution Object into an inspectable factual chronology without creating another historical system.

- source truth: existing 8.14 Evolution Object Encounter projection
- deterministic ordering: `time → sessionStart → eventId`
- multi-Encounter state: chronological navigation through actual saved Encounters
- single-Encounter state: explicit **“只有一次真实记录 · 暂无前后对照”** rather than manufacturing before/after meaning
- visible facts: saved time, factual summary and Evidence count
- presentation: in-place inside the existing Evolution Object surface
- selection: transient UI state only; never persisted

### Ownership boundary

The 8.22 Replay layer is **derived read-only**:

- no Session writer
- no Encounter writer
- no media writer
- no new storage namespace or IndexedDB database
- no network owner
- no AI owner
- no score/ranking/progress authority
- no historical rewrite

Existing `app.js`, v61, v82/v87, `axis_v42_media`, 8.14 Evolution Object and 8.15 Media Evidence ownership remain unchanged.

### Inherited product foundation

AXIS 8.22 preserves the already-sealed 8.21 Object/Flow/Active/metric-control behavior:

- immutable Encounter schema/execution snapshots
- whole-item Flow
- direct current-item Active lifecycle
- detour isolation
- ordinary `single/complete` one-shot semantics outside proven Flow whole-items
- strict metric optical geometry
- established user data stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

## Release-blocking proof

The candidate is not merge-ready until one exact PR head proves all inherited contracts plus the 8.22 Replay contract in Chromium and iPhone-like WebKit. The dedicated Replay smoke must verify deterministic order, direct and step navigation, honest single-Encounter semantics, reduced-motion compatibility, mobile geometry, no storage mutation and no network ownership.

After merge, the **exact merged SHA** must then prove:

1. fixed Vercel Production serves the exact 8.22 manifest/artifact and passes real Chromium Replay;
2. EdgeOne deploys the exact Vercel-golden prebuilt artifact and passes Chromium + iPhone-like WebKit Replay;
3. `https://axis.juele.fun` matches the exact artifact and passes Chromium + iPhone-like WebKit Replay;
4. combined commit statuses and all relevant main-push workflows settle without unresolved failure.

Only then may AXIS 8.22 be called Production-sealed. A governance-only reconciliation can subsequently replace the provisional 8.21 provider snapshot with the exact 8.22 seal SHA, deployment IDs and workflow run IDs.

## Authoritative ownership for the candidate

- Session / Object / Encounter truth: `app.js` / `axis_v60_state`
- classic repeated-set facts: `v61.js` / `axis_v8_meta` when immutable schema permits
- ongoing Active lifecycle/presentation: existing v82/v87 owners
- Flow intent/orchestration: `axis_v60_state.flows` + `axis_v60_state.flowRun`
- media persistence: established app owner / `axis_v42_media`
- Evolution Object truth projection: existing 8.14 owner
- Media Evidence: existing 8.15 owner
- Evolution Replay 8.22: `v822-evolution-replay.js / window.__AXIS_EVOLUTION_REPLAY__`, derived read-only only
- learning: isolated `axis_v89_speak`
- portable semantics: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`

No factual owner is added by AXIS 8.22.
