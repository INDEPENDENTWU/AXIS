# AXIS Current Work

## AXIS 8.33 · Play Strength + Light Release Candidate (2026-10-21)

**governed target branch: `main`.** Controlled **candidate** Draft PR **#183**, `release/833-play-strength-light`, explicit version bump decision #34 (8.31 sealed rollback baseline → 8.33). The official `main` prior to this PR remains 8.32 at SHA `5ea6bab7ebad7daf5868e32f1c98209a35647231`; the last independently certified immutable runtime seal is **8.31**, SHA `dddce5401e80087a7ccceb43ec466f1ad7abb505`. Neither 8.32 deployment nor 8.33 Preview implies a new seal. No Production mutation occurred from this PR.

**Release-scope only:** consolidate [P2 strength PR #182](https://github.com/INDEPENDENTWU/AXIS/pull/182) and [semantic Light PR #179](https://github.com/INDEPENDENTWU/AXIS/pull/179) under [release #183](https://github.com/INDEPENDENTWU/AXIS/pull/183). Original user-verified timer → old Recorder [P1 #181](https://github.com/INDEPENDENTWU/AXIS/pull/181) is rejected as a product. Strength now confirms performed sets, then in-place save to the canonical Encounter, with a truthful per-set history detail. Light theme applies a single late override for action/number/disabled contrast and iOS readability. Existing Quick Record and Flow compatibility retained; guided multi-step Flow is not yet a complete new PLAY experience.

**Admission:** explicit sequence 34 in `governance/version-decision.json` and inherited 8.32 compiler/stage as a predecessor. New `prepare-833-governed-release.mjs` must yield built 8.33 with exact version parity and an immutable 8.31 production rollback identity. All exact-head inherited CI, new Chromium/WebKit strength, dedicated light optical checks and physical iPhone installed-data review must be accepted before main/dual-provider Product Production release. Draft until then; do not substitute preview success for end-user hardware truth.

---


## Current bounded development — PLAY THIS strength P2 (2026-10-19)

**Public state:** AXIS 8.32 remains served from canonical main `5ea6bab7ebad7daf5868e32f1c98209a35647231` at existing Vercel, EdgeOne and `axis.juele.fun`; not touched by this PR. #177 retains physical acceptance/governance limits and the 8.31 rollback precedent.

**Active candidate:** [PR #182](https://github.com/INDEPENDENTWU/AXIS/pull/182), branch `feature/833-play-strength-complete`, superseding non-shippable [#181](https://github.com/INDEPENDENTWU/AXIS/pull/181) for **strength Object** practice. The user explicitly rejected generic P1 timer → old `編輯成果並記下` as the complete product. New P2 begins directly from an Object card, asks for *actual* weight/reps at each set confirmation, handles rest and next set, pause/reload, displays every performed set in an inline editable review, and offers one **完成並儲存** action. There is **no mandatory #scanSheet / 記下 handoff**. Old Quick Record remains intact for retrospective entries. Non-strength cardio/hold and guided multi-step Flow are separate follow-ups and cannot be claimed complete.

**Truth and ownership:** `lib/axis-live-strength.mjs` stores only bounded prospective draft `axis.play-strength.v1` (localStorage `axis_play_strength_draft_v1`). Only explicit set confirmations create prospective actual-set rows. Save calls the original app-owned `axis821CommitEncounter(e,eq)` once, with the confirmed sets in `e.playThis.actualSets`; a readback of `axis_v60_state` must verify the same Attempt ID/Event ID before the draft is retired. `e.weight/reps` summarize the *last* actual set and `e.sets` the confirmed count, avoiding invented equal reps/weights. All media, Active, FlowRun, historical data and backup ownership remain unchanged; no second Recorder/factual writer. Finish/cancel without saving creates no Encounter.

**Code and evidence:** `scripts/prepare-833-strength-complete.mjs` embeds a mode-specific renderer `runtime/axis-live-strength.js` in the canonical existing app closure and reuses exact `axis831ExactFlowEq` IDs. Tests `tests/axis-live-strength.test.mjs` and `scripts/axis-833-strength-full-loop-browser.mjs` assert real user taps, multiple performed sets, mid-practice reload, inline actual corrections, **one** canonical Encounter after direct save and **zero** Recorder popups. [Dedicated CI #39147908642](https://github.com/INDEPENDENTWU/AXIS/actions/runs/39147908642) source, Chromium and WebKit were successful at initial P2 code SHA `ec2cf29a` (later guard/UI changes require exact-head rerun). Updated original 8.32 legacy browser expectations to separate strength Live from original retroactive logging. Current isolated Preview(s) only, no product release admission.

**Release boundary:** Draft #182, version authority intentionally not bypassed. Explicit version bump, all inherited exact-head CI, physical iPhone Safari PWA optical/interaction/contrast and privacy/local data checks, and bounded Vercel+EdgeOne post-merge certification must precede any official deployment or Governance Seal. Separate Draft #179 Light consistency must be reviewed in that release decision. PR #181 remains rejected as a stand-alone product despite its reuse as a compatibility base.

---

## Earlier PLAY THIS P1 prototyping (historical, not shippable)


## Current bounded development — PLAY THIS pre-Encounter P1 (2026-10-17)

**Public AXIS remains 8.32**, exact canonical merged-main `5ea6bab7ebad7daf5868e32f1c98209a35647231` on original Vercel, EdgeOne and `axis.juele.fun`. Historical text below describes earlier 8.32 development and is superseded only for present-day deployment status; no independent 8.32 Governance Seal has been issued and #177 still covers physical acceptance.

**Current draft PR #181** (`feature/833-live-practice-object` → `main`) addresses user-verified issue #180: old Object `開始練習` opened the same `記下` form. The new Object path creates a *prospective* `axis.preplay-intent.v1` draft, shows a real running timer with pause/resume, mode-aware manual set count, review, abandon and reload-resume, and only passes to the old Recorder when the user deliberately requests to save actual outcomes. Existing historical `axis821CommitEncounter` remains the single Encounter writer; the draft retires only via existing queued `axis821FlowAfterCanonicalCommit(e,intent)` after persisted canonical confirmation. The original FlowRun and v82/v87 post-Encounter Active remain separate authoritative owners; Flow cannot replace a prospective active Object practice. No second activity fact writer is introduced.

**Tests / release state:** pure `node --test tests/axis-preplay-intent.test.mjs`, 8.32 inherited Object/Flow browser test updated to reject immediate `#scanSheet`, plus `scripts/axis-833-preplay-browser-smoke.mjs` in existing Chromium/pinned WebKit gate. Candidate Vercel Preview at `https://axis-61qjmcito-independentwus-projects.vercel.app` is READY at exact code commit `691cf92f6be5c48fcab35533ef129ee77a2a3340` (later docs may change PR head) with 8.32 source shell. The official Production sites are unchanged. Do not confuse the successful Preview build with fully passed browser/physical acceptance.

**Admissibility:** version governance still rejects unversioned executable UI product changes. This Draft may not merge/publish before explicit approved release/version authority, exact-head gates, readback and physical iPhone PWA review. Also do not silently absorb Draft light-theme PR #179: it remains separately scoped and needs an explicit coherent merge/release plan. P1 is prospective **Object** practice; full guided Flow, rest automation, polish, offline conflict convergence and final user acceptance remain follow-ups, not falsely claimed complete.

---

## Previous 8.32 work record (historical)

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

## 2026-10-13 — 8.32c exact-head repeat/offline gate passed

Product HEAD `8395eb10798d9bf9e277350924bb27c0cb840e4d`: explicit completed Flow repeat repaired in existing 8.32 presentation coordinator and verified via Home `再来一次` click, with fresh canonical FlowRun/Encounter and prior facts unchanged. Offline canonical Encounter persistence and post-reload provenance passed. The isolated exact-head gate completed five suites across Chromium and WebKit Playwright 1.64, canonical 103-step build, `exitCode:0`, with no Actions or deployment. Evidence and limitations: `docs/AXIS_832C_ACCEPTANCE_EVIDENCE.md`. This is not full 20/20 acceptance or the pinned WebKit 1.55 production gate. PR #174 remains Draft; sealed Production stays 8.31. Next: UI offline confirmation, repeat/stale UI tap paths, theme/locale screenshots, screen reader and font scale, performance, full acceptance classification, then 8.32d release-quality closure.

## 2026-10-13 — 8.32d-1 Accessible PLAY THIS entry

Exact product SHA `4acc6e112a879590146ef1e63a4600c623b96418` passed the Actions-free 103-step full-build and five-suite Chromium/WebKit Playwright 1.64 local gate. P16 reflow/focus continuity and enlarged-English-label-on-320px, P19 original Recorder focus handoff/no duplicated modal passed. Captured explicit failed-before / passed-after browser evidence for both focus failure cases. The source guard now rejects removal of accessible label scale or browser assertions. 8.32 remains Draft; 8.31 Production unchanged. Next exact gate: performance/cold-warm numbers, complete supported-theme optical review, full accessibility P16/P17 and P11/P12 UI instrumentation, then pinned WebKit and direct canonical Production certification. See `docs/AXIS_832C_ACCEPTANCE_EVIDENCE.md`.

## 2026-10-13 — 8.32d exact-head Flow handoff gate green

PR #174 candidate product `2ecab7681ea47b2cf5325b10d4d64c984c74061f` repaired a true WebKit race: existing FlowRun launch accepted but current-item dispatch occasionally declined. On transient decline, the 8.32 coordinator now consults canonical same-Flow owner truth and resumes via the existing current-entry route, never fabricating a second launch. Five consecutive WebKit and two Chromium iterations passed on the patched build; **latest exact GitHub source HEAD** then passed all five suites on each browser and the 103-step build in clean worktree (`exitCode=0`, `actionsUsed=false`). Draft status, 8.31 Production and no-Preview release constraint remain unchanged. Evidence in `docs/AXIS_832C_ACCEPTANCE_EVIDENCE.md`. Next: P01–P20 remaining true UI paths, theme/font/assistive-tech visual audit and P20 cold/warm performance evidence, then pinned WebKit/platform gate → exact-head release decision → merged-main/provider/EdgeOne/official-domain certification.

## 2026-10-13 — 8.32d-2 browser timing and rapid UI evidence

Added `scripts/axis-832d-timing-browser-smoke.mjs` for exact-head P11 real pointer double-click, P12 active Flow reload, P20 cold/warm load and actual Object/Flow UI latency with structured engine/SHA/viewport/layout-shift evidence. Three local Chromium and three WebKit repetitions passed on product source `70c3435ccf958b33ac5f13ddca11787fb4f96a55`; see `docs/AXIS_832D_PERFORMANCE_EVIDENCE.md` for medians, raw sampled values and the first WebKit 4.6s outlier. The acceptance gate now collects one JSON report per selected engine and validates it against exact SHA and owner truth. This is local-only, no Production release or Preview. Next: exact-GitHub-head full gate, remaining visual accessibility acceptance and deployment certification.

## 2026-10-13 — 8.32d-3 Object re-entry and visual loop

Reproduced selected Object cancellation/re-entry defect: a previously accepted canonical selected state wrongly blocked the second quick launch and displayed an unavailable toast. Corrected exact same-ID selected reuse and switched only the presentation handoff to existing synchronous app picker/Quick Recorder; no duplicate store/owner. New multi-width real UI gate checks 320/360/390/430/1280, three 390px locales, offline 360px, Recorder focus/cancellation/return, and 10 screenshots per engine (7 cycles per browser); Chromium and WebKit Playwright 1.64 passed on patched 103-step build. First WebKit full legacy run observed one 8.8.2 1800ms timeout, repeat passed. See `docs/AXIS_832D3_VISUAL_ACCEPTANCE.md`. New exact GitHub Head must be independently gated before release; pinned WebKit 1.55, optical sign-off, UI Recorder save/confirm, full P01–P20 and merged-main Production verification remain open. PR #174 stays Draft; existing 8.31 Production unchanged.

## 2026-10-13 — 8.32d-4 offline Recorder acceptance and release decision

Product source fb793b747f5f8c269ab4c351ccc695ae798c6c50 confirmed real 360px offline UI `#saveScan` in Chromium and WebKit Playwright 1.64: exactly one canonical `chest-row` Encounter, original Recorder closes, no new namespace, same ID preserved after reconnect/reload. New permanent `scripts/axis-832d4-offline-recorder-browser-smoke.mjs` integrated into Actions-free local gate and source contract. Release coverage decisions recorded in `docs/AXIS_832D4_RELEASE_DECISION.md`: 14 scoped verified, six partial acceptance cases; P11/P12/P15/P16/P17/P20 require further proof (precise matrix in evidence file). Pinned WebKit 1.55 **not certified**: Ubuntu26 unsupported and legacy WebKit binary failed to load `libicudata.so.74`; needs Ubuntu24 environment. No Preview, Production or merge. Latest commit needs independent exact-head verification. PR #174 Draft; Production remains 8.31.

## 2026-10-13 — 8.32 release hosting fallback engineering

User-approved hosting contingency: if Vercel deployment quota/availability is exhausted, use existing EdgeOne Production rather than wait or build a Preview. Identified the actual provider fallback blocker: `.github/workflows/axis-edgeone-production-mirror.yml` explicitly waits for **new Vercel Production** before deploying EdgeOne. The apparent `8.15.1` in the source EdgeOne verifier is an **intentional historical migration input** for `build-release.mjs`, not a release blocker; direct modification was reverted after deterministic build caught the drift. The exact 103-step build correctly generates an 8.32 verifier and stamped artifact. Added a separately gated **direct EdgeOne Production path**, `scripts/axis-edgeone-fallback-release.mjs`, with actual remote-main exact SHA, Version Authority, source-stamped prebuilt artifact, external P01–P20/full compatibility admission and explicit confirmed SHA. Live EdgeOne and official-domain verifiers gain an opt-in independent API JSON/source parity mode; existing strict Vercel parity is unchanged by default. The exact-head local gate now checks the EdgeOne prebuilt artifact. See `docs/AXIS_EDGEONE_FALLBACK.md`. No credential available in this conversation, no Preview/Production changes. Existing 8.31 Production sealed and 8.32 Draft remain authoritative. Also correct P01–P20 counts: **14 scoped verified and 6 partial**, not 13/7. Release admission cannot be issued yet.

## 2026-10-13 — 8.32d-5 cross-tab Flow presentation and conflict integrity

New `scripts/axis-832d5-stale-tabs-browser-smoke.mjs` exercises **two simultaneous tabs** sharing actual storage: Flow A launched, stale second tab forbidden from launching foreign Flow B, old Flow A button reflectively relabeled to existing localized Continue (including aria-label), same-owner Home action reuses the exact FlowRun and unchanged Encounter IDs, and stale tab reload recovers the same owner. Both Playwright 1.64 Chromium/WebKit PASS on clean 103-step candidate build. Read-only `storage` listener uses persisted `axis_v60_state` solely for button/accessible label, not a second owner. Source contracts and no-Actions exact-head gate now include the case. See `docs/AXIS_832D5_STALE_TAB_ACCEPTANCE.md`. P12 becomes better covered but pending-command replay still partial. Main/Production 8.31 and PR #174 Draft remain unchanged; no Preview or EdgeOne production changes.

## 2026-10-13 — 8.32d-6 true touch and pinned WebKit 1.55 validation

New `scripts/axis-832d6-touch-repeat-browser-smoke.mjs`: 360px real `touchscreen.tap` twice on Object CTA, one Recorder and one capture owner, no FlowRun or Encounter creation, focus and cancel integrity. Chromium1.64, WebKit1.64 and actual Playwright1.55 WebKit26.0 tests pass; precise touch-start spacings and evidence in `docs/AXIS_832D6_TOUCH_PINNED_COMPAT.md`. Historical WebKit1.55 suite: 8/9 on first pass; inherited 8.8.2 synthetic long-press waited 4.5s and timed out, unchanged test then passed twice. Compatibility shim for older Ubuntu24 libraries on Ubuntu26 was test-only, **not native compatible-OS certification**. The ten-suite/engine local gate and source guard now include P11 true touchscreen test. Latest committed Head still requires exact-head gate. Production remains 8.31; PR #174 Draft, no Preview or deployed EdgeOne.

## 2026-10-14 — 8.32d-7 screenshot-led optical fix and real keyboard acceptance

Visual review uncovered real catalog guide-text overlap and highly truncated item titles on 320/390px increased UI text that previous pure geometry checks missed. Fixed content-height/wrapping of `#eqSheet .v8710GuideHead`, allowed two-line Object titles, one-column 320px cards, and localized the catalog guide/count for en/zh-Hant while preserving all original owners and data. Added `scripts/axis-832d7-a11y-browser-smoke.mjs`: 14 cycles per Playwright 1.64 Chromium/WebKit over 5 widths, two text input levels and 390px 3 locales; actual keyboard Tab, focus-visible, visible pointer hit target, non-overlap, text wrapping, reduced motion and computed CTA contrast 9.14:1. All PASS in isolated 103-step candidate build with 16 screenshots; representative 320px and 390px screenshots visually reviewed. Exact-head local gate now includes this test and validates source SHA/JSON/16 screenshots. See `docs/AXIS_832D7_VISUAL_KEYBOARD_EVIDENCE.md`. P15/P16/P17 still partial for app-wide optical/assistive/locale and OS zoom; no Preview, main or Production change. Next: exact GitHub Head gate, investigate historical pinned WebKit 1.55 long-press variability, hardware/assistive audit and final release governance.

## 2026-10-14 — 8.32d-8 six-run performance and shift attribution

Measured exact clean 8.32 product `856726812bd915724002c128c90fb1e957b6568c` in **six Playwright Chromium + six WebKit runs** across four owner paths. Median milliseconds Chromium cold/object/Flow/warm: **344/163/136/241**; WebKit **625/446/281/338**. No 4.6s tail event occurred in this small sample, but it is not considered eliminated. Instrumented Chromium 0.1295 cumulative Layout Shift and identified a synthetic search `#v8710Explore` rearrangement *before* the Object tap; original test mistakenly grouped it under Object entry. Permanent P20 test now separately captures `layoutShiftBeforeTap` and `layoutShiftAddedDuringHandoff` and enforces a 0.05 tap-shift guard only where browser observer support exists. Actual recheck: Chromium 0.1295 prior/0 tap delta; WebKit null/null unsupported, not zero. See `docs/AXIS_832D8_PERFORMANCE_CLOSURE.md`. P20 remains partial until low-end hardware, longer tails and Production readbacks; no deployment/Preview/merge. New exact GitHub Head must be gated.
