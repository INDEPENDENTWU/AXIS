# AXIS Domain Runtime

`runtime/` contains the AXIS 8.13 decision, observation and narrowly-scoped presentation sources.

It is deliberately **not** a second workout database, recording owner, network client or AI coach.

## Current boundary — Stage 0/1 + Stage 2 + Stage 3

### Pure layers

1. `compat/axis-812-adapter.mjs` — conservative read-only translation of already-parsed 8.12 facts;
2. `axis-runtime.mjs` — deterministic remaining-workout projection;
3. `shadow/axis-shadow-runtime.mjs` — deterministic fingerprint/observation and projection-vs-reality diagnostics.

These remain platform-neutral and contain no browser/storage/network ownership APIs.

### Stage 3 browser presenter

`browser/axis-live-route-presenter.js` is intentionally **not** a pure domain module. It is the single read-only browser presentation owner for `Continue + Live Route`.

At build time, `prepare-813-live-route.mjs` embeds the exact pure Runtime + 8.12 adapter source with this presenter. `postbuild-813-live-route.mjs` injects the generated module into the already-canonical single runtime after all inherited 8.8–8.12 contracts pass.

The browser presenter may read authoritative `axis_v60_state`, `axis_v8_meta` and current event identity. It may render one route section. It may not persist route state, write training facts, call network APIs, or own completion/pause/resume/finish.

Current authoritative recording owners remain:

- workout/session facts: `app.js` + `axis_v60_state`;
- strength/activity facts: `v61.js` / existing active runtime + `axis_v8_meta`.

## Authoritative-fact rule

Reality may change the route; it does not change historical facts.

The adapter is intentionally conservative:

- `done`, `doneAt`, or authoritative `activity.completedSets` can establish performed strength work;
- `assumed` means unfinished/planned work;
- planned cardio duration is not completion while activity is active/paused;
- pause/rest state is not completion;
- archived sessions are historical facts;
- incomplete live evidence stays unfinished rather than becoming invented work.

## Projection interface

```js
projection = projectWorkout({
  now,
  session,
  history,
  goal,
  currentExercise,
  remainingMinutes,
  constraints: {
    occupied: [],
    excluded: [],
    intensity: 'normal',
    maxItems: null,
  },
});
```

The projection contains current, next, alternatives, remaining, dropped, normalized constraints, budget facts and reason codes.

## Stage 2 Shadow interface

```js
observation = observeAxis812Shadow({
  now,
  core,
  meta,
  currentEventId,
  remainingMinutes,
  constraints,
});
```

Shadow observation remains evidence-only and outside the browser product. Stage 2 CI exercises real 8.12 transitions in Chromium and iPhone-like WebKit without loading Runtime code into the page.

## Stage 3 Live Route interface

The product-side diagnostic is:

```js
window.__AXIS_813_ROUTE__
```

It exposes only presentation diagnostics and explicit read/re-render helpers:

- owner `v813-live-route`;
- `recordingOwner: false`;
- `storageOwner: false`;
- `networkOwner: false`;
- `writes: 0`;
- current route state;
- `refresh()`;
- read-only `snapshot()`.

The visible route intentionally excludes the factual current item because the existing active card already owns that information. Only evidence-backed future continuation is presented.

If there is no active workout, no useful future evidence, or a Runtime/presenter error, the route hides and the existing 8.12 product continues unchanged.

## Design rule

**Facts first. Projection second. Presentation third. Ownership transfer last.**

Stage 3 transfers only continuation presentation. Stage 4 may later add explicit temporary Reality Actions; recording and historical facts remain authoritative until a separate owner-transfer stage proves it can safely retire the old writer.
