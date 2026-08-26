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

## 2. Established owners that 8.21 may not replace

- Session/Object/Encounter truth: `app.js` / `axis_v60_state`
- classic weight+reps set facts: `v61.js` / `axis_v8_meta` only where immutable schema permits
- ongoing Active: established v82/v87 lifecycle/presentation owners
- media: established app/source-first owners / `axis_v42_media`
- learning: `axis_v89_speak`
- portable Metric/Flow contracts: derived semantics, not alternate training storage

`metricSchemaSnapshot` remains Encounter authority for what was recorded; `executionModeSnapshot` remains authority for how it executed.

## 3. Current milestone

**AXIS 8.21 — Flow / Session Blueprint**

- branch: `product/821-flow-session-blueprint`
- Draft PR: **#88**
- current phase: **Phase 2 — App-owned Flow Definition / Runtime Boundary**

### Prior exact-head proofs

- Phase 0 ownership/reuse: `84310744b528441f3fa8d3feb51e8ed149e02b78` — all nine baseline PR workflow families success.
- Phase 1 portable resolver: `2892d8807e6d2688cb366019d64c6e9b573fcb66` — all nine success including Flow resolver contract.
- Phase 1B immutable provenance: `289fd1b2cdcbcb4e1cfa56402372b8005daadfa4` — final all nine success.

Phase 1B run IDs:

- EdgeOne package `32879396817`
- Repository `32879396818`
- PR Convergence `32879396830`
- Cross-Platform `32879396838`
- Work Continuity `32879396815`
- Runtime Foundation `32879396831`
- Deep Compatibility `32879396864`
- Runtime `32879396825`
- Current Release `32879396826`

Current Release Chromium had one inherited 8.16 Capture async timeout on the first attempt. The branch had not changed Capture/runtime/CSS; WebKit passed. The same Chromium job was rerun unchanged and passed the same Capture point plus all later checks. No product code/test threshold was altered.

## 4. Portable Flow contracts already sealed

- `axis.flow.v1`
- `axis.flow-provenance.v1`
- pure resolver/provenance module: `lib/axis-flow.mjs`
- contract: `scripts/axis-821-flow-contract.mjs`

Flow means intended continuity; Encounter remains factual history. A Flow can say `A → B → C` while real practice becomes `A → D → B` without an error/deviation state.

Temporary step override never mutates reusable Object defaults. `axis.flow-provenance.v1` is a compact detached source-context snapshot and does not replace full Encounter fact snapshots.

## 5. Phase 2 candidate state decision

Phase 2 deliberately reuses the existing app-owned `axis_v60_state` object instead of creating a new store:

```text
axis_v60_state
├─ sessions
├─ active
├─ profile
├─ prefs
├─ flows[]
└─ flowRun
```

- `flows[]` = durable Flow intent definitions.
- `flowRun` = one lightweight reload-safe current continuity snapshot, or `null`.
- old version-60 states without these fields remain valid through existing merge-load behavior.
- boot does not force a migration write.
- durable `flows` are included in backup; current `flowRun` is not.
- no `axis_flow_*` localStorage key and no new IndexedDB database are allowed.

This decision is under exact-head CI until the Phase 2 head is green.

## 6. Phase 2 runtime boundary

`prepare-821-flow-runtime.mjs` is imported after `prepare-8201-release.mjs` and before hardened canonical bundling. It injects no extra browser JS request.

It exposes `window.__AXIS_FLOW_RUNTIME__` with app-owned intent operations:

- list/save/remove Flow definitions;
- launch a snapped run;
- resolve exactly one current step;
- `selectCurrent()` delegates to canonical `selectEq()` and publishes the already-established `axis:equipment-selected` lifecycle event;
- advance only after a matching Encounter was committed;
- skip with no Encounter;
- finish the run;
- expose temporary recording-only schema/execution handoff.

It explicitly reports:

- `storage: axis_v60_state`
- `newStorage: false`
- `newRecorder: false`
- `newActiveOwner: false`
- `newEncounterWriter: false`

## 7. Recording / Object boundary

Do **not** modify `axis818SchemaForEq()` globally for Flow context. That function is still Object Truth and is read by history/Evolution/detail surfaces.

Temporary context is visible only through:

- `axis821SchemaForRecording(eq)`
- `axis821ExecutionForRecording(eq)`

The existing app recorder uses those only for the current save. Reusable Object defaults remain unchanged.

`v61` may query the Flow runtime only to decide whether a temporary schema delegates to the existing schema recorder. It still exclusively owns genuine classic repeated-set metadata.

## 8. Encounter provenance integration

The existing `app.js` save path remains the only Encounter writer.

Immediately before the existing `state.active.events.push(e)`, Phase 2 may attach `e.flowProvenance` only when the committed Object matches the current Flow step.

This means an unrelated Object inserted into reality does not receive false current-step provenance.

Classic structural `sets` is filtered from portable provenance metric IDs when the immutable shape is weight+reps; v61 remains the fact owner for actual set rows.

No automatic Flow advance occurs before/without a matching committed Encounter. This is intentionally conservative around Undo and post-commit lifecycle semantics.

## 9. Phase 2 physical proof

`scripts/axis-821-flow-runtime-smoke.mjs` is wired into the existing Current Release Gate for Chromium and iPhone-like WebKit after the inherited 8.20.1 smoke.

It proves:

1. legacy same-version state is accepted;
2. Flow definition persists only inside `axis_v60_state` and survives reload;
3. launch creates no Encounter or Active metadata;
4. launch snapshots the ordered run so editing the durable Flow does not rewrite the current run;
5. A temporary `duration + pace` override records through the existing app recorder while the Object keeps `duration + intensity` defaults;
6. the Encounter freezes Flow provenance plus current schema/execution snapshots;
7. B still creates v61-owned classic set metadata;
8. C with `complete` creates no false Active activity record;
9. later Flow edits do not rewrite saved Encounter provenance;
10. no separate Flow localStorage namespace appears.

`scripts/axis-821-flow-runtime-contract.mjs` is also wired into Cross-Platform Foundation to seal ownership/persistence restrictions.

## 10. Still not part of Phase 2

Do not add yet:

- visible Flow composer;
- heavy planner/top-level Flow mode;
- auto-advance animation/celebration;
- calendar programming;
- completion percentage/streak/XP;
- AI coach copy;
- a second training store;
- 8.21 Production identity/release seal.

## 11. Active Action Lens

`ACTIVE_ACTION_LENS_EXPERIMENT.md` remains independent, non-blocking presentation research. It has no permission to own Flow state, completion facts, Active truth or storage.

## 12. Cross-platform continuity

Preserve:

- `axis-native-foundation-0`
- `INDEPENDENTWU/AXIS-iOS`
- `axis.domain.v1`
- `axis.data.v1`
- additive `axis.flow.v1`
- additive `axis.flow-provenance.v1`

Browser DOM/CSS details are not portable domain contracts.

## 13. Resume order

1. `governance/project-state.json`
2. this file
3. `CURRENT_RELEASE.md`
4. `CURRENT_WORK.md`
5. `AXIS_821_FLOW_SESSION_BLUEPRINT.md`
6. `governance/owners.json` + `governance/retirements.json`
7. `lib/axis-flow.mjs`
8. `prepare-821-flow-runtime.mjs`
9. `scripts/axis-821-flow-contract.mjs`
10. `scripts/axis-821-flow-runtime-contract.mjs`
11. `scripts/axis-821-flow-runtime-smoke.mjs`
12. exact current PR workflow state before advancing Phase 2 or declaring a release

If documentation conflicts with current Git/CI/Production, verify reality first and repair the handoff rather than changing reality to match stale text.
