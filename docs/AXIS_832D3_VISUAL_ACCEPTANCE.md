# AXIS 8.32d-3 — Real UI Visual and Re-entry Acceptance

Candidate baseline: `bb93e64e1465dfcbd5e84a3a0fb5b2074174f10e`. This evidence is for the **existing 8.32 candidate**, not a Production certificate. 8.31 remains the sealed Production product; PR #174 is Draft.

## Reproduced defect and correction

The first 320px Object launch successfully opened the original Quick Recorder. On subsequent cancellation and return to the **same** Object, the 8.32 coordinator treated a valid canonical `selected` projection as an invalid new selection, displayed an unavailable toast and left the picker open. This was reproduced while covering the offline 360px case, but the root cause is selection re-entry, not a dependency on network requests.

The corrected `axis832StartObject` checks the **existing canonical selection** only when `phase='selected'`, `sourceKind='object'` and exact `sourceRef/objectRef` both match the requested Object ID; it otherwise still requires an accepted selection command. The entry then uses the established synchronous `__AXIS_OPEN_EQUIPMENT_PICKER__('quick')` and `__AXIS_PICK_EQUIPMENT__(id,true)` handoff. This avoids the older Quick wrapper's scheduled animation-frame selection (which may stall in offline/background conditions), and continues to use the **original app-owned** picker, Recorder and canonical data writer. No extra store, synthetic Encounter or additional owner is introduced.

## Actual full-width/browser evidence

`scripts/axis-832d3-visual-browser-smoke.mjs` runs these factual browser checks at **320, 360, 390, 430 and 1280 CSS pixels** and additionally tests `zh-Hans`, `zh-Hant` and `en` at 390px. This is **7 complete UI cycles per browser**, including opening the picker, finding the exact Object, minimum 44px touch geometry, no horizontal overflow or clipped label, focus preserved on catalog refresh, real Recorder opening, one existing Recorder/capture owner, keyboard focus within Recorder, cancellation with unchanged Encounter/FlowRun, and returning to and reopening the original picker. At 360px the interaction is performed with `navigator.onLine=false`, and connectivity is restored afterward. Screenshots of picker and Recorder are captured for 320px, all 390px locales and 430px: **10 screenshots per engine**.

Chromium and WebKit **Playwright 1.64** each passed all 7 complete cycles on the patched isolated source build (canonical release builder completed 103 steps). The 390px picker and Recorder screenshots were also opened for human visual inspection: original dark theme hierarchy is present and buttons/Recorder controls are visible. The other captured images have **not** received a complete human optical signoff, and this is not a claim of support for a light theme.

A full cross-version regression was additionally run against the patch: Chromium passed the six existing browser suites. The first WebKit run timed out in the historical 8.8.2 personal visual memory test's short 1,800ms wait; a subsequent independent WebKit rerun passed that suite and the remaining four subsequent suites, including the original P20 timing test. This intermittent timing issue remains observable and is **not** silently described as permanently resolved.

## Release status and limitations

- All of the above is isolated source evidence. The revised GitHub exact head requires an independent full local gate before this increment is considered complete.
- The installed WebKit version is Playwright 1.64, not the pinned 1.55 release-compatibility gate. No false equivalence is claimed.
- Offline *entry and cancellation* is verified here; full offline Recorder **save/confirm** requires its own UI acceptance evidence.
- The P01–P20 acceptance matrix is not yet honestly green 20/20. Assistive-tech reading order, first-paint/locale/theme optical quality and final release/domain/provider certification remain blocking tasks.
- Neither a Preview nor Production deployment was created. No Actions job was run as part of this change.
