# AXIS 8.32d-6 — Genuine Mobile Double-Tap & Pinned WebKit Compatibility Evidence

Candidate product source: `f43a51605719cbb33b3877a1e9f4ab4d497711c4`, PR #174 Draft, public Production still 8.31. All tests below used a clean 103-step canonical build, **not** a hosted Preview.

## P11 actual touchscreen double activation

`scripts/axis-832d6-touch-repeat-browser-smoke.mjs` performs two real Playwright `page.touchscreen.tap(x,y)` actions on the visible `chest-row` Object CTA at 360 × 780 CSS pixels, not `mouse.dblclick` and not direct API invocation. Tests assert the action has at least a 44 × 44px target, the original Recorder opens, the Object picker closes, only one app-owned Recorder and one capture owner exist, exact Object identity remains, neither FlowRun nor canonical Encounter list changes across taps, and cancel remains pure.

Observed first-to-second touch start spacing: Chromium 1.64 / engine 156.0.8078.4: **111 ms**; WebKit 1.64 / engine 27.2: **66 ms**; additional fixed Playwright **1.55 WebKit 26.0**: **335 ms**. These are factual sandbox samples, not population percentiles. All three passed, and the two currently supported-engine tests are integrated into the no-Actions exact-head local gate. P11 gains real mobile double-tap evidence; full long-press and device-level/accessibility matrix remain separate review items.

## Pinned WebKit 1.55 investigation

Installed exact `playwright@1.55.0` and its corresponding WebKit 26.0 browser. The available cloud sandbox runs Ubuntu 26.04, **not a natively supported 24.04 image**. The browser did not launch initially owing to missing historical libraries. In a separate temporary test-only filesystem, Ubuntu 24 packages including `libicu74`, `libxml2` and `libvpx9` were extracted and supplied via a compatibility library path, and the test process set `PLAYWRIGHT_SKIP_VALIDATE_HOST_REQUIREMENTS=1`. No vendored binary, system dependency or bypass is part of AXIS source, release product, or customer runtime.

This enabled the *actual pinned WebKit browser* to launch and exercise all nine historical/new 8.32 browser suites on the exact candidate source. **Eight of nine suites passed on the first run.** The only first-run failure was a 4,500ms wait in the historical 8.8.2 synthetic touch `pointerdown/pointerup` long-press finish; its earlier rest-state and single-owner assertions had already passed. Re-execution of the *unchanged same historical test* twice subsequently passed, including the long-press assertion. The newly added genuine touchscreen double tap additionally passed on WebKit 1.55.

These facts show a substantial fixed-version compatibility improvement, **not a completely stable pinned WebKit 1.55 seal**: (a) historical synthetic long press was intermittent, (b) the host remains Ubuntu 26 plus extracted compatibility libs rather than true Ubuntu 24, and (c) no full 9/9 uninterrupted clean first-run certificate was obtained. Do not silently elevate these results to a full gate pass. The correct final blocker is a reproducible native supported-OS pinned WebKit execution (or an explicitly reviewed substitute) and investigation of the historical finish race.

## Release gate and ownership

The new P11 test is a permanent appended real browser regression, protected by `scripts/axis-832-play-this-contract.mjs` and invoked once per Chromium/WebKit in `scripts/axis-832-local-gate.sh`. The **new exact GitHub Head must be independently rerun after this test/docs-only commit**. Expected expanded gate: ten browser suites per engine. No new source authority, storage, AI/network behavior, build definition or runtime feature was introduced in this increment. P01–P20 complete release seal, full optical/assistive-technology approvals, low-end/long-tail performance review, merged-main provider/domain verification and separate Governance Seal remain required. EdgeOne direct Production fallback is prepared but gated; no actual official Production deployment has occurred.
