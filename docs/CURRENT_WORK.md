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

PR **#122** merged the bounded Flow Step Recording Intent work to `main` as `e61dd1d62252112d035d9f05034744ac78a74ec1`. Post-merge certification exposed a deterministic handoff defect in both Chromium and iPhone-like WebKit. The saved Flow-step `metricOverride` resolved correctly, but the final Flow Session-coordination architecture starts an ordinary current Flow item directly as a whole-item Active Encounter and intentionally bypasses Quick Record. That meant an **explicit** Flow-step recording override had no value-entry preflight at all. The first repair also exposed a second handoff issue: when a `weight + reps` override does enter Quick Record, v61's classic repeated-set owner and the app value recorder can otherwise consume/filter those fields instead of presenting the exact Flow-owned subset.

The bounded certification-repair branch is `fix/flow-step-recording-handoff`. The repaired boundary is deliberately narrow:

- a Flow step **without** its own `metricOverride` keeps the established whole-item direct-start path unchanged;
- a Flow step **with an explicit** `metricOverride` uses the already-existing canonical Quick/app recorder as a preflight so the user can enter exactly those requested values before the same canonical Encounter/Active lifecycle continues;
- this explicit preflight bypasses v61 classic-set presentation and makes the app-owned value recorder render the override schema verbatim;
- detours remain the existing Quick record-only route;
- no second recorder, writer, store, Flow owner or Active owner is introduced.

This repair is not certified until the dedicated Chromium/WebKit Flow gate and inherited release/compatibility gates pass on its exact final head and then on merged `main`.

### Product rule

The capability must expose the already-existing `axis.flow.v1` step-level `metricOverride` intent instead of inventing another schema, recorder or persistence owner.

A Flow step with no override continues to inherit the canonical Object/Profile recording content resolved by the existing Object system and keeps the existing direct whole-item Flow start behavior. A Flow step with an explicit override changes only the effective fields for that step in that Flow and therefore gets the bounded canonical recorder preflight needed to collect those values. When the Encounter is created, the existing canonical Encounter schema snapshot and `axis.flow-provenance.v1` snapshot freeze the effective metric ids as historical fact.

### UX contract

- every Flow editor step shows a compact `记录内容` row beneath the existing ordered item row;
- the default state is factual and explicit: `跟随项目` plus the currently resolved recording fields;
- opening the control exposes only metric choices for that step; selecting/deselecting fields creates or updates the existing `step.metricOverride.metrics` array;
- an override must retain at least one field; users who do not want a separate Flow-specific setting use `跟随项目设置`;
- `跟随项目设置` removes only that step's `metricOverride` and does not modify Profile/Object preferences;
- saved Flow intent survives reload;
- an inherited/default step keeps direct whole-item start, while an explicit Flow-step override opens the existing canonical recorder preflight and then continues through the existing Encounter / Active lifecycle;
- 390px mobile layout must remain horizontally stable in Chromium and iPhone-like WebKit.

### Scope boundary

This work must not change:

- Session / Encounter persistence ownership or historical values;
- the portable `axis.flow.v1` structure beyond using its already-supported `metricOverride` field;
- Object catalog definitions or the existing `state.profile.objectMetricOverrides` preference owner;
- Quick Record / canonical recorder ownership;
- Active lifecycle, pause/resume/rest/finish semantics or `axis_v8_meta` ownership;
- default whole-item Flow direct-start behavior, Flow sequencing, cursor advancement, detour semantics or Encounter append cardinality;
- Report truth, PDF, Share Card, media, AI, network, release identity or deployment topology.

No second Flow store, second metric schema, duplicated recording form, new API, or generated-output-only runtime fork is allowed.

## Validation for this work

This change is mergeable only when the exact final PR head proves all of the following:

1. deterministic `node build-release.mjs` completes with release identity 8.21 and canonical single-runtime topology unchanged;
2. a dedicated static contract proves the new surface is only a projection/editor for existing `axis.flow.v1.step.metricOverride`, the explicit current-item recorder route exists exactly once, and no persistence, recorder, Encounter or Active owner is added;
3. real Chromium and iPhone-like WebKit both edit one Flow step from inherited Object fields to a Flow-specific subset and save/reload that intent;
4. `跟随项目设置` removes the Flow-only override without writing `state.profile.objectMetricOverrides`;
5. default Flow steps still bypass Quick configuration, while an explicit Flow-step override uses the existing canonical recorder to collect the exact subset; the committed Encounter's `metricSchemaSnapshot` and `axis.flow-provenance.v1` snapshot preserve the effective metric ids;
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

## Certified continuation baseline

PR **#123** completed the Flow Step Recording Intent repair and the exact merged `main` SHA `396241c41b2f8eea80d45ca582352ea593c47036` is the certified continuation baseline for the next bounded product change. Release identity remains **AXIS 8.21**, architecture remains `canonical-single-runtime`, and the established Vercel/EdgeOne deployment topology is unchanged.

## Active bounded change — Flow Step Execution Intent

**AXIS 8.21 — Flow Step Execution Intent**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-flow-step-execution-intent`
- exact base main SHA: `396241c41b2f8eea80d45ca582352ea593c47036`
- intended public release change: **none; remains 8.21**
- existing schema owner: `axis.flow.v1.step.executionOverride`
- supported existing execution modes: `single`, `complete`, `timed`, `hold`, `sets`, `rounds`
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner / Object owner / Profile owner: **none**

### Product rule

This capability exposes execution intent that `axis.flow.v1` already owns. It does not invent a second execution model. Resolution remains:

`Object execution default → optional Flow-step executionOverride → canonical Encounter executionModeSnapshot → existing v82/v87 Active lifecycle when ongoing → immutable axis.flow-provenance.v1 snapshot`.

A Flow step without `executionOverride` must keep its current behavior. An explicit ongoing override such as `timed` must reach the existing direct current-item Encounter/Active path with the resolved mode. An explicit one-shot override such as `single` or `complete` must use the existing canonical recorder preflight and advance only after the canonical Encounter commit, without manufacturing an Active Activity.

### UX contract

- every Flow editor step adds one compact `进行方式` row next to the existing `记录内容` intent surface;
- default presentation is `自动 · <resolved mode>` and does not write an override;
- choosing a mode writes only `step.executionOverride` on that saved Flow step;
- `跟随项目设置` deletes only `step.executionOverride`;
- the available choices are the six modes already accepted by `axis.flow.v1`; no new execution enum is created;
- editing Flow execution intent must not mutate the underlying Object definition or Profile recording preferences;
- 390px mobile layout must stay horizontally stable in Chromium and iPhone-like WebKit.

### Runtime boundary

- `axis821ExecutionForRecording()` remains the canonical Flow execution resolver;
- the whole-item direct-start Encounter must snapshot the resolved Flow mode rather than bypassing it with the Object-only resolver;
- existing `v82` / `v87` remain the only Active truth/action owners;
- canonical recorder remains the only value-entry surface for an explicit one-shot Flow override and for existing metric-override preflight;
- canonical app Encounter append remains exactly one owner;
- one-shot canonical commits advance Flow directly; ongoing commits/starts continue to advance only after the matching existing Active finish event;
- detour semantics, Session truth, history, reports, media and deployment topology are unchanged.

## Validation for Flow Step Execution Intent

Merge is blocked until the exact final PR head proves:

1. deterministic `node build-release.mjs` passes and release identity stays 8.21;
2. static contract proves only existing `step.executionOverride` is edited and no owner/storage/API is introduced;
3. Chromium and iPhone-like WebKit prove an Object whose default is one-shot can be overridden to `timed`, producing an Encounter whose `executionModeSnapshot` and Flow provenance both say `timed` and whose Activity is owned by existing Active truth;
4. Chromium and iPhone-like WebKit prove an Object whose default is `timed` can be overridden to `single`, opening the canonical recorder, committing one Encounter, creating no Active Activity, and advancing the Flow;
5. `跟随项目设置` removes only the Flow execution override;
6. underlying Object execution defaults remain unchanged before/after run and reload;
7. historical Flow provenance and saved Flow intent remain byte-stable across reload;
8. inherited Flow Recording, Object, Report, governance, Production and EdgeOne gates remain green on the same exact head and then on exact merged `main`.
