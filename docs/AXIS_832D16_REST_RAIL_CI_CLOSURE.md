# AXIS 8.32d-16 — Rest / Adjust Baseline Closure

## Root cause and correction

The latest 8.32 candidate failed the exact GitHub `AXIS Current Release Gate` in Chromium and WebKit on the inherited 8.26.4 rest/Adjust utility rail. During a paused training, the 32px authoritative `v87Rest` row and enlarged 44px `v87AdjustBtn` did not share the same vertical midpoint: Chromium measured **546.59375 vs 550.59375** and WebKit **550 vs 554**, each a 4px offset. The 8.26.4 release source dynamically adds this historical baseline check to the 8.26.2 Active Rest Selector smoke during the deterministic build. Source-only inspection of the unbuilt script cannot detect it.

D16 previously added an 8px top margin to maintain at least 4px of spacing from the primary controls. That margin shifted Adjust away from the rest clock. The repair explicitly sets `margin-top:0` and `align-self:center` in the original `.axis821StageControls` grid, with `row-gap:14px` for clearance over the preceding control row. The existing 44px touch height, minimum 92px finish button width, 32px rest display, original Recorder and Active fact ownership and historical rest presentation remain intact. No acceptance tolerance was increased and no test was disabled.

## Source-attributed acceptance requirements

- Build the candidate in an **isolated detached Git worktree** first; the 8.26.4 build materializes its rest/Adjust assertions.
- Under **Chromium and WebKit**, execute both the inherited `axis-8262-active-rest-selector-smoke.mjs` and `axis-821-active-home-visual-smoke.mjs`, plus d16 original Object→Recorder Save→Active theme/persistence smoke.
- Keep the original rest/Adjust baseline requirement: center delta <=1.5px, 32px rest rail, untouched pause/resume state owner, Rest Speak geometrical integrity, reduced motion and no fabricated event.
- Keep 8.21 Active visual conditions: no overlapped or glued Adjust, >=4px separation from primary actions, >=92px finish width.
- Keep both Active touch target heights >=44px, original Encounter after reload, no horizontal overflow across tested widths, and Dark/Light focus/contrast.
- Integrate the original 8.26.4-derived rest smoke into the canonical 8.32 local acceptance gate, so **both** inherited and newest constraints are asserted on each exact source Head.

## Governance and deployment boundary

An exact PR Head CI full-green result and clean detached-source local gate are necessary before making another candidate Preview. A Preview is **not** Production. Existing 8.31 remains the certified public version; no 8.32 version promotion, `main` merge, EdgeOne alias or Governance Seal before all remaining hardware/human product gates pass.

P11/P12/P15/P16/P17/P20 physical native iOS/Android, actual OS text scaling, VoiceOver/TalkBack, optical signoff and low-end latency budget remain incomplete. The 8.32 PR therefore stays Draft and the release decision **NO-GO** pending these proofs. The product's feature and appearance foundation may be exercised on source-specific protected Preview, not represented as formally released.
