# AXIS Engineering Handoff

## Current Production release

AXIS **8.22 — Truthful Evolution Replay** is the current Production-certified Web release.

Exact product/runtime seal:

- release PR: **#144**
- exact merged `main` runtime SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- original release decision: **8.21 → 8.22 / bump / sequence 5 / product-runtime**
- governance evidence reconciliation: **8.22 → 8.22 / confirm / sequence 6 / governance**

Production proof for that exact SHA:

- Vercel fixed Production: `https://axis-five-puce.vercel.app`
- Vercel Production gate: `34612916951` — success
- Vercel Public Production Alias Gate: `34612916591` — success
- EdgeOne mirror: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- EdgeOne deployment: `dpp90dvhamrl`
- EdgeOne verification run: `34612882892` — success
- EdgeOne verification artifact: `10269466752`
- custom domain: `https://axis.juele.fun`
- custom-domain verification run: `34612882890` — success
- final combined status: Vercel success + EdgeOne Production success

The exact 8.22 runtime seal remains `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`. A later governance-only reconciliation commit records this evidence but does not replace the already-certified product/runtime artifact or become a new runtime owner.

## Product model to preserve

**Reality is authoritative.** Encounters record what actually happened. Objects describe reusable practice semantics. Flow describes intended continuity only. Evolution reveals recorded reality without inventing a second history.

### Object / Encounter

- reusable Object truth: established app-owned Object state + explicit `metricSchema`
- executable resolver: `window.__AXIS_EXECUTABLE_OBJECTS__`
- execution modes: `single / sets / rounds / timed / hold / complete`
- immutable Encounter facts: `metricSchemaSnapshot` + `executionModeSnapshot`
- historical facts are never rewritten when an Object or Flow changes later

### Recording ownership

- `app.js` remains Session / Encounter / canonical recorder owner
- v61 remains the classic repeated weight+reps set writer only when immutable Encounter schema grants that authority
- media remains in established app / `axis_v42_media` ownership
- Quick Record is a canonical recording entry, not a second persistence model
- saved-item user-facing metadata is localized; internal enum IDs remain internal

### Flow 8.21 — inherited without owner change

Portable contracts:

- `axis.flow.v1`
- `axis.flow-provenance.v1`

Runtime truth:

- definitions: `axis_v60_state.flows`
- current run continuity: `axis_v60_state.flowRun`
- no `axis_flow_*` storage namespace
- no second Session, Encounter, Active, recorder or storage owner

Execution behavior sealed in 8.21 and inherited by 8.22:

- one complete Object is the Flow completion unit
- `开始此项` bypasses Quick configuration and starts through the existing v82/v87 Active lifecycle
- pause/resume/finish delegate to those existing Active owners
- explicit detours use Quick Record as record-only and cannot consume/advance the current Flow item
- ordinary `single/complete` Objects remain one-shot outside Flow
- an immutable proven Flow whole-item may reuse the existing Active lifecycle without creating a Flow-specific Active owner

### AXIS 8.22 Truthful Evolution Replay

Replay is a **derived, read-only reality timeline**, not a new historical model.

Source/ownership contract:

- runtime owner: `v822-evolution-replay.js / window.__AXIS_EVOLUTION_REPLAY__`
- source truth: existing 8.14 Evolution Object Encounter projection
- Evidence remains the existing 8.15 Media Evidence owner
- deterministic ordering: `time → sessionStart → eventId`
- selection state is transient UI only
- no LocalStorage/IndexedDB namespace
- no Session/Encounter/media writer
- no network or AI call
- no score/progress authority
- no automatic claim that later means better

Single-Encounter behavior is deliberately explicit: **one real record is one real record, not a before/after comparison**.

Multi-Encounter behavior exposes factual chronology, saved summary, time and Evidence presence so the user can inspect change without AXIS manufacturing an interpretation.

### Metric controls

The inherited 8.21 metric-control system keeps quantity, time, pace, scale and choice under the existing recorder/value owners. Applicable numeric value/unit optical-center error remains **≤ 0.5 CSS px**. Do not weaken those assertions.

## Current governance state

Active milestone: **AXIS 8.22 — Production Evidence Reconciliation**

Governed target branch: `main`

Bounded delivery branch: `gov/822-production-evidence-reconciliation`

This bounded stage changes governance evidence only. It must preserve public release **8.22**, use `decision: confirm`, sequence **6**, class `governance`, and introduce no runtime, storage, UI, data or ownership change.

The purpose is to replace stale candidate-era bookkeeping with the exact Production seal above. After this reconciliation is itself CI/Production-certified, return immediately to a bounded user-visible product-evolution slice rather than continuing governance cleanup.

## Data safety

Preserve all long-lived real user data.

Authoritative stores remain:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

The 8.22 product release and this governance reconciliation do not migrate, clear, copy or rewrite any of them.

## Cross-platform foundation

- foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`

Browser build/postbuild mechanics remain implementation details and must not leak into portable domain semantics.

## Deferred work

Do not mix the Node/toolchain upgrade, broad backup/account expansion, native/iOS product work, or unrelated architecture convergence into this governance slice. Existing backup compatibility stays protected; larger account/backup design remains intentionally deferred until the product has stabilized further.

## Resume order for future work

1. `governance/project-state.json`
2. `governance/version-decision.json`
3. `docs/HANDOFF.md`
4. `docs/CURRENT_RELEASE.md`
5. `docs/CURRENT_WORK.md`
6. `governance/owners.json`
7. `governance/retirements.json`
8. current contracts/tests
9. exact Production/deployment evidence

Chat history is supplementary. GitHub governance, current source contracts, exact build evidence and Production proof are authoritative.
