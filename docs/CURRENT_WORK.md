# Current Work

## Production baseline

AXIS **8.26.1 — Active Rest State** remains the fully Production-sealed Web runtime while **AXIS 8.26.2 — Active Rest Selector Binding** is the current Release candidate.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact sealed product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- sealed release PR: **#153**
- current candidate PR: **#155**
- bounded delivery branch: `fix/8262-active-rest-selector`
- governed active branch: `main`
- architecture: `canonical-single-runtime`
- Vercel sealed deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact 8.26.1 product/runtime SHA
- sealed Current Release Gate `35873718900` — success
- sealed Deep Compatibility Gate `35873718880` — success
- sealed Vercel Production Deployment Gate `35873771687` — success
- sealed Vercel Public Production Alias Gate `35873771699` — success
- sealed EdgeOne Production run `35873718809` — success
- sealed `axis.juele.fun` Production run `35873719011` — success
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

**Chat history is not authoritative project memory.** Repository contracts, exact commits, built artifacts and provider certification are authoritative.

## Active milestone

**AXIS 8.26.2 — Active Rest Selector Binding** · Release candidate · PR **#155**.

Product version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**.

The bounded real-use UX audit across Active / Flow / Evolution found one concrete defect worth fixing before starting any broader slice: the 8.26.1 rest-state CSS targeted `.v87-restline`, but the canonical integrated Active Home stage renders the established v87-owned status node as `.v87Rest`. The advertised rest-state spacing, grouping and reduced-motion presentation therefore had no live DOM target.

The 8.26.2 scope is deliberately narrow:

1. **Bind the existing presentation to reality.** The rest-state treatment targets the canonical `.v87Rest` node.
2. **Prove it physically.** Chromium and iPhone-like WebKit must verify the actual computed spacing, pill/tonal grouping, transition and reduced-motion behavior on that node.
3. **Preserve truth ownership.** Existing v87 pause/resume and timer behavior remain authoritative; the physical proof pauses/resumes the item and confirms the same `axis_v8_meta` owner changes state.
4. **No scope expansion.** No Session, Encounter, Flow, recorder, set-completion, storage, media, network, AI or architecture owner is introduced.

AXIS 8.26.1 remains the sealed baseline until the exact PR #155 head passes the full PR gate family and the exact merged main artifact completes Vercel → EdgeOne → `axis.juele.fun` certification.

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
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- native foundation id: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts retained: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`

## Completion condition

Do not call 8.26.2 complete because code exists. Completion requires one exact candidate head, green repository/version/deep/current-release/selector gates, merge to `main`, fixed Vercel Production from that exact merged SHA, exact-prebuilt EdgeOne parity, `axis.juele.fun` parity, and Chromium + iPhone-like WebKit physical proof on Production. Only then may governance be sealed and the next product slice begin.
