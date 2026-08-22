# Current Release

## AXIS 8.17.1 — Active Truth + Capture Polish

**AXIS 8.17.1 is the current Production-sealed Web release.**

It is a hardening patch over AXIS 8.17 Interaction Convergence. The canonical browser release identity intentionally remains `version: 8.17` / `baseVersion: 8.17`; 8.17.1 is the product/release patch label recorded by the current handoff and source-media contracts.

AXIS remains a **Personal Evolution Engine**:

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

## What 8.17.1 seals

### 1. Active Truth

A running equipment / sport item may be adjusted once. Once confirmed, the adjusted values become the effective factual truth immediately rather than remaining merely an editing overlay.

The current item, timeline and downstream factual views must consume the effective/final record. Initial values may be preserved only as contextual audit information and must not continue to drive current or final projections after the adjustment is accepted.

Estimated target time remains a reminder boundary, not a completion boundary. Reaching it must never fabricate completion or auto-stop an ongoing item.

### 2. Capture and clean-source media authority

AXIS keeps one capture/persistence model:

- camera owner: `app.js`;
- MediaRecorder owner: `app.js`;
- media persistence owner: `app.js`;
- media database: `axis_v42_media`;
- clean photo source: `sourceFrameRefs[]` → `S-*`;
- clean video source: `sourceClipRef` → `SV-*`;
- canonical photo refs: `frameRefs[]` → `F-*`;
- canonical video ref: `clipRef` → `V-*`.

No second database, object store, recorder, upload path, network owner or AI owner is introduced.

`window.__AXIS_MEDIA_SOURCE__` is a read-only resolver owned by the existing app layer. It resolves a clean source sidecar when available and falls back to canonical media for historical records.

The watermark compositor reads the clean source first and writes only the canonical derivative. Media Evidence also reads clean source first while remaining fully read-only.

This prevents a presentation watermark choice from becoming a destructive loss of the best captured local source.

### 3. Capture preference hardening

The 8.17 Capture contract remains intact:

- normal Capture opens at Photo;
- Scan sampling exposes only `3秒 / 5秒`;
- explicit video remains `最长60秒 · 自动保存`;
- Quick Record exposes one supplemental `补拍照片 / 视频` entry;
- explicit recorded video is retained;
- no historical `单张 / 3秒 / 5秒` default-mode controller may reclaim final Settings ownership.

The 8.17.1 delegated Scan preference writer remains app-owned even when Settings content is remounted or converged.

### 4. Camera-facing foundation

Front/rear preview switching is supported within the existing canonical Capture lifecycle. 8.17.1 does not fake unsafe in-recording camera switching by mutating a live recorder track on browsers where that is unreliable.

A future Evidence Sequence layer may represent one logical recording as safe physical camera segments. That work remains downstream of this seal.

### 5. Time-first archive selection stability

`资料与收纳` keeps the 8.17 month-first archive model:

- sessions grouped by calendar month;
- newest month open;
- older months collapsed;
- no duplicate records or new persistence structure.

8.17.1 hardens selection so mounted Settings repaint cannot erase current selection state. Single selection, `全选 ↔ 取消全选`, partial-selection recovery and deletion operate from one stable selected-session set.

### 6. Sound ownership and semantics

The existing v8710 automatic sound owner remains authoritative. 8.17.1 does not resurrect retired reminder owners or add duplicate automatic audio logic.

The semantic distinction is preserved:

- approaching / reaching an estimated target = reminder feedback;
- user-confirmed end = actual completion feedback.

Target time never becomes a fabricated completion event.

## Inherited 8.17 guarantees

8.17.1 preserves the complete 8.17 interaction contract:

- one Quick Evidence supplement entry;
- Photo-first Capture;
- 3/5-second Scan sampling;
- one explicit <=60-second video;
- named Comparative Evidence slots `起点 ↔ 对照`;
- `对照` active by default;
- timeline taps replace the active comparison slot while Compare is active;
- factual shortcuts `首尾 / 最近 / 相邻`;
- stable warm-before-commit Evidence swap with no opacity/layout pulse;
- time-first archive grouping;
- no Replay/editor workflow.

It also preserves the inherited 8.16 unified Capture Field, 8.15.1 stable Evidence swap and watermark ownership, 8.15 Media Evidence, 8.14 Evolution Objects and 8.13.1 Encounter foundation.

## Canonical production topology

The deployed browser artifact remains one canonical runtime:

- one `axis-core.js?v=<content hash>` request;
- one `axis-style.css?v=<content hash>` request;
- zero dynamic historical JavaScript chunks;
- architecture `canonical-single-runtime`;
- manifest `version: 8.17`;
- manifest `baseVersion: 8.17`.

`node build-release.mjs` remains the sole release build entry point.

8.17.1 adds and seals source-media gates including clean-source sidecars, read-only media-source bridge, watermark source-first behavior, Evidence source-first behavior, canonical fallback, unchanged event pointers and no new persistence ownership.

## Production seal record

PR #75 passed the current Chromium + iPhone WebKit release gates before merge, including source-first media behavior and inherited 8.17 / 8.16 / 8.15.x contracts.

It merged to exact runtime `main` revision:

`0cd7884b83289d052ea6450a7916ca95578246f6`

That exact runtime revision then passed the normal production path:

- Vercel exact-main deployment: **success**;
- Vercel deployment state: **READY**;
- Vercel/local canonical artifact parity: **success**;
- EdgeOne exact prebuilt deployment: **success**;
- EdgeOne authenticated deployment and Vercel API parity: **success**;
- EdgeOne runner-visible Production URL resolution: **success**;
- real EdgeOne Chromium full release flow: **success**;
- real EdgeOne iPhone WebKit full release flow: **success**;
- GitHub status `EdgeOne Production`: **success**;
- GitHub status `Vercel`: **success**.

Production workflow record: `32579444996`.

The final combined status for the exact runtime SHA is green on both Production providers.

## Production endpoints

- Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

## Next stage

**AXIS 8.18 — Evolution Library / Personal Object Shelf** is the preferred next release.

The scaling primitive is not category tabs or user-created folders. Repeated reality should settle into stable Evolution Objects that can be browsed across domains by factual recurrence, recency, relationship span and real evidence density.

Replay remains downstream. After object organization is trustworthy, an Evidence Sequence layer may safely support logical multi-camera recording segments and richer time anchors before truthful Evolution Replay is introduced.

See [AXIS_817_818_DIRECTION.md](AXIS_817_818_DIRECTION.md), [AXIS_8171_SOURCE_MEDIA.md](AXIS_8171_SOURCE_MEDIA.md), [CURRENT_WORK.md](CURRENT_WORK.md), [PRODUCT.md](PRODUCT.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
