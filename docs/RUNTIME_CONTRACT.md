# AXIS Runtime Contract

## Stable base

`main` production must always boot a previously verified stable base. As of this contract the base is AXIS 8.7.11.

The stable base owns:
- initial HTML and CSS;
- core interaction;
- local state compatibility;
- the existing stable enhancement bundle;
- the only boot/hydration state used by the page shell.

Feature releases must never change the base boot path as part of ordinary product iteration.

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
- not contain unbounded synchronous loops.

A feature may promote the visible version only after its own ready flag is confirmed.

## Performance contract

- Core interactivity is tested independently from optional features.
- The normal page must remain usable if every optional feature fails to load.
- Immutable assets require content-derived cache keys.
- HTML and boot metadata are never long cached.
- Any new persistent observer or timer must have a documented owner and lifecycle.
- DOM updates should target the smallest stable subtree; no full-page render loop is allowed.

## Release flow

1. `main` stays on the last verified production build.
2. New work is committed to `next-runtime-hardening` (later a general `next` branch).
3. Build gates validate syntax, feature contracts, size budgets and critical DOM.
4. Playwright performs repeated cold boots on mobile and desktop viewports.
5. Smoke tests verify settings, navigation, training state and feature promotion.
6. Vercel Preview must succeed.
7. Only after browser gates pass may the release be promoted to `main`.
8. Vercel and EdgeOne use the same build command and feature contract.

## Non-negotiable rule

A feature regression is allowed to disable that feature. It is not allowed to make AXIS unable to open.
