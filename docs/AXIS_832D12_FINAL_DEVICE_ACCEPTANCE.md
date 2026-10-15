# AXIS 8.32d-12 — Device Acceptance and Release Decision

**Product candidate at start:** `8799074f7dded1de2c554473ac3fabdd76f2fb3c`, PR #174 (Draft). Certified public product stays **8.31**. This document tracks acceptance evidence, not permission to merge or publish.

## Decision

**NO-GO for 8.32 Production pending real-device and theme acceptance.** Correct functionality demonstrated by automation is preserved; automated browser proofs must not be substituted for hardware, accessibility or supported theme certification. The 8.32 target release branch must not be merged into main while a release-blocking item remains unresolved.

## P01–P20 evidence disposition

| ID | Decision | Basis and remaining gap |
| --- | --- | --- |
| P01 | Verified, automated | Native canonical Object ID enters original Recorder |
| P02 | Verified, automated | Custom canonical Object ID opens original Recorder |
| P03 | Verified, automated | Native/custom same-name identities retain independent IDs |
| P04 | Verified, automated | Saved Flow single admission through existing owner |
| P05 | Verified, automated | Confirmed Encounter provenance advances Flow and survives reload |
| P06 | Verified, automated | Foreign Flow rejected, history and Run unaltered |
| P07 | Verified, automated | Foreign Active remains authoritative |
| P08 | Verified, automated | Existing selected Object can re-enter original Recorder |
| P09 | Verified, automated | Removed Object cannot fabricate an Encounter |
| P10 | Verified, automated | Empty/invalid/missing-reference Flow rejected |
| P11 | Partial | Real browser touchscreen double tap and animated-frame-stalled hold tested; actual supported touch device/repeated gestures pending |
| P12 | Partial | Two real tabs stale Flow rejected and owner maintained; device suspend/resume and pending command replay remain |
| P13 | Verified, automated | Real UI Save offline creates one canonical Encounter, same immutable ID after reload |
| P14 | Verified, automated | Cancel/re-entry has no false saved Encounter or FlowRun |
| P15 | Partial | Browser 320/360/390/430/1280 geometry; screenshot subsets reviewed; CDP 200% pinch at 320/390/430, but physical iOS/Android text zoom, safe areas and complete optical review pending |
| P16 | Partial | Focus transfer, keyboard tab, no fatal browser error, minimum 44px controls, 4.5:1 CTA contrast, reduced motion; real VoiceOver/TalkBack and entire focus reading order absent |
| P17 | Partial / explicit feature gap | 12/12 headless Chromium/WebKit samples verify stable dark first paint under OS light/dark and zh-Hans/zh-Hant/en; however actual System/Light/Dark theme preference required by docs/LOCALIZATION_AND_THEME.md is not implemented in this candidate. Do not call the planned Light theme passed. |
| P18 | Verified, automated | Actual Home repeat creates new FlowRun/Encounter while older evidence remains |
| P19 | Verified, automated | One original Recorder/capture owner; picker closes; focus transferred |
| P20 | Partial | Browser Chromium/WebKit latency samples and separate 4× synthetic CPU entries; physical slower device, field long-tail and approved tail-latency budget missing. Prior WebKit ~4.6s outlier not disproved by small repeated samples |

**Classification:** 14 automated Verified cases and 6 Partial cases (P11, P12, P15, P16, P17, P20). These classifications concern the 8.32 PLAY THIS scope, not unverified product-wide accessibility, translation or overall feature completeness.

## New d-12 first-paint browser evidence

`scripts/axis-832d12-theme-firstpaint-audit.mjs` runs a fresh Chromium/WebKit context across two OS color-scheme emulations (light/dark) and three locales. It records actual `DOMContentLoaded` background and the final computed root background, checks no horizontal overflow and 44px original Object CTA and guidance/card geometry. The 12 test cases on the candidate observed root RGB `(8,9,11)` both at first DOM paint and after interactive boot. On both emulated OS color schemes the UI remains dark with no `data-theme` attribute; **this is an explicit unmet System/Light preference contract, not a success for Light**. Host media emulation is not real iOS Dynamic Type, real Safari accessibility or screenshot-level approval.

## Real-device signoff protocol (evidence still required)

1. Open the **exact SHA-attributed protected existing-project Preview** on actual supported iPhone Safari and Android Chrome after a safe Preview build. Record device, OS/browser version, site runtime/build identity, system theme, viewport/scale and video/screenshots. Do not use an old Preview artifact as evidence for a new SHA.
2. At 320/390/430-equivalent widths and 200% text size where supported: inspect Today/Home, Object catalog (long native/custom names), saved Flow, Recorder, Active, exit/cancel/re-enter, History/Encounter and relevant sheets. Verify no clipped labels, root scroll overflow, obscured bottom actions or broken safe areas; visually check 44px targets and accessibility focus.
3. VoiceOver on iOS and TalkBack on Android: enter the Object picker using the actual assistive technology, traverse the native/custom Object selection and CTA, enter the canonical Recorder, cancel/save and return. Read accessible labels, announcements, logical focus order and avoid trapping or focus loss.
4. System Light/Dark and the planned System/Light/Dark preference: identify whether the implementation is actually available. If not, declare and repair the product specification gap; do not mark it as verified by the current always-dark runtime.
5. Real low-end supported device and adverse-network/offline run: record cold boot, object-to-Recorder interaction, Flow launch/re-enter, background/resume, repeated touch, cancel and canonical Save. Retain raw timings and decide an explicit acceptable long-tail budget; include abnormal >4s cases with diagnostics rather than dropping them.
6. For every device test, preserve source SHA, screenshots/screen recording and the reviewer conclusion (PASS/BLOCKED/FAIL); separately verify local saved evidence survives reload, no duplicate write, and existing 8.31 data remains readable.

Do not publish hardware PASS solely because an automated test or this checklist exists.

## Remaining release gates

- Complete the above physical optical/accessibility/performance tests and resolve the System/Light/Dark contract decision and any found defects.
- Repeat full local/CI gates on the **final exact PR Head** without treating `[skip ci]` as green. The former 36/36 CI all-green `dfbfdf0` does **not** automatically certify later commits.
- Review P01–P20 once more; resolve blockers before making PR #174 Ready.
- SHA-leased exact-head merge; merged-main CI and Vercel READY SHA, EdgeOne mirror and `axis.juele.fun` official-domain/source identity, data continuity, and browser readbacks.
- Separate, independent 8.32 Governance Seal only after Production verification. Until then: main unchanged, 8.31 certified; no unverified new public site, alias or Production promotion.

## Architectural boundary

No new recorder, Flow/Active/Encounter writer, media owner, storage namespace or theme system is created by this review. System/light theme work, if approved, must be a deliberately scoped visual-foundation implementation, not a quick dark-to-light CSS inversion. Preserve the preexisting 8.31 factual owner and 8.32 PLAY THIS narrow product intent.
