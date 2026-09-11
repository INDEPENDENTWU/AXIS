# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.22 — Truthful Evolution Replay** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#144**
- exact certified starting `main`: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`
- bounded branch: `product/822-truthful-evolution-replay`
- version decision: **8.21 → 8.22 / bump / sequence 5 / product-runtime**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`

The last fully sealed product/runtime remains AXIS **8.21**:

- sealed release PR: **#108**
- sealed runtime baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- Vercel seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX`
- Vercel Production gate: `33278987731` — success
- EdgeOne seal deployment: `dpysj966i0hh`
- EdgeOne verification run: `33278965885` — success
- public Vercel: `https://axis-five-puce.vercel.app`
- public EdgeOne mirror: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`

The SHA and provider IDs above are the **8.21 product/runtime seal evidence snapshot**. They must not be relabeled as 8.22 evidence. AXIS 8.22 becomes sealed only when its exact merged `main` SHA passes the existing Vercel, exact-prebuilt EdgeOne and custom-domain certification chain.

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

Execution behavior already sealed in 8.21:

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

Active milestone: **AXIS 8.22 — Truthful Evolution Replay**

Governed target branch: `main`

Bounded delivery branch: `product/822-truthful-evolution-replay`

PR: **#144**

The candidate is intentionally a true product release. It uses `decision: bump`; it must not be hidden under AXIS 8.21 or mislabeled as source-owner convergence.

The candidate may not be called complete until one exact PR head passes inherited + 8.22 gates, then the exact merged SHA passes:

1. fixed Vercel Production manifest/artifact parity and Chromium current-release proof;
2. exact-prebuilt EdgeOne Production parity plus Chromium and iPhone-like WebKit Replay proof;
3. `axis.juele.fun` exact parity plus Chromium and iPhone-like WebKit Replay proof;
4. final combined commit statuses with no unresolved push-workflow failure.

A follow-up governance-only reconciliation may then replace the provisional 8.21 sealed evidence snapshot with the exact 8.22 Production seal record. Until that happens, repository governance must clearly distinguish **candidate release 8.22** from **last sealed runtime 8.21**.

## Data safety

Preserve all long-lived real user data.

Authoritative stores remain:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

Replay does not migrate, clear, copy or rewrite any of them.

## Cross-platform foundation

- foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`

Browser build/postbuild mechanics remain implementation details and must not leak into portable domain semantics.

## Deferred work

Do not mix the Node/toolchain upgrade, broad backup/account expansion, native/iOS product work, or unrelated architecture convergence into this 8.22 slice. Existing backup compatibility stays protected; larger account/backup design remains intentionally deferred until the product has stabilized further.

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
