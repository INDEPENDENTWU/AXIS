# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded source-convergence slice: `bb28d8b8419a6e05c7eb087fe41ac1246272260f`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- canonical Vercel Production project: existing Git-connected `axis` project on `main`
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- fixed public EdgeOne project URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed mainland-facing alias: `https://axis.juele.fun`
- deployment topology: Vercel remains the golden Git Production; `axisfitness-mirror` publishes the exact prebuilt artifact; `axis.juele.fun` resolves to that governed EdgeOne Production environment
- existing Session/Encounter writer: canonical app owner
- existing Active owner: v82/v87 lifecycle; no new Active owner is permitted
- existing learning accessory store: `axis_v89_speak`; learning remains isolated from training truth
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`, `axis.backup.v1`; user-facing backup transport may emit `axis.backup.v2` while retaining v1 import/API compatibility

PR #139 merged at `bb28d8b8419a6e05c7eb087fe41ac1246272260f`. That exact merged artifact established mandatory explicit version decisions and was certified through canonical Vercel Production, exact-prebuilt EdgeOne Production, `axis.juele.fun`, Chromium and iPhone-like WebKit. Combined commit status is Vercel success + EdgeOne Production success. The public release correctly remained 8.21 because the change was governance-only.

### Inherited continuity references

These are historical provenance and compatibility references, not competing Production baselines or active delivery branches. They remain present because sealed compatibility contracts use them to prove that later governance work has not erased earlier certified ownership and release history.

- AXIS 8.21 product/runtime seal: `8f1f1331e751a7868d390f986d77d5779732ad51`
- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- bounded delivery branch: `feat/821-flow-step-recording-intent`
- exact certified historical Flow recording base: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded delivery branch: `feat/821-flow-step-execution-intent`
- exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`
- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- completed Active Home visual convergence branch: `feat/821-active-home-visual-convergence`
- Active Home visual convergence certified main: `9eaf90d0f94023218feb452b085da48c9f027276`
- completed portable backup/origin migration branch: `feat/821-portable-backup-origin-migration`
- portable backup/origin migration historical base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- portable backup/origin migration continuity: `b349c8b87a0e9b30916ba9959297897260de3882`
- completed Active Home source-convergence branch: `arch/821-active-home-source-convergence`
- completed Active Home source-convergence PR: **#131**
- Active Home source-convergence certified main: `3877d91`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- completed Flow Active boot source-convergence branch: `arch/821-flow-active-boot-source-convergence`
- completed Flow Active boot source-convergence PR: **#134**
- Flow Active boot source-convergence certified main: `1ed1b53`
- portable-backup/cold-start certified main after PR #136: `72503cd9b3f49cdbeb797ec14343791a5a482815`
- Learning Budget source-convergence PR #137: `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`
- Learning Settings Entry source-convergence PR #138: `f1a5dbfb593429859a83fee783610f29396762e9`
- Explicit Version Decision Contract PR #139: `bb28d8b8419a6e05c7eb087fe41ac1246272260f`
- current public release: **8.21**

The inherited release gates, browser evidence, portable-backup transport, source-owner retirements and factual ownership boundaries remain release-blocking continuity. Nothing in this source-convergence slice may add a runtime owner, storage namespace, alternate release source or deployment project.

## Active change

**AXIS 8.21 — Watermark Brand Source Convergence**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-watermark-brand-source-convergence`
- exact certified base `main` SHA: `bb28d8b8419a6e05c7eb087fe41ac1246272260f`
- intended public release change: **none; explicitly confirmed as 8.21**
- intended user-visible behavior change: **none**
- current version decision: `confirm`
- current decision sequence: `2`
- current change class: `source-owner-convergence`

The historical `prepare-883-inherited-brand-fix.mjs` exists only because the 8.8.3 convergence owner emitted the spaced center watermark `A X I S` and a later corrective prepare replaced it with the already-shipped canonical `AXIS` mark. This slice moves that proven final brand output into `prepare-883-convergence.mjs` itself and removes the corrective prepare from canonical build reachability.

This is not a watermark redesign. Opacity, location snapshot, metadata wrapping, final-photo composition, current camera/media ownership and user-visible output must remain identical to the already-certified behavior. The historical fix file remains repository provenance only.

The deterministic top-level release graph target is **87 → 86** steps. No other historical fix/refine layer is being combined into this branch.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening inherited checks:

1. `node build-release.mjs` succeeds in exactly 86 deterministic top-level steps and still emits public release **8.21**;
2. `AXIS Version Authority` succeeds with `base_release=8.21`, `release=8.21`, `decision=confirm`, `sequence=2`, `change_class=source-owner-convergence`;
3. `prepare-883-convergence.mjs` directly emits the canonical centered `AXIS` watermark and rejects the legacy spaced output;
4. `prepare-883-inherited-brand-fix.mjs` is absent from canonical build reachability and registered as `retired-from-build-authority`;
5. inherited watermark opacity, location snapshot, metadata layout, media ownership and browser behavior remain unchanged;
6. all inherited Runtime, Current Release, Deep Compatibility, Flow, Active Home, Session/Encounter, Object, Report, Portable Backup, Repository and Work Continuity gates remain green on the same exact head;
7. no new storage namespace, IndexedDB database, network writer, Session/Encounter writer, recorder, Active owner, Flow owner or deployment project appears;
8. after merge, the exact merged `main` SHA must become canonical Vercel Production, then the existing EdgeOne mirror and `axis.juele.fun` must certify the same 8.21 release identity before this slice is called complete.

A failure is fixed at the actual owner. Existing product assertions, browser checks, compatibility requirements and deployment identity checks may not be weakened merely to make the convergence pass.

## Next planned stage

Continued product/runtime/UI refinement remains higher priority than expanding backup/account infrastructure. Existing portable backup compatibility stays protected, but a larger backup/account system is intentionally deferred until the product has gone through further iteration and reached a more stable shape. The durable product-evolution backlog is tracked in GitHub issue #140.

The next true user-visible product stage must use a fresh `decision: bump` and advance the public release rather than hiding behavior inside 8.21.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative project state.
