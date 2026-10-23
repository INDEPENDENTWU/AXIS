# AXIS Engineering Handoff

## Active branch handoff — PLAY THIS actual execution, P1 (2026-10-17)

- **Official Production** remains AXIS 8.32, merged main `5ea6bab7ebad7daf5868e32f1c98209a35647231`, at original Vercel/EdgeOne/`axis.juele.fun`. Deployment readbacks were confirmed before this branch. Physical acceptance and independent Governance Seal remain open in #177.
- **Current isolated candidate**: [PR #181](https://github.com/INDEPENDENTWU/AXIS/pull/181) `feature/833-live-practice-object` implementing live prospective **Object** practice in response to [#180](https://github.com/INDEPENDENTWU/AXIS/issues/180). Draft; NO public Production mutation. Separate [light consistency PR #179](https://github.com/INDEPENDENTWU/AXIS/pull/179) remains Draft.
- **One source/factual writer**: `lib/axis-preplay-intent.mjs` is a pure state machine. `runtime/axis-preplay-object.js` embedded via `scripts/prepare-833-live-practice-object.mjs` into existing canonical app closure. It uses its own `axis_preplay_intent_v1` reversible local draft for reload recovery, never a saved Encounter/Activity/Flow. `#axisPreplaySheet` is the live UI with a resume affordance on Today. Existing `axis821FlowAfterCanonicalCommit` post-save callback retires the draft only when a matching actual Encounter was persisted by the original Recorder.
- **Visible behavior**: Object `開始練習` → real live clock with pause/manual set confirmation → review actuals → `編輯成果並記下` → original canonical Quick Recorder and one persisted Encounter. `記下` remains retrospective; dropping a prospective draft writes no historical facts. Stored draft reappears via a quiet Today resume entry after a reload.
- **Evidence**: [Vercel Preview](https://axis-61qjmcito-independentwus-projects.vercel.app) built and served new JavaScript with hash/source `691cf92f6be5c48fcab35533ef129ee77a2a3340`; pure/unit and Chromium/WebKit exact-head browser checks must individually PASS before merge. Do not substitute Preview READY for functional validation. Version Authority currently fails because no new official release/version decision exists. Maintain 8.32 rollback and full user data; do not overwrite or migrate PWA local storage.
- **Next priority**: complete browser and physical light/dark optical acceptance; repair only real failures; make controlled version admission decision and then separately assess merge, both provider production deployments and user-data continuity. Guided multi-step Flow execution requires a subsequent specifically scoped implementation; not part of P1.

## Previous release-candidate history (superseded as public deployment status)

## Current unreleased release-candidate handoff (2026-10-15)

The immutable certified public Product/runtime remains **8.31**, source `dddce5401e80087a7ccceb43ec466f1ad7abb505`. AXIS **8.32 is not deployed, merged or sealed**.

- **Combined final candidate:** Draft PR **#175**, `release/832-edgeone-first-admission` targeting `main`. Its source includes product Draft PR **#174**, so a future accepted release should merge the combined candidate **once**, not merge both PRs independently.
- **Last fully executed local gate:** clean source commit `ae21195f120995a0451a9892f1f871f9a4547adf` — 103-step build + Chromium/WebKit local gate exited 0; source and browser emulation only, `productionCertified:false`. Subsequent commits must earn new exact-head CI before merging.
- **Formal release admission remains NO-GO:** P11/P12/P15/P16/P17/P20 physical iOS/Android, actual VoiceOver/TalkBack, OS text zoom/safe-area and iPhone scroll rail, and low-end tail-latency need independently documented evidence. No P01–P20 approval is issued.
- **Official release policy:** avoid routine Vercel Preview; once the *merged main* version is genuinely admitted, run a single manual Vercel + EdgeOne Production release and verify both fixed public origins, `axis.juele.fun`, data and installed Safari PWA. A separately verified immutable 8.32 governance seal comes **after** real provider readbacks.
- **No official Production mutation in this phase.** Do not display a fictitious 8.32 release on the 8.31 installed product.

See PR #175's exact-head engineering evidence and Issue #172 for the outstanding physical acceptance. Previous certified 8.31 evidence and all historical records below remain authoritative.


**Current governed release:** AXIS 8.31 — Playable Runtime Foundation.
**Production status:** Production-certified. **Governed target branch:** `main`.
**Product PR:** #170. **Independent confirmation:** sequence 32, `8.31 → 8.31 / confirm / governance`.

## Certified product/runtime SHA

```text
dddce5401e80087a7ccceb43ec466f1ad7abb505
```

This is the exact merged-main product/runtime SHA, not the governance PR head/merge commit or a later Vercel deploy. Previously certified 8.30 runtime `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f` remains immutable.

## Production verification

- Product PR #170 exact head `7f6396ff769c3d045d50cc6ff7403672d4a02bd5`: 35 success, one cancelled Branch hygiene, no failed gates.
- Product merged-main `dddce5401e80087a7ccceb43ec466f1ad7abb505`: 33/33 passed, Chromium/iPhone-like WebKit Playable → confirmed Encounter → reload → idempotent Flow advancement.
- Vercel READY `dpl_EwhKGdCcWn85LyN1gNPAR1Ybvmrq`, exact main SHA; Production gate #38063653692.
- EdgeOne Production `dpndawz2o9le`, exact prebuilt/API parity and Chromium/WebKit #38063617617.
- `axis.juele.fun` exact domain parity, Chromium/WebKit #38063617630.

[Immutable production certificate](../governance/production-certifications/8.31.json) and historical [8.30 certificate](../governance/production-certifications/8.30.json) hold authoritative links and proof.

## Runtime contract and factual ownership

`axis.playable.v1`, `axis.playable-execution.v1`, `axis.playable-command.v1` are derived. Existing app.js FlowRun, Encounter, v61 recording, v82/v87 Active and Media owners remain authoritative. Exact canonical Object IDs and real provenance/timestamp are mandatory. No second writer, automatic completion, AI or network authority.


## 8.32b implementation — active candidate

Product candidate PR **#174** remains Draft, unmerged and not Production-certified. It does not replace the immutable 8.31 Runtime.

**Current feature branch:** `feature/832-play-this-local-entry` based on design-only 8.32a main `c6a76b617b9df5fe43975354bdabba1d25c3d3e7`. **Version decision:** sequence 33, `8.31 → 8.32 / bump / product-runtime`. **Status:** candidate and CI pending; no 8.32 public Production authority.

Actual implementation files: `prepare-832-play-this.mjs`, `scripts/prepare-832-release-identity.mjs`, `scripts/prepare-832-play-this-integration.mjs`, `scripts/prepare-832-governance-state.mjs`, `postbuild-832-play-this-contract.mjs`, and bounded `build-release.mjs` integration. Existing app.js Flow/Object/Recorder owners are invoked; compiler is bundled from portable `lib/axis-playable.mjs` (and established dependencies), not rewritten. Source proof, real browser tests and required release gates must pass before any merge.

The 8.32a 20 Gherkin scenarios remain **unwired specifications**, not passing automated UI tests. Keep Issue [#172](https://github.com/INDEPENDENTWU/AXIS/issues/172) open through 8.32 product merge and independent seal. Preserve existing 8.31 product certificate and no second writer. Continue to audit `main` protection debt in Issue #58.

## Current engineering work — AXIS 8.32a (contract-only)

The 8.31 Production seal is **closed**, not still awaiting certification: product PR #170; governance PR #171 merged into `f0cd8fbd86d1d63b7b8b14e705abbfed1ff2843b`, exact governance PR 29/29 successful, governance merged-main 29/29 push plus 3/3 deployment-status workflow successes. Vercel Git Production READY, EdgeOne and `axis.juele.fun` Chromium and iPhone-like WebKit green. Issue #169 is closed.

The current unshipped design stage is **8.32a — Local PLAY THIS Experience Contract**, Issue [#172](https://github.com/INDEPENDENTWU/AXIS/issues/172), delivery branch `design/832a-play-this-experience-contract`. Its output is the [source-grounded experience/audit contract](AXIS_832_PLAY_THIS_EXPERIENCE.md), [AXIS-wide presentation standard](EXPERIENCE_QUALITY_STANDARD.md) and [20 acceptance scenarios](../tests/acceptance/axis-832-play-this.feature).

**There are no 8.32 runtime or UI changes in this stage**. The 8.31 exact product/runtime SHA and Production certificate remain unchanged. `governance/version-decision.json` sequence **32** is retained while this documentation-only design PR is under review; next executable product iteration must make sequence **33**, `8.31 → 8.32 / bump / product-runtime`, and update the authoritative `docs/CURRENT_WORK.md` with the then-current feature branch and real product contract. The Gherkin scenarios are **not yet wired to a browser runner** and must not be reported as passing automated UI tests.

### Exact next action for 8.32b

1. Audit final canonical build order and add only the missing safe browser-side compiler/entry adapter without a new fact owner.
2. Replace or delegate the existing Object/Flow action *in place*; preserve one action owner and the already shipped Home/Active geometry, focus, safe-area and locale/theme semantics.
3. Require actual Encounter/FlowRun owner acknowledgements; no synthetic completion or blind stale command replay.
4. Implement and execute the 20-scenario acceptance matrix and real 320–430px Chromium/iPhone-like WebKit visual checks. The experience-standard aesthetic review remains a human-inspected release gate.
5. Product PR exact Head all required CI green → SHA-leased merge → merged-main Production verification on canonical Vercel, EdgeOne and official domain → independent governance seal.

**Continuing risk:** `main` branch protection is still disabled. Do not treat an open PR or CI success as permission for an unleased merge. Track this as repository governance debt separately from the product release.

## Next stage

AXIS 8.32 local PLAY THIS UI is not shipped or sealed in 8.31; require a separate product scope and version decision.

Historical AXIS 8.29 production runtime: `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` (immutable preceding seal).
