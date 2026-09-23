# Current Work

## Production baseline

AXIS **8.26.1 — Active Rest State** is the fully Production-sealed Web runtime.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact sealed product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- release PR: **#153**
- completed delivery branch: `fix/8261-active-rest-state`
- governed active branch: `main`
- architecture: `canonical-single-runtime`
- deterministic build graph: **89** top-level steps
- Vercel deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact product/runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — success
- `axis.juele.fun` Production run `35873719011` — success
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

**Chat history is not authoritative project memory.** Repository contracts, exact commits, built artifacts and provider certification are authoritative.

## Completed milestone

**AXIS 8.26.1 — Active Rest State** is complete and Production-sealed.

Product version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**. Post-certification repository evidence uses same-version governance confirmations; these confirmations never replace the sequence 14 product decision or the sealed product/runtime SHA.

This slice corrected one observed Active-state presentation problem without creating another truth owner:

1. **Rest-state breathing room.** The existing paused/rest line no longer sits visually against the upper boundary.
2. **One readable rest state.** `休息` and its timer read as one restrained state capsule rather than loose text.
3. **Bounded motion only.** The short state-entry transition is presentation-only and disabled under `prefers-reduced-motion`.
4. **Truth unchanged.** Existing v87 pause/resume behavior and timer truth remain authoritative. No Session, Encounter, Flow, recorder, set-completion, storage, network or AI behavior changed.

AXIS 8.26 remains inherited and Production-sealed: atomic save settlement, executable ongoing Flow admission, one-shot canonical recorder ownership, foreign Active pause/preserve, the post-fact kinetic set cue and the quieter Home hierarchy are not reimplemented by 8.26.1.

## Certification result

The exact PR #153 head passed all required PR gates. The exact merged product/runtime SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` then passed Current Release, Deep Compatibility, fixed Vercel Production, Public Production Alias, exact-prebuilt EdgeOne Production and `axis.juele.fun` certification. Chromium and iPhone-like WebKit physical proof are green where required.

Failures were fixed at their actual owners; no meaningful assertion, ownership boundary or user-data protection was weakened to make certification pass.

## Inherited fail-closed provenance

Historical release facts remain immutable provenance and do not reactivate older branches or owners.

- AXIS 8.26.1 sealed main product/runtime: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`; PR **#153**
- AXIS 8.26 sealed main: `11e50c75efa032e7759f8047ef46d233c335bb66`; PR **#152**
- AXIS 8.25.1 sealed main: `f4d3d02e1a7b655185806b2dbb3bface804d93cc`; PR **#151**
- AXIS 8.25 sealed main: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- AXIS 8.24.1 sealed main: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- AXIS 8.24 sealed main: `321647b9aaca783b7f6ba99ec66616941208c698`
- AXIS 8.23 sealed main: `2418103c786f2d0865aece49d738e9ed9161ef55`
- historical bounded Flow step execution-intent branch: `feat/821-flow-step-execution-intent`; exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`
- native foundation id: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts retained: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`

## Next planned stage

Do **not** start another architecture branch or parallel owner yet.

First perform one bounded real-use UX audit across **Active, Flow and Evolution** against the sealed 8.26.1 product. Select only the single highest-value user problem that survives that audit, then govern the next version from that concrete problem.
