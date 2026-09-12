# Current Work

## Last fully sealed Production baseline

AXIS **8.22 — Truthful Evolution Replay** remains the last fully Production-sealed Web runtime until the current AXIS 8.23 certification chain is complete.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact sealed 8.22 `main`: `cbcecfe9f7bfd18c8f05ced2bd760a60a03b15b5`
- sealed 8.22 runtime product commit: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- sealed product PR: **#144**
- architecture: `canonical-single-runtime`
- cross-platform foundation: `axis-native-foundation-0` (`INDEPENDENTWU/AXIS-iOS`)
- shared portable domain contracts: `axis.domain.v1`, `axis.data.v1`
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

Chat history is not authoritative project memory; repository contracts, exact commits, built artifacts and provider certification are authoritative.

## Merged AXIS 8.23 product candidate

**AXIS 8.23 — Replay Evidence Continuity** was merged from PR **#146** after its exact PR head passed the product/runtime/version/repository gates.

- bounded product delivery branch: `product/823-replay-evidence-continuity`
- exact product PR head: `b84b10edc874e0448e717038de74a1b8b5f30a49`
- exact merged product `main`: `8e4c906e5cd380b577fa340b4d73d57bc5de9204`
- release transition: **8.22 → 8.23**
- decision: `bump`
- sequence: **7**
- change class: `product-runtime`
- deterministic graph: **86** top-level steps
- Vercel deployment: `dpl_8UywHniBzopD149NHGcudZUyJq7M`
- Vercel Production Deployment Gate `34671983407` — **success**
- Public Production Alias Gate `34671983433` — **success**

### AXIS 8.23 product behavior

- v822 Replay emits exact transient Encounter identity only after explicit Replay rail / previous / next navigation.
- v815 Media Evidence remains the sole Evidence read/presentation owner and resolves that exact Encounter.
- selected Encounter with media → show that Encounter's evidence.
- selected Encounter with no media, while the Object has media elsewhere → explicit **“这一次没有留下影像证据”** state; never silently substitute another date.
- wholly no-media Object → preserve the inherited data-only/no-capture-pressure state.
- manual Evidence inspection remains independent until the next explicit Replay navigation re-anchors it.
- inherited Replay/Evidence initial mount choices remain unchanged.
- no new Session/Encounter/media/storage/network/AI writer or truth store was introduced.

## Active change — EdgeOne workflow certification repair

The 8.23 runtime itself is not being changed. Exact merged main `8e4c906e5cd380b577fa340b4d73d57bc5de9204` reached and passed fixed Vercel Production, but EdgeOne push run `34671967533` failed before creating any jobs. The workflow run started and ended in the same second with `jobs=[]`, so this is a workflow parsing/startup defect rather than a product/runtime failure.

The defect was introduced by compact YAML flow mappings around GitHub expression values such as `env: { GH_STATUS_TOKEN: ${{ github.token }} }`. The previously certified EdgeOne workflow used block mappings. The bounded repair restores block-form `env` mappings while preserving all 8.23 exact-artifact, Chromium and iPhone WebKit proofs.

- governed target branch: `main`
- active repair branch: `infra/823-edgeone-workflow-yaml-fix`
- exact base: `8e4c906e5cd380b577fa340b4d73d57bc5de9204`
- public release: **8.23 unchanged**
- version decision: `confirm`
- sequence: **8**
- base release: **8.23**
- release: **8.23**
- change class: `infrastructure`
- intended user-visible behavior change: **no**
- runtime/build product graph change: **none**
- data/storage/ownership change: **none**

The repair must not remove any 8.23 EdgeOne requirement: exact Vercel-golden SHA/version/base parity, exact canonical artifact parity, EdgeOne exact-prebuilt deployment, 8.23 Chromium proof, 8.23 iPhone WebKit proof, and final `EdgeOne Production` commit status.

## Durable inherited certification ledger

The current infrastructure repair does not supersede inherited product provenance. These entries are retained for fail-closed contracts.

### Cross-platform / native foundation provenance

- `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable domain contract: `axis.domain.v1`
- portable data contract: `axis.data.v1`

### AXIS 8.21 Flow intent provenance

- bounded delivery branch: `feat/821-flow-step-recording-intent`
- exact certified base main SHA: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded delivery branch: `feat/821-flow-step-execution-intent`
- exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`

### AXIS 8.21 Active Home provenance

- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`

### AXIS 8.21 Report provenance

- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- truth schema inherited by Report UI/PDF/Share Card: `axis.report-range.v1`
- bounded delivery branch: `feat/821-report-pdf-export`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`

## Validation for the active repair

Merge is blocked until one exact repair PR head proves all of the following without weakening inherited assertions:

1. GitHub successfully parses and starts `axis-edgeone-production-mirror.yml`; the PR run must contain a real `package-contract` job rather than fail with zero jobs.
2. `node build-release.mjs` remains public/base release **8.23**, `canonical-single-runtime`, one initial JavaScript request and zero dynamic chunks.
3. AXIS Version Authority proves **8.23 → 8.23 / confirm / sequence 8 / infrastructure**.
4. the canonical product graph remains exactly **86** top-level deterministic steps.
5. all inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, Object/UPO, Flow, Active, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gates remain green.
6. no product/runtime/data/storage/ownership files are modified by this repair beyond documentation/governance and the deployment workflow itself.
7. after merge, the exact new merged `main` SHA reaches fixed Vercel Production and passes exact manifest/current-release Chromium verification.
8. the same exact artifact then deploys to EdgeOne Production and passes the full current-release suite including 8.23 in Chromium and iPhone WebKit.
9. `axis.juele.fun` resolves the same exact artifact and passes 8.23 Chromium and iPhone WebKit verification.
10. combined commit statuses and relevant main-push/deployment-status workflows settle with no unresolved failure before AXIS 8.23 is called Production-sealed.

Failures are fixed at the actual owner. User data, browser assertions and ownership boundaries may not be weakened merely to make certification pass.

## Next planned stage

Do not start another product, architecture, backup/account, Node/toolchain or native/iOS slice until AXIS 8.23 is fully Production-certified on the exact final merged main artifact.

After that, inspect live behavior again and choose the next bounded product improvement from Reveal/Evolution quality, Capture friction or real-world runtime adaptation. Existing portable backup compatibility remains protected; broader account/backup work remains deferred.
