# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.3.
- Product main at the start of this maintenance work: `64890d6d869cab83aecd73d9b345617a26ca2785`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- AXIS 8.12.3 Learning Settings simplification and `听原声 / 录音 / 听我的` practice surface are sealed and inherited.
- AXIS 8.12 Language Studio corpus, AXIS 8.12.1 Safari Group Plan native-button fix, AXIS 8.12.2 Settings ownership, canonical local visual memory/media ownership, and AXIS 8.13 Stage 3 read-only Live Route are inherited and must remain intact.
- Existing workout history in `axis_v60_state`, training metadata in `axis_v8_meta`, and canonical IndexedDB media remain authoritative. This maintenance work does not create a second training or media store.

## Active change

**AXIS 8.12.3 maintenance follow-up — personal equipment presentation and exact native Settings-row geometry only.**

The scope is deliberately narrow and compatibility-first:

- keep `我的器械` as the history-backed personal-use library already shipped in 8.12.3, with native catalog IDs and custom definition IDs remaining authoritative;
- keep existing `profile.memories` for visual-recognition memory and existing event `frameRefs` for media references; there is no new photo store and no automatic upload;
- show a photo thumbnail only when a real historical media reference exists and can be resolved through the canonical local media store;
- remove the single-character pseudo-thumbnail fallback entirely; an item without a real photo uses the normal text-first AXIS list row, matching the pre-polish readable presentation;
- if a historical media reference no longer resolves locally, degrade immediately to the same normal text row instead of leaving an empty image box;
- preserve the existing compact usage / recent-use metadata, left-swipe single removal and explicit `选择` multi-select removal;
- preserve all historical workout records when an item is removed from `我的器械`;
- leave the already verified Group Plan launcher, repeat-open, calculation and `window.__AXIS_RECORDING__.applyPlan(...)` ownership unchanged;
- make `学习安排` and `云端与AI` use the same 60px row height and typography as the native Settings rows, then measure their label/chevron columns from the real `个人档案` row rather than from a hard-coded inset;
- apply a second measured chevron correction after layout so browser glyph geometry cannot leave the two special rows a few pixels outside the native arrow column;
- preserve the existing Settings colors, spacing, interaction and progressive-disclosure behavior.

Explicitly unchanged: native catalog semantics, event `equipmentId` history relationships, trend aggregation, muscle relationships, camera capture, watermark ownership, Cloud/AI store, learning store, active-session timers, Group Plan behavior, State Field, Reality Runtime, Live Route ownership, public version and deployment topology.

## Validation for this work

The dedicated `AXIS 8.12.3 Field Polish Gate` runs in Chromium and iPhone-like WebKit and must prove:

- public identity remains `8.12.3 / 8.12.3` with canonical single runtime and inherited release contracts intact;
- a native catalog item with historical use and a custom item both appear in `我的器械` without duplicating their underlying definitions;
- a valid existing event photo reference remains surfaced through the canonical media reference path;
- no-photo items remain readable as normal text-first rows and never synthesize the first character of the equipment name as an image placeholder;
- a missing local media object degrades to the same text-first row without changing the historical record;
- `选择` mode can select multiple items and exposes one batch-removal action; single-row removal ownership remains present for swipe interaction;
- Group Plan inherited regressions remain green and this follow-up introduces no Group Plan owner;
- at a 417 CSS px iPhone-like viewport, `学习安排 / 云端与AI` labels and chevrons resolve to the same native columns as `个人档案` within the existing tight geometry tolerance;
- browser execution produces no new page errors and the repository continuity contract remains green.

## Storage / ownership truth

- Workout/session facts remain in localStorage key `axis_v60_state`.
- Training metadata remains in `axis_v8_meta`.
- Actual captured photo/video blobs remain in the existing IndexedDB database `axis_v42_media`, object store `media`.
- Workout events store only media references such as `frameRefs` / `clipRef` plus byte metadata; `我的器械` reuses those references rather than copying media.
- `profile.memories` is visual-recognition fingerprint memory, not the image blob store.
- Media remains local-first and is not automatically uploaded or copied into the system photo library.

## Next planned stage

First merge and Production-verify this narrow 8.12.3 follow-up. Do not begin broader AXIS 8.13 product migration until the real mobile Production surface confirms:

- no-photo personal equipment rows are fully readable and retain the normal AXIS list presentation;
- real-photo rows show the intended thumbnail without disturbing the equipment name;
- `学习安排 / 云端与AI` visually share the native Settings columns;
- previously verified Group Plan behavior remains intact.

After that verification boundary, controlled AXIS 8.13 work may continue. Historical workout facts and current recording/media ownership remain authoritative.
