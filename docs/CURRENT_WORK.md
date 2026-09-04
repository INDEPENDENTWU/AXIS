# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#117**, Training Report UI
- PR #117 merged main SHA: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- PR #117 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production: exact merged-SHA workflows have no failure or in-progress state; Vercel Production Deployment Gate and fixed public alias proof passed; EdgeOne Production Mirror passed; the exact Vercel Production deployment is READY and has clean error/fatal runtime logs
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The canonical factual owners remain app-owned Session/Encounter persistence in `axis_v60_state`, immutable Encounter metric/execution snapshots, immutable `profileSnapshot` + `goalSnapshot`, `axis.session-time.v1`, deterministic read-only `axis.report-range.v1`, and the truth-backed in-app Training Report UI. PDF is a downstream representation only; none of those factual owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, and `axis.metric-schema.v1`. Additive Session/Profile/Goal/report facts remain `axis.session-time.v1`, `axis.profile-snapshot.v1`, `axis.goal-snapshot.v1`, and `axis.report-range.v1`.

## Active change

**AXIS 8.21 — Professional Training Report PDF**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-training-report-pdf`
- intended pull request: **#118**
- exact base main SHA: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- intended public release change: **none**
- new LocalStorage namespace / IndexedDB / Session writer / Encounter writer / recorder / Active owner / Flow owner / Profile owner / historical aggregation owner: **none**
- new bounded capability: **one professional paginated PDF export owner downstream of `axis.report-range.v1` and the canonical Training Report truth**

### Product rule

The canonical chain is:

`completed Sessions` → `axis.report-range.v1` → Training Report presentation → professional paginated PDF.

The PDF exporter must never build a parallel historical model. It may take explicit start/end dates as route/filter input and may optionally read the current Profile once for cover-only metadata. Historical Session facts, body/goal state, time facts and Encounter metrics always come from the immutable Report Range projection.

### Range and personal-information rules

- the PDF UI selects a start date and inclusive end date;
- the exporter converts the inclusive end date to next local midnight and calls the canonical half-open `[start,end)` Report Range truth;
- a single-Session report defaults both date fields to that Session day; an all-history report defaults from earliest to latest completed Session date;
- users may include `导出时个人档案（当前）` on the cover;
- that current Profile block is explicitly `仅作封面资料` and never substitutes for `profileSnapshot` or `goalSnapshot` inside historical Sessions;
- only Profile fields currently owned by AXIS may appear: name, height, weight, body fat, waist, training years, weekly frequency, current goal and current target weight/body-fat/waist where present;
- no sex/age field is invented by the exporter because the current Profile owner does not yet own those facts.

### PDF content and pagination rules

The PDF must project every fact available in `axis.report-range.v1` for the chosen range:

- report date range, export timestamp and truth source;
- completed Session count, Encounter count and canonical metric-observation count;
- canonical total Session time, actual Active time, known rest and pause/unaccounted time, with coverage shown honestly;
- immutable per-Session Profile and Goal snapshots, including captured-at context when present;
- each Session date/time and identifier;
- each Encounter identity, time, `executionModeSnapshot`, `schemaSnapshot`, all canonical `metricFacts`, and missing-definition treatment;
- `legacyRecordedFacts` may be printed separately as `旧格式字段（仅存档，不计入标准指标统计）` and must never be promoted into canonical metrics;
- missing time/profile/goal/schema/metric definitions remain visible as missing rather than estimated or filled from current state.

The export transport is browser-native print/PDF, not raster capture. The generated document must use A4 paged print CSS, selectable text, `break-inside/page-break-inside` protection, heading `break-after` protection and orphan/widow protection. Training headers, Encounter cards, rows and metadata blocks must not be casually split across page boundaries when the browser can keep the block intact. No canvas screenshot, long-image rasterization, `toBlob`, `navigator.share` or parallel PDF library runtime is allowed in the product.

### Runtime placement and ownership

`prepare-821-training-report-pdf.mjs` runs after `prepare-821-training-report-ui-convergence.mjs` in the final 8.21 prepare chain.

Runtime marker:

`window.__AXIS_821_TRAINING_REPORT_PDF__`

It declares:

- `truthSchema: axis.report-range.v1`
- `sourceOwner: __AXIS_821_REPORT_RANGE_TRUTH__`
- `exportOwner: true`
- `transport: browser-print`
- `pageSize: A4`
- `multiPage: true`
- `pageBreakProtection: true`
- `selectableText: true`
- `storageWrite: false`
- `historicalLiveProfileRead: false`
- `currentObjectDefinitionRead: false`
- `optionalCurrentProfileCover: true`
- `rangeMembership: session-start-half-open`
- `imageRasterization: false`

`window.__AXIS_821_PDF_LAST_EXPORT__` is diagnostic-only per-export state and is never persisted.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited factual assertions:

1. Settings → Training Report → `导出 PDF` exposes start/end date controls and optional current-profile cover control inside the existing report IA;
2. the chosen date range calls `axis.report-range.v1` using Session-start half-open membership and excludes out-of-range Sessions;
3. all historical report facts are unchanged by current Profile/Object changes; current Profile can appear only in the optional cover block;
4. exported output contains complete available Session time separation, immutable Profile/Goal snapshots, Encounter identity/schema/execution mode/canonical metrics and explicit legacy/missing coverage;
5. the PDF document uses native selectable text, A4 pagination and page-break/orphan/widow protection rather than a rasterized screenshot;
6. multi-page Chromium PDF proof confirms more than one page for a long fixture and A4 page dimensions;
7. iPhone-like WebKit runs the same physical export configuration/popup/print-request flow;
8. disabling the current-profile checkbox removes current cover data without removing historical Session snapshots;
9. opening/configuring/exporting PDF leaves `axis_v60_state` byte-equivalent;
10. no current Object resolver, storage writer, new factual owner, network data source, raster image exporter, share owner or release identity is introduced;
11. all inherited Training Report UI, Report Range Truth, Session Time Truth, Profile Session Truth, Metric Optical, Object Override, Runtime, Runtime Foundation, Universal, Current Release, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne and PR Convergence gates remain green on the same exact head;
12. after merge, the exact merged `main` SHA must pass the existing Vercel Production/fixed-alias/deployment-status proof and EdgeOne exact-artifact Chromium + iPhone WebKit Production flow, success marker and verification record, with clean Vercel error/fatal runtime logs.

A PDF that looks polished but clips text, rasterizes the report, silently reads today's Object definitions as historical facts, fills missing Session truth from the current Profile, promotes legacy fields, or creates a second historical aggregation model does **not** satisfy this work.

## Next planned stage

Only after the professional paginated PDF is merged and Production-certified:

1. add share card / long-image export as another downstream projection of the same canonical report facts;
2. preserve PDF/report factual parity and never revive the retired v8710/v877 report aggregator/share owners;
3. later add JSON/CSV/native/health projections only as downstream representations, never parallel factual stores;
4. Trends may later distinguish historical Session snapshot context from current Profile, but it must not be mixed into #118.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
