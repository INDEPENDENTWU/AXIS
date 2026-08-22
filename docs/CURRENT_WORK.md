# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline

- **AXIS 8.16 — Capture Field + Comparative Evidence** is Production-sealed.
- Exact merged `main` SHA: `0dbb25cd432e3cc7de0258affcdc892d8d55ce9b`.
- Vercel Production `https://axis-five-puce.vercel.app` is READY for that exact SHA and serves `8.16 / 8.16`, `canonical-single-runtime`.
- EdgeOne Production `https://axisfitness-mirror-9x91gveo.edgeone.cool` serves the exact Vercel-parity artifact.
- Real EdgeOne Chromium and iPhone WebKit full inherited + 8.16 release flows both passed.
- Provider-neutral stale-shell freshness is sealed at `/axis-build.json` + `cache:'no-store'`.

## Product direction

AXIS remains a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.17 does not add another feature category. It removes obsolete choices and makes existing Capture, Evidence comparison and growing history behave as one coherent product.

## Active change — AXIS 8.17 Interaction Convergence

- Branch: `web-817-interaction-convergence`.
- Base: exact sealed 8.16 SHA `0dbb25cd432e3cc7de0258affcdc892d8d55ce9b`.
- Candidate public/base version: **8.17**.
- Camera/recorder/media ownership remains `app.js` + existing `axis_v42_media`.
- Media Evidence remains read-only owner `v815-media-evidence`.

### Quick Record

The historical three-button `补拍照片 / 3秒视频 / 5秒视频` supplement is retired. Quick Record exposes one calm action: **补拍照片 / 视频**. It opens the same canonical 8.16 Capture Field at Photo; Scan and Video are chosen inside that field.

### Capture preferences

Settings reflects the actual current model:

- `扫描取样`: 3秒 / 5秒;
- `拍摄视频`: 最长60秒 · 自动保存;
- normal `拍摄记录` opens at Photo;
- an explicitly recorded video is retained; the historical visible `保留现场视频` choice is retired.

No new preference store, media database or event schema is introduced.

### Comparative Evidence

Comparison becomes a named two-slot interaction:

- **起点**;
- **对照**.

Entering comparison activates `对照` by default. A normal timeline tap immediately replaces that active point. The user only taps `起点` when they specifically want to move the start point. `首尾 / 最近 / 相邻` remain factual shortcuts.

The controls remain mounted outside the media stage. Existing images remain visible while the next real local assets are warmed; the stage commits only after the pair is ready. The 8.15.1 zero-opacity-pulse / stable-section contract remains release-blocking.

### Time-first archive

`数据与空间` becomes **资料与收纳**. The historical flat deletion list becomes month groups:

- newest month open;
- older months collapsed;
- existing selection/deletion semantics remain unchanged;
- no folders, tags, duplicated records or migration;
- time is the first organizing axis.

This is the storage foundation for a later object-first Evolution Library rather than a generic file manager.

## Validation

8.17 is incomplete until all of the following are green:

1. deterministic release build is `8.17 / 8.17`, `canonical-single-runtime`;
2. Quick Record has exactly one supplemental evidence entry and no legacy 3s/5s video buttons;
3. that entry opens the canonical Capture Field at Photo;
4. current Capture preferences replace obsolete visible controls;
5. explicit video persists through the existing `clipRef` / `axis_v42_media` owner even when a legacy `keepClip:false` value exists;
6. two-slot comparison defaults to `对照`, timeline selection directly replaces the active slot, and slots never collapse to the same Encounter;
7. comparison stage identity remains mounted and opacity remains 1 while media changes;
8. month archive keeps older history collapsed and preserves deletion semantics;
9. Chromium and iPhone WebKit pass the dedicated 8.17 smoke;
10. inherited 8.16, 8.15.1, 8.15, 8.14, 8.13.1 and repository/runtime contracts remain green;
11. after merge, Vercel and EdgeOne both serve the exact merged SHA;
12. real EdgeOne Chromium + iPhone WebKit 8.17 flows pass before Production is called sealed.

## Next planned stage — 8.18

**AXIS 8.18 — Evolution Library / Personal Object Shelf**.

The next scaling problem is not more Settings or more sport tabs. AXIS needs an object-first personal world that stays usable after hundreds or thousands of Encounters. Repeated reality should settle into stable Evolution Objects that can be browsed by recency, duration of relationship and real evidence density across training, routes, rehabilitation, climbing, dance, sport skills and music practice.

Replay remains downstream. The current preferred sequence is **8.17 Interaction Convergence → 8.18 Evolution Library → 8.19 truthful Evolution Replay**.

See `AXIS_817_818_DIRECTION.md` for the concrete product expansion contract.
