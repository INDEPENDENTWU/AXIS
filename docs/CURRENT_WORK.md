# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `74ae516a5a67244b9a65ed22343edb9de42467a4`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#113**, immutable Profile / Goal Session truth
- PR #113 final tested head: `516c6f66b2890360f5475f842cfe92517d22bb87`
- PR #113 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production, including exact merged-main artifact parity plus Chromium and iPhone-like WebKit product flows
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged product already has one canonical Object schema/execution boundary, app-owned Session/Encounter persistence in `axis_v60_state`, v61 recording ownership, v82/v87 Active lifecycle, whole-item Flow, immutable Encounter metric/execution snapshots, per-user Object metric overrides, and immutable Profile/Goal Session-start snapshots. This work changes only current stable metric semantics/presentation for `intensity` plus shared metric-control optical typography. None of those factual owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, and `axis.metric-schema.v1`.

## Active change

**AXIS 8.21 — Metric Optical System + Intensity Redesign**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: main
- bounded delivery branch: `feat/821-metric-optical-system`
- intended pull request: **#114**
- exact base main SHA: `74ae516a5a67244b9a65ed22343edb9de42467a4`
- intended public release change: **none**
- new storage / Session writer / Encounter writer / Active owner / Flow owner / report owner: **none**

### Product rule

Metric controls must read as one coherent AXIS visual language rather than a collection of tiny units and suffixes.

Stable `intensity` is not a physical unit and is no longer presented as `x/10`. Its current canonical semantics are:

```js
{
  id: 'intensity',
  type: 'rating',       // existing portable primitive; no schema-version fork
  unit: '',
  min: 1,
  max: 20,
  step: 1,
  presets: [4, 8, 12, 16, 20]
}
```

Product semantics call this an ordinal level. The technical primitive remains `rating` because `axis.metric-schema.v1` already represents bounded ordinal scales with `min / max / step`; adding a new primitive would create unnecessary cross-platform schema churn.

Generic/custom `rating` is not the same stable property. A user-defined rating may continue to use its own range, including the existing 1–10 custom-rating default.

### Historical truth rule

This change is current-schema-only.

- no stored intensity fact is multiplied, remapped or inferred;
- an old Encounter whose immutable schema snapshot says `unit: '/10', max: 10` remains exactly that;
- only a current resolved Object schema with stable key/id `intensity` receives the new 1–20/no-unit semantics;
- new Encounter snapshots preserve the current resolved 1–20 schema;
- no history migration, backfill or second metric owner exists.

### Optical metric language

For the canonical 8.21 metric renderer:

- the property title row shows the property label, not a duplicate unit;
- a real unit such as `秒`, `kg`, `次`, `%` appears once beside the main value;
- stable intensity shows a pure centered number with no `/10`, `分`, `等级` or other suffix;
- main numeric glyphs use one optical size/weight and tabular numerals;
- real units remain secondary but legible, not 9.5–11px microtype;
- preset/level buttons remain legible and share the same typography across Quick/Photo/recording surfaces;
- stable intensity uses direct levels `4 / 8 / 12 / 16 / 20`, while −/+ still reaches every integer from 1 through 20;
- the existing canonical metric renderer remains the only renderer owner. This work is a final presentation/schema projection, not a second recorder.

### Runtime and Object-schema convergence

`lib/axis-object-capabilities.mjs` and `lib/axis-metric-schema.mjs` remain canonical portable truth. The final Web projection normalizes only current stable `intensity` after built-in definition + user Object override resolution, so built-in, overridden and custom Objects that use the stable `intensity` key all record the same current semantics.

Other custom rating keys are left untouched.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. `axis.object-capabilities.v1` and `axis.metric-schema.v1` both define current stable intensity as `rating`, unitless, 1–20, step 1;
2. current runtime projection exposes direct stable-intensity levels `4 / 8 / 12 / 16 / 20`;
3. stable intensity visibly contains no `/10` suffix and its main number is optically centered;
4. unit-bearing controls such as `保持时间` render their unit once beside the value and do not repeat it in the title row;
5. main values, units and presets meet the legibility floor enforced by physical computed-style assertions on 390px mobile viewport;
6. Quick Record physically saves intensity 20 and the immutable metric schema snapshot records `unit:''`, `min:1`, `max:20`, `step:1`;
7. an explicit historical `/10`, max-10 intensity schema snapshot remains unchanged by canonical normalization;
8. generic custom `rating` remains independently configurable and its default 1–10 semantics are not silently converted;
9. no new LocalStorage namespace, IndexedDB, server state, recorder, persistence writer, Encounter writer or history migration is introduced;
10. Chromium and iPhone-like WebKit both run the same physical hold + intensity Quick Record flow;
11. Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne, PR Convergence, Object Metric Override, Profile Session Truth and Metric Optical System gates are green on the same exact head;
12. after merge, the exact merged `main` SHA passes the existing AXIS Vercel Production deployment/fixed-alias proof, EdgeOne Production mirror, artifact parity, Chromium + iPhone-like WebKit production product flows, and clean runtime error verification.

A green test that merely hides `/10` while saving max-10 current schema, migrates old records, or creates a second metric renderer does **not** satisfy this work.

## Next planned stage

Only after this Metric Optical System PR is merged and Production-certified:

1. establish truthful Session factual summary / time truth (total, active, rest, pause/unaccounted) without changing Session ownership;
2. make historical range aggregation read only canonical Session/Encounter/Profile/Goal snapshot facts;
3. build the detailed Training Report as a read-only projection with arbitrary start/end date and all recorded metrics;
4. add professional paginated PDF export with personal-information inclusion controls and page-break protection;
5. add share-image export only after the report truth model is complete.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.