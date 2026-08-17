# AXIS Current Work

> Canonical engineering handoff. Read this before modifying AXIS. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12
- Verified Stage 2 `main`: `22d59ce3de448c33b7140c5432dee17c6e669fd0`
- Architecture: `canonical-single-runtime`
- Production release hash before Stage 3: `ad14cad78a8d`
- Canonical runtime marker before Stage 3: `74c57baa7159`
- CSS marker before Stage 3: `b59f3946c3e5`
- Fixed Production endpoint: `axis-five-puce.vercel.app`
- Vercel Production deployment for `22d59ce3…` is `READY` and reports that exact Git source SHA.
- Fixed Production alias serves `canonical-8.12`; `AXIS Production Deployment Gate` passed with real Chromium inherited product, AXIS 8.11 Experience and AXIS 8.12 Language Studio checks.
- Main push had zero failed or in-progress workflows after Stage 2 merge; full Runtime Chromium/WebKit and dedicated Shadow Runtime were green.
- PR #37 is merged. Stage 2 Shadow Runtime is the verified non-owning foundation used by Stage 3.

## Active change

**AXIS 8.13 Stage 3 — Continue + Live Route is implemented and initially validated in PR #38.**

Stage 3 is the first intentionally user-visible Reality Runtime ownership transfer. The transfer is deliberately narrow:

> Runtime owns continuation / remaining-route presentation; existing 8.12 recording remains authoritative.

### Final implementation shape

There is exactly one browser presentation owner:

`runtime/browser/axis-live-route-presenter.js` -> generated `v813-live-route.js` -> final canonical `axis-core.js`.

The build path is deterministic:

1. existing 8.8–8.12 prepare steps converge the current product;
2. `prepare-813-live-route.mjs` reuses the exact pure `runtime/axis-runtime.mjs` and hardened `runtime/compat/axis-812-adapter.mjs` source, generates one isolated browser module, and appends scoped static route CSS;
3. the normal historical build/canonical/contracts complete first;
4. `postbuild-813-live-route.mjs` injects the single read-only presentation module into the already-canonical runtime, re-signs core/index/manifest, and seals Stage 3 ownership gates;
5. final topology remains one `axis-core.js`, zero dynamic historical runtime chunks.

`build-release.mjs` now has 76 deterministic steps. Stage 3 is a final isolated product-injection step rather than a new historical patch chain.

### Product UI

The route is a compact `接下来` section inserted in active Today immediately before the existing Timeline.

It intentionally does **not** duplicate the fixed active recording card:

- current factual item stays in the existing `v87` active card;
- Live Route shows only useful future continuation;
- lead future item is prominent but restrained;
- up to two additional future items use simple border-separated rows;
- an alternative appears only when the Runtime actually has one;
- no modal, no new persistent controls, no nested card stack, no verbose coaching copy.

If there is no active workout or no evidence-backed future continuation, the route stays hidden rather than inventing a next item.

### Read-only owner boundary

The presenter may read:

- `axis_v60_state`;
- `axis_v8_meta`;
- the factual current event id from the existing active card;
- existing `axis:recording-render` / `axis:recording-change` signals and narrow DOM render boundaries.

It may render only the route section.

It may **not**:

- call `localStorage.setItem` / `sessionStorage.setItem`;
- write IndexedDB or a new route store;
- use network APIs for route generation;
- complete sets;
- pause/resume/finish;
- change the current event;
- mutate history;
- own camera/media/watermark/AI/learning state.

Static Stage 3 build gates reject those ownership violations. Runtime/presenter errors hide the route and leave the full 8.12 product usable.

### Route refresh boundary

No polling is introduced.

The single presenter refreshes from authoritative facts on:

- existing recording render/change events;
- narrow active-card/timeline mutations;
- active Home visibility change;
- `pageshow`, focus and visible `visibilitychange` lifecycle boundaries.

Updates are coalesced to one animation-frame refresh and are idempotent. The route itself is outside the observed subtrees, preventing self-observer loops.

## Validation for this work

Initial Stage 3 implementation candidate `cc84b17fa98ae1c57e397b8a75e243c66fb72960` passed **all 14 workflows triggered for PR #38**:

- AXIS 8.13 Live Route;
- AXIS 8.13 Shadow Runtime;
- AXIS 8.13 Runtime Core;
- AXIS Runtime Gate;
- AXIS 8.12 Field Hardening Gate;
- AXIS 8.12 Browser Gate;
- AXIS 8.12 Language Studio Gate;
- AXIS 8.11 Browser Gate;
- AXIS 8.11 Experience Gate;
- AXIS 8.10.3 Gate;
- AXIS Home Transition Gate;
- AXIS 8.8 Reminder Layout Gate;
- AXIS Repository Contract;
- AXIS Work Continuity Contract.

### Dedicated Chromium + WebKit evidence

`AXIS 8.13 Live Route` passed in both Chromium and iPhone-like WebKit.

The browser regression proves:

- idle Home has one hidden/non-owning route owner and no false recording controls;
- real `assumed` strength rows remain zero performed sets;
- factual current item remains in the active card and is not duplicated in future route;
- historical sequence evidence can surface `坐姿划船` after current `胸推`;
- direct diagnostic refresh does not change training storage;
- route refresh does not move the fixed active card or navigation geometry;
- real `完成一组` updates factual progress, keeps `restStartedAt=null`, and does not replace active controls;
- pause/resume does not change future route or fabricate work;
- `window.__AXIS_ACTIVE_CONTROL__.owner` remains `v87-direct-884`;
- factual current-event change recomputes continuation (row -> shoulder in the test sequence);
- active cardio planned duration remains unfinished;
- current-only / no-history evidence hides the route rather than inventing work;
- pageshow/focus/visibility lifecycle does not duplicate the route owner;
- page errors remain empty.

### Architecture evidence

Stage 3 manifest/build contract requires:

- `liveRoute813`;
- `liveRouteSingleOwner813`;
- `liveRouteReadOnly813`;
- `liveRoutePureRuntime813`;
- `liveRouteFallback813`;
- `liveRouteNoRecordingOwner813`;
- `liveRouteCanonicalSingleRuntime813`.

Initial candidate canonical route core marker from the Stage 3 postbuild is `4d490912e0f3`.

Stage 2 parity correctly classifies Stage 3 as a controlled product change: hashes may change, but public release/base, canonical architecture, one initial JS request, zero dynamic JS and zero historical chunks must remain unchanged.

### Changed-file self-audit

Before documentation sealing, PR #38 changed only:

- `.github/workflows/axis-813-live-route-gate.yml`;
- `build-release.mjs`;
- `docs/CURRENT_WORK.md`;
- `prepare-813-live-route.mjs`;
- `postbuild-813-live-route.mjs`;
- `runtime/browser/axis-live-route-presenter.js`;
- `scripts/axis-813-live-route-smoke.mjs`.

No `app.js`, `v61.js`, `v87-runtime.js`, existing training/storage/media owner, historical prepare/postbuild owner, or `build-hardened.mjs` was modified.

### Final seal requirement

The documentation updates after `cc84b17f…` are status/contract-only and become a new PR head. **The exact final PR head must rerun and pass the same Live Route, Shadow, Runtime, inherited product, Repository and Work Continuity gates before merge.** Earlier green runs are implementation evidence but are not reused as the final merge decision.

After squash merge, the new `main` must be verified again on Vercel Production and the fixed Production URL before Stage 3 is considered closed.

## Next planned stage

After Stage 3 is merged and Production-verified:

**AXIS 8.13 Stage 4 — Reality Actions**

Stage 4 may add explicit user actions such as:

- 这个器械有人;
- 我只剩 20 分钟;
- 今天到这里.

Those actions may alter **temporary Runtime constraints or continuation intent only**. Historical workout facts remain authoritative and immutable.

Do not begin Stage 4 inside PR #38. Durable event journal, storage migration and broader recording-owner transfer remain later, separate stages.
