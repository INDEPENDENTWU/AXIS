# AXIS 8.32d-7 — Catalog Visual Legibility and Keyboard/Locale Acceptance

Candidate baseline `ebc0bbc0159818590a17f520ee7ea93483062088` · PR #174 Draft · Production 8.31 unchanged. This increment repairs a **real screenshot-visible mobile UX defect**, not a speculative redesign.

## Before: geometric pass was insufficient

Original visual automation tested the CTA's bounds and viewport overflow, but failed to inspect the **legacy v8710 catalog guidance**. The catalog's `.v8710GuideHead` had `height:32px` with up to 30px UI text; the guide text and dynamic result count wrapped out of that fixed block into the following Object cards. The catalog title selector used `white-space:nowrap`, truncating most Object names. Under 320px viewport / increased text input, this created conspicuous overlapping labels and multi-column cards hard to read, despite the CTA itself measuring at least 44px.

Original screenshots were opened and inspected for 320px simplified Chinese and 390px English. The issue was observable in both; automated bounds were not sufficient. The corresponding genuine screen-level defect has been addressed in the existing 8.32 presentation CSS, preserving the single original catalog and Recorder owner.

## Product correction

- Guide headline now uses a **content-driven minimum height**, with wrapping and real spacing above cards.
- Catalog Object title may wrap into **two lines**; subtitle also wraps, and narrow 320px UI uses a single-column card list.
- Existing 8.32 catalog renderer provides localized **guide headline and result-count copy** for English and Traditional Chinese; Simplified Chinese remains inherited. The underlying canonical Object names and original app-wide locale coverage are **not claimed fully translated**.
- Existing quick capture, Flow and Active authorities are unchanged. No persistence, API, runtime semantic or network owner was introduced.

## Browser proof

New `scripts/axis-832d7-a11y-browser-smoke.mjs`, run against the **clean complete 103-step patched build**, exercises Chromium and WebKit Playwright 1.64. Each browser passed **14 UI cycles** across 320/360/390/430/1280 CSS widths, normal and increased UI text input (`--axis-ui:15px` → `30px`), and three 390px locale variants (zh-Hans, zh-Hant, en). Each pass verifies:

- CTA touch target at least 44px in each dimension, no horizontal or vertical clipping, no page overflow and the pointer hit-test reaches the visible CTA.
- **Guide bottom never overlaps Object cards**, and item titles do not use a fixed no-wrap rule.
- Correct localized visible CTA and accessible name. English/Traditional guide text and search-result count are also verified.
- Browser's reduced-motion preference is acknowledged.
- Keyboard `Tab` reaches the visible CTA with `:focus-visible` within 40 sequential key presses starting from the search field.
- Computed foreground/background text contrast **9.14:1**, above 4.5:1 for the tested CTA colors, in both engines.
- Browser errors absent, 8 factual screenshots per engine (16 total) saved.

The final 320px increased-text and 390px English increased-text screenshots were opened and visually inspected: text no longer overlays the first card, card titles are more legible, and hierarchy is consistent with AXIS dark presentation. **Remaining limitation:** 16 screenshots were captured, but only these representative images received explicit human visual review; not a complete screen-reader or OS text zoom certificate. The UI-variable stress case is **not equivalent to 200% browser zoom**: actual CTA font clamps near 20px.

## Governance

This increment adds a permanent 8.32d7 browser suite and exact-head JSON/screenshot assertions to `scripts/axis-832-local-gate.sh`; the source contract requires both the test and product presentation fix. On the patched detached source checkout, Chromium and WebKit both passed all 14 cycles and the 103-step release build. **This new GitHub commit still requires its own exact-head end-to-end local gate**.

P15 becomes stronger for measured + visually reviewed sample; P16 gains keyboard tab/focus and contrast proof; P17 gains guide headline/count locale proof. All three remain **Partial** for comprehensive optical/assistive-tech/app-wide locale coverage. The pinned WebKit 1.55 legacy long-press intermittent failure, performance long-tail, complete P01–P20 signoff, EdgeOne/official-domain Production acceptance and independent 8.32 governance seal are still open. No Preview, Production or main merge is performed.
