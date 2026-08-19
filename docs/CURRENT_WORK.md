# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and what must not be accidentally re-owned.

## Stable production baseline

- Public release: **AXIS 8.12.4**.
- Stable `main`: `3243ac6113fa1e40b9dc388bd38ce06a99e515d2`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- PR #54 is already squash-merged. Its dedicated exact-candidate Chromium + iPhone WebKit flow gate passed before merge.
- The 8.12.4 workout timing/session-completion contracts are stable baseline and are not part of the current polish.

## Active branch / PR

- Branch: `axis-8124-settings-catalog-polish`.
- PR: **#55 — AXIS 8.12.4 — settings and catalog polish**.
- Base: exact live 8.12.4 `main` SHA above.
- Scope: narrow post-release field polish only; no public version bump and no new training-data store.

## Active polish

### 1. Settings detail geometry

The visible `学习安排` / `云端与AI` rows already match native Settings row geometry. The remaining visual defect was inside their expanded folds: an inherited second 18px horizontal inset plus older compact control geometry made those sections visibly narrower/denser than mature Settings surfaces such as `记录水印` and `提醒与声音`.

The 8.12.4 detail owner now enforces:

- zero second horizontal inset inside both folds;
- 15px primary Settings UI typography;
- 48px segmented frame / **42px actual option height**, matching the rendered Sound reference rather than an approximate token;
- 16px block vertical rhythm;
- native content edges, radii and gaps;
- current `.axis8122*` Cloud/AI detail classes as well as Learning detail classes;
- unchanged Learning persistence, Cloud/AI progressive disclosure and explicit user-invoked network policy.

Markers: `window.__AXIS_8124_SETTINGS_DETAIL_GEOMETRY__`, `window.__AXIS_8124_SETTINGS_DETAIL_SEAL__`.

### 2. Recording picker: Recent + My

Camera/recording `待确认` must not use a poorer equipment-selection model than Quick Record.

The canonical App picker exposes a **read-only projection**:

- `recent()` — deduplicated real training history ordered by latest use;
- `personal()` — existing `personalEqLibrary()` projection, including custom/history-backed equipment.

The equipment sheet renders compact `最近` and `我的` rails in recording/catalog contexts. They are shortcuts only; selection still delegates to the existing canonical App picker.

Ownership remains:

- App `selectEq` / `__AXIS_PICK_EQUIPMENT__`: canonical selection/state owner;
- picker projection: read-only, no training-storage writer;
- Quick Record: existing editor/recording owner;
- history-only equipment identity fallback remains preserved after the richer canonical resolver.

Markers: `window.__AXIS_EQUIPMENT_PICKER_DATA__`, `window.__AXIS_8124_PICKER_PROJECTION__`.

### 3. Equipment search

The previous equipment search had two per-keystroke owners: the legacy `renderEqList()` full rebuild and v873 smart search. This was unnecessary DOM churn on iOS and also left query lifecycle inconsistent.

The polish converges search to one UI owner:

- one IME/composition-aware `input` owner;
- requestAnimationFrame coalescing;
- no legacy equipment-list rebuild per keystroke;
- normalized search tokens cached per library object;
- deterministic ranking: exact → prefix → contains → conservative Latin typo tolerance;
- no loose Chinese edit-distance matching;
- indexes name, aliases, type, equipment class, movement pattern, body region and detailed anatomy;
- explicit Chinese semantic terms for `力量 / 有氧`, body regions such as `胸部 / 下肢`, and equipment terms such as `器械 / 龙门架 / 哑铃 / 杠铃 / 弹力带`;
- query clears on selection, close and reopen.

Search/UI projection does not write training storage.

Markers: `window.__AXIS_8124_CATALOG_POLISH__`, `window.__AXIS_8124_SEARCH_SEMANTICS__`.

### 4. Professional native exercise taxonomy

The existing native exercise identity and historical records stay intact while current UI/search receives a detailed anatomy/semantics layer:

- `primaryTargets`;
- `secondaryTargets`;
- `stabilizers`;
- `detailMuscles`;
- `bodyRegions`;
- `movementPattern`;
- `equipmentClass`;
- `targetKind`;
- `variableTargets`;
- `targetConfidence`.

Coverage is explicit across the original native library, the 8.9 expanded catalog (for example plate-loaded presses, high/low row machines, V-squat, glute drive, calf machines, landmine press, StairClimber, SkiErg and carries), and the later v8711 native extensions (for example Smith movements, assisted dip, sled push, farmer carry, battle rope and TRX/band rows).

Generic implements such as dumbbells/barbells/cable stations remain **contextual/variable** rather than falsely claiming a fixed muscle target. Late free movements are not mislabeled as generic equipment.

Existing coarse `muscles` remains available for historical compatibility; old workout records are not migrated or rewritten. The recording muscle panel prefers detailed movement-specific targets when available.

Markers: `window.__AXIS_EXERCISE_TAXONOMY__`, `window.__AXIS_8124_LATE_TAXONOMY__`.

## Files added/changed in this branch

- `prepare-8124-settings-catalog-polish.mjs` — main Settings/picker/search/taxonomy convergence transform.
- `prepare-8124-settings-catalog-history-compat.mjs` — preserves the 8.12.4 history-only equipment identity fallback after resolver enrichment.
- `prepare-8124-settings-catalog-polish-seal.mjs` — final measured Settings geometry owner, including 42px option geometry and current `.axis8122*` classes.
- `prepare-8124-taxonomy-coverage-seal.mjs` — explicit expanded/late native taxonomy coverage.
- `prepare-8124-search-semantic-seal.mjs` — accurate Chinese type/body/equipment search semantics without broad fuzzy matching.
- `prepare-8123-final-alignment.mjs` — imports all narrow polish transforms after the existing 8.12.4 owners.
- `scripts/axis-8124-catalog-polish-smoke.mjs` — validates Settings edges, recording Recent/My, single search owner/lifecycle and core anatomy behavior.
- `scripts/axis-8124-taxonomy-coverage-smoke.mjs` — validates expanded/late native anatomy and Chinese semantic search.
- `.github/workflows/axis-8124-flow-gate.yml` — runs the exact polish regressions in Chromium and iPhone WebKit and cancels future superseded runs for this dedicated gate.

## Non-regression boundaries

Do not change these merely to satisfy this polish:

- activity `intervals[]` timing semantics;
- project-gap union/latest-real-activity semantics;
- strength switch pause/finish rule;
- total-workout completion ownership (`v84` gesture → App `completeFinish()` state/storage/UI);
- Live Route read-only/deviation-safe ownership;
- Quick Record direct Recent contract;
- media/history storage ownership;
- Cloud/AI explicit user-invoked network behavior.

## Validation before merge

The exact branch head must pass:

- deterministic 8.12.4 build and compiled-marker contract;
- existing 8.12.4 total-workout diagnostic;
- existing 8.12.4 training-flow smoke;
- inherited Live Route smoke;
- inherited Settings convergence smoke;
- new Settings/catalog polish smoke in Chromium + iPhone WebKit;
- expanded native taxonomy + Chinese semantic-search smoke in Chromium + iPhone WebKit;
- repository contract;
- relevant inherited deterministic gates without unexplained current-head red failures.

Do not relax a deterministic assertion to get green. Classify the failing behavior/fixture first.

## Next boundary

After the exact candidate is green, squash-merge PR #55, then verify Vercel Production serves the exact merged SHA and `axis-build.json` still reports 8.12.4 / `canonical-single-runtime`. Only after that should the next feature/version scope begin.

## Continuity rule

For the next conversation/contributor, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. `docs/CURRENT_WORK.md`;
3. PR #55 and its exact head/merge-result SHA;
4. generated `axis-build.json` from that exact candidate/deployment;
5. the exact failing GitHub Actions step/log before making any regression fix.
