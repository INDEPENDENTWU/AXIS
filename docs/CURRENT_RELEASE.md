# Current Release

## AXIS 8.12.3

8.12.3 is the current release candidate.

It is a narrowly scoped learning-interaction refinement over AXIS 8.12.2. Training recording, scan/review, Group Plan ownership and commit behavior, LocalStorage/IndexedDB training state, camera/media, watermark, AXIS 8.12 Language Studio content, State Field, Cloud/AI storage ownership, and AXIS 8.13 Stage 3 read-only Live Route remain inherited and unchanged.

The release removes user-facing learning-mode complexity that no longer serves the product: `学法`, `跟读`, `影子`, shadow auto-record, and A/B comparison are retired from the current product surface. Learning practice becomes one consistent local-first interaction: listen to the original, record yourself, and replay your recording.

This file is the handoff entry point for future product and engineering work. Do not reconstruct current behavior by reading version-like source filenames in numerical order.

## Production topology

AXIS ships a canonical single browser runtime:

- one external JavaScript runtime: `axis-core.js?v=<content hash>`;
- one stylesheet: `axis-style.css?v=<content hash>`;
- zero dynamic historical runtime chunks;
- no runtime fallback to a previous public product version.

`node build-release.mjs` is the only release build entry point. The checked-in `release-contract.json` remains a compatibility-compiler input; final generated release truth is `axis-build.json`.

## 8.12.3 release contract

The final artifact must report:

- `version: 8.12.3`;
- `baseVersion: 8.12.3`;
- architecture `canonical-single-runtime`;
- one initial JavaScript request and zero dynamic JavaScript chunks;
- inherited AXIS 8.12 Language Studio corpus and content contract intact;
- inherited AXIS 8.12.1 native Safari Group Plan activation intact;
- inherited AXIS 8.12.2 inline Settings ownership intact;
- inherited AXIS 8.13 Stage 3 Live Route present and read-only;
- no new training/storage/media/timer/network owner.

### Settings contract

`学习安排` and `云端与AI` remain inside the single canonical Settings sheet and must use the same native row alignment, text baseline, summary alignment, chevron placement and touch geometry as neighboring Settings rows.

Learning exposes four primary decisions only:

- 目标;
- 强度;
- 难度;
- 对话深度.

The former `学法` selector is retired. Existing stored method values are compatibility data only and do not control the current UI. Fine-tune remains progressive and reduced; explanatory micro-copy that does not change a decision is removed.

Cloud/AI keeps the existing four-group 8.12.2 structure and the existing `axis_v811_services` store. Nonessential explanatory subcopy is removed; service status network access remains explicitly user-invoked.

### Learning practice contract

Current learning cards expose exactly one simple local practice surface:

- `听原声` — best-available local system voice;
- `录音` — explicit-user-action microphone capture;
- `听我的` — local replay of the current in-memory recording.

Current product UI must not expose `跟读`, `影子`, `开始影子 + 录音`, or `A/B 对比`. There is no practice-mode selector. Recording is ephemeral, is not uploaded, is not persisted as training state, and is discarded with the learning-card lifetime. No learning audio autoplays.

Historical 8.10.x source and manifest inheritance may record that those releases once contained echo/shadow workflows; 8.12.3 adds explicit retirement gates and no longer provides a current user-facing owner for them.

### Ownership contract

| Domain | Current authority / contract |
|---|---|
| Base workout state | `app.js` / `axis_v60_state` |
| Strength draft and set-level recording | `v61.js` + `axis_v8_meta` |
| Group Plan commit | `window.__AXIS_RECORDING__` / `v61.js` |
| Learning state | `axis_v89_speak` |
| Learning temporary microphone/audio | page-memory practice layer; no upload/persistence owner |
| Cloud/AI preferences | `axis_v811_services`; local-first, explicit status network |
| Local media | existing IndexedDB media owner; unchanged by learning practice |
| AXIS 8.13 Stage 3 | read-only Continue + Live Route presentation |

A future change that transfers an owner must retire the previous writer in the same change.

## Language Studio inheritance

8.12 Language Studio content remains available:

- 25,716 total available units;
- 19,584 new 8.12 units, 4,896 per supported language;
- available units: English 10,632; Japanese 5,028; Korean 5,028; Chinese 5,028;
- dialogue depths of 4, 8 and 12 turns;
- no required network, autoplay owner, or training-state ownership.

The historical seven-stage teaching metadata remains content compatibility data. 8.12.3 does not surface the retired shadowing step as a user-selectable practice mode.

## Current product behavior to preserve

- A workout can be recorded and finished offline.
- AI failure never blocks manual/local recording.
- Existing LocalStorage and IndexedDB history remains readable.
- Training and Language Studio remain independent ownership domains.
- Real scan/review recording and Group Plan interaction remain release-blocking in Chromium and iPhone-like WebKit.
- Settings or learning practice may not mutate `axis_v60_state` or `axis_v8_meta`.
- Learning listening/recording is always explicit user action; no autoplay and no audio upload.

## Release verification

A release candidate is incomplete until the same source candidate passes the dedicated Chromium + iPhone-like WebKit 8.12.3 gate and inherited product gates. The dedicated gate verifies native Settings alignment, retired helper copy/method UI, simple listen-record-replay behavior, local-only microphone ownership and training-store non-interference.

Production correctness is separate from deployment completion. The fixed public deployment must serve the intended merged source SHA, canonical manifest and immutable assets, with clean Production runtime errors before 8.12.3 is considered sealed.

## Current architecture debt

Known debt to reduce rather than extend:

- a long chain of exact-signature `prepare-*` compatibility transforms;
- historical modules remaining as executable compiler inputs after current owners have retired their UI;
- release truth that is harder to understand in source than in the generated artifact;
- developer tool versions spread across workflows instead of one conventional dependency manifest.

These are migration targets, not reasons for a rewrite.

## Next release direction

After 8.12.3 is Production-sealed, controlled AXIS 8.13 work may continue from the already shipped Stage 3 boundary. Stage 4 Reality Actions must not transfer factual recording ownership.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md) and [ROADMAP.md](ROADMAP.md).
