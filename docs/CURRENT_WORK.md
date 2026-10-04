# AXIS Current Work

Governed active milestone: `AXIS 8.27 — Reality Route`.
governed target branch: `main`.

Bounded delivery branch: `feature/827-reality-route` · PR **#160**.
Version decision: **8.26.5 → 8.27 / bump / sequence 23 / product-runtime**.
repository governance remains authoritative over conversation history.

## Production baseline at start of this work

AXIS **8.26.5 — Recording Review Geometry Stability** is the last Production-sealed baseline.

- exact sealed product/runtime SHA: `5bf575730c5c8de542c603d40b0f8b780204a342`
- sealed release PR: **#158**
- Current Release Gate: `37187139856`
- Deep Compatibility Gate: `37187139889`
- Vercel Production Gate: `37187159342`
- EdgeOne Production run: `37187139894`
- `axis.juele.fun` Production run: `37187139864`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

Chat history is not authoritative project memory. Conversation history is supplemental only. Repository governance, exact commits, built artifacts, and provider certification are authoritative.

## Active change

**AXIS 8.27 — Reality Route** is a Release candidate.

This stage makes continuation follow reality without rewriting intent. It adds a pure deterministic projection over the existing FlowRun and one bounded user action: **稍后**.

A current not-yet-started item may be deferred for this run. The route immediately reprojects to the next available item and returns to deferred items after the immediate route. This changes only temporary execution state inside the existing `axis_v60_state.flowRun` owner.

The reusable `axis.flow.v1` definition remains unchanged. Historical Encounter and `axis.flow-provenance.v1` facts remain unchanged. Manual detour recording does not consume a Flow step. An already-active item remains authoritative and cannot be deferred.

The pure owner is `lib/axis-reality-route.mjs` with projection schema `axis.reality-route.v1` and temporary constraint schema `axis.execution-constraints.v1`.

## Validation for this work

The 8.27 stage is complete only when:

- pure contract proves deterministic current / next / remaining / deferred projection;
- defer cannot mutate Flow intent or fabricate an Encounter;
- manual detours cannot fabricate Flow progression;
- temporary constraints persist only through the existing FlowRun and survive reload;
- no new localStorage/IndexedDB namespace or factual owner exists;
- ordinary standalone recording and established v61/v82/v87 ownership remain intact;
- Chromium and iPhone-like WebKit physically prove the same defer/reprojection behavior;
- one exact PR #160 head is fully green;
- that exact head merges;
- the exact merged-main artifact passes Vercel, EdgeOne, and `axis.juele.fun` Production certification.

## Cross-platform continuity

Foundation remains `axis-native-foundation-0` in native repository `INDEPENDENTWU/AXIS-iOS`.

Portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, and `axis.report-range.v1`. Reality Route is intentionally platform-neutral and must stay free of DOM, localStorage, WebKit, provider, network, and AI dependencies.

## Next planned stage

Do not start another product slice until 8.27 is exact-head green, merged, and Production-certified. After the Reality Route seal, the next bounded stage may broaden temporary constraints beyond unavailable/defer while preserving the same **Intent → Execution → Evidence → Evolution** runtime boundary.
