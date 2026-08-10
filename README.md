# AXIS

AXIS is a camera-first fitness memory tool: scan the real workout, keep the record, remember the machine, compare what changed, and surface one useful next signal without turning training into a project-management app.

## Current product — v7

- Mobile-first session workflow with no required workout plan.
- 3s / 5s live scan and single-photo capture.
- Immediate live timestamp seal plus configurable final photo/video watermark.
- Personal equipment memory: confirmed equipment becomes easier to recognize next time.
- Fast strength/cardio logging with last-value reuse and quick choices.
- Training muscles/effects mapped to normal user language.
- Local-first media and workout storage with explicit storage-space management.
- Editable/deletable custom equipment.
- 30-day coverage, comparable progress evidence, training rhythm and next-gap signals.
- AXIS Insight: one short post-workout judgment and one next action.
- AXIS Brand Share System: 12 visual families × 4 palettes × 2 formats = 96 coherent report outputs, automatically selected by workout state with simple user controls.
- Owner-managed AI backend; end users never enter an API key or choose models.
- Platform adapter prepared for a future iOS native shell (Photos write, haptics, Passkey, background upload).

## AI architecture

AXIS uses a local-first routing strategy:

1. Personal visual memory first.
2. Low-cost visual model only when necessary.
3. At most two compressed key frames are sent for one recognition request.
4. Training insight uses compact statistics only, never workout photos/video.
5. AI failure never blocks logging: manual confirmation and local deterministic signals remain available.

See [`docs/AI_BACKEND.md`](docs/AI_BACKEND.md) for owner configuration.

## Storage

The current Web product stores workout metadata in browser LocalStorage and media in IndexedDB on the current device/browser. Vercel does not hold the user's workout media in this build. Cloud identity/sync can be added later without changing the product's capture model.

## Web / native boundary

Safari/PWA cannot silently write captured media into the iPhone Photos library. `platform-v7.js` defines the native bridge boundary so a future iOS shell can add direct Photos write, haptics, Passkey identity and background transfer while retaining the existing web UI logic and Vercel AI routes.

## Integrity note

AXIS burns a live timestamp seal into captured frames and can burn the finalized workout record into saved media. A client-controlled device cannot provide absolute cryptographic immutability by itself; server-signed timestamps or remote append-only storage would be required for that stronger guarantee.
