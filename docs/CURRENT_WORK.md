# Current Work

## Production baseline at start of this work

Current sealed Production is **AXIS 8.20.1 — Executable Object Reliability**.

- exact main SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- Vercel: `https://axis-five-puce.vercel.app`
- Vercel deployment: `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD` — READY
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- EdgeOne deployment: `dpemq8bxjopa`
- EdgeOne verification run: `32812883590` — success
- exact artifact/source parity + Chromium + iPhone WebKit Production proof: complete

Cross-platform continuity remains anchored by:

- native foundation ID: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts: `axis.domain.v1`, `axis.data.v1`, plus additive 8.21 `axis.flow.v1`

Do not reopen 8.20.1 product behavior merely because an older release filename or historical compatibility source still exists.

## Active change

**AXIS 8.21 — Flow / Session Blueprint**

Active branch:

`product/821-flow-session-blueprint`

Draft PR: **#88** — `AXIS 8.21 — Flow / Session Blueprint Foundation`.

Current phase:

**Phase 1 — Flow Resolver Foundation**

8.21 is a product-capability release, not a maintenance patch.

### Phase 0 proof

Ownership/reuse inspection and durable handoff were sealed on exact head:

`84310744b528441f3fa8d3feb51e8ed149e02b78`

On that exact head all nine baseline PR workflow families completed **success**: Repository, Work Continuity, Runtime Foundation, Current Release, Runtime, Deep Compatibility, Cross-Platform Foundation, PR Run Convergence and EdgeOne package contract.

Phase 0 findings:

- canonical `app.js` remains the base Session/Object/Encounter state owner using `axis_v60_state`;
- canonical Encounter append remains the established session writer path; Flow must delegate rather than replace it;
- Group Plan in `v874-set-bridge.js` is a classic set-level preview/transaction bridge, not a reusable Flow persistence or Session model;
- Group Plan interaction ideas may be reused, but its set facts and v61 authority may not become Flow ownership;
- no existing independent Flow truth/store was found that should be promoted;
- 8.21 therefore starts with portable semantics and a pure resolver before persistence or UI.

### Product behavior contract

A Flow may look like:

```text
A → B → C
```

but real behavior may become:

```text
A → D → B
```

This is valid. AXIS records reality; it does not punish reality for differing from intended sequence.

Required:

- ordered canonical Object references;
- lightweight start / advance / skip / insert / replace / finish behavior;
- no requirement that all Flow Objects become globally Active;
- temporary per-step recording/execution override where useful;
- override affects that step only and never mutates Object defaults;
- saved Encounter freezes effective recording/execution semantics and additive provenance;
- Flow edits/deletion after the fact cannot rewrite old Encounters;
- local-first, domain-neutral behavior without requiring network/AI.

Explicitly not 8.21:

- completion percentage, streak/XP/punishment or deviation warnings;
- mandatory calendar scheduling or AI coaching as the primary interface;
- a second Session/Encounter/recorder/Active model;
- a new persistence database/store;
- one mode per activity category;
- synthetic progress scoring.

### Current engineering slice

This slice introduces the portable/read-only foundation only:

- `shared/contracts/axis-flow-v1.schema.json` — `axis.flow.v1`;
- `lib/axis-flow.mjs` — pure normalization/effective-step resolver;
- `shared/fixtures/flow/` — heterogeneous execution and temporary-override non-mutation fixtures;
- `scripts/axis-821-flow-contract.mjs` — purity, precedence, fixture and ownership contract;
- existing **AXIS Cross-Platform Foundation Gate** runs the Flow contract; no new workflow family is created.

Resolver precedence is:

```text
explicit temporary Flow-step override
            ↓
Object-specific executable truth
            ↓
existing global/default fallback
            ↓
legacy compatibility only when current truth is absent
```

`metricOverride` and `executionOverride` remain separate semantics. Object schema-derived execution is Object-specific truth and must not be silently replaced by a global fallback.

This slice is deliberately **not** authorized to:

- write localStorage/IndexedDB;
- choose durable Flow persistence;
- modify `app.js` Session/Encounter writes;
- create or control Active;
- render a Flow UI;
- change Production identity from 8.20.1.

### First reference fixture

```text
A = duration + intensity → timed
B = weight + reps       → sets
C = completed           → complete
```

The portable resolver must also prove a temporary Flow override can change one resolved step without mutating the reusable Object defaults.

### Persistence / ownership guard

Persistence location remains **not selected** in this phase.

Existing authoritative stores remain:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

Existing owners remain authoritative for training/session/Encounter, classic sets, Active, Capture/media and sound.

### Secondary, non-blocking experiment

**Active Action Lens** remains presentation-only research for easier one-hand `完成一组`, `暂停`, and `完成` actions.

It is not part of the 8.21 success definition and has no permission to own Flow state, training facts or history. See [`ACTIVE_ACTION_LENS_EXPERIMENT.md`](ACTIVE_ACTION_LENS_EXPERIMENT.md).

## Validation for this work

The current resolver foundation head must prove:

- repository/work-continuity governance;
- `axis.flow.v1` is registered beside existing portable contracts without replacing `axis.domain.v1` / `axis.data.v1`;
- resolver has no DOM, network, localStorage, IndexedDB or Session/Encounter side effects;
- Flow override > Object truth > global fallback > legacy compatibility precedence is deterministic;
- explicit Object schema-derived execution beats global fallback;
- temporary overrides do not mutate Object defaults or input Flow definitions;
- mixed timed / sets / complete fixtures resolve identically for the shared cross-platform contract;
- existing Metric Schema, native foundation, Runtime, Current Release, Deep Compatibility and Production-package contracts remain green;
- `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1` and `axis.data.v1` remain preserved as cross-platform continuity anchors.

Do not deploy 8.21 to Production from this slice. It contains no Flow UI or persistence and intentionally leaves public Production at 8.20.1.

## Next planned stage

After the pure resolver exact head is green:

**Phase 1B — Immutable Encounter Flow Provenance**

Add the smallest additive snapshot/provenance adapter (`flowRef`, `flowStepRef`, frozen effective context) while preserving the established app.js Encounter writer. Prove that changing/reordering/deleting the source Flow cannot change a previously created provenance snapshot.

Only after that foundation is sealed may Phase 2 choose the smallest app-owned durable Flow definition/runtime representation and then add minimal composition/launch UI.

**Chat history is not authoritative project memory.** GitHub governance, current docs, contracts, tests and Production evidence are authoritative. A new chat should be able to resume by reading `governance/project-state.json`, `docs/HANDOFF.md`, this file and the 8.21 blueprint.
