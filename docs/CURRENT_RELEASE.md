# AXIS — Current Release Contract

## Public release

**8.8**

This file is the entry point for future AXIS work. Historical chat context is not required to understand or continue the product.

## Canonical production architecture

AXIS 8.8 production is a **canonical single-runtime release**.

The browser receives:

- one external JavaScript runtime: `axis-core.js?v=<content hash>`;
- one external stylesheet: `axis-style.css?v=<content hash>`;
- zero dynamic historical runtime chunks;
- zero optional feature/completion network requests;
- no silent fallback to an 8.7.x product while the public label still says 8.8.

Historical files such as `v82-runtime.js`, `v879-runtime.js`, `v8711-runtime.js`, and `v8712-runtime.js` remain in the repository as implementation history and compiler inputs. They are **not independent production runtime layers**. `postbuild-88-canonical.mjs` consumes the already converged build outputs and emits the one production runtime.

A user must never be able to receive a mixture such as “8.8 shell + 8.7.11 capability + optional 8.8 patch” because one dynamic request failed or arrived late.

## Canonical release metadata

[`release-contract.json`](../release-contract.json) owns the machine-readable release identity:

- public version: `8.8`;
- runtime baseline: `8.8`;
- architecture: `canonical-single-runtime`;
- stable dynamic chunk count: `0`;
- build command: `node build-release.mjs`.

`axis-build.json` must agree with this contract. A mismatch is release-blocking.

## 8.8 ownership map

| Product surface | Canonical owner | Contract |
|---|---|---|
| Public version / top-level shell | first-paint shell + canonical runtime | The first DOM already presents 8.8; runtime may not repaint another product version. |
| Runtime packaging | `postbuild-88-canonical.mjs` | Historical build layers are flattened into one production runtime; no dynamic old-version requests survive. |
| Release metadata | `release-contract.json` | CI and deployment verification read the same contract. |
| Custom exercise persistence / open / delete | `app.js` | One data transaction and one editor entry. |
| Custom exercise professional UI | `v874-professional.js` | Sole subtype / detailed-muscle inference and selection owner. |
| Custom search | `v873-smart-input.js` | Search/ranking only; it hands data to the editor and never writes editor truth. |
| Recording draft / sets | `v61.js` | Single strength draft and save owner through `window.__AXIS_RECORDING__`. |
| Default capture preference | v876 preference bridge | `photo` / `3` / `5` has one visible writer and one persisted truth; legacy `scanSeconds` is migration input only. |
| Capture entry | canonical `#scanBtn` handler | The first visible capture frame already reflects the persisted canonical preference; no delayed correction is allowed. |
| Active-session adjustment entry | `#v87AdjustBtn` | Exactly one visible semantic adjustment action at every rendered frame. |
| Active-session adjustment transaction | v879 one-time `#v879Edit` sheet | The historical v879 entry button is retired, but the v879 transaction is the retained canonical editor behind `#v87AdjustBtn`; it must be visibly rendered and commit once. |
| Watermark name | `#v85WmName` | Visible name switch and `axis_v8_meta.prefs.v85WmName` are one owner. |
| Watermark corner placement | `#v8711Corners button[data-p]` | Exactly four visible corner controls; legacy `button[data-pos]` hit targets are inert/hidden. |
| Watermark location | precise resolver internally; concise Chinese place externally | Coordinates may be stored for geocoding but never appear in normal UI or final watermark text. |
| Settings custom list | `app.js` + canonical editor | Settings never creates a second custom editor. |
| Trends | `v84-runtime.js` / `.v84Trends` | `v84NowList`, `v84Axis`, `v84MemoryRows`, and `v84Rhythm` are the current surface; pre-v84 `coverageGrid` remains retired. |
| Training report | `v8710-report.js` / `#v8710ReportDeck` | Current report is a three-card 4:5 deck with `#v8710ShareReport`; base `#reportPreview` and v877 report surfaces remain retired. |

## Chronological convergence rules verified in 8.8

The final release must preserve **later intentional replacements over earlier fixes**. During the final 8.8 audit, the following historical collisions were explicitly checked:

1. **Runtime delivery:** earlier core + chunk + feature promotion is compiler history only; final delivery is one canonical runtime.
2. **Capture preference:** the later v876 `photo / 3s / 5s` preference replaces the earlier base `scanSeconds` visual/click writer. Old data may migrate forward but may not repaint the control.
3. **Capture compiler:** JavaScript replacement strings may not collapse the `$$()` multi-selector helper to `$()`. Canonical packaging uses function-form replacement and build assertions.
4. **Active adjustment:** the later single `#v87AdjustBtn` entry replaces old v8710/v879 entry buttons. The v879 transaction sheet itself remains the current one-time editor and must not be hidden by historical hardening CSS.
5. **Watermark:** later v85/v8711 controls replace older name/placement controls. Completion leaves old corner nodes inert so there is only one clickable placement owner.
6. **Trends:** v84 intentionally hides the pre-v84 coverage UI. Release tests must validate `.v84Trends`, never revive `coverageGrid` to satisfy an old test.
7. **Report:** v8710 intentionally hides base/v877 report surfaces and owns the three-card report deck. Release tests validate `#v8710ReportDeck`, never revive `#reportPreview`.

A future fix must not restore an older surface simply because a historical DOM node still exists.

## Retired ownership

8.8 convergence removes or neutralizes the following writers/surfaces before or during canonical runtime execution:

- historical product release/version writers;
- dynamic enhancement / feature / completion requests as production delivery;
- `v873-smart-input.js` custom-editor type/muscle writer;
- `v876-runtime.js` duplicate custom draft/inference/save patcher outside its retained capture-preference responsibility;
- `v8712-runtime.js` duplicate custom-editor ownership;
- base `scanSeconds` visual painter and click writer;
- v876 delayed capture correction;
- `v8710EditOnce` and the old `v879EditBtn` active-adjustment entries;
- raw coordinate presentation in watermark UI / media output;
- old watermark name/placement controls as interactive owners;
- first-record filler copy `记得多少就记多少`;
- pre-v84 trends coverage surface as the public Trends UI;
- base/v877 report preview/deck as the public Report UI;
- duplicate active-session adjustment actions;
- dynamic 8.7.x → 8.8 runtime promotion/fallback as a production delivery mechanism.

Do not restore a retired behavior by re-enabling an entire historical module.

## Custom exercise behavior

1. Typing a recognizable exercise name automatically infers a professional training subtype and detailed muscles.
2. The inferred result immediately synchronizes into the canonical persistence fields.
3. Manual additions extend the inferred result instead of unexpectedly replacing it.
4. Tapping a body-region tab expresses selection intent; a valid detail is selected when the region had none.
5. Cardio / mobility can establish a heart-lung default when appropriate.
6. A visibly selected training area must always be saveable.
7. Quick Record, equipment search and Settings open the same editor and save into the same `profile.customEq` store.

## Release build

Every environment executes only:

```text
node build-release.mjs
```

The deterministic sequence is:

```text
prepare-legacy-runtime.mjs
prepare-product-convergence.mjs
prepare-first-paint-shell.mjs
prepare-88-convergence.mjs
build-hardened.mjs
postbuild-kernel-priority.mjs
postbuild-features-hardened.mjs
postbuild-8712-completion.mjs
postbuild-88-canonical.mjs
```

The first eight steps are compiler/convergence stages. Their intermediate files/log language may describe historical topology because they operate on compatibility inputs. **Only the final canonical artifact and `axis-build.json` define production delivery.** The final step removes the old network-loading topology. Provider configuration must never copy this step list; Vercel/EdgeOne/CI call `node build-release.mjs` only.

Long term, compiler inputs that have remained retired across releases should be physically removed. Until then, they are source compatibility material, not production layers.

## Mandatory release gates

A release is incomplete unless the following pass on the same exact source SHA:

- canonical artifact contract: exactly one runtime script and zero dynamic runtime chunks;
- repeated mobile and desktop cold boot;
- first-paint geometry stability;
- Settings ownership diagnostic;
- capture-entry owner and first-frame preference diagnostic;
- completion interaction regression;
- AXIS 8.8 convergence smoke;
- one public 8.8 version presentation;
- one custom-editor owner and valid automatic association/save;
- no raw coordinate leakage;
- no retired first-record copy;
- no transient frame with multiple visible `调整` actions;
- active adjustment sheet visibly opens, has valid geometry, commits once, and then removes its one-time entry;
- current watermark controls are visible/persistent while historical hit targets remain retired;
- current v84 Trends surface renders a real recorded item and axis state while pre-v84 coverage remains hidden;
- current v8710 report deck visibly renders exactly three final cards while base/v877 report surfaces remain hidden;
- no uncaught browser errors;
- iPhone-sized WebKit critical-flow smoke;
- production manifest bound to the exact deployed source commit when hosting protection permits external verification.

The browser smoke explicitly blocks every retired dynamic runtime URL (`axis-enhance-*`, `v8712-runtime.js`, `v8712-completion.js`) and requires the full product to become ready anyway. Any future reintroduction of staged runtime loading is therefore release-blocking.

## Platform protection is outside product runtime

Vercel Authentication / Security Checkpoint occurs before AXIS code executes. It must not be confused with a product loading failure. Production intended for ordinary users should not depend on a Vercel login challenge. Hosting protection configuration is verified separately from the AXIS runtime contract.

## Rule for future work

Do not repair a visible defect by adding another observer, delayed cleaner, duplicate click handler, version painter, or optional layer.

For every replacement:

1. identify the current owner and its chronological relationship to historical implementations;
2. move the capability to the intended owner;
3. retire the old writer/surface in the same change;
4. add an executable invariant that catches both final and transient failure states;
5. test real visibility/geometry for UI surfaces instead of trusting only classes or DOM existence;
6. update `release-contract.json` when runtime/release metadata changes;
7. update this document when ownership changes.

When a future conversation has no historical context, start with this file, then read `release-contract.json`, `docs/RUNTIME_CONTRACT.md`, `build-release.mjs`, `postbuild-88-canonical.mjs`, and the active browser gates.
