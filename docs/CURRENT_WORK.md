# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline

- **AXIS 8.17.1 — Active Truth + Capture Polish is Production-sealed.**
- Exact sealed runtime `main` SHA: `0cd7884b83289d052ea6450a7916ca95578246f6`.
- Vercel Production served that exact GitHub revision and reported **success**.
- EdgeOne Production Mirror run `32579444996` built the exact main artifact, required Vercel/local canonical parity, deployed the exact prebuilt artifact, verified authenticated EdgeOne/Vercel API parity, and passed real EdgeOne Chromium + iPhone WebKit release flows.
- GitHub combined status for that exact runtime SHA: `Vercel = success`, `EdgeOne Production = success`.

## 8.17.1 sealed product contract

8.17.1 is the hardening bridge between 8.17 Interaction Convergence and the larger 8.18 Evolution Library work.

### Active Truth

- A running equipment / sport item has one adjustment opportunity.
- After adjustment, the effective values become the current factual truth immediately.
- Active UI, timeline, detail, evidence context and downstream projections consume the effective/final truth rather than continuing to display only the initial plan.
- Initial values may remain as audit/context, but they may not pollute the current or final record.

### Capture / media integrity

- Camera / recorder / persistence ownership remains in `app.js`.
- Media database remains `axis_v42_media`; there is no second database or object store.
- Clean photo source: `sourceFrameRefs[]` → `S-*`.
- Clean video source: `sourceClipRef` → `SV-*`.
- Canonical presentation refs remain `frameRefs[]` → `F-*` and `clipRef` → `V-*`.
- `window.__AXIS_MEDIA_SOURCE__` is read-only and resolves clean source first with canonical fallback for historical records.
- Watermark regeneration reads clean source first and writes only the canonical derivative.
- Media Evidence reads clean source first, remains read-only and gains no persistence/network/AI ownership.
- Preview camera facing can be switched safely without introducing a second capture lifecycle. Full mid-recording multi-camera sequence work remains downstream and must not be faked through unsafe MediaRecorder track replacement.

### Settings / archive hardening

- Scan sampling remains app-owned `3秒 / 5秒`; visible Settings replacement cannot detach the writer.
- `资料与收纳` selection is repaint-safe.
- Single selection, `全选 ↔ 取消全选`, partial-selection label recovery and deletion semantics remain one coherent state model.

### Sound semantics

- Existing v8710 automatic sound ownership remains authoritative.
- Reaching an estimated target is a reminder, not factual completion and must not auto-stop the item.
- Actual completion remains a distinct user-confirmed state.
- No duplicate automatic sound owner was introduced in 8.17.1.

## Release validation record

Before merge, PR #75 passed:

- deterministic canonical release build;
- 8.17.1 source-media ownership contract;
- Chromium source-first photo/video/legacy-fallback smoke;
- iPhone WebKit source-first photo/video/legacy-fallback smoke;
- inherited 8.17 Interaction Convergence;
- inherited 8.16 Capture + Comparative Evidence;
- inherited 8.15.1 stable Evidence swap;
- inherited 8.15 Media Evidence behavior;
- Repository Contract;
- Work Continuity Contract.

No timeout inflation, assertion weakening, second persistence owner or product rollback was used to obtain the seal.

## Next exact stage — AXIS 8.18

**AXIS 8.18 — Evolution Library / Personal Object Shelf** is now the active next product stage.

The next scaling problem is not folders or category tabs. Repeated real-world things should settle into stable personal Evolution Objects that remain understandable after hundreds or thousands of Encounters.

8.18 should build on the sealed 8.17.1 factual foundations:

- effective/final Encounter truth;
- clean-source Evidence;
- factual recurrence / recency / span / media density;
- one object-first model across training, sport and future domains;
- no Replay/editor scope pulled forward prematurely.

After the Object model is trustworthy, Evidence Sequence / safe mid-recording camera segmentation can evolve in an 8.18.x layer, followed later by truthful Evolution Replay.

See `AXIS_817_818_DIRECTION.md`, `AXIS_8171_SOURCE_MEDIA.md`, `CURRENT_RELEASE.md`, `PRODUCT.md` and `ARCHITECTURE.md`.
