# Current Work

## Production baseline at start of this work

The exact Production baseline is merged main `621b93837b8d56982a990abb00d86b758b421337`, AXIS **8.21**.

That SHA is dual-provider Production-sealed:

- fixed Vercel Production serves the exact main artifact;
- fixed EdgeOne Production mirrors the same exact prebuilt artifact;
- Production Chromium and iPhone-like WebKit current-release flows pass;
- the strict recording geometry stability threshold remains `0.5px`.

Fixed endpoints remain:

- Vercel Production: `https://axis-five-puce.vercel.app`
- EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- public/base release identity: **8.21**
- architecture: `canonical-single-runtime`

The governed milestone remains **AXIS 8.21 — Flow / Session Blueprint** and the governed active branch remains `product/821-flow-session-blueprint`. This hotfix is a bounded child of that milestone; it does not replace the governance identity.

The cross-platform foundation remains **axis-native-foundation-0**. Its native repository is `INDEPENDENTWU/AXIS-iOS`. Portable Object/metric/execution semantics belong in pure shared contracts; Web DOM or CSS implementation details do not.

## Active change

**AXIS 8.21 — Executable Object System + Flow / Active Session Coordination**

- active implementation branch: `hotfix/821-executable-object-system`
- parent integration branch: `hotfix/821-flow-active-session-coordination`
- base Production SHA: `621b93837b8d56982a990abb00d86b758b421337`
- draft PR: `#104`
- intended public identity change: **none; remains 8.21**
- intended factual ownership change: **none**

Manual iPhone Production testing exposed two related integration gaps. A Flow item could collide with an already-running standalone Activity, and a newly created custom Object could successfully record valid properties such as `坡度 + 速度` while failing to enter the mature single-Object Active lifecycle and later rendering legacy `kg / 次 / 组` history with raw `undefined`.

These are not isolated slope/speed defects. They show that Object definition, recording schema, value controls, execution semantics, immutable Encounter facts, Active lifecycle and historical presentation must converge on one generic executable Object contract.

## Canonical executable Object contract

The required ownership chain is:

```text
Object definition
  ↓
metricSchema + executionMode
  ↓
existing canonical recorder
  ↓
immutable Encounter metricSchemaSnapshot + executionModeSnapshot + metrics
  ↓
existing v82/v87 Active lifecycle when execution is ongoing
  ↓
schema-aware Today / History / Detail / later Evolution presentation
```

Ownership remains fixed:

- Object/Session/Encounter truth: `app.js` / `axis_v60_state`;
- recording: existing app/v61 route only;
- classic weight/reps set metadata: existing v61 / `axis_v8_meta` authority only where immutable Encounter schema permits it;
- ongoing execution: existing v82/v87 Active owner;
- Flow: sequence/context/planning only;
- media/evidence: existing owners unchanged.

No second database, storage namespace, picker, recorder, Active owner, Session writer or Encounter writer is allowed.

### Capability matrix

`lib/axis-object-capabilities.mjs` is the pure capability registry for the current product layer. The current built-in metric set is exactly:

```text
weight | reps | sets | duration | hold | distance | pace | speed |
intensity | resistance | level | incline | rating | completed
```

Each capability defines its stable id, user-facing label, group, metric type, unit, presentation/control family, bounds/step where applicable, aggregation/repeatability semantics and execution hint.

The current custom metric type set is exactly:

```text
number | count | duration | distance | pace | percentage | rating | boolean | choice
```

A custom property is not a second-class field. Its type must be enough to choose a valid recorder control, normalize its value, serialize it into Encounter truth, format it again later, and provide a deterministic execution hint where the type itself implies ongoing or completion behavior.

### Measurement and execution are separate

`metricSchema` answers **what is recorded**. `executionMode` answers **how the Object runs**.

Supported execution modes:

```text
auto | single | sets | rounds | timed | hold | complete
```

When execution remains `auto`, one deterministic capability resolver governs both editor preview and runtime behavior. Current precedence is:

1. explicit manual non-auto mode always wins;
2. rounds semantics → `rounds`;
3. set/repetition semantics → `sets`;
4. hold semantics → `hold`;
5. completion-only → `complete`;
6. any continuous metric → `timed`;
7. otherwise → `single`.

Continuous semantics include built-in duration, distance, pace, speed, intensity, resistance, level and incline, plus custom duration/distance/pace metrics. A custom `坡度 + 速度` Object therefore resolves to the existing timed Active lifecycle after canonical Encounter commit. It receives existing elapsed/estimated time, pause/resume and long-hold individual finish; it does not acquire a fake set count or a second timer owner.

Combination behavior is a domain contract, not a list of UI special cases. CI enumerates all **16,384** possible subsets of the fourteen built-in properties and requires every selection to resolve deterministically to a supported execution mode without throwing.

## Object editor / recording UI contract

The main Object form exposes two compact native rows rather than a long fourteen-row property list:

- `记录属性` — selected-property summary + count;
- `进行方式` — resolved mode, normally automatic unless the user explicitly overrides it.

`记录属性` opens one dedicated compact bottom sheet with grouped touch-safe controls. The property registry groups current built-ins into training volume, time/motion, load/device, and result/feeling. `进行方式` opens one dedicated execution choice sheet. These are configuration surfaces over the same Object truth, not new owners.

The recording page remains value-only and schema-driven. It must never expose schema-selection controls. Every supported metric type maps to an engineered control family:

- number/count/distance/percentage: centered stepper, with capability-specific presets where useful;
- duration/hold: timer-style stepper + useful presets;
- pace: direct pace entry;
- rating: directly editable numeric owner + tactile 1–10 rail;
- boolean: two-state control;
- choice: explicit options backed by one canonical value owner.

Changing a value may change only the value/state, never surrounding geometry. The existing `≤ 0.5px` recording geometry assertion remains release-blocking.

## History / localization contract

Historical presentation is derived from immutable Encounter facts, not coarse legacy `kind === strength/cardio` assumptions.

For an Encounter whose snapshot is `坡度 + 速度`, Today/history/detail renders those facts only, for example:

```text
坡度 8 % · 速度 12 km/h
```

It must never fabricate irrelevant weight/reps/sets. Raw `undefined`, `NaN`, internal enum IDs or missing values must never reach visible product copy. Choice values render their stored user-facing option labels; pace values remain pace strings rather than being coerced to invalid numbers.

Legacy Encounters that genuinely have no schema snapshot may continue through bounded legacy compatibility formatting. An explicit empty snapshot remains authoritative and must never trigger legacy fallback.

Internal stable enum IDs such as `strength`, `cardio` and `relative` may remain persisted/internal, but visible localized surfaces must render professional user-facing text. Unknown identifier-like enum tokens fail closed rather than leaking directly into UI.

## Flow / Active coordination contract

Flow remains a multi-Object Session Blueprint:

```text
Flow owns: ordered intent + current step + overall progress + planned duration context
Active owns: current Object timing + pause/resume + rest + sets/rounds/timed/hold execution + finish
Encounter owns: immutable factual record
```

Starting a Flow item while another Activity is foregrounded uses the existing one-foreground-plus-paused v82/v87 model. Cancellation preserves the current Activity; confirmation records through the canonical recorder, then existing Active truth pauses the previous foreground Activity and starts/resumes the Flow item. Temporary-other remains record-only and cannot advance Flow or displace Active truth.

## Validation for this work

This work is not considered proven by the slope/speed example alone. Validation has three layers.

### 1. Exhaustive pure capability contract

`axis-821-object-capability-matrix-contract.mjs` must prove:

- all fourteen built-ins have complete valid capability metadata and match the portable Metric Schema registry;
- all nine custom metric types normalize, format and resolve without raw invalid values;
- explicit zero-property schema remains empty and one-shot rather than falling back;
- pace strings survive the portable Encounter envelope;
- choice values validate against options and preserve user-facing labels;
- manual execution overrides win;
- representative precedence cases are fixed;
- all 16,384 built-in property subsets resolve deterministically to a legal execution mode.

### 2. Full custom Object physical scenario

On Chromium and iPhone-like WebKit:

1. create custom Object `测试A` through the real editor;
2. choose only `坡度` and `速度` in the compact property selector;
3. keep execution `自动` and verify `连续计时`;
4. save and use real Quick Record + canonical Object picker;
5. verify the recorder contains exactly those two controls;
6. set slope `8` and speed `12` using the real preset controls;
7. prove value changes move surrounding geometry by no more than `0.5px`;
8. tap `记下` and verify immutable schema/value/execution snapshots;
9. verify existing v87 Active appears for `测试A`;
10. physically pause/resume;
11. physically long-hold finish the individual Activity while the Session remains active;
12. physically finish/seal the Session separately;
13. open archived History/detail and verify only slope/speed facts, with no `undefined`, `NaN`, fake kg/reps/sets or raw enum tokens.

### 3. Recorder-family physical matrix

The same dual-engine browser proof also opens representative Objects for every control family: number, count, duration, hold, distance, pace, percentage, rating, boolean and choice. Each must render through the same canonical recorder with exactly the requested metric and mobile-safe geometry.

The separate Flow conflict scenario remains release-blocking as well: standalone Activity X active → Flow A/B launch → visible switch decision → cancel preserves X → confirm records A → existing Active pauses X/starts A → resume X/return A without duplicate Encounter → finish A advances Flow → temporary-other remains record-only.

## Next planned stage

First close PR #104 itself: repair every exact-head CI failure at the real owner, keep the exhaustive matrix and dual-engine physical proof green, and do not weaken inherited gates. Only after that exact head is fully green may the PR leave draft state and merge.

After merge, verify the resulting exact main artifact on fixed Vercel and the exact mirrored EdgeOne artifact. Re-run the full custom Object lifecycle and Flow/Active conflict scenario against Production Chromium and iPhone-like WebKit. Only then continue the broader 8.21 Flow / Session Blueprint roadmap from the new sealed main baseline.

## Merge / Production discipline

Do not merge PR #104 until the exact PR head is green across Repository, Work Continuity, Cross-Platform, Universal Practice Object, Runtime, Runtime Foundation, Current Release Chromium/WebKit and Deep Compatibility. Test failures must be repaired at their actual owner; no thresholds, historical guards or assertions may be weakened merely to obtain green CI.

After merge, do not call this work complete until:

1. fixed Vercel Production serves the exact resulting main artifact;
2. the full custom Object scenario passes on Production Chromium and iPhone-like WebKit;
3. the Flow/Active conflict scenario passes on both engines;
4. no cold-boot/runtime page error occurs;
5. EdgeOne mirrors the same exact prebuilt artifact only after Vercel/main parity converges;
6. Vercel ↔ EdgeOne manifest/artifact parity remains strict;
7. the resulting main SHA has no unexplained independent red check.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
