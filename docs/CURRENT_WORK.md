# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- current merged `main` at start: `7098809608523bb3d1809f5dc7799899e047dc74`
- immediately preceding product repair: PR **#110**, true Quick / Photo metric numeric centering
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged 8.21 recording-property system already owns true numeric centering, canonical custom-Object metric configuration, Quick / Photo recording, immutable Encounter snapshots, existing v61 strength/set compatibility, existing v82/v87 Active lifecycle, whole-item Flow, and the established `axis_v60_state` / `axis_v8_meta` / `axis_v42_media` stores. This work must preserve those contracts.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Set-plan / Recording Single Ownership**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `fix/821-set-plan-recording-ownership`
- exact base main SHA: `7098809608523bb3d1809f5dc7799899e047dc74`
- intended factual/persistence ownership change: **none**
- new recorder/schema/Encounter/Active/Flow owner: **none**

### Product defect

For a custom Object whose execution mode is `sets`, the canonical Group Plan already edits the set-level facts `weight`, `reps`, and `sets`. The generic **本次记录** surface was nevertheless rendering those same three properties again. That produces two editable controls for one recording fact, adds unnecessary vertical complexity, and creates an avoidable possibility that set-plan values and generic values disagree.

This is an ownership defect, not a request to hide controls cosmetically.

### Canonical behavior

One fact has one editable owner in the current recording context:

- when execution mode is `sets`, Group Plan is the only editable owner for `weight`, `reps`, and `sets`;
- the generic recording-property surface renders only properties not already owned by Group Plan;
- if the configured schema contains only `weight / reps / sets`, the generic **本次记录** metric section is absent;
- if the schema also contains residual properties such as intensity, hold, distance, pace, incline, rating, boolean, or another supported custom property, the generic section remains but contains only those residual properties;
- non-set execution modes keep their existing generic recording controls;
- the Object's complete `metricSchemaSnapshot` remains immutable Encounter truth even when some values were edited through Group Plan rather than the generic recorder.

### Data integrity

The existing v61 save capture runs before the canonical app save writer and synchronizes the finalized Group Plan into the established legacy `weight`, active `reps`, and active `sets` values. The 8.21 metric reader therefore reuses those already-authoritative values when a set-owned generic input is intentionally absent. This preserves both legacy Encounter fields and the immutable `metrics.weight / metrics.reps / metrics.sets` map without adding a second writer, store, database, namespace, or migration.

The recording surface is responsible only for presentation ownership: it derives a residual recording schema from the full Object schema plus the existing `axis821ExecutionForRecording()` result. It does not infer a second execution mode and does not mutate Object defaults.

### Build / proof convergence

Historical metric-control compatibility and static proof files previously assumed that a full-schema Object always exposed generic `weight / reps / sets` controls. Those contracts are updated to the current single-ownership semantics instead of forcing the retired duplicate UI back into the product.

The physical recording-property smoke now includes both required set-plan cases:

1. a `weight / reps / sets` Object proves Group Plan is visible, the generic metric recorder is absent, and saving a changed set plan preserves complete immutable `schema`, `metrics`, and legacy facts;
2. a `weight / reps / sets / intensity` Object proves Group Plan continues to own the first three facts while the generic recorder contains only `intensity`, and the saved Encounter preserves all four values.

The same existing smoke continues to prove non-set controls, the five semantic metric families, true numeric optical centering, explicit empty schema, immutable Encounter facts, and no new recorder/storage owner.

A complete deterministic `node build-release.mjs` transaction passed before the formal source commit was accepted. Temporary migration scripts/workflows self-deleted and are not part of the intended PR diff.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. deterministic AXIS 8.21 `canonical-single-runtime` build remains green with the complete existing release graph;
2. a `sets` Object with only `weight / reps / sets` exposes exactly one editable owner for those facts: Group Plan;
3. the generic **本次记录** metric surface contains zero duplicate `weight`, `reps`, or `sets` controls in `sets` mode and disappears completely when no residual properties remain;
4. a `sets` Object with residual properties renders only those residual properties in the generic recorder;
5. Group Plan edits are reflected in both immutable Encounter `metrics` and established legacy fields after save;
6. full `metricSchemaSnapshot` and `executionModeSnapshot` remain correct and historical facts are never rewritten;
7. non-set Objects preserve their existing generic recording controls and the previously sealed `≤ 0.5 CSS px` numeric-centering invariant;
8. Quick Record and Photo Record keep the same canonical recorder, photo Evidence, preset/direct/step behavior, and localized UI;
9. Chromium and iPhone-like WebKit physical recording-property / Quick / Photo / executable-Object suites pass on the same exact head;
10. Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, Deployment Policy, EdgeOne and PR Convergence gates are green on that same head;
11. no new recorder, schema owner, Encounter writer, persistence namespace, database, Active owner, Flow owner, polling loop, MutationObserver, or timing workaround is introduced;
12. after merge, the exact merged SHA passes fixed Vercel Production proof, EdgeOne Chromium + iPhone-like WebKit proof, artifact parity, and Production runtime-error verification.

A green test that merely hides the duplicate controls while losing `metrics.weight / metrics.reps / metrics.sets` does **not** satisfy this work.

## Next planned stage

Only after this bounded product repair is merged and Production-certified:

1. keep Node/toolchain convergence as a separate infrastructure PR; do not mix the known historical Node 20.18.0 debt into this product change;
2. continue the 89-step build-owner audit and retire behavioral prepare/postbuild mutations one bounded source-owner slice at a time;
3. preserve the one-fact / one-owner rule for every future Object, Recording, Active, Flow and Encounter capability.

AXIS 8.21 — Flow / Session Blueprint
product/821-flow-session-blueprint

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
