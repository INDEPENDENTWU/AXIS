# Current Release — AXIS 8.28

**Status: Release candidate**

AXIS **8.28 — Practice Loop Convergence** is the current governed product-runtime candidate.

## Candidate identity

- candidate PR: **#162**
- delivery branch: `feature/828-practice-loop-convergence`
- base release: **8.27**
- version decision: **8.27 → 8.28 / bump / sequence 25 / product-runtime**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- intended topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last Production-sealed baseline

The last Production-sealed release remains **AXIS 8.27**, release PR **#160**, exact product/runtime SHA:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

Its provider evidence remains authoritative while 8.28 is a candidate. This runtime seal baseline is not a self-referential requirement: 8.28 replaces it only after one exact PR head is green, the exact merged-main product artifact is known, and that artifact completes Vercel, EdgeOne and `axis.juele.fun` certification.

## 8.28 behavior

Practice Loop is a pure platform-neutral projection over existing Reality Route, FlowRun, Active and Session truth.

It derives one visible phase: `ready`, `between-items`, `executing`, `paused`, `recovering`, `settling`, or `complete`.

Reload and foreground restoration are prompt-free because no new decision is being made: the UI simply reprojects already-persisted truth. Existing Active truth remains authoritative. No Flow definition, Encounter, Session, recorder, Active owner, or storage namespace is created.

## Completion condition

8.28 is not Production-sealed until one exact PR #162 head passes pure contract plus Chromium/iPhone-like WebKit launch → reload → Active → reload → pause → reload continuity, merges exactly, and the exact merged-main artifact passes Vercel, EdgeOne and `axis.juele.fun` Production certification.
