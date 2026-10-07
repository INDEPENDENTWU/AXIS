# AXIS Current Work

Governed active milestone: `AXIS 8.28 — Practice Loop Convergence`.
governed target branch: `main`.

Bounded delivery branch: `feature/828-practice-loop-convergence` · PR **#162**.
Version decision: **8.27 → 8.28 / bump / sequence 25 / product-runtime**.
repository governance remains authoritative over conversation history.

Chat history is not authoritative project memory. Conversation history is supplemental only. Repository governance, exact commits, built artifacts, and provider certification are authoritative.

## Production baseline at start of this work

AXIS **8.27 — Reality Route** is the last Production-sealed baseline.

- exact sealed product/runtime SHA: `d6044f0b30a92c007dd2fbab5792c2aa62dfd485`
- sealed release PR: **#160**
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

## Active change

**AXIS 8.28 — Practice Loop Convergence** is a Release candidate.

This stage does not add a second workflow engine. It creates one pure `axis.practice-loop.v1` projection over Reality Route + existing FlowRun + existing v82/v87 Active + existing Session truth, then uses that projection to keep the visible practice loop coherent across reload/background/foreground boundaries.

The visible phases are ready, between-items, executing, paused, recovering, settling, and complete. Restoration never asks the user to reconfirm already-persisted truth.

## Validation for this work

The 8.28 stage is complete only when:

- pure projection proves every loop phase deterministically;
- launch → reload preserves the current Flow item without fabricating an Encounter;
- current item start delegates to the existing Active owner;
- reload during Active preserves the same Encounter and current step;
- pause → reload returns to the same paused item;
- no new localStorage/IndexedDB namespace exists;
- no second Session, Encounter, recorder or Active owner exists;
- reusable Flow intent and historical Encounter truth remain immutable;
- Chromium and iPhone-like WebKit prove the same physical continuity;
- one exact PR #162 head is fully green;
- that exact head merges;
- the exact merged-main artifact passes Vercel, EdgeOne and `axis.juele.fun` certification.

## Cross-platform continuity

Foundation remains `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`.

Portable contracts include `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.reality-route.v1`, `axis.execution-constraints.v1`, `axis.practice-loop.v1`, and `axis.report-range.v1`.

## Next planned stage

Do not begin Record friction collapse or Evolution Truth v2 until 8.28 is exact-head green, merged, and Production-certified. After the Practice Loop seal, the next bounded stage is recording friction reduction while preserving confirmed-fact semantics.
