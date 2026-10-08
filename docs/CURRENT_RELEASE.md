# Current Release — AXIS 8.29

**Status: Release candidate**

AXIS **8.29 — Recording Friction Collapse** is the governed product-runtime candidate, not yet Production-sealed.

- candidate PR: **#164**
- branch: `feature/829-recording-friction-collapse`
- version decision: **8.28 → 8.29 / bump / sequence 27 / product-runtime**
- pure portable projection: `axis.recording-continuity.v1`
- runtime topology: canonical-single-runtime, one initial JavaScript request, zero dynamic chunks

AXIS 8.28 remains the exact **runtime seal baseline**. This is a historical Production certificate for the previous version, **not a self-referential requirement** for the 8.29 candidate to already be sealed. AXIS 8.29 cannot replace that runtime authority until its own exact merged-main and provider certification is complete.

## Last Production-sealed release

**AXIS 8.28 — Practice Loop Convergence** was released by PR #162, closed by governance PR #163, and certified at exact product/runtime SHA:

```text
df67fc0a20c0c34a79341315c8c85b5461acfe44
```

Vercel deployment: `dpl_3FLstNd9rvptfaA3YP1THwWfoazF`; EdgeOne deployment: `dpxaahz57drn`; custom domain: `https://axis.juele.fun`. The Production provider evidence remains tied to AXIS 8.28 until 8.29 certifies its exact merged-main artifact.

## Bounded 8.29 behavior

A current Record remains a separate user-confirmed fact. Last Encounter metrics may appear as suggested initial values only when the historical snapshot proves the same metric type and unit. In-sheet edits survive a same-Object re-render. A save transaction cannot overlap another save transaction for the same recorder invocation.

No new localStorage/IndexedDB namespace, Session writer, Encounter writer, Active owner or recorder is allowed. Reusable Flow definitions and immutable Encounter history are not edited.

## Completion condition

Pure contract, Chromium and iPhone-like WebKit physical tests, inherited 8.28 and 8.27 checks, and one exact PR #164 head all green; exact merge; then exact merged-main Vercel, EdgeOne and `axis.juele.fun` certification, followed by a separate governance-only closeout.
