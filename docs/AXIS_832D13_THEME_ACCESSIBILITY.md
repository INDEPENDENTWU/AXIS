# AXIS 8.32d-13 — Theme Contract & Accessible Object Entry

Product: 8.32 PLAY THIS candidate / PR #174. Release status: NO-GO. Certified Production remains 8.31.

## Executed product improvement

The existing Object picker has a labelled modal dialog with localized names for zh-Hans, zh-Hant and English. The underlying picker, Recorder and Encounter factual owners are unchanged.

- Opening Object picker focuses a heading, not the search field: mobile software keyboard is not forced open.
- Each open refreshes localized accessible names for search and close control.
- Escape closes the original picker and restores focus to the originating control.
- Clicking its existing Close button also restores origin focus, after the original close event (a microtask ordering defect was reproduced and fixed).
- Tab and Shift+Tab are kept within the visible dialog without installing a global focus owner in unrelated sheets.
- Keyboard Enter on the canonical chest-row Object still opens exactly one original Recorder, dismisses the picker, focuses the Recorder and does not create an Encounter, FlowRun or any axis_832-specific persistent namespace.

The d13 browser smoke exercises real Chromium and WebKit at all three supported locales: six complete dialog/keyboard/reentry/Recorder cycles. It is integrated with the existing exact-head local gate. This is browser keyboard and DOM evidence, NOT real VoiceOver or TalkBack certification.

## Theme contract disposition

The normative docs/LOCALIZATION_AND_THEME.md specifies System, Light and Dark presentation modes. The assembled product remains dark-only, as confirmed by the d12 12-case cold first-paint matrix. Stable dark paint under emulated OS light/dark does NOT mean the Light theme exists.

We will not ship a global CSS inversion, an inert Light toggle, or an inconsistent screen-specific light patch. The assembled product includes hard-coded colors and overlays across Home, Object, Recorder, Active, History, Settings and many inherited modules. A real Light theme requires a semantic color-token foundation and reviewed surface, text, action, status, media, overlay and first-paint behavior, as well as interactive keyboard and contrast tests in three locales. The original product requirement is still unresolved; no implicit acceptance waiver is issued.

## Remaining product release gates

14 P01–P20 scenarios are verified in bounded automated scope, and six remain Partial: P11, P12, P15, P16, P17 and P20. D13 specifically improves the Object picker slice of P16, not a product-wide assistive-technology signoff.

Requires actual supported iOS and Android hardware evidence for VoiceOver, TalkBack, system text zoom, gesture replay, background/foreground, optical screenshot review, and low-end device tail performance with an explicit acceptable budget. The product-level System/Light/Dark decision and genuine implementation/approval remain release-blocking.

Before any release: all blockers resolved, exact PR Head CI green (no skipped checks counted), SHA-leased merge to main, merged-main Vercel and EdgeOne and official-domain verification including data continuity, then independent 8.32 Governance Seal. PR stays Draft and public AXIS stays 8.31 until these facts are proved.
