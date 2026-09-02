# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `d3545c9e44ddc0a26ba76355831af8181cab6111`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product repair: PR **#111**, set-plan / recording single ownership
- PR #111 exact tested head: `f56348dc08e271f357571fbfbc012210a89a6ee2`
- PR #111 is merged and Production-certified on Vercel and EdgeOne, including Chromium + iPhone-like WebKit product flows
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged 8.21 Object system already owns canonical metric schemas, execution-mode resolution, Quick / Photo recording, Group Plan single ownership for set facts, immutable Encounter schema/execution snapshots, existing v61 strength/set compatibility, existing v82/v87 Active lifecycle, whole-item Flow, and the established `axis_v60_state` / `axis_v8_meta` / `axis_v42_media` stores. This work must extend user preference only and preserve those factual owners.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Per-item Recording Metric Overrides**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-object-metric-overrides`
- pull request: **#112**
- exact base main SHA: `d3545c9e44ddc0a26ba76355831af8181cab6111`
- intended factual ownership change: **none**
- intended persistence change: additive profile preference inside the existing app-owned `axis_v60_state`
- new recorder/schema/Encounter/Active/Flow owner: **none**

### Product capability

A user can decide which recording properties are relevant for each built-in AXIS Object without modifying the global catalog definition. The Settings surface provides **记录内容 → 按项目设置**, lets the user search a built-in equipment/activity, choose the exact metric set, save it, or restore the AXIS default.

Required semantics:

- built-in Object defaults remain immutable;
- overrides are keyed by stable Object ID under `state.profile.objectMetricOverrides`;
- no override means the built-in schema remains authoritative;
- an override may contain one metric, for example treadmill `duration` only;
- an explicit empty override is valid and means that Object records no numeric/property values;
- **恢复 AXIS 默认** removes the override rather than copying defaults into profile state;
- custom Objects retain their existing Object-owned `recording.metrics` / metric schema and are not modified by this built-in override layer.

### Canonical resolution

The existing 8.21 schema resolver remains the single runtime recording schema owner. The new preference layer wraps its built-in/default resolution only:

`Built-in Object Definition + User Profile Override = Resolved Object Schema`

That same resolved schema is consumed by the existing recorder, execution resolver, Quick Record, Flow recording path, history presentation and immutable Encounter `metricSchemaSnapshot`. There is no second recorder, save route or schema database.

The app continues to own persistence through the existing `save()` path. The only additive profile shape is:

```js
profile.objectMetricOverrides[objectId] = {
  version: 1,
  metrics: [...],
  updatedAt: <timestamp>
}
```

Absence and explicit empty are intentionally distinct. Historical Encounters keep the resolved schema snapshot that existed when they were recorded, so later preference changes never rewrite historical facts.

### Proof already established on the first candidate

The pure contract proves stable Object identity, dedupe/filtering, default-vs-override presence, treadmill duration-only, explicit empty, reset, immutable profile transformation and custom Object isolation.

The dedicated Chromium and iPhone-like WebKit physical smoke both passed on the initial PR candidate. Each engine physically:

1. opens Settings → 记录内容;
2. changes built-in treadmill to `duration` only;
3. verifies the built-in catalog Object itself is unchanged;
4. opens canonical Quick Record and proves only the duration control remains;
5. records duration `22` through the existing save owner;
6. verifies immutable Encounter schema/value/execution snapshots;
7. restores treadmill defaults;
8. saves an explicit empty schema on another built-in Object;
9. proves a custom Object remains Object-owned and unaffected.

The first candidate also passed the complete deterministic release build. The Work Continuity gate correctly rejected that candidate because executable changes require this file to be updated in the same PR. This governance update changes the exact candidate head, so every merge gate must be evaluated again on the new exact head; earlier green results are supporting evidence only.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. deterministic AXIS 8.21 `canonical-single-runtime` build remains green with the complete existing release graph;
2. built-in Object definitions and `window.__AXIS_873_LIBRARY__` remain immutable after a user saves an override;
3. profile persistence uses only existing `axis_v60_state.profile.objectMetricOverrides`; no new LocalStorage namespace, database or persistence owner exists;
4. no override resolves exactly to the existing built-in Object schema;
5. a treadmill duration-only override resolves to exactly `duration`, retains timed execution, and the canonical Quick recorder exposes exactly that resolved property;
6. saving through Quick Record preserves the exact resolved `metricSchemaSnapshot`, `metrics` values and `executionModeSnapshot` in the immutable Encounter;
7. an explicit empty override is distinct from absence and resolves to an empty schema without inventing legacy metrics;
8. restoring AXIS defaults removes the per-Object override and returns to the built-in definition;
9. custom Objects keep their existing Object-owned recording schema and are not intercepted by the built-in override layer;
10. existing set-plan single ownership remains intact: Group Plan remains sole editable owner for `weight / reps / sets` in sets execution while residual generic metrics behave exactly as sealed by PR #111;
11. Chromium and iPhone-like WebKit physical override flows pass on the exact final head;
12. Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne and PR Convergence gates are green on that same exact head;
13. no new recorder, Encounter writer, Active owner, Flow owner, catalog copy, polling loop, MutationObserver or timing workaround is introduced;
14. after merge, the exact merged `main` SHA passes normal existing-project Vercel Production deployment, fixed production alias proof, EdgeOne Production mirror, artifact parity, Chromium + iPhone-like WebKit production product flows, and runtime error verification.

A green test that merely hides default controls while mutating the built-in catalog, bypassing the canonical recorder, or losing the immutable Encounter schema snapshot does **not** satisfy this work.

## Next planned stage

Only after PR #112 is merged and Production-certified:

1. start a separate bounded Profile/body/goal data change; do not mix it into the Object override PR;
2. keep Profile fields optional and structured, including current/target measurements suitable for future body-composition imports or manual entry;
3. then add immutable Session-time Profile / Goal snapshots and truthful Session time facts before expanding reports;
4. build detailed Training Report as a read-only projection of Object/Encounter/Session/Profile snapshot truth;
5. add PDF / image export only after the report truth model is complete;
6. keep Node/toolchain convergence as a separate infrastructure change.

Future report architecture remains:

`Object Schema → Encounter Facts → Session Facts → Profile / Goal Snapshot → Training Report → PDF / Image projection`

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
