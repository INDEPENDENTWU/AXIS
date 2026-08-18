# Current Release

## AXIS 8.12.1

8.12.1 is the current product baseline.

It is a field hotfix over AXIS 8.12. The Language Studio corpus, learning ownership, State Field, cloud/AI ownership, local-first recording model, and AXIS 8.13 Stage 3 read-only Live Route semantics are preserved. The release fixes two real iPhone Safari issues: Settings presentation drift and an unreliable Group Plan tap target on the normal scan/review recording path.

This file is the handoff entry point for future product and engineering work. Do not reconstruct current behavior by reading version-like source filenames in numerical order.

## Production topology

AXIS ships a canonical single browser runtime:

- one external JavaScript runtime: `axis-core.js?v=<content hash>`;
- one stylesheet: `axis-style.css?v=<content hash>`;
- zero dynamic historical runtime chunks;
- no runtime fallback to a previous public product version.

`node build-release.mjs` is the only release build entry point.

The checked-in `release-contract.json` remains a compatibility-compiler input. Release-compat stages advance that input through inherited release lines; the final generated `axis-build.json` must report the 8.12.1 identity and all inherited/current gates.

## 8.12.1 release contract

The final artifact must report:

- `version: 8.12.1`;
- `baseVersion: 8.12.1`;
- architecture `canonical-single-runtime`;
- one initial JavaScript request and zero dynamic JavaScript chunks;
- inherited AXIS 8.12 Language Studio contract unchanged;
- inherited AXIS 8.13 Stage 3 Live Route present and read-only;
- Group Plan still committing only through the canonical `v61.js` recording owner;
- no new training/storage/media/timer/network owner.

8.12 Language Studio semantics remain:

- 25,716 total available units;
- 19,584 new 8.12 units, 4,896 per supported language;
- available units: English 10,632; Japanese 5,028; Korean 5,028; Chinese 5,028;
- dialogue depths of 4, 8 and 12 turns;
- seven-stage learning loop: meaning, noticing, retrieval, response, shadow, transform, review;
- no required network, autoplay owner, or training-state ownership.

### Field hotfix contract

- `学习安排` and `云端与 AI` remain inline inside the single canonical Settings sheet.
- Their outer gate does not introduce an extra section divider.
- Settings typography follows the native AXIS Settings rhythm instead of micro text.
- Primary option controls use touch-safe 40–44 px geometry with strict grid alignment.
- Cloud/AI status network remains explicit user-invoked only.
- Group Plan uses a real native `button` touch target of at least 44 px rather than retrofitting a text node as an interaction surface.
- Applying Group Plan still delegates to `window.__AXIS_RECORDING__.applyPlan`; 8.12.1 is not a recording owner.
- The real scan/review path is release-blocking in both Chromium and iPhone-like WebKit.

## Current ownership map

| Domain | Current authority / contract |
|---|---|
| Base workout state | `app.js` / `axis_v60_state` |
| Strength draft and set-level recording | `v61.js` + `axis_v8_meta` |
| Group Plan commit | `window.__AXIS_RECORDING__` / `v61.js`; 8.12.1 only owns the touch presentation |
| Local media | IndexedDB media store; browser/native platform adapter at the OS boundary |
| Custom equipment persistence | base profile/custom equipment state; shared canonical editor path |
| Active training execution | inherited active-session owner; no duplicate pause/finish/countdown path |
| Catalog/search | converged canonical catalog/search presentation |
| Watermark | converged watermark settings, resolver and final media owner |
| Reports | converged current report owner |
| State Field / trends | inherited 8.11 State Field contract; local evidence, no synthetic fitness score |
| Local Vision | local visual memory/recognition first; network verification optional |
| AI configuration | server-side provider config; browser never owns provider secrets |
| Cloud/sync | local state remains authoritative; sync contract is mirror/convergence infrastructure |
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

## Release verification

A release candidate is incomplete until the same source candidate has passed the relevant contract and real-browser gates. For 8.12.1 this includes the dedicated Chromium + iPhone-like WebKit hotfix gate reproducing the normal scan/review Group Plan path.

Production correctness is separate from deployment completion. The fixed public deployment must serve the intended source SHA, canonical manifest and immutable assets, and the dedicated 8.12.1 fixed-Production gate must pass before the release is considered complete.

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

After 8.12.1 is Production-sealed, controlled AXIS 8.13 work may continue from the already shipped Stage 3 boundary. Stage 4 Reality Actions must not transfer factual recording ownership.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md) and [ROADMAP.md](ROADMAP.md).
