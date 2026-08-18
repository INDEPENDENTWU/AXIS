# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.1.
- Current Product main: `3d18300b26c0b38b5389e554c34bd41d39663bb9`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Production 8.12.1 core at the start of this work: `f86c16349f02`; one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio, the 8.12.1 Safari Group Plan native-button fix, and AXIS 8.13 Stage 3 read-only Live Route are inherited and must remain intact.

## Active change

**AXIS 8.12.2 — Settings simplification and visual convergence only.**

This release is intentionally narrow. It changes only `学习安排` and `云端与AI` Settings presentation/configuration. Training recording, scan/review, Group Plan, LocalStorage/IndexedDB ownership, camera/media, watermark and Reality Runtime behavior are out of scope.

The 8.12.2 product contract is:

- top-level `学习安排` / `云端与AI` remain inside the single canonical Settings sheet;
- `云端与AI` uses no artificial space around `与`, and both top-level rows have no extra divider line;
- Learning fine-tune is reduced to six non-duplicated decisions: new/review ratio, content, cadence, daily target, opportunity learning and standalone learning;
- duplicated fine-tune copies of main `强度` / `难度` controls are removed;
- 3-option controls use strict three-column equal grids; 4-option controls use 2×2 equal grids; option text may not clip or ellipsize;
- Cloud/AI is reduced to four product groups: cloud sync, AXIS AI, send scope and capability status;
- send scope uses three presets (`最小 / 平衡 / 扩展`) that write back to the existing `axis_v811_services.privacy` fields; no new service owner is created;
- capability status is presented as four concise status tiles rather than a debug-like list;
- all Settings changes leave `axis_v60_state` and `axis_v8_meta` byte-identical.

## Validation for this work

The dedicated `AXIS 8.12.2 Settings Gate` must pass in Chromium and iPhone-like WebKit and prove:

- public identity `8.12.2 / 8.12.2` with canonical single runtime, one initial JS and zero dynamic chunks;
- exact `云端与AI` label and zero top-level divider lines;
- six Learning fine-tune groups only, with no legacy duplicated fine-tune block visible;
- 3-column / 2-column geometry is equal, touch-safe and has zero text clipping at 390×844;
- Cloud/AI has exactly four groups and four capability tiles;
- service status network remains user-invoked only;
- cloud mode, AI mode and send-scope presets persist through the existing service store;
- Settings interactions do not alter training stores;
- inherited real scan/review Group Plan regression still passes in Chromium and iPhone-like WebKit.

## Next planned stage

Only after AXIS 8.12.2 is Production-verified may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**. Historical workout facts remain authoritative and immutable.
