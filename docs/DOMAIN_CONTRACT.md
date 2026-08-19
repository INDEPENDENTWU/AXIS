# AXIS Domain Contract v1

## Purpose

This document defines platform-independent AXIS workout truth. Web, iOS, watchOS, Android, server adapters and AI features may render or enrich this truth, but they may not redefine it.

The contract is intentionally narrower than any UI. It exists to keep behavior identical across platforms and to prevent duplicated state ownership.

## Contract identity

- Contract: `axis.domain.v1`
- Status: foundation
- Compatibility rule: additive changes are allowed only when existing semantics stay unchanged. Semantic changes require a new contract version and an explicit migration/compatibility plan.

## Core entities

### WorkoutSession

A user-initiated workout container.

Required semantic fields:

- stable session identifier;
- real session start evidence;
- optional real session end evidence;
- ordered activity identities;
- immutable historical completion facts once archived;
- revision/update metadata at persistence boundaries.

A session is not required to have a cloud account or network connection.

### Activity

One selected equipment/exercise instance inside a workout session.

An activity may be active, paused, finished, or legacy-only historical evidence. Activity state must be derived from authoritative domain facts, not from visible UI labels.

### Interval

A real active-time segment `{start,end}` for one activity.

Rules:

- start/resume opens an interval;
- pause/finish/switch-away closes the currently open interval;
- finished intervals have `end >= start`;
- an activity may contain multiple intervals;
- effective activity duration is the sum of its real intervals;
- legacy duration/doneAt evidence is fallback only when interval evidence does not exist.

### SetRecord

A strength-training set fact owned by the recording domain. A set may include weight, repetitions, completion time and optional user-entered metadata. UI projections may summarize sets but must not invent completed sets.

### ExerciseIdentity

A stable equipment/exercise identity.

Resolution order may include canonical library identity, custom identity, extended-library identity and historical fallback. Historical deletion from the personal library must not invalidate workout history.

### DomainEvent

An immutable semantic fact accepted by the domain reducer. Initial v1 event names include:

- `workoutStarted`
- `activityStarted`
- `activityPaused`
- `activityResumed`
- `activityFinished`
- `setCompleted`
- `equipmentSelected`
- `workoutFinished`

Platform-specific gestures are not domain events. For example, a long press is a UI gesture that may dispatch `workoutFinished`; the long press itself is not workout truth.

## Timing semantics

### Activity duration

`effectiveActivityDuration = sum(real activity intervals)`

Paused time is never active duration.

### Session active duration

Session active duration is the union of all real activity intervals across the session. Overlapping/interleaved evidence must not be double-counted.

### Session bounds

Session start/end use stored session facts plus activity evidence. Completion must preserve factual start and end when they differ.

### Project gap

`项目间歇` means elapsed time since the latest real activity boundary while no activity is active.

It must never be inferred from event insertion order.

For `A → B → A`, after final A ends, the gap begins at final A's real end, not B's earlier end.

## Switch semantics

When switching away from an activity:

- incomplete strength activity becomes paused;
- a strength activity whose planned set count is fully completed may finish at the switch boundary;
- cardio becomes paused unless the user explicitly finishes it;
- switching must never fabricate active time.

## Completion semantics

Workout completion has exactly one authoritative state transition owner per platform shell.

Completion must:

1. close/seal any remaining open activity interval according to the real completion boundary;
2. archive/persist the completed workout through the authoritative persistence owner;
3. preserve session start/end evidence;
4. expose completed state to projections;
5. never allow a UI-only owner and storage-only owner to disagree about whether the workout is complete.

## Quick Record semantics

Recent items are direct actions.

- selecting a resolvable recent identity opens the existing recording editor directly;
- full catalog browsing is explicit;
- history-only identities may resolve through a compatibility fallback;
- selection projections do not become storage owners.

## Live Route semantics

`接下来` / Live Route is a projection, not factual workout state.

- suggestions are advisory;
- ignoring a suggestion has no penalty;
- suggestions recompute from actual records;
- tapping a suggestion may delegate to Quick Record;
- merely viewing/tapping a suggestion does not write workout, completion, storage or network state;
- recommendation compliance is never used as factual completion evidence.

## Local-first invariant

A workout must remain recordable and finishable without:

- account;
- network;
- AI;
- cloud sync.

Network, AI and sync are optional adapters. They are never the live workout owner.

## Single-owner invariant

Every semantic action has one authoritative writer for state and one declared persistence owner.

Examples:

- domain reducer: workout state transitions;
- recording owner: completed set facts;
- media owner: media persistence;
- platform projection owner: UI rendering only;
- sync owner: mirror/convergence only.

No platform may introduce a second authoritative workout store.

## Projection invariant

UI is a projection of domain facts and context.

A projection may include:

- current activity;
- rest/between state;
- effective durations;
- next suggestion;
- alternatives;
- completion summary;
- reason codes for diagnostics/tests.

A projection cannot create historical facts.

## Cross-platform equivalence

The same normalized initial state plus the same ordered domain events must produce equivalent domain state on Web and iOS.

Golden fixtures in `shared/fixtures/` are normative regression examples. A platform implementation that disagrees with a fixture is considered incorrect until the contract or fixture is deliberately versioned.

## Forbidden shortcuts

- DOM text as state truth;
- view-local copies that can commit workout facts independently;
- silent schema mutation;
- recommendation state treated as workout history;
- server response treated as a second live workout database;
- platform API callbacks directly mutating persistence without the domain transition boundary.
