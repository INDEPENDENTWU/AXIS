# AXIS retirement registry

Human-readable companion to [`../governance/retirements.json`](../governance/retirements.json).

A retirement means an old surface or writer may no longer define current product truth. It does **not** automatically mean the source file can be deleted today.

## Sealed retirements / authority restrictions

| Historical behavior | Current status | Current truth |
| --- | --- | --- |
| Visible `keepClip` / “保留现场视频” pseudo-setting | retired | Explicit canonical video is retained; the compatibility hook may remain hidden only. |
| “单张 / 3秒 / 5秒” default-mode controller | retired as authority | Canonical Capture is Photo / Scan / Video; 3秒 / 5秒 are Scan sampling duration only. |
| v876 independent Capture preference writer | compatibility-only | It may delegate to app-owned current preference state; it may not own visible UI or persistence. |
| 15/20fps or forced-720p recording path | retired | 8.18 sealed 30fps canvas compositor/source-first media contract. |
| Version-like filenames as current authority | retired governance model | Read machine governance/current contracts instead. |
| Archived/history content as executable authority | forbidden | Archive/history is provenance-only unless explicitly promoted through a reviewed owner handoff. |

## Physical deletion gate

Before deleting or moving executable history out of the active source graph, prove all applicable items:

- the old behavior has a current owner or no replacement is required;
- no required build/runtime import or generated-source dependency remains;
- existing LocalStorage/IndexedDB/custom-object data stays readable;
- the current product contract covers the behavior rather than an obsolete implementation detail;
- Chromium passes for affected user paths;
- iPhone-like WebKit passes for affected user paths;
- canonical runtime topology remains one runtime with no new owner/store;
- the release artifact remains deterministic.

## Regression philosophy

Preserve old **product promises**, not old implementation shapes.

A current regression test should prefer “5-second Scan sampling persists and is used” over “an 8.7.6 selector/key/button still exists.” If an old selector is retained strictly for compatibility, test that it cannot regain authority.
