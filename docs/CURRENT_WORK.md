# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of 8.16

- Public Web baseline: **AXIS 8.15.1 — Regression Seal**.
- `main` at the start of PR #68: `220fbb1c614ba60a3c8a2958b5fb03016643b75f`.
- The functional baseline is the production-sealed 8.15.1 runtime; the final main commit above only removed an accidental empty temporary placeholder and did not alter product behavior.
- Fixed Vercel endpoint: `https://axis-five-puce.vercel.app`.
- EdgeOne production mirror: `https://axisfitness-mirror-9x91gveo.edgeone.cool`.
- Historical native foundation branch `axis-native-foundation-0` remains reference-only.
- Shared cross-platform identities remain `axis.domain.v1` and `axis.data.v1`; 8.16 does not alter either contract.

## Product direction

AXIS is a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.16 intentionally strengthens Capture density and time comparison before Replay. Media remains evidence of time, not creator content. Data-only Evolution remains valid.

## Active change — AXIS 8.16 Capture Field + Comparative Evidence

- Branch: `web-816-capture-evidence-field`.
- PR: **#68 — AXIS 8.16 — Capture Field + Comparative Evidence**.
- Base: `main` at `220fbb1c614ba60a3c8a2958b5fb03016643b75f`.
- Candidate public/base version: **8.16**.
- Replay is deferred in this release.

### Capture Field

8.16 unifies normal **拍摄记录** and Quick Record supplemental media into the same visible Capture Field while retaining the existing canonical `app.js` owner.

Current contract:

- max 12 photos per Encounter;
- repeated photo capture/import before save;
- transient media rail;
- delete draft photos before commit;
- choose cover by moving a real photo to `frameRefs[0]`;
- inherited scan continues and adds real frames to the same draft;
- one explicit video per Encounter;
- hard max video duration 60 seconds;
- video is silent in 8.16;
- existing `axis_v42_media`, `frameRefs[]` and `clipRef` remain canonical;
- no second camera/recorder/IndexedDB owner;
- no new storage schema, upload dependency or AI dependency.

### Comparative Evidence

The existing `v815-media-evidence` read-only owner now supports arbitrary factual two-point comparison between real photo-bearing Encounters.

Presets:

- endpoints;
- recent two;
- adjacent pair.

Arbitrary replacement requires explicit left/right slot selection. Plain Encounter taps continue to inspect that Encounter. Endpoint labels remain truthful; arbitrary points use real Encounter positions. Comparison remains read-only, local, non-autoplay, no-network and no interpretive scoring.

### Inherited seals

8.16 must preserve:

- 8.15.1 cold-start Home semantic seal;
- one saved-photo watermark compositor and no historical centered AXIS raster/divider;
- stable in-place Media Evidence swaps with no opacity pulse;
- 8.15 Encounter-bound media evidence;
- 8.14 factual Evolution Objects;
- 8.13.1 truthful Session/Encounter projection;
- all reliable training, Quick Record, Group Plan, Live Route, Settings, catalog and Learning ownership contracts.

## Current implementation state

The deterministic 86-step build now reaches and passes the 8.16 contract:

- `8.16 / 8.16`;
- `canonical-single-runtime`;
- one initial JavaScript request, zero dynamic JavaScript requests;
- Capture Field / 12-photo / <=60s video / existing-media-store gates;
- arbitrary Comparative Evidence / presets / stable swap / factual-only gates;
- Replay deferred.

A browser diagnostic found one narrow integration issue: the extended canonical `window.__AXIS_CAPTURE__` API was live in Chromium with `maxPhotos=12`, `maxVideoMs=60000` and draft APIs, and Comparative Evidence was live, while the standalone `window.__AXIS_816_CAPTURE_FIELD__` diagnostic object was not exposed after canonical boot. The product APIs were present; only the late marker was lost at canonical convergence.

The fix is to seal `__AXIS_816_CAPTURE_FIELD__` at the same surviving canonical `window.__AXIS_CAPTURE__` assignment boundary instead of relying on a late IIFE marker. `prepare-816-capture-marker-seal.mjs` owns that narrow convergence check.

## Exact validation required before merge

The final PR head must prove:

1. complete 86-step release build and exact 8.16 manifest contract;
2. Chromium and iPhone WebKit canonical boot expose the same 8.16 Capture owner/API;
3. normal Capture and Quick Record open the same `v816-capture-field`;
4. multi-photo draft reaches multiple files, cover reorder and deletion without overflow;
5. video starts/stops through the one canonical recorder and remains <=60s;
6. saved Encounter retains all deliberate `frameRefs[]` plus existing `clipRef` in `axis_v42_media`;
7. four historical photo-bearing Encounters support endpoints, recent and arbitrary two-point comparison;
8. normal Encounter inspection remains correct after comparison;
9. comparison mutates no canonical training/metadata storage and triggers no AXIS API request;
10. inherited 8.15.1 cold-start/watermark/evidence-swap, 8.15 Media Evidence, 8.14 Evolution, 8.13.1 Encounter and repository/runtime contracts remain green;
11. EdgeOne package verification accepts exact 8.16 bounds/ownership.

## Deployment after merge

Do not call 8.16 production-sealed until the exact merged `main` SHA passes all of the following:

1. Vercel Production is `READY` for the exact SHA;
2. `https://axis-five-puce.vercel.app/axis-build.json` reports that exact `sourceCommit`, `8.16 / 8.16`, canonical topology and all 8.16 gates;
3. EdgeOne waits for that exact Vercel golden artifact and proves local/Vercel parity;
4. EdgeOne deploys the exact prebuilt artifact;
5. authenticated EdgeOne/Vercel API parity passes;
6. real EdgeOne Chromium runs the inherited release flows plus the 8.16 Capture + Comparative Evidence smoke;
7. real EdgeOne iPhone WebKit runs the same 8.16 release flow;
8. GitHub combined status reports `EdgeOne Production: success` for the exact same main SHA.

## Next product stage

Only after 8.16 is production-sealed should the next stage explore a restrained private Replay. Replay must remain downstream of real Encounter-bound evidence and refuse fabricated continuity when evidence is insufficient.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/AXIS_EVOLUTION_VISION.md` and `docs/8.13.1_EVOLUTION_FOUNDATION.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Chat history is not authoritative project memory. Conversation history is supplemental only; GitHub state and these handoff documents are authoritative project memory.
