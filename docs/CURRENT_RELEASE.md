# Current Release — AXIS 8.27

**Status: Production-sealed**

AXIS **8.27 — Reality Route** is the current Production-sealed product/runtime release.

## Exact release identity

- release PR: **#160**
- exact green PR head: `f79a25f10ac723ac7f6775a8b5c817b8fd884767`
- exact merged-main product/runtime SHA:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

- product version decision: **8.26.5 → 8.27 / bump / sequence 23 / product-runtime**
- seal reconciliation decision: **8.27 → 8.27 / confirm / sequence 24 / governance**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Production certification

The exact merged-main runtime above is the authority. Later governance-only commits or provider redeploys do not replace it.

- exact PR #160 head: **30 / 30 workflow runs success**
- exact merged-main/deployment certification: **29 / 29 workflow runs success**
- Current Release Gate: `37333415838`
- Deep Compatibility Gate: `37333415780`
- Vercel Production Gate: `37333475667`
- Public Production Alias Gate: `37333475632`
- Vercel deployment: `dpl_5dNTyZpuRcqV8vDGRvYi9GC8KGYm`
- Vercel public alias: `https://axis-five-puce.vercel.app`
- EdgeOne Production run: `37333415798`
- EdgeOne deployment: `dpmrug23mtim`
- EdgeOne public URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- `axis.juele.fun` Production run: `37333415692`

Vercel served exact **8.27 / d6044f0b30a92c007dd2fbab5792c2aa62dfd485** manifest parity. EdgeOne published the exact prebuilt Vercel-parity artifact and passed Chromium plus iPhone-like WebKit. `axis.juele.fun` converged to the same exact runtime and passed Chromium plus iPhone-like WebKit with seven API contracts matching Vercel.

## Reality Route

Reality Route is the first productized continuation layer under:

```text
Intent → Execution → Evidence → Evolution
```

It derives continuation from reusable Flow intent, actual execution facts, and temporary run constraints.

The first user-facing constraint is **稍后**. A current item that has not started can be temporarily deferred for this run. The immediate route continues, and the deferred item returns after the immediate route.

```text
Intent:  下拉 → 划船 → 肩推
Reality: 下拉暂时不可用
Route:   划船 → 肩推 → 下拉
```

The saved Flow is not reordered or rewritten. Historical Encounters are not rewritten. A manual detour cannot fabricate Flow progression. Once an item enters the existing Active lifecycle, it is authoritative and cannot be deferred.

Temporary route state lives only at `axis_v60_state.flowRun.temporaryConstraints`. There is no new storage namespace, Session writer, Encounter writer, recorder, Active owner, network dependency, or AI authority.

Portable contracts include `axis.reality-route.v1` and `axis.execution-constraints.v1`.

## Next bounded work

8.27 is closed. Any next product slice requires a fresh version decision. The natural continuation is richer temporary execution constraints while preserving the same pure Reality Route boundary and factual ownership model.
