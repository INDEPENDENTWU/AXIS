# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release at branch start: **AXIS 8.13**.
- Base `main`: `79d58514f8e084981d2e8c526d1dab1b7e3a474a`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- 8.13 tactile Trends is sealed in PR #61, but real-user testing exposed a sealed-session projection refresh regression.
- 8.12.5 smart-create and 8.12.4 timing/completion, Quick Record, Live Route, Settings/catalog and custom-equipment ownership remain inherited release contracts.
- Web and `INDEPENDENTWU/AXIS-iOS` remain independent release shells.

## Active change

- Branch: `web-8131-evolution-foundation`.
- PR: **#62 — AXIS 8.13.1 — Evolution foundation and live Trends projection**.
- Target public/base version: **8.13.1**.
- Product direction reference: `docs/AXIS_EVOLUTION_VISION.md` and `docs/8.13.1_EVOLUTION_FOUNDATION.md`.
- Objective: make sealed Sessions project into Trends immediately and establish a clean read-only Evolution resolver without changing the authoritative training writer.

### Product behavior

- A completed/sealed Session must appear in Trends without reload or a second storage owner.
- Seven Sessions completed on the same day remain seven distinct trajectory nodes; minimum visual spacing prevents overlap.
- The first sealed Session already produces a factual readout instead of an instructional empty-state message.
- Empty state is direct: `暂无训练记录。`.
- User-facing helper/tutorial strings such as `左右滑动查看`, `点一下展开`, `留下几次训练后` and `继续留下相同动作` are retired.
- Selected-session tap expands in place; horizontal scrub and 24px Safari edge-safe rails remain inherited from 8.13.
- The first Evolution resolver groups real activity encounters and exposes `firstEncounter`, `latestEncounter`, `encounterCount`, `timeSpanDays` and `mediaEvidence` as a read-only projection.
- Trends and Evolution do not write workout/user storage and do not call network/AI services.

### Architecture / ownership

- `app.js` remains the authoritative local training/session writer.
- The existing `save()` lifecycle dispatches `axis:state-changed` only after canonical local state has been persisted; no mutable state object is exposed through the event.
- `v8131-evolution-field.js` is the only visible 8.13.1 Trends/Evolution presentation owner.
- `prepare-8131-evolution-convergence.mjs` creates the visible surface, retires the legacy v84 Trends owner, installs the lifecycle bridge and compiles the new field as a first-class product module.
- `window.__AXIS_EVOLUTION__` is a read-only resolver over existing `axis_v60_state`; it introduces no data migration or persistence schema change.
- Historical `v813-trends-field.js` remains source history/compatibility only and is not the 8.13.1 visible owner.

### Non-regression boundary

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

1. clean deterministic `node build-release.mjs` outputs `8.13.1 / 8.13.1` and `canonical-single-runtime`;
2. 8.13.1 postbuild proves one visible Evolution owner, canonical `axis:state-changed` lifecycle bridge, read-only/no-network/no-storage ownership and factual-copy contract;
3. Chromium + iPhone WebKit verify empty state, first Session, seven same-day sealed Sessions, live refresh, distinct node geometry, tap-expand, scrub, Safari edge-safe rail, no horizontal overflow and no storage mutation;
4. the Evolution resolver verifies first/latest encounter, encounter count, zero-day same-day span and media evidence;
5. inherited training timing/completion, Live Route, Settings, catalog and smart-create regressions pass in the same targeted release gate;
6. repository and work-continuity contracts pass.

After merge:

1. verify exact merged `main` SHA;
2. verify Vercel Production `READY`, live `axis-build.json` = `8.13.1` and `sourceCommit` = exact merged SHA;
3. verify fixed production entry serves the canonical 8.13.1 runtime and no runtime error cluster appears;
4. verify EdgeOne Production mirror waits for the same Vercel/main SHA, deploys exact artifact, then passes Chromium + iPhone WebKit 8.13.1 lifecycle smoke;
5. put the final release seal in PR #62 rather than making a docs-only production commit.

## Next planned stage

After 8.13.1 is production-sealed, continue the Evolution roadmap from the existing reliable recording foundation. Do not jump directly to generated video/replay before the read-only encounter/evidence model is proven on real usage.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/AXIS_EVOLUTION_VISION.md` and `docs/8.13.1_EVOLUTION_FOUNDATION.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Conversation history is supplemental only. Chat history is not authoritative project memory.
