# Current Release

## AXIS 8.12

8.12 is the current product baseline.

The release extends the inherited 8.11 product with Language Studio while preserving the local-first training, recording, State Field and cloud/AI ownership contracts.

This file is the handoff entry point for future product and engineering work. Do not reconstruct current behavior by reading version-like source filenames in numerical order.

## Production topology

AXIS ships a canonical single browser runtime:

- one external JavaScript runtime: `axis-core.js?v=<content hash>`;
- one stylesheet: `axis-style.css?v=<content hash>`;
- zero dynamic historical runtime chunks;
- no runtime fallback to a previous public product version.

`node build-release.mjs` is the only release build entry point.

The checked-in `release-contract.json` is currently a compatibility-compiler input. Release-compat stages advance that input through inherited release lines; the final generated `axis-build.json` is the artifact that must report the 8.12 identity and all inherited/current gates. This arrangement is supported for compatibility, but reducing this indirection is a future architecture goal.

## 8.12 release contract

The final artifact must report:

- `version: 8.12`;
- `baseVersion: 8.12`;
- architecture `canonical-single-runtime`;
- inherited 8.11 release contract present;
- 25,716 total available Language Studio units;
- 19,584 new 8.12 units, 4,896 per supported language;
- available units: English 10,632; Japanese 5,028; Korean 5,028; Chinese 5,028;
- dialogue depths of 4, 8 and 12 turns;
- the seven-stage learning loop: meaning, noticing, retrieval, response, shadow, transform, review;
- Language Studio requiring no network and owning neither autoplay nor training state.

## Current ownership map

| Domain | Current authority / contract |
|---|---|
| Base workout state | `app.js` / `axis_v60_state` |
| Strength draft and set-level recording | `v61.js` + `axis_v8_meta` |
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

## Release verification

A release candidate is incomplete until the same source candidate has passed the relevant contract and real-browser gates. The repository currently includes release-line, runtime, surface, Chromium, WebKit, deployment and fixed-public-alias workflows.

Production correctness is separate from deployment completion. The fixed public deployment must serve the intended source SHA, canonical manifest and immutable assets before a release is considered complete.

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

8.13 is planned as **Runtime**.

The first implementation is a deterministic, UI-independent projection engine running in shadow mode. Existing recording/media/history owners stay in place while continuation, live route, reality actions and time budget are proven and migrated gradually.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md) and [ROADMAP.md](ROADMAP.md).
