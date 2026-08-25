# AXIS Engineering Handoff

This is the human/agent handoff entry for the current repository state. Chat transcripts are supplementary only.

## 1. Sealed Production baseline

**AXIS 8.20.1 — Executable Object Reliability** remains the current Production Web release.

Exact sealed main SHA:

`fdbfea738489fca6b19b3c8c7b502977373e4e4f`

- Vercel: `https://axis-five-puce.vercel.app` · deployment `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD` · READY · Production gate `32812905314` success
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool` · deployment `dpemq8bxjopa` · verification `32812883590` success
- exact Vercel/EdgeOne artifact parity: success
- Chromium + iPhone-like WebKit Production flows: success

Production identity remains `version/baseVersion = 8.20.1`, `architecture = canonical-single-runtime`.

## 2. Established ownership that 8.21 may not replace

- Session/Object/Encounter truth: `app.js` / `axis_v60_state`
- classic weight+reps set facts: `v61.js` / `axis_v8_meta` only where immutable schema permits
- ongoing Active: established v82/v87 lifecycle/presentation owners
- media: established app/source-first owners / `axis_v42_media`
- learning: `axis_v89_speak`
- portable Metric Schema: derived semantics, not storage authority

`metricSchemaSnapshot` remains Encounter authority for what was recorded; `executionModeSnapshot` remains authority for how it executed.

## 3. Current milestone

**AXIS 8.21 — Flow / Session Blueprint**

- branch: `product/821-flow-session-blueprint`
- Draft PR: **#88**
- current phase: **Phase 1B — Immutable Encounter Flow Provenance**

Phase 0 proof SHA:

`84310744b528441f3fa8d3feb51e8ed149e02b78`

Phase 1 resolver proof SHA:

`2892d8807e6d2688cb366019d64c6e9b573fcb66`

`2892d880…` passed all nine baseline PR workflow families, including the new Flow contract step, Chromium/iPhone WebKit Current Release and Deep Compatibility.

## 4. Sealed Flow resolver foundation

Portable contract: `axis.flow.v1`

Pure module: `lib/axis-flow.mjs`

Reference semantics:

```text
Flow = intended continuity
Encounter = factual history
```

Resolver precedence:

```text
explicit temporary Flow-step override
            ↓
Object-specific executable truth
            ↓
existing global/default fallback
            ↓
legacy compatibility only when current truth is absent
```

The resolver is read-only and owns no persistence, UI, Active, Session, Encounter or recorder actions.

Reference fixture:

```text
A: duration + intensity → timed
B: weight + reps       → sets
C: completed           → complete
```

A temporary Flow override can change one resolved step without mutating Object defaults.

## 5. Current Phase 1B provenance contract

Portable additive contract: `axis.flow-provenance.v1`

Builder: `createFlowEncounterProvenance()` in `lib/axis-flow.mjs`.

It freezes only compact Flow context:

- `flowRef`
- `flowStepRef`
- `objectRef`
- repeat intent
- effective metric IDs
- effective execution mode
- override provenance

It deliberately does **not** become another complete Encounter truth envelope. Existing `metricSchemaSnapshot` and `executionModeSnapshot` remain factual authority.

The builder must return a detached snapshot: later mutation/edit/reorder/deletion of Flow/Object/resolved objects cannot alter an already-created provenance value.

At this phase the builder still does **not** write an Encounter. Future integration must hand the snapshot to the established `app.js` Encounter writer.

## 6. Still forbidden

Do not:

- create `axis_flow_*` localStorage/IndexedDB namespaces;
- introduce a second Session/Encounter/Active/recorder owner;
- make all Flow Objects Active at launch;
- treat skip/insert/reorder/early finish as failure;
- duplicate classic v61 facts;
- make historical Encounter depend on live Flow state;
- build heavy Flow UI before the state/delegation boundary is proven;
- change Production identity merely because portable Flow contracts exist.

## 7. Next implementation slice after Phase 1B is green

**Phase 2 — App-owned Flow Definition / Runtime Boundary**

1. choose the smallest Flow definition/runtime representation inside existing `axis_v60_state` app-owned state;
2. define default/migration behavior without a new storage namespace;
3. seed a Flow and prove launch selects one current step rather than activating every Object;
4. delegate each step to existing recorder/Active semantics;
5. attach `axis.flow-provenance.v1` through the existing `app.js` Encounter writer only;
6. prove saved Encounter remains unchanged after Flow reorder/delete;
7. only then add minimal visible composition/launch UI.

## 8. Active Action Lens

`ACTIVE_ACTION_LENS_EXPERIMENT.md` remains independent non-blocking presentation research. It has zero permission to own Flow state, completion facts, Active truth or storage.

## 9. Cross-platform continuity

Preserve:

- `axis-native-foundation-0`
- `INDEPENDENTWU/AXIS-iOS`
- `axis.domain.v1`
- `axis.data.v1`
- additive `axis.flow.v1`
- additive `axis.flow-provenance.v1`

Browser DOM/CSS implementation details are not portable domain contracts.

## 10. Resume order

1. `governance/project-state.json`
2. this file
3. `CURRENT_RELEASE.md`
4. `CURRENT_WORK.md`
5. `AXIS_821_FLOW_SESSION_BLUEPRINT.md`
6. `shared/contracts/axis-contract-manifest.json`
7. `shared/contracts/axis-flow-v1.schema.json`
8. `shared/contracts/axis-flow-provenance-v1.schema.json`
9. `scripts/axis-821-flow-contract.mjs`
10. `governance/owners.json` / `governance/retirements.json`
11. exact current CI/Production state before declaring any release

If documentation conflicts with current Git or Production, verify reality and repair the handoff.
