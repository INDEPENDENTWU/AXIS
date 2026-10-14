# AXIS 8.32d-16 — Mobile Active Recovery & Release Decision

## Exact release boundary

This is an isolated development-branch acceptance increment for AXIS 8.32 PLAY THIS. It is not a 8.32 Production release. Certified public Product remains AXIS 8.31; main and official domain must not move before final release governance and merged-main verification.

## User-visible corrections

Actual source-backed browser inspection discovered two active training controls not meeting the 44px finger-touch minimum on 320px Mobile: original hold-to-finish button 36px high and Adjust button 32x38px. The finish hint in Light was also an inherited near-white dark palette value, visually weak on paper.

The existing 8.32 semantic stylesheet now sets a 44px floor for the two canonical Active controls in *both* themes and uses the existing Light muted ink color for the original hold-to-finish text. No second Active or Recorder owner, replacement timer, event writer or new training state was introduced. In actual Chromium/WebKit dark and light browser measurements the two controls are 44px high, the Light finish hint ratio is about **6.05:1**, and the Dark finish hint about **9.62:1** against the measured root ground. Contrast values are bounded DOM approximation and do not constitute full WCAG or optical certification.

## Permanent Active lifecycle acceptance

`scripts/axis-832d16-active-browser-smoke.mjs` runs real Chromium and WebKit, Light/Dark and 320/390/430 CSS-pixel mobile widths (12 independent complete journeys), from the actual canonical Object picker through existing Recorder Save to original Active. It asserts exactly one Active session and one canonical Encounter ID, no fabricated extra session and no noncanonical FlowRun; correct 44px Active targets; root overflow and Active-to-bottom-nav clearance; actual original theme switch with unchanged Active evidence; same session and Encounter after full page reload; and a 200% **CSS root font-size** stress without root horizontal overflow or missing Active controls. It captures one browser screenshot per theme per engine at 390px and writes a JSON evidence report.

**Limitations:** `font-size:200%` is a DOM/rem stress heuristic, NOT equivalent to iOS Dynamic Type, Android font scaling, WebKit's accessibility text scaling, VoiceOver, TalkBack, physical safe-area insets, native hardware suspend/resume or low-end physical-device tail latency. Headless browser screenshots are not automatically human optical reviews.

This test is part of `scripts/axis-832-local-gate.sh`, preserving all previous d11–d15 tests and full 103-step build. GitHub exact PR Head workflow success is a separate certificate.

## Production and version decision

8.32 Production is **NO-GO** while P11/P12/P15/P16/P17/P20 hardware and accessibility evidence remains partial, including live actual device optical Active + all other inherited screens, 200% OS text zoom, actual VoiceOver/TalkBack, background/resume and genuinely low-end P95/P99 performance. A historical ~4.6 second WebKit tail sample requires a real supported-device budget and review, not a claim that four emulated CPU samples resolved it.

No silent scope waiver is assumed from permission to deploy **when appropriate**. Do not mark version 8.32 released or change the official alias until those gates, an exact PR Head all-green result, protected SHA-leased merge, independent merged-main Vercel/EdgeOne/official-domain/user-data readbacks, and a new independent 8.32 Governance Seal exist.

**Next exact release step:** obtain real device-cloud or physical iOS + Android access and source-attributed reports, resolve any findings, complete the release matrix and only then perform release version decision plus Production cutover. The new appearance and Active controls remain safely testable on the Draft branch.
