# AXIS 8.32d-4 — Final Release Acceptance Decision

Candidate source: `fb793b747f5f8c269ab4c351ccc695ae798c6c50` · PR #174 Draft · existing certified Production: 8.31. Scope is PLAY THIS and its inherited canonical Recorder/Active/Flow owners. **No Production or Preview deployment authorized before full acceptance.**

## P13 — actual offline Recorder save and reload

On this exact candidate source, both headless Chromium and WebKit (Playwright 1.64) independently completed `scripts/axis-832d4-offline-recorder-browser-smoke.mjs`: launch existing 360px Object picker; select `chest-row` while `navigator.onLine === false`; open the original app-owned Quick Recorder; assert focus and enabled `#saveScan`; **physically click the visible Save button while offline**; wait for precisely **one** canonical Encounter with the exact Object ID; verify the original sheet closes and no `axis_832*` storage namespace appears; reconnect, reload the app and verify the **same immutable Encounter ID** remains. Both browser runs passed. This closes the earlier P13 deficiency in user-visible save/confirmation, not merely a programmatic owner command.

The test and its source guard are part of the exact-head local gate, alongside all earlier historical/browser suites; the newly committed head must undergo its own full gate before a production release decision.

## P01–P20 coverage and outstanding conditions

| Case | Status | Acceptance evidence / remaining blocker |
| --- | --- | --- |
| P01 Native Object | Verified | Exact native Object picker, CTA, Recorder |
| P02 Custom Object | Verified | Custom canonical identity opens original Recorder |
| P03 Same-label identities | Verified | Distinct native/custom IDs without ambiguity |
| P04 Flow launch | Verified | Saved Flow starts via canonical runtime, recovery from transient handoff |
| P05 Confirmed Encounter | Verified | Persisted real Flow/Active provenance, reload and advance |
| P06 Existing Flow conflict | Verified | Foreign Flow owner not overwritten |
| P07 Existing Active conflict | Verified | Foreign Active remains authoritative |
| P08 Re-enter selected Object | Verified | Same-ID selected state can reopen original Recorder, online/offline |
| P09 Missing Object | Verified | Clean rejection without synthetic Encounter |
| P10 Invalid Flow | Verified | Invalid/empty/out-of-range/missing reference rejected |
| P11 Rapid repeated action | Partial | Browser pointer double click, same FlowRun/no duplicates passed; touch/long-press/concurrent-tab race unverified |
| P12 Reload/stale execution | Partial | Active FlowRun identity persists; cross-tab and pending-command replay not exhaustively proven |
| P13 Offline confirmation | Verified | Actual original UI Save while offline, exactly one Encounter, same ID after reload |
| P14 Cancel/preview purity | Verified | No altered FlowRun or fabricated Encounter on cancel/re-entry |
| P15 Responsive optical UX | Partial | 320/360/390/430/1280px DOM geometry and 20 screenshots; full human optical matrix, light/theme-specific case outstanding |
| P16 Accessibility | Partial | Focus continuity, 44px targets, reduced motion and enlarged English label passed; assistive reader, complete focus order and system font-scale audit outstanding |
| P17 Theme and locale | Partial | zh-Hans/zh-Hant/en action labels pass; supported theme first paint and requested light example not certified |
| P18 Repeat completed Flow | Verified | Actual Home repeat click creates fresh FlowRun, preserves previous history |
| P19 Recorder handoff | Verified | One original Recorder/capture owner, picker closes, focus moves into Recorder |
| P20 Performance | Partial | Local cold/warm and input-to-owner metrics reported per browser; 4.6s WebKit outlier and low-end/Production measurement unclosed |

**Verification nuance:** “Verified” means the specific implemented test scope passed; it does **not** mean the entire product or all twenty acceptance stories are certified. Missing hardware, theme, assistive-technology, or timing proof is not converted into a PASS.

## Fixed WebKit 1.55 compatibility

Playwright 1.55's WebKit installer reports that Ubuntu **26.04** is unsupported. Forced `PLAYWRIGHT_HOST_PLATFORM_OVERRIDE=ubuntu24.04-x64` allowed downloading the legacy browser, but launch failed on `libicudata.so.74` (required by its binary, missing from the Ubuntu 26 runtime). **Pinned WebKit 1.55 was not run successfully.** Re-run in a fully supported Ubuntu 24.04 environment rather than bypassing system dependency validation. The already green WebKit 1.64 smoke is useful evidence but not equivalent to pinned 1.55.

## Release governance

No new Preview deployments, GitHub Actions runs, main merge, Production promotion, provider/EdgeOne/domain readbacks or new 8.32 Governance Seal occurred. Remain **Draft** and **Production 8.31**. Remaining exact release gates: the new commit's isolated dual-engine gate; supported light/first-paint optical signoff; complete assistive/keyboard/touch and stale concurrent UI acceptance; pinned WebKit 1.55 in supported environment; measured long-tail performance decision; then review → merge exact certified head → deploy official Production → verify runtime provider, EdgeOne, official domain and data persistence → independent Governance Seal. Do not claim 8.32 released until all gates and actual official readbacks pass.

## 2026-10-13 — P12 cross-tab evidence supplement

`scripts/axis-832d5-stale-tabs-browser-smoke.mjs` now covers **two live actual browser tabs**, not just same-tab reload: separate Flow references, stale tab foreign launch rejection, unchanged canonical FlowRun/Encounter IDs, visible Home action to *Continue current practice* (accessible label), same-owner re-entry and recovery after reload. Chromium/WebKit Playwright 1.64 passed the isolated test; see `docs/AXIS_832D5_STALE_TAB_ACCEPTANCE.md`. P12 remains **Partial** until pending-command and slower-device replay proof is complete. No pinned WebKit 1.55 evidence or Production certification implied.

## 2026-10-13 — P11 mobile touch & WebKit pinned-version update

P11 now includes actual `touchscreen.tap` repeated activation and cancellation on the real 360px Object CTA in Chromium/WebKit1.64 and test-only WebKit1.55, with exact one Recorder/owner and unchanged canonical history. This improves the **Partial** P11 coverage (does not make all multi-gesture/accessibility paths complete). Exact fixed Playwright1.55 WebKit26.0 runs are documented separately: eight suites first-run green, one historical 8.8.2 long-press timeout, unchanged rerun green twice, all under Ubuntu26 compatibility libs rather than a supported native OS. See `docs/AXIS_832D6_TOUCH_PINNED_COMPAT.md`. Production seal remains withheld.
