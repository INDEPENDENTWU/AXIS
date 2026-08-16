# AXIS 8.8 — Watermark Contract

This document is the canonical handoff for watermark work in AXIS 8.8. Future fixes must preserve these ownership boundaries instead of adding another click handler, resolver, painter, observer, or delayed correction.

## Visible preferences

The user-facing watermark metadata has exactly four independent switches:

1. `项目名称` → `axis_v8_meta.prefs.v85WmName`
2. `训练数据` → `axis_v8_meta.prefs.v85WmData`
3. `位置` → `axis_v8_meta.prefs.v85WmLocation`
4. `时间` → `axis_v8_meta.prefs.v85WmTime`

`v85-runtime.js` / `setWm()` is the only visible preference writer. A successful write emits `axis:watermark-pref-change`; the final v8710 presentation owner immediately re-renders from persisted truth. Do not synchronize these switches by relying on click bubbling order or timers.

## Preview and saved media

`v8710-watermark.js` is the final preview and final-photo watermark owner. The top preview and saved watermark must obey the same four persisted preferences. Turning a field off must remove that field immediately from the preview and from the saved watermark; turning it back on must restore it without refresh.

Historical canvas compatibility paths may not reinterpret the preferences. `v85-canvas-fix.js` may retain canvas compatibility, but its historical capture-phase `#v85WmLocation` switch owner is retired and it may not paint raw coordinates.

## Location ownership

Private GPS coordinates and visible location metadata are different state.

- GPS coordinates (`v85LastGeo`) are private resolver input only.
- GPS acquisition must never decide whether the Location watermark switch is on or off.
- The Location switch is owned only by `setWm('v85WmLocation', ...)`.
- `v8710-watermark.js` is the sole canonical place-name resolver for explicit `获取当前位置`.
- An explicit locate action forces a fresh GPS read and bypasses the normal short-lived GPS / place cache so the displayed place reflects the user's current location.
- OpenStreetMap Nominatim is the primary precise reverse-geocoder; BigDataCloud is fallback only when the primary resolver fails.
- The preferred presentation is the most useful compact real-world name available: POI / venue, road + house number, neighborhood / community, then broader district/city as needed.
- Raw latitude, longitude, accuracy, `LAT/LON`, or similar coordinate text must not appear in normal settings UI, preview, or final media.

## Retired ownership

The following historical behaviors are explicitly retired in canonical 8.8:

- `v85-canvas-fix.js` capture-phase click interception of `#v85WmLocation`;
- `setGeo` writing `v85WmLocation` or otherwise deciding visible preference state;
- `v876-runtime.js` coarse `#v876Locate` click resolver as an independent owner;
- coordinate text painted into watermark media;
- time being unconditional metadata instead of an explicit user preference;
- preview repaint based on guessed click-listener order.

## Build convergence

The deterministic release pipeline converges the watermark contract before canonical packaging through:

- `prepare-88-watermark-final.mjs`
- `prepare-88-watermark-state-sync.mjs`
- `prepare-88-watermark-location-owner.mjs`
- `verify-88-watermark.mjs`

`verify-88-watermark.mjs` stamps these release gates into `axis-build.json`:

- `watermarkFourSwitchContract`
- `precisePlaceResolver`
- `noRawCoordinatePresentation`
- `watermarkSingleLocateOwner`
- `watermarkPreferenceSingleWriter`

A Production deployment is incomplete if any of these gates is absent or false.

## Browser regression

`scripts/axis-watermark-smoke.mjs` must pass in both Chromium and iPhone-sized WebKit. It verifies:

- all four switches exist and persist;
- each switch independently hides/restores its corresponding final preview row;
- precise OSM location resolves to a POI / road / neighborhood-level name;
- fallback geocoding is not called when OSM succeeds;
- raw coordinates never appear in visible watermark UI;
- no uncaught browser errors occur.

The ordinary AXIS Full Product Operation Matrix must also remain green on the same exact source SHA.
