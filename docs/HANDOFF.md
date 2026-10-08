# AXIS Engineering Handoff

**Governed milestone:** AXIS 8.29 — Recording Friction Collapse.

**Status:** product-runtime candidate in PR #164. The last Production-sealed release remains AXIS 8.28 at exact runtime:

```text
df67fc0a20c0c34a79341315c8c85b5461acfe44
```

Product PR #162 and governance PR #163 sealed AXIS 8.28. All its Production provider evidence remains tied to that SHA.

## 8.29 implementation boundary

The canonical `app.js+v874` recorder and app-owned `state.active.events.push` remain the only factual writers. The new pure `lib/axis-recording-continuity.mjs` projects compatible previously-confirmed values from immutable Encounter schema snapshots. It creates no persistence owner.

The bridge may show those values as draft suggestions, restore unsaved input on same-Object re-render, and prevent overlapping asynchronous save operations. A new Encounter is created only after an explicit current save. Previous Encounter and Flow definitions are never modified.

Portable contract: `axis.recording-continuity.v1`. All historical portable contracts, including `axis.practice-loop.v1`, remain inherited.

## Release protocol

Version decision: **8.28 → 8.29 / bump / sequence 27 / product-runtime**.

Exact-head pure contract and Chromium/iPhone WebKit smoke → exact SHA merge of PR #164 → exact merged-main Vercel/EdgeOne/custom-domain verification → separate governance-only closeout. Do not rewrite 8.28 production certificate as 8.29 before those checks.
