# AXIS 8.32d-15 — Theme Screens & Contrast Acceptance

## Actual product correction

The original 8.32d-14 Light theme had a verifiable Recorder accessibility regression: muscle-tag foreground rgb(196,200,255) on white measured 1.61:1. The source Light theme now scopes correct paper/ink treatment to the original Recorder tags and adjusts the low-contrast muted text token, without altering training-state or any fact writer. Tested Light muscle labels: 7.95:1. Tested Light clock: 5.50:1. Original Dark labels: 11.92:1; Dark clock: 4.72:1. These are browser-computed solid-background estimates of named elements, not a full WCAG certificate.

## Reproducible actual-browser acceptance

`scripts/axis-832d15-screen-browser-smoke.mjs` is in the canonical local release gate for both Chromium and WebKit. It runs Light/Dark × 320/390/430px widths on each engine (12 sequences), genuine Home → History → Settings → original Object picker → original Recorder navigation, root overflow checks on all five screens, min 44px original CTA, exactly one original Recorder, and contrast assertions for the Light Recorder muscle text and clock. Screen captures at 390px (five surfaces per theme per browser, 20 screenshots) and structured per-run evidence are kept in the local report. zh-CN, zh-TW and en-US locales rotate by width. Browser simulation and generated screenshots do not constitute a physical iPhone/Android VoiceOver/TalkBack, human optical, or complete product WCAG certificate.

## Release governance

This phase closes a real Light readability defect and adds permanent 5-screen checks. Existing historical Active continuity suites still run, but d15's five-screen sweep does NOT independently sign off Active on native devices. P11/P12/P15/P16/P17/P20 physical-device, dynamic-type/safe-area/reader and low-end long-tail release obligations remain partial. PR #174 stays Draft until the exact-head CI, real-device review, protected merge, merged-main Vercel/EdgeOne/domain readbacks and independent 8.32 Governance Seal all pass. Public AXIS 8.31 stays untouched.
