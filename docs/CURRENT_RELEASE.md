# Current Release — AXIS 8.27

**Status: Release candidate**

AXIS **8.27 — Reality Route** is the current governed product-runtime candidate.

## Candidate identity

- candidate PR: **#160**
- delivery branch: `feature/827-reality-route`
- base release: **8.26.5**
- version decision: **8.26.5 → 8.27 / bump / sequence 23 / product-runtime**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- intended topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last Production-sealed baseline

The last Production-sealed release remains **AXIS 8.26.5**, release PR **#158**, exact product/runtime SHA:

```text
5bf575730c5c8de542c603d40b0f8b780204a342
```

Its certified evidence remains the authority while 8.27 is a candidate:

- Current Release Gate `37187139856`
- Deep Compatibility Gate `37187139889`
- Vercel Production Gate `37187159342`
- Public Production Alias Gate `37187159392`
- EdgeOne Production run `37187139894`
- `axis.juele.fun` Production run `37187139864`

runtime seal baseline: the exact 8.26.5 SHA above remains the durable Production runtime authority while 8.27 is unsealed. This is not a self-referential requirement: 8.27 can replace it only after the candidate exact head is green, the exact merged-main product artifact is known, and that artifact completes the governed Production certification chain.

## 8.27 behavior

Reality Route introduces a pure platform-neutral continuation projection:

```text
Flow intent
+ actual execution / Encounter evidence
+ temporary run constraints
        ↓
current / next / remaining / deferred / dropped / reasonCodes
```

The first temporary constraint is **defer current item**. A current item that has not started can be placed after the immediate remaining route. The reusable Flow definition is unchanged. Existing Encounters are unchanged. Once a current item has entered the existing Active lifecycle, it cannot be deferred.

Temporary route state is stored only inside the established `axis_v60_state.flowRun.temporaryConstraints` boundary. No `axis_route_*` storage, second Session/Encounter writer, second recorder, second Active owner, network dependency, or AI authority is introduced.

## Completion condition

8.27 is not Production-sealed until one exact PR #160 head passes the relevant contract and physical Chromium/WebKit gates, merges exactly, and the exact merged-main artifact passes Vercel, EdgeOne, and `axis.juele.fun` Production certification.
