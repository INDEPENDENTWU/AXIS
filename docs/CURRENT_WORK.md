# AXIS Current Work

> Canonical engineering handoff. Read this before modifying AXIS. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.
- AXIS 8.13 Stage 3 — Continue + Live Route was squash-merged from PR #38.
- Stage 3 merged `main`: `ad9bcdf7ac789c96ab074cfc658cdc1723ff4159`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production is `READY` for exact source commit `ad9bcdf7…`.
- Fixed Production `axis-build.json` reports public version `8.12`, one initial JavaScript request, zero dynamic JavaScript, and all seven Stage 3 Live Route ownership gates true.
- Production core marker: `4d490912e0f3`; CSS marker: `af439553319b`.
- `AXIS Public Production Alias Gate` passed for exact `ad9bcdf7…`.
- `AXIS Production Deployment Gate` passed against the fixed Production URL with real Chromium inherited product, AXIS 8.11 Experience and AXIS 8.12 Language Studio regressions.
- Stage 3 route remains read-only presentation: existing 8.12 recording/storage owners remain authoritative.

## Active change

**CI-only Stage 3 seal hotfix — deterministic Live Route diagnostic failure exit (PR #39).**

The merged Stage 3 product is already Production-verified. During final main-branch CI sealing, a WebKit Live Route failure exposed a diagnostic-wrapper lifecycle defect:

- `scripts/axis-813-live-route-ci-diagnostic.mjs` caught an assertion error correctly;
- it emitted diagnostics but only assigned `process.exitCode = 1`;
- the failed smoke could leave a Playwright browser handle alive;
- Node therefore remained running until the workflow timeout instead of terminating immediately.

PR #39 changes only that diagnostic failure path:

- write the same error detail and GitHub annotation synchronously;
- terminate immediately with exit code 1;
- do not change `axis-813-live-route-smoke.mjs`;
- do not change assertions, timeouts, expected values or browser acceptance criteria;
- do not change Runtime, presenter, build topology, product UI, training/storage/media ownership or Production behavior.

This hotfix exists only so future failed WebKit assertions fail deterministically instead of appearing indefinitely `in_progress`.

## Validation for this work

### Stage 3 product seal already proved

Final PR #38 head `b1e32d88b45f9707896095b5fff169047aa5cbe4` passed all 14 triggered workflows before merge. Dedicated Chromium and iPhone-like WebKit Live Route regressions passed with unchanged assertions; WebKit was additionally rerun on the same SHA and passed again.

The browser contract proves:

- idle Home remains non-owning;
- `assumed` strength sets remain unfinished;
- factual current item is not duplicated in future route;
- evidence-backed historical continuation can surface the next item;
- route refresh does not modify training storage or active-card/navigation geometry;
- real set completion updates factual progress without fabricating rest;
- pause/resume does not fabricate route progress or take active-control ownership;
- current-event changes recompute continuation;
- active cardio plan duration remains unfinished;
- insufficient evidence hides the route rather than inventing work;
- lifecycle events do not duplicate the route owner.

### Post-merge Production seal

On merged main `ad9bcdf7…`:

- Vercel Production is READY on the exact commit;
- the fixed public alias serves the exact source commit and canonical Stage 3 manifest;
- Public Production Alias Gate passed;
- Production Deployment Gate passed its complete fixed-domain browser suite;
- the initially red main Field Hardening WebKit job was rerun unchanged on the same SHA and its `iPhone-like field hardening regression` passed; the workflow conclusion is now success;
- the exact main SHA currently has zero failed workflow runs after that rerun.

### CI hotfix acceptance

PR #39 head begins at `5dfbbdf15e4cf32e499396104a1f8204bbc10177` and changes only the diagnostic wrapper plus this handoff document.

Before merge it must pass the exact-head repository/continuity and applicable Stage 3/inherited gates. After merge, verify the new main has no unresolved failure or in-progress run attributable to the diagnostic lifecycle defect. Because this is CI/docs only, the public product topology and user-facing Stage 3 behavior must remain unchanged.

## Next planned stage

After PR #39 is merged and the Stage 3 seal is clean:

**AXIS 8.13 Stage 4 — Reality Actions**

Stage 4 may add explicit temporary Runtime constraints such as:

- 这个器械有人;
- 我只剩 20 分钟;
- 今天到这里.

Those actions may alter temporary continuation intent only. Historical workout facts remain authoritative and immutable. Durable event journal, storage migration and broader recording-owner transfer remain later, separate stages.
