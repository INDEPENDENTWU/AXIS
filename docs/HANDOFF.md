# AXIS engineering handoff

> **Read this first.** This is the human entry point for current AXIS engineering context. Machine-readable current state lives in [`../governance/project-state.json`](../governance/project-state.json).

## 1. Current Production

- Product: **AXIS — Personal Evolution Engine**
- Current Production release: **8.18**
- Exact merged Production baseline SHA: `254a2fa80fdfd4040a6f695d28ad3bd670c0a7db`
- Architecture: `canonical-single-runtime`
- Release build: `node build-release.mjs`
- Vercel: exact baseline SHA is deployed to Production and `READY`.
- EdgeOne: remains the exact-prebuilt-artifact mirror path. The historical exact workflow record still needs to be backfilled into machine governance; do not invent a run ID.

Production 8.18 is the rollback/reference behavior for the current engineering milestone.

## 2. Active engineering work

**Milestone:** `AXIS Source Convergence — 8.19 Foundation`

**Branch:** `engineering/source-convergence-819`

**Intent:** zero intended user-visible behavior change while reducing source/build/CI ambiguity before 8.19 product work.

Do not call this work AXIS 8.18.1 or 8.19. It is an engineering convergence milestone on top of the sealed 8.18 baseline.

## 3. Product model that must survive convergence

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

## 4. Non-negotiable data compatibility

The following existing local data is user truth and must not be invalidated by cleanup:

- `axis_v60_state` — base training/session/profile/preferences state;
- `axis_v8_meta` — set/timer/high-frequency training metadata;
- `axis_v89_speak` — Language Studio state;
- `axis_v42_media` — IndexedDB media store;
- existing custom equipment identity/aliases and historical Encounter shapes.

Any physical source retirement that could affect these needs an explicit migration/compatibility test.

## 5. Critical ownership

Read [`../governance/owners.json`](../governance/owners.json) and [`OWNERSHIP.md`](OWNERSHIP.md) before changing a current writer.

Core rules:

- `app.js` remains the base training state owner and canonical camera/media persistence owner.
- `v61.js` owns high-frequency strength/set recording.
- `v874-professional.js` remains the visible custom-object editor.
- the 8.18 Focus layer is presentation-only and delegates completion to the established `v87-direct-884` owner.
- v8710 remains the sole automatic sound owner.
- Evolution Library and media-source bridges are derived/read-only, not new persistence owners.

No semantic action gets two interactive writers and no training fact gets two authoritative stores.

## 6. Retired authority that must not return

Read [`../governance/retirements.json`](../governance/retirements.json) and [`RETIREMENTS.md`](RETIREMENTS.md).

Important guards:

- the visible `keepClip` / “保留现场视频” pseudo-setting is retired;
- the historical “单张 / 3秒 / 5秒” default-mode controller is retired as authority;
- 3秒 / 5秒 now mean **Scan sampling duration only**;
- v876 Capture preference logic may exist only as a delegating compatibility bridge;
- old 15/20fps or forced-720p recording paths may not return;
- historical filenames and release notes do not define current ownership.

Retired authority does **not** automatically mean the file is safe to delete. Physical deletion requires reachability + compatibility + browser proof.

## 7. Why source convergence exists

Production is already clean: one canonical runtime, zero dynamic historical JavaScript chunks. Source is not yet equally clean.

The current deterministic build still carries historical transforms from the v8 line. Some inherited tests also encode old implementation details instead of current behavior. That increases diagnosis time and can make a correct current product appear red because an obsolete selector/key/version allow-list survived in CI.

The convergence strategy is strangler migration, not a rewrite:

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

## 8. Current convergence sequence

1. **Handoff Truth** — centralize current Production, owners, retirements and active work.
2. **Repository Contract** — make CI read machine governance instead of hardcoded stale release identity.
3. **Reachability inventory** — classify build transforms/workflows as current, compatibility-required, superseded or historical-only.
4. **CI convergence** — replace per-version workflow accumulation with current product gates + explicit deep compatibility gates while preserving coverage.
5. **Source quarantine/retirement** — archive or delete only proven unreachable/superseded executable history.
6. **Direct ownership** — move current behavior out of exact historical rewrites one surface at a time so `build-release.mjs` becomes shorter.
7. **Presentation foundation** — establish professional i18n and semantic theme architecture.
8. **8.19 product work** — only after the engineering foundation is stable.

## 9. Localization contract for the next foundation

Exactly these three UI locales are planned:

- `zh-Hans` — **简体中文**
- `zh-Hant` — **繁體中文**
- `en` — **English**

Simplified Chinese must be actual Simplified Chinese, not Traditional Chinese with a locale label changed. Traditional Chinese must be professionally localized, not mechanical character conversion. English must preserve product meaning rather than translate word-for-word.

See [`LOCALIZATION_AND_THEME.md`](LOCALIZATION_AND_THEME.md) and [`GLOSSARY.md`](GLOSSARY.md).

## 10. Theme contract for the next foundation

Planned theme preference:

- `system`
- `light`
- `dark`

Themes must be built from semantic tokens. Logo/icon/watermark behavior must not depend on fixed black/white assumptions. First paint must not flash the wrong theme. Media/watermark contrast is a separate semantic layer from app chrome.

## 11. Release discipline

A candidate is not “done” because a build succeeded.

For user-visible runtime releases, preserve:

1. exact candidate SHA;
2. deterministic canonical build;
3. current product + compatibility gates;
4. Chromium and iPhone-like WebKit proof for critical paths;
5. merge of the exact verified head;
6. Vercel exact merged-main Production verification;
7. EdgeOne exact-artifact parity;
8. real Production browser verification before declaring the release sealed.

Source-convergence PRs must additionally prove that no intended runtime behavior changed.

## 12. What a future developer/agent should do first

1. Read `governance/project-state.json`.
2. Read this file.
3. Read `CURRENT_WORK.md` for the exact active slice.
4. Read `OWNERSHIP.md` / `RETIREMENTS.md` if touching an owner or legacy path.
5. Read `PRODUCT.md`, `RUNTIME_CONTRACT.md`, and `ARCHITECTURE.md` before changing product semantics.
6. Inspect the final generated artifact and current browser contracts; never infer current truth from a version-like filename alone.

If chat history disagrees with this repository state, verify Git/Production and update the repository. Do not silently let chat become the new authority.
