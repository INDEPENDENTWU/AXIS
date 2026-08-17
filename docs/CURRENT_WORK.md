# AXIS Current Work

> Canonical engineering handoff. Read this before modifying AXIS. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest development state and next controlled step.

## Production baseline at start of this work

- Public product: AXIS 8.12
- Verified `main`: `7d2c703ec85abc8a01ee43de4d99ea9402695fbf`
- Architecture: `canonical-single-runtime`
- Verified Production release hash: `ad14cad78a8d`
- Verified canonical runtime marker: `74c57baa7159`
- Verified CSS marker: `b59f3946c3e5`
- Fixed Production endpoint: `axis-five-puce.vercel.app`
- Vercel Production deployment for this baseline is `READY` and reports the exact `main` source SHA above.
- `AXIS Production Deployment Gate` passed against the fixed Production endpoint, including real Chromium inherited product, 8.11 Experience and 8.12 Language Studio gates.
- PR #36 is merged. Its 8.12 field hardening is now Production behavior, not pending work.

## Active change

**AXIS 8.13 Stage 2 — Shadow Runtime** is active on `feat/813-shadow-runtime`.

The purpose of Stage 2 is to feed real, authoritative 8.12 browser snapshots into the already-pure Reality Runtime and compare projections while the existing 8.12 product remains the sole authority.

Stage 2 is an observation/evidence stage, not a UI or ownership transfer.

### Runtime input truth

The Shadow Runtime may observe only already-existing authoritative facts:

- `axis_v60_state` / `app.js` workout and session state;
- `axis_v8_meta` / `v61.js` activity and strength-set facts;
- explicit current event identity supplied by the observation boundary;
- explicit temporary constraints used by the test sequence.

It may not infer completed work from planned values alone.

The 8.12 adapter must therefore understand the actual current 8.12 semantics:

- `done` / `doneAt` means a performed strength set;
- `assumed` is an unfinished/planned set, not completed work;
- `activity.completedSets` is authoritative when set rows are incomplete or reconstructed;
- an active/paused cardio item with a planned duration is not automatically completed;
- archived sessions are historical facts;
- pause/rest is represented by explicit activity state plus `restStartedAt` / `restAccumulatedMs` and must never be interpreted as a completed set.

### Shadow observation contract

A Stage 2 observation is deterministic and read-only. It may produce:

- normalized Runtime input;
- the pure Runtime projection;
- a stable input fingerprint;
- factual active-session diagnostics;
- a comparison between the previous projection and the next observed authoritative state;
- reason/alignment codes for tests.

A mismatch is diagnostic only. It is never allowed to rewrite history, reroute the user, trigger UI, or be treated as training failure.

### Browser shadow harness

Stage 2 does **not** inject the Runtime into the AXIS 8.12 Production bundle.

The browser harness runs outside the product:

1. build the exact normal 8.12 candidate;
2. open it in Chromium / iPhone-like WebKit;
3. allow the existing 8.12 owners to perform normal state transitions;
4. read authoritative snapshots at narrow event boundaries;
5. pass those snapshots to the pure Shadow Runtime in the test process;
6. compare deterministic projections and observed transitions.

This gives Stage 2 real browser state without creating a second browser owner. A Shadow Runtime exception therefore has zero possible effect on recording.

## Implementation boundary

Allowed Stage 2 changes:

- `runtime/` pure adapter/runtime/shadow modules;
- Runtime characterization fixtures;
- Runtime/Shadow tests and browser harnesses;
- dedicated CI for Stage 2;
- Runtime documentation and this handoff.

Forbidden in Stage 2:

- product DOM/UI changes;
- LocalStorage / IndexedDB writes by Runtime code;
- network/API calls from Runtime code;
- camera/media/AI ownership;
- route or recommendation presentation;
- pause/resume/finish ownership;
- recording owner changes;
- Production build injection of `runtime/axis-runtime.mjs`, the 8.12 adapter or the Shadow module;
- public version change from 8.12.

`build-release.mjs` must remain independent of Stage 2 Runtime modules. Because all Stage 2 executable paths are isolated under `runtime/`, `scripts/axis-813-*` and CI/docs, the 8.13 parity gate must require byte-for-byte equality with the exact PR base Production artifact.

## Validation for this work

Stage 2 is not complete until the same candidate proves all of the following:

- existing Stage 0/1 Runtime Core invariants remain green;
- real 8.12 `assumed` set rows do not become phantom completion;
- active/paused cardio planned duration does not become phantom completion;
- pause/rest facts survive adaptation without changing completion facts;
- identical snapshot -> identical fingerprint and projection;
- reopen/refresh from the same authoritative snapshot -> identical observation;
- a factual set completion is observed as progress, not an automatic rest transition;
- pause and resume are observed without fabricating work;
- route/current-event changes are compared against the prior projection as diagnostics only;
- malformed/empty Shadow input fails open into deterministic diagnostics rather than a product-side effect;
- randomized snapshot/constraint sequences preserve Runtime invariants;
- browser Shadow capture passes in Chromium and iPhone-like WebKit;
- Runtime/adapter/shadow sources contain no browser, storage or network ownership APIs;
- exact 8.12 Production artifact parity against the PR base is byte-for-byte green;
- Repository Contract and Work Continuity Contract are green.

## What remains deliberately unchanged

- AXIS 8.12 remains the public Production release.
- Existing recording, active-session, Home, media, watermark, AI, sync and Language Studio owners remain unchanged.
- No `Continue + Live Route` UI yet.
- No Reality Action controls yet.
- No time-budget UI ownership yet.
- No durable event journal yet.
- No storage migration yet.
- The 8.12 field-hardening compatibility transform remains in place until a later explicit Runtime owner-transfer change can prove equivalent semantics and retire it safely.

## Next planned stage

After Stage 2 Shadow Runtime has deterministic pure tests, randomized sequence evidence, Chromium/WebKit browser observation and exact Production parity green:

**AXIS 8.13 Stage 3 — Continue + Live Route**

Stage 3 may transfer only the narrow ownership of continuation/remaining-route presentation. Recording stays with existing owners until a separate explicit transfer retires the old writer in the same change.
