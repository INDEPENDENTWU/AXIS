# AXIS Engineering Handoff

Governed milestone: `AXIS 8.28 — Practice Loop Convergence`.

## Current release state

AXIS **8.28** is a Release candidate in PR **#162**, branch `feature/828-practice-loop-convergence`.

The last Production-sealed product/runtime remains **AXIS 8.27** at:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

Sealed release PR: **#160**. Provider evidence stays attached to that exact runtime until 8.28 earns a new exact Production certification chain.

## Product model to preserve

Reality is authoritative.

- **Object** — reusable practice semantics.
- **Flow** — intended continuity.
- **Reality Route** — current continuation under actual execution and temporary constraints.
- **Execution / Active** — what is happening now.
- **Encounter** — immutable actual fact.
- **Evidence** — material anchored to real Encounters.
- **Evolution** — derived reveal over accumulated real history.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

## AXIS 8.28 Practice Loop

Pure owner: `lib/axis-practice-loop.mjs`.
Portable contract: `axis.practice-loop.v1`.

Practice Loop does not create a new state machine of record. It deterministically projects existing owners into a user-facing phase and next action. A reload or pageshow merely re-renders already-persisted truth.

It may derive `ready`, `between-items`, `executing`, `paused`, `recovering`, `settling`, and `complete`.

It may not mutate Flow definitions, rewrite historical Encounters, create storage, become a Session/Encounter writer, become a recorder/Active owner, or require network/AI.

## Release requirements

Version authority is **8.27 → 8.28 / bump / sequence 25 / product-runtime**.

The stage is not complete until exact PR #162 head is green in pure contracts plus Chromium and iPhone-like WebKit physical continuity, merges exactly, and the resulting merged-main artifact is certified through Vercel, EdgeOne and `axis.juele.fun`.
