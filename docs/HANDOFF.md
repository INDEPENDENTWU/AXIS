# AXIS Engineering Handoff

## Current sealed product baseline

AXIS **8.21** is the current public Web release.

- release PR: **#108**
- sealed runtime baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- Vercel seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX`
- Vercel Production gate: `33278987731` — success
- EdgeOne seal deployment: `dpysj966i0hh`
- EdgeOne verification run: `33278965885` — success
- public Vercel: `https://axis-five-puce.vercel.app`
- public EdgeOne mirror: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

The SHA and provider IDs above are the **8.21 product/runtime seal evidence snapshot**. Do not reinterpret them as a self-referential requirement that every later governance-only deployment be built from the same Git commit. Current provider state is verified by deployment gates; the repository records the durable runtime release baseline.

## Product model to preserve

**Reality is authoritative.** Encounters record what actually happened. Objects describe reusable practice semantics. Flow describes intended continuity only.

### Object / Encounter

- reusable Object truth: established app-owned Object state + explicit `metricSchema`
- executable resolver: `window.__AXIS_EXECUTABLE_OBJECTS__`
- execution modes: `single / sets / rounds / timed / hold / complete`
- immutable Encounter facts: `metricSchemaSnapshot` + `executionModeSnapshot`
- historical facts are never rewritten when an Object or Flow changes later

### Recording ownership

- app.js remains Session / Encounter / canonical recorder owner
- v61 remains the classic repeated weight+reps set writer only when immutable Encounter schema grants that authority
- media remains in established app/`axis_v42_media` ownership
- Quick Record is a canonical recording entry, not a second persistence model
- saved-item user-facing metadata is localized; internal enum IDs remain internal

### Flow 8.21

Portable contracts:

- `axis.flow.v1`
- `axis.flow-provenance.v1`

Runtime truth:

- definitions: `axis_v60_state.flows`
- current run continuity: `axis_v60_state.flowRun`
- no `axis_flow_*` storage namespace
- no second Session, Encounter, Active, recorder or storage owner

Execution behavior sealed in Production:

- one complete Object is the Flow completion unit
- `开始此项` bypasses Quick configuration and starts through the existing v82/v87 Active lifecycle
- pause/resume/finish delegate to those existing Active owners
- explicit detours use Quick Record as record-only and cannot consume/advance the current Flow item
- ordinary `single/complete` Objects remain one-shot outside Flow
- an immutable proven Flow whole-item may reuse the existing Active lifecycle without creating a Flow-specific Active owner
- smart item/gap estimates are run context, not historical truth

### Metric controls

The 8.21 metric-control system keeps five semantic families under the existing recorder/value owners:

- quantity
- time
- pace
- scale
- choice

Numeric value/unit geometry is physically protected. Applicable optical-center error must remain **≤ 0.5 CSS px**. Preset rails remain symmetric/full-width. Do not weaken those assertions or hide layout movement with waits.

## Current governance state

Active milestone: **AXIS 8.21 — Post-release Architecture Governance**

Governed active branch: `main`

The current governance phase is deliberately product-neutral. The 8.21 product is sealed; the next architecture work is to audit the **89 deterministic release steps** and move behavioral `prepare-*` / `postbuild-*` mutation back into explicit source owners one bounded slice at a time.

Rules for that work:

- one factual owner per capability
- one semantic action writer
- no new storage namespace without explicit product/schema approval
- no giant rewrite
- no test relaxation to accommodate architecture changes
- each bounded source-owner migration must preserve exact behavior in Chromium and iPhone-like WebKit
- historical compatibility remains release-blocking
- generated artifact topology remains canonical unless a separately proved architecture change intentionally replaces it

## Production governance semantics

`governance/project-state.json` records a **runtime seal baseline**, not an always-moving latest-deployment SHA. This distinction prevents impossible self-reference: a documentation-only commit may itself trigger another provider deployment.

The Production Governance Contract must independently prove that:

- governed current release equals the actual current release owner (`prepare-821-release.mjs` → 8.21)
- project baseline, owner registry and retirement registry all agree on 8.21
- seal evidence provider SHAs agree with the runtime baseline
- seal evidence includes successful Vercel/EdgeOne physical/parity proofs
- README, CURRENT_RELEASE, HANDOFF and CURRENT_WORK describe the same current release/governance state

## Cross-platform foundation

- foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`

Browser build/postbuild mechanics are implementation details and must not leak into portable domain semantics.

## Next independent infrastructure task

Do **not** mix this into governance reconciliation. The successful EdgeOne Production run exposed Node-engine warnings because repository/tooling still pins Node `20.18.0`, while current EdgeOne CLI transitive packages require at least `20.18.1` and several require `20.19.0`.

After governance truth is merged and green, inventory all Node pins and perform a separate toolchain-only upgrade to a single supported Node 20.19+ baseline, followed by the full release/Production verification chain.

## Resume order for future work

1. `governance/project-state.json`
2. `docs/HANDOFF.md`
3. `docs/CURRENT_RELEASE.md`
4. `docs/CURRENT_WORK.md`
5. `governance/owners.json`
6. `governance/retirements.json`
7. current contracts/tests
8. exact Production/deployment evidence

Chat history is supplementary. GitHub governance, current source contracts, exact build evidence and Production proof are authoritative.
