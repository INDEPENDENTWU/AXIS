# AXIS Runtime Contract

This file contains release-blocking runtime invariants. The wider engineering rationale and product rules live in [`ENGINEERING_PLAYBOOK.md`](ENGINEERING_PLAYBOOK.md).

## Stable base

`main` production must always boot a previously verified stable base. The current base is AXIS 8.7.11; 8.7.12 is promoted only after the stable kernel is healthy.

The stable base owns:

- initial HTML and bundled critical CSS;
- core interaction and local state compatibility;
- the canonical quick/strength recording draft;
- the verified stable enhancement bundle;
- the only boot/hydration state used by the page shell.

Feature releases must never replace the base boot path as part of ordinary product iteration.

## Single-owner rule

A user-facing interaction has one interactive owner.

Later modules may read state, add non-conflicting capability, or decorate a surface. They may not create a second implementation of the same action or repaint a control already owned by another module.

Current critical ownership:

- shell/boot: hardened kernel;
- local base state: `app.js`;
- strength draft and high-frequency weight/reps/set selection: `v61.js`;
- active execution: verified activity runtime (`v87` path);
- live catalog: `v8710-live-catalog.js` backed by the canonical exercise library;
- sound: `v8710-sonic-core.js` and motifs/UI;
- current watermark output: `v8710-watermark.js` with v8711 placement controls;
- nested sheet return semantics: 8.7.12 completion shell;
- release/version state: hardened release owner.

When an owner is replaced, retirement of the previous owner is part of the same change.

## High-frequency interaction rule

Weight, reps, set selection, pause/resume, and other repeated controls must update the smallest stable subtree.

For recording, weight/reps changes may not:

- replace the full set editor;
- recreate the active set row;
- depend on a MutationObserver to repaint the value;
- synthesize hidden UI controls as the cross-module API.

The browser gate verifies active-row node identity across weight/reps changes.

## Critical CSS rule

Geometry visible during first interaction belongs in bundled static CSS. This includes shell dimensions, recording controls, nested sheet headers/return controls, and active-session action geometry.

Optional runtimes may inject non-critical decoration, but they may not change the dimensions of a core interaction after first paint.

## Feature rules

New product work is loaded only after the base is interactive and the stable enhancement bundle is ready.

A feature module must:

- fail open: failure leaves the stable base usable;
- have a hard size budget;
- pass syntax validation before deployment;
- not mutate AXIS global loading/hydration state;
- not register or alter Service Workers;
- not observe the whole document body;
- not create permanent `setInterval` loops;
- not force navigation/reload;
- not replace `document.body` or `document.documentElement`;
- not contain unbounded synchronous loops;
- not become a parallel owner of an existing surface.

A feature may promote the visible version only after its own ready flag is confirmed.

### 8.7.12 completion shell

The completion shell is intentionally stricter:

- no `MutationObserver`;
- no runtime stylesheet injection;
- no recording ownership;
- maximum 20 KiB source budget;
- only nested-sheet return, watermark legacy cleanup, and obsolete sound-control cleanup.

## Performance contract

- Core interactivity is tested independently from optional features.
- The normal page must remain usable if every optional feature fails to load.
- Immutable assets require content-derived cache keys.
- HTML and boot metadata are never long cached.
- Any new persistent observer or timer must have a documented owner and lifecycle.
- DOM updates target the smallest stable subtree; no full-page render loop is allowed.
- Stable enhancement must remain below the current browser-gate budget.
- Repeated controls must preserve geometry while values change.

## Navigation contract

A root sheet closes to the application. A child sheet returns to its parent.

Child return must preserve:

- parent visibility;
- parent state;
- parent scroll position;
- a fixed 44 × 44 return hit target aligned with the close action.

Navigation is event-driven. Do not add document-wide observation to infer sheet state.

## Build-time convergence

`prepare-legacy-runtime.mjs` may retire historical behavior before bundling when compatibility source still contains superseded owners.

Every retirement rewrite must be exact, counted, asserted, and fail the build if its expected source signature changes.

A runtime patch is not an acceptable substitute for retiring a known conflicting owner when the conflict can be removed before execution.

## Release flow

1. `main` stays on the last verified production build.
2. New work is committed to an isolated branch.
3. Build gates validate syntax, ownership contracts, size budgets, retired-owner signatures, and critical DOM assumptions.
4. Playwright performs repeated cold boots on mobile and desktop viewports.
5. Smoke tests verify settings, navigation, training state, recording node stability, geometry, feature promotion, and stable fallback.
6. Vercel Preview/deployment must succeed.
7. Only after browser gates pass may the release be promoted to `main`.
8. `main` runs the Runtime Gate again after merge.
9. Vercel and EdgeOne use the same hardened build command and feature contract.
10. Production browser verification runs when deployment protection permits automation; a protected endpoint must be reported as protected, not as a browser pass.

## Non-negotiable rule

A feature regression may disable that feature. It is not allowed to make AXIS unable to open, and one historical module is not allowed to silently become a second owner of a working interaction.
