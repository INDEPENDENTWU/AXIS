# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of this work

- **AXIS 8.16 — Capture Field + Comparative Evidence** is Production-sealed.
- Exact sealed 8.16 `main` SHA: `0dbb25cd432e3cc7de0258affcdc892d8d55ce9b`.
- Vercel Production `https://axis-five-puce.vercel.app` and EdgeOne Production `https://axisfitness-mirror-9x91gveo.edgeone.cool` served the exact same 8.16 canonical artifact.
- Real EdgeOne Chromium and iPhone WebKit full inherited + 8.16 release flows passed.
- Provider-neutral stale-shell freshness remains `/axis-build.json` + `cache:'no-store'`.

## Product direction

AXIS remains a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.17 is an interaction-convergence release, not a new feature category. It unifies Capture entry semantics, makes Comparative Evidence understandable through named slots, and gives growing history a time-first archive without adding a second recorder, media store, training owner or persistence schema.

## Active change — AXIS 8.17 Production Seal

- **AXIS 8.17 — Interaction Convergence** merged through PR #70 as `b62bc63d7bb97245940874dbf9b06b280f316f27`.
- Vercel successfully deployed that exact 8.17 canonical artifact.
- EdgeOne also deployed the exact Vercel-parity artifact and verified live `8.17 / 8.17`, source parity and all seven API contracts.
- The first real EdgeOne Chromium seal run stopped in the inherited 8.15 Media Evidence smoke after Compare had already passed endpoint rendering.
- Root cause was a **test semantic mismatch**, not a product/runtime failure: 8.17 intentionally keeps timeline taps inside Compare bound to the active named slot (`起点` / `对照`), while the inherited 8.15 smoke still expected a timeline tap inside Compare to return to single-Encounter inspection.
- PR #71 corrected only that inherited test boundary: endpoint Compare is still proved, then the test explicitly exits Compare before inheriting the 8.15 single-Encounter overlay/photo/video contract.
- PR #71 squash-merged as `798d11b901e1d7f48636d30dd33fd5db67d5fd5c`.
- No AXIS runtime/product source, storage owner, media owner, Capture semantics, comparison semantics, timeout budget or assertion strength changed in that fix.
- This handoff update is documentation-only. The exact post-merge `main` SHA must still pass the full Vercel → EdgeOne parity → Chromium → iPhone WebKit Production flow before 8.17 is called sealed.

### 8.17 product contract retained

- Quick Record exposes one supplemental **补拍照片 / 视频** entry.
- Canonical Capture opens at Photo; Scan keeps 3秒 / 5秒 sampling; explicit Video is retained automatically up to 60 seconds.
- Comparative Evidence uses **起点 ↔ 对照**, with `对照` active by default and timeline taps replacing the active slot while Compare is on.
- Evidence keeps the 8.15.1 stable in-place warm-before-commit/no-opacity-pulse contract.
- **资料与收纳** groups sealed history by month, newest open and older months collapsed, while preserving existing deletion semantics.
- Camera/MediaRecorder/media persistence remain owned by `app.js` and `axis_v42_media`; Media Evidence remains read-only `v815-media-evidence`.
- Replay remains deferred.

## Validation for this work

8.17 is Production-sealed only when all of the following are true for the exact final `main` revision:

1. deterministic release build reports `8.17 / 8.17`, `canonical-single-runtime`;
2. repository/runtime and inherited 8.13.1 → 8.17 contracts remain green;
3. Vercel Production is READY for the exact final `main` SHA;
4. Vercel manifest/runtime/CSS/source identity matches the locally built canonical artifact;
5. EdgeOne publishes that exact verified prebuilt artifact and live manifest/API parity matches Vercel;
6. real EdgeOne Chromium passes 8.12.4, 8.13.1, 8.14, inherited 8.15, 8.15.1, 8.16 and dedicated 8.17 flows;
7. real EdgeOne iPhone WebKit passes the same Production flow;
8. only after both engines pass may `EdgeOne Production: success` and **AXIS 8.17 Production-sealed** be recorded.

No timeout inflation, product rollback or weakening of the 8.17 named-slot interaction is acceptable as a way to make the seal green.

## Next planned stage — 8.18

**AXIS 8.18 — Evolution Library / Personal Object Shelf**.

The next scaling problem is not more Settings or more sport tabs. AXIS needs an object-first personal world that stays usable after hundreds or thousands of Encounters. Repeated reality should settle into stable Evolution Objects that can be browsed by recency, duration of relationship and real evidence density across training, routes, rehabilitation, climbing, dance, sport skills and music practice.

Replay remains downstream. The preferred sequence stays **8.17 Interaction Convergence → 8.18 Evolution Library → 8.19 truthful Evolution Replay**.

See `AXIS_817_818_DIRECTION.md` for the concrete product expansion contract.
