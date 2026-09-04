# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `baae264fe8328f15817bf889d5ed9502ca97413a`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#116**, Report Range Truth
- PR #116 merged main SHA: `baae264fe8328f15817bf889d5ed9502ca97413a`
- PR #116 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production: all exact merged-SHA workflows completed successfully; the fixed Vercel Production alias serves the exact merged release with clean error/fatal runtime logs; Public Production Alias, 8.12.x Production and Production Deployment gates passed; EdgeOne exact artifact/Vercel parity, authenticated Production deployment, Chromium, iPhone WebKit, Production success marker, diagnostics and verification record all passed without rerun
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged product already has one canonical Object schema/execution boundary, app-owned Session/Encounter persistence in `axis_v60_state`, v61 recording ownership, v82/v87 Active lifecycle, whole-item Flow, immutable Encounter metric/execution snapshots, per-user Object metric overrides, immutable `profileSnapshot` + `goalSnapshot` Session-start facts, the Metric Optical System, immutable `axis.session-time.v1` completion facts, and deterministic read-only `axis.report-range.v1` historical range truth. None of those factual owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, and `axis.metric-schema.v1`. Session/Profile/Goal/report truth contracts remain additive portable facts, including `axis.session-time.v1`, `axis.profile-snapshot.v1`, `axis.goal-snapshot.v1`, and `axis.report-range.v1`.

## Active change

**AXIS 8.21 — Training Report UI**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-training-report-ui`
- intended pull request: **#117**
- exact base main SHA: `baae264fe8328f15817bf889d5ed9502ca97413a`
- intended public release change: **none**
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner: **none**
- PDF / image / share-card / download export owner: **none**
- new bounded capability: **one in-app read-only Training Report projection over `axis.report-range.v1`**

### Product rule

The existing AXIS information architecture remains authoritative:

`记录 / Settings existing report entry` → existing `reportSheet` → `axis.report-range.v1` → read-only presentation.

This work does **not** add another report dashboard, another historical aggregation model, or another persistence layer. The existing Settings report action becomes an all-completed-Sessions report. The existing Session detail `训练报告` action remains the single-Session entry. Both render through the same report sheet and the same Report Range truth owner.

### Truth and presentation rules

- all factual report data comes from `window.__AXIS_821_REPORT_RANGE_TRUTH__.build(...)`;
- the all-history entry calls the canonical range projection with an unbounded range;
- a single-Session entry uses the selected Session id/start only as route context, calls the canonical half-open range projection, then selects the matching returned Session id;
- current `state.profile` is never used as historical report truth;
- current Object catalog, custom Object definition, current metric override, current label/unit resolver, or current equipment metadata are never consulted to reinterpret archived facts;
- immutable `profileSnapshot`, `goalSnapshot`, `timeSummary`, Encounter identity, `schemaSnapshot`, `metrics`, and missing/unsupported coverage are rendered only from `axis.report-range.v1` output;
- time remains separated into Session duration, actual Active training, known rest, and pause/unaccounted; missing canonical time is shown as missing rather than estimated;
- snapshot absence is displayed as historical absence and is never backfilled from today's Profile;
- stable standard metric keys may receive a fixed presentation label only; values do not receive invented units that were not immutably captured;
- custom/unknown metric keys remain visible by their archived key and explicitly say `定义未保存` when the historical definition is unavailable;
- legacy root fields are not promoted into canonical metrics; the UI may state that old-format fields exist without upgrading them;
- the report may reverse the already-projected Session order for newest-first presentation, but it does not mutate or rewrite the truth bundle;
- opening, closing or rerendering the report must not change `axis_v60_state`;
- old `最近一次 / 7天 / 30天` report controls and the legacy report-image/share button are retired from the canonical report sheet in this PR so they cannot continue as a parallel historical aggregator/export owner;
- PDF, long image, share card, JSON/CSV/native/health export, coaching, scoring, recommendation, Trends reinterpretation and medical interpretation are outside this PR.

### Runtime placement and ownership

`prepare-821-training-report-ui.mjs` runs immediately after `prepare-821-report-range-truth.mjs` in the final 8.21 prepare chain.

It keeps the canonical single-runtime architecture and replaces only the legacy Report presentation path. The runtime marker is:

`window.__AXIS_821_TRAINING_REPORT_UI__`

It declares:

- `truthSchema: axis.report-range.v1`
- `sourceOwner: __AXIS_821_REPORT_RANGE_TRUTH__`
- `reportUIOwner: true`
- `storageWrite: false`
- `liveProfileRead: false`
- `currentObjectDefinitionRead: false`
- `legacyReportAggregation: false`
- `exportOwner: false`
- `legacyShareExport: false`

No new JavaScript request, dynamic chunk, storage namespace, factual writer, or export owner is allowed.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. the existing Settings report action opens the existing Report sheet and renders **all completed archived Sessions** through `axis.report-range.v1`;
2. History → Session detail → `训练报告` still works and renders only the selected Session;
3. report totals, encounter counts and metric counts originate from the canonical Report Range projection, not the old `reportStats()` aggregation;
4. total Session time, Active training, known rest, and pause/unaccounted remain distinct;
5. incomplete canonical time coverage is visible as `x / y` coverage and missing Session time is never estimated;
6. immutable historical body/goal snapshots appear when present; legacy absence explicitly remains absent;
7. changing current live Profile after those Sessions were completed does not alter historical Report content;
8. changing current Object/custom definition/metric override does not alter historical Report content;
9. custom/unknown Encounter metric keys remain visible with missing-definition treatment and no invented current label/unit;
10. legacy root facts are never promoted to canonical metrics;
11. opening/closing/rerendering Report leaves canonical `axis_v60_state` byte-equivalent unless the test itself deliberately mutates current state for independence proof;
12. legacy `reportRange` UI controls and report-image/share action are absent from the canonical report sheet; export remains outside #117;
13. no new persistence, writer, recorder, Active owner, Flow owner, Object owner, Profile owner, factual range owner, network state, route dashboard, or release identity is introduced;
14. Chromium and iPhone-like WebKit run the same physical Training Report UI flow through real Settings/History/Session-detail controls;
15. all inherited Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne, PR Convergence, Object Metric Override, Profile Session Truth, Metric Optical System, Session Time Truth and Report Range Truth gates remain green on the same exact head;
16. after merge, the exact merged `main` SHA must pass the existing Vercel Production deployment/fixed-alias proof, deployment-status gates, EdgeOne Production exact-artifact mirror, Chromium + iPhone WebKit production flows, Production success marker/verification record, and clean runtime error/fatal verification.

A visually polished report that silently reads today's Profile/Object catalog, estimates missing historical time, treats unknown old facts as zero, invents a custom metric definition, or keeps a hidden parallel JPG/report aggregator does **not** satisfy this work.

## Next planned stage

Only after Training Report UI is merged and Production-certified:

1. add professional paginated PDF export as a downstream projection of the canonical Training Report truth, including personal-information inclusion controls and page-break protection;
2. add share card / long-image export only after PDF/report factual parity is sealed;
3. later add JSON/CSV/native/health projections only as downstream representations, never parallel factual stores;
4. Trends may later distinguish historical Session snapshot context from current Profile, but must not be mixed into #117.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.