# Current Work

## Production baseline at start of this work

AXIS **8.26.1 — Active Rest State** remains the fully Production-sealed Web runtime while **AXIS 8.26.2 — Active Rest Selector Binding** is the current Release candidate.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact sealed product/runtime SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- sealed release PR: **#153**
- current candidate PR: **#155**
- bounded delivery branch: `fix/8262-active-rest-selector`
- governed target branch: `main`
- architecture: `canonical-single-runtime`
- deterministic candidate build graph: **90** top-level steps
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

## Active change

**AXIS 8.26.2 — Active Rest Selector Binding** · Release candidate · PR **#155**.

Product version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**.

The bounded real-use UX audit across Active / Flow / Evolution found one concrete defect worth fixing before starting any broader slice: the 8.26.1 rest-state CSS targeted `.v87-restline`, but the canonical integrated Active Home stage renders the established v87-owned status node as `.v87Rest`. The advertised rest-state spacing, grouping and reduced-motion presentation therefore had no live DOM target.

The 8.26.2 scope is deliberately narrow:

1. **Bind the existing presentation to reality.** The rest-state treatment targets the canonical `.v87Rest` node.
2. **Preserve truth ownership.** Existing v87 pause/resume and timer behavior remain authoritative. No second Active, Session, Encounter, Flow, recorder or persistence owner is introduced.
3. **Keep the release corrective.** No set-completion, media, network, AI or architecture behavior is expanded.
4. **Preserve the sealed baseline until certification.** The 8.26.1 runtime SHA and provider evidence stay authoritative until the exact merged 8.26.2 artifact completes Production certification.

## Validation for this work

The exact PR #155 head must pass the governed repository/version/deep/current-release gate family before merge. Physical proof must run against the actual canonical `.v87Rest` node in Chromium and iPhone-like WebKit and verify:

- the intended spacing, grouped tonal surface, transition and responsive geometry are actually applied;
- `prefers-reduced-motion` disables the rest-state transition;
- the obsolete `.v87-restline` node is not required in the live DOM;
- pausing and resuming still mutate the existing `axis_v8_meta` activity truth through the established v87 owner;
- no horizontal overflow, duplicate action surface or new persistence/factual ownership is introduced.

After merge, the **exact merged main SHA** must independently complete fixed Vercel Production → exact-prebuilt EdgeOne Production → `axis.juele.fun` parity, with the governed Production browser proofs. Code existence, Preview deployment or a later unrelated deployment is not sufficient.

## Inherited fail-closed provenance

Historical release facts remain immutable provenance and do not reactivate older branches or owners. The following Report-era markers are retained verbatim because inherited source contracts still use them as compatibility sentinels; they do not describe the current 8.26.2 delivery branch.

- AXIS 8.26.1 sealed main product/runtime: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`; PR **#153**
- AXIS 8.26 sealed main: `11e50c75efa032e7759f8047ef46d233c335bb66`; PR **#152**
- AXIS 8.25.1 sealed main: `f4d3d02e1a7b655185806b2dbb3bface804d93cc`; PR **#151**
- AXIS 8.25 sealed main: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- AXIS 8.24.1 sealed main: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- AXIS 8.24 sealed main: `321647b9aaca783b7f6ba99ec66616941208c698`
- AXIS 8.23 sealed main: `2418103c786f2d0865aece49d738e9ed9161ef55`
- historical Report baseline sentinel — exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- historical Report delivery sentinel — bounded delivery branch: `feat/821-report-pdf-export`
- historical Report governance sentinel — governed active branch: `main`
- historical bounded Flow step execution-intent branch: `feat/821-flow-step-execution-intent`; exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- native foundation id: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts retained: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`

## Next planned stage

Finish **AXIS 8.26.2 — Active Rest Selector Binding** completely before opening another product slice: one exact green candidate head → ready PR #155 → merge to `main` → exact merged-main Vercel Production → exact-prebuilt EdgeOne Production → `axis.juele.fun` parity → Chromium/iPhone-like WebKit Production proof → governance seal.

Do **not** start another architecture branch, parallel factual owner or unrelated product expansion while this corrective release is unresolved.
