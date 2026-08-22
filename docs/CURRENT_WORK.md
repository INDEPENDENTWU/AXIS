# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of this work

- **AXIS 8.16 — Capture Field + Comparative Evidence** was the Production-sealed baseline for the 8.17 convergence work.
- Exact sealed 8.16 SHA: `0dbb25cd432e3cc7de0258affcdc892d8d55ce9b`.
- Vercel and EdgeOne served the exact same 8.16 canonical artifact.
- Real EdgeOne Chromium and iPhone WebKit inherited + 8.16 release flows passed.

## Product direction

AXIS remains a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.17 is an interaction-convergence release, not a new feature category. It unifies Capture entry semantics, makes Comparative Evidence understandable through named slots, and gives growing history a time-first archive without adding a second recorder, media store, training owner or persistence schema.

## Active change — AXIS 8.17 is Production-sealed

There is no remaining 8.17 product or release blocker.

- PR #70 delivered AXIS 8.17 Interaction Convergence.
- PR #71 corrected the inherited 8.15 Media Evidence test boundary so old single-Encounter inspection is tested only after explicitly leaving 8.17 Compare mode.
- No runtime/product source, timeout budget or assertion strength was relaxed by that correction.
- Exact validated runtime revision: `e6d31c2f08f97e078d85761d25a8fb385b1d6c3f`.
- Vercel exact revision: success.
- Canonical build and Vercel/local artifact parity: success.
- EdgeOne exact prebuilt deployment and live manifest/API parity: success.
- Real EdgeOne Chromium full 8.17 Production flow: success.
- Real EdgeOne iPhone WebKit full 8.17 Production flow: success.
- `EdgeOne Production` status: success.
- Production workflow record: `32573605355`.

This docs-only continuity seal does not change runtime/product behavior. After merge, the exact docs-only repository tip must pass the same Vercel/EdgeOne mirror workflow so `main`, Vercel and EdgeOne remain exact-revision aligned.

### Sealed 8.17 product contract

- Quick Record exposes one supplemental **补拍照片 / 视频** entry.
- Canonical Capture opens at Photo; Scan keeps 3秒 / 5秒 sampling; explicit Video is retained automatically up to 60 seconds.
- Comparative Evidence uses **起点 ↔ 对照**, with `对照` active by default and timeline taps replacing the active slot while Compare is on.
- Evidence keeps the 8.15.1 stable in-place warm-before-commit/no-opacity-pulse contract.
- **资料与收纳** groups sealed history by month, newest open and older months collapsed, while preserving existing deletion semantics.
- Camera/MediaRecorder/media persistence remain owned by `app.js` and `axis_v42_media`; Media Evidence remains read-only `v815-media-evidence`.
- Replay remains deferred.

## Validation for this work

The 8.17 Production-seal criteria have been satisfied:

1. deterministic release build reports `8.17 / 8.17`, `canonical-single-runtime`;
2. Vercel Production serves the exact validated revision;
3. Vercel/local manifest/runtime/CSS/source identity matches;
4. EdgeOne publishes the exact verified prebuilt artifact;
5. EdgeOne live manifest and API contracts match Vercel;
6. real EdgeOne Chromium passes the inherited + 8.17 release flow;
7. real EdgeOne iPhone WebKit passes the same Production flow;
8. `EdgeOne Production` is green.

No timeout inflation, product rollback or weakening of the 8.17 named-slot interaction was used to obtain the seal.

## Next planned stage — 8.18

**AXIS 8.18 — Evolution Library / Personal Object Shelf**.

The next scaling problem is not more Settings or more sport tabs. AXIS needs an object-first personal world that stays usable after hundreds or thousands of Encounters. Repeated reality should settle into stable Evolution Objects that can be browsed by recency, duration of relationship and real evidence density across training, routes, rehabilitation, climbing, dance, sport skills and music practice.

Replay remains downstream. The preferred sequence stays **8.17 Interaction Convergence → 8.18 Evolution Library → 8.19 truthful Evolution Replay**.

See `AXIS_817_818_DIRECTION.md` for the concrete product expansion contract.
