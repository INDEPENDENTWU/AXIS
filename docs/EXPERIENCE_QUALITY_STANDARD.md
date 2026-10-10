# AXIS Experience Quality Standard

Status: **normative product/presentation quality contract for future AXIS work**. This document is not evidence that an unimplemented experience is shipped. Current certified runtime: **8.31**.

## Product character

AXIS is a quiet, local-first Personal Evolution Engine. The UI exists to let real actions become truthful evidence and make continuity effortless. Good design means **less interpretation, fewer unnecessary steps and greater confidence in what happened**.

Do not add novelty by stacking cards, badges, dashboard widgets, competing calls to action or theatrical motion. Novelty is justified only when it makes a previously difficult or invisible action demonstrably easier. Keep the current dark/light, native-feeling visual vocabulary. New surfaces are peers of Home, Object, Flow, Active and Recorder—not a new branded mini-app inside AXIS.

## Visual source of authority

Use the **final canonical assembled artifact**, not an early historical `prepare-*` style block, as the visual baseline.

| Existing source | Reuse or preserve |
| --- | --- |
| `styles/axis-821-active-home.css` | Flat Home rail, `var(--line2)` separators, optical centered Active hierarchy, single visible clock, isolated tertiary actions |
| `prepare-821-flow-user-surface.mjs` | Existing Home Flow section, sheet ownership, named Object chain, compact primary action geometry, selection/recording delegation |
| `styles/axis-829-recording-friction.css` | Small, stable, user-readable recorder context; no second recording action owner |
| `index.html` and canonical token CSS | Established page content rails, sheet/dock safe areas, `var(--text)`, `var(--muted)`, `var(--dim)`, `var(--line2)`, `var(--s2)`, `var(--accent)` |
| `docs/LOCALIZATION_AND_THEME.md` | `zh-Hans`, `zh-Hant`, `en`; System/Light/Dark; first-paint theme and semantic-token discipline |

A historic source may look more decorative than the shipped result. Inspect final selectors and browser screenshots before authoring new geometry. Never use a hard-coded color to hide an unresolved theme contract.

## Layout, hierarchy and typography

1. **One visual hierarchy:** object/flow identity first; one obvious next action; proven state and secondary controls later. Every surface has one primary semantic action, not two equally dominant choices.
2. **Align to existing rails:** share Home content left/right edges, separator rhythm and baseline. Do not introduce an inset card behind an existing flat section. A card or sheet is allowed only when it communicates a real containment/navigation boundary.
3. **Typography is functional:** real Object/Flow names are more prominent than ancillary descriptions. Current timers, when applicable, remain the single largest fact. Use semantic tokens and the installed typography; no decorative font import, unsolicited uppercase tracking or tiny text to solve crowding.
4. **Optical precision:** centered text, icon baselines, multiline truncation, numeric tabular alignment, unequal line-height and touch targets need screenshot review—not merely matching CSS widths.
5. **Density without fatigue:** compact supporting metadata, readable line-height, no ornamental metric chips, no fake percentages, no duplicate progress, no two visible versions of one state.
6. **Responsive surfaces:** test 320, 360, 390, 430 CSS px; safe-area bottom/top, 200% text scale where supported, long English and CJK strings, multiline Object names, and landscape. No horizontal scrolling or text obscuring critical actions.
7. **Interaction geometry:** primary controls must be at least 44 × 44 CSS px touch targets (46 px or more where the existing primary-action system supports it), with real spacing from adjacent destructive actions. Tertiary actions cannot masquerade as primary.
8. **Color and focus:** readable text contrast (normally 4.5:1; large text 3:1), perceptible non-text focus/selection contrast, visible keyboard focus, and distinguishable disabled/pending/selected/error states. Never convey state by color alone.
9. **Motion carries feedback only:** subtle press/settle and deliberate state transitions; no decorative autonomous loops, delayed interaction blockers or height jumps. Respect `prefers-reduced-motion: reduce` without removing factual feedback.
10. **One owner per visible fact:** no duplicate timer, Session/Encounter representation, misleading completion animation, unverified success copy or competing recorder.

## Behavioral experience gate

Before marking any future UI or capability complete, capture evidence for:

- **First-use comprehension:** what it is, what tapping does, whether a record is created, and how to back out must be clear without internal model vocabulary.
- **Minimal-path friction:** count intentional user actions from a visible entry to a usable existing owner. Measure time from input to interactive state; do not invent timings or imply a non-tested latency budget was met.
- **Full state matrix:** empty, populated, active, conflicting active, pending, disabled, invalid/missing identity, offline, interrupted, resumed, completed, legacy history.
- **Focus/touch:** keyboard sequence, VoiceOver-compatible labels where applicable, pointer and touch hit areas, sheet focus restoration, one-handed reach, safe-area occlusion.
- **Real visual output:** Chromium and iPhone-like WebKit screenshots in both light/dark where supported, across viewport sizes and required locales; inspect optical balance, stacking, separators, clipping, typography, active/disabled states, reduced motion.
- **State truth:** capture before/after canonical state, exactly one owner acknowledgement per action, and no unintended persistence on preview/cancel/error.
- **Release reproducibility:** the *exact* PR head, assembled runtime and exact merged-main providers must be verified under existing Git-connected Production policy.

### Aesthetic review rubric (non-substitutable by static CI)

For **composition**, **information hierarchy**, **typographic precision**, **interaction feedback**, **edge-state clarity**, **theme and locale parity**, and **fit with existing AXIS**, reviewers must attach exact-browser evidence and record *pass / defect with reproduction / not tested*. A screenshot alone is not proof of usability; a passing unit test alone is not proof of visual quality. If a defect affects the primary interaction, correct it before declaring Production-ready. Do not convert an aesthetic judgement into an unsupported numeric claim.

## Prohibited shortcuts

No new framework, external theme library, redundant page, competing store/handler, observer-driven late repaint, duplicate recorder, novelty overlay, unreviewed hard-coded locale string, layout-shifting skeleton, or source-order CSS override used to mask a broken owner. Existing historical compatibility layers are not licenses for parallel new behavior.

## Applying this standard

For every visual change: name the existing surface, the final presentation owner, its immutable factual owner, the elements replaced or retired, the mobile/desktop composition, and the real tests required. New UI is accepted only when it improves the complete user journey while preserving the existing AXIS character.
