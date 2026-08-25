# AXIS Engineering Handoff

This is the human/agent handoff entry for the current repository state. Chat transcripts are supplementary only.

## 1. Sealed Production baseline

**AXIS 8.20.1 — Executable Object Reliability** is the current Production Web release.

Exact sealed main SHA:

`fdbfea738489fca6b19b3c8c7b502977373e4e4f`

### Vercel

- fixed Production: `https://axis-five-puce.vercel.app`
- deployment: `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD`
- state: **READY**
- exact source SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- Production browser gate: run `32812905314` — **success**

### EdgeOne

- fixed Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment: `dpemq8bxjopa`
- verification run: `32812883590` — **success**
- exact source/artifact parity with Vercel: **success**
- fixed-domain bounded convergence: **success**
- real Chromium current-release flow: **success**
- real iPhone-like WebKit current-release flow: **success**
- final `EdgeOne Production` status: **success**

The fixed Production manifest reports `version/baseVersion = 8.20.1`, `architecture = canonical-single-runtime`, core `1269a6183152`, CSS `fc372a0bf2f9`, one initial JavaScript request and zero dynamic JavaScript requests.

## 2. Current 8.20.1 truths that 8.21 inherits

```text
Object
  ↓
metricSchema + executable semantics
  ↓
existing Recording owner
  ↓
existing Active lifecycle when ongoing
  ↓
Encounter
  ├─ metricSchemaSnapshot
  ├─ executionModeSnapshot
  └─ factual metrics / evidence
```

- `metricSchema` defines what is recorded.
- `executionMode` defines how execution progresses.
- execution modes are `single`, `sets`, `rounds`, `timed`, `hold`, `complete`.
- classic weight+reps fact ownership remains v61-scoped.
- `app.js` remains the base Session/Object/Encounter owner.
- `window.__AXIS_OBJECT_TRUTH__` and `window.__AXIS_EXECUTABLE_OBJECTS__` are APIs, not stores.
- authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`.

Do not reintroduce the 8.20 regression where explicit pace/duration/etc. Objects fall back to unrelated classic strength fields.

## 3. Current work

**AXIS 8.21 — Flow / Session Blueprint**

- branch: `product/821-flow-session-blueprint`
- Draft PR: **#88**
- current phase: **Phase 1 — Flow Resolver Foundation**

Phase 0 ownership/reuse inspection is sealed at exact head:

`84310744b528441f3fa8d3feb51e8ed149e02b78`

All nine baseline PR workflow families succeeded on that head: Repository, Work Continuity, Runtime Foundation, Current Release, Runtime, Deep Compatibility, Cross-Platform Foundation, PR Run Convergence and EdgeOne package contract.

### Phase 0 findings

1. `app.js` remains the correct Session/Encounter truth owner.
2. Group Plan (`v874-set-bridge.js`) is set-level preview/transaction behavior; it is not a reusable Flow store or Session model.
3. No existing independent Flow truth should be promoted into authority.
4. Flow therefore begins as portable intent + a pure resolver before persistence/UI.

## 4. Phase 1 foundation

Current foundation artifacts:

- `shared/contracts/axis-flow-v1.schema.json` — portable `axis.flow.v1` definition;
- `lib/axis-flow.mjs` — pure Flow normalization/effective-step resolver;
- `shared/fixtures/flow/` — mixed execution + override non-mutation fixtures;
- `scripts/axis-821-flow-contract.mjs` — resolver purity/precedence/fixture contract;
- `.github/workflows/axis-cross-platform-foundation.yml` — existing Cross-Platform gate now runs the Flow contract; no new workflow family.

Resolver precedence:

```text
explicit temporary Flow-step override
            ↓
Object-specific executable truth
            ↓
existing global/default fallback
            ↓
legacy compatibility only when current truth is absent
```

Important: Object schema-derived execution is Object-specific executable truth. A global fallback may not turn an explicit duration Object into an unrelated execution mode.

`metricOverride` and `executionOverride` remain separate. A Flow override is temporary context and never writes back into the Object.

The pure resolver is not authorized to:

- read/write localStorage, IndexedDB or another database;
- touch DOM/browser UI;
- create Session, Encounter or Active state;
- choose durable Flow storage;
- call network/AI;
- change Production identity.

## 5. Portable reference proof

The primary heterogeneous fixture is:

```text
A: duration + intensity → timed
B: weight + reps       → sets
C: completed           → complete
```

A second fixture proves a temporary Flow step can resolve different metrics/execution without mutating the reusable Object defaults.

Shared Web/iOS continuity remains:

- native foundation ID: `axis-native-foundation-0`
- native repo: `INDEPENDENTWU/AXIS-iOS`
- portable foundation: `axis.domain.v1`, `axis.data.v1`
- additive Flow contract: `axis.flow.v1`

## 6. Flow product invariants

1. Flow is intent, not factual history.
2. Starting a Flow does not make every referenced Object globally Active.
3. Flow delegates recording/Active/Session/Encounter actions to established owners.
4. Temporary step override never mutates Object defaults.
5. Saved Encounter truth remains self-contained after Flow edit/reorder/delete.
6. Skip, insert, replace and early finish are valid reality, not error states.
7. No second training database, Session writer, Encounter writer, recorder or Active owner.
8. No completion score, deviation penalty, streak/XP or category-specific mode proliferation.

Read [`AXIS_821_FLOW_SESSION_BLUEPRINT.md`](AXIS_821_FLOW_SESSION_BLUEPRINT.md).

## 7. Next implementation slice

After the current pure resolver head is green:

**Phase 1B — Immutable Encounter Flow Provenance**

Add the smallest read-only snapshot/provenance builder for fields such as `flowRef`, `flowStepRef` and frozen effective context. It must delegate the actual save to the existing `app.js` Encounter writer and must prove that subsequent Flow edits cannot mutate an already-created snapshot.

Only after this is sealed may Phase 2 select the smallest app-owned representation inside the existing state boundary and add visible Flow composition/launch UI.

## 8. Active Action Lens — independent experiment

`ACTIVE_ACTION_LENS_EXPERIMENT.md` remains non-blocking presentation research for easier one-hand `完成一组` / `暂停` / `完成` actions.

It has zero permission to own Flow state, storage, completion facts, Active truth or history. If mobile testing does not show clear benefit, retire it without affecting 8.21.

## 9. Ownership summary

- base session/Object/Encounter state: `app.js` / `axis_v60_state`
- classic set metadata: `v61.js` / `axis_v8_meta` where immutable classic schema permits
- ongoing Active: established v82/v87 lifecycle/presentation owners
- media: established app/source-first media owners / `axis_v42_media`
- learning: isolated `axis_v89_speak`
- Flow resolver: portable/read-only, **not** an authoritative persistence or action owner
- Active Action Lens: presentation experiment only

## 10. Required reading order when resuming

1. `governance/project-state.json`
2. this file
3. `CURRENT_RELEASE.md`
4. `CURRENT_WORK.md`
5. `AXIS_821_FLOW_SESSION_BLUEPRINT.md`
6. `shared/contracts/axis-contract-manifest.json`
7. `shared/contracts/axis-flow-v1.schema.json`
8. `scripts/axis-821-flow-contract.mjs`
9. `governance/owners.json` + `governance/retirements.json`
10. exact current CI/Production status before declaring any release

If documentation conflicts with current Git or Production, verify reality and repair the handoff. Do not repair reality to match stale documentation.
