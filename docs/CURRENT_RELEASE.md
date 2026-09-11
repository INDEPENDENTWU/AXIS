# Current Release — AXIS 8.22

**Status: Production-certified — AXIS 8.22 Truthful Evolution Replay**

AXIS **8.22 — Truthful Evolution Replay** is the current Production-sealed Web release. The exact product/runtime seal is the merged `main` commit from PR **#144**:

`abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`

## Exact release identity

- release: **AXIS 8.22 — Truthful Evolution Replay**
- release PR: **#144**
- exact Production runtime seal SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- deterministic top-level graph: **85 steps**
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**
- original product version decision: **8.21 → 8.22 / bump / sequence 5 / product-runtime**
- Production-evidence reconciliation decision: **8.22 → 8.22 / confirm / sequence 6 / governance**

The runtime seal baseline is the exact user-visible product/runtime artifact above. The later governance reconciliation records its certification evidence only; its own commit SHA is **not a self-referential requirement** for the already-certified 8.22 runtime.

## Production certification evidence

### Vercel golden Production

- fixed Production URL: `https://axis-five-puce.vercel.app`
- source/runtime SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- Vercel status: **success / READY / production**
- Production Deployment Gate: `34612916951` — **success**
- Public Production Alias Gate: `34612916591` — **success**
- exact manifest / immutable asset parity: **success**
- Chromium current-release flow including 8.22 Replay: **success**
- recorded Vercel status target: `https://vercel.com/independentwus-projects/axis/8cAcScUNkUATaSLqdssvRRYDT3Za`

The repository does not invent a Vercel provider deployment ID when that identifier is not present in the retained certification evidence. Exact source/artifact parity, provider status, fixed Production URL and the Production gates are the durable proof.

### EdgeOne exact-prebuilt mirror

- Production URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment: `dpp90dvhamrl`
- verification run: `34612882892` — **success**
- verification artifact: `10269466752`
- artifact SHA-256: `e9a8adca4c4387f53970cc800e25e3ce5053d5290e6c3f5b6a7ae9eb5c7d059f`
- exact Vercel-golden artifact parity: **success**
- authenticated API parity: **success**
- Chromium current-release flow: **success**
- iPhone-like WebKit current-release flow: **success**

### Governed custom domain

- URL: `https://axis.juele.fun`
- verification run: `34612882890` — **success**
- exact artifact parity: **success**
- Chromium current-release flow: **success**
- iPhone-like WebKit current-release flow: **success**

### Final commit status

For `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`:

- Vercel: **success**
- EdgeOne Production: **success**
- unresolved exact-main push failures: **none**

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

The 8.22 Replay layer is **derived read-only and Production-sealed**:

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

## Authoritative ownership

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

No factual owner is added by AXIS 8.22. No user data migration, deletion or rewrite is part of the Production-evidence reconciliation.
