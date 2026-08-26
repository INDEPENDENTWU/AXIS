# Current Work

## Production baseline at start of this work

The baseline at the start of this slice is merged main `90a764c033262db28c7a534292281f766a6f3c99`.

That main includes:

- PR #88 — the AXIS 8.21 app-owned Flow runtime boundary, merged at `fb531594b89be3158dcb739b465383abd1671d71`;
- PR #89 — EdgeOne Production Flow gate seal, merged at `90a764c033262db28c7a534292281f766a6f3c99`;
- exact Flow runtime smoke coverage in Chromium and iPhone-like WebKit;
- the same Flow smoke wired into the real EdgeOne Production browser verification after Vercel/main artifact convergence.

Fixed Production URLs remain:

- Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

The public release identity still reports the sealed 8.20.1 runtime identity while 8.21 capabilities are being added incrementally. Do not create a parallel runtime, recorder, Session writer, Encounter writer or persistence namespace merely to advance 8.21 product surfaces.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

## Governed parent milestone

The governed active milestone remains **AXIS 8.21 — Flow / Session Blueprint** on `product/821-flow-session-blueprint`.

PR #90 is a bounded prerequisite child slice inside that milestone: it closes the Object → recording-property surface contract before Phase 3 exposes visible Flow composition. It does not replace the governed Flow milestone or establish a parallel product track.

## Active change

**AXIS 8.21 — Canonical Recording Property Surface**

- branch: `product/821-recording-property-surface`
- PR: **#90**
- prerequisite purpose: close the Object/recording-surface gap before visible Flow composition is allowed to depend on Quick Record

The product rule for this slice is strict:

> A reusable Object owns which properties exist. Record/Capture owns only the values for those already-selected properties.

### Object editor ownership

The established v874 custom Object editor remains the sole visible schema editor.

Preset properties are expanded to the common training/practice facts already needed by AXIS:

- weight
- reps
- sets
- duration
- hold
- distance
- pace
- speed
- intensity
- resistance / level
- incline
- rating
- completed

The editor groups these properties for compact mobile scanning and adds one inline custom-property path. It does not add a second Object store or sidecar schema owner.

### Explicit zero-property semantics

`metricSchema: []` is now valid explicit Object truth.

This is deliberately different from an old Object that has no `metricSchema` field at all:

- `metricSchema: []` means the user chose **no numeric/value properties**;
- missing `metricSchema` remains eligible for inherited legacy compatibility defaults.

Clearing every selected property must therefore stay empty. AXIS must never silently re-select duration/time.

The portable `axis.metric-schema.v1` contract is aligned with the same distinction, and an explicit empty Encounter snapshot must remain immutable authority rather than being treated as “snapshot missing”.

### Recording surface

Capture and Quick Record continue to use the existing app-owned recorder. They render only value controls for the effective Object/Flow recording schema.

Canonical control families in this slice are:

- numeric stepper;
- timer/duration with compact presets;
- rating 1–10;
- boolean toggle;
- pace/direct entry.

The Record surface must not contain property-selection/schema-edit buttons. If an Object has zero properties, the user can record it directly with no invented duration/weight/reps field.

### Existing ownership preserved

- Session/Object/Encounter truth: `app.js` / `axis_v60_state`
- classic repeated weight+reps facts: `v61.js` / `axis_v8_meta` only when immutable Encounter schema permits
- ongoing Active: established v82/v87 lifecycle/presentation owners
- Flow: existing `window.__AXIS_FLOW_RUNTIME__`, still intent/orchestration only
- media: established source-first/media owners

No new localStorage namespace, IndexedDB database, recorder, Active owner, Session writer or Encounter writer is allowed.

## Validation for this work

PR #90 is not mergeable until the exact head proves all of the following:

- Cross-Platform Metric Schema contract accepts explicit zero-property schemas while preserving missing-schema legacy fallback;
- deterministic release build succeeds;
- Repository, Work Continuity, Runtime Foundation, Runtime, Deep Compatibility and Universal Practice Object gates remain green;
- existing 8.20.1 Object reliability smoke remains green;
- existing 8.21 Flow runtime smoke remains green;
- the new physical recording-property smoke runs through the same Flow smoke lane on Chromium and iPhone-like WebKit;
- physical proof shows clearing every property does not reselect duration;
- stored Object truth remains `metricSchema: []` and `recording.metrics: []`;
- Quick Record/Capture for an explicit empty Object displays no value field and produces an Encounter with `metricSchemaSnapshot: []`, `metrics: {}` and no false Active/v61 fact;
- a multi-property Object such as `duration + intensity` exposes only those two canonical value controls and records their values correctly;
- Record/Capture contains no schema-selection controls;
- no page errors, duplicate writer or new persistence namespace appear.

After merge, the exact main artifact must converge on the fixed Vercel URL and then the exact prebuilt mirror must pass real Chromium and iPhone-like WebKit verification on EdgeOne before this slice is called Production-sealed.

## Next planned stage

**AXIS 8.21 Phase 3 — Minimal visible Flow composition / launch surface**

Only after PR #90 is merged and Production-verified should visible Flow UI advance.

The intended Phase 3 interaction remains compact and mobile-first:

`Today Flow entry → create Flow → choose existing Objects → order A → B → C → save → launch → show current step / next intent → delegate the step to the existing Quick Record/Capture path → advance only after matching Encounter commit.`

Phase 3 must reuse the existing Object picker, Object Truth, recording surface and `window.__AXIS_FLOW_RUNTIME__`. It must not create a second picker/catalog, second recorder, alternate Flow storage, completion-fact writer or “deviation penalty” system.

Chat history is not authoritative project memory. GitHub governance, contracts, tests, current main and Production evidence are authoritative.
