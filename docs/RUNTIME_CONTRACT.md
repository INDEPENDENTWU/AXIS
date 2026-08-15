# AXIS Runtime Contract

This file contains release-blocking runtime invariants. Product rationale and engineering practice live in [`ENGINEERING_PLAYBOOK.md`](ENGINEERING_PLAYBOOK.md). Release identity and the current ownership map live in [`CURRENT_RELEASE.md`](CURRENT_RELEASE.md).

## Canonical release identity

AXIS 8.8 has one production runtime identity:

- public version: **8.8**;
- runtime baseline: **8.8**;
- architecture: **`canonical-single-runtime`**;
- external JavaScript runtime requests: **1**;
- dynamic historical runtime chunks: **0**;
- silent fallback to an older product version: **forbidden**.

`release-contract.json` is the machine-readable source of truth. `axis-build.json` must match it exactly.

Historical `v8xx*.js` files are source/compiler inputs only. They are not independent production release layers and may not be fetched dynamically by the browser.

## Production artifact contract

After `node build-release.mjs`, `postbuild-88-canonical.mjs` owns the browser artifact.

The final page must contain exactly:

- one external script: `axis-core.js?v=<content hash>`;
- one bundled stylesheet: `axis-style.css?v=<content hash>`.

The final HTML must not contain:

- `AXIS_FEATURE_LOADER_START` or `AXIS_COMPLETION_LOADER_START`;
- `axis-enhance-foundation.js` / `recording` / `interaction` / `product` requests;
- independent `v8712-runtime.js` or `v8712-completion.js` requests.

The canonical browser smoke actively blocks all of those retired URLs and requires the product to become fully ready anyway.

## Single-owner rule

Every user-facing interaction has one interactive owner. A collaborator may read state or decorate a non-conflicting surface, but may not create a second action, second state writer, or later repaint of the same semantic control.

Critical ownership in 8.8:

- release identity and canonical readiness: canonical runtime;
- base local data and custom-item persistence: `app.js`;
- strength draft, set selection and save transaction: `v61.js`;
- exercise library: `v873-exercise-library.js`;
- custom search/ranking: `v873-smart-input.js`;
- custom professional classification/detail selection: `v874-professional.js`;
- active training execution: `v87` activity path;
- active-session adjustment: canonical `#v87AdjustBtn` -> v879 edit transaction;
- live catalog/search presentation: v8710 live catalog, excluding its retired active editor;
- sound: v8710 sonic core/motifs/UI;
- report: v8710 report;
- watermark output: v8710 watermark with the converged Settings presentation;
- nested-sheet return semantics: embedded completion behavior.

Replacement and retirement are one change. Hiding a previous owner later is not retirement.

## Historical owner retirement

The canonical packager must fail if known historical ownership signatures return.

Current explicit retirements include:

- v879 and v8711 release/version writers;
- v873 custom-editor type/muscle writer;
- v876 custom draft/inference/save patcher;
- duplicate v8712 custom editor ownership;
- v8710 `#v8710EditOnce` active-session editor/polling/click path;
- old v879 visible adjustment entry superseded by canonical `#v87AdjustBtn`;
- raw coordinate presentation;
- retired first-record filler copy.

Retired behavior must be absent from the executing canonical artifact, not cleaned after it appears.

## Readiness contract

`window.__AXIS_CORE_INTERACTIVE__ === true` means the product shell is already usable.

Full canonical readiness requires:

```text
window.__AXIS_CANONICAL_88__.state === 'ready'
window.__AXIS_FEATURE_KERNEL__.state === 'ready'
window.__AXIS_COMPLETION_KERNEL__.state === 'ready'
window.__AXIS_ARCH__ === 'canonical-single-runtime'
```

The feature/completion kernel objects remain as compatibility/readiness interfaces, but their implementations are embedded in the one runtime. They are not network-loaded optional releases.

A canonical build may not deliberately report ready while an older release identity or competing owner remains active.

## High-frequency interaction rule

Weight, reps, set selection, pause/resume and set completion must mutate the smallest stable data/DOM surface.

Weight/reps changes may not:

- recreate the active set row;
- replace the whole set editor;
- depend on a MutationObserver feedback loop;
- maintain a second strength draft;
- use network work as part of the interaction.

The regression gate verifies node identity, geometry stability, direct numeric input, step changes and set-count behavior.

## Transient-state rule

A product defect includes a bad intermediate frame even if the final DOM is correct.

For active-session adjustment, the gate samples/mutates through the render transition and requires no frame with more than one visible semantic `调整` action. The old `#v8710EditOnce` and `#v879EditBtn` are release-blocking if they return.

The same principle applies to moving controls, duplicated actions, sheet flashes and first-paint geometry.

## Critical CSS and first paint

Geometry visible during the first interaction belongs in bundled static CSS. Runtime code may not visibly transform an old shell into the final shell after the user can interact.

The first-paint gate compares initial DOM geometry with core-ready and canonical-ready geometry for critical controls.

## State contract

Workout history is user data, not cache. Existing localStorage / IndexedDB compatibility must be preserved unless an explicit migration is implemented and tested.

There must be no shadow source of truth for:

- current equipment;
- strength draft;
- active activity status;
- custom exercise persistence;
- release identity.

Equipment identity uses canonical IDs where available; names and aliases are presentation/search data.

## AI boundary

AI enhances recognition and judgment but never owns the ability to record a workout.

- AI/network failure must not block manual recording or save;
- owner/provider configuration is not an end-user setup requirement;
- media analysis may fail without corrupting workout state;
- model changes may not redefine local workout semantics.

## Navigation contract

A root sheet closes to the application. A child sheet returns to its parent.

Return must preserve:

- parent visibility and state;
- parent scroll position;
- fixed 44 × 44 return geometry aligned with close;
- no reload or full render.

Navigation is event-driven. Document-wide observation is not an acceptable navigation system.

## Build-time convergence

The repository still contains historical implementation files because they encode valid capability and compatibility. The build pipeline is a compiler boundary, not the production runtime topology.

Every build-time retirement must:

1. match an exact known source signature;
2. be counted;
3. fail if missing or duplicated;
4. assert the retired writer no longer exists in the final executing source;
5. preserve the capability through the canonical owner.

Once a historical path has remained retired across releases, physical source deletion is preferred as a later cleanup.

## Browser release gates

AXIS 8.8 requires both engine families before merge.

### Chromium gate

Release-blocking checks include:

- repeated 390 × 844, 430 × 932 and desktop cold boots;
- one-script canonical artifact and zero retired dynamic requests;
- first-paint stability;
- Settings ownership/navigation;
- custom exercise automatic association and save;
- recording node/geometry/direct-input behavior;
- configurable group plan;
- active-session transient adjustment ownership;
- complete 8.8 convergence smoke;
- broad product operation matrix across navigation, Settings, persistence, recording, active session, history, trends and report;
- zero uncaught page errors.

### WebKit gate

An iPhone-like WebKit run (mobile/touch/high device scale) verifies:

- canonical single-runtime boot;
- custom exercise inference/save;
- concise Chinese location with raw coordinates private;
- direct strength input;
- active-session transient ownership;
- pause/resume;
- zero uncaught page errors.

A Chromium pass alone is not sufficient for release.

## Hosting / Production separation

Vercel Deployment Protection / Security Checkpoint happens before AXIS executes. A protected endpoint is a hosting state, not an AXIS browser pass.

Production verification must distinguish:

- deployment succeeded;
- exact source commit is served;
- canonical manifest is served;
- ordinary anonymous users can access the domain.

Do not mark protection as a runtime success, and do not change AXIS code to work around a provider login challenge.

## Release flow

1. `main` stays on the last verified production build.
2. Work occurs on an isolated release branch.
3. `node build-release.mjs` emits the canonical artifact and validates the release contract.
4. Chromium artifact, cold-boot, interaction, transient and product-matrix gates pass.
5. iPhone-like WebKit gate passes on the exact same release build.
6. A pull request targets `main`; pull-request gates pass again.
7. Merge only the verified head SHA.
8. `main` gates run again.
9. Vercel deploys the merged source commit.
10. Production manifest/sourceCommit/runtime architecture are verified against the exact deployment.
11. Hosting protection is reported separately if it blocks anonymous access.

## Non-negotiable rule

Do not repair a conflict by adding a later observer, delayed cleaner, duplicate handler, version painter or compatibility shadow state. Find the owner, preserve the valid capability, retire the competing writer, and add a regression invariant that catches the original final and transient failure states.
