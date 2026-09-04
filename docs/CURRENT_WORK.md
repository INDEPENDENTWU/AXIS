# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#117**, truth-backed Training Report UI
- PR #117 final head: `708de3113d13aa79cfe1b0660058a4f239aba298`
- PR #117 merged main SHA: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- PR #117 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production: final PR Runtime, Deep Compatibility, Current Release, Universal and dedicated Chromium/iPhone WebKit gates passed; merged-main workflows have no failure/in-progress/queued/null conclusion; Vercel deployment `dpl_4tb8H7jiEYzrrqDnaeaWJPAM6GfV` is READY on the exact merged SHA and serves the fixed `axis-five-puce.vercel.app` alias with `aliasError=null` and zero error/fatal runtime logs; Public Production Alias and deployment-status gates passed; EdgeOne run `33875664300` passed exact artifact/Vercel parity, authenticated Production deployment, Chromium, iPhone WebKit, Production success marker, diagnostics and verification record without rerun
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged product already has one canonical Object schema/execution boundary, app-owned Session/Encounter persistence in `axis_v60_state`, v61 recording ownership, v82/v87 Active lifecycle, whole-item Flow, immutable Encounter metric/execution snapshots, per-user Object metric overrides, immutable `profileSnapshot` + `goalSnapshot` Session-start facts, the Metric Optical System, immutable `axis.session-time.v1` completion facts, deterministic read-only `axis.report-range.v1` historical range truth, and one truth-backed in-app Training Report presentation. None of those factual owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, and `axis.metric-schema.v1`. Session/Profile/Goal/report truth contracts remain additive portable facts, including `axis.session-time.v1`, `axis.profile-snapshot.v1`, `axis.goal-snapshot.v1`, and `axis.report-range.v1`.

## Active change

**AXIS 8.21 — Report PDF Export**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-report-pdf-export`
- intended pull request: **#118**
- exact base main SHA: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- intended public release change: **none**
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner / Profile owner / historical range owner: **none**
- new bounded capability: **custom-date Training Report projection plus one professional paginated PDF export owner downstream of `axis.report-range.v1`**

### Product rule

The authoritative chain is:

`archived Session facts` → `axis.report-range.v1` → canonical Training Report UI → browser paged PDF projection.

PDF is a representation of the same Report truth. It is not a second historical aggregator, factual store, Session source, or Profile history model.

### Date-range truth

- the all-history Report continues to call `axis.report-range.v1` with an unbounded range;
- a custom range is selected with explicit local calendar start and end dates;
- the user-facing end date is inclusive, but internally it is represented as the next local day at `00:00` and sent to `axis.report-range.v1` as the half-open interval `[start, end)`;
- no 7-day/30-day legacy aggregator is restored;
- `全部` returns to the canonical unbounded completed-Session projection;
- Session-detail Report remains single-Session and does not expose the global custom-range controls;
- only completed archived Sessions returned by Report Range Truth enter Report/PDF; an Active Session is never promoted into history.

### Personal-information rule

Screen historical Report remains independent of today's live Profile.

The export checkbox `包含个人信息` is explicit opt-in. Only while preparing the PDF, the export cover may read the current Profile to label **导出时个人信息**. It does not rewrite historical Sessions and must not be presented as the user's body/goal state at the time of an old workout.

Historical body and goal context inside each Session continues to come exclusively from immutable:

- `session.profileSnapshot`
- `session.goalSnapshot`

If those snapshots are absent, the PDF keeps the same historical absence treatment as the in-app Report.

Current export-time identity may include only already-owned Profile fields such as name, height, current weight, current body-fat percentage, current waist, training years, weekly frequency and current goal. This PR does not invent age/sex/medical/body-composition facts that have no canonical owner.

### PDF and pagination rule

The PDF path is native browser paged printing, not a raster screenshot pipeline.

Required presentation contract:

- `window.print()` / browser PDF pipeline is the export owner;
- text remains browser-rendered/vector-capable rather than converting whole report pages into images;
- no `html2canvas`, jsPDF, pdf-lib, canvas screenshot, JPEG page, server PDF service or network export is introduced;
- print media uses A4 paged layout with controlled margins;
- bottom-sheet geometry is removed in print and the Report becomes normal document flow;
- Report cover, summary, Session time facts, Profile/Goal snapshots, Encounter facts and missing-coverage treatment remain downstream of the canonical Report truth;
- encounter cards, table-like rows and missing-data blocks use page-break avoidance so short semantic blocks are not split through their middle;
- headings/session headers avoid orphaning from the content that follows;
- long Sessions may span multiple pages rather than forcing an unreadably tiny single page;
- `orphans` / `widows` protection is applied to printable report text;
- PDF generation does not mutate `axis_v60_state`, create a PDF blob store, upload the report, or persist export preferences.

### Runtime placement and ownership

`prepare-821-report-pdf-export.mjs` runs after `prepare-821-training-report-ui-convergence.mjs` in the final 8.21 prepare chain.

The runtime marker is:

`window.__AXIS_821_REPORT_PDF_EXPORT__`

It declares:

- `truthSchema: axis.report-range.v1`
- `exportOwner: true`
- `pipeline: browser-print-pdf`
- `vectorText: true`
- `rasterized: false`
- `storageWrite: false`
- `networkWrite: false`
- `customRange: true`
- `rangeSemantics: local-day-half-open`
- `personalInfo: optional-export-time`
- `historicalProfileOwner: session.profileSnapshot`
- `historicalGoalOwner: session.goalSnapshot`

The existing Training Report remains the sole screen presentation owner. This PR introduces one PDF export projection only; image/share-card export remains absent.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. Settings → Training Report still opens all completed Sessions through `axis.report-range.v1`;
2. explicit start/end dates select the exact inclusive local-date span through half-open Report Range truth;
3. Sessions outside the range are absent and Active Session data cannot enter completed-history totals;
4. `全部` restores all completed Sessions;
5. Session-detail Report remains a single-Session projection and hides global date controls;
6. historical Profile/Goal values remain immutable Session snapshots, never today's Profile;
7. optional export-time Profile appears only when `包含个人信息` is selected and is clearly labeled as export-time information;
8. canonical total/Active/rest/unaccounted time separation and missing-coverage treatment remain unchanged in the PDF projection;
9. Chromium generates a real `%PDF` document using print media and a sufficiently large fixture proves multiple PDF pages;
10. iPhone-like WebKit physically invokes the same native print preparation path from the visible PDF button;
11. A4 print CSS and page-break protection exist for semantic blocks/headings/rows, and the 390px on-screen range/export controls do not horizontally overflow;
12. no screenshot/raster PDF library, network PDF service, new persistence namespace, export history store, Session/Encounter writer, Active/Flow owner, historical Profile owner or alternate report aggregator is introduced;
13. range selection, print preparation, native print invocation and cleanup leave canonical `axis_v60_state` byte-equivalent;
14. the existing single-runtime / zero-dynamic-chunk architecture remains unchanged;
15. all inherited Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne, PR Convergence, Object Metric Override, Profile Session Truth, Metric Optical System, Session Time Truth, Report Range Truth and Training Report UI gates remain green on the same exact head;
16. after merge, the exact merged `main` SHA must pass the existing Vercel Production deployment/fixed-alias proof, deployment-status gates, EdgeOne Production exact-artifact mirror, Chromium + iPhone WebKit production flows, Production success marker/verification record, and clean runtime error/fatal verification.

A PDF that visually resembles the Report but silently re-aggregates Sessions, reads today's Profile as historical truth, estimates missing time, includes out-of-range Sessions, rasterizes every page, cuts semantic blocks arbitrarily, writes export state, or uploads data does **not** satisfy this work.

## Next planned stage

Only after Report PDF Export is merged and Production-certified:

1. add share-card / long-image export as another downstream projection of the same canonical Report truth;
2. optionally expand current Profile with additional explicitly owned personal/body fields before exposing them in future exports;
3. later add JSON/CSV/native/health projections only as downstream representations, never parallel factual stores;
4. Trends may later distinguish historical Session snapshot context from current Profile, but must not be mixed into #118.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.