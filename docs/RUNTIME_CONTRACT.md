# AXIS Runtime Contract

This file contains release-blocking runtime invariants. Product rationale and engineering practice live in [`ENGINEERING_PLAYBOOK.md`](ENGINEERING_PLAYBOOK.md). Release identity and the current ownership map live in [`CURRENT_RELEASE.md`](CURRENT_RELEASE.md).

## Canonical release identity

AXIS 8.8.1 has one production runtime identity:

- public version: **8.8.1**;
- runtime baseline: **8.8.1**;
- architecture: **`canonical-single-runtime`**;
- external JavaScript runtime requests: **1**;
- dynamic historical runtime chunks: **0**;
- silent fallback to an older product version: **forbidden**.

`release-contract.json` is the machine-readable source of truth. `axis-build.json` must match it exactly.

Historical `v8xx*.js` files are source/compiler inputs only. They are not independent production release layers and may not be fetched dynamically by the browser.

## Production artifact contract

After `node build-release.mjs`, `postbuild-88-canonical.mjs` owns the browser artifact and `postbuild-881-contract.mjs` asserts the 8.8.1 product contracts.

The final page contains exactly:

- one external script: `axis-core.js?v=<content hash>`;
- one bundled stylesheet: `axis-style.css?v=<content hash>`.

The final HTML must not contain historical enhancement/feature/completion runtime requests. The canonical browser smoke blocks those retired URLs and requires the product to become fully ready anyway.

## Single-owner rule

Every user-facing interaction has one interactive owner. A collaborator may read state or decorate a non-conflicting surface, but may not create a second action, second state writer, second timer/audio path, or later repaint of the same semantic control.

Critical ownership in 8.8.1:

- release identity / readiness: canonical runtime;
- base local data and custom-item persistence: `app.js`;
- strength draft, set selection and save transaction: `v61.js`;
- custom professional classification/detail selection: `v874-professional.js`;
- group-plan presentation: canonical v8712 planner output; 8.8.1 convergence owns unitless centered parameters and expanded presets;
- active training execution and item countdown: v87 activity path;
- item-countdown completion tone: existing v87 audio owner only;
- active-session adjustment: canonical `#v87AdjustBtn` → retained v879 edit transaction;
- live catalog/search presentation: canonical v8710 live catalog;
- sound configuration: v8710 sonic core/motifs/UI;
- report: v8710 report;
- watermark information preferences: v85 canonical switches;
- watermark precise place: v8710 canonical resolver;
- watermark centered brand/media output: v8710 watermark;
- watermark brand-opacity persistence/range: v876, consumed by v8710 only for the center wordmark;
- nested-sheet return semantics: embedded completion behavior.

Replacement and retirement are one change. Hiding a previous owner later is not retirement.

## 8.8.1 group-plan contract

The visible central values for weight-step and repetition change are numeric only. `kg` / `次` may remain in surrounding semantic summary and generated set preview, but not inside the central editable value.

Canonical quick presets are:

- weight: `0.5 / 1 / 1.25 / 2 / 2.5 / 5 / 7.5 / 10`;
- repetition delta when applicable: `−1 / −2 / −3 / −4 / −5 / −6`.

The numeric input must be geometrically centered in its editor. A later module may not replace the preset list or reintroduce unit text into the central value.

## 8.8.1 active countdown contract

An active item's expected duration is a real countdown, not static explanatory copy.

- Remaining time is `normalized estimate − active elapsed`.
- Normalized estimate is at least 60 seconds, matching the existing v87 activity model.
- Active elapsed is derived from activity intervals; paused intervals do not advance the countdown.
- Pause freezes the visible remaining value; resume continues from the stored interval state.
- At the threshold, v87 renders `00:00` before triggering the existing AXIS item tone.
- The tone is emitted at most once for the activity and records `itemReminderNotifiedAt` only when audio actually fires.
- During intentional long-press finish, the pending item-completion tone is suppressed. Completing by long press must not create a second tone path.
- No new `setInterval`, audio engine, or shadow countdown state is allowed.

## 8.8.1 watermark brand contract

Information watermark and brand watermark are separate semantic layers.

Information rail:

- project name;
- training data;
- precise place;
- time;
- each controlled by its own canonical information switch.

Brand layer:

- exactly one centered wordmark: **`AXIS`**;
- same wordmark in live preview and finalized media;
- brand opacity is the v876 persisted range **4–48%**;
- that opacity controls only the centered wordmark;
- information rail opacity is not changed by the brand-opacity slider;
- legacy center posters / spaced `A X I S` presentation may not coexist as another visible brand owner.

Precise location data remains coordinate-private. Explicit current-location refresh preserves the complete canonical POI/address string; narrow layout may wrap or visually truncate, but code may not discard address segments such as the POI name.

## Historical owner retirement

The canonical packager must fail if known historical ownership signatures return. Current explicit retirements include:

- historical release/version writers and dynamic release layers;
- v873/v876/v8712 duplicate custom-editor writers;
- v8712 secondary equipment catalog painter;
- base `scanSeconds` painter/click writer and v876 delayed capture correction;
- old active-adjustment entry buttons;
- raw coordinate presentation and duplicate watermark locate writers;
- historical center watermark poster as a visible brand owner;
- the old 32% watermark-opacity ceiling;
- data-level precise-place truncation to the final two segments;
- retired first-record filler copy.

Retired behavior must be absent from the executing canonical artifact, not cleaned after it appears.

## Readiness contract

`window.__AXIS_CORE_INTERACTIVE__ === true` means the shell is already usable.

Full canonical readiness requires:

```text
window.__AXIS_CANONICAL_88__.state === 'ready'
window.__AXIS_FEATURE_KERNEL__.state === 'ready'
window.__AXIS_COMPLETION_KERNEL__.state === 'ready'
window.__AXIS_ARCH__ === 'canonical-single-runtime'
```

The compatibility/readiness object name remains `__AXIS_CANONICAL_88__`; it is an API name, not a public version writer. Public release identity comes from the release contract and is 8.8.1.

## High-frequency interaction rule

Weight, reps, set selection, pause/resume, set completion and countdown rendering mutate the smallest stable data/DOM surface. They may not rebuild the active row, create observer feedback loops, maintain shadow state, or depend on network work.

## Transient-state rule

A bad intermediate frame is a product defect even when final DOM is correct. This applies to duplicate adjustment actions, countdown zero/tone ordering, sheet flashes, moving controls, and first-paint geometry.

## State contract

Workout history is user data, not cache. Existing LocalStorage / IndexedDB compatibility must be preserved unless an explicit migration is implemented and tested.

There must be no shadow source of truth for current equipment, strength draft, active status, countdown state, custom exercise persistence, release identity, or watermark information preferences.

## Navigation contract

A root sheet closes to the application. A child sheet returns to its parent while preserving parent state/scroll and fixed return geometry. Navigation is event-driven; document-wide observation is not an acceptable navigation system.

## Build-time convergence

Historical source files encode compatibility and implementation history; the build pipeline is the compiler boundary. Every retirement must match known signatures, count matches, fail on ambiguity, assert retirement in the final artifact, and preserve the capability through its canonical owner.

## Browser release gates

AXIS 8.8.1 requires both Chromium and iPhone-like WebKit before merge.

Release-blocking checks include:

- repeated mobile/desktop cold boot and one-script artifact;
- first-paint / Settings / capture / adjustment ownership;
- custom exercise inference/save;
- rich stable catalog across repeated interactions;
- watermark four-switch + precise-place + coordinate privacy regression;
- **8.8.1 group-plan numeric/preset/geometry regression**;
- **8.8.1 center AXIS brand + 4–48% opacity / info-rail independence regression**;
- **8.8.1 countdown pause/resume/zero-tone/long-press suppression regression**;
- full product operation matrix;
- zero uncaught page errors.

A Chromium pass alone is never sufficient.

## Hosting / Production separation

Hosting success is not release success. Production must distinguish:

- deployment completed;
- fixed public URL anonymously opens;
- exact merged source SHA is served;
- canonical 8.8.1 manifest and immutable assets are served;
- all 8.8.1 manifest gates are true;
- real-browser product gates pass against the fixed Production URL.

A provider login/security checkpoint happens before AXIS runtime and must be treated as a release accessibility failure for the public domain, not worked around in AXIS code.

## Release flow

1. `main` remains on the last verified Production.
2. Work occurs on an isolated branch; non-main branches do not auto-build on Vercel.
3. `node build-release.mjs` emits and validates the canonical artifact.
4. Chromium complete gates pass.
5. iPhone-like WebKit complete gates pass on the same product source.
6. PR gates pass on the exact candidate.
7. Merge only the verified head.
8. `main` gates run again.
9. One Vercel Production build is triggered from `main`.
10. Fixed `https://axis-five-puce.vercel.app/` must serve the exact merge SHA / 8.8.1 manifest.
11. Public Production alias gate and real Production browser gate must pass before the release is called complete.

## Non-negotiable rule

Do not repair a conflict by adding a later observer, delayed cleaner, duplicate timer/audio owner, duplicate handler, version painter or compatibility shadow state. Find the owner, preserve the valid capability, retire the competing writer, and add a regression invariant that catches the original final and transient failure states.
