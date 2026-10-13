# AXIS 8.32d-14 — Semantic Appearance Foundation

## Product contract and source ownership

The existing AXIS Settings surface now exposes three real appearance preferences: System, Light and Dark, using the same original interaction owner. No additional route, Recorder, Active, Flow, Encounter or media storage writer was created. The sole new storage key is a UI preference, axis_ui_theme_v1, independent of the factual training stores.

The appearance mode is computed by an inline early bootstrap in the existing index HTML head before the hashed single stylesheet is loaded, so a stored Light preference does not first render as Dark. The product keeps one external stylesheet bundle and the existing one core script. The bundled axis-832d14-theme.css overrides semantic tokens for background, paper surfaces, nested surfaces, text hierarchy, dividers, accents, successes/failures, inputs, settings, source Object cards, dock, navigation, Recorder and user controls. System preference listens for live OS color-scheme changes. Cross-tab preference updates use the native storage event; first-visit defaults to the established Dark appearance to protect the existing AXIS presentation.

## Implemented controls

Settings uses three 44px-minimum accessible, keyboard-operable segmented buttons with aria-pressed state, translated for zh-Hans, zh-Hant and English. Preferences survive reloads. The OS-selected System palette takes effect without a page reload. The browser theme-color also follows the actual palette.

Core Light colors include background #f6f7fa, surface #ffffff, ink #1c2432, outline #cfd6e2 and accent #384ac8. Dark continues using established #08090b and inherited visuals. Hard-coded inherited settings information, catalog primary buttons, muscle badges, bottom navigation and existing Recorder controls were specifically corrected where browser inspection exposed invalid Light contrast or dark-on-dark mixing. All presentation changes are isolated inside the theme stylesheet.

## Executed browser acceptance

scripts/axis-832d14-theme-browser-smoke.mjs performs Chromium and WebKit × 3 locales × 3 user preferences (18 passes), including first interactive color state, browser chrome theme-color, real settings palette and segmented control state, actual System light/dark change, click preference and persistence after reload, existing native Object catalog and single Recorder handoff, no duplicate fact ownership and preserved one-CSS/one-core-network architecture.

The test is executed inside scripts/axis-832-local-gate.sh after previous d11–d13 checks and before source-scoped completion. An exact clean-worktree 103-step deterministic build, previous real Chromium/WebKit regression suites, and newly added appearance gate must all pass before reporting the source as engineer-ready. GitHub Actions is a separate exact-head gate.

## Release gate remains separate

Browser-emulated appearance validity is not complete physical-device optical certification. It does not by itself certify OS text scaling on actual iPhone/Android, VoiceOver/TalkBack, P95/P99 long-tail device performance, 200% on-device contrast and safe-area inspection, the full inherited screen catalog, or any Production domain/runtime readback.

P17 is no longer blocked by the complete absence of a preference switch, but must remain Partial until reviewed native device/theme cross-product evidence and any uncovered inherited overlay defects are closed. P11/P12/P15/P16/P20 likewise remain partial as documented in docs/AXIS_832D12_FINAL_DEVICE_ACCEPTANCE.md. PR #174 stays Draft, main and certified AXIS 8.31 public production untouched until the exact-Head full CI, all remaining product gates, SHA-leased merge, merged-main EdgeOne/official-domain readbacks, and independent 8.32 Governance Seal are proven.
