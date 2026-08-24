# AXIS retirement registry

Human-readable companion to [`../governance/retirements.json`](../governance/retirements.json).

A retirement means an old surface, writer, or orchestration path may no longer define current product/project truth. Physical deletion still requires replacement/equivalence evidence where executable behavior is involved.

## Sealed product/authority retirements

| Historical behavior | Current status | Current truth |
| --- | --- | --- |
| Visible `keepClip` / “保留现场视频” pseudo-setting | retired | Explicit canonical video is retained; compatibility hook may remain hidden only. |
| “单张 / 3秒 / 5秒” default-mode controller | retired as authority | Canonical Capture is Photo / Scan / Video; 3秒 / 5秒 are Scan sampling duration only. |
| v876 independent Capture preference writer | compatibility-only | It may delegate to app-owned preference state; it may not own visible UI/persistence. |
| 15/20fps or forced-720p recording path | retired | 8.18 sealed 30fps canvas compositor/source-first media contract. |
| Version-like filenames as current authority | retired governance model | Read machine governance/current contracts instead. |
| Archived/history content as executable authority | forbidden | Archive/history is provenance-only unless explicitly promoted through a reviewed owner handoff. |

## Sealed CI retirements

### Current Release · 8.14 → 8.18

Seven automatic workflows were replaced by `AXIS Current Release Gate` + `axis-current-release-contract.mjs`.

Evidence:
- replacement run `32630099680` — Chromium + WebKit **success**;
- post-retirement run `32630367047` — Chromium + WebKit **success**;
- repository/retirement guard `32630367007` — **success**.

### Runtime Foundation · 8.13

Four Runtime Core / Shadow Runtime / Live Route / Settings workflows were replaced by `AXIS Runtime Foundation Gate` + `axis-runtime-foundation-contract.mjs`.

Evidence:
- replacement run `32630563608` — pure-runtime-parity + Chromium + WebKit **success**;
- post-retirement run `32630723007` — all three jobs **success**;
- repository/11-workflow resurrection guard `32630723051` — **success**.

### Deep Compatibility · 8.8 → 8.12.5

Nine automatic compatibility workflows are retired in favor of `AXIS Deep Compatibility Gate` + `axis-deep-compatibility-contract.mjs`:

- `axis-812-field-hardening-gate.yml`;
- `axis-8121-hotfix-gate.yml`;
- `axis-8122-settings-gate.yml`;
- `axis-8123-field-polish-gate.yml`;
- `axis-8123-learning-simplify-gate.yml`;
- `axis-89-gate.yml`;
- `axis-88-reminder-layout-gate.yml`;
- `axis-home-transition-gate.yml`;
- `axis-8124-flow-gate.yml`.

The replacement preserves legacy storage identities, reminder/Home behavior, 8.9→8.10.3 learning/detail/home/voice, 8.12 field/Group Plan/Settings, Personal Equipment/gallery/picker/history/geometry, simplified local-only Learning, and 8.12.4/8.12.5 flow/catalog/smart-create behavior.

Replacement evidence:
- exact candidate `a879d30c2cf6e0b3eb2e0fed91a48f3b62262da0`;
- Deep Compatibility run `32631072695`;
- static compatibility — **success**;
- Chromium compatibility — **success**;
- iPhone-like WebKit compatibility — **success**;
- all grouped inherited browser smokes — **success**;
- `main` required status checks — **0**.

The earlier replacement attempt `32630933984` failed only because the new Chromium harness installed `playwright-core` while the existing reminder smoke imports full `playwright`; the harness dependency was corrected without changing product code, assertions or timeouts.

`scripts/axis-ci-convergence-contract.mjs` now prohibits all **20** retired workflow files from returning and requires all three replacement families to remain present.

## Physical deletion gate

Before deleting or moving executable product/build history, prove all applicable items:

- old behavior has a current owner or no replacement is required;
- no required build/runtime/generated-source dependency remains;
- existing LocalStorage/IndexedDB/custom-object data stays readable;
- current semantic contract covers the behavior rather than an obsolete implementation shape;
- Chromium passes for affected user paths;
- iPhone-like WebKit passes for affected user paths;
- canonical runtime topology remains one runtime with no competing owner/store;
- release artifact remains deterministic.

CI orchestration may be deleted when equivalent or stronger current assertions and engine coverage are demonstrated on one exact candidate and no external required-check constraint depends on the retired name.

## Regression philosophy

Preserve old **product promises**, not old implementation shapes.

Prefer “5-second Scan sampling persists and is used” over “an 8.7.6 selector/key/button still exists.” If an old selector remains strictly for compatibility, test that it cannot regain authority.
