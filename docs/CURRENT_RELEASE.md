# AXIS — Current Release Contract

## Public release

**8.8**

This file is the entry point for future AXIS work. Do not reconstruct the current product architecture by reading historical version files in numerical order.

Historical `v8xx*.js` filenames are implementation history, not product-version truth. The public release is owned by the first-paint shell and its `data-axis-public-label`. The stable 8.7.11 implementation remains available internally as a fail-open baseline, but it must never repaint an older public version.

## Canonical release metadata

[`release-contract.json`](../release-contract.json) is the single machine-readable release contract shared by the release builder and production deployment gate. It owns the public version, stable fallback version, runtime architecture, feature/completion kernel names, stable chunk count, build command, and generated build-manifest name.

Do not copy those values into deployment gates or provider configuration. `build-release.mjs` must fail when the generated `axis-build.json` disagrees with `release-contract.json`, and the production gate must read the same contract from the exact deployed commit.

## 8.8 ownership map

| Product surface | Canonical owner | Contract |
|---|---|---|
| Public version / top-level shell | first-paint shell | Final chrome exists before hydration. Runtime state cannot visibly replace it. |
| Custom exercise persistence / open / delete | `app.js` | One canonical data transaction and one canonical editor entry. |
| Custom exercise professional UI | `v874-professional.js` | The only code allowed to infer/select subtype and detailed muscles in the custom editor. |
| Custom search | `v873-smart-input.js` | Search/ranking only. It may hand a name into the canonical editor; it may not write editor type/muscle state. |
| Recording draft / sets | `v61.js` | Single recording owner, exposed through `window.__AXIS_RECORDING__`. |
| Active-session adjustment | canonical postbuild `#v87AdjustBtn` | Exactly one visible adjustment action at every rendered frame. |
| Watermark location | precise resolver internally; concise Chinese presentation externally | Lat/lon/accuracy may be stored for reverse geocoding but must not appear in normal product UI or watermark output. |
| Settings custom list | `app.js` list + canonical editor | The list is editable; it must never create a second Settings-only editor. |
| Release build sequence | `build-release.mjs` | CI, Vercel and EdgeOne execute the same deterministic release pipeline. Platform config files must not duplicate the step list. |
| Release metadata | `release-contract.json` | Build and deployment verification read the same version/architecture contract. |

## Retired ownership in 8.8

The 8.8 build-time convergence explicitly removes these historical writers before bundling:

- `v873-smart-input.js` custom-editor mode labels / type-muscle writer;
- `v876-runtime.js` custom draft, custom inference and custom save patcher;
- `v8712-runtime.js` custom detail toggler / hidden-muscle synchronizer / save patcher;
- raw coordinate presentation in watermark Settings / preview output;
- the first-record instructional copy `记得多少就记多少`.

These historical files may still contain other valid capabilities. Retirement is exact and build-signature checked; do not re-enable an entire old module to restore one feature.

## Custom exercise behavior

The user should not need to understand the internal classification model.

1. Typing a recognizable exercise name automatically infers subtype and detailed muscles through the v874 owner.
2. Automatic associations immediately synchronize into the canonical hidden persistence fields in `app.js`.
3. The user can add or remove detailed muscles after inference. Manual additions extend the inferred result instead of silently replacing it.
4. Tapping a body-region tab is itself an expression of intent. If that region has no selected detail, its first whole-region detail is selected automatically.
5. Cardio / mobility classification can establish a heart-lung default when no muscle detail exists.
6. Saving must never reject a selection that the user can visibly see as selected.
7. New and edit actions from Quick Record, equipment search, and Settings all open the same editor and save to the same `profile.customEq` data.

## Release build

Every environment must run exactly:

```text
node build-release.mjs
```

`build-release.mjs` is the single source of truth for release-step order. For 8.8 it executes:

```text
prepare-legacy-runtime.mjs
prepare-product-convergence.mjs
prepare-first-paint-shell.mjs
prepare-88-convergence.mjs
build-hardened.mjs
postbuild-kernel-priority.mjs
postbuild-features-hardened.mjs
postbuild-8712-completion.mjs
```

After those deterministic steps, `build-release.mjs` validates the generated build manifest against `release-contract.json`. A version, fallback, architecture, feature-kernel, completion-kernel, or stable-chunk mismatch is release-blocking.

Do not copy the step chain into `vercel.json`, `edgeone.json`, CI YAML, or future platform configs. Provider configs should only call `node build-release.mjs`. Duplicated command chains and duplicated version constants create configuration drift.

`prepare-88-convergence.mjs` is not a new client runtime layer. It is a build-time compiler/convergence step that removes duplicate historical owners and fails the build if the expected source signatures change.

The generated `axis-88-contract.json` records the 8.8 UI ownership map in the built artifact. This is separate from the source-level `release-contract.json`, which owns release metadata across build and deployment.

## Mandatory gates before release

A release is not complete unless all of these pass in a real browser build:

- repeated mobile / desktop cold boot;
- first-paint geometry stability;
- Settings ownership diagnostic;
- legacy completion regression suite;
- AXIS 8.8 convergence smoke;
- production deployment verification against the exact deployed commit when the hosting provider accepts the deployment.

The 8.8 smoke specifically verifies:

- one public 8.8 version presentation;
- one custom-editor owner;
- name inference -> canonical muscle fields;
- body-region selection -> valid save;
- Settings list -> same custom editor;
- no raw coordinate leakage;
- no retired first-record copy;
- no frame in which more than one visible `调整` action exists.

## Rule for future iterations

Do not fix a visible conflict by adding another observer, delayed cleaner, duplicate click handler, version-specific painter, or provider-specific release constant.

When a new implementation replaces an old one:

1. identify the current owner;
2. move the capability to the intended owner;
3. retire the old writer in the same change;
4. add or extend a browser invariant that catches the original failure, including transient states where relevant;
5. update `release-contract.json` when release metadata changes;
6. update this file when ownership changes.

If a future conversation lacks historical context, start here, then read `release-contract.json`, `docs/RUNTIME_CONTRACT.md`, `build-release.mjs`, and the current browser gates. Historical chat context is not a dependency of the product architecture.
