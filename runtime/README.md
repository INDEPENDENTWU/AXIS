# AXIS Domain Runtime

`runtime/` is the platform-neutral workout decision and observation layer being introduced during the AXIS 8.13 migration cycle.

It is deliberately **not** a second workout database, recording owner, DOM controller, network client or AI coach.

## Current boundary — Stage 0/1 + Stage 2

The current Runtime stack has three pure layers:

1. `compat/axis-812-adapter.mjs` — conservative read-only translation of already-parsed 8.12 facts;
2. `axis-runtime.mjs` — deterministic remaining-workout projection;
3. `shadow/axis-shadow-runtime.mjs` — deterministic fingerprint/observation and projection-vs-reality diagnostics.

None of these modules is referenced by `build-release.mjs` or loaded by the AXIS 8.12 browser product.

Current authoritative owners remain:

- workout/session facts: `app.js` + `axis_v60_state`;
- strength/activity facts: `v61.js` + `axis_v8_meta`.

## Authoritative-fact rule

Reality may change the route; it does not change historical facts.

The adapter is intentionally conservative:

- `done`, `doneAt`, or authoritative `activity.completedSets` can establish performed strength work;
- `assumed` means unfinished/planned work;
- a planned cardio duration is not completion while its activity is active/paused;
- pause/rest state is not completion;
- archived sessions are historical facts.

When evidence is incomplete, the adapter prefers unfinished/unknown over fabricated completion.

## Projection interface

```js
projection = projectWorkout({
  now,
  session,
  history,
  goal,
  currentExercise,
  remainingMinutes, // or leaveAt
  constraints: {
    occupied: [],
    excluded: [],
    intensity: 'normal', // normal | less | minimum
    maxItems: null,
  },
});
```

The projection contains:

```js
{
  current,
  next,
  alternatives,
  remaining,
  dropped,
  constraints,
  budget,
  reasonCodes,
}
```

A projection is advisory until a later release explicitly transfers narrow presentation ownership. It may never fabricate completed work or rewrite history.

## Shadow interface

```js
observation = observeAxis812Shadow({
  now,
  core,            // parsed axis_v60_state
  meta,            // parsed axis_v8_meta
  currentEventId,  // observed current event identity
  remainingMinutes,
  constraints,
});
```

An observation contains:

```js
{
  fingerprint,
  input,
  facts,
  projection,
  diagnostics,
}
```

`compareShadowObservations(previous, current)` can describe factual changes such as same-item progress or a current-event change and compare them with the previous projection. The result is diagnostics only; it cannot change product state.

## Stage 2 browser boundary

The browser Shadow harness lives under `scripts/`, not inside the application bundle. It lets the unchanged 8.12 product execute normal recording transitions, then reads authoritative state at narrow boundaries and runs the pure Shadow Runtime in the test process.

This deliberately preserves a hard failure boundary:

- Runtime exception -> diagnostic failure only;
- no product DOM owner;
- no storage writer;
- no network request;
- no route presentation;
- no recording side effect.

Dedicated Stage 2 CI verifies this in Chromium and iPhone-like WebKit and also requires byte-exact 8.12 Production parity against the PR base.

## Design rule

**Observe first. Transfer ownership later.**

Stage 2 exists to collect deterministic evidence that the Runtime understands real 8.12 facts. `Continue + Live Route` belongs to a later Stage 3 change after the exact Stage 2 candidate is fully green.
