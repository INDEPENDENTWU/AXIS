# Current Release — AXIS 8.21

**Status: Production sealed**

AXIS **8.21** is the current public Web release. This document records the product/runtime seal baseline. It deliberately does **not** claim that its recorded provider deployment IDs will forever be the latest deployment: later governance-only commits can redeploy `main` without changing the sealed runtime behavior.

## Exact release identity

- release: **AXIS 8.21 — Executable Object System + native whole-item Flow**
- release PR: **#108**
- sealed runtime baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- release build: **89 deterministic top-level steps**
- canonical topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

The SHA above is the last runtime-changing product commit sealed through both providers. It is a durable release baseline, not a self-referential requirement that every later documentation/governance deployment use the same Git SHA.

## Production seal evidence

### Vercel

- public alias: `https://axis-five-puce.vercel.app`
- seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX`
- seal source SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- state: **READY**
- target: **Production**
- AXIS Production Deployment Gate: `33278987731` — **success**
- AXIS Public Production Alias Gate: `33278987745` — **success**
- exact manifest / immutable asset parity: **success**
- real current-release Chromium Production flow: **success**
- Vercel runtime error query after seal: **no runtime errors found**

### EdgeOne

- public mirror: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- seal deployment: `dpysj966i0hh`
- seal verification run: `33278965885` — **success**
- exact prebuilt 8.21 source/manifest parity with Vercel: **success**
- seven API contracts matched Vercel: **success**
- live Chromium product/Flow proof: **success**
- live iPhone-like WebKit product/Flow proof: **success**

EdgeOne remains an exact prebuilt-artifact mirror; it does not reinterpret product source independently of the verified Vercel release.

## What 8.21 seals

### Object and recording truth

- Explicit Object `metricSchema` remains reusable Object truth.
- `executionMode` remains separate from metric semantics: `single / sets / rounds / timed / hold / complete`.
- Every saved Encounter freezes `metricSchemaSnapshot` + `executionModeSnapshot`.
- Classic repeated weight+reps set facts remain v61-owned only when immutable Encounter schema grants that authority.
- Quick Record saved-item metadata is source-owned and localized; raw internal `strength/cardio/...` enum IDs do not leak into user-facing saved-item metadata.

### Whole-item Flow

- `axis.flow.v1` describes intended continuity; Flow is not historical truth.
- A **complete Object is the Flow completion unit**. Set-level Flow completion authority is retired.
- `开始此项` starts the current Flow item directly through the existing v82/v87 Active lifecycle instead of opening Quick Record configuration.
- Pause/resume/finish continue to delegate to the established Active owners.
- Explicit detours use canonical Quick Record as record-only actions and do not consume or advance the current Flow item.
- Ordinary `single/complete` Objects remain one-shot outside Flow. Only an Encounter already frozen as an immutable Flow whole-item may reuse the existing v82/v87 Active lifecycle.
- Flow definitions/run continuity stay inside `axis_v60_state`; no `axis_flow_*` storage namespace, new database, recorder, Encounter writer or Active owner exists.

### Metric controls and geometry

- Quantity, time, pace, scale and choice controls share the canonical recording owner.
- Initial numeric width is resolved before interaction and the same fit helper updates after direct input, step and preset changes.
- Value + unit optical alignment is physically asserted at **≤ 0.5 CSS px** where applicable.
- Preset rails use symmetric, full-width geometry rather than content-width drift.
- The strict physical assertions were not relaxed to make the release pass.

## Acceptance evidence

The exact PR #108 head passed all ten formal PR workflow families before merge:

1. Current Release
2. Runtime
3. Deep Compatibility
4. Runtime Foundation
5. Universal Practice Object
6. Repository Contract
7. Work Continuity
8. Cross-Platform Foundation
9. PR Run Convergence
10. EdgeOne Production Mirror

Chromium and iPhone-like WebKit both passed the current 8.21 Flow and executable Object paths. The merged-main Production deployment gate then passed exact manifest/assets plus real Production Chromium behavior. EdgeOne passed exact parity and dual-engine live verification.

A `Branch hygiene` push run was cancelled only because the workflow intentionally uses one concurrency group with `cancel-in-progress: true`; the subsequent PR-close hygiene run completed successfully. It is not an unresolved release failure.

## Authoritative ownership after 8.21

- Session / Object / Encounter truth: `app.js` / `axis_v60_state`
- classic repeated-set facts: `v61.js` / `axis_v8_meta` when immutable schema permits
- ongoing Active lifecycle/presentation: existing v82/v87 owners
- Flow intent/orchestration: app-owned fields `axis_v60_state.flows` + `axis_v60_state.flowRun`
- media persistence: established app owner / `axis_v42_media`
- learning: isolated `axis_v89_speak`
- portable semantics: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`

No factual owner was added by the 8.21 release.

## Baseline for further work

Future work starts from AXIS **8.21** as the sealed product/runtime baseline. Post-release architecture governance must preserve this behavior while incrementally moving behavioral build-time mutation back into explicit source owners. Any later product behavior change requires its own bounded scope and physical proof.
