# AXIS 8.13 Reality Runtime

AXIS 8.13 is a staged architecture migration. **AXIS 8.12 remains the public release and existing recording facts remain authoritative.**

The contract remains:

> reality may interrupt training without forcing a restart, and the Runtime may never rewrite what actually happened.

## Stage 0/1 — Pure Runtime

`runtime/axis-runtime.mjs` is the deterministic domain layer. It accepts already-parsed session/history/current-exercise facts plus explicit time and temporary constraints, then returns advisory current / next / alternatives / remaining route / dropped work / budget / reason codes.

It has no DOM, storage, network, media or AI ownership.

The hardened 8.12 adapter treats `assumed` strength work and active/paused cardio plan values as unfinished, keeps pause/rest separate from completion, and prefers missing live evidence over phantom completion.

Stage 0/1 retains 600 seeded randomized Runtime cases.

## Stage 2 — Shadow Runtime

`runtime/shadow/axis-shadow-runtime.mjs` observes authoritative 8.12 snapshots outside the product bundle and returns deterministic fingerprints, projections and projection-vs-reality diagnostics.

Stage 2 does not own UI or recording. Chromium + iPhone-like WebKit Shadow harnesses exercise real set completion, pause/resume and active cardio transitions. Stage 2 adds 500 seeded randomized Shadow cases, for 1,100 seeded cases across the pure projection/observation layers.

PR #37 merged Stage 2 into `main` at `22d59ce3de448c33b7140c5432dee17c6e669fd0`; the fixed Production endpoint remained byte-identical at the browser product layer after that non-owning merge.

## Stage 3 — Continue + Live Route

Stage 3 is the first user-visible ownership transfer, implemented in PR #38.

The transfer is intentionally narrow:

> Runtime owns continuation / remaining-route **presentation**. Existing 8.12 recording continues to own workout facts, sets, pause/resume/finish and history.

### Single presentation owner

Source:

`runtime/browser/axis-live-route-presenter.js`

Build path:

`prepare-813-live-route.mjs` -> generated `v813-live-route.js` -> `postbuild-813-live-route.mjs` -> final canonical `axis-core.js`.

The prepare step embeds the exact pure Runtime + 8.12 adapter source with one browser presenter. The postbuild step injects that module only after the existing 8.8–8.12 canonical build and contracts have completed, then re-signs core/index/manifest.

This avoids a parallel dynamic runtime and avoids modifying historical recording owners.

### Live Route UI contract

The presenter mounts one compact `接下来` section inside active Today immediately before Timeline.

It does not duplicate the current item:

- factual current remains in the existing fixed `v87` active card;
- future continuation begins with the first evidence-backed item after current;
- up to two additional items are shown as simple rows;
- an alternative is shown only when the Runtime produces one;
- when there is no useful future evidence, the section hides instead of inventing work.

There is no modal, no new persistent control, no second timeline and no route database.

### Read-only browser boundary

The presenter reads only authoritative state and current identity:

- `axis_v60_state`;
- `axis_v8_meta`;
- current event id from the existing active card.

It refreshes from existing recording events, narrow active-card/timeline DOM mutations and pageshow/focus/visible lifecycle boundaries. No polling is introduced.

The presenter cannot:

- write LocalStorage / SessionStorage / IndexedDB;
- use network APIs for route generation;
- complete, pause, resume or finish work;
- change the current event;
- mutate history;
- own media, watermark, AI or learning state.

Runtime/presenter failure hides the route and preserves the complete 8.12 product.

### Canonical build contract

Stage 3 adds these required manifest gates:

- `liveRoute813`;
- `liveRouteSingleOwner813`;
- `liveRouteReadOnly813`;
- `liveRoutePureRuntime813`;
- `liveRouteFallback813`;
- `liveRouteNoRecordingOwner813`;
- `liveRouteCanonicalSingleRuntime813`.

The topology remains `canonical-single-runtime`, one initial JavaScript request and zero dynamic historical Runtime chunks. Public release identity remains 8.12 during this migration stage.

## Stage 3 browser evidence

Initial implementation candidate `cc84b17fa98ae1c57e397b8a75e243c66fb72960` passed all 14 workflows triggered for PR #38, including the new `AXIS 8.13 Live Route` workflow in both Chromium and iPhone-like WebKit.

The dedicated route gate proves:

- idle Home stays non-owning;
- `assumed` sets stay unfinished;
- current item is not duplicated in future route;
- historical sequence evidence can choose a future continuation;
- diagnostic refresh writes no training storage;
- active-card/navigation geometry does not shift;
- real set completion remains non-rest progress;
- pause/resume does not fabricate route progress;
- active-control owner remains `v87-direct-884`;
- current-event change recomputes continuation;
- active cardio planned duration remains unfinished;
- no evidence -> no fabricated route;
- lifecycle does not duplicate the route owner.

The same candidate also passed Shadow, Runtime Core, full Runtime Chromium/WebKit, 8.10.3, 8.11/8.12, Home, Field, Reminder, Repository and Work Continuity gates.

The initial Stage 3 canonical core marker after injection is `4d490912e0f3`.

## Next boundary — Stage 4 Reality Actions

Stage 4 may add explicit user actions such as “这个器械有人 / 我只剩 20 分钟 / 今天到这里”. Those actions may alter temporary Runtime constraints or continuation intent only.

Historical workout facts remain immutable and authoritative. Durable event journal, storage migration and broader recording-owner transfer remain later stages and must not be smuggled into Stage 4.

For the exact current engineering handoff and final-head validation state, read `docs/CURRENT_WORK.md` first.
