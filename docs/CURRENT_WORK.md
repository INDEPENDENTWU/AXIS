# Current Work

## Production baseline at start of this work

Current sealed Production remains **AXIS 8.20.1 — Executable Object Reliability**.

- exact main SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- Vercel: `https://axis-five-puce.vercel.app`
- Vercel deployment: `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD` — READY
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- EdgeOne deployment: `dpemq8bxjopa`
- EdgeOne verification run: `32812883590` — success
- exact artifact/source parity + Chromium + iPhone WebKit Production proof: complete

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1` and `axis.data.v1`.

Do not reopen 8.20.1 product behavior merely because historical compiler/runtime files still exist.

## Active change

**AXIS 8.21 — Flow / Session Blueprint**

- branch: `product/821-flow-session-blueprint`
- Draft PR: **#88**
- current phase: **Phase 2 — App-owned Flow Definition / Runtime Boundary**

## Sealed 8.21 proofs before Phase 2

### Phase 0 — ownership/reuse

Exact proof SHA:

`84310744b528441f3fa8d3feb51e8ed149e02b78`

All nine baseline PR workflow families completed success. It established that `app.js` / `axis_v60_state` remains canonical Session/Object/Encounter state ownership and that Group Plan is a classic set transaction bridge, not Flow storage.

### Phase 1 — portable resolver

Exact proof SHA:

`2892d8807e6d2688cb366019d64c6e9b573fcb66`

All nine baseline workflows completed success, including `axis.flow.v1`, pure resolver fixtures and Chromium/iPhone WebKit inherited product coverage.

### Phase 1B — immutable provenance

Exact proof SHA:

`289fd1b2cdcbcb4e1cfa56402372b8005daadfa4`

Final workflow evidence on this exact head:

- EdgeOne PR package `32879396817` — success
- Repository `32879396818` — success
- PR Convergence `32879396830` — success
- Cross-Platform Foundation `32879396838` — success
- Work Continuity `32879396815` — success
- Runtime Foundation `32879396831` — success
- Deep Compatibility `32879396864` — success
- Runtime `32879396825` — success
- Current Release `32879396826` — success

Current Release Chromium initially hit one inherited 8.16 Capture `waitForFunction` timeout. No runtime/CSS/Capture code changed; the same exact head WebKit path passed. The failed Chromium job was rerun unchanged and passed the same Capture point plus all later 8.18/8.20/8.20.1 checks. No product code or timeout threshold was altered for that retry.

Phase 1B therefore seals `axis.flow-provenance.v1`: a detached additive Flow/step context snapshot. It does not replace `metricSchemaSnapshot` or `executionModeSnapshot` Encounter fact authority.

## Phase 2 implementation under CI

Phase 2 makes the first deliberately small runtime integration.

### Chosen state boundary

Flow definitions and one reload-safe run context are added **inside the existing app-owned `axis_v60_state` object**:

```text
axis_v60_state
├─ sessions
├─ active
├─ profile
├─ prefs
├─ flows[]      durable intent definitions
└─ flowRun      current lightweight continuity, or null
```

There is no `axis_flow_*` localStorage key, no new IndexedDB database and no new persistence owner.

Old version-60 state with no `flows/flowRun` is accepted through the existing merge-load behavior. Boot does not force a rewrite; the fields are persisted naturally on the next relevant canonical `save()`.

Durable `flows` are included in AXIS data backup. Ephemeral `flowRun` is not added to the backup payload, matching the existing policy that current Active runtime is not part of that portable backup surface.

### Runtime ownership

`prepare-821-flow-runtime.mjs` runs after the 8.20.1 preparation seal and before hardened canonical bundling. It injects no extra browser bundle/request.

`window.__AXIS_FLOW_RUNTIME__` is an app-owned orchestration API. It may:

- list/save/remove Flow definitions;
- launch one Flow into a snapped run intent;
- expose exactly one current step;
- select that step through existing `selectEq()` plus the existing `axis:equipment-selected` lifecycle event;
- advance only after the current step produced a matching committed Encounter;
- skip without producing an Encounter;
- finish the run;
- project a temporary recording schema/execution only at the recording boundary.

It may **not** become a recorder, Active owner, Session writer or second Encounter writer.

### Temporary override boundary

Flow override must never change `axis818SchemaForEq()` / Object Truth globally.

Only these recording-only helpers see temporary context:

- `axis821SchemaForRecording(eq)`
- `axis821ExecutionForRecording(eq)`

The existing Object Truth, history detail, Evolution and reusable Object defaults continue to see the canonical Object schema.

The temporary schema is handed to the existing 8.18 app recorder. `v61` only reads the Flow bridge to decide whether to delegate to that recorder; v61 still owns genuine classic weight+reps set facts.

### Encounter provenance

The established `app.js` save boundary remains the only Encounter writer. Immediately before the existing `state.active.events.push(e)`, it may add `flowProvenance` if and only if the committed Object matches the current Flow step.

No provenance is attached to unrelated inserted reality. No Flow edit can rewrite an already saved Encounter.

Classic `sets` remains structural and is excluded from portable provenance metric IDs when weight+reps grants v61 ownership.

### Physical proof added

`scripts/axis-821-flow-runtime-smoke.mjs` now runs in the existing Current Release Gate on both Chromium and iPhone-like WebKit. It proves:

1. legacy state loads without destructive migration;
2. a Flow persists only inside `axis_v60_state` and survives reload;
3. launch creates no Encounter/Active metadata and exposes only current step A;
4. editing the durable Flow does not rewrite the running snapped intent;
5. A temporary `duration + pace` override uses the existing app recorder and does not mutate Object defaults;
6. the Encounter freezes schema/execution + `axis.flow-provenance.v1`;
7. B remains genuine v61 classic weight+reps/sets ownership;
8. C uses `complete` one-shot semantics and creates no false Active record;
9. later Flow edits do not change saved provenance;
10. no `axis_flow_*` key appears.

`scripts/axis-821-flow-runtime-contract.mjs` also runs in the existing Cross-Platform Foundation Gate and fails if a second Flow persistence namespace/owner appears.

## Still not implemented in Phase 2

- no visible Flow composition UI;
- no top-level Flow mode;
- no automatic transition ceremony;
- no auto-advance before Encounter commit;
- no insert/replace UI yet;
- no calendar/programming layer;
- no completion percentage, streak, XP or deviation warning;
- no 8.21 Production identity/release seal yet.

## Active Action Lens

The large one-hand Active control idea remains independent non-blocking research in `ACTIVE_ACTION_LENS_EXPERIMENT.md`. It has no permission to own Flow state, completion facts, Active truth or storage and is not a Phase 2 dependency.

## Validation for this work

Do not call Phase 2 sealed until the same exact head proves:

- Repository and Work Continuity success;
- Cross-Platform source/ownership contract success;
- deterministic build success;
- new 8.21 Flow runtime smoke success in Chromium and iPhone-like WebKit;
- inherited 8.20.1 Object reliability success;
- genuine v61 classic authority success;
- Runtime Foundation / Runtime / Deep Compatibility unchanged and green;
- no new storage namespace or duplicate writer;
- no page errors.

Public Production remains AXIS 8.20.1 throughout this work.

## Next planned stage

**Phase 3 — Minimal Flow composition / launch surface**

Only after the state/delegation truth path is sealed should AXIS add a compact mobile-first surface to compose/reorder Objects and launch a Flow. The UI must call the existing Phase 2 API rather than creating its own state semantics.

**Chat history is not authoritative project memory.** GitHub governance, current docs, contracts, tests and Production evidence are authoritative.
