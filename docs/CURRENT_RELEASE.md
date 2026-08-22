# Current Release

## AXIS 8.17 — Interaction Convergence

**AXIS 8.17 is the current Production-sealed Web release.**

It starts from the Production-sealed 8.16 Capture Field + Comparative Evidence baseline and removes interaction semantics that still belonged to older AXIS versions. Historical version-named modules remain compiler inputs; final generated truth remains `axis-build.json`.

## Product position

AXIS is a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.17 is deliberately a convergence release rather than a new feature layer. It reduces choice burden at Capture, makes Evidence comparison immediately understandable, and introduces time-first archive behavior for growing personal history.

## Quick Record Evidence entry

Quick Record no longer exposes the historical three actions `补拍照片 / 3秒视频 / 5秒视频`.

It exposes one supplemental action:

**补拍照片 / 视频**

That action delegates to the existing canonical Capture Field, opening at Photo. Photo, Scan and Video are selected inside the Capture Field itself. No second camera or recorder lifecycle is introduced.

## Capture preference contract

The Settings surface reflects capabilities that actually exist in 8.17:

- `扫描取样`: 3秒 / 5秒;
- `拍摄视频`: 最长60秒 · 自动保存;
- normal `拍摄记录` opens at Photo;
- an explicitly recorded video is retained automatically.

The historical visible `默认扫描` and `保留现场视频` choices are retired. The old `keepClip` field may remain readable for backward compatibility but may not discard a video that the user explicitly recorded.

Ownership remains unchanged:

- camera owner: `app.js`;
- MediaRecorder owner: `app.js`;
- media persistence owner: `app.js`;
- media database: `axis_v42_media`;
- event media schema: `frameRefs[]` + `clipRef`;
- no new LocalStorage schema;
- no new media database;
- no upload or AI requirement.

## Comparative Evidence — two named slots

`v815-media-evidence` remains the read-only Evidence owner and inherits the 8.15.1 stable-swap contract.

8.17 exposes two human-readable comparison slots:

- **起点** — the first side of the comparison;
- **对照** — the point currently being compared against it.

When the user enters Compare, **对照** is active by default. Tapping a real photo-bearing Encounter on the timeline directly replaces that active slot. The user taps **起点** only when intentionally changing the starting point.

The selected pair must always consist of two distinct real Encounters. Existing factual shortcuts remain:

- `首尾`;
- `最近`;
- `相邻`.

Comparison controls live outside the visual stage. During a point change the existing pair remains visible while the next real local media is resolved and warmed. Only after both assets are ready may the stage commit the new pair. The stage must not remount, dim or expose another page/sheet layer.

Comparison remains factual only. It may not infer improvement, quality, score or ranking.

## Time-first archive

The Settings entry and sheet are named **资料与收纳**.

Growing sealed history is organized first by time rather than by arbitrary folders:

- sessions are grouped by calendar month;
- the newest month is expanded;
- older months are collapsed;
- existing selection and deletion semantics remain unchanged;
- archive grouping creates no duplicate records and no new persistence structure.

This is the storage foundation for 8.18 object-first organization. AXIS is not becoming a file manager.

## Inherited guarantees

8.17 preserves the 8.16 Capture and Evidence guarantees:

- one canonical Capture Field;
- up to 12 real photos per Encounter;
- safe cover reorder through real `frameRefs[]` order;
- one explicit silent video <=60 seconds through existing `clipRef`;
- existing `axis_v42_media` persistence owner;
- no new schema/store;
- arbitrary two-point factual Evidence comparison;
- no autoplay, creator workflow, network or AI ownership;
- Replay remains false.

It also preserves the complete 8.15.1 no-flash Evidence swap, single current photo-watermark compositor, truthful Evolution Objects and 8.13.1 Encounter foundation.

## Production topology

AXIS 8.17 ships as one canonical browser runtime:

- one `axis-core.js?v=<content hash>` request;
- one `axis-style.css?v=<content hash>` request;
- zero dynamic historical JavaScript chunks;
- architecture `canonical-single-runtime`;
- `version: 8.17`;
- `baseVersion: 8.17`.

`node build-release.mjs` is the sole release build entry point.

The manifest includes the inherited 8.16 gates plus:

- `quickEvidenceSingleEntry817`;
- `capturePreferencesCurrent817`;
- `captureEntryDefaultsPhoto817`;
- `explicitVideoRetained817`;
- `comparativeTwoSlot817`;
- `comparativeDirectTimeline817`;
- `comparativeStableControls817`;
- `comparativeNoFlash817`;
- `archiveMonthCollection817`;
- `archiveNoNewStorage817`;
- `interactionConvergence817`.

## Production seal record

The first 8.17 EdgeOne seal attempt on merge `b62bc63d7bb97245940874dbf9b06b280f316f27` successfully built, matched Vercel, deployed to EdgeOne and verified live manifest/API parity, but the inherited 8.15 Media Evidence smoke timed out after endpoint Compare rendering.

That failure was traced to a test semantic mismatch: 8.17 intentionally binds timeline taps inside Compare to the active named slot, while the inherited 8.15 smoke still expected the old single-Encounter inspection behavior without first leaving Compare.

PR #71 changed only that inherited test boundary. It kept the endpoint comparison assertion, explicitly exited Compare, then continued the inherited 8.15 single-Encounter overlay/photo/video checks. No runtime/product source, timeout budget or product assertion was relaxed.

The corrected release path was then revalidated on exact `main` revision `e6d31c2f08f97e078d85761d25a8fb385b1d6c3f`:

- Vercel Production: **success** for the exact revision;
- deterministic `8.17 / 8.17` canonical build: **success**;
- Vercel/local canonical artifact parity: **success**;
- EdgeOne exact prebuilt deployment: **success**;
- EdgeOne live manifest/source parity: **success**;
- EdgeOne live API parity: **success**;
- real EdgeOne Chromium full 8.17 release flow: **success**;
- real EdgeOne iPhone WebKit full 8.17 release flow: **success**;
- GitHub status `EdgeOne Production`: **success**.

Production workflow record: `32573605355`.

This document is the final continuity seal. A docs-only descendant of the validated runtime may advance `main`; it contains no runtime/product change and must itself pass the same exact-SHA Vercel/EdgeOne mirror workflow before it becomes the repository tip.

## Production endpoints

- Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

## Next stage

**8.18 — Evolution Library / Personal Object Shelf** is the preferred next release.

The scaling primitive is not category tabs or user-created folders. Repeated reality should settle into stable Evolution Objects that can be browsed across domains by factual recurrence, recency, relationship span and real evidence density. The same object model should cover a gym movement, running route, climbing problem, rehabilitation movement, dance sequence, sport skill or musical passage without turning AXIS into separate products.

After object organization is trustworthy, **8.19 Evolution Replay** can compress real Encounter-bound evidence into a private truthful time sequence. Replay remains downstream rather than becoming a video-editor feature.

See [AXIS_817_818_DIRECTION.md](AXIS_817_818_DIRECTION.md), [AXIS_EVOLUTION_VISION.md](AXIS_EVOLUTION_VISION.md), [CURRENT_WORK.md](CURRENT_WORK.md), [PRODUCT.md](PRODUCT.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
