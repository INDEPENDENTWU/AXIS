# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and what must not be accidentally re-owned.

## Stable production baseline

- Public release: **AXIS 8.12.4**.
- Stable `main`: `3243ac6113fa1e40b9dc388bd38ce06a99e515d2`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- PR #54 is already squash-merged. Its dedicated exact-candidate Chromium + iPhone WebKit flow gate passed before merge.
- The 8.12.4 workout timing/session-completion contracts are stable baseline and are not part of the current polish.

## Active branch

- Branch: `axis-8124-settings-catalog-polish`.
- Base: exact live 8.12.4 `main` SHA above.
- Scope: narrow post-release field polish only; no public version bump and no new training-data store unless a later release explicitly requires one.

## Active polish

### 1. Settings detail geometry

The visible `学习安排` / `云端与AI` rows already match native Settings row geometry. The remaining issue is inside the expanded folds: an inherited extra 18px horizontal inset and older compact 9–10px/31–32px controls make these sections visually narrower and denser than mature Settings surfaces such as `记录水印` and `提醒与声音`.

The final 8.12.4 polish transform therefore owns only detail geometry:

- no second horizontal inset inside the fold;
- 15px primary Settings UI typography;
- 48px principal control rhythm;
- 16px block vertical rhythm;
- 14px principal radius / 8px inter-control gap;
- existing Learning and Cloud/AI behavior, persistence, progressive disclosure and network policy remain unchanged.

Marker: `window.__AXIS_8124_SETTINGS_DETAIL_GEOMETRY__`.

### 2. Recording picker: Recent + My

Camera/recording `待确认` must not use a poorer equipment-selection model than Quick Record.

The canonical App picker now exposes a **read-only projection**:

- `recent()` — deduplicated real training history ordered by latest use;
- `personal()` — existing `personalEqLibrary()` projection, including custom/history-backed equipment.

The equipment sheet renders compact `最近` and `我的` rails in both recording and catalog contexts. They are shortcuts only. Clicking still delegates to the existing canonical App picker/selection owner.

Ownership remains:

- App `selectEq` / `__AXIS_PICK_EQUIPMENT__`: canonical selection/state owner;
- picker projection: read-only, no training-storage writer;
- Quick Record: retains its existing editor/recording ownership.

Markers: `window.__AXIS_EQUIPMENT_PICKER_DATA__`, `window.__AXIS_8124_PICKER_PROJECTION__`.

### 3. Equipment search

The previous equipment search had two per-keystroke owners: the legacy `renderEqList()` rebuild and v873 smart search. This is especially wasteful on iOS and also left query lifecycle inconsistent.

The active polish converges search to one UI owner:

- one composition-aware `input` owner;
- requestAnimationFrame coalescing;
- no legacy equipment-list rebuild per keystroke;
- normalized search tokens cached per library object;
- deterministic ranking: exact → prefix → contains → conservative Latin typo tolerance;
- no loose Chinese fuzzy-distance matching;
- indexes name, aliases, training type, equipment class, movement pattern, body region and detailed anatomy;
- query clears on selection, close and reopen.

Search/UI projection does not write training storage.

Marker: `window.__AXIS_8124_CATALOG_POLISH__`.

### 4. Professional native exercise taxonomy

`v873-exercise-library.js` keeps the existing native exercise identity and historical records intact, while adding a detailed anatomy/semantics layer for current UI/search/automatic adaptation:

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

Common movements receive explicit movement-specific targets (for example RDL, rows, presses, raises, hip ab/adduction, core patterns and cardio modalities). Generic implements such as dumbbells/barbells/cable stations are deliberately marked contextual/variable rather than falsely claiming one fixed muscle target.

Existing coarse `muscles` stays available for historical compatibility; old workout records are not migrated or rewritten. The recording muscle panel prefers detailed targets when available.

Marker: `window.__AXIS_EXERCISE_TAXONOMY__`.

## Files added/changed in this branch

- `prepare-8124-settings-catalog-polish.mjs` — final convergence transform; imported last.
- `prepare-8123-final-alignment.mjs` — imports the polish after all existing 8.12.4 transforms.
- `scripts/axis-813-settings-convergence-smoke.mjs` — validates expanded detail geometry against Sound/Watermark-era native Settings rhythm instead of the retired compact geometry.
- `scripts/axis-8124-catalog-polish-smoke.mjs` — validates recording Recent/My, search ownership/lifecycle, anatomy lookup and generic-equipment contextual behavior.
- `.github/workflows/axis-8124-flow-gate.yml` — runs the new catalog/settings checks in Chromium and iPhone WebKit.

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
- updated Settings convergence smoke in Chromium + iPhone WebKit;
- new catalog picker/search/anatomy smoke in Chromium + iPhone WebKit;
- repository contract;
- relevant inherited deterministic gates without unexplained current-head red failures.

Do not relax a deterministic assertion to get green. Classify the failing behavior/fixture first.

## Next boundary

After the exact candidate is green, open/merge the narrow PR, then verify Vercel Production serves the exact merged SHA and `axis-build.json` still reports 8.12.4 / `canonical-single-runtime`. Only after that should the next feature/version scope begin.

## Continuity rule

For the next conversation/contributor, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. `docs/CURRENT_WORK.md`;
3. the active polish PR and exact head SHA;
4. generated `axis-build.json` from that exact candidate/deployment;
5. the exact failing GitHub Actions step/log before making any regression fix.
