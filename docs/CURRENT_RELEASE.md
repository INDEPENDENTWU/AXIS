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
| Custom exercise persistence / open / delete | `app.js` | One data transaction and one editor entry. |
| Custom exercise professional UI | `v874-professional.js` | Sole subtype / detailed-muscle inference and selection owner. |
| Custom search | `v873-smart-input.js` | Search/ranking only; it hands data to the editor and never writes editor truth. |
| Recording draft / sets | `v61.js` | Single strength draft and save owner through `window.__AXIS_RECORDING__`. |
| Active-session adjustment | canonical `#v87AdjustBtn` path | Exactly one visible semantic adjustment action at every rendered frame. |
| Watermark location | precise resolver internally; concise Chinese place externally | Coordinates may be stored for geocoding but never appear in normal UI or final watermark text. |
| Settings custom list | `app.js` + canonical editor | Settings never creates a second custom editor. |
| Runtime packaging | `postbuild-88-canonical.mjs` | Historical build layers are flattened into one production runtime. |
| Release metadata | `release-contract.json` | CI and deployment verification read the same contract. |

## Retired ownership

8.8 convergence removes or neutralizes the following writers before the canonical runtime is emitted:

- `v873-smart-input.js` custom-editor type/muscle writer;
- `v876-runtime.js` custom draft, inference and save patcher;
- `v8712-runtime.js` duplicate custom-editor ownership;
- raw coordinate presentation in watermark UI / media output;
- first-record filler copy `记得多少就记多少`;
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

The first eight steps are compiler/convergence stages. The final step owns the browser artifact and removes the old network-loading topology. Provider configuration must never copy this step list; Vercel/EdgeOne/CI call `node build-release.mjs` only.

Long term, compiler inputs that have remained retired across releases should be physically removed. Until then, they are source compatibility material, not production layers.

## Mandatory release gates

A release is incomplete unless the following pass:

- canonical artifact contract: exactly one runtime script and zero dynamic runtime chunks;
- repeated mobile and desktop cold boot;
- first-paint geometry stability;
- Settings ownership diagnostic;
- completion interaction regression;
- AXIS 8.8 convergence smoke;
- one public 8.8 version presentation;
- one custom-editor owner and valid automatic association/save;
- no raw coordinate leakage;
- no retired first-record copy;
- no transient frame with multiple visible `调整` actions;
- no uncaught browser errors;
- production manifest bound to the exact deployed source commit when hosting protection permits external verification.

The browser smoke explicitly blocks every retired dynamic runtime URL (`axis-enhance-*`, `v8712-runtime.js`, `v8712-completion.js`) and requires the full product to become ready anyway. Any future reintroduction of staged runtime loading is therefore release-blocking.

## Platform protection is outside product runtime

Vercel Authentication / Security Checkpoint occurs before AXIS code executes. It must not be confused with a product loading failure. Production intended for ordinary users should not depend on a Vercel login challenge. Hosting protection configuration is verified separately from the AXIS runtime contract.

## Rule for future work

Do not repair a visible defect by adding another observer, delayed cleaner, duplicate click handler, version painter, or optional layer.

For every replacement:

1. identify the current owner;
2. move the capability to the intended owner;
3. retire the old writer in the same change;
4. add an executable invariant that catches both final and transient failure states;
5. update `release-contract.json` when runtime/release metadata changes;
6. update this document when ownership changes.

When a future conversation has no historical context, start with this file, then read `release-contract.json`, `docs/RUNTIME_CONTRACT.md`, `build-release.mjs`, `postbuild-88-canonical.mjs`, and the active browser gates.
