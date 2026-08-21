# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release: **AXIS 8.13.1**.
- Production `main`: `1f5d1e4a732618f40a614798298d3049a14bb924`.
- PR #62 — `AXIS 8.13.1 — Evolution foundation and live Trends projection` — is merged.
- Vercel Production is `READY` for that exact SHA; fixed entry: `https://axis-five-puce.vercel.app`.
- Live `axis-build.json` reports `8.13.1 / 8.13.1`, `canonical-single-runtime`, and `sourceCommit = 1f5d1e4a732618f40a614798298d3049a14bb924`.
- EdgeOne Production status for the same main commit is successful.
- 8.12.5 smart-create and 8.12.4 timing/completion, Quick Record, Live Route, Settings/catalog and custom-equipment ownership remain inherited release contracts.
- Cross-platform contracts remain sealed; historical native foundation branch `axis-native-foundation-0` is reference-only and does not change the Web 8.13.1 release boundary.
- Shared cross-platform identities remain `axis.domain.v1` and `axis.data.v1`; this Web closure does not alter either contract.
- Web and `INDEPENDENTWU/AXIS-iOS` remain independent release shells.

## Why 8.13.1 still has one closure task

The merged 8.13.1 smoke proved sealed-session lifecycle refresh, seven same-day nodes, Evolution projection and interaction safety, but its fixture embedded `activity` directly inside each event in `axis_v60_state`.

Real AXIS evidence may instead be stored in the existing metadata path:

`axis_v8_meta.events[eventId].activity`

The visible 8.13.1 field on production only read `event.activity`, so a green release gate did not yet prove the real metadata-only activity path. This is a regression-coverage and projection gap, not a new product/data model.

## Active change

- Branch: `web-8131-meta-evidence-closure`.
- PR: **#64 — AXIS 8.13.1 — close canonical metadata evidence path**.
- Base: production `main` at `1f5d1e4a732618f40a614798298d3049a14bb924`.
- Public/base version remains **8.13.1**.
- Objective: close the real metadata evidence path without changing the authoritative training writer, persistence schema, navigation, or product surface.

### Exact behavior being closed

- `v8131-evolution-field.js` resolves activity evidence from `event.activity` first and falls back to `axis_v8_meta.events[eventId].activity`.
- Session-end evidence, activity interval union, continuity and fingerprint segments all use the same resolved activity source.
- Metadata-only activity must produce the same visible fingerprint as embedded activity.
- Sub-minute sealed Sessions are represented truthfully as `<1分钟`; they are no longer forced to `1分钟`.
- `axis:state-changed` remains the primary same-document lifecycle refresh.
- Trends re-reads on navigation/`pageshow`, so a sealed Session still appears if a lifecycle event was missed.
- Storage events for both `axis_v60_state` and `axis_v8_meta` refresh the projection cross-context.
- Trends/Evolution remain read-only: no `localStorage.setItem`, network, AI, observer, timer or training ownership is added.

### Regression proof in PR #64

The canonical 8.13.1 smoke now deliberately stores **no embedded `event.activity`**. It writes activity only to `axis_v8_meta`, then verifies:

1. empty state remains direct;
2. first sealed Session immediately produces a factual field and metadata-backed fingerprint;
3. seven same-day Sessions remain seven distinct nodes;
4. Evolution resolver still exposes correct first/latest encounter, encounter count, same-day span and media evidence;
5. tap-expand, horizontal scrub, Safari 24px edge rail, reduced motion and no horizontal overflow remain intact;
6. neither training storage nor metadata storage is mutated by Trends/Evolution interaction;
7. an eighth same-day Session written without dispatching `axis:state-changed` appears after leaving and returning to Trends;
8. that ten-second Session displays `<1分钟` and still resolves its metadata-only fingerprint.

### Architecture / ownership

- `app.js` remains the authoritative local training/session writer.
- `prepare-8131-evolution-convergence.mjs` remains the owner of the build-time `axis:state-changed` bridge and visible 8.13.1 convergence.
- `v8131-evolution-field.js` remains the only visible 8.13.1 Trends/Evolution presentation owner.
- `window.__AXIS_EVOLUTION__` remains a read-only projection over existing canonical records; there is no migration or new persistence schema.
- `axis_v8_meta` is read as existing canonical activity evidence only; PR #64 does not become its writer.
- Historical `v813-trends-field.js` remains source history/compatibility only.
- PR #63 is an older parallel 8.13.1 implementation based before PR #62. **Do not merge PR #63 wholesale.** Any useful behavior must be selectively ported onto current `main`; PR #64 does exactly that for metadata activity evidence and truthful duration.

### Non-regression boundary

Do not change:

- workout interval-union/project-gap/pause semantics;
- total-workout completion owner;
- Quick Record direct-recent behavior;
- Live Route read-only/deviation-safe behavior;
- Settings geometry;
- searchable `我的` custom equipment, no-match smart-create and recording profiles;
- media/Local Vision ownership;
- storage schema;
- iOS repository/contracts.

## Validation for this work

Before merge:

1. clean deterministic `node build-release.mjs` outputs `8.13.1 / 8.13.1` and `canonical-single-runtime`;
2. postbuild requires compiled `axis_v8_meta` fallback, `activityFor`, truthful duration, navigation recovery, one Evolution owner and read-only/no-network/no-storage ownership;
3. Chromium + iPhone WebKit pass the metadata-only 7 → 8 same-day lifecycle/navigation smoke;
4. inherited training timing/completion, Live Route, Settings, catalog and smart-create regressions pass in the existing targeted release gate;
5. repository/work-continuity contracts pass.

After merge:

1. record the exact merged `main` SHA;
2. verify Vercel Production `READY` and live `axis-build.json.sourceCommit` equals that SHA;
3. verify live manifest contains `trendsMetaActivity8131`, `trendsNavigationRefresh8131` and `trendsTruthfulDuration8131`;
4. verify fixed production entry serves the canonical artifact without runtime error cluster;
5. verify EdgeOne Production mirror deploys the exact same artifact and passes the updated Chromium + iPhone WebKit 8.13.1 smoke;
6. close PR #63 as superseded only after #64 is merged and production-sealed.

## Next planned stage

Only after this closure is production-sealed should AXIS move beyond the 8.13.1 Evolution foundation. Continue from the reliable recording/evidence model; do not jump to generated video/replay before real encounter/evidence semantics are proven on actual usage.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/AXIS_EVOLUTION_VISION.md` and `docs/8.13.1_EVOLUTION_FOUNDATION.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Chat history is not authoritative project memory. Conversation history is supplemental only; GitHub state and these handoff documents are authoritative project memory.
