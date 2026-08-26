# Active Action Lens — Interaction Experiment

Status: **non-blocking research**

Release dependency: **none**

Related current milestone: AXIS 8.21 Flow / Session Blueprint, but this experiment must remain independently removable.

## 1. Problem

During an ongoing practice, high-frequency actions such as:

- `完成一组`
- `暂停`
- `完成`

should be easy to hit while the user is moving, holding equipment, looking away briefly or using the phone with one hand.

Simply making the existing Active buttons permanently huge would damage information density and the established Active hierarchy. Replacing tap with long-press/double-tap/swipe globally would also collide with mobile navigation, scrolling, accessibility and historical hold/sound gesture behavior.

The experiment therefore tests a **temporary large-control presentation layer** instead of changing the normal Active surface.

## 2. Core concept

**Active Action Lens** is an explicitly entered, viewport-fixed presentation layer over the current Active state.

It does not create another Active state.

```text
existing Active truth/action owners
              ↑
        delegated actions
              ↑
      Active Action Lens
      presentation only
```

The architectural precedent is the existing 8.18 Focus rule: a presentation layer may make an action easier to use while completion authority stays with the established owner.

## 3. Why not browser Fullscreen API

Do **not** use the browser Fullscreen API as the primary design.

Reasons:

- inconsistent PWA/browser chrome behavior across iOS/WebKit and Chromium;
- unnecessary permission/gesture lifecycle complexity;
- can interfere with expected system navigation and orientation behavior;
- makes cancellation/return feel like leaving the product rather than changing interaction density.

Use an in-app fixed layer:

```css
position: fixed;
inset: 0;
```

with safe-area handling and controlled pointer scope.

## 4. Entry

Normal Active behavior must remain untouched unless the user explicitly enters the Lens.

Preferred first experiment:

- reuse/extend an existing presentation/Focus affordance if one is sufficiently discoverable;
- otherwise expose one compact, semantically clear expand/control affordance on Active;
- entry is a normal explicit tap.

Do **not** initially bind Lens entry to:

- global long-press;
- double tap;
- edge swipe;
- two-finger gesture;
- tapping the existing completion action itself.

Those gestures either conflict with known product behavior/mobile conventions or are too hidden for a primary action mode.

## 5. Visual / interaction structure

The Lens should feel like a temporary physical control surface, not a modal settings sheet.

Conceptual mobile layout:

```text
┌──────────────────────────────┐
│ current Object / essential fact
│ minimal live value / set state
│                              │
│                              │
│        PRIMARY ACTION        │
│       large touch field      │
│                              │
│                              │
│  暂停                 完成   │
│                              │
│        ↓ dismiss hint        │
└──────────────────────────────┘
```

The primary action adapts to effective execution semantics:

- `sets` → `完成一组`
- `rounds` → the existing round-completion semantic action if/when current owners expose it
- `timed/hold` → normally no fake set action; show the established finish/pause semantics appropriate to current Active
- `single/complete` should not normally have an ongoing Lens because those modes should not create persistent Active

Do not invent a new action merely to fill the large area.

## 6. Large primary action

The primary action field may occupy a substantial portion of the lower/central viewport so it can be hit with coarse motor input.

Requirements:

- one-handed reachable on common phone sizes;
- clear pressed/committed visual feedback;
- no delayed ambiguous gesture threshold;
- delegate exactly once to the existing semantic action;
- completion result updates in place;
- for sets, the Lens may remain open after a successful set so the next set can be completed without repeatedly opening/closing the layer;
- no duplicate click caused by pointer/touch/click event stacking.

The Lens must never synthesize a second “set complete” event on top of the canonical owner.

## 7. Pause / finish

Pause and finish remain explicit secondary actions with strong spatial separation from the large primary action.

Avoid placing destructive/ending actions where a missed thumb tap is likely.

If a destructive session-end confirmation already exists, delegate to it. Do not create a second confirmation state machine.

## 8. Dismissal

Dismissal must be easier than entering a browser fullscreen state.

Required:

- visible close/return affordance;
- downward dismiss gesture may be tested **inside the Lens only**;
- dismissal creates **zero training fact**;
- dismissal does not pause or finish unless the user explicitly chose those actions;
- returning exposes the same canonical Active state.

A dismissal gesture must have a generous cancellation threshold and must not trigger if the user is operating a button.

## 9. Touch / pointer safety

Outside the Lens, AXIS keeps normal page behavior.

Inside the Lens:

- pointer capture is scoped to the active gesture only;
- one active pointer is allowed for gesture tracking;
- a second pointer/multitouch cancels the gesture;
- `pointercancel` cancels without action;
- `visibilitychange` to hidden cancels pending gesture state;
- `pagehide` cancels pending gesture state;
- orientation/viewport changes recompute layout rather than committing an action;
- no global document-level `preventDefault()` blanket;
- `touch-action` is set only where the Lens actually needs it.

## 10. iOS / PWA constraints

Must physically verify iPhone-like WebKit behavior.

The experiment must not break:

- safe-area top/bottom insets;
- PWA standalone viewport sizing;
- browser viewport resizing;
- iOS edge-back/navigation behavior outside the Lens;
- page scroll before/after Lens;
- foreground/background restoration;
- existing Capture camera lifecycle;
- orientation changes;
- selection/focus/accessibility semantics.

If a full-viewport overlay makes iOS navigation less reliable, reduce the experiment rather than adding platform-specific hacks.

## 11. Motion / visual feedback

The layer should feel deliberate but not theatrical.

Possible feedback:

- subtle scale/pressure response while the primary control is physically pressed;
- quick state morph after canonical completion returns;
- local counter/value transition rather than whole-screen celebration;
- stable background/geometry so repeated set completion does not visually jump.

Do not add:

- confetti;
- celebratory completion screens;
- forced sound;
- fake haptic assumptions on Web;
- long animated transitions that block another action.

Respect `prefers-reduced-motion`: semantic state changes remain, transform-heavy motion disappears.

## 12. Accessibility

The experiment is not allowed to trade accessibility for motor convenience.

Requirements:

- semantic buttons remain real controls;
- keyboard/focus order works on desktop/web;
- screen-reader labels describe the actual action and current Object;
- Escape/close returns safely where applicable;
- no color-only state distinction;
- minimum target sizes exceed normal touch requirements rather than merely meeting them;
- zoom/text enlargement must not make controls overlap or hide exit affordances.

## 13. Ownership contract

Active Action Lens owns **presentation only**.

It may read:

- current Active presentation state;
- effective execution mode;
- current set/time facts needed for display.

It may call/delegate:

- existing completion action;
- existing pause/resume action;
- existing finish/session action.

It may not own/write:

- training/session/Encounter facts directly;
- `axis_v60_state` independently;
- `axis_v8_meta` independently;
- Object schema/execution defaults;
- Flow state;
- sound policy;
- Capture/media state;
- another timer/Active lifecycle.

## 14. Experiment sequence

Phase A — static/prototype contract:

- render from current Active truth;
- open/close only;
- no business action delegation yet;
- verify mobile geometry/safe areas.

Phase B — one delegated action:

- genuine classic `sets` Object;
- large `完成一组` delegates to the established completion owner;
- assert exactly one set fact and stable Lens geometry.

Phase C — lifecycle coverage:

- pause/resume;
- finish;
- timed/hold surface;
- foreground/background;
- cancellation.

Phase D — Flow coexistence:

Only after 8.21 Flow exists, prove the Lens does not own or mutate Flow progression. Canonical completion may cause the existing Flow orchestrator to surface the next intent, but the Lens itself must not write Flow history.

## 15. Required test matrix

At minimum:

### Chromium

- open/close, no fact written;
- complete one classic set exactly once;
- repeated set completions while Lens remains open;
- pause/resume delegates correctly;
- finish delegates correctly;
- page resize and reduced motion;
- no page errors.

### iPhone-like WebKit

- all above;
- safe-area geometry;
- touch/pointer cancellation;
- edge navigation unaffected outside Lens;
- foreground/background;
- no accidental action during dismissal;
- PWA-like viewport.

### Regression

- normal Active surface still works without ever opening Lens;
- existing long-press/sound suppression behavior unchanged;
- existing Focus behavior preserved or explicitly superseded through one reviewed presentation handoff;
- no new persistence or action writer.

## 16. Kill criteria

Do not ship the Lens merely because it is visually distinctive.

Retire the experiment if any of these remain true after a small physical prototype:

- users still need to look precisely at the screen to use it;
- accidental finish/pause risk increases;
- iOS/PWA navigation becomes brittle;
- ordinary Active becomes harder to understand because Lens entry adds clutter;
- it requires global gesture interception;
- it duplicates action ownership;
- it needs a new training state machine;
- the benefit over simply improving existing touch targets is marginal.

The correct outcome may be **not shipping it**. 8.21 Flow must continue either way.
