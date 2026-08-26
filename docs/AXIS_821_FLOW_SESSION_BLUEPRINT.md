# AXIS 8.21 — Flow / Session Blueprint

Status: **current milestone architecture contract**

Baseline: **AXIS 8.20.1** · `fdbfea738489fca6b19b3c8c7b502977373e4e4f`

Branch: `product/821-flow-session-blueprint`

## 1. Product statement

AXIS 8.21 introduces **Flow**: a lightweight, reality-tolerant sequence of reusable Practice Objects.

Flow is not a workout plan database, a completion score, a calendar or a second Session model.

```text
Flow = intended continuity
Encounter = factual history
```

A Flow may say:

```text
A → B → C
```

while real practice becomes:

```text
A → D → B
```

The second sequence is valid. AXIS should make that reality easy to continue and record, not label it as failure.

## 2. Foundation inherited from 8.20.1

8.21 must reuse these established truths:

### Object

A reusable practice identity with current/default recording semantics.

Important current fields/semantics include:

- canonical Object identity;
- explicit `metricSchema` where configured;
- current/default executable semantics resolved by `window.__AXIS_EXECUTABLE_OBJECTS__`;
- compatibility fallback only when no explicit current schema exists.

### Execution

Current execution modes:

```text
single | sets | rounds | timed | hold | complete
```

Ongoing:

```text
sets | rounds | timed | hold
```

One-shot:

```text
single | complete
```

### Encounter

Encounter is immutable factual truth after save.

Current releases already freeze:

- `metricSchemaSnapshot`
- `executionModeSnapshot`
- factual recorded metrics
- existing evidence/media references where present

8.21 may add Flow provenance, but it may not replace these snapshots with pointers to mutable Flow/Object state.

## 3. Flow domain model

This is the **semantic model**, not authorization for a new database or final storage shape.

```text
Flow
 ├─ id
 ├─ title?                  optional human label/context
 ├─ steps[]                 ordered intent
 │   └─ FlowStep
 │       ├─ id
 │       ├─ objectRef       canonical Object identity
 │       ├─ metricOverride? temporary, optional
 │       ├─ executionOverride? temporary, optional
 │       ├─ repeat?         lightweight intent, optional
 │       └─ note/context?   only if it improves real use
 └─ metadata?               created/updated facts only if needed
```

Runtime orchestration is conceptually separate:

```text
FlowRun
 ├─ flowRef
 ├─ currentStepRef
 ├─ consumedStepRefs[]
 ├─ skippedStepRefs[]
 └─ inserted/replaced reality
```

Do **not** assume `FlowRun` needs durable independent storage. Phase 0 must inspect existing session/plan state and choose the smallest compatible representation.

## 4. Effective step resolver

Recording semantics for a Flow step must be resolved once at the handoff boundary before existing recorder/Active owners act.

Conceptual precedence:

```text
explicit temporary Flow-step override
            ↓
Object-specific executable defaults
            ↓
existing global/default fallback
            ↓
legacy compatibility fallback only when current truth is absent
```

Important distinction:

- **what to record** = effective metric schema
- **how it progresses** = effective execution mode

A Flow override is ephemeral context. It does not write back into the referenced Object.

Pure resolver output should be sufficient for downstream delegation, for example:

```text
ResolvedFlowStep
 ├─ flowRef
 ├─ stepRef
 ├─ objectRef
 ├─ effectiveMetricSchema
 ├─ effectiveExecutionMode
 ├─ overrideProvenance
 └─ next-intent context
```

The resolver itself must be pure/read-only.

## 5. Encounter provenance

When a Flow-launched action becomes a saved Encounter, history may receive additive frozen provenance such as:

```text
flowRef
flowStepRef
flowSnapshot? / flowContextSnapshot?
```

Only add fields that survive this test:

> If the Flow is edited, reordered or deleted tomorrow, can the Encounter still explain what happened yesterday without querying that live Flow?

At minimum, existing `metricSchemaSnapshot` and `executionModeSnapshot` remain authoritative for what/how the Encounter was recorded.

Possible provenance should identify **where the intent came from**, not make Flow the owner of factual metrics.

## 6. Orchestration behavior

### Launch

Launching a Flow selects the first actionable step. It must not mark every referenced Object as Active.

### Record / start

A step delegates to the existing Object recording path.

- schema-driven non-classic Object → existing executable Object recorder
- genuine classic weight+reps sets Object → existing v61 path
- timed/hold/rounds → existing ongoing Active lifecycle as resolved
- single/complete → one-shot behavior without false persistent Active

### Advance

After a step produces its real result, the Flow can make the next intended Object immediately available with minimal visual ceremony.

No giant “success” screen is required. The product should feel continuous rather than gamified.

### Skip

Skip changes Flow runtime intent only. It does not create an Encounter and is not a failed record.

### Insert / replace

The user may do something not in the original sequence. AXIS should allow the new Object to be recorded normally and then continue the Flow if the user wants.

The real Encounter sequence remains factual history.

### Finish early

Finishing early is valid. No completion score is required.

## 7. Repetition and Group Plan boundary

Do not conflate two different concepts:

- a Flow sequences Objects;
- Group Plan / classic set planning describes repeated set-level execution inside a compatible Object.

For a classic strength Object, Flow should hand control to the established v61/Group Plan semantics rather than recreating sets inside Flow.

If Flow-level `repeat` is introduced, it must mean **repeat this step/sequence intent**, not take ownership of classic set facts.

## 8. Storage decision rule

8.21 is not authorized to add a new IndexedDB database, localStorage namespace or parallel training store merely for architectural neatness.

Before persistence code:

1. inspect existing `axis_v60_state` plan/session/profile structures;
2. inspect Group Plan and Live Route structures for reusable intent-only concepts;
3. identify the one existing app-owned state boundary that can host Flow definitions/runtime context without corrupting Session/Encounter truth;
4. document the chosen field/schema and migration behavior;
5. add repository/runtime contract coverage before relying on it.

A Flow definition can be durable intent, but the **owner remains the established app state owner** unless an explicit owner migration is separately proved.

## 9. UI principles

Flow should not become a new heavy top-level mode unless real use proves it necessary.

Desired feel:

- quick to compose from existing Objects;
- compact ordered sequence;
- one clear current step;
- next step visible without demanding attention;
- skip/replace/insert are natural;
- no “80% complete” framing;
- no forced confirmation between every step;
- no duplicated recording controls inside the Flow surface;
- mobile-first touch targets and iOS-safe navigation;
- desktop/web width can reveal more context without changing semantics.

The current Active surface remains the place where ongoing execution is actually controlled.

## 10. First reference scenario

Use a heterogeneous three-step test, not three classic exercises.

Example semantic fixture:

```text
A: duration + intensity → timed
B: weight + reps       → sets
C: completion-only     → complete/single
```

Required physical flow:

1. create/seed canonical Objects A/B/C;
2. create a Flow referencing them;
3. launch Flow without marking B/C Active;
4. A opens the schema-driven recorder and enters correct timed Active behavior;
5. finish A, Flow points to B;
6. B opens the classic v61 sets path and keeps all existing set ownership;
7. skip or insert another Object once to prove reality-tolerance;
8. C uses one-shot completion with no false Active;
9. inspect Encounters: effective schema/mode + Flow provenance frozen;
10. edit/reorder the Flow;
11. reload;
12. old Encounters remain unchanged and readable.

Run on Chromium and iPhone-like WebKit.

## 11. Release-blocking invariants

8.21 must fail release if any of these occur:

- explicit Object schema falls back to unrelated legacy fields;
- Flow override mutates reusable Object defaults;
- Flow creates a second recorder, Active owner, Session writer or Encounter writer;
- a new persistence database/store is introduced without an explicit reviewed owner migration;
- historical Encounter changes after Flow edit/reorder/delete;
- classic v61 facts are duplicated into another owner;
- all Flow Objects become globally Active merely because the Flow starts;
- skip/insert/reorder is treated as corrupted state;
- Capture/Evidence/Evolution/Language/runtime compatibility regresses;
- Chromium and WebKit disagree on saved truth or user-visible lifecycle.

## 12. Non-goals

Not 8.21:

- AI auto-programming;
- coach chat;
- calendar scheduling system;
- completion percentage;
- streaks / badges / XP;
- social challenge semantics;
- punishment for deviation;
- auto-editing historical facts;
- separate domain modes for gym/running/music/etc.;
- another storage architecture rewrite.

## 13. Relationship to 8.22

8.22 may use factual Encounter/Flow history to infer **adaptive defaults** only after 8.21 semantics are sealed.

8.22 should make likely values/transitions easier to accept, not turn Flow into prescriptive coaching.

The intended direction is lower friction:

```text
more repeated factual use
        ↓
fewer questions / better defaults
        ↓
less interface attention
```

## 14. Relationship to Active Action Lens

`ACTIVE_ACTION_LENS_EXPERIMENT.md` is an independent presentation experiment.

Flow may benefit from a better Active control experience, but 8.21 architecture and release success must not depend on the Lens. The Lens has no permission to own Flow state, execution truth or history.
