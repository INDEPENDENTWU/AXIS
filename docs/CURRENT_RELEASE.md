# AXIS — Current Release Contract

## Public release

**8.8.1**

This file is the entry point for future AXIS work. Historical chat context is not required to understand or continue the product.

## Canonical production architecture

AXIS 8.8.1 production is a **canonical single-runtime release**.

The browser receives:

- one external JavaScript runtime: `axis-core.js?v=<content hash>`;
- one external stylesheet: `axis-style.css?v=<content hash>`;
- zero dynamic historical runtime chunks;
- zero optional feature/completion network requests;
- no silent fallback to an older product while the public label still says 8.8.1.

Historical files such as `v82-runtime.js`, `v879-runtime.js`, `v8711-runtime.js`, and `v8712-runtime.js` remain compiler inputs / implementation history only. They are not independent production layers. `postbuild-88-canonical.mjs` emits the one production runtime after all release convergence stages.

## Canonical release metadata

[`release-contract.json`](../release-contract.json) owns the machine-readable release identity:

- public version: `8.8.1`;
- runtime baseline: `8.8.1`;
- architecture: `canonical-single-runtime`;
- stable dynamic chunk count: `0`;
- build command: `node build-release.mjs`.

`axis-build.json` must agree with this contract. A mismatch is release-blocking.

## 8.8.1 ownership map

| Product surface | Canonical owner | Contract |
|---|---|---|
| Public version / top-level shell | first-paint shell + canonical runtime | First DOM already presents 8.8.1; runtime may not repaint another product version. |
| Runtime packaging | `postbuild-88-canonical.mjs` | Historical build layers flatten into one production runtime; no dynamic old-version requests survive. |
| Release metadata | `release-contract.json` | CI and deployment verification read the same contract. |
| Custom exercise persistence/open/delete | `app.js` | One data transaction and one editor entry. |
| Custom exercise professional UI | `v874-professional.js` | Sole subtype / detailed-muscle inference and selection owner. |
| Custom search | `v873-smart-input.js` | Search/ranking only; it hands data to the editor and never writes editor truth. |
| Equipment / exercise catalog | canonical v8710 renderer produced by `prepare-88-catalog-convergence.mjs` | One `#v8710Cards` painter; primary-muscle taxonomy preserves compound movements and one curated order before/after category interactions. |
| Recording draft / sets | `v61.js` | Single strength draft/save owner through `window.__AXIS_RECORDING__`. |
| Group-plan renderer | canonical v8712 planner output + `prepare-881-convergence.mjs` | One planner owner. 8.8.1 main step inputs are unitless centered numbers; weight presets are `.5 / 1 / 1.25 / 2 / 2.5 / 5 / 7.5 / 10`; repetition deltas are `−1 … −6`. Units remain only in surrounding semantic summaries/preview. |
| Default capture preference | v876 preference bridge | `photo / 3 / 5` has one visible writer and one persisted truth; legacy `scanSeconds` is migration input only. |
| Capture entry | canonical `#scanBtn` handler | First visible capture frame reflects persisted canonical preference; no delayed correction. |
| Active-item countdown | v87 active-session owner | Remaining time is derived from existing activity intervals and normalized estimate (minimum 60 s); pause naturally freezes elapsed time and resume continues it. No second timer exists. |
| Countdown completion tone | v87 reminder/audio owner | At zero, the same v87 AXIS tone owner renders `00:00` then plays once and persists `itemReminderNotifiedAt`. Intentional long-press finish suppresses the pending item-completion tone. |
| Active-session adjustment entry | `#v87AdjustBtn` | Exactly one visible semantic adjustment action at every rendered frame. |
| Active-session adjustment transaction | v879 one-time `#v879Edit` sheet | Historical v879 entry button remains retired; retained sheet visibly commits once behind `#v87AdjustBtn`. |
| Watermark information switches | v85 canonical switches | Name / training data / location / time are four independent persisted truths. |
| Watermark location | v8710 canonical precise resolver | Explicit refresh uses precise OSM place data first and fallback only on failure. Coordinates stay private. The visible setting label keeps the complete canonical precise place; layout may wrap but data is not shortened. |
| Watermark center brand | v8710 final preview/media owner | Exactly one centered `AXIS` wordmark in preview and finalized media. Historical center posters are hidden. |
| Watermark brand opacity | v876 opacity preference/range → v8710 presentation | One persisted 4–48% value controls only the centered AXIS wordmark. Information rail opacity is independent. |
| Watermark corner placement | `#v8711Corners button[data-p]` | Exactly four visible placement controls; legacy hit targets are inert. |
| Settings custom list | `app.js` + canonical editor | Settings never creates a second custom editor. |
| Trends | `v84-runtime.js` / `.v84Trends` | `v84NowList`, `v84Axis`, `v84MemoryRows`, `v84Rhythm` are current; pre-v84 `coverageGrid` remains retired. |
| Training report | `v8710-report.js` / `#v8710ReportDeck` | Current report is the three-card 4:5 deck; base and v877 report surfaces remain retired. |

## Chronological convergence rules

Later intentional replacements always beat earlier fixes. The current release explicitly protects these collisions:

1. **Runtime delivery:** old core/chunk/optional loading is compiler history; final delivery is one canonical runtime.
2. **Capture:** v876 `photo / 3s / 5s` replaces base `scanSeconds` visual/click ownership.
3. **Capture compiler:** `$$()` multi-selector replacement must never collapse to `$()`.
4. **Active adjustment:** `#v87AdjustBtn` is the only entry; v879 sheet is retained only as the one-time transaction.
5. **Catalog:** category tap/open/search-clear/pageshow/reopen all return the same rich canonical list; v8712 catalog repaint is retired.
6. **Watermark information:** v85/v8711/v8710 controls supersede older name/location/placement writers; raw coordinates never surface.
7. **Watermark brand:** 8.8.1 adds one centered `AXIS` wordmark. Brand opacity is not an information-rail opacity control and the historical 32% clamp is retired; canonical range is 4–48%.
8. **Precise place:** canonical place data is not truncated to the last two segments. UI layout may wrap; the stored/displayed place itself remains complete.
9. **Active countdown:** 8.8.1 reuses v87 intervals and sound owner; it does not add a parallel timer/audio layer. UI and tone use the same normalized estimate; zero is rendered before the completion tone transaction.
10. **Trends/report:** v84 Trends and v8710 Report remain final surfaces; old hidden surfaces are never revived to satisfy a historical test.

A future fix must not restore an older surface simply because a historical DOM node/source file still exists.

## Retired ownership

The canonical build removes/neutralizes, among others:

- historical release/version writers and dynamic enhancement delivery;
- duplicate custom-editor writers in v873/v876/v8712;
- v8712 secondary catalog painter;
- base `scanSeconds` painter/click writer and delayed capture correction;
- old active-adjustment entry buttons;
- raw coordinate presentation and duplicate watermark-location writers;
- historical center watermark poster as a visible brand owner;
- v876 32% brand-opacity ceiling;
- data-level truncation of precise place to the last two segments;
- first-record filler copy `记得多少就记多少`;
- pre-v84 Trends and base/v877 report surfaces.

Do not restore a retired behavior by re-enabling an entire historical module.

## Release build

Every environment executes only:

```text
node build-release.mjs
```

Current deterministic sequence:

```text
prepare-881-version.mjs
prepare-legacy-runtime.mjs
prepare-product-convergence.mjs
prepare-first-paint-shell.mjs
prepare-88-convergence.mjs
prepare-88-catalog-convergence.mjs
prepare-88-watermark-final.mjs
prepare-88-watermark-state-sync.mjs
prepare-88-watermark-location-owner.mjs
prepare-881-convergence.mjs
build-hardened.mjs
postbuild-kernel-priority.mjs
postbuild-features-hardened.mjs
postbuild-8712-completion.mjs
postbuild-88-canonical.mjs
postbuild-881-contract.mjs
verify-88-watermark.mjs
```

Provider configuration must never copy this sequence. Vercel / EdgeOne / CI call `node build-release.mjs` only.

## Mandatory release gates

A release is incomplete unless the same exact source SHA passes:

- canonical artifact: one JS runtime, one stylesheet, zero dynamic runtime chunks;
- repeated mobile/desktop cold boot and first-paint stability;
- Settings/capture/active-adjust ownership diagnostics;
- completion interaction and full product operation matrix;
- equipment catalog stability across repeated taps, category switches, search clear, pageshow and reopen in Chromium/WebKit;
- watermark four switches, precise OSM place, complete visible place name, coordinate privacy, single locate writer in Chromium/WebKit;
- **8.8.1 planner regression:** unitless centered numeric inputs, eight weight presets, six repetition-delta presets, persistence and preview update;
- **8.8.1 brand regression:** centered AXIS preview/media owner, 4–48% opacity follows the slider, information rail opacity remains unchanged;
- **8.8.1 countdown regression:** countdown presentation, pause freeze, resume continuation, zero-frame synchronization, one completion tone, long-press finish suppresses that tone;
- no transient duplicate adjustment actions;
- current v84 Trends and v8710 three-card Report remain visible while retired surfaces remain hidden;
- no uncaught browser errors;
- iPhone-sized WebKit critical flow including the 8.8.1 regression;
- production manifest bound to the exact deployed source SHA;
- fixed public Production alias serving the exact 8.8.1 SHA and all 8.8.1 manifest gates.

## Deployment discipline

Vercel Git deployment is main-only. Feature/test/docs branches do not automatically create Preview builds. GitHub Actions is the primary validation plane; merging a fully green `main` triggers one Production build. The fixed public alias gate verifies `https://axis-five-puce.vercel.app/axis-build.json` against the exact deployed SHA.

Vercel Authentication / Security Checkpoint is platform-level and occurs before AXIS runtime. It must not be confused with an application loading failure.

## Rule for future work

Do not repair a visible defect by adding another observer, delayed cleaner, duplicate timer/audio owner, duplicate click handler, version painter, or optional runtime layer.

For every replacement:

1. identify current and historical owners;
2. move behavior to the intended canonical owner;
3. retire the prior writer/surface in the same change;
4. add executable invariants for final and transient states;
5. test real visibility/geometry, not only classes/DOM existence;
6. update `release-contract.json` if release identity changes;
7. update this document if ownership changes;
8. require fixed Production alias verification before calling a release complete.

When a future conversation has no historical context, start here, then read `release-contract.json`, `docs/RUNTIME_CONTRACT.md`, `build-release.mjs`, `postbuild-88-canonical.mjs`, `prepare-881-convergence.mjs`, and the active browser gates.
