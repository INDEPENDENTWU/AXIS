# AXIS Domain Runtime

`runtime/` is the platform-neutral workout decision layer being introduced for the AXIS 8.13 cycle.

It is deliberately **not** a second workout database, recording owner, planner, DOM controller or AI coach.

## Stage 0/1 boundary

At this stage the runtime:

- accepts already-parsed snapshots and explicit real-world constraints;
- normalizes AXIS 8.12 state through a read-only compatibility adapter;
- produces a deterministic remaining-workout projection;
- can model a time budget, occupied equipment and explicit `normal` / `less` / `minimum` intensity;
- emits reason codes for tests and diagnostics;
- writes nothing;
- imports no browser, storage, network, media or AI API;
- is not referenced by `build-release.mjs` and therefore does not alter the current 8.12 browser product.

Current authoritative owners remain:

- workout/session facts: `app.js` + `axis_v60_state`;
- strength draft and set facts: `v61.js` + `axis_v8_meta`.

## Interface

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

A projection is advisory until a later release explicitly transfers narrow ownership. It may never fabricate completed work or rewrite history.

## Design rule

Reality may change the route; it does not change historical facts.

`occupied`, a shorter time budget or `less` only recompute what remains. They do not delete a completed set, create a fake completion or force the user to restart a workout.
