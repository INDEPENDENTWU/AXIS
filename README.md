# AXIS

AXIS is a camera-first fitness memory tool: capture the real workout, keep the record, remember the equipment, compare what changed, and surface one useful next signal without turning training into a project-management app.

## Current product — 8.8

- Mobile-first workout/session flow with no required workout plan.
- Single-photo and short live-scan capture, with one canonical default capture preference (`photo` / `3s` / `5s`).
- Immediate timestamp seal plus configurable final photo/video watermark.
- Personal equipment memory and a broad canonical exercise library.
- Fast strength recording with set-level weight/reps, direct numeric editing, previous-value reuse, and per-set completion state.
- Cardio recording with duration/intensity controls.
- Active workout execution with elapsed/estimated time, pause/resume, set completion, rest state, finish behavior, and one visible one-time adjustment transaction.
- Custom equipment management with one canonical editor, automatic exercise classification, and professional muscle/effect mapping.
- Local-first workout/media storage with explicit storage management.
- Current v84 training trends, continuity/memory signals, and current v8710 three-card training report.
- Owner-managed AI backend; end users never enter an API key or select models.
- Platform adapter for a future iOS native shell (Photos write, haptics, Passkey, background transfer).

## Runtime architecture

AXIS 8.8 production is a **canonical single-runtime release**.

The browser receives:

1. one external JavaScript runtime: `axis-core.js?v=<content hash>`;
2. one external stylesheet: `axis-style.css?v=<content hash>`;
3. zero dynamic historical runtime chunks;
4. zero optional feature/completion runtime requests;
5. no silent downgrade or fallback to an 8.7.x product while the public UI says 8.8.

Historical modules remain in the repository as compiler inputs and implementation history. `build-release.mjs` runs the deterministic convergence pipeline and `postbuild-88-canonical.mjs` emits the one browser runtime. They are not independent production layers.

Critical product surfaces use a **single-owner rule**. Current important owners include:

- `v61.js` — live strength draft and high-frequency weight/reps recording;
- `v874-professional.js` — canonical custom-exercise professional editor/inference UI;
- v876 capture preference — the sole visible/default `photo` / `3s` / `5s` capture preference;
- `#v87AdjustBtn` + the v879 one-time transaction sheet — the single active-session adjustment path;
- v85/v8711 watermark controls — current name and four-corner placement owners, with historical placement hit targets retired;
- `v84-runtime.js` — current Trends surface; pre-v84 coverage UI remains retired;
- `v8710-report.js` — current three-card report deck and report-share owner; base/v877 report surfaces remain retired.

Critical geometry is bundled in first-paint CSS. High-frequency recording changes update values in place rather than rebuilding the active set row.

The public release contract lives in [`release-contract.json`](release-contract.json). `build-release.mjs`, CI, and the production deployment gate validate against that contract rather than maintaining independent version constants.

See:

- [`docs/CURRENT_RELEASE.md`](docs/CURRENT_RELEASE.md) — current release ownership map and handoff entry point for future work.
- [`docs/ENGINEERING_PLAYBOOK.md`](docs/ENGINEERING_PLAYBOOK.md) — product architecture, ownership, visual/performance rules, regression strategy, and convergence roadmap.
- [`docs/RUNTIME_CONTRACT.md`](docs/RUNTIME_CONTRACT.md) — release-blocking runtime invariants.
- [`docs/AI_BACKEND.md`](docs/AI_BACKEND.md) — owner-managed AI configuration.
- [`docs/IOS_NATIVE_BRIDGE.md`](docs/IOS_NATIVE_BRIDGE.md) — web/native boundary.

## Release verification

The release-blocking browser gates verify the built artifact rather than only source structure. The current 8.8 matrix covers repeated cold boot, first-paint stability, Settings, profile, custom equipment, capture preference, sound/reminders, watermark, storage, direct strength recording, set count, active-session pause/resume/completion, visible one-time adjustment, history, current v84 Trends, and current v8710 report. A separate iPhone-sized WebKit gate verifies the canonical runtime and critical mobile interactions.

## AI architecture

AXIS uses a local-first routing strategy:

1. Personal visual memory first.
2. Low-cost visual model only when necessary.
3. At most two compressed key frames are sent for one recognition request.
4. Training insight uses compact statistics only, never workout photos/video.
5. AI failure never blocks logging: manual confirmation and local deterministic signals remain available.

## Storage

The current Web product stores workout metadata in browser LocalStorage and media in IndexedDB on the current device/browser. The hosting platform does not hold the user's workout media in this build. Cloud identity/sync can be added later without changing the product's capture model.

## Web / native boundary

Safari/PWA cannot silently write captured media into the iPhone Photos library. `platform-v7.js` defines the native bridge boundary so a future iOS shell can add direct Photos write, haptics, Passkey identity and background transfer while retaining the existing web UI logic and server-side AI routes.

## Integrity note

AXIS burns a live timestamp seal into captured frames and can burn the finalized workout record into saved media. A client-controlled device cannot provide absolute cryptographic immutability by itself; server-signed timestamps or remote append-only storage would be required for that stronger guarantee.
