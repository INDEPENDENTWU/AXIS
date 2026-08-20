# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release: **AXIS 8.12.5**.
- Base `main`: `5a77ca632cf30f5f9daefed94bf0f5fdad2a00fe`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- 8.12.5 smart-create geometry release is sealed in PR #60.
- 8.12.4 timing/completion, Quick Record, Live Route, Settings/catalog and custom-equipment ownership remain inherited release contracts.
- Web and `INDEPENDENTWU/AXIS-iOS` remain independent release shells.

## Active change

- Branch: `axis-813-trends-timefield`.
- PR: **#61 — AXIS 8.13 — tactile Trends time field**.
- Target public/base version: **8.13**.
- Objective: replace the visible legacy Trends dashboard/state-field presentation with one tactile, read-only training time field that is useful without adding scoring, fabricated health meaning or UI complexity.

### Product behavior

- Sessions form one SVG trajectory with AXIS bearing nodes.
- Horizontal scrub snaps between sessions; vertical page scrolling remains native browser behavior.
- The left/right 24px trajectory rails are not claimed, preserving Safari system-edge gestures.
- Tapping the selected session expands that session in place; Trends does not open a modal/sheet.
- Every selected session exposes a fingerprint derived from real activity intervals; active intervals are bright and the remaining session span stays quiet/dark.
- `最近 / 3个月 / 全部` changes the spatial time range without changing the interaction grammar.
- Chest/back/leg/cardio lanes show when those areas actually appeared in recorded sessions.
- Copy explains recorded changes in natural language and may explicitly say that two sessions are not directly comparable. No fitness score, social rank, recovery score or invented progress claim is introduced.
- AXIS Violet remains the primary accent; Ion Blue `#79D7FF` is reserved for the time currently under direct touch/scrub.

### Architecture / ownership

- `v813-trends-field.js` is the only visible 8.13 Trends presentation/interaction owner and is compiled as a first-class product module into the canonical runtime.
- `prepare-813-trends-convergence.mjs` replaces the visible old Trends DOM and keeps v811 IDs hidden only for inherited compatibility.
- Trends may read local workout history and calculate projections. It does not write storage, call network/AI services, mutate workout state, own Camera/Quick Record/Live Route, or install persistent timers/MutationObserver/ResizeObserver.
- Motion/gesture/brand contract is durable in `docs/AXIS_813_TRENDS.md` for later native iOS inheritance.

### 8.12.5 non-regression boundary

Do not change:

- workout interval-union/project-gap/pause semantics;
- total-workout completion owner;
- Quick Record direct-recent behavior;
- Live Route read-only/deviation-safe behavior;
- Settings geometry;
- searchable `我的` custom equipment, no-match smart-create and recording profiles;
- media/Local Vision ownership;
- iOS repository/contracts.

## Validation for this work

Before merge:

1. clean deterministic `node build-release.mjs` outputs `8.13 / 8.13` and canonical-single-runtime;
2. new Trends postbuild contract proves one visible owner, first-class compiled module, read-only/no-network/no-storage ownership, pointer-safe gesture contract and reduced-motion support;
3. Chromium + iPhone WebKit verify no horizontal overflow at 390px, horizontal scrub/snap, 24px edge-safe rail, interval fingerprint, in-place expansion, range scaling, four compact appearance lanes, no modal and no page errors;
4. inherited 8.12.5 training timing/completion, Live Route, Settings, catalog and smart-create regressions pass in the same targeted release gate;
5. repository/work-continuity contracts pass.

After merge:

1. verify exact merged `main` SHA;
2. verify Vercel Production `READY`, live `axis-build.json` = 8.13 and sourceCommit = exact merge SHA;
3. verify fixed production entry returns the 8.13 canonical runtime and no new runtime error cluster;
4. verify EdgeOne production mirror uses the same `main` release and completes its parity/browser validation before calling the mirror released;
5. put the final release seal in PR #61 rather than making a docs-only production commit.

## Next planned stage

After the 8.13 Web production seal, continue native work from the independent `AXIS-iOS` release rail. The native Trends experience may inherit `Scrub / Snap / Expand / Collapse / Scale` and add native haptics later; no iOS implementation belongs in this Web PR.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/ARCHITECTURE.md` and `docs/AXIS_813_TRENDS.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Conversation history is supplemental only. Chat history is not authoritative project memory.
