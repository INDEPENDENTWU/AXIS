# AXIS 8.32d-5 — Stale Cross-Tab Flow Truth & Visible Continuation

Base candidate `6e6ec56351ba72308c7449d6ad493672ca541796`, PR #174 Draft. Verified locally 2026-10-13 in an isolated canonical 103-step build with real headless Chromium and WebKit (Playwright 1.64). No additional Preview, GitHub Actions, merge or Production deployment.

## User-facing defect

Two open browser tabs share AXIS's existing `axis_v60_state`. In one tab an exact saved Flow is accepted into the canonical FlowRun while the other tab retains an older in-memory projection. **Before the fix**, the second tab continued to render that exact active Flow's button as `开始练习` (Start practice) instead of Continue, even though the existing owner was active. Pressing it did not overwrite history, but the text was misleading.

The 8.32 presentation coordinator now listens for the browser's native `storage` event for `axis_v60_state`; it reads the **persisted** current FlowRun and, only when `status='active'` and the visible Home button's exact `data-axis-flow-start` matches `flowRef`, changes the button and `aria-label` to existing localized `axis832Copy('continue')`. No localStorage write, synthetic FlowRun, second fact writer, mutation of app-owned runtime, polling, network request, or new persistence owner is introduced. Foreign Flow actions are not relabeled as safe continuation.

## Real browser P12 evidence

`scripts/axis-832d5-stale-tabs-browser-smoke.mjs` creates two actual pages in one browser context, saves two distinct canonical Flows, boots both tabs before starting the first Flow and asserts:

1. Tab A accepts Flow A and writes a canonical FlowRun, with its existing Encounter provenance.
2. Tab B has stale in-memory owner state while sharing the newer storage value.
3. The native storage event changes Tab B's visible matching Flow A action to localized **Continue current practice**, including `aria-label`.
4. Tab B explicitly attempts Flow B: the command is **rejected**, without replacing Flow A, creating another run, changing the Encounter ID list or silently jumping steps.
5. Clicking Tab B's visible Flow A action returns to the existing canonical owner without creating another run or Encounter.
6. Reloading Tab B recovers the **same** persisted FlowRun ID and Flow reference.

Both Chromium and WebKit passed this full scenario on the isolated patched source; the existing 103-step build and postbuild passed as well. This test is added to the Actions-free exact-head local gate and protected by a source contract. **The newly submitted GitHub head still requires its own complete exact-head gate**.

P12 becomes better evidenced for **cross-tab stale Flow conflicts and visible re-entry**; its originally broader pending-command replay/concurrency acceptance remains **partial** until the complete stale pending-transaction/slow-device matrix is certified. No unsupported 20/20 or Production claim is made.

Release still blocked by remaining P11/P12/P15/P16/P17/P20 full acceptance, pinned WebKit 1.55 native compatible environment, human optical/assistive technology signoff, merged-main provider/EdgeOne/domain readbacks, and independent 8.32 Governance Seal. Existing Production 8.31 stays sealed.
