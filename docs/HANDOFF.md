# AXIS Engineering Handoff

Governed milestone: `AXIS 8.27 — Reality Route`.

## Current release state

AXIS **8.27 — Reality Route** is a Release candidate in PR **#160**, branch `feature/827-reality-route`.

The last Production-sealed product/runtime remains **AXIS 8.26.5** at:

```text
5bf575730c5c8de542c603d40b0f8b780204a342
```

Sealed release PR: **#158**. Provider evidence remains attached to that exact runtime SHA until 8.27 earns a new exact Production certification chain.

## Product model to preserve

Reality is authoritative.

- **Object** — reusable practice semantics.
- **Flow** — intended continuity.
- **Execution** — what is currently happening.
- **Encounter** — immutable actual fact.
- **Evidence** — material anchored to real Encounters.
- **Evolution** — derived reveal over accumulated real history.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

No orchestration feature may create a second Session, Encounter, Active, recorder, or persistence owner.

## AXIS 8.27 Reality Route

Reality Route answers one deterministic question:

> Given the saved Flow, what has actually happened, what is active now, and what temporary constraint exists, what should the continuation route be?

The platform-neutral owner is `lib/axis-reality-route.mjs`.

Its projection schema is `axis.reality-route.v1`. Its temporary constraint schema is `axis.execution-constraints.v1`.

The first supported operation is **稍后**:

```text
Intent:
下拉 → 划船 → 肩推

Constraint:
下拉暂时不可用

Reality Route:
current   划船
next      肩推
deferred  下拉
```

This does not reorder or rewrite the saved Flow. It does not create an Encounter. It writes only `temporaryConstraints.deferredStepRefs` inside the existing `axis_v60_state.flowRun` owner.

When the immediate route is exhausted, deferred items return in original Flow order. A step that has already entered the existing Active lifecycle is authoritative and cannot be deferred.

Manual detour records remain real Encounters but do not consume the current Flow step unless they are the canonical current-item completion path.

## Ownership boundary

8.27 may derive `current`, `next`, `remaining`, `deferred`, `dropped`, and `reasonCodes`.

It may not:

- mutate `axis.flow.v1` definitions;
- rewrite historical Encounter or `axis.flow-provenance.v1` facts;
- create an `axis_route_*` storage namespace;
- become a Session/Encounter writer;
- become a recorder or Active owner;
- require network or AI.

The browser bridge delegates to existing app-owned FlowRun and existing v61/v82/v87 factual owners. Native implementations must consume the same pure semantics rather than reproduce browser-specific decision logic.

## Release requirements

Version authority is **8.26.5 → 8.27 / bump / sequence 23 / product-runtime**.

The stage is not complete until the exact PR #160 head is green in pure contracts plus Chromium and iPhone-like WebKit, merges exactly, and the resulting merged-main artifact is certified through Vercel, EdgeOne, and `axis.juele.fun`.

Do not begin the next product slice before that seal is established.
