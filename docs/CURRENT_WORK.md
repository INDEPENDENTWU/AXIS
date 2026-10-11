# AXIS Current Work

**Governed milestone:** AXIS 8.32 — Local PLAY THIS.
governed target branch: `main`.
Bounded delivery branch: `feature/832-play-this-local-entry`, candidate PR pending.
Version decision: **8.31 → 8.32 / bump / sequence 33 / product-runtime**.
**Status:** 8.32 candidate only; not merged, deployed or production-certified. The public Production-certified product/runtime remains **AXIS 8.31**, exact SHA `dddce5401e80087a7ccceb43ec466f1ad7abb505`.

## Production baseline at start of this work

8.31 certified runtime `dddce5401e80087a7ccceb43ec466f1ad7abb505`; 8.31 independent governance/main `f0cd8fbd86d1d63b7b8b14e705abbfed1ff2843b`; 8.32a exact merged-main design-only `c6a76b617b9df5fe43975354bdabba1d25c3d3e7`. Preserve the immutable 8.31 certificate and existing production-provider snapshots. 8.32a design PR #173 exact head 28/28, merged-main 27 pass + one cancelled hygiene + 3 deployment pass.

## Active change

Implement the first real user-facing local PLAY THIS entry in **existing** Object selector and saved Flow Home/sheet. Compile exact canonical Object/Flow intent locally through the shared pure `axis.playable.v1` compiler; delegate to `window.__AXIS_831_PLAYABLE__` and the established Flow/Active/v61 Quick Record/Encounter. Never create another writer, timer or storage namespace. Original Flow start is superseded by one single user-action coordinator rather than a second click handler; retain old mechanism only as an unreachable historical compatibility function pending explicit retirement evidence.

Preserve Home flat section rails, quiet Object list geometry, minimum 44px targets, existing tokens, reduced motion, safe areas and genuine state names. Reference [experience standard](EXPERIENCE_QUALITY_STANDARD.md) and [8.32a product contract](AXIS_832_PLAY_THIS_EXPERIENCE.md). Legacy Flow and Object naming may still surface historical Simplified Chinese elsewhere; new controls must not introduce a third semantic owner or depend on network.

## Validation for this work

Before any merge: canonical `node build-release.mjs`, Version Authority sequence 33, 8.31 inherited Playable/Flow/Active/Encounter regression; real Chromium and iPhone WebKit native/custom Object selection and Flow start; rejection of foreign Active/Flow; double-click stale command, reload, offline; actual user-tap count, no duplicate Encounter or hidden fact write; 320–430px optical geometry, locale/theme/focus. Current 20 Gherkin scenarios are *contracts*, not automatically green browser tests. Follow existing exact-head and separate Production seal policy. Track incomplete scenarios, do not claim all tested.

## Evidence and immutable authority

8.31 cert: [`governance/production-certifications/8.31.json`](../governance/production-certifications/8.31.json). 8.32b is unsealed. No 8.32 product/runtime SHA is certified yet. `axis_v60_state`, `axis_v8_meta`, existing v61 and v82/v87 owners remain factual; portable `axis.flow.v1` and `axis.playable.v1` unchanged. Profile/Report single-source truth remains `axis.report-range.v1`; no new historical rewrites.

## Next planned stage

8.32b exact-head browser proof and CI remediation → product PR merge only if all required checks green → merged-main Vercel Git/EdgeOne/`axis.juele.fun` Production certification → **separate 8.32 governance seal**. 8.33 shareable PLAY THIS stays out of this phase.
