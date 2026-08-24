# AXIS engineering handoff

> **Read this first.** This is the human entry point for current AXIS engineering context. Machine-readable current state lives in [`../governance/project-state.json`](../governance/project-state.json).

## 1. Current Production

- Product: **AXIS — Personal Evolution Engine**
- Current Production release: **8.18**
- Exact merged Production baseline SHA: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`
- Architecture: `canonical-single-runtime`
- Release build: `node build-release.mjs`
- Vercel: exact baseline SHA is deployed to Production and `READY`.
- EdgeOne: exact-prebuilt-artifact mirror path; Source Convergence must be re-sealed against the exact new merged-main SHA after PR #79 merges.

Production 8.18 remains the rollback/reference behavior for this engineering milestone.

## 2. Active engineering work

**Milestone:** `AXIS Source Convergence — 8.19 Foundation`

**Branch:** `engineering/source-convergence-819`

**PR:** `#79`

**Status:** CI/handoff convergence is sealed at behavior level and awaiting the final docs/governance-only baseline-gate pass → merge → exact merged-main Production verification.

**Intent:** zero intended user-visible behavior change while reducing source/build/CI ambiguity before 8.19 product work.

Do not call this work AXIS 8.18.1 or 8.19. It is an engineering convergence milestone on top of the sealed 8.18 product baseline.

## 3. CI convergence now achieved

The broad PR fanout was reduced from **25 historical/version-shaped workflow families to 9 baseline responsibility families**, without dropping the unique product/data/browser contracts.

Physically retired and resurrection-guarded: **20 historical automatic workflow files**.

Current baseline families:

1. Repository Contract
2. Work Continuity Contract
3. Runtime Gate
4. Current Release Gate
5. Runtime Foundation Gate
6. Deep Compatibility Gate
7. Cross-Platform Foundation Gate
8. PR Run Convergence
9. EdgeOne Production Mirror

A path-scoped specialist remains intentionally preserved:

- `AXIS 8.12 Browser Gate` — runs only for relevant 8.12/Language Studio/build-release changes and adds dual-engine corpus/Settings/dialogue/overflow/page-error evidence.

Exact final behavior-proof candidate before this handoff seal: `88d9ee826dcfab14a465c38837a33c6ecd4727e0`.
All **10 workflows actually triggered** on that candidate finished **SUCCESS**, including Deep Compatibility static/Chromium/iPhone WebKit and the path-scoped 8.12 Browser Gate Chromium/iPhone WebKit. Run IDs are recorded in [`../governance/ci-inventory.json`](../governance/ci-inventory.json).

Important final test-quality fixes:

- cumulative-rest testing now waits for persisted paused/active transitions while preserving the same `>400ms` required accumulation;
- 8.12 Browser testing keys the simplified four-group Learning surface to `__AXIS_8123_LEARNING__` semantic authority instead of an obsolete exact public-version branch.

Neither change modifies AXIS product runtime behavior.

## 4. Product model that must survive convergence

AXIS remains local-first and factual-first:

```text
Capture / 留下
      ↓
truthful Encounter
      ↓
time accumulation
      ↓
Reveal / 发现
      ↓
Evolution Object / Evidence / comparison
```

8.18 adds or seals:

- Object Truth via explicit `metricSchema` and Encounter snapshots;
- derived, read-only Evolution Library / Personal Object Shelf;
- Route Truth with one physically active main route;
- schema-aware Focus that never becomes a second completion owner;
- Photo / Scan / Video canonical Capture preferences;
- exactly 3-second / 5-second Scan sampling;
- front/rear camera switching under one logical 30fps canvas compositor;
- source-first S/SV clean media with F/V canonical derivatives;
- Encounter media export/delete without a second store;
- fact-first atomic history/detail opening and in-place detail swaps.

## 5. Non-negotiable data compatibility

The following existing local data is user truth and must not be invalidated by cleanup:

- `axis_v60_state` — base training/session/profile/preferences state;
- `axis_v8_meta` — set/timer/high-frequency training metadata;
- `axis_v89_speak` — Language Studio state;
- `axis_v42_media` — IndexedDB media store;
- existing custom equipment identity/aliases and historical Encounter shapes.

Any physical source retirement that could affect these needs an explicit migration/compatibility test.

## 6. Critical ownership

Read [`../governance/owners.json`](../governance/owners.json) and [`OWNERSHIP.md`](OWNERSHIP.md) before changing a current writer.

Core rules:

- `app.js` remains the base training state owner and canonical camera/media persistence owner.
- `v61.js` owns high-frequency strength/set recording.
- `v874-professional.js` remains the visible custom-object editor.
- the 8.18 Focus layer is presentation-only and delegates completion to the established `v87-direct-884` owner.
- v8710 remains the sole automatic sound owner.
- Evolution Library and media-source bridges are derived/read-only, not new persistence owners.

No semantic action gets two interactive writers and no training fact gets two authoritative stores.

## 7. Retired authority that must not return

Read [`../governance/retirements.json`](../governance/retirements.json) and [`RETIREMENTS.md`](RETIREMENTS.md).

Important guards:

- visible `keepClip` / “保留现场视频” pseudo-setting is retired;
- historical “单张 / 3秒 / 5秒” default-mode controller is retired as authority;
- 3秒 / 5秒 mean **Scan sampling duration only**;
- v876 Capture preference logic may exist only as a delegating compatibility bridge;
- old 15/20fps or forced-720p recording paths may not return;
- historical filenames and release notes do not define current ownership;
- the 20 retired CI workflow files may not return simply to recreate historical fanout.

Retired authority does **not** automatically mean an executable source file is safe to delete. Product/build source deletion still requires reachability + compatibility + browser proof.

## 8. Why source convergence still continues after this PR

Production is already clean: one canonical runtime, zero dynamic historical JavaScript chunks. CI/handoff is now substantially cleaner too. **Source/build is not yet equally clean.**

`build-release.mjs` still executes a long chain of historical prepare/postbuild transforms. Those transforms are the next major engineering debt because a current behavior may still be produced by replaying historical source evolution.

The next phase remains strangler migration, not a rewrite:

```text
pure/current contract
      ↓
shadow/equivalence proof
      ↓
explicit owner handoff
      ↓
old authority retirement
      ↓
compiler/test/workflow deletion
```

## 9. Next engineering sequence

1. **Finish PR #79 seal** — final docs/governance-only head passes the 9 baseline gates.
2. **Merge exact tested head** with expected-head protection.
3. **Production seal** — Vercel exact merged-main SHA → EdgeOne exact prebuilt parity → real Chromium + iPhone WebKit Production flows.
4. **Phase 3: Source Quarantine / Direct Ownership** — shorten historical build transforms one owner at a time; preserve 8.18 behavior/data.
5. **Presentation foundation** — establish professional i18n and semantic theme architecture.
6. **8.19 product work** — begin broader Universal Practice Object/product expansion only on the stable foundation.

Do not claim “all Source Convergence is complete” after PR #79. The accurate statement is: **governance/handoff + CI convergence complete; source/build convergence next.**

## 10. Localization contract for the next foundation

Exactly these three UI locales are planned:

- `zh-Hans` — **简体中文**
- `zh-Hant` — **繁體中文**
- `en` — **English**

Simplified Chinese must be actual Simplified Chinese. Traditional Chinese must be professionally localized, not mechanical character conversion. English must preserve product meaning rather than translate word-for-word.

See [`LOCALIZATION_AND_THEME.md`](LOCALIZATION_AND_THEME.md) and [`GLOSSARY.md`](GLOSSARY.md).

## 11. Theme contract for the next foundation

Planned theme preference:

- `system`
- `light`
- `dark`

Themes must be built from semantic tokens. Logo/icon/watermark behavior must not depend on fixed black/white assumptions. First paint must not flash the wrong theme. Media/watermark contrast is a separate semantic layer from app chrome.

## 12. Release discipline

A candidate is not “done” because a build succeeded.

For user-visible runtime releases and this Source Convergence merge, preserve:

1. exact candidate SHA;
2. deterministic canonical build;
3. current product + compatibility gates;
4. Chromium and iPhone-like WebKit proof for critical paths;
5. merge of the exact verified head;
6. Vercel exact merged-main Production verification;
7. EdgeOne exact-artifact parity;
8. real Production browser verification before declaring the merge sealed.

## 13. What a future developer/agent should do first

1. Read `governance/project-state.json`.
2. Read this file.
3. Read `CURRENT_WORK.md` for the exact active slice.
4. Read `OWNERSHIP.md` / `RETIREMENTS.md` if touching an owner or legacy path.
5. Read `PRODUCT.md`, `RUNTIME_CONTRACT.md`, and `ARCHITECTURE.md` before changing product semantics.
6. Inspect the final generated artifact and current browser contracts; never infer current truth from a version-like filename alone.

**Chat history is not authoritative project memory.** If chat history disagrees with repository state, verify Git/Production and update the repository rather than silently making chat the new authority.
