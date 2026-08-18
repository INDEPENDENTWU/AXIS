# Current Release

## AXIS 8.12.2

8.12.2 is the current product baseline candidate.

It is a narrowly scoped Settings refinement over AXIS 8.12.1. Training recording, scan/review, Group Plan ownership and commit behavior, LocalStorage/IndexedDB training state, camera/media, watermark, AXIS 8.12 Language Studio, State Field, and AXIS 8.13 Stage 3 read-only Live Route remain inherited and unchanged.

The release redesigns only `学习安排` fine-tune and `云端与AI` inside the existing canonical Settings sheet. The goal is lower friction, strict mobile geometry, and one consistent AXIS Settings visual language without creating a new product/state owner.

This file is the handoff entry point for future product and engineering work. Do not reconstruct current behavior by reading version-like source filenames in numerical order.

## Production topology

AXIS ships a canonical single browser runtime:

- one external JavaScript runtime: `axis-core.js?v=<content hash>`;
- one stylesheet: `axis-style.css?v=<content hash>`;
- zero dynamic historical runtime chunks;
- no runtime fallback to a previous public product version.

`node build-release.mjs` is the only release build entry point.

The checked-in `release-contract.json` remains a compatibility-compiler input. Release-compat stages advance that input through inherited release lines; the final generated `axis-build.json` must report the 8.12.2 identity and all inherited/current gates.

## 8.12.2 release contract

The final artifact must report:

- `version: 8.12.2`;
- `baseVersion: 8.12.2`;
- architecture `canonical-single-runtime`;
- one initial JavaScript request and zero dynamic JavaScript chunks;
- inherited AXIS 8.12 Language Studio contract unchanged;
- inherited AXIS 8.12.1 native Safari Group Plan activation unchanged;
- inherited AXIS 8.13 Stage 3 Live Route present and read-only;
- Group Plan still committing only through the canonical `v61.js` recording owner;
- no new training/storage/media/timer/network owner.

### Learning Settings contract

`学习安排` stays inline in the single canonical Settings sheet.

The primary learning decisions remain the existing 8.12 purpose/method/intensity/difficulty/dialogue-depth model. Fine-tune is reduced to six non-duplicated decisions only:

- new/review ratio;
- content;
- cadence;
- daily target;
- opportunity learning;
- standalone learning.

Fine-tune no longer repeats primary intensity/difficulty controls. Three-option controls use equal three-column grids; four-option controls use equal 2×2 grids. At the release-blocking 390×844 viewport, labels must not clip, ellipsize, overlap, or create horizontal page overflow.

Existing learning data remains owned by `axis_v89_speak`; 8.12.2 introduces no second learning store.

### Cloud/AI Settings contract

The canonical top-level label is exactly `云端与AI` with no artificial whitespace. `学习安排` and `云端与AI` add no extra divider line around their outer Settings rows.

Cloud/AI is reduced to four user-facing groups:

- cloud sync;
- AXIS AI;
- send scope;
- capability status.

Send scope is exposed as `最小 / 平衡 / 扩展` and maps back to the existing `axis_v811_services.privacy` fields; it is not a new storage model. Capability status is shown as four concise status tiles instead of a debug-like list. Service status network access remains explicitly user-invoked; opening normal Settings must not start status requests.

### Inherited field contract

- Group Plan remains a native browser button and preserves normal Safari/WebKit touch→click activation.
- Applying Group Plan still delegates to `window.__AXIS_RECORDING__.applyPlan`; `v61.js` remains the authoritative recording writer.
- The real scan/review → visible canonical catalog → Group Plan → save path remains release-blocking in Chromium and iPhone-like WebKit.
- Pause owns rest timing; completing a set alone does not imply rest.

## Language Studio inheritance

8.12 Language Studio semantics remain:

- 25,716 total available units;
- 19,584 new 8.12 units, 4,896 per supported language;
- available units: English 10,632; Japanese 5,028; Korean 5,028; Chinese 5,028;
- dialogue depths of 4, 8 and 12 turns;
- seven-stage learning loop: meaning, noticing, retrieval, response, shadow, transform, review;
- no required network, autoplay owner, or training-state ownership.

## Current ownership map

| Domain | Current authority / contract |
|---|---|
| Base workout state | `app.js` / `axis_v60_state` |
| Strength draft and set-level recording | `v61.js` + `axis_v8_meta` |
| Group Plan commit | `window.__AXIS_RECORDING__` / `v61.js`; presentation layers do not become writers |
| Local media | IndexedDB media store; browser/native platform adapter at the OS boundary |
| Custom equipment persistence | base profile/custom equipment state; shared canonical editor path |
| Active training execution | inherited active-session owner; no duplicate pause/finish/countdown path |
| Catalog/search | converged canonical catalog/search presentation |
| Watermark | converged watermark settings, resolver and final media owner |
| Reports | converged current report owner |
| State Field / trends | inherited 8.11 State Field contract; local evidence, no synthetic fitness score |
| Local Vision | local visual memory/recognition first; network verification optional |
| AI configuration | server-side provider config; browser never owns provider secrets |
| Cloud/sync | `axis_v811_services`; local state remains authoritative |
| Language Studio | `axis_v89_speak` inherited learning state + 8.12 Language Studio content/logic; no training ownership |
| AXIS 8.13 Stage 3 | read-only Continue + Live Route presentation; no recording/storage/network ownership |
| Platform-only capabilities | `window.AXISPlatform` / optional `window.AXISNative` bridge |

When a future change replaces one of these owners, the previous writer must be retired in the same change.

## Current product behavior to preserve

- A workout can be recorded and finished offline.
- AI failure never blocks manual/local recording.
- Existing LocalStorage and IndexedDB history remains readable.
- High-frequency recording does not rebuild more UI than necessary.
- No duplicate semantic action appears, even transiently.
- First interactive paint already represents the intended product state.
- Training and Language Studio remain independent ownership domains.
- Chromium and iPhone-like WebKit behavior are both release-blocking.
- Real scan/review recording and Group Plan interaction are release-blocking, not only Quick Record.
- Settings changes may not mutate `axis_v60_state` or `axis_v8_meta`.

## Release verification

A release candidate is incomplete until the same source candidate has passed the relevant contract and real-browser gates. For 8.12.2 this includes the dedicated Chromium + iPhone-like WebKit Settings gate and the inherited real Group Plan field path.

Production correctness is separate from deployment completion. The fixed public deployment must serve the intended source SHA, canonical manifest and immutable assets. Both the general Production browser gate and the 8.12.x fixed-Production gate must accept 8.12.2 and run the new Settings regression before the release is considered sealed.

## Current architecture debt

Known debt that should be reduced rather than extended:

- a long chain of exact-signature `prepare-*` compatibility transforms;
- release truth that is harder to understand in source than in the generated artifact;
- historical modules remaining as executable compiler inputs;
- duplicated serverless deployment surfaces;
- domain decisions still coupled too closely to browser state/DOM in several areas;
- developer tool versions spread across workflows instead of one conventional dependency manifest.

These are migration targets, not reasons for a rewrite.

## Next release direction

After 8.12.2 is Production-sealed, controlled AXIS 8.13 work may continue from the already shipped Stage 3 boundary. Stage 4 Reality Actions must not transfer factual recording ownership.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md) and [ROADMAP.md](ROADMAP.md).
