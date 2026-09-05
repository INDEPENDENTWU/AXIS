# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- exact merged `main` baseline: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- merged Report work: PR **#118**, truthful custom-range professional paginated Training Report PDF export
- merged Production repair: PR **#120**, first-edit Training Record muscle-panel geometry stabilization
- merged Report projection: PR **#121**, truth-backed Training Report Share Card
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**
- Vercel Production and fixed public alias serve the certified merged `main` artifact for `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- the same merged SHA passed the Production Deployment / public alias chain and EdgeOne exact-artifact mirror including Chromium and iPhone-like WebKit verification

The merged product already has canonical Session / Encounter truth, `axis.flow.v1`, `axis.flow-provenance.v1`, existing Active lifecycle ownership, user-level Object recording preferences, immutable Profile / Goal snapshots, session-time truth, `axis.report-range.v1`, Training Report UI, native browser-print PDF and downstream PNG Share Card. Those owners remain sealed.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, `axis.metric-schema.v1`, `axis.session-time.v1`, `axis.profile-snapshot.v1`, `axis.goal-snapshot.v1`, and `axis.report-range.v1`.

### Inherited Report-stage continuity references

The following two lines are retained as historical bounded-stage identifiers required by the sealed #117 Training Report UI contract; they are **not** the current Production baseline or active delivery branch:

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`

### Inherited Share Card-stage continuity references

The following two lines are retained as historical bounded-stage identifiers required by the sealed #121 Report Share Card contract; they are **not** the current base or active delivery branch:

- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`

The current Production baseline and current bounded branch remain the values stated in the active sections of this document.

## Active change

**AXIS 8.21 — Flow Step Recording Intent**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-flow-step-recording-intent`
- exact base main SHA: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- intended public release change: **none; remains 8.21**
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner / Profile owner: **none**
- new product capability: **edit the recording-content intent of one saved Flow step without changing that Object's global recording preference**

### Post-merge certification repair

PR **#122** merged the bounded Flow Step Recording Intent work to `main` as `e61dd1d62252112d035d9f05034744ac78a74ec1`. Post-merge certification exposed a deterministic inherited handoff defect in both Chromium and iPhone-like WebKit: the saved Flow-step `metricOverride` resolved correctly, but v61 still classified a `weight + reps` subset as the classic repeated-set presentation and the app-owned value recorder then filtered those same Flow-owned values as set-plan-owned. The result was that the canonical recorder never exposed the requested Flow-step fields.

The bounded certification-repair branch is `fix/flow-step-recording-handoff`. The repair is constrained to the existing recorder handoff: an explicit active Flow-step `metricOverride` must bypass v61 classic-set presentation and the app-owned canonical value recorder must render the override schema verbatim. Execution ownership, Flow persistence, Object/Profile defaults, Active ownership, Encounter append ownership, Report truth and release identity remain unchanged. This repair is not certified until the dedicated Chromium/WebKit Flow gate and inherited release/Production gates pass on its exact final head and then on merged `main`.

### Product rule

The capability must expose the already-existing `axis.flow.v1` step-level `metricOverride` intent instead of inventing another schema, recorder or persistence owner.

A Flow step with no override continues to inherit the canonical Object/Profile recording content resolved by the existing Object system. A Flow step with an explicit override changes only the effective fields for that step in that Flow. When the Encounter is created, the existing canonical Encounter schema snapshot and `axis.flow-provenance.v1` snapshot freeze the effective metric ids as historical fact.

### UX contract

- every Flow editor step shows a compact `记录内容` row beneath the existing ordered item row;
- the default state is factual and explicit: `跟随项目` plus the currently resolved recording fields;
- opening the control exposes only metric choices for that step; selecting/deselecting fields creates or updates the existing `step.metricOverride.metrics` array;
- an override must retain at least one field; users who do not want a separate Flow-specific setting use `跟随项目设置`;
- `跟随项目设置` removes only that step's `metricOverride` and does not modify Profile/Object preferences;
- saved Flow intent survives reload and uses the existing canonical recorder / Active lifecycle for execution;
- 390px mobile layout must remain horizontally stable in Chromium and iPhone-like WebKit.

### Scope boundary

This work must not change:

- Session / Encounter persistence ownership or historical values;
- the portable `axis.flow.v1` structure beyond using its already-supported `metricOverride` field;
- Object catalog definitions or the existing `state.profile.objectMetricOverrides` preference owner;
- Quick Record / canonical recorder ownership;
- Active lifecycle, pause/resume/rest/finish semantics or `axis_v8_meta` ownership;
- Flow sequencing, cursor advancement, detour semantics or Encounter append cardinality;
- Report truth, PDF, Share Card, media, AI, network, release identity or deployment topology.

No second Flow store, second metric schema, duplicated recording form, new API, or generated-output-only runtime fork is allowed.

## Validation for this work

This change is mergeable only when the exact final PR head proves all of the following:

1. deterministic `node build-release.mjs` completes with release identity 8.21 and canonical single-runtime topology unchanged;
2. a dedicated static contract proves the new surface is only a projection/editor for existing `axis.flow.v1.step.metricOverride` and adds no persistence, recorder, Encounter or Active owner;
3. real Chromium and iPhone-like WebKit both edit one Flow step from inherited Object fields to a Flow-specific subset and save/reload that intent;
4. `跟随项目设置` removes the Flow-only override without writing `state.profile.objectMetricOverrides`;
5. the existing canonical recorder consumes the Flow-specific metric schema, while the committed Encounter's `metricSchemaSnapshot` and `axis.flow-provenance.v1` snapshot preserve the effective metric ids;
6. 390px mobile execution has no horizontal overflow and no page errors;
7. inherited Flow/Object, compatibility, Report, Work Continuity and repository-governance gates remain green on the same exact PR head;
8. after merge, the exact merged `main` SHA must reach the existing fixed Vercel AXIS Production project, pass normal Production/public-alias certification, and EdgeOne must mirror the same exact artifact successfully.

## Next planned stage

Only after Flow Step Recording Intent is merged and Production-certified:

1. keep `Object default → optional Profile preference → optional Flow-step metric intent → Encounter snapshot` as the single recording-content resolution chain;
2. evaluate Flow-step execution-mode override UX only if a real user case requires it; do not expose it merely because the schema technically supports it;
3. resume broader Flow/Object product work separately from Report representation work;
4. keep post-release architecture-governance cleanup separate from new user capability delivery.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
