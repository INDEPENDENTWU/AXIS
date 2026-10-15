# AXIS 8.32d-2 — Local execution performance & rapid-tap evidence

Product candidate: `70c3435ccf958b33ac5f13ddca11787fb4f96a55` (PR #174, Draft). Measured 2026-10-13 in an isolated Ubuntu 26.04 Vercel Sandbox with Playwright 1.64.0, headless Chromium 156.0.8078.4 and WebKit 27.2, 390 × 844 CSS viewport / DPR 2, zh-CN locale, reduced motion and local HTTP server.

**Evidence scope:** real browser user input to interactive existing Object Recorder; actual Home Flow pointer double-click; preserved canonical FlowRun across active reload; no new write owner. `scripts/axis-832d-timing-browser-smoke.mjs` persists raw JSON for every engine, including product SHA, browser version, navigation entries, actual viewport, theme/locale, action count, HTML overflow, supported layout-shift and timing. Re-run through `scripts/axis-832-local-gate.sh`, without GitHub Actions.

## Local observed timings (milliseconds)

Three independent browser runs per engine, same product candidate, not a population benchmark:

| Action | Chromium samples | Chromium median | WebKit samples | WebKit median |
| --- | --- | ---: | --- | ---: |
| cold boot to canonical interactive | 524.1 / 428.5 / 530.1 | 524.1 | 810.7 / 819.7 / 786.1 | 810.7 |
| one Object click to interactive Recorder, with focus transferred | 277.8 / 235.6 / 247.6 | 247.6 | 626.8 / 614.6 / 634.9 | 626.8 |
| actual Home Flow pointer double-click, accepted canonical run | 146.7 / 157.3 / 138.4 | 146.7 | 348.5 / 357.2 / 315.1 | 348.5 |
| warm reload during active Flow; canonical run preserved | 330.5 / 386.1 / 341.2 | 341.2 | 474.5 / 461.3 / 372.7 | 461.3 |

A separate **first** WebKit sample reported **4,616 ms** Object-to-Recorder, while the next three repeated WebKit samples were 614.6–634.9 ms. This outlier is a **remaining investigation item**, not silently discarded or a claim of universal stability. The local sandbox may have resource contention and the sample size is small; no Production network, iPhone hardware or low-end device latency has been measured.

## Truth, limitations and exit gates

- P11: a real `page.mouse.dblclick` generates two browser pointer activations, without duplicate canonical Encounter. This is **partial coverage**, not exhaustive long-press, touch race or double-record confirmation.
- P12: warm reload retains the **same** active FlowRun ID and status. Pending-command replay under cross-tab concurrency remains a distinct scenario.
- P20: every run records actual input-to-owner and navigation timing, one/two deliberate actions, viewport, browser, locale and theme details, source SHA, horizontal overflow and optional layout-shift.
- Chromium implements the Layout Shift browser entry and records a nonnegative observed value. WebKit 27.2 did not advertise it: JSON stores `shift: null`, `shiftSupported: false`. A missing metric is **not zero**.
- No budget was invented from one device profile. Do not interpret these numbers as Production SLA, web vitals certification, human visual approval or an approved 8.32 Governance Seal.
- The local gate verifies JSON presence, matching exact head/engine, factual durations, 390px viewport, selected canonical Object, visible Flow owner and preserved Run ID. This test runs for each selected browser **without GitHub Actions**.

Remaining Production blockers: full P01–P20 acceptance matrix, optical light/dark/theme and locale review, all font scaling/focus/assistive-technology checks, original Recorder's complete offline confirmation UI, pinned WebKit 1.55 compatibility or explicitly reviewed exception, precise main-merged provider/EdgeOne/official domain readbacks and independent 8.32 governance seal. No new Preview deployments permitted; 8.31 Production remains untouched.
