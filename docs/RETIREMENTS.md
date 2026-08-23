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

## Sealed CI retirement — 8.14 → 8.18 workflow fanout

The following seven automatic workflow files are retired and physically deleted:

- `axis-814-evolution-object-gate.yml`;
- `axis-815-media-evidence-gate.yml`;
- `axis-8151-regression-seal-gate.yml`;
- `axis-816-capture-evidence-gate.yml`;
- `axis-817-interaction-gate.yml`;
- `axis-8171-source-media-gate.yml`;
- `axis-818-object-focus-gate.yml`.

Replacement:

- `.github/workflows/axis-current-release-gate.yml`;
- `scripts/axis-current-release-contract.mjs`.

Evidence:

- candidate `53ba6909b1aed95ae634e1b3bd6429ffe80c2a59`;
- Current Release Gate run `32630099680`;
- Chromium — **success**;
- iPhone-like WebKit — **success**;
- every inherited 8.14→8.18 semantic contract and browser smoke included in the replacement;
- `main` required status checks — **0**.

This retirement applies to duplicated **CI orchestration**, not to historical source/compiler/data contracts. A historical source file remains until its own reachability/data-compatibility proof exists.

`scripts/axis-ci-convergence-contract.mjs` prevents these workflow files from returning and requires the current replacement coverage to remain present.

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
