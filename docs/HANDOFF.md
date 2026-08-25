# AXIS Engineering Handoff

This is the human/agent handoff entry for the current repository state. Chat transcripts are supplementary only.

## 1. Sealed Production baseline

**AXIS 8.20.1 — Executable Object Reliability** is the current Production Web release.

Exact sealed main SHA:

`fdbfea738489fca6b19b3c8c7b502977373e4e4f`

### Vercel

- fixed Production: `https://axis-five-puce.vercel.app`
- deployment: `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD`
- state: **READY**
- exact source SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- Production browser gate: run `32812905314` — **success**

### EdgeOne

- fixed Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment: `dpemq8bxjopa`
- verification run: `32812883590` — **success**
- exact source/artifact parity with Vercel: **success**
- fixed-domain bounded convergence: **success**
- real Chromium current-release flow: **success**
- real iPhone-like WebKit current-release flow: **success**
- final `EdgeOne Production` status: **success**

The fixed Production manifest reports `version/baseVersion = 8.20.1`, `architecture = canonical-single-runtime`, core `1269a6183152`, CSS `fc372a0bf2f9`, one initial JavaScript request and zero dynamic JavaScript requests.

## 2. What 8.20.1 means architecturally

The current recording chain is:

```text
Object
  ↓
metricSchema + default execution semantics
  ↓
existing Recording owner
  ↓
existing Active lifecycle when execution is ongoing
  ↓
Encounter
  ├─ metricSchemaSnapshot
  ├─ executionModeSnapshot
  └─ factual metrics / evidence references
```

Important current truths:

- `metricSchema` defines **what is recorded**.
- `executionMode` defines **how execution progresses**.
- supported execution semantics are `single`, `sets`, `rounds`, `timed`, `hold`, `complete`.
- `single/complete` must not create false ongoing Active state.
- `sets/rounds/timed/hold` may use existing ongoing lifecycle semantics.
- classic v61 metadata authority is still restricted to immutable weight+reps Encounter schemas.
- `window.__AXIS_OBJECT_TRUTH__` is Object/schema truth API; it is not a second store.
- `window.__AXIS_EXECUTABLE_OBJECTS__` resolves executable semantics/bridges recording; it is not a second store, recorder, Active owner or Encounter writer.
- current authoritative stores remain exactly `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`.

The 8.20.1 regression that must never return: an explicit pace/duration/etc. Object must not fall back to weight/reps/sets because its old coarse type is `strength/cardio`, and a timed/hold Object must not disappear from ongoing Active merely because it is not a classic set exercise.

## 3. Current work

**AXIS 8.21 — Flow / Session Blueprint**

Active branch:

`product/821-flow-session-blueprint`

Current phase:

**Phase 0 — Flow Foundation + Ownership Contract**

8.21 is a product-capability release, not a maintenance patch.

### Product purpose

A Flow is a lightweight arrangement of reusable Objects, for example:

```text
A → B → C
```

It represents intent and transition context. It is **not** historical truth and does not require reality to obey it.

If the real sequence becomes:

```text
A → D → B
```

AXIS should record that reality without penalty, fake completion math or a “deviation” error state.

### Non-negotiable Flow invariants

1. Flow must not require every referenced Object to become globally Active.
2. Flow may provide a temporary per-step metric/execution override, but that override may not mutate the reusable Object defaults.
3. Existing recording/Active/session/Encounter owners remain authoritative.
4. No second training database, Session writer, Encounter writer, recorder or Active owner.
5. A saved Encounter freezes the effective schema/execution semantics used at that moment.
6. Flow provenance may be additive (`flowRef`, `flowStepRef`, frozen effective override provenance), but old Encounters may not depend on live Flow state.
7. Editing/reordering/deleting a Flow later must not rewrite historical Encounters.
8. Skip, insert, replace, pause and early finish are valid reality, not failure states.
9. Flow must remain domain-neutral: gym, running, rehab, climbing, dance, music/skill practice and other compatible repeated practice should use the same primitive.
10. 8.21 must not introduce streaks, XP, completion percentages, AI coaching copy, rigid calendar programming or category-specific modes.

Read [`AXIS_821_FLOW_SESSION_BLUEPRINT.md`](AXIS_821_FLOW_SESSION_BLUEPRINT.md) before implementation.

## 4. First engineering slice for 8.21

Do not create a new planner/store first.

Inspect and reuse the repository’s existing plan/group-plan/session structures. Then implement the smallest Flow foundation that can prove:

- an ordered set of canonical Object references;
- effective step resolution (`Object defaults → temporary Flow override → existing global/default fallback` where applicable);
- start/advance/skip/insert/finish orchestration that delegates to existing owners;
- A can be a schema-driven timed/single Object;
- B can be a genuine classic weight+reps/sets Object using v61;
- C can be one-shot/complete;
- the user can deviate without corrupting the Flow or history;
- saved Encounters freeze effective semantics/provenance;
- changing the Flow afterwards does not rewrite old Encounters;
- Chromium and iPhone WebKit both pass with no page errors and no extra persistence owner.

Persistence location is **not pre-authorized**. Reuse an existing app-owned state container only after inspecting current structures and proving there is no competing truth model.

## 5. Secondary interaction research — not a release blocker

There is one approved exploration: **Active Action Lens**.

Goal: make high-frequency Active actions such as `完成一组`, `暂停`, `完成` easier to hit one-handed without making the normal Active surface noisy or changing action ownership.

Boundary:

- presentation-only;
- explicit opt-in entry;
- fixed viewport layer inside the Web App, not browser Fullscreen API;
- delegates to existing completion/pause/session owners;
- zero storage and zero new training state;
- normal tap semantics remain unchanged;
- normal page scrolling/iOS edge-back behavior remain untouched outside the Lens;
- close/downward-dismiss is immediate and creates no training fact;
- pointer cancel, page hide, visibility loss and multitouch fail safe;
- reduced-motion safe;
- if real mobile testing shows no meaningful benefit, retire it rather than forcing it into 8.21.

Read [`ACTIVE_ACTION_LENS_EXPERIMENT.md`](ACTIVE_ACTION_LENS_EXPERIMENT.md). Do not make this experiment a dependency of Flow.

## 6. Ownership summary

- base session/Object/Encounter state: `app.js` / `axis_v60_state`
- classic set metadata: `v61.js` / `axis_v8_meta`, only where immutable classic schema permits
- ongoing Active: existing v82/v87 lifecycle/presentation owners
- media capture/persistence: `app.js` / `axis_v42_media`
- source-first media resolution: existing read bridge
- automatic sound: established v8710 owner
- Evolution: derived read-only projection
- learning: isolated `axis_v89_speak`
- Flow 8.21: **not yet an authoritative owner**; orchestration must delegate
- Active Action Lens: **presentation experiment only**

See [`../governance/owners.json`](../governance/owners.json) and [`../governance/retirements.json`](../governance/retirements.json).

## 7. Cross-platform continuity

Preserve:

- native foundation ID: `axis-native-foundation-0`
- native repo: `INDEPENDENTWU/AXIS-iOS`
- portable contracts: `axis.domain.v1`, `axis.data.v1`

8.21 should define Flow semantics in a portable/domain-neutral way. Browser DOM shape, event hacks and CSS are not the portable contract.

## 8. Required reading order when resuming in a new chat/session

1. `governance/project-state.json`
2. this file
3. `CURRENT_RELEASE.md`
4. `CURRENT_WORK.md`
5. `AXIS_821_FLOW_SESSION_BLUEPRINT.md`
6. `governance/owners.json` + `governance/retirements.json`
7. relevant runtime contracts/tests
8. exact current Production manifest/status before declaring or changing a release

If this handoff conflicts with current Git or Production, verify the repository/deployment and repair this handoff. Do not repair reality to match stale documentation.
