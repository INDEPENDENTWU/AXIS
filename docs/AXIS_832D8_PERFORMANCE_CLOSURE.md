# AXIS 8.32d-8 — P20 Repeatable Browser Latency & Shift Attribution

Candidate product source `856726812bd915724002c128c90fb1e957b6568c`. Isolated canonical 103-step builder and prebuilt EdgeOne artifact verification passed. The exact product bytes were measured with six **independent Chromium** and six **independent WebKit** Playwright 1.64 runs in one local sandbox; one fresh browser context per run, 390×844 CSS viewport, simulated local AI-disabled API routes. This is not field telemetry, a low-end physical-device benchmark, or a Production latency guarantee.

## Raw-sample summary (milliseconds)

| Engine / action | Six observed elapsed values | Median | Max |
| --- | --- | ---: | ---: |
| Chromium · cold boot | 372.3, 337.0, 361.0, 325.2, 340.3, 348.2 | 344.2 | 372.3 |
| Chromium · Object → Recorder | 163.1, 153.9, 163.8, 163.9, 151.6, 178.7 | 163.4 | 178.7 |
| Chromium · Flow double action | 136.4, 134.4, 134.9, 138.0, 128.6, 141.5 | 135.7 | 141.5 |
| Chromium · warm Active reload | 253.5, 225.2, 246.0, 238.8, 231.9, 243.0 | 240.9 | 253.5 |
| WebKit · cold boot | 622.6, 627.9, 613.0, 647.3, 599.6, 685.0 | 625.2 | 685.0 |
| WebKit · Object → Recorder | 405.8, 410.6, 455.1, 466.9, 438.2, 452.8 | 445.5 | 466.9 |
| WebKit · Flow double action | 268.4, 282.8, 285.8, 266.2, 279.9, 283.6 | 281.4 | 285.8 |
| WebKit · warm Active reload | 350.2, 338.8, 337.7, 310.1, 333.2, 363.4 | 338.2 | 363.4 |

All twelve measurement runs passed the factual original Recorder/FlowRun owner and identity assertions; no 4.6s extreme delay reoccurred in this sample. **Six rounds do not disprove the earlier real 4.6s WebKit observation**, and no low-end, real-network or Production tail latency seal is claimed.

## Separating cumulative search shift from actual Recorder handoff

The previous P20 report presented Chromium's cumulative Layout Shift value `0.1295` in the Object entry section, but it **included events preceding the Object CTA**. A dedicated Chromium PerformanceObserver trace identified the precise previous-to-current rectangle of `#v8710Explore`: its position changed from y≈236px to y≈405px when the test's programmatic `#eqSearch.fill('胸托划船')` repopulated and scrolled the search results. That event timestamp precedes Object CTA activation; the browser marks the synthetic fill-triggered event `hadRecentInput=false`, so the cumulative Web Vitals-style number would misleadingly implicate the button.

Corrective measurement: the permanent `scripts/axis-832d-timing-browser-smoke.mjs` now takes a **pre-tap visual snapshot** and a **post-tap visual snapshot**, separately reporting `layoutShiftBeforeTap` (cumulative) and `layoutShiftAddedDuringHandoff` (delta). It still reports raw cumulative layout shift. If supported, the independent button-to-Recorder shift must be at most 0.05; unsupported browsers return `null`, **never a fabricated zero**. A real rerun on the patched test source passed:

- Chromium: before-tap cumulative `0.1295`; additional Object → Recorder shift **`0`**.
- WebKit: Layout Shift observer unsupported; before-tap and handoff shift both **`null`**.
- All existing owner, Recorder readiness, selected Object ID and Flow conflict assertions remained green.

Do not convert the known `0.1295` programmatic-search result rearrangement into an alleged Recorder layout bug, or claim WebKit CLS is zero. Separately evaluate search-input UX with actual user keyboard events, device zoom and screenshots during the remaining full accessibility pass.

## Release decision

The **P20 local repeated operations and attributable Object-to-Recorder layout shift** are verified within this sandbox scope. P20 remains **Partial** for physical slow devices, long-tail variability, Production/EdgeOne reads, and formally approved budgets. P11/P12/P15/P16/P17 incomplete edge matrices, historical pinned WebKit 1.55 occasional long-press timeout, assistive-tech optical signoff, exact merged-main Production/EdgeOne domain checks and independent 8.32 Governance Seal still block full 8.32 release.

The additional P20 source-contract guard rejects future loss of pre/post-tap shift attribution. The new GitHub exact head must be rerun through the full dual-engine no-Actions gate. This increment only changes a test and governance evidence; no product runtime or published website is modified.
