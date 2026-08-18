# Current Release

## AXIS 8.12.3

8.12.3 is the current release candidate.

The sealed learning-interaction refinement over AXIS 8.12.2 remains intact. The current maintenance boundary adds a local-first personal equipment / movement photo gallery, fixes repeated equipment-picker return behavior in photo recording and Quick Record, and refines the requested Settings separators / Training Report entry. Group Plan ownership and commit behavior, workout history semantics, camera/watermark recording behavior, AXIS 8.12 Language Studio content, State Field, Cloud/AI storage ownership, and AXIS 8.13 Stage 3 read-only Live Route remain inherited and unchanged.

The learning release removes user-facing learning-mode complexity that no longer serves the product: `学法`, `跟读`, `影子`, shadow auto-record, and A/B comparison are retired from the current product surface. Learning practice remains one consistent local-first interaction: listen to the original, record yourself, and replay your recording.

This file is the handoff entry point for future product and engineering work. Do not reconstruct current behavior by reading version-like source filenames in numerical order.

## Current 8.12.3 maintenance boundary

The personal equipment layer is additive and must not become a second catalog or media owner:

- native equipment / movement IDs and custom definition IDs remain authoritative;
- workout events keep their existing `equipmentId` and training `frameRefs` relationships;
- dedicated user-added equipment photos are stored as blobs in the existing `axis_v42_media` / `media` IndexedDB owner;
- `profile.equipmentPhotos` stores only small photo references, timestamps, source metadata and visual fingerprints;
- explicitly confirmed equipment photos also feed the existing `profile.memories` visual-recognition path;
- each equipment / movement can keep up to 10 dedicated photos from camera or photo library;
- a dedicated equipment photo is preferred as the personal-library cover; an existing historical training photo is fallback only; no photo means the original text-first row;
- any dedicated photo can be promoted to cover and dedicated photos can be removed independently;
- deleting a dedicated equipment photo deletes that dedicated media ref and its confirmed visual-memory entry only; it never deletes a historical training frame;
- personal-library removal preserves workout history.

Equipment selection now has one explicit return context. Photo recording and Quick Record use the same canonical picker route so first selection, picker back/reopen, a new recording re-entry, and Quick Record → `其他器械 / 运动` → expanded catalog all return to the correct recording editor instead of falling through to Home. The canonical picker emits an explicit equipment-selected event to the existing v61 recording reconcile owner; the historical DOM observer remains fallback only.

The current Settings maintenance removes the requested bottom separators from `学习安排`, `云端与AI`, `提醒与声音`, and `训练报告`, including protection against later compatibility styles restoring those borders. `训练报告` remains the same report action / report generator, but its Settings entry is presented as one compact, distinct whole-row control.

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
- no second training or media database owner.

### Settings contract

`学习安排` and `云端与AI` remain inside the single canonical Settings sheet and must use the same native row alignment, text baseline, summary alignment, chevron placement and touch geometry as neighboring Settings rows. Their requested bottom separators are absent in the current maintenance surface. The same divider-free rule applies to the visible `提醒与声音` and `训练报告` entries.

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
| Personal equipment photo refs | `profile.equipmentPhotos`; references only, no blobs |
| Personal visual recognition | existing `profile.memories`, including confirmed equipment-photo fingerprints |
| Learning state | `axis_v89_speak` |
| Learning temporary microphone/audio | page-memory practice layer; no upload/persistence owner |
| Cloud/AI preferences | `axis_v811_services`; local-first, explicit status network |
| Local media | existing `axis_v42_media` IndexedDB / `media` store; training and dedicated equipment photos share the same owner |
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
- Repeated equipment selection must remain in the recording flow rather than fall through to Home.
- Quick Record `其他器械 / 运动` must return to the Quick editor after canonical or expanded-catalog selection.
- Dedicated equipment photos may not create a second media store or mutate/delete historical training frames.
- Dedicated equipment-photo fingerprints may improve personal recognition through the existing visual-memory owner only.
- Settings or learning practice may not mutate training ownership outside their intended user actions.
- Learning listening/recording is always explicit user action; no autoplay and no audio upload.

## Release verification

A release candidate is incomplete until the same source candidate passes the dedicated Chromium + iPhone-like WebKit 8.12.3 gate and inherited product gates. In addition to the inherited Learning, Settings and Group Plan checks, the maintenance gate exercises repeated photo-record picker back/re-entry, repeated Quick Record `其他器械 / 运动` selection, multi-photo local persistence, confirmed visual-memory refs, cover reorder, dedicated-photo deletion, all four requested visible divider removals, and Training Report click-through.

The pre-cleanup candidate passed those maintenance scenarios in both Chromium and iPhone-like WebKit. The final cleaned exact head must repeat the same gate before merge; diagnostic-only files are not part of the final maintenance boundary.

Production correctness is separate from deployment completion. The fixed public deployment must serve the intended merged source SHA, canonical manifest and immutable assets, with clean Production runtime errors before 8.12.3 is considered sealed.

## Current architecture debt

Known debt to reduce rather than extend:

- a long chain of exact-signature `prepare-*` compatibility transforms;
- historical modules remaining as executable compiler inputs after current owners have retired their UI;
- release truth that is harder to understand in source than in the generated artifact;
- developer tool versions spread across workflows instead of one conventional dependency manifest.

These are migration targets, not reasons for a rewrite.

## Next release direction

After this 8.12.3 maintenance boundary is Production-verified, controlled AXIS 8.13 work may continue from the already shipped Stage 3 boundary. Stage 4 Reality Actions must not transfer factual recording ownership.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md) and [ROADMAP.md](ROADMAP.md).
