# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded follow-up: `3877d91cc6f17a3db5add414fed44495c64d3cf4`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- production request topology: **1 initial JS / 0 dynamic JS chunks**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- fixed public EdgeOne URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment topology: one existing Git-connected AXIS Vercel Project on `main`, with EdgeOne mirroring the exact certified artifact
- existing Active truth/action owner: `v87` over `axis_v8_meta`
- existing Session/Encounter writer: canonical app owner
- existing rest truth: the current Activity lifecycle; no new timer or rest store is permitted
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`, `axis.backup.v1`

PR #131 is merged and fully Production-certified at `3877d91cc6f17a3db5add414fed44495c64d3cf4`. The fixed Vercel Production deployment is Git-sourced, READY, alias-clean, and `/axis-build.json` reports the exact same source SHA with public/base 8.21 and `canonical-single-runtime`. The exact EdgeOne Production Mirror also completed package parity plus Chromium and iPhone-like WebKit real-production verification. This is the certified base for the next bounded source-owner migration.

### Inherited bounded-stage continuity references

These are historical compatibility identifiers required by already-sealed 8.21 contracts. They are **not** the current Production baseline or active delivery branch:

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- bounded Flow step recording intent branch: `feat/821-flow-step-recording-intent`
- certified Flow step recording intent base: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded Flow step execution intent branch: `feat/821-flow-step-execution-intent`
- certified Flow step execution intent base: `396241c41b2f8eea80d45ca582352ea593c47036`
- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- bounded Active Home visual-convergence branch: `feat/821-active-home-visual-convergence`
- exact Active Home visual-convergence base `main` SHA: `9eaf90d0f94023218feb452b085da48c9f027276`
- bounded portable-backup branch: `feat/821-portable-backup-origin-migration`
- portable-backup exact historical base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- portable-backup merged/certified main: `b349c8b87a0e9b30916ba9959297897260de3882`
- completed Active Home source-convergence branch: `arch/821-active-home-source-convergence`
- completed Active Home source-convergence PR: **#131**
- Active Home source-convergence certified main: `3877d91cc6f17a3db5add414fed44495c64d3cf4`

PR #129 established the flat, centered, Home-integrated ordinary Active stage. PR #130 refined tactile hold/rest presentation. PR #132 added structural-owner portable backup transport. PR #131 then retired the late Active Home visual prepare from canonical build authority while preserving those product outcomes. All remain release-blocking continuity for this work.

## Active change

**AXIS 8.21 — Report PDF Scope Source Convergence**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-report-pdf-scope-convergence`
- PR: **#133**
- exact certified base `main` SHA: `3877d91cc6f17a3db5add414fed44495c64d3cf4`
- intended public release change: **none; remains 8.21**
- intended user-visible behavior change: **none**
- source-owner objective: make `prepare-821-report-pdf-export.mjs` install its runtime at the canonical Training Report lexical owner on the first pass, eliminating the immediately-following corrective scope mutation from canonical build reachability
- historical corrective prepare: `prepare-821-report-pdf-export-scope.mjs` — **provenance-only** after this slice
- truth owner: `axis.report-range.v1`
- export pipeline: existing browser `window.print()` PDF path; vector text / A4 / no raster library
- downstream order preserved: Report PDF → Report Share Card → Portable Backup
- source proof: `scripts/axis-821-report-pdf-export-contract.mjs`

### Source-owner handoff

Before this slice, Report PDF runtime assembly used two sequential behavioral prepares:

1. `prepare-821-report-pdf-export.mjs` installed the complete PDF capability but appended its runtime at the late app-close boundary.
2. `prepare-821-report-pdf-export-scope.mjs` immediately removed that same freshly inserted runtime and relocated it beside the canonical `renderReport()` owner.

After this slice:

1. `prepare-821-report-pdf-export.mjs` locates the canonical `renderReport()` declaration itself and inserts the PDF runtime directly after that owner on the first pass.
2. It fails closed if the final PDF runtime marker is not exactly one or if the helper block escapes the canonical Report scope.
3. `prepare-821-report-pdf-export-scope.mjs` remains repository provenance but is not imported by the canonical release chain.

This is an architecture-only convergence: the generated Report PDF behavior, controls, range truth, optional export-time identity, print layout and export semantics are intended to remain byte/semantic-equivalent to the already-certified product contract.

### User-visible behavior that must remain exact

1. Report still reads historical facts only through `axis.report-range.v1`.
2. All-history, explicit local-day date range and single-Session routes remain unchanged.
3. “包含个人信息” remains optional export-time identity only; historical body/goal facts remain Session snapshot-owned.
4. PDF remains native browser print/PDF with vector text and A4 pagination; no `html2canvas`, `jsPDF`, `pdf-lib` or parallel raster exporter appears.
5. Report Share Card remains downstream of Report PDF and keeps its existing owner.
6. `axis.backup.v1` remains downstream and reachable exactly once with its exact local AXIS storage/media transport and rollback contract unchanged.
7. Active Home source convergence from PR #131 remains intact; no visual/action/storage owner is reopened.

### Ownership and migration boundary

This source convergence creates no LocalStorage namespace, IndexedDB database, Session writer, Encounter writer, Report truth owner, export store, network writer, recorder, Active owner, Flow owner, media owner or second PDF owner.

No data migration, historical fact rewrite, storage-key change, deployment-topology change or product-version change is permitted. Rollback is bounded to restoring `prepare-821-report-pdf-export-scope.mjs` build reachability and the previous late insertion point; no user data is involved.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening existing assertions:

1. deterministic `node build-release.mjs` succeeds with public/base AXIS 8.21 and `canonical-single-runtime` unchanged;
2. the Report PDF static contract proves direct source-owned lexical placement, one PDF marker, and `prepare-821-report-pdf-export-scope.mjs` unreachable from canonical lifecycle;
3. Report PDF Chromium and iPhone-like WebKit smokes remain green with the same range/export behavior;
4. Training Report UI, Report Range Truth and Report Share Card gates remain green;
5. Portable Backup source/built ownership plus Chromium/WebKit round-trip remain green;
6. Active Home, Deep Compatibility, Runtime, Current Release, Cross-Platform, Repository Contract and Work Continuity gates remain green on the same exact head;
7. after merge, the exact merged `main` SHA itself must pass fixed Vercel alias parity and the exact-prebuilt EdgeOne Chromium/WebKit mirror chain.

A failure is fixed at its actual owner. Tests, timeouts, product semantics and deployment parity must not be weakened merely to make this PR green. Provider limits must never be bypassed by creating another Vercel project, changing the fixed public URL or publishing EdgeOne independently.

## Next planned stage

Only after PR #133 is merged and the exact merged `main` artifact is Production-certified on both fixed providers:

1. select the next bounded source-owner migration from the remaining behavioral `prepare-*` / `postbuild-*` mutations by reachability and ownership risk;
2. prefer another narrow corrective layer whose replacement owner is already explicit before attempting broader app/index source movement;
3. preserve `canonical-single-runtime`, storage/history compatibility, `axis.backup.v1`, `axis.report-range.v1`, v61 classic-set ownership, v82/v87 Active ownership and canonical Session/Encounter ownership;
4. require deterministic build, static reachability proof and equal Chromium/iPhone-like WebKit evidence for every user-visible source-owner handoff;
5. keep shrinking source/build indirection without a framework rewrite or second truth path.

The target remains a strangler migration: fewer live mutation layers, clearer final owners, and source structure that increasingly matches the already-proven runtime architecture.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative.