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
- portable contracts: `axis.domain.v1`, `axis.data.v1`

Do not reopen 8.20.1 product behavior merely because an older release filename or historical compatibility source still exists.

## Active change

**AXIS 8.21 — Flow / Session Blueprint**

Active branch:

`product/821-flow-session-blueprint`

Draft PR: **#88** — `AXIS 8.21 — Flow / Session Blueprint Foundation`.

Current phase:

**Phase 0 — Flow Foundation + Ownership Contract**

8.21 is a product-capability release, not a maintenance patch.

### Why 8.21 exists

8.20.1 completes the single-Object execution chain:

```text
Object → metric schema / execution → Recording → Active or one-shot → Encounter
```

The next missing primitive is not another metric or exercise type. It is a lightweight way to arrange multiple reusable Objects into an intended sequence without turning the sequence into historical truth.

8.21 adds **Flow**.

```text
Flow intent
  ↓
ordered Object references + optional temporary step overrides
  ↓
existing recorder / Active / session owners
  ↓
immutable Encounter truth
```

### Product behavior contract

A Flow may look like:

```text
A → B → C
```

but real behavior may become:

```text
A → D → B
```

This is valid. AXIS records reality; it does not punish reality for differing from an intended sequence.

Required:

- ordered canonical Object references;
- lightweight start / advance / skip / insert / replace / finish behavior;
- no requirement that all Flow Objects become globally Active;
- temporary per-step recording/execution override where useful;
- override affects that step only and never mutates Object defaults;
- effective execution resolves before handing control to existing recording/Active owners;
- saved Encounter freezes the effective schema/execution semantics used at save time;
- additive Flow provenance may be frozen on Encounter without making history depend on live Flow state;
- Flow edits/deletion after the fact cannot rewrite old Encounters;
- domain-neutral behavior across compatible repeated practice;
- local-first and usable without network/AI.

Explicitly not 8.21:

- completion percentage;
- streak / XP / punishment;
- “deviation from plan” warnings;
- mandatory calendar scheduling;
- AI programming/coaching as the primary interface;
- a second Session or Encounter model;
- a second recorder or Active owner;
- a new persistence database;
- one mode per activity category;
- synthetic progress scoring.

### First engineering slice

Before adding any Flow store or new UI:

1. inspect existing plan, Group Plan, session, active and Object structures for reuse;
2. identify the smallest app-owned container that can hold Flow intent without becoming a new truth model;
3. define pure effective-step resolution;
4. define additive immutable Encounter provenance;
5. prove one physical path with three heterogeneous Objects;
6. only then add minimal visible Flow composition/launch interaction.

Target proof case:

```text
A = schema-driven non-classic Object
B = classic weight + reps / sets Object
C = one-shot / complete Object
```

Required behavior:

- launching the Flow does not mark A/B/C all Active;
- A routes through executable Object recording semantics;
- B routes through the existing v61 classic set owner;
- C completes without false persistent Active;
- a temporary override does not mutate the Object;
- inserting or skipping a step is valid;
- each Encounter freezes effective semantics and step provenance;
- reordering the Flow later leaves those Encounters unchanged.

### Persistence / ownership guard

Persistence location is deliberately **not preselected** in Phase 0.

Any implementation must reuse established app-owned state after inspecting current structures. A new database or parallel training store is forbidden.

Existing authoritative stores remain:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

Existing owners remain authoritative for training/session/Encounter, classic sets, Active, Capture/media and sound.

### Secondary, non-blocking experiment

**Active Action Lens** explores a larger, one-hand Active control surface for actions such as `完成一组`, `暂停`, and `完成`.

It is explicitly **not part of the 8.21 success definition**.

Allowed direction:

- presentation-only fixed viewport layer;
- explicit entry and easy dismissal;
- delegates to existing action owners;
- no storage, no new training state, no browser Fullscreen API;
- no global long-press/double-tap takeover;
- no impact on ordinary page scrolling or iOS edge-back outside the layer;
- safe cancel on pointer cancellation, visibility loss, page hide or multitouch;
- removable if mobile tests do not show a clear benefit.

See [`ACTIVE_ACTION_LENS_EXPERIMENT.md`](ACTIVE_ACTION_LENS_EXPERIMENT.md).

## Validation for this work

The first 8.21 behavior head must prove, on the same exact candidate:

- repository/work-continuity governance;
- deterministic canonical build;
- Chromium physical Flow path;
- iPhone-like WebKit physical Flow path;
- existing 8.20.1 Object reliability regression;
- classic v61 fallback/authority;
- no page errors;
- no second persistence owner;
- no duplicate Active/session/Encounter writer;
- historical Encounter immutability after Flow edits;
- Capture/Evidence/Evolution and deep compatibility remain intact;
- `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1` and `axis.data.v1` remain preserved as cross-platform continuity anchors.

Do not deploy 8.21 to Production merely because the Flow happy path works. It must pass the current full release/compatibility contract and exact-SHA Production discipline.

## Next planned stage

After Phase 0 contract/reuse inspection is sealed:

**Phase 1 — Flow Resolver + Encounter Provenance**

Implement the smallest pure resolver and additive provenance first. Visible Flow composition should sit on that proven foundation rather than inventing its own training semantics.

GitHub governance, current docs, contracts, tests and Production evidence are authoritative. Chat history is supplementary. A new chat should be able to resume by reading `governance/project-state.json`, `docs/HANDOFF.md`, this file and the 8.21 blueprint.
