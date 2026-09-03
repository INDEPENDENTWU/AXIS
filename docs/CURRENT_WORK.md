# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `f01c4f0b333291de5f481a1625f8377588d2b09b`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#114**, Metric Optical System + stable intensity 1–20 semantics
- PR #114 final tested head: `1e47fb1d1c498b810f7f7faed517a07c0db68ddd`
- PR #114 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production, including 13/13 merged-main workflows, exact artifact parity, Chromium and iPhone-like WebKit production product flows, fixed public alias verification, and clean Vercel runtime errors
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged product already has one canonical Object schema/execution boundary, app-owned Session/Encounter persistence in `axis_v60_state`, v61 recording ownership, v82/v87 Active lifecycle, whole-item Flow, immutable Encounter metric/execution snapshots, per-user Object metric overrides, immutable Profile/Goal Session-start snapshots, and the Metric Optical System. None of those factual owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, and `axis.metric-schema.v1`.

## Active change

**AXIS 8.21 — Session Time Truth**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-session-time-truth`
- intended pull request: **#115**
- exact base main SHA: `f01c4f0b333291de5f481a1625f8377588d2b09b`
- intended public release change: **none**
- new LocalStorage namespace / IndexedDB / Session writer / Encounter writer / recorder / Active owner / Flow owner / report owner: **none**

### Product rule

A completed Session receives one immutable factual `timeSummary` at the existing canonical Session-completion boundary, before Activity cleanup and before the existing app-owned `save()` persists the completed Session.

Canonical schema for new completed Sessions in this work is `axis.session-time.v1`.

The summary distinguishes four facts:

- `totalMs`: exact Session wall-clock bounds (`end - start`);
- `activeMs`: global union of real Active/Activity intervals, plus an explicit recorded execution duration only when that Encounter has no real Activity interval;
- `restMs`: only explicit pause evidence that can be placed on the Session timeline, with every overlapping Active interval subtracted globally;
- `unaccountedMs`: the remainder. It is deliberately not renamed or inferred as rest.

### Truth and non-inference rules

This work must prefer missing classification over invented precision.

- strength execution time is never inferred from set count, rep count, a 45-second/set heuristic, recommendation timing, or the inherited `timeModel().gap` estimate;
- stable `duration` is interpreted as minutes and stable `hold` as seconds only as explicit execution-duration fallback when an Encounter has no real Activity interval;
- settled per-Activity `restAccumulatedMs` is not blindly summed across Objects because paused Activities can overlap another Object's Active execution;
- settled rest is classified only when its Activity interval gaps exactly account for the accumulated pause duration within a small clock tolerance; ambiguous settled pause evidence remains unaccounted;
- a live explicit pause at Session completion may contribute its exact `[restStartedAt, sessionEnd]` interval;
- global Active union is subtracted from all rest candidates before `restMs` is sealed;
- historical completed Sessions are not backfilled or migrated;
- Profile/Goal snapshots from PR #113 remain unchanged and are not reread from live Profile at completion;
- current Report UI/PDF/image export is outside this PR.

### Ownership and persistence

The existing `completeFinish()` remains the sole Session completion owner. This work adds one call inside that owner:

`axis821SealSessionTime(s,t)` → existing `sealSessionActivities(s,t)` → existing Session append/save path.

`session.timeSummary` is therefore an additional immutable Session fact inside the existing `axis_v60_state` persistence graph, not a new store or writer.

The pure deterministic contract lives in `lib/axis-session-time-truth.mjs`; the browser projection embeds the same pure source into the canonical app lexical owner during the deterministic release build.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. pure interval union/subtraction produces deterministic total/active/rest/unaccounted facts;
2. overlapping Activity intervals are globally unioned and never double-count Active time;
3. explicit `duration`/`hold` fallback contributes only when no real Activity interval exists for that Encounter;
4. a strength Encounter with no real interval or explicit duration contributes zero inferred Active time;
5. explicit pause evidence overlapping another Object's Active interval is removed from global rest;
6. ambiguous settled pause duration remains unaccounted rather than being assigned an invented wall-clock interval;
7. Session completion stores `axis.session-time.v1` before Activity cleanup using the existing app-owned Session save path;
8. immutable Profile/Goal Session-start snapshots survive completion unchanged and later live Profile edits cannot alter them or `timeSummary`;
9. already-completed historical Sessions receive no time-summary backfill;
10. no new LocalStorage namespace, IndexedDB, network state, Session writer, Encounter writer, recorder, Active owner, Flow owner, report owner, or public version is introduced;
11. Chromium and iPhone-like WebKit both run the same physical Session-completion truth smoke;
12. all inherited Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne, PR Convergence, Object Metric Override, Profile Session Truth and Metric Optical System gates remain green on the same exact head;
13. after merge, the exact merged `main` SHA must pass the existing Vercel Production deployment/fixed-alias proof, EdgeOne Production mirror, exact artifact parity, Chromium + iPhone-like WebKit production flows, and clean runtime error verification.

A green test that merely produces numbers while inferring unknown strength time, counts per-Activity pause overlap as global rest, mutates old Session history, or creates a second Session owner does **not** satisfy this work.

## Next planned stage

Only after Session Time Truth is merged and Production-certified:

1. make historical range aggregation read only canonical Session/Encounter/Profile/Goal/time-summary facts;
2. build the detailed Training Report as a read-only projection with arbitrary start/end date and all recorded metrics;
3. add professional paginated PDF export with personal-information inclusion controls and page-break protection;
4. add share-image / long-image export only after the report truth model is complete.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.