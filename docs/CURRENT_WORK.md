# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded governance slice: `f1a5dbfb593429859a83fee783610f29396762e9`
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

PR #138 is merged at `f1a5dbfb593429859a83fee783610f29396762e9`. That exact merged artifact completed the Learning Settings Entry source convergence, reduced the deterministic top-level release graph from 88 to 87 steps, and was certified through canonical Vercel Production, exact-prebuilt EdgeOne Production, `axis.juele.fun`, Chromium and iPhone-like WebKit without changing public release identity or user-visible behavior.

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
- current public release: **8.21**

The inherited release gates, browser evidence, portable-backup transport, source-owner retirements and factual ownership boundaries remain release-blocking continuity. Nothing in this governance slice may add a runtime owner, storage namespace, alternate release source or deployment project.

## Active change

**AXIS 8.21 — Explicit Version Decision Contract**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-version-decision-contract`
- exact certified base `main` SHA: `f1a5dbfb593429859a83fee783610f29396762e9`
- intended public release change: **none; explicitly confirmed as 8.21**
- intended user-visible behavior change: **none**
- current version decision: `confirm`
- current decision sequence: `1`
- current change class: `governance`

This slice establishes a permanent rule for future version-sensitive AXIS iterations: version identity may no longer move silently or remain silently unchanged. Every such iteration must update `governance/version-decision.json` and make one explicit decision.

`decision: "bump"` means the canonical built public release must advance above the base release. The built artifact, `governance/project-state.json`, `docs/CURRENT_RELEASE.md` and the decision record must all agree on the new release.

`decision: "confirm"` means the canonical built public release must remain exactly equal to the base release. Confirmation is fail-closed and reserved for the explicit non-product classes `governance`, `source-owner-convergence`, `compatibility`, `infrastructure`, `documentation`, and `tests`. Product behavior, UI, runtime, bug-fix, feature or other unrecognized classes cannot use confirmation to avoid a release bump.

`governance/version-decision.json` is deliberately **governance-audit-only**. It does not become a runtime release authority and cannot override the deterministic build. Its monotonic `sequence` prevents a stale version confirmation from being reused for a later version-sensitive iteration.

The enforcement implementation is `scripts/axis-version-authority-contract.mjs`, exercised by the `AXIS Version Authority` workflow on pull requests and pushes to `main`. The gate builds the exact canonical release, compares the Git base/head diff, validates the fresh decision record, treats product/contract JSON as version-sensitive, compares dotted numeric versions and verifies agreement between the build artifact, project-state release and current-release document.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening inherited checks:

1. `node build-release.mjs` succeeds and the exact canonical artifact remains public release **8.21** for this governance-only slice;
2. `AXIS Version Authority` succeeds with `base_release=8.21`, `release=8.21`, `decision=confirm`, `sequence=1`, `change_class=governance`;
3. the version decision is audit-only and no competing runtime release authority is introduced;
4. any version-sensitive Git diff, including product data and contract JSON, without a fresh `governance/version-decision.json` update fails the version-authority contract;
5. a stale sequence fails; a contradictory `confirm`/`bump` decision fails; any class outside the explicit non-product confirmation allowlist fails when used with `confirm`;
6. all inherited Runtime, Current Release, Deep Compatibility, Flow, Active Home, Session/Encounter, Object, Report, Portable Backup, Repository and Work Continuity gates remain green on the same exact head;
7. no new storage namespace, IndexedDB database, network writer, Session/Encounter writer, recorder, Active owner, Flow owner or deployment project appears;
8. after merge, the exact merged `main` SHA must become canonical Vercel Production, then the existing EdgeOne mirror and `axis.juele.fun` must certify the same release identity before this slice is called complete.

A failure is fixed at the actual owner. Existing product assertions, browser checks, compatibility requirements and deployment identity checks may not be weakened merely to make the governance change pass.

## Data and migration boundary

This governance slice does **not** alter, clear or migrate user data. The existing complete AXIS backup path remains available as the explicit bridge between origins. No source-convergence or version-governance operation may delete long-lived Vercel-origin data, and this slice adds no data writer or storage owner.

## Next planned stage

Only after this exact governance head is green, merged and Production-certified across Vercel, the fixed EdgeOne mirror and `axis.juele.fun`:

1. every future version-sensitive upgrade/evolution starts by making an explicit version decision rather than assuming a version number;
2. product-behavior work advances the public version and updates the canonical release surfaces together; non-product work may keep the release only through an explicit fresh confirmation;
3. continue the deterministic source-owner audit one bounded owner handoff at a time, preserving `canonical-single-runtime` and existing factual ownership;
4. preserve one AXIS Git history, one canonical release artifact and the existing Vercel → exact EdgeOne/custom-domain Production topology;
5. keep the Node toolchain upgrade as a separately scoped infrastructure slice with its own explicit version decision.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative project state.
