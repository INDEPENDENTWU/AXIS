# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded follow-up: `1d9e08ae40f555151133a9fce4bc343f18359af2`
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

PR #133 is merged and fully Production-certified at `1d9e08ae40f555151133a9fce4bc343f18359af2`. The fixed Vercel Production deployment is Git-sourced, READY, alias-clean, and `/axis-build.json` reports the exact same source SHA with public/base 8.21 and `canonical-single-runtime`. The exact EdgeOne Production Mirror also completed artifact parity plus Chromium and iPhone-like WebKit real-production verification. This exact SHA is the certified base for the next bounded source-owner migration.

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
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`

PR #129 established the flat, centered, Home-integrated ordinary Active stage. PR #130 refined tactile hold/rest presentation. PR #132 added structural-owner portable backup transport. PR #131 retired the late Active Home visual prepare from canonical build authority. PR #133 retired the immediate Report PDF corrective scope prepare from canonical build authority. All remain release-blocking continuity for this work.

## Active change

**AXIS 8.21 — Flow Active Boot Source Convergence**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-flow-active-boot-source-convergence`
- exact certified base `main` SHA: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- intended public release change: **none; remains 8.21**
- intended user-visible behavior change: **none**
- source-owner objective: make `prepare-821-flow-active-convergence.mjs` emit its two existing lifecycle listeners directly inside the private Flow/app lexical scope on first pass, eliminating the immediately-following corrective boot-scope mutation from canonical build reachability
- historical corrective prepare: `prepare-821-flow-active-boot-scope.mjs` — **provenance-only** after this slice
- Flow truth: app-owned `axis_v60_state.flows` + `flowRun`; orchestration/intent only, never history
- Active owner: existing `v82/v87`; no Flow-specific Active lifecycle
- Encounter writer: existing single canonical app append only
- semantic proof remains source-owned in `scripts/axis-821-item-unit-flow-smoke.mjs` and the Flow execution-intent gate

### Source-owner handoff

Before this slice, Flow Active assembly used two sequential behavioral prepares:

1. `prepare-821-flow-active-convergence.mjs` created the canonical current-item/detour orchestration and emitted the scan-sheet close plus `axis:active-finished` listeners at its late tail.
2. `prepare-821-flow-active-boot-scope.mjs` immediately removed those same listeners and relocated them beside `axis821FlowRecordingIntent`, `axis821FlowRecorderContextClear` and `axis821FlowOnActiveFinished` so their private helpers remained lexically reachable.

After this slice:

1. `prepare-821-flow-active-convergence.mjs` emits those exact listeners inside its private helper block before `axis821CompleteCurrentItem()` on the first pass.
2. Its runtime marker seals `bootScopedListeners:true`, and source assertions fail closed if either listener duplicates, escapes the helper scope or requires exporting a private helper.
3. `prepare-821-flow-active-boot-scope.mjs` remains repository provenance but is not imported by the canonical release chain.
4. `prepare-821-flow-session-coordination-scope.mjs` remains reachable because it is a verifier-only semantic proof, not the behavioral corrective layer being retired here.

This is architecture-only convergence. The Flow current-item start, detour recording, one-shot progression, ongoing Active pause/resume/finish behavior and persisted Encounter/Flow provenance semantics must remain unchanged.

### User-visible behavior that must remain exact

1. A current Flow item still begins directly through the existing canonical recording/Active path; no Quick configuration detour returns.
2. A temporary “记录其他” remains record-only: it does not skip, consume or advance the current Flow item and does not create a competing Active lifecycle.
3. Ongoing `sets` / `rounds` / `timed` / `hold` items continue to delegate to existing v82/v87 Active pause/resume/rest/finish semantics.
4. Ordinary `single` / `complete` items remain one-shot and advance only after the canonical Encounter commit.
5. One complete Object remains the Flow completion unit; set-level completion authority remains retired.
6. `state.active.events.push(...)` remains a single canonical app-owned Encounter append.
7. No new LocalStorage namespace, IndexedDB store, network writer, picker, recorder, Active owner, Session owner, Encounter writer or Flow history store appears.

### Ownership and migration boundary

This source convergence changes only the source location that emits two already-certified lifecycle listeners. It introduces no data migration, history rewrite, storage-key change, release-version change or deployment-topology change.

Rollback is bounded to restoring `prepare-821-flow-active-boot-scope.mjs` canonical reachability and the previous late listener emission. No user data is involved.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening existing assertions:

1. deterministic `node build-release.mjs` succeeds with public/base AXIS 8.21 and `canonical-single-runtime` unchanged;
2. the Flow execution-intent static contract proves direct source-owned listener placement and proves `prepare-821-flow-active-boot-scope.mjs` is unreachable from the canonical lifecycle;
3. the canonical whole-item Flow physical smoke remains source-owned and unchanged in meaning;
4. Flow step execution/recording intent, Runtime, Active Home, Session/Encounter, Object Metric and Cross-Platform gates remain green;
5. Deep Compatibility and Current Release remain green in Chromium and iPhone-like WebKit;
6. Repository Contract and Work Continuity remain green on the exact same head;
7. after merge, the exact merged `main` SHA itself must pass fixed Vercel alias parity and the exact-prebuilt EdgeOne Chromium/WebKit mirror chain.

A failure is fixed at its actual owner. Tests, timeouts, product semantics and deployment parity must not be weakened merely to make this work green. Provider limits must never be bypassed by creating another Vercel project, changing the fixed public URL or publishing EdgeOne independently.

## Next planned stage

Only after this bounded Flow Active boot source convergence is merged and the exact merged `main` artifact is Production-certified on both fixed providers:

1. continue auditing the remaining deterministic release mutations by source owner and reachability;
2. prefer another narrow corrective behavioral layer whose replacement owner is already explicit;
3. keep verifier-only scope contracts reachable until they can be moved separately without weakening semantic proof;
4. preserve `canonical-single-runtime`, storage/history compatibility, `axis.backup.v1`, `axis.report-range.v1`, v61 classic-set ownership, v82/v87 Active ownership and canonical Session/Encounter ownership;
5. require deterministic build, static reachability proof and equal Chromium/iPhone-like WebKit evidence for every source-owner handoff.

The target remains a strangler migration: fewer live mutation layers, clearer final owners, and source structure that increasingly matches the already-proven runtime architecture.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative.
