# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release: **AXIS 8.14 — Evolution Objects**.
- Production `main`: `c8db7033d005565e74ce3afcb33b69bfd75d4aa0`.
- PR #65 is merged and production-sealed.
- Vercel Production is `READY` at `https://axis-five-puce.vercel.app` for that exact SHA.
- EdgeOne Production mirror is successful for the same canonical artifact.
- Live manifest is `8.14 / 8.14`, `canonical-single-runtime`; all 8.14 Evolution Object gates are sealed.
- Historical native foundation branch `axis-native-foundation-0` remains reference-only.
- Shared cross-platform identities remain `axis.domain.v1` and `axis.data.v1`; this Web release does not alter either contract.
- Web and `INDEPENDENTWU/AXIS-iOS` remain independent release shells.

## Product direction

AXIS is evolving from a training logger into a **Personal Evolution Engine**: real repeated behavior should accumulate into private, inspectable personal evolution without becoming a social feed, creator tool, generic life journal, AI chat coach, or data dashboard.

The product loop is:

`Capture / 留下` → real Encounter evidence → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

The user should not maintain another database or feel pressure to create content. Photos and short videos are evidence of time, not posts. Data-only Evolution must remain valid.

## Active change — AXIS 8.15 Media Evidence Layer

- Branch: `web-815-media-evidence`.
- PR: **#66 — AXIS 8.15 — Media Evidence Layer**.
- Base: production `main` at `c8db7033d005565e74ce3afcb33b69bfd75d4aa0`.
- Candidate public/base version: **8.15**.
- 8.13.1 remains the truthful Encounter foundation.
- 8.14 remains the Evolution Object owner.
- 8.15 adds a narrow read-only media-evidence presentation layer inside the existing Evolution Object.

### Product behavior

- Existing `frameRefs` / `clipRef` stay bound to the real Encounter that created them.
- `v814-evolution-objects` additively exposes those already-recorded refs in its read-only encounter projection.
- `app.js` exposes a narrow read-only `window.__AXIS_MEDIA_READ__` bridge over the existing `axis_v42_media` store; no media writer moves to 8.15.
- `v815-media-evidence` renders **时间证据** only when real stored media exists.
- The evidence rail represents media-bearing Encounters, not every captured frame.
- Selecting an Encounter keeps its date and factual recorded data attached to the visual evidence.
- Short video requires explicit user playback, remains muted by default, and never autoplays.
- If earliest and latest visual evidence both contain real photos, `首尾对照` shows them side-by-side inside the same Evolution surface.
- If no media exists, no empty gallery, capture nag, creator prompt, or penalty appears; the 8.14 data-only Evolution Object remains unchanged.
- The viewer itself is metric-agnostic so the same evidence primitive can later serve running, climbing, rehabilitation, dance, music, and other repeatable skill/activity domains without turning AXIS into a generic journal.

### Ownership boundary

8.15 does **not** add:

- a training/session writer;
- a new LocalStorage schema;
- an IndexedDB writer;
- uploads or automatic network requests;
- AI interpretation/scoring/advice;
- autoplay;
- BGM, templates, editing, publishing, social or ranking workflows;
- Replay generation;
- iOS-native camera/Live Photo/Watch behavior.

Media persistence remains owned by the existing recording/media store. 8.15 is read-only presentation over existing references.

## Validation for this work

Before merge, the exact PR head must prove:

1. `node build-release.mjs` produces `8.15 / 8.15`, `canonical-single-runtime`, one initial JavaScript request and zero dynamic JavaScript chunks;
2. inherited 8.13.1 and 8.14 Chromium + iPhone WebKit smokes remain green;
3. the dedicated 8.15 smoke reads real seeded IndexedDB photo/video evidence through the read-only bridge;
4. two media-bearing Encounters render as two evidence nodes even when an Encounter contains several media assets;
5. selected evidence preserves Encounter date/data context;
6. earliest/latest comparison uses real stored endpoint images only;
7. video has controls and no autoplay;
8. data-only Evolution receives no capture/creator pressure;
9. opening/scrubbing/comparing evidence does not mutate `axis_v60_state` or `axis_v8_meta`, does not call AXIS APIs, does not open a sheet, and does not overflow mobile width;
10. inherited Runtime, training, Group Plan, Live Route, Settings, catalog, repository, continuity, Vercel and EdgeOne release contracts remain green.

## Next planned stage — AXIS 8.16 Evolution Replay

8.16 may begin only after 8.15 makes media a truthful Encounter-bound substrate. Replay must be generated from real Evolution evidence, not from a creator template.

The first Replay should be intentionally constrained:

- time-compressed Evolution, not a video editor;
- factual dates/data only;
- real first / middle / latest evidence chosen from the same Evolution Object;
- no BGM requirement, motivational slogans, social publishing pressure, or fabricated missing frames;
- no Replay when evidence is insufficient to make a truthful sequence.

Longer-term identity continuity and contextual evidence should strengthen the same universal Evolution object rather than create parallel products.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/AXIS_EVOLUTION_VISION.md` and `docs/8.13.1_EVOLUTION_FOUNDATION.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Chat history is not authoritative project memory. Conversation history is supplemental only; GitHub state and these handoff documents are authoritative project memory.
