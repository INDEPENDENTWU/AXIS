# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release: **AXIS 8.12.4**.
- Base `main` for this work: `8b78bb2a323870639a47b222bfe198dadea80286`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- PR #54 owns truthful workout timing/direct training flow and canonical total-workout completion.
- PR #55 owns Settings-detail geometry, Recent/My picker projections, IME-aware equipment search and enriched native exercise taxonomy.
- Native Foundation work on `main` does not change current Web runtime behavior.

## Active change

- Branch: `web-8124-custom-equipment-search-create`.
- PR: **#59 — AXIS Web — searchable custom equipment and instant recording profiles**.
- Public Web version remains **8.12.4**; this is a narrow Web field optimization, not a new product-version line.
- Objective: make user-defined equipment/exercises first-class in the existing recording picker, allow direct creation from an unmatched query, and persist the exact recording fields each custom item needs.

### Product behavior

- Every `profile.customEq` item is searchable in the canonical picker, including items never used in history.
- Exact/prefix/meaningful substring matches stay selection-first.
- When no sufficiently strong match exists, the first result is one direct `＋ 新建“查询词”` action with the query prefilled.
- Saving a new custom item returns through the existing canonical equipment-selection path instead of creating a second recording flow.
- Custom recording profiles are additive `recording.version=1` metadata with any valid combination of `重量 / 次数 / 时间 / 强度 / 档位`.
- Legacy custom items derive the existing strength/cardio defaults and require no migration.
- Duplicate normalized custom names reuse the existing identity.
- Muscle selection may remain empty for an unknown movement; existing anatomy metadata is preserved when supplied.

### Ownership / non-regression boundaries

Do not change:

- workout timing, interval union, project-gap or pause semantics;
- canonical total-workout completion ownership;
- Live Route read-only/deviation-safe ownership;
- Learning or Cloud/AI ownership;
- media persistence / Local Vision ownership;
- native/iOS contracts or release boundaries.

`app.js` remains the canonical custom-equipment definition/selection owner. `v873` remains search projection plus additive custom-profile interaction only. Quick Record keeps its current classic weight+reps editor and delegates non-classic profiles to the canonical recording form.

### Native Foundation continuity

The already-established Native Foundation remains authoritative and is not superseded by this Web patch:

- foundation branch/history: `axis-native-foundation-0`;
- target native repository: `INDEPENDENTWU/AXIS-iOS`;
- shared domain contract: `axis.domain.v1`;
- shared data contract: `axis.data.v1`;
- Web and iOS remain separate shells/release rails sharing versioned behavior/data contracts and golden fixtures;
- native remains true Swift/SwiftUI, local-first and offline-workout capable; no Web patch may weaken those invariants.

## Validation for this work

Before merge:

1. deterministic `build-release.mjs` succeeds from a clean PR checkout;
2. AXIS 8.12.4 Chromium and iPhone WebKit flow gates pass;
3. never-used custom items are searchable in recording and Quick contexts;
4. unmatched query exposes a visible/clickable direct-create row and carries the query into the canonical custom editor;
5. time+level, time+intensity and weight+reps profiles show/save only their intended metrics;
6. created custom identity/profile survives close/reopen and Quick re-entry;
7. repository, work-continuity and cross-platform foundation contracts pass;
8. inherited timing, completion, Live Route, Settings, gallery and picker regressions remain green for the current release contract.

After merge:

1. verify exact merged `main` SHA;
2. verify Vercel Production reaches `READY` for that merged SHA and the fixed production domain serves AXIS 8.12.4;
3. verify EdgeOne production mirror deploys from the same `main` release and its production validation succeeds;
4. confirm current runtime/manifest identity and no new browser errors on both production paths.

## Next planned stage

After PR #59 is merged and both Web production mirrors are verified, resume Native Foundation follow-up without mixing iOS implementation into this Web field patch.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/ARCHITECTURE.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Conversation history is supplemental only. Chat history is not authoritative project memory.
