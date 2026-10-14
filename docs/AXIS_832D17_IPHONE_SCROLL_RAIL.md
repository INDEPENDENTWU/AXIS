# AXIS 8.32d-17 — iPhone Scroll Rail & Visual Occlusion

## Evidence and user-visible defect

A real iPhone Safari/ChatGPT in-app browser screenshot of the source-matched 8.32 candidate shows a thin line crossing the purple original **拍攝記錄** CTA and large legacy timer numerals visibly bleeding behind the fixed **今天／記錄／趨勢** bar during vertical scroll. The screenshot shows the original Active state; it is not a screenshot of a new Home feature. The previously introduced PLAY THIS capability is entered from the canonical Object picker and Saved Flow, so expecting a prominently redesigned Active dashboard is incorrect.

## Reproduced root cause

On the actual candidate built browser DOM, `#v87Now` Active uses z-index **78** while the fixed original `#dock.captureDock` uses **46**. The fixed `.nav.v82Nav` has z-index **47** but a fully transparent dark background; the lower legacy `#v8Time` can therefore visibly shine through it even though the nav receives hit testing. iOS browser scrolling exposes line painting under/over the CTA. The first CSS trial targeting `#dock.v8-dual` was ineffective because the legacy `html body #dock.captureDock` specificity/order took precedence. A clean rebuild revealed that; no change was accepted based only on source text.

## Corrective surface

The canonical theme bundle `axis-832d14-theme.css` now gives the **existing** camera and quick record dock a stronger, source-correct `html body #dock.captureDock.v8-dual` specificity and z-index **85**, above Active 78 and below modal overlays 100. The existing nav uses z-index **86** and an opaque theme-matched background; Light receives an explicit higher-specificity override to remove a historic 97%-opaque white rail. Both rails use local isolated stacking without changing layout dimensions, controls, event handlers, training fact ownership or routes. Overlay sheets remain above rails.

No new global UI architecture, camera writer or separate Active shell is added.

## Automated acceptance

`scripts/axis-832d17-scroll-rail-browser-smoke.mjs` continuously saves an actual canonical chest-row Encounter through original Object picker and Recorder, then tests real Chromium/WebKit × Dark/Light × 390x755, 390x660 and 430x820 CSS-pixel viewports (12 independent scenarios), with scrolling at top, middle and bottom. It validates both fixed rails' opaque computed pixel colors, paint-order priorities against Active and above/below the appropriate controls and settings sheets, no page horizontal overflow, 64px original capture touch size, fixed bottom positioning, and exact saved Active Encounter ID after opening/closing settings. It produces head-identified JSON evidence and browser screenshots on selected sizes.

This is source-tethered browser emulation. The supplied iPhone screenshot documents the **pre-fix** physical symptom. The new corrected screenshot still needs the user to inspect this source-exact protected Preview on the actual iPhone while scrolling. Do not confuse this automated fix with complete native optical certification.

## Release decision

This is an 8.32 Draft candidate patch only. Do not update `main`, the 8.31 public product, EdgeOne, official domain, or release version while native P11/P12/P15/P16/P17/P20 acceptance remains partial. A clean source-head full local gate, same GitHub Head full CI and exact SHA protected Preview are mandatory before requesting physical retest.
