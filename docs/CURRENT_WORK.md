# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `143e7d4130017e17d2253d527d41a452267b2b4b`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#115**, Session Time Truth
- PR #115 final tested head: `f770a959437605017791b425d2057def0b1ff531`
- PR #115 merged main SHA: `143e7d4130017e17d2253d527d41a452267b2b4b`
- PR #115 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production: merged-main workflows are green, Vercel exact Production serves the same merged SHA with clean runtime error/fatal logs, EdgeOne exact artifact parity passed, Chromium passed, and the isolated inherited WebKit geometry transient passed unchanged on the allowed rerun before the Production success marker / verification record completed
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged product already has one canonical Object schema/execution boundary, app-owned Session/Encounter persistence in `axis_v60_state`, v61 recording ownership, v82/v87 Active lifecycle, whole-item Flow, immutable Encounter metric/execution snapshots, per-user Object metric overrides, immutable `profileSnapshot` + `goalSnapshot` Session-start facts, the Metric Optical System, and immutable `axis.session-time.v1` completion facts. None of those factual owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, and `axis.metric-schema.v1`.

## Active change

**AXIS 8.21 — Report Range Truth**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-report-range-truth`
- intended pull request: **#116**
- exact base main SHA: `143e7d4130017e17d2253d527d41a452267b2b4b`
- intended public release change: **none**
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner: **none**
- new Report UI / PDF owner / image-export owner: **none**
- new bounded capability: **one deterministic read-only historical range projection**

### Product rule

`axis.report-range.v1` is a read-only projection over already-completed archived Sessions. It does not create, repair, migrate, infer, or persist facts.

Canonical projection line for this work is:

`completed Session archive` → immutable `profileSnapshot` / `goalSnapshot` → immutable `timeSummary` → immutable Encounter `schemaSnapshot` / `metrics` / `executionModeSnapshot` → deterministic range facts.

Range membership is based on Session start time using a half-open interval: `[range.start, range.end)`. Sessions without both finite `start` and finite `end` are not completed and are excluded.

### Truth and non-inference rules

This work prefers explicit missing coverage over invented historical precision.

- live `state.profile` is never read by the range projection;
- current Object catalog / current user metric overrides are never consulted to reinterpret an archived Encounter;
- `profileSnapshot` is accepted only as `axis.profile-snapshot.v1`;
- `goalSnapshot` is accepted only as `axis.goal-snapshot.v1`;
- `timeSummary` is aggregated only when it is canonical `axis.session-time.v1`;
- a Session without canonical time truth contributes zero to canonical time totals and increments missing-time coverage; no `mins()`, set-count, rep-count, recommendation, 45-second heuristic, wall-clock guess, or other legacy timing inference is allowed;
- Encounter metric observations come only from archived `event.metrics`; root legacy fields such as `weight`, `reps`, `duration`, etc. may be retained as legacy evidence but are never promoted into canonical metrics;
- archived `schemaSnapshot` keys are preserved exactly;
- known stable metric keys may be identified only as stable keys; this layer does not invent a portable definition URI, label, or unit that was not immutably captured;
- custom / unknown metric keys remain `encounter-key-only` with `definitionMissing: true` rather than being resolved against today's Object definition;
- unsupported future snapshot/time schemas are reported as unsupported/missing canonical coverage rather than silently interpreted;
- projection output is cloned/detached and does not mutate archived Sessions;
- historical completed Sessions are not backfilled or migrated;
- Report UI, PDF, image export, coaching, scoring, recommendations, and medical interpretation are outside this PR.

### Ownership and runtime placement

The pure deterministic model lives in `lib/axis-report-range-truth.mjs`.

The deterministic build embeds that same pure source into the canonical app lexical runtime through `prepare-821-report-range-truth.mjs`, after `prepare-821-session-time-truth.mjs`.

The runtime surface is intentionally narrow:

`window.__AXIS_821_REPORT_RANGE_TRUTH__.build(range)` → reads only canonical `state.sessions` → returns a detached `axis.report-range.v1` bundle.

This work must not call app `save()`, LocalStorage mutation APIs, IndexedDB, network persistence, Profile writers, Object schema writers, Session/Encounter writers, or any export/UI owner.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. `[start,end)` Session-start range membership is deterministic and excludes the end boundary;
2. Sessions with null/empty/non-finite end are excluded rather than accidentally coercing to timestamp zero;
3. only completed archived Sessions are projected and output chronology is deterministic ascending order;
4. `profileSnapshot` and `goalSnapshot` come only from the immutable Session snapshots, never live Profile;
5. only canonical `axis.session-time.v1` contributes to time totals; missing/unsupported time truth remains missing and is never inferred;
6. Encounter observations come only from immutable `metrics`; legacy root facts are preserved separately but never promoted;
7. standard metric keys are not given invented portable definition URIs, while custom/unknown keys explicitly expose missing definition coverage;
8. later mutation of the input archive cannot mutate a previously returned projection;
9. changing live Profile / Object preferences while leaving archived Sessions unchanged produces byte-for-byte equivalent semantic projection;
10. deliberately making the current Object resolver throw does not affect historical range projection;
11. invoking `build(range)` leaves `axis_v60_state` unchanged;
12. no new LocalStorage namespace, IndexedDB, network state, writer, recorder, Active owner, Flow owner, Report UI owner, export owner, or public release identity is introduced;
13. Chromium and iPhone-like WebKit both run the same physical Report Range truth smoke;
14. all inherited Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne, PR Convergence, Object Metric Override, Profile Session Truth, Metric Optical System and Session Time Truth gates remain green on the same exact head;
15. after merge, the exact merged `main` SHA must pass the existing Vercel Production deployment/fixed-alias proof, EdgeOne Production mirror, exact artifact parity, Chromium + iPhone-like WebKit production flows, and clean runtime error verification.

A green test that obtains attractive totals by reading today's Profile/Object definitions, coercing an unfinished Session to completed, promoting legacy root fields, inventing custom metric definitions, or estimating missing historical time does **not** satisfy this work.

## Next planned stage

Only after Report Range Truth is merged and Production-certified:

1. build the detailed in-app Training Report as a read-only projection over `axis.report-range.v1`, with arbitrary start/end dates and clear coverage/missing-fact treatment;
2. add professional paginated PDF export from the canonical Report projection, including personal-information inclusion controls and page-break protection;
3. add share card / long-image export only after the Report UI and PDF factual model are stable;
4. later add JSON/CSV/native/health projections only as downstream representations, never parallel factual stores.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.