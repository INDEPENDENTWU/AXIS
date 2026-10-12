# AXIS Current Work

**Governed milestone:** AXIS 8.32 — Local PLAY THIS.
governed target branch: `main`.
Bounded delivery branch: `feature/832-play-this-local-entry` · PR **#174**.
Version decision: **8.31 → 8.32 / bump / sequence 33 / product-runtime**.
**Status:** 8.32 candidate only; not merged, deployed or production-certified.
**Production-sealed baseline:** AXIS 8.31 remains the only certified live runtime; the 8.32 PR is not Production-sealed. The repository governance remains authoritative for version, deployment, ownership, and acceptance evidence (repository governance remains authoritative). The public Production-certified product/runtime remains **AXIS 8.31**, exact SHA `dddce5401e80087a7ccceb43ec466f1ad7abb505`.

## Production baseline at start of this work

8.31 certified runtime `dddce5401e80087a7ccceb43ec466f1ad7abb505`; 8.31 independent governance/main `f0cd8fbd86d1d63b7b8b14e705abbfed1ff2843b`; 8.32a exact merged-main design-only `c6a76b617b9df5fe43975354bdabba1d25c3d3e7`. Preserve the immutable 8.31 certificate and existing production-provider snapshots. 8.32a design PR #173 exact head 28/28, merged-main 27 pass + one cancelled hygiene + 3 deployment pass.

## Active change

The unchanged native cross-platform foundation is `axis-native-foundation-0`, shared with `INDEPENDENTWU/AXIS-iOS`. Portable `axis.domain.v1` and `axis.data.v1` contracts and existing Object/Flow/Encounter platform ownership remain unchanged. No native bridge or native persistence writer is added by PLAY THIS. Chat history is not authoritative project memory.


Implement the first real user-facing local PLAY THIS entry in **existing** Object selector and saved Flow Home/sheet. Compile exact canonical Object/Flow intent locally through the shared pure `axis.playable.v1` compiler; delegate to `window.__AXIS_831_PLAYABLE__` and the established Flow/Active/v61 Quick Record/Encounter. Never create another writer, timer or storage namespace. Original Flow start is superseded by one single user-action coordinator rather than a second click handler; retain old mechanism only as an unreachable historical compatibility function pending explicit retirement evidence.

Preserve Home flat section rails, quiet Object list geometry, minimum 44px targets, existing tokens, reduced motion, safe areas and genuine state names. Reference [experience standard](EXPERIENCE_QUALITY_STANDARD.md) and [8.32a product contract](AXIS_832_PLAY_THIS_EXPERIENCE.md). Legacy Flow and Object naming may still surface historical Simplified Chinese elsewhere; new controls must not introduce a third semantic owner or depend on network.

## Validation for this work

Before any merge: canonical `node build-release.mjs`, Version Authority sequence 33, 8.31 inherited Playable/Flow/Active/Encounter regression; real Chromium and iPhone WebKit native/custom Object selection and Flow start; rejection of foreign Active/Flow; double-click stale command, reload, offline; actual user-tap count, no duplicate Encounter or hidden fact write; 320–430px optical geometry, locale/theme/focus. Current 20 Gherkin scenarios are *contracts*, not automatically green browser tests. Follow existing exact-head and separate Production seal policy. Track incomplete scenarios, do not claim all tested.

## Evidence and immutable authority

8.31 cert: [`governance/production-certifications/8.31.json`](../governance/production-certifications/8.31.json). 8.32b is unsealed. No 8.32 product/runtime SHA is certified yet. `axis_v60_state`, `axis_v8_meta`, existing v61 and v82/v87 owners remain factual; portable `axis.flow.v1` and `axis.playable.v1` unchanged. Profile/Report single-source truth remains `axis.report-range.v1`; no new historical rewrites.

## Next planned stage

8.32b exact-head browser proof and CI remediation → product PR merge only if all required checks green → merged-main Vercel Git/EdgeOne/`axis.juele.fun` Production certification → **separate 8.32 governance seal**. 8.33 shareable PLAY THIS stays out of this phase.

## 2026-10-12 — Actions-free 8.32b-R source remediation

8.32 PR #174 remains Draft and **not Production-certified**; 8.31 is still the certified baseline. The 8.32 build now includes a narrowly scoped post-historical adapter for inherited 8.26 / 8.8.2 browser regressions. The new PLAY THIS entry rejects a foreign Active rather than silently switching workouts, and the generated local-vision replay assertions use exact canonical native ID `lat-pulldown` instead of historical base alias `lat`. Earlier release stages and their source fixtures stay unchanged.

The Flow start action is generated through the 8.32 locale resolver; visible Object catalog cards use a semantic surface token instead of a fixed dark color. These are **source changes, not proof of local or browser tests passing**.

This development commit requests `[skip ci]`: do not count skipped checks as successful. Remaining local work: node syntax checks, source contract, canonical `node build-release.mjs`, inherited 8.26/8.8.2 browser regressions, expanded 8.32 acceptance, real Chromium/WebKit screens and optical inspection. No 8.32 merge, exact-provider Production assertion or independent Governance Seal until those proofs are complete.

## Local gate entry point

Run `bash scripts/axis-832-local-gate.sh` from an Actions-free feature checkout with local Chromium, Playwright Core and Playwright WebKit installed. The script refuses `main`, compiles the canonical candidate, runs the inherited 8.26/8.8.2 and new 8.32 smoke tests in both engines, saves screenshots/logs outside the checkout and never calls GitHub Actions or deploys. This is a **smoke-level local gate**, not all 20 acceptance scenarios or a Production seal. Fail closed on missing browsers or any assertion.

## 2026-10-12 — 8.32c real environment acceptance evidence

A Vercel Sandbox clone at exact candidate `1a214f885737ac3dbcd52cb8570fcd8731b7f965` reproduced a **full source build failure**: the initial 8.32b-R test adapter assumed a later local-vision transform had already run. After changing the adapter to assert the actual post-build canonical replay (rather than seek a legacy `'lat'` expression), the local full `node build-release.mjs`, `postbuild-832-play-this-contract.mjs`, and `axis-production-governance-contract.mjs` passed. The first explicit Git Preview deployment `dpl_7zaA4RdYmTfLxzPDXXtAMMU9arQa` failed on the original candidate SHA, confirming this build blocker.

Chromium browser evidence on that patched sandbox: `axis-832-play-this-browser-smoke.mjs` PASS, generated `axis-826-active-continuity-smoke.mjs` PASS. The 8.8.2 replay saved an exact native `lat-pulldown` memory with real full/center/zones signatures and `usable:true`; the visible status was `请确认`, **not** `本地认出`. The repaired test keeps the canonical identity/signature assertions and accepts the explicitly human-confirmed state instead of fabricating an automatic recognition label. The rest-state portion of the inherited 8.8.2 regression currently remains UNVERIFIED: after one set the canonical Active owner was active/planComplete, and the old immediate `rest` expectation timed out. Never count that test green without genuine new proof.

No production alias, immutable 8.31 certificate, or independent Governance Seal was changed. Full Chromium/WebKit and all 20 scenarios are **not complete**.
