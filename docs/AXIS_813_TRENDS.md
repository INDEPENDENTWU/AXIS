# AXIS 8.13 — Trends Time Field

## Product definition

Trends is no longer a dashboard or score surface. It is a read-only, tactile view of the user's own training over time.

The visible grammar is intentionally small:

1. **Scrub** the session trajectory horizontally.
2. **Snap** to one session bearing.
3. **Tap** the selected bearing to expand that session in place.
4. **Scale** the time range between recent / three months / all.

Normal vertical scrolling always remains browser-owned.

## Visual language

- Canvas: `#07080A`
- Raised material: `#0D0F13`
- Pressed material: `#12151B`
- AXIS Violet: `#737CFF`
- Ion Blue: `#79D7FF`

Ion Blue has no good/bad/progress meaning. It only indicates the piece of time currently under direct touch/scrub.

The session node is an **AXIS bearing**: small visual core, large 52px hit target. The **session fingerprint** is built from real activity intervals; bright segments are recorded active intervals and the dark rail is the rest of the session span.

## Motion

- Micro: 90–140ms
- Structural: 220–320ms
- Spatial: 380–520ms

`prefers-reduced-motion` removes non-essential transition/animation.

## Gesture safety

- `touch-action: pan-y`
- Horizontal scrub does not claim the gesture until horizontal delta exceeds vertical delta by 1.25x.
- Left/right 24px viewport rails are not claimed, preserving Safari system-edge gestures.
- No scroll-jacking, long press, pinch, sheet or modal is owned by Trends.

## Ownership

`v813-trends-field.js` is the only visible 8.13 Trends presentation/interaction owner.

It may read local training state and calculate read-only projections. It must not:

- write workout or user storage;
- call network/AI services;
- finish, pause, resume or create training records;
- own Camera, Quick Record, Live Route, Settings or history persistence;
- install persistent timers or mutation/resize observers.

The 8.11 Trends DOM IDs remain hidden compatibility targets only so inherited runtime/tests cannot crash while the visible presentation has one owner.

## Release inheritance

8.13 inherits the 8.12.5 training timing, total-workout completion, Quick Record, Live Route, Settings geometry, searchable custom equipment, smart-create and recording-profile ownership contracts unchanged.
