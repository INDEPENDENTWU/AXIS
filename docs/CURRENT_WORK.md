# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release: **AXIS 8.15 — Media Evidence Layer**.
- Production `main`: `698a7008abed42c0c66216e2f197fab85e979509`.
- PR #66 is merged and production-sealed.
- Vercel Production is `READY` at `https://axis-five-puce.vercel.app` for that exact SHA.
- EdgeOne Production mirror is successful for the same canonical artifact at `https://axisfitness-mirror-9x91gveo.edgeone.cool`.
- Live manifest is `8.15 / 8.15`, `canonical-single-runtime`; all 8.15 Media Evidence gates are sealed.
- Historical native foundation branch `axis-native-foundation-0` remains reference-only.
- Shared cross-platform identities remain `axis.domain.v1` and `axis.data.v1`; this Web hotfix does not alter either contract.
- Web and `INDEPENDENTWU/AXIS-iOS` remain independent release shells.

## Product direction

AXIS is a **Personal Evolution Engine**: repeated real-world behavior accumulates into private, inspectable Evolution rather than a social feed, creator tool, generic journal, AI chat coach, or data dashboard.

The product loop remains:

`Capture / 留下` → real Encounter evidence → time accumulation → `Reveal / 发现` → Evolution → truthful Replay.

Photos and short videos are evidence of time, not posts. Data-only Evolution remains valid. Time creates the eventual personal output; the user should not have to maintain another database or perform a creator workflow.

## Active change — AXIS 8.15.1 Regression Seal

- Branch: `web-8151-coldstart-watermark-seal`.
- PR: **#67 — AXIS 8.15.1 — Cold-start + Watermark Regression Seal**.
- Base: production `main` at `698a7008abed42c0c66216e2f197fab85e979509`.
- Candidate public/base version: **8.15.1**.
- Product scope is intentionally narrow: fix three user-observed regressions before 8.16 begins.

### Regression 1 — historical Home frame during release cold start

The static `axisNowHero` introduced during the 8.8.2 compiler era contains historical default semantics such as `现在 / 准备开始 / 今天还没有训练记录 / 本周 0 分钟 / 训练 0 次`.

The existing first-paint contract already hid older `idleHome` / `activeHome` semantics until canonical runtime readiness, but did not cover this later static Hero. When a newly content-hashed `axis-core.js` had not yet executed, the browser could therefore paint the historical Hero for one frame after a deployment.

8.15.1 makes the static Hero geometry-only before canonical state resolution:

- `#axisNowHero` is hidden until `data-axis-home-ready="1"`;
- `renderHomeState()` is the only owner that commits `data-axis-home-ready="1"` after reading local canonical state;
- the page does not reveal historical business semantics merely because HTML has arrived;
- no storage migration, artificial loading screen, timer, network dependency, or state reset is introduced.

### Regression 2 — duplicate saved-photo watermark

The saved photo could contain three visual layers at once:

1. the old `app.js` photo compositor, typically visible at lower-left;
2. the current factual `AXIS / RECORD` card from `v8710-watermark`;
3. a historical large centered `AXIS` brand/divider retained in the current compositor.

The 8.8.4 compatibility layer attempted to suppress the old compositor by writing `photoMode=raw` to persisted state immediately before save. `app.js` evaluates its already-loaded in-memory state during `finalizeFrame()`, so persisted-only suppression was not a reliable ownership boundary.

8.15.1 resolves the physical ownership instead of timing around it:

- `app.js` photo `finalizeFrame()` becomes raw handoff only;
- `v8710-watermark` is the sole saved-photo compositor;
- the current factual `AXIS / RECORD` card is preserved;
- the historical lower-left photo compositor is retired;
- the historical large centered `AXIS` brand and center divider are retired;
- the temporary persisted raw-mode suppression hack is retired;
- video watermark ownership is intentionally unchanged in this hotfix.

### Regression 3 — Media Evidence date switch flashes another layer

Inside Trends → Evolution Object → 时间证据, selecting another real Encounter previously called `renderEvidence()` by removing the whole `#v815Evidence` section, revoking its current object URLs, mounting a new empty stage, and then asynchronously reading the next local asset. The loading style also reduced the stage opacity to `0.72`.

That created two visible discontinuities on mobile Safari/WebKit: the underlying Trends composition could briefly show through while the section was absent, and the evidence surface visibly pulsed darker on every local switch.

8.15.1 changes Media Evidence to a stable in-place swap:

- switching Encounter/date, photo/video asset, or first/latest comparison keeps the same `#v815Evidence` section mounted;
- the currently visible evidence remains in the stage while the next local IndexedDB asset resolves;
- photo/video is warmed before DOM commit so replacement does not intentionally introduce an empty frame;
- the stage keeps opacity `1` during local loading;
- old object URLs are retired only after the replacement evidence has committed;
- the behavior stays read-only, local-first, no-autoplay, no sheet/modal and no new persistence/network owner.

## Validation for this work

For **AXIS 8.15.1**, the exact PR head must prove:

1. `node build-release.mjs` produces `8.15.1 / 8.15.1`, `canonical-single-runtime`, one initial JavaScript request and zero dynamic JavaScript chunks;
2. a dedicated Chromium + iPhone WebKit smoke holds `axis-core.js` during cold start and proves `axisNowHero` cannot paint before canonical Home state commits;
3. after release, persisted local history resolves to canonical current Home semantics rather than the static `准备开始` placeholder;
4. final compiled runtime contains no historical centered `A X I S` or `AXIS` raster and no center divider draw;
5. final compiled runtime retains the current factual `AXIS / RECORD` card;
6. `app.js` photo finalization no longer rasterizes a watermark before the current compositor;
7. a dedicated Chromium + iPhone WebKit Media Evidence swap smoke artificially delays the next local media read and proves the same evidence section/stage remains mounted, the previous visual remains visible, opacity stays `1`, geometry does not jump, and no sheet/page layer is exposed;
8. existing four watermark switches, precise location behavior, WebKit-safe media store, and the full 8.15 Media Evidence contract remain green;
9. inherited Runtime, training, Group Plan, Live Route, Settings, catalog, Evolution, repository and continuity contracts remain green;
10. after merge, exact-SHA Vercel and EdgeOne Production plus real EdgeOne Chromium / iPhone WebKit must run the same cold-start, watermark and stable-evidence regressions before the hotfix is sealed.

## Next planned stage — AXIS 8.16 Evolution Replay

8.16 starts only from the production-sealed 8.15.1 baseline. It is the first strong **Reveal** generated from the truthful `Encounter → Evolution → Media Evidence` substrate.

The first Replay is deliberately constrained:

- a time-compressed Evolution experience, not a video editor;
- derived only from real Encounter-bound evidence of one Evolution Object;
- preserve encounter identity, chronological order, dates and factual recorded data;
- select a restrained first / middle / latest sequence where enough real visual evidence exists;
- no fabricated missing imagery, hallucinated historical frames, motivational copy, BGM requirement, creator templates, publishing or social pressure;
- explicit user playback only; no autoplay;
- if evidence is insufficient for a truthful sequence, Replay is unavailable rather than fabricated;
- Web 8.16 proves the semantic/product Reveal first; native Camera / Live Photo / Watch / HealthKit remain later iOS work.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/AXIS_EVOLUTION_VISION.md` and `docs/8.13.1_EVOLUTION_FOUNDATION.md`;
4. active PR/branch and exact SHA;
5. exact failing test/log before making a fix.

Chat history is not authoritative project memory. Conversation history is supplemental only; GitHub state and these handoff documents are authoritative project memory.
