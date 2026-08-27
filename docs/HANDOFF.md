# AXIS Engineering Handoff

This is the human/agent handoff entry for the current repository state. Chat transcripts are supplementary only.

## 1. Sealed Production baseline

**AXIS 8.21 — Flow / Canonical Recording Property Surface** is the current Production Web release.

Exact sealed main SHA:

`4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d`

- Vercel: `https://axis-five-puce.vercel.app` · deployment `dpl_GJDst6J8hHCtvn2AYjLLDe4yozCh` · READY
- Vercel Public Production Alias Gate `33028649168`: success
- Vercel Production Deployment Gate `33028649208`: success
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool` · deployment `dp6r0jcmk58a` · verification `33028633067`: success
- EdgeOne verification artifact: `9629477102`
- exact Vercel/EdgeOne prebuilt-artifact parity: success
- Chromium + iPhone-like WebKit Production lifecycle on the mirrored exact artifact: success

Production identity is `version/baseVersion = 8.21`, `architecture = canonical-single-runtime`.

Exact generated identity:

- release hash `8fe7eb766721`
- runtime hash `66ede67e8b84`
- CSS hash `cd3d3fbe0f29`
- one initial JavaScript request
- zero dynamic JavaScript chunks

## 2. Established owners that future work may not replace casually

- Session/Object/Encounter truth: `app.js` / `axis_v60_state`
- Object recording-property configuration: canonical Object create/edit surface / `metricSchema`
- Record value-entry surface: existing app recorder only; no schema editor
- classic weight+reps set facts: `v61.js` / `axis_v8_meta` only where immutable schema permits
- ongoing Active: established v82/v87 lifecycle/presentation owners
- Flow intent/runtime: existing app-owned `axis_v60_state.flows + flowRun`
- media: established app/source-first owners / `axis_v42_media`
- learning: `axis_v89_speak`
- portable Metric/Flow contracts: derived semantics, not alternate training storage

`metricSchemaSnapshot` remains Encounter authority for what was recorded; `executionModeSnapshot` remains authority for how it executed.

## 3. What 8.21 seals

### Recording property boundary

Recording properties are configured on the Object, not on Record.

An explicit empty `metricSchema: []` is valid and remains empty. Record must not silently reselect duration or another property. Legacy fallback applies only when explicit current schema truth is absent.

The Record surface renders canonical value controls only for the configured properties. It does not become a second Object editor, recorder or persistence owner.

### Flow boundary

Flow sequences Objects. One Object/item is the minimum completion unit.

```text
A current → 完成此项 → B current → 完成此项 → C current → 完成此项 → complete
```

Completing the current Flow item writes exactly one factual Encounter through the existing app-owned boundary and immediately advances the cursor.

Flow does not route through standalone Quick Record or `完成一组` before progression. Group Plan remains a standalone Object execution concern.

`临时记录其他` uses ordinary Quick Record with no Flow provenance and no cursor movement. Skip is intent-only and creates no Encounter.

### Persistence boundary

Flow definitions/current continuity extend only the existing `axis_v60_state` owner:

```text
axis_v60_state
├─ sessions
├─ active
├─ profile
├─ prefs
├─ flows[]
└─ flowRun
```

There is no `axis_flow_*` localStorage namespace, new IndexedDB database, second Session writer, second Encounter writer or second Active owner.

## 4. Historical provenance remains meaningful

Public release identity is now 8.21, but capability history is preserved:

- 8.18 — Object/Capture/Evidence foundation;
- 8.19 — Universal Practice Object authority;
- 8.20 — Executable Practice Objects;
- 8.20.1 — Object reliability and executionMode-led Active lifecycle;
- 8.21 — recording-property surface + Flow/item-unit lifecycle.

Do not rewrite old version-labelled provenance merely because the current public release advanced.

## 5. Current bounded work

**AXIS 8.21 — Production Seal Record**

- branch: `release/821-production-seal-record`
- behavior change: none
- purpose: make GitHub governance/docs match already-proved Production reality
- exact baseline: `4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d`

This branch must only update release/governance/handoff truth. It must not modify the product artifact or redeploy a different 8.21 implementation under the same seal record.

After this record is merged, start the next governed product milestone from the exact sealed 8.21 baseline.

## 6. Next product milestone

The repository roadmap establishes:

**AXIS 8.22 — Adaptive Defaults / Living Practice**

Guiding rule:

> Intelligence should make AXIS ask less, not speak more.

Before implementing adaptive behavior, Phase 0 must inspect existing factual history, Object defaults, recent-value memory, Flow runtime, Evolution projections and current ownership boundaries.

Adaptive defaults are suggestions only. They may reduce setup friction but may not:

- rewrite historical Encounters;
- silently mutate reusable Object defaults;
- create another training database;
- create a second recorder/Active/Encounter writer;
- turn inference into factual history;
- add noisy AI coaching copy as the primary experience.

## 7. Cross-platform continuity

Preserve:

- `axis-native-foundation-0`
- `INDEPENDENTWU/AXIS-iOS`
- `axis.domain.v1`
- `axis.data.v1`
- `axis.flow.v1`
- `axis.flow-provenance.v1`

Browser DOM/CSS details are not portable domain contracts.

## 8. Resume order

1. `governance/project-state.json`
2. this file
3. `CURRENT_RELEASE.md`
4. `CURRENT_WORK.md`
5. `ROADMAP.md`
6. `governance/owners.json` + `governance/retirements.json`
7. exact current Production manifest/deployment evidence
8. current milestone architecture/contract doc
9. exact current PR workflow state before merge or ownership changes

If documentation conflicts with current Git/CI/Production, verify reality first and repair the handoff rather than changing reality to match stale text.
