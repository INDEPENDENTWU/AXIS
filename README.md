# AXIS

AXIS is a camera-first fitness memory tool: capture the real workout, keep the record, remember the equipment, compare what changed, and surface one useful next signal without turning training into a project-management app.

## Current product — 8.7.12

- Mobile-first workout/session flow with no required workout plan.
- Single-photo and short live-scan capture.
- Immediate timestamp seal plus configurable final photo/video watermark.
- Personal equipment memory and a broad canonical exercise library.
- Fast strength recording with set-level weight/reps, direct numeric editing, previous-value reuse, and per-set completion state.
- Cardio recording with duration/intensity controls.
- Active workout execution with elapsed/estimated time, pause/resume, set completion, rest state, and finish behavior.
- Custom equipment management and normal-language muscle/effect mapping.
- Local-first workout/media storage with explicit storage management.
- Training continuity, comparable progress evidence, coverage, rhythm, trend/report, and next-gap signals.
- Owner-managed AI backend; end users never enter an API key or select models.
- Platform adapter for a future iOS native shell (Photos write, haptics, Passkey, background transfer).

## Runtime architecture

AXIS production uses a hardened core-first runtime:

1. `app.js` + `v61.js` make the product interactive first.
2. Four bounded stable enhancement chunks load after core interactivity.
3. The optional 8.7.12 feature loads only after the verified stable kernel is healthy.
4. A small non-blocking completion shell handles nested-sheet return and narrow legacy cleanup.
5. Feature/completion failure falls back to the verified stable experience rather than blocking the app.

Critical product surfaces use a **single-owner rule**. In particular, `v61.js` is the canonical owner of the live strength draft and high-frequency weight/reps controls; historical parallel recording painters are retired before bundling.

Critical geometry is bundled in first-paint CSS. High-frequency recording changes update values in place rather than rebuilding the active set row.

See:

- [`docs/ENGINEERING_PLAYBOOK.md`](docs/ENGINEERING_PLAYBOOK.md) — product architecture, ownership, visual/performance rules, regression strategy, and convergence roadmap.
- [`docs/RUNTIME_CONTRACT.md`](docs/RUNTIME_CONTRACT.md) — release-blocking runtime invariants.
- [`docs/AI_BACKEND.md`](docs/AI_BACKEND.md) — owner-managed AI configuration.
- [`docs/IOS_NATIVE_BRIDGE.md`](docs/IOS_NATIVE_BRIDGE.md) — web/native boundary.

## AI architecture

AXIS uses a local-first routing strategy:

1. Personal visual memory first.
2. Low-cost visual model only when necessary.
3. At most two compressed key frames are sent for one recognition request.
4. Training insight uses compact statistics only, never workout photos/video.
5. AI failure never blocks logging: manual confirmation and local deterministic signals remain available.

## Storage

The current Web product stores workout metadata in browser LocalStorage and media in IndexedDB on the current device/browser. Vercel does not hold the user's workout media in this build. Cloud identity/sync can be added later without changing the product's capture model.

## Web / native boundary

Safari/PWA cannot silently write captured media into the iPhone Photos library. `platform-v7.js` defines the native bridge boundary so a future iOS shell can add direct Photos write, haptics, Passkey identity and background transfer while retaining the existing web UI logic and server-side AI routes.

## Integrity note

AXIS burns a live timestamp seal into captured frames and can burn the finalized workout record into saved media. A client-controlled device cannot provide absolute cryptographic immutability by itself; server-signed timestamps or remote append-only storage would be required for that stronger guarantee.
