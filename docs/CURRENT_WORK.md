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

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1` and `axis.data.v1`.

Do not reopen 8.20.1 product behavior merely because an older release filename or historical compatibility source still exists.

## Active change

**AXIS 8.21 — Flow / Session Blueprint**

- branch: `product/821-flow-session-blueprint`
- Draft PR: **#88**
- current phase: **Phase 1B — Immutable Encounter Flow Provenance**

### Sealed engineering proofs

Phase 0 ownership/reuse proof:

`84310744b528441f3fa8d3feb51e8ed149e02b78`

Phase 1 portable resolver proof:

`2892d8807e6d2688cb366019d64c6e9b573fcb66`

On `2892d880…`, all nine baseline PR workflow families completed **success**, including the new `Validate Flow contract and resolver purity` Cross-Platform step plus Chromium/iPhone WebKit Current Release and Deep Compatibility coverage.

### What Phase 1 proved

- `axis.flow.v1` is a portable additive contract, not a Web storage format.
- `lib/axis-flow.mjs` is pure/read-only: no DOM, network, localStorage, IndexedDB, Session, Encounter or Active writes.
- resolver precedence is temporary Flow-step override → Object-specific executable truth → existing global/default fallback → legacy compatibility only when current truth is absent.
- Object schema-derived execution is Object-specific truth and beats unrelated global fallback.
- mixed `timed / sets / complete` Objects resolve deterministically.
- temporary overrides do not mutate Flow/Object inputs.
- no new workflow family, store or runtime owner was created.

### Phase 1B scope

This slice adds detached additive provenance only:

- `axis.flow-provenance.v1`;
- `createFlowEncounterProvenance()` in the same pure Flow module;
- a provenance fixture that freezes `flowRef`, `flowStepRef`, `objectRef` and a compact resolved-step context snapshot;
- contract proof that later Flow/Object edits cannot mutate the already-created snapshot.

Flow provenance intentionally does **not** replace or compete with existing Encounter fact truth:

- `metricSchemaSnapshot` remains authoritative for what was recorded;
- `executionModeSnapshot` remains authoritative for how it executed;
- Flow provenance explains where the intent/context came from.

This phase still does **not** modify `app.js` Encounter writes, choose durable Flow storage, create Active state, render Flow UI or change Production identity.

### Persistence / ownership guard

Existing authoritative stores remain exactly:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

Flow resolver/provenance modules have storage `none` and are derived/read-only. The future runtime integration must delegate the actual Encounter save to the existing `app.js` owner.

### Active Action Lens

The large one-hand Active control idea remains a separate non-blocking presentation experiment. It has no permission to own Flow state, storage, Active truth or completion facts. See [`ACTIVE_ACTION_LENS_EXPERIMENT.md`](ACTIVE_ACTION_LENS_EXPERIMENT.md).

## Validation for this work

The current Phase 1B head must prove:

- Repository and Work Continuity remain green;
- `axis.flow-provenance.v1` is registered in the portable manifest;
- provenance output is detached from resolved step, Flow and Object mutations;
- provenance contains no live pointer to mutable Flow state;
- provenance does not duplicate full Encounter metric schema authority;
- Flow resolver remains pure/no-store;
- mixed Flow fixtures, Metric Schema, native foundation and Cross-Platform contracts remain green;
- Runtime Foundation, Current Release, Runtime and Deep Compatibility remain unchanged/green;
- no new Session, Encounter, Active, recorder or persistence owner appears;
- `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1` and `axis.data.v1` remain preserved.

Do not deploy 8.21 from Phase 1B. Public Production remains AXIS 8.20.1.

## Next planned stage

After Phase 1B exact-head CI is green:

**Phase 2 — App-owned Flow Definition / Runtime Boundary**

Choose the smallest representation inside the existing `axis_v60_state` app-owned boundary, with explicit migration/default behavior and no new storage namespace. Seed/prove Flow launch/delegation without visible product ceremony first, and integrate `axis.flow-provenance.v1` only through the established `app.js` Encounter writer.

Only after that truth path is proven should minimal Flow composition/launch UI be added.

**Chat history is not authoritative project memory.** GitHub governance, current docs, contracts, tests and Production evidence are authoritative.
