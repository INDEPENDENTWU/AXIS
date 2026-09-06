# AXIS 8.21 — Active Home Visual Convergence

## Bounded baseline

- canonical repository: `INDEPENDENTWU/AXIS`
- exact base `main` SHA: `9eaf90d0f94023218feb452b085da48c9f027276`
- bounded delivery branch: `feat/821-active-home-visual-convergence`
- public release identity: **unchanged; AXIS 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- existing Active truth/action owner: **v87 over `axis_v8_meta`**
- new storage / writer / recorder / Active owner / Flow owner: **none**

## Product problem

PR #125 made ordinary Active a large integrated Home execution stage, but its visual language still reads too much like a standalone elevated card. The inner geometry also lets the secondary Adjust action visually compete with the primary execution controls. This bounded pass converges the stage with AXIS Home instead of adding another UI system.

## Visual contract

1. The Active stage is a flat Home section: no elevated card background, drop shadow, oversized container radius or decorative glow.
2. The stage aligns exactly to the existing Home content rail and uses the same `var(--line2)` section separators already used across AXIS.
3. Object name, elapsed clock and timing metadata share one strict centered axis. The clock remains the dominant fact.
4. Set progress and rest state use one balanced two-column fact rail with deterministic left/right alignment.
5. Pause/Resume and the current primary execution action form one balanced two-column row with a real gap and equal geometry.
6. `调整` is a separate tertiary row beneath the primary controls; it must never overlap, touch or visually masquerade as a third primary action.
7. Existing passive Rest Speak / paused recovery content remains available below the control rail without becoming a new card.
8. 390px Chromium and iPhone-like WebKit must have no horizontal overflow; the same composition must remain coherent on the wider canonical Home rail.
9. Reduced-motion behavior and all existing Active/Flow semantics remain unchanged.

## Hard ownership boundary

This pass may change presentation only. It must not alter Activity lifecycle truth, elapsed/rest timing, pause/resume, completed-set truth, add-set, hold-to-finish, Session/Encounter persistence, Flow sequencing, recorder ownership, Report truth, release identity or deployment topology.

## Merge gate

The exact final PR head must prove:

- deterministic `node build-release.mjs` succeeds;
- a static contract confirms the refinement is presentation-only and wired after the certified Active Home compatibility pass;
- Chromium and iPhone-like WebKit verify flat section styling, centered clock, balanced control geometry, isolated Adjust row and zero horizontal overflow;
- the existing Active Home semantic smoke remains green, including pause/resume, set completion, pause-owned rest and hold-to-finish;
- inherited repository, Flow/Object/Report, Production and EdgeOne gates remain green.

Deployment remains the single existing Git-connected AXIS Vercel Project on `main`; no separate Vercel Project is allowed for this work.
