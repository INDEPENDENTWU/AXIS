# Current Work

## Production baseline

The exact Production baseline is merged main `621b93837b8d56982a990abb00d86b758b421337`, AXIS **8.21**.

That SHA is dual-provider Production-sealed:

- fixed Vercel Production serves the exact main artifact;
- fixed EdgeOne Production mirrors the same exact prebuilt artifact;
- Production Chromium and iPhone-like WebKit current-release flows pass;
- the previous recording-geometry investigation retained the strict `0.5px` stability threshold and its automatic diagnostic trigger is retired.

Fixed endpoints remain:

- Vercel Production: `https://axis-five-puce.vercel.app`
- EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- public/base release identity: **8.21**
- architecture: `canonical-single-runtime`

The governed milestone remains **AXIS 8.21 — Flow / Session Blueprint** and the governed active branch remains `product/821-flow-session-blueprint`. Current hotfix work is a bounded child of that milestone and does not replace its governance identity.

## Active change

**AXIS 8.21 — Executable Object System + Flow / Active Session Coordination**

- active implementation branch: `hotfix/821-executable-object-system`
- parent integration branch: `hotfix/821-flow-active-session-coordination`
- base Production SHA: `621b93837b8d56982a990abb00d86b758b421337`
- draft PR: `#104`
- intended public identity change: **none; remains 8.21**
- intended factual ownership change: **none**

Manual iPhone Production testing exposed two related integration gaps.

First, a Flow can be waiting on `开始此项` while another standalone Activity is already foregrounded. Existing v82/v87 Active truth already supports the required safe model: one foreground Activity plus multiple paused Activities in the same canonical Session. Flow must coordinate that owner rather than create another execution state machine.

Second, a newly created custom Object may define valid recording properties such as `坡度 + 速度`, successfully record those values, but still fail to enter the established single-Object Active experience and later render legacy `kg / 次 / 组` history with raw `undefined`. This proves that Object definition, recording schema, execution semantics, Encounter snapshot, Active lifecycle and historical presentation have not yet converged on one executable contract.

## Canonical executable Object contract

The target system is one existing ownership chain:

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
schema-aware Today / History / Detail presentation
```

Ownership remains fixed:

- Object/Session/Encounter truth: `app.js` / `axis_v60_state`;
- recording: existing app/v61 route only;
- classic weight/reps set metadata: existing v61 / `axis_v8_meta` authority only where immutable Encounter schema permits it;
- ongoing execution: existing v82/v87 Active owner;
- Flow: sequence/context/planning only;
- media/evidence: existing owners unchanged.

No second database, storage namespace, picker, recorder, Active owner, Session writer or Encounter writer is allowed.

### Measurement and execution are separate

`metricSchema` answers **what is recorded**. `executionMode` answers **how the Object runs**.

The supported execution modes remain:

```text
single | sets | rounds | timed | hold | complete
```

An Object may explicitly choose an execution mode. When it remains `auto`, current 8.21 inference is:

- `hold` property → `hold`;
- sets/rounds or classic weight + reps → `sets`;
- completion-only → `complete`;
- continuous properties such as duration, distance, pace, speed, intensity, resistance, level or incline → `timed`;
- otherwise → `single`.

Therefore a custom `坡度 + 速度` Object must enter the existing timed Active lifecycle after its canonical Encounter commit. It must receive the established elapsed/estimated time, pause/resume and long-hold individual finish behavior. It must not require a fake set count or a second timer owner.

## Object editor / recording UI contract

The previous long inline list of fourteen 56px recording-property rows is not acceptable as the final mobile editing surface.

The Object editor should expose two compact native rows:

- `记录属性` — selected-property summary + count;
- `进行方式` — resolved mode, normally `自动 · 连续计时`, `自动 · 分组进行`, etc.

`记录属性` opens one dedicated compact bottom sheet using grouped, touch-safe controls rather than forcing all options into the main form. `进行方式` opens one dedicated execution choice sheet. These are presentation/configuration surfaces over the same Object truth, not new owners.

The recording page must remain schema-driven and must never expose property-selection controls. Every metric family must use the same engineered geometry, alignment and spacing system:

- numeric quantity: fixed-height centered stepper;
- duration/hold: same geometry + useful presets;
- speed/incline/distance: same geometry + bounded presets;
- rating: editable value + 1–10 tactile rail;
- boolean: native two-state control;
- pace: direct pace entry.

Changing a value may change only the value/state, never the geometry of surrounding controls. The existing strict `0.5px` recording geometry assertion remains release-blocking.

## History / localization contract

Historical presentation must be derived from immutable Encounter facts, not from a coarse legacy `kind === strength/cardio` branch.

For an Encounter whose snapshot is `坡度 + 速度`, Today/history/detail must render those facts only, for example:

```text
坡度 8 % · 速度 12 km/h
```

It must never fabricate or render irrelevant `kg / 次 / 组`, and raw `undefined`, `NaN`, internal enum IDs or missing values must never reach visible product copy.

Legacy Encounters that genuinely have no schema snapshot may continue through bounded legacy compatibility formatting. An explicit empty snapshot remains authoritative and must not trigger legacy fallback.

Internal stable enum IDs such as `strength`, `cardio` and `relative` may remain persisted/internal, but localized visible surfaces must render professional user-facing Chinese rather than leaking those enum tokens.

## Flow / Active coordination contract

Flow is a multi-Object Session Blueprint:

```text
Flow owns: ordered intent + current step + overall progress + planned duration context
Active owns: current Object timing + pause/resume + rest + sets/rounds/timed/hold execution + finish
Encounter owns: immutable factual record
```

For `A → B → C`:

1. Flow makes A current.
2. `开始此项` uses the existing canonical recorder only when a factual Encounter is needed.
3. If another Activity X is running, Flow never silently fails and never destroys X. A native coordination sheet explains that starting/resuming A will pause X; cancellation leaves X untouched.
4. After the canonical A Encounter commits, existing v82/v87 starts A and automatically pauses X.
5. Flow links to A's Encounter. Flow does not create another timer or Activity record.
6. Pausing A, resuming X, then returning to A preserves both Activities and resumes the same A Encounter.
7. Finishing A through the established long-hold Active finish consumes the Flow step and makes B current.
8. One-shot `single/complete` items advance only after their canonical Encounter commit.
9. `临时记录其他` remains record-only: no Active displacement and no Flow advancement.

A FlowRun may carry launch-only expected-duration snapshots derived from existing Object/history truth. This is planning context, not historical fact and not another timer owner.

## Release-blocking physical proof

The final exact-head proof must reproduce both reported Production scenarios rather than simplified synthetic cases.

### Custom Object scenario

1. create custom Object `测试A` through the real editor;
2. choose only `坡度` and `速度` in the compact property selector;
3. keep execution `自动` and verify it resolves to `连续计时`;
4. save and return to Today;
5. use real Quick Record + canonical Object picker;
6. verify the recorder contains only slope and speed controls;
7. record slope `8` and speed `12`;
8. tap `记下`;
9. verify the immutable Encounter snapshot contains only those metrics and `executionModeSnapshot === timed`;
10. verify the existing v87 Active surface appears for `测试A`;
11. verify pause/resume and long-hold individual finish;
12. finish/seal the Session only after the individual Activity is finished;
13. open History and verify slope/speed facts, no `undefined`, no irrelevant kg/reps/sets;
14. verify visible custom Object type labels contain no raw `strength/cardio/relative` enum;
15. verify property-picker and recorder geometry on Chromium and iPhone-like WebKit.

### Flow conflict scenario

1. standalone Activity X is already active;
2. launch Flow A → B;
3. `开始此项` shows a visible switch decision, never a silent no-op;
4. cancel leaves X active and creates no Encounter;
5. confirm opens the canonical A recorder;
6. save pauses X and starts A under existing Active truth;
7. resume X, then return to the same A without creating another A Encounter;
8. existing set/rest/pause/long-hold controls remain authoritative;
9. finish A advances to B;
10. temporary-other remains record-only;
11. Chromium and iPhone-like WebKit agree on persisted facts and lifecycle.

## Merge / Production discipline

Do not merge PR #104 until the exact PR head is green across Repository, Work Continuity, Cross-Platform, Universal Practice Object, Runtime, Runtime Foundation, Current Release Chromium/WebKit and Deep Compatibility. Test failures must be repaired at their actual owner; no thresholds or historical guards may be weakened merely to obtain green CI.

After merge, do not call this work complete until the exact resulting main SHA satisfies all of the following:

1. fixed Vercel Production serves the exact local 8.21 artifact;
2. the custom `坡度 + 速度` Object scenario passes on real Production Chromium and iPhone-like WebKit;
3. the Flow/Active conflict scenario passes on both engines;
4. no cold-boot/runtime page error occurs;
5. EdgeOne mirrors the same exact prebuilt artifact only after Vercel/main parity converges;
6. Vercel ↔ EdgeOne manifest/artifact parity remains strict;
7. the resulting main SHA has no unexplained independent red check.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
