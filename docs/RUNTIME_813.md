# AXIS 8.13 Reality Runtime

AXIS 8.13 is a staged architecture migration. **AXIS 8.12 remains the public Production release and the sole browser authority.**

The product contract is simple:

> reality may interrupt training without forcing a restart, and the Runtime may never rewrite what actually happened.

## Stage 0/1 — Pure Runtime

`runtime/axis-runtime.mjs` is the deterministic domain layer. It accepts already-parsed session/history/current-exercise facts plus explicit time and temporary constraints, then returns an advisory projection:

- current;
- next;
- alternatives;
- remaining route;
- dropped work;
- budget facts;
- reason codes.

It has no DOM, storage, network, media or AI ownership.

`runtime/compat/axis-812-adapter.mjs` is the read-only bridge from current 8.12 facts. Stage 2 hardened it to real Production semantics:

- `done`, `doneAt` or authoritative `activity.completedSets` may establish performed strength work;
- `assumed` is unfinished/planned work;
- active/paused cardio planned duration is not completion;
- pause/rest facts remain separate from completion facts;
- archived sessions remain historical facts;
- uncertain live work stays unfinished rather than becoming phantom completion.

Stage 0/1 keeps 600 seeded randomized Runtime cases plus deterministic/reopen/constraint invariants.

## Stage 2 — Shadow Runtime

Stage 2 is implemented in PR #37 without transferring product ownership.

`runtime/shadow/axis-shadow-runtime.mjs` composes the adapter and pure Runtime and returns only:

- normalized input;
- factual active-session diagnostics;
- deterministic projection;
- stable fingerprint;
- zero-side-effect diagnostics.

`compareShadowObservations()` compares a previous advisory projection with the next authoritative state. Its alignment codes are evidence only; they never change route presentation, recording or history.

If observation fails, the Shadow layer fails open with `projection: null` and zero writes. The Shadow Runtime is not loaded by the product, so a Shadow exception cannot affect recording.

### Real 8.12 characterization

`runtime/fixtures/axis-812-shadow-sequences.mjs` and `scripts/axis-813-shadow-runtime.mjs` cover:

1. active strength with real `assumed` rows -> zero performed sets;
2. one factual set completion -> progress, not automatic rest;
3. explicit pause -> rest facts without extra completion;
4. resume -> cumulative rest without fabricated work;
5. current-event change -> diagnostic comparison against the previous projection;
6. active cardio with planned duration -> still unfinished;
7. malformed observation -> deterministic fail-open result;
8. 500 seeded randomized Shadow snapshot/constraint cases.

Together Stage 0/1 + Stage 2 currently exercise 1,100 seeded randomized cases across projection and observation layers.

## Browser observation boundary

`scripts/axis-813-shadow-browser.mjs` runs outside the product bundle.

The harness builds and serves the normal 8.12 product, lets existing owners execute real transitions, then only reads:

- `axis_v60_state`;
- `axis_v8_meta`;
- current event id.

Those parsed snapshots are passed to the Node-side Shadow Runtime. The Runtime is not injected into the page.

The dedicated `AXIS 8.13 Shadow Runtime` workflow runs this in Chromium and iPhone-like WebKit. The initial Stage 2 head `da92b0046abfba629e86cc6ae3dfddb2cfd7c7ed` passed pure-shadow, Chromium Shadow and WebKit Shadow.

## Production parity

Stage 2 remains outside `build-release.mjs`.

The parity gate rebuilds the exact PR base and requires byte-for-byte equality of the generated 8.12 browser product for Runtime/test/docs/CI-only changes.

Initial Stage 2 evidence against base `7d2c703ec85abc8a01ee43de4d99ea9402695fbf`:

- release `8.12`;
- release hash `ad14cad78a8d`;
- canonical runtime marker `74c57baa7159`;
- CSS marker `b59f3946c3e5`;
- raw generated core parity fingerprint `1483c663fda3`;
- `canonical-single-runtime`;
- 1 initial JavaScript request;
- 0 dynamic historical Runtime chunks.

Any Stage 2 change to the actual Production artifact fails CI.

## Ownership still unchanged

Stage 2 does **not** own:

- Home or recording UI;
- set editing;
- pause/resume/finish;
- LocalStorage / IndexedDB;
- camera/media/watermark;
- AI/network;
- Language Studio;
- route/recommendation presentation.

There is no Runtime-rendered `Continue + Live Route` yet.

## Stage 3 boundary

Only after the exact final Stage 2 PR head is green across Shadow, inherited product, Repository/Continuity and exact Production-parity gates may AXIS enter **Stage 3 — Continue + Live Route**.

Stage 3 may transfer only continuation/remaining-route **presentation** ownership. Recording stays with existing owners until a separate explicit owner-transfer change retires the old writer in the same change.

For the detailed active engineering handoff and exit checklist, read `docs/CURRENT_WORK.md` first.
