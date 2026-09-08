# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact `main` baseline for this bounded stage: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- deployment topology: one existing Git-connected AXIS Vercel Project on `main`, with EdgeOne mirroring the exact certified artifact
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`

### Inherited bounded-stage continuity references

These historical compatibility identifiers remain required by already-sealed 8.21 contracts. They are **not** the current Production baseline or active delivery branch:

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

## Active change

**AXIS 8.21 — Portable Backup & Origin Migration**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-portable-backup-origin-migration`
- PR: **#132**
- exact base `main` SHA: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- intended public release change: **none; remains 8.21**
- product objective: create a complete local-only AXIS backup that can migrate durable Web data and media between AXIS origins without cloud sync, hidden upload or a second truth owner
- schema: `axis.backup.v1`
- transport boundary: exact raw `axis_*` localStorage + exact canonical media bytes/MIME
- integrity: deterministic SHA-256 before mutation
- restore: preview → explicit confirmation → staged mutation → exact verification → verified rollback on failure
- safety: restore blocked while the canonical workout Session is active
- network ownership: none

### Architecture / debt discipline

This stage is not allowed to become another patch-on-patch chain.

The first implementation exposed a brittle full-string replacement of the historical `backupData()` function. CI correctly rejected it during the deterministic release build. The implementation was then refactored to **structural owner-boundary convergence**:

1. the existing backup function owner is located and replaced by declaration boundary, not by an exact historical body snapshot;
2. the existing canonical media bridge is extended at its single owner statement, without creating another IndexedDB owner;
3. backup/restore bindings are added at the existing backup binding boundary rather than by rewriting an adjacent block;
4. Settings UI replacement and migration note insertion are scoped to existing element owner boundaries, without adjacency fallback chains;
5. the transform fails closed if any expected owner becomes duplicated or unreachable.

No new LocalStorage namespace, IndexedDB database, Session writer, Encounter writer, recorder, Active owner, Flow owner, timer owner or network synchronization owner is introduced.

This does **not** claim that the whole historical repository is already debt-free. The repository still contains inherited prepare/postbuild layers accumulated across earlier releases. Current engineering policy is therefore:

- add no new duplicate factual/runtime owners;
- do not stack corrective runtime wrappers on top of one another;
- make each bounded change converge an existing owner once and fail closed on owner ambiguity;
- repair failures at the actual owner rather than weakening tests;
- retire inherited transforms only after reachability/supersession proof and dual-engine regression coverage.

### Completeness contract

`axis.backup.v1` is lossless for durable Web stores AXIS owns in this release:

- every `localStorage` key beginning with `axis_`, preserved as its exact raw string;
- every entry in the canonical AXIS media store, preserved as decoded media bytes plus MIME type.

Excluded by design: service-worker/cache state, transient in-memory UI state, temporary camera streams, Safari browser UI state, unrelated-origin storage and unrelated cookies.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following:

1. deterministic `node build-release.mjs` succeeds with canonical single-runtime topology unchanged;
2. static contract proves `axis.backup.v1`, exact AXIS namespace capture, SHA-256 verification, active-session block, verified rollback and no transport network owner;
3. the built artifact has one direct canonical media DB owner only;
4. Chromium proves exact export → destructive mutation → restore round trip;
5. iPhone-like WebKit proves the same round trip;
6. corrupted backup integrity is rejected before any mutation;
7. injected restore failure returns storage/media to the exact pre-restore image;
8. non-AXIS localStorage survives restore untouched;
9. inherited Runtime, Active, Flow/Object, Report, Repository, Work Continuity and cross-platform gates remain green on the same exact head.

After merge, the exact merged `main` SHA must reach the existing AXIS Vercel Production project and EdgeOne mirror before the release is called complete. `axis.juele.fun` must receive the exact approved main artifact, never a separate China-only fork.

## Next planned stage

After PR #132 is certified and merged, continue the governed **Source Convergence / architecture-debt stage** rather than expanding the prepare chain.

The first bounded audit remains the Active/Home family because it has known layered stage → compatibility → visual-convergence transforms. The backup feature also becomes a candidate for source convergence: once the canonical source owner boundary is stable and regression-proven, transport logic should be moved closer to that source owner and the temporary build integration removed instead of preserved indefinitely.

The target is not a rewrite. The target is fewer live mutation layers, explicit owners, deterministic builds, and source structure that increasingly matches the already-proven runtime architecture.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and Production evidence remain authoritative.